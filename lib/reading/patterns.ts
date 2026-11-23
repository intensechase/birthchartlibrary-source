// Notes behind the Patterns bars on /reading: what each element and mode is,
// plus a line for when it is the strongest or missing in the chart.
// Copy rules as entries.ts: plain words, American spelling, no hyphens,
// no fate claims.

export interface PatternNote { base: string; dominant: string; lacking: string }

export const PATTERN_NOTES: Record<string, PatternNote> = {
  Fire: {
    base: 'Fire is the urge to start, act and be seen: Aries, Leo and Sagittarius.',
    dominant: 'With fire strongest, you warm up fast and lead with enthusiasm. The work is staying with things once the spark wears off.',
    lacking: "With no planets in fire, enthusiasm can take a while to arrive. A deadline or a lively friend helps you get going, and once you're moving you're steady.",
  },
  Earth: {
    base: "Earth is the practical side: Taurus, Virgo and Capricorn. It cares about what's real, useful and lasting.",
    dominant: "With earth strongest, you trust what you can see and touch. You're good at finishing, saving and building, and slower to chase ideas that haven't proved themselves.",
    lacking: 'With no planets in earth, practical details can feel like a chore. Simple routines and checklists help more than you might expect.',
  },
  Air: {
    base: "Air is the thinking and talking side: Gemini, Libra and Aquarius. It's about ideas, people and connections.",
    dominant: 'With air strongest, you live a lot in your head and in conversation, and you spot patterns and options quickly. Check in with how you feel, not only what you think.',
    lacking: 'With no planets in air, you may trust your gut over a debate. Writing your thoughts down, or talking them through with a friend, helps them land.',
  },
  Water: {
    base: "Water is the feeling side: Cancer, Scorpio and Pisces. It's about mood, memory and closeness.",
    dominant: "With water strongest, you read rooms and people quickly, often before anyone says a word. Give yourself time to recover from other people's moods.",
    lacking: 'With no planets in water, feelings may arrive late or come out sideways. Naming them out loud, even roughly, makes them easier to handle.',
  },
  Cardinal: {
    base: 'Cardinal signs start things: Aries, Cancer, Libra and Capricorn. Each one opens a season.',
    dominant: 'With cardinal strongest, you like to begin and to lead, and new projects energize you. Handing off the finishing work is a skill worth learning.',
    lacking: 'With no planets in cardinal signs, starting is the hard part. Once something is underway, you keep it going well.',
  },
  Fixed: {
    base: 'Fixed signs hold things steady: Taurus, Leo, Scorpio and Aquarius. They sit in the middle of each season.',
    dominant: "With fixed strongest, you're loyal, persistent and hard to move once you've decided. Check now and then that you're holding on for a good reason.",
    lacking: 'With no planets in fixed signs, you move on easily. Pick one or two things to stick with, and let the rest stay flexible.',
  },
  Mutable: {
    base: 'Mutable signs adapt: Gemini, Virgo, Sagittarius and Pisces. They close each season and get ready for the next.',
    dominant: 'With mutable strongest, you bend instead of breaking. You handle change well and see several sides, though making a firm choice can take effort.',
    lacking: 'With no planets in mutable signs, change can feel like a disruption. Leave a little slack in your plans so surprises have somewhere to go.',
  },
}
