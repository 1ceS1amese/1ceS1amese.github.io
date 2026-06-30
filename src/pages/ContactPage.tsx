import { useNavigate } from 'react-router-dom'
import '../styles/terminal.css'

const LINKS = [
  { label: 'Email',  value: '279113044@qq.com',             href: 'mailto:279113044@qq.com' },
  { label: 'GitHub', value: 'github.com/1ceS1amese',        href: 'https://github.com/1ceS1amese' },
]

export default function ContactPage() {
  const navigate = useNavigate()
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-breadcrumb">
          <span className="breadcrumb-root" onClick={() => navigate('/')}>~</span>
          <span className="breadcrumb-sep"> / </span>
          <span className="breadcrumb-cur">contact.md</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>← cd ~</button>
      </div>
      <div className="page-content">
        <h1 className="page-section-title">Contact</h1>

        <div className="term-card" style={{ marginBottom: 24 }}>
          {LINKS.map((l) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
              <span style={{ minWidth: 68, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#AAAAAA' }}>
                {l.label}
              </span>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#52C41A', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
              >
                {l.value}
              </a>
            </div>
          ))}
        </div>

        <div className="term-card">
          <div className="term-card-title" style={{ marginBottom: 10 }}>PGP Public Key</div>
          <pre style={{
            fontFamily: 'var(--font)',
            fontSize: 11,
            color: '#AAAAAA',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
{`-----BEGIN PGP PUBLIC KEY BLOCK-----

(Replace with your real PGP public key)

-----END PGP PUBLIC KEY BLOCK-----`}
          </pre>
        </div>
      </div>
    </div>
  )
}
