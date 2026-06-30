import type { TerminalCommand, CommandResult, ListItem } from './command-types'
import {
  virtualFileSystem,
  listDirectory,
  getNodeByPath,
  resolvePath,
} from './virtual-file-system'

// Hub cards — empty, routes kept as terminal commands only
export const HUB_LINKS: { name: string; desc: string; url: string; external: boolean }[] = []

type Destination =
  | { type: 'route'; path: string }
  | { type: 'external'; url: string }

const DESTINATIONS: Record<string, Destination> = {
  about:    { type: 'route',    path: '/about' },
  projects: { type: 'route',    path: '/projects' },   // kept, not displayed
  members:  { type: 'route',    path: '/members' },    // kept, not displayed
  contact:  { type: 'route',    path: '/contact' },
  blog:     { type: 'external', url: 'https://blog.1ces1amese.cn/' },
}

export const commandRegistry: TerminalCommand[] = [
  {
    name: 'help',
    description: '显示所有可用命令',
    usage: 'help',
    execute: () => ({
      type: 'multiline',
      content: commandRegistry.map((c) => ({
        cmd:  c.usage.padEnd(22),
        desc: c.description,
      })),
    }),
  },

  {
    name: 'ls',
    aliases: ['dir'],
    description: '列出当前或指定目录内容',
    usage: 'ls [path]',
    execute: (args, context) => {
      const targetPath = args[0]
        ? resolvePath(context.currentPath, args[0])
        : context.currentPath
      const items = listDirectory(targetPath)
      if (items.length === 0) {
        const node = getNodeByPath(targetPath)
        if (!node)                return { type: 'error', content: `ls: ${targetPath}: No such directory`, status: 'error' }
        if (node.type === 'file') return { type: 'error', content: `ls: ${targetPath}: Not a directory`,  status: 'error' }
        return { type: 'text', content: '(empty directory)' }
      }
      const list: ListItem[] = items.map((n) => ({
        name: n.name, type: n.type, description: n.description,
      }))
      return { type: 'list', content: list }
    },
  },

  {
    name: 'cd',
    description: '切换虚拟目录',
    usage: 'cd <path>',
    execute: (args, context) => {
      const target  = args[0] ?? '~'
      const newPath = resolvePath(context.currentPath, target)
      const node    = getNodeByPath(newPath)
      if (!node)                return { type: 'error', content: `cd: ${target}: No such directory`, status: 'error' }
      if (node.type === 'file') return { type: 'error', content: `cd: ${target}: Not a directory`,  status: 'error' }
      context.setPath(newPath)
      return { type: 'system', content: `→ ${newPath}` }
    },
  },

  {
    name: 'pwd',
    description: '显示当前虚拟路径',
    usage: 'pwd',
    execute: (_args, context) => ({ type: 'text', content: context.currentPath }),
  },

  {
    name: 'cat',
    description: '查看文件内容',
    usage: 'cat <file>',
    execute: (args, context) => {
      if (!args[0]) return { type: 'error', content: 'cat: missing operand', status: 'error' }
      const filePath = resolvePath(context.currentPath, args[0])
      const node     = getNodeByPath(filePath)
      if (!node)                    return { type: 'error', content: `cat: ${args[0]}: No such file`,  status: 'error' }
      if (node.type === 'directory') return { type: 'error', content: `cat: ${args[0]}: Is a directory`, status: 'error' }
      return { type: 'text', content: node.content ?? '(empty file)' }
    },
  },

  {
    name: 'open',
    aliases: ['goto', 'visit'],
    description: '打开页面或外部站点',
    usage: 'open <name>',
    execute: (args, context) => {
      const name = args[0]?.toLowerCase()
      if (!name) {
        const keys = Object.keys(DESTINATIONS).join(', ')
        return { type: 'text', content: `Available: ${keys}` }
      }
      const dest = DESTINATIONS[name]
      if (!dest) {
        const keys = Object.keys(DESTINATIONS).join(', ')
        return {
          type: 'error',
          content: `open: unknown destination "${name}". Available: ${keys}`,
          status: 'error',
        }
      }
      if (dest.type === 'external') {
        window.open(dest.url, '_blank', 'noopener,noreferrer')
        return { type: 'system', content: `Opening ${name} in new tab...` }
      }
      context.navigate(dest.path)
      return { type: 'system', content: `Navigating to ${name}...` }
    },
  },

  {
    name: 'clear',
    aliases: ['cls'],
    description: '清空终端输出',
    usage: 'clear',
    execute: (_args, context) => {
      context.clearHistory()
      return { type: 'system', content: '' }
    },
  },

  {
    name: 'whoami',
    description: '显示当前用户',
    usage: 'whoami',
    execute: () => ({
      type: 'text',
      content: 'guest@1ceS1amese — visitor',
    }),
  },

  {
    name: 'echo',
    description: '输出文本',
    usage: 'echo <text>',
    execute: (args) => ({ type: 'text', content: args.join(' ') }),
  },

  {
    name: 'tree',
    description: '显示虚拟文件系统结构',
    usage: 'tree',
    execute: () => {
      function buildTree(node: typeof virtualFileSystem, prefix: string): string[] {
        const lines: string[] = []
        const children = node.children ?? []
        children.forEach((child, idx) => {
          const isLast      = idx === children.length - 1
          const connector   = isLast ? '└── ' : '├── '
          const childPrefix = isLast ? '    ' : '│   '
          lines.push(`${prefix}${connector}${child.name}${child.type === 'directory' ? '/' : ''}`)
          if (child.children) lines.push(...buildTree(child, prefix + childPrefix))
        })
        return lines
      }
      const lines = ['~/', ...buildTree(virtualFileSystem, '')]
      return { type: 'text', content: lines.join('\n') }
    },
  },

  {
    name: 'links',
    description: '列出所有外部站点链接',
    usage: 'links',
    execute: () => ({
      type: 'multiline',
      content: HUB_LINKS.map((l) => ({
        cmd:  l.name.padEnd(12),
        desc: `${l.desc}  ${l.url}`,
      })),
    }),
  },
]

export function findCommand(name: string): TerminalCommand | undefined {
  return commandRegistry.find(
    (cmd) => cmd.name === name || cmd.aliases?.includes(name),
  )
}

export function getWelcomeMessage(): CommandResult {
  return {
    type: 'welcome',
    content: {
      banner: [
        '  _  ____  ____ ____  _  __  __  __  ____ ____',
        ' / |/ ___||  __| ___|| |/  \\|  \\/  ||  __| ___/',
        '| | | |__ | |_ \\___ \\| || () | |\\/| || |_ \\___ \\',
        '| | |___ \\|  _| ___) | ||  __/| |  | ||  _| ___) |',
        '| |  ___) | |__ ___/ /| || |   | |  | || |__ ___/ /',
        '|_| |____/|____|____/ |_||_|   |_|  |_||____|____/',
      ],
      subtitle: '1ceS1amese v0.1.0  —  個人の世界',
      tips: [
        "type 'help' for available commands.",
        "type 'ls' to explore the virtual filesystem.",
        "type 'open <name>' to navigate: about, blog, contact.",
      ],
    },
  }
}
