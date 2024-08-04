import { Poppins } from 'next/font/google'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LoginButton } from '@/components/auth/login-button'

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
})

export default function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <div className='space-y-6'>
        <h1
          className={cn(
            'font-semibold text-6xl text-white drop-shadow-md',
            font.className,
          )}
        >
          🔐 Auth
        </h1>

        <p className='text-lg text-white'>Um simples serviço de autenticação</p>

        <LoginButton>
          <Button variant='secondary' size='lg'>
            Sign in
          </Button>
        </LoginButton>
      </div>
    </main>
  )
}
