// 命令输出类型
export type TerminalOutputType = 'text' | 'error' | 'list' | 'system' | 'welcome' | 'multiline'

// 列表项（ls 命令输出）
export type ListItem = {
  name: string
  type: 'file' | 'directory'
  description?: string
}

// 命令历史记录
export type CommandRecord = {
  id: string
  input: string
  outputType: TerminalOutputType
  output: unknown
  status: 'success' | 'error'
}

// 命令执行上下文
export type CommandContext = {
  currentPath: string
  setPath: (path: string) => void
  clearHistory: () => void
  navigate: (url: string) => void
  setTheme: (theme: string) => void
}

// 命令执行结果
export type CommandResult = {
  type: TerminalOutputType
  content: unknown
  status?: 'success' | 'error'
}

// 命令定义
export type TerminalCommand = {
  name: string
  aliases?: string[]
  description: string
  usage: string
  execute: (args: string[], context: CommandContext) => CommandResult | Promise<CommandResult>
}
