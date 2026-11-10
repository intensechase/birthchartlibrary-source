// Generates a dynamic chart biography from planetary data.
// Each celebrity gets a unique narrative based on their actual placements,
// category, and house positions (when birth time is verified).

import type { BirthChartData } from '@/lib/swisseph/calculate'

export type CategoryBucket = 'performer' | 'athlete' | 'leader' | 'creative' | 'default'

type Gender = 'm' | 'f' | null

interface Pronouns {
  they:  string  // he / she / they
  They:  string  // He / She / They
  them:  string  // him / her / them
  their: string  // his / her / their
  Their: string  // His / Her / Their
  v:     string  // 's' for he/she, '' for they — append to simple verb stem
}

export function getCategoryBucket(category: string | null | undefined): CategoryBucket {
  if (!category) return 'default'
  const c = category.toLowerCase()
  if (/actor|actress|musician|singer|comedian|performer|dancer|entertainer|host|presenter|model|influencer/.test(c)) return 'performer'
  if (/athlete|basketball|football|soccer|tennis|baseball|golf|swim|olymp|sport|nba|nfl|nhl|mlb|boxing|wrestl|racing|cyclist|track|skater/.test(c)) return 'athlete'
  if (/politic|president|prime minister|royalt|monarch|business|entrepreneur|executive|military|general|admiral|senator|governor|diplomat/.test(c)) return 'leader'
  if (/writer|author|director|filmmaker|artist|designer|architect|poet|journalist|photographer|composer|painter|sculptor/.test(c)) return 'creative'
  return 'default'
}

function getPronouns(gender: Gender): Pronouns {
  if (gender === 'm') return { they: 'he', They: 'He', them: 'him', their: 'his', Their: 'His', v: 's' }
  if (gender === 'f') return { they: 'she', They: 'She', them: 'her', their: 'her', Their: 'Her', v: 's' }
  return { they: 'they', They: 'They', them: 'them', their: 'their', Their: 'Their', v: '' }
}

function aOrAn(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a'
}

function ordinal(n: number): string {
  return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
}

function houseTheme(house: number): string {
  const themes: Record<number, string> = {
    1:  'self and identity',
    2:  'values and resources',
    3:  'communication and learning',
    4:  'home and roots',
    5:  'creativity and self-expression',
    6:  'work and daily life',
    7:  'partnership and relationship',
    8:  'transformation and shared power',
    9:  'philosophy and expansion',
    10: 'career and public life',
    11: 'community and vision',
    12: 'spirituality and the inner world',
  }
  return themes[house] || 'life experience'
}

// Deterministic selection based on name — same celebrity always gets the same variant.
function pickByName<T>(name: string, arr: T[]): T {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return arr[h % arr.length]
}

// ─── Element / Modality maps ────────────────────────────────────────────────

const ELEMENT_MAP: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
}

const MODALITY_MAP: Record<string, string> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
}

// ─── Sun ────────────────────────────────────────────────────────────────────

const SUN_TRAITS: Record<string, string[]> = {
  Aries: [
    'a nature built to move first and ask questions later. The identity here is active, not reflective — forged through action, through the decision to begin, through the particular satisfaction of being the one who started something. Stillness doesn\'t threaten Aries so much as it simply doesn\'t make sense.',
    'a fiercely independent nature that has to find its own way, even when a better path is clearly marked. The chart doesn\'t resist leadership — it resists being led. There\'s a difference, and Aries lives in it.',
    'a spirit that moves toward the untried without needing to know how it ends. The identity is built at the frontier, not in the settled territory — which means there\'s always a new edge, always a next thing to begin.',
    'a competitive nature that needs the friction of resistance to fully come alive. Without an obstacle — without something to overcome — the energy has nowhere to go. The goal is almost beside the point. The chase is the thing.',
    'a fast-burning, instinct-led nature that trusts the first response and moves on it. The thinking comes after the action — which is sometimes a flaw, and sometimes the only way anything worth doing gets started.',
    'a nature that proves its existence through what it does rather than what it is. The inner life matters less than the outer motion. This is a chart built for momentum, and when momentum stops, the identity waits.',
    'a nature with genuine heat at the core — not cruelty, but a readiness to respond, to push back, to match whatever energy the world brings. That fire is the engine, and it keeps the whole thing running.',
    'a nature that ignites and clears in roughly equal measure — the flash of anger or frustration is real, and so is the speed of its passing. Aries doesn\'t carry what it has already expressed. The storm moves through and the sky is clear again, usually before anyone else has caught up.',
    'a nature with an almost touching faith in what it sets out to do — not because it lacks awareness of risk, but because the gap between impulse and action is too narrow to fit much doubt. Aries moves before the doubt arrives, and the doubt often never gets the chance to matter.',
  ],
  Taurus: [
    'a nature built for the long game — patient in a way that can look like stubbornness from the outside, but is really just commitment to what has already been decided. Taurus doesn\'t pivot. It finishes.',
    'a deeply embodied nature that finds identity through the physical world — through comfort, beauty, and the pleasure of things that are well-made and well-chosen. The senses are the guide here, and they rarely steer wrong.',
    'a fixed nature that, once settled, is genuinely difficult to move. This isn\'t closed-mindedness — it\'s the specific kind of conviction that comes from having thought it through slowly and arrived somewhere real. The position was earned.',
    'a nature that knows what it values and will not be talked out of it. The identity lives in what Taurus protects — the people, the principles, the things that have been decided worth keeping. That list doesn\'t change easily.',
    'a nature with a genuine eye for beauty and a preference for things done properly. The aesthetic sense here isn\'t vanity — it\'s a kind of integrity. How something looks and feels is information about whether it\'s any good.',
    'a nature that, once committed, stays. The loyalty here is one of the most quietly remarkable qualities in the zodiac — not loud, not demonstrated, just absolutely present. The people Taurus has decided on will be defended long after everyone else has moved on.',
    'a nature that treats security not as a goal but as a precondition — the stable ground under which everything else becomes possible. Without it, the full self is not available. This isn\'t scarcity thinking. It\'s how Taurus knows it\'s safe enough to be what it actually is.',
    'a nature with a genuine gift for pleasure — not in the sense of excess, but in the sense of being attuned to what is good, what is worth the effort, what the right amount of something is. The aesthetic intelligence here is practical: it knows what is worth having.',
  ],
  Gemini: [
    'a nature built around the collection and movement of ideas. The identity is formed through knowing — through asking, through gathering, through making connections no one else thought to make. The mind is the home, and it is never still.',
    'a genuinely dual nature that contains real contradictions and has made a kind of peace with that. The twin is not a flaw — it\'s the full picture. Gemini is two things at once and is most honest when it stops pretending otherwise.',
    'a nature that comes most fully alive through language — speaking, writing, explaining, listening, responding. Ideas need to move to mean anything, and Gemini is the one who keeps them in motion.',
    'a restless, wide-ranging nature that needs variety the way others need stability. The attention isn\'t a weakness — it\'s a signal. When the interest goes, it means the thing has given everything it had to give.',
    'a nature that reads rooms, adjusts in real time, and can find common ground with almost anyone. This is genuine intelligence — the ability to meet people where they are and make the exchange feel effortless.',
    'a nature that gets accused of being scattered when it is actually just wide. The breadth is intentional. Gemini doesn\'t want one deep well — it wants the whole landscape, and it explores it faster than most people can follow.',
    'a nature that moves lightly enough through the world to be misread as shallow — but the lightness is a method, not a limitation. Gemini has usually understood something before most people have finished reading the introduction. What looks like distraction is often completion.',
    'a nature that is genuinely interested in people — in what they think, how they think it, what makes them different from the last person. Gemini Sun brings real curiosity to encounter, and the people who experience it often feel more seen than they expected to.',
  ],
  Cancer: [
    'a quietly fierce, deeply feeling nature that finds identity through what it builds and protects. Cancer doesn\'t announce itself. It decides. It commits. The drive is always personal, even when the stage is global.',
    'a nature that carries its history like a living thing — memory is not the past for Cancer, it is the material. The identity is built from what was felt, what was survived, what was learned through the body before the mind could catch up.',
    'a profoundly intuitive nature that receives the world emotionally before it processes it rationally. The gut response is almost always right, and learning to trust it is the central task. Reason comes later, if it comes at all.',
    'a nature with a shell that should not be mistaken for the whole picture. The public face is managed, curated, careful — but what lives inside it is one of the richest inner worlds in the zodiac. The protection is real because what\'s being protected is real.',
    'a nature that gives, often quietly, what it needed and didn\'t always receive. The care here is genuine and specific — Cancer remembers what people need before they ask for it, and shows up accordingly.',
    'a nature that moves in cycles — inward and outward, open and closed, expressive and retreating. This isn\'t inconsistency. It\'s the rhythm of something alive. The tide comes in and the tide goes out, and both are necessary.',
    'a nature that approaches indirectly when the direct route feels dangerous — not because it lacks conviction, but because vulnerability has a price, and Cancer has usually paid it before. The roundabout path is mapped by experience, not timidity.',
    'a nature with an unexpected sense of comedy — the emotional depth that Cancer carries has a shadow twin in humor, a willingness to find what is absurd in the difficulty. The wit is dry and occasionally strange, and it surfaces at moments when the sentiment would be too much.',
  ],
  Leo: [
    'a nature that genuinely needs to be seen — not as vanity, but as a kind of existential requirement. The identity is real, but it needs the mirror of an audience to fully come into focus. That\'s not weakness. It\'s just how this one works.',
    'a radiant, warm-hearted nature that gives freely and loves dramatically. The generosity here is genuine — Leo doesn\'t give to get; it gives because withholding doesn\'t make sense to a nature built for warmth.',
    'a nature that has to make something — that finds identity through the act of creation, of putting something into the world that didn\'t exist before. The medium doesn\'t matter much. The making does.',
    'a nature with a pride that runs bone-deep and should not be handled carelessly. The dignity here is not arrogance — it\'s a genuine sense of self that, once wounded, takes real time to restore. Respect is not optional.',
    'a nature that gravitates toward the center of any room it enters — not by force, but by the specific gravity of genuine warmth and confidence. Leadership isn\'t something Leo performs. It\'s something that happens when Leo is simply being itself.',
    'a nature more loving than the public image suggests. Beneath the performance, beneath the confidence, there is a genuinely open heart — one that feels slights deeply, celebrates others loudly, and loves with a completeness that not everyone sees.',
    'a nature that can absorb almost anything except the specific wound of being genuinely unseen — of having the effort dismissed, the intention misread, the heart not recognized for what it is. That specific injury goes deep and takes longer to heal than seems reasonable from the outside.',
    'a nature that, when fully engaged, brings an almost unlimited intensity to the task. The languid surface of Leo is real, but so is the ferocity underneath it. When the thing decided on matters, the effort is extraordinary and rarely visible as effort at all.',
  ],
  Virgo: [
    'a nature that cannot leave well enough alone — not out of dissatisfaction, but out of a genuine commitment to what something could be at its best. The work is never quite finished. There is always one more thing to improve.',
    'a nature that finds its deepest meaning through being useful — through the particular satisfaction of a problem solved, a system improved, a person helped in a precise and practical way. The service is not self-sacrifice. It is the identity.',
    'a precise, observational nature that notices what others walk past. The mind here is a diagnostic instrument — it sees what\'s off, what\'s missing, what could be better. That\'s a gift, even when it\'s uncomfortable to receive.',
    'a nature closely attuned to the physical — to health, to rhythm, to the signals the body sends before the mind catches on. The relationship between the inner world and the outer vessel is a central preoccupation, and usually for good reason.',
    'a nature that expresses care through attention to detail — through the correction, the note, the observation that makes something better. It is one of the harder forms of love to receive, and one of the most honest.',
    'a nature that pays a real price for its precision — the standard that makes Virgo excellent also makes it hard to rest. The anxiety is the shadow side of the gift, and learning to put the instrument down is the lifelong work.',
    'a nature that contains one of the genuinely rare abilities — to look at something that isn\'t working, understand exactly why, and know what it would take to fix it. This is the analytical gift at its best: not criticism, not judgment, but a precise and useful form of attention that most people can only approximate.',
    'a nature closely tuned to the body — to its signals, its rhythms, its warnings before the mind catches on. The relationship between the inner world and the physical vessel is a central preoccupation, and the attention to health and wellness is part of the same precision brought to everything.',
  ],
  Libra: [
    'a nature that finds itself most clearly through relationship — through the particular revelation of who you are when you\'re genuinely known by someone else. The identity here is not incomplete alone, but it is most fully expressed in partnership.',
    'a nature with a genuine need for beauty — in the environment, in relationships, in how things are expressed and arranged. This is not decoration. It\'s how Libra knows something is right: it feels balanced, it looks considered, it holds.',
    'a natural mediator with a genuine commitment to fairness — and a real cost that comes with it. The peace that Libra keeps sometimes comes at the expense of its own position. That\'s the tension at the center of this chart.',
    'a nature that genuinely sees all sides — which is a gift, and also a weight. The decision comes slowly because every option has real merit and real cost. This isn\'t weakness. It\'s the specific difficulty of a mind that refuses to be dishonest about complexity.',
    'a nature with a deep, principled sense of how things ought to be — fair, considered, balanced. When the world falls short of that standard, which it does constantly, Libra feels it as a personal affront.',
    'a nature that must learn, usually through experience, where it ends and the other begins. The gift for connection can become a loss of self if the center isn\'t held. The task here is to remain someone while being known by someone else.',
    'a nature that, if it isn\'t careful, learns to say the thing that keeps the peace rather than the thing that is true — and often doesn\'t notice it\'s happening, because the accommodation feels like grace. The work is knowing the difference between genuine harmony and the hollow version that costs the self.',
    'a nature that can learn, gradually and without noticing, to say what keeps things comfortable rather than what is true. Not from dishonesty, but from the specific conditioning of a life spent smoothing surfaces. The work is recognizing which conversations have been avoided for too long.',
  ],
  Scorpio: [
    'an unflinching, psychologically penetrating nature that cannot accept the surface version of anything. The identity is built through going deeper than is strictly necessary — through the particular satisfaction of finding out what\'s actually true.',
    'an intensely self-possessed nature that understands power instinctively — where it lives, how it moves, when to use it and when to hold it. This isn\'t manipulation. It\'s awareness. There\'s a difference, and Scorpio knows it.',
    'a nature built for transformation — for the kind of change that looks like loss from the outside and is experienced as burning from the inside. What comes through that fire is always more essential than what went in.',
    'a nature that conceals more than it reveals — not out of deception, but out of a genuine understanding that most things worth knowing are worth protecting. The full picture is not offered freely. It is earned, slowly.',
    'a nature that, once it has decided on someone, is among the most loyal and fiercely committed in the zodiac. The intensity that can look threatening from the outside is, at its core, a capacity for a depth of attachment most people never experience.',
    'a nature that reads between every line and takes nothing at face value. The first account is never the whole story, and Scorpio knows this without needing to be told. The real intelligence here is not analytical — it\'s perceptual.',
    'a nature that remembers — not in a petty way, but in the way of something that takes what happens seriously. Scorpio holds both loyalty and betrayal with equal permanence. The person who proved themselves twenty years ago is still proven. The person who didn\'t is not forgotten.',
    'a nature capable of genuine transformation — not once, but repeatedly, and with increasing facility. Each time Scorpio goes through the fire and comes out the other side, what emerges is more essential. The regenerative capacity develops most fully when there is nowhere else to go.',
  ],
  Sagittarius: [
    'a nature built around the search for meaning — not as an intellectual exercise, but as a genuine existential need. The question isn\'t just what is happening. It\'s what it means. And the search for that answer drives almost everything.',
    'a nature that will not be contained — not by circumstance, not by expectation, not by the reasonable limits most people accept as given. Freedom is not a preference here. It is a requirement. Take it away and something essential goes with it.',
    'a nature with an almost constitutional faith that something better is ahead — that the horizon is worth chasing, that tomorrow has something yesterday didn\'t, that the world is fundamentally worth exploring. That faith is the engine.',
    'a nature with a directness that can read as tactless but is almost always honest. Sagittarius doesn\'t soften the truth to manage your feelings — it delivers it straight and expects you to be able to handle it. That\'s respect, in its way.',
    'a nature that genuinely wants to share what it finds — that can\'t discover something worth knowing without immediately wanting to tell someone. The enthusiasm is real. The need to transmit is real. Sagittarius teaches because it can\'t help it.',
    'a nature that believes, against considerable evidence, that the world can be better than it is — and that the right idea, the right journey, the right question can get it there. The idealism is not naive. It just refuses to stop.',
    'a nature with a well-developed instinct for the exit when a situation closes in — not from cowardice, but because confinement is genuinely threatening to a chart built for open space. The distinction between needing freedom and needing escape matters, and Sagittarius is not always the one who can tell the difference in the moment.',
    'a nature that cannot keep a good discovery to itself — the impulse to share what was found, to teach what was learned, to bring the insight back to the people it cares about is genuine and nearly constant. Sagittarius makes its best journeys into teachers and its worst into preachers. The difference is remembering that the student may already know something.',
  ],
  Capricorn: [
    'a nature that plays the long game — always. The ambition here is not impatient or showy; it is structural, patient, and nearly impossible to discourage. Capricorn knows that time is on its side, and it behaves accordingly.',
    'a deeply disciplined nature that finds identity through effort and achievement. The work is not a means to an end — it is the thing itself. The doing, the building, the sustained application of will over time: that is where this chart lives.',
    'a nature preoccupied with what lasts — with building something that will still be standing long after the effort is forgotten. The legacy is the point. Not the recognition. The thing left behind.',
    'a nature that commands respect without asking for it — because the authority here was earned through competence and consistency, not announced through title. Capricorn doesn\'t claim the room. It simply occupies it, and the room adjusts.',
    'a nature that presents as serious, capable, and self-contained — and is all of those things — but contains a warmth and dry humor that only the trusted few ever see. The exterior is real. So is what\'s underneath it.',
    'a nature that carries more than it shows — responsibility, expectation, the weight of what it has decided it owes. The burden is chosen, mostly. But it is still a burden, and the task is knowing when to set it down.',
    'a nature that can go long stretches without showing the full picture — competent and steady and present in ways the world needs and counts on, while the interior stays carefully managed. The loneliness that sometimes lives inside this chart is real, and the particular difficulty is that admitting it can feel like the one kind of failure Capricorn cannot afford.',
    'a nature with a sense of humor that is genuinely worth waiting for — Capricorn Sun does not perform warmth or manufacture levity. When the wit comes, it is dry, precise, and often the funniest thing in the room, because it was held until the moment required it.',
  ],
  Aquarius: [
    'a nature that cannot be fully owned by any ideology, institution, or expectation — that holds the right to think differently as a kind of sacred covenant with itself. The independence here is not rebelliousness. It is integrity.',
    'a nature that sees society from a slight remove — not because it doesn\'t care, but because the distance is how it sees clearly. The outside view is the gift. It allows Aquarius to understand systems that everyone else is inside of.',
    'a mind that arrives at ideas from angles no one else was looking from — that finds the non-obvious connection, the unexpected reframe, the solution that requires dismantling the question first. Original is not an affectation here. It is the actual mode.',
    'a nature that values personal freedom absolutely and also genuinely cares about what happens to everyone. That is not a contradiction — it is the central Aquarian project: to remain fully oneself while belonging to something larger.',
    'a nature that processes emotion through intellect — that feels things, genuinely, but needs to understand them before it can inhabit them. The detachment is not coldness. It is the specific method this mind uses to make sense of what it\'s feeling.',
    'a nature for whom friendship is the highest and most honest form of love — the connection chosen freely, between equals, for no reason other than genuine recognition. The romantic relationship, to Aquarius, should feel like that too.',
    'a nature that is more fixed than it looks. The intellectual flexibility is genuine — new information is genuinely welcome, and the thinking adjusts. But once Aquarius has actually reached a conclusion, the position holds. People who confused the open mind for an open verdict eventually find there isn\'t one.',
    'a nature that has decided more than it shows — beneath the intellectual flexibility is a set of positions arrived at through independent reasoning that will not be revised on social pressure. Aquarius is open to evidence and closed to persuasion. The difference is significant.',
  ],
  Pisces: [
    'a nature that absorbs the world — that takes in the emotional atmosphere of every room it enters and carries it as its own. The permeability is not weakness. It is the source of everything this chart is capable of.',
    'a nature whose inner life is richer, stranger, and more populated than the outer one will ever fully reveal. The imagination here is not a hobby. It is the primary reality, and the external world is the translation.',
    'a nature that has always had trouble knowing where it ends and the world begins — which is the source of its compassion, its creativity, and its most persistent difficulties. The boundary question never entirely resolves.',
    'a nature with an instinctive sense that there is something larger than the individual life — that the world is connected in ways that can\'t be proven but also can\'t be denied. The spiritual intuition is not belief. It is perception.',
    'a nature that creates by receiving rather than constructing — that channels what it can\'t quite explain and puts it into form. The work doesn\'t feel authored so much as arrived at. Pisces makes the space; the thing comes through.',
    'a nature that feels the suffering of others as its own — not as a choice, but as a fact. The compassion here runs deep enough to be uncomfortable, and the challenge is carrying it without being dissolved by it.',
    'a nature with a complicated relationship to the literal world — not because reality is hard to see, but because the inner world is richer, softer, and more worth inhabiting much of the time. The retreat is not avoidance. It is how this chart refills. Come back from it with something the literal world couldn\'t have produced.',
    'a nature that processes through creation rather than analysis — what Pisces Sun experiences, it tends to make something of. The suffering that would stay unprocessed in a more rational placement becomes the source material for art, for empathy, for understanding that goes deeper than argument could reach.',
  ],
}

