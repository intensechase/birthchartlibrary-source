export interface Term {
  id: number
  term: string
  definition: string
  link: string | null
  sort_order: number
}

export interface Interpretation {
  id: string
  type: string
  planet: string | null
  sign: string | null
  house: number | null
  aspect_planet: string | null
  aspect_type: string | null
  title: string | null
  description: string
  keywords: string[] | null
}
