import { createRoot } from 'react-dom/client'
import { Suspense } from 'react'
import './styles.css'
import { App } from './App'

function Overlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <a href="https://github.com/JakebGutierrez" target="_blank" rel="noopener noreferrer" className="icon" style={{ position: 'absolute', bottom: 40, right: 150 }}>
        <img src="/github_icon.svg" alt="GitHub" width="20" />
      </a>
      <a href="mailto:mail@jakebgutierrez.com" className="icon" style={{ position: 'absolute', bottom: 40, right: 260 }}>
        <img src="/mail_icon.svg" alt="Email" width="20" />
      </a>
      <a href="https://www.linkedin.com/in/jakeb-gutierrez/" target="_blank" rel="noopener noreferrer" className="icon" style={{ position: 'absolute', bottom: 40, right: 370 }}>
        <img src="/linkedin_icon.svg" alt="Linkedin" width="20" />
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