const SUN_HOUSE_CONTEXT: Record<number, string> = {
  1:  'The Sun in the 1st house makes identity and self-presentation nearly inseparable — who they are and how they appear to the world are two aspects of the same thing. The energy is immediate, the presence is noticeable, and the drive to be recognized for the self rather than the role is constant.',
  2:  'The Sun in the 2nd house ties purpose to what is built, earned, and valued — the sense of self is anchored in material reality, in the things that can be touched and held and pointed to. Pride runs through what they have created and what they have refused to compromise.',
  3:  'The Sun in the 3rd house makes identity through ideas, language, and connection — they are most fully themselves when thinking, speaking, and sharing. The mind is the arena where the self comes into focus, and communication is how they know who they are.',
  4:  'The Sun in the 4th house draws identity inward — toward home, ancestry, and the private self that most people never fully see. The deepest sense of purpose is rooted in the personal, and the life built around that interior is often more significant than the life visible to the world.',
  5:  'The Sun in the 5th house places identity in creative expression and the full enjoyment of life — joy, play, and the need to make something real are not secondary concerns. They are the primary arena in which this person becomes most fully themselves.',
  6:  'The Sun in the 6th house finds purpose through work, craft, and service — being useful and being excellent at something are not just professional qualities, they are identity. The refinement of the work is the refinement of the self.',
  7:  'The Sun in the 7th house discovers identity through partnership — through the specific mirror of being known by someone else. The self comes into focus in relationship, and the quality of the connections formed over a lifetime reflects back what the person most essentially is.',
  8:  'The Sun in the 8th house draws identity toward depth and transformation — toward what others avoid, toward the psychology beneath the surface, toward the kind of change that only happens after something breaks. Their power comes from going where most people won\'t.',
  9:  'The Sun in the 9th house is an explorer\'s placement — identity is bound up with the search for meaning, wisdom, and a picture larger than the immediate. The horizon is always the thing they\'re moving toward, and the movement itself is part of who they are.',
  10: 'The Sun in the 10th house places identity squarely in the public arena — career, reputation, and legacy are not just ambitions, they are the stages on which this person most fully becomes themselves. Being known for something real is a genuine psychological need.',
  11: 'The Sun in the 11th house ties identity to community and shared vision — purpose is found in belonging to something larger than the individual life. The friendships, the causes, the networks of like-minded people are not background; they are the territory where the self comes alive.',
  12: 'The Sun in the 12th house operates beneath the surface — identity is layered, private, and often inaccessible even to the person themselves. Purpose unfolds through solitude, through service, through the long interior work that produces something the outer world eventually sees but rarely traces back to its source.',
}

// ─── Moon ───────────────────────────────────────────────────────────────────

