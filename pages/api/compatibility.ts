import type { NextApiRequest, NextApiResponse } from 'next'
import { SIGN_ORDER, getElementCombo, getModalityCombo, getPairSlug } from '@/lib/interpretations/compatibility-helpers'
import { PAIRS, ELEMENT_COMPAT, MODALITY_COMPAT } from '@/lib/interpretations/compatibility'
import { SIGNS } from '@/lib/interpretations/signs'
import { SIGN_SYMBOLS } from '@/lib/zodiac-colors'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { sign1, sign2 } = req.query

  if (typeof sign1 !== 'string' || typeof sign2 !== 'string') {
    return res.status(400).json({ error: 'sign1 and sign2 required' })
  }

  const s1 = sign1.charAt(0).toUpperCase() + sign1.slice(1).toLowerCase()
  const s2 = sign2.charAt(0).toUpperCase() + sign2.slice(1).toLowerCase()

  if (!SIGN_ORDER.includes(s1 as typeof SIGN_ORDER[number]) || !SIGN_ORDER.includes(s2 as typeof SIGN_ORDER[number])) {
    return res.status(400).json({ error: 'Invalid sign. Use one of: ' + SIGN_ORDER.join(', ') })
  }

  const i = SIGN_ORDER.indexOf(s1 as typeof SIGN_ORDER[number])
  const j = SIGN_ORDER.indexOf(s2 as typeof SIGN_ORDER[number])
  const pairKey = i <= j ? `${s1}+${s2}` : `${s2}+${s1}`
  const pairData = PAIRS[pairKey]
  const info1 = SIGNS[s1]
  const info2 = SIGNS[s2]

  if (!pairData || !info1 || !info2) {
    return res.status(404).json({ error: 'Pair data not found' })
  }

  const elemCombo = getElementCombo(info1.element, info2.element)
  const elemData = ELEMENT_COMPAT[elemCombo]
  const modCombo = getModalityCombo(info1.modality, info2.modality)
  const modData = MODALITY_COMPAT[modCombo]
  const score = elemData?.score ?? 50

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  res.json({
    sign1: { name: s1, symbol: SIGN_SYMBOLS[s1], element: info1.element, modality: info1.modality, ruledBy: info1.ruledBy },
    sign2: { name: s2, symbol: SIGN_SYMBOLS[s2], element: info2.element, modality: info2.modality, ruledBy: info2.ruledBy },
    compatibility: {
      score,
      scoreLabel: score >= 80 ? 'Excellent' : score >= 70 ? 'High' : score >= 55 ? 'Good' : score >= 45 ? 'Moderate' : 'Challenging',
      summary: pairData.summary,
      dynamic: pairData.dynamic,
      strengths: pairData.strengths,
      challenges: pairData.challenges,
      tip: pairData.tip,
    },
    elements: elemData ? {
      combo: elemCombo,
      nature: elemData.nature,
      description: elemData.description,
      communication: elemData.communication,
      loveStyle: elemData.loveStyle,
    } : null,
    modalities: modData ? {
      combo: modCombo,
      dynamic: modData.dynamic,
      tension: modData.tension,
    } : null,
    url: `https://birthchartlibrary.com/compatibility/${getPairSlug(s1, s2)}`,
  })
})
