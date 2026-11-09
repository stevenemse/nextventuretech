import 'server-only'

import { createClient } from '@/lib/supabase/server'

const DAY_MS = 86_400_000

/** Ligne brute lue en base (pas d'IP : uniquement l'empreinte hachée). */
interface PageViewRow {
  path: string
  referrer: string | null
  device: string | null
  visitor_hash: string | null
  created_at: string
}

export interface DailyPoint {
  day: string
  label: string
  views: number
  visitors: number
}

export interface CountedItem {
  label: string
  views: number
}

export interface AnalyticsData {
  period: number
  views: number
  visitors: number
  today: number
  todayVisitors: number
  mobileShare: number
  daily: DailyPoint[]
  topPages: CountedItem[]
  referrers: CountedItem[]
  devices: CountedItem[]
  /** true si la migration 006 n'a pas encore été exécutée */
  missingTable: boolean
}

function emptyAnalytics(period: number, missingTable = false): AnalyticsData {
  return {
    period,
    views: 0,
    visitors: 0,
    today: 0,
    todayVisitors: 0,
    mobileShare: 0,
    daily: [],
    topPages: [],
    referrers: [],
    devices: [],
    missingTable,
  }
}

function dayLabel(isoDay: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${isoDay}T12:00:00Z`))
}

/** Ramène une URL de provenance à son domaine, ou « Accès direct ». */
function referrerSource(referrer: string | null): string {
  if (!referrer) return 'Accès direct'
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '')
    return host || 'Accès direct'
  } catch {
    return 'Inconnu'
  }
}

function topEntries(map: Map<string, number>, limit: number): CountedItem[] {
  return [...map.entries()]
    .map(([label, views]) => ({ label, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

/**
 * Agrège le trafic sur `period` jours (bornes à minuit, heure locale serveur).
 *
 * Le volume d'un site vitrine reste faible : on agrège en mémoire plutôt que
 * d'exposer des fonctions SQL. Au-delà de ~50 000 vues par période, il faudra
 * basculer sur des vues matérialisées.
 */
export async function getAnalytics(period: number): Promise<AnalyticsData> {
  const supabase = await createClient()

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setTime(start.getTime() - (period - 1) * DAY_MS)

  const { data, error } = await supabase
    .from('page_views')
    .select('path, referrer, device, visitor_hash, created_at')
    .gte('created_at', start.toISOString())
    .order('created_at', { ascending: false })
    .limit(50_000)

  if (error) {
    // Table absente → l'admin voit un état vide explicite, pas une page en erreur
    if (error.code === '42P01' || /does not exist/i.test(error.message)) {
      return emptyAnalytics(period, true)
    }
    throw new Error(`getAnalytics: ${error.message}`)
  }

  const rows = (data ?? []) as PageViewRow[]
  if (rows.length === 0) return emptyAnalytics(period)

  // Squelette de jours (même les jours sans trafic)
  const days = new Map<string, { views: number; visitors: Set<string> }>()
  for (let i = 0; i < period; i++) {
    const iso = new Date(start.getTime() + i * DAY_MS).toISOString().slice(0, 10)
    days.set(iso, { views: 0, visitors: new Set() })
  }

  const allVisitors = new Set<string>()
  const todayKey = new Date().toISOString().slice(0, 10)
  const todayVisitors = new Set<string>()
  let today = 0
  let mobile = 0

  const paths = new Map<string, number>()
  const sources = new Map<string, number>()
  const devices = new Map<string, number>()

  for (const row of rows) {
    const iso = row.created_at.slice(0, 10)
    const visitor = row.visitor_hash ?? ''

    const bucket = days.get(iso)
    if (bucket) {
      bucket.views += 1
      if (visitor) bucket.visitors.add(visitor)
    }

    if (visitor) allVisitors.add(visitor)
    if (iso === todayKey) {
      today += 1
      if (visitor) todayVisitors.add(visitor)
    }
    if (row.device === 'mobile') mobile += 1

    paths.set(row.path, (paths.get(row.path) ?? 0) + 1)
    const source = referrerSource(row.referrer)
    sources.set(source, (sources.get(source) ?? 0) + 1)
    const device = row.device ?? 'desktop'
    devices.set(device, (devices.get(device) ?? 0) + 1)
  }

  return {
    period,
    views: rows.length,
    visitors: allVisitors.size,
    today,
    todayVisitors: todayVisitors.size,
    mobileShare: rows.length > 0 ? Math.round((mobile / rows.length) * 100) : 0,
    daily: [...days.entries()].map(([day, value]) => ({
      day,
      label: dayLabel(day),
      views: value.views,
      visitors: value.visitors.size,
    })),
    topPages: topEntries(paths, 8),
    referrers: topEntries(sources, 5),
    devices: topEntries(devices, 3),
    missingTable: false,
  }
}
