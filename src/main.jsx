import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { LightboxProvider } from './Lightbox.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LightboxProvider>
        <App />
      </LightboxProvider>
    </HashRouter>
  </StrictMode>,
)
