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

interface Props {
  services: Pick<Service, 'id' | 'title'>[]
}

export function ContactForm({ services }: Props) {
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">Demande envoyée !</h3>
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
            Continuer sur WhatsApp
          </a>
          <p className="text-xs text-slate-400">Pour une réponse encore plus rapide</p>
        </div>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.status === 'error' && state.message && (
        <Alert variant="error"><AlertDescription>{state.message}</AlertDescription></Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" required>Nom complet</Label>
          <Input id="name" name="name" placeholder="Jean Dupont" required
            error={state.status === 'error' ? state.fieldErrors?.['name']?.[0] : undefined} />
          {state.status === 'error' && state.fieldErrors?.['name']?.[0] && (
            <p className="text-xs text-red-500">{state.fieldErrors['name'][0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" required>Email</Label>
          <Input id="email" name="email" type="email" placeholder="jean@exemple.com" required
            error={state.status === 'error' ? state.fieldErrors?.['email']?.[0] : undefined} />
          {state.status === 'error' && state.fieldErrors?.['email']?.[0] && (
            <p className="text-xs text-red-500">{state.fieldErrors['email'][0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+237 6 XX XX XX XX" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="company">Entreprise</Label>
          <Input id="company" name="company" placeholder="Votre société" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="service_id">Service souhaité</Label>
          <select
            id="service_id" name="service_id"
            className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Choisir un service —</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="budget">Budget estimé</Label>
          <Input id="budget" name="budget" placeholder="Ex: 150 000 – 300 000 FCFA" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message" required>Message</Label>
        <Textarea
          id="message" name="message" rows={5}
          placeholder="Décrivez votre projet, vos objectifs, vos délais…"
          required
          error={state.status === 'error' ? state.fieldErrors?.['message']?.[0] : undefined}
        />
        {state.status === 'error' && state.fieldErrors?.['message']?.[0] && (
          <p className="text-xs text-red-500">{state.fieldErrors['message'][0]}</p>
        )}
      </div>

      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        Envoyer ma demande
      </Button>
    </form>
  )
}