const MOON_NEEDS: Record<string, string[]> = {
  Aries: [
    'The emotional life moves fast here — Aries Moon doesn\'t sit with feelings so much as it acts on them. The instinct when something hurts is to move, to do something, to get back into motion. The processing happens in action, not in reflection, and that is not a flaw.',
    'The inner life has a short fuse and a quick recovery — Aries Moon flares and then it\'s done. There isn\'t much appetite for lingering in what was felt. Once the feeling has moved through, it\'s released, and the world starts fresh.',
    'Emotionally, independence is not a preference — it\'s a requirement. Aries Moon needs to know it could go it alone even when it isn\'t. Dependency, real or perceived, creates a specific discomfort that can read as coldness and is really just the need to feel free.',
    'The emotional need here is for autonomy and forward motion — for the sense that nothing is stuck, that the next thing is possible, that life has not closed in. When that sense is threatened, the reaction is immediate.',
    'Anger is the most honest emotion in this placement — not the only one, but the one that comes fastest and clearest. The challenge isn\'t feeling it. It\'s knowing what to do with it before it arrives.',
    'The Aries Moon has a particular kind of pride — the inner life doesn\'t dwell on what was hurt, and doesn\'t want it to be dwelt on by others either. The move is always forward. Sympathy that lingers past the moment can feel like an insult to the recovery already in progress.',
    'Romance comes fast and intense and sometimes brief — Aries Moon is prone to strong attractions that carry everything until they don\'t. The feeling was real. The duration was just the duration. Both things can be true.',
  ],
  Taurus: [
    'The emotional world is built on physical ground — comfort, consistency, and the specific reassurance of things that don\'t change. Taurus Moon doesn\'t process feelings well in transit. It needs a place to be still first.',
    'Security is the emotional foundation here, and it is not abstract. It\'s the familiar chair, the reliable meal, the known routine. When those anchors hold, the inner life holds with them.',
    'Change is the deepest emotional discomfort for Taurus Moon — not because of rigidity, but because stability is the condition under which everything else becomes possible. Disrupt the foundation and everything above it shakes.',
    'The emotional need is for constancy in the people and places that matter — the knowledge that what was there yesterday will be there tomorrow. Betrayal of that constancy is the wound that takes the longest to close.',
    'Pleasure is not indulgence for Taurus Moon — it\'s medicine. The body knows how to regulate the inner world, and learning to trust that is the work.',
    'The relationships this placement forms tend toward the enduring — Taurus Moon doesn\'t easily disconnect from people it has decided to love, and the breakup that looked clean from the outside often isn\'t. The warmth was real. Withdrawing it takes longer than it should.',
    'Pleasure is not a reward to be earned here — it is a requirement for the inner life to stay functional. The body that is rested, the meal that was good, the environment that is comfortable: these are not luxuries. They are the conditions under which everything else becomes possible.',
  ],
  Gemini: [
    'The emotional world moves through language — Gemini Moon processes by talking, by writing, by explaining the feeling to someone until it becomes clear. Silence in the inner life creates a kind of static that only words can cut through.',
    'Feelings are information here, and the mind wants to categorize them, examine them, put them in context. The emotional life is rich but rarely direct — there\'s usually another layer of thought between the feeling and the expression of it.',
    'Variety is a genuine emotional need — Gemini Moon cannot be held in one emotional register for too long without restlessness setting in. The range isn\'t instability. It\'s the natural width of a nature that processes everything through movement.',
    'The inner life is curious about itself, which is unusual. Gemini Moon watches its own emotional patterns with something close to detachment — interested in what\'s happening, slightly reluctant to be fully consumed by it.',
    'Connection is the emotional anchor here — not just romantic connection, but the ongoing experience of being in contact with interesting people. Isolation is one of the more disorienting things Gemini Moon can go through.',
    'The emotional life has a running commentary on itself — Gemini Moon observes its own moods with the same curiosity it brings to everything else. The feeling is processed and catalogued almost as it arrives. This doesn\'t stop it from arriving; it just gets filed.',
    'The inner world can get snappy under pressure — when the nervous system is overstimulated, the emotional demand exceeds the processing capacity, and Gemini Moon becomes sharp in a way that surprises people who know its usual lightness. The sharpness passes quickly. So does the cause.',
  ],
  Cancer: [
    'The Moon is at home in Cancer — which means the emotional world is vivid, deep, and rarely far from the surface. Feeling is not something that happens occasionally. It is the continuous ground state.',
    'The private self is built around belonging — to a place, to a family, to a set of people who are called home. When that sense of belonging is intact, everything else is manageable. When it isn\'t, everything else suffers.',
    'Memory is the emotional landscape for Cancer Moon — not just recollection, but the felt sense of the past that lives in the body. Old feelings are never entirely past. They are always somewhere near, waiting to be recognized.',
    'The nurturing instinct runs deep here — Cancer Moon gives care as instinctively as breathing, often without being asked and sometimes without being thanked. The need to be needed is real, and so is the exhaustion that can come with it.',
    'The emotional shell is real and serves a purpose — Cancer Moon does not open quickly, and should not be asked to. What\'s inside is tender. The time it takes to get there is the cost of entry, and it is worth it.',
    'There is a particular humor in Cancer Moon — a loony, almost irrational sense of comedy that surfaces at unexpected moments and completely undercuts any impression of pure sentimentality. The emotional depth and the unexpected levity coexist, and the coexistence is genuine.',
    'The protective instinct extends beyond what is strictly logical — Cancer Moon will act on behalf of people it loves before thinking about whether the action makes sense. The protection doesn\'t calculate. It moves.',
  ],
  Leo: [
    'The emotional world needs warmth returned — Leo Moon gives generously and genuinely, and it needs to know that generosity lands. Not constant validation, but the specific assurance that the warmth was felt.',
    'Recognition is an emotional requirement here, not a luxury. Leo Moon feels most whole when what it brings is acknowledged — the effort, the care, the particular way it shows up. Invisibility is the deepest discomfort.',
    'Joy is the natural emotional register — Leo Moon is built for celebration, for warmth, for the full expression of feeling in a way that makes people around it feel something too. When joy is blocked, everything goes flat.',
    'The creative need is emotional as much as expressive — Leo Moon processes feeling through making, through performing, through channeling the inner world into something others can witness. Art, in its many forms, is how this Moon heals.',
    'The pride here is not arrogance — it is the specific sensitivity of a nature that has offered something genuine and is waiting to see if it was enough. Handle it with care, and it opens. Handle it carelessly, and it withdraws.',
    'The emotional world has a strong sense of justice — Leo Moon is among the most fair-minded in how it deals with people it loves. What gets under the skin is specifically the unacknowledged effort, the warmth that went unreceived, the offering that wasn\'t met.',
    'The inner world organizes itself around the people it has chosen — Leo Moon is, at its core, a nurturer and an arranger of the social sphere it considers its own. The entertaining, the celebrating, the making sure people around it feel seen: this is not performance. It is how the emotional life expresses itself.',
  ],
  Virgo: [
    'The emotional world finds its footing through order — Virgo Moon calms itself by organizing, by tidying, by making the external environment reflect the internal one it\'s working toward. Control over small things is how it manages large feelings.',
    'Usefulness is the emotional currency here — Virgo Moon feels most secure when it is contributing something real. The need to help is genuine, but it is also the mechanism the inner life uses to manage anxiety. Both things are true.',
    'The inner critic is louder in this placement than in most — Virgo Moon holds itself to a standard that no one else would impose, and the gap between that standard and reality is a source of real distress. The work is learning to extend the same compassion inward that it offers outward.',
    'Anxiety is the shadow here — the price of precision and attentiveness. The mind doesn\'t stop noticing, doesn\'t stop cataloguing what could go wrong, and learning to interrupt that pattern is the lifelong practice.',
    'The emotional life is expressed through acts of service more often than words — Virgo Moon shows up in concrete, specific ways and expects to be understood through those acts. The language of care here is practical, and it is sincere.',
    'The skepticism is real and largely self-directed — Virgo Moon is harder on itself than on anyone else, and the standard it applies to its own emotional responses is a demanding one. The feeling must be earned, the reaction must be proportionate. Learning to feel freely, without prior justification, is a real undertaking.',
    'The contentment available to Virgo Moon is genuine and quiet — it is the satisfaction of the routine running well, the system in order, the small things handled. The happiness doesn\'t announce itself. It settles into the background and makes the whole life feel more coherent.',
  ],
  Libra: [
    'The emotional world is organized around harmony — Libra Moon genuinely cannot thrive in an environment of sustained conflict. The need for peace is not avoidance; it is a real emotional requirement, and it shapes every close relationship.',
    'Partnership is the emotional anchor — Libra Moon finds itself most fully in the context of a close, balanced relationship. Solitude is manageable, but it is not the native state. The mirror of someone else is how this Moon knows itself.',
    'The discomfort with conflict runs deep enough that Libra Moon will sometimes choose an imperfect peace over a necessary confrontation — and then carry the resentment of the unspoken thing. The emotional work is learning to say the difficult thing before it accumulates.',
    'Aesthetics are emotionally regulating for Libra Moon — beautiful surroundings, graceful interactions, a sense of things in their right arrangement. Ugliness in the environment or in relationships creates a specific inner disturbance.',
    'The fairness instinct is emotional as much as rational — Libra Moon feels inequity in its body, and the experience of being treated unjustly is one of the more destabilizing things this placement can go through.',
    'The argument that Libra Moon brings to a long-term relationship is something to reckon with — the debating instinct doesn\'t disappear in intimacy. The partner who can hold the exchange without needing to win it tends to fare best.',
    'The emotional ideal is the relationship where no one is diminished — where both people are met equally, where the giving and receiving are balanced. That ideal shapes what Libra Moon wants and what it notices when it isn\'t there.',
  ],
  Scorpio: [
    'The emotional life runs very deep and is shared with almost no one. Scorpio Moon does not expose what it feels — not because it feels little, but because it feels enormously, and the exposure of that is not something it offers lightly.',
    'Trust is the emotional foundation, and it is built slowly. Scorpio Moon does not forgive betrayal quickly, if at all, because the level of trust it offers is rare enough that its violation is a genuine wound. The loyalty it gives is total. It expects the same.',
    'The inner world is one of the most intense in the zodiac — but the surface rarely shows it. Scorpio Moon has learned to present calmly while processing deeply, and the gap between the visible and the interior is often significant.',
    'Transformation is the emotional mode — Scorpio Moon doesn\'t move through feelings so much as it is changed by them. What goes in does not come out the same. The processing is not comfortable, but what emerges from it is real.',
    'The need for emotional truth is non-negotiable — Scorpio Moon would rather have the difficult honest conversation than live with the managed comfortable one. Superficiality in intimacy is not a preference issue. It is unbearable.',
    'The intuition is among the sharpest in the zodiac — Scorpio Moon picks up on what is not being said, on the discrepancy between word and tone, on the thing that was carefully not mentioned. The perception is rarely wrong and rarely offered freely.',
    'The testing is often unconscious — Scorpio Moon puts its relationships through trials it doesn\'t fully acknowledge as tests. When the other person passes, the trust deepens. When they fail, it is noted with a permanence that can look like holding a grudge but is really just taking the evidence seriously.',
  ],
  Sagittarius: [
    'The emotional world needs room — Sagittarius Moon becomes genuinely distressed when life contracts, when options narrow, when the horizon disappears. Freedom is not a philosophical position here. It is an emotional requirement.',
    'Meaning is the emotional anchor — Sagittarius Moon can endure difficulty, discomfort, even genuine loss, as long as the sense that it means something remains intact. Take the meaning away and the foundation goes with it.',
    'Optimism is the native emotional register — Sagittarius Moon looks for what\'s good, what\'s possible, what\'s still ahead, even in circumstances that would flatten a different placement. The faith is stubborn and it mostly holds.',
    'The emotional life is processed through movement — travel, learning, new experience. When life goes still for too long, Sagittarius Moon gets restless in a way that can look like dissatisfaction but is really just the need to feel like things are still going somewhere.',
    'Honesty in emotional exchange is non-negotiable — Sagittarius Moon does not manage what it feels for the comfort of others. What\'s true will surface, and the delivery is rarely softened. That directness is a form of respect.',
    'The emotional recovery is fast — Sagittarius Moon does not brood for long, even over significant things. The forward momentum reasserts itself before most placements have finished processing. Sometimes the faith that things will be fine is simply correct.',
    'The humor is a genuine emotional resource — Sagittarius Moon finds what is absurd about difficult situations and uses it. The laugh at the right moment is not deflection; it is perspective, and the capacity to maintain perspective under pressure is one of the real gifts of this placement.',
  ],
  Capricorn: [
    'The emotional world is held, contained, managed — Capricorn Moon does not wear its interior on the outside, and the discipline it brings to external life extends to internal life as well. Feeling is acknowledged privately, processed quietly, and rarely fully shown.',
    'Achievement is an emotional anchor — not because success is everything, but because competence and forward progress create a sense of safety that nothing else quite replicates for this placement. The work holds the inner life steady.',
    'The early experience of needing to be capable before being comforted leaves a mark — Capricorn Moon can find it genuinely difficult to ask for emotional support, not from pride but from the deep habit of handling things itself.',
    'Responsibility is the emotional language — Capricorn Moon shows care through showing up, through being reliable, through doing the thing that needed doing without being asked. The warmth is real. The expression is consistent rather than effusive.',
    'The emotional life deepens over time — Capricorn Moon is not always accessible in youth, but it softens and opens as the foundation gets built and the need to control everything eases. The later chapters are often warmer than the early ones.',
    'The sarcasm is the emotional tell — Capricorn Moon, when moved or vulnerable, often goes dry and cutting rather than soft and open. The people who know this sign well learn to hear what the sarcasm is actually saying.',
    'Respect is the emotional currency — Capricorn Moon needs to feel that its judgment is taken seriously, that its reliability is acknowledged, that the effort it has put into something is recognized. Not affection, not flattery. Respect for what was actually done.',
  ],
  Aquarius: [
    'The emotional life is processed through the intellect — Aquarius Moon feels things genuinely, but the first response to a feeling is almost always to understand it. The analysis is not avoidance. It is the actual method.',
    'Freedom is an emotional requirement — Aquarius Moon needs to know that no one owns what it feels, that its inner world is its own, that emotional closeness does not come with the cost of independence. Possessiveness is one of the faster ways to lose this placement.',
    'Community is the emotional anchor — not a single close relationship, but the broader sense of belonging to people and to something meaningful. Aquarius Moon feels most itself in groups that share a genuine purpose.',
    'The detachment that others sometimes read as coldness is the mechanism by which Aquarius Moon stays functional while still caring deeply. It is not indifference. It is the specific form this emotional life takes.',
    'Emotional authenticity matters more than emotional convention — Aquarius Moon will not perform feelings it doesn\'t have or suppress ones it does. The expression may be unconventional, but it will be honest.',
    'The humanitarian concern is emotionally real — Aquarius Moon is not detached about the suffering of groups and communities it identifies with. The care is organized around collective rather than individual attachment. The belonging it seeks is to something larger than any single relationship.',
    'The pride is considerable and handles criticism poorly — Aquarius Moon appears open and progressive but is internally quite fixed. The feeling of being judged or misunderstood creates a defensiveness that catches people off guard given the usual air of open-mindedness.',
  ],
  Pisces: [
    'The emotional world is vast, porous, and difficult to separate from the world around it — Pisces Moon absorbs what is in the room and carries it as its own. The gift is empathy without limit. The challenge is knowing which feelings actually belong to it.',
    'Solitude is a genuine emotional need — not because Pisces Moon is antisocial, but because the permeability that makes it compassionate also makes it susceptible to overwhelm. Time alone to rinse out what has accumulated is not optional.',
    'The inner life has a relationship with something larger than the individual self — a spiritual current, a creative channel, a sense of being connected to something that runs beneath the surface of ordinary life. When that connection is open, Pisces Moon thrives. When it\'s blocked, nothing else works right.',
    'Creativity is an emotional regulation tool — Pisces Moon processes feeling through art, through music, through making something of the interior world. The act of translation is itself the healing.',
    'The compassion here is genuine and potentially exhausting — Pisces Moon cannot easily turn away from suffering, which is a profound quality and a real vulnerability. The emotional work is learning to be moved without being destroyed.',
    'The humor is real and frequently overlooked — Pisces Moon has a perceptive, occasionally silly sense of what is funny about the human condition, and the comedy tends to come from the places of deepest feeling. The lightness and the depth are not opposites. They are the same thing from different angles.',
    'The emotional world needs an outlet larger than ordinary life — Pisces Moon processes feeling through art, through spiritual practice, through making something of what was felt. Without that outlet, the emotional intake accumulates without release, and the overwhelm arrives faster than anyone expected.',
  ],
}

const MOON_HOUSE_CONTEXT: Record<number, string> = {
  1:  'The Moon in the 1st house brings the emotional life close to the surface — moods register immediately in the face and body, and the inner world is rarely fully concealed regardless of the effort made to conceal it. The changeability is real and the expressiveness is often magnetic.',
  2:  'The Moon in the 2nd house anchors emotional security in material stability — comfort, ownership, and physical consistency are genuine psychological requirements, not luxuries. When the material world holds steady, the inner world holds with it.',
  3:  'The Moon in the 3rd house processes emotion through words — they need to talk, write, or think their way through what they feel before it makes sense to them. The unexpressed feeling creates static; the named one can be dealt with.',
  4:  'The Moon in the 4th house places home and family at the center of the emotional world — roots, a private sanctuary, and the people who feel like home are not preferences. They are the foundation without which everything else is built on uncertain ground.',
  5:  'The Moon in the 5th house processes emotion through creativity, passion, and joy — they feel most whole when creating, playing, or in the full heat of something that matters. Emotional flatness is often a sign that the creative life has gone quiet.',
  6:  'The Moon in the 6th house copes by doing — when emotions run high, the instinct is to work, to organize, to fix something concrete rather than sit with what was felt. The usefulness is real and it is also, in part, the management strategy.',
  7:  'The Moon in the 7th house places emotional life in the context of relationship — they feel most whole when genuinely partnered, and the absence of close connection is experienced not as freedom but as incompleteness. The mirror of someone else is how this Moon knows itself.',
  8:  'The Moon in the 8th house runs deep and private — the emotional life is intense, rarely fully shared, and processed through transformation rather than conversation. What goes in does not come out the same, and the processing is rarely comfortable and rarely trivial.',
  9:  'The Moon in the 9th house needs expansion to feel whole — travel, learning, and the ongoing belief that something meaningful is always ahead are genuine emotional requirements. When life contracts and the horizon disappears, something essential goes with it.',
  10: 'The Moon in the 10th house ties emotional security to achievement and public recognition — they feel most themselves when building something the world can see, and the inner life is more stable when the outer life is moving. What they accomplish is also, in some important sense, what they feel.',
  11: 'The Moon in the 11th house finds emotional home in community — friendship, shared ideals, and belonging to something larger than the individual life are true sources of comfort. Isolation from the group is a specific emotional difficulty; belonging to one is a genuine need.',
  12: 'The Moon in the 12th house lives largely in the interior — the emotional life is rich but often hidden, even from the person themselves. Solitude is not optional. It is the condition under which the inner world becomes accessible, and without it, the full self is not available.',
}

// ─── Rising ─────────────────────────────────────────────────────────────────

