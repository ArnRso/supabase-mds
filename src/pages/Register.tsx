import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await register(email, password, username)
      navigate('/')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <article style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>Créer un compte</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Pseudo
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} required minLength={3} />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </label>
        <button type="submit">S'inscrire</button>
      </form>
      <p style={{ marginTop: '1rem' }}>Déjà un compte ? <Link to="/login">Se connecter</Link></p>
    </article>
  )
}
