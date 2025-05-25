import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (isLogin) {
      await supabase.auth.signInWithPassword({ email, password })
    } else {
      await supabase.auth.signUp({ email, password })
    }

    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto p-6 border rounded">
      <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
            onClick={loginWithGoogle}
            type="button"
            className="w-full p-2 bg-red-600 text-white rounded mt-4"
        >
            Login dengan Google
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-sm underline text-blue-500"
      >
        {isLogin ? 'Belum punya akun? Sign Up' : 'Sudah punya akun? Login'}
      </button>
    </div>
  )
}