const RISING_IMPRESSION: Record<string, string[]> = {
  Aries: [
    'The first impression is immediate, direct, and energetic — Aries rising doesn\'t ease into a room so much as arrive in it. The energy is right there from the start, and it sets a specific tone before a word is spoken.',
    'There\'s an aliveness to Aries rising that\'s hard to ignore — something ready, something alert, something that suggests this person is already a step ahead of the conversation. The presence is quick and the eyes are sharp.',
    'The world receives Aries rising as someone who moves fast and means it — someone who doesn\'t perform decisiveness but has it natively. The impression is of a person you wouldn\'t want to argue with unnecessarily.',
    'Bold is the word most people reach for first — Aries rising has a forthright quality that can read as intensity, as confidence, as a lack of patience for pleasantries. All of those readings are partially right.',
    'The outer presentation has an edge — not aggression, but a kind of readiness. Aries rising meets the world at the door rather than waiting for the world to come find it.',
  ],
  Taurus: [
    'The first impression is calm, solid, and reassuring — Taurus rising moves at its own pace and makes no apology for it. There is a quality of steadiness that people register immediately and find either grounding or immovable, depending on what they need.',
    'The presence is physical — Taurus rising occupies space with an ease and naturalness that suggests comfort in the body and no particular urgency to be anywhere else. People trust it instinctively.',
    'There is a warmth in Taurus rising that comes through before the conversation does — something unhurried and generous in the way it attends to people. The impression is of someone who has time for you, even when it isn\'t quite true.',
    'The outer presentation is solid in a way that can look like stubbornness before people know better. What reads as resistance is usually just the specific weight of a person who doesn\'t move unless it\'s worth moving.',
    'Beauty registers in the presence — not necessarily in a conventional sense, but in the quality of attention Taurus rising brings. There is an aestheticism in how it presents itself, a care for how things look and feel, that comes through in the details.',
  ],
  Gemini: [
    'The first impression is quick, bright, and socially effortless — Gemini rising finds its footing in conversation the way other people find it in solitude. Words arrive fast, and the ease is real.',
    'There\'s a lightness to Gemini rising that can be mistaken for shallowness by people who haven\'t paid attention — a quickness, a humor, a refusal to stay heavy for very long. The depth is there. It just doesn\'t announce itself.',
    'Curiosity is the first thing people notice — the quality of genuine attention, the questions that come faster than the answers, the sense that this person is actually interested in what you\'re saying. That\'s the real gift of Gemini rising.',
    'The outer presentation shifts with the room — Gemini rising is a natural adapter, and different people encounter different facets of the same person. This is not duplicity. It is a genuine range.',
    'The eyes are always moving in Gemini rising — there\'s an alertness, a scanning quality, a sense that multiple things are being registered at once. It\'s the look of a mind that doesn\'t fully stop.',
  ],
  Cancer: [
    'The first impression is warm, a little watchful, and quietly protective — Cancer rising draws people in without doing much to make it happen. There\'s a quality of home to the presence, and people lean toward it.',
    'The outer presentation is soft but not without substance — Cancer rising presents gently and the shell is real. People feel welcomed and also somehow assessed. Both things are happening simultaneously.',
    'There\'s an emotional intelligence in Cancer rising that reads before it speaks — a perceptiveness about what\'s happening in the room, what people need, where the feeling in the air is going. It lands before the words do.',
    'The impression people carry away is of someone who saw them — not just looked, but actually registered something. Cancer rising pays attention in a way that is specific and felt.',
    'Warmth is the overriding impression, and it is genuine — but there is also a reserve beneath it. Cancer rising doesn\'t give access to everything at once. The welcome is real. The interiority takes longer.',
  ],
  Leo: [
    'The first impression is unmistakable — Leo rising enters a room and the room knows it. Not through effort, not through performance, but through a quality of presence that draws attention before a single word is spoken.',
    'There\'s a warmth to Leo rising that makes people feel chosen — like being in conversation with this person is a specific pleasure, not a generic one. The attention it gives feels like a gift because it actually is.',
    'The outer presentation is polished without being cold — there is a care in how Leo rising presents itself, an awareness of the impression it makes, a native understanding that the world is watching and the appearance should honor that.',
    'Confidence is the word most people reach for, and it\'s accurate — but underneath it there is a sensitivity that the presentation doesn\'t advertise. Leo rising can be wounded by what it appears to be immune to.',
    'The first encounter leaves a mark — people remember Leo rising. The specifics of the conversation may fade; the quality of the presence doesn\'t.',
  ],
  Virgo: [
    'The first impression is composed, attentive, and slightly hard to read — Virgo rising doesn\'t offer everything at once. The presentation is careful, considered, and quietly observational. It notices far more than it shows.',
    'There\'s a quality of competence in Virgo rising that comes through before any accomplishment is mentioned — the way it attends to detail, the precision of its language, the sense that it has already noticed what everyone else is about to discover.',
    'The outer presentation is modest in a way that can be misleading — Virgo rising doesn\'t announce itself, and the depth behind the reserve can come as a surprise to people who assumed there wasn\'t any.',
    'People feel assessed by Virgo rising, and they are right. The observational instinct is constant, quiet, and not unkind — but it is never fully off. The quality of attention it brings to others is the same quality it applies to everything.',
    'Reliability is the impression that stays — the sense that this person means what they say, says what they mean, and would rather be silent than imprecise. That quality earns trust, and it takes time to earn back if it\'s lost.',
  ],
  Libra: [
    'The first impression is graceful, warm, and effortlessly social — Libra rising makes people feel at ease without working at it. The charm is real, the interest is real, and the attention given feels like a gift even when it\'s the hundredth time that day.',
    'There\'s an aestheticism to Libra rising that comes through in the presentation — the care with appearance, the quality of attention in conversation, the sense that everything is slightly more considered and better arranged than it needed to be.',
    'The outer presentation is diplomatic in a way that can conceal real positions — Libra rising knows how to make every person in the room feel heard, which is a genuine skill and occasionally a cover for not committing to anything.',
    'People feel mirrored by Libra rising — understood, acknowledged, met where they are. That feeling is the gift of the placement, and it creates a specific kind of loyalty in the people who experience it.',
    'The grace under pressure is real — Libra rising doesn\'t easily lose the thread of social composure, even when composure is difficult. The presentation holds, and the effort behind holding it is rarely visible.',
  ],
  Scorpio: [
    'The first impression is felt before it\'s processed — Scorpio rising has a presence that registers in the room before the specifics arrive. People are aware of it in a way they can\'t quite explain.',
    'The outer presentation is controlled, deliberate, and slightly opaque — Scorpio rising does not give away more than it intends to. The information offered in a first encounter is selected, and what\'s withheld is at least as significant as what\'s shown.',
    'There\'s an intensity to Scorpio rising that sits in the eyes — the quality of observation, the sense of being fully assessed, the feeling of being with someone who sees more than they\'re letting on. Because they are.',
    'People either respond to Scorpio rising immediately or keep a cautious distance — there is rarely indifference. The presence has weight, and weight polarizes.',
    'The magnetism is real and somewhat involuntary — Scorpio rising draws people toward it through a combination of perceived depth and genuine mystery. The impression is that there is more here, and the curiosity it generates is reliable.',
  ],
  Sagittarius: [
    'The first impression is open, warm, and infectious — Sagittarius rising has an enthusiasm for life that comes through in the first few minutes and makes people want to stay in the conversation longer than they planned.',
    'The outer presentation is honest to a fault — Sagittarius rising doesn\'t curate what it says to manage impressions. What it thinks, it tends to express. What it believes, it tends to defend. The directness is real and mostly welcome.',
    'There\'s an optimism in Sagittarius rising that people receive as energy — a quality of believing in the possibility of things that can be genuinely contagious. In the right context, it makes rooms lighter.',
    'The impression is of someone who is going somewhere — who has direction and genuine momentum and would be glad to take you along. The openness is not performed. It is the actual mode.',
    'People feel free around Sagittarius rising — there is a quality of not being judged, of being seen generously, of the encounter being an invitation rather than an assessment. That is the gift this placement brings to rooms.',
  ],
  Capricorn: [
    'The first impression is serious, capable, and quietly authoritative — Capricorn rising doesn\'t request respect. It occupies the room in a way that makes the request unnecessary.',
    'There\'s a self-containment to Capricorn rising that can be mistaken for coldness on first encounter — the reserve is real, the warmth is real, and the latter takes longer to reach than the former suggests it should. It\'s worth the wait.',
    'The outer presentation is composed and deliberate — Capricorn rising doesn\'t display more than the situation requires. The first impression is of someone who has thought about what they\'re presenting, which they have.',
    'People feel the competence before they understand it — there\'s a quality to Capricorn rising that suggests it has done difficult things and come through with something to show for it. The credibility is worn, not announced.',
    'The impression people carry away is of someone reliable in a specific, load-bearing way — not just present, but accountable. The kind of person who, if they said they would, they did.',
  ],
  Aquarius: [
    'The first impression is distinctive, slightly unusual, and genuinely difficult to place — Aquarius rising doesn\'t map onto existing categories easily, and the people who meet it either find that intriguing or unsettling. Rarely neither.',
    'There\'s an intelligence to the outer presentation that comes through before the conversation gets substantive — a quality of observation, of seeing the larger pattern, of existing slightly outside the frame while still engaging with what\'s inside it.',
    'The social manner is warm but maintains a specific distance — Aquarius rising is friendly without being intimate, interested without being entirely accessible. The boundary is part of the design.',
    'People sense that this person thinks differently — that the frameworks they bring to the world are not the standard ones. That quality can be magnetizing or alienating, sometimes to the same person at different moments.',
    'The impression is of someone principled — a person who has a position and holds it, who can\'t be talked into something they\'ve already decided against, who does not adjust their thinking to manage other people\'s comfort. That quality is unusual enough to be memorable.',
  ],
  Pisces: [
    'The first impression is gentle, slightly otherworldly, and harder to pin down than most — Pisces rising has a quality of not being entirely of the moment, of existing in a slightly larger and more fluid world than the one everyone else is in.',
    'There\'s an empathy in the outer presentation that people feel immediately — the sense of being seen without being scrutinized, of the encounter being a soft place rather than a test. People open up to Pisces rising faster than they intended to.',
    'The presence has a dreamy quality that can read as vagueness and is often depth — Pisces rising processes the world through a richer internal register than the outer presentation reveals. The softness is real. So is what\'s underneath it.',
    'People feel the compassion before it\'s expressed — there\'s something in Pisces rising that communicates care instinctively, a quality of being interested in the full picture of a person rather than just the presenting surface.',
    'The impression is of someone who inhabits a different emotional frequency — not higher or lower, but quieter and wider. Being around it can feel like the noise level drops, and that is a specific and underrated gift.',
  ],
}

// ─── Venus ──────────────────────────────────────────────────────────────────

const VENUS_LOVE: Record<string, string[]> = {
  Aries: [
    'pursues what it wants directly and without waiting — there\'s an urgency to the affection here, an immediacy that can feel electric or overwhelming depending on who\'s receiving it. The approach is honest, the intention is clear, and the patience for ambiguity is limited.',
    'is bold in desire and straightforward about it — Aries Venus doesn\'t circle around what it wants or wait to be chosen. It chooses, it acts, and it moves on if the response doesn\'t match the energy it brought. The pursuit is the thing it loves most.',
    'brings heat and directness to love — the attraction is immediate, the expression of it is immediate, and the cooling, when it comes, is also immediate. This is not shallowness. It is a nature that lives at full temperature and moves through experiences completely.',
    'is most alive in early love — in the pursuit, the spark, the particular electricity of beginning. Sustaining that intensity over time is the real work, and the ones who can create new beginnings within the same relationship hold Aries Venus longest.',
    'loves through action — through showing up physically, through doing things, through demonstrating through gesture rather than word. Sitting still and feeling it isn\'t really available. The love has to go somewhere.',
    'is quick to cool when the chase is done — the love is genuine while it burns, and sometimes the burning is all there is. The ones who keep surprising Aries Venus, who keep feeling a little like the beginning, hold its attention far longer.',
  ],
  Taurus: [
    'loves slowly, completely, and with a commitment to the physical world of relationship — the shared meal, the unhurried evening, the hand held without reason. Connection here is sensory before it is anything else.',
    'is among the most steadfast in love — once Taurus Venus has decided on someone, that decision doesn\'t reverse easily. The loyalty is structural, not effortful. It doesn\'t have to work at staying. It just stays.',
    'expresses affection through presence and pleasure — through creating environments that feel good, through touch, through generosity that shows up in tangible form. The emotional language here is physical, and it is fluent.',
    'needs security as the foundation for everything else in love — not possession, but the steady knowledge that what was built yesterday is still standing today. Without that, the rest of the relationship can\'t relax into itself.',
    'takes time to commit and is not easily moved once it has — the pace is deliberate, which can frustrate people accustomed to faster emotional rhythms. What they\'re waiting for is worth waiting for.',
    'returns consistently to what it has already decided — Taurus Venus doesn\'t reinvent its feelings or revisit its commitments. Once the person has been chosen and the love established, the nature of this placement is to stay in it, to return to it, to build on it. The constancy is the expression.',
  ],
  Gemini: [
    'needs mental chemistry before anything else — the attraction that doesn\'t have a conversation behind it doesn\'t hold. Gemini Venus falls for wit, for range, for the quality of someone\'s mind in motion, and loses interest when the exchange stops being alive.',
    'loves with curiosity and keeps loving by remaining curious — the relationship that continues to surprise, to offer new angles, to reveal new things is the one that lasts. Predictability is the quiet ending of things for this placement.',
    'is playful, light-handed, and genuinely delighted by the people it loves — the affection comes through in humor, in the specific attention it pays to what makes someone laugh, in the quality of conversation it creates and returns to.',
    'needs freedom within closeness and expresses love through communication — the ongoing exchange of ideas, of observations, of what happened today and what was thought about it. Connection for Gemini Venus is maintained through words, and silence can feel like distance.',
    'can love two contradictory things about a person simultaneously, which is the Gemini gift — the ability to hold multiple truths at once extends into relationship. The complexity of real people is not a problem. It is the point.',
    'falls in love with what a person thinks, not just what they are — the attraction to intelligence, to verbal wit, to the quality of someone\'s observation is primary. Dimness, even in beautiful packaging, doesn\'t sustain interest for long.',
  ],
  Cancer: [
    'loves through memory, attentiveness, and the specific act of being seen — Cancer Venus remembers what people love, what they need, what made them happy three months ago, and shows up with it. The care is in the detail.',
    'is a nurturer in love who gives deeply and protects what it loves with real fierceness — the warmth here is genuine and extensive, and the people who have it know they have it. The protection can occasionally become possessiveness; the work is knowing the difference.',
    'needs emotional safety before it can open — Cancer Venus does not love quickly or in public. The shell comes down in stages, each one requiring proof that the trust invested was worth it. The depth that eventually becomes available is worth every stage.',
    'loves through home — through creating a private world with someone, through the rituals and rhythms that belong only to the two of them. The relationship is measured in what was built together, not in grand gestures.',
    'carries love like a living archive — every meaningful moment deposited, tended, returned to. The history of a relationship is real emotional currency for Cancer Venus, and endings are genuinely long because the archive takes time to close.',
    'expresses love through anticipation — Cancer Venus knows what the person it loves needs before they ask for it, and has often already arranged for it. The attentiveness is the love, made concrete. Being known that specifically is the gift.',
  ],
  Leo: [
    'loves with full presence and genuine drama — Leo Venus doesn\'t love quietly or partially. The warmth is total, the gestures are expressive, and the expectation of warmth returned is real. The relationship that fails to celebrate what it has will lose this placement\'s attention.',
    'needs to be the most important person in the room for the one it loves — not universally, but in the specific dynamic of the relationship. The admiration Leo Venus gives is genuine, and it needs genuine admiration returned. That\'s not ego. It\'s reciprocity.',
    'is generous in love beyond what the situation strictly requires — Leo Venus gives time, attention, and warmth in a way that makes people feel genuinely cherished. The generosity is real and it expects to be honored.',
    'loves through loyalty and creative expression — through making things for the people it cares about, through celebrating them publicly, through bringing the full force of its warmth to bear on the specific person who has been chosen.',
    'takes rejection in love very seriously — the pride that runs through this placement means that being overlooked or diminished is not easily dismissed. The wound is real, and the recovery takes longer than Leo Venus usually shows.',
    'celebrates the people it loves in public and in private, because the pride of choosing them runs all the way through — to be loved by Leo Venus is to be shown off, not as a possession but as a reflection of its own good taste. The display is sincere.',
  ],
  Virgo: [
    'loves through service and attentiveness — through noticing what needs doing and doing it, through showing up in practical ways that accumulate into something unmistakable. The affection is in the act, not in the announcement of it.',
    'expresses love carefully and precisely — Virgo Venus doesn\'t say more than it means or promise what it isn\'t sure of. The words of love, when they come, have been considered. That makes them more reliable than they would be from a placement that speaks easily.',
    'needs to be useful to the people it loves — not in a servile way, but in the specific way of a nature that finds meaning in contribution. Being needed is affirmation; being redundant is uncomfortable.',
    'is a quiet and devoted partner whose love is demonstrated through consistency — through the same quality of care showing up every day, through reliability that doesn\'t need to announce itself. The love is in the pattern, and the pattern holds.',
    'holds relationships to a high standard and holds itself to an even higher one — Virgo Venus wants to be the best partner it can be, and that aspiration can become self-criticism when the gap between intention and reality shows. The work is extending the same grace inward.',
    'corrects out of love — the criticism that comes from Virgo Venus is not cruelty. It is the language of someone who believes the person is worth improving, that the relationship is worth the difficult conversation. Understanding this doesn\'t make the critique easier to receive, but it reframes what\'s actually happening.',
  ],
  Libra: [
    'is a natural romantic who loves the whole project of being in relationship — the conversation, the shared aesthetic, the ongoing negotiation of two people building something together. Libra Venus takes partnership seriously as an art form.',
    'brings genuine grace to love — the tact, the consideration, the quality of attention that makes people feel valued and well-handled. The partner of Libra Venus often feels more understood than they have elsewhere, and that impression is accurate.',
    'needs beauty in love — not superficiality, but the specific quality of a relationship that is considered, that is tended, that has an elegance to the way two people move together. Ugliness in the dynamic — cruelty, contempt, indifference — is genuinely intolerable.',
    'gives a great deal in the pursuit of harmony and sometimes gives more than it gets — Libra Venus will smooth the friction, absorb the tension, and keep the peace in ways that eventually accumulate into imbalance. The work is knowing when the peace costs too much.',
    'is drawn to people who are beautiful in the broadest sense — who have an aesthetic intelligence, a social grace, a quality of being in the world that Libra Venus finds genuinely attractive. The attraction is never purely physical. There must be something lovely about how they move through the world.',
    'believes in the project of love more than most — Libra Venus takes relationship seriously as an ongoing work of art, as a conversation that deepens over time, as something that requires attention and craft to sustain at the level it wants. The effort is gladly given.',
  ],
  Scorpio: [
    'loves with a depth and exclusivity that most people only encounter once — Scorpio Venus doesn\'t distribute its affection broadly. When it chooses, it chooses completely, and the intensity of that choice can be the most significant thing either person has ever experienced.',
    'needs total trust before it opens — and builds that trust through testing, through observation, through the slow accumulation of evidence that the other person can be trusted with what\'s real. The patience required is real. So is what becomes available.',
    'is uncompromising in love — Scorpio Venus does not stay where the foundation is uncertain, does not tolerate betrayal, does not share what it has given to this person with anyone else. The terms are absolute because the depth is absolute.',
    'loves with a transformative quality — relationships with Scorpio Venus have a way of changing both people permanently. The encounter is not casual, even when it\'s brief. The depth leaves a mark.',
    'experiences love as a kind of alchemy — not comfortable, often not easy, but capable of producing something neither person could have become alone. The intensity is the point, and the people who can hold it are rare and recognized immediately.',
    'tests before it trusts — and the tests are rarely announced. What looks like ordinary interaction is often assessment. The score is kept, and what someone does when they don\'t know they\'re being watched matters more than what they do when they know they are.',
  ],
  Sagittarius: [
    'loves in a way that requires freedom to be real — Sagittarius Venus is genuinely warm, genuinely generous, genuinely devoted to the people it chooses, but the moment the relationship becomes a constraint, something essential goes out of it. The freedom is not negotiable.',
    'is drawn to people who expand the world rather than define the edges of it — lovers who introduce new ideas, new places, new ways of seeing. Sagittarius Venus loses interest when the relationship stops growing and starts simply maintaining.',
    'loves through honesty — sometimes to a fault. What Sagittarius Venus feels, it tends to say, and the delivery isn\'t always calibrated for the receiving. The intention is almost always respect. The execution is something to work on.',
    'brings enthusiasm and genuine warmth to love and maintains a specific lightness that other placements can find elusive — Sagittarius Venus doesn\'t love heavily. The affection is real and it breathes.',
    'needs a partner who is also a friend and an intellectual equal — someone it genuinely enjoys, not just loves. The romantic love that doesn\'t also have the friendship underneath it won\'t hold for long.',
    'loves generously and with a quality of warmth that makes people feel genuinely expanded by knowing them — the relationship with Sagittarius Venus is good for you in ways that go beyond the personal. You become more of yourself in it, not less.',
  ],
  Capricorn: [
    'approaches love with long-term intention — Capricorn Venus is not interested in connection that doesn\'t have somewhere to go. The investment it makes is real and serious, and it expects what it offers to be taken seriously in return.',
    'shows love through reliability — through being there, through doing what was said, through the steady accumulation of kept promises. The romance for Capricorn Venus is in the consistency, and the consistency is profound.',
    'takes time to open in love — not because the feeling isn\'t there, but because Capricorn Venus does not expose what it feels until it is sure the exposure is safe. The reserve is protective, not withholding. What eventually becomes available is genuine and deep.',
    'loves practically — through building something with someone, through the shared project of a life that has structure and direction and a sense of getting somewhere together. The love is in the architecture of what was made.',
    'has a warmth that very few people ever fully access — Capricorn Venus keeps it close and gives it carefully, which means the people who receive it understand they\'re holding something rare. The select few would confirm it\'s worth the wait.',
    'earns the right to love rather than simply falling — Capricorn Venus doesn\'t trust the immediate attraction or act on it without consideration. The relationship that results from this caution is more likely to hold, and the investment in it is deliberate rather than impulsive.',
  ],
  Aquarius: [
    'loves through friendship first and sees the romantic relationship as the highest expression of that — Aquarius Venus needs to genuinely like, genuinely respect, and genuinely find interesting the person it loves. Without that, the rest doesn\'t sustain.',
    'needs intellectual equality in love — a partner who thinks independently, holds their own position, and doesn\'t agree simply because it\'s easier. Aquarius Venus is attracted to someone it can argue with, learn from, and be genuinely surprised by.',
    'values freedom in love as an absolute — not freedom from commitment, but freedom within it. The relationship that allows both people to be fully themselves, separately and together, is the only kind Aquarius Venus can stay in.',
    'expresses love through ideas, through shared vision, through the ongoing exchange of what\'s being thought and discovered. The intimate conversation that keeps moving is the sustaining structure of the relationship.',
    'can be simultaneously deeply committed and emotionally self-contained — Aquarius Venus loves durably without being possessive, gives loyalty without requiring ownership. The unusual combination tends to attract people who appreciate precisely that.',
    'gives more freedom than it asks for — Aquarius Venus is genuinely tolerant of difference, genuinely unconcerned with ownership, and genuinely uninterested in monitoring a partner. The freedom it extends is the freedom it needs, and extending it is a form of respect.',
  ],
  Pisces: [
    'loves without clear edges — Pisces Venus is romantically generous, emotionally porous, and genuinely inclined toward a love that dissolves the boundary between self and other. The beauty of that is real. The difficulty of it is also real.',
    'is one of the most imaginatively romantic placements in the zodiac — Pisces Venus sees the beloved as they might become, not just as they are. That vision is both the gift and the occasional mismatch.',
    'gives in love with an openness that can outrun the structure the relationship can actually hold — the generosity is real, the feeling is genuine, and learning where the offering ends and the loss of self begins is the central love lesson.',
    'is drawn to people with depth, with difficulty, with something unresolved — there\'s a specific pull toward those who need something, and the work for Pisces Venus is loving without becoming the solution to someone else\'s problem.',
    'loves most fully when the relationship has a spiritual or creative dimension — a sense that what the two people are building together is meaningful in a way that exceeds the practical. Without that larger frame, the love can feel somehow insufficient even when everything else is right.',
    'is one of the most forgiving placements in love — not infinitely, not stupidly, but with a genuine inclination to understand the failing, to allow for the imperfection, to see the attempt behind the inadequate result. The grace extended is real, and it asks for something in return: not perfection, but the trying.',
  ],
}

