import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header>
      <nav className="container">
        <ul>
          <li><strong><Link to="/">MonApp</Link></strong></li>
        </ul>
        <ul>
          <li><Link to="/articles">Articles</Link></li>
          {user ? (
            <>
              <li><span>{user.username}</span></li>
              <li><a href="#" onClick={e => { e.preventDefault(); logout() }}>Déconnexion</a></li>
            </>
          ) : (
            <li><Link to="/login">Connexion</Link></li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
