export type VirtualNode = {
  name: string
  type: 'file' | 'directory'
  path: string
  route?: string
  description?: string
  content?: string
  children?: VirtualNode[]
}

export const virtualFileSystem: VirtualNode = {
  name: '~',
  type: 'directory',
  path: '~',
  description: '主目录',
  children: [
    {
      name: 'about.md',
      type: 'file',
      path: '~/about.md',
      route: '/about',
      description: '关于我',
      content: `# About

Hi, I'm 1ceS1amese.

Software Engineering student.
Interested in AI, cryptography, and network security.
SU member.

type 'open about' for the full page.`,
    },
    {
      name: 'blog',
      type: 'directory',
      path: '~/blog',
      description: '技术博客',
      children: [
        {
          name: 'README.md',
          type: 'file',
          path: '~/blog/README.md',
          description: '博客入口',
          content: `# Blog

Personal writing on dev, tools, and ideas.

type 'open blog' to visit.`,
        },
      ],
    },
    {
      name: 'projects',
      type: 'directory',
      path: '~/projects',
      route: '/projects',
      description: '项目展示',
      children: [
        {
          name: 'terminal-site.md',
          type: 'file',
          path: '~/projects/terminal-site.md',
          description: '本站',
          content: `# terminal-site

This site.

Stack : React + TypeScript + Ant Design + Vite
Style : Illustration / brutalist flat
Status: live`,
        },
      ],
    },
    {
      name: 'notes',
      type: 'directory',
      path: '~/notes',
      description: '个人笔记',
      children: [
        {
          name: 'README.md',
          type: 'file',
          path: '~/notes/README.md',
          description: '笔记库',
          content: `# Notes

A collection of notes on various topics.

type 'open notes' to visit.`,
        },
      ],
    },
    {
      name: 'contact.md',
      type: 'file',
      path: '~/contact.md',
      route: '/contact',
      description: '联系方式',
      content: `# Contact

Email  : 279113044@qq.com
GitHub : github.com/1ceS1amese`,
    },
  ],
}

export function getNodeByPath(path: string): VirtualNode | null {
  const normalized = path.replace(/\/$/, '')
  if (normalized === '~') return virtualFileSystem
  if (!normalized.startsWith('~/')) return null
  const parts = normalized.slice(2).split('/')
  let current: VirtualNode = virtualFileSystem
  for (const part of parts) {
    const child = current.children?.find((c) => c.name === part)
    if (!child) return null
    current = child
  }
  return current
}

export function listDirectory(path: string): VirtualNode[] {
  const node = getNodeByPath(path)
  if (!node || node.type !== 'directory') return []
  return node.children ?? []
}

export function resolvePath(current: string, target: string): string {
  if (target === '~' || target === '') return '~'
  if (target === '..') {
    if (current === '~') return '~'
    const parts = current.split('/')
    parts.pop()
    return parts.join('/') || '~'
  }
  if (target.startsWith('~/')) return target
  return `${current}/${target}`
}
