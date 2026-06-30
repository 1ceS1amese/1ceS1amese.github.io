import { useNavigate } from 'react-router-dom'
import '../styles/terminal.css'

const PROJECTS = [
  {
    name: 'terminal-site',
    status: 'active',
    year: '2024',
    desc: 'This site. A brutalist terminal-style personal hub built with React + Ant Design.',
    tags: ['React', 'TypeScript', 'Ant Design', 'Vite'],
    url: '#',
  },
  {
    name: 'project-alpha',
    status: 'active',
    year: '2024',
    desc: 'Placeholder for your next big project. Replace with real content.',
    tags: ['Go', 'CLI', 'Open Source'],
    url: 'https://github.com/username',
  },
  {
    name: 'project-beta',
    status: 'wip',
    year: '2024',
    desc: 'Work in progress. Something cool is being built here.',
    tags: ['Python', 'ML', 'Research'],
    url: '#',
  },
  {
    name: 'archive',
    status: 'archived',
    year: '2023',
    desc: 'Past work and experiments. Kept for reference.',
    tags: ['Various'],
    url: '#',
  },
]

const STATUS_COLOR: Record<string, string> = {
  active:   '#52C41A',
  wip:      '#FFD93D',
  archived: '#AAAAAA',
}
const STATUS_LABEL: Record<string, string> = {
  active:   '● active',
  wip:      '◐ wip',
  archived: '○ archived',
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-breadcrumb">
          <span className="breadcrumb-root" onClick={() => navigate('/')}>~</span>
          <span className="breadcrumb-sep"> / </span>
          <span className="breadcrumb-cur">projects/</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/')}>← cd ~</button>
      </div>
      <div className="page-content">
        <h1 className="page-section-title">Projects</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PROJECTS.map((p) => (
            <div key={p.name} className="term-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span className="term-card-title">{p.name}</span>
                <span style={{ fontSize: 11, color: STATUS_COLOR[p.status], fontWeight: 600 }}>
                  {STATUS_LABEL[p.status]}
                </span>
                <span style={{ fontSize: 11, color: '#AAAAAA', marginLeft: 'auto' }}>{p.year}</span>
              </div>
              <div className="term-card-body" style={{ marginBottom: 12 }}>{p.desc}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.tags.map((t) => (
                  <span key={t} className="term-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
