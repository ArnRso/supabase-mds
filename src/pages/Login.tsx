import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    try {
      login(username, password)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  function handleRegister() {
    try {
      register(username, password)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <article style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Nom d'utilisateur
          <input value={username} onChange={e => setUsername(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit">Se connecter</button>
          <button type="button" className="secondary" onClick={handleRegister}>S'inscrire</button>
        </div>
      </form>
    </article>
  )
}
