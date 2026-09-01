'use client'

import { useActionState } from 'react'
import { updateSiteSettingsAction } from '@/app/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { initialActionState } from '@/types/actions'
import type { SiteSettings } from '@/types/database'
import type { ActionResult } from '@/types/actions'

interface Props { settings?: SiteSettings }

export function SettingsForm({ settings }: Props) {
  const [state, formAction, pending] = useActionState<ActionResult<SiteSettings>, FormData>(
    updateSiteSettingsAction, initialActionState,
  )
  const fe = state.status === 'error' ? (state.fieldErrors ?? {}) : {}
  const s = settings?.social_links ?? {}

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}
      {state.status === 'success' && (
        <Alert variant="success"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      {/* Identité */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Identité</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="site_name" required>Nom du site</Label>
            <Input id="site_name" name="site_name" defaultValue={settings?.site_name ?? 'NextVenture Tech'} required error={fe['site_name']?.[0]} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="logo_url">URL du logo</Label>
            <Input id="logo_url" name="logo_url" type="url" defaultValue={settings?.logo_url ?? ''} placeholder="https://…" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="favicon_url">URL du favicon</Label>
            <Input id="favicon_url" name="favicon_url" type="url" defaultValue={settings?.favicon_url ?? ''} placeholder="https://…" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Contact</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={settings?.whatsapp ?? ''} placeholder="+237686033789" error={fe['whatsapp']?.[0]} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings?.email ?? ''} error={fe['email']?.[0]} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" defaultValue={settings?.phone ?? ''} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="calendly_url">URL Calendly</Label>
            <Input id="calendly_url" name="calendly_url" type="url" defaultValue={settings?.calendly_url ?? ''} placeholder="https://calendly.com/…" error={fe['calendly_url']?.[0]} />
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 uppercase tracking-wide">Réseaux sociaux</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['facebook', 'instagram', 'linkedin', 'twitter'] as const).map((net) => (
            <div key={net} className="flex flex-col gap-1.5">
              <Label htmlFor={net} className="capitalize">{net}</Label>
              <Input id={net} name={net} type="url" defaultValue={(s as Record<string, string>)[net] ?? ''} placeholder={`https://${net}.com/…`} />
            </div>
          ))}
        </div>
      </section>

      <div>
        <Button type="submit" loading={pending}>Enregistrer les paramètres</Button>
      </div>
    </form>
  )
}
