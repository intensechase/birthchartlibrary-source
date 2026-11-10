// Sign compatibility text data — 78 unique pairs + element/modality
// analysis. ~100KB raw / 31KB gzip when bundled to the client. Pages
// that need only constants/helpers (SIGN_ORDER, getPairSlug, etc.)
// should import from compatibility-helpers.ts to avoid pulling this
// payload into their chunk.

import { pairKey } from './compatibility-helpers'

export interface PairData {
  summary: string
  dynamic: string
  strengths: string[]
  challenges: string[]
  tip: string
}

export const ELEMENT_COMPAT: Record<string, { nature: string; score: number; description: string; communication: string; loveStyle: string }> = {
  'Fire+Fire': {
    nature: 'explosive',
    score: 75,
    description: 'Two fires in the same space don\'t just warm the room... they can burn it down. The energy is real, the enthusiasm is contagious, and the attraction reads like recognition. The problem is that both partners are accustomed to being the source of heat, and when neither steps back to tend the flame, the whole thing accelerates past exciting and into exhausting.',
    communication: 'Direct, quick, and loud. Both partners say what they mean without much diplomatic softening, which means arguments are fast and usually short. The challenge is that both are so busy speaking that neither is particularly good at listening, and what sounds like honesty can land like an assault.',
    loveStyle: 'Physical, expressive, and driven by novelty. Fire sign pairs run on the new thing... new destinations, new plans, new reasons to feel alive. Routine is where this pairing stalls. The love is real but needs constant motion to stay that way.',
  },
  'Fire+Earth': {
    nature: 'grounding',
    score: 55,
    description: 'Fire moves fast and burns bright. Earth moves slowly and builds something that holds. Put them together and you get a constant negotiation between the partner who wants to go and the one who wants to stay... and when they work it out, you get something with both vision and substance. When they don\'t, one partner feels suffocated and the other feels perpetually overwhelmed.',
    communication: 'A translation problem more than a communication failure. Fire leads with enthusiasm and the big picture. Earth leads with the practical concern and the next concrete step. Each finds the other slightly baffling. The solution isn\'t for one to adopt the other\'s language but to actually value what the other sees.',
    loveStyle: 'Fire brings the spark and the pursuit. Earth brings the physical grounding and the long patience. At best, Fire warms what Earth has built and Earth gives Fire somewhere real to land. The pairing tends to be worse at meeting in the middle on timeline and risk.',
  },
  'Fire+Air': {
    nature: 'electric',
    score: 85,
    description: 'Air is what Fire needs to keep going, and Fire is what gives Air something to move toward. The chemistry is genuinely easy... the conversation flows, the energy builds, and both partners feel sharper in each other\'s presence. The catch is that easy chemistry doesn\'t automatically become depth. Two elements moving this fast can miss the slower emotional registers entirely.',
    communication: 'Fast, stimulating, and usually enjoyable. Fire provides the conviction; Air provides the counterargument and the left turn that makes the conversation interesting. Where this pairing falls short is in the territory below the words... feelings that don\'t organize into ideas, needs that can\'t be debated into existence.',
    loveStyle: 'Intellectually electric, socially active, and fond of keeping things in motion. The connection tends to be more mental than physical, more about shared curiosity than emotional depth. Which suits both partners until it doesn\'t.',
  },
  'Fire+Water': {
    nature: 'steamy',
    score: 50,
    description: 'Fire and Water don\'t naturally coexist. Water can douse the fire; Fire can evaporate the water. And when they\'re generating steam, the question is whether that\'s chemistry or damage. When it works, this pairing produces something genuinely passionate and emotionally alive... each partner gets access to a register they couldn\'t reach alone. When it doesn\'t, Fire blunders through Water\'s sensitivity and Water floods Fire\'s need for forward motion.',
    communication: 'The hardest element gap to bridge. Fire is direct, externally oriented, and solution-focused. Water is intuitive, internally oriented, and emotionally coded. Fire accidentally says the thing that wounds. Water expresses the wound in ways Fire can\'t parse. Getting both partners to slow down enough to hear what the other is actually saying is the central work.',
    loveStyle: 'When the chemistry is right, intensely physical and emotionally consuming. Fire provides the pursuit and the heat; Water provides the depth and the devotion. The physical connection can be extraordinary. The emotional one takes longer to build and is more fragile.',
  },
  'Earth+Earth': {
    nature: 'stable',
    score: 70,
    description: 'Two Earth signs build something that holds... reliable, sensory, and built to last. Both partners understand each other\'s need for security, share practical values around what a life should look like, and make the day-to-day less friction than most pairings. The risk is comfort becoming the destination rather than the baseline. Without outside challenge, this pairing can organize itself into a very attractive rut.',
    communication: 'Measured, practical, and substance-forward. Neither partner is inclined toward dramatic emotional negotiations... they talk about what\'s actionable and what\'s real. The weakness is that feelings don\'t always fall into those categories. Unspoken emotional needs tend to accumulate quietly until the practical surface cracks.',
    loveStyle: 'Sensory, loyal, and expressed through consistent presence and shared life-building. Earth sign pairs show up. They cook the meal, fix the thing that\'s broken, plan the trip. What they\'re less naturally inclined toward is spontaneous declaration or romantic drama, which can feel like a deficit to partners who equate love with its loudest expressions.',
  },
  'Earth+Air': {
    nature: 'contrasting',
    score: 50,
    description: 'Earth processes through the senses and the material world. Air processes through the mind and the abstract. This creates a pairing that is either deeply complementary... one partner grounds the other\'s ideas in something real... or perpetually frustrating, as each finds the other\'s mode of operating slightly baffling. The intellectual interest is genuine. The lived-experience gap is real.',
    communication: 'Rationality is the shared language, which helps more than you\'d expect. Where they diverge is in what they consider rational... Air wants to discuss the concept and its implications, Earth wants to discuss the plan and its outcomes. Each thinks they\'re being clear. Neither is wrong.',
    loveStyle: 'Air brings novelty, social energy, and ideas. Earth brings sensuality, stability, and presence. The combination works when Air can root affection in consistent action and Earth can develop tolerance for Air\'s need to move, mentally and physically, in ways that don\'t threaten the foundation.',
  },
  'Earth+Water': {
    nature: 'nurturing',
    score: 80,
    description: 'Earth gives Water somewhere to settle. Water nourishes what Earth grows. This is a genuinely complementary element pairing... not because it\'s easy, but because what each partner needs is precisely what the other naturally offers. Earth provides the stable container; Water provides the emotional depth and imaginative richness that makes a life feel like more than logistics.',
    communication: 'Quiet and complementary. Earth provides the practical stability that helps Water\'s emotional expression land in the real world. Water helps Earth access feelings they might otherwise suppress or skip past. The conversations in this pairing may not be loud or frequent, but they tend to carry weight.',
    loveStyle: 'Affectionate, physically comforting, and oriented toward building something that feels like home. Both partners show love through presence, care, and the small consistent acts that add up over time. This is not a loud or dramatic love. It is a durable one.',
  },
  'Air+Air': {
    nature: 'cerebral',
    score: 70,
    description: 'Two Air signs in the same relationship create something cerebrally alive... the conversation runs constantly, the ideas multiply, and neither partner is trying to slow the other down. The mutual respect is intellectual first and the social life is easy and vibrant. What this pairing tends to underproduce is emotional depth. Both partners process through the mind, and feelings that resist that structure tend to get deferred.',
    communication: 'Effortless at the surface level. Both partners are natural talkers who enjoy debating, exploring ideas, and moving from topic to topic. The gap shows up around vulnerability... Air signs can talk about feelings at length without actually being inside them with someone else.',
    loveStyle: 'More companion than passionate by default... the bond runs through shared interests, mutual respect, and the pleasure of each other\'s company. Physical intimacy and emotional vulnerability require deliberate attention in this pairing, because neither comes as naturally as the next interesting idea.',
  },
  'Air+Water': {
    nature: 'misty',
    score: 45,
    description: 'Air speaks in logic. Water speaks in feeling. These aren\'t just different communication styles... they\'re different theories of how to know something is true. Air processes by articulating. Water processes by experiencing. The attraction is often genuine... each is drawn to what the other carries so effortlessly. The frustration is equally genuine, which is why many Air and Water pairs produce either excellent art or unresolvable misunderstanding.',
    communication: 'The central challenge. Air thinks out loud and expects the verbal exchange to be the connection. Water feels first and communicates that feeling indirectly, through tone and body and what isn\'t said. Air reads this as evasion. Water reads Air\'s directness as coldness. Both are mistaken about the other.',
    loveStyle: 'When the gap gets bridged, the combination produces something Air needs (emotional depth) and something Water needs (perspective and lightness). When it doesn\'t, Air feels emotionally drained by Water\'s intensity and Water feels emotionally starved by Air\'s detachment.',
  },
  'Water+Water': {
    nature: 'oceanic',
    score: 75,
    description: 'Two Water signs in the same relationship produce something deeply intuitive and emotionally consuming. The understanding between partners can be almost wordless... both sensing what the other carries before it\'s spoken. The emotional richness is real and rare. The risk is that two people who both feel everything and both need emotional safety can amplify each other\'s anxiety, and without grounding, the shared world becomes a closed loop of feeling.',
    communication: 'Often unspoken or running below the words. Water sign pairs read each other through tone, mood, and what the other is carrying. The danger is the assumption that you understand what isn\'t said... taking the emotional shorthand for telepathy, and mistaking it for communication when difficult things need to be named directly.',
    loveStyle: 'Profoundly intimate, devoted, and emotionally consuming. Water sign love doesn\'t do casual... it goes all the way in, and when both partners are grounded, the depth of the bond is genuinely rare. The dependency question is the one to watch. Two people who both need emotional security can either provide it for each other or compound each other\'s need for it.',
  },
}

export const MODALITY_COMPAT: Record<string, { dynamic: string; tension: string }> = {
  'Cardinal+Cardinal': {
    dynamic: 'Two partners who both lead, both initiate, and both expect to set the direction. When the goals align, this is a pairing that moves fast and builds real things together. When they don\'t, the same energy that makes this pairing effective turns into a permanent negotiation over who decides.',
    tension: 'The question is always who goes first. Cardinal signs need to take turns and neither is naturally inclined to volunteer for second. Treating compromise as a tool rather than a concession is the work.',
  },
  'Cardinal+Fixed': {
    dynamic: 'One partner starts things. The other sustains them. Cardinal brings the idea and the momentum. Fixed brings the follow-through and the refusal to quit when it gets hard. When this division of labor gets respected, the pairing covers a lot of ground.',
    tension: 'Cardinal sees Fixed as too slow to adapt. Fixed sees Cardinal as too quick to abandon what\'s working. The key is both partners understanding that starting and sustaining are equal contributions, not competing ones.',
  },
  'Cardinal+Mutable': {
    dynamic: 'Cardinal sets the direction and Mutable adjusts around it. This tends to be a smooth working dynamic... one partner leads and the other flexes, without much friction in the day to day.',
    tension: 'The risk is that Mutable eventually resents doing most of the adjusting. Cardinal should treat Mutable\'s input as genuinely useful, not just as the sound of someone going along.',
  },
  'Fixed+Fixed': {
    dynamic: 'Unwavering loyalty and an almost geological stability. Two Fixed signs build something that holds and hold it long after others would have let go. When they agree on the direction, the partnership is nearly unshakeable. When they don\'t, neither moves, and the standoff can outlast the relationship.',
    tension: 'Stubbornness is the defining challenge. Both partners need to treat flexibility as a form of strength rather than capitulation, because without it this pairing turns into two immovable objects trying to occupy the same space.',
  },
  'Fixed+Mutable': {
    dynamic: 'Fixed provides the anchor. Mutable provides the navigation. The partnership tends to have a stable center with enough flexibility to adapt to what comes. Each partner is doing what they do best.',
    tension: 'Fixed reads Mutable as unreliable. Mutable reads Fixed as rigid. Both are describing the same traits from opposite angles. The pairing works when each recognizes that what irritates them is also what the other contributes.',
  },
  'Mutable+Mutable': {
    dynamic: 'Two adaptable, low-control partners who can adjust to almost anything... including each other\'s changes. The relationship stays flexible and mentally alive, and neither partner feels trapped by the other\'s needs.',
    tension: 'Who makes the decision? Two Mutable signs can stay in perpetual motion without planting anything. Someone has to occasionally choose a direction and stick with it long enough to see what it produces.',
  },
}

