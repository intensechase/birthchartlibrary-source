// Fetches trending people from Wikipedia Pageviews API + Wikidata birth data.
// Called by the daily Vercel Cron job.

import { queryOne } from '@/lib/db'

const WIKI_PAGEVIEWS_URL = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/en.wikipedia/all-access'
const WIKIDATA_URL = 'https://www.wikidata.org/w/api.php'
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

const MAX_NEW_PER_DAY = 5

interface WikidataBirthData {
  birthDate: string | null
  birthTime: string | null
  birthCity: string | null
  birthTimeVerified: boolean
}

// Step 1: Get yesterday's top Wikipedia pages
export async function fetchTopPages(): Promise<string[]> {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const year = yesterday.getUTCFullYear()
  const month = String(yesterday.getUTCMonth() + 1).padStart(2, '0')
  const day = String(yesterday.getUTCDate()).padStart(2, '0')

  const url = `${WIKI_PAGEVIEWS_URL}/${year}/${month}/${day}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BirthChartLibrary/1.0 (librarian@birthchartlibrary.com)' },
  })

  if (!res.ok) {
    console.error('Wikipedia API error:', res.status)
    return []
  }

  const data = await res.json()
  const articles = data?.items?.[0]?.articles || []

  // Filter out non-article pages (Main_Page, Special:, etc.)
  return articles
    .map((a: { article: string }) => a.article)
    .filter((title: string) =>
      !title.startsWith('Special:') &&
      !title.startsWith('Wikipedia:') &&
      !title.startsWith('Portal:') &&
      !title.startsWith('File:') &&
      title !== 'Main_Page' &&
      title !== '-'
    )
    .slice(0, 200) // Check top 200 for people
}

// Step 2: Check if a Wikipedia article is about a person using Wikidata
export async function getWikidataEntity(title: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'wbgetentities',
    sites: 'enwiki',
    titles: title,
    props: 'claims',
    format: 'json',
  })

  const res = await fetch(`${WIKIDATA_URL}?${params}`, {
    headers: { 'User-Agent': 'BirthChartLibrary/1.0 (librarian@birthchartlibrary.com)' },
  })

  if (!res.ok) return null
  const data = await res.json()
  const entities = data?.entities || {}
  const entityId = Object.keys(entities).find(k => k !== '-1')
  return entityId || null
}

// Step 3: Check if entity is a person and extract birth data
export async function extractBirthData(entityId: string, claims: Record<string, unknown[]>): Promise<WikidataBirthData | null> {
  // P31 = "instance of", Q5 = "human"
  const instanceOf = claims['P31'] as { mainsnak?: { datavalue?: { value?: { id?: string } } } }[] | undefined
  const isHuman = instanceOf?.some(c => c.mainsnak?.datavalue?.value?.id === 'Q5')
  if (!isHuman) return null

  // P569 = date of birth
  const birthClaim = (claims['P569'] as { mainsnak?: { datavalue?: { value?: { time?: string } } } }[] | undefined)?.[0]
  const birthTimeStr = birthClaim?.mainsnak?.datavalue?.value?.time
  if (!birthTimeStr) return null

  // Parse Wikidata time format: +1990-06-15T00:00:00Z
  const match = birthTimeStr.match(/\+?(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  const birthDate = `${match[1]}-${match[2]}-${match[3]}`

  // P19 = place of birth
  const placeClaim = (claims['P19'] as { mainsnak?: { datavalue?: { value?: { id?: string } } } }[] | undefined)?.[0]
  const placeId = placeClaim?.mainsnak?.datavalue?.value?.id
  let birthCity: string | null = null

  if (placeId) {
    // Fetch place label
    const placeRes = await fetch(`${WIKIDATA_URL}?action=wbgetentities&ids=${placeId}&props=labels&languages=en&format=json`, {
      headers: { 'User-Agent': 'BirthChartLibrary/1.0 (librarian@birthchartlibrary.com)' },
    })
    if (placeRes.ok) {
      const placeData = await placeRes.json()
      birthCity = placeData?.entities?.[placeId]?.labels?.en?.value || null
    }
  }

  return {
    birthDate,
    birthTime: null, // Wikidata rarely has precise birth times
    birthCity,
    birthTimeVerified: false,
  }
}

// Step 4: Geocode birth city
export async function geocodeCity(city: string): Promise<{ lat: number; lng: number } | null> {
  const params = new URLSearchParams({ q: city, format: 'json', limit: '1' })
  const res = await fetch(`${NOMINATIM_URL}?${params}`, {
    headers: {
      'User-Agent': 'BirthChartLibrary/1.0 (librarian@birthchartlibrary.com)',
      'Accept-Language': 'en',
    },
  })

  if (!res.ok) return null
  const results = await res.json()
  if (!results.length) return null

  return {
    lat: parseFloat(results[0].lat),
    lng: parseFloat(results[0].lon),
  }
}

// Step 5: Full pipeline — fetch trending, filter to people, get birth data, return new ones
export async function fetchTrendingPeople(): Promise<{
  name: string
  slug: string
  birthDate: string
  birthTime: string | null
  birthCity: string
  lat: number
  lng: number
  category: string
  bio: string
  birthTimeVerified: boolean
}[]> {
  const topPages = await fetchTopPages()

  const newPeople: {
    name: string
    slug: string
    birthDate: string
    birthTime: string | null
    birthCity: string
    lat: number
    lng: number
    category: string
    bio: string
    birthTimeVerified: boolean
  }[] = []

  for (const title of topPages) {
    if (newPeople.length >= MAX_NEW_PER_DAY) break

    const name = title.replace(/_/g, ' ')
    const slug = title.toLowerCase().replace(/_/g, '-').replace(/[^a-z0-9-]/g, '')

    // Check if already in database
    const existing = await queryOne<{ id: string }>('SELECT id FROM celebrities WHERE slug = $1', [slug])
    if (existing) continue

    // Get Wikidata entity
    const params = new URLSearchParams({
      action: 'wbgetentities',
      sites: 'enwiki',
      titles: title,
      props: 'claims|labels',
      languages: 'en',
      format: 'json',
    })

    let entityData
    try {
      const res = await fetch(`${WIKIDATA_URL}?${params}`, {
        headers: { 'User-Agent': 'BirthChartLibrary/1.0 (librarian@birthchartlibrary.com)' },
      })
      if (!res.ok) continue
      entityData = await res.json()
    } catch {
      continue
    }

    const entities = entityData?.entities || {}
    const entityId = Object.keys(entities).find(k => k !== '-1')
    if (!entityId) continue

    const entity = entities[entityId]
    const claims = entity?.claims || {}

    // Extract birth data
    const birthData = await extractBirthData(entityId, claims)
    if (!birthData || !birthData.birthDate || !birthData.birthCity) continue

    // Geocode
    const coords = await geocodeCity(birthData.birthCity)
    if (!coords) continue

    // Get proper name from Wikidata labels
    const displayName = entity?.labels?.en?.value || name

    newPeople.push({
      name: displayName,
      slug,
      birthDate: birthData.birthDate,
      birthTime: birthData.birthTime,
      birthCity: birthData.birthCity,
      lat: coords.lat,
      lng: coords.lng,
      category: 'Entertainer', // Default... could be improved with occupation claims
      bio: '',
      birthTimeVerified: birthData.birthTimeVerified,
    })

    // Rate limit: be nice to Wikipedia/Wikidata
    await new Promise(r => setTimeout(r, 500))
  }

  return newPeople
}
