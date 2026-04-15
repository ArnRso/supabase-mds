import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticleDetail from './pages/ArticleDetail'
import ArticleForm from './pages/ArticleForm'
import Login from './pages/Login'

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/articles/new" element={
            <ProtectedRoute><ArticleForm /></ProtectedRoute>
          } />
          <Route path="/articles/:id/edit" element={
            <ProtectedRoute><ArticleForm /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