// ─── Mercury ────────────────────────────────────────────────────────────────
// Written as self-contained sentences so they work with any intro phrasing.

const MERCURY_MIND: Record<string, string[]> = {
  Aries: [
    'The mind moves fast here — first impression, first response, first word. Aries Mercury trusts its initial take and acts on it before caution has a chance to arrive. That instinct is right more often than it should be.',
    'The thinking is direct and the communication even more so — Aries Mercury says what it means without the editorial pass that softer placements apply. The honesty is the feature, not the byproduct.',
    'Ideas arrive quickly and are acted on immediately — Aries Mercury has little patience for the long consideration. The decision is made and the mind has already moved to what\'s next.',
    'The mental style is combative in the best sense — Aries Mercury engages with opposition, doesn\'t back down from an argument when it believes it\'s right, and finds the back-and-forth genuinely energizing. Debate sharpens the thinking.',
    'Speed is the defining quality of the mind here — not always depth, but always velocity. Aries Mercury moves through ideas the way it moves through everything else: fast, decisive, and already thinking about what comes next.',
    'The mind reads the room before the words arrive — Aries Mercury is observationally quick, picking up on the essential feature of a situation before most people have finished orienting themselves. The conclusion tends to precede the reasoning, and the reasoning usually confirms it.',
  ],
  Taurus: [
    'The mind moves slowly and arrives at conclusions that hold — Taurus Mercury doesn\'t offer an opinion until it has one, and once it has one, the evidence required to change it is substantial. The deliberateness is not stubbornness. It is thoroughness.',
    'Thinking is sensory and concrete — Taurus Mercury processes through what is tangible, what can be demonstrated, what makes practical sense. Abstract theory without application loses the thread quickly.',
    'The communication style is measured, unhurried, and worth waiting for — Taurus Mercury doesn\'t say things it hasn\'t thought through, which means the words, when they come, carry weight. The people who\'ve learned to wait for them know this.',
    'The mind has aesthetic intelligence — Taurus Mercury thinks in texture and form as much as logic. Good ideas feel right before they can be argued, and the feeling is usually reliable.',
    'Once Taurus Mercury has formed a position, it holds it with a tenacity that can frustrate people who expect more flexibility. The stability of the thinking is the same quality that makes it trustworthy. The two things are inseparable.',
    'The thinking has an aesthetic quality — Taurus Mercury feels the rightness or wrongness of an idea before it can be fully articulated. The argument that violates the sense of proportion, the solution that doesn\'t feel right, is rejected on grounds that take longer to explain than they did to know.',
  ],
  Gemini: [
    'The mind is at home here — multiple threads held simultaneously, ideas connected across unexpected distances, a communicative ease that makes complex things feel approachable. Gemini Mercury is the most natural of all the Mercury placements.',
    'The thinking ranges widely and connects laterally — Gemini Mercury doesn\'t go deep on one thing so much as it finds the pattern across many things. The synthesis is the gift, and it is genuinely original.',
    'The communication is fast, light, and highly adaptable — Gemini Mercury reads its audience and adjusts in real time. The message arrives in whatever form the moment requires, and that flexibility is a real intelligence.',
    'The mind is curious enough about everything that focus occasionally suffers — Gemini Mercury is drawn by what\'s interesting, and interesting is everywhere. The discipline is choosing which thread to follow and staying with it long enough to get somewhere.',
    'Language is the primary sense — Gemini Mercury takes in the world through words, through conversation, through the exchange of ideas, and transmits it the same way. The quality of its thinking shows most clearly in the quality of its communication.',
    'The communicative flexibility is genuine adaptability, not performance — Gemini Mercury genuinely adjusts its framing based on who it\'s talking to, not as strategy but as natural matching. The message that lands is more important than the one that shows off.',
  ],
  Cancer: [
    'The mind thinks in feeling first and logic second — Cancer Mercury receives information through the emotional layer before the rational one, and the first impression is almost always correct. The intellectual argument is built after the intuition has already arrived.',
    'The thinking is connected to memory and shaped by it — Cancer Mercury doesn\'t approach each new situation fresh. It brings the full archive of what was felt before, and that historical context is both the depth and occasionally the limitation.',
    'Communication is most honest when it\'s emotionally direct — Cancer Mercury can be indirect when the feeling is unresolved, circling the thing rather than saying it. When it speaks from a settled place, the expression is genuine and sometimes surprising.',
    'The mind is protective of what it believes — Cancer Mercury doesn\'t argue its positions lightly, because its positions are often connected to something felt rather than merely thought. To challenge the idea is sometimes to challenge the feeling behind it.',
    'The empathy is intellectual as well as emotional — Cancer Mercury genuinely understands what other people are thinking and feeling, which makes it an unusually perceptive communicator and a reliable reader of situations.',
    'The listening is total — Cancer Mercury gives its full attention to what it hears, including what is not said, what is implied, what was careful not to be mentioned. The speaker often feels more heard than they were prepared to be.',
  ],
  Leo: [
    'The mind thinks in narrative and speaks with authority — Leo Mercury naturally takes the larger frame, the story that gives the facts their meaning. The communication style is confident, expressive, and designed to be heard.',
    'There is a quality of performance in the thinking — not dishonesty, but the native understanding that ideas need presentation, that how something is delivered affects whether it lands. Leo Mercury knows this and uses it.',
    'The communication has warmth and a quality of making the listener feel they\'re hearing something worth hearing — Leo Mercury doesn\'t speak without conviction, and the conviction is catching.',
    'The mind is drawn to what is significant — Leo Mercury thinks in terms of what matters, what lasts, what has genuine importance. The trivial holds less interest than the essential, and the conversation that stays on the surface loses attention.',
    'Pride is present in the thinking — Leo Mercury defends its ideas with something beyond intellectual argument. The position was chosen, which makes it personal, and being wrong about it takes real recovery.',
    'The communication has a quality of generosity — Leo Mercury speaks to people as though what they have to say is worth hearing, which has the effect of making it so. The conversational warmth is not manufactured. It is simply how this mind moves through exchange.',
  ],
  Virgo: [
    'The mind here is an instrument of precision — Virgo Mercury notices the flaw, the gap, the imprecision in an argument that everyone else accepted as close enough. Close enough is not the standard. The standard is correct.',
    'The thinking is analytical, methodical, and thorough to a degree that can frustrate minds that work at different speeds — Virgo Mercury doesn\'t skip steps, doesn\'t round up, doesn\'t accept approximations when the actual thing is available.',
    'Communication is careful and specific — Virgo Mercury says what it means as precisely as it can, and the experience of imprecision in others creates a friction it works to conceal but doesn\'t always manage to.',
    'The mind has a gift for craft — Virgo Mercury takes ideas seriously as things to be built and refined, not just expressed. The difference between a good sentence and the right sentence is not trivial to this placement.',
    'The inner critic applies to everything — Virgo Mercury is as rigorous about its own thinking as it is about everything else\'s, which produces excellent work and occasionally an over-examined paralysis. The willingness to let something be good enough is the lifelong negotiation.',
    'The mind learns through application rather than theory — Virgo Mercury wants to understand how something works in practice. The abstract principle without the working example loses its grip. Show it running, show it failing, show it being fixed: then the learning is real.',
  ],
  Libra: [
    'The thinking is relational — Libra Mercury naturally considers all sides before forming a position, which makes it a nuanced and fair-minded communicator and occasionally makes it very difficult to get a straight answer from.',
    'The communication style is diplomatic to the point of art — Libra Mercury can deliver difficult things in ways that soften the landing without falsifying the content. That\'s a real skill, and it\'s rarer than it sounds.',
    'The mind is aesthetically attuned — Libra Mercury cares how ideas are expressed as well as what they say. Inelegant communication bothers this placement the way a wrong note bothers a musician.',
    'The thinking takes time because every perspective deserves consideration — and Libra Mercury is honest enough to acknowledge the merit in positions it doesn\'t ultimately hold. That intellectual generosity can look like indecision. It\'s actually something more principled.',
    'The social intelligence is exceptional — Libra Mercury reads the room, calibrates the message, and finds the framing that allows difficult things to be heard. This is communication as care.',
    'The mind is socially attuned in a specific way — Libra Mercury reads the group, the dynamic, the unspoken hierarchy of what is and isn\'t okay to say, and navigates it with a precision that other placements would call instinct. It is actually a specific and developed skill.',
  ],
  Scorpio: [
    'The mind reads between the lines as its primary mode — Scorpio Mercury takes what is said, notes what wasn\'t, considers what was implied, and builds its understanding from all three. The surface version of things is where the inquiry starts, not where it ends.',
    'The thinking is strategic and private — Scorpio Mercury doesn\'t share its full analysis in the moment. What it knows, it holds. What it suspects, it confirms before mentioning. The expression is always less than the observation.',
    'Communication is deliberate and nonliteral — Scorpio Mercury chooses what to say with care and says it in ways that require attention to fully receive. The directness, when it comes, arrives with a precision that can be startling.',
    'The mind is drawn to what is hidden, suppressed, or uncomfortable — the taboo subject, the thing no one else will say directly. Scorpio Mercury goes there because that\'s where the real information is.',
    'Trust is the prerequisite for full communication — Scorpio Mercury does not give its real thinking to everyone. The outer conversation is managed; the inner one is earned. The people who have access to the genuine thought know they have something rare.',
    'The mind excels at the question that matters — Scorpio Mercury, in a room full of information, goes directly for the piece that will change the picture. The diagnostic instinct is almost clinical: the irrelevant drops away immediately, and what remains is what needs examining.',
  ],
  Sagittarius: [
    'The mind thinks in themes and searches for the principle beneath the specific — Sagittarius Mercury is not primarily interested in facts. It wants the meaning of the facts, the pattern they reveal, the larger truth they point toward.',
    'The communication is enthusiastic and expansive — Sagittarius Mercury speaks with the energy of someone who finds ideas genuinely exciting, and that energy is often catching. The conversation runs long because there is always more to explore.',
    'The thinking is honest to a fault — Sagittarius Mercury says what it actually believes without the softening pass. The directness is principled, not unkind, and the people who receive it should understand that.',
    'The mind moves from broad to specific rather than the reverse — Sagittarius Mercury starts with the horizon and works inward. The big picture is always clearer than the details, which can occasionally be a problem.',
    'The intellectual restlessness is real — Sagittarius Mercury needs the frontier of a new idea the way other placements need the security of an established one. Once the territory feels known, the attention begins to move.',
    'The learning is best when it happens through experience rather than instruction — Sagittarius Mercury retains what it has lived more than what it has been told. Travel, encounter, the friction of an actual situation: these are the real teachers.',
  ],
  Capricorn: [
    'The mind is structured, practical, and quietly authoritative — Capricorn Mercury thinks in terms of what actually works, what holds up over time, what can be built on. The theoretical that doesn\'t connect to the practical loses the thread quickly.',
    'The communication style is economical — Capricorn Mercury says what needs to be said, says it well, and stops. The preference is for precision over volume, substance over performance, the right thing over the complete thing.',
    'The thinking builds methodically — Capricorn Mercury doesn\'t rush to conclusions. The argument is assembled, examined, revised, and presented only when it can hold weight. The confidence in the final position is earned.',
    'The mind has a long memory for what was said and what was promised — Capricorn Mercury holds people to their words with a consistency that can feel like pressure and is really just the application of the same standard it applies to itself.',
    'Authority in communication is something Capricorn Mercury develops, not assumes — the credibility builds through being right reliably over time. That track record becomes its own kind of persuasion.',
    'The communication is long-term oriented — Capricorn Mercury says things it means to still be standing behind in five years. The casual exaggeration, the claim that can\'t be supported: these are not available here. What is said is meant to be accurate and to be remembered as such.',
  ],
  Aquarius: [
    'The mind arrives at conclusions from lateral angles no one else was pursuing — Aquarius Mercury doesn\'t think in the established grooves. The approach is original by nature, not by effort, and the ideas that result often require a moment to catch up to.',
    'The thinking is systemic — Aquarius Mercury understands how things connect, how systems operate, where the structure can be improved or dismantled. The individual piece is less interesting than the whole mechanism.',
    'The communication has an unusual quality — Aquarius Mercury presents ideas in framings that shift the listener\'s perspective, that make the familiar strange or the strange familiar. The best conversations with this placement leave you thinking differently.',
    'Intellectual independence is non-negotiable — Aquarius Mercury will not adopt a position because it is popular, because authority endorses it, or because it would be socially easier. The position is held because it has been arrived at honestly.',
    'The emotional content of communication is processed intellectually — Aquarius Mercury understands feelings by thinking about them, which produces real insight and occasionally a slight lag between what is felt and what is expressed.',
    'Intellectual independence is non-negotiable — Aquarius Mercury will not adopt a position because it is popular or because authority endorses it. The position is held because it was arrived at honestly. This produces original ideas and occasional overconfidence in the wrong conclusions.',
  ],
  Pisces: [
    'The mind takes in the world through impression and feeling rather than sequential logic — Pisces Mercury receives information holistically, processes it nonlinearly, and arrives at understanding through a method that is difficult to explain but usually accurate.',
    'The communication is intuitive and suggestive — Pisces Mercury speaks in images, in feeling, in the evocation of something that resists direct statement. The literal is a limited vocabulary for this placement.',
    'The thinking is porous and permeable — Pisces Mercury absorbs the ideas and emotional atmosphere around it and processes them as its own. The boundary between original thought and received impression is often unclear, which is both the gift and the challenge.',
    'The mind is attuned to what isn\'t said — Pisces Mercury hears the feeling under the word, the intention beneath the content, the thing that was meant but not expressed. This makes it a compassionate listener and a sometimes uncanny communicator.',
    'Creativity is the natural output of this Mercury — the mind that processes nonlinearly produces nonlinear results. The connection between ideas that Pisces Mercury makes isn\'t always explainable, but it\'s often more insightful than the explainable kind.',
    'The mind thinks in images and feeling-tones as much as in words — Pisces Mercury often arrives at something true and has to work backward to the words that describe it. The thinking moves by resonance and association, and the result is sometimes more accurate than the path would suggest.',
  ],
}

