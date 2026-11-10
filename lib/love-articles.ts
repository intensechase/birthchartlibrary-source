// ─── Content types ────────────────────────────────────────────────────────────

interface Section {
  heading?: string
  paragraphs?: string[]
  bullets?: string[]
  signBullets?: Array<{ sign: string; text: string }>
  callout?: string
}

export interface Article {
  title: string
  description: string
  publishDate: string
  readTime: string
  category: 'couple' | 'sign' | 'guide'
  intro: string
  sign1?: string
  sign2?: string
  compatLink?: string
  sections: Section[]
  faqs?: { question: string; answer: string }[]
  related?: string[]
}

// ─── Sign-in-love template data ───────────────────────────────────────────────

const SIGN_LOVE: Record<string, {
  symbol: string
  brings: string; needs: string; tip: string; shadow: string
  best: string[]; bestNote: string
  famous: { who: string; sign: string }[]
}> = {
  Aries: {
    symbol: '♈',
    brings: 'passion, directness, and the electric thrill of pursuit. Aries doesn\'t love quietly — they go all in, fast, with the full force of their attention.',
    needs: 'independence, genuine excitement, and a partner who can hold their own without needing to be managed. The moment Aries feels like they\'re the only one rowing, interest fades.',
    tip: 'Signs that can match Aries\' energy without being overwhelmed — or who offer the grounding they don\'t know they need — tend to go the distance. Aries does best when they have a partner who challenges them, not one who simply follows.',
    shadow: 'When Aries feels threatened or ignored, they can become combative and impatient. The competitive drive that energizes them can turn inward, making every disagreement a battle to be won rather than a conversation to be had. An Aries operating from wound doesn\'t pause to consider impact.',
    best: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
    bestNote: 'Fire signs share Aries\' pace and passion. Air signs fuel the flame without smothering it.',
    famous: [{ who: 'Victoria Beckham', sign: 'Aries' }, { who: 'Serena Williams', sign: 'Libra' }],
  },
  Taurus: {
    symbol: '♉',
    brings: 'loyalty, deep sensuality, and a love that deepens with time rather than fading. Taurus is the partner who remembers. Who shows up. Who builds something real.',
    needs: 'stability, physical and emotional consistency, and a partner who means what they say. Empty promises are the fastest way to lose a Taurus entirely.',
    tip: 'Taurus thrives with signs who appreciate consistency and build something real. What looks like stubbornness from the outside is often devotion — but Taurus must also be willing to grow, or the relationship calcifies into routine.',
    shadow: 'Taurus\' shadow is possessiveness and immovability. When threatened, they dig in. When hurt, they may become cold or withhold affection as a form of control. The resistance to change that makes them reliable can make them impossible when change is exactly what\'s needed.',
    best: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
    bestNote: 'Earth signs share Taurus\' values and pace. Water signs bring emotional depth that grounds Taurus in the heart.',
    famous: [{ who: 'David Beckham', sign: 'Taurus' }, { who: 'Amal Clooney', sign: 'Aquarius' }],
  },
  Gemini: {
    symbol: '♊',
    brings: 'wit, adaptability, and a mind that never stops exploring. A Gemini in love is a conversationalist, a playmate, a mirror who reflects your best ideas back with extra sparkle.',
    needs: 'intellectual stimulation, variety, and space to evolve without being made to feel guilty for changing. Gemini suffocates in stagnant partnerships.',
    tip: 'The best matches for Gemini are signs who can keep up mentally — or who offer a center of gravity Gemini actually wants to return to. Gemini doesn\'t need a twin; they need a home base.',
    shadow: 'Gemini\'s shadow is emotional inconsistency. Present one day, absent the next. Fully committed in theory, scattered in practice. A Gemini operating from wound can use their verbal facility to deflect rather than connect — winning arguments rather than having conversations.',
    best: ['Libra', 'Aquarius', 'Aries', 'Leo'],
    bestNote: 'Air signs share Gemini\'s love of ideas and movement. Fire signs provide the enthusiasm and directness that grounds Gemini\'s restlessness.',
    famous: [{ who: 'Tom Holland', sign: 'Gemini' }, { who: 'Blake Shelton', sign: 'Gemini' }],
  },
  Cancer: {
    symbol: '♋',
    brings: 'deep emotional attunement, fierce loyalty, and a love that feels like coming home. Cancer doesn\'t love on the surface — they love from the inside out.',
    needs: 'security, genuine emotional reciprocity, and a partner who shows up consistently. Cancer can read insincerity from a mile away, and no one withdraws faster when they sense it.',
    tip: 'Cancer does best with signs who honor emotional depth — not those who call it "too much." The right match creates enough safety that Cancer can stop armoring their heart. Without that safety, Cancer\'s protective instincts run the whole relationship.',
    shadow: 'Cancer\'s shadow is emotional enmeshment and indirect communication. When hurt, they retreat instead of speaking. When anxious, they can become clingy or use guilt as a way to keep people close. The care that makes them wonderful can curdle into control when they\'re afraid.',
    best: ['Scorpio', 'Pisces', 'Taurus', 'Capricorn'],
    bestNote: 'Water signs understand Cancer\'s depth intuitively. Earth signs offer the stability and reliability Cancer needs to feel safe.',
    famous: [{ who: 'Selena Gomez', sign: 'Cancer' }, { who: 'Kristen Bell', sign: 'Cancer' }],
  },
  Leo: {
    symbol: '♌',
    brings: 'warmth, generosity, and a love that makes their partner feel like the most important person in the room. Leo doesn\'t love halfway — when they choose you, they celebrate you.',
    needs: 'genuine admiration, unwavering loyalty, and a partner who is secure enough to let Leo shine without feeling eclipsed. Insecurity in a Leo\'s partner tends to bring out Leo\'s worst.',
    tip: 'Leo needs a partner who celebrates them — and who shines in return. The fear beneath Leo\'s boldness is invisibility. The right match sees Leo fully and chooses them anyway.',
    shadow: 'Leo\'s shadow is ego displacing intimacy. When not receiving consistent affirmation, Leo can become performative, cold, or punishing. The vulnerability beneath the bravado is real — but a Leo who hasn\'t done the work will protect it by becoming impossible to criticize.',
    best: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
    bestNote: 'Fire signs share Leo\'s warmth and vitality. Air signs provide the audience and intellectual match that Leo thrives on.',
    famous: [{ who: 'Meghan Markle', sign: 'Leo' }, { who: 'Jennifer Lopez', sign: 'Leo' }],
  },
  Virgo: {
    symbol: '♍',
    brings: 'devotion, attentiveness, and a love expressed through acts of care so precise they amount to a language. Virgo notices everything — and remembers.',
    needs: 'respect for their standards, emotional reliability, and a partner who sees the love in the attention to detail. Virgo needs to be appreciated for what they give, not just told what they do wrong.',
    tip: 'Virgo\'s best matches are those who see the love behind the criticism and offer the warmth that softens Virgo\'s tendency toward self-criticism. Virgo can be impossibly hard on themselves; a partner who genuinely values their care unlocks their best.',
    shadow: 'Virgo\'s shadow is criticism deployed as armor. When anxious, Virgo fixates on what\'s wrong — in the relationship, in their partner, in themselves. The helpfulness that is their gift can become an endless catalog of inadequacy. A Virgo in their wound makes the people around them feel like they can never measure up.',
    best: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
    bestNote: 'Earth signs share Virgo\'s grounded values and reliability. Water signs bring emotional warmth that thaws Virgo\'s tendency toward over-analysis.',
    famous: [{ who: 'Beyoncé', sign: 'Virgo' }, { who: 'Zendaya', sign: 'Virgo' }],
  },
  Libra: {
    symbol: '♎',
    brings: 'charm, genuine fairness, and a commitment to making the relationship beautiful in every dimension. Libra is the sign that was built for partnership.',
    needs: 'harmony, intellectual connection, and a partner who can engage in real disagreement without Libra having to disappear entirely. Peace-keeping is not the same as peace.',
    tip: 'Libra does best with signs who can hold the tension of a real disagreement and still choose the relationship — because what Libra needs is a partner they can stop performing harmony for.',
    shadow: 'Libra\'s shadow is chronic conflict avoidance. When tension rises, Libra can agree with things they don\'t believe to keep the peace, or become emotionally evasive in ways that make real intimacy impossible. The relationship becomes a performance rather than a reality.',
    best: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
    bestNote: 'Air signs share Libra\'s need for mental connection and social alignment. Fire signs provide decisiveness and warmth that Libra gravitates toward and relies on.',
    famous: [{ who: 'Cardi B', sign: 'Libra' }, { who: 'Will Smith', sign: 'Libra' }],
  },
  Scorpio: {
    symbol: '♏',
    brings: 'unwavering loyalty, intensity that transforms both people, and a love that refuses to stay on the surface. Scorpio loves all of you — especially the parts you\'ve hidden from everyone else.',
    needs: 'trust above everything, emotional honesty even when it\'s hard, and a partner who can handle real depth without flinching. What Scorpio cannot survive: betrayal, deception, or a partner who is structurally unavailable.',
    tip: 'Scorpio\'s best matches understand that the intensity is the love — not a red flag. Signs who run from depth will always disappoint Scorpio. The right match enters the water willingly.',
    shadow: 'Scorpio\'s shadow is punishment. When hurt or betrayed, Scorpio can become withdrawn, controlling, or retaliatory — making the partner pay for injuries they may not have even known they caused. The survival mechanisms that protect Scorpio can also imprison both people in the relationship.',
    best: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
    bestNote: 'Water signs understand Scorpio\'s depth without needing it explained. Earth signs provide the stability and loyalty that earns Scorpio\'s trust over time.',
    famous: [{ who: 'Travis Kelce', sign: 'Scorpio' }, { who: 'Goldie Hawn', sign: 'Scorpio' }],
  },
  Sagittarius: {
    symbol: '♐',
    brings: 'adventure, philosophical honesty, and a love that expands both people\'s world. A Sagittarius in love is a genuine companion — present, enthusiastic, and interested in who you actually are.',
    needs: 'freedom to be themselves, a partner who is genuinely curious about life, and philosophical alignment on what makes a relationship worth having. Sagittarius cannot be contained — only chosen.',
    tip: 'Sagittarius thrives with signs who want to grow together rather than those who try to contain them. The right match is a fellow adventurer, not a warden. Sagittarius\'s best relationships feel like an ongoing invitation.',
    shadow: 'Sagittarius\' shadow is using philosophical honesty as an excuse not to show up fully. "I need freedom" can become a pattern of never fully committing. Sagittarius can idealize the idea of connection while subtly avoiding the work that real intimacy requires.',
    best: ['Aries', 'Leo', 'Libra', 'Aquarius'],
    bestNote: 'Fire signs share Sagittarius\' enthusiasm and need for expansion. Air signs bring the intellectual depth and social range that keeps Sagittarius genuinely interested.',
    famous: [{ who: 'Taylor Swift', sign: 'Sagittarius' }, { who: 'Jay-Z', sign: 'Sagittarius' }],
  },
  Capricorn: {
    symbol: '♑',
    brings: 'commitment, stability, and a love that builds something real over time. Capricorn doesn\'t say it often, but when they choose you, they mean it for keeps.',
    needs: 'a partner who respects what they\'re building and can meet them in their world — practically grounded, emotionally reliable, and not in need of constant reassurance.',
    tip: 'Capricorn opens slowly but loves for keeps. The best matches are those patient enough to earn that trust — and secure enough not to mistake Capricorn\'s seriousness for coldness.',
    shadow: 'Capricorn\'s shadow is emotional unavailability dressed as strength. Work and achievement can become substitutes for intimacy. The self-sufficiency that makes them reliable can become a wall the partner cannot get behind. Capricorn at their worst makes love feel like another item on the to-do list.',
    best: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
    bestNote: 'Earth signs match Capricorn\'s pace and pragmatism. Water signs bring the emotional warmth and intuitive care that helps Capricorn lower their guard.',
    famous: [{ who: 'Michelle Obama', sign: 'Capricorn' }, { who: 'LeBron James', sign: 'Capricorn' }],
  },
  Aquarius: {
    symbol: '♒',
    brings: 'originality, intellectual depth, and a love that never loses its sense of possibility. Aquarius sees their partner as a full person — not a role to be filled.',
    needs: 'freedom to remain an individual, genuine mental connection, and a partner who understands that emotional distance doesn\'t mean absence of love.',
    tip: 'Aquarius does best with signs who value ideas and independence — and who understand that Aquarius\'s emotional expression is real even when it doesn\'t look conventional.',
    shadow: 'Aquarius\' shadow is emotional detachment that passes as independence. When Aquarius intellectualizes rather than feels, the partner can end up experiencing a relationship with a concept of a person rather than the person themselves. The analysis can crowd out the intimacy.',
    best: ['Gemini', 'Libra', 'Sagittarius', 'Aries'],
    bestNote: 'Air signs share Aquarius\' love of ideas and space. Fire signs provide the spontaneity and directness that helps Aquarius access their own emotional life.',
    famous: [{ who: 'Jennifer Aniston', sign: 'Aquarius' }, { who: 'Ellen DeGeneres', sign: 'Aquarius' }],
  },
  Pisces: {
    symbol: '♓',
    brings: 'empathy, romantic imagination, and a love that makes their partner feel truly, completely seen. Pisces loves without armor — a rare and precious thing.',
    needs: 'gentleness, genuine emotional safety, and a partner who grounds without controlling. Pisces in the wrong relationship becomes whoever the relationship needs them to be.',
    tip: 'Pisces thrives with signs who can hold space for deep feeling without taking advantage of that openness. The right match is a soft landing, not another wound.',
    shadow: 'Pisces\' shadow is escapism — when things get hard, Pisces can dissolve into fantasy, projection, or substances rather than staying present with difficulty. Pisces can fall in love with who they want someone to be rather than who they are, and feel betrayed when the real person doesn\'t match the dream.',
    best: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
    bestNote: 'Water signs understand Pisces\' depth without making them explain it. Earth signs offer the grounding and reliability that helps Pisces stay tethered to reality.',
    famous: [{ who: 'Rihanna', sign: 'Pisces' }, { who: 'Elizabeth Taylor', sign: 'Pisces' }],
  },
}

function buildSignArticle(sign: string): Article {
  const d = SIGN_LOVE[sign]
  if (!d) throw new Error(`No data for ${sign}`)
  return {
    title: `${sign} in Love`,
    description: `What ${sign} brings to relationships, what they need from a partner, their best matches, and the shadow patterns to watch for. A complete ${sign} love profile.`,
    publishDate: '2026-05-01',
    readTime: '5 min read',
    category: 'sign',
    sign1: sign,
    intro: `${sign} ${d.symbol} in love is ${d.brings.charAt(0).toLowerCase() + d.brings.slice(1)}. Here's what that actually means for the people who love them — and for ${sign} themselves.`,
    compatLink: `/compatibility/${sign.toLowerCase()}`,
    sections: [
      {
        heading: `What ${sign} Brings to a Relationship`,
        paragraphs: [
          `${sign} brings ${d.brings}`,
          `This is not a sign that does things halfway in love. Whatever the expression looks like from the outside, the interior is total. The challenge for partners is learning to receive love in the language ${sign} actually speaks — which may not always be the language you were expecting.`,
        ],
      },
      {
        heading: `What ${sign} Needs`,
        paragraphs: [
          `${sign} needs ${d.needs}`,
          `${d.tip}`,
        ],
      },
      {
        heading: `Best Matches for ${sign}`,
        signBullets: d.best.map(s => ({ sign: s, text: `${s} — ${d.bestNote}` })),
        paragraphs: [`These aren't the only signs that work with ${sign} — any two charts can create something real with awareness and effort. But elementally, these are the pairings where the baseline compatibility supports the work.`],
      },
      {
        heading: `The Shadow Side`,
        paragraphs: [
          d.shadow,
          `This is not who ${sign} is — it's who ${sign} becomes when they're operating from an unhealed place. Every sign has a shadow. Recognizing yours is the first move toward not being run by it.`,
        ],
      },
      {
        callout: `${sign} at their best is ${d.brings.split(',')[0]} and genuinely transformative for the people they choose. The work is getting out of their own way enough to let that happen.`,
      },
    ],
    faqs: [
      { question: `Who is ${sign} most compatible with?`, answer: `${sign}'s best matches tend to be ${d.best.slice(0, 3).join(', ')}. ${d.bestNote}` },
      { question: `What does ${sign} need in a relationship?`, answer: `${sign} needs ${d.needs}` },
      { question: `What are ${sign}'s red flags in a relationship?`, answer: d.shadow },
    ],
    related: ['moon-sign-compatibility', 'red-flags-by-zodiac-sign'],
  }
}

// ─── Article content ──────────────────────────────────────────────────────────

export const ARTICLES: Record<string, Article> = {
  'zendaya-and-tom-holland': {
    title: 'Zendaya & Tom Holland: What Their Birth Charts Say About Their Love',
    description: 'Zendaya is Virgo. Tom Holland is Gemini. Both are ruled by Mercury — and that changes everything about how this Earth-Air pairing actually works.',
    publishDate: '2026-05-01',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Virgo', sign2: 'Gemini',
    compatLink: '/compatibility/gemini-and-virgo',
    intro: 'Zendaya (Virgo, born September 1, 1996) and Tom Holland (Gemini, born June 1, 1996) share something most Earth-Air couples don\'t: both of their signs are ruled by Mercury, the planet of communication, thought, and intelligence. That changes the baseline entirely.',
    sections: [
      {
        heading: 'The Mercury Connection',
        paragraphs: [
          'In traditional astrology, both Virgo and Gemini are Mercury-ruled signs. Mercury governs how we think, how we communicate, and how we process the world around us. Two people with Mercury-ruled Suns share a cognitive wavelength that most pairings have to work hard to develop.',
          'That shared rulership is why this couple has always felt unusually in sync — even from their time as co-stars in the Spider-Man films before anyone knew they were actually together. The Mercury connection creates a natural language between them: quick, analytical, self-aware, often dry. They think alike even when they arrive at different conclusions.',
        ],
      },
      {
        heading: 'Earth Meets Air',
        paragraphs: [
          'Virgo is an Earth sign: grounded, detail-oriented, service-driven in love. Virgo notices the small things and remembers them. They express care through precision — the right question at the right moment, the thing you mentioned once that they kept track of without making it a production.',
          'Gemini is an Air sign: adaptable, intellectually restless, communicative in a way that moves faster than it settles. Gemini processes by talking, exploring, circling back from a different angle. Where Virgo refines, Gemini expands.',
          'The element score between Earth and Air (50/100) is technically "contrasting" — but that score assumes no shared Mercury rulership. The reality is that the Mercury bridge elevates this pairing significantly above the baseline number.',
        ],
      },
      {
        heading: 'What Works',
        bullets: [
          'Shared Mercury gives them a communication foundation most Earth-Air couples have to build from scratch',
          'Virgo\'s patience and attention to detail complements Gemini\'s restless creativity — each offers what the other lacks without creating resentment',
          'Both are meticulous professionals in their craft, which creates a baseline of mutual respect that sustains romance through high-pressure careers',
          'The playful wit that shows up constantly in their interviews is a genuine hallmark of Mercury-ruled pairings',
        ],
      },
      {
        heading: 'What\'s Harder',
        paragraphs: [
          'Virgo tends to internalize and analyze. When something is wrong, they sit with it, examine it, build a case. Gemini tends to externalize and move forward — an argument that Gemini resolves by talking it through once can be something Virgo is still processing three days later.',
          'Virgo\'s critical nature, expressed as helpfulness, can land hard on Gemini if the delivery isn\'t careful. And Gemini\'s inconsistency — genuinely unavoidable given the sign\'s dual nature — can trigger Virgo\'s anxiety about reliability.',
        ],
      },
      {
        callout: 'Two people who met as teenagers on a film set, grew up alongside each other, and chose each other anyway — that history provides a foundation that no element score can account for. This is a pairing that works better than the numbers suggest, and their Mercury bridge is exactly why.',
      },
    ],
    faqs: [
      { question: 'Are Zendaya and Tom Holland compatible?', answer: 'Elementally (Earth + Air), the compatibility score is 50/100 — contrasting energies. But both signs are Mercury-ruled, which elevates their communication compatibility significantly. The shared Mercury rulership creates a cognitive connection that most Earth-Air couples have to build from scratch.' },
      { question: 'What is Zendaya\'s zodiac sign?', answer: 'Zendaya is a Virgo, born September 1, 1996. Virgo is an Earth sign ruled by Mercury, known for precision, attentiveness, and devotion expressed through acts of care.' },
      { question: 'What is Tom Holland\'s zodiac sign?', answer: 'Tom Holland is a Gemini, born June 1, 1996. Gemini is an Air sign also ruled by Mercury, known for adaptability, wit, and intellectual restlessness.' },
    ],
    related: ['scorpio-in-love', 'virgo-in-love', 'moon-sign-compatibility'],
  },

  'taylor-swift-and-travis-kelce': {
    title: 'Taylor Swift & Travis Kelce: Sagittarius Meets Scorpio',
    description: 'Taylor Swift is Sagittarius. Travis Kelce is Scorpio. Fire meets Water — the most electric and most challenging element combination. Here\'s what the astrology actually says.',
    publishDate: '2026-05-01',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Sagittarius', sign2: 'Scorpio',
    compatLink: '/compatibility/scorpio-and-sagittarius',
    intro: 'Taylor Swift (Sagittarius, born December 13, 1989) and Travis Kelce (Scorpio, born October 5, 1989) brought together two of astrology\'s most misunderstood signs. Sagittarius doesn\'t do half-measures when they fall. And Scorpio never does anything halfway.',
    sections: [
      {
        heading: 'Fire and Water — the Steamy Dynamic',
        paragraphs: [
          'Fire and Water is one of astrology\'s most electrically charged element combinations. It scores 50/100 — not because it\'s bad, but because it requires genuine translation. Fire (Sagittarius) brings optimism, directness, and expansion. Water (Scorpio) brings intensity, emotional depth, and a loyalty that doesn\'t flinch.',
          'When Fire-Water pairings work, they\'re described by both partners as "unlike anything before." When they don\'t, Fire feels smothered by Water\'s intensity, and Water feels burned by Fire\'s carelessness. The key is whether both people can learn the other\'s emotional language.',
        ],
      },
      {
        heading: 'What Sagittarius Brings',
        paragraphs: [
          'Taylor\'s Sagittarius Sun makes her naturally expansive, philosophically curious, and public in how she processes life. Sagittarius is the sign that metabolizes experience through expression — which is exactly what her catalog is. Every album is a Sagittarius move: here\'s what happened to me, here\'s what I learned, here\'s the story.',
          'Sagittarius falls hard and fast, and they\'re idealistic about love in a way that can feel either irresistible or naive depending on who\'s watching. They need the story to mean something.',
        ],
      },
      {
        heading: 'What Scorpio Brings',
        paragraphs: [
          'Travis\'s Scorpio Sun operates differently. Scorpio doesn\'t reveal itself quickly — they watch, assess, and decide whether to trust before they commit. But when a Scorpio commits, the loyalty is total and the depth is real.',
          'Scorpio is intensely private about what matters most, which may explain why Travis — a man whose career is entirely public — has been selectively protective about the relationship in ways that feel deliberate rather than accidental.',
        ],
      },
      {
        heading: 'What Works',
        bullets: [
          'Sagittarius\' warmth and optimism thaws Scorpio\'s guardedness in a way few signs can manage',
          'Scorpio\'s depth gives Sagittarius something worth fully investing in — not just a fun companion, but a genuine emotional journey',
          'Both signs are fiercely loyal when they\'ve truly committed',
          'Fire-Water physical chemistry tends to be significant when the emotional safety is there',
        ],
      },
      {
        heading: 'What\'s Harder',
        paragraphs: [
          'Sagittarius needs freedom — to create, to travel, to be publicly themselves. Scorpio needs emotional exclusivity and can struggle with a partner whose life is, quite literally, a global spectacle. The sheer volume of public attention on this relationship is, astrologically speaking, Scorpio\'s worst-case scenario.',
          'Additionally: Scorpio processes emotionally, often inwardly. Sagittarius processes philosophically and verbally. "Let\'s talk through it" versus "let me sit with this alone" creates real friction when neither partner understands that the other\'s approach isn\'t avoidance — it\'s just their native language.',
        ],
      },
      {
        callout: 'A 50 element score is the floor here, not the ceiling. Scorpio-Sagittarius relationships that survive the early friction are often the ones both people look back on as genuinely transformative. The intensity Scorpio brings is exactly what Sagittarius needs to stay invested long-term.',
      },
    ],
    faqs: [
      { question: 'Are Taylor Swift and Travis Kelce compatible?', answer: 'Their element combination (Fire + Water) scores 50/100 — contrasting energies that require understanding. Sagittarius and Scorpio can create profound chemistry when they learn each other\'s emotional language, but both signs need to actively bridge their different approaches to vulnerability.' },
      { question: 'What is Taylor Swift\'s zodiac sign?', answer: 'Taylor Swift is a Sagittarius, born December 13, 1989. Sagittarius is a Fire sign ruled by Jupiter, known for expansiveness, honesty, and a love of adventure and philosophical exploration.' },
      { question: 'What is Travis Kelce\'s zodiac sign?', answer: 'Travis Kelce is a Scorpio, born October 5, 1989. Scorpio is a Water sign ruled by Pluto and Mars, known for intensity, loyalty, and emotional depth.' },
    ],
    related: ['scorpio-in-love', 'sagittarius-in-love', 'moon-sign-compatibility'],
  },

  'beyonce-and-jay-z': {
    title: 'Beyoncé & Jay-Z: How a Virgo and Sagittarius Built an Empire',
    description: 'Beyoncé is Virgo. Jay-Z is Sagittarius. They form a square aspect — the most friction-producing position in astrology. Here\'s why that\'s exactly why it works.',
    publishDate: '2026-05-01',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Virgo', sign2: 'Sagittarius',
    compatLink: '/compatibility/virgo-and-sagittarius',
    intro: 'Beyoncé (Virgo, born September 4, 1981) and Jay-Z (Sagittarius, born December 4, 1969) married in 2008 after years of creative and personal partnership. Virgo and Sagittarius form a square aspect by zodiac position — meaning there\'s inherent friction baked into the relationship. Squares aren\'t obstacles. They\'re the source of the drive.',
    sections: [
      {
        heading: 'Virgo\'s Perfectionism Meets Sagittarius\'s Vision',
        paragraphs: [
          'Virgo is the sign of craftsmanship, precision, and service. Every frame of Beyoncé\'s visual work, every vocal run, every album concept demonstrates what Virgo looks like operating at full capacity — nothing leaves until it\'s exactly right.',
          'Sagittarius operates from big-picture vision and philosophical ambition. Jay-Z built Roc-A-Fella, Roc Nation, Tidal — businesses that follow the Sagittarian pattern of expansion, risk, and narrative scale. He operates in concepts and legacy.',
          'Together, these energies create something neither could build alone: the vision is Sagittarius\'s, the execution is Virgo\'s. This is the rarest and most powerful configuration in creative partnerships.',
        ],
      },
      {
        heading: 'The Square Aspect',
        paragraphs: [
          'In astrology, signs that are 90 degrees apart (square) produce tension, friction, and pressure. They see the world differently enough to challenge each other constantly. That challenge can be exhausting — or it can be the engine of everything remarkable they produce together.',
          'The Earth + Fire element score (55/100) reflects this tension. But a 55 in practice looks like two people who don\'t agree easily, who have to actively work to understand each other, and who — when they do find common ground — build something neither could have reached alone.',
        ],
      },
      {
        heading: 'What Lemonade Revealed',
        paragraphs: [
          'The 2016 album was astrologically on-brand for Virgo. When Virgo is hurt, they don\'t just feel it — they make something from it. They transmute pain into precision, and precision into legacy. Lemonade was that move: take the most painful thing and render it into the most carefully constructed, most indelible work of your career.',
          'Jay-Z\'s 4:44 was the Sagittarian response — philosophical, expansive, self-examining. Sagittarius processes by speaking truth, even the uncomfortable kind. Both albums are what their respective signs do with real pain when at their best.',
        ],
      },
      {
        heading: 'What Holds',
        bullets: [
          'Shared ambition at a scale most partnerships never reach — they are building something together that neither could build alone',
          'The Virgo-Sagittarius friction creates pressure that produces growth rather than comfortable stagnation',
          'Both signs value craft and excellence above comfort — they recognize that in each other',
          'A multi-decade partnership that predates their public fame gives them history that public figures rarely have',
        ],
      },
      {
        callout: 'Virgo-Sagittarius couples who survive the early friction often find themselves with something rare: a relationship that is also a collaboration, a partnership that is also a creative engine. The square is the source of the pressure that makes everything else possible.',
      },
    ],
    faqs: [
      { question: 'Are Beyoncé and Jay-Z compatible?', answer: 'Their element combination (Earth + Fire) scores 55/100. Virgo and Sagittarius form a square aspect, meaning there\'s inherent friction and tension in the pairing. That tension is also the source of their creative drive and the reason they build at the scale they do.' },
      { question: 'What is Beyoncé\'s zodiac sign?', answer: 'Beyoncé is a Virgo, born September 4, 1981. Virgo is an Earth sign ruled by Mercury, known for precision, devotion, and an approach to love that expresses itself through acts of meticulous care.' },
      { question: 'What is Jay-Z\'s zodiac sign?', answer: 'Jay-Z is a Sagittarius, born December 4, 1969. Sagittarius is a Fire sign ruled by Jupiter, known for vision, philosophical ambition, and a love of expansion and legacy-building.' },
    ],
    related: ['virgo-in-love', 'sagittarius-in-love', 'moon-sign-compatibility'],
  },

  'jennifer-aniston-and-brad-pitt': {
    title: 'Jennifer Aniston & Brad Pitt: The 85/100 Compatibility That Still Didn\'t Last',
    description: 'Jennifer Aniston is Aquarius. Brad Pitt is Sagittarius. Their element combination scores 85/100 — among the highest in astrology. Here\'s why high compatibility doesn\'t guarantee forever.',
    publishDate: '2026-05-01',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Aquarius', sign2: 'Sagittarius',
    compatLink: '/compatibility/sagittarius-and-aquarius',
    intro: 'Jennifer Aniston (Aquarius, born February 11, 1969) and Brad Pitt (Sagittarius, born December 18, 1963) have an Air + Fire element combination that scores 85/100 — among the highest in the compatibility chart. The chemistry was obvious. The separation still surprised people. Astrology explains both.',
    sections: [
      {
        heading: 'Fire and Air — the Electric Combination',
        paragraphs: [
          'Fire + Air is the most naturally compatible element pairing. Air feeds Fire; Fire gives Air warmth and direction. Both elements are active, expressive, and oriented toward freedom rather than security.',
          'Aquarius and Sagittarius share an unusual degree of mutual respect for independence. Neither clings. Neither needs to be needed. They gave each other the space that both required — and the intellectual companionship that both thrived on. The friendship beneath the romance was always obvious.',
        ],
      },
      {
        heading: 'What Made It Work',
        paragraphs: [
          'Aquarius brings originality, intellectual depth, and a warmth that is genuine but unconventional. Sagittarius brings enthusiasm, vision, and an infectious orientation toward life as an ongoing adventure. Both signs are emotionally self-sufficient enough that the partnership felt like a choice rather than a need — which is the most sustainable foundation.',
          'The compatibility score of 85 reflects how naturally these elements communicate, how easily they give each other room, and how much both signs genuinely enjoy each other\'s company rather than just requiring it.',
        ],
      },
      {
        heading: 'Why High Compatibility Doesn\'t Guarantee Forever',
        paragraphs: [
          'Compatibility tells you about the nature of a connection — not whether two people want the same things at the same time.',
          'Sagittarius, when they feel the itch for expansion, follows it. Sometimes that trajectory moves faster than the relationship can accommodate. Aquarius is deeply committed to their own evolution and may find, with clarity rather than drama, that the relationship has run its course. Neither of these is a character flaw — both are features of the signs.',
          'The end of a high-compatibility relationship is often quieter and more complicated than the end of a low-compatibility one. There\'s no obvious villain. There\'s just two people whose timelines didn\'t align.',
        ],
      },
      {
        heading: 'The Enduring Magnetism',
        paragraphs: [
          'The reunion speculation that has never fully died, the warmth both have expressed about the connection years later — these are hallmarks of Fire-Air pairings. The original attraction was partly intellectual, and that kind of chemistry doesn\'t entirely evaporate. It converts into something else: often a genuine fondness, sometimes a complicated one.',
        ],
      },
      {
        callout: 'This pairing is the textbook example of why high compatibility and forever are not the same thing. They were elementally nearly perfect for each other. But compatibility only tells you how you connect — not whether your life timelines will align when it matters most.',
      },
    ],
    faqs: [
      { question: 'Were Jennifer Aniston and Brad Pitt compatible?', answer: 'Their element combination (Air + Fire) scores 85/100 — among the highest in astrology. Aquarius and Sagittarius share independence, intellectual depth, and genuine enjoyment of each other\'s company. The compatibility was real; the relationship ended because of life-timeline divergence, not elemental incompatibility.' },
      { question: 'What is Jennifer Aniston\'s zodiac sign?', answer: 'Jennifer Aniston is an Aquarius, born February 11, 1969. Aquarius is an Air sign ruled by Uranus, known for originality, intellectual independence, and a love of ideas over convention.' },
      { question: 'What is Brad Pitt\'s zodiac sign?', answer: 'Brad Pitt is a Sagittarius, born December 18, 1963. Sagittarius is a Fire sign ruled by Jupiter, known for expansiveness, philosophical curiosity, and a strong orientation toward freedom.' },
    ],
    related: ['aquarius-in-love', 'sagittarius-in-love', 'moon-sign-compatibility'],
  },

  'kim-kardashian-and-lewis-hamilton': {
    title: 'Kim Kardashian & Lewis Hamilton: What Libra and Capricorn Actually Look Like Together',
    description: 'Kim Kardashian is Libra. Lewis Hamilton is Capricorn. Two Cardinal signs, two billion-dollar brands, and one of the more astrologically fascinating pairings of 2026. Here\'s what the charts say.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Libra', sign2: 'Capricorn',
    compatLink: '/compatibility/libra-and-capricorn',
    intro: 'Kim Kardashian (Libra, born October 21, 1980) and Lewis Hamilton (Capricorn, born January 7, 1985) are both Cardinal signs — the initiators, the builders, the ones who don\'t wait for permission. The element score between Air and Earth is 50/100, which reads as contrasting. The reality of this pairing is considerably more interesting than that number suggests.',
    sections: [
      {
        heading: 'Two Cardinals — What That Actually Means',
        paragraphs: [
          'In astrology, modality matters as much as element. Cardinal signs (Aries, Cancer, Libra, Capricorn) are the initiators of the zodiac — they start things, lead things, set things in motion. When two Cardinal signs come together, you get a relationship between two people who are each used to being the one who drives.',
          'This can generate significant friction when both want to steer in different directions. It can also generate extraordinary creative and strategic energy when they align. Two Cardinals who actually agree on where they\'re going tend to build something neither could build alone — which is exactly the dynamic this pairing sets up on paper.',
        ],
      },
      {
        heading: 'Libra Meets Capricorn',
        paragraphs: [
          'Kim\'s Libra Sun makes her fundamentally relational, aesthetically driven, and oriented toward how things appear and are received. Libra is ruled by Venus — the planet of beauty, value, and attraction. This is not a superficial orientation: it is a genuine sensitivity to form, to social dynamics, and to how people experience each other. SKIMS, SKKN, the entire Kardashian media machine — these are Libra enterprises at scale. Beautiful, strategic, and deeply attuned to what people want to see.',
          'Lewis\'s Capricorn Sun operates from a completely different register. Capricorn is ruled by Saturn — the planet of discipline, structure, and earned achievement. Seven Formula 1 world championships do not happen by accident; they happen through Capricorn-level commitment to long-term mastery. Lewis has also built a fashion presence, a production company, and an activism platform — all with the characteristic Capricorn patience that builds things to last.',
        ],
      },
      {
        heading: 'Air and Earth — Where They Meet',
        paragraphs: [
          'Air (Libra) and Earth (Capricorn) is a 50/100 element combination — contrasting rather than naturally compatible. Air moves through ideas, social connection, and the circulation of energy between people. Earth moves through tangible results, material reality, and things that can be held and measured.',
          'The friction: Libra can find Capricorn\'s seriousness heavy, its self-sufficiency emotionally distant. Capricorn can find Libra\'s need for social validation superficial, its indecisiveness frustrating. Both are real risks in this pairing.',
          'The complementarity: Libra brings the aesthetic vision and social intelligence that softens Capricorn\'s edges and opens doors that pure achievement can\'t. Capricorn brings the structural seriousness and follow-through that gives Libra\'s considerable charm somewhere to land. When this pairing works, it tends to produce something publicly impressive.',
        ],
      },
      {
        heading: 'The Brand Axis',
        paragraphs: [
          'What is genuinely unusual about this particular Libra-Capricorn pairing is the symmetry of their public profiles. Both are brands as much as they are people — Kim through media and consumer goods, Lewis through sport, fashion, and activism. Both have been exceptionally deliberate about how they are perceived.',
          'Libra understands image intuitively. Capricorn builds legacy intentionally. Together, these orientations could produce a partnership that is more strategically aligned than most people would assume from the outside. The shared understanding of what it costs to maintain a public identity at this scale is not a small thing.',
        ],
      },
      {
        heading: 'What\'s Harder',
        paragraphs: [
          'Libra needs harmony and can avoid difficult truths to preserve it. Capricorn doesn\'t do avoidance — if something isn\'t working, Capricorn\'s instinct is to address it directly or withdraw. The gap between Libra\'s diplomatic indirection and Capricorn\'s blunt pragmatism can create a slow-building disconnect where both people feel vaguely misunderstood.',
          'Capricorn is also one of the most emotionally private signs. For a Libra who processes relationally — who needs the exchange, the conversation, the sense of being truly partnered — a Capricorn who retreats into work or self-sufficiency can feel genuinely lonely to be with.',
        ],
      },
      {
        callout: 'A 50 element score is the starting point, not the ceiling. Two Cardinal signs who actually align on direction can build something remarkable. The question for this pairing is always: are they aligned on what they\'re building — and are they willing to do the emotional work that Air-Earth combinations require?',
      },
    ],
    faqs: [
      { question: 'Are Kim Kardashian and Lewis Hamilton compatible?', answer: 'Their element combination (Air + Earth) scores 50/100 — contrasting energies that require deliberate effort. Both are Cardinal signs, which creates mutual respect for ambition and drive. The pairing works best when both are aligned on shared goals and willing to bridge Libra\'s social orientation with Capricorn\'s private seriousness.' },
      { question: 'What is Kim Kardashian\'s zodiac sign?', answer: 'Kim Kardashian is a Libra, born October 21, 1980. Libra is an Air sign ruled by Venus, known for aesthetic intelligence, social attunement, and a deep orientation toward partnership and beauty.' },
      { question: 'What is Lewis Hamilton\'s zodiac sign?', answer: 'Lewis Hamilton is a Capricorn, born January 7, 1985. Capricorn is an Earth sign ruled by Saturn, known for long-term ambition, disciplined mastery, and a commitment to building things that last.' },
    ],
    related: ['libra-in-love', 'capricorn-in-love', 'moon-sign-compatibility'],
  },

  'kendall-jenner-and-jacob-elordi': {
    title: 'Kendall Jenner & Jacob Elordi: What Scorpio and Cancer Build Together',
    description: 'Kendall Jenner is Scorpio. Jacob Elordi is Cancer. Two Water signs, both intensely private, both running deeper than they let on publicly. Here\'s what their charts could be saying.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Scorpio', sign2: 'Cancer',
    compatLink: '/compatibility/cancer-and-scorpio',
    intro: 'Kendall Jenner (Scorpio, November 3, 1995) and Jacob Elordi (Cancer, June 26, 1997) are both Water signs — which could mean there is considerably more happening beneath the surface of this relationship than either has publicly acknowledged. Scorpio and Cancer score 75/100 on element compatibility. The real story isn\'t the number. It\'s what happens when two of astrology\'s most private signs choose each other.',
    sections: [
      {
        heading: 'Water Meets Water',
        paragraphs: [
          'Water signs process through feeling rather than logic. Both Scorpio and Cancer tend to be more guarded publicly than they are in private — the version of themselves that appears in interviews and photographs may be a carefully managed fraction of who they actually are in a room with someone they trust.',
          'If this element combination suggests anything for this pairing, it\'s that what they show publicly could be only a fraction of what actually exists between them. Water-Water relationships tend to develop in the interior first — in quiet moments, in conversations that never get photographed. A 75/100 element score reflects the natural resonance between these two signs: they don\'t fight each other\'s emotional nature; they recognize it.',
        ],
      },
      {
        heading: 'Scorpio\'s Intensity Meets Cancer\'s Care',
        paragraphs: [
          'Scorpio is the sign of depth, loyalty, and emotional intensity that doesn\'t advertise itself. Scorpio at its best brings complete commitment once trust has been established — but that trust is earned slowly and tested constantly. If this describes Kendall\'s orientation in relationships, it could imply she approaches commitment with far more seriousness than her public persona suggests.',
          'Cancer is the sign of emotional attunement, care, and the instinct to create safety for the people they choose. If this describes Jacob\'s side of the dynamic, it could mean he functions as the warmer, more openly nurturing presence — the one whose care might be the specific thing that earns Scorpio\'s trust over time. Scorpio opens to those who make it safe to do so. Cancer\'s natural inclination is to create exactly that safety.',
        ],
      },
      {
        heading: 'Fixed + Cardinal',
        paragraphs: [
          'Scorpio is a Fixed sign — once committed, consistent, and resistant to unnecessary change. Cancer is a Cardinal sign — an initiator who tends to set emotional tone and direction. In practice, this could mean Jacob sets the relational context while Kendall provides the depth and constancy that sustains it.',
          'Fixed signs tend to be the ones who hold a relationship steady through difficulty. Cardinal signs tend to be the ones who actively create the emotional conditions for the relationship to exist. If this modality dynamic holds, it could suggest a pairing where one person leads with care and the other responds with loyalty — a sustainable loop when both people are doing their part.',
        ],
      },
      {
        callout: 'Water signs don\'t announce their depth. They live it. If this pairing is what the element compatibility suggests it could be, most of what matters between them will never be photographed.',
      },
    ],
    faqs: [
      { question: 'Are Kendall Jenner and Jacob Elordi compatible?', answer: 'Their element combination (Water + Water) scores 75/100 — one of the more naturally compatible pairings. Scorpio and Cancer share emotional depth, a preference for privacy, and an instinct for loyalty. The main challenge could be both signs\' tendency to withdraw under stress rather than communicate directly.' },
      { question: 'What is Kendall Jenner\'s zodiac sign?', answer: 'Kendall Jenner is a Scorpio, born November 3, 1995. Scorpio is a Water sign ruled by Pluto and Mars, known for intensity, loyalty, and emotional depth that rarely shows itself publicly.' },
      { question: 'What is Jacob Elordi\'s zodiac sign?', answer: 'Jacob Elordi is a Cancer, born June 26, 1997. Cancer is a Water sign ruled by the Moon, known for emotional attunement, care, and a deep instinct toward creating safety and home.' },
    ],
    related: ['scorpio-in-love', 'cancer-in-love', 'moon-sign-compatibility'],
  },

  'ariana-grande-and-ethan-slater': {
    title: 'Ariana Grande & Ethan Slater: When Two Cancers Find Each Other',
    description: 'Ariana Grande and Ethan Slater are both Cancer Suns, born just weeks apart in the same year. Same-sign couples have a unique dynamic — here\'s what their charts could suggest about how this pairing works.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Cancer',
    compatLink: '/compatibility/cancer-and-cancer',
    intro: 'Ariana Grande (Cancer, June 26, 1993) and Ethan Slater (Cancer, June 2, 1992) married in 2024 — and share not just a sign but a birth month. Two Cancers in a relationship is one of astrology\'s more layered configurations: the resonance could be immediate and profound, while the shared blind spots could be equally significant.',
    sections: [
      {
        heading: 'What Same-Sign Actually Means',
        paragraphs: [
          'When two people share the same Sun sign, they bring identical core energies to the relationship. This creates immediate recognition — the feeling of being understood without needing to explain yourself. For two Cancers, this could mean neither person has to decode the other\'s emotional language, because they share it natively.',
          'The risk is mutual amplification. The qualities that attract them to each other are also the qualities that create shared friction. For Cancer, this means both partners carry a deep emotional sensitivity, a need for security, and a tendency toward self-protection when hurt. Two people doing this simultaneously — both retreating into the shell at the same moment — could create a silence that feels very sudden and very cold to both.',
        ],
      },
      {
        heading: 'Cancer\'s Love Language',
        paragraphs: [
          'Cancer expresses love through acts of care, through remembering, and through the creation of emotional safety. If both Ariana and Ethan operate this way, it could mean their relationship is characterized by a mutual tending — each person attending carefully to the other\'s interior world in the way they each most need to be attended to.',
          'Cancer remembers what you said you needed three months ago. Cancer notices when something shifted. If this describes both of them, it could imply a relationship with unusually attuned responsiveness on both sides — the kind where neither person often has to ask for what they need, because the other is already tracking it.',
        ],
      },
      {
        heading: 'The Shared Vulnerability',
        paragraphs: [
          'Cancer\'s sensitivity is also its susceptibility. The emotional fluency that makes Cancer so attuned can, under stress, become emotional overwhelm. For a Cancer in a relationship with another Cancer, the question is whether both people have developed enough capacity to hold their own feeling — to experience difficulty without immediately externalizing it toward the partner.',
          'Ariana has been publicly open about her emotional life, anxiety, and the toll of prolonged public grief. If Cancer\'s characteristic vulnerability describes her emotional baseline, it could suggest she needs a partner who provides genuine stability — not just warmth, but rootedness. Whether a fellow Cancer can provide that grounding, or whether both people need to look elsewhere for it, is the central question for same-sign Cancer pairings.',
        ],
      },
      {
        callout: 'Two Cancers who choose each other are choosing depth. The challenge is not whether to love each other — that part comes naturally. The work is ensuring neither person disappears into the depth when things get hard, and that the shell doesn\'t close around both of them at once.',
      },
    ],
    faqs: [
      { question: 'Are Ariana Grande and Ethan Slater compatible?', answer: 'Two Cancer Suns share a Water-Water element combination that scores 75/100. The natural resonance and emotional understanding could be profound. The main consideration is whether the shared tendency toward emotional withdrawal under stress creates distance when both people need connection most.' },
      { question: 'What is Ariana Grande\'s zodiac sign?', answer: 'Ariana Grande is a Cancer, born June 26, 1993. Cancer is a Water sign ruled by the Moon, known for deep emotional attunement, creativity, and a powerful instinct to protect and nurture those they love.' },
      { question: 'What is Ethan Slater\'s zodiac sign?', answer: 'Ethan Slater is a Cancer, born June 2, 1992. Like Ariana, his Cancer Sun could suggest an emotionally oriented, care-driven approach to relationships and a deep need for genuine safety and connection.' },
    ],
    related: ['cancer-in-love', 'moon-sign-compatibility', 'red-flags-by-zodiac-sign'],
  },

  'goldie-hawn-and-kurt-russell': {
    title: 'Goldie Hawn & Kurt Russell: How Scorpio and Pisces Built 40 Years Without a Wedding',
    description: 'Goldie Hawn is Scorpio. Kurt Russell is Pisces. Together since 1983, never married by choice. Their Water-Water pairing might offer the clearest astrological explanation for one of Hollywood\'s most enduring relationships.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Scorpio', sign2: 'Pisces',
    compatLink: '/compatibility/scorpio-and-pisces',
    intro: 'Goldie Hawn (Scorpio, November 21, 1945) and Kurt Russell (Pisces, March 17, 1951) have been together since 1983 — over 40 years, two blended families, no marriage certificate. They\'ve spoken openly about choosing this arrangement deliberately. Scorpio and Pisces is a Water-Water pairing that scores 75/100, and it could suggest a bond that doesn\'t require conventional structure to feel real.',
    sections: [
      {
        heading: 'Scorpio and Pisces — the Deepest Water Combination',
        paragraphs: [
          'Scorpio and Pisces are often considered the most emotionally profound pairing in the zodiac. Both are Water signs; both operate at depths most people never access. Where Cancer\'s emotional life is connected to home and family, Scorpio\'s goes to power, transformation, and the parts of experience most people avoid. Pisces reaches toward transcendence, imagination, and the dissolution of separateness.',
          'If these descriptions hold for Goldie and Kurt, it could suggest a relationship that has never been primarily about surface compatibility — about shared hobbies or social alignment — but about something more interior and harder to name. Water-Water couples at their best develop an intuitive attunement that functions below the level of words. After 40 years, that depth could mean fewer conversations are needed to communicate what matters.',
        ],
      },
      {
        heading: 'Scorpio\'s Loyalty, Pisces\'s Fluidity',
        paragraphs: [
          'Scorpio is a Fixed Water sign — intense, committed, and resistant to unnecessary change. Once a Scorpio has decided someone is worth their full trust, that commitment tends to be total and durable. If this describes Goldie\'s orientation in this relationship, it could imply that her choice not to marry is not about ambivalence — it is about a Scorpio understanding that commitment is a decision made internally, not conferred by a ceremony.',
          'Pisces is a Mutable Water sign — fluid, adaptable, and deeply empathic. Where Scorpio holds steady, Pisces flows around. If this describes Kurt\'s side of the dynamic, it could mean he has provided the gentle flexibility that absorbs what Scorpio\'s intensity sometimes cannot bend around. Pisces rarely needs a partner to change; they tend to accept what is, which for a Scorpio could be profoundly releasing.',
        ],
      },
      {
        heading: 'Why No Marriage — an Astrological Frame',
        paragraphs: [
          'Both have spoken about this directly. Goldie has said marriage changes the dynamic; Kurt has said they stay together by choice. What astrology might add to this: Scorpio is the sign of transformation, not convention. Pisces is the sign of spiritual connection, not institution. Together, these signs could suggest two people who recognized early that their bond was more real than a legal document could capture — and that formalizing it might actually weaken what was strong.',
          'This is not a universally applicable framework. But for these two specific signs, the preference for depth over form has a certain internal logic.',
        ],
      },
      {
        heading: 'What 40 Years Suggests',
        paragraphs: [
          'A relationship of this duration is not astrological fate — it is a sustained choice, made repeatedly over decades of change. What might make this pairing capable of it: Scorpio\'s depth of loyalty when committed, Pisces\'s capacity for forgiveness and non-judgmental acceptance, Water-Water\'s intuitive attunement that tends to reduce misunderstanding over time.',
          'The pairing might also suggest two people who are comfortable with emotional intensity in a way that would exhaust signs oriented toward lightness and movement. What another combination might find overwhelming, these two may simply experience as their normal — and have, for 40 years.',
        ],
      },
      {
        callout: 'Four decades is not a compatibility score. It is sustained will, repeated choice, and — perhaps — two people whose emotional registers were aligned enough that choosing each other never stopped making sense.',
      },
    ],
    faqs: [
      { question: 'Are Goldie Hawn and Kurt Russell compatible?', answer: 'Their element combination (Water + Water: Scorpio + Pisces) scores 75/100. This is one of astrology\'s most naturally resonant pairings — both signs operate at emotional depths most others don\'t reach, and share an intuitive attunement that strengthens rather than fades over time.' },
      { question: 'What is Goldie Hawn\'s zodiac sign?', answer: 'Goldie Hawn is a Scorpio, born November 21, 1945. Scorpio is a Fixed Water sign ruled by Pluto and Mars, known for intense loyalty, emotional depth, and a commitment style that prioritizes internal truth over external validation.' },
      { question: 'What is Kurt Russell\'s zodiac sign?', answer: 'Kurt Russell is a Pisces, born March 17, 1951. Pisces is a Mutable Water sign ruled by Neptune, known for empathy, adaptability, and a capacity for spiritual and emotional intimacy that complements Scorpio\'s depth.' },
    ],
    related: ['scorpio-in-love', 'pisces-in-love', 'moon-sign-compatibility'],
  },

  'barack-and-michelle-obama': {
    title: 'Barack & Michelle Obama: What Leo and Capricorn Built Over 30 Years',
    description: 'Barack Obama is Leo. Michelle Obama is Capricorn. Fire + Earth, a square aspect, 30+ years of marriage through the most public life imaginable. Here\'s what their charts could say about how they did it.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Leo', sign2: 'Capricorn',
    compatLink: '/compatibility/leo-and-capricorn',
    intro: 'Barack Obama (Leo, August 4, 1961) and Michelle Obama (Capricorn, January 17, 1964) have been married since 1992 — over 30 years, the presidency, two daughters, and a level of public scrutiny that most partnerships never approach, let alone survive. Leo and Capricorn is a Fire-Earth pairing that scores 55/100 and forms what astrologers call a square aspect. Not the easiest configuration. Possibly the most productive one.',
    sections: [
      {
        heading: 'The Square — What It Actually Means',
        paragraphs: [
          'Leo and Capricorn are 90 degrees apart in the zodiac — a square aspect. Squares produce friction and drive simultaneously. The friction is real: Leo operates from warmth, self-expression, and a natural assumption of the room\'s attention; Capricorn operates from discipline, structure, and the conviction that achievement should speak for itself rather than be performed.',
          'If this dynamic describes their relationship at any level, it could imply that the early years involved genuine negotiation — about how each person needed to show up, about whose priorities took precedence in what circumstances, about what it meant to build something together when both people are highly capable and highly directed. What\'s visible now, after three decades, could be what survived and was strengthened by that negotiation.',
        ],
      },
      {
        heading: 'Leo\'s Warmth, Capricorn\'s Architecture',
        paragraphs: [
          'Leo brings warmth, generosity, and a love of expression. Barack\'s public presence — the speeches, the cadence, the humor that shows up even in serious moments — reflects what Leo looks like when its gift is fully developed. What Leo needs in a partner, though, is genuine appreciation: someone who sees and values not just the achievement but the person behind it.',
          'Michelle\'s Capricorn Sun could suggest she provides this in the way Capricorn tends to: through reliability, through the maintenance of structure around the people she\'s committed to, through a steadiness that doesn\'t require constant verbal affirmation. Capricorn shows love through action. If this describes her orientation, it could mean the foundation of their partnership is less about romantic expression and more about the deep respect that develops between two highly capable people who choose to build something together.',
        ],
      },
      {
        heading: 'Surviving the White House',
        paragraphs: [
          'The presidency represents a near-unprecedented test of any partnership. The demands on privacy, identity, individual expression, and emotional availability during those eight years were extraordinary. If Leo-Capricorn\'s characteristic strengths were at work — Leo\'s ability to find genuine meaning in public expression, Capricorn\'s ability to maintain structural stability under sustained pressure — it could offer one frame for understanding how this couple remained visibly intact through something that has damaged partnerships with far less exposure.',
          'Michelle has been candid in interviews about the difficulty of the White House years and the work required to come through them as a couple. This candor is itself characteristically Capricorn: pragmatic about difficulty, unwilling to pretend the work wasn\'t real.',
        ],
      },
      {
        heading: 'What 30 Years of Square Looks Like',
        paragraphs: [
          'Long-term Leo-Capricorn couples often describe their relationship as one in which both people have genuinely shaped each other over time. Leo\'s warmth could soften Capricorn\'s tendency toward emotional austerity and self-sufficiency. Capricorn\'s discipline could ground Leo\'s expansiveness in something more durable than applause.',
          'If this describes the Obamas\' dynamic, it could imply that what may have started as friction — two very different approaches to ambition, to expression, to identity — became the source of growth that neither could have accessed alone. That is what squares do, when both people are willing to do the work.',
        ],
      },
      {
        callout: 'Fire + Earth at 55/100 doesn\'t promise an easy partnership. It promises a productive one — where the friction between two strong natures, over time and with sustained commitment, produces something more durable than what either person could have built alone.',
      },
    ],
    faqs: [
      { question: 'Are Barack and Michelle Obama compatible?', answer: 'Their element combination (Fire + Earth: Leo + Capricorn) scores 55/100 and forms a square aspect — which produces both friction and extraordinary drive. Long-term Leo-Capricorn pairings that work tend to involve genuine mutual shaping over time, each person\'s strength addressing the other\'s limitation.' },
      { question: 'What is Barack Obama\'s zodiac sign?', answer: 'Barack Obama is a Leo, born August 4, 1961. Leo is a Fire sign ruled by the Sun, known for warmth, expressiveness, natural leadership, and a deep need to find meaning in what they do and how they are received.' },
      { question: 'What is Michelle Obama\'s zodiac sign?', answer: 'Michelle Obama is a Capricorn, born January 17, 1964. Capricorn is an Earth sign ruled by Saturn, known for discipline, structural intelligence, long-term commitment, and a love expressed primarily through action and reliability.' },
    ],
    related: ['leo-in-love', 'capricorn-in-love', 'moon-sign-compatibility'],
  },

  'selena-gomez-and-benny-blanco': {
    title: 'Selena Gomez & Benny Blanco: What Cancer and Leo Look Like When It Works',
    description: 'Selena Gomez is Cancer. Benny Blanco is Leo. Water meets Fire — one of astrology\'s most electrically charged and emotionally complex combinations. Here\'s what their charts could suggest.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Leo',
    compatLink: '/compatibility/cancer-and-leo',
    intro: 'Selena Gomez (Cancer, born July 22, 1992) and Benny Blanco (Leo, born March 8, 1988) have been together since 2023. Selena has spoken openly about this relationship in terms that feel distinctly Cancer: she has described him as the most supportive, caring partner she has had. If that description reflects her experience, it could offer one lens for understanding what this Fire-Water combination looks like when the element tension is navigated rather than avoided.',
    sections: [
      {
        heading: 'Water Meets Fire',
        paragraphs: [
          'Cancer and Leo share a border on the zodiac — Cancer ends and Leo begins, which creates a certain adjacent quality between them. But elementally, they could not be more different. Cancer is Water: emotional, attuned, inward-moving, deeply feeling. Leo is Fire: warm, expressive, outward-moving, energized by connection and recognition.',
          'The element combination scores 50/100 — contrasting, requiring translation. What Fire-Water pairings have that other contrasting combinations often lack is a quality of intensity. Water can feel Fire\'s warmth at a depth that Air signs rarely reach. Fire can feel Water\'s emotional richness in a way that grounds it. When this pairing works, it tends to be because each person is offering the other something they genuinely cannot provide for themselves.',
        ],
      },
      {
        heading: 'Cancer\'s Needs, Leo\'s Gifts',
        paragraphs: [
          'Cancer needs emotional safety above almost everything else. The shell is not stubbornness — it is self-protection. Cancer opens to those who make it consistently, demonstrably safe to do so. If Cancer is Selena\'s emotional baseline, her description of Benny as supportive and caring could imply she found someone whose presence lowers rather than raises her emotional guard — which, for a Cancer who has navigated multiple public relationships, would be genuinely significant.',
          'Leo at its best brings warmth, loyalty, and a genuine love of celebrating the people they choose. Leo\'s generosity is real — they want their partner to feel special, seen, and chosen. If this describes Benny\'s orientation in the relationship, it could mean he provides the consistent affirmation that Cancer tends to need but rarely asks for directly.',
        ],
      },
      {
        heading: 'The Friction That Could Exist',
        paragraphs: [
          'Leo needs to feel genuinely appreciated — the admiration runs both ways in this pairing. If Cancer is in a period of emotional withdrawal or inward focus (which Cancer does periodically, often as a form of self-regulation), it could leave Leo feeling unseen in a way that triggers the sign\'s shadow side: performing rather than connecting, or becoming cold when appreciation is withheld.',
          'Cancer\'s indirect communication style can also frustrate Leo\'s preference for straightforwardness. Leo says what it means; Cancer often signals what it means and waits to see if it\'s received. The gap between these styles could create misunderstandings that neither person fully understands the source of.',
        ],
      },
      {
        callout: 'When Cancer-Leo works — and it can work remarkably well — it tends to be because Leo\'s warmth is genuine enough to lower Cancer\'s defenses, and Cancer\'s emotional depth gives Leo\'s generosity somewhere real to go. Both people feel more themselves, not less.',
      },
    ],
    faqs: [
      { question: 'Are Selena Gomez and Benny Blanco compatible?', answer: 'Their element combination (Water + Fire) scores 50/100 — contrasting energies that require conscious effort. Cancer and Leo are adjacent signs that share a certain warmth, but their emotional languages are different. When Leo\'s warmth is genuine and consistent, it can provide exactly the safety Cancer needs to open fully.' },
      { question: 'What is Selena Gomez\'s zodiac sign?', answer: 'Selena Gomez is a Cancer, born July 22, 1992. Cancer is a Water sign ruled by the Moon, known for deep emotional attunement, strong creative instincts, and a profound need for genuine safety in close relationships.' },
      { question: 'What is Benny Blanco\'s zodiac sign?', answer: 'Benny Blanco is a Leo, born March 8, 1988. Leo is a Fire sign ruled by the Sun, known for warmth, creative generosity, and a genuine desire to make the people they love feel celebrated and chosen.' },
    ],
    related: ['cancer-in-love', 'leo-in-love', 'moon-sign-compatibility'],
  },

  'brad-pitt-and-angelina-jolie': {
    title: 'Brad Pitt & Angelina Jolie: The Opposite Signs Who Couldn\'t Stay Away',
    description: 'Brad Pitt is Sagittarius. Angelina Jolie is Gemini. Opposite signs, 85/100 element compatibility, two Mutable Fire and Air energies. Here\'s what their charts could say about why the attraction was so magnetic — and why it burned the way it did.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Sagittarius', sign2: 'Gemini',
    compatLink: '/compatibility/gemini-and-sagittarius',
    intro: 'Brad Pitt (Sagittarius, December 18, 1963) and Angelina Jolie (Gemini, June 4, 1975) were together from 2004 to 2016. Sagittarius and Gemini are opposite signs — they sit exactly 180 degrees apart on the zodiac wheel. Their element combination (Fire + Air) scores 85/100, among the highest in astrology. What makes this pairing worth studying is not that it ended. It\'s what the astrology could suggest about why it was so compelling while it lasted, and so complicated when it didn\'t.',
    sections: [
      {
        heading: 'The Opposite Sign Dynamic',
        paragraphs: [
          'Opposite signs in astrology share the same axis of meaning — they are two expressions of the same fundamental polarity. Gemini and Sagittarius are both signs of the mind, of curiosity, of the need to gather and process information about the world. Gemini does this locally — through conversation, connection, the immediate exchange of ideas. Sagittarius does this expansively — through philosophy, travel, the pursuit of meaning at scale.',
          'When opposite signs meet, the feeling is often one of recognition: here is someone who understands what drives me, from a different angle than I expected. This could explain the quality of instant connection that was reported about this pairing from early on. Opposite signs often feel like the other half of something — which is both the source of the attraction and the source of the eventual tension, when the differences become harder to bridge than the similarities.',
        ],
      },
      {
        heading: 'Fire and Air — 85/100',
        paragraphs: [
          'Fire and Air is the most naturally compatible element combination in astrology. Air feeds Fire; Fire gives Air warmth and direction. Both elements are active, expressive, and oriented toward freedom rather than security. Both value intellectual engagement and find domestic routine insufficient as the full content of a life.',
          'If this describes both Brad and Angelina\'s orientation, it could imply their relationship was energized by a shared restlessness — a shared need to keep moving, to have the relationship mean something beyond its own daily maintenance. The humanitarian work they pursued together could be one expression of this: both signs at their best find meaning in a life that extends beyond the personal.',
        ],
      },
      {
        heading: 'Both Mutable — What That Could Mean',
        paragraphs: [
          'Sagittarius and Gemini are both Mutable signs — the signs of transition, adaptability, and change. Mutable signs are the most flexible of the three modalities; they bend rather than hold firm. In a relationship, two Mutable signs can create extraordinary adaptability — and can also create a situation where neither person provides the structural holding that the relationship eventually needs.',
          'Two Mutable signs living a life of genuine expansion and movement may find that the life itself provides adequate structure. When that life — the projects, the humanitarian work, the family in constant motion — contracts or changes, what\'s left is two very adaptable people who may not have practiced being still together.',
        ],
      },
      {
        heading: 'Why It Was Also Complicated',
        paragraphs: [
          'Both Gemini and Sagittarius are signs of freedom. Neither is naturally oriented toward emotional depth or the sustained interiority that long-term partnership often requires. The pairing that scores 85/100 elementally can still produce real difficulty when the emotional foundation is less developed than the intellectual and physical chemistry.',
          'Sagittarius\'s philosophical honesty can be blunt in ways that wound without intending to. Gemini\'s adaptability can slide into inconsistency. Both signs process by externalizing — talking, moving, engaging with the world — which may mean neither provided the other with a genuinely private space for vulnerability.',
        ],
      },
      {
        callout: 'An 85/100 element score tells you the chemistry was real and the connection was natural. It doesn\'t tell you whether both people had developed the emotional capacity to sustain it long-term. Opposite signs recognize each other — what they do with that recognition is always a choice.',
      },
    ],
    faqs: [
      { question: 'Were Brad Pitt and Angelina Jolie compatible?', answer: 'Their element combination (Fire + Air: Sagittarius + Gemini) scores 85/100 — among the highest in astrology. They are also opposite signs, which creates intense magnetic attraction and a sense of recognition. High compatibility doesn\'t guarantee longevity; it describes the quality of the connection, not the choices made within it.' },
      { question: 'What is Brad Pitt\'s zodiac sign?', answer: 'Brad Pitt is a Sagittarius, born December 18, 1963. Sagittarius is a Fire sign ruled by Jupiter, known for expansiveness, philosophical honesty, and a deep orientation toward freedom and meaning.' },
      { question: 'What is Angelina Jolie\'s zodiac sign?', answer: 'Angelina Jolie is a Gemini, born June 4, 1975. Gemini is an Air sign ruled by Mercury, known for intellectual curiosity, adaptability, and a quick, wide-ranging engagement with ideas and people.' },
    ],
    related: ['sagittarius-in-love', 'gemini-in-love', 'jennifer-aniston-and-brad-pitt'],
  },

  'blake-lively-and-ryan-reynolds': {
    title: 'Blake Lively & Ryan Reynolds: Why Virgo and Scorpio Work So Well',
    description: 'Blake Lively is Virgo. Ryan Reynolds is Scorpio. Earth + Water scores 80/100 — one of the highest-compatibility pairings in the zodiac. Here\'s what their charts could explain about why this one looks so effortless.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Virgo', sign2: 'Scorpio',
    compatLink: '/compatibility/virgo-and-scorpio',
    intro: 'Blake Lively (Virgo, August 25, 1987) and Ryan Reynolds (Scorpio, October 23, 1976) married in 2012. Their element combination — Earth and Water — scores 80/100, one of the highest in astrology. Of all the celebrity couples in this library, this pairing has one of the strongest elemental foundations. What\'s interesting is how visible that compatibility is even from the outside.',
    sections: [
      {
        heading: 'Earth and Water — 80/100',
        paragraphs: [
          'Earth and Water is one of astrology\'s most naturally compatible element combinations. Water nourishes Earth; Earth gives Water a container and a form. Together they create fertile ground — for emotional security, for sustained commitment, for a shared life that feels genuinely anchored.',
          'Virgo is Earth: precise, attentive, devoted in ways that express themselves through action rather than declaration. Scorpio is Water: intense, loyal, emotionally deep in a way that doesn\'t show its full surface. If these descriptions hold for this pairing, it could mean each person offers what the other most needs: Virgo\'s attentiveness creates the consistency Scorpio needs to feel safe enough to open; Scorpio\'s depth gives Virgo\'s considerable devotion somewhere genuinely worth going.',
        ],
      },
      {
        heading: 'What Virgo Brings',
        paragraphs: [
          'Virgo\'s love language is service and precision. They notice what others miss. They remember what you said you needed three months ago. They take care of things before you know they need taking care of. If this describes Blake\'s orientation in this relationship, it could imply a partnership where Scorpio\'s needs — which run deep and are rarely stated directly — are somehow met without having to be articulated. For a Scorpio, having a partner who actually tracks what you need without constant explanation could be profoundly settling.',
        ],
      },
      {
        heading: 'What Scorpio Brings',
        paragraphs: [
          'Scorpio\'s love language is loyalty and depth. Once committed, a Scorpio\'s devotion is total and durable — they do not leave easily, and they do not love halfway. If this describes Ryan\'s side of the partnership, it could mean Blake has the constancy that Virgo, despite its self-sufficiency, actually craves: the sense that the person will still be there even when Virgo\'s perfectionism makes them hard to be around.',
          'Scorpio also provides emotional depth that grounds Virgo\'s tendency toward over-analysis. When Virgo is in its head, Scorpio\'s felt sense of what matters can cut through the noise.',
        ],
      },
      {
        heading: 'Why It Looks Easy From Outside',
        paragraphs: [
          'Earth-Water couples tend to look more settled than they are effortful because the compatibility is structural rather than performed. They aren\'t working against their own natures to make the relationship function — the natures fit. That doesn\'t mean it\'s without difficulty, but the difficulty is less visible because neither person\'s fundamental orientation is in conflict with the other\'s.',
          'The humor they\'re known for publicly — the sharp, self-aware banter — could reflect the Virgo-Scorpio combination: Virgo\'s intelligence applied with precision, Scorpio\'s dark wit underneath. Both signs tend to be funnier than people expect.',
        ],
      },
      {
        callout: 'An 80/100 score means the elements are working with each other rather than against each other. What Blake and Ryan appear to have built could be the practical expression of that: a partnership where the structure is sound enough that the harder moments don\'t threaten the whole.',
      },
    ],
    faqs: [
      { question: 'Are Blake Lively and Ryan Reynolds compatible?', answer: 'Their element combination (Earth + Water: Virgo + Scorpio) scores 80/100 — one of the highest compatibility scores in astrology. Earth nourishes Water; Water softens Earth. The combination could suggest a relationship with strong structural compatibility and the emotional depth to sustain it long-term.' },
      { question: 'What is Blake Lively\'s zodiac sign?', answer: 'Blake Lively is a Virgo, born August 25, 1987. Virgo is an Earth sign ruled by Mercury, known for precision, attentiveness, and a love expressed through acts of careful, consistent care.' },
      { question: 'What is Ryan Reynolds\'s zodiac sign?', answer: 'Ryan Reynolds is a Scorpio, born October 23, 1976. Scorpio is a Water sign ruled by Pluto and Mars, known for intensity, loyalty, and a depth of commitment that doesn\'t announce itself.' },
    ],
    related: ['virgo-in-love', 'scorpio-in-love', 'moon-sign-compatibility'],
  },

  'princess-diana-and-prince-charles': {
    title: 'Princess Diana & Prince Charles: When Compatible Signs Aren\'t Enough',
    description: 'Diana was Cancer. Charles is Scorpio. Water + Water scores 75/100. One of history\'s most studied relationships — and one of astrology\'s most important lessons about what compatibility scores can and can\'t tell you.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Scorpio',
    compatLink: '/compatibility/cancer-and-scorpio',
    intro: 'Princess Diana (Cancer, July 1, 1961) and Prince Charles (Scorpio, November 14, 1948) were married from 1981 to 1996. Their element combination — Cancer and Scorpio, both Water — scores 75/100. By element alone, this should have been one of the more compatible pairings in the royal family\'s history. What this relationship teaches, more than almost any other, is what a compatibility score cannot tell you.',
    sections: [
      {
        heading: 'Water + Water — The Natural Resonance',
        paragraphs: [
          'Cancer and Scorpio share a Water element, which could mean a natural emotional attunement — an intuitive understanding of each other\'s internal states, a shared tendency toward depth, a capacity for the kind of intimacy that other element combinations struggle to access.',
          'In circumstances where both people are emotionally healthy and the external conditions support the relationship, Cancer-Scorpio can be one of the most genuinely connected pairings in the zodiac. Cancer brings warmth, care, and the instinct to create emotional safety. Scorpio brings depth, loyalty, and the capacity for total commitment once trust is established.',
        ],
      },
      {
        heading: 'What the Score Couldn\'t Account For',
        paragraphs: [
          'A compatibility score describes elemental resonance — how naturally two sign energies communicate. It cannot account for the conditions under which the relationship exists: the power structures, the external obligations, the developmental wounds each person carries, the presence or absence of genuine choice.',
          'Diana was 19 when she married Charles, who was 32 and had a pre-existing attachment to another person. If Cancer\'s emotional attunement was active in Diana from the beginning, it could imply she was aware of the emotional reality of the situation earlier than the public narrative acknowledges. Cancer\'s shell is a survival mechanism; Diana\'s increasingly public presence could be understood as what happens when a Cancer cannot find safety in private and seeks it in the world instead.',
        ],
      },
      {
        heading: 'Scorpio\'s Shadow Under Pressure',
        paragraphs: [
          'Scorpio is one of the most loyal signs when its loyalty is received and reciprocated. When a Scorpio feels their emotional reality is being denied or minimized, the sign\'s shadow can emerge: emotional withdrawal, control, the use of silence as a form of punishment. If any of these dynamics were present in this relationship, they could have interacted badly with Cancer\'s deep need for consistent emotional safety — creating a cycle in which Cancer\'s anxiety triggered Scorpio\'s withdrawal, and Scorpio\'s withdrawal intensified Cancer\'s anxiety.',
          'This is speculation about private dynamics, and it should be held lightly. What astrology can say with more confidence is that both signs, under sustained stress without adequate support, tend to turn inward in ways that isolate rather than connect.',
        ],
      },
      {
        heading: 'The Compatibility Score\'s Limit',
        paragraphs: [
          'This relationship is perhaps the clearest example in public life of a simple but important astrological truth: element compatibility is the floor, not the ceiling. A 75/100 score means the elemental languages are compatible — it does not mean the relationship will be healthy, reciprocal, or freely chosen.',
          'Compatibility describes the nature of the energetic connection between two Sun signs. It cannot describe what two people do with that connection, under what conditions they engage it, or whether the institutional and personal contexts surrounding them allow it to develop into something real. The score tells you what could be possible. The relationship tells you what actually was.',
        ],
      },
      {
        callout: 'The lesson of this pairing isn\'t that Water-Water doesn\'t work. It\'s that no compatibility score can substitute for the conditions that allow a relationship to actually be one: genuine choice, mutual respect, and the space to be fully human.',
      },
    ],
    faqs: [
      { question: 'Were Princess Diana and Prince Charles compatible?', answer: 'Their element combination (Water + Water: Cancer + Scorpio) scores 75/100 — a naturally resonant pairing. This relationship is one of astrology\'s most important case studies in what a compatibility score can and can\'t tell you. Element resonance describes potential; it cannot account for power dynamics, external obligations, or the health of each person\'s emotional foundation.' },
      { question: 'What was Princess Diana\'s zodiac sign?', answer: 'Princess Diana was a Cancer, born July 1, 1961. Cancer is a Water sign ruled by the Moon, known for deep emotional sensitivity, care for others, and a profound need for genuine safety and reciprocity in close relationships.' },
      { question: 'What is King Charles\'s zodiac sign?', answer: 'King Charles III is a Scorpio, born November 14, 1948. Scorpio is a Water sign ruled by Pluto and Mars, known for depth, intensity, and a complexity of emotional life that is rarely visible on the surface.' },
    ],
    related: ['cancer-in-love', 'scorpio-in-love', 'moon-sign-compatibility'],
  },

  'dolly-parton-and-carl-dean': {
    title: 'Dolly Parton & Carl Dean: What 60 Years of Capricorn and Cancer Actually Looks Like',
    description: 'Dolly Parton is Capricorn. Carl Dean is Cancer. Opposite signs, Earth + Water scores 80/100, married since 1966. One of the longest celebrity marriages in history — here\'s what their charts could explain.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Capricorn', sign2: 'Cancer',
    compatLink: '/compatibility/cancer-and-capricorn',
    intro: 'Dolly Parton (Capricorn, January 19, 1946) and Carl Dean (Cancer, July 20, 1942) married in 1966 — over 60 years ago. Capricorn and Cancer are opposite signs: they sit exactly 180 degrees apart on the zodiac wheel, sharing the axis of home, security, ambition, and legacy. Their Earth + Water element combination scores 80/100. The duration of this marriage could be one of the most direct illustrations in popular culture of what that combination looks like when sustained over a lifetime.',
    sections: [
      {
        heading: 'Opposite Signs on the Same Axis',
        paragraphs: [
          'The Cancer-Capricorn axis is the axis of the personal and the public, the private and the ambitious, home and the world. Cancer governs the 4th House — roots, family, emotional foundation. Capricorn governs the 10th House — career, public reputation, legacy. These signs face each other across the wheel because they represent two halves of the same fundamental question: how do we build a life that is both secure and meaningful?',
          'Opposite signs often feel like recognition when they meet — here is someone who has what I lack, who sees what I can\'t see from where I\'m standing. Capricorn tends to look outward, toward achievement and structure. Cancer tends to look inward, toward feeling and home. Together, they could cover the full range of what a life requires.',
        ],
      },
      {
        heading: 'Dolly\'s Capricorn in Context',
        paragraphs: [
          'Capricorn is the sign of long-game ambition, of building things that last, of taking the work seriously even when — especially when — no one is watching. Dolly\'s career trajectory is textbook Capricorn: deliberate, sustained, decade over decade, the empire built brick by brick rather than burst by burst. Capricorn also tends to compartmentalize — work is work, home is home, and the boundaries between them are maintained with intention.',
          'If this describes Dolly\'s orientation, it could suggest her marriage survived in part because Carl occupies the private world she returns to — and because she has kept that world genuinely private. We know almost nothing about Carl Dean because Dolly appears to have protected that space deliberately. Capricorn at its best knows what to shield.',
        ],
      },
      {
        heading: 'Carl\'s Cancer — The Anchor',
        paragraphs: [
          'Cancer is the sign of home, care, and emotional containment. Dolly has described Carl as someone who has never been particularly interested in her public life — he rarely attends events, keeps entirely out of the spotlight, and has been the consistent private presence in her very public world. If Cancer\'s orientation toward home and grounding describes him, it could mean he has functioned as exactly the anchor that an ambitious Capricorn needs: the person whose world does not require performance, where the mask can come off.',
          'Cancer\'s care tends to be quiet and consistent rather than dramatic. After 60 years, that kind of care might be precisely what has made the rest of Dolly\'s extraordinary public life possible.',
        ],
      },
      {
        callout: 'Sixty years is not compatibility — it is a practice, sustained daily. But 80/100 element compatibility and the complementary nature of opposite signs could create exactly the structural conditions that make the practice sustainable: each person providing what the other most needs, and each person\'s strength fitting the other\'s gap.',
      },
    ],
    faqs: [
      { question: 'Are Dolly Parton and Carl Dean compatible?', answer: 'Their element combination (Earth + Water: Capricorn + Cancer) scores 80/100, and they are opposite signs — which creates natural complementarity rather than similarity. Capricorn brings ambition and structure; Cancer brings emotional grounding and home. Together, this axis could explain one of the most enduring marriages in celebrity history.' },
      { question: 'What is Dolly Parton\'s zodiac sign?', answer: 'Dolly Parton is a Capricorn, born January 19, 1946. Capricorn is an Earth sign ruled by Saturn, known for disciplined long-term ambition, structural intelligence, and a commitment to building things that genuinely last.' },
      { question: 'What is Carl Dean\'s zodiac sign?', answer: 'Carl Dean is a Cancer, born July 20, 1942. Cancer is a Water sign ruled by the Moon, known for emotional attunement, care, and a deep instinct toward home and the protection of private life.' },
    ],
    related: ['capricorn-in-love', 'cancer-in-love', 'moon-sign-compatibility'],
  },

  'jennifer-lopez-and-ben-affleck': {
    title: 'Jennifer Lopez & Ben Affleck: Two Leos, One Axis',
    description: 'Jennifer Lopez is Leo. Ben Affleck is Leo. Two Fixed Fire signs, 75/100 compatibility — and one of the most watched celebrity relationship arcs of the modern era. Here\'s what the charts could suggest.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Leo', sign2: 'Leo',
    compatLink: '/compatibility/leo-and-leo',
    intro: 'Jennifer Lopez (Leo, July 24, 1969) and Ben Affleck (Leo, August 15, 1972) first dated in the early 2000s, reunited and married in 2022, and separated in 2024. Two Leos — the same sign, both Fixed Fire — is one of the more astrologically specific configurations in this library. Same-sign couples understand each other immediately and completely. They also share the same blind spots, which can be the most difficult kind to navigate.',
    sections: [
      {
        heading: 'What Two Leos Create',
        paragraphs: [
          'When two people share a Sun sign, the resonance is immediate. They speak the same emotional language, orient toward the same values, process the world through the same register. For two Leos, this could mean both people enter the relationship with an unusually clear sense of being truly seen by the other — genuinely recognized, rather than partially understood.',
          'Leo is the sign of self-expression, warmth, and the deep need to be seen and celebrated for who you actually are. Two Leos understanding this need in each other could create a profoundly affirming dynamic: each person genuinely wanting to celebrate the other. The risk is symmetry of need — when both people need to feel celebrated at the same moment, and neither has the capacity to provide it simultaneously.',
        ],
      },
      {
        heading: 'Fixed + Fixed — The Stability and the Stubbornness',
        paragraphs: [
          'Both Leos are Fixed signs — Fixed Fire. Fixed signs are the sustainers of the zodiac: once committed, consistent, resistant to change they haven\'t chosen. Two Fixed signs together could mean a relationship with exceptional staying power — neither person gives up easily, both hold their ground.',
          'The challenge is that Fixed signs are also resistant to changing direction even when the evidence suggests it might be warranted. Two Fixed Leos in disagreement could mean two people who are each absolutely certain they are right, each unwilling to cede ground, each waiting for the other to move first. This kind of standoff, in the wrong moment, can be very difficult to break without one person feeling they have lost something they can\'t recover.',
        ],
      },
      {
        heading: 'The Second Chapter',
        paragraphs: [
          'The reunion and marriage in 2022 — decades after the original relationship — is astrologically interesting. The mid-40s and early 50s represent, for both of them, periods of significant astrological transit: Saturn returns complete, Chiron returns approach, the outer planet configurations that characterize midlife all active. If the timing of reunions reflects something more than circumstance, it could suggest both people arrived in a different place than they had been in 2004 — and found the same recognition waiting.',
          'The subsequent separation could reflect the Fixed sign challenge playing out at full volume: two equally strong natures, both accustomed to occupying the center of their own world, attempting to share a center without a clear structure for how that works.',
        ],
      },
      {
        callout: 'Same-sign couples understand each other in ways that are genuinely rare. The question is never whether they recognize each other — it\'s whether they can tolerate being fully seen by someone who knows exactly how the blind spots work, because they share them.',
      },
    ],
    faqs: [
      { question: 'Are Jennifer Lopez and Ben Affleck compatible?', answer: 'As two Leo Suns, their Fire + Fire element combination scores 75/100. Same-sign couples share immediate recognition and deep understanding. The main challenge for two Fixed Leos is the symmetry of their needs — both require genuine recognition and neither naturally yields. The relationship\'s history suggests both significant connection and real friction from this dynamic.' },
      { question: 'What is Jennifer Lopez\'s zodiac sign?', answer: 'Jennifer Lopez is a Leo, born July 24, 1969. Leo is a Fixed Fire sign ruled by the Sun, known for warmth, generosity, a powerful creative drive, and a deep need to be genuinely seen and celebrated by those they love.' },
      { question: 'What is Ben Affleck\'s zodiac sign?', answer: 'Ben Affleck is a Leo, born August 15, 1972. As a fellow Leo, he shares Jennifer\'s Fixed Fire orientation — the same warmth, the same need for recognition, and the same Fixed-sign difficulty with conceding ground in conflict.' },
    ],
    related: ['leo-in-love', 'moon-sign-compatibility', 'red-flags-by-zodiac-sign'],
  },

  'kate-and-prince-william': {
    title: 'Kate & Prince William: What Capricorn and Cancer Build Together',
    description: 'Kate, Princess of Wales, is Capricorn. Prince William is Cancer. Opposite signs, Earth + Water scores 80/100 — one of the strongest compatibility scores in the royal family\'s modern history. Here\'s what their charts could suggest.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Capricorn', sign2: 'Cancer',
    compatLink: '/compatibility/cancer-and-capricorn',
    intro: 'Catherine, Princess of Wales (Capricorn, January 9, 1982) and Prince William (Cancer, June 21, 1982) married in 2011 after a decade together. They share the Cancer-Capricorn axis — opposite signs, 80/100 Earth + Water compatibility. This is one of the most structurally sound sign pairings in astrology, and it could offer a frame for understanding why this partnership has the quality of genuine partnership it appears to have.',
    sections: [
      {
        heading: 'The Capricorn-Cancer Axis',
        paragraphs: [
          'Capricorn and Cancer are opposite signs — they sit 180 degrees apart on the zodiac wheel, sharing the axis that governs the tension between public life and private life, between ambition and home, between the world and the sanctuary from it. This axis is one of astrology\'s most productive: each sign carries what the other most needs.',
          'If these descriptions hold for this pairing, it could suggest a partnership in which William\'s Cancer orientation — toward emotional attunement, toward family, toward creating genuine private life within an extraordinarily public role — is grounded and structured by Kate\'s Capricorn discipline and composure. And Capricorn\'s tendency toward emotional austerity could be softened by Cancer\'s warmth and relational attunement.',
        ],
      },
      {
        heading: 'Earth and Water — 80/100',
        paragraphs: [
          'Earth + Water is one of astrology\'s most complementary element combinations. Earth gives Water a container and a form; Water nourishes Earth and brings emotional depth that pure Earth signs sometimes suppress. The 80/100 score reflects genuine elemental resonance — not the effortless electricity of Fire + Air, but the quiet durability of two signs that build rather than burn.',
          'What this could mean in practice: a relationship that doesn\'t perform its compatibility, but simply functions. The partnership that has looked, even under extraordinary public pressure, like two people who genuinely respect and rely on each other.',
        ],
      },
      {
        heading: 'Capricorn Under Pressure',
        paragraphs: [
          'Capricorn is the sign most built for institutional life — for showing up with composure when composure is required, for understanding that some roles carry obligations that supersede personal preference, for the long game. If this describes Kate\'s orientation, it could explain how she has navigated the demands of royal life in a way that appears sustainable rather than performative.',
          'The early loss of Princess Diana — a Cancer Sun — adds a layer of complexity to William\'s chart. Cancer is the sign of home and mother. The loss of that anchor at a formative age could mean that what Cancer seeks most — genuine emotional safety — became both a deep need and a tender wound. If this is true, Kate\'s Capricorn steadiness could provide something that William has needed at a foundational level.',
        ],
      },
      {
        callout: 'Opposite signs often describe the most durable partnerships: not two people who are the same, but two people whose different natures fit together in a way that makes both more complete. 80/100 with this much shared history could suggest exactly that.',
      },
    ],
    faqs: [
      { question: 'Are Kate and Prince William compatible?', answer: 'Their element combination (Earth + Water: Capricorn + Cancer) scores 80/100 — one of the highest compatibility scores in astrology. They are also opposite signs, which creates complementarity rather than similarity. Capricorn provides structure; Cancer provides emotional attunement and home.' },
      { question: 'What is Kate, Princess of Wales\'s zodiac sign?', answer: 'Kate, Princess of Wales is a Capricorn, born January 9, 1982. Capricorn is an Earth sign ruled by Saturn, known for composure under pressure, long-term commitment, and a love expressed through reliability and sustained action.' },
      { question: 'What is Prince William\'s zodiac sign?', answer: 'Prince William is a Cancer, born June 21, 1982. Cancer is a Water sign ruled by the Moon, known for emotional attunement, deep loyalty, and a profound need for genuine safety and home.' },
    ],
    related: ['capricorn-in-love', 'cancer-in-love', 'dolly-parton-and-carl-dean'],
  },

  'rihanna-and-asap-rocky': {
    title: 'Rihanna & ASAP Rocky: What Pisces and Libra Look Like Together',
    description: 'Rihanna is Pisces. ASAP Rocky is Libra. Water + Air — a pairing that can feel like the most natural creative chemistry, or like two people speaking different emotional languages. Here\'s what the charts could suggest.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Pisces', sign2: 'Libra',
    compatLink: '/compatibility/libra-and-pisces',
    intro: 'Rihanna (Pisces, February 20, 1988) and ASAP Rocky (Libra, October 3, 1988) have been together since 2021 and have two children. Pisces and Libra is a Water + Air combination that scores 45/100 on element compatibility — among the more challenging pairings by that measure. The astrological story is more nuanced than the number suggests.',
    sections: [
      {
        heading: 'Water and Air — Where They Meet',
        paragraphs: [
          'Water and Air have the most difficulty communicating of any element combination. Air processes intellectually and socially; Water processes through feeling and intuition. What Air experiences as a casual conversation, Water may experience as an emotional event. What Water communicates through mood and atmosphere, Air may not register at all.',
          'The 45/100 score reflects this structural challenge. It does not mean the chemistry isn\'t real — it means the chemistry requires conscious work to sustain. What brings a Pisces-Libra couple together tends to be aesthetic and creative: both signs have a highly developed sense of beauty, both are oriented toward art and connection. What keeps them together is whether they can bridge the gap between how each person experiences emotion.',
        ],
      },
      {
        heading: 'Rihanna\'s Pisces',
        paragraphs: [
          'Pisces is the sign of empathy, imagination, and the capacity to dissolve the boundary between self and other — which, applied to creative work, produces extraordinary art. Rihanna\'s output across music, fashion, and beauty could be read as Pisces at full expression: boundary-dissolving, emotionally resonant, deeply attuned to what people feel rather than just what they want.',
          'Pisces in relationship needs a partner who can be present with depth — who doesn\'t flinch from emotional complexity or try to rationalize feeling into something manageable. If this describes Rihanna\'s relational needs, it could imply she requires a partner who meets her in the feeling, not just the conversation.',
        ],
      },
      {
        heading: 'ASAP Rocky\'s Libra',
        paragraphs: [
          'Libra is the sign of aesthetic intelligence, social grace, and the genuine love of beauty in all its forms. ASAP Rocky\'s fashion presence, his attention to visual culture, his collaborative nature — these fit the Libra signature. Libra also brings genuine warmth and a deep orientation toward partnership: Libra is, more than almost any other sign, built to be in relationship.',
          'What Libra might struggle to provide is the emotional depth that Pisces craves. Libra processes through discussion and harmony; Pisces through feeling and immersion. If this tension exists in the relationship, it could explain the long period of "just friends" before they became a couple — Pisces needed to know whether Libra could actually go deep.',
        ],
      },
      {
        callout: 'A 45/100 score is not a verdict — it\'s a starting point. Some of the most compelling relationships exist exactly where the elements create friction. The question is whether both people are willing to learn the other\'s language. For a Pisces-Libra couple, that language gap is real — and crossing it is the work.',
      },
    ],
    faqs: [
      { question: 'Are Rihanna and ASAP Rocky compatible?', answer: 'Their element combination (Water + Air: Pisces + Libra) scores 45/100 — one of the more challenging pairings elementally. Both signs are oriented toward beauty, art, and connection, which could create strong initial chemistry. The longer-term work is bridging Pisces\'s emotional depth with Libra\'s more intellectual processing style.' },
      { question: 'What is Rihanna\'s zodiac sign?', answer: 'Rihanna is a Pisces, born February 20, 1988. Pisces is a Water sign ruled by Neptune, known for emotional depth, creative imagination, and an empathic attunement to feeling that shapes everything she produces.' },
      { question: 'What is ASAP Rocky\'s zodiac sign?', answer: 'ASAP Rocky is a Libra, born October 3, 1988. Libra is an Air sign ruled by Venus, known for aesthetic intelligence, social grace, and a genuine orientation toward beauty and partnership.' },
    ],
    related: ['pisces-in-love', 'libra-in-love', 'moon-sign-compatibility'],
  },

  'steph-and-ayesha-curry': {
    title: 'Steph & Ayesha Curry: When Two Pisces Find Each Other',
    description: 'Steph Curry is Pisces. Ayesha Curry is Pisces. Same sign, Water + Water, married since 2011. Here\'s what two Pisces in a long-term relationship could look like — and what makes it work.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Pisces', sign2: 'Pisces',
    compatLink: '/compatibility/pisces-and-pisces',
    intro: 'Steph Curry (Pisces, March 14, 1988) and Ayesha Curry (Pisces, March 23, 1989) married in 2011 and have built one of the most visibly grounded partnerships in professional sports. Two Pisces together is a rare configuration — Water + Water scores 75/100, and the same-sign dynamic adds a layer of recognition that most couples never fully experience.',
    sections: [
      {
        heading: 'Two Pisces — The Depth of Mutual Recognition',
        paragraphs: [
          'When two people share a Sun sign, the first quality they tend to report is being understood without needing to explain. For two Pisces, this could mean neither person has to justify their emotional depth, their creative intuition, or their capacity to feel things at a register that most other signs can\'t quite reach.',
          'Pisces is the last sign of the zodiac — the most porous, the most empathic, the most attuned to the undercurrents beneath what is said. Two Pisces in a relationship could mean a partnership that functions at an intuitive level: reading each other\'s states without words, sensing shifts in mood before they\'re articulated, responding to what is actually happening rather than what is performed.',
        ],
      },
      {
        heading: 'What This Pairing Could Build',
        paragraphs: [
          'Pisces is the sign of creative imagination, compassion, and the capacity to hold complexity without needing to resolve it. If both people operate from this orientation, it could imply a relationship with unusual tolerance for ambiguity — neither person forcing the other to be simpler or more certain than they are.',
          'The visible quality of the Curry partnership — the mutual public support, the sense of two people who genuinely enjoy each other — could reflect what two Pisces look like when the shared orientation works: both people swimming in the same direction, both comfortable in the depth.',
        ],
      },
      {
        heading: 'The Challenge of Same-Sign Pisces',
        paragraphs: [
          'The risk with two Pisces is the same risk as any same-sign pairing: the shared qualities amplify in both directions. Pisces\'s capacity for empathy becomes mutual absorption — both people taking on each other\'s emotional states until neither knows where one ends and the other begins. Pisces\'s tendency toward escapism or idealization can become a shared avoidance of what\'s actually difficult.',
          'The couples that make this configuration work are usually the ones where both people have developed enough individual groundedness that the depth is a feature rather than a trap. In Steph\'s case, the discipline required to become the greatest shooter in NBA history is not Piscean in the conventional sense — but Pisces does contain the capacity for complete absorption in a craft, which is a different kind of depth entirely.',
        ],
      },
      {
        callout: 'Two Pisces who have both developed their own groundedness could create something genuinely rare: a relationship that is deeply attuned and individually whole. The depth is shared without being consuming.',
      },
    ],
    faqs: [
      { question: 'Are Steph and Ayesha Curry compatible?', answer: 'Two Pisces Suns share a Water + Water combination that scores 75/100. The same-sign dynamic creates immediate recognition and mutual understanding of emotional depth. The main consideration is ensuring both people maintain individual groundedness so the shared depth becomes enriching rather than consuming.' },
      { question: 'What is Steph Curry\'s zodiac sign?', answer: 'Steph Curry is a Pisces, born March 14, 1988. Pisces is a Water sign ruled by Neptune, known for creative depth, empathic attunement, and a capacity for complete absorption in what matters most to them.' },
      { question: 'What is Ayesha Curry\'s zodiac sign?', answer: 'Ayesha Curry is a Pisces, born March 23, 1989. As a fellow Pisces, she shares Steph\'s Water orientation — the same emotional depth, creative intuition, and capacity for genuine attunement in relationship.' },
    ],
    related: ['pisces-in-love', 'ariana-grande-and-ethan-slater', 'moon-sign-compatibility'],
  },

  'patrick-and-brittany-mahomes': {
    title: 'Patrick & Brittany Mahomes: Two Virgos Building Something Real',
    description: 'Patrick Mahomes is Virgo. Brittany Mahomes is Virgo. Same sign, Earth + Earth scores 70/100, married 2022. Here\'s what two Virgos in a partnership could look like — and why same-sign Earth pairings tend to last.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Virgo', sign2: 'Virgo',
    compatLink: '/compatibility/virgo-and-virgo',
    intro: 'Patrick Mahomes (Virgo, September 17, 1995) and Brittany Mahomes (Virgo, September 6, 1995) married in 2022, having been together since high school. Two Virgos — Earth + Earth, 70/100 — is one of astrology\'s more quietly durable configurations. The recognition is immediate; the shared values run deep; the standards are high and mutual.',
    sections: [
      {
        heading: 'What Two Virgos Share',
        paragraphs: [
          'Virgo is the sign of precision, attentiveness, and the belief that love is expressed through action rather than declaration. Two Virgos share a native understanding of this — neither person needs to explain why they notice the small things, why they hold themselves to high standards, or why they find meaning in doing something well.',
          'The same-sign recognition that all couples who share a Sun sign experience takes on a particular quality with Virgo: the sense of meeting someone who processes the world with the same level of detail you do. Most people find Virgo\'s attunement impressive or even exhausting. Another Virgo finds it normal.',
        ],
      },
      {
        heading: 'Earth + Earth — 70/100',
        paragraphs: [
          'Two Earth signs build something solid. The 70/100 score reflects the natural resonance between Earth and Earth: shared values around reliability, shared appreciation for things that are real and tangible, shared ability to build toward a long-term goal without losing patience.',
          'If this describes the Mahomes\' dynamic, it could suggest a partnership organized around what they\'re building together — family, career, and a shared vision of what they want their life to look like — rather than around romantic chemistry alone. Earth signs tend to stay. When they commit, the commitment is structural, not sentimental.',
        ],
      },
      {
        heading: 'The Same-Sign Challenge',
        paragraphs: [
          'Two Virgos share the same shadow. Virgo\'s critical nature — the tendency to see what\'s not quite right, to hold everything (including the relationship and themselves) to a high standard — applies to both people simultaneously. If both partners are running the same internal critic, the relationship can become a place of mutual scrutiny rather than mutual rest.',
          'The couples who make same-sign Virgo work are usually the ones where both people have learned to direct the critical eye outward (toward the work, toward shared goals) rather than inward at each other. Two Virgos who can be each other\'s respite from their own standards — rather than another arena where those standards apply — could have something genuinely lasting.',
        ],
      },
      {
        callout: 'High-school sweethearts who grew up alongside each other and chose each other at every stage have a foundation that no compatibility score can fully capture. Two Virgos who have been each other\'s consistent presence through the most formative years — that history is itself astrological.',
      },
    ],
    faqs: [
      { question: 'Are Patrick and Brittany Mahomes compatible?', answer: 'Two Virgo Suns share an Earth + Earth combination that scores 70/100. The same-sign dynamic creates immediate recognition and shared values around precision, reliability, and the belief that love is expressed through consistent action. The main consideration is ensuring the shared Virgo critical nature is directed toward shared goals rather than toward each other.' },
      { question: 'What is Patrick Mahomes\'s zodiac sign?', answer: 'Patrick Mahomes is a Virgo, born September 17, 1995. Virgo is an Earth sign ruled by Mercury, known for precision, attentiveness, and a commitment to excellence that applies equally to craft and to the people they love.' },
      { question: 'What is Brittany Mahomes\'s zodiac sign?', answer: 'Brittany Mahomes is a Virgo, born September 6, 1995. As a fellow Virgo, she shares Patrick\'s Earth orientation — the same attention to detail, high standards, and love expressed through consistent, careful action.' },
    ],
    related: ['virgo-in-love', 'steph-and-ayesha-curry', 'moon-sign-compatibility'],
  },

  'ryan-gosling-and-eva-mendes': {
    title: 'Ryan Gosling & Eva Mendes: The Most Private Love in Hollywood',
    description: 'Ryan Gosling is a Scorpio. Eva Mendes is a Pisces. Water + Water scores 75/100 — and their 15-year partnership is one of Hollywood\'s most quietly durable.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Scorpio', sign2: 'Pisces',
    compatLink: '/compatibility/scorpio-and-pisces',
    intro: 'Ryan Gosling (Scorpio, November 12, 1980) and Eva Mendes (Pisces, March 5, 1974) have been together since 2011, have two daughters together, and almost never discuss their relationship publicly. That last part isn\'t incidental — it\'s astrological.',
    sections: [
      {
        heading: 'Why the Privacy Makes Sense',
        paragraphs: [
          'Scorpio is the sign most associated with privacy, depth, and the instinct to protect what matters most. The things most important to a Scorpio are rarely the things they broadcast. Ryan Gosling has embodied this his entire public life — accessible in his work, genuinely opaque in his personal life.',
          'Pisces, meanwhile, is the sign of the empath and the dreamer — the person who feels everything and finds that exposure can leave them deeply vulnerable. Eva Mendes stepped back from acting entirely when they had children, a decision she has credited directly to wanting to protect her family from the relentless visibility of public life. That\'s Pisces: the interior life is real, and worth guarding.',
        ],
      },
      {
        heading: 'Scorpio + Pisces: Water + Water — 75/100',
        paragraphs: [
          'Two Water signs together tend to feel, from the inside, like arriving somewhere. The emotional attunement is immediate — not because they\'re the same, but because both people understand that the interior life is real, that depth isn\'t a threat, and that feeling things fully is not a weakness.',
          'Scorpio and Pisces have complementary strengths. Scorpio brings focus, loyalty, and an ability to hold steady in crisis. Pisces brings empathy, imagination, and the kind of unconditional emotional acceptance that Scorpio rarely feels safe enough to ask for but deeply needs. If their dynamic reflects this pattern, it could mean she is one of the few people he fully trusts — and that he offers a kind of unwavering, protective constancy that grounds her Pisces sensitivity.',
        ],
      },
      {
        heading: 'Building Inward',
        paragraphs: [
          'They have been together for 15 years without marrying publicly, without press releases, without giving interviews about each other. By Hollywood standards, that is remarkable. But it also fits: Scorpio and Pisces tend to build a world between themselves that doesn\'t require external validation to feel real.',
          'The relationship began on the set of The Place Beyond the Pines (2011), where they played a couple — a beginning with a certain Piscean quality of art bleeding into life. The details of their private life have remained, in every meaningful sense, private.',
        ],
      },
      {
        callout: 'Eva Mendes has said that choosing family over her career was not a difficult decision. That deliberate de-prioritization of external achievement in favor of private life is deeply consistent with Pisces — and with a Pisces who has found someone worth building inward with.',
      },
    ],
    faqs: [
      { question: 'What is Ryan Gosling\'s zodiac sign?', answer: 'Ryan Gosling is a Scorpio, born November 12, 1980. Scorpio is a Water sign ruled by Pluto, known for intensity, depth, loyalty, and a fierce protectiveness over the people and things they love most.' },
      { question: 'What is Eva Mendes\'s zodiac sign?', answer: 'Eva Mendes is a Pisces, born March 5, 1974. Pisces is a Water sign ruled by Neptune, known for empathy, creative depth, and an emotional openness that requires genuine safety to fully express.' },
      { question: 'Are Ryan Gosling and Eva Mendes compatible?', answer: 'Scorpio + Pisces is a Water + Water pairing that scores 75/100. The mutual emotional attunement and complementary strengths — Scorpio\'s protective loyalty meeting Pisces\'s unconditional acceptance — make this one of astrology\'s more naturally harmonious pairings.' },
    ],
    related: ['scorpio-in-love', 'goldie-hawn-and-kurt-russell', 'moon-sign-compatibility'],
  },

  'prince-harry-and-meghan-markle': {
    title: 'Prince Harry & Meghan Markle: A Virgo and a Leo Rewriting the Script',
    description: 'Prince Harry is a Virgo. Meghan Markle is a Leo. Earth + Fire scores 55/100. Leo leads, Virgo commits, and together they made one of the most consequential exits in modern royal history.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Leo', sign2: 'Virgo',
    compatLink: '/compatibility/leo-and-virgo',
    intro: 'Prince Harry (Virgo, September 15, 1984) and Meghan Markle (Leo, August 4, 1981) married in May 2018. By January 2020, they had stepped back from royal duties. By 2021, they had settled in California with their children Archie and Lilibet. The pattern of that arc — Leo clarity, Virgo loyalty — is astrologically legible.',
    sections: [
      {
        heading: 'Two Very Different Orientations',
        paragraphs: [
          'Leo is the sign of the sovereign — the person who expects to be seen, who leads naturally, who understands identity as something to be expressed rather than suppressed. Meghan Markle\'s Leo nature has been evident from the beginning: an actress who became a global figure, an advocate who had things to say, a woman who was not built for the kind of institutional effacement the royal family required.',
          'Virgo, by contrast, is the sign of service and duty — the person who finds meaning in doing their role correctly, who tends to subordinate their own needs to the structure around them. Prince Harry spent his entire young life shaped by exactly that: the military, the charitable work, the public appearances. The Virgo tendency toward self-erasure, toward operating in service of something larger, was built into his life before he ever chose it.',
        ],
      },
      {
        heading: 'Earth + Fire — 55/100',
        paragraphs: [
          'Earth and Fire are complementary but requiring. Fire wants to expand; Earth wants to consolidate. Fire thinks in terms of vision; Earth thinks in terms of process. The 55/100 reflects a pairing that works best when the Fire person provides direction and the Earth person provides the infrastructure to make that direction real.',
          'If their dynamic reflects this, it could mean Meghan\'s Leo clarity about who she was and what she needed provided the direction — and Harry\'s Virgo loyalty and service orientation made following that direction feel like the right thing, even when it required unprecedented choices. A Virgo who has decided that their primary loyalty is to a person rather than an institution will surprise everyone, including themselves.',
        ],
      },
      {
        heading: 'What the Departure Said',
        paragraphs: [
          'There is something astrologically consistent in the arc of their story: a Leo who required genuine recognition for who she was — not just for what role she fit — colliding with an institution that offered the opposite. And a Virgo who, when faced with the choice between duty to institution and loyalty to person, chose person.',
          'Harry\'s memoir Spare and their Netflix documentary represent an unusual level of public disclosure for someone with Virgo\'s typical privacy instinct — which could suggest that the need for truth-telling had outweighed the instinct toward discretion. Virgo will tell the truth carefully. When they tell it at all, it\'s because they have decided it matters.',
        ],
      },
      {
        callout: 'The Virgo instinct toward self-sacrifice and the Leo instinct toward authentic self-expression are not obviously compatible — until they find a common cause. A Virgo who has found a Leo\'s vision worth serving, and a Leo who has found a Virgo\'s loyalty worth trusting, is one of the more quietly powerful dynamics in any pairing.',
      },
    ],
    faqs: [
      { question: 'What is Prince Harry\'s zodiac sign?', answer: 'Prince Harry is a Virgo, born September 15, 1984. Virgo is an Earth sign ruled by Mercury, known for attentiveness, loyalty, a service orientation, and a tendency to prioritize the needs of others over their own.' },
      { question: 'What is Meghan Markle\'s zodiac sign?', answer: 'Meghan Markle is a Leo, born August 4, 1981. Leo is a Fire sign ruled by the Sun, known for warmth, leadership, a strong sense of identity, and a need for genuine recognition rather than performed acceptance.' },
      { question: 'Are Harry and Meghan compatible?', answer: 'Leo + Virgo is an Earth + Fire pairing that scores 55/100. The most workable version of this combination is one where the Leo provides vision and direction and the Virgo provides loyalty and follow-through — which appears to describe their dynamic fairly well.' },
    ],
    related: ['leo-in-love', 'virgo-in-love', 'moon-sign-compatibility'],
  },

  'david-and-victoria-beckham': {
    title: 'David & Victoria Beckham: 25 Years of a Taurus and an Aries',
    description: 'David Beckham is a Taurus. Victoria Beckham is an Aries. Earth + Fire scores 55/100 — adjacent signs with very different defaults. That they\'ve made it 25 years says something important about both of them.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Aries', sign2: 'Taurus',
    compatLink: '/compatibility/aries-and-taurus',
    intro: 'David Beckham (Taurus, May 2, 1975) and Victoria Beckham (Aries, April 17, 1974) married on July 4, 1999. They have four children — Brooklyn, Romeo, Cruz, and Harper. They have lived on three continents, navigated David\'s career across six clubs, and watched Victoria transform from a global pop star to a respected fashion designer. Twenty-five years is not nothing.',
    sections: [
      {
        heading: 'Aries and Taurus: Adjacent, Not Identical',
        paragraphs: [
          'Aries and Taurus are neighboring signs — which in astrology often means the relationship has a complementary quality, with each person offering something the other doesn\'t naturally have. Aries is cardinal fire: initiative, momentum, the instinct to move first and assess later. Taurus is fixed earth: loyalty, consistency, the instinct to build something that will last.',
          'Victoria\'s Aries arc is visible in her reinvention: from the choreography of a manufactured pop act to the genuinely rigorous world of high fashion, on her own terms, on her own timeline. That\'s Aries — the willingness to begin again, to not be defined by what came before. David\'s Taurus runs through everything he\'s done: the commitment to craft, the loyalty to family, the Venus-ruled aesthetic sensibility, and the patience to build a legacy across decades.',
        ],
      },
      {
        heading: 'Earth + Fire — 55/100',
        paragraphs: [
          'Earth and Fire can work, but not without effort. Fire moves quickly; Earth moves deliberately. Fire is animated by what\'s possible; Earth is motivated by what\'s real. A 55/100 reflects genuine compatibility alongside real friction points — particularly around pace and ambition.',
          'The key for an Aries-Taurus pairing is often that the Aries provides direction and the Taurus provides stability: the one who lights the fire, and the one who keeps it from burning everything down. If this describes their dynamic, Victoria\'s Aries drive could set the terms of what comes next, while David\'s Taurus reliability ensures the foundation holds regardless.',
        ],
      },
      {
        heading: 'The Work of Staying',
        paragraphs: [
          'Their partnership has not been without difficulty. David\'s career required constant relocation; there were public allegations and sustained tabloid scrutiny. Victoria has spoken openly about the work the marriage requires.',
          'Twenty-five years of a Taurus-Aries marriage doesn\'t happen on its own. It could suggest that the Taurus commitment to staying — to not walking away when things are hard — provided the container in which the Aries tendency to move, reinvent, and sometimes burn things down could happen safely. A Taurus who stays gives an Aries somewhere to return to.',
        ],
      },
      {
        callout: 'Two of the most publicly recognizable people in the world have kept the interior of their marriage largely private. That\'s very Taurus — the bull protects what it values. And it\'s very Aries — the ram knows when to move and when, finally, to stop.',
      },
    ],
    faqs: [
      { question: 'What is David Beckham\'s zodiac sign?', answer: 'David Beckham is a Taurus, born May 2, 1975. Taurus is an Earth sign ruled by Venus, known for loyalty, consistency, aesthetic sensibility, and a commitment to building things that last.' },
      { question: 'What is Victoria Beckham\'s zodiac sign?', answer: 'Victoria Beckham is an Aries, born April 17, 1974. Aries is a Fire sign ruled by Mars, known for initiative, ambition, the willingness to reinvent, and an instinct to lead rather than follow.' },
      { question: 'Are David and Victoria Beckham compatible?', answer: 'Aries + Taurus is a Fire + Earth pairing that scores 55/100. The complementary dynamic — Aries setting direction, Taurus providing stability — gives this pairing a working structure that can outlast its friction points when both people are committed to staying.' },
    ],
    related: ['aries-in-love', 'taurus-in-love', 'moon-sign-compatibility'],
  },

  'kourtney-kardashian-and-travis-barker': {
    title: 'Kourtney Kardashian & Travis Barker: When Aries Meets Scorpio',
    description: 'Kourtney Kardashian is an Aries. Travis Barker is a Scorpio. Fire + Water scores 55/100 — a pairing ruled by intensity on both sides. Their relationship has been nothing but that.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Aries', sign2: 'Scorpio',
    compatLink: '/compatibility/aries-and-scorpio',
    intro: 'Kourtney Kardashian (Aries, April 18, 1979) and Travis Barker (Scorpio, November 14, 1975) had been family friends for years before becoming a couple in 2021. They got engaged that same year, married in 2022, and welcomed their son Rocky Thirteen Barker in 2023. It happened fast — which is very Aries. And it went deep — which is very Scorpio.',
    sections: [
      {
        heading: 'Both Ruled by Mars',
        paragraphs: [
          'Before modern astrology assigned Scorpio to Pluto, both Aries and Scorpio were ruled by Mars — the planet of drive, desire, and raw force. That shared Martian energy creates an unusual resonance between two signs that seem very different on the surface. Aries is direct and hot-burning; Scorpio is controlled and deep-running. But both are capable of the same intensity, the same will, the same refusal to do anything halfway.',
          'Kourtney\'s Aries is visible in the directness she\'s been known for within the Kardashian circle — the one who pushed back, who had her own rhythms, who chose to be less manufactured than her sisters. Travis\'s Scorpio runs through everything: the tattoos, the music, the fierce loyalty, and the survival of a plane crash in 2008 that killed four people and left him with survivor\'s guilt he has spoken about publicly.',
        ],
      },
      {
        heading: 'Fire + Water — 55/100',
        paragraphs: [
          'Fire and Water are a tension pairing — exciting, sometimes volatile, but rarely neutral. Fire wants to move and express; Water wants to feel and deepen. The 55/100 reflects that this combination requires both people to stretch toward the other\'s mode.',
          'The risk in Fire + Water pairings is that the intensity that draws them together — the heat, the emotional charge — can tip into conflict if not channeled into shared direction. The opportunity is that Fire signs can help Water signs move forward when they\'d otherwise stay in the depth too long; Water signs can help Fire signs slow down and actually feel what\'s happening rather than always pushing ahead.',
        ],
      },
      {
        heading: 'The Long Friendship First',
        paragraphs: [
          'One of the more astrologically interesting aspects of their dynamic is that they were friends for years before anything romantic happened. That ground-laying is more consistent with Scorpio than Aries: Scorpio tends to know people for a long time before trusting them enough to go deep. Aries acts fast once they decide, but they can be patient before they decide.',
          'When they did commit, it was total. The public nature of their relationship — the visible devotion, the matching aesthetics, the very deliberate PDA — suggests two people leaning into their elements rather than moderating for each other. A shared child adds the element of permanent shared creation, which tends to give Aries-Scorpio pairings the mission they need.',
        ],
      },
      {
        callout: 'Travis Barker has described Kourtney as his best friend. That language matters — Scorpio doesn\'t use it lightly. And Aries doesn\'t stay for anything they don\'t fully choose.',
      },
    ],
    faqs: [
      { question: 'What is Kourtney Kardashian\'s zodiac sign?', answer: 'Kourtney Kardashian is an Aries, born April 18, 1979. Aries is a Fire sign ruled by Mars, known for directness, initiative, and a willingness to go all-in on what they want.' },
      { question: 'What is Travis Barker\'s zodiac sign?', answer: 'Travis Barker is a Scorpio, born November 14, 1975. Scorpio is a Water sign ruled by Pluto, known for intensity, loyalty, emotional depth, and a protectiveness over the things and people they love.' },
      { question: 'Are Kourtney and Travis compatible?', answer: 'Aries + Scorpio is a Fire + Water pairing that scores 55/100. Both signs are co-ruled by Mars, which creates an unusual resonance — shared intensity and drive — that can hold the friction of their different elements together when directed toward a common purpose.' },
    ],
    related: ['aries-in-love', 'scorpio-in-love', 'princess-diana-and-prince-charles'],
  },

  'chrissy-teigen-and-john-legend': {
    title: 'Chrissy Teigen & John Legend: A Sagittarius and a Capricorn Who Make It Work',
    description: 'Chrissy Teigen is a Sagittarius. John Legend is a Capricorn. Fire + Earth scores 55/100 — adjacent signs that operate differently. Together since 2006, married since 2013. Their longevity is the argument.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Sagittarius', sign2: 'Capricorn',
    compatLink: '/compatibility/sagittarius-and-capricorn',
    intro: 'Chrissy Teigen (Sagittarius, November 30, 1985) and John Legend (Capricorn, December 28, 1978) met on the set of his music video "Stereo" in 2006. They married in 2013 in Lake Como. They have four children together. And they have built one of the most genuinely candid public marriages in entertainment.',
    sections: [
      {
        heading: 'Where Sagittarius Meets Capricorn',
        paragraphs: [
          'Sagittarius is the philosopher of the zodiac — freedom-seeking, expansive, honest to the point of bluntness, and animated by adventure and meaning. Chrissy Teigen\'s public persona is a full expression of Sagittarius energy: unfiltered, globally curious, and constitutionally incapable of pretending to care about things she doesn\'t care about.',
          'Capricorn is the architect — disciplined, ambitious, driven by legacy, and willing to put in the sustained work that most signs find exhausting. John Legend\'s EGOT status (Grammy, Oscar, Emmy, Tony — one of very few people to achieve all four) is not luck or charm. It\'s Capricorn. It\'s decades of sustained, deliberate craft.',
        ],
      },
      {
        heading: 'Fire + Earth — 55/100',
        paragraphs: [
          'Fire and Earth need each other but don\'t always speak the same language. Fire thinks in terms of possibility and meaning; Earth thinks in terms of structure and outcomes. The 55/100 reflects the real difference in their default orientations.',
          'What often makes Sagittarius-Capricorn work is that the Sagittarius provides vision and the Capricorn builds the execution. One person expands the world; the other makes it solid. In a couple that has been together nearly two decades, this could mean Chrissy\'s range and radical authenticity and John\'s patient, sustained craft have found a productive counterbalance — each person offering what the other doesn\'t naturally have.',
        ],
      },
      {
        heading: 'Navigating the Hard Things',
        paragraphs: [
          'They have publicly navigated some of the most difficult experiences a couple can face: the loss of their son Jack in 2020, Chrissy\'s struggles with health and sobriety, and her own public reckoning with past online behavior. John stood beside her publicly through all of it.',
          'Capricorn is not the sign that leaves when things get hard. Loyalty that has been earned through shared history is a Capricorn core value. If their relationship reflects this dynamic, it could mean that John\'s Capricorn steadiness has been a structural element during years that demanded exactly that.',
        ],
      },
      {
        callout: 'Chrissy Teigen has described John as the calmest person she has ever met. That\'s a Sagittarius recognizing that the Capricorn\'s steadiness is something she doesn\'t naturally have — and choosing to stay near it.',
      },
    ],
    faqs: [
      { question: 'What is Chrissy Teigen\'s zodiac sign?', answer: 'Chrissy Teigen is a Sagittarius, born November 30, 1985. Sagittarius is a Fire sign ruled by Jupiter, known for directness, curiosity, adventure, and an honesty that can be both their greatest strength and their most complicated trait.' },
      { question: 'What is John Legend\'s zodiac sign?', answer: 'John Legend is a Capricorn, born December 28, 1978. Capricorn is an Earth sign ruled by Saturn, known for ambition, discipline, loyalty, and the capacity for sustained effort that produces enduring work.' },
      { question: 'Are Chrissy and John compatible?', answer: 'Sagittarius + Capricorn is a Fire + Earth pairing that scores 55/100. The complementary dynamic — Sagittarius bringing range and authenticity, Capricorn providing structure and follow-through — gives this pairing a working balance when both people lean into what they do naturally.' },
    ],
    related: ['sagittarius-in-love', 'capricorn-in-love', 'moon-sign-compatibility'],
  },

  'katy-perry-and-orlando-bloom': {
    title: 'Katy Perry & Orlando Bloom: How Scorpio and Capricorn Actually Work',
    description: 'Katy Perry is a Scorpio. Orlando Bloom is a Capricorn. Water + Earth scores 70/100 — a pairing built on depth and structure. On and off since 2016, engaged 2019, daughter born 2020.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Scorpio', sign2: 'Capricorn',
    compatLink: '/compatibility/scorpio-and-capricorn',
    intro: 'Katy Perry (Scorpio, October 25, 1984) and Orlando Bloom (Capricorn, January 13, 1977) met at a Golden Globes after-party in January 2016. They broke up. They reconciled. He proposed on Valentine\'s Day 2019. Their daughter Daisy Dove was born in August 2020. The persistence of this pairing — across breaks, timelines, and very different public profiles — is itself astrologically significant.',
    sections: [
      {
        heading: 'Scorpio and Capricorn: Depth and Structure',
        paragraphs: [
          'Scorpio and Capricorn have a natural affinity that isn\'t always obvious on the surface. Scorpio wants depth, intensity, and absolute loyalty. Capricorn wants structure, longevity, and someone willing to build something real rather than just feeling something. Those aren\'t identical needs, but they\'re compatible ones — each person offers what the other secretly requires.',
          'Katy Perry\'s Scorpio runs through the intensity of her artistic output: her music has always been emotionally extreme, oscillating between euphoria and devastation. The public persona is bright; the interior is something else. Orlando Bloom\'s Capricorn is visible in his career: methodical, sustained, diverse across decades — from Lord of the Rings to Pirates of the Caribbean to prestige television — and entirely without the chaotic highs and lows that many entertainment careers feature.',
        ],
      },
      {
        heading: 'Water + Earth — 70/100',
        paragraphs: [
          'Water and Earth are naturally complementary. Earth needs Water to stay alive; Water needs Earth or it loses its shape and disperses. In a relationship, this typically means the Water sign brings emotional depth and intuition, and the Earth sign provides grounding, structure, and the patience to wait for something real.',
          'The 70/100 reflects a genuinely workable compatibility. Where it requires attention is in pacing: Scorpio can move fast emotionally and demand intensity; Capricorn tends to move slowly and needs time before fully committing. The breaks they\'ve taken in their relationship could reflect exactly that tension — a Scorpio who reached an intensity point before a Capricorn was fully ready, and a Capricorn who eventually decided the depth was worth the commitment.',
        ],
      },
      {
        heading: 'The Return',
        paragraphs: [
          'The fact that they broke up and returned, broke up and returned, and eventually chose to build a family together is not accidental. Scorpio is a fixed sign: once they\'ve decided someone matters, they tend to orbit back. Capricorn is the sign that commits fully when they commit — but only when they\'re genuinely ready, not before.',
          'Daughter Daisy Dove, born August 2020, arrived during a year that changed most people\'s sense of what actually matters. For this particular pairing, the shared experience of that period may have been a grounding event that cemented what the breaks had clarified.',
        ],
      },
      {
        callout: 'A Scorpio who keeps coming back and a Capricorn who eventually commits to something permanent: that\'s not dysfunction. That\'s two people on different timelines finding the same destination.',
      },
    ],
    faqs: [
      { question: 'What is Katy Perry\'s zodiac sign?', answer: 'Katy Perry is a Scorpio, born October 25, 1984. Scorpio is a Water sign ruled by Pluto, known for emotional intensity, loyalty, depth, and a fixed nature that tends to stay in what matters and orbit back to what was lost.' },
      { question: 'What is Orlando Bloom\'s zodiac sign?', answer: 'Orlando Bloom is a Capricorn, born January 13, 1977. Capricorn is an Earth sign ruled by Saturn, known for patience, ambition, sustained effort, and a commitment that — once given — tends to be total.' },
      { question: 'Are Katy Perry and Orlando Bloom compatible?', answer: 'Scorpio + Capricorn is a Water + Earth pairing that scores 70/100. The natural complementarity of these elements — depth meeting structure — gives this combination genuine staying power when both people are patient enough to arrive at the same point at the same time.' },
    ],
    related: ['scorpio-in-love', 'capricorn-in-love', 'goldie-hawn-and-kurt-russell'],
  },

  'priyanka-chopra-and-nick-jonas': {
    title: 'Priyanka Chopra & Nick Jonas: When Cancer Meets Virgo',
    description: 'Priyanka Chopra is a Cancer. Nick Jonas is a Virgo. Water + Earth scores 70/100 — an emotionally intelligent pairing where attunement and care run both ways. Married 2018.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Virgo',
    compatLink: '/compatibility/cancer-and-virgo',
    intro: 'Priyanka Chopra (Cancer, July 18, 1982) and Nick Jonas (Virgo, September 16, 1992) married in December 2018, with ceremonies in both India and the United States. They have a 10-year age gap — Priyanka is older. They have a daughter, Malti Marie, born via surrogate in January 2022. And they\'ve built a genuinely global life across cultures, industries, and continents.',
    sections: [
      {
        heading: 'Two Signs That Show Love Through Care',
        paragraphs: [
          'Cancer and Virgo share something important: both signs express love through attentiveness rather than declaration. Cancer shows up emotionally — remembering what you said, knowing when you\'re off, creating a sense of home and safety. Virgo shows up practically — noticing what you need before you ask, managing the details so you don\'t have to, offering the kind of specific, considered care that most people reserve for themselves.',
          'Priyanka\'s Cancer is visible in her fierce devotion to family and culture — her mother has been a constant presence in her public life, and her Indian heritage is something she has consistently centered in an international career. Nick\'s Virgo runs through his professional precision: a performer since childhood, his output across music, film, and television has always reflected the Virgo commitment to craft over spectacle.',
        ],
      },
      {
        heading: 'Water + Earth — 70/100',
        paragraphs: [
          'Cancer and Virgo form a trine in the zodiac — 120 degrees apart — which in astrology represents natural ease and mutual understanding. The elements confirm it: Water and Earth support each other. Cancer\'s emotional depth and intuition have a container in Virgo\'s practical, grounded orientation. Virgo\'s occasional self-criticism has a softening influence in Cancer\'s warmth and acceptance.',
          'The 70/100 reflects this natural alignment. Not a friction-free relationship — no pairing is — but one with a fundamental compatibility in how both people orient toward care and commitment. Both signs are wired to show up, and they tend to recognize that in each other.',
        ],
      },
      {
        heading: 'The Intercultural Foundation',
        paragraphs: [
          'The 10-year age gap and the intercultural dimension of their marriage — Indian and American, Bollywood and Hollywood, different family traditions around what marriage and partnership mean — would challenge any pairing. What Cancer and Virgo bring to that challenge is complementary: Cancer provides the emotional anchor and the fierce prioritization of family as the center; Virgo is adaptable, service-oriented, and genuinely willing to flex toward what the relationship needs.',
          'They\'ve spoken openly about navigating different cultural expectations. The fact that both remain deeply embedded in their respective work while also choosing to prioritize family suggests a pairing where both signs\' core values — emotional security for Cancer, purposeful service for Virgo — are being met simultaneously.',
        ],
      },
      {
        callout: 'Priyanka Chopra once described her relationship with Nick as something that surprised her. That\'s very Cancer — the sign that protects itself deeply until someone gets through. When they do get through, the loyalty is total.',
      },
    ],
    faqs: [
      { question: 'What is Priyanka Chopra\'s zodiac sign?', answer: 'Priyanka Chopra is a Cancer, born July 18, 1982. Cancer is a Water sign ruled by the Moon, known for emotional depth, fierce loyalty, a protective instinct toward family, and an ability to create a sense of home wherever they are.' },
      { question: 'What is Nick Jonas\'s zodiac sign?', answer: 'Nick Jonas is a Virgo, born September 16, 1992. Virgo is an Earth sign ruled by Mercury, known for precision, attentiveness, adaptability, and a love that is demonstrated through consistent, practical care rather than grand declaration.' },
      { question: 'Are Priyanka Chopra and Nick Jonas compatible?', answer: 'Cancer + Virgo is a Water + Earth pairing that scores 70/100. The natural trine between these signs creates genuine ease — both are care-oriented, both show up, and both tend to recognize that quality immediately in the other.' },
    ],
    related: ['cancer-in-love', 'virgo-in-love', 'selena-gomez-and-benny-blanco'],
  },

  'will-smith-and-jada-pinkett-smith': {
    title: 'Will Smith & Jada Pinkett Smith: A Libra and a Virgo in a Long, Complicated Story',
    description: 'Will Smith is a Libra. Jada Pinkett Smith is a Virgo. Air + Earth scores 50/100. Married 1997. Separated 2016. Still married. It\'s complicated — and astrologically, that actually makes sense.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Virgo', sign2: 'Libra',
    compatLink: '/compatibility/virgo-and-libra',
    intro: 'Will Smith (Libra, September 25, 1968) and Jada Pinkett Smith (Virgo, September 18, 1971) married in December 1997. They have two children: Jaden and Willow. In 2023, Jada revealed in her memoir that they have been living separately since 2016. The marriage continues. It is, by almost any measure, one of the most publicly scrutinized — and most privately complex — relationships in Hollywood.',
    sections: [
      {
        heading: 'Adjacent Signs, Different Defaults',
        paragraphs: [
          'Libra and Virgo sit next to each other in the zodiac, which often creates a relationship with complementary qualities alongside real friction. Libra is the sign of harmony and partnership — idealistic about love, oriented around fairness, and with a deep desire to be seen in relationship. Virgo is the sign of discernment and service — pragmatic about love, oriented around improvement, and with a belief that real love is demonstrated through attention rather than romantic performance.',
          'Will Smith\'s Libra is visible in his entire public persona: the charm, the broad appeal, the genuine desire to be liked, and the instinct to maintain harmony even when internal reality is more complicated. Jada Pinkett Smith\'s Virgo runs through her approach to her own work — the surgical precision of Red Table Talk, her willingness to examine uncomfortable truths directly, her preference for what\'s real over what\'s performed.',
        ],
      },
      {
        heading: 'Air + Earth — 50/100',
        paragraphs: [
          'Air and Earth are not natural companions. Air lives in ideas and social interaction; Earth lives in the tangible and enduring. Air can find Earth limiting; Earth can find Air insufficiently grounded. The 50/100 reflects a pairing that requires deliberate, ongoing translation between two genuinely different orientations.',
          'For Libra and Virgo specifically, the challenge often lives in how they process difficulty. Libra tends toward conflict-avoidance — maintaining the appearance of harmony even when it requires internal suppression. Virgo tends toward direct assessment — naming what\'s wrong even when it\'s uncomfortable. Over 25-plus years, those defaults could produce a particular kind of relational exhaustion that neither sign would necessarily say out loud.',
        ],
      },
      {
        heading: 'The Complexity of Staying',
        paragraphs: [
          'Jada\'s 2023 revelations reframed decades of public understanding of their relationship. What read as a successful Hollywood marriage turned out to be something more nuanced and more deliberate — two people who had chosen each other, then chose a form of separation, then continued to choose each other in some altered form.',
          'Whether their continued legal marriage reflects Libra\'s deep belief in partnership even when partnership requires unconventional shape — or something more complicated — is not something a birth chart can resolve. But both signs are capable of staying in difficulty longer than most. Virgo because they\'re working on it. Libra because they believe in the relationship even when the reality is hard.',
        ],
      },
      {
        callout: 'The most interesting thing about their public story isn\'t the complexity — it\'s that both of them have chosen transparency about it. A Virgo willing to tell the truth about what\'s real, and a Libra willing to hold the space publicly: that\'s a partnership, even when it\'s not a conventional one.',
      },
    ],
    faqs: [
      { question: 'What is Will Smith\'s zodiac sign?', answer: 'Will Smith is a Libra, born September 25, 1968. Libra is an Air sign ruled by Venus, known for charm, a deep investment in partnership, an instinct toward harmony, and a genuine desire for fairness in relationship.' },
      { question: 'What is Jada Pinkett Smith\'s zodiac sign?', answer: 'Jada Pinkett Smith is a Virgo, born September 18, 1971. Virgo is an Earth sign ruled by Mercury, known for discernment, directness, a high standard for what is real, and love expressed through attentiveness and honest assessment.' },
      { question: 'Are Will Smith and Jada Pinkett Smith compatible?', answer: 'Libra + Virgo is an Air + Earth pairing that scores 50/100. The most challenging aspect of this combination is the gap between Libra\'s instinct toward maintaining harmony and Virgo\'s instinct toward naming what\'s actually true — a tension that, over decades, requires ongoing and deliberate navigation.' },
    ],
    related: ['libra-in-love', 'virgo-in-love', 'red-flags-by-zodiac-sign'],
  },

  'tom-brady-and-gisele-bundchen': {
    title: 'Tom Brady & Gisele Bündchen: A Leo and a Cancer After the Final Whistle',
    description: 'Tom Brady is a Leo. Gisele Bündchen is a Cancer. Fire + Water scores 60/100 — a pairing with genuine warmth and real incompatibilities. They were married for 13 years. They divorced in 2022.',
    publishDate: '2026-05-08',
    readTime: '6 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Leo',
    compatLink: '/compatibility/cancer-and-leo',
    intro: 'Tom Brady (Leo, August 3, 1977) and Gisele Bündchen (Cancer, July 20, 1980) married in February 2009. They divorced in October 2022, after 13 years. They have two children together — Vivian and Benjamin — and Tom co-parents Jack from a prior relationship. Their split, coming shortly after Tom\'s decision to un-retire from the NFL, became one of the most discussed relationship stories of that year.',
    sections: [
      {
        heading: 'The Sun and the Moon',
        paragraphs: [
          'In traditional astrology, Leo is ruled by the Sun and Cancer is ruled by the Moon — which gives this pairing a quality of elemental symbolism. The Sun radiates outward, governs identity, and needs to shine. The Moon receives, governs the interior life, and needs to feel safe and held. In a relationship, this can create a powerful initial attraction that becomes more complicated under sustained pressure.',
          'Tom Brady\'s Leo is visible in everything: the on-field dominance, the expectation of being at the center of what matters, and the choice to keep coming back long after most people would have stopped. Leo has difficulty accepting that the arena they love might need to change. Gisele Bündchen\'s Cancer shows up in her priorities: family, home, stability, and the deep need for the people she loves to be physically safe.',
        ],
      },
      {
        heading: 'Fire + Water — 60/100',
        paragraphs: [
          'Fire and Water are attracted to each other and can exhaust each other simultaneously. Fire generates heat; Water moderates it. Fire seeks expansion; Water seeks depth. In the best version, one person\'s energy is contained and given direction by the other\'s emotional intelligence. In the strained version, the Fire feels suffocated and the Water feels perpetually drained.',
          'The 60/100 reflects genuine compatibility alongside a meaningful tension point — particularly around the question of home versus career, security versus visibility. Both those things mattered. The question is which one came first.',
        ],
      },
      {
        heading: 'The Un-retirement',
        paragraphs: [
          'Gisele has spoken publicly about her discomfort with Tom\'s continued NFL career — the physical risk, the extended time away, the competing priority to family. When Tom retired in February 2022 and then unretired 40 days later, it reportedly precipitated the end of their marriage.',
          'That sequence — a Leo choosing the field over the family center that Cancer needs — is one of the more astrologically legible moments in this relationship. Cancer needs to feel that the home is the primary axis. Leo needs to feel that their arena remains accessible. When those two needs cannot coexist, the tension finds its resolution.',
        ],
      },
      {
        heading: 'After',
        paragraphs: [
          'Tom retired fully in February 2023 and has since moved into broadcasting. Gisele has been based in Miami with their children. Both have spoken about maintaining a co-parenting relationship that puts the children first. That Cancer priority — protecting the family structure even after the couple structure ends — is consistent.',
        ],
      },
      {
        callout: 'There\'s a particular quality to a Leo-Cancer separation that happens because the Leo\'s arena and the Cancer\'s home couldn\'t occupy the same space. The attraction was real. The incompatibility was also real. Both things can be true at once.',
      },
    ],
    faqs: [
      { question: 'What is Tom Brady\'s zodiac sign?', answer: 'Tom Brady is a Leo, born August 3, 1977. Leo is a Fire sign ruled by the Sun, known for confidence, a drive to excel in a chosen arena, natural leadership, and a fixed nature that tends to pursue what it loves well past the point most people would stop.' },
      { question: 'What is Gisele Bündchen\'s zodiac sign?', answer: 'Gisele Bündchen is a Cancer, born July 20, 1980. Cancer is a Water sign ruled by the Moon, known for emotional depth, fierce loyalty to family, a protective instinct, and a fundamental need for stability and safety in the people they love.' },
      { question: 'Were Tom Brady and Gisele Bündchen compatible?', answer: 'Leo + Cancer is a Fire + Water pairing that scores 60/100. The Sun-Moon symbolism creates a genuine initial attraction, and the relationship produced 13 years of marriage and a family. The central tension — Leo\'s need to stay in their arena versus Cancer\'s need for home to be the primary axis — ultimately defined what ended it.' },
    ],
    related: ['cancer-in-love', 'leo-in-love', 'selena-gomez-and-benny-blanco'],
  },

  'megan-fox-and-machine-gun-kelly': {
    title: 'Megan Fox & Machine Gun Kelly: Two Tauruses, One Story',
    description: 'Megan Fox is a Taurus. Machine Gun Kelly is a Taurus. Same sign, Earth + Earth scores 70/100 — deep recognition and a shared stubborn streak. Engaged 2022. Intensely public. Complicated.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Taurus', sign2: 'Taurus',
    compatLink: '/compatibility/taurus-and-taurus',
    intro: 'Megan Fox (Taurus, May 16, 1986) and Machine Gun Kelly — Colson Baker (Taurus, April 22, 1990) — met on the set of Midnight in the Switchgrass in 2020. They got engaged in January 2022 with a ring containing each other\'s birthstones. Their relationship has been intensely public, intensely passionate, and periodically rocky — which is, for two fixed Earth signs, almost exactly what you\'d expect.',
    sections: [
      {
        heading: 'The Same-Sign Recognition',
        paragraphs: [
          'Taurus is a fixed earth sign ruled by Venus — the planet of beauty, desire, and aesthetic experience. Two Tauruses share the same core: the deep sensuality, the appreciation for beauty in all forms, the need for loyalty and consistency, and the stubbornness that is the shadow of that same fixed nature.',
          'Megan Fox\'s Taurus is visible in her aesthetic sensibility and the steadiness underneath a public persona that has always been more surface than substance. She is more guarded and more thoughtful than the roles she\'s been given, and the fixedness of Taurus means she has held her ground across two decades in an industry that has tried, repeatedly, to define her. MGK\'s Taurus shows in his investment in his artistic image — the careful cultivation of a look, a sound, a world — and in the Venus-ruled affection that runs through his most personal music.',
        ],
      },
      {
        heading: 'Earth + Earth — 70/100',
        paragraphs: [
          'Two Earth signs share a fundamental compatibility: both people orient toward the tangible, the committed, the real. Earth signs don\'t love lightly. They\'re slow to open, deep when they do, and not inclined toward casual. Two Tauruses together tend to build a world between themselves — a shared aesthetic, a shared private space, a shared sense of what home means.',
          'The 70/100 reflects natural ease alongside the particular challenge of two fixed signs: when they disagree, both people hold. Taurus stubbornness — the immovability that is both their greatest strength and their most consistent difficulty — doubles in a same-sign pairing. Reconciliations tend to be real; impasses, when they happen, can also be total.',
        ],
      },
      {
        heading: 'The Visibility of It',
        paragraphs: [
          'One of the notable features of their relationship has been its visibility: the public devotion, the matching aesthetics, the declarations. This is very Taurus — the sign that marks what it values, that displays care and affection in concrete and visible ways. Both of them leaning into the public expression of their relationship is consistent with Venus-ruled energy.',
          'Whether the public expression has always matched the private reality is genuinely unknowable. What can be said is that the intensity — the love and the difficulty in roughly equal measure — is itself very Taurus. They feel things fully, they commit fully, they don\'t do things halfway.',
        ],
      },
      {
        callout: 'Two Tauruses falling for each other have a recognition most couples never find: the immediate sense of meeting someone who needs the same things, values the same things, and will stay. The question with fixed signs is always whether staying means growing — or holding on past the point of growth.',
      },
    ],
    faqs: [
      { question: 'What is Megan Fox\'s zodiac sign?', answer: 'Megan Fox is a Taurus, born May 16, 1986. Taurus is an Earth sign ruled by Venus, known for sensuality, loyalty, aesthetic depth, and a fixed nature that commits deeply and holds positions with equal conviction.' },
      { question: 'What is Machine Gun Kelly\'s zodiac sign?', answer: 'Machine Gun Kelly (Colson Baker) is a Taurus, born April 22, 1990. As a fellow Taurus, he shares Megan\'s Venus-ruled orientation — the deep aesthetic investment, the need for loyalty, and the same stubborn core that makes Taurus both the most devoted and the most immovable sign.' },
      { question: 'Are Megan Fox and MGK compatible?', answer: 'Taurus + Taurus is an Earth + Earth same-sign pairing that scores 70/100. The mutual recognition is immediate and deep; the primary challenge is that both people\'s fixed nature means conflicts can become standoffs. The key is directing that shared stubbornness toward the relationship rather than at each other.' },
    ],
    related: ['taurus-in-love', 'steph-and-ayesha-curry', 'moon-sign-compatibility'],
  },

  'johnny-cash-and-june-carter-cash': {
    title: 'Johnny Cash & June Carter Cash: A Pisces and a Cancer Who Found Each Other Twice',
    description: 'Johnny Cash was a Pisces. June Carter Cash was a Cancer. Water + Water scores 80/100 — one of the most enduring love stories in American music, and one of the more astrologically coherent pairings in celebrity history.',
    publishDate: '2026-05-08',
    readTime: '7 min read',
    category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Johnny Cash (Pisces, February 26, 1932) and June Carter Cash (Cancer, June 23, 1929) married on March 1, 1968, after years of orbiting each other through music, faith, and a complicated attraction that each of them fought against and eventually stopped fighting. They remained married until June\'s death in May 2003. Johnny Cash died four months later. He was 71.',
    sections: [
      {
        heading: 'Pisces and Cancer: Deep Water Finding Deep Water',
        paragraphs: [
          'Pisces is the sign of boundless empathy, spiritual sensitivity, and the kind of feeling that most people can\'t sustain and some people can\'t access at all. Johnny Cash\'s Pisces runs through everything in his catalog: the sympathy for the outcast, the moral weight of songs like "Hurt" and "Man in Black," the willingness to sit in darkness without flinching. It runs through his demons too — addiction, self-destruction, and a soul that felt too much and often found the wrong container for that feeling.',
          'Cancer is the sign of deep care, fierce loyalty, and the knowledge that home isn\'t a place — it\'s a person. June Carter Cash\'s Cancer expressed itself in her music, her humor (she was genuinely funny, often overlooked), and in her decision to stand by Johnny during the years when standing by him was genuinely costly. She helped him get sober. She stayed when it would have been easier to leave. That\'s not sentiment — that\'s Cancer.',
        ],
      },
      {
        heading: 'Water + Water — 80/100',
        paragraphs: [
          'Two Water signs together have a depth of emotional resonance that other pairings often approximate but rarely equal. The 80/100 reflects what\'s real: Pisces and Cancer are mutually supportive. Cancer provides the emotional security and grounding that Pisces desperately needs; Pisces provides the empathy and emotional imagination that Cancer finds hard to find anywhere else.',
          'If there\'s a famous couple whose enduring love story is legible through astrology, it may be this one. June\'s Cancer loyalty was not passive — she actively chose to help Johnny get sober, to build a life with someone whose Pisces depths could have pulled them both under. Her Cancer instinct — to protect what she loved and to make a home out of a person — could mean she gave him somewhere to return to when the water got too deep.',
        ],
      },
      {
        heading: '"Hurt" and What It Means',
        paragraphs: [
          'Johnny Cash\'s 2002 cover of Nine Inch Nails\' "Hurt" is one of the most emotionally significant recordings in American music. What gives it its weight is not just the age in his voice — it\'s the Pisces quality of total surrender to feeling. The music video features June Carter prominently. She reportedly cried watching the final edit.',
          'There are photographs from that period that have circulated widely: Cash at the piano, June behind him, his hand reaching for hers. That\'s a Pisces moment — the artist at the end of his creative life, still reaching toward the person who represented everything real.',
        ],
      },
      {
        heading: 'Forty Days',
        paragraphs: [
          'Johnny Cash died on September 12, 2003 — 116 days after June. People who knew them have described him as having simply stopped wanting to be alive once she was gone. That is not something astrology can explain fully. But it is consistent with what Water signs are capable of: a bond so deep that "life without" is not a concept they can inhabit.',
        ],
      },
      {
        callout: 'He proposed to her onstage in 1968, in front of thousands of people. For a Pisces who felt everything and a Cancer who held everyone, the love story took the shape it needed to take, exactly when it needed to.',
      },
    ],
    faqs: [
      { question: 'What is Johnny Cash\'s zodiac sign?', answer: 'Johnny Cash was a Pisces, born February 26, 1932. Pisces is a Water sign ruled by Neptune, known for deep empathy, spiritual sensitivity, artistic vision, and an emotional range that encompasses both great tenderness and great darkness.' },
      { question: 'What is June Carter Cash\'s zodiac sign?', answer: 'June Carter Cash was a Cancer, born June 23, 1929. Cancer is a Water sign ruled by the Moon, known for fierce loyalty, emotional attunement, a protective instinct, and the capacity to create a sense of home and safety for the people they love.' },
      { question: 'Were Johnny Cash and June Carter compatible?', answer: 'Pisces + Cancer is a Water + Water pairing that scores 80/100. The mutual emotional attunement between these two signs — Cancer\'s grounding loyalty meeting Pisces\'s empathic depth — produces one of the most naturally resonant pairings in the zodiac. Their story reflects that fully.' },
    ],
    related: ['cancer-in-love', 'pisces-in-love', 'moon-sign-compatibility'],
  },

  'adele-and-rich-paul': {
    title: 'Adele & Rich Paul: The Taurus and the Sagittarius',
    description: 'Adele is a Taurus. Rich Paul is a Sagittarius. Earth + Fire scores 50/100 — a pairing that looks unlikely on paper and has outlasted most predictions. Together since 2021.',
    publishDate: '2026-05-08',
    readTime: '5 min read',
    category: 'couple',
    sign1: 'Taurus', sign2: 'Sagittarius',
    compatLink: '/compatibility/taurus-and-sagittarius',
    intro: 'Adele (Taurus, May 5, 1988) and Rich Paul (Sagittarius, December 16, 1981) started dating in 2021, became public at the NBA Finals in July of that year, and have been together since — through Adele\'s Las Vegas residency, her global resurgence with 30, and the quiet life she has sought outside her massive public presence. Rich Paul is one of the most powerful sports agents in the world, representing LeBron James and dozens of other elite athletes.',
    sections: [
      {
        heading: 'Fixed Earth Meets Mutable Fire',
        paragraphs: [
          'Taurus and Sagittarius are what astrology calls an inconjunct pair — 150 degrees apart — which means they don\'t share element, modality, or polarity. Taurus is Fixed Earth: stable, sensory, rooted, loyalty-first. Sagittarius is Mutable Fire: mobile, expansive, truth-seeking, restless in the best and most difficult senses.',
          'Adele\'s Taurus is present in her art in a way that\'s nearly impossible to separate from the person: her music is about what she keeps, what she held onto too long, what she finally let go when the grief of holding it became heavier than the grief of release. That\'s Taurus — the sign that stays, that values depth and constancy, that processes through feeling rather than around it. Rich Paul\'s Sagittarius is visible in the scope of what he\'s built — Klutch Sports, constructed from nothing on the strength of direct relationships, philosophical vision, and the Sagittarian instinct for finding the bigger game.',
        ],
      },
      {
        heading: 'Earth + Fire — 50/100',
        paragraphs: [
          'The 50/100 reflects genuine friction alongside real appeal. Earth and Fire don\'t naturally share a language: Taurus wants to stay; Sagittarius wants to move. Taurus values what\'s built over time; Sagittarius values what\'s discovered next. These aren\'t irreconcilable, but they require ongoing translation.',
          'What makes a Taurus-Sagittarius pairing work is usually mutual respect for what the other person is doing. Adele doesn\'t need Rich Paul to be still; Rich Paul doesn\'t need Adele to constantly expand. But both people need to feel that their fundamental nature isn\'t being asked to stop.',
        ],
      },
      {
        heading: 'Two Private Public People',
        paragraphs: [
          'Both are enormously public figures who have carefully preserved real privacy in their relationship. Adele has not made this relationship a subject of her art the way she made her divorce a subject of her art. Rich Paul has spoken about his personal life selectively.',
          'That mutual guardedness — Taurus protecting its home territory, Sagittarius protecting its freedom — may be one of the things that\'s allowed this to last. What lives between them appears to have been kept there.',
        ],
      },
      {
        callout: 'Adele has described Rich Paul as someone who makes her feel secure. For a Taurus who has spent years rebuilding after loss, finding someone who offers that — in a Sagittarius form, which means presence without possession — could be precisely what she needed.',
      },
    ],
    faqs: [
      { question: 'What is Adele\'s zodiac sign?', answer: 'Adele is a Taurus, born May 5, 1988. Taurus is an Earth sign ruled by Venus, known for emotional depth, loyalty, sensory attunement, and the kind of love that processes through staying rather than moving on.' },
      { question: 'What is Rich Paul\'s zodiac sign?', answer: 'Rich Paul is a Sagittarius, born December 16, 1981. Sagittarius is a Fire sign ruled by Jupiter, known for expansiveness, directness, strategic vision, and a philosophical approach to both career and life.' },
      { question: 'Are Adele and Rich Paul compatible?', answer: 'Taurus + Sagittarius is an Earth + Fire pairing that scores 50/100. The inconjunct relationship between these signs requires ongoing translation, but pairings that outlast prediction often do so because both people have found something in the other that their own nature can\'t provide — and have chosen to stay near it.' },
    ],
    related: ['taurus-in-love', 'sagittarius-in-love', 'moon-sign-compatibility'],
  },

  'elizabeth-taylor-and-richard-burton': {
    title: 'Elizabeth Taylor & Richard Burton: The Scorpio and the Pisces Who Couldn\'t Stay Apart',
    description: 'Elizabeth Taylor was a Pisces. Richard Burton was a Scorpio. Water + Water scores 80/100 — and they married each other twice. One of Hollywood\'s most passionate and turbulent love stories.',
    publishDate: '2026-05-08', readTime: '6 min read', category: 'couple',
    sign1: 'Scorpio', sign2: 'Pisces',
    compatLink: '/compatibility/scorpio-and-pisces',
    intro: 'Elizabeth Taylor (Pisces, February 27, 1932) and Richard Burton (Scorpio, November 10, 1925) first met on the set of Cleopatra in 1963, both married to other people. What followed was one of the most documented love affairs in film history — two marriages, one divorce between them, affairs, reconciliations, and a bond that neither of them ever fully severed.',
    sections: [
      { heading: 'Scorpio and Pisces: The Water That Drowns and Saves', paragraphs: ['Scorpio is fixed water — intense, possessive, loyal to the point of obsession. Pisces is mutable water — fluid, empathic, romantic in a way that can idealize the object of its love past any reasonable limit. Together, they create a pairing where the depth is enormous and the turbulence is equally so.', 'Richard Burton\'s Scorpio was total: the commanding stage presence, the dark charisma, the alcoholism, the loyalty that coexisted with infidelity. Elizabeth Taylor\'s Pisces was equally total: the extraordinary emotional openness, the serial marriage, the ability to feel things — grief, love, illness, recovery — with a fullness that most people find terrifying and irresistible in equal measure.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs at their best offer each other a depth of emotional recognition that no other combination quite matches. The 80/100 reflects what was genuine: when Scorpio and Pisces connect, the connection is real, felt, and hard to replicate with anyone else.', 'The turbulence — the fights, the public rows, the drinking, the press — is also part of the Water + Water story. Neither sign has good brakes. The intensity that creates the love also fuels the volatility. The same depth that makes them feel understood by each other is the depth from which the damage comes when things go wrong.'] },
      { heading: 'Two Marriages', paragraphs: ['They married in 1964. They divorced in 1974. They remarried in 1975. They divorced again in 1976. The fact of two marriages is itself the most astrologically legible thing about them: Scorpio doesn\'t let go. Pisces never stops believing. The pattern of breaking and returning is not a dysfunction — it\'s the pattern these two signs produce when they\'re together.', 'Burton died in 1984. Taylor remained married and widowed several more times. She has spoken of him as the love of her life.'] },
      { callout: 'He once said of her: "She is a wildly exciting love partner." She said of him: "He was the only man I\'d met who was as strong as I was." A Scorpio and a Pisces, both of them at full intensity, both of them too much for almost anyone else.' },
    ],
    faqs: [
      { question: 'What is Elizabeth Taylor\'s zodiac sign?', answer: 'Elizabeth Taylor was a Pisces, born February 27, 1932. Pisces is a Water sign known for emotional depth, romantic idealism, and a capacity for love that is total and sometimes self-destructive.' },
      { question: 'What is Richard Burton\'s zodiac sign?', answer: 'Richard Burton was a Scorpio, born November 10, 1925. Scorpio is a Water sign known for intensity, dark charisma, loyalty, and a possessiveness that can be both the most compelling and most difficult thing about them.' },
      { question: 'Were Elizabeth Taylor and Richard Burton compatible?', answer: 'Scorpio + Pisces is a Water + Water pairing that scores 80/100. The depth of emotional resonance is genuine; so is the potential for turbulence when two people who feel everything are in the same room.' },
    ],
    related: ['scorpio-in-love', 'pisces-in-love', 'goldie-hawn-and-kurt-russell'],
  },

  'marilyn-monroe-and-joe-dimaggio': {
    title: 'Marilyn Monroe & Joe DiMaggio: A Gemini and a Sagittarius Who Couldn\'t Bridge the Gap',
    description: 'Marilyn Monroe was a Gemini. Joe DiMaggio was a Sagittarius. Opposite signs, Air + Fire, 65/100 — magnetic across the axis but unable to sustain it. They were married 9 months.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Sagittarius',
    compatLink: '/compatibility/gemini-and-sagittarius',
    intro: 'Marilyn Monroe (Gemini, June 1, 1926) and Joe DiMaggio (Sagittarius, November 25, 1914) married in January 1954. They divorced nine months later, in October 1954. DiMaggio never stopped loving her. He had flowers sent to her grave three times a week for 20 years after her death in 1962.',
    sections: [
      { heading: 'Opposite Signs, Opposite Needs', paragraphs: ['Gemini and Sagittarius sit directly across the zodiac from each other — 180 degrees apart, what astrology calls an opposition. Opposite signs share an axis (in this case, the axis of thought and philosophy, meaning and communication) but express it in entirely different ways. Gemini moves fast, adapts, collects ideas and perspectives. Sagittarius moves toward a single truth, a vision, a conviction.', 'Marilyn\'s Gemini was visible in her multiplicity: the public persona versus the private person, the comedy versus the devastation, the performance versus the deep intelligence. Joe DiMaggio\'s Sagittarius was one-directional: his devotion was total and his vision of what he wanted — a private wife, a domestic life, away from cameras — was fixed.'] },
      { heading: 'Air + Fire — 65/100', paragraphs: ['Opposite signs often produce the most magnetic attractions — each person represents something the other lacks and secretly wants. For Gemini and Sagittarius, the attraction can feel like completing each other: the one who moves in all directions finding the one with a clear destination; the one with a vision finding the one who can articulate it in a hundred different ways.', 'The 65/100 reflects the genuine attraction alongside the fundamental incompatibility: the specific needs of Gemini (freedom, multiplicity, public life) and Sagittarius (truth, commitment, eventually a home) can pull in different directions under sustained pressure.'] },
      { heading: 'The Flowers', paragraphs: ['Joe DiMaggio ordered roses sent to Marilyn\'s crypt three times a week for 20 years. He never remarried. When she died, he claimed her body when her ex-husbands did not. That\'s Sagittarius: the devotion, once given, tends to outlast the object. The same single-mindedness that made him difficult to be married to made him faithful to her memory in a way that transcended the marriage itself.'] },
      { callout: 'They couldn\'t sustain what they had built together. But he never left. That\'s the particular tragedy of a Sagittarius who loved a Gemini past the end of the relationship — the fire keeps burning after the air has moved on.' },
    ],
    faqs: [
      { question: 'What is Marilyn Monroe\'s zodiac sign?', answer: 'Marilyn Monroe was a Gemini, born June 1, 1926. Gemini is an Air sign known for adaptability, charm, wit, and a duality that made her both the world\'s most recognized icon and a deeply private person.' },
      { question: 'What is Joe DiMaggio\'s zodiac sign?', answer: 'Joe DiMaggio was a Sagittarius, born November 25, 1914. Sagittarius is a Fire sign known for loyalty to a vision, directness, and a devotion that — once committed — tends not to waver.' },
      { question: 'Were Marilyn Monroe and Joe DiMaggio compatible?', answer: 'Gemini + Sagittarius is an opposition pairing that scores 65/100. The magnetic attraction of opposite signs is real; the friction that comes from fundamentally different needs — Gemini\'s need for freedom and multiplicity versus Sagittarius\'s need for a clear, committed direction — is equally real.' },
    ],
    related: ['gemini-in-love', 'sagittarius-in-love', 'brad-pitt-and-angelina-jolie'],
  },

  'marilyn-monroe-and-arthur-miller': {
    title: 'Marilyn Monroe & Arthur Miller: When Gemini Met Libra',
    description: 'Marilyn Monroe was a Gemini. Arthur Miller was a Libra. Air + Air scores 75/100 — an intellectual pairing between America\'s most photographed woman and its most celebrated playwright.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Libra',
    compatLink: '/compatibility/gemini-and-libra',
    intro: 'Marilyn Monroe (Gemini, June 1, 1926) and Arthur Miller (Libra, October 17, 1915) married in June 1956, days after she converted to Judaism. He was "America\'s playwright" — Death of a Salesman, The Crucible, All My Sons. She was the most famous woman in the world. They were together for five years.',
    sections: [
      { heading: 'Two Air Signs, One Intellectual Current', paragraphs: ['Gemini and Libra are both Air signs — both oriented toward ideas, language, communication, and the exchange of perspectives. Gemini is quick, adaptive, multi-directional. Libra is thoughtful, aesthetic, committed to balance and beauty. Together they produce a pairing where the conversation is fluent and the mental connection is real.', 'Marilyn Monroe was, by every account who knew her, a serious reader and a serious thinker. The public persona was constructed to serve the industry; the private person read Dostoyevsky and studied at the Actors Studio. Arthur Miller represented the intellectual world she had always wanted access to — and she represented something he couldn\'t fully name or contain.'] },
      { heading: 'Air + Air — 75/100', paragraphs: ['Two Air signs together tend to produce strong mental rapport — the kind of pairing where both people feel genuinely understood in their thinking, not just their emotion. The 75/100 reflects that this combination works well at the level of ideas and communication, which is often where lasting relationships are built.', 'Where Air + Air requires attention is in the practical and emotional dimensions. Both signs can intellectualize experience — explaining feelings rather than fully inhabiting them. For a Pisces-Moon (Marilyn\'s reported Moon sign) in a Gemini body, the need for emotional grounding was acute. A Libra, even a devoted one, can offer equity and beauty but sometimes struggles with the kind of raw emotional presence that Pisces needs.'] },
      { heading: 'After', paragraphs: ['They divorced in 1961, the same year The Misfits — for which Miller wrote the screenplay specifically for Monroe — was released. She died in 1962. He spent years writing about the experience, including his 1987 play Timebends, a memoir that grappled with what they had been to each other. A Libra processing loss through language and reflection: that\'s consistent.' ] },
      { callout: 'She once said: "I used to think as I looked at the Hollywood night, \'There must be thousands of girls sitting alone like me dreaming of becoming a movie star.\' But I\'m not going to worry about them. I\'m dreaming the hardest." That\'s Gemini: the dream, the self-awareness about the dream, and the refusal to stop anyway.' },
    ],
    faqs: [
      { question: 'What is Arthur Miller\'s zodiac sign?', answer: 'Arthur Miller was a Libra, born October 17, 1915. Libra is an Air sign known for intellect, aesthetic sensibility, a commitment to balance and justice, and relationships built on genuine partnership of mind.' },
      { question: 'Were Marilyn Monroe and Arthur Miller compatible?', answer: 'Gemini + Libra is an Air + Air pairing that scores 75/100. The mental connection is genuine and fluent; the challenge is whether the Air + Air dynamic offers enough emotional grounding for a Gemini who needs both intellectual stimulation and deep feeling.' },
      { question: 'How long were Marilyn Monroe and Arthur Miller together?', answer: 'They married in June 1956 and divorced in 1961, having been together for approximately five years. He wrote about their relationship for the rest of his life.' },
    ],
    related: ['gemini-in-love', 'libra-in-love', 'marilyn-monroe-and-joe-dimaggio'],
  },

  'john-lennon-and-yoko-ono': {
    title: 'John Lennon & Yoko Ono: A Libra and an Aquarius Who Changed What Love Could Look Like',
    description: 'John Lennon was a Libra. Yoko Ono is an Aquarius. Air + Air scores 75/100 — two visionaries who made their relationship a public act of peace. Together from 1968 until his death in 1980.',
    publishDate: '2026-05-08', readTime: '6 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Aquarius',
    compatLink: '/compatibility/libra-and-aquarius',
    intro: 'John Lennon (Libra, October 9, 1940) and Yoko Ono (Aquarius, February 18, 1933) met in November 1966 at her art exhibition at the Indica Gallery in London. They married in March 1969. The Bed-In for Peace happened that same month. They were inseparable — artistically, politically, domestically — until his murder in December 1980.',
    sections: [
      { heading: 'Two Air Signs Who Made Ideas into Action', paragraphs: ['Libra and Aquarius are both Air signs, but they express that Air very differently. Libra is relational, aesthetic, oriented around partnership and balance. Aquarius is visionary, humanitarian, oriented around the collective and the future. Together they produce a pairing where both people can talk endlessly, disagree productively, and combine art with activism.', 'John\'s Libra was in the music — the melodic beauty, the partnership (his work with Paul McCartney was a famous Libra-style creative relationship), and the deep need to be in a committed creative and romantic partnership. Yoko\'s Aquarius was in the art — the conceptual, ahead-of-its-time work that much of the public rejected in 1969 and much of the world came to appreciate by the 1990s.'] },
      { heading: 'Air + Air — 75/100', paragraphs: ['Two Air signs together produce the kind of relationship where the meeting of minds is immediate and sustained. The 75/100 reflects genuine compatibility at the level of ideas, communication, and shared vision — which is often what the most enduring partnerships are built from.', 'What\'s particularly notable about this pairing is that their relationship became a joint creative and political project. The Bed-Ins, the album Double Fantasy, the concept art — they didn\'t just share a life, they made the sharing of a life into a public statement about what partnership could mean. That\'s both Libra and Aquarius at their most realized: partnership as an ideal in action.'] },
      { heading: 'What Survived', paragraphs: ['Yoko Ono has remained a cultural figure for more than four decades since John\'s death. She has continued the work — archiving his legacy, advocating for peace, creating art that extends the principles they shared. The Aquarius capacity for sustaining a vision past the person who shared it is one of that sign\'s most particular qualities.', 'John Lennon was shot on December 8, 1980. He was 40. The morning he died, they had finished a photo session and he had told an interviewer he felt their life was finally exactly what he wanted it to be.'] },
      { callout: '"Imagine all the people living life in peace." That\'s Aquarius writing the vision and Libra making it beautiful enough to be heard around the world.' },
    ],
    faqs: [
      { question: 'What is John Lennon\'s zodiac sign?', answer: 'John Lennon was a Libra, born October 9, 1940. Libra is an Air sign known for musical beauty, a deep need for creative partnership, aesthetic sensibility, and the belief that relationship is both a personal and a public act.' },
      { question: 'What is Yoko Ono\'s zodiac sign?', answer: 'Yoko Ono is an Aquarius, born February 18, 1933. Aquarius is an Air sign known for visionary thinking, humanitarian ideals, unconventional creativity, and the capacity to sustain a vision past all opposition.' },
      { question: 'Were John Lennon and Yoko Ono compatible?', answer: 'Libra + Aquarius is an Air + Air pairing that scores 75/100. Both signs live in the realm of ideas and ideals; Libra brings relational beauty and partnership, Aquarius brings the larger vision. Together they produced some of the most politically engaged art of the 20th century.' },
    ],
    related: ['libra-in-love', 'aquarius-in-love', 'moon-sign-compatibility'],
  },

  'elvis-and-priscilla-presley': {
    title: 'Elvis & Priscilla Presley: A Capricorn and a Gemini, Fourteen Years Apart',
    description: 'Elvis Presley was a Capricorn. Priscilla Presley is a Gemini. Earth + Air scores 45/100 — a pairing shaped by control and reinvention, with a 10-year age gap that colored everything.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Capricorn',
    compatLink: '/compatibility/gemini-and-capricorn',
    intro: 'Elvis Presley (Capricorn, January 8, 1935) and Priscilla Presley (Gemini, May 24, 1945) married on May 1, 1967, ten years after they met in Germany when she was 14 and he was 24. They divorced in 1973 and have one daughter, Lisa Marie Presley. Their relationship was shaped by a power imbalance that Priscilla has spoken about honestly, and by the particular dynamics of a Capricorn who wanted control and a Gemini who eventually needed more than one version of herself.',
    sections: [
      { heading: 'Capricorn and Gemini', paragraphs: ['Capricorn is the sign of structure, ambition, and control — the builder, the authority figure, the person who shapes the environment around them. Elvis\'s Capricorn ran through everything: the discipline of his early career, the management of his image, and the expectation that the people in his life would fit into a world he defined.', 'Gemini is the sign of adaptability and multiplicity — the person who can become what any situation requires, who is genuinely curious about who they are, and who eventually needs space to find out. Priscilla\'s Gemini was suppressed for years within the structure of being Mrs. Presley, and then — when she found her own footing through karate, through friendship, through becoming a businesswoman and actress — it emerged fully.'] },
      { heading: 'Earth + Air — 45/100', paragraphs: ['Earth and Air have real complementary qualities, but they can also chafe against each other. Earth wants to consolidate; Air wants to move. Earth builds a world; Air needs to breathe. The 45/100 reflects the genuine friction between a Capricorn who built Graceland as a container for a life he controlled and a Gemini who eventually outgrew that container.', 'Priscilla has been candid about the years at Graceland — the isolation, the expectations, the difficulty of being allowed to become her own person inside a relationship with someone as enormous as Elvis. That\'s Earth + Air in its more difficult form: the builder building something the Air sign can\'t fully live inside.'] },
      { heading: 'After', paragraphs: ['Their divorce in 1973 was reportedly mutual. Priscilla went on to found the Elvis Presley Enterprises trust that preserved Graceland and turned it into what it is today — a business and cultural site she managed with considerable acumen. Elvis died in 1977. Priscilla attended his funeral and has since been one of the most thoughtful stewards of his legacy.', 'She has said in interviews that she loved him genuinely and that the relationship was complicated in ways she spent years processing. That\'s a Gemini finding the language for something her younger self didn\'t have words for yet.'] },
    ],
    faqs: [
      { question: 'What is Elvis Presley\'s zodiac sign?', answer: 'Elvis Presley was a Capricorn, born January 8, 1935. Capricorn is an Earth sign known for discipline, ambition, the construction of a personal world, and a tendency toward control of the environment — and sometimes the people — around them.' },
      { question: 'What is Priscilla Presley\'s zodiac sign?', answer: 'Priscilla Presley is a Gemini, born May 24, 1945. Gemini is an Air sign known for adaptability, multiplicity, and an eventual need to inhabit more than one version of oneself — which tends to require space.' },
      { question: 'Were Elvis and Priscilla Presley compatible?', answer: 'Gemini + Capricorn is an Air + Earth pairing that scores 45/100. The dynamic between a Capricorn who builds a controlled world and a Gemini who eventually needs to move beyond any single definition is one of the more structurally challenging combinations in the zodiac.' },
    ],
    related: ['capricorn-in-love', 'gemini-in-love', 'red-flags-by-zodiac-sign'],
  },

  'jfk-and-jackie-kennedy': {
    title: 'JFK & Jackie Kennedy: A Gemini and a Leo in the Most Watched Marriage in the World',
    description: 'JFK was a Gemini. Jackie Kennedy was a Leo. Air + Fire scores 65/100 — a pairing of charm and radiance, grace and duality, in the most scrutinized relationship of the 20th century.',
    publishDate: '2026-05-08', readTime: '6 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Leo',
    compatLink: '/compatibility/gemini-and-leo',
    intro: 'John F. Kennedy (Gemini, May 29, 1917) and Jacqueline Bouvier Kennedy (Leo, July 28, 1929) married on September 12, 1953. They had four children, two of whom survived. He was assassinated in Dallas on November 22, 1963. She was 34 years old. She held his head in her hands.',
    sections: [
      { heading: 'Gemini and Leo: Charm and Radiance', paragraphs: ['Gemini is the most charming sign in the zodiac — quick, adaptable, able to be everything to everyone in a room, and genuinely magnetic in the way of people who seem always to be elsewhere even when they\'re standing in front of you. JFK\'s Gemini was political genius: the ability to communicate across every audience, to shift register from televised debate to private conversation without losing either, to project warmth while remaining essentially unknowable.', 'Leo is the sign of sovereign presence — the person who arrives and changes the room, who knows who they are and expresses it in every gesture. Jackie Kennedy\'s Leo was in the bearing, the aesthetic vision (the White House renovation, the cultural programming of the Kennedy years), and the extraordinary dignity she maintained in the worst moments a public figure can face.'] },
      { heading: 'Air + Fire — 65/100', paragraphs: ['Gemini and Leo are complementary elements that tend to produce attraction and admiration — Air feeds Fire, which grows larger and brighter in return. The 65/100 reflects genuine compatibility alongside the particular tensions that arise when a Gemini\'s multiplicity meets a Leo\'s need for genuine recognition.', 'Leo needs to know they are seen — really seen, not just publicly celebrated. JFK\'s Gemini tendency to be everywhere and fully present nowhere is perhaps the central tension of their documented dynamic. Jackie knew about his affairs and chose the public version of their life. That\'s a Leo making the calculation that their role — as a public figure, as a mother, as a cultural presence — mattered more than the private reckoning.'] },
      { heading: 'Afterward', paragraphs: ['Jackie Kennedy was photographed in the dress she wore when he was shot. She declined to change it. She said she wanted people to see what they had done. That\'s Leo: the instinct to make the moment visible, to give grief a form that could be witnessed.', 'She later married Aristotle Onassis in 1968, and died in 1994. The historical image of her — beside the casket, behind the pink suit, raising John and Caroline — is one of the most enduring portraits of dignified grief in American public life. It is exactly what Leo, at its most realized, looks like.'] },
    ],
    faqs: [
      { question: 'What is JFK\'s zodiac sign?', answer: 'John F. Kennedy was a Gemini, born May 29, 1917. Gemini is an Air sign known for intelligence, charm, political adaptability, and a duality that allows them to be simultaneously everything to everyone and genuinely known by no one.' },
      { question: 'What is Jackie Kennedy\'s zodiac sign?', answer: 'Jackie Kennedy was a Leo, born July 28, 1929. Leo is a Fire sign known for sovereign presence, aesthetic vision, dignity under pressure, and the instinct to make even the most private moments into something the world can witness.' },
      { question: 'Were JFK and Jackie Kennedy compatible?', answer: 'Gemini + Leo is an Air + Fire pairing that scores 65/100. The complementary elements — Air feeding Fire — produce genuine attraction and admiration; the central tension is Gemini\'s multiplicity meeting Leo\'s deep need for authentic recognition.' },
    ],
    related: ['gemini-in-love', 'leo-in-love', 'princess-diana-and-prince-charles'],
  },

  'sonny-and-cher': {
    title: 'Sonny & Cher: An Aquarius and a Taurus Who Built an Empire Together',
    description: 'Sonny Bono was an Aquarius. Cher is a Taurus. Air + Earth scores 45/100 — but they made it work long enough to become one of entertainment\'s most enduring creative partnerships.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Aquarius',
    compatLink: '/compatibility/taurus-and-aquarius',
    intro: 'Sonny Bono (Aquarius, February 16, 1935) and Cher (Taurus, May 20, 1946) were together from 1964 to 1975. They had a daughter, Chastity (now Chaz). They were also, for a decade, the most famous duo in American entertainment — the Sonny & Cher Comedy Hour, the hit records, the matching outfits. Sonny discovered Cher when she was 16. The power dynamic shaped everything.',
    sections: [
      { heading: 'Aquarius and Taurus: Different Gravitational Fields', paragraphs: ['Aquarius is the visionary — the person who sees the future before it arrives, who is animated by ideas and ideals and the possibility of something new. Sonny\'s Aquarius drove the creative vision: he saw something in Cher before the industry did, packaged the act, wrote the songs, managed the relationship between their art and their public identity.', 'Taurus is the sign that knows its own worth, builds slowly, and eventually owns whatever it has patiently built. Cher\'s Taurus is visible across five decades: the refusal to be defined by any single era, the sustained relevance, the "believe" that comes from a Taurus who simply will not stop. Taurus doesn\'t reinvent — it outlasts.'] },
      { heading: 'Air + Earth — 45/100', paragraphs: ['Air and Earth don\'t naturally speak the same language. Aquarius lives in the future; Taurus lives in what is real right now. The 45/100 reflects the fundamental friction in this pairing — and the real creative tension that can come from it when both people are making something together.', 'Their professional partnership outlasted the romantic one. They hosted The Sonny & Cher Comedy Hour from 1971 to 1974, then divorced, and briefly reunited for a second show in the late 1970s. The ability of their Air + Earth combination to continue producing together even after the romantic dimension ended suggests the creative partnership was the primary bond.'] },
      { heading: 'The Taurus Who Took It Back', paragraphs: ['After their divorce, Cher\'s career — which Sonny had in some ways constrained through his management — became fully her own. The films, the solo albums, the Oscar, the reinventions. She is, as of 2026, in her late 70s and still performing. That\'s Taurus: the sign that doesn\'t stop because it doesn\'t know how to define stopping as a goal.', 'Sonny died in a skiing accident in 1998. Cher attended his funeral. She has said publicly that whatever their complications, she loved him.'] },
    ],
    faqs: [
      { question: 'What is Cher\'s zodiac sign?', answer: 'Cher is a Taurus, born May 20, 1946. Taurus is an Earth sign known for sensuality, loyalty, a deep aesthetic investment, and a fixed nature that builds steadily and outlasts almost everything.' },
      { question: 'What is Sonny Bono\'s zodiac sign?', answer: 'Sonny Bono was an Aquarius, born February 16, 1935. Aquarius is an Air sign known for visionary thinking, the ability to see potential in unexpected places, and a creative drive that can be both inspiring and difficult to contain.' },
      { question: 'Were Sonny and Cher compatible?', answer: 'Taurus + Aquarius is an Earth + Air pairing that scores 45/100. The fundamental difference in orientation — Taurus anchored in the real and enduring, Aquarius animated by the ideal and the future — requires ongoing translation. Their creative partnership, which outlasted the romance, may have been the more natural home for what they were to each other.' },
    ],
    related: ['taurus-in-love', 'aquarius-in-love', 'moon-sign-compatibility'],
  },

  'paul-newman-and-joanne-woodward': {
    title: 'Paul Newman & Joanne Woodward: 50 Years of an Aquarius and a Pisces',
    description: 'Paul Newman was an Aquarius. Joanne Woodward is a Pisces. Air + Water scores 50/100 — and they made it work for 50 years, one of Hollywood\'s most genuinely enduring marriages.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Pisces',
    compatLink: '/compatibility/aquarius-and-pisces',
    intro: 'Paul Newman (Aquarius, January 26, 1925) and Joanne Woodward (Pisces, February 27, 1930) married in January 1958 and remained married until Paul\'s death from lung cancer in September 2008. Fifty years. When asked about Hollywood infidelity, he famously said: "Why would I go out for hamburger when I have steak at home?"',
    sections: [
      { heading: 'Aquarius and Pisces: The Sign That Dreams and the Sign That Builds the Dream', paragraphs: ['Aquarius and Pisces are adjacent signs — neighbors in the zodiac — which creates a pairing with complementary qualities but also real differences. Aquarius is the visionary, the humanitarian, the person animated by ideas and ideals. Pisces is the empath, the romantic, the person animated by feeling and by the invisible texture of life.', 'Paul Newman\'s Aquarius was in his political commitments (he donated millions to charity, founded Newman\'s Own specifically to give away profits), his racecar driving (the Aquarius instinct for the unconventional arena), and his general refusal to behave the way Hollywood stars were expected to. Joanne Woodward\'s Pisces was in her acting — two Academy Award wins, work that required the Pisces capacity for total empathic inhabitation — and in the quiet steadiness of a person who chose depth over spectacle.'] },
      { heading: 'Air + Water — 50/100', paragraphs: ['Air and Water are not natural companions — they speak different languages, one in ideas and the other in feeling. The 50/100 reflects real friction alongside real complementarity: the Aquarius who brings vision and the Pisces who brings emotional grounding can, when both people are committed, produce something that neither could quite manage alone.', 'What made their pairing work was probably that both people were genuinely more interested in the actual life than in the performance of it. They lived in Connecticut. He raced cars. She directed plays. They raised children. The Aquarius\'s need for independence and the Pisces\'s need for emotional presence found a form that served both.'] },
      { callout: 'Fifty years. One marriage. In Hollywood. Paul Newman once said: "A man can only eat so many hot dogs." That\'s Aquarius-style directness wrapped in enough humor to make it land. The sentiment underneath it was real.' },
    ],
    faqs: [
      { question: 'What is Paul Newman\'s zodiac sign?', answer: 'Paul Newman was an Aquarius, born January 26, 1925. Aquarius is an Air sign known for independence, humanitarian values, unconventional choices, and a directness that can be disarming in its clarity.' },
      { question: 'What is Joanne Woodward\'s zodiac sign?', answer: 'Joanne Woodward is a Pisces, born February 27, 1930. Pisces is a Water sign known for emotional depth, empathic acting ability, a romantic sensibility, and the capacity to be fully present in a life without needing it to be performed.' },
      { question: 'Were Paul Newman and Joanne Woodward compatible?', answer: 'Aquarius + Pisces is an Air + Water pairing that scores 50/100. The 50-year marriage is its own argument for the pairing. When the Aquarius\'s idealism and the Pisces\'s emotional depth find common ground in a real, non-performative life together, the result can outlast almost any compatibility score.' },
    ],
    related: ['aquarius-in-love', 'pisces-in-love', 'dolly-parton-and-carl-dean'],
  },

  'humphrey-bogart-and-lauren-bacall': {
    title: 'Humphrey Bogart & Lauren Bacall: A Capricorn and a Virgo Who Had the Best Chemistry in Hollywood',
    description: 'Humphrey Bogart was a Capricorn. Lauren Bacall was a Virgo. Earth + Earth scores 75/100 — they met on the set of To Have and Have Not in 1944. The 25-year age gap didn\'t matter.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Capricorn',
    compatLink: '/compatibility/virgo-and-capricorn',
    intro: 'Humphrey Bogart (Capricorn, December 25, 1899) and Lauren Bacall (Virgo, September 16, 1924) met filming To Have and Have Not in 1944, when she was 19 and he was 44. They married in 1945 and were together until his death from esophageal cancer in 1957. Their on-screen chemistry — "You know how to whistle, don\'t you, Steve? You just put your lips together and blow" — became one of cinema\'s defining moments.',
    sections: [
      { heading: 'Earth + Earth: Immediate Recognition', paragraphs: ['Capricorn and Virgo are both Earth signs, which in astrology produces a natural affinity — shared values around craft, commitment, quality, and the belief that things worth having are worth working for. Two Earth signs tend to recognize each other immediately, often before any romantic dimension has developed.', 'Bogart\'s Capricorn was in his screen authority — the dry intelligence, the moral clarity even in morally ambiguous roles, the sense of a person who had lived enough to know the cost of things. Bacall\'s Virgo was in her precision — the voice, the delivery, the exactness of everything she did on screen, and the sharp intelligence she brought to both craft and life.'] },
      { heading: 'Virgo + Capricorn — 75/100', paragraphs: ['Earth + Earth pairings score well because both people orient toward the same things: quality, loyalty, and work done properly. The 75/100 reflects genuine compatibility and a natural working partnership. They made four films together. The work was an extension of the relationship.', 'The age gap — 25 years — is often noted as the defining feature of their dynamic, and it certainly shaped the early power dynamics. But Earth signs, particularly Virgo, tend to be drawn toward the substantive rather than the age-appropriate. A 19-year-old Virgo who has decided something is worth committing to is more committed than many 40-year-olds. She chose him with her full Virgo intelligence, not naively.'] },
      { callout: 'After he died, she was 32. She went on to have a long and distinguished career, two more marriages, and a public life as formidable as any she\'d shared with him. Virgo doesn\'t collapse. It grieves, and then it continues to work.' },
    ],
    faqs: [
      { question: 'What is Humphrey Bogart\'s zodiac sign?', answer: 'Humphrey Bogart was a Capricorn, born December 25, 1899. Capricorn is an Earth sign known for authority, dry intelligence, commitment to craft, and a moral seriousness that comes through even in roles designed to obscure it.' },
      { question: 'What is Lauren Bacall\'s zodiac sign?', answer: 'Lauren Bacall was a Virgo, born September 16, 1924. Virgo is an Earth sign known for precision, intelligence, a commitment to excellence in everything they do, and a tendency to choose with their full intelligence rather than their impulse.' },
      { question: 'Were Bogart and Bacall compatible?', answer: 'Virgo + Capricorn is an Earth + Earth pairing that scores 75/100. Two Earth signs recognize each other quickly and build something durable. Their professional and romantic partnership — four films, 12 years of marriage — reflects exactly that.' },
    ],
    related: ['virgo-in-love', 'capricorn-in-love', 'dolly-parton-and-carl-dean'],
  },

  'martin-luther-king-and-coretta-scott-king': {
    title: 'Martin Luther King Jr. & Coretta Scott King: A Capricorn and a Taurus Who Shared a Mission',
    description: 'Martin Luther King Jr. was a Capricorn. Coretta Scott King was a Taurus. Earth + Earth scores 75/100 — two Earth signs who built something together that outlasted both of them.',
    publishDate: '2026-05-08', readTime: '6 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Capricorn',
    compatLink: '/compatibility/taurus-and-capricorn',
    intro: 'Martin Luther King Jr. (Capricorn, January 15, 1929) and Coretta Scott King (Taurus, April 27, 1927) married on June 18, 1953. She was pursuing a concert career in Boston when they met; she gave that up to stand beside him in the work that would define American history. He was assassinated on April 4, 1968. She spent the next 38 years continuing the movement.',
    sections: [
      { heading: 'Two Earth Signs with a Shared Foundation', paragraphs: ['Capricorn is the sign of legacy, purpose, and the willingness to do sustained, difficult work toward a distant goal. Martin Luther King\'s Capricorn was total: the oratory was not performance but the product of years of preparation, the strategy was deliberate, and the commitment to nonviolence required exactly the Capricorn capacity to hold a larger vision through conditions that would break most people.', 'Taurus is the sign of steadiness, loyalty, and the ability to hold the center when everything around it is moving. Coretta Scott King\'s Taurus was in her refusal to be diminished — by surveillance, by threats, by widowhood at 40 — and in the decades of continued advocacy for civil rights, LGBTQ rights, and anti-poverty work that followed her husband\'s death. She didn\'t hold his place. She extended it.'] },
      { heading: 'Earth + Earth — 75/100', paragraphs: ['Two Earth signs share an understanding of what endures: not the feeling but the work; not the moment but the structure built from moments. The 75/100 reflects a natural compatibility between two people oriented toward the same values — commitment, purpose, and the belief that what you build matters more than how it feels to build it.', 'Their relationship was also shaped by enormous external pressure. The FBI surveillance, the death threats, the constant danger — these are conditions that would test any partnership. Earth signs under pressure don\'t dissolve; they compact. The difficulty became part of what held them together.'] },
      { heading: 'After', paragraphs: ['Coretta Scott King died in January 2006, nearly 38 years after Martin\'s assassination. In those years she founded the King Center, continued his work, and became one of the most important civil rights advocates of the late 20th century in her own right. A Taurus who decides to stay committed to something doesn\'t need the original person to sustain the commitment. The work itself becomes the anchor.'] },
      { callout: '"The greatness of a man is not in how much wealth he acquires, but in his integrity and his ability to affect those around him positively." — Martin Luther King Jr. That\'s Capricorn. And a Taurus who chose to spend her life making those words mean something tangible: that\'s Coretta.' },
    ],
    faqs: [
      { question: 'What is Martin Luther King Jr.\'s zodiac sign?', answer: 'Martin Luther King Jr. was a Capricorn, born January 15, 1929. Capricorn is an Earth sign known for disciplined purpose, long-term vision, oratorical power in service of a goal, and the capacity to sustain commitment through conditions that would break others.' },
      { question: 'What is Coretta Scott King\'s zodiac sign?', answer: 'Coretta Scott King was a Taurus, born April 27, 1927. Taurus is an Earth sign known for loyalty, steadiness, the refusal to be diminished, and a fixed commitment that doesn\'t require the original cause to remain present in order to continue.' },
      { question: 'Were MLK and Coretta Scott King compatible?', answer: 'Taurus + Capricorn is an Earth + Earth pairing that scores 75/100. Two Earth signs with a shared mission produce one of the most durable kinds of partnership — built not on romantic chemistry alone but on shared purpose and mutual recognition of what each person brings to the work.' },
    ],
    related: ['capricorn-in-love', 'taurus-in-love', 'barack-and-michelle-obama'],
  },

  'justin-and-hailey-bieber': {
    title: 'Justin & Hailey Bieber: A Pisces and a Sagittarius Finding Solid Ground',
    description: 'Justin Bieber is a Pisces. Hailey Bieber is a Sagittarius. Water + Fire scores 55/100 — she grounds him; he softens her. Married since 2018.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Sagittarius', sign2: 'Pisces',
    compatLink: '/compatibility/sagittarius-and-pisces',
    intro: 'Justin Bieber (Pisces, March 1, 1994) and Hailey Baldwin Bieber (Sagittarius, November 22, 1996) married in September 2018, having known each other since they were teenagers. Justin\'s twenties were documented publicly: the arrests, the struggles with faith and mental health, the years of being one of the most famous people alive before he was 20. Hailey has been a consistent, grounding presence since their reconciliation in 2018.',
    sections: [
      { heading: 'Pisces and Sagittarius: The Dreamer and the Seeker', paragraphs: ['Pisces is the empath — the person who feels everything, who is easily overwhelmed by the scale of the world, and who needs genuine safety to function. Justin\'s Pisces runs through his music (the emotional transparency of his work from "Love Yourself" to "Peaches"), his spiritual life (the Hillsong connection, the public faith), and the documented vulnerability that fame made very difficult to protect.', 'Sagittarius is the seeker — direct, freedom-loving, philosophically oriented, and capable of a particular kind of grounding that doesn\'t ask the other person to be smaller. Hailey\'s Sagittarius is visible in her directness and in the confidence with which she built her own platform (the Rhode beauty brand, the modeling career) rather than living entirely inside someone else\'s.'] },
      { heading: 'Water + Fire — 55/100', paragraphs: ['Water and Fire are attracted to each other and can drain each other simultaneously. Fire wants to move; Water wants to feel. The 55/100 reflects the real differences in their orientations alongside the genuine complementarity: a Pisces who feels everything finding a Sagittarius who can hold direction; a Sagittarius who moves fast finding a Pisces who makes stillness feel safe.', 'What\'s notable about their dynamic is how much it seems to be organized around Justin\'s wellbeing. Hailey has spoken publicly about the challenges of supporting a partner through mental health struggles. That\'s Sagittarius in a genuinely committed relationship: the adaptability, the honesty about difficulty, and the refusal to pretend things are fine when they\'re not.'] },
      { callout: 'Justin has said publicly that meeting Hailey was the thing that saved him. That\'s Pisces: the sign that can lose itself completely and needs, more than most, to find a person worth orienting around. When the Sagittarius they find is genuinely present rather than performing presence, the Pisces can actually rest.' },
    ],
    faqs: [
      { question: 'What is Justin Bieber\'s zodiac sign?', answer: 'Justin Bieber is a Pisces, born March 1, 1994. Pisces is a Water sign known for emotional depth, creative sensitivity, spiritual seeking, and a need for genuine safety that fame makes almost impossible to find.' },
      { question: 'What is Hailey Bieber\'s zodiac sign?', answer: 'Hailey Bieber is a Sagittarius, born November 22, 1996. Sagittarius is a Fire sign known for directness, philosophical honesty, independence, and a capacity to be grounding for others without being constrictive.' },
      { question: 'Are Justin and Hailey Bieber compatible?', answer: 'Sagittarius + Pisces is a Water + Fire pairing that scores 55/100. The complementary dynamic — Fire offering direction, Water offering emotional depth — can work when both people are genuinely committed to what the other needs.' },
    ],
    related: ['pisces-in-love', 'sagittarius-in-love', 'ariana-grande-and-ethan-slater'],
  },

  'kim-kardashian-and-kanye-west': {
    title: 'Kim Kardashian & Kanye West: A Libra and a Gemini When Air Meets Air',
    description: 'Kim Kardashian is a Libra. Kanye West is a Gemini. Air + Air scores 75/100 on paper. Married 2014-2022. The compatibility was real; so was the eventual divergence.',
    publishDate: '2026-05-08', readTime: '6 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Libra',
    compatLink: '/compatibility/gemini-and-libra',
    intro: 'Kim Kardashian (Libra, October 21, 1980) and Kanye West (Gemini, June 8, 1977) married in May 2014 in Florence, Italy, after two years together. They have four children: North, Saint, Chicago, and Psalm. Kim filed for divorce in February 2021. It was finalized in November 2022.',
    sections: [
      { heading: 'Two Air Signs Building an Empire', paragraphs: ['Gemini and Libra are both Air signs — both oriented toward ideas, communication, social presence, and the construction of a world that reflects their taste. At their best, they produce a pairing where both people inspire each other creatively and understand each other\'s need for visibility and expression.', 'Kanye\'s Gemini is one of the most fully expressed versions of that sign in public life: the duality (the creative genius alongside the destabilizing public statements), the rapid movement between ideas, the difficulty of being fully captured in any single description. Kim\'s Libra is in her image-making, her commitment to aesthetics, and the diplomatic social intelligence that built a global media business from a reality show.'] },
      { heading: 'Air + Air — 75/100', paragraphs: ['Two Air signs share a natural fluency — they understand each other at the level of ideas and image and social navigation. The 75/100 reflects that this pairing worked well in the dimensions where they met: the fashion, the art direction, the aesthetic shared vision of what their life should look like.', 'Where Air + Air pairings can lose traction is when one person\'s Air becomes less predictable than the other can navigate. Gemini at its most challenging is volatile — the same mental quickness that produces genius can produce unpredictability. A Libra, whose core need is equilibrium and beauty, eventually reaches a point where the disruption outweighs what the relationship makes possible.'] },
      { heading: 'The Divergence', paragraphs: ['Kim\'s filing for divorce came after several years of documented difficulty, including Kanye\'s 2020 presidential run and the public statements that followed. She has spoken about the decision with notable care — not condemning, but also clear. That\'s Libra: the sign that weighs carefully, delays the decision, and when they finally move, has already done the calculus thoroughly.', 'Co-parenting four children while navigating Kanye\'s public behavior has required from Kim a particular kind of Libra discipline: maintaining the public appearance of equity and care while managing a private situation of considerable complexity.'] },
    ],
    faqs: [
      { question: 'What is Kim Kardashian\'s zodiac sign?', answer: 'Kim Kardashian is a Libra, born October 21, 1980. Libra is an Air sign known for aesthetic intelligence, diplomatic social navigation, image-making, and a deep investment in maintaining equilibrium — which makes the decision to end something the hardest thing they do, and the most certain when they finally do it.' },
      { question: 'What is Kanye West\'s zodiac sign?', answer: 'Kanye West is a Gemini, born June 8, 1977. Gemini is an Air sign known for extraordinary creative intelligence, rapid movement between ideas, duality, and the difficulty of being fully described by any single framing.' },
      { question: 'Were Kim Kardashian and Kanye West compatible?', answer: 'Gemini + Libra is an Air + Air pairing that scores 75/100. The shared orientation toward aesthetics, image, and social intelligence created genuine compatibility in many dimensions; the eventual challenge was Gemini\'s volatility against Libra\'s need for equilibrium.' },
    ],
    related: ['libra-in-love', 'gemini-in-love', 'kim-kardashian-and-lewis-hamilton'],
  },

  'miley-cyrus-and-liam-hemsworth': {
    title: 'Miley Cyrus & Liam Hemsworth: A Sagittarius and a Capricorn Who Came Back and Came Apart',
    description: 'Miley Cyrus is a Sagittarius. Liam Hemsworth is a Capricorn. Fire + Earth scores 55/100 — they met as teenagers, split, reconciled, married, and divorced within a year.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Sagittarius', sign2: 'Capricorn',
    compatLink: '/compatibility/sagittarius-and-capricorn',
    intro: 'Miley Cyrus (Sagittarius, November 23, 1992) and Liam Hemsworth (Capricorn, January 13, 1990) met on the set of The Last Song in 2009. They were engaged, broke up, reconciled, married in December 2018, and Miley announced their separation in August 2019 — eight months later. She has since written explicitly about the relationship, most notably in "Flowers."',
    sections: [
      { heading: 'The Elemental Tension', paragraphs: ['Sagittarius is the freest sign of the zodiac — expansive, honest, mobile, and fundamentally resistant to anything that constrains the range of who they\'re allowed to be. Miley\'s Sagittarius has been visible in every chapter of her public life: the reinventions, the refusal to be the person anyone expected her to be, the directness about her experiences, and the art that tends to be about liberation of one kind or another.', 'Capricorn is the builder — patient, structured, committed to the long form, and tending toward a vision of stability and legacy. Liam\'s Capricorn is less publicly documented, but the pattern of the relationship — returning, committing, waiting — is consistent with an Earth sign that believes in the investment.'] },
      { heading: 'Fire + Earth — 55/100', paragraphs: ['Fire and Earth need each other but move at different speeds. The 55/100 reflects a pairing where the Fire person can feel constrained and the Earth person can feel perpetually unsettled. For Sagittarius specifically, any relationship that asks them to be smaller than their range tends to produce the particular restlessness that precedes departure.', '"Flowers" — "I can buy myself flowers / write my name in the sand / talk to myself for hours / say things you don\'t understand" — is one of Sagittarius\'s most direct expressions: the discovery that freedom from a constraining relationship is itself a kind of love. Whether it was constraining or not is between them; the Sagittarian reading of it is clear.'] },
    ],
    faqs: [
      { question: 'What is Miley Cyrus\'s zodiac sign?', answer: 'Miley Cyrus is a Sagittarius, born November 23, 1992. Sagittarius is a Fire sign known for radical honesty, serial reinvention, freedom as a core value, and a need to not be smaller than the full range of who they are.' },
      { question: 'What is Liam Hemsworth\'s zodiac sign?', answer: 'Liam Hemsworth is a Capricorn, born January 13, 1990. Capricorn is an Earth sign known for patience, commitment, a long-term view of investment, and a desire to build something that endures.' },
      { question: 'Were Miley and Liam compatible?', answer: 'Sagittarius + Capricorn is a Fire + Earth pairing that scores 55/100. The friction between Sagittarius\'s need for freedom and Capricorn\'s need for stability is one of the more common patterns in this pairing — and the one that\'s most often described in the Sagittarius\'s art after the fact.' },
    ],
    related: ['sagittarius-in-love', 'capricorn-in-love', 'chrissy-teigen-and-john-legend'],
  },

  'ariana-grande-and-pete-davidson': {
    title: 'Ariana Grande & Pete Davidson: A Cancer and a Scorpio Who Moved Too Fast',
    description: 'Ariana Grande is a Cancer. Pete Davidson is a Scorpio. Water + Water scores 80/100 — the intensity was real, the timing was not. Engaged 2018, over five months later.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Scorpio',
    compatLink: '/compatibility/cancer-and-scorpio',
    intro: 'Ariana Grande (Cancer, June 26, 1993) and Pete Davidson (Scorpio, November 16, 1993) began dating in May 2018, were engaged by June, and called off the engagement by October — approximately five months from start to finish. In that time, they got matching tattoos, moved in together, and became one of the most discussed couples of the year.',
    sections: [
      { heading: 'Cancer and Scorpio: Water Recognizing Water', paragraphs: ['Cancer and Scorpio form a trine in astrology — 120 degrees apart, one of the most naturally harmonious configurations. Both are Water signs, which means the emotional attunement is immediate and the intensity is mutual. When Cancer and Scorpio meet, the connection can feel almost overwhelmingly real — which is exactly what "real" feels like to both of these signs.', 'Ariana\'s Cancer is in the music — the emotional precision, the vulnerability that is also a kind of armor, the fierce protectiveness over the things and people she loves. Pete\'s Scorpio is in the dark humor (Scorpio\'s characteristic mode of processing depth), the openness about his mental health struggles, and the intensity of attachment that can move very fast.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs together have an emotional resonance that scores 80/100 because the attunement is genuine and the depth is mutual. The challenge is not compatibility but pace — Water + Water intensity can move faster than any practical foundation can be built.', 'They got engaged after a few weeks. The engagement became one of the major pop culture narratives of 2018. Ariana\'s ex-boyfriend Mac Miller died in September 2018, in the middle of the engagement. The grief and the public pressure became more than five months of a relationship could hold. That the intensity was real doesn\'t mean the timing was right.'] },
      { callout: 'Ariana has spoken thoughtfully about that period — the grief, the difficulty, the care she has for Pete as a person. That\'s Cancer: the sign that keeps feeling the full weight of what happened, long after the relationship has ended, and finds ways to honor it that don\'t require anyone to be a villain.' },
    ],
    faqs: [
      { question: 'What is Pete Davidson\'s zodiac sign?', answer: 'Pete Davidson is a Scorpio, born November 16, 1993. Scorpio is a Water sign known for emotional intensity, dark humor as a processing mechanism, a fierce loyalty to people they love, and attachments that can form and run deep very quickly.' },
      { question: 'Were Ariana Grande and Pete Davidson compatible?', answer: 'Cancer + Scorpio is a Water + Water pairing that scores 80/100. The emotional attunement between these two signs is genuine; the challenge is that the intensity of Water + Water can move faster than any practical foundation can be built beneath it.' },
      { question: 'How long were Ariana Grande and Pete Davidson together?', answer: 'Approximately five months from the start of their relationship to the end of their engagement in October 2018.' },
    ],
    related: ['cancer-in-love', 'scorpio-in-love', 'ariana-grande-and-ethan-slater'],
  },

  'cardi-b-and-offset': {
    title: 'Cardi B & Offset: A Libra and a Sagittarius in a Loud, Complicated Love Story',
    description: 'Cardi B is a Libra. Offset is a Sagittarius. Air + Fire scores 60/100 — married 2017, on and off since, publicly documented at every turn.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Sagittarius',
    compatLink: '/compatibility/libra-and-sagittarius',
    intro: 'Cardi B (Libra, October 11, 1992) and Offset (Sagittarius, December 14, 1991) secretly married in September 2017 before announcing it publicly. They have two children together. The relationship has been publicly documented through cheating allegations, breakups, reconciliations, a divorce filing that was reversed, and a 2024 separation that Cardi described as official.',
    sections: [
      { heading: 'Libra and Sagittarius: Air Feeding Fire', paragraphs: ['Libra and Sagittarius are two signs separated by one step in the zodiac, which tends to produce a pairing with good natural energy but real differences in how they approach commitment. Libra is oriented around partnership — it\'s the sign of the relationship, the negotiation, the attempt to make things balanced and fair. Sagittarius is oriented toward freedom and truth — the sign that follows the direction that feels honest, even when that\'s inconvenient.', 'Cardi\'s Libra is in her aesthetics, her public charm, and the social intelligence that built a career from the ground up using every platform available. It\'s also in her willingness to return, to try again, to weigh the costs and benefits of the relationship before finalizing any decision. Offset\'s Sagittarius is in the music, the bluntness of his public persona, and the pattern of a person who pursues what they want without always accounting for the consequences.'] },
      { heading: 'Air + Fire — 60/100', paragraphs: ['Air and Fire are naturally complementary — Air feeds Fire, which returns warmth. The 60/100 reflects a pairing with genuine energy alongside the friction that comes from Libra\'s need for equity and Sagittarius\'s tendency to see rules as suggestions.', 'Their relationship has been most publicly characterized by infidelity and reconciliation. Libra returns because Libra believes in the relationship even when the reality is hard. Sagittarius returns because the Fire sign\'s version of love can be as intense as their version of freedom. The question for this pairing is always whether both people have arrived at the same understanding of what the relationship requires.'] },
    ],
    faqs: [
      { question: 'What is Cardi B\'s zodiac sign?', answer: 'Cardi B is a Libra, born October 11, 1992. Libra is an Air sign known for social intelligence, aesthetic vision, a commitment to fairness in relationship, and the capacity to return to something they love even after it has been difficult.' },
      { question: 'What is Offset\'s zodiac sign?', answer: 'Offset is a Sagittarius, born December 14, 1991. Sagittarius is a Fire sign known for directness, the pursuit of freedom and truth, musical ambition, and a relationship with commitment that can be intense but is rarely uncomplicated.' },
      { question: 'Are Cardi B and Offset compatible?', answer: 'Libra + Sagittarius is an Air + Fire pairing that scores 60/100. The natural energy between these signs is real; the primary challenge is Libra\'s need for equity and balance meeting Sagittarius\'s instinct toward freedom and self-direction.' },
    ],
    related: ['libra-in-love', 'sagittarius-in-love', 'red-flags-by-zodiac-sign'],
  },

  'gigi-hadid-and-zayn-malik': {
    title: 'Gigi Hadid & Zayn Malik: A Taurus and a Capricorn Who Share an Earth Foundation',
    description: 'Gigi Hadid is a Taurus. Zayn Malik is a Capricorn. Earth + Earth scores 75/100 — on and off since 2015, parents of daughter Khai since 2020.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Capricorn',
    compatLink: '/compatibility/taurus-and-capricorn',
    intro: 'Gigi Hadid (Taurus, April 23, 1995) and Zayn Malik (Capricorn, January 12, 1993) began dating in 2015. They had an on-again, off-again relationship across five years before their daughter Khai was born in September 2020. They separated in 2021 following a reported incident with Gigi\'s mother. They co-parent Khai.',
    sections: [
      { heading: 'Taurus and Capricorn: Earth Recognizing Earth', paragraphs: ['Taurus and Capricorn are both Earth signs, and they form a trine — one of astrology\'s most naturally harmonious configurations. Both signs value what is real, what endures, and what is built with patience. The attraction tends to be immediate and the compatibility genuine at the level of values.', 'Gigi\'s Taurus is in her steady, grounded public presence — she works consistently, doesn\'t court controversy unnecessarily, and has built a modeling career that is as much about substance as aesthetics. Zayn\'s Capricorn is in the music career he built after leaving One Direction — private, non-performative (he has spoken about severe anxiety around public performance), and oriented toward craft rather than celebrity.'] },
      { heading: 'Earth + Earth — 75/100', paragraphs: ['Two Earth signs together have a natural compatibility rooted in shared values. The 75/100 reflects that this pairing tends to work well in the structural dimensions — loyalty, commitment to parenthood, shared values around quality and privacy. Where it requires attention is in emotional communication, where both signs can be reserved in ways that create distance over time.', 'Their co-parenting arrangement — centered on Khai, private and functional — is consistent with what Earth signs do after a romantic relationship ends: they prioritize the real, tangible responsibilities over the emotional reckoning, and they stay committed to what was built even when the builder relationship has changed.'] },
    ],
    faqs: [
      { question: 'What is Gigi Hadid\'s zodiac sign?', answer: 'Gigi Hadid is a Taurus, born April 23, 1995. Taurus is an Earth sign known for groundedness, loyalty, a commitment to quality in work and relationship, and a fixed nature that builds steadily rather than dramatically.' },
      { question: 'What is Zayn Malik\'s zodiac sign?', answer: 'Zayn Malik is a Capricorn, born January 12, 1993. Capricorn is an Earth sign known for ambition, private nature, commitment to craft, and a relationship with visibility that can be complicated when the career requires it.' },
      { question: 'Are Gigi Hadid and Zayn Malik compatible?', answer: 'Taurus + Capricorn is an Earth + Earth pairing that scores 75/100. The natural trine between these signs produces genuine compatibility in values and commitment; the challenge is ensuring that both signs\' tendency toward reserve doesn\'t create emotional distance over time.' },
    ],
    related: ['taurus-in-love', 'capricorn-in-love', 'martin-luther-king-and-coretta-scott-king'],
  },

  'khloe-kardashian-and-tristan-thompson': {
    title: 'Khloe Kardashian & Tristan Thompson: A Cancer and a Pisces with a Complicated History',
    description: 'Khloe Kardashian is a Cancer. Tristan Thompson is a Pisces. Water + Water scores 80/100 — the emotional resonance was real, and so was the difficulty. Parents of two children.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Khloe Kardashian (Cancer, June 27, 1984) and Tristan Thompson (Pisces, March 13, 1991) began dating in 2016. Their daughter True was born in April 2018, three days after cheating allegations became public. They broke up, reconciled, welcomed a son via surrogate in 2022, and ended the relationship permanently. It was documented across multiple seasons of The Kardashians.',
    sections: [
      { heading: 'Cancer and Pisces: The Depth and the Dissolution', paragraphs: ['Cancer and Pisces are both Water signs that trine each other — producing one of astrology\'s most naturally empathic pairings. The connection between Cancer and Pisces tends to be immediate and emotionally rich. Cancer wants to protect and provide a home; Pisces wants to be held and to feel safe. In theory, they offer each other exactly that.', 'Khloe\'s Cancer is in her fierce loyalty to family, her public vulnerability about the relationship\'s difficulties, and the way she has processed hurt in real time through social media — a Cancer mode if there ever was one. Tristan\'s Pisces is harder to read from the outside, but the pattern of behavior — the emotional attunement that coexists with infidelity — is one way Pisces in its more difficult expression can manifest.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['The 80/100 reflects what was genuine: Cancer and Pisces do resonate. The emotional connection was real. The difficulty — and the reason Khloe stayed and returned as long as she did — is that the Water + Water bond can feel irreplaceable even when the relationship is damaging.', 'Cancer\'s most characteristic pattern when hurt is to stay too long because the connection feels too deep to walk away from. When they do finally leave, it tends to be permanent. The 2022 revelation that led to their final separation appears to have been that moment.'] },
    ],
    faqs: [
      { question: 'What is Khloe Kardashian\'s zodiac sign?', answer: 'Khloe Kardashian is a Cancer, born June 27, 1984. Cancer is a Water sign known for fierce family loyalty, emotional depth, a protective instinct, and a tendency to stay in difficult situations longer than their own wellbeing recommends because the connection feels too real to leave.' },
      { question: 'What is Tristan Thompson\'s zodiac sign?', answer: 'Tristan Thompson is a Pisces, born March 13, 1991. Pisces is a Water sign known for emotional sensitivity, charm, the capacity for genuine connection, and — in its more difficult expression — a relationship with boundaries and fidelity that can be inconsistent.' },
      { question: 'Are Khloe Kardashian and Tristan Thompson compatible?', answer: 'Cancer + Pisces is a Water + Water pairing that scores 80/100. The emotional resonance is genuine and the connection is real; the challenge is that high Water compatibility doesn\'t resolve the fundamental question of whether both people are equally committed to honoring it.' },
    ],
    related: ['cancer-in-love', 'pisces-in-love', 'johnny-cash-and-june-carter-cash'],
  },

  'emily-blunt-and-john-krasinski': {
    title: 'Emily Blunt & John Krasinski: A Pisces and a Libra Who Make It Look Easy',
    description: 'Emily Blunt is a Pisces. John Krasinski is a Libra. Water + Air scores 50/100 — but their partnership is one of Hollywood\'s most functional. Married since 2010.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Pisces',
    compatLink: '/compatibility/libra-and-pisces',
    intro: 'Emily Blunt (Pisces, February 23, 1983) and John Krasinski (Libra, October 20, 1979) married in July 2010, having met at a dinner party in 2008. They have two daughters. They made A Quiet Place together in 2018 — John directing, Emily starring — and have maintained a level of public privacy that makes their relationship one of the more quietly remarkable in entertainment.',
    sections: [
      { heading: 'Pisces and Libra: The Feeling and the Balance', paragraphs: ['Pisces is the empath — the person who feels the room, who processes experience through intuition and emotion, who creates from a place of deep internal connection to what is happening. Emily Blunt\'s Pisces is in her acting: the ability to inhabit roles with a completeness that goes beyond technique, from The Devil Wears Prada to Oppenheimer.', 'Libra is the aesthete and the partner — the person who sees beauty in relationship, who commits to equity and balance, and who makes shared creative projects a natural mode of expression. John Krasinski\'s Libra is in his work as a filmmaker and writer, his natural warmth, and the evident investment he makes in the partnership — both the romantic one and the creative one.'] },
      { heading: 'Water + Air — 50/100', paragraphs: ['Air and Water don\'t share an element, which produces the characteristic friction of the 50/100: different processing styles, different primary orientations. But this pairing also has a particular complementarity — Air can help Water find language for what it\'s feeling; Water can help Air connect to the emotional reality beneath its ideas.', 'Their professional collaboration — most visibly in A Quiet Place — suggests that both people\'s orientations are genuinely compatible in practice. A Libra director and a Pisces actor in a film about the terror of being heard is, in retrospect, an almost astrologically inevitable combination.'] },
      { callout: 'They credit each other constantly in interviews. Emily has called him her favorite director. He has said she is the best actor he\'s ever worked with. A Libra who admires and a Pisces who feels seen: when those two things are real, the 50/100 becomes its own kind of home.' },
    ],
    faqs: [
      { question: 'What is Emily Blunt\'s zodiac sign?', answer: 'Emily Blunt is a Pisces, born February 23, 1983. Pisces is a Water sign known for empathic depth, the ability to inhabit experience fully, creative sensitivity, and an emotional intelligence that reads rooms before anyone else in them.' },
      { question: 'What is John Krasinski\'s zodiac sign?', answer: 'John Krasinski is a Libra, born October 20, 1979. Libra is an Air sign known for aesthetic vision, genuine warmth in partnership, creative collaboration as a natural mode, and the ability to make other people feel genuinely admired.' },
      { question: 'Are Emily Blunt and John Krasinski compatible?', answer: 'Libra + Pisces is a Water + Air pairing that scores 50/100. The 50/100 reflects real elemental differences in processing style; their sustained creative and romantic partnership across 15 years suggests that the complementarity — Air giving language to Water\'s feeling, Water giving depth to Air\'s ideas — is genuinely workable when both people are committed to it.' },
    ],
    related: ['pisces-in-love', 'libra-in-love', 'moon-sign-compatibility'],
  },

  'george-and-amal-clooney': {
    title: 'George & Amal Clooney: A Taurus and an Aquarius Who Surprised Everyone',
    description: 'George Clooney is a Taurus. Amal Clooney is an Aquarius. Earth + Air scores 45/100 — he said he\'d never marry again. He met a human rights lawyer and changed his mind. Married 2014.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Aquarius',
    compatLink: '/compatibility/taurus-and-aquarius',
    intro: 'George Clooney (Taurus, May 6, 1961) and Amal Alamuddin Clooney (Aquarius, February 3, 1978) married in September 2014 in Venice. George was 53. He had publicly stated for years that he would not remarry. They have twins — Alexander and Ella — born in 2017. George has said the relationship changed how he understood what was possible in his life.',
    sections: [
      { heading: 'Taurus and Aquarius: Fixed Signs, Different Worlds', paragraphs: ['Taurus and Aquarius are both fixed signs — stubborn, committed to their positions, and difficult to move once settled. The difference is in what they\'re fixed on: Taurus is fixed on the tangible, the sensory, the real and enduring; Aquarius is fixed on the ideal, the principle, the vision of what should exist.', 'George\'s Taurus is in his long career of deliberate choices — the films he has made and declined, the home in Italy that grounded him before the marriage, the commitment to craft. Amal\'s Aquarius is in her legal work: human rights cases, international tribunals, the defense of people in situations where most lawyers wouldn\'t appear. She is, professionally, someone who fights for what should exist rather than what does.'] },
      { heading: 'Earth + Air — 45/100', paragraphs: ['Earth and Air are not natural companions in the way that same-element or complementary-element pairings are. The 45/100 reflects real differences in orientation. But the fixed quality they share — both signs holding their positions with conviction — can also produce a pairing where both people respect each other\'s commitment to what they believe.', 'The most notable thing about their dynamic is how consistently George has described it as changing him: not just that he found someone, but that he found someone whose work and mind made his pre-2014 life look like it was missing something real. That\'s a Taurus being genuinely surprised by an Aquarius — the fixed Earth sign discovering that the fixed Air sign operates at a frequency it hadn\'t encountered before.'] },
    ],
    faqs: [
      { question: 'What is George Clooney\'s zodiac sign?', answer: 'George Clooney is a Taurus, born May 6, 1961. Taurus is an Earth sign known for deliberateness, loyalty, aesthetic commitment, and a fixed nature that — when it finally decides something is worth committing to — commits completely.' },
      { question: 'What is Amal Clooney\'s zodiac sign?', answer: 'Amal Clooney is an Aquarius, born February 3, 1978. Aquarius is an Air sign known for humanitarian conviction, intellectual independence, the pursuit of justice, and a fixed commitment to principle that is difficult to redirect.' },
      { question: 'Are George and Amal Clooney compatible?', answer: 'Taurus + Aquarius is an Earth + Air pairing that scores 45/100. The 45/100 reflects real elemental differences; the shared fixed nature — both signs committed to their convictions — and the mutual respect for quality and substance may be what makes the lower elemental compatibility workable.' },
    ],
    related: ['taurus-in-love', 'aquarius-in-love', 'sonny-and-cher'],
  },

  'nicole-kidman-and-keith-urban': {
    title: 'Nicole Kidman & Keith Urban: A Gemini and a Scorpio Who Found Each Other at the Right Moment',
    description: 'Nicole Kidman is a Gemini. Keith Urban is a Scorpio. Air + Water scores 55/100 — married 2006, they\'ve built one of the more quietly durable partnerships in entertainment.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Scorpio',
    compatLink: '/compatibility/gemini-and-scorpio',
    intro: 'Nicole Kidman (Gemini, June 20, 1967) and Keith Urban (Scorpio, October 26, 1967) married in June 2006, a few months after Nicole\'s 39th birthday and Keith\'s recovery from addiction. They have two daughters — Sunday Rose and Faith Margaret. They\'ve been together for nearly two decades.',
    sections: [
      { heading: 'Gemini and Scorpio: Fast Mind, Deep Water', paragraphs: ['Gemini moves quickly — in thought, in conversation, in the way it approaches experience. Scorpio goes deep — slowly, surely, tracking what\'s real beneath the surface. These two signs don\'t naturally share a language, which makes their pairing one of the more surprising combinations when it works.', 'Nicole\'s Gemini is in her range — the sheer variety of what she has played, the ability to disappear into a role, the public persona that is genuinely difficult to locate because she\'s so good at presenting multiple versions. Keith\'s Scorpio is in the music — the emotional intensity of his best work, the survival of addiction, and the loyalty that Scorpio extends when it has decided someone is worth it.'] },
      { heading: 'Air + Water — 55/100', paragraphs: ['Air and Water are different in their primary orientations, which is where the 55/100 comes from. But Air + Water pairings have a particular complementarity: Scorpio\'s depth can give Gemini\'s range somewhere to land; Gemini\'s lightness can help Scorpio breathe through the intensity that is its natural atmosphere.', 'Keith has been candid about the role Nicole played in his sobriety in the early years of their relationship. He went to rehab four months after they married. She didn\'t leave. That moment — and what she chose to do — appears to have been the foundation of what\'s followed.'] },
    ],
    faqs: [
      { question: 'What is Nicole Kidman\'s zodiac sign?', answer: 'Nicole Kidman is a Gemini, born June 20, 1967. Gemini is an Air sign known for range, adaptability, intellectual quickness, and the ability to inhabit multiple registers simultaneously — which makes her one of the more technically interesting actresses of her generation.' },
      { question: 'What is Keith Urban\'s zodiac sign?', answer: 'Keith Urban is a Scorpio, born October 26, 1967. Scorpio is a Water sign known for emotional depth, survival, loyalty, and music that tends to go somewhere real rather than somewhere safe.' },
      { question: 'Are Nicole Kidman and Keith Urban compatible?', answer: 'Gemini + Scorpio is an Air + Water pairing that scores 55/100. The fundamental difference in orientation requires navigation; the choice Nicole made in 2006, and what Keith chose to build from that moment, suggests both people were genuinely committed to what the relationship required.' },
    ],
    related: ['gemini-in-love', 'scorpio-in-love', 'moon-sign-compatibility'],
  },

  'kylie-jenner-and-timothee-chalamet': {
    title: 'Kylie Jenner & Timothée Chalamet: A Leo and a Capricorn in the Most Photographed Relationship of 2023',
    description: 'Kylie Jenner is a Leo. Timothée Chalamet is a Capricorn. Fire + Earth scores 50/100 — they dated through much of 2023 and into 2024. High visibility, limited public disclosure.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Capricorn',
    compatLink: '/compatibility/leo-and-capricorn',
    intro: 'Kylie Jenner (Leo, August 10, 1997) and Timothée Chalamet (Capricorn, December 27, 1995) were linked in early 2023, attended the US Open and Beyoncé\'s Renaissance Tour together, and made their red-carpet debut at the Golden Globes in January 2024. The relationship appeared to end in 2024 without public statement.',
    sections: [
      { heading: 'Leo and Capricorn: Sun and Saturn', paragraphs: ['Leo is ruled by the Sun — the sign of warmth, visibility, identity, and the desire to be seen. Kylie\'s Leo is in her business empire (Kylie Cosmetics, the Jenner brand as a whole), her social media presence (one of the most followed people alive), and the way she inhabits visibility with apparent ease.', 'Capricorn is ruled by Saturn — the sign of discipline, privacy, craft, and a deep ambivalence about the kind of celebrity that Leo finds natural. Timothée\'s Capricorn is in his acting choices (deliberately unglamorous roles alongside prestige productions), his general avoidance of the influencer economy, and the very different relationship he has with public attention.'] },
      { heading: 'Fire + Earth — 50/100', paragraphs: ['The 50/100 reflects the fundamental difference between Leo\'s relationship with visibility and Capricorn\'s. Leo needs to be seen; Capricorn tends to protect what it values by keeping it private. A Leo who lives at the center of global media attention and a Capricorn who manages celebrity as a necessary inconvenience of craft may find that the gap between their public orientations is difficult to bridge in private.', 'Their relationship was notably one-sided in terms of public disclosure: Kylie\'s social media life and the Kardashian-Jenner platform created a documentation that Timothée\'s own choices would never have produced. Whether that asymmetry was part of what ended things is not something either has said publicly.'] },
    ],
    faqs: [
      { question: 'What is Kylie Jenner\'s zodiac sign?', answer: 'Kylie Jenner is a Leo, born August 10, 1997. Leo is a Fire sign known for warmth, a natural relationship with visibility, entrepreneurial confidence, and a need to feel genuinely seen in the relationships that matter to them.' },
      { question: 'What is Timothée Chalamet\'s zodiac sign?', answer: 'Timothée Chalamet is a Capricorn, born December 27, 1995. Capricorn is an Earth sign known for commitment to craft, a complicated relationship with celebrity, discipline, and the tendency to protect what is private rather than perform it.' },
      { question: 'Were Kylie Jenner and Timothée Chalamet compatible?', answer: 'Leo + Capricorn is a Fire + Earth pairing that scores 50/100. Leo\'s comfort with visibility and Capricorn\'s instinct to protect what is private represents one of the more fundamental compatibility challenges in this pairing.' },
    ],
    related: ['leo-in-love', 'capricorn-in-love', 'kim-kardashian-and-lewis-hamilton'],
  },

  'harry-styles-and-olivia-wilde': {
    title: 'Harry Styles & Olivia Wilde: An Aquarius and a Pisces Who Made Headlines',
    description: 'Harry Styles is an Aquarius. Olivia Wilde is a Pisces. Air + Water scores 50/100 — they met on the set of Don\'t Worry Darling in 2021 and were together until late 2022.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Pisces',
    compatLink: '/compatibility/aquarius-and-pisces',
    intro: 'Harry Styles (Aquarius, February 1, 1994) and Olivia Wilde (Pisces, March 10, 1984) became public as a couple at a wedding in January 2021, having met while making Don\'t Worry Darling. He is 10 years younger. They dated for nearly two years, with their relationship overlapping with the production and release of the film.',
    sections: [
      { heading: 'Aquarius and Pisces: The Visionary and the Empath', paragraphs: ['Aquarius is the sign of the visionary — independent, intellectually driven, animated by ideals and the future. Harry\'s Aquarius is in the refusal to be categorized, the gender-fluid fashion, the music that tends to be about freedom and self-definition, and the particular warmth that Aquarius has for humanity in general even when it maintains some distance from any individual.', 'Pisces is the empath — deeply feeling, romantic, and oriented toward the emotional texture of experience. Olivia\'s Pisces is in her creative work as a director (Booksmart, Don\'t Worry Darling) and in the emotional intelligence she brings to making films about the interior lives of women.'] },
      { heading: 'Air + Water — 50/100', paragraphs: ['Adjacent signs can produce a natural ease or a subtle disconnect — Aquarius and Pisces are neighbors in the zodiac but different enough in orientation that the 50/100 reflects real translation required. Air processes experience through ideas; Water processes through feeling. Aquarius values independence; Pisces needs genuine emotional presence.', 'Their relationship navigated an enormous amount of public noise — the Don\'t Worry Darling press tour, various tabloid narratives. When they ended in late 2022, neither commented substantially. That Aquarian refusal to perform the end of something, and that Piscean tendency to hold what happened privately, may be the most astrologically on-brand thing about how it concluded.'] },
    ],
    faqs: [
      { question: 'What is Harry Styles\'s zodiac sign?', answer: 'Harry Styles is an Aquarius, born February 1, 1994. Aquarius is an Air sign known for independence, idealism, a refusal to be categorized, and warmth for people in general that can coexist with genuine aloofness in the particular.' },
      { question: 'What is Olivia Wilde\'s zodiac sign?', answer: 'Olivia Wilde is a Pisces, born March 10, 1984. Pisces is a Water sign known for creative empathy, emotional depth, romantic idealism, and a tendency to process difficult experiences internally rather than performing them publicly.' },
      { question: 'Were Harry Styles and Olivia Wilde compatible?', answer: 'Aquarius + Pisces is an Air + Water pairing that scores 50/100. The adjacent-sign connection has natural ease at times; the difference in how Air and Water process experience — through ideas versus through feeling — is the recurring friction point.' },
    ],
    related: ['aquarius-in-love', 'pisces-in-love', 'paul-newman-and-joanne-woodward'],
  },

  'joe-jonas-and-sophie-turner': {
    title: 'Joe Jonas & Sophie Turner: A Leo and a Pisces in a Short Marriage',
    description: 'Joe Jonas is a Leo. Sophie Turner is a Pisces. Fire + Water scores 60/100 — married 2019, divorced 2023. Two daughters together.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Pisces',
    compatLink: '/compatibility/leo-and-pisces',
    intro: 'Joe Jonas (Leo, August 15, 1989) and Sophie Turner (Pisces, February 21, 1996) married in Las Vegas in May 2019, then again with a formal ceremony in France that June. They have two daughters — Willa and Delphine. Joe filed for divorce in September 2023. It was finalized in 2024.',
    sections: [
      { heading: 'Leo and Pisces: The Sun and the Deep', paragraphs: ['Leo radiates outward — it is the sign of warmth, performance, and the need to be genuinely seen and celebrated. Joe\'s Leo is in the performance history (the Jonas Brothers, the career that has spanned nearly 20 years), the natural ease with public life, and the personal charm that has been part of his persona since his teens.', 'Pisces goes deep — inward, emotional, oriented toward feeling and the invisible texture of experience. Sophie\'s Pisces is in the acting (Game of Thrones required exactly the Pisces capacity for empathic inhabitation) and in the privacy she has sought around her personal life despite existing in one of the most photographed families in entertainment.'] },
      { heading: 'Fire + Water — 60/100', paragraphs: ['Fire and Water are attracted to each other — Fire\'s warmth and expressiveness are magnetic to Water\'s depth; Water\'s emotional richness is something Fire genuinely wants to connect with. The 60/100 reflects this real compatibility alongside the central tension: Leo needs to shine publicly; Pisces tends to need the private interior to be genuinely protected.', 'Reports around their divorce suggested disagreements about where to live (she wanted England; he was based in the US) — a geographic argument that may also reflect the deeper tension between Leo\'s comfort with the visible life and Pisces\'s need for a quiet private one. Custody of two daughters adds a permanence to the relationship that the divorce doesn\'t fully end.'] },
    ],
    faqs: [
      { question: 'What is Joe Jonas\'s zodiac sign?', answer: 'Joe Jonas is a Leo, born August 15, 1989. Leo is a Fire sign known for warmth, natural performance energy, a need for genuine recognition, and loyalty to the people they love.' },
      { question: 'What is Sophie Turner\'s zodiac sign?', answer: 'Sophie Turner is a Pisces, born February 21, 1996. Pisces is a Water sign known for empathic depth, the preference for a genuine private interior, creative sensitivity, and the capacity to feel things more fully than any public expression of them suggests.' },
      { question: 'Were Joe Jonas and Sophie Turner compatible?', answer: 'Leo + Pisces is a Fire + Water pairing that scores 60/100. The genuine attraction between these elements coexists with the recurring tension between Leo\'s comfort with visibility and Pisces\'s need for a protected private life.' },
    ],
    related: ['leo-in-love', 'pisces-in-love', 'tom-brady-and-gisele-bundchen'],
  },

  'serena-williams-and-alexis-ohanian': {
    title: 'Serena Williams & Alexis Ohanian: A Libra and a Taurus Who Made It Work',
    description: 'Serena Williams is a Libra. Alexis Ohanian is a Taurus. Air + Earth scores 50/100 — married 2017, they\'ve built a family and maintained a genuinely private life beside enormous public careers.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Taurus',
    compatLink: '/compatibility/taurus-and-libra',
    intro: 'Serena Williams (Libra, September 26, 1981) and Alexis Ohanian (Taurus, April 24, 1983) married in November 2017 in New Orleans. They have a daughter, Alexis Olympia. Alexis stepped down from Reddit\'s board in 2020, citing racism, and dedicated his time to advocating for Black founders. Serena announced her "evolution" away from professional tennis in 2022.',
    sections: [
      { heading: 'Libra and Taurus: Both Ruled by Venus', paragraphs: ['Libra and Taurus share a planetary ruler — both are Venus signs, which means both are oriented toward beauty, pleasure, quality, and the value of what is made and how it feels. Taurus\'s Venus is sensory and grounded; Libra\'s Venus is relational and aesthetic. The shared rulership creates a natural affinity around taste and the investment in what is beautiful.', 'Serena\'s Libra is in her game — the grace of her play, the aesthetics she has brought to tennis fashion, and the diplomatic intelligence she has navigated in a sport and culture that has not always treated her fairly. Alexis\'s Taurus is in Reddit (a platform he built from the ground up), in his investment in long-term projects, and in the consistent, low-drama presence he has maintained beside one of the most famous athletes alive.'] },
      { heading: 'Air + Earth — 50/100', paragraphs: ['Air and Earth process the world differently — Air through ideas and social navigation; Earth through the tangible and durable. The 50/100 reflects real differences that require translation. What the shared Venus rulership offers is a common language around beauty, investment, and what is worth building — which can bridge elemental differences.', 'Alexis has been openly supportive of Serena in ways that are notably low-ego for a person with his own significant career: attending matches, managing logistics, stepping back from work commitments to be present for their daughter. That\'s Taurus expressing love through action and presence rather than declaration.' ],
      },
    ],
    faqs: [
      { question: 'What is Serena Williams\'s zodiac sign?', answer: 'Serena Williams is a Libra, born September 26, 1981. Libra is a Venus-ruled Air sign known for grace, aesthetic intelligence, diplomatic navigation of unfair conditions, and a commitment to excellence that is as much about how things look as how they perform.' },
      { question: 'What is Alexis Ohanian\'s zodiac sign?', answer: 'Alexis Ohanian is a Taurus, born April 24, 1983. Taurus is a Venus-ruled Earth sign known for building things that endure, loyalty expressed through consistent action, and a relationship with presence and support that doesn\'t require center stage.' },
      { question: 'Are Serena Williams and Alexis Ohanian compatible?', answer: 'Libra + Taurus is an Air + Earth pairing that scores 50/100. The shared Venus rulership — both signs oriented toward beauty, quality, and the investment in what is worth building — provides a common foundation that bridges the elemental differences.' },
    ],
    related: ['libra-in-love', 'taurus-in-love', 'moon-sign-compatibility'],
  },

  'lebron-and-savannah-james': {
    title: 'LeBron James & Savannah James: A Capricorn and a Virgo Who Have Never Wavered',
    description: 'LeBron James is a Capricorn. Savannah James is a Virgo. Earth + Earth scores 75/100 — high school sweethearts, married 2013, one of sports\' most quietly enduring marriages.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Capricorn',
    compatLink: '/compatibility/virgo-and-capricorn',
    intro: 'LeBron James (Capricorn, December 30, 1984) and Savannah Brinson James (Virgo, August 27, 1986) have been together since they were teenagers in Akron, Ohio. They married in September 2013. They have three children. Savannah has been beside him through four NBA championships, three cities, and the full arc of one of the most extraordinary athletic careers in American sports history.',
    sections: [
      { heading: 'Two Earth Signs with One Foundation', paragraphs: ['Capricorn and Virgo are both Earth signs — both oriented toward the real, the durable, and the commitment that builds something over time rather than seeking the emotion of the moment. LeBron\'s Capricorn is total: the relentless work ethic, the business empire built alongside the basketball career, the long-term thinking about legacy, and the discipline to sustain peak performance across two decades.', 'Savannah\'s Virgo is in the steadiness — the deliberate choice to raise their family with intention, the 330 Foundation she co-founded to serve families in Akron, and the particular Virgo quality of being the person who makes the life run well without needing the spotlight for doing so.'] },
      { heading: 'Earth + Earth — 75/100', paragraphs: ['Two Earth signs build something real. The 75/100 reflects the natural compatibility between two signs that share values around commitment, loyalty, and the work of building a life that is genuinely substantial. High school sweethearts who grow up alongside each other and choose each other at each stage have a foundation that no compatibility score can fully capture.', 'What\'s notable about their dynamic is how consistently Savannah has maintained her own identity — her design work, her philanthropy, her presence in Akron — rather than being defined entirely by LeBron\'s career. That\'s Virgo: the sign that doesn\'t disappear into someone else\'s story, even when that story is enormous.' ] },
    ],
    faqs: [
      { question: 'What is LeBron James\'s zodiac sign?', answer: 'LeBron James is a Capricorn, born December 30, 1984. Capricorn is an Earth sign known for disciplined ambition, long-term thinking, legacy-building, and the sustained commitment to excellence that produces careers that redefine what is possible.' },
      { question: 'What is Savannah James\'s zodiac sign?', answer: 'Savannah James is a Virgo, born August 27, 1986. Virgo is an Earth sign known for attentiveness, the ability to make a complex life run well without requiring recognition for doing so, and a commitment to community that shows up in concrete, practical ways.' },
      { question: 'Are LeBron and Savannah James compatible?', answer: 'Virgo + Capricorn is an Earth + Earth pairing that scores 75/100. Two Earth signs who have chosen each other through every stage of a major life — from teenagers in Akron to the summit of professional sports — represent the most durable kind of compatibility.' },
    ],
    related: ['capricorn-in-love', 'virgo-in-love', 'humphrey-bogart-and-lauren-bacall'],
  },

  'lionel-messi-and-antonela-roccuzzo': {
    title: 'Lionel Messi & Antonela Roccuzzo: A Cancer and a Pisces Who Go All the Way Back',
    description: 'Lionel Messi is a Cancer. Antonela Roccuzzo is a Pisces. Water + Water scores 80/100 — childhood friends from Rosario, Argentina, married 2017.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Lionel Messi (Cancer, June 24, 1987) and Antonela Roccuzzo (Pisces, February 26, 1988) have known each other since they were children in Rosario, Argentina — she was the cousin of his best friend. They married in June 2017. They have three sons. Their relationship has been private, stable, and entirely at odds with the scale of Messi\'s public fame.',
    sections: [
      { heading: 'Cancer and Pisces: Going Home', paragraphs: ['Cancer and Pisces are both Water signs that trine each other — 120 degrees apart, one of astrology\'s most naturally harmonious placements. Cancer builds a home; Pisces finds their depth in the people who feel safe. When these two signs are genuinely matched, the relationship tends to become, quite literally, a home — not a location but a person.', 'Messi\'s Cancer is in the attachment to origin: the difficulty of leaving Rosario (he left at 13 for Barcelona), the lifelong relationship with his childhood friend\'s cousin, and the reported homesickness that has followed him across his entire career. His greatest public moments — World Cup 2022, Copa América — have been paired with visible emotional releases that are completely Cancer: the crying, the relief, the sense that the triumph was for something larger than individual achievement.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs together have an emotional resonance that comes from shared orientation rather than compromise. The 80/100 reflects that Cancer and Pisces naturally support each other: Cancer provides the protective structure; Pisces provides the empathic openness. Both benefit from the other\'s presence.', 'Their relationship has been remarkable in the context of elite football — a sport that destroys many marriages through its demands. Antonela has followed Messi across three countries (Argentina, Spain, France, now the United States), raising three sons in each context. That\'s Pisces adaptability in service of a Cancerian home that is defined not by location but by person.'] },
    ],
    faqs: [
      { question: 'What is Lionel Messi\'s zodiac sign?', answer: 'Lionel Messi is a Cancer, born June 24, 1987. Cancer is a Water sign known for deep emotional attachment, the carrying of home as a feeling rather than a location, fierce loyalty to origin and family, and a competitive drive that is ultimately in service of something personal.' },
      { question: 'What is Antonela Roccuzzo\'s zodiac sign?', answer: 'Antonela Roccuzzo is a Pisces, born February 26, 1988. Pisces is a Water sign known for empathy, adaptability, the capacity to find depth and meaning in relationships rather than locations, and the ability to create safety for the people they love.' },
      { question: 'Are Messi and Antonela compatible?', answer: 'Cancer + Pisces is a Water + Water pairing that scores 80/100. Childhood friends who choose each other as adults and build a life that crosses three countries and three decades: the compatibility is written in the history, not just the astrology.' },
    ],
    related: ['cancer-in-love', 'pisces-in-love', 'johnny-cash-and-june-carter-cash'],
  },

  'cristiano-ronaldo-and-georgina-rodriguez': {
    title: 'Cristiano Ronaldo & Georgina Rodríguez: Two Aquarians Building an Empire',
    description: 'Cristiano Ronaldo is an Aquarius. Georgina Rodríguez is an Aquarius. Same sign, Air + Air scores 70/100 — together since 2016, parents of five children.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Aquarius',
    compatLink: '/compatibility/aquarius-and-aquarius',
    intro: 'Cristiano Ronaldo (Aquarius, February 5, 1985) and Georgina Rodríguez (Aquarius, January 27, 1994) met in 2016 when she was working as a Gucci sales assistant in Madrid. They are not married but have been together for nearly a decade, have five children together, and Georgina has a Netflix documentary, I Am Georgina, charting her own journey from obscurity to global celebrity.',
    sections: [
      { heading: 'Two Aquarians: Fixed Air Recognizing Fixed Air', paragraphs: ['Aquarius is a fixed Air sign — which means the independence is not mutable but structural. Two Aquarians together share that fixed independence: both people have their own vision, their own goals, and their own sense of self that doesn\'t require the relationship to define it. The same-sign recognition can be immediate.', 'Cristiano\'s Aquarius is in the relentless innovation (the CR7 brand as a global enterprise, the social media mastery, the constant reinvention of what he is beyond footballer), the humanitarian commitments, and the individuality that has made him simultaneously one of the most universally followed people alive and genuinely difficult to categorize. Georgina\'s Aquarius is in her own trajectory — the deliberate construction of an independent platform from a position of zero name recognition.'] },
      { heading: 'Air + Air — 70/100', paragraphs: ['Two Air signs share a natural fluency in the realm of ideas, communication, and social presence. The 70/100 reflects that same-sign Air pairings produce real rapport alongside the challenge of two fixed people in the same relationship — both can be stubborn, both can be resistant to changing their position.', 'The notable thing about their dynamic is how independently both have built their public presences while remaining deeply committed to each other and to their family. Georgina has spoken about the sacrifices she made in the early years; Ronaldo has spoken publicly about his commitment to her and their children. The Aquarian independence on both sides seems to have created a partnership where both people know who they are without needing the relationship to answer that question.' ] },
    ],
    faqs: [
      { question: 'What is Cristiano Ronaldo\'s zodiac sign?', answer: 'Cristiano Ronaldo is an Aquarius, born February 5, 1985. Aquarius is an Air sign known for fixed independence, the construction of a personal brand and vision that is larger than any single context, humanitarian commitments, and the refusal to be limited by conventional categories.' },
      { question: 'What is Georgina Rodríguez\'s zodiac sign?', answer: 'Georgina Rodríguez is an Aquarius, born January 27, 1994. As a fellow Aquarius, she shares the fixed independence and the capacity to build her own identity from the ground up — which she has done, from retail sales to global celebrity, within the context of one of the most visible relationships in the world.' },
      { question: 'Are Ronaldo and Georgina compatible?', answer: 'Aquarius + Aquarius is a same-sign Air + Air pairing that scores 70/100. The mutual independence and shared fixed nature produce a relationship where both people know who they are and choose each other from that knowing — which tends to be more stable than partnerships where identity requires the relationship to be legible.' },
    ],
    related: ['aquarius-in-love', 'ellen-degeners-and-portia-de-rossi', 'moon-sign-compatibility'],
  },

  'ellen-degeners-and-portia-de-rossi': {
    title: 'Ellen DeGeneres & Portia de Rossi: Two Aquarians, One Quiet Life',
    description: 'Ellen DeGeneres is an Aquarius. Portia de Rossi is an Aquarius. Air + Air, same sign, 70/100 — married 2008, one of the longest marriages in Hollywood.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Aquarius',
    compatLink: '/compatibility/aquarius-and-aquarius',
    intro: 'Ellen DeGeneres (Aquarius, January 26, 1958) and Portia de Rossi (Aquarius, January 31, 1973) married on August 16, 2008 — three months after California first legalized same-sex marriage. They have been together since 2004. Ellen ended The Ellen DeGeneres Show in 2022 after 19 seasons. They live quietly in Santa Barbara.',
    sections: [
      { heading: 'Two Aquarians: Shared Independence, Shared Vision', paragraphs: ['Aquarius is the sign of the individual within the collective — the person who holds their independence as central while also caring deeply about humanity. Two Aquarians together share that orientation: both people bring their own vision to the partnership, and neither requires the other to be the source of their identity.', 'Ellen\'s Aquarius is in the comedy that was always about observation and humanity, the coming out in 1997 that was a genuinely consequential public act, and the television career that used visibility as a vehicle for inclusion. Portia\'s Aquarius is in the acting, in the honesty of her memoir Unbearable Lightness about eating disorders and coming out, and in the deliberate choice to build a life that is genuinely private despite existing beside one of the most recognized entertainers alive.'] },
      { heading: 'Air + Air — 70/100', paragraphs: ['Two Air signs together produce a natural fluency in communication and a mutual respect for independence that can feel, to both people, like relief. The 70/100 reflects the genuine compatibility of same-sign Air alongside the challenge of two fixed Aquarians: both people can hold their positions firmly, and the same independence that makes the partnership functional can occasionally make mutual adaptation difficult.', 'They\'ve spent the years since The Ellen Show ended in what appears to be a genuinely quieter life — travel, their farm, less public documentation. That\'s two Aquarians choosing, together, to step back from the machinery of visibility when it no longer serves what they\'re building.' ] },
    ],
    faqs: [
      { question: 'What is Ellen DeGeneres\'s zodiac sign?', answer: 'Ellen DeGeneres is an Aquarius, born January 26, 1958. Aquarius is an Air sign known for humanitarian warmth, independence, the use of visibility for larger purposes, and a fixed nature that holds its positions — including the courage to come out in 1997 — with conviction.' },
      { question: 'What is Portia de Rossi\'s zodiac sign?', answer: 'Portia de Rossi is an Aquarius, born January 31, 1973. Aquarius is an Air sign known for honest self-examination, independence, the ability to build a life beside enormous public visibility while maintaining a genuine private center.' },
      { question: 'Are Ellen and Portia compatible?', answer: 'Aquarius + Aquarius is a same-sign Air + Air pairing that scores 70/100. Two Aquarians who have chosen each other and built a life across 20 years represent one of the more durable expressions of what same-sign compatibility can look like when both people are genuinely committed to independence alongside partnership.' },
    ],
    related: ['aquarius-in-love', 'cristiano-ronaldo-and-georgina-rodriguez', 'moon-sign-compatibility'],
  },

  'mila-kunis-and-ashton-kutcher': {
    title: 'Mila Kunis & Ashton Kutcher: A Leo and an Aquarius Who Were Friends First',
    description: 'Mila Kunis is a Leo. Ashton Kutcher is an Aquarius. Fire + Air scores 65/100 — co-stars on That \'70s Show for years, they became a couple in 2012. Married 2015.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Aquarius',
    compatLink: '/compatibility/leo-and-aquarius',
    intro: 'Mila Kunis (Leo, August 14, 1983) and Ashton Kutcher (Aquarius, February 7, 1978) played on-screen love interests on That \'70s Show for eight seasons (1998–2006). They began dating in 2012, married in July 2015, and have two children — Wyatt and Dimitri. He was her first kiss, on the show, when she was 14 and he was 20.',
    sections: [
      { heading: 'Leo and Aquarius: Opposite Signs, Natural Axis', paragraphs: ['Leo and Aquarius sit directly opposite each other in the zodiac — both are fixed signs, both are concerned with identity and expression, but they express it differently. Leo is personal: warmth, individual identity, the need to be genuinely seen. Aquarius is collective: the vision, the ideals, the individual as part of something larger than themselves.', 'Mila\'s Leo is in her screen presence and the warmth she brings to roles that require someone immediately likeable and genuine. Ashton\'s Aquarius is in the tech investments (he was an early investor in Airbnb, Skype, and others), the social media savvy, and the tendency to be ahead of the cultural conversation.'] },
      { heading: 'Fire + Air — 65/100', paragraphs: ['Fire and Air are complementary elements — Air feeds Fire, which grows larger and brighter. The 65/100 reflects genuine compatibility between Leo and Aquarius despite the opposition: the shared fixed nature produces stability, and the elemental complementarity produces real energy.', 'Their eight years as work friends before becoming a couple gave them a foundation that most relationships don\'t have. By the time they were together romantically, both people knew who the other person actually was — not who they were performing on a first date. That kind of knowledge is harder to achieve than any compatibility score reflects.' ] },
    ],
    faqs: [
      { question: 'What is Mila Kunis\'s zodiac sign?', answer: 'Mila Kunis is a Leo, born August 14, 1983. Leo is a Fire sign known for warmth, natural screen presence, genuine expressiveness, and the need for authentic recognition in relationships that matter.' },
      { question: 'What is Ashton Kutcher\'s zodiac sign?', answer: 'Ashton Kutcher is an Aquarius, born February 7, 1978. Aquarius is an Air sign known for visionary investment, ahead-of-the-curve cultural positioning, independence, and a warmth for people that operates at a collective rather than purely personal register.' },
      { question: 'Are Mila Kunis and Ashton Kutcher compatible?', answer: 'Leo + Aquarius is an opposite-sign Fire + Air pairing that scores 65/100. Opposite signs share an axis and often have more in common than their differences suggest; the years of friendship before romance gave them a foundation that makes the opposition workable.' },
    ],
    related: ['leo-in-love', 'aquarius-in-love', 'jennifer-lopez-and-ben-affleck'],
  },

  'simone-biles-and-jonathan-owens': {
    title: 'Simone Biles & Jonathan Owens: A Pisces and a Cancer Who Chose Each Other',
    description: 'Simone Biles is a Pisces. Jonathan Owens is a Cancer. Water + Water scores 80/100 — met during COVID, engaged 2022, married 2023.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Simone Biles (Pisces, March 14, 1997) and Jonathan Owens (Cancer, July 22, 1995) met through a dating app in 2020. He proposed in February 2022. They married in April 2023 in Houston, then again in May 2023 in Cabo San Lucas. She is the most decorated gymnast in history. He is an NFL safety.',
    sections: [
      { heading: 'Cancer and Pisces: Water Meeting Water', paragraphs: ['Cancer and Pisces are naturally harmonious Water signs — both emotionally attuned, both oriented toward home and safety, both capable of the kind of deep feeling that can sustain a relationship across difficulty. For Simone, whose 2020-2021 included the Tokyo Olympics withdrawal and the years of publicly processing the abuse she survived, finding someone who could hold that emotional weight without being overwhelmed by it was not a given.', 'Jonathan\'s Cancer is in the nurturing quality he has described publicly — the consistent support, the presence at every meet and event, the willingness to be the grounding presence for someone who is simultaneously managing the weight of being the greatest of all time. Cancer builds a home; Pisces needs one. When Cancer finds a Pisces worth anchoring, the attachment tends to be total.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['The 80/100 reflects the natural resonance of these two signs. What\'s notable about their relationship is the speed at which it moved from "met through an app" to "engaged and married" — which is both very Water (the emotional conviction is fast once it arrives) and very Simone (the Pisces instinct for knowing what is real when it finally appears).', 'She has spoken about how grounded their relationship is — the normalcy of it, the way he sees her as a person rather than a symbol. That\'s Cancer: the sign that creates the experience of being seen for who you are rather than what you\'ve accomplished.' ] },
    ],
    faqs: [
      { question: 'What is Simone Biles\'s zodiac sign?', answer: 'Simone Biles is a Pisces, born March 14, 1997. Pisces is a Water sign known for empathic depth, the capacity for greatness alongside genuine vulnerability, and the need for a safe emotional home as counterweight to an enormous public one.' },
      { question: 'What is Jonathan Owens\'s zodiac sign?', answer: 'Jonathan Owens is a Cancer, born July 22, 1995. Cancer is a Water sign known for nurturing presence, the ability to create a genuine sense of home for the people they love, and a protective loyalty that shows up in consistent action rather than declaration.' },
      { question: 'Are Simone Biles and Jonathan Owens compatible?', answer: 'Cancer + Pisces is a Water + Water pairing that scores 80/100. The mutual attunement of these two signs — Cancer\'s protective grounding and Pisces\'s empathic depth — produces one of the most naturally harmonious configurations in astrology.' },
    ],
    related: ['pisces-in-love', 'cancer-in-love', 'johnny-cash-and-june-carter-cash'],
  },

  'dwyane-wade-and-gabrielle-union': {
    title: 'Dwyane Wade & Gabrielle Union: A Capricorn and a Libra Who Built Something Real',
    description: 'Dwyane Wade is a Capricorn. Gabrielle Union is a Libra. Earth + Air scores 50/100 — married 2014, they\'ve built a family and a public partnership defined by honesty.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Capricorn',
    compatLink: '/compatibility/libra-and-capricorn',
    intro: 'Dwyane Wade (Capricorn, January 17, 1982) and Gabrielle Union (Libra, October 29, 1972) married on August 30, 2014, after several years together that included a break during which Dwyane fathered a child with another woman. They navigated that publicly and chose to rebuild. They have a daughter, Kaavia James, via surrogate, and Dwyane has three children from previous relationships.',
    sections: [
      { heading: 'Capricorn and Libra: Structure Meets Grace', paragraphs: ['Capricorn builds — structures, careers, legacies, and the kind of sustained excellence that requires years of sustained commitment. Dwyane\'s Capricorn is in the basketball career (13 NBA seasons, three championships), the business interests, and the particular discipline required to maintain elite performance across decades.', 'Libra negotiates — harmony, fairness, the management of relationship as an ongoing project rather than a fixed state. Gabrielle\'s Libra is in the acting career, the beauty business, the public advocacy for equality in Hollywood and beyond, and the willingness to work through difficulty in the relationship rather than perform an easy version of it.'] },
      { heading: 'Earth + Air — 50/100', paragraphs: ['Earth and Air are different in their primary orientations — Earth tangible, Air relational — which generates the 50/100 and requires ongoing translation. But Libra and Capricorn are both cardinal signs, which means both people are oriented toward action and initiation rather than waiting for things to happen.', 'Their public handling of the 2013 revelation about Dwyane\'s other child — the conversations, the decision to stay, the work they\'ve described doing in their relationship — is consistent with Libra\'s instinct toward equity and Capricorn\'s commitment to what has been built. Neither sign walks away easily from something they\'ve invested in.' ] },
    ],
    faqs: [
      { question: 'What is Dwyane Wade\'s zodiac sign?', answer: 'Dwyane Wade is a Capricorn, born January 17, 1982. Capricorn is an Earth sign known for athletic discipline, commitment to excellence across a long career, the building of a legacy that extends beyond the primary achievement, and a loyalty to what has been built together.' },
      { question: 'What is Gabrielle Union\'s zodiac sign?', answer: 'Gabrielle Union is a Libra, born October 29, 1972. Libra is an Air sign known for grace, the active negotiation of fairness in relationship, a commitment to honesty about difficulty, and the capacity to rebuild something that has been damaged rather than simply abandoning it.' },
      { question: 'Are Dwyane Wade and Gabrielle Union compatible?', answer: 'Libra + Capricorn is an Air + Earth pairing that scores 50/100. The shared cardinal quality — both signs action-oriented and forward-moving — provides common ground that elemental differences can bridge when both people are committed to what they\'ve built.' },
    ],
    related: ['libra-in-love', 'capricorn-in-love', 'kim-kardashian-and-lewis-hamilton'],
  },

  'oprah-and-stedman-graham': {
    title: 'Oprah Winfrey & Stedman Graham: An Aquarius and a Pisces Who Chose Partnership Over Marriage',
    description: 'Oprah Winfrey is an Aquarius. Stedman Graham is a Pisces. Air + Water scores 50/100 — together since 1986, engaged in 1992, never married. Their arrangement has outlasted most marriages in Hollywood.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Pisces',
    compatLink: '/compatibility/aquarius-and-pisces',
    intro: 'Oprah Winfrey (Aquarius, January 29, 1954) and Stedman Graham (Pisces, March 6, 1951) have been together since 1986. He proposed in 1992. They chose not to marry, a decision Oprah has credited with preserving both the relationship and her sense of self. They have been together for nearly 40 years.',
    sections: [
      { heading: 'Aquarius Who Knows What She Needs', paragraphs: ['Aquarius values independence as a structural feature of identity — not as a refusal of relationship, but as a recognition that who they are doesn\'t fully live inside any role, including the role of spouse. Oprah\'s explanation for declining to marry has been consistent: she believed the dynamics of traditional marriage would change the relationship in ways that would damage it. That\'s Aquarius reasoning — clear-eyed, unconventional, and entirely committed to what actually works rather than what is expected to work.', 'Stedman\'s Pisces is in the particular quality of his presence in this relationship: supportive, consistent, private, and apparently unbothered by an arrangement that places him beside one of the most famous and powerful people alive without centering him. Pisces can inhabit the role of supportive presence without losing itself — and without requiring the spotlight that the other person\'s fame produces.'] },
      { heading: 'Nearly 40 Years', paragraphs: ['The longevity of their partnership is its own argument. Whatever the 50/100 Air + Water score reflects in terms of elemental differences, what actually happened is 40 years of consistent choice to remain. That\'s not compatibility — it\'s commitment. The Aquarius decided this was the right form. The Pisces adapted and stayed. The result outlasted the institution it declined to formalize.'] },
    ],
    faqs: [
      { question: 'What is Oprah Winfrey\'s zodiac sign?', answer: 'Oprah Winfrey is an Aquarius, born January 29, 1954. Aquarius is an Air sign known for independence as a core value, unconventional choices made from clarity rather than rebellion, visionary intelligence, and the willingness to define relationships on their own terms rather than inherited templates.' },
      { question: 'What is Stedman Graham\'s zodiac sign?', answer: 'Stedman Graham is a Pisces, born March 6, 1951. Pisces is a Water sign known for adaptability, the ability to inhabit a supportive role without losing one\'s sense of self, and a consistency of presence that doesn\'t require the center stage.' },
      { question: 'Are Oprah and Stedman compatible?', answer: 'Aquarius + Pisces is an Air + Water pairing that scores 50/100. The 50/100 reflects real elemental differences; the 40-year partnership is the more interesting data point. When the Aquarius defines the form and the Pisces can inhabit that form without needing it to change, the lower compatibility score becomes irrelevant.' },
    ],
    related: ['aquarius-in-love', 'pisces-in-love', 'paul-newman-and-joanne-woodward'],
  },

  'julia-roberts-and-danny-moder': {
    title: 'Julia Roberts & Danny Moder: A Scorpio and a Capricorn Who Made It Last',
    description: 'Julia Roberts is a Scorpio. Danny Moder is a Capricorn. Water + Earth scores 70/100 — married 2002, three children, one of Hollywood\'s longest marriages.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Scorpio', sign2: 'Capricorn',
    compatLink: '/compatibility/scorpio-and-capricorn',
    intro: 'Julia Roberts (Scorpio, October 28, 1967) and Daniel Moder (Capricorn, January 31, 1969) met on the set of The Mexican in 2001 and married in July 2002. They have three children — twins Hazel and Phinnaeus, and Henry. Julia has been one of the most famous actresses in Hollywood history; Danny works as a cinematographer and has stayed largely private.',
    sections: [
      { heading: 'Scorpio and Capricorn: Depth and Structure', paragraphs: ['Scorpio and Capricorn are both signs with tremendous staying power — Scorpio through emotional depth and loyalty, Capricorn through disciplined commitment to what has been built. The Water + Earth compatibility between them (70/100) reflects a pairing where depth meets structure, where the Scorpio\'s intensity has a Capricorn container, and where both people tend to stay in what they\'ve committed to.', 'Julia\'s Scorpio is in the intensity of her screen presence, the transformative range of her career, and the privacy she has maintained around her family despite her level of fame. Danny\'s Capricorn is in his craftsman relationship with cinematography — not a fame-seeking career but a quality-seeking one — and in the consistent, non-performative presence he has maintained in their marriage.'] },
      { heading: 'Twenty Years', paragraphs: ['They\'ve been married for over 20 years. That duration, in Hollywood, is itself significant. Scorpio commits fully when it commits, and takes commitment seriously as a value. Capricorn builds for the long term as a matter of character. Two signs that both, in different ways, don\'t leave easily have built something that hasn\'t required them to.' ] },
    ],
    faqs: [
      { question: 'What is Julia Roberts\'s zodiac sign?', answer: 'Julia Roberts is a Scorpio, born October 28, 1967. Scorpio is a Water sign known for intensity, emotional depth, the fierce protection of private life alongside a public presence, and a commitment that, once made, tends to hold.' },
      { question: 'What is Danny Moder\'s zodiac sign?', answer: 'Danny Moder is a Capricorn, born January 31, 1969. Capricorn is an Earth sign known for commitment to craft, a non-performative approach to career and relationship, and the kind of sustained presence that makes a long marriage possible.' },
      { question: 'Are Julia Roberts and Danny Moder compatible?', answer: 'Scorpio + Capricorn is a Water + Earth pairing that scores 70/100. The natural complementarity of depth and structure — Scorpio providing emotional intensity and loyalty, Capricorn providing the discipline and patience to build something durable — makes this one of the more naturally workable combinations.' },
    ],
    related: ['scorpio-in-love', 'capricorn-in-love', 'katy-perry-and-orlando-bloom'],
  },

  'gwyneth-paltrow-and-brad-falchuk': {
    title: 'Gwyneth Paltrow & Brad Falchuk: A Virgo and a Sagittarius Who Live in Separate Houses',
    description: 'Gwyneth Paltrow is a Virgo. Brad Falchuk is a Sagittarius. Earth + Fire scores 50/100 — married 2018, they famously keep separate residences several nights a week.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Sagittarius',
    compatLink: '/compatibility/virgo-and-sagittarius',
    intro: 'Gwyneth Paltrow (Virgo, September 27, 1972) and Brad Falchuk (Sagittarius, November 20, 1971) met on the set of Glee around 2010. They married in September 2018, after four years together. Gwyneth has spoken publicly about their arrangement of maintaining separate residences several nights a week — a structure she said improved their relationship significantly.',
    sections: [
      { heading: 'Virgo and Sagittarius: Earth Looking for Space', paragraphs: ['Virgo and Sagittarius are in square aspect to each other — 90 degrees apart, which produces friction alongside the energy to grow. Virgo is precise, orderly, and tends to find meaning in the management of a well-run life. Sagittarius is expansive, philosophically minded, and genuinely needs freedom to function at its best.', 'The arrangement Gwyneth has described — separate residences several nights a week — is one of the more creative structural solutions to a Virgo-Sagittarius challenge. Virgo needs quality and control over its environment; Sagittarius needs space and autonomy. By giving both partners genuine time in their own spaces, the relationship gets the best of both orientations without either sign having to fully subordinate its default.'] },
      { heading: 'Earth + Fire — 50/100', paragraphs: ['Earth and Fire are different enough that the 50/100 reflects real translation required. But Virgo and Sagittarius share a mutable quality — both are the mutable sign of their element, which means both are more adaptable than their fixed or cardinal counterparts. That mutability may be part of what made an unconventional arrangement possible.', 'Gwyneth has framed the separate-house arrangement as health-positive and relationship-positive, which is very Virgo: the optimization of structure in service of wellbeing. Brad\'s agreement to it is consistent with Sagittarius\'s appreciation for any arrangement that includes genuine autonomy.' ] },
    ],
    faqs: [
      { question: 'What is Gwyneth Paltrow\'s zodiac sign?', answer: 'Gwyneth Paltrow is a Virgo, born September 27, 1972. Virgo is an Earth sign known for precision, the optimization of structure for wellbeing, attentiveness to quality, and the willingness to design unconventional solutions when conventional ones don\'t serve.' },
      { question: 'What is Brad Falchuk\'s zodiac sign?', answer: 'Brad Falchuk is a Sagittarius, born November 20, 1971. Sagittarius is a Fire sign known for philosophical expansiveness, the need for genuine freedom within commitment, and the ability to accept unconventional arrangements that honor that need.' },
      { question: 'Are Gwyneth Paltrow and Brad Falchuk compatible?', answer: 'Virgo + Sagittarius is an Earth + Fire pairing that scores 50/100. The mutable quality shared by both signs makes this pairing more adaptable than the score suggests; their creative structural solution — separate residences — reflects exactly what mutability looks like in practice.' },
    ],
    related: ['virgo-in-love', 'sagittarius-in-love', 'beyonce-and-jay-z'],
  },

  'blake-shelton-and-gwen-stefani': {
    title: 'Blake Shelton & Gwen Stefani: A Gemini and a Libra Who Found Each Other Through Divorce',
    description: 'Blake Shelton is a Gemini. Gwen Stefani is a Libra. Air + Air scores 75/100 — both came out of high-profile divorces in 2015, met on The Voice, married 2021.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Libra',
    compatLink: '/compatibility/gemini-and-libra',
    intro: 'Blake Shelton (Gemini, June 12, 1976) and Gwen Stefani (Libra, October 3, 1969) both went through high-profile divorces in 2015 — Blake from Miranda Lambert, Gwen from Gavin Rossdale. They met as coaches on The Voice. They began dating that fall. They married in July 2021 on his ranch in Oklahoma.',
    sections: [
      { heading: 'Two Air Signs Who Made Each Other Laugh', paragraphs: ['Gemini and Libra are both Air signs with strong social intelligence and a natural ease in communication. Both people tend to lead with charm, to connect through humor and conversation, and to be genuinely good in the social situations that public life requires. The pairing was, on paper, natural from the start.', 'Blake\'s Gemini is in the country music charisma — the irreverence, the humor, the ability to move between the authentic country boy persona and the polished television host without losing the thread of who he is. Gwen\'s Libra is in the aesthetic: No Doubt, the fashion, the beauty business, and the particular Libra grace of making everything she touches look considered.'] },
      { heading: 'Air + Air — 75/100', paragraphs: ['Two Air signs produce genuine rapport in communication and shared social energy. The 75/100 reflects that this pairing works well at the level of connection, humor, and mutual enjoyment of the other person\'s company — which is, fundamentally, a good foundation.', 'They have spoken publicly about the role The Voice played in their connection — the proximity, the shared experience of difficult personal circumstances, and the laughter that apparently characterized their early friendship. A Gemini and a Libra finding each other through shared laughter is very much on-brand for both signs.' ] },
    ],
    faqs: [
      { question: 'What is Blake Shelton\'s zodiac sign?', answer: 'Blake Shelton is a Gemini, born June 12, 1976. Gemini is an Air sign known for wit, social adaptability, the ease of moving between different registers of public and private life, and a genuine humor that connects rather than deflects.' },
      { question: 'What is Gwen Stefani\'s zodiac sign?', answer: 'Gwen Stefani is a Libra, born October 3, 1969. Libra is an Air sign known for aesthetic intelligence, social grace, the capacity to make beauty out of whatever context she\'s in, and a genuine warmth in partnership.' },
      { question: 'Are Blake Shelton and Gwen Stefani compatible?', answer: 'Gemini + Libra is an Air + Air pairing that scores 75/100. Two signs with strong social intelligence, shared humor, and a genuine ease in each other\'s company produce a pairing that tends to stay because being together is genuinely fun — which is more durable than it sounds.' },
    ],
    related: ['gemini-in-love', 'libra-in-love', 'marilyn-monroe-and-arthur-miller'],
  },

  'tom-hanks-and-rita-wilson': {
    title: 'Tom Hanks & Rita Wilson: A Cancer and a Libra Who Make Quiet Look Right',
    description: 'Tom Hanks is a Cancer. Rita Wilson is a Libra. Water + Air scores 55/100 — married 1988, four children between them, one of Hollywood\'s most genuinely steady marriages.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Libra',
    compatLink: '/compatibility/cancer-and-libra',
    intro: 'Tom Hanks (Cancer, July 9, 1956) and Rita Wilson (Libra, October 26, 1956) met in 1981 on the set of the TV movie Bosom Buddies. They married in April 1988 and have two children together — Chet and Truman — plus Tom\'s two children from his first marriage. They tested positive for COVID-19 together in 2020 while in Australia and recovered. They\'ve been married for 36 years.',
    sections: [
      { heading: 'Cancer and Libra: Home and Harmony', paragraphs: ['Cancer is the sign of home, family, and emotional intelligence — the person for whom the interior life of the people they love is the primary concern. Tom Hanks\'s Cancer runs through the roles he is most associated with: characters who are deeply good, who care about the people around them, and who carry something both warm and slightly heartbroken about the way the world works.', 'Libra is the sign of grace, partnership, and the active investment in making whatever they\'re involved with beautiful and fair. Rita Wilson\'s Libra is in her entertainment career (acting, producing, music), her genuine charm, and the consistent, equitable quality of her public presence beside one of the most liked people in Hollywood.'] },
      { heading: 'A Long Quiet Life', paragraphs: ['They are, by Hollywood standards, aggressively normal. They live in a house. They go to dinners. They have friends. Tom is photographed getting coffee. Their marriage has not been the subject of tabloid narrative because there appears to be no narrative — two people who chose each other and have kept choosing each other across 36 years without drama.', 'That\'s Cancer + Libra working: the Cancer who wants to protect the interior life of the relationship; the Libra who manages the exterior of it with grace. The combination produces a life that looks unremarkable because it is, in all the best ways, exactly that.' ] },
    ],
    faqs: [
      { question: 'What is Tom Hanks\'s zodiac sign?', answer: 'Tom Hanks is a Cancer, born July 9, 1956. Cancer is a Water sign known for warmth, emotional intelligence, the protection of interior life, and a genuine goodness that is difficult to perform convincingly and easier to read as simply being real.' },
      { question: 'What is Rita Wilson\'s zodiac sign?', answer: 'Rita Wilson is a Libra, born October 26, 1956. Libra is an Air sign known for grace, aesthetic investment, genuine partnership as a value, and the ability to manage public life with warmth and fairness that makes difficult things look effortless.' },
      { question: 'Are Tom Hanks and Rita Wilson compatible?', answer: 'Cancer + Libra is a Water + Air pairing that scores 55/100. The 36-year marriage suggests the pairing is more workable than the score implies — Cancer\'s emotional depth and Libra\'s social grace, when both people genuinely commit to the interior of the relationship, produce something that simply continues.' },
    ],
    related: ['cancer-in-love', 'libra-in-love', 'goldie-hawn-and-kurt-russell'],
  },

  'chip-and-joanna-gaines': {
    title: 'Chip & Joanna Gaines: A Scorpio and an Aries Who Built an Empire From a Dream',
    description: 'Chip Gaines is a Scorpio. Joanna Gaines is an Aries. Water + Fire scores 55/100 — married 2003, five children, Magnolia Network, Waco\'s most famous couple.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Scorpio',
    compatLink: '/compatibility/aries-and-scorpio',
    intro: 'Chip Gaines (Scorpio, November 14, 1974) and Joanna Gaines (Aries, April 19, 1978) married in 2003 after meeting at her father\'s auto shop. They launched Fixer Upper on HGTV in 2013, became one of America\'s most popular television couples, expanded into the Magnolia brand (retail, media, real estate), and have five children. They are the best-known couple in the home renovation space.',
    sections: [
      { heading: 'Scorpio and Aries: Both Ruled by Mars', paragraphs: ['Before modern astrology, both Aries and Scorpio were ruled by Mars — the planet of drive, ambition, and decisive action. That shared Martian energy creates an unusual affinity between two signs that appear very different. Aries is direct, fast-moving, and animated by the new. Scorpio is deep, strategic, and animated by what is real beneath the surface.', 'Chip\'s Scorpio is in the persistence — the real estate deals that looked like gambles and weren\'t, the humor that is characteristic Scorpio dark wit, and the loyalty to the project they\'ve been building together across two decades. Joanna\'s Aries is in the design vision — the confidence, the willingness to begin, and the restless energy that keeps generating new directions for Magnolia.'] },
      { heading: 'Fire + Water — 55/100', paragraphs: ['Fire and Water are attracted to each other and require each other\'s management. Aries\'s directness and momentum need Scorpio\'s depth and strategic patience; Scorpio\'s intensity needs Aries\'s forward motion and willingness to act. The 55/100 reflects the real friction alongside the genuine complementarity.', 'What\'s notable about Chip and Joanna is that their professional partnership is the engine — the television show, the brand, the network, the retail — and their marriage is the context. Two people who are genuinely good at making things together tend to have a durability in the relationship that comes from shared mission. Aries and Scorpio, both driven by Mars, can direct that drive toward a common project and sustain it for a very long time.' ] },
    ],
    faqs: [
      { question: 'What is Chip Gaines\'s zodiac sign?', answer: 'Chip Gaines is a Scorpio, born November 14, 1974. Scorpio is a Water sign known for strategic depth, persistence, dark humor, loyalty to what\'s been built, and a drive that comes from a very different place than Aries but arrives at the same level of intensity.' },
      { question: 'What is Joanna Gaines\'s zodiac sign?', answer: 'Joanna Gaines is an Aries, born April 19, 1978. Aries is a Fire sign known for design confidence, the willingness to begin things before others see the possibility, directness, and the entrepreneurial instinct to keep generating new directions.' },
      { question: 'Are Chip and Joanna Gaines compatible?', answer: 'Aries + Scorpio is a Fire + Water pairing that scores 55/100. Both signs are co-ruled by Mars, which creates a particular kind of shared intensity — when that intensity is directed toward a shared project rather than at each other, the result can be genuinely productive across a very long timeline.' },
    ],
    related: ['aries-in-love', 'scorpio-in-love', 'kourtney-kardashian-and-travis-barker'],
  },

  'elton-john-and-david-furnish': {
    title: 'Elton John & David Furnish: An Aries and a Scorpio Who Made History Together',
    description: 'Elton John is an Aries. David Furnish is a Scorpio. Fire + Water scores 55/100 — civil partnered 2005, married 2014. Partners in music, family, and philanthropy for over 30 years.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Scorpio',
    compatLink: '/compatibility/aries-and-scorpio',
    intro: 'Elton John (Aries, March 25, 1947) and David Furnish (Scorpio, October 25, 1962) met at a dinner party in 1993. They entered a civil partnership in December 2005 — the first day the UK Civil Partnership Act allowed it — and legally married in December 2014. They have two sons via surrogate — Zachary and Elijah.',
    sections: [
      { heading: 'Aries and Scorpio: Both Ruled by Mars', paragraphs: ['Aries and Scorpio share a planetary ruler — Mars — which creates an unusual resonance between two signs that otherwise operate very differently. Aries is the fire of Mars: immediate, expressive, forward. Scorpio is the depth of Mars: controlled, strategic, committed. Together, the shared intensity is real.', 'Elton\'s Aries is total — the career built on spectacular immediacy, the performative generosity, the 30-year retirement announcement that lasted three years, the complete refusal to be anything other than entirely himself in every context. David\'s Scorpio is in the film producing career, the directorial work on biographical films about Elton, and the consistent, private presence he has maintained beside one of the loudest personalities in music.' ] },
      { heading: 'Thirty Years', paragraphs: ['They have been together since 1993 — 30 years. The Elton John AIDS Foundation, which David chairs, has raised over $600 million. Their public life has always been organized around the work alongside the relationship. An Aries who found a Scorpio willing to channel shared drive toward a common mission, and a Scorpio who found an Aries worth committing to fully: that\'s the long version.' ] },
    ],
    faqs: [
      { question: 'What is Elton John\'s zodiac sign?', answer: 'Elton John is an Aries, born March 25, 1947. Aries is a Fire sign known for expressive immediacy, performative generosity, the refusal to be contained, and an honesty about identity that has, over a 50-year career, never wavered.' },
      { question: 'What is David Furnish\'s zodiac sign?', answer: 'David Furnish is a Scorpio, born October 25, 1962. Scorpio is a Water sign known for strategic depth, commitment to shared mission, and the kind of loyalty that manifests in decades of consistent presence rather than declaration.' },
      { question: 'Are Elton John and David Furnish compatible?', answer: 'Aries + Scorpio is a Fire + Water pairing that scores 55/100. Both signs share the Mars planetary ruler, which creates a shared intensity that can be directed toward a common mission — as their foundation work demonstrates across three decades.' },
    ],
    related: ['aries-in-love', 'scorpio-in-love', 'kourtney-kardashian-and-travis-barker'],
  },

  'pink-and-carey-hart': {
    title: 'Pink & Carey Hart: A Virgo and a Cancer Who Keep Choosing Each Other',
    description: 'Pink is a Virgo. Carey Hart is a Cancer. Earth + Water scores 70/100 — married 2006, separated briefly, reconciled, two children. One of rock\'s most honest love stories.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Virgo',
    compatLink: '/compatibility/cancer-and-virgo',
    intro: 'Pink (Virgo, September 8, 1979) and Carey Hart (Cancer, July 3, 1975) married in January 2006 after meeting at a motocross event in 2001. They separated in 2008, reconciled in 2009, and have been together since. They have two children — Willow and Jameson. Pink has written songs about the relationship, its difficulty, and its repair.',
    sections: [
      { heading: 'Virgo and Cancer: Earth and Water', paragraphs: ['Cancer and Virgo are a natural Water + Earth pairing — Cancer providing emotional depth and the instinct toward home and family; Virgo providing attentiveness, practical care, and the belief that love is demonstrated through consistent action. Both signs tend to stay in relationships they\'ve committed to, which may be the most important fact about why Pink and Carey have lasted.', 'Pink\'s Virgo is in the music — the precision of her performances, the athletic quality of her shows, and the directness of lyrics that have never obscured where she is emotionally. Carey\'s Cancer is in the family-first orientation he\'s been public about and the consistent presence he maintains beside a partner whose fame dwarfs his own.' ] },
      { callout: '"Just Give Me a Reason," "True Love," "Family Portrait" — Pink has written a 20-year document of what it looks like to love someone through difficulty and keep deciding to. That\'s Virgo: working on it, every time.' },
    ],
    faqs: [
      { question: 'What is Pink\'s zodiac sign?', answer: 'Pink is a Virgo, born September 8, 1979. Virgo is an Earth sign known for precision, emotional directness expressed through craft, the belief that love requires ongoing work rather than original feeling, and a commitment that doesn\'t need to look easy to be real.' },
      { question: 'What is Carey Hart\'s zodiac sign?', answer: 'Carey Hart is a Cancer, born July 3, 1975. Cancer is a Water sign known for family loyalty, the desire to protect what matters, and a nurturing presence that shows up consistently over time.' },
      { question: 'Are Pink and Carey Hart compatible?', answer: 'Cancer + Virgo is a Water + Earth pairing that scores 70/100. The natural compatibility of these signs — emotional depth meeting practical care — is reflected in a relationship that survived separation and chose to rebuild.' },
    ],
    related: ['virgo-in-love', 'cancer-in-love', 'priyanka-chopra-and-nick-jonas'],
  },

  'kristen-bell-and-dax-shepard': {
    title: 'Kristen Bell & Dax Shepard: A Cancer and a Capricorn Who Are Honest About All of It',
    description: 'Kristen Bell is a Cancer. Dax Shepard is a Capricorn. Water + Earth scores 75/100 — married 2013, two daughters, and the most publicly honest marriage in Hollywood.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Capricorn',
    compatLink: '/compatibility/cancer-and-capricorn',
    intro: 'Kristen Bell (Cancer, July 18, 1980) and Dax Shepard (Capricorn, January 2, 1975) met at a birthday party in 2007, dated for five years, and married in October 2013 after same-sex marriage was legalized in California. They have two daughters. Dax has been public about his sobriety and its interruptions; Kristen has been public about mental health. Their honesty about their relationship is unusual at their level of fame.',
    sections: [
      { heading: 'Cancer and Capricorn: Opposite Signs, Real Foundation', paragraphs: ['Cancer and Capricorn sit directly opposite each other in the zodiac — opposite signs that share an axis (home and achievement, the private and the public) but express it differently. Cancer builds the interior world; Capricorn builds the exterior one. When these two meet well, they produce a partnership with both a genuine home and a genuine foundation.', 'Kristen\'s Cancer is in the warm public persona, the advocacy for mental health and equal rights, and the fierce emotional honesty she brings to interviews. Dax\'s Capricorn is in the podcast (Armchair Expert, one of the most listened-to in the world), the commitment to sobriety as a lifelong project, and the willingness to be publicly accountable when he\'s relapsed.' ] },
    ],
    faqs: [
      { question: 'What is Kristen Bell\'s zodiac sign?', answer: 'Kristen Bell is a Cancer, born July 18, 1980. Cancer is a Water sign known for warmth, emotional honesty, the fierce protection of family, and an openness about vulnerability that makes the warmth feel genuine rather than performed.' },
      { question: 'What is Dax Shepard\'s zodiac sign?', answer: 'Dax Shepard is a Capricorn, born January 2, 1975. Capricorn is an Earth sign known for the long-term project of recovery and self-accountability, commitment to building something substantial, and the willingness to be publicly honest about failure as part of the larger work.' },
      { question: 'Are Kristen Bell and Dax Shepard compatible?', answer: 'Cancer + Capricorn is a Water + Earth opposite-sign pairing that scores 75/100. Cancer and Capricorn opposites often produce the most grounded partnerships — each person offering what the other needs most.' },
    ],
    related: ['cancer-in-love', 'capricorn-in-love', 'kate-and-prince-william'],
  },

  'penelope-cruz-and-javier-bardem': {
    title: 'Penélope Cruz & Javier Bardem: A Taurus and a Pisces Who Found Each Other Late',
    description: 'Penélope Cruz is a Taurus. Javier Bardem is a Pisces. Earth + Water scores 70/100 — they\'d known each other for years before falling in love. Married 2010.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Pisces',
    compatLink: '/compatibility/taurus-and-pisces',
    intro: 'Penélope Cruz (Taurus, April 28, 1974) and Javier Bardem (Pisces, March 1, 1969) met in Spain in the 1990s. They were friends and colleagues — both Oscar-winning actors — for years before falling in love on the set of Vicky Cristina Barcelona (2008). They married in July 2010 in the Bahamas. They have two children.',
    sections: [
      { heading: 'Taurus and Pisces: Earth Anchoring Water', paragraphs: ['Taurus and Pisces are naturally compatible — Earth providing grounding and stability for the Pisces empathic openness; Pisces providing emotional depth and imagination for the Taurus sensory world. Both signs tend to love deeply, commit fully, and take care of what they\'ve built.', 'Penélope\'s Taurus is in the steadiness of a career that has spanned three decades across multiple languages and film traditions without a false note — the craft, the consistency, the refusal to be anything other than fully present. Javier\'s Pisces is in the emotional range of his acting, the ability to inhabit characters as different as Anton Chigurh and a romantic lead, and the empathic quality that makes him one of the most interesting Spanish actors of his generation.' ] },
    ],
    faqs: [
      { question: 'What is Penélope Cruz\'s zodiac sign?', answer: 'Penélope Cruz is a Taurus, born April 28, 1974. Taurus is an Earth sign known for commitment to craft, sensory intelligence, the steady accumulation of a career built on quality, and a loyalty in relationship that matches the loyalty to the work.' },
      { question: 'What is Javier Bardem\'s zodiac sign?', answer: 'Javier Bardem is a Pisces, born March 1, 1969. Pisces is a Water sign known for empathic range, the ability to disappear into a role, emotional depth, and the capacity to love with a fullness that doesn\'t require the love to be performed.' },
      { question: 'Are Penélope Cruz and Javier Bardem compatible?', answer: 'Taurus + Pisces is an Earth + Water pairing that scores 70/100. Earth anchors Water; Water enriches Earth. Both signs committed to craft and to each other produces one of the quietly durable pairings in contemporary cinema.' },
    ],
    related: ['taurus-in-love', 'pisces-in-love', 'goldie-hawn-and-kurt-russell'],
  },

  'paul-mccartney-and-linda-mccartney': {
    title: 'Paul McCartney & Linda McCartney: A Gemini and a Libra Who Were Rarely Apart',
    description: 'Paul McCartney is a Gemini. Linda McCartney was a Libra. Air + Air scores 75/100 — married 1969, never spent a night apart by choice. She died of cancer in 1998.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Libra',
    compatLink: '/compatibility/gemini-and-libra',
    intro: 'Paul McCartney (Gemini, June 18, 1942) and Linda Eastman McCartney (Libra, September 24, 1941) married on March 12, 1969, two days after John Lennon married Yoko Ono. Linda joined Paul\'s band Wings. They were, by their own account and the account of everyone who knew them, inseparable — never willingly spending a night apart across 30 years. She died of breast cancer in April 1998. He was beside her.',
    sections: [
      { heading: 'Two Air Signs With One World', paragraphs: ['Gemini and Libra are both Air signs — both oriented toward communication, ideas, and the social dimension of experience. Paul\'s Gemini is in the songwriting: the extraordinary range, the ability to move from "Yesterday" to "Helter Skelter" to "Band on the Run," and the restless creative energy that has produced music for 60 years. Linda\'s Libra was in her photography (she was a respected rock photographer before the marriage), her aesthetic sensibility, and the particular Libra quality of building a relationship that was genuinely equal.', 'She was not a musician when they met. She learned to play to be in his band. She co-wrote songs with him. She built a vegetarian food brand (Linda McCartney Foods) that outlived her. That\'s a Libra who invested herself completely in the creative partnership rather than remaining at its margin.' ] },
      { callout: 'When she died, Paul said: "I feel like my arm\'s been cut off." That\'s what 30 years of a Gemini and a Libra who built one world together costs when one of them is gone.' },
    ],
    faqs: [
      { question: 'What is Paul McCartney\'s zodiac sign?', answer: 'Paul McCartney is a Gemini, born June 18, 1942. Gemini is an Air sign known for creative range, songwriting that can span genres and decades, the social ease that made the Beatles possible, and a genuine need for partnership in the creative process.' },
      { question: 'What is Linda McCartney\'s zodiac sign?', answer: 'Linda McCartney was a Libra, born September 24, 1941. Libra is an Air sign known for aesthetic vision, the creation of genuine creative partnership, and the deep investment in the shared world that made her choice to join Wings — despite not being a musician — a Libra act of total commitment.' },
      { question: 'Were Paul and Linda McCartney compatible?', answer: 'Gemini + Libra is an Air + Air pairing that scores 75/100. Two Air signs who built one creative and personal world together and chose never to spend a night apart across 30 years: the score understates what was there.' },
    ],
    related: ['gemini-in-love', 'libra-in-love', 'john-lennon-and-yoko-ono'],
  },

  'justin-timberlake-and-jessica-biel': {
    title: 'Justin Timberlake & Jessica Biel: An Aquarius and a Pisces',
    description: 'Justin Timberlake is an Aquarius. Jessica Biel is a Pisces. Air + Water scores 50/100 — married 2012, one son, navigating the complications of public life.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Aquarius', sign2: 'Pisces',
    compatLink: '/compatibility/aquarius-and-pisces',
    intro: 'Justin Timberlake (Aquarius, January 31, 1981) and Jessica Biel (Pisces, March 3, 1982) began dating in 2007, split briefly, reunited, and married in October 2012 in southern Italy. They have a son, Silas. The marriage has navigated public scrutiny around Justin\'s behavior with significant privacy from Jessica.',
    sections: [
      { heading: 'Aquarius and Pisces: The Individual and the Empath', paragraphs: ['Aquarius is the sign that holds its independence as structural — the vision, the career, the self-definition, all maintained regardless of relationship context. Justin\'s Aquarius is in the career that has transformed across three decades (boy band to solo artist to cultural institution) and in the social intelligence that makes him effective in almost any creative room.', 'Pisces is the sign that feels everything and extends empathy in all directions — which can mean, in a relationship, that the Pisces absorbs more difficulty than they name. Jessica\'s Pisces is in the choice she has made repeatedly to stay, to maintain privacy, and to process difficulty without performing it for public consumption.' ] },
    ],
    faqs: [
      { question: 'What is Justin Timberlake\'s zodiac sign?', answer: 'Justin Timberlake is an Aquarius, born January 31, 1981. Aquarius is an Air sign known for creative independence, the construction of a multi-decade career through constant reinvention, social intelligence, and a self-definition that maintains its center regardless of external context.' },
      { question: 'What is Jessica Biel\'s zodiac sign?', answer: 'Jessica Biel is a Pisces, born March 3, 1982. Pisces is a Water sign known for emotional depth, the capacity to absorb and process difficulty without externalizing it, and a loyalty that tends to outlast the conditions that test it.' },
      { question: 'Are Justin Timberlake and Jessica Biel compatible?', answer: 'Aquarius + Pisces is an Air + Water pairing that scores 50/100. The 50/100 reflects real elemental differences; the sustained partnership across 15 years of marriage suggests both people have found a workable center within those differences.' },
    ],
    related: ['aquarius-in-love', 'pisces-in-love', 'harry-styles-and-olivia-wilde'],
  },

  'kanye-west-and-bianca-censori': {
    title: 'Kanye West & Bianca Censori: A Gemini and a Capricorn',
    description: 'Kanye West is a Gemini. Bianca Censori is a Capricorn. Air + Earth scores 45/100 — they married in a private ceremony in January 2023, months after his divorce from Kim was finalized.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Capricorn',
    compatLink: '/compatibility/gemini-and-capricorn',
    intro: 'Kanye West (Gemini, June 8, 1977) and Bianca Censori (Capricorn, January 5, 1995) reportedly married in a private ceremony in January 2023, shortly after Kanye\'s divorce from Kim Kardashian was finalized. Bianca is an architect who worked at Yeezy. Their relationship has been publicly visible through Bianca\'s notable fashion choices and limited public statement from either party.',
    sections: [
      { heading: 'Gemini and Capricorn', paragraphs: ['Gemini and Capricorn are an Air + Earth pairing — different in their primary orientations, with Gemini moving fast and Capricorn building slowly. Kanye\'s Gemini multiplicity — the artist, the producer, the fashion designer, the provocateur — and Bianca\'s Capricorn, visible in her architectural training and her apparent preference for the work over the public life, represent a pairing where the speed differential is significant.', 'The relationship has been extensively photographed but minimally articulated — neither has given public statements about its nature. What is visible externally is a Gemini in a particularly visible and documented phase of his life, and a Capricorn who appears to be present within it rather than defining it from outside.' ] },
    ],
    faqs: [
      { question: 'What is Kanye West\'s zodiac sign?', answer: 'Kanye West is a Gemini, born June 8, 1977. Gemini is an Air sign known for creative range, rapid movement between registers and personas, the multiplicity that makes him both one of music\'s most influential figures and one of its most difficult to categorize.' },
      { question: 'What is Bianca Censori\'s zodiac sign?', answer: 'Bianca Censori is a Capricorn, born January 5, 1995. Capricorn is an Earth sign known for architectural thinking, the preference for craft over celebrity, and a tendency to build and inhabit a world deliberately rather than reactively.' },
      { question: 'Are Kanye and Bianca compatible?', answer: 'Gemini + Capricorn is an Air + Earth pairing that scores 45/100. The elemental difference is real; the relationship is too new and too privately held for a fuller astrological reading to be meaningful.' },
    ],
    related: ['gemini-in-love', 'capricorn-in-love', 'kim-kardashian-and-kanye-west'],
  },

  'rafael-nadal-and-xisca-perello': {
    title: 'Rafael Nadal & Xisca Perelló: A Gemini and a Sagittarius',
    description: 'Rafael Nadal is a Gemini. Xisca Perelló is a Sagittarius. Air + Fire scores 65/100 — together since 2005, married 2019, one son. She stayed out of the spotlight entirely.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Sagittarius',
    compatLink: '/compatibility/gemini-and-sagittarius',
    intro: 'Rafael Nadal (Gemini, June 3, 1986) and Maria Francisca Perelló Pascual — known as Xisca (Sagittarius, December 19, 1988) — have been together since 2005 and married in October 2019 in Mallorca. They have a son, Rafael Jr., born 2022. Rafael retired from tennis in November 2024. Xisca built a career in insurance administration and avoided the tennis circuit almost entirely, by her own choice.',
    sections: [
      { heading: 'Opposite Signs, One Island', paragraphs: ['Gemini and Sagittarius are opposite signs — 180 degrees apart, the axis of thought and philosophy. The opposition tends to produce a magnetic attraction between people who represent different aspects of the same fundamental quest. Rafa\'s Gemini is in the adaptability and mental quickness that made him not just a clay-court specialist but a 22-time Grand Slam champion across all surfaces. Xisca\'s Sagittarius is in the independence — she built her own professional life entirely separate from tennis, traveled only for finals, and has been described as his grounding anchor.', 'Their dynamic appears to be one of the cleaner expressions of the Gemini-Sagittarius axis: Gemini brings the range and the performance; Sagittarius brings the philosophical center and the freedom that makes the performance sustainable.' ] },
    ],
    faqs: [
      { question: 'What is Rafael Nadal\'s zodiac sign?', answer: 'Rafael Nadal is a Gemini, born June 3, 1986. Gemini is an Air sign known for mental adaptability, the ability to develop game for multiple surfaces, and the particular charm that comes from being both fiercely competitive and genuinely warm.' },
      { question: 'What is Xisca Perelló\'s zodiac sign?', answer: 'Xisca Perelló is a Sagittarius, born December 19, 1988. Sagittarius is a Fire sign known for philosophical independence, the willingness to build a life on their own terms, and the grounding directness that can be the quiet center of a high-pressure partnership.' },
      { question: 'Are Rafael Nadal and Xisca Perelló compatible?', answer: 'Gemini + Sagittarius is an opposite-sign Air + Fire pairing that scores 65/100. The magnetic attraction of opposites — Gemini\'s range meeting Sagittarius\'s direction — and Xisca\'s deliberate choice to maintain her own independent life produced one of sport\'s most functional partnerships.' },
    ],
    related: ['gemini-in-love', 'sagittarius-in-love', 'marilyn-monroe-and-joe-dimaggio'],
  },

  'roger-federer-and-mirka-federer': {
    title: 'Roger Federer & Mirka Federer: A Leo and an Aries Who Won Together',
    description: 'Roger Federer is a Leo. Mirka Federer is an Aries. Fire + Fire scores 65/100 — met at the 2000 Sydney Olympics, married 2009, four children. She was there for every match.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Leo',
    compatLink: '/compatibility/aries-and-leo',
    intro: 'Roger Federer (Leo, August 8, 1981) and Miroslava "Mirka" Vavrinec Federer (Aries, April 1, 1978) met as players at the 2000 Sydney Olympics, where they were both representing Switzerland. Mirka\'s career was cut short by a foot injury. They married in April 2009 and have two sets of twins — Myla and Charlene, Leo and Lenny. Mirka attended every tournament of Roger\'s career.',
    sections: [
      { heading: 'Two Fire Signs Who Built One Career', paragraphs: ['Leo and Aries are both Fire signs — both animated by drive, ambition, and the desire to excel. They form a trine (120 degrees apart), which is one of the most naturally harmonious configurations in astrology. Two Fire signs together produce real shared energy and mutual understanding of what it costs to pursue something at the highest level.', 'Mirka was a professional tennis player — she understood the physical and psychological demands of elite sport from the inside. When her injury ended her playing career, she became Roger\'s full-time support system — present at every tournament, managing logistics, raising four children while he competed. That\'s not a passive role; it\'s an Aries choosing a different arena for the same drive.' ] },
    ],
    faqs: [
      { question: 'What is Roger Federer\'s zodiac sign?', answer: 'Roger Federer is a Leo, born August 8, 1981. Leo is a Fire sign known for grace under the spotlight, the expectation of excellence as a baseline, and a warmth that makes even a fiercely competitive person genuinely well-liked.' },
      { question: 'What is Mirka Federer\'s zodiac sign?', answer: 'Mirka Federer is an Aries, born April 1, 1978. Aries is a Fire sign known for drive, the willingness to commit to a vision fully, and the capacity to redirect ambition into new forms when the original form is no longer available.' },
      { question: 'Are Roger and Mirka Federer compatible?', answer: 'Aries + Leo is a Fire + Fire pairing that scores 65/100. Two Fire signs with a shared understanding of elite sport, built from Mirka\'s own playing career, produced a partnership where both people brought their full intensity to the shared project.' },
    ],
    related: ['leo-in-love', 'aries-in-love', 'steph-and-ayesha-curry'],
  },

  'king-charles-and-camilla': {
    title: 'King Charles III & Queen Camilla: A Scorpio and a Cancer Who Waited Decades',
    description: 'King Charles is a Scorpio. Queen Camilla is a Cancer. Water + Water scores 80/100 — they met in 1970, have been in love for most of their adult lives, and finally married in 2005.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Scorpio',
    compatLink: '/compatibility/cancer-and-scorpio',
    intro: 'King Charles III (Scorpio, November 14, 1948) and Queen Camilla (Cancer, July 17, 1947) met at a polo match in 1970. They have been linked for most of the intervening half-century, though both married others — Charles to Princess Diana in 1981, Camilla to Andrew Parker Bowles in 1973. They married each other on April 9, 2005. Their relationship was, for decades, one of the most scrutinized in the world.',
    sections: [
      { heading: 'Scorpio and Cancer: The Half-Century Love Story', paragraphs: ['Scorpio and Cancer are both Water signs — both emotionally deep, both oriented toward what is real beneath the surface, and both capable of long attachments that survive distance, circumstance, and decades of separation. The story of Charles and Camilla is, in astrological terms, a Water + Water story: the depth of the original connection never fully dissolved, even across marriages to other people.', 'Charles\'s Scorpio is in the particular quality of his devotion — private, sustained, and in no way diminished by public pressure or the expectations of others. Camilla\'s Cancer is in the warmth she has brought to her public role and in the steadiness of a woman who waited decades for a relationship that was always going to find its form eventually.' ] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs who have genuinely loved each other across five decades represent one of astrology\'s clearest examples of what depth means when it\'s real. The 80/100 reflects the natural resonance of Cancer and Scorpio; the five decades reflect what that resonance looks like in practice, over time, against significant opposition.', 'The shadow of Princess Diana\'s marriage and death is part of this story\'s public meaning, and can\'t be separated from any honest account. Charles and Camilla have lived with that weight. What they\'ve built since 2005 — and particularly since the death of Queen Elizabeth and Charles\'s accession — appears to be a genuine partnership of both private life and public duty.' ] },
    ],
    faqs: [
      { question: 'What is King Charles III\'s zodiac sign?', answer: 'King Charles III is a Scorpio, born November 14, 1948. Scorpio is a Water sign known for deep, private feeling; sustained attachment that doesn\'t require public validation; and the kind of loyalty that holds across decades and circumstances.' },
      { question: 'What is Queen Camilla\'s zodiac sign?', answer: 'Queen Camilla is a Cancer, born July 17, 1947. Cancer is a Water sign known for warmth, fierce loyalty, the capacity to wait for what is right rather than settling for what is available, and the ability to make any role feel genuinely inhabited rather than performed.' },
      { question: 'Are Charles and Camilla compatible?', answer: 'Cancer + Scorpio is a Water + Water pairing that scores 80/100. Two people who have loved each other across 50 years, multiple other marriages, and sustained public opposition: the compatibility score is the smaller part of the story.' },
    ],
    related: ['scorpio-in-love', 'cancer-in-love', 'princess-diana-and-prince-charles'],
  },

  'shawn-mendes-and-camila-cabello': {
    title: 'Shawn Mendes & Camila Cabello: A Leo and a Pisces in a Very Public Love Story',
    description: 'Shawn Mendes is a Leo. Camila Cabello is a Pisces. Fire + Water scores 60/100 — friends for years before dating in 2019, broke up 2021, briefly reunited 2023.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Pisces',
    compatLink: '/compatibility/leo-and-pisces',
    intro: 'Shawn Mendes (Leo, August 8, 1998) and Camila Cabello (Pisces, March 3, 1997) collaborated professionally before becoming a couple in 2019. They broke up in November 2021, citing the difficulty of sustaining a relationship at their level of career demand. They briefly reconciled in 2023. Both have been candid about the relationship and about mental health in general.',
    sections: [
      { heading: 'Leo and Pisces: The Performer and the Empath', paragraphs: ['Leo is the sign of the performer — the person who needs the arena, the warmth of an audience, the experience of being genuinely seen at full brightness. Shawn\'s Leo is in the guitar, the stadium shows, and the particular quality of a young artist who connects through genuine emotion rather than calculated cool.', 'Pisces absorbs — the world, other people\'s feelings, the weight of experience — and processes it through art or through internal narrative. Camila\'s Pisces is in the music (her songwriting has always been directly autobiographical, including the song "Crying in the Club" and her album Familia) and in the emotional openness that her public persona has consistently reflected.' ] },
    ],
    faqs: [
      { question: 'What is Shawn Mendes\'s zodiac sign?', answer: 'Shawn Mendes is a Leo, born August 8, 1998. Leo is a Fire sign known for the need for genuine expression, the arena as a primary emotional context, warmth, and an authenticity in performance that comes from care rather than calculation.' },
      { question: 'What is Camila Cabello\'s zodiac sign?', answer: 'Camila Cabello is a Pisces, born March 3, 1997. Pisces is a Water sign known for autobiographical songwriting, emotional depth, empathic absorption of experience, and the tendency to process everything through the art eventually.' },
      { question: 'Were Shawn Mendes and Camila Cabello compatible?', answer: 'Leo + Pisces is a Fire + Water pairing that scores 60/100. The genuine emotional connection between these two signs is real; the challenge of two high-demand careers at the same stage of explosive growth made the practical sustaining of the relationship difficult regardless of the compatibility.' },
    ],
    related: ['leo-in-love', 'pisces-in-love', 'joe-jonas-and-sophie-turner'],
  },

  'sabrina-carpenter-and-barry-keoghan': {
    title: 'Sabrina Carpenter & Barry Keoghan: An Aries and a Libra in Brief',
    description: 'Sabrina Carpenter is an Aries. Barry Keoghan is a Libra. Fire + Air scores 65/100 — they dated through 2024, a high-visibility pairing in a year when both were having breakthrough cultural moments.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Libra',
    compatLink: '/compatibility/aries-and-libra',
    intro: 'Sabrina Carpenter (Aries, April 11, 2000) and Barry Keoghan (Libra, October 18, 1992) were publicly linked in early 2024. They appeared together at various events, and Barry appeared in Sabrina\'s "Please Please Please" music video. They were reported to have separated by late 2024. It was a brief pairing between two people having significant cultural moments simultaneously.',
    sections: [
      { heading: 'Aries and Libra: Opposite Signs', paragraphs: ['Aries and Libra are opposite signs — 180 degrees apart, the axis of self and other. Aries leads from the self outward; Libra mediates between self and other in every direction. The opposition tends to produce attraction (each representing what the other lacks) alongside the particular friction of two people who approach identity and relationship from different angles.', 'Sabrina\'s Aries is visible in her breakthrough 2024 — Short n\' Sweet, the "Espresso" summer, the Saturday Night Live monologue — all characterized by Aries directness, humor, and an absolute comfort with being the center of attention. Barry\'s Libra is in the thoughtful, aesthetically considered acting work — Saltburn, The Killing of a Sacred Deer, Eternals — and in the social grace he brings to public contexts.' ] },
    ],
    faqs: [
      { question: 'What is Sabrina Carpenter\'s zodiac sign?', answer: 'Sabrina Carpenter is an Aries, born April 11, 2000. Aries is a Fire sign known for directness, humor, comfort with visibility, and the particular energy of a person who knows who they are and doesn\'t modify it for context.' },
      { question: 'What is Barry Keoghan\'s zodiac sign?', answer: 'Barry Keoghan is a Libra, born October 18, 1992. Libra is an Air sign known for aesthetic intelligence, the capacity to inhabit very different roles with equal conviction, and a social grace that extends across contexts.' },
      { question: 'Were Sabrina Carpenter and Barry Keoghan compatible?', answer: 'Aries + Libra is a Fire + Air opposite-sign pairing that scores 65/100. Opposite signs often have more in common than the difference suggests; a brief relationship between two people in the middle of significant career accelerations is its own kind of incompatibility regardless of sign.' },
    ],
    related: ['aries-in-love', 'libra-in-love', 'elton-john-and-david-furnish'],
  },

  'bill-clinton-and-hillary-clinton': {
    title: 'Bill Clinton & Hillary Clinton: A Leo and a Scorpio in the Longest Political Marriage',
    description: 'Bill Clinton is a Leo. Hillary Clinton is a Scorpio. Fire + Water scores 60/100 — married 1975, survived impeachment, two presidential campaigns, and 50 years.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Scorpio',
    compatLink: '/compatibility/leo-and-scorpio',
    intro: 'Bill Clinton (Leo, August 19, 1946) and Hillary Rodham Clinton (Scorpio, October 26, 1947) met at Yale Law School in 1971 and married in October 1975. They have one daughter, Chelsea. Their marriage has been one of the most publicly scrutinized in American political history — the affairs, the impeachment, two presidential campaigns, and 50 years of continued partnership.',
    sections: [
      { heading: 'Leo and Scorpio: The Performer and the Strategist', paragraphs: ['Leo and Scorpio are both fixed signs — stubborn, committed to their visions, and difficult to move once settled. But they express their fixity differently: Leo through performance and the need to be seen; Scorpio through depth and the need for control. Together, they produce a pairing with extraordinary presence and extraordinary complexity.', 'Bill\'s Leo is total — the performative genius that made him one of the most naturally gifted politicians in American history, the warmth and the camera, and the shadow side that Leo\'s relationship with visibility can produce. Hillary\'s Scorpio is in the strategy, the preparation, the endurance through conditions that would have broken most people, and the particular Scorpio quality of being underestimated by people who read depth as coldness.' ] },
      { heading: 'The Staying', paragraphs: ['Hillary has been asked, many times, why she stayed. Her answers have always been complex. The Scorpio capacity for sustained commitment — even through betrayal, even through humiliation — when the larger mission remains clear is one of the most characteristic features of that sign. She ran for Senate from New York in 2000. She ran for president in 2008 and 2016. She served as Secretary of State. Whatever the private calculus of the marriage, the public calculus appears to have included a shared commitment to the political work that the relationship made possible.' ] },
    ],
    faqs: [
      { question: 'What is Bill Clinton\'s zodiac sign?', answer: 'Bill Clinton is a Leo, born August 19, 1946. Leo is a Fire sign known for extraordinary performative charisma, natural political warmth, and a relationship with being seen that produces both the heights of political connection and its characteristic vulnerabilities.' },
      { question: 'What is Hillary Clinton\'s zodiac sign?', answer: 'Hillary Clinton is a Scorpio, born October 26, 1947. Scorpio is a Water sign known for strategic depth, extraordinary preparation, endurance through conditions that would break most people, and a commitment to mission that can sustain across decades of public difficulty.' },
      { question: 'Are Bill and Hillary Clinton compatible?', answer: 'Leo + Scorpio is a Fire + Water pairing that scores 60/100. Two fixed signs with very different orientations — Leo\'s need for visibility and Scorpio\'s need for depth — can produce enormous friction and enormous productivity. Their 50-year partnership is both.' },
    ],
    related: ['leo-in-love', 'scorpio-in-love', 'barack-and-michelle-obama'],
  },

  'garth-brooks-and-trisha-yearwood': {
    title: 'Garth Brooks & Trisha Yearwood: An Aquarius and a Virgo Who Waited for the Right Time',
    description: 'Garth Brooks is an Aquarius. Trisha Yearwood is a Virgo. Air + Earth scores 50/100 — friends and colleagues for a decade before falling in love. Married 2005.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Aquarius',
    compatLink: '/compatibility/virgo-and-aquarius',
    intro: 'Garth Brooks (Aquarius, February 7, 1962) and Trisha Yearwood (Virgo, September 19, 1964) knew each other for years in Nashville before becoming a couple. Both had been in other marriages. They married on December 10, 2005. Garth essentially retired from touring for a decade to be present for Trisha\'s career and his daughters. They are among country music\'s most admired couples.',
    sections: [
      { heading: 'Aquarius and Virgo: The Visionary and the Craftsman', paragraphs: ['Aquarius and Virgo are an inconjunct pair — 150 degrees apart, different in element, modality, and polarity. Aquarius leads with vision and the collective; Virgo leads with precision and the particular. Garth\'s Aquarius is in the decades-long vision of what country music could be (he brought arena rock production values to a genre that hadn\'t seen them), his retirement and return, and his genuine commitment to fans as a collective. Trisha\'s Virgo is in the craft — a voice considered technically flawless by industry standards and an approach to songwriting and performance built on consistency rather than spectacle.', 'Their friendship preceded their romance by a decade — they had recorded duets together and worked in Nashville\'s tight community before anything romantic developed. That foundation of mutual professional respect before personal attachment is often what makes the more challenging astrological combinations durable.' ] },
    ],
    faqs: [
      { question: 'What is Garth Brooks\'s zodiac sign?', answer: 'Garth Brooks is an Aquarius, born February 7, 1962. Aquarius is an Air sign known for visionary scale, the willingness to make unconventional choices (including a decade-long retirement at the height of success), and genuine investment in his audience as a collective rather than an abstract market.' },
      { question: 'What is Trisha Yearwood\'s zodiac sign?', answer: 'Trisha Yearwood is a Virgo, born September 19, 1964. Virgo is an Earth sign known for technical precision, the craft-first approach to a career, and a consistency that doesn\'t require reinvention because the foundation is always solid.' },
      { question: 'Are Garth Brooks and Trisha Yearwood compatible?', answer: 'Virgo + Aquarius is an Air + Earth pairing that scores 50/100. A decade of professional friendship before romance, mutual respect for each other\'s craft, and Garth\'s willingness to step back from his own career to support hers: these are the actual data points behind a pairing that works.' },
    ],
    related: ['aquarius-in-love', 'virgo-in-love', 'dolly-parton-and-carl-dean'],
  },

  'kurt-cobain-and-courtney-love': {
    title: 'Kurt Cobain & Courtney Love: A Pisces and a Cancer Who Burned at the Same Frequency',
    description: 'Kurt Cobain was a Pisces. Courtney Love is a Cancer. Water + Water scores 80/100 — married 1992, daughter Frances Bean, Kurt died by suicide in April 1994.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Kurt Cobain (Pisces, February 20, 1967) and Courtney Love (Cancer, July 9, 1964) married on February 24, 1992, in Hawaii. They had a daughter, Frances Bean, in August 1992. Kurt died by suicide on April 5, 1994. He was 27. Their relationship — its love, its addiction, its creativity, and its tragedy — has been documented, debated, and mythologized in the years since.',
    sections: [
      { heading: 'Pisces and Cancer: Water at Full Intensity', paragraphs: ['Pisces is the sign that feels everything and has no natural off switch for the world\'s pain. Kurt\'s Pisces ran through Nirvana — the empathy in lyrics that described adolescent alienation with a precision that felt, to millions of listeners, like being finally understood. It also ran through the addiction and the depression: Pisces without adequate boundaries can absorb more of the world than any person is built to hold.', 'Cancer is the sign of fierce protectiveness — for family, for what it loves, for the people it has decided to keep close. Courtney\'s Cancer is in the music (Hole\'s Live Through This, released the week Kurt died, is one of the more remarkable coincidences in rock history), the ferocity of her public presence, and the lifelong protectiveness of Frances Bean.' ] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs together have an emotional depth that most people only approximate. The 80/100 reflects the real resonance between Cancer and Pisces; the tragedy of their story is not a product of incompatibility but of a Pisces in a level of pain that love alone — even Cancer\'s fierce version of it — couldn\'t hold.', 'Courtney has spent the decades since Kurt\'s death in a public life of extraordinary complexity — the music, the legal battles over his estate, the care of their daughter. That\'s Cancer: the fierce protectiveness that continues even when the person it was directed toward is gone.' ] },
    ],
    faqs: [
      { question: 'What is Kurt Cobain\'s zodiac sign?', answer: 'Kurt Cobain was a Pisces, born February 20, 1967. Pisces is a Water sign known for extraordinary empathic range, creative sensitivity, the capacity to articulate collective feeling through art, and the particular vulnerability of a person who feels everything without adequate protection.' },
      { question: 'What is Courtney Love\'s zodiac sign?', answer: 'Courtney Love is a Cancer, born July 9, 1964. Cancer is a Water sign known for fierceness, protectiveness, a creative output that comes from deep personal experience, and the capacity to survive and continue even after the worst.' },
      { question: 'Were Kurt Cobain and Courtney Love compatible?', answer: 'Cancer + Pisces is a Water + Water pairing that scores 80/100. The emotional resonance was real. The tragedy of their story is not a compatibility question but a human one — about pain, addiction, and the limits of what love can do in the face of illness.' },
    ],
    related: ['cancer-in-love', 'pisces-in-love', 'johnny-cash-and-june-carter-cash'],
  },

  'faith-hill-and-tim-mcgraw': {
    title: 'Faith Hill & Tim McGraw: A Virgo and a Taurus Who Are Country Music\'s Answer to Forever',
    description: 'Faith Hill is a Virgo. Tim McGraw is a Taurus. Earth + Earth scores 75/100 — married 1996, three daughters, 30 years together and touring together.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Virgo',
    compatLink: '/compatibility/taurus-and-virgo',
    intro: 'Faith Hill (Virgo, September 21, 1967) and Tim McGraw (Taurus, May 1, 1967) married on October 6, 1996, while both were touring together. They have three daughters — Gracie, Maggie, and Audrey. They have toured together, recorded together, and built one of the most successful and longest-running partnerships in country music history.',
    sections: [
      { heading: 'Taurus and Virgo: Earth Recognizing Earth', paragraphs: ['Taurus and Virgo form a trine — 120 degrees apart, one of astrology\'s most naturally harmonious configurations. Both are Earth signs, oriented toward craft, loyalty, and building things that endure. Tim\'s Taurus is in the voice, the sustained career of 30 years of consistent quality, and the physical presence that made him one of country\'s most recognizable figures. Faith\'s Virgo is in the precision of her instrument — considered one of the finest voices in contemporary country — and the Virgo commitment to doing the work properly.', 'Their touring together — Soul2Soul tours, numerous joint appearances — is consistent with two Earth signs who found that working together was both professionally productive and personally sustaining. When Earth signs share a professional project alongside a romantic one, the combination tends to be durable: the craft gives the relationship a shared mission beyond the feeling.' ] },
    ],
    faqs: [
      { question: 'What is Faith Hill\'s zodiac sign?', answer: 'Faith Hill is a Virgo, born September 21, 1967. Virgo is an Earth sign known for vocal precision, the Virgo commitment to doing the work properly, and a sustained career built on consistency rather than reinvention.' },
      { question: 'What is Tim McGraw\'s zodiac sign?', answer: 'Tim McGraw is a Taurus, born May 1, 1967. Taurus is an Earth sign known for vocal richness, sustained excellence across a long career, physical presence, and the fixed commitment that makes 30 years of partnership unremarkable — in the best sense.' },
      { question: 'Are Faith Hill and Tim McGraw compatible?', answer: 'Taurus + Virgo is an Earth + Earth trine pairing that scores 75/100. Two Earth signs who share a craft and a life, and have turned touring together into a 30-year ongoing project: the compatibility is written in the duration.' },
    ],
    related: ['taurus-in-love', 'virgo-in-love', 'dolly-parton-and-carl-dean'],
  },

  'lucille-ball-and-desi-arnaz': {
    title: 'Lucille Ball & Desi Arnaz: A Leo and a Pisces Who Invented Television',
    description: 'Lucille Ball was a Leo. Desi Arnaz was a Pisces. Fire + Water scores 60/100 — married 1940, divorced 1960, they created I Love Lucy and changed entertainment permanently.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Pisces',
    compatLink: '/compatibility/leo-and-pisces',
    intro: 'Lucille Ball (Leo, August 6, 1911) and Desi Arnaz (Pisces, March 2, 1917) married in November 1940, after a whirlwind six-month courtship. They divorced in 1960, 180 episodes and two children into one of the most successful creative partnerships in the history of American entertainment. I Love Lucy — which they produced together through Desilu Productions — was the first show shot before a live studio audience, the first to use three cameras, and the most watched program in the country for five of its six seasons.',
    sections: [
      { heading: 'Leo and Pisces: The Comedian and the Musician', paragraphs: ['Leo brings the performance — the physical comedy, the timing, the willingness to be humiliated for the audience\'s pleasure. Lucy\'s Leo was a completely realized physical comedian who could fill any room and any frame with exactly what was needed. Desi\'s Pisces brought the music (the Cuban bandleader persona), the business intelligence that produced Desilu (Pisces\'s capacity for creative empathy translating, in this case, into understanding what the public wanted), and the emotional depth beneath the entertainment product.', 'They made each other\'s careers possible in a literal sense. Desi fought the networks to cast Lucy as his wife in the show — CBS thought American audiences wouldn\'t accept a mixed-race couple. He won. Lucy did the work. Together they became the most watched people on television.' ] },
      { heading: 'The Divorce and After', paragraphs: ['Their divorce in 1960 followed years of infidelity by Desi and the difficulty of a Fire + Water marriage under the conditions of extraordinary success and constant public visibility. They remained professionally intertwined through Desilu, which Lucy eventually bought out entirely and ran as sole owner. She sold it in 1967 to Gulf + Western, funding what became Paramount Television. That transaction changed the industry.', 'They remained in contact until Desi\'s death in 1986. Lucy died in 1989. He told people near the end that she was the love of his life.' ] },
    ],
    faqs: [
      { question: 'What is Lucille Ball\'s zodiac sign?', answer: 'Lucille Ball was a Leo, born August 6, 1911. Leo is a Fire sign known for physical comedy, the instinct for performance, the willingness to be seen in every register including the ridiculous, and the warmth that makes an audience love someone for decades.' },
      { question: 'What is Desi Arnaz\'s zodiac sign?', answer: 'Desi Arnaz was a Pisces, born March 2, 1917. Pisces is a Water sign known for musical empathy, creative intuition about what audiences want, the business intelligence that can come from understanding feeling, and a charm that is harder to analyze than to simply experience.' },
      { question: 'Were Lucille Ball and Desi Arnaz compatible?', answer: 'Leo + Pisces is a Fire + Water pairing that scores 60/100. They created the infrastructure of modern television together and loved each other until the end of their lives; the divorce was the product of difficulty, not incompatibility.' },
    ],
    related: ['leo-in-love', 'pisces-in-love', 'jfk-and-jackie-kennedy'],
  },

  'chris-martin-and-dakota-johnson': {
    title: 'Chris Martin & Dakota Johnson: A Pisces and a Libra Who Found a Quiet Together',
    description: 'Chris Martin is a Pisces. Dakota Johnson is a Libra. Water + Air scores 50/100 — together since 2017, private about it, maintaining parallel careers with apparent ease.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Pisces',
    compatLink: '/compatibility/libra-and-pisces',
    intro: 'Chris Martin (Pisces, March 2, 1977) and Dakota Johnson (Libra, October 4, 1989) began dating in 2017, after Chris\'s "conscious uncoupling" from Gwyneth Paltrow. They have been together for seven years, have maintained almost complete privacy about the relationship, and have largely avoided public documentation of it despite both being highly visible.',
    sections: [
      { heading: 'Pisces and Libra: Art and Aesthetics', paragraphs: ['Pisces and Libra are both signs with deep aesthetic orientations — Pisces through emotional music and empathic art; Libra through visual beauty and the investment in making things look and feel right. Chris\'s Pisces is in the music — Coldplay\'s emotional range, the humanitarian concerts, the willingness to be publicly emotional in an industry that often punishes that. Dakota\'s Libra is in the film choices (Suspiria, Cha Cha Real Smooth, the Fifty Shades franchise) and the aesthetic intelligence she brings to projects.', 'What\'s notable about their dynamic is the shared commitment to privacy. Two very public people who have, for seven years, kept their relationship almost entirely off-grid: that requires mutual agreement and mutual respect for what the other person needs. Pisces values the protected interior; Libra values what is genuinely beautiful, which sometimes means keeping something unexamined by the public so it remains real.' ] },
    ],
    faqs: [
      { question: 'What is Chris Martin\'s zodiac sign?', answer: 'Chris Martin is a Pisces, born March 2, 1977. Pisces is a Water sign known for emotionally transparent music, humanitarian investment, the capacity to fill stadiums while still feeling things with the same rawness as the first time, and a need for protected private space.' },
      { question: 'What is Dakota Johnson\'s zodiac sign?', answer: 'Dakota Johnson is a Libra, born October 4, 1989. Libra is an Air sign known for aesthetic intelligence, film choices that reflect genuine taste rather than commercial calculation, and a social grace that can inhabit both high-visibility and high-privacy contexts with equal ease.' },
      { question: 'Are Chris Martin and Dakota Johnson compatible?', answer: 'Libra + Pisces is a Water + Air pairing that scores 50/100. Seven years of mutual privacy — from two very public people — suggests both have found something in the relationship worth protecting from the documentation that their careers otherwise require.' },
    ],
    related: ['pisces-in-love', 'libra-in-love', 'emily-blunt-and-john-krasinski'],
  },

  'kim-kardashian-and-pete-davidson': {
    title: 'Kim Kardashian & Pete Davidson: A Libra and a Scorpio Who Made Headlines',
    description: 'Kim Kardashian is a Libra. Pete Davidson is a Scorpio. Air + Water scores 55/100 — they dated from late 2021 to August 2022. Nine months that fascinated the internet.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Libra', sign2: 'Scorpio',
    compatLink: '/compatibility/libra-and-scorpio',
    intro: 'Kim Kardashian (Libra, October 21, 1980) and Pete Davidson (Scorpio, November 16, 1993) began dating in November 2021, having met when Kim hosted Saturday Night Live. They dated for approximately nine months, broke up in August 2022, and have rarely spoken publicly about the relationship since.',
    sections: [
      { heading: 'Libra and Scorpio: Adjacent Signs, Different Depths', paragraphs: ['Libra and Scorpio are adjacent in the zodiac — one sign apart — which creates a pairing with complementary qualities and real differences. Libra operates in the social world: image, aesthetics, balance, the management of public and private life through careful navigation. Scorpio operates in the emotional depths: the interior, the intense, the uncompromised feeling.', 'Kim\'s Libra brings the image-making intelligence that has built a global business; Pete\'s Scorpio brings the dark humor and emotional transparency that have made him one of comedy\'s most discussed figures. The attraction between these two orientations — the polished and the raw — is real. The sustained compatibility over time is where the 55/100 applies.' ] },
    ],
    faqs: [
      { question: 'Are Kim Kardashian and Pete Davidson compatible?', answer: 'Libra + Scorpio is an Air + Water pairing that scores 55/100. Adjacent signs often have a complementary attraction — Libra\'s polish and Scorpio\'s rawness create a real dynamic. Nine months of a high-visibility relationship reflects both the attraction and its limits.' },
      { question: 'How long were Kim and Pete together?', answer: 'Approximately nine months, from November 2021 to August 2022.' },
      { question: 'What is Pete Davidson\'s zodiac sign?', answer: 'Pete Davidson is a Scorpio, born November 16, 1993. Scorpio is a Water sign known for emotional intensity, dark humor as a processing mechanism, a fierce loyalty to people they love, and attachments that can run very deep very quickly.' },
    ],
    related: ['libra-in-love', 'scorpio-in-love', 'kim-kardashian-and-kanye-west'],
  },

  'spencer-tracy-and-katharine-hepburn': {
    title: 'Spencer Tracy & Katharine Hepburn: An Aries and a Taurus Who Shared 26 Years',
    description: 'Spencer Tracy was an Aries. Katharine Hepburn was a Taurus. Fire + Earth scores 55/100 — they never married (he was Catholic), but their relationship spanned 26 years, until his death in 1967.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Taurus',
    compatLink: '/compatibility/aries-and-taurus',
    intro: 'Spencer Tracy (Aries, April 5, 1900) and Katharine Hepburn (Taurus, May 12, 1907) met on the set of Woman of the Year in 1941. He was married; he never divorced. They were together for 26 years, made nine films together, and Katharine stayed at his side until he died of a heart attack in June 1967. She did not attend his funeral out of respect for his family.',
    sections: [
      { heading: 'Aries and Taurus: The Fire and the Ground', paragraphs: ['Aries and Taurus are neighboring signs with complementary qualities. Aries brings the fire — the initiative, the directness, the willingness to go first. Taurus brings the ground — the loyalty, the patience, the commitment to what is real over what is convenient. Spencer\'s Aries is in the acting style — direct, physical, unadorned — and in the particular quality of his public persona as the most naturally masculine actor of his generation. Katharine\'s Taurus is in the sustained career across six decades, the refusal to be diminished by Hollywood\'s treatment of aging women, and the extraordinary patience of loving someone who could not offer her marriage.', '26 years is a long time to stay in something that offers no formal recognition. That\'s Taurus: the sign that values the real over the official, and that stays in what it loves without requiring the institution.' ] },
      { callout: 'She cared for him through his last years as his health declined. When he died, she did not attend the funeral because his wife was there. That particular form of discretion — protecting the feelings of someone you have essentially replaced in a person\'s life, because you loved them and this is what they would have wanted — is one of the more quietly remarkable things in the history of Hollywood.' },
    ],
    faqs: [
      { question: 'What is Spencer Tracy\'s zodiac sign?', answer: 'Spencer Tracy was an Aries, born April 5, 1900. Aries is a Fire sign known for directness, physical presence, an acting style that looks like not-acting, and an honesty that doesn\'t know how to be otherwise.' },
      { question: 'What is Katharine Hepburn\'s zodiac sign?', answer: 'Katharine Hepburn was a Taurus, born May 12, 1907. Taurus is an Earth sign known for extraordinary sustained careers, the refusal to be defined by others\' expectations, loyalty to people and projects across decades, and the patience to stay in what is real even when it offers nothing official in return.' },
      { question: 'Were Spencer Tracy and Katharine Hepburn compatible?', answer: 'Aries + Taurus is a Fire + Earth pairing that scores 55/100. They made nine films together and were together 26 years. The score reflects the adjacent-sign friction; the duration reflects what they actually were to each other.' },
    ],
    related: ['aries-in-love', 'taurus-in-love', 'paul-newman-and-joanne-woodward'],
  },

  'chris-pratt-and-katherine-schwarzenegger': {
    title: 'Chris Pratt & Katherine Schwarzenegger: A Cancer and a Sagittarius',
    description: 'Chris Pratt is a Cancer. Katherine Schwarzenegger is a Sagittarius. Water + Fire scores 55/100 — married 2019, two daughters.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Sagittarius',
    compatLink: '/compatibility/cancer-and-sagittarius',
    intro: 'Chris Pratt (Cancer, June 21, 1979) and Katherine Schwarzenegger Pratt (Sagittarius, December 13, 1989) married in June 2019, after a brief public courtship. They have two daughters — Lyla and Eloise. Chris has spoken extensively about his faith, and Katherine has written books on personal growth and young adult wellness.',
    sections: [
      { heading: 'Cancer and Sagittarius', paragraphs: ['Cancer wants home — the protective interior, the family structure, the reliable center. Sagittarius wants meaning and expansion — the philosophical quest, the freedom to grow. Chris\'s Cancer runs through his Marvel career (an actor who brings genuine warmth to roles that require likability) and his public faith. Katherine\'s Sagittarius is in the authorship and the advocacy work — expansive, directed toward others, philosophically grounded.', 'A Cancer who has built a stable family structure and a Sagittarius who has found purpose-driven work: when both people\'s needs are externally met, the internal dynamic tends to be more functional than the 55/100 would predict.'] },
    ],
    faqs: [
      { question: 'What is Chris Pratt\'s zodiac sign?', answer: 'Chris Pratt is a Cancer, born June 21, 1979. Cancer is a Water sign known for warmth, family-first orientation, and a screen presence built on genuine likability.' },
      { question: 'What is Katherine Schwarzenegger\'s zodiac sign?', answer: 'Katherine Schwarzenegger is a Sagittarius, born December 13, 1989. Sagittarius is a Fire sign known for philosophical orientation, the desire to be of service through ideas, and the natural warmth of a sign that wants to share what it has learned.' },
      { question: 'Are Chris and Katherine compatible?', answer: 'Cancer + Sagittarius is a Water + Fire pairing that scores 55/100. Cancer\'s home-building instinct and Sagittarius\'s meaning-seeking can complement each other when both people have found what they individually need.' },
    ],
    related: ['cancer-in-love', 'sagittarius-in-love', 'justin-and-hailey-bieber'],
  },

  'idris-elba-and-sabrina-dhowre': {
    title: 'Idris Elba & Sabrina Dhowre Elba: A Virgo and a Capricorn',
    description: 'Idris Elba is a Virgo. Sabrina Dhowre is a Capricorn. Earth + Earth scores 75/100 — married 2019, a low-key, genuinely private partnership beside one of the most recognized actors in the world.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Capricorn',
    compatLink: '/compatibility/virgo-and-capricorn',
    intro: 'Idris Elba (Virgo, September 6, 1972) and Sabrina Dhowre Elba (Capricorn, February 16, 1989) married in April 2019 in Morocco. They met in 2017 when he was filming Molly\'s Game and she was an actress in Vancouver. She proposed to him publicly at a screening of his documentary. They have maintained a private, stable life beside the considerable visibility of Idris\'s career.',
    sections: [
      { heading: 'Earth + Earth — 75/100', paragraphs: ['Virgo and Capricorn are a natural trine — both Earth signs, both oriented toward craft, commitment, and the building of something real. Idris\'s Virgo is in the acting precision that has made him one of the most respected British actors of his generation (The Wire, Luther, Beasts of No Nation) and the refusal to coast on his looks or his fame. Sabrina\'s Capricorn is in the stability she has brought to a partnership that began while both were navigating demanding careers.', 'She proposed to him. Idris, a Virgo who tends to be private and careful, was apparently moved. That reversal of the conventional dynamic is itself slightly Virgo: the person who accepts an act of love clearly offered, rather than engineering it.' ] },
    ],
    faqs: [
      { question: 'What is Idris Elba\'s zodiac sign?', answer: 'Idris Elba is a Virgo, born September 6, 1972. Virgo is an Earth sign known for acting craft, precision, the commitment to quality that runs through every choice, and a privacy about personal life that matches the intensity of the public career.' },
      { question: 'What is Sabrina Dhowre\'s zodiac sign?', answer: 'Sabrina Dhowre Elba is a Capricorn, born February 16, 1989. Capricorn is an Earth sign known for stability, deliberateness, the willingness to commit clearly and publicly when the commitment is real.' },
      { question: 'Are Idris and Sabrina compatible?', answer: 'Virgo + Capricorn is an Earth + Earth trine pairing that scores 75/100. Two Earth signs who both approach life and work with the same seriousness and care: the compatibility is in the shared values.' },
    ],
    related: ['virgo-in-love', 'capricorn-in-love', 'lebron-and-savannah-james'],
  },

  'kevin-hart-and-eniko-hart': {
    title: 'Kevin Hart & Eniko Parrish Hart: A Cancer and a Capricorn',
    description: 'Kevin Hart is a Cancer. Eniko Hart is a Capricorn. Water + Earth scores 75/100 — married 2016, two children together, navigated infidelity publicly and chose to rebuild.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Capricorn',
    compatLink: '/compatibility/cancer-and-capricorn',
    intro: 'Kevin Hart (Cancer, July 6, 1979) and Eniko Parrish Hart (Capricorn, January 18, 1984) married in August 2016 and have two children together — Kenzo and Kaori. The marriage was tested publicly in 2017 when Kevin admitted to infidelity while Eniko was pregnant. She chose to stay. Kevin released a documentary about the experience. They remain married.',
    sections: [
      { heading: 'Cancer and Capricorn: Opposite Signs Who Stay', paragraphs: ['Cancer and Capricorn are opposite signs — the axis of home (Cancer) and achievement (Capricorn). Both signs tend toward commitment once they\'ve made it, and both can stay in difficult situations when they\'ve decided the foundation is worth rebuilding.', 'Kevin\'s Cancer is in the comedy that is ultimately about family, belonging, and the things we\'re most afraid to lose. Eniko\'s Capricorn is in the deliberate choice she made in 2017 — processing the betrayal, deciding what mattered more, and choosing to rebuild rather than to leave. That\'s Capricorn: the sign that evaluates the foundation, determines it can hold, and commits to the repair.' ] },
    ],
    faqs: [
      { question: 'What is Kevin Hart\'s zodiac sign?', answer: 'Kevin Hart is a Cancer, born July 6, 1979. Cancer is a Water sign known for family-centered comedy, warmth, fierce loyalty to the people he loves, and a genuine vulnerability beneath the public persona that his best work reflects.' },
      { question: 'What is Eniko Hart\'s zodiac sign?', answer: 'Eniko Parrish Hart is a Capricorn, born January 18, 1984. Capricorn is an Earth sign known for deliberate commitment, the willingness to evaluate a situation honestly and decide what to build from it, and a long-term orientation that doesn\'t confuse the crisis with the answer.' },
      { question: 'Are Kevin and Eniko Hart compatible?', answer: 'Cancer + Capricorn is a Water + Earth opposite-sign pairing that scores 75/100. Opposites on the home-achievement axis, when both people have decided the relationship is the thing they\'re building toward, tend to produce some of the most durable partnerships.' },
    ],
    related: ['cancer-in-love', 'capricorn-in-love', 'kristen-bell-and-dax-shepard'],
  },

  'tina-fey-and-jeff-richmond': {
    title: 'Tina Fey & Jeff Richmond: A Taurus and a Cancer Who Work Together',
    description: 'Tina Fey is a Taurus. Jeff Richmond is a Cancer. Earth + Water scores 70/100 — married 2001, two daughters, he composes the music for almost everything she makes.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Cancer',
    compatLink: '/compatibility/taurus-and-cancer',
    intro: 'Tina Fey (Taurus, May 18, 1970) and Jeff Richmond (Cancer, July 17, 1964) met at Chicago\'s Second City comedy theater in 1992. They married in June 2001. Jeff composed the music for 30 Rock, Unbreakable Kimmy Schmidt, Mean Girls the Musical, and most of the creative projects Tina has led. They have two daughters.',
    sections: [
      { heading: 'A Creative Partnership With a Home at Its Center', paragraphs: ['Taurus and Cancer are a natural Water + Earth pairing — Earth providing the structure and consistency; Water providing the emotional depth and attunement. Tina\'s Taurus is in the sustained excellence of a comedy career built on craft rather than trend: every Tina Fey project bears the marks of someone who has thought very carefully about what she\'s doing. Jeff\'s Cancer is in the music — the emotional underpinning of comedic material, the particular sensitivity of a composer who knows how to hold the tonal register that comedy requires without undermining it.', 'Their professional partnership — in which he composes the music for essentially everything she creates — is one of the more unusual and functional in entertainment. Two people who share both a home and a creative language, across 30 years, with two daughters and a long list of significant cultural output: that\'s Earth + Water at its most realized.' ] },
    ],
    faqs: [
      { question: 'What is Tina Fey\'s zodiac sign?', answer: 'Tina Fey is a Taurus, born May 18, 1970. Taurus is an Earth sign known for sustained creative excellence, the craft-first approach to comedy, and the fixed commitment to a creative standard that makes every project identifiably hers.' },
      { question: 'What is Jeff Richmond\'s zodiac sign?', answer: 'Jeff Richmond is a Cancer, born July 17, 1964. Cancer is a Water sign known for emotional attunement, the musical sensitivity that makes him an ideal composer for comedy (which requires precise tonal management), and a sustained care for the people and projects he is committed to.' },
      { question: 'Are Tina Fey and Jeff Richmond compatible?', answer: 'Taurus + Cancer is an Earth + Water pairing that scores 70/100. Two people who have built both a home and a creative partnership across 30 years represent the pairing at its most durable.' },
    ],
    related: ['taurus-in-love', 'cancer-in-love', 'chip-and-joanna-gaines'],
  },

  'sarah-jessica-parker-and-matthew-broderick': {
    title: 'Sarah Jessica Parker & Matthew Broderick: An Aries and a Pisces Who Have Lasted',
    description: 'Sarah Jessica Parker is an Aries. Matthew Broderick is a Pisces. Fire + Water scores 55/100 — married 1997, three children, 28 years together and counting.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Aries', sign2: 'Pisces',
    compatLink: '/compatibility/aries-and-pisces',
    intro: 'Sarah Jessica Parker (Aries, March 25, 1965) and Matthew Broderick (Pisces, March 21, 1962) married in May 1997 after dating for several years. They have three children — James and twins Marion and Tabitha. SJP\'s career has been defined by Sex and the City and its sequels; Matthew\'s by Ferris Bueller\'s Day Off and a distinguished Broadway career. They live in New York and have maintained a quietly durable marriage for 28 years.',
    sections: [
      { heading: 'Aries and Pisces: Adjacent, Different', paragraphs: ['Aries and Pisces end and begin the zodiac — Pisces is the last sign, Aries is the first, and they are adjacent in a way that has a particular quality: the dreamer and the initiator, the sign of surrender and the sign of action. SJP\'s Aries is in the drive — the career built on relentless work, the public persona of Carrie Bradshaw that required enormous physical and emotional investment across six seasons, and the willingness to be the engine of a project. Matthew\'s Pisces is in the acting that is genuinely empathic, the Broadway work that has defined a quiet parallel career, and the particular softness of a person who doesn\'t need the spotlight to know who they are.', 'An Aries who drives and a Pisces who holds the interior steady: that combination has produced 28 years of something the tabloids have consistently failed to make interesting, which is its own kind of achievement.' ] },
    ],
    faqs: [
      { question: 'What is Sarah Jessica Parker\'s zodiac sign?', answer: 'Sarah Jessica Parker is an Aries, born March 25, 1965. Aries is a Fire sign known for career drive, a work ethic that appears to run on unlimited energy, and a willingness to be the engine of a creative project from beginning to end.' },
      { question: 'What is Matthew Broderick\'s zodiac sign?', answer: 'Matthew Broderick is a Pisces, born March 21, 1962. Pisces is a Water sign known for empathic acting, the ability to inhabit roles with genuine depth, a parallel career on Broadway that doesn\'t require the visibility of film to be meaningful.' },
      { question: 'Are SJP and Matthew Broderick compatible?', answer: 'Aries + Pisces is a Fire + Water pairing that scores 55/100. Twenty-eight years of a quietly functional marriage beside extremely visible careers: the compatibility lives in the sustained choice more than any score.' },
    ],
    related: ['aries-in-love', 'pisces-in-love', 'emily-blunt-and-john-krasinski'],
  },

  'ronald-reagan-and-nancy-reagan': {
    title: 'Ronald Reagan & Nancy Reagan: An Aquarius and a Cancer Who Were Everything to Each Other',
    description: 'Ronald Reagan was an Aquarius. Nancy Reagan was a Cancer. Air + Water scores 50/100 — married 1952, 52 years, the love story of the American presidency.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Aquarius',
    compatLink: '/compatibility/cancer-and-aquarius',
    intro: 'Ronald Reagan (Aquarius, February 6, 1911) and Nancy Davis Reagan (Cancer, July 6, 1921) married on March 4, 1952. They had two children together — Patti and Ron — and remained together until Ronald\'s death in June 2004. Nancy Reagan died in March 2016. Their love was described by those who knew them as consuming and total. Ronald\'s letters to Nancy are among the most romantic in the correspondence of any American president.',
    sections: [
      { heading: 'Aquarius and Cancer: The Visionary and the Home', paragraphs: ['Aquarius and Cancer are very different signs — Aquarius oriented toward the collective and the ideal; Cancer oriented toward the personal and the home. Ronald\'s Aquarius is in the political vision that shaped modern conservatism, the particular ability to communicate ideas to large audiences, and the warmth he extended to everyone he met. Nancy\'s Cancer is in the fierce protectiveness — she was reportedly involved in every major scheduling decision, relied on astrology for timing, and placed Ronald\'s wellbeing above every other consideration.', '"There is no Nancy without Ronnie, and no Ronnie without Nancy." That\'s not Aquarius + Cancer on paper. That\'s what happens when those two orientations find each other and commit completely.' ] },
      { heading: 'After', paragraphs: ['Ronald was diagnosed with Alzheimer\'s in 1994 and died in 2004. Nancy cared for him personally through the decade of his illness. After his death, she continued his legacy through the Reagan Foundation, opposed stem cell research restrictions (in contrast to his conservative base) because of its potential for Alzheimer\'s treatment, and died 12 years later. She said publicly that the last twelve years were the loneliest of her life. That\'s Cancer: the home was a person, and without the person, the home was only a structure.' ] },
    ],
    faqs: [
      { question: 'What is Ronald Reagan\'s zodiac sign?', answer: 'Ronald Reagan was an Aquarius, born February 6, 1911. Aquarius is an Air sign known for visionary political communication, the ability to make abstract ideals feel personally accessible to large audiences, and a warmth for humanity that coexists with genuine aloofness in the particular.' },
      { question: 'What is Nancy Reagan\'s zodiac sign?', answer: 'Nancy Reagan was a Cancer, born July 6, 1921. Cancer is a Water sign known for fierce loyalty to the people it has decided to protect, the prioritization of one person\'s wellbeing above all institutional considerations, and a love that makes the relationship the primary organizing fact of a life.' },
      { question: 'Were Ronald and Nancy Reagan compatible?', answer: 'Aquarius + Cancer is an Air + Water pairing that scores 50/100. The love story of their 52 years together is one of the few in American political life where the private relationship was as notable as the public record. The 50/100 is the astrology; the letters are the evidence.' },
    ],
    related: ['cancer-in-love', 'aquarius-in-love', 'martin-luther-king-and-coretta-scott-king'],
  },

  'jimmy-carter-and-rosalynn-carter': {
    title: 'Jimmy Carter & Rosalynn Carter: A Libra and a Leo in the Most Enduring Presidential Marriage',
    description: 'Jimmy Carter was a Libra. Rosalynn Carter was a Leo. Air + Fire scores 65/100 — married 1946, 77 years together. The longest marriage in American presidential history.',
    publishDate: '2026-05-08', readTime: '5 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Libra',
    compatLink: '/compatibility/leo-and-libra',
    intro: 'Jimmy Carter (Libra, October 1, 1924) and Eleanor Rosalynn Smith Carter (Leo, August 18, 1927) married on July 7, 1946, three weeks after he graduated from the Naval Academy. They were together for 77 years. Rosalynn died in November 2023. Jimmy Carter died in December 2024, at 100 years old — the longest-lived American president. Their marriage was the longest in presidential history.',
    sections: [
      { heading: 'Libra and Leo: The Partner and the Sovereign', paragraphs: ['Leo and Libra are signs that complement each other in the dimensions of leadership and grace. Leo leads from identity — the person who knows who they are and expresses it; Libra leads from partnership — the person who understands how to bring people together around a shared project. The 65/100 reflects genuine compatibility alongside the natural friction of Fire and Air.', 'Rosalynn\'s Leo is in the strength — the First Lady who attended Cabinet meetings (an unprecedented act), who co-founded the Carter Center\'s mental health advocacy, and who was described by those who worked with her as the more politically acute of the two. Jimmy\'s Libra is in the diplomacy, the fairness, the commitment to human rights as a governing principle, and the 40-year post-presidential career of Habitat for Humanity, election monitoring, and global health work.' ] },
      { heading: 'Seventy-Seven Years', paragraphs: ['They were together from 1946 until Rosalynn\'s death in 2023. Jimmy died the following year, at 100, having outlived her by 13 months. He said near the end that she was his greatest strength, that he would not have been the person he was without her, and that she was the most important person in his life. Rosalynn said the same of him.', 'A Libra and a Leo, across 77 years: the diplomatic and the sovereign, the partner and the leader, building something — the presidency, the center, the marriage — that neither could have built without the other.' ] },
    ],
    faqs: [
      { question: 'What is Jimmy Carter\'s zodiac sign?', answer: 'Jimmy Carter was a Libra, born October 1, 1924. Libra is an Air sign known for diplomacy, fairness, the commitment to justice as a governing principle, and a partnership orientation that made his post-presidential life an extension of a shared mission rather than a solo project.' },
      { question: 'What is Rosalynn Carter\'s zodiac sign?', answer: 'Rosalynn Carter was a Leo, born August 18, 1927. Leo is a Fire sign known for sovereign strength, the willingness to attend Cabinet meetings when no First Lady had before, the fierce advocacy for mental health, and a presence that was, by many accounts, the practical center of the Carter political operation.' },
      { question: 'Were Jimmy and Rosalynn Carter compatible?', answer: 'Leo + Libra is a Fire + Air pairing that scores 65/100. Seventy-seven years, the longest marriage in American presidential history, a shared post-presidential mission that changed international election monitoring and global health: the score is the astrology; the duration is the answer.' },
    ],
    related: ['libra-in-love', 'leo-in-love', 'barack-and-michelle-obama'],
  },

  'benedict-cumberbatch-and-sophie-hunter': {
    title: 'Benedict Cumberbatch & Sophie Hunter: A Cancer and a Pisces',
    description: 'Benedict Cumberbatch is a Cancer. Sophie Hunter is a Pisces. Water + Water scores 80/100 — married 2015, three sons, a private life beside one of the most recognized actors of his generation.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Pisces',
    compatLink: '/compatibility/cancer-and-pisces',
    intro: 'Benedict Cumberbatch (Cancer, July 19, 1976) and Sophie Hunter (Pisces, March 16, 1978) married in February 2015, announcing the engagement in The Times in the traditional British fashion. They have three sons — Christopher, Hal, and Finn. Sophie is a theater director and opera director; their shared investment in the performing arts extends across both their careers.',
    sections: [
      { heading: 'Cancer and Pisces in the Theater', paragraphs: ['Cancer and Pisces are both Water signs that naturally attune to the emotional and imaginative dimensions of art. Benedict\'s Cancer is in the empathic range that has made him one of the most versatile British actors of his generation — Hamlet, Dr. Strange, Alan Turing, Sherlock Holmes — each role inhabited with a particular Cancer quality of feeling the interior life of a person across any surface.', 'Sophie\'s Pisces is in the direction — the capacity to hold a complete imaginative world and guide performers through it, which requires exactly the Pisces combination of empathy and total absorption in an invented reality. Two Water signs who work on opposite sides of the stage bring mutual fluency to the work that neither sign finds common outside their own element.' ] },
    ],
    faqs: [
      { question: 'What is Benedict Cumberbatch\'s zodiac sign?', answer: 'Benedict Cumberbatch is a Cancer, born July 19, 1976. Cancer is a Water sign known for empathic range, the ability to inhabit interior lives across any surface, and a protectiveness about his own private life that is the inverse of his public exposure.' },
      { question: 'What is Sophie Hunter\'s zodiac sign?', answer: 'Sophie Hunter is a Pisces, born March 16, 1978. Pisces is a Water sign known for the directorial imagination that holds a complete invented world, the empathic attunement that guides performers, and the private nature that matches the public reserve of the Cancer she married.' },
      { question: 'Are Benedict and Sophie compatible?', answer: 'Cancer + Pisces is a Water + Water pairing that scores 80/100. Two theater people, both oriented toward the emotional and imaginative dimensions of art, living a private life beside an extremely visible career: the Water + Water attunement runs through both the work and the home.' },
    ],
    related: ['cancer-in-love', 'pisces-in-love', 'johnny-cash-and-june-carter-cash'],
  },

  'zoe-saldana-and-marco-perego': {
    title: 'Zoë Saldana & Marco Perego: A Gemini and a Taurus',
    description: 'Zoë Saldana is a Gemini. Marco Perego is a Taurus. Air + Earth scores 55/100 — married 2013, three sons, a notably private partnership beside one of the highest-grossing actresses in history.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Taurus', sign2: 'Gemini',
    compatLink: '/compatibility/taurus-and-gemini',
    intro: 'Zoë Saldana (Gemini, June 19, 1978) and Marco Perego (Taurus, May 1, 1979) married secretly in June 2013 after a brief courtship. They have triplet sons — Bowie, Cy, and Zen. Zoë is one of the highest-grossing actresses in film history through the Avatar and Guardians of the Galaxy franchises. Marco is a painter. He took her surname.',
    sections: [
      { heading: 'Gemini and Taurus: Range and Ground', paragraphs: ['Zoë\'s Gemini is in the career range — the ability to inhabit Uhura, Gamora, and Neytiri simultaneously across decades, the adaptability that three franchises requires, and the social intelligence that has made her a consistent presence through the industry\'s shifting tides. Marco\'s Taurus is in the painting — a patient craft, done privately, outside the film world entirely — and in the decision to take his wife\'s surname rather than expecting her to take his. That choice, made publicly, says something about a Taurus who has decided that what they\'re building together is more important than the conventional claim of the name.', 'A Gemini who moves across worlds and a Taurus who stays in one: that\'s the Air + Earth pairing at its most functional when the Taurus has built something worth returning to, and the Gemini knows the difference between moving and leaving.' ] },
    ],
    faqs: [
      { question: 'What is Zoë Saldana\'s zodiac sign?', answer: 'Zoë Saldana is a Gemini, born June 19, 1978. Gemini is an Air sign known for range, adaptability, the ability to inhabit completely different registers across multiple franchises, and a restless creative energy that keeps the work interesting.' },
      { question: 'What is Marco Perego\'s zodiac sign?', answer: 'Marco Perego is a Taurus, born May 1, 1979. Taurus is an Earth sign known for the patient craft of painting, the fixed commitment to what he has built, and the particular kind of confidence that can take his wife\'s surname without any sense of diminishment.' },
      { question: 'Are Zoë and Marco compatible?', answer: 'Taurus + Gemini is an Earth + Air pairing that scores 55/100. The grounding Taurus and the range-seeking Gemini require translation; Marco\'s deliberate choice to inhabit the domestic and artistic space alongside Zoë\'s career rather than competing with it is the workable version of this combination.' },
    ],
    related: ['gemini-in-love', 'taurus-in-love', 'david-and-victoria-beckham'],
  },

  'maya-hawke-and-christian-lee-hutson': {
    title: 'Maya Hawke & Christian Lee Hutson: A Cancer and a Scorpio',
    description: 'Maya Hawke is a Cancer. Christian Lee Hutson is a Scorpio. Water + Water scores 80/100 — they married on Valentine\'s Day 2026. An indie musician and a Stranger Things star who kept their relationship almost entirely private.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Scorpio',
    compatLink: '/compatibility/cancer-and-scorpio',
    intro: 'Maya Hawke (Cancer, July 8, 2000) and Christian Lee Hutson (Scorpio, November 5, 1990) married on Valentine\'s Day, February 14, 2026, in a ceremony that was announced after it had already taken place. They had been together for several years before the marriage, maintaining almost complete privacy despite both being recognizable public figures. Maya is the daughter of Uma Thurman and Ethan Hawke; Christian is an indie singer-songwriter from Kansas City.',
    sections: [
      { heading: 'Cancer and Scorpio: Water Recognizing Water', paragraphs: ['Cancer and Scorpio are a natural Water + Water trine — both signs emotionally deep, both valuing privacy and protection of what matters, both tending to build their most important relationships slowly and carefully. The immediate attunement that Cancer and Scorpio typically feel is often described as recognition: the sense of meeting someone who inhabits the same interior world.', 'Maya\'s Cancer is in the acting work that has required genuine emotional exposure — Stranger Things, her solo music, her theatrical roles — and in the quiet she has sought around her personal life despite very famous parents. Christian\'s Scorpio is in the songwriting: his albums are emotionally exacting, introspective, built on a level of feeling that Scorpio brings to art when it\'s working at full depth.'] },
      { heading: 'Water + Water — 80/100', paragraphs: ['Two Water signs who have both built careers in the arts — one as an actor and musician, one as a songwriter — share a native understanding of creative vulnerability that most people never find. The 80/100 reflects the natural resonance between Cancer and Scorpio: depth meeting depth, emotional attunement meeting Scorpio\'s total loyalty when it has decided someone is worth it.', 'Their relationship was kept private for years, and their marriage was announced after the fact. That\'s very Cancer + Scorpio: both signs protect what is most important by not giving it to the public until there\'s nothing left to protect.' ] },
      { callout: 'A Cancer born in July and a Scorpio born in November: the trine between these two signs is one astrology returns to repeatedly when discussing emotional compatibility. When both people are also artists who process the world through their work, the resonance has more places to live.' },
    ],
    faqs: [
      { question: 'What is Maya Hawke\'s zodiac sign?', answer: 'Maya Hawke is a Cancer, born July 8, 2000. Cancer is a Water sign known for emotional depth, creative sensitivity, a fierce protectiveness of private life, and an attunement in performance that makes her work feel genuinely inhabited.' },
      { question: 'What is Christian Lee Hutson\'s zodiac sign?', answer: 'Christian Lee Hutson is a Scorpio, born November 5, 1990. Scorpio is a Water sign known for emotionally exacting songwriting, depth of feeling, protection of the private, and a loyalty that runs total once given.' },
      { question: 'Are Maya Hawke and Christian Lee Hutson compatible?', answer: 'Cancer + Scorpio is a Water + Water trine pairing that scores 80/100. Two artists who both process experience through creative work, both protect their private lives fiercely, and both bring full emotional depth to what they do: the compatibility is both astrological and structural.' },
    ],
    related: ['cancer-in-love', 'scorpio-in-love', 'ariana-grande-and-ethan-slater'],
  },

  'aja-wilson-and-bam-adebayo': {
    title: 'A\'ja Wilson & Bam Adebayo: A Leo and a Cancer',
    description: 'A\'ja Wilson is a Leo. Bam Adebayo is a Cancer. Fire + Water scores 60/100 — two of basketball\'s biggest stars, confirmed together in late 2025.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Cancer', sign2: 'Leo',
    compatLink: '/compatibility/cancer-and-leo',
    intro: 'A\'ja Wilson (Leo, August 8, 1996) is the WNBA\'s most dominant player — four-time All-Star, two-time WNBA champion, two-time Finals MVP with the Las Vegas Aces, and Paris 2024 gold medalist. Bam Adebayo (Cancer, July 18, 1997) is the starting center for the Miami Heat and a multiple All-Star. They confirmed their relationship in late 2025, making them one of basketball\'s most high-profile couples across both leagues.',
    sections: [
      { heading: 'Leo and Cancer: The Radiant and the Devoted', paragraphs: ['Leo is the sign of sovereign presence — warmth, the natural authority of someone who occupies their arena completely. A\'ja\'s Leo is visible in everything she does on court: the emotional expressiveness, the charisma, the leadership of a franchise player who has won multiple championships and still plays like there\'s something to prove.', 'Cancer is the sign of deep care, fierce loyalty, and protectiveness. Bam\'s Cancer is in his locker-room reputation — one of the most universally respected players in the NBA not for his scoring but for who he is: the reliability, the investment in team over individual, the quiet presence that holds a franchise together.' ] },
      { heading: 'Fire + Water — 60/100', paragraphs: ['Leo and Cancer are adjacent signs with natural warmth alongside real differences in orientation. Leo radiates outward; Cancer moves inward. The 60/100 reflects the complementarity alongside the navigation required.', 'Both people are at the peak of their athletic careers simultaneously — which is unusual for athlete couples and provides a shared context most don\'t have. Two people who understand what elite-level competition demands, who have both won championships, share a fundamental reference point that doesn\'t need to be explained.' ] },
    ],
    faqs: [
      { question: 'What is A\'ja Wilson\'s zodiac sign?', answer: 'A\'ja Wilson is a Leo, born August 8, 1996. Leo is a Fire sign known for dominant arena presence, warmth, natural leadership, and the authority of someone who has won at the highest level and carries it quietly.' },
      { question: 'What is Bam Adebayo\'s zodiac sign?', answer: 'Bam Adebayo is a Cancer, born July 18, 1997. Cancer is a Water sign known for team-first loyalty, the reliability that makes teammates trust you completely, and a protective care that extends through every commitment.' },
      { question: 'Are A\'ja Wilson and Bam Adebayo compatible?', answer: 'Leo + Cancer is a Fire + Water pairing that scores 60/100. Adjacent signs with genuine warmth — Leo radiating outward, Cancer protecting inward — produce real complementarity when both people are at the peak of their game and understand what that demands.' },
    ],
    related: ['leo-in-love', 'cancer-in-love', 'simone-biles-and-jonathan-owens'],
  },

  'kaia-gerber-and-lewis-pullman': {
    title: 'Kaia Gerber & Lewis Pullman: A Virgo and an Aquarius',
    description: 'Kaia Gerber is a Virgo. Lewis Pullman is an Aquarius. Earth + Air scores 45/100 — they started dating in early 2025. The model-turned-actor and the Top Gun: Maverick breakout.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Virgo', sign2: 'Aquarius',
    compatLink: '/compatibility/virgo-and-aquarius',
    intro: 'Kaia Gerber (Virgo, September 3, 2001) and Lewis Pullman (Aquarius, January 29, 1993) were first linked in early 2025. Kaia is the daughter of Cindy Crawford, and has built a career as both a model and an actress (American Horror Story, Bottoms). Lewis is the son of Bill Pullman, and broke through with Top Gun: Maverick before starring in Thunderbolts* in 2025. Both are children of very famous parents navigating the particular challenge of building their own identities alongside inherited visibility.',
    sections: [
      { heading: 'Virgo and Aquarius: Craft and Vision', paragraphs: ['Virgo is the sign of precision — the careful, attentive approach to whatever they do, the belief that the work matters and should be done with care. Kaia\'s Virgo is in the transition from modeling to acting she has navigated with deliberate seriousness — taking roles that require craft rather than platform, studying the work rather than assuming it comes naturally.', 'Aquarius is the sign of the visionary — independent, intellectually animated, interested in ideas that extend past conventional limits. Lewis\'s Aquarius is in the unconventional career choices (Thunderbolts* is genuinely strange film) and the quality of an actor more interested in character than in stardom.' ] },
      { heading: 'Earth + Air — 45/100', paragraphs: ['Virgo and Aquarius are an inconjunct pair — different in element, modality, and polarity. The 45/100 reflects a pairing that requires ongoing translation between Earth\'s tangible precision and Air\'s principled possibility. What bridges the gap is the shared experience of building identity alongside very famous parents — a context that requires exactly the Virgo discipline and Aquarian independence both of them appear to have developed.' ] },
    ],
    faqs: [
      { question: 'What is Kaia Gerber\'s zodiac sign?', answer: 'Kaia Gerber is a Virgo, born September 3, 2001. Virgo is an Earth sign known for precision, the serious approach to craft, and a private nature that coexists with an extremely public career.' },
      { question: 'What is Lewis Pullman\'s zodiac sign?', answer: 'Lewis Pullman is an Aquarius, born January 29, 1993. Aquarius is an Air sign known for unconventional choices, intellectual independence, and approaching a career on its own terms.' },
      { question: 'Are Kaia Gerber and Lewis Pullman compatible?', answer: 'Virgo + Aquarius is an Earth + Air pairing that scores 45/100. The elemental differences require translation; the shared experience of building identity beside very famous parents may provide common ground that makes the translation workable.' },
    ],
    related: ['virgo-in-love', 'aquarius-in-love', 'garth-brooks-and-trisha-yearwood'],
  },

  'madeleine-petsch-and-tyga': {
    title: 'Madeleine Petsch & Tyga: A Leo and a Scorpio',
    description: 'Madeleine Petsch is a Leo. Tyga is a Scorpio. Fire + Water scores 55/100 — they confirmed their relationship in April 2025, two fixed signs with different orientations and a shared intensity.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Leo', sign2: 'Scorpio',
    compatLink: '/compatibility/leo-and-scorpio',
    intro: 'Madeleine Petsch (Leo, August 18, 1994) is best known for playing Cheryl Blossom on Riverdale across seven seasons. Tyga (Scorpio, November 19, 1989) is a rapper and music entrepreneur. They confirmed their relationship in April 2025. Leo and Scorpio are both fixed signs — stubborn, intense, committed to their positions — which creates a pairing with real mutual respect alongside real friction.',
    sections: [
      { heading: 'Leo and Scorpio: Fixed Signs, Different Depths', paragraphs: ['Leo and Scorpio are both fixed signs — which means both people hold their positions with conviction, both tend toward intensity, and neither is easily redirected by the other. That shared fixity creates a particular quality: mutual respect for each other\'s strength, and the kind of standoff that only two fixed signs can produce when they disagree.', 'Madeleine\'s Leo is in the emotional range of a seven-season performance requiring camp comedy, genuine vulnerability, and physical presence across 110 episodes. Tyga\'s Scorpio is in the music\'s emotional intensity, the entrepreneurial depth (multiple fashion and business ventures), and the careful control of his own narrative.' ] },
      { heading: 'Fire + Water — 55/100', paragraphs: ['Fire wants to shine outward; Water wants to go deep inward. The 55/100 reflects the real attraction alongside the fundamental difference in how each sign processes intensity — Leo through expression and performance; Scorpio through depth and internal stillness.', 'Fixed Fire + Fixed Water at its best produces a relationship where both people\'s strength is genuinely honored. At its most challenging, it produces two people who are both too stubborn to move. The direction it takes depends on how well each person can appreciate what the other\'s element offers.' ] },
    ],
    faqs: [
      { question: 'What is Madeleine Petsch\'s zodiac sign?', answer: 'Madeleine Petsch is a Leo, born August 18, 1994. Leo is a Fire sign known for emotional range, the warmth and authority that made Cheryl Blossom compelling across seven seasons, and a fixed nature that holds what it commits to.' },
      { question: 'What is Tyga\'s zodiac sign?', answer: 'Tyga is a Scorpio, born November 19, 1989. Scorpio is a Water sign known for intensity, careful narrative control, entrepreneurial depth, and a fixed nature that means when he commits to something, he does it at full depth.' },
      { question: 'Are Madeleine Petsch and Tyga compatible?', answer: 'Leo + Scorpio is a Fire + Water pairing of two fixed signs that scores 55/100. The shared fixity creates mutual respect for each other\'s strength; the elemental difference between Fire\'s expression and Water\'s depth is the ongoing navigation.' },
    ],
    related: ['leo-in-love', 'scorpio-in-love', 'bill-clinton-and-hillary-clinton'],
  },

  'venus-williams-and-andrea-preti': {
    title: 'Venus Williams & Andrea Preti: Two Geminis',
    description: 'Venus Williams is a Gemini. Andrea Preti is a Gemini. Same sign, Air + Air scores 70/100 — they made their public debut at the 2026 Met Gala. Two people who move at the speed of ideas.',
    publishDate: '2026-05-08', readTime: '4 min read', category: 'couple',
    sign1: 'Gemini', sign2: 'Gemini',
    compatLink: '/compatibility/gemini-and-gemini',
    intro: 'Venus Williams (Gemini, June 17, 1980) and Andrea Preti (Gemini, June 6, 1988) made their public debut as a couple at the 2026 Met Gala. Venus is one of the greatest tennis players in history — seven Grand Slam singles titles, four Olympic gold medals — and has spent decades building fashion and interior design businesses alongside her athletic career. Andrea Preti is an Italian actor and model based in the United States. Both are Geminis, born twelve days and eight years apart.',
    sections: [
      { heading: 'Two Geminis: The Same Current', paragraphs: ['Gemini is the sign of multiplicity — the person who contains several versions of themselves simultaneously and moves between them with equal fluency. Venus\'s Gemini is total: the tennis champion and the fashion designer (EleVen by Venus) and the interior designer (V Starr) and the activist and the businesswoman, all running in parallel across four decades without any of them being reduced.', 'Two Geminis together recognize each other immediately — the same range, the same speed, the same willingness to hold multiple ideas simultaneously. The mental rapport is instant and sustained. What both people need is someone who can keep up, which is a genuinely rare requirement, and which another Gemini is uniquely positioned to meet.' ] },
      { heading: 'Air + Air — 70/100', paragraphs: ['Two Geminis score 70/100 — the natural ease of same-element alongside the particular challenge of same-sign: both people share the same restlessness. A Gemini typically needs someone who can provide grounding when the range becomes too diffuse. When both partners are Gemini, that grounding has to come from outside the pairing — from shared work, shared mission, or the stability that two people who have each built serious careers bring to a relationship.' ] },
      { callout: 'Venus Williams has built four businesses alongside one of the greatest tennis careers in history. She\'s not looking for someone to complete her — she\'s looking for someone who can keep up. Two Geminis who have both built serious, multi-dimensional careers understand what that means.' },
    ],
    faqs: [
      { question: 'What is Venus Williams\'s zodiac sign?', answer: 'Venus Williams is a Gemini, born June 17, 1980. Gemini is an Air sign known for the range that has allowed Venus to be simultaneously a Grand Slam champion, fashion designer, interior designer, activist, and entrepreneur — all at full intensity.' },
      { question: 'What is Andrea Preti\'s zodiac sign?', answer: 'Andrea Preti is a Gemini, born June 6, 1988. Gemini is an Air sign known for cross-disciplinary range, the ability to move between film, television, and modeling with equal fluency, and the particular speed of a mind that is always in motion.' },
      { question: 'Are Venus Williams and Andrea Preti compatible?', answer: 'Gemini + Gemini is a same-sign Air + Air pairing that scores 70/100. The mental rapport between two Geminis is immediate and sustained; the challenge is that both people share the same restlessness, so the grounding for the relationship comes from shared mission rather than from the pairing itself.' },
    ],
    related: ['gemini-in-love', 'mila-kunis-and-ashton-kutcher', 'moon-sign-compatibility'],
  },

  'moon-sign-compatibility': {
    title: 'Moon Sign Compatibility: The Relationship Layer Sun Signs Miss',
    description: 'Sun sign compatibility is the starting point. But if you want to understand why some relationships feel instantly comfortable and others are exhausting despite good Sun sign scores — you need to look at the Moon.',
    publishDate: '2026-05-01',
    readTime: '7 min read',
    category: 'guide',
    intro: 'Most astrology compatibility conversations focus on Sun signs. But if you\'ve ever been in a relationship that looked great on paper and felt like hard work in practice — or one that shouldn\'t have worked at all but felt effortless — the Moon is the piece you\'re missing.',
    sections: [
      {
        heading: 'What the Moon Sign Governs',
        paragraphs: [
          'The Moon in your birth chart represents your emotional nature: how you process feelings, what you need to feel safe, how you give and receive care, and what "home" means to you. In a relationship, Moon compatibility often matters more than Sun compatibility because the Moon governs the interior life — the parts of yourself you only show when you trust someone.',
          'A couple with challenging Sun sign compatibility but compatible Moon signs often feels surprisingly easy emotionally. A couple with excellent Sun sign compatibility but clashing Moons may have great surface-level connection but struggle in the quiet, daily experience of being together.',
        ],
      },
      {
        heading: 'Fire Moons (Aries, Leo, Sagittarius)',
        paragraphs: [
          'Fire Moons process emotions directly and quickly. They need acknowledgment and enthusiasm. They can feel suffocated by extended emotional processing. A Fire Moon partner who wants to talk through feelings for three days is not being asked something unreasonable — but it feels unreasonable to a Fire Moon, and both people need to know that.',
        ],
        bullets: [
          'Best with: Air Moons (who match their pace) or other Fire Moons',
          'Challenge with: Water Moons (who need extended emotional processing Fire Moon finds draining)',
        ],
      },
      {
        heading: 'Earth Moons (Taurus, Virgo, Capricorn)',
        paragraphs: [
          'Earth Moons process emotions slowly and practically. They need stability, physical comfort, and tangible expressions of care — actions over words. Earth Moons are often accused of being emotionally unavailable when they\'re actually just private and deliberate.',
        ],
        bullets: [
          'Best with: Water Moons (who bring emotional depth) or other Earth Moons (who share the preference for quiet consistency)',
          'Challenge with: Air Moons (who intellectualize rather than ground)',
        ],
      },
      {
        heading: 'Air Moons (Gemini, Libra, Aquarius)',
        paragraphs: [
          'Air Moons process emotions intellectually. They need conversation, space, and a partner who doesn\'t demand immediate emotional availability. Air Moons often don\'t know what they feel until they\'ve talked about it — which can look like avoidance to more feeling-oriented signs.',
        ],
        bullets: [
          'Best with: Fire Moons (who match their pace) or other Air Moons (who understand the need to think before feeling)',
          'Challenge with: Water Moons (who read emotional distance as rejection)',
        ],
      },
      {
        heading: 'Water Moons (Cancer, Scorpio, Pisces)',
        paragraphs: [
          'Water Moons process emotions deeply and intuitively. They pick up on unspoken feelings, need emotional safety to function fully, and can sense inauthenticity the way other signs sense temperature. Water Moons in the wrong relationship spend all their energy managing their own emotional flood rather than connecting.',
        ],
        bullets: [
          'Best with: Earth Moons (who provide grounding and reliable presence) or other Water Moons (who understand the depth)',
          'Challenge with: Fire Moons (who move too fast) or Air Moons (who intellectualize what Water Moons feel)',
        ],
      },
      {
        heading: 'How to Find Your Moon Sign',
        paragraphs: [
          'Your Moon sign requires your birth time to calculate accurately — the Moon changes signs approximately every 2.5 days, so two people born on the same day can have different Moon signs depending on the hour. Use the Birth Chart Library calculator to find yours.',
          'Once you have your Moon sign and your partner\'s, read the element first (Fire, Earth, Air, Water) rather than the specific sign. The element gives you the emotional language. The specific sign gives you the dialect.',
        ],
      },
      {
        callout: 'Sun sign compatibility tells you how your core identities interact. Moon sign compatibility tells you whether you\'ll feel at home with each other. Both matter. Most people are only checking one.',
      },
    ],
    faqs: [
      { question: 'What is Moon sign compatibility?', answer: 'Moon sign compatibility refers to how compatible two people\'s Moon signs are in a relationship. Since the Moon governs emotional nature, processing styles, and what makes us feel safe, compatible Moon signs often mean the relationship feels emotionally easy and intuitive, even when other placements create friction.' },
      { question: 'Is Moon sign compatibility more important than Sun sign?', answer: 'Many astrologers argue yes — especially for long-term partnerships. The Sun sign governs identity and core values; the Moon governs emotional needs and daily comfort. You can admire someone\'s Sun sign energy and still feel emotionally mismatched at the Moon level.' },
      { question: 'How do I find my Moon sign?', answer: 'Your Moon sign requires your birth time, since the Moon moves through each sign every 2.5 days. Enter your birth date, time, and location into the Birth Chart Library calculator to get your full natal chart including Moon sign.' },
    ],
    related: ['red-flags-by-zodiac-sign', 'scorpio-in-love', 'libra-in-love'],
  },

  'red-flags-by-zodiac-sign': {
    title: 'Red Flags for Every Zodiac Sign in Relationships',
    description: 'Every sign has a shadow. Understanding what yours looks like in a relationship — and what a partner\'s can look like — is not about judgment. It\'s about knowing what patterns to watch before they become the relationship itself.',
    publishDate: '2026-05-01',
    readTime: '8 min read',
    category: 'guide',
    intro: 'Every zodiac sign has a version of themselves that shows up when they\'re hurt, scared, or operating from an unhealed wound. These aren\'t character flaws — they\'re survival strategies that have outlived their usefulness. Here\'s what each sign looks like when they\'re not at their best in love.',
    sections: [
      {
        heading: 'Aries ♈ — Competition Replacing Connection',
        paragraphs: ['When Aries feels threatened or ignored, the competitive drive that energizes them turns inward. Every disagreement becomes a battle to be won rather than a conversation to be had. An Aries operating from wound doesn\'t pause to consider impact — they just need to not lose.'],
      },
      {
        heading: 'Taurus ♉ — Stability Becoming Stubbornness',
        paragraphs: ['Taurus\' red flag is when resistance to change becomes refusal to grow. "I just know what I want" can close down every conversation about evolution in the relationship. Possessiveness can also emerge — Taurus\' love of security turning into an attempt to control what they fear losing.'],
      },
      {
        heading: 'Gemini ♊ — Inconsistency as a Pattern',
        paragraphs: ['Gemini\'s red flag is chronic emotional unavailability that hides behind adaptability. Present one week, absent the next. Fully committed in conversation, scattered in practice. Their verbal facility can be used to deflect rather than connect — winning arguments instead of having them.'],
      },
      {
        heading: 'Cancer ♋ — Care Becoming Control',
        paragraphs: ['Cancer\'s red flag is when nurturing curdles into enmeshment — when their need for closeness becomes a demand that the partner have no independent inner life. Cancer\'s shadow uses guilt as currency and indirect communication as armor. The partner ends up managing Cancer\'s anxiety instead of building a life together.'],
      },
      {
        heading: 'Leo ♌ — Ego Displacing Intimacy',
        paragraphs: ['Leo\'s red flag is needing to be admired more than they need to be known. When not receiving consistent validation, Leo can become cold, performative, or punishing. The vulnerability beneath the boldness is real — but an unexamined Leo will protect it by becoming impossible to reach.'],
      },
      {
        heading: 'Virgo ♍ — Helpfulness as Criticism',
        paragraphs: ['Virgo\'s red flag is when high standards become an endless catalog of inadequacy. When Virgo is anxious, they fix — and if fixing is unavailable, they criticize. A Virgo operating from wound makes the people around them feel like they can never measure up, which is the opposite of the devotion Virgo actually intends.'],
      },
      {
        heading: 'Libra ♎ — Harmony Performance',
        paragraphs: ['Libra\'s red flag is chronic conflict avoidance that makes the relationship unreal. Agreeing with things they don\'t believe. Disappearing emotionally when hard conversations are needed. A Libra who won\'t be in a real relationship because they\'re performing harmony has made the partnership a stage set rather than a home.'],
      },
      {
        heading: 'Scorpio ♏ — Punishment Over Communication',
        paragraphs: ['Scorpio\'s red flag is using silence, withdrawal, or retaliation rather than actually communicating hurt. When a Scorpio has been wounded, they can make the partner responsible for injuries they may not even know they caused. The intensity that makes Scorpio\'s love extraordinary can make their pain suffocating.'],
      },
      {
        heading: 'Sagittarius ♐ — Freedom Without Accountability',
        paragraphs: ['"I just need freedom" is the most common Sagittarius red flag — when independence becomes a structural refusal to fully show up. The sign that says "I don\'t do labels" sometimes means "I don\'t want accountability." Sagittarius can love the idea of a person more than the actual daily practice of being with them.'],
      },
      {
        heading: 'Capricorn ♑ — Emotional Distance as Strength',
        paragraphs: ['Capricorn\'s red flag is emotional unavailability dressed as competence. Work and achievement consistently prioritized over the relationship. A partner who gradually realizes they\'re in a relationship with someone\'s schedule rather than someone\'s heart. Capricorn\'s self-sufficiency can become a wall rather than a foundation.'],
      },
      {
        heading: 'Aquarius ♒ — Intellectualization Over Presence',
        paragraphs: ['Aquarius\' red flag is analyzing the relationship from the outside rather than actually being in it. They can articulate every concept about love while not being emotionally present in the actual relationship. The partner ends up feeling intellectualized more than loved — like a subject of study rather than a person being chosen.'],
      },
      {
        heading: 'Pisces ♓ — Escapism Over Accountability',
        paragraphs: ['Pisces\' red flag is disappearing from difficulty — into fantasy, into projection, sometimes into substances. Pisces can fall in love with who they want someone to be rather than who they actually are, and feel betrayed when the real person doesn\'t match the dream. The chronic victimhood that can emerge prevents the accountability that would actually change things.'],
      },
      {
        callout: 'Every red flag listed above is a survival strategy that has outlived its usefulness. Understanding yours is not self-criticism — it\'s the beginning of doing it differently.',
      },
    ],
    faqs: [
      { question: 'What are the red flags of each zodiac sign?', answer: 'Each sign has characteristic shadow behaviors: Aries (combativeness), Taurus (possessiveness), Gemini (inconsistency), Cancer (guilt-tripping), Leo (ego over intimacy), Virgo (chronic criticism), Libra (conflict avoidance), Scorpio (punishment), Sagittarius (commitment avoidance), Capricorn (emotional distance), Aquarius (intellectualization), Pisces (escapism). These are shadow patterns, not fixed traits.' },
      { question: 'Are zodiac sign red flags real?', answer: 'They\'re real in the sense that each sign has characteristic stress responses and wound patterns that show up in relationships. These aren\'t destiny — they\'re tendencies, and they\'re workable with self-awareness. The point of understanding them is not to judge, but to recognize patterns before they become entrenched.' },
    ],
    related: ['moon-sign-compatibility', 'scorpio-in-love', 'libra-in-love'],
  },

  // Sign-in-love articles (generated from SIGN_LOVE data)
  'aries-in-love': buildSignArticle('Aries'),
  'taurus-in-love': buildSignArticle('Taurus'),
  'gemini-in-love': buildSignArticle('Gemini'),
  'cancer-in-love': buildSignArticle('Cancer'),
  'leo-in-love': buildSignArticle('Leo'),
  'virgo-in-love': buildSignArticle('Virgo'),
  'libra-in-love': buildSignArticle('Libra'),
  'scorpio-in-love': buildSignArticle('Scorpio'),
  'sagittarius-in-love': buildSignArticle('Sagittarius'),
  'capricorn-in-love': buildSignArticle('Capricorn'),
  'aquarius-in-love': buildSignArticle('Aquarius'),
  'pisces-in-love': buildSignArticle('Pisces'),
}
