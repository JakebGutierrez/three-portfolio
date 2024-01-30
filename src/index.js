import { createRoot } from 'react-dom/client';
import { Suspense } from 'react';
import './styles.css';
import { App } from './App';

function Overlay() {
  return (
    <div className="footer">
      <a
        href="https://github.com/JakebGutierrez"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <img src="/assets/github.svg" alt="Github" />
      </a>
      <a href="mailto:mail@jakebgutierrez.com" className="icon">
        <img src="/assets/email.svg" alt="Email" />
      </a>
      <a
        href="https://www.linkedin.com/in/jakeb-gutierrez/"
        target="_blank"
        rel="noopener noreferrer"
        className="icon"
      >
        <img src="/assets/linkedin.svg" alt="Linkedin" />
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
  </>,
);