// ─── Mars ───────────────────────────────────────────────────────────────────

const MARS_DRIVE: Record<string, string[]> = {
  Aries: [
    'moves toward what it wants with a directness that skips the middle steps — the impulse and the action arrive almost simultaneously. The energy is raw, real, and rarely patient with obstacles. The obstacles don\'t last.',
    'acts before the analysis is complete — which is sometimes the flaw and sometimes the only way anything worth doing ever gets started. The instinct is fast and it is usually pointing the right direction.',
    'pursues with heat and immediacy — this Mars is at its best when the stakes are high and the timeline is short. Extended campaigns bring diminishing returns; the sprint is the native mode.',
    'burns fastest at the beginning — the ignition is extraordinary, the initial push is formidable, and sustaining the original intensity over the long middle is the specific challenge this placement is always working on.',
    'channels energy through competition and challenge — this Mars needs the resistance of something to push against. Without friction, the drive has nowhere to sharpen. The opponent is almost a requirement.',
    'moves through opposition without internalizing it — Aries Mars can sustain conflict without being poisoned by it. The argument happens, the obstacle is encountered, and the energy moves to what\'s next. The residue is minimal.',
  ],
  Taurus: [
    'builds slowly with relentless follow-through — not the fastest to start, but once committed, the pace is steady and the stopping point is completion. The finish is almost always certain once the beginning has been chosen.',
    'pursues through sustained effort rather than intensity — not a sprint but a long walk toward something it decided was worth getting. The patience is structural, not practiced. It simply does not stop.',
    'holds what it has with more conviction than it reaches for what it doesn\'t — the drive is protective as much as acquisitive, and once something is decided on, it rarely lets go.',
    'is nearly impossible to discourage once committed — the stubbornness that is occasionally a social liability is, in the context of drive and pursuit, one of the most effective qualities in the zodiac. It doesn\'t take the bait of setbacks.',
    'channels energy into building and accumulating over time — the interest is not in the dramatic win but in the durable one. This Mars wants something that will still be standing in ten years, and it works accordingly.',
    'recovers from setbacks at the pace it does everything else — slowly, completely, without drama. The disruption is absorbed, the ground is found again, and the movement resumes. The interruption doesn\'t change the direction.',
  ],
  Gemini: [
    'channels drive through adaptability and speed of mind — Gemini Mars is at its best when the situation is fluid and the advantage goes to whoever can read and respond fastest. In those conditions, it excels.',
    'pursues multiple things simultaneously with genuine energy going to each — the capacity to keep all of them moving at once is a real skill. The challenge is knowing which one to finish.',
    'uses communication and intelligence as the primary instruments of drive — Gemini Mars out-talks, out-thinks, and out-maneuvers before it out-muscles. The energy goes into the argument, the strategy, the angle.',
    'pursues in bursts — the energy peaks, produces, moves on. The rhythm isn\'t inconsistent; it\'s cyclical. Gemini Mars delivers in waves and needs variety between them to come back to full power.',
    'is most effective in fast-changing environments where the advantage goes to whoever is most mentally agile — slow, stable situations drain the energy. Give it a room where nothing stays the same for long, and everything changes.',
    'loses interest in what it fully understands — the challenge that has been mastered is the challenge that loses its charge. Gemini Mars is driven most effectively by what hasn\'t been figured out yet. The mystery is the fuel.',
  ],
  Cancer: [
    'fights hardest for the people it loves — Cancer Mars reserves its deepest drive for what it has decided to protect. The passion is personal, the commitment is fierce, and it will go further for someone else than it would for itself.',
    'pursues indirectly — Cancer Mars doesn\'t always move in a straight line toward what it wants, especially when the goal is emotionally charged. The approach is lateral, patient, and often more effective than it looks.',
    'channels drive through emotional motivation — the goal that doesn\'t connect to something felt doesn\'t sustain this placement for long. The ambition needs a human center to stay alive.',
    'is protective in its drive — what Cancer Mars pursues, it pursues partly to secure something for the people it cares about. The career, the resources, the position are all in service of the private world it is building.',
    'has a drive that runs deeper than it usually shows — Cancer Mars doesn\'t advertise its ambition or its intensity. The exterior is often softer than the interior, and the people who underestimate it rarely get a second chance.',
    'has a long memory for what it has protected and what it has failed to — Cancer Mars holds the history of what it has fought for and what it lost, and that history informs the present drive in ways that aren\'t always obvious. The past is not the past here. It is the context.',
  ],
  Leo: [
    'pursues with drama and full commitment — Leo Mars needs the goal to be worth the effort, and when it decides something is worth it, the energy it brings is extraordinary. The pursuit is never understated.',
    'channels drive through creative expression and the need to be recognized — Leo Mars works hardest when the work will be seen, when the effort will be acknowledged, when the result will matter to more than just itself.',
    'has a competitive spirit that requires an audience — the performance of drive is part of the drive itself. Being witnessed in the pursuit is not vanity; it is the fuel.',
    'pursues with generosity — Leo Mars brings others along, creates opportunities for people it cares about, and leads through the force of its own enthusiasm. The drive is personal and it is also inclusive.',
    'holds itself to a standard of excellence that is partly about pride and partly about genuine quality — Leo Mars wants to do things that will last, that will mean something, that it can stand behind completely.',
    'is energized by love and loyalty — when Leo Mars is fighting for someone who has proven themselves worth fighting for, the energy is inexhaustible. The cause with a face, the effort with an audience that matters: these unlock this placement\'s full capacity.',
  ],
  Virgo: [
    'achieves through careful, sustained effort applied to the right things — Virgo Mars doesn\'t waste energy. The drive is directed, purposeful, and almost never without a plan. The efficiency is the point.',
    'pursues through mastery — Virgo Mars wants to be excellent, not just successful, and the distinction matters. The goal is to do the thing right, all the way right, and then find where it can be improved.',
    'channels drive into detail and process — the gap between what is and what could be is where Virgo Mars lives and works. The incremental improvement, applied consistently, is how this placement moves mountains.',
    'is tireless in the service of things it believes are worth doing — no glamour or recognition required to sustain the effort. The work itself, done properly, is the reward. The stamina for unglamorous labor is extraordinary.',
    'applies the same critical standard to its own performance that it applies to everything else — which produces excellent outcomes and a persistent feeling that the excellent is not yet good enough. The bar keeps moving, and Virgo Mars keeps reaching it.',
    'turns anxiety into productivity — Virgo Mars doesn\'t sit still with what\'s unresolved. The energy goes into addressing the problem, fixing the thing, making the situation better rather than simply enduring it. The worry converts directly into action.',
  ],
  Libra: [
    'channels energy through strategy and finesse — Libra Mars prefers the elegant solution over the forceful one, the negotiated outcome over the contested one. The drive is real; the method is diplomatic.',
    'pursues through partnership — Libra Mars is most effective when it has a collaborator, when the drive is shared, when the goal is something both people are moving toward together. Solo pursuit is possible but less natural.',
    'applies the drive to questions of justice and fairness — Libra Mars comes alive most fully when fighting for something that ought to be right and isn\'t yet. The conviction that things should be fair makes this one of the more motivated Mars placements when the cause is clear.',
    'avoids direct confrontation by instinct and compensates with patience and strategy — Libra Mars will wait for the right moment, build the right conditions, and then move with a precision that more aggressive placements don\'t manage.',
    'channels drive into aesthetics and creation — Libra Mars pursues beauty as seriously as other placements pursue power. The making of something excellent, something graceful, something that looks the way it should: that is worth real effort.',
    'is most effective in partnership — the drive doubles in the context of a genuine collaborator. Libra Mars finds the pursuit of a shared goal more motivating than solo ambition, and the synergy it can achieve with the right counterpart is one of the more underrated qualities in the zodiac.',
  ],
  Scorpio: [
    'pursues with quiet, total intensity — Scorpio Mars doesn\'t announce what it\'s after, doesn\'t telegraph its timeline, and doesn\'t stop when the going gets difficult. The drive is underground and relentless.',
    'channels energy into depth and transformation — Scorpio Mars goes where others won\'t, stays longer than they would, and comes back changed in ways that accumulate into something formidable over time.',
    'plays the long game with an intuitive understanding of power — when to press, when to wait, when to reveal, when to conceal. The strategic patience is not calculation. It\'s perception.',
    'is most effective when the goal is worth everything — not equally motivated by all pursuits, but when something is decided to matter completely, the energy it can sustain is extraordinary and rarely matched.',
    'uses information and insight as instruments of drive — the pursuit runs through understanding. The people and situations being navigated are known deeply, and that knowledge becomes the real competitive advantage.',
    'doesn\'t forgive what stands between it and the goal — the obstacle is noted, worked around or through, and catalogued. Scorpio Mars has a specific memory for what blocked it and tends to ensure it doesn\'t get blocked the same way twice.',
  ],
  Sagittarius: [
    'chases what excites with enthusiasm that can look like recklessness from the outside — it\'s actually a native comfort with the risk of the unknown. The bigger the stakes, the more this placement comes alive.',
    'channels drive through meaning — Sagittarius Mars can sustain effort almost indefinitely when it believes in the purpose. Take the meaning away and the energy goes with it. The why is the fuel.',
    'pursues freedom as one of its primary drives — not just personal freedom, but the freedom to explore, to expand, to move in the direction of the interesting thing. That need shapes everything.',
    'is most effective when there is real distance to cross — Sagittarius Mars is built for the long journey more than the short sprint. The destination matters, the belief that it\'s worth reaching matters, and the commitment to keep moving matters most.',
    'brings fire and philosophy to the pursuit — Sagittarius Mars doesn\'t just want to win. It wants the winning to mean something, to be part of a larger story it can believe in. The ambition has an idealism in it that doesn\'t go away.',
    'has a drive that requires belief — the effort that doesn\'t have a larger purpose behind it cannot sustain this placement for long. Point Sagittarius Mars at something it genuinely believes in, and the energy is consistent and surprising. Point it at something it doesn\'t, and the tank empties faster than anyone expected.',
  ],
  Capricorn: [
    'builds toward long-term goals with a strategic patience that other placements find difficult to sustain — Capricorn Mars knows that the real competitive advantage is time, and it is willing to use all of it.',
    'channels drive into ambition that is structural and durable — not the hot pursuit of the immediate prize, but the deliberate construction of something that will be standing long after the effort is forgotten.',
    'doesn\'t quit — this is the most defining quality of Capricorn Mars. The obstacles are real, the timeline is long, the recognition may be slow to arrive. None of that changes the direction or the pace.',
    'pursues with quiet authority — Capricorn Mars doesn\'t announce its ambitions or advertise its methods. It simply moves, consistently, toward the thing it decided was worth getting, and it tends to get it.',
    'applies drive to the mastery of its domain — Capricorn Mars wants to be genuinely excellent at whatever it has committed to, and will put in the time that genuine excellence requires. The credential is the proof of work, not the point.',
    'uses restraint as a strategy — Capricorn Mars knows that the measured response, the contained ambition, the energy held in reserve, is often the most effective approach. The patience is not passivity. It is preparation.',
  ],
  Aquarius: [
    'channels drive into ideas and collective causes — Aquarius Mars fights for things that matter to more than just itself, and that purpose gives the energy a quality and endurance it wouldn\'t have in purely personal pursuit.',
    'pursues through innovation — Aquarius Mars finds existing solutions less interesting than better ones, and the drive to improve systems, to challenge what\'s accepted, to find the approach no one else was using, is real and sustained.',
    'brings a disruptive quality to drive — Aquarius Mars breaks what needs breaking, challenges what needs to be questioned, and refuses to sustain effort toward goals it has decided are wrong. The energy goes to the real thing or not at all.',
    'is most effective when the goal is unconventional — Aquarius Mars is motivated by the edge cases, the unsolved problems, the directions that conventional ambition doesn\'t take. Point it at the frontier and it goes.',
    'sustains effort through intellectual conviction more than emotion — Aquarius Mars needs to believe the goal is correct. Once that conviction is in place, the drive is steady. Challenge the conviction, and the energy doesn\'t just slow; it pivots.',
    'is energized by causes more than competitions — the drive that comes from wanting to improve something for everyone is more sustainable than the drive to beat someone specific. Aquarius Mars is at its most effective when the goal is collective.',
  ],
  Pisces: [
    'acts most powerfully when moved by something larger than itself — Pisces Mars draws its deepest energy from creative vision, from compassion, from the sense that the effort serves something beyond the personal. Without that frame, the drive is harder to access.',
    'pursues through intuition rather than plan — Pisces Mars follows the feeling of where to go next, and the feeling is often right in ways that strategic analysis wouldn\'t have reached. The path emerges rather than being chosen.',
    'channels drive through creative and spiritual expression — the Mars energy finds its natural form in art, in service, in the making of things that have meaning. The pursuit that has beauty in it sustains this placement; the purely material one eventually doesn\'t.',
    'is gentle in drive and formidable in perseverance — the ambition doesn\'t announce itself or compete visibly, but the direction holds long after more aggressive approaches have burned out.',
    'has a drive that is sensitive to the emotional environment — Pisces Mars works best in conditions of support and meaning, and least effectively when the atmosphere is harsh or the goal feels hollow. The context is never irrelevant.',
    'is easily discouraged by atmosphere and energized by beauty — the space in which Pisces Mars works is not incidental to how it works. Create the right conditions — the right people, the right feeling in the room — and the energy is surprising.',
  ],
}

