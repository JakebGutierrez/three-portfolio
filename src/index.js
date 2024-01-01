import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './styles.css'
import { App } from './App'

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: 40, right: 415 }}>
        <img src="/path_to_github_icon.svg" alt="About" width="20" />
      </a>
      <a href="https://github.com/your_username" target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', bottom: 40, right: 85 }}>
        <img src="/path_to_github_icon.svg" alt="GitHub" width="20" />
      </a>
      <a href="mailto:your_email@example.com" style={{ position: 'absolute', bottom: 40, right: 200 }}>
        <img src="/path_to_email_icon.svg" alt="Email" width="20" />
      </a>
      <a href="linkedin.com" style={{ position: 'absolute', bottom: 40, right: 300 }}>
        <img src="/path_to_linkedin_icon.svg" alt="Linkedin" width="20" />
      </a>
    </div>
  );
}



createRoot(document.getElementById('root')).render(
  <>
    <Suspense fallback={null}>
      <App />
    </Suspense>
    <Overlay />
  </>
)
