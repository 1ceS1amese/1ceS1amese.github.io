import { useNavigate } from 'react-router-dom'
import '../styles/terminal.css'

const MEMBERS = [
  {
    handle: '1ceS1amese',
    name: '1ceS1amese',
    role: 'Developer · Writer · Maintainer',
    skills: ['React', 'TypeScript', 'Go', 'Open Source'],
    bio: 'Building things, writing notes, tinkering with ideas. This is my personal corner of the internet.',
  },
]

export default function MembersPage() {
  const navigate = useNavigate()
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-breadcrumb">
          <span className="breadcrumb-root" onClick={() => navigate('/')}>~</span>
          <span className="breadcrumb-sep"> / </span>
          <span className="breadcrumb-cur">members/</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>← cd ~</button>
      </div>
      <div className="page-content">
        <h1 className="page-section-title">Members</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {MEMBERS.map((m) => (
            <div key={m.handle} className="term-card">
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span className="term-card-title" style={{ fontSize: 16 }}>{m.name}</span>
                <span style={{ color: '#AAAAAA', fontSize: 12 }}>@{m.handle}</span>
              </div>
              <div className="term-card-meta">{m.role}</div>
              <div className="term-card-body" style={{ marginBottom: 12 }}>{m.bio}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {m.skills.map((s) => (
                  <span key={s} className="term-tag">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