const MARS_HOUSE_CONTEXT: Record<number, string> = {
  1:  'Mars in the 1st house puts that drive on immediate display... assertiveness and competitive energy are part of their presence from the first moment.',
  2:  'Mars in the 2nd channels energy into building material security... they work hard for what they value and defend it with conviction.',
  3:  'Mars in the 3rd drives through communication and ideas... they argue well, think fast, and bring competitive energy to every conversation.',
  4:  'Mars in the 4th channels drive into home, family, and private life... they protect their inner circle with uncommon intensity.',
  5:  'Mars in the 5th brings competitive energy into creative expression and passion... they pursue their art and their loves with equal intensity.',
  6:  'Mars in the 6th channels drive into work and daily discipline... their edge shows up in how hard they work and how consistently they improve.',
  7:  'Mars in the 7th channels energy into relationships and one-on-one dynamics... they bring intensity to their closest partnerships and are drawn to strong counterparts.',
  8:  'Mars in the 8th channels drive into transformation and the pursuit of what lies beneath the surface... one of the most intense Mars placements in the chart.',
  9:  'Mars in the 9th drives toward meaning, expansion, and exploration... they pursue knowledge, experience, and big ideas with genuine fire.',
  10: 'Mars in the 10th places competitive drive squarely in career and public life... ambition is visible and is one of their defining public qualities.',
  11: 'Mars in the 11th channels energy into community, activism, and collective goals... they fight for their people and their vision.',
  12: 'Mars in the 12th works beneath the surface... their drive is private and often internalized, surfacing most powerfully in solitude or under pressure.',
}

// ─── Chart-wide patterns ────────────────────────────────────────────────────

const DOMINANT_ELEMENT_NOTE: Record<string, ((firstName: string) => string)[]> = {
  Fire: [
    (n) => `The chart leans toward Fire, giving ${n} a native restlessness and an impulse to act, lead, and create that runs through everything they do.`,
    (n) => `Fire runs through this chart — ${n} is most alive when moving, making, leading. The restlessness is the engine, and the engine doesn't idle.`,
    (n) => `The chart is predominantly Fire — action, vision, and the refusal to wait are the threads connecting everything ${n} brings to the world.`,
  ],
  Earth: [
    (n) => `Earth dominates the chart, grounding ${n}'s nature in practicality and patience... they build steadily and bring durability to everything they touch.`,
    (n) => `The chart speaks through Earth — ${n} is most at home in the tangible, the reliable, the thing that was built over time and holds.`,
    (n) => `Earth runs through this chart, giving ${n} a foundation that holds even when everything around it doesn't. The patience here is structural.`,
  ],
  Air: [
    (n) => `The chart speaks primarily through Air... ${n} is most alive when ideas are flowing, connections are forming, and the conversation is genuinely alive.`,
    (n) => `Air dominates this chart — ${n} lives in the exchange of ideas, the connection between concepts, the ongoing conversation that never quite stops.`,
    (n) => `The chart is primarily Air — thinking, communicating, and connecting are not what ${n} does, they are what ${n} is.`,
  ],
  Water: [
    (n) => `Water runs deep in this chart... emotional intelligence, intuition, and a capacity for genuine empathy are the threads running through everything ${n} does.`,
    (n) => `The chart runs through Water — everything ${n} does is shaped, at some level, by what is felt first. The emotional intelligence here is not a quality; it is the foundation.`,
    (n) => `Water dominates this chart, giving ${n} a depth of feeling and perception that informs everything, even the things that look entirely practical on the surface.`,
  ],
}

const DOMINANT_MODALITY_NOTE: Record<string, ((firstName: string) => string)[]> = {
  Cardinal: [
    (n) => `Cardinal energy is prominent throughout the chart, marking ${n} as someone who initiates, who starts things, who rarely waits for permission to begin.`,
    (n) => `The chart is Cardinal at its core — ${n} moves first. The instinct to begin, to initiate, to set things in motion is not a strategy; it is the nature.`,
    (n) => `Cardinal energy runs through the chart, and with it a specific restlessness with inertia. ${n} doesn't wait for the right conditions — ${n} creates them.`,
  ],
  Fixed: [
    (n) => `Fixed energy runs through the chart, giving ${n} extraordinary staying power and a depth of commitment that is rare... once decided, they are difficult to move.`,
    (n) => `The chart is predominantly Fixed — what ${n} commits to, ${n} holds. The endurance here is not cultivated; it is native.`,
    (n) => `Fixed energy runs through this chart, and what that means in practice is staying power that outlasts almost everything it encounters. ${n} doesn't pivot. ${n} finishes.`,
  ],
  Mutable: [
    (n) => `Mutable energy predominates, pointing to a nature built for adaptation and reinvention... ${n}'s life is likely shaped by phases, transitions, and the ongoing process of becoming.`,
    (n) => `The chart is Mutable throughout — ${n} is built to adapt, to move between phases, to find the shape that fits the moment. The reinvention is not crisis; it is the method.`,
    (n) => `Mutable energy runs through the chart, making ${n} more fluid than fixed, more responsive than rigid. The life is shaped by change, and ${n} knows how to use it.`,
  ],
}

const RISING_CLOSINGS: string[] = [
  'This is the lens through which the rest of the chart is filtered — the first impression before anyone knows the full story.',
  'The rest of the chart unfolds from behind this — everything else takes longer to arrive.',
  'This is what the world gets first. What comes next requires time, and the willingness to look past the initial read.',
]

// Structural-phrase pools. These exist to break the duplicate-content
// fingerprint Google's shingled detector picks up across the 50K
// template bios. Every bio used to open the Sun paragraph with the same
// "X's chart opens with a Y Sun" string, the Moon paragraph with
// "Beneath the surface, a Y Moon", etc. — five connective patterns
// repeated verbatim ~50K times each is a textbook scaled-content
// fingerprint regardless of how much the per-sign trait sentences vary.
//
// Each pool below returns the full lead-in for a paragraph; the picker
// rotates by name hash so the same celeb is always rendered the same
// way (stable URLs) but different celebs hit different phrasings.

// Sun paragraph lead-in. With birth time → includes house anchoring.
// Without birth time → simpler version, no house reference.
const SUN_LEADS_TIMED: ((name: string, sign: string, article: string, ord: string, p: Pronouns) => string)[] = [
  (n, s, a, o, p) => `${n}'s chart opens with ${a} ${s} Sun in the ${o} house —`,
  (n, s, a, o, p) => `At the center of ${n}'s chart sits ${a} ${s} Sun, anchored in the ${o} house —`,
  (n, s, a, o, p) => `The core of the chart is ${a} ${s} Sun placed in the ${o} house —`,
  (n, s, a, o, p) => `${n} carries ${a} ${s} Sun in the ${o} house, and with it`,
  (n, s, a, o, p) => `The chart's center of gravity — ${a} ${s} Sun in the ${o} house — points to`,
  (n, s, a, o, p) => `Beginning with the Sun: ${a} ${s} placement in the ${o} house gives ${n}`,
  (n, s, a, o, p) => `The Sun sits in ${s} for ${n}, planted firmly in the ${o} house — meaning`,
]

const SUN_LEADS_UNTIMED: ((name: string, sign: string, article: string, p: Pronouns) => string)[] = [
  (n, s, a, p) => `${n}'s natal chart is anchored by ${a} ${s} Sun —`,
  (n, s, a, p) => `${a.charAt(0).toUpperCase() + a.slice(1)} ${s} Sun is the foundation of ${n}'s chart —`,
  (n, s, a, p) => `${n} carries ${a} ${s} Sun, which speaks to`,
  (n, s, a, p) => `The Sun lands in ${s} for ${n}, giving`,
  (n, s, a, p) => `At the heart of ${n}'s chart is ${a} ${s} Sun —`,
  (n, s, a, p) => `${n}'s solar signature falls in ${s} —`,
]

// Moon paragraph lead-in. Connects to the trait sentence.
const MOON_LEADS_TIMED: ((sign: string, article: string, ord: string) => string)[] = [
  (s, a, o) => `Beneath the surface, ${a} ${s} Moon in the ${o} house —`,
  (s, a, o) => `On the emotional side of the chart, ${a} ${s} Moon sits in the ${o} house —`,
  (s, a, o) => `The Moon — placed in ${s}, in the ${o} house — registers`,
  (s, a, o) => `Inwardly, ${a} ${s} Moon anchored in the ${o} house speaks to`,
  (s, a, o) => `The interior register: ${a} ${s} Moon in the ${o} house, which means`,
  (s, a, o) => `Below the public surface sits ${a} ${s} Moon in the ${o} house —`,
  (s, a, o) => `The private emotional life runs through ${a} ${s} Moon in the ${o} house —`,
]

const MOON_LEADS_UNTIMED: ((sign: string, article: string) => string)[] = [
  (s, a) => `Beneath the surface, ${a} ${s} Moon —`,
  (s, a) => `The Moon falls in ${s}, suggesting`,
  (s, a) => `On the emotional side, ${a} ${s} Moon shapes`,
  (s, a) => `Inwardly, ${a} ${s} Moon speaks to`,
  (s, a) => `The private register of the chart is ${a} ${s} Moon —`,
  (s, a) => `${a.charAt(0).toUpperCase() + a.slice(1)} ${s} Moon governs the interior life:`,
]

// Rising paragraph lead-in.
const RISING_LEADS: ((firstName: string, sign: string) => string)[] = [
  (f, s) => `The world meets ${f} through ${s} rising.`,
  (f, s) => `${f} arrives in rooms as ${s} rising —`,
  (f, s) => `First impressions of ${f} are filtered through ${s} on the Ascendant.`,
  (f, s) => `${s} on the Ascendant shapes how ${f} lands with strangers.`,
  (f, s) => `The Rising sign is ${s}, which means people meet ${f} as`,
  (f, s) => `What the world sees first of ${f} is ${s} rising —`,
  (f, s) => `${f}'s outer presentation runs through ${s} on the Ascendant.`,
]

// Mars paragraph lead-in. Each must end with a noun/subject that takes
// the trait verb (traits start with third-person verbs like "moves...",
// "builds...", "pursues...", so the lead must terminate at a grammatical
// subject for that verb).
const MARS_LEADS: ((firstName: string) => string)[] = [
  (f) => `When it comes to drive and pursuit, ${f}`,
  (f) => `On the question of drive, ${f}`,
  (f) => `${f}'s Mars`,
  (f) => `Mars in this chart`,
  (f) => `In the realm of ambition and action, ${f}`,
  (f) => `${f} — when it comes to pursuit —`,
  (f) => `The chart's Mars`,
]

// ─── Category-aware framing — multiple variants, picked by name hash ─────────
// Framing sentences use gendered pronouns; lookup tables above stay neutral (they/their).
// This produces a natural mix throughout the bio.

type OpenerFn      = (name: string, p: Pronouns) => string
type VenusIntroFn  = (firstName: string, sign: string, p: Pronouns) => string
type MercuryIntroFn = (firstName: string, sign: string, p: Pronouns) => string

