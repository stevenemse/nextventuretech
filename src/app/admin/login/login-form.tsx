'use client'

import { useActionState } from 'react'
import { signInAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { initialActionState } from '@/types/actions'

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, initialActionState)

  return (
    <form action={action} className="flex flex-col gap-4">
      {state.status === 'error' && state.message && (
        <Alert variant="error">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" required>Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@exemple.com"
          required
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password" required>Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          disabled={pending}
        />
      </div>

      <Button type="submit" loading={pending} className="mt-2 w-full">
        Se connecter
      </Button>
    </form>
  )
}
