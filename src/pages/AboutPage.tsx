import { useNavigate } from 'react-router-dom'
import { Space } from 'antd'
import '../styles/terminal.css'

export default function AboutPage() {
  const navigate = useNavigate()
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-breadcrumb">
          <span className="breadcrumb-root" onClick={() => navigate('/')}>~</span>
          <span className="breadcrumb-sep"> / </span>
          <span className="breadcrumb-cur">about.md</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>← cd ~</button>
      </div>
      <div className="page-content">
        <h1 className="page-section-title">About</h1>

        <div className="term-card" style={{ marginBottom: 24 }}>
          <div className="term-card-title" style={{ fontSize: 18 }}>Hi, I'm 1ceS1amese.</div>
          <div className="term-card-meta">Software Engineering Student · SU Member</div>
          <div className="term-card-body">
            Studying Software Engineering. Interested in AI, cryptography, and network security.
            SU member.
          </div>
        </div>

        <h2 className="page-section-title" style={{ fontSize: 15, marginBottom: 16 }}>What I Do</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'AI',              desc: 'Machine Learning · LLM · Agents' },
            { label: 'Cryptography',    desc: 'Algorithms · Protocols · Applied Crypto' },
            { label: 'Network Security',desc: 'CTF · Pentesting · Vulnerability Research' },
            { label: 'Software Eng.',   desc: 'Systems · Tooling · Open Source' },
          ].map((item) => (
            <div key={item.label} className="term-card">
              <div className="term-card-title">{item.label}</div>
              <div className="term-card-meta">{item.desc}</div>
            </div>
          ))}
        </div>

        <h2 className="page-section-title" style={{ fontSize: 15, marginBottom: 12 }}>Tech Stack</h2>
        <Space wrap>
          {['React', 'TypeScript', 'Node.js', 'Go', 'Python', 'Linux', 'Docker', 'Vite', 'Neovim', 'Git'].map((t) => (
            <span key={t} className="term-tag">{t}</span>
          ))}
        </Space>
      </div>
    </div>
  )
}
