'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Registrácia úspešná! Skontroluj si email pre potvrdenie.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-2xl font-bold mb-6 text-white">{isSignUp ? 'Registrácia' : 'Prihlásenie do STREAMX'}</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
              required 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Heslo</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
            {isSignUp ? 'Zaregistrovať sa' : 'Prihlásiť sa'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isSignUp ? 'Už máš účet?' : 'Ešte nemáš účet?'} {' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-red-500 hover:underline font-semibold">
            {isSignUp ? 'Prihlás sa' : 'Zaregistruj sa'}
          </button>
        </p>
      </div>
    </div>
  )
}