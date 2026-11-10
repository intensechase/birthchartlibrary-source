import type { NextApiRequest, NextApiResponse } from 'next'
import { getCombinedInterpretation, getPlanetInSign, getPlanetInHouse } from '@/lib/interpretations'
import { apiHandler } from '@/lib/apiHandler'

export default apiHandler(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planet, sign, house } = req.query
  if (typeof planet !== 'string' || typeof sign !== 'string' || typeof house !== 'string') {
    return res.status(400).json({ error: 'planet, sign, house required' })
  }

  const houseNum = parseInt(house, 10)
  if (isNaN(houseNum) || houseNum < 1 || houseNum > 12) {
    return res.status(400).json({ error: 'invalid house' })
  }

  const combined = getCombinedInterpretation(planet, sign, houseNum)
  const planetInSign = getPlanetInSign(planet, sign)
  const planetInHouse = getPlanetInHouse(planet, houseNum)

  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400')
  res.json({ combined, planetInSign, planetInHouse })
})
