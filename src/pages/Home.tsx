import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Bienvenue sur MonApp</h1>
      <p>Une démo CRUD avec React et Supabase.</p>
      <Link to="/articles" role="button">Voir les articles</Link>
    </div>
  )
}