const CATEGORY_OPENERS: Record<CategoryBucket, OpenerFn[]> = {
  performer: [
    (n, p) => `Astrologically, ${n}'s chart illuminates the qualities behind ${p.their} artistry and presence...`,
    (n, p) => `The birth chart of ${n} is a portrait of the person behind the performance — revealing the drives, gifts, and inner world behind ${p.their} art and creative life...`,
    (n, p) => `Read through an astrological lens, ${n}'s chart reveals the qualities that define ${p.their} presence — in every room, on every stage, in every creative act...`,
    (n, p) => `Astrology doesn't explain talent — but ${n}'s chart does illuminate the qualities that shaped ${p.their} creative life and the nature behind the art...`,
    (n, p) => `${n}'s birth chart reveals the inner architecture beneath the public persona — the planetary drives and patterns that quietly shape ${p.their} work...`,
    (n, p) => `Looking at ${n} through the chart: the planetary configuration tells a coherent story about how ${p.they} ${p.they === 'they' ? 'arrive' : 'arrives'} on stage, in front of the camera, in the room...`,
    (n, p) => `For a performer, ${n}'s chart is unusually legible — every major placement points to a specific dimension of how ${p.they} ${p.they === 'they' ? 'show' : 'shows'} up creatively...`,
    (n, p) => `What the chart reveals about ${n}: the temperament beneath the artistry, the drives that shape the work, the private register behind the public one...`,
    (n, p) => `${n}'s planetary makeup tells a story worth reading — the chart maps the inner sources of the presence, the artistry, and the unmistakable voice...`,
    (n, p) => `Behind the artistry of ${n} sits a chart with distinct signatures — patterns that don't predict the career so much as describe the person living it...`,
  ],
  athlete: [
    (n, p) => `Astrologically, ${n}'s chart speaks to the drives and discipline behind ${p.their} athletic life...`,
    (n, p) => `The birth chart of ${n} reveals a clear pattern of drive, physicality, and competitive instinct — the astrological blueprint beneath the performance...`,
    (n, p) => `Read through an astrological lens, ${n}'s chart illuminates the inner drives that shaped ${p.their} competitive nature and athletic career...`,
    (n, p) => `Astrology offers a window into ${n}'s competitive edge — the planetary patterns that quietly shaped ${p.their} approach to discipline, focus, and pursuit...`,
    (n, p) => `${n}'s birth chart maps the inner terrain behind the athlete — the drives, temperament, and planetary signatures that run beneath the surface of ${p.their} career...`,
    (n, p) => `For an athlete, ${n}'s chart reads like a useful diagnostic — the Mars, the Sun, the modal balance all pointing to how ${p.they} ${p.they === 'they' ? 'compete' : 'competes'}...`,
    (n, p) => `The chart of ${n} is, among other things, a study of competitive temperament — the way drive arrives, holds, and converts into performance...`,
    (n, p) => `What ${n}'s planetary configuration reveals: the discipline beneath the technique, the temperament that decides what happens under pressure...`,
    (n, p) => `${n}'s natal chart describes an athlete from the inside out — the will, the will's source, and the patterns of work that turn talent into result...`,
    (n, p) => `Looking at the planetary signatures behind the athlete: ${n}'s chart points to a specific shape of drive that runs through ${p.their} career...`,
  ],
  leader: [
    (n, p) => `Astrologically, ${n}'s chart reveals the qualities behind ${p.their} leadership and public influence...`,
    (n, p) => `The birth chart of ${n} is a study in the planetary patterns that shaped ${p.their} vision, authority, and public life...`,
    (n, p) => `Read through an astrological lens, ${n}'s chart offers a portrait of the inner qualities that drove ${p.their} rise and shaped ${p.their} approach to power...`,
    (n, p) => `Astrology doesn't predict leadership — but ${n}'s chart does illuminate the temperament, ambition, and blind spots that shaped ${p.their} public life...`,
    (n, p) => `${n}'s birth chart maps the inner architecture behind the public figure — the planetary drives that shaped ${p.their} leadership style, presence, and legacy...`,
    (n, p) => `For a public figure, ${n}'s chart is worth reading carefully — the placements describe how authority is wielded, where conviction comes from, what the temperament does under pressure...`,
    (n, p) => `Beneath the public role sits the private chart: ${n}'s planetary configuration points to specific instincts about power, responsibility, and the shape of a public life...`,
    (n, p) => `What ${n}'s chart reveals about leadership: the source of the conviction, the texture of the ambition, the places where the temperament will hold and where it will give...`,
    (n, p) => `${n}'s planetary blueprint reads like a study in public-facing character — the authority, the style of command, the way the figure inhabits the role...`,
    (n, p) => `Looking at ${n} through the chart: the leadership style isn't accidental. The planetary patterns describe a specific temperament for being out front...`,
  ],
  creative: [
    (n, p) => `Astrologically, ${n}'s chart offers insight into the creative vision and process behind ${p.their} work...`,
    (n, p) => `The birth chart of ${n} is a window into the inner world that feeds ${p.their} creative life — the planetary patterns behind the voice, the vision, and the work...`,
    (n, p) => `Read astrologically, ${n}'s chart illuminates the drives, sensibilities, and inner tensions that shape ${p.their} creative practice...`,
    (n, p) => `Astrology offers a useful lens for understanding ${n}'s creative nature — the planetary signatures that quietly inform ${p.their} perspective and process...`,
    (n, p) => `${n}'s birth chart maps the interior landscape that feeds the work — the planetary patterns that shaped ${p.their} artistic sensibility and creative voice...`,
    (n, p) => `For a creative life, ${n}'s chart is unusually descriptive — the placements point to a specific way of receiving the world and shaping it into work...`,
    (n, p) => `The chart of ${n} reads as the inner ecology of the work — the sources of vision, the discipline that gives it form, the sensibility that makes it distinct...`,
    (n, p) => `What ${n}'s planetary makeup describes: the temperament behind the work, the lens through which the world arrives, the inner conditions for what gets made...`,
    (n, p) => `${n}'s natal chart maps a creative interior — the planets in their houses sketch the inner shape from which the work emerges...`,
    (n, p) => `Behind ${n}'s creative output sits a chart with distinct signatures — placements that describe the sensibility, the process, the private rooms where the work begins...`,
  ],
  default: [
    (n, p) => `Astrologically, ${n}'s chart offers a window into the inner drives, emotional life, and outward expression that define this personality...`,
    (n, p) => `The birth chart of ${n} is a map of the inner world — the planetary patterns that quietly shaped ${p.their} personality, drives, and the life ${p.they} built...`,
    (n, p) => `Read through an astrological lens, ${n}'s chart reveals the temperament, drives, and emotional patterns that run beneath the surface...`,
    (n, p) => `Astrology offers a nuanced portrait of ${n} — the planetary blueprint behind the way ${p.they} think${p.v}, feel${p.v}, connect${p.v}, and pursue what matters to ${p.them}...`,
    (n, p) => `${n}'s birth chart maps the inner terrain — the planets, signs, and houses that shaped ${p.their} nature and set the tone for ${p.their} life...`,
    (n, p) => `Looking at ${n} through the chart: a particular shape of temperament, a specific rhythm of feeling, a distinct way of arriving in the world...`,
    (n, p) => `What the chart reveals about ${n}: the planetary configuration is coherent in a way that points to a specific person, with a specific way of moving through ${p.their} life...`,
    (n, p) => `${n}'s natal chart is, in the most useful sense, a diagnostic — the placements describe how the personality is organized, where it draws energy, where it spends it...`,
    (n, p) => `The planetary blueprint of ${n} describes someone with a recognizable signature — the kind of presence, the kind of mind, the kind of inner life that the chart points to specifically...`,
    (n, p) => `${n}'s chart, read as a whole, sketches a particular human shape — the temperament beneath the surface, the patterns that organize the emotional life, the drives that pull the life forward...`,
  ],
}

const VENUS_INTROS: Record<CategoryBucket, VenusIntroFn[]> = {
  performer: [
    (f, s, p) => `Away from the spotlight, ${f}'s Venus in ${s}`,
    (f, s, p) => `Off stage, ${f}'s Venus in ${s}`,
    (f, s, p) => `In ${p.their} personal life, ${f}'s Venus in ${s}`,
  ],
  athlete: [
    (f, s, p) => `Off the field, ${f}'s Venus in ${s}`,
    (f, s, p) => `Away from competition, ${f}'s Venus in ${s}`,
    (f, s, p) => `In ${p.their} personal relationships, ${f}'s Venus in ${s}`,
  ],
  leader: [
    (f, s, p) => `In personal relationships and private life, ${f}'s Venus in ${s}`,
    (f, s, p) => `Away from the public eye, ${f}'s Venus in ${s}`,
    (f, s, p) => `In ${p.their} private relationships, ${f}'s Venus in ${s}`,
  ],
  creative: [
    (f, s, p) => `In both ${p.their} personal life and creative relationships, ${f}'s Venus in ${s}`,
    (f, s, p) => `Away from the work, ${f}'s Venus in ${s}`,
    (f, s, p) => `In matters of love and connection, ${f}'s Venus in ${s}`,
  ],
  default: [
    (f, s, p) => `In matters of love and connection, ${f}'s Venus in ${s}`,
    (f, s, p) => `When it comes to relationships, ${f}'s Venus in ${s}`,
    (f, s, p) => `In ${p.their} personal life, ${f}'s Venus in ${s}`,
  ],
}

const MERCURY_INTROS: Record<CategoryBucket, MercuryIntroFn[]> = {
  performer: [
    (f, s, p) => `The way ${f} processes ideas and communicates carries the signature of Mercury in ${s}.`,
    (f, s, p) => `Mercury in ${s} shapes ${p.their} thinking and creative communication.`,
    (f, s, p) => `As a creative figure, ${f}'s Mercury in ${s} leaves its mark on the way ${p.their} mind takes in and expresses ideas.`,
  ],
  athlete: [
    (f, s, p) => `${f}'s mental approach to competition and strategy reflects Mercury in ${s}.`,
    (f, s, p) => `Mercury in ${s} shapes how ${f} reads situations and makes decisions under pressure.`,
    (f, s, p) => `The mind behind the athlete is Mercury in ${s} — a signature of how ${f} thinks and processes the game.`,
  ],
  leader: [
    (f, s, p) => `As a public figure, ${f}'s communication style carries the mark of Mercury in ${s}.`,
    (f, s, p) => `Mercury in ${s} is the signature of how ${f} thinks, speaks, and persuades.`,
    (f, s, p) => `The intellectual fingerprint behind ${f}'s public voice is Mercury in ${s}.`,
  ],
  creative: [
    (f, s, p) => `The way ${f} processes ideas and approaches ${p.their} craft reflects Mercury in ${s}.`,
    (f, s, p) => `Mercury in ${s} shapes the lens through which ${f} takes in and translates the world.`,
    (f, s, p) => `The mind behind the work is Mercury in ${s} — the signature of how ${f} thinks and creates.`,
  ],
  default: [
    (f, s, p) => `${f}'s mind and communication style carry the signature of Mercury in ${s}.`,
    (f, s, p) => `Mercury in ${s} shapes how ${f} thinks and communicates — the lens through which the world gets to know ${p.them}.`,
    (f, s, p) => `The mental signature behind ${f}'s voice and perspective is Mercury in ${s}.`,
  ],
}

// ─── Main generator ──────────────────────────────────────────────────────────

export interface BioOptions {
  hasBirthTime?: boolean
  shortBio?: string
  category?: string | null
  gender?: 'm' | 'f' | null
}

export function generateCelebrityBio(name: string, chart: BirthChartData, options: BioOptions = {}): string {
  const { hasBirthTime = false, shortBio, category, gender = null } = options
  const bucket = getCategoryBucket(category)
  const p = getPronouns(gender)

  const sun     = chart.planets.find(pl => pl.planet === 'SUN')
  const moon    = chart.planets.find(pl => pl.planet === 'MOON')
  const venus   = chart.planets.find(pl => pl.planet === 'VENUS')
  const mercury = chart.planets.find(pl => pl.planet === 'MERCURY')
  const mars    = chart.planets.find(pl => pl.planet === 'MARS')
  const rising  = chart.ascendantSign

  if (!sun || !moon) return ''

  const firstName = name.split(' ')[0]

  // Chart pattern analysis
  const elementCounts: Record<string, number> = {}
  const modalityCounts: Record<string, number> = {}
  const signCounts: Record<string, number> = {}

  for (const pl of chart.planets) {
    const el  = ELEMENT_MAP[pl.sign]
    const mod = MODALITY_MAP[pl.sign]
    if (el)  elementCounts[el]   = (elementCounts[el]   || 0) + 1
    if (mod) modalityCounts[mod] = (modalityCounts[mod] || 0) + 1
    signCounts[pl.sign] = (signCounts[pl.sign] || 0) + 1
  }

  const total = chart.planets.length
  const domElement   = Object.entries(elementCounts).find(([, c]) => c >= Math.max(4, Math.ceil(total * 0.38)))
  const domModality  = Object.entries(modalityCounts).find(([, c]) => c >= Math.max(4, Math.ceil(total * 0.45)))
  const stelliumEntry = Object.entries(signCounts).find(([sign, c]) => c >= 3 && sign !== sun.sign)
  const retroCount   = chart.planets.filter(pl => pl.retrograde).length

  // ── Paragraphs ──

  const opener = pickByName(name, CATEGORY_OPENERS[bucket])(name, p)

  const sunHouseCtx = hasBirthTime && SUN_HOUSE_CONTEXT[sun.house]
    ? ` ${SUN_HOUSE_CONTEXT[sun.house]}`
    : ''

  const sunTrait = pickByName(name, SUN_TRAITS[sun.sign] ?? ['a unique and complex nature'])

  const sunPara = hasBirthTime
    ? `${pickByName(name + ':sunlead', SUN_LEADS_TIMED)(name, sun.sign, aOrAn(sun.sign), ordinal(sun.house), p)} ${sunTrait} With the Sun in the ${ordinal(sun.house)} house, ${p.their} sense of purpose finds expression through the domain of ${houseTheme(sun.house)}.${sunHouseCtx}`
    : `${pickByName(name + ':sunlead', SUN_LEADS_UNTIMED)(name, sun.sign, aOrAn(sun.sign), p)} ${sunTrait}`

  const moonTrait = pickByName(name + ':moon', MOON_NEEDS[moon.sign] ?? ['depth and understanding'])

  const moonHouseCtx = hasBirthTime && MOON_HOUSE_CONTEXT[moon.house]
    ? ` ${MOON_HOUSE_CONTEXT[moon.house]}`
    : ''

  const moonPara = hasBirthTime
    ? `${pickByName(name + ':moonlead', MOON_LEADS_TIMED)(moon.sign, aOrAn(moon.sign), ordinal(moon.house))} ${moonTrait}${moonHouseCtx}`
    : `${pickByName(name + ':moonlead', MOON_LEADS_UNTIMED)(moon.sign, aOrAn(moon.sign))} ${moonTrait}`

  const risingTrait = rising ? pickByName(name + ':asc', RISING_IMPRESSION[rising] ?? ['someone who makes a distinct impression']) : ''

  const risingClosing = pickByName(name + ':asc:close', RISING_CLOSINGS)

  const risingPara = (hasBirthTime && rising)
    ? `${pickByName(name + ':risinglead', RISING_LEADS)(firstName, rising)} ${risingTrait} ${risingClosing}`
    : ''

  const venusTrait = venus ? pickByName(name + ':venus', VENUS_LOVE[venus.sign] ?? ['expresses love in a deeply personal way']) : ''

  const venusPara = venus
    ? `${pickByName(name, VENUS_INTROS[bucket])(firstName, venus.sign, p)} ${venusTrait}`
    : ''

  const mercuryTrait = mercury ? pickByName(name + ':mercury', MERCURY_MIND[mercury.sign] ?? ['A unique and precise mind at work.']) : ''

  const mercuryPara = mercury
    ? `${pickByName(name, MERCURY_INTROS[bucket])(firstName, mercury.sign, p)} ${mercuryTrait}`
    : ''

  const marsTrait = mars ? pickByName(name + ':mars', MARS_DRIVE[mars.sign] ?? ['acts with purpose']) : ''

  const marsHouseCtx = (hasBirthTime && mars && MARS_HOUSE_CONTEXT[mars.house])
    ? ` ${MARS_HOUSE_CONTEXT[mars.house]}`
    : ''

  const marsPara = mars
    ? `${pickByName(name + ':marslead', MARS_LEADS)(firstName)} ${marsTrait}${marsHouseCtx}`
    : ''

  // ── Closing notes ──
  const closingParts: string[] = []

  if (domElement)    closingParts.push(pickByName(name + ':elem', DOMINANT_ELEMENT_NOTE[domElement[0]])(firstName))
  if (domModality)   closingParts.push(pickByName(name + ':mod', DOMINANT_MODALITY_NOTE[domModality[0]])(firstName))
  if (stelliumEntry) closingParts.push(`A concentration of planets in ${stelliumEntry[0]} gives the chart a distinct ${stelliumEntry[0]} undertone... amplifying those themes alongside the core ${sun.sign} energy.`)
  if (retroCount >= 3) closingParts.push(`With ${retroCount} retrograde planets natally, much of ${firstName}'s energy turns inward... a rich interior life that quietly shapes everything ${p.they} put${p.v} into the world.`)

  // ── No birth time disclaimer ──
  const noTimePara = !hasBirthTime
    ? `Note: ${name}'s exact birth time isn't on record. Planetary signs are calculated for noon on ${p.their} birth date and are likely accurate, but the rising sign and house placements are unknown... and the Moon sign should be treated as approximate if ${p.they} ${p.they === 'they' ? 'were' : 'was'} born near a sign change.`
    : ''

  // ── Assemble ──
  const bioIntro = shortBio
    ? `${shortBio}\n\n${opener}`
    : opener

  const sections = [
    noTimePara,
    bioIntro,
    sunPara,
    moonPara,
    risingPara,
    venusPara,
    mercuryPara,
    marsPara,
    closingParts.join(' '),
  ].filter(Boolean)

  return sections.join('\n\n')
}
