// Sign-specific daily horoscope interpretations based on transiting Moon
// The Moon changes sign every ~2.5 days, so this drives daily variation

export const MOON_THROUGH_HOUSES: Record<string, Record<number, string>> = {
  // For each sign, the Moon's current sign maps to a "transit house" (1-12)
  // Sign 1 = Moon in your sign (1st house), Sign 7 = Moon opposite your sign (7th house), etc.
  Aries:       { 1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer', 5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio', 9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces' },
  Taurus:      { 1: 'Taurus', 2: 'Gemini', 3: 'Cancer', 4: 'Leo', 5: 'Virgo', 6: 'Libra', 7: 'Scorpio', 8: 'Sagittarius', 9: 'Capricorn', 10: 'Aquarius', 11: 'Pisces', 12: 'Aries' },
  Gemini:      { 1: 'Gemini', 2: 'Cancer', 3: 'Leo', 4: 'Virgo', 5: 'Libra', 6: 'Scorpio', 7: 'Sagittarius', 8: 'Capricorn', 9: 'Aquarius', 10: 'Pisces', 11: 'Aries', 12: 'Taurus' },
  Cancer:      { 1: 'Cancer', 2: 'Leo', 3: 'Virgo', 4: 'Libra', 5: 'Scorpio', 6: 'Sagittarius', 7: 'Capricorn', 8: 'Aquarius', 9: 'Pisces', 10: 'Aries', 11: 'Taurus', 12: 'Gemini' },
  Leo:         { 1: 'Leo', 2: 'Virgo', 3: 'Libra', 4: 'Scorpio', 5: 'Sagittarius', 6: 'Capricorn', 7: 'Aquarius', 8: 'Pisces', 9: 'Aries', 10: 'Taurus', 11: 'Gemini', 12: 'Cancer' },
  Virgo:       { 1: 'Virgo', 2: 'Libra', 3: 'Scorpio', 4: 'Sagittarius', 5: 'Capricorn', 6: 'Aquarius', 7: 'Pisces', 8: 'Aries', 9: 'Taurus', 10: 'Gemini', 11: 'Cancer', 12: 'Leo' },
  Libra:       { 1: 'Libra', 2: 'Scorpio', 3: 'Sagittarius', 4: 'Capricorn', 5: 'Aquarius', 6: 'Pisces', 7: 'Aries', 8: 'Taurus', 9: 'Gemini', 10: 'Cancer', 11: 'Leo', 12: 'Virgo' },
  Scorpio:     { 1: 'Scorpio', 2: 'Sagittarius', 3: 'Capricorn', 4: 'Aquarius', 5: 'Pisces', 6: 'Aries', 7: 'Taurus', 8: 'Gemini', 9: 'Cancer', 10: 'Leo', 11: 'Virgo', 12: 'Libra' },
  Sagittarius: { 1: 'Sagittarius', 2: 'Capricorn', 3: 'Aquarius', 4: 'Pisces', 5: 'Aries', 6: 'Taurus', 7: 'Gemini', 8: 'Cancer', 9: 'Leo', 10: 'Virgo', 11: 'Libra', 12: 'Scorpio' },
  Capricorn:   { 1: 'Capricorn', 2: 'Aquarius', 3: 'Pisces', 4: 'Aries', 5: 'Taurus', 6: 'Gemini', 7: 'Cancer', 8: 'Leo', 9: 'Virgo', 10: 'Libra', 11: 'Scorpio', 12: 'Sagittarius' },
  Aquarius:    { 1: 'Aquarius', 2: 'Pisces', 3: 'Aries', 4: 'Taurus', 5: 'Gemini', 6: 'Cancer', 7: 'Leo', 8: 'Virgo', 9: 'Libra', 10: 'Scorpio', 11: 'Sagittarius', 12: 'Capricorn' },
  Pisces:      { 1: 'Pisces', 2: 'Aries', 3: 'Taurus', 4: 'Gemini', 5: 'Cancer', 6: 'Leo', 7: 'Virgo', 8: 'Libra', 9: 'Scorpio', 10: 'Sagittarius', 11: 'Capricorn', 12: 'Aquarius' },
}

// What the Moon transiting each house means for your day
export const TRANSIT_HOUSE_MEANING: Record<number, { focus: string; advice: string }> = {
  1:  { focus: 'Self & Identity', advice: 'Your emotions are front and center today. Trust your instincts... how you feel IS the signal. Start something personal.' },
  2:  { focus: 'Money & Values', advice: 'Your attention turns to security, comfort, and what you value most. A good day for financial decisions and self-care.' },
  3:  { focus: 'Communication & Learning', advice: 'Your mind is active and your words carry weight. Conversations, messages, and short trips are highlighted. Say what you mean.' },
  4:  { focus: 'Home & Family', advice: 'Your need for emotional safety intensifies. Home, family, and private life take priority. Nurture your roots.' },
  5:  { focus: 'Creativity & Joy', advice: 'Your creative energy peaks. Romance, play, and self-expression flow naturally. Let yourself enjoy something today.' },
  6:  { focus: 'Health & Routine', advice: 'Your focus sharpens on daily habits, work, and wellness. A good day to organize, exercise, and attend to the details.' },
  7:  { focus: 'Relationships & Partnership', advice: 'Your attention turns to others. Partnerships, negotiations, and one-on-one connections are highlighted. Seek balance.' },
  8:  { focus: 'Transformation & Depth', advice: 'Your emotional intensity deepens. Shared resources, intimacy, and letting go of what no longer serves you are themes.' },
  9:  { focus: 'Exploration & Meaning', advice: 'Your vision expands. Travel, learning, philosophy, and big-picture thinking are favored. Follow your curiosity.' },
  10: { focus: 'Career & Reputation', advice: 'Your ambitions are illuminated. Professional goals, public image, and achievement are in focus. Step up.' },
  11: { focus: 'Community & Future', advice: 'Your social instincts activate. Friendships, group activities, and future planning are highlighted. Connect with your people.' },
  12: { focus: 'Rest & Reflection', advice: 'Your energy turns inward. Solitude, dreams, and spiritual practice are favored. Rest is productive today.' },
}

// Get the transit house number for a sign given the current Moon sign
export function getTransitHouse(sunSign: string, moonSign: string): number {
  const mapping = MOON_THROUGH_HOUSES[sunSign]
  if (!mapping) return 1
  for (const [house, sign] of Object.entries(mapping)) {
    if (sign === moonSign) return parseInt(house)
  }
  return 1
}
