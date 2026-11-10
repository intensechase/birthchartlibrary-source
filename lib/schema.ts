// JSON-LD structured data generators for Google rich results

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Birth Chart Library',
    url: 'https://birthchartlibrary.com',
    description: 'Free birth chart calculator with detailed natal chart readings, personalized daily horoscopes, and 550+ researched celebrity birth charts.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://birthchartlibrary.com/celebrity-birth-charts?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

export function articleSchema(article: {
  title: string
  description: string
  publishDate: string
  slug: string
  category: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    inLanguage: 'en-US',
    author: {
      '@type': 'Organization',
      name: 'Birth Chart Library',
      url: 'https://birthchartlibrary.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Birth Chart Library',
      url: 'https://birthchartlibrary.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://birthchartlibrary.com/favicon.ico',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://birthchartlibrary.com/blog/${article.slug}`,
    },
    articleSection: article.category,
  }
}

export function personSchema(celeb: {
  name: string
  birthDate: string
  birthCity: string
  slug: string
  category: string | null
  imageUrl: string | null
  sunSign?: string | null
  moonSign?: string | null
  risingSign?: string | null
  wikipediaUrl?: string | null
  // Enrichment fields (all optional — added 2026-05-15 for richer Google Person rich results)
  alternateName?: string | null   // birth_name if different from stage name
  gender?: string | null          // raw DB value 'm' | 'f' | other; mapped to schema.org enum below
  birthLat?: number | string | null
  birthLng?: number | string | null
  adbUrl?: string | null          // astro.com astrodatabank URL (sameAs)
}) {
  const birthPlace: Record<string, unknown> = {
    '@type': 'Place',
    name: celeb.birthCity,
  }

  // Add GeoCoordinates when we have lat/lng (we have 100% coverage in the DB).
  // Google uses these for entity matching and local-relevance signals.
  const lat = celeb.birthLat != null ? Number(celeb.birthLat) : null
  const lng = celeb.birthLng != null ? Number(celeb.birthLng) : null
  if (lat != null && lng != null && !Number.isNaN(lat) && !Number.isNaN(lng)) {
    birthPlace.geo = {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: celeb.name,
    birthDate: celeb.birthDate,
    birthPlace,
    url: `https://birthchartlibrary.com/celebrity-birth-charts/${celeb.slug}`,
    mainEntityOfPage: `https://birthchartlibrary.com/celebrity-birth-charts/${celeb.slug}`,
  }

  if (celeb.imageUrl) schema.image = celeb.imageUrl
  if (celeb.category) {
    schema.jobTitle = celeb.category
    schema.hasOccupation = { '@type': 'Occupation', name: celeb.category }
  }

  // givenName / familyName split — helps entity matching and name disambiguation.
  const nameParts = celeb.name.trim().split(/\s+/)
  if (nameParts.length >= 2) {
    schema.givenName = nameParts[0]
    schema.familyName = nameParts.slice(1).join(' ')
  } else if (nameParts.length === 1) {
    schema.givenName = nameParts[0]
  }

  // Stage name vs birth name — improves entity matching when they differ.
  if (celeb.alternateName && celeb.alternateName.trim() && celeb.alternateName.trim() !== celeb.name) {
    schema.alternateName = celeb.alternateName.trim()
  }

  // Map DB gender shorthand to schema.org's expected enum values.
  if (celeb.gender) {
    const g = celeb.gender.trim().toLowerCase()
    if (g === 'm' || g === 'male') schema.gender = 'Male'
    else if (g === 'f' || g === 'female') schema.gender = 'Female'
    // Anything else (non-binary/etc.) — leave off to avoid mis-coding rather than guess
  }

  // Astrological profile as description + knowsAbout topic signals for AI parsers.
  const placements: string[] = []
  if (celeb.sunSign) placements.push(`${celeb.sunSign} Sun sign`)
  if (celeb.moonSign) placements.push(`${celeb.moonSign} Moon sign`)
  if (celeb.risingSign) placements.push(`${celeb.risingSign} Rising sign`)
  if (placements.length > 0) {
    schema.description = `${celeb.name}'s astrological birth chart — ${placements.join(', ')}.`
    schema.knowsAbout = placements
  }

  // sameAs — external authoritative references help Google verify the entity
  const sameAs: string[] = []
  if (celeb.wikipediaUrl) sameAs.push(celeb.wikipediaUrl)
  if (celeb.adbUrl) sameAs.push(celeb.adbUrl)
  if (sameAs.length > 0) schema.sameAs = sameAs

  return schema
}

export function celebrityFaqSchema(celeb: {
  name: string
  sunSign: string | null
  moonSign: string | null
  risingSign: string | null
  birthDate: string
  birthCity: string
  // Expanded 2026-06-10 for richer AI Overview surface
  mercurySign?: string | null
  venusSign?: string | null
  marsSign?: string | null
  chineseAnimal?: string | null
  chineseElement?: string | null
}) {
  const items: { question: string; answer: string }[] = []

  // Sun sign (also serves "zodiac sign" intent via the answer text)
  if (celeb.sunSign) {
    items.push({
      question: `What is ${celeb.name}'s zodiac sign?`,
      answer: `${celeb.name}'s zodiac sign is ${celeb.sunSign}. The Sun sign represents core identity, ego, and life purpose.`,
    })
  }

  // Moon sign
  if (celeb.moonSign) {
    items.push({
      question: `What is ${celeb.name}'s Moon sign?`,
      answer: `${celeb.name}'s Moon sign is ${celeb.moonSign}. The Moon sign governs emotional nature, instincts, and inner life.`,
    })
  }

  // Rising sign
  if (celeb.risingSign) {
    items.push({
      question: `What is ${celeb.name}'s Rising sign?`,
      answer: `${celeb.name}'s Rising sign (Ascendant) is ${celeb.risingSign}. The Rising sign shapes first impressions and outward personality.`,
    })
  }

  // Big Three combined — common natural-language query
  if (celeb.sunSign && celeb.moonSign && celeb.risingSign) {
    items.push({
      question: `What is ${celeb.name}'s Big Three?`,
      answer: `${celeb.name}'s Big Three is ${celeb.sunSign} Sun, ${celeb.moonSign} Moon, and ${celeb.risingSign} Rising.`,
    })
  }

  // Mercury sign — communication/thinking style
  if (celeb.mercurySign) {
    items.push({
      question: `What is ${celeb.name}'s Mercury sign?`,
      answer: `${celeb.name}'s Mercury sign is ${celeb.mercurySign}. Mercury governs how a person thinks, communicates, and processes information.`,
    })
  }

  // Venus sign — love/aesthetics
  if (celeb.venusSign) {
    items.push({
      question: `What is ${celeb.name}'s Venus sign?`,
      answer: `${celeb.name}'s Venus sign is ${celeb.venusSign}. Venus governs love style, attraction, aesthetic taste, and relationship patterns.`,
    })
  }

  // Mars sign — drive/energy
  if (celeb.marsSign) {
    items.push({
      question: `What is ${celeb.name}'s Mars sign?`,
      answer: `${celeb.name}'s Mars sign is ${celeb.marsSign}. Mars governs drive, ambition, physical energy, and how a person pursues goals.`,
    })
  }

  // Birth date and place combined — most common AI query for any celebrity
  // Format date as human-readable (e.g. "June 1, 1926") when possible
  let dateFormatted = celeb.birthDate
  try {
    const d = new Date(celeb.birthDate + 'T12:00:00Z')
    if (!Number.isNaN(d.getTime())) {
      dateFormatted = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
    }
  } catch {
    // fall back to raw date
  }
  items.push({
    question: `When was ${celeb.name} born?`,
    answer: `${celeb.name} was born on ${dateFormatted} in ${celeb.birthCity}.`,
  })

  // Chinese zodiac — separate AI Overview surface
  if (celeb.chineseAnimal && celeb.chineseElement) {
    items.push({
      question: `What is ${celeb.name}'s Chinese zodiac sign?`,
      answer: `${celeb.name}'s Chinese zodiac sign is the ${celeb.chineseElement} ${celeb.chineseAnimal}.`,
    })
  }

  if (items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

// Safe JSON-LD serializer — escapes `<` to < so a string like
// `</script>` in DB content can't terminate the enclosing script tag.
// Use this instead of bare JSON.stringify() in dangerouslySetInnerHTML.
export function jsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function toolSchema(tool: {
  name: string
  description: string
  url: string
  keywords?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(tool.keywords ? { keywords: tool.keywords } : {}),
  }
}

export function howToSchema(howTo: {
  name: string
  description: string
  totalTime?: string  // ISO-8601 duration, e.g. 'PT2M' for 2 minutes
  url?: string
  steps: { name: string; text: string }[]
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    step: howTo.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  if (howTo.totalTime) schema.totalTime = howTo.totalTime
  if (howTo.url) schema.url = howTo.url
  return schema
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Celebrity Birth Charts',
    description: 'Birth charts for famous actors, musicians, athletes, and more.',
    url: 'https://birthchartlibrary.com/celebrity-birth-charts',
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}
