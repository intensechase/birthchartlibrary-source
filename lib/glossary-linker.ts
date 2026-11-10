import { glossary } from './glossary'

// Terms sorted by length (longest first) to avoid partial matches
const LINKABLE_TERMS = glossary
  .filter(g => g.link)
  .sort((a, b) => b.term.length - a.term.length)

/**
 * Wraps glossary terms in interpretation text with <a> tags linking to their glossary page.
 * Only links the first occurrence of each term per text block.
 * Max 3 links per block to keep text readable.
 */
export function linkGlossaryTerms(text: string): string {
  let linked = 0
  let result = text
  const usedTerms = new Set<string>()

  for (const { term, link } of LINKABLE_TERMS) {
    if (linked >= 3) break
    if (usedTerms.has(term.toLowerCase())) continue

    // Match whole word, case-insensitive, first occurrence only
    const regex = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i')
    const match = result.match(regex)

    if (match && match.index !== undefined) {
      const before = result.slice(0, match.index)
      const after = result.slice(match.index + match[0].length)

      // Don't link if already inside an <a> tag
      if (before.lastIndexOf('<a') > before.lastIndexOf('</a>')) continue

      result = `${before}<a href="${link}" class="text-slate-500 underline underline-offset-2 decoration-slate-300 hover:text-slate-700 hover:decoration-slate-500 transition-colors" title="${term}">${match[0]}</a>${after}`
      usedTerms.add(term.toLowerCase())
      linked++
    }
  }

  return result
}
