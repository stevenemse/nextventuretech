import 'server-only'

/**
 * Notification email d'une nouvelle demande de contact.
 *
 * Fournisseur : Resend (API HTTP, offre gratuite 100 mails/jour).
 * Sans domaine vérifié, Resend n'autorise l'envoi que depuis
 * `onboarding@resend.dev` **vers l'adresse du compte Resend** — c'est
 * exactement le cas d'usage : une alerte vers ta propre boîte.
 *
 * L'absence de clé n'est jamais bloquante : le formulaire fonctionne
 * toujours et la demande reste en base.
 */

export interface ContactNotificationInput {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  budget?: string | null
  message: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return ''
  return `<tr>
    <td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#0f172a;font-size:14px">${escapeHtml(value)}</td>
  </tr>`
}

export async function notifyNewContactRequest(
  input: ContactNotificationInput,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY absent — notification non envoyée.')
    return
  }

  const to = process.env.CONTACT_NOTIFICATION_EMAIL ?? 'steveemse@gmail.com'
  const from =
    process.env.CONTACT_FROM_EMAIL ?? 'NextVenture Tech <onboarding@resend.dev>'

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f1f5f9;padding:24px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2b5cf6;font-weight:700">Nouvelle demande</p>
    <h1 style="margin:0 0 20px;font-size:20px;color:#0f172a">${escapeHtml(input.name)}</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row('Email', input.email)}
      ${row('Téléphone', input.phone)}
      ${row('Entreprise', input.company)}
      ${row('Service', input.service)}
      ${row('Budget', input.budget)}
    </table>
    <div style="margin-top:20px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0">
      <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>
    <p style="margin:24px 0 0;font-size:13px">
      <a href="mailto:${escapeHtml(input.email)}" style="color:#2b5cf6">Répondre à ${escapeHtml(input.name)}</a>
      &nbsp;·&nbsp;
      <a href="https://nextventuretech.vercel.app/admin/demandes" style="color:#2b5cf6">Ouvrir le dashboard</a>
    </p>
  </div>
</body></html>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `Nouvelle demande — ${input.name}`,
        html,
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      console.error('[email] Resend a refusé l’envoi :', response.status, detail.slice(0, 300))
    }
  } catch (err) {
    console.error('[email] envoi impossible :', err)
  }
}
