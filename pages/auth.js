import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
  
    let result
    if (isLogin) {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }
  
    const { error } = result
    if (error) alert(error.message)
  
    setLoading(false)
  }  

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) alert(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6 border rounded shadow">
        <h1 className="text-xl font-bold text-center">
          {isLogin ? 'Login' : 'Daftar Akun'}
        </h1>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 underline"
          >
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
          </button>
        </div>

        <hr className="border-t" />

        <button
          onClick={loginWithGoogle}
          className="w-full p-2 bg-red-600 text-white rounded"
        >
          Login dengan Google
        </button>
      </div>
    </div>
  )
}
