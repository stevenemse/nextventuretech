'use client'

import { useActionState } from 'react'
import { submitContactForm } from '@/app/actions/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { initialActionState } from '@/types/actions'
import type { ActionResult } from '@/types/actions'
import type { ContactActionData } from '@/app/actions/contact'
import type { Service } from '@/types/database'
import { useLang } from '@/lib/i18n/context'

interface Props {
  services: Pick<Service, 'id' | 'title'>[]
  /** Service préselectionné (venant de /services ou /tarifs ?service=…) */
  presetService?: string
  /** Plan tarifaire préselectionné (venant de /tarifs ?plan=…) */
  presetPlan?: string
}

export function ContactForm({ services, presetService, presetPlan }: Props) {
  const { t } = useLang()
  const [state, action, pending] = useActionState<ActionResult<ContactActionData>, FormData>(
    submitContactForm,
    initialActionState,
  )

  // Succès — afficher le bouton WhatsApp
  if (state.status === 'success' && state.data) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{t.contactForm.successTitle}</h3>
        <p className="text-slate-600 mb-8">{state.message}</p>
        <div className="flex flex-col items-center gap-3">
          <a
            href={state.data.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
            {t.contactForm.continueWa}
          </a>
          <p className="text-xs text-slate-400">{t.contactForm.fasterReply}</p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Honeypot anti-bot : champ invisible pour les humains, rempli par les bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Site web (ne pas remplir)</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" required>{t.contactForm.name}</Label>
          <Input id="name" name="name" placeholder={t.contactForm.namePlaceholder} required
            error={state.status === 'error' ? state.fieldErrors?.['name']?.[0] : undefined} />
          {state.status === 'error' && state.fieldErrors?.['name']?.[0] && (
            <p className="text-xs text-red-500">{state.fieldErrors['name'][0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" required>{t.contactForm.email}</Label>
          <Input id="email" name="email" type="email" placeholder={t.contactForm.emailPlaceholder} required
            error={state.status === 'error' ? state.fieldErrors?.['email']?.[0] : undefined} />
          {state.status === 'error' && state.fieldErrors?.['email']?.[0] && (
            <p className="text-xs text-red-500">{state.fieldErrors['email'][0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">{t.contactForm.phone}</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+237 6 XX XX XX XX" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">{t.contactForm.company}</Label>
          <Input id="company" name="company" placeholder={t.contactForm.companyPlaceholder} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="service_id">{t.contactForm.service}</Label>
          <select
            id="service_id" name="service_id"
            defaultValue={
              // Préselection via ?service=… (titre du service) — on peut aussi passer l'ID directement
              services.find((s) => s.title === presetService)?.id ?? ''
            }
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t.contactForm.chooseService}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="budget">{t.contactForm.budget}</Label>
          <Input id="budget" name="budget" placeholder={t.contactForm.budgetPlaceholder} defaultValue={presetPlan ?? ''} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message" required>{t.contactForm.message}</Label>
        <Textarea
          id="message" name="message" rows={5}
          placeholder={t.contactForm.messagePlaceholder}
          required
          defaultValue={presetPlan ? t.contactForm.presetMessage(presetPlan) : ''}
          error={state.status === 'error' ? state.fieldErrors?.['message']?.[0] : undefined}
        />
        {state.status === 'error' && state.fieldErrors?.['message']?.[0] && (
          <p className="text-xs text-red-500">{state.fieldErrors['message'][0]}</p>
        )}
      </div>

      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        {t.contactForm.submit}
      </Button>
    </form>
  )
}
