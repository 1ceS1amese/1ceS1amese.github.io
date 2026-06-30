export function parseCommand(input: string): { raw: string; name: string; args: string[] } {
  const raw = input.trim()
  const parts = raw.match(/(?:[^\s"]+|"[^"]*")+/g) ?? []
  const cleaned = parts.map((p) => p.replace(/^"|"$/g, ''))
  return {
    raw,
    name: cleaned[0]?.toLowerCase() ?? '',
    args: cleaned.slice(1),
  }
}
