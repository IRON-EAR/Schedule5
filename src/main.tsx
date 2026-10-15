import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/Firebase/AuthContext.tsx'
import { FirebaseProvider } from './hooks/Firebase/FirebaseContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FirebaseProvider>
        <App />
      </FirebaseProvider>
    </AuthProvider>
  </StrictMode>,
)