export function getPairData(sign1: string, sign2: string): PairData | null {
  const key = pairKey(sign1, sign2)
  return PAIRS[key] ?? null
}

export const PAIRS: Record<string, PairData> = {
  // ─── Aries pairs ────────────────────────────────────────────
  'Aries+Aries': {
    summary: 'Two rams charging forward together ... thrilling, competitive, and occasionally combustible.',
    dynamic: 'Aries with Aries is pure acceleration. Both partners live in the present, act on instinct, and refuse to back down. The attraction is instant and intense ... you recognize your own fire in the other person. The challenge is that neither of you is naturally inclined to compromise, and two people who both need to go first will eventually collide.\n\nThis works best when you channel your shared competitive energy outward ... building something together, competing as a team, or pushing each other to grow rather than fighting for dominance within the relationship.',
    strengths: ['Mutual respect for each other\'s independence', 'Shared love of adventure and spontaneity', 'Neither holds grudges ... fights are intense but short', 'Both understand the other\'s need for space and autonomy'],
    challenges: ['Power struggles over who leads', 'Impatience with each other\'s flaws', 'Both avoid vulnerability, which can prevent deeper intimacy', 'Burnout from constant high energy without rest'],
    tip: 'Take turns leading ... and practice the radical act of letting someone else win.',
  },
  'Aries+Taurus': {
    summary: 'The pioneer meets the builder ... exhilarating friction between speed and steadiness.',
    dynamic: 'Aries wants to go. Taurus wants to stay. This is the fundamental tension ... and when it works, it produces a partnership where one person starts things and the other finishes them. Aries is drawn to Taurus\'s calm strength and sensuality; Taurus is drawn to Aries\'s courage and vitality.\n\nThe danger is mutual frustration: Aries sees Taurus as slow, Taurus sees Aries as reckless. The gift is balance ... Aries learns patience, Taurus learns to take risks.',
    strengths: ['Complementary strengths: initiation meets follow-through', 'Strong physical chemistry between Mars and Venus energy', 'Aries inspires Taurus to act; Taurus grounds Aries\'s impulses', 'Both are honest and direct in different ways'],
    challenges: ['Fundamentally different paces of life', 'Aries needs novelty; Taurus needs routine', 'Stubbornness meets impatience in conflicts', 'Aries may feel controlled; Taurus may feel destabilized'],
    tip: 'Aries: slow down occasionally. Taurus: speed up occasionally. Meet in the middle more often than you think you should.',
  },
  'Aries+Gemini': {
    summary: 'A fast-paced, mentally stimulating duo that thrives on novelty and never runs out of things to do.',
    dynamic: 'Aries and Gemini share a restless, forward-moving energy that makes life together feel like an ongoing adventure. Aries brings decisiveness and courage; Gemini brings wit and versatility. The conversation is electric, the laughter is constant, and boredom is almost impossible.\n\nThe challenge is depth. Both signs prefer action over reflection, and the relationship can stay on the surface if neither partner deliberately creates space for emotional vulnerability.',
    strengths: ['Endless mental stimulation and shared curiosity', 'Both adapt quickly and hate stagnation', 'A social powerhouse as a couple', 'Mutual respect for independence and freedom'],
    challenges: ['Neither naturally gravitates toward emotional depth', 'Can become scattered with too many shared projects', 'Gemini\'s changeability may frustrate Aries\'s directness', 'Risk of the relationship feeling more like friendship than romance'],
    tip: 'Schedule unstructured time together with no agenda ... that\'s where the deeper connection happens.',
  },
  'Aries+Cancer': {
    summary: 'The warrior and the nurturer ... a challenging but potentially transformative combination.',
    dynamic: 'Aries charges outward; Cancer turns inward. Aries protects through action; Cancer protects through care. These are two very different expressions of cardinal energy, and the square aspect between them creates friction that demands growth.\n\nThe attraction is often strong ... Cancer finds Aries\'s boldness exciting, and Aries finds Cancer\'s emotional depth magnetic. But living together requires Aries to slow down and consider feelings, and Cancer to speak up directly rather than retreating into a shell.',
    strengths: ['Both are fiercely protective of people they love', 'Aries can help Cancer face fears directly', 'Cancer teaches Aries the strength in vulnerability', 'Strong physical and emotional attraction when trust is built'],
    challenges: ['Aries\'s directness can wound Cancer\'s sensitivity', 'Cancer\'s moodiness can frustrate Aries\'s need for action', 'Different conflict styles: confrontation vs. withdrawal', 'Aries may feel emotionally smothered; Cancer may feel emotionally abandoned'],
    tip: 'Aries: her feelings are not obstacles to your goals. Cancer: his directness is not a lack of caring.',
  },
  'Aries+Leo': {
    summary: 'A bold, magnetic pairing of two Fire signs who inspire and admire each other.',
    dynamic: 'Aries and Leo are a natural match ... both are warm, confident, and driven by a need for self-expression. There is a mutual admiration here that fuels the relationship: Aries respects Leo\'s staying power, and Leo respects Aries\'s courage. Together they are a power couple who light up every room they enter.\n\nThe challenge is ego. Both signs need to feel special, and competition for the spotlight can turn admiration into rivalry if neither is willing to share center stage.',
    strengths: ['Genuine mutual admiration and respect', 'Shared enthusiasm for life and adventure', 'Strong physical and creative chemistry', 'Both are loyal and willing to fight for the relationship'],
    challenges: ['Competition for attention and dominance', 'Both can be proud and reluctant to apologize first', 'Drama can escalate quickly when egos collide', 'Neither is naturally attuned to subtlety or emotional nuance'],
    tip: 'You are on the same team. Celebrate each other\'s wins as enthusiastically as your own.',
  },
  'Aries+Virgo': {
    summary: 'The impulsive pioneer meets the careful analyst ... an unlikely pairing that grows through friction.',
    dynamic: 'Aries acts first and thinks later; Virgo thinks first and acts carefully. This creates a dynamic where Aries often feels slowed down by Virgo\'s caution, and Virgo often feels anxious about Aries\'s impulsiveness. The gift is that each partner offers what the other lacks.\n\nWhen this works, Aries brings courage and momentum to Virgo\'s perfectionism, and Virgo brings precision and follow-through to Aries\'s visions. It requires both partners to genuinely value what the other brings rather than seeing it as a flaw.',
    strengths: ['Complementary skills: vision + execution', 'Both are hard workers with strong drive', 'Virgo\'s attention to detail grounds Aries\'s big ideas', 'Aries helps Virgo take risks and loosen up'],
    challenges: ['Aries finds Virgo critical; Virgo finds Aries careless', 'Very different approaches to planning and decision-making', 'Aries may see Virgo as uptight; Virgo may see Aries as reckless', 'Communication styles clash: blunt vs. precise'],
    tip: 'Aries: listen to the details, they matter. Virgo: not everything needs to be perfect before you start.',
  },
  'Aries+Libra': {
    summary: 'Opposites on the zodiac wheel who are magnetically drawn to the qualities they lack in themselves.',
    dynamic: 'Aries and Libra sit across from each other in the zodiac, creating a classic opposition that is equal parts attraction and tension. Aries is about self; Libra is about other. Aries is direct; Libra is diplomatic. Aries acts alone; Libra seeks partnership. Each is fascinated by what the other represents.\n\nThe initial chemistry is often intense ... Aries finds Libra\'s grace irresistible, and Libra finds Aries\'s confidence thrilling. The long-term work is integration: learning to be both independent and partnered, both assertive and considerate.',
    strengths: ['Powerful magnetic attraction of opposites', 'Aries brings courage; Libra brings balance', 'Socially dynamic as a couple', 'Each helps the other develop their weaker qualities'],
    challenges: ['Aries may find Libra indecisive; Libra may find Aries selfish', 'Different conflict styles: confrontation vs. avoidance', 'Aries wants action; Libra wants consensus', 'Can project disowned qualities onto each other'],
    tip: 'The qualities you find most annoying in your partner are usually the ones you need to develop in yourself.',
  },
  'Aries+Scorpio': {
    summary: 'Two signs sharing a ruling planet ... an intense, passionate, and occasionally volcanic connection.',
    dynamic: 'Aries and Scorpio share a ruling planet (Mars) and a fundamental intensity that produces one of the more charged pairings in the zodiac. Both are bold, both are fighters, and neither is afraid of conflict. The attraction is often immediate and almost physical in its force.\n\nThe difference is depth. Aries lives on the surface of that Mars energy ... action, courage, directness. Scorpio lives in the underworld of it ... strategy, obsession, transformation. Aries may find Scorpio\'s intensity overwhelming, and Scorpio may find Aries\'s directness shallow.',
    strengths: ['Extraordinary passion and physical chemistry', 'Mutual respect for strength and courage', 'Both are fiercely loyal once committed', 'Transformative potential when both partners grow'],
    challenges: ['Power struggles can become destructive', 'Scorpio\'s need for control vs. Aries\'s need for freedom', 'Trust issues: Scorpio is suspicious, Aries is impatient with tests', 'Arguments can escalate to damaging levels'],
    tip: 'Channel your shared intensity into building something rather than tearing each other down.',
  },
  'Aries+Sagittarius': {
    summary: 'Two adventurers who share a love of freedom, honesty, and living life at full volume.',
    dynamic: 'Aries and Sagittarius share a natural compatibility that doesn\'t need much explanation... both are Fire signs who value freedom, adventure, and honesty. The energy between them is warm, optimistic, and forward-moving. They laugh together easily, share an appetite for new experiences, and give each other the space both need.\n\nThe challenge is commitment and depth. Both signs prefer action over introspection, and the relationship can become a perpetual adventure that never deepens into genuine intimacy.',
    strengths: ['Natural compatibility and easy chemistry', 'Shared love of travel, adventure, and growth', 'Both are honest and straightforward', 'Mutual respect for independence and personal freedom'],
    challenges: ['Both may avoid emotional vulnerability', 'Lack of grounding can make the relationship feel rootless', 'Neither is naturally domestic or detail-oriented', 'Can become too casual to develop lasting commitment'],
    tip: 'Adventure together is easy. The real adventure is staying still long enough to build something that lasts.',
  },
  'Aries+Capricorn': {
    summary: 'The sprinter meets the marathon runner ... friction between urgency and patience that builds strength.',
    dynamic: 'Aries and Capricorn are both cardinal signs with strong ambitions, but their methods could not be more different. Aries wants it now; Capricorn is willing to wait decades. Aries leads with instinct; Capricorn leads with strategy. This square aspect creates tension that either drives growth or drives both partners apart.\n\nWhen it works, this is a power couple who achieves extraordinary things: Aries provides the spark, Capricorn provides the plan. When it doesn\'t, Aries feels controlled and Capricorn feels exhausted.',
    strengths: ['Both are ambitious and driven', 'Complementary approaches: initiative + strategy', 'Mutual respect for each other\'s strength', 'Can build impressive things together when aligned'],
    challenges: ['Constant tension between speed and caution', 'Aries feels controlled by Capricorn\'s rules', 'Capricorn feels destabilized by Aries\'s impulsiveness', 'Different definitions of success and timing'],
    tip: 'You are building different floors of the same building. Respect each other\'s blueprints.',
  },
  'Aries+Aquarius': {
    summary: 'Independent spirits who connect through shared idealism and a refusal to follow the crowd.',
    dynamic: 'Aries and Aquarius are a sextile apart, creating a naturally cooperative energy. Both value independence, both resist authority, and both have a progressive streak that keeps the relationship feeling fresh. Aries admires Aquarius\'s originality; Aquarius admires Aries\'s boldness.\n\nThe connection is more mental and idealistic than emotional, which suits both signs fine. The challenge comes when Aries wants a more personal, passionate connection and Aquarius keeps things at arm\'s length.',
    strengths: ['Shared independence and respect for freedom', 'Intellectually stimulating conversations', 'Both enjoy being unconventional', 'Natural friendship foundation for romance'],
    challenges: ['Emotional intimacy may not develop naturally', 'Aries wants personal devotion; Aquarius is devoted to causes', 'Both can be stubborn in different ways', 'Aquarius\'s detachment may frustrate Aries\'s directness'],
    tip: 'You connect through ideas and ideals ... but don\'t forget to connect heart to heart, not just mind to mind.',
  },
  'Aries+Pisces': {
    summary: 'The warrior and the mystic ... a surprising attraction between two very different worlds.',
    dynamic: 'Aries and Pisces sit next to each other in the zodiac but inhabit completely different realities. Aries is the beginning of the cycle ... raw, direct, self-asserting. Pisces is the end of the cycle ... diffuse, intuitive, surrendering. Aries is drawn to Pisces\'s sensitivity and imagination; Pisces is drawn to Aries\'s strength and clarity.\n\nThis pairing has a protector-dreamer quality that can be deeply beautiful or deeply unbalanced, depending on whether both partners maintain their own center.',
    strengths: ['Aries provides strength that makes Pisces feel safe', 'Pisces provides emotional depth that softens Aries', 'Strong creative and imaginative chemistry', 'Each has what the other needs most'],
    challenges: ['Aries may overwhelm Pisces with directness', 'Pisces may confuse Aries with emotional complexity', 'Different energy levels and needs for stimulation', 'Risk of a rescuer-rescued dynamic that becomes unhealthy'],
    tip: 'Aries: gentleness is not weakness. Pisces: directness is not aggression. Teach each other.',
  },

  // ─── Taurus pairs ───────────────────────────────────────────
  'Taurus+Taurus': {
    summary: 'Double the loyalty, double the sensuality, double the stubbornness.',
    dynamic: 'Two Taurus partners create a stable, comfortable, and sensually rich relationship. Both value security, beauty, and the simple pleasures of life. You understand each other\'s rhythms intuitively, and the relationship feels like coming home.\n\nThe challenge is inertia. When two Fixed Earth signs settle in, they can become so comfortable that growth stops entirely. Without external motivation, this relationship can become a beautiful, furniture-and-all rut.',
    strengths: ['Deep mutual understanding and shared values', 'Extraordinary sensual and physical compatibility', 'Financial stability and shared practical goals', 'Unwavering loyalty and commitment'],
    challenges: ['Stubbornness makes conflicts nearly unresolvable', 'Resistance to change can stall personal growth', 'Possessiveness can become suffocating', 'Routine can replace romance over time'],
    tip: 'Schedule regular disruptions ... new restaurants, surprise trips, uncomfortable conversations. Comfort is your gift, but growth requires occasional discomfort.',
  },
  'Taurus+Gemini': {
    summary: 'The sensualist meets the intellectual ... a pairing that works best when curiosity flows both ways.',
    dynamic: 'Taurus lives through the body and the senses; Gemini lives through the mind and language. These are fundamentally different orientations, and the early attraction often comes from fascination with what the other has that you lack. Taurus is grounded in ways Gemini envies; Gemini is versatile in ways Taurus envies.\n\nThe challenge is keeping both partners engaged. Taurus craves consistency; Gemini craves variety. Neither is wrong, but someone has to stretch.',
    strengths: ['Each expands the other\'s world', 'Gemini lightens Taurus\'s heaviness', 'Taurus stabilizes Gemini\'s restlessness', 'Both ruled by inner planets, creating personal chemistry'],
    challenges: ['Taurus needs routine; Gemini needs novelty', 'Communication styles differ: deliberate vs. rapid', 'Taurus may feel Gemini is unreliable; Gemini may feel Taurus is boring', 'Different social needs and energy levels'],
    tip: 'Taurus: be curious about Gemini\'s world. Gemini: be present in Taurus\'s. Meet in sensory experience ... food, travel, art.',
  },
  'Taurus+Cancer': {
    summary: 'A nurturing, domestic pairing built on emotional and material security.',
    dynamic: 'Taurus and Cancer are a sextile apart and share a deep orientation toward home, comfort, and emotional safety. Both want to build a nest, both value loyalty above almost everything else, and both express love through care and presence rather than grand declarations. The pairing makes immediate sense... each partner is doing what the other needs without having to be asked.\n\nThe risk is insularity. Becoming so focused on your shared world that you lose connection with the larger one is a real pattern with this combination.',
    strengths: ['Deep emotional and physical compatibility', 'Shared values around home, family, and security', 'Both express love through acts of care', 'Intuitive understanding of each other\'s needs'],
    challenges: ['Can become too insular and codependent', 'Both avoid conflict, allowing resentment to build silently', 'Taurus\'s stubbornness meets Cancer\'s moodiness', 'May resist change even when it\'s needed'],
    tip: 'Your home is your sanctuary, but don\'t let it become your entire world. Grow outward together.',
  },
  'Taurus+Leo': {
    summary: 'Luxury meets royalty ... a glamorous but stubborn Fixed sign pairing.',
    dynamic: 'Taurus and Leo both love the finer things in life and share an appreciation for beauty, quality, and comfort. The attraction is often immediate ... Leo is drawn to Taurus\'s sensual confidence, and Taurus is drawn to Leo\'s warmth and generosity.\n\nBoth are Fixed signs, which means extraordinary loyalty but also extraordinary stubbornness. When these two disagree, neither budges. The relationship works when both feel genuinely valued and neither is expected to dim their light for the other.',
    strengths: ['Shared love of luxury, beauty, and quality', 'Strong loyalty and commitment from both sides', 'Warm, affectionate, and generous together', 'Both are dependable and take the relationship seriously'],
    challenges: ['Two Fixed signs: immovable in conflict', 'Leo needs attention; Taurus needs stability ... sometimes these conflict', 'Possessiveness from both partners', 'Financial disagreements if spending styles differ'],
    tip: 'Admire each other openly and often. Both of you need to feel valued, and neither of you asks for it easily.',
  },
  'Taurus+Virgo': {
    summary: 'Two Earth signs who build a practical, harmonious, and deeply reliable partnership.',
    dynamic: 'Taurus and Virgo are a trine apart ... the most harmonious aspect in astrology. Both are Earth signs who value practicality, reliability, and building things that work. The relationship is grounded, sensible, and quietly beautiful. There is a mutual respect here that grows stronger over time.\n\nThe challenge is that both signs can be so focused on getting things right that they forget to enjoy what they have. Virgo\'s perfectionism and Taurus\'s possessiveness are the two shadows to watch.',
    strengths: ['Natural harmony and shared Earth values', 'Excellent at building a stable, beautiful shared life', 'Both are reliable, loyal, and present', 'Complementary: Taurus provides calm, Virgo provides precision'],
    challenges: ['Can become overly practical and neglect romance', 'Virgo\'s criticism can wound Taurus\'s pride', 'Both may avoid emotional risk-taking', 'The relationship can feel more functional than passionate'],
    tip: 'You build a beautiful life together ... make sure you stop to enjoy it instead of always optimizing it.',
  },
  'Taurus+Libra': {
    summary: 'Two ruled by Venus signs who share a love of beauty, harmony, and relationship itself.',
    dynamic: 'Both Taurus and Libra are ruled by Venus, giving them a shared appreciation for beauty, art, pleasure, and partnership. The attraction is aesthetic and romantic ... these two know how to create a beautiful life together. Taurus brings sensuality; Libra brings elegance.\n\nThe tension is in how they express Venus energy. Taurus is physical and possessive; Libra is social and diplomatic. Taurus wants to own beauty; Libra wants to share it. Understanding this difference is key.',
    strengths: ['Shared Venus rulership creates aesthetic harmony', 'Both value partnership and are willing to invest in it', 'A visually and socially beautiful couple', 'Strong romantic and artistic compatibility'],
    challenges: ['Taurus\'s possessiveness clashes with Libra\'s social nature', 'Different expressions of love: physical vs. intellectual', 'Libra\'s indecisiveness frustrates Taurus\'s directness', 'Both may avoid conflict until it erupts'],
    tip: 'You both love beauty ... create it together. Art, cooking, decorating, travel. Your shared Venus is your superpower.',
  },
  'Taurus+Scorpio': {
    summary: 'The zodiac\'s most intense opposition ... magnetic, possessive, and transformative.',
    dynamic: 'Taurus and Scorpio are opposite signs, and their attraction is legendary. Both are Fixed signs obsessed with security ... Taurus through material stability, Scorpio through emotional control. The pull between them is almost gravitational. They see in each other the depth and intensity they crave.\n\nThis is an all-or-nothing pairing. When it works, the intimacy is unmatched ... deeply physical, deeply emotional, deeply committed. When it doesn\'t, possessiveness and power struggles can make it feel like a trap.',
    strengths: ['Extraordinary physical and emotional chemistry', 'Both are deeply loyal and committed', 'Mutual understanding of possessiveness and devotion', 'Transformative potential ... both partners are changed by this relationship'],
    challenges: ['Jealousy and possessiveness from both sides', 'Power struggles over control and trust', 'Both are stubborn and resist vulnerability', 'Can become obsessive or codependent'],
    tip: 'Trust is everything here. Build it slowly, protect it fiercely, and never weaponize each other\'s vulnerabilities.',
  },
  'Taurus+Sagittarius': {
    summary: 'The homebody meets the wanderer ... a challenging pairing that grows through stretching.',
    dynamic: 'Taurus wants roots; Sagittarius wants wings. This is one of the more challenging combinations because the fundamental desires are so different. Taurus is drawn to Sagittarius\'s optimism and adventurous spirit; Sagittarius is drawn to Taurus\'s sensuality and groundedness.\n\nFor this to work, Taurus must accept that Sagittarius will always need movement and freedom, and Sagittarius must accept that Taurus will always need stability and presence. Neither should try to change the other.',
    strengths: ['Each expands the other\'s comfort zone', 'Sagittarius brings adventure to Taurus\'s routine', 'Taurus brings grounding to Sagittarius\'s restlessness', 'Both are generous and warm'],
    challenges: ['Fundamentally different needs: stability vs. freedom', 'Taurus finds Sagittarius unreliable; Sagittarius finds Taurus confining', 'Different social and travel preferences', 'Long term commitment requires major compromise from both'],
    tip: 'Travel together. It gives Sagittarius the adventure they need and gives Taurus new sensory experiences to enjoy.',
  },
  'Taurus+Capricorn': {
    summary: 'Two Earth signs who build empires together with patience, ambition, and shared values.',
    dynamic: 'Taurus and Capricorn are a trine apart and share a genuine foundation of practicality, patience, and shared values. Both take life seriously, both value the work required to build something that lasts, and the respect between them runs deep... each recognizes in the other a partner who won\'t quit.\n\nThe challenge is rigidity. Two Earth signs can create a life that is impressively structured but emotionally constricted. Making room for play, spontaneity, and emotional expression keeps this partnership alive.',
    strengths: ['Solid foundation of shared values and goals', 'Excellent financial and professional partnership', 'Deep mutual respect and loyalty', 'Both take commitments seriously and follow through'],
    challenges: ['Can become all work and no play', 'Emotional expression doesn\'t come naturally to either', 'Risk of the relationship becoming transactional', 'Both resist vulnerability and may hide behind productivity'],
    tip: 'You build beautiful structures together. Make sure one of them is emotional intimacy, not just material success.',
  },
  'Taurus+Aquarius': {
    summary: 'The traditionalist meets the revolutionary ... a Fixed sign clash of values and worldviews.',
    dynamic: 'Taurus and Aquarius are both Fixed signs who do not budge easily, but they are fixed in completely different realities. Taurus is rooted in the physical, the personal, the traditional. Aquarius is oriented toward the intellectual, the collective, the progressive. The square between them creates real tension.\n\nThe attraction is often puzzling to both ... they don\'t understand why they\'re drawn to someone so different. But Fixed sign magnetism is real, and when these two commit, they commit absolutely.',
    strengths: ['Both are incredibly loyal once committed', 'Each challenges the other to grow in uncomfortable ways', 'Taurus grounds Aquarius; Aquarius expands Taurus', 'Strong determination from both partners'],
    challenges: ['Fundamentally different values and priorities', 'Stubbornness makes compromise extremely difficult', 'Taurus wants closeness; Aquarius wants space', 'Different definitions of security and freedom'],
    tip: 'Stop trying to convert each other. Appreciate that you see the world differently and let that be a source of richness, not conflict.',
  },
  'Taurus+Pisces': {
    summary: 'The sensualist meets the dreamer ... a gentle, romantic, and deeply nourishing pairing.',
    dynamic: 'Taurus and Pisces are a sextile apart and share a natural affinity for beauty, pleasure, and emotional connection. Taurus provides the physical grounding that Pisces craves; Pisces provides the imaginative depth that enriches Taurus\'s world. Together they create something soft, beautiful, and sustaining.\n\nThis is a tender pairing where both partners feel safe enough to be vulnerable. The challenge is practicality ... Pisces can drift and Taurus can become possessive when they sense their partner slipping away.',
    strengths: ['Deep emotional and sensual compatibility', 'Shared love of beauty, music, and art', 'Taurus provides stability for Pisces\'s sensitivity', 'Pisces enriches Taurus\'s inner world with imagination'],
    challenges: ['Pisces\'s escapist tendencies worry practical Taurus', 'Taurus\'s possessiveness can smother Pisces\'s fluidity', 'Both may avoid conflict until it becomes unavoidable', 'Different energy levels and approaches to daily life'],
    tip: 'Create beauty together ... art, music, cooking, gardening. Your shared Venus-Neptune connection is most alive when you are co-creating.',
  },

  // ─── Gemini pairs ───────────────────────────────────────────
  'Gemini+Gemini': {
    summary: 'Four personalities in one relationship ... endlessly entertaining and occasionally chaotic.',
    dynamic: 'Two Geminis together is a party that never stops. The conversation is brilliant, the social life is vibrant, and the intellectual stimulation is infinite. You finish each other\'s thoughts, change plans spontaneously, and keep each other endlessly entertained.\n\nThe challenge is grounding. With both partners constantly moving, thinking, and adapting, who anchors the relationship? Emotional depth and commitment require deliberate effort from both of you.',
    strengths: ['Unmatched mental chemistry and conversation', 'Shared love of variety and social connection', 'Neither tries to control the other', 'Playful, witty, and fun as a couple'],
    challenges: ['Emotional depth may never develop naturally', 'Both avoid difficult feelings', 'Commitment can feel abstract to two Mutable signs', 'Restlessness may lead to instability'],
    tip: 'Being interesting together is easy. Being intimate together takes courage. Have the hard conversations.',
  },
  'Gemini+Cancer': {
    summary: 'The communicator meets the feeler ... a pairing that grows when head and heart learn each other\'s language.',
    dynamic: 'Gemini processes life through the mind; Cancer processes life through emotions. These neighboring signs often struggle to understand each other\'s operating system. Gemini finds Cancer\'s moods unpredictable; Cancer finds Gemini\'s detachment cold.\n\nYet there is a complementary gift here: Gemini can help Cancer articulate feelings that would otherwise remain tangled, and Cancer can help Gemini access emotional depth they might otherwise avoid.',
    strengths: ['Gemini helps Cancer express what they feel', 'Cancer provides emotional depth Gemini needs', 'Both are adaptable in their own ways', 'Domestic life can be warm when Cancer leads at home'],
    challenges: ['Fundamentally different processing styles', 'Gemini\'s words can wound Cancer unintentionally', 'Cancer\'s need for emotional security may feel confining to Gemini', 'Social needs differ: gregarious vs. intimate'],
    tip: 'Gemini: feelings are not problems to solve. Cancer: words are not substitutes for emotional avoidance.',
  },
  'Gemini+Leo': {
    summary: 'The storyteller meets the star ... a bright, playful pairing that thrives on mutual admiration.',
    dynamic: 'Gemini and Leo bring out each other\'s most charming qualities. Leo loves an audience, and Gemini is the best audience in the zodiac ... curious, responsive, and genuinely entertained. Gemini loves someone who makes life feel exciting, and Leo delivers drama, warmth, and generosity in abundance.\n\nThis sextile pairing works because both partners make each other feel special in different ways: Leo through loyalty and warmth, Gemini through wit and attention.',
    strengths: ['Natural chemistry and playfulness', 'Both are socially dynamic and fun', 'Leo\'s warmth balances Gemini\'s detachment', 'Gemini\'s versatility keeps Leo entertained'],
    challenges: ['Leo needs consistent devotion; Gemini is naturally scattered', 'Gemini may not take Leo\'s need for admiration seriously enough', 'Both can be dramatic in conflicts', 'Fidelity requires conscious attention'],
    tip: 'Leo: don\'t take Gemini\'s distractibility personally. Gemini: Leo\'s need for attention is real ... honor it consistently.',
  },
  'Gemini+Virgo': {
    summary: 'Two ruled by Mercury minds that connect intellectually but diverge on details vs. big picture.',
    dynamic: 'Both ruled by Mercury, Gemini and Virgo share a love of information, analysis, and communication. But they use Mercury very differently: Gemini collects breadth, Virgo pursues depth. Gemini skims; Virgo scrutinizes. This creates a fascinating intellectual connection and a frustrating practical one.\n\nThe square between them generates productive tension when both partners respect the other\'s approach to knowledge.',
    strengths: ['Shared Mercury rulership: intellectual rapport', 'Both are analytical and enjoy learning', 'Strong verbal communication skills', 'Can collaborate effectively on projects'],
    challenges: ['Virgo finds Gemini superficial; Gemini finds Virgo nitpicky', 'Different standards for accuracy and follow-through', 'Both can overthink and under-feel', 'Criticism flows easily; praise does not'],
    tip: 'You are both right about different things. Gemini sees the forest; Virgo sees the trees. Both views are necessary.',
  },
  'Gemini+Libra': {
    summary: 'Two Air signs in perfect conversational flow ... a harmonious, socially brilliant pairing.',
    dynamic: 'Gemini and Libra are a trine apart and share the Air element\'s love of ideas, beauty, and social connection. The conversation between them is effortless, the attraction is easy, and life together feels light and pleasant. Both value fairness, communication, and mental stimulation.\n\nThe challenge is that two Air signs can float together without ever landing. Decisions go unmade, emotions go unprocessed, and the relationship stays pleasant but superficial.',
    strengths: ['Effortless communication and rapport', 'Both value fairness and partnership', 'Strong social life and intellectual connection', 'Harmony comes naturally to this pairing'],
    challenges: ['Both avoid confrontation, letting issues fester', 'Emotional depth requires deliberate effort', 'Indecisiveness multiplied by two', 'Can prioritize social life over private intimacy'],
    tip: 'You agree easily ... practice disagreeing constructively. That\'s where the real intimacy lives.',
  },
  'Gemini+Scorpio': {
    summary: 'Light meets shadow ... a challenging, fascinating pairing of surface and depth.',
    dynamic: 'Gemini skates across the surface of many topics; Scorpio dives to the bottom of a few. Gemini is transparent and changeable; Scorpio is secretive and fixed. The attraction is often intense ... each is fascinated by what they cannot be. Gemini is intrigued by Scorpio\'s mystery; Scorpio is captivated by Gemini\'s sparkle.\n\nThe long-term challenge is trust. Scorpio needs emotional certainty that Gemini struggles to provide, and Gemini needs freedom that Scorpio struggles to grant.',
    strengths: ['Intellectually fascinating to each other', 'Scorpio adds depth to Gemini\'s world', 'Gemini adds lightness to Scorpio\'s intensity', 'Strong physical attraction driven by curiosity'],
    challenges: ['Trust is the central issue: openness vs. secrecy', 'Gemini feels controlled; Scorpio feels insecure', 'Completely different emotional processing styles', 'Scorpio\'s jealousy clashes with Gemini\'s social nature'],
    tip: 'Gemini: Scorpio\'s intensity is not a cage ... it\'s devotion. Scorpio: Gemini\'s lightness is not betrayal ... it\'s nature.',
  },
  'Gemini+Sagittarius': {
    summary: 'Opposite signs who share a love of learning, travel, and the endless pursuit of what\'s next.',
    dynamic: 'Gemini and Sagittarius are the zodiac\'s axis of knowledge. Gemini gathers information; Sagittarius seeks meaning. Gemini asks "what?"; Sagittarius asks "why?" Together they cover the full spectrum of curiosity, and the conversations between them can last for hours without repetition.\n\nAs opposite signs, the attraction is strong, but so is the tension. Both need freedom, which is either their greatest gift to each other or the reason neither fully commits.',
    strengths: ['Unmatched intellectual compatibility', 'Shared love of travel and new experiences', 'Both value freedom and give it generously', 'Endlessly stimulating conversation'],
    challenges: ['Both may avoid settling down or committing fully', 'Sagittarius can be preachy; Gemini can be flippant', 'Neither is naturally grounded or domestic', 'Mutable instability: everything is always changing'],
    tip: 'You don\'t need to agree on the answers. You need to keep asking questions together.',
  },
  'Gemini+Capricorn': {
    summary: 'The butterfly meets the mountain ... a puzzling pairing that works when ambition aligns.',
    dynamic: 'Gemini and Capricorn seem like they should not work. Gemini is light, social, and constantly moving; Capricorn is serious, private, and goal-oriented. Yet there is often a surprising attraction: Gemini admires Capricorn\'s authority and accomplishment, and Capricorn is quietly charmed by Gemini\'s wit and social ease.\n\nThis pairing requires both partners to genuinely value what the other brings, rather than trying to mold them into a more compatible shape.',
    strengths: ['Capricorn provides structure Gemini secretly needs', 'Gemini provides levity Capricorn secretly craves', 'Strong intellectual respect when both are accomplished', 'Can be an effective professional partnership as well'],
    challenges: ['Very different social needs and energy levels', 'Capricorn finds Gemini unreliable; Gemini finds Capricorn rigid', 'Emotional expression is challenging for both', 'Different timelines: Gemini lives in the now, Capricorn plans decades ahead'],
    tip: 'Gemini: respect Capricorn\'s long game. Capricorn: enjoy Gemini\'s present moment. You need both timelines.',
  },
  'Gemini+Aquarius': {
    summary: 'Two Air signs who connect through ideas, independence, and a shared vision of the future.',
    dynamic: 'Gemini and Aquarius are a trine apart and share a naturally stimulating intellectual connection. Both are driven by ideas, both are socially aware, and both are allergic to convention in their own way. The conversations are alive, the friendship is genuine, and both partners tend to feel understood at a mental level they don\'t find everywhere.\n\nThe challenge, as with all Air and Air pairings, is emotional depth. Both signs process through the mind rather than the heart, and the relationship can become a wonderful friendship that lacks romantic heat.',
    strengths: ['Exceptional intellectual chemistry', 'Both value independence and give it freely', 'Shared progressive values and social consciousness', 'Friendship is the strong foundation of the romance'],
    challenges: ['Emotional intimacy requires deliberate effort', 'Both may intellectualize feelings rather than experiencing them', 'Can feel more like best friends than romantic partners', 'Commitment feels abstract to both'],
    tip: 'Your minds are perfectly matched. Now match your hearts. Vulnerability is the bridge between friendship and love.',
  },
  'Gemini+Pisces': {
    summary: 'Two Mutable signs who adapt to everything except each other\'s fundamental nature.',
    dynamic: 'Gemini and Pisces are both Mutable and both shape-shifters, but they shift in different dimensions. Gemini shifts mentally, adapting through words and ideas. Pisces shifts emotionally, adapting through feeling and intuition. The square between them creates a fundamental miscommunication: Gemini speaks in logic, Pisces speaks in poetry.\n\nWhen it works, there is a creative, imaginative quality to this pairing that produces art, music, and inspired collaboration. When it doesn\'t, both feel perpetually misunderstood.',
    strengths: ['Both are adaptable and open-minded', 'Strong creative and imaginative chemistry', 'Neither tries to dominate the other', 'Mutual fascination with different ways of knowing'],
    challenges: ['Fundamental communication mismatch: words vs. feelings', 'Gemini finds Pisces irrational; Pisces finds Gemini cold', 'Both avoid confrontation in different ways', 'Neither provides the structure the relationship needs'],
    tip: 'Learn each other\'s language. Gemini: listen to what Pisces means, not just what they say. Pisces: say what you mean, even when it\'s hard.',
  },

  // ─── Cancer pairs ───────────────────────────────────────────
  'Cancer+Cancer': {
    summary: 'A deeply intuitive, emotionally rich pairing that creates an unshakable home together.',
    dynamic: 'Two Cancers together create an emotional world so rich and layered that outsiders rarely see its full depth. You understand each other\'s moods, anticipate each other\'s needs, and create a home that is a genuine sanctuary from the world.\n\nThe risk is that two hypersensitive people can trigger each other\'s fears rather than soothing them. When both partners retreat into their shells simultaneously, communication stops and resentment builds in the silence.',
    strengths: ['Deep emotional understanding and empathy', 'Shared devotion to home and family', 'Intuitive communication that feels almost telepathic', 'Fierce mutual protectiveness'],
    challenges: ['Both avoid confrontation, creating unspoken resentment', 'Moodiness can create emotional whiplash', 'Codependency is a real risk', 'Both may cling to the past rather than growing forward'],
    tip: 'Your home is your strength. But sometimes you need to leave it, together, and face the world side by side.',
  },
  'Cancer+Leo': {
    summary: 'The nurturer meets the performer ... a warm, devoted pairing that thrives on mutual appreciation.',
    dynamic: 'Cancer and Leo sit next to each other in the zodiac and share a warmth that feels genuinely familial. Cancer nurtures; Leo protects. Cancer provides emotional depth; Leo provides confidence and joy. When this pairing clicks, Cancer feels safe enough to open up, and Leo feels loved enough to let down the royal guard.\n\nThe tension is between Cancer\'s need for emotional security and Leo\'s need for admiration. Both are giving, but they give different things and need different things in return.',
    strengths: ['Both are loyal, protective, and family-oriented', 'Cancer\'s care makes Leo feel genuinely loved', 'Leo\'s confidence makes Cancer feel safe', 'Warm, generous, and devoted to each other'],
    challenges: ['Leo needs praise; Cancer needs reassurance ... both must give what the other requires', 'Cancer\'s moodiness can dim Leo\'s sunshine', 'Leo\'s need for attention may trigger Cancer\'s insecurity', 'Different social needs: private vs. public'],
    tip: 'Leo: prioritize Cancer\'s feelings as much as you prioritize your own. Cancer: celebrate Leo\'s wins as loudly as they celebrate your stability.',
  },
  'Cancer+Virgo': {
    summary: 'A quietly devoted pairing that expresses love through acts of service and careful attention.',
    dynamic: 'Cancer and Virgo are a sextile apart and share an orientation toward care, service, and making life work for the people they love. Both are modest, both are detail-oriented in their own way, and both show love through doing rather than declaring.\n\nThis is a gentle pairing that grows stronger over time. The early stages may lack the fireworks of other combinations, but the foundation being built is remarkably solid.',
    strengths: ['Shared values of care, service, and devotion', 'Both show love through action rather than words', 'Complementary: Cancer provides emotional warmth, Virgo provides practical support', 'A stable, nurturing home environment'],
    challenges: ['Virgo\'s criticism can wound Cancer deeply', 'Both can worry and overthink', 'Neither is comfortable with grand romantic expression', 'Cancer\'s moodiness may frustrate Virgo\'s need for order'],
    tip: 'You both show love through service. Make sure you also tell each other how you feel. Words matter too.',
  },
  'Cancer+Libra': {
    summary: 'Two cardinal signs who both crave partnership but define it very differently.',
    dynamic: 'Cancer and Libra are both fundamentally oriented toward relationships, but they approach them from opposite angles. Cancer wants emotional depth, privacy, and unconditional love. Libra wants intellectual connection, social harmony, and aesthetic partnership. The square between them creates tension around what "closeness" means.\n\nWhen it works, Cancer provides the emotional anchor Libra secretly craves, and Libra provides the social grace and balance that helps Cancer engage with the world beyond home.',
    strengths: ['Both are devoted to partnership and willing to invest', 'Cancer brings emotional depth; Libra brings social elegance', 'Complementary domestic styles: cozy meets beautiful', 'Both dislike conflict and work to maintain harmony'],
    challenges: ['Different definitions of intimacy: emotional vs. intellectual', 'Cancer finds Libra superficial; Libra finds Cancer clingy', 'Conflict avoidance from both creates unresolved tension', 'Social needs differ: home vs. the world'],
    tip: 'You both want love to work. Define what that means together, rather than assuming you already agree.',
  },
  'Cancer+Scorpio': {
    summary: 'A deeply intuitive Water sign pairing with extraordinary emotional depth and intensity.',
    dynamic: 'Cancer and Scorpio share the Water element and a trine aspect, which produces a bond that runs deeper than most partnerships get. Both operate from emotional intuition, both value loyalty above almost everything, and both understand the unspoken currents that run beneath the surface of life.\n\nThe depth of this connection can be overwhelming for outsiders but feels like home to both partners. The risk is intensity without relief... both signs can get stuck in emotional patterns that feed on themselves.',
    strengths: ['Profound emotional and intuitive connection', 'Fierce mutual loyalty and protectiveness', 'Both understand the value of emotional depth', 'Strong physical and emotional intimacy'],
    challenges: ['Emotional intensity can become consuming', 'Both can be possessive and jealous', 'Power struggles beneath the surface', 'Neither forgives easily when trust is broken'],
    tip: 'Your depth is your superpower. But come up for air. Lightness and humor are not betrayals of your bond.',
  },
  'Cancer+Sagittarius': {
    summary: 'The homemaker meets the explorer ... a challenging pairing that expands both partners\' worlds.',
    dynamic: 'Cancer builds a home; Sagittarius leaves it. This fundamental difference creates the central tension of the pairing. Cancer craves emotional security and closeness; Sagittarius craves freedom and adventure. Yet there is often a genuine attraction ... Cancer finds Sagittarius\'s optimism uplifting, and Sagittarius finds Cancer\'s devotion deeply touching.\n\nThis works when both partners stretch: Cancer learning to trust that freedom is not abandonment, and Sagittarius learning that roots are not chains.',
    strengths: ['Each expands the other\'s world significantly', 'Cancer provides the emotional home base Sagittarius needs', 'Sagittarius brings joy and optimism to Cancer\'s emotional life', 'Both are generous and caring in different ways'],
    challenges: ['Fundamentally different needs: closeness vs. freedom', 'Cancer feels abandoned; Sagittarius feels trapped', 'Different approaches to family and tradition', 'Sagittarius\'s bluntness can deeply wound Cancer'],
    tip: 'Create a home that has room for adventure. Cancer: pack a bag sometimes. Sagittarius: come home and stay a while.',
  },
  'Cancer+Capricorn': {
    summary: 'The zodiac\'s parental axis ... opposite signs who create family and structure together.',
    dynamic: 'Cancer and Capricorn are opposite signs who represent the two sides of building a life: Cancer is the heart (home, family, emotional foundations) and Capricorn is the spine (career, structure, worldly achievement). The attraction is powerful because each has what the other needs.\n\nThis is a productive opposition when both partners own their side and respect the other\'s. What gets built is a life with both warmth and structure, both nurturing and ambition... the combination most partnerships are trying to approximate.',
    strengths: ['Complementary strengths: heart + ambition', 'Both take commitment and responsibility seriously', 'Strong shared values around family and legacy', 'Each becomes more complete through the other'],
    challenges: ['Cancer feels Capricorn is emotionally unavailable', 'Capricorn feels Cancer is too needy', 'Work-life balance is the constant negotiation', 'Both can be controlling in different ways'],
    tip: 'Cancer: Capricorn shows love through providing. Capricorn: Cancer shows love through feeling. Both are valid.',
  },
  'Cancer+Aquarius': {
    summary: 'The emotional intimate meets the intellectual detacher ... a pairing that requires real bridging.',
    dynamic: 'Cancer leads with the heart; Aquarius leads with the mind. Cancer wants personal, close, emotional connection; Aquarius wants universal, progressive, intellectual connection. This is one of the more challenging pairings because the basic orientation toward relationship is so different.\n\nYet there is a shared caring quality ... Cancer cares personally, Aquarius cares collectively. When they find common cause, the combination of heart and vision can accomplish remarkable things.',
    strengths: ['Both genuinely care about others, just differently', 'Aquarius broadens Cancer\'s worldview', 'Cancer deepens Aquarius\'s emotional life', 'Shared tenacity (cardinal + fixed = determined)'],
    challenges: ['Emotional language gap: feeling vs. thinking', 'Cancer needs closeness; Aquarius needs space', 'Cancer may feel Aquarius is cold; Aquarius may feel Cancer is clingy', 'Very different social needs and styles'],
    tip: 'Cancer: Aquarius loves differently, not less. Aquarius: Cancer\'s need for closeness is strength, not weakness.',
  },
  'Cancer+Pisces': {
    summary: 'Two Water signs who create an almost psychic emotional bond.',
    dynamic: 'Cancer and Pisces share the Water element and a trine aspect, which produces an intuitive connection that is almost wordless... both partners sense what the other needs before it\'s spoken. There is a gentleness in this pairing that runs all the way through.\n\nThe challenge is boundaries. Two Water signs can merge so completely that neither maintains a separate identity, and the shared emotional life can become an echo chamber of anxiety or sadness if external grounding is absent.',
    strengths: ['Deeply intuitive and empathic connection', 'Both are romantic, devoted, and emotionally generous', 'Shared love of art, music, and creative expression', 'A home life that feels emotionally rich and safe'],
    challenges: ['Codependency is a serious risk', 'Both absorb each other\'s moods, amplifying negativity', 'Lack of practical grounding', 'Neither is naturally assertive in conflict'],
    tip: 'Maintain separate friendships, hobbies, and identities. Your bond is stronger when each of you has a self to return to.',
  },

  // ─── Leo pairs ──────────────────────────────────────────────
  'Leo+Leo': {
    summary: 'Double the sunshine, double the drama, double the loyalty.',
    dynamic: 'Two Leos together create a relationship that is warm, generous, and larger than life. Both partners are loyal, creative, and devoted ... and both need to be the center of attention. The relationship works beautifully when both feel equally celebrated.\n\nThe challenge is that two suns in one solar system can create an orbit problem. Someone has to sometimes be the moon, and neither Leo volunteers naturally.',
    strengths: ['Extraordinary warmth, generosity, and loyalty', 'Both invest fully in the relationship', 'Creative, passionate, and fun as a couple', 'Fierce mutual protectiveness'],
    challenges: ['Competition for the spotlight', 'Both are proud and reluctant to admit fault', 'Drama can escalate when egos collide', 'Need for external validation may create jealousy'],
    tip: 'There is enough spotlight for both of you. Celebrate each other\'s shine ... it makes your shared light brighter.',
  },
  'Leo+Virgo': {
    summary: 'The performer meets the perfectionist ... neighboring signs who stretch each other.',
    dynamic: 'Leo is grand; Virgo is precise. Leo seeks applause; Virgo seeks improvement. These neighboring signs often struggle to understand each other\'s motivations, but the proximity creates a productive friction. Leo helps Virgo take center stage and own their gifts; Virgo helps Leo refine their vision and attend to details.\n\nThe relationship works when both partners see the other\'s strengths as complementary rather than competing.',
    strengths: ['Leo\'s confidence draws out Virgo\'s hidden talents', 'Virgo\'s precision polishes Leo\'s ideas', 'Both are hardworking and dedicated', 'Complementary skills: vision + execution'],
    challenges: ['Leo needs praise; Virgo gives criticism', 'Leo finds Virgo uptight; Virgo finds Leo excessive', 'Different social needs and energy levels', 'Leo\'s drama clashes with Virgo\'s modesty'],
    tip: 'Leo: Virgo\'s feedback is love, not attack. Virgo: Leo\'s need for praise is real, not vanity. Adjust accordingly.',
  },
  'Leo+Libra': {
    summary: 'A glamorous, socially radiant pairing that thrives on beauty, partnership, and admiration.',
    dynamic: 'Leo and Libra are a sextile apart and share a love of beauty, romance, and social life. Leo brings the creative fire; Libra brings the refined taste. Together they are a genuinely attractive pairing... enjoyable to be around and genuinely devoted to each other in ways that read as easy even when they\'re not.\n\nThe relationship flows because both partners naturally give what the other needs: Leo gives passion and decisiveness, Libra gives grace and partnership.',
    strengths: ['Natural romantic chemistry', 'Both are generous and socially skilled', 'Shared love of art, beauty, and culture', 'Leo decides, Libra harmonizes ... a smooth dynamic'],
    challenges: ['Both can prioritize appearances over substance', 'Libra\'s diplomacy may feel wishy-washy to direct Leo', 'Leo\'s dominance may quietly frustrate Libra over time', 'Conflict avoidance from Libra can create pressure'],
    tip: 'You create beautiful things together. Make sure the interior of the relationship is as beautiful as the exterior.',
  },
  'Leo+Scorpio': {
    summary: 'Two Fixed signs locked in a passionate, powerful, and potentially explosive connection.',
    dynamic: 'Leo and Scorpio are both Fixed signs and both fundamentally about power, but they express it differently. Leo\'s power is visible, warm, and openly claimed. Scorpio\'s power is hidden, intense, and strategically deployed. The attraction between them is magnetic ... both sense the other\'s strength.\n\nThe challenge is control. Neither yields easily, and the square aspect creates ongoing friction. When this pairing works, it produces extraordinary loyalty and depth. When it doesn\'t, it produces spectacular conflict.',
    strengths: ['Intense mutual attraction and chemistry', 'Both are deeply loyal once committed', 'Shared appreciation for depth and authenticity', 'Powerful creative and sexual connection'],
    challenges: ['Power struggles are the defining challenge', 'Leo needs openness; Scorpio needs privacy', 'Both are proud and take betrayal personally', 'Drama and intensity can become exhausting'],
    tip: 'You are both powerful. Use your power to build each other up, not to win arguments.',
  },
  'Leo+Sagittarius': {
    summary: 'Two Fire signs who ignite each other\'s joy, creativity, and love of life.',
    dynamic: 'Leo and Sagittarius are a trine apart and share the Fire element\'s enthusiasm, generosity, and love of life. Both partners are optimistic, adventurous, and genuinely fun to be around. The energy between them is warm and expansive, and the pairing requires less maintenance than most.\n\nThe challenge is staying grounded. Two Fire signs can inspire each other to overcommit, overspend, and overextend. Someone needs to occasionally play the responsible adult.',
    strengths: ['Natural harmony and mutual joy', 'Both are generous, warm, and loyal', 'Shared love of adventure, travel, and new experiences', 'Strong creative and physical chemistry'],
    challenges: ['Both can be excessive and impractical', 'Neither naturally handles logistics or details', 'Leo needs admiration; Sagittarius may be too honest', 'Can avoid serious issues in favor of fun'],
    tip: 'You are wonderful at celebrating life. Practice navigating difficulty together with the same enthusiasm.',
  },
  'Leo+Capricorn': {
    summary: 'The king meets the CEO ... a power pairing that works when status and warmth coexist.',
    dynamic: 'Leo and Capricorn are both ambitious and both seek recognition, but through different channels. Leo wants to be loved and admired for who they are; Capricorn wants to be respected for what they achieve. The attraction is often based on mutual admiration of each other\'s competence.\n\nThe challenge is warmth. Capricorn\'s reserve can make Leo feel unappreciated, and Leo\'s need for constant affirmation can make Capricorn feel exhausted.',
    strengths: ['Both are ambitious and take life seriously', 'Mutual respect for achievement and dedication', 'Strong public presence as a couple', 'Both value loyalty and commitment'],
    challenges: ['Leo needs warmth; Capricorn gives respect ... different currencies', 'Leo finds Capricorn cold; Capricorn finds Leo needy', 'Different definitions of success and recognition', 'Both can be controlling in different ways'],
    tip: 'Capricorn: warmth is not weakness. Leo: patience is not coldness. Speak each other\'s love language.',
  },
  'Leo+Aquarius': {
    summary: 'Opposite signs on the self-vs-collective axis ... magnetic, challenging, and evolutionarily significant.',
    dynamic: 'Leo and Aquarius sit across from each other in the zodiac, representing the individual and the group. Leo is personal, warm, and centered on self-expression; Aquarius is impersonal, intellectual, and centered on collective progress. The attraction is powerful because each has what the other needs.\n\nThis opposition works when Leo learns that being part of something bigger doesn\'t diminish their light, and Aquarius learns that personal warmth doesn\'t compromise their ideals.',
    strengths: ['Powerful magnetic attraction of opposites', 'Both are creative and original', 'Leo brings heart; Aquarius brings vision', 'Each challenges the other to grow beyond their comfort zone'],
    challenges: ['Leo wants personal devotion; Aquarius wants universal connection', 'Aquarius\'s detachment hurts Leo; Leo\'s drama overwhelms Aquarius', 'Fixed sign stubbornness on both sides', 'Different social styles: center stage vs. behind the scenes'],
    tip: 'You need each other. Leo reminds Aquarius to love one person deeply. Aquarius reminds Leo to care about more than themselves.',
  },
  'Leo+Pisces': {
    summary: 'The performer meets the dreamer ... a creative, romantic pairing that requires careful handling.',
    dynamic: 'Leo and Pisces share a creative, romantic sensibility but express it very differently. Leo creates through self-expression and performance; Pisces creates through imagination and surrender. Leo is bold; Pisces is subtle. The attraction is often based on each partner seeing in the other a creative quality they admire.\n\nThe challenge is that Leo\'s directness can overwhelm Pisces\'s sensitivity, and Pisces\'s elusiveness can frustrate Leo\'s need for clarity and admiration.',
    strengths: ['Strong creative and romantic chemistry', 'Both are generous and caring', 'Pisces genuinely admires Leo, which Leo thrives on', 'Leo provides strength that Pisces needs'],
    challenges: ['Leo\'s volume can drown out Pisces\'s subtlety', 'Pisces may withdraw rather than confront Leo', 'Different energy levels and social needs', 'Leo may not understand Pisces\'s emotional complexity'],
    tip: 'Leo: turn the volume down sometimes and listen. Pisces: turn the volume up sometimes and be heard.',
  },

  // ─── Virgo pairs ────────────────────────────────────────────
  'Virgo+Virgo': {
    summary: 'Two perfectionists who build an impeccably organized life ... if they can stop critiquing each other.',
    dynamic: 'Two Virgos share an attention to detail, a work ethic, and a desire for improvement that can produce a highly functional partnership. You understand each other\'s need for order, appreciate each other\'s competence, and share practical values.\n\nThe danger is mutual criticism. When two Virgos turn their analytical lens on each other, nothing is ever good enough. Learning to praise as readily as you critique is the central work of this pairing.',
    strengths: ['Shared values of service, health, and practicality', 'Highly organized and efficient together', 'Deep intellectual connection', 'Both are loyal and committed'],
    challenges: ['Double the criticism, double the anxiety', 'Perfectionism can prevent relaxation or joy', 'Neither is naturally romantic or spontaneous', 'Emotional expression is difficult for both'],
    tip: 'For every criticism, offer two genuine compliments. You both hear the negative louder than the positive.',
  },
  'Virgo+Libra': {
    summary: 'Neighboring signs who share refinement but differ on details vs. aesthetics.',
    dynamic: 'Virgo and Libra are both civilized, considerate, and oriented toward doing things well. Virgo does things correctly; Libra does things beautifully. There is a shared appreciation for quality that creates a pleasant, well run life together.\n\nThe tension is that Virgo is critical and practical while Libra is diplomatic and idealistic. Virgo focuses on what needs fixing; Libra focuses on what needs balancing.',
    strengths: ['Both value quality, manners, and refinement', 'Complementary: practical competence + aesthetic vision', 'Shared dislike of chaos and vulgarity', 'Both are considerate partners'],
    challenges: ['Virgo\'s criticism clashes with Libra\'s need for harmony', 'Different priorities: function vs. form', 'Both avoid direct confrontation in different ways', 'Can feel more like colleagues than lovers'],
    tip: 'You both want things to be right. Combine your standards instead of competing over whose definition of right is correct.',
  },
  'Virgo+Scorpio': {
    summary: 'A quietly intense, deeply perceptive pairing that sees beneath the surface of everything.',
    dynamic: 'Virgo and Scorpio are a sextile apart and share an intensity of focus that others often miss. Both are analytical, both are private, and both are drawn to understanding how things really work beneath the surface. The connection between them is often quiet but profoundly deep.\n\nThis pairing grows slowly and strengthens over time. Neither partner rushes into trust, and once it is built, it is nearly unbreakable.',
    strengths: ['Deep intellectual and emotional connection', 'Both are perceptive and value authenticity', 'Shared intensity and dedication', 'Trust, once built, is extraordinary'],
    challenges: ['Both can be secretive and slow to open up', 'Virgo\'s criticism meets Scorpio\'s sensitivity about being judged', 'Power dynamics can become subtle but significant', 'Neither forgives easily'],
    tip: 'You are both more vulnerable than you let on. Let each other see it. That\'s where the real bond forms.',
  },
  'Virgo+Sagittarius': {
    summary: 'The analyst meets the philosopher ... a Mutable sign pairing that grows through expanding perspectives.',
    dynamic: 'Virgo focuses on the details; Sagittarius focuses on the big picture. Virgo wants to get it right; Sagittarius wants to get the meaning. The square between them creates productive friction: Virgo keeps Sagittarius honest, and Sagittarius keeps Virgo from getting lost in the weeds.\n\nThis pairing is more intellectually compatible than it first appears ... both are Mutable signs who love learning and discussing ideas.',
    strengths: ['Both are lifelong learners', 'Complementary perspectives: detail + meaning', 'Mutable flexibility keeps the relationship adapting', 'Strong intellectual rapport'],
    challenges: ['Virgo finds Sagittarius careless; Sagittarius finds Virgo uptight', 'Different approaches to risk and planning', 'Sagittarius\'s bluntness hurts Virgo\'s sensitivity', 'Lifestyle differences: modest vs. expansive'],
    tip: 'You are both seekers. Virgo seeks precision; Sagittarius seeks truth. Respect each other\'s quest.',
  },
  'Virgo+Capricorn': {
    summary: 'Two Earth signs who build a masterfully organized, deeply reliable, quietly powerful life together.',
    dynamic: 'Virgo and Capricorn are a trine apart and share the Earth element\'s dedication to competence, structure, and tangible results. Both partners value hard work, respect each other\'s standards, and build with patience and precision. The respect that develops between them is genuine and grows stronger over time.\n\nThe challenge is softness. Two Earth signs can create a life that runs smoothly but lacks warmth, romance, and emotional expression.',
    strengths: ['Solid foundation of shared values', 'Both are hardworking, reliable, and competent', 'Excellent financial and professional partnership', 'Deep mutual respect that grows over time'],
    challenges: ['Emotional expression is difficult for both', 'Can become all work and no play', 'Neither prioritizes romance naturally', 'Risk of the relationship becoming functional but dry'],
    tip: 'Schedule romance with the same discipline you apply to everything else. Date nights, surprises, and emotional check-ins are not optional.',
  },
  'Virgo+Aquarius': {
    summary: 'Two intellectual signs who connect through ideas but operate from very different systems.',
    dynamic: 'Virgo and Aquarius are both cerebral and both interested in improving things, but their methods diverge sharply. Virgo improves through careful, incremental analysis; Aquarius improves through radical reimagining. Virgo works within systems; Aquarius reinvents them.\n\nThe attraction is often intellectual ... both are interested in how things work and both have unconventional minds. The challenge is daily life, where Virgo\'s routines clash with Aquarius\'s unpredictability.',
    strengths: ['Both are intellectually curious and analytical', 'Shared interest in improvement and innovation', 'Neither is emotionally demanding', 'Can collaborate effectively on projects'],
    challenges: ['Virgo needs routine; Aquarius needs unpredictability', 'Emotional connection may remain superficial', 'Virgo finds Aquarius impractical; Aquarius finds Virgo rigid', 'Different social styles and needs'],
    tip: 'You both want to make things better. Find a shared project or cause and let that be the bridge between your different approaches.',
  },
  'Virgo+Pisces': {
    summary: 'Opposite signs who represent analysis and intuition ... a pairing that heals through integration.',
    dynamic: 'Virgo and Pisces are opposite signs on the service axis. Virgo serves through practical, tangible action; Pisces serves through compassion, imagination, and emotional attunement. Each has what the other lacks, and the attraction is often deeply felt even when it\'s hard to explain logically.\n\nThis is a pairing with enormous healing potential. Virgo helps Pisces ground their dreams in reality; Pisces helps Virgo access the spiritual and emotional dimensions of life that pure analysis cannot reach.',
    strengths: ['Powerful complementary strengths', 'Both are oriented toward service and helping others', 'Virgo grounds Pisces; Pisces softens Virgo', 'Deep mutual fascination and respect'],
    challenges: ['Virgo finds Pisces impractical; Pisces finds Virgo critical', 'Different processing styles: analytical vs. intuitive', 'Pisces may escape into fantasy when Virgo gets critical', 'Virgo may dismiss Pisces\'s feelings as irrational'],
    tip: 'You are two halves of a whole. Virgo: not everything needs to be analyzed to be real. Pisces: not everything needs to be felt to be true.',
  },

  // ─── Libra pairs ────────────────────────────────────────────
  'Libra+Libra': {
    summary: 'Two diplomats who create a beautiful, balanced partnership ... if someone can make a decision.',
    dynamic: 'Two Libras together create a relationship that is aesthetically beautiful, socially graceful, and fundamentally harmonious. Both partners are considerate, fair-minded, and deeply oriented toward partnership. You share a love of beauty, culture, and intellectual conversation.\n\nThe challenge is decision-making and confrontation. Two people pleasers in one relationship can create a beautifully maintained surface with unaddressed tension underneath.',
    strengths: ['Shared values of fairness, beauty, and partnership', 'Socially brilliant as a couple', 'Both are considerate and willing to compromise', 'Strong aesthetic and intellectual connection'],
    challenges: ['Indecisiveness doubled', 'Conflict avoidance prevents real resolution', 'Both may prioritize harmony over honesty', 'Passive-aggression when true feelings go unexpressed'],
    tip: 'Practice respectful disagreement. The relationship will be stronger for it, not weaker.',
  },
  'Libra+Scorpio': {
    summary: 'The diplomat meets the detective ... a pairing that combines surface grace with hidden depth.',
    dynamic: 'Libra and Scorpio are neighboring signs with very different approaches to relationship. Libra values harmony, balance, and social grace; Scorpio values authenticity, intensity, and emotional truth. Libra operates on the surface; Scorpio operates underneath it.\n\nThe attraction is often powerful ... Libra is intrigued by Scorpio\'s depth, and Scorpio appreciates Libra\'s elegance. The long-term challenge is that Libra may find Scorpio\'s intensity exhausting, and Scorpio may find Libra\'s diplomacy dishonest.',
    strengths: ['Both value commitment and partnership', 'Libra brings social grace; Scorpio brings emotional depth', 'Strong romantic and sexual chemistry', 'Both are strategically intelligent'],
    challenges: ['Libra avoids conflict; Scorpio seeks it', 'Scorpio may see Libra as superficial; Libra may see Scorpio as intense', 'Trust styles differ: openness vs. guardedness', 'Power dynamics can become complicated'],
    tip: 'Libra: Scorpio\'s intensity is not aggression ... it\'s intimacy. Scorpio: Libra\'s diplomacy is not dishonesty ... it\'s care.',
  },
  'Libra+Sagittarius': {
    summary: 'A bright, optimistic pairing that thrives on shared culture, travel, and intellectual exploration.',
    dynamic: 'Libra and Sagittarius are a sextile apart and share a love of culture, beauty, and philosophical conversation. Both are socially oriented, both are optimistic, and both value fairness and justice, though they express these values differently.\n\nThis is a light, enjoyable pairing that works well as long as both partners invest in emotional depth beyond the pleasant surface.',
    strengths: ['Natural rapport and shared interests', 'Both love travel, culture, and intellectual conversation', 'Optimistic and future-oriented together', 'Mutual respect for independence'],
    challenges: ['Neither gravitates toward emotional heaviness', 'Sagittarius\'s bluntness can upset Libra\'s need for tact', 'Commitment may feel casual rather than deep', 'Both may avoid difficult conversations'],
    tip: 'You enjoy life beautifully together. Make sure you also navigate hardship together ... that\'s what makes it real.',
  },
  'Libra+Capricorn': {
    summary: 'The socialite meets the strategist ... a cardinal sign pairing that builds toward status and legacy.',
    dynamic: 'Libra and Capricorn are both cardinal signs with strong social awareness, but they express it differently. Libra seeks social harmony and partnership; Capricorn seeks social standing and achievement. The square between them creates tension, but also respect ... each sees the other\'s competence.\n\nThis pairing works well in professional and social contexts and must work harder to develop private emotional intimacy.',
    strengths: ['Both are socially aware and ambitious', 'Strong public presence as a couple', 'Shared interest in culture, achievement, and reputation', 'Both take partnerships seriously'],
    challenges: ['Capricorn finds Libra indecisive; Libra finds Capricorn cold', 'Different emotional needs: warmth vs. structure', 'The relationship can feel more strategic than romantic', 'Both may avoid emotional vulnerability'],
    tip: 'You look great together. Make sure you feel great together too. Private intimacy matters more than public image.',
  },
  'Libra+Aquarius': {
    summary: 'Two Air signs who connect through ideas, social justice, and a shared vision of fairness.',
    dynamic: 'Libra and Aquarius are a trine apart and share the Air element\'s love of ideas, justice, and social connection. Both care about fairness, both are intellectually curious, and both value independence within partnership. The conversation between them is stimulating and the friendship is genuine.\n\nThis is a natural pairing that flows easily. The challenge, as with all Air and Air combinations, is developing emotional depth and physical intimacy beyond the mental connection.',
    strengths: ['Strong intellectual chemistry and shared values', 'Both value fairness, equality, and independence', 'Excellent social and creative partnership', 'Mutual respect for each other\'s individuality'],
    challenges: ['Emotional intimacy may remain underdeveloped', 'Both can be detached when feelings get intense', 'Indecisiveness combined with stubbornness', 'May feel more like best friends than passionate lovers'],
    tip: 'Your minds are matched. Now match your hearts. Regular emotional check-ins turn a great friendship into a great love.',
  },
  'Libra+Pisces': {
    summary: 'Two romantics who idealize love ... and must learn to love what\'s real, not just what\'s beautiful.',
    dynamic: 'Libra and Pisces are both deeply romantic and both crave a love that feels like art. Libra approaches romance through beauty and balance; Pisces approaches it through feeling and surrender. Together they can create something genuinely magical ... but the magic requires grounding to survive.\n\nBoth signs tend to idealize partners and relationships, which creates a beautiful beginning and a potentially disillusioning middle when reality sets in.',
    strengths: ['Both are romantic, gentle, and relationship-oriented', 'Shared love of art, music, and beauty', 'Complementary: Libra brings elegance, Pisces brings depth', 'Both are compassionate and considerate'],
    challenges: ['Both may idealize the relationship rather than seeing it clearly', 'Conflict avoidance from both sides', 'Neither is naturally practical or decisive', 'Boundaries can become blurred'],
    tip: 'Love the real person, not the ideal. The real version is more interesting and more worthy of your devotion.',
  },

  // ─── Scorpio pairs ──────────────────────────────────────────
  'Scorpio+Scorpio': {
    summary: 'The most intense pairing in the zodiac ... transformative, consuming, and unforgettable.',
    dynamic: 'Two Scorpios together create a connection so intense that it changes both people permanently. You understand each other\'s depth, honor each other\'s need for privacy, and share a capacity for intimacy that most people never achieve. The loyalty between you is absolute.\n\nThe risk is equally absolute. Two Fixed Water signs who both need control, both guard secrets, and both carry grudges can create a dynamic that is more power struggle than partnership.',
    strengths: ['Unmatched emotional and physical intimacy', 'Absolute loyalty and commitment', 'Deep mutual understanding and respect', 'Transformative growth potential'],
    challenges: ['Power struggles can become all-consuming', 'Jealousy and possessiveness amplified', 'Neither forgives or forgets easily', 'Intensity without relief can become toxic'],
    tip: 'You have the depth. Work on the lightness. Laughter, play, and forgiveness are not betrayals of your intensity.',
  },
  'Scorpio+Sagittarius': {
    summary: 'Depth meets breadth ... a challenging neighboring sign pairing that grows through stretching.',
    dynamic: 'Scorpio goes deep; Sagittarius goes wide. Scorpio guards boundaries; Sagittarius crosses them. These neighboring signs often struggle because Scorpio\'s need for emotional control meets Sagittarius\'s need for absolute freedom. Yet there is a shared honesty that creates respect.\n\nWhen both partners are mature, Scorpio\'s depth gives Sagittarius something worth committing to, and Sagittarius\'s optimism gives Scorpio something worth opening up for.',
    strengths: ['Both are honest and direct in their own ways', 'Scorpio adds depth to Sagittarius\'s journey', 'Sagittarius adds lightness to Scorpio\'s intensity', 'Strong physical attraction'],
    challenges: ['Trust is the central issue: control vs. freedom', 'Scorpio feels threatened by Sagittarius\'s independence', 'Sagittarius feels suffocated by Scorpio\'s intensity', 'Different emotional needs: depth vs. space'],
    tip: 'Scorpio: Sagittarius\'s freedom is not betrayal. Sagittarius: Scorpio\'s intensity is not possession. Both are forms of love.',
  },
  'Scorpio+Capricorn': {
    summary: 'Two powerhouses who build empires together through determination and strategic depth.',
    dynamic: 'Scorpio and Capricorn are a sextile apart and share an intensity, ambition, and willingness to do what others cannot. Both are private, both are strategic, and both play the long game. The respect between them is genuine and deep ... each sees in the other a rare seriousness of purpose.\n\nThis is a quietly powerful pairing. Neither needs the spotlight, and both prefer to operate behind the scenes. The relationship may not look dramatic from the outside, but the bond is steel.',
    strengths: ['Deep mutual respect and shared ambition', 'Both are loyal, private, and strategic', 'Excellent at long term planning and execution', 'Trust builds slowly but becomes unshakeable'],
    challenges: ['Both can be emotionally guarded', 'Power dynamics may go unspoken but not unfelt', 'The relationship can become too serious and lack play', 'Neither yields easily in disagreements'],
    tip: 'Your power together is immense. Make sure it serves your life together, not just your separate ambitions.',
  },
  'Scorpio+Aquarius': {
    summary: 'Two Fixed signs who are both obsessive, both stubborn, and both fascinated by the other\'s mystery.',
    dynamic: 'Scorpio and Aquarius are both Fixed signs drawn to understanding what lies beneath the surface, but they approach it from opposite directions. Scorpio investigates emotions and psychology; Aquarius investigates systems and ideas. The square between them creates intense friction and intense fascination.\n\nThis is a pairing that either produces extraordinary growth or extraordinary frustration, with little in between.',
    strengths: ['Both are deeply committed once invested', 'Intellectual and emotional fascination', 'Neither is afraid of unconventional approaches', 'Strong mutual curiosity and respect for intelligence'],
    challenges: ['Scorpio needs emotional intimacy; Aquarius needs intellectual freedom', 'Both are extremely stubborn', 'Scorpio finds Aquarius detached; Aquarius finds Scorpio possessive', 'Power struggles over control and independence'],
    tip: 'You are both fixed in your ways. The relationship works when you are fixed in your commitment to each other, not fixed in being right.',
  },
  'Scorpio+Pisces': {
    summary: 'Two Water signs who create a profound, almost mystical bond of emotional and spiritual depth.',
    dynamic: 'Scorpio and Pisces are a trine apart and share the Water element\'s emotional depth, intuitive perception, and need for meaningful connection. Both partners tend to feel understood here at a level that\'s hard to find elsewhere... the resonance between them runs below the words.\n\nScorpio provides the strength and protection that Pisces needs; Pisces provides the unconditional acceptance that Scorpio craves. When both are in a grounded place, this connection is genuinely healing.',
    strengths: ['Extraordinary emotional and spiritual connection', 'Both are deeply intuitive and empathic', 'Scorpio protects Pisces; Pisces softens Scorpio', 'Strong creative and romantic chemistry'],
    challenges: ['Emotional intensity can become consuming', 'Both may enable each other\'s avoidance patterns', 'Scorpio\'s control instinct can overwhelm Pisces\'s need to flow', 'Boundaries may dissolve entirely'],
    tip: 'Your connection is deep and real. Protect it by maintaining individual identities and healthy boundaries.',
  },

  // ─── Sagittarius pairs ──────────────────────────────────────
  'Sagittarius+Sagittarius': {
    summary: 'Two adventurers who explore the world together ... if they can commit to exploring each other.',
    dynamic: 'Two Sagittarians together create a life of perpetual adventure, philosophical debate, and infectious optimism. You share a love of freedom, learning, and experiencing everything the world has to offer. The laughter is constant and the energy is boundless.\n\nThe challenge is depth and commitment. Both partners value freedom so highly that settling down and doing the hard work of intimacy can feel like a threat to the adventure.',
    strengths: ['Shared love of travel, learning, and growth', 'Both are optimistic and future-oriented', 'Mutual respect for independence', 'Endlessly fun and energizing together'],
    challenges: ['Neither naturally gravitates toward commitment', 'Both avoid emotional heaviness', 'Can become perpetual travelers who never build a home', 'Honesty can become bluntness that wounds'],
    tip: 'The greatest adventure is not out there ... it is the person sitting next to you. Go deep, not just wide.',
  },
  'Sagittarius+Capricorn': {
    summary: 'The optimist meets the realist ... neighboring signs who grow through productive tension.',
    dynamic: 'Sagittarius sees the best-case scenario; Capricorn plans for the worst case. Sagittarius takes risks; Capricorn calculates them. These neighboring signs often frustrate each other because their timelines and risk tolerances are so different.\n\nYet there is a complementary strength here: Sagittarius provides the vision and enthusiasm that Capricorn\'s careful plans need, and Capricorn provides the structure that turns Sagittarius\'s dreams into reality.',
    strengths: ['Complementary: vision + execution', 'Both are ambitious in different ways', 'Sagittarius lightens Capricorn; Capricorn grounds Sagittarius', 'Shared respect for honesty and integrity'],
    challenges: ['Different risk tolerances and timelines', 'Sagittarius finds Capricorn pessimistic; Capricorn finds Sagittarius naive', 'Social and lifestyle differences', 'Different approaches to money and security'],
    tip: 'Sagittarius: Capricorn\'s caution is not fear. Capricorn: Sagittarius\'s optimism is not irresponsibility. Combine both.',
  },
  'Sagittarius+Aquarius': {
    summary: 'Two independent thinkers who share a love of freedom, ideas, and making the world better.',
    dynamic: 'Sagittarius and Aquarius are a sextile apart and share a progressive, freedom-loving, intellectually driven orientation. Both care about the future, both resist convention, and both need significant independence within relationship. The friendship between them is genuine and easy.\n\nThis pairing works well because both partners understand and respect each other\'s need for space. The challenge is developing the emotional intimacy that sustains romance beyond friendship.',
    strengths: ['Strong intellectual chemistry and shared ideals', 'Both value freedom and give it generously', 'Shared interest in social justice and progress', 'Fun, adventurous, and unconventional together'],
    challenges: ['Emotional depth requires deliberate effort', 'Both may avoid commitment or settling down', 'Can feel more like philosophical allies than romantic partners', 'Neither provides grounding or domesticity'],
    tip: 'You share a vision of the future. Make sure that future includes emotional intimacy, not just intellectual alignment.',
  },
  'Sagittarius+Pisces': {
    summary: 'Two Mutable signs ruled by Jupiter who share idealism but express it through different dimensions.',
    dynamic: 'Sagittarius and Pisces are both ruled by Jupiter (traditionally) and both oriented toward meaning, faith, and transcendence. Sagittarius seeks meaning through philosophy, travel, and external exploration; Pisces seeks it through imagination, spirituality, and internal exploration. The square between them creates friction around method but not motivation.\n\nWhen it works, this pairing produces a deeply creative, spiritually rich connection. When it doesn\'t, Sagittarius finds Pisces too sensitive and Pisces finds Sagittarius too blunt.',
    strengths: ['Shared Jupiterian expansiveness and idealism', 'Both are creative, imaginative, and open-minded', 'Strong spiritual and philosophical connection', 'Neither is materialistic or controlling'],
    challenges: ['Sagittarius\'s bluntness wounds Pisces\'s sensitivity', 'Pisces\'s emotionality overwhelms Sagittarius\'s lightness', 'Both can be escapist in different ways', 'Neither provides practical grounding'],
    tip: 'You both seek meaning. Sagittarius finds it in truth; Pisces finds it in beauty. Honor both paths.',
  },

  // ─── Capricorn pairs ────────────────────────────────────────
  'Capricorn+Capricorn': {
    summary: 'Two architects building a fortress together ... impressively structured but in need of warmth.',
    dynamic: 'Two Capricorns together create an ambitious, disciplined, and structurally sound partnership. Both partners take commitment seriously, both are willing to work hard, and both understand that lasting results require patience and sacrifice.\n\nThe challenge is joy. Two people with Saturn this prominent can create a life that is impressively organized but emotionally austere. Making room for play, spontaneity, and emotional expression is the essential work this pairing tends to defer.',
    strengths: ['Unmatched mutual dedication and work ethic', 'Shared values around achievement and legacy', 'Both are reliable, loyal, and responsible', 'Excellent financial and professional partnership'],
    challenges: ['Emotional expression is challenging for both', 'Can become all duty and no pleasure', 'Competition over career success', 'Risk of the relationship becoming purely functional'],
    tip: 'You are masters at building the life. Practice living it. Joy is not a reward for hard work ... it is the reason for it.',
  },
  'Capricorn+Aquarius': {
    summary: 'Both ruled by Saturn in traditional astrology, sharing discipline but differing on tradition vs. innovation.',
    dynamic: 'Capricorn and Aquarius are neighboring signs who share a Saturnine seriousness and determination but direct it very differently. Capricorn builds within existing structures; Aquarius reimagines the structures entirely. Capricorn respects tradition; Aquarius questions it.\n\nThe attraction is often based on shared intelligence and competence. Both partners are capable, independent, and not easily impressed ... which makes the mutual respect between them meaningful.',
    strengths: ['Shared Saturn discipline and determination', 'Both are intellectually rigorous', 'Mutual respect for competence and independence', 'Can achieve remarkable things when aligned'],
    challenges: ['Different approaches to authority and convention', 'Capricorn finds Aquarius unreliable; Aquarius finds Capricorn restrictive', 'Emotional connection doesn\'t come naturally to either', 'Both can be emotionally distant'],
    tip: 'You are both serious people. Take your emotional connection as seriously as you take everything else.',
  },
  'Capricorn+Pisces': {
    summary: 'The builder meets the dreamer ... a surprisingly complementary pairing of structure and soul.',
    dynamic: 'Capricorn and Pisces are a sextile apart and create a partnership where dreams meet discipline. Capricorn provides the structure, planning, and follow-through; Pisces provides the vision, imagination, and emotional depth. Each has something the other desperately needs.\n\nCapricorn softens in Pisces\'s presence, accessing emotions they normally suppress. Pisces stabilizes in Capricorn\'s presence, grounding dreams they normally let float away.',
    strengths: ['Deeply complementary strengths', 'Capricorn grounds Pisces; Pisces softens Capricorn', 'Both are more caring than they appear', 'Quietly devoted and loyal'],
    challenges: ['Capricorn may dismiss Pisces\'s emotions as impractical', 'Pisces may feel restricted by Capricorn\'s rules', 'Different approaches to money and security', 'Communication styles differ: direct vs. indirect'],
    tip: 'Capricorn: Pisces\'s dreams are not impractical ... they are the vision your plans need. Pisces: Capricorn\'s structure is not a cage ... it is what turns your dreams into reality.',
  },

  // ─── Aquarius pairs ─────────────────────────────────────────
  'Aquarius+Aquarius': {
    summary: 'Two visionaries building the future together ... if they remember to live in the present.',
    dynamic: 'Two Aquarians share a love of innovation, independence, and intellectual exploration. You understand each other\'s need for space, share unconventional values, and respect each other\'s individuality in a way that few other signs can.\n\nThe challenge is presence and intimacy. Two Fixed Air signs can create a brilliant intellectual partnership that lacks warmth, physical connection, and emotional vulnerability.',
    strengths: ['Perfect intellectual and ideological match', 'Both value independence and give it freely', 'Shared progressive values and vision', 'Neither tries to change or control the other'],
    challenges: ['Emotional intimacy may never develop naturally', 'Both can be stubborn while appearing flexible', 'Physical affection may feel secondary to mental connection', 'Risk of parallel lives rather than a shared one'],
    tip: 'Your minds are perfectly paired. Now pair your hearts. Schedule intimacy with the same intention you bring to your ideas.',
  },
  'Aquarius+Pisces': {
    summary: 'The visionary meets the mystic ... neighboring signs who share idealism but differ on logic vs. feeling.',
    dynamic: 'Aquarius and Pisces are both oriented toward something greater than the self, but they approach transcendence differently. Aquarius through intellect, systems, and collective progress; Pisces through feeling, imagination, and spiritual surrender. They are the last two signs of the zodiac, and together they represent the boundary between the known and the unknown.\n\nWhen this works, Aquarius provides the intellectual framework for Pisces\'s intuitions, and Pisces provides the emotional and spiritual depth that Aquarius\'s ideas need to truly matter.',
    strengths: ['Both care about something larger than themselves', 'Shared idealism and compassion', 'Creative and imaginative together', 'Neither is conventional or materialistic'],
    challenges: ['Aquarius processes through logic; Pisces through emotion', 'Aquarius may seem cold to Pisces; Pisces may seem irrational to Aquarius', 'Neither is naturally grounded or practical', 'Different needs: intellectual space vs. emotional closeness'],
    tip: 'You are both dreamers. Aquarius dreams of the future; Pisces dreams of the infinite. Honor both visions.',
  },

  // ─── Pisces pairs ───────────────────────────────────────────
  'Pisces+Pisces': {
    summary: 'Two mystics swimming in the same ocean ... boundlessly creative, deeply empathic, and in need of shore.',
    dynamic: 'Two Pisces together create something emotionally immersive, creatively rich, and spiritually attuned. You sense each other\'s feelings without words, share an imaginative inner world, and love with a boundlessness that most people only approximate.\n\nThe risk is dissolution. Without grounding, two Pisces can lose themselves in each other, in fantasy, or in shared escapism. This pairing needs anchors... practical routines, separate identities, and at least one foot in the material world.',
    strengths: ['Unmatched emotional and spiritual connection', 'Profoundly creative and imaginative together', 'Both are compassionate, gentle, and accepting', 'A love that feels transcendent and unconditional'],
    challenges: ['Boundaries dissolve completely', 'Both may enable each other\'s escapist tendencies', 'Lack of practical grounding', 'Shared sensitivity can amplify negativity'],
    tip: 'Your love is oceanic. But oceans need coastlines. Build practical structures ... routines, boundaries, shared responsibilities ... that give your boundless love somewhere to land.',
  },
}
