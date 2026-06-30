import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme as antTheme } from 'antd'
import Terminal from './components/Terminal'
import AboutPage from './pages/AboutPage'
import MembersPage from './pages/MembersPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import './styles/terminal.css'

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: antTheme.defaultAlgorithm,
        token: {
          colorText:            '#2C2C2C',
          colorPrimary:         '#52C41A',
          colorSuccess:         '#51CF66',
          colorWarning:         '#FFD93D',
          colorError:           '#FA5252',
          colorInfo:            '#4DABF7',
          colorBorder:          '#2C2C2C',
          colorBorderSecondary: '#2C2C2C',
          lineWidth:            2,
          borderRadius:         12,
          borderRadiusLG:       16,
          borderRadiusSM:       8,
          controlHeight:        40,
          controlHeightSM:      34,
          controlHeightLG:      48,
          colorBgBase:          '#FFF9F0',
          colorBgContainer:     '#FFFFFF',
          fontFamily:           "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontSize:             14,
        },
        components: {
          Button: {
            primaryShadow: 'none',
            dangerShadow:  'none',
            defaultShadow: 'none',
            fontWeight:    700,
          },
          Tag: {
            defaultBg: '#FFFFFF',
          },
          Card: {
            colorBgContainer: '#FFF0F6',
          },
        },
      }}
    >
      <HashRouter>
        <Routes>
          <Route path="/"         element={<Terminal />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/members"  element={<MembersPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact"  element={<ContactPage />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ConfigProvider>
  )
}
