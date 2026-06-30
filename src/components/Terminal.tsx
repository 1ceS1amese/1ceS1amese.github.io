import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'antd'
import { parseCommand } from '../features/terminal/command-parser'
import { findCommand, getWelcomeMessage } from '../features/terminal/command-registry'
import type { CommandRecord, ListItem, TerminalOutputType } from '../features/terminal/command-types'

let idCounter = 0
function nextId() { return String(++idCounter) }

function makeRecord(
  input: string,
  outputType: TerminalOutputType,
  output: unknown,
  status: 'success' | 'error' = 'success',
): CommandRecord {
  return { id: nextId(), input, outputType, output, status }
}

// ── Output renderer ───────────────────────────────────────────────────────────
function OutputRenderer({ record }: { record: CommandRecord }) {
  const { outputType, output } = record

  if (outputType === 'error') {
    return <div className="output-error">{String(output)}</div>
  }
  if (outputType === 'system') {
    if (!output) return null
    return <div className="output-system">{String(output)}</div>
  }
  if (outputType === 'list') {
    const items = output as ListItem[]
    return (
      <div className="ls-grid">
        {items.map((item) => (
          <div key={item.name} className="ls-item">
            <span className={`ls-type-badge ${item.type === 'directory' ? 'ls-type-dir' : 'ls-type-file'}`}>
              {item.type === 'directory' ? 'dir' : 'file'}
            </span>
            <Tooltip title={item.description ?? ''} placement="right" arrow={false}>
              <span className={item.type === 'directory' ? 'ls-name-dir' : 'ls-name-file'}>
                {item.name}{item.type === 'directory' ? '/' : ''}
              </span>
            </Tooltip>
            {item.description && <span className="ls-desc">{item.description}</span>}
          </div>
        ))}
      </div>
    )
  }
  if (outputType === 'multiline') {
    const rows = output as { cmd: string; desc: string }[]
    return (
      <div className="help-table">
        {rows.map((row) => (
          <div key={row.cmd} className="help-row">
            <span className="help-cmd">{row.cmd}</span>
            <span className="help-desc">{row.desc}</span>
          </div>
        ))}
      </div>
    )
  }
  if (outputType === 'welcome') {
    const data = output as { banner: string[]; subtitle: string; tips: string[] }
    return (
      <div>
        <pre className="welcome-banner">{data.banner.join('\n')}</pre>
        <div className="welcome-subtitle">{data.subtitle}</div>
        <div className="welcome-tips">
          {data.tips.map((tip, i) => (
            <div key={i} className="welcome-tip">{tip}</div>
          ))}
        </div>
      </div>
    )
  }
  return <div className="output-text">{String(output)}</div>
}

// ── Prompt ────────────────────────────────────────────────────────────────────
function Prompt({ path }: { path: string }) {
  return (
    <span className="input-prompt">
      <span className="prompt-user">user</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">1ceS1amese</span>
      <span className="prompt-sep">:</span>
      <span className="prompt-path">{path}</span>
      <span className="prompt-dollar">$</span>
    </span>
  )
}

const QUICK_CMDS = ['help', 'ls', 'tree', 'open blog', 'open about', 'open contact']

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Terminal() {
  const navigate = useNavigate()

  const welcome = getWelcomeMessage()
  const [history, setHistory] = useState<CommandRecord[]>([
    makeRecord('', welcome.type as TerminalOutputType, welcome.content),
  ])
  const [currentPath, setCurrentPath] = useState('~')
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdHistIdx, setCmdHistIdx] = useState(-1)

  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' })
  }, [history])

  useEffect(() => { inputRef.current?.focus() }, [])

  const appendRecord = useCallback((r: CommandRecord) => {
    setHistory((prev) => [...prev, r])
  }, [])

  const executeInput = useCallback(async (raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setCmdHistory((prev) => [trimmed, ...prev.slice(0, 99)])
    setCmdHistIdx(-1)

    const parsed  = parseCommand(trimmed)
    const command = findCommand(parsed.name)

    if (!command) {
      appendRecord(makeRecord(trimmed, 'error',
        `command not found: ${parsed.name}. Type 'help' for available commands.`, 'error'))
      return
    }

    const context = {
      currentPath,
      setPath:      setCurrentPath,
      clearHistory: () => setHistory([]),
      navigate:     (url: string) => navigate(url),
      setTheme:     () => {},
    }

    const result = await command.execute(parsed.args, context)
    appendRecord(makeRecord(trimmed, result.type as TerminalOutputType, result.content, result.status ?? 'success'))
  }, [currentPath, navigate, appendRecord])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = input; setInput(''); executeInput(val); return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdHistIdx + 1, cmdHistory.length - 1)
      setCmdHistIdx(next); setInput(cmdHistory[next] ?? ''); return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(cmdHistIdx - 1, -1)
      setCmdHistIdx(next); setInput(next === -1 ? '' : (cmdHistory[next] ?? '')); return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const cands = ['help', 'ls', 'cd', 'pwd', 'cat', 'open', 'clear', 'tree', 'whoami', 'echo']
      const match = cands.find((c) => c.startsWith(input.toLowerCase()))
      if (match) setInput(match + ' ')
    }
  }

  return (
    <div className="terminal-bg" onClick={() => inputRef.current?.focus()}>
      {/* ── Terminal Window Card ── */}
      <div className="terminal-window" onClick={(e) => e.stopPropagation()}>

        {/* Title Bar */}
        <div className="terminal-titlebar">
          <div className="titlebar-dots">
            <div className="titlebar-dot dot-red" />
            <div className="titlebar-dot dot-yellow" />
            <div className="titlebar-dot dot-green" />
          </div>
          <span className="titlebar-logo">
            <span className="logo-cursor">&gt;_</span>
            <span className="logo-name">1ceS1amese</span>
            <span className="logo-version">v0.1.0</span>
          </span>
          <nav className="titlebar-nav">
            {([['about', '/about'], ['blog', 'https://blog.1ces1amese.cn/'], ['contact', '/contact']] as [string, string][]).map(
              ([label, route]) => {
                const isExternal = route.startsWith('http')
                return (
                  <button key={label} className="titlebar-nav-btn"
                    onClick={() => isExternal ? window.open(route, '_blank', 'noopener,noreferrer') : navigate(route)}>
                    {label}
                  </button>
                )
              }
            )}
          </nav>
        </div>

        {/* Output */}
        <div className="terminal-output" ref={outputRef}>
          {history.map((record) => (
            <div key={record.id} className="terminal-entry">
              {record.input && (
                <div className="terminal-prompt-line">
                  <Prompt path={currentPath} />
                  <span className="prompt-input-text">{record.input}</span>
                </div>
              )}
              <OutputRenderer record={record} />
            </div>
          ))}
          <div style={{ height: 6 }} />
        </div>

        {/* Quick Commands */}
        <div className="terminal-quickbar">
          {QUICK_CMDS.map((cmd) => (
            <button key={cmd} className="quick-tag"
              onClick={() => executeInput(cmd)}>{cmd}</button>
          ))}
        </div>

        {/* Input */}
        <div className="terminal-input-area">
          <Prompt path={currentPath} />
          <input
            ref={inputRef}
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type a command..."
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  )
}
