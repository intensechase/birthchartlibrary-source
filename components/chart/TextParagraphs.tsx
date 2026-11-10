interface Props {
  html: string
  className: string
}

export default function TextParagraphs({ html, className }: Props) {
  const normalized = html.replace(/\r\n/g, '\n')
  let paragraphs: string[]

  if (normalized.includes('\n\n')) {
    paragraphs = normalized.split(/\n\n+/).map(p => p.trim()).filter(Boolean)
  } else {
    const sentences = normalized.split(/(?<=\.)\s+/)
    paragraphs = []
    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(' '))
    }
  }

  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className={className} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </div>
  )
}
