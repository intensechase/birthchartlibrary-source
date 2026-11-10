// Major aspects in astrology — definitions, interpretations, and planet pair meanings

export interface AspectInfo {
  name: string
  slug: string
  symbol: string
  degree: number
  orb: number
  nature: 'harmonious' | 'challenging' | 'neutral'
  keywords: string[]
  summary: string
  description: string
  inYourChart: string
  workingWithIt: string
  planetPairs: { planets: string; interpretation: string }[]
}

export const ASPECT_ORDER = ['conjunction', 'sextile', 'square', 'trine', 'opposition'] as const

export const ASPECTS: Record<string, AspectInfo> = {
  conjunction: {
    name: 'Conjunction',
    slug: 'conjunction',
    symbol: '☌',
    degree: 0,
    orb: 8,
    nature: 'neutral',
    keywords: ['fusion', 'intensity', 'amplification', 'merging', 'concentration', 'blind spot'],
    summary: 'Two planets at the same degree, merging their energies into a single intensified expression.',
    description: `The conjunction is astrology's most concentrated aspect ... and also the most difficult to see clearly from the inside. When two planets occupy the same degree of the zodiac (or within about 8° of each other), their energies fuse. They stop being two separate forces and begin operating as one. The result is concentration and amplification ... whatever those planets represent becomes louder, more central to the personality, and harder to separate into component parts.

A conjunction is neither inherently harmonious nor challenging ... it depends entirely on which planets are involved. A Sun-Jupiter conjunction amplifies confidence, generosity, and self-expression, often to the point of excess. A Moon-Saturn conjunction fuses emotional life with restriction, creating someone who feels deeply but expresses cautiously. The conjunction does not discriminate. It simply turns up the volume.

The shadow of the conjunction is the blind spot it creates. Because the two planetary energies are so thoroughly merged, the person often cannot see them as separate forces. They experience them as "just how I am" rather than as a dynamic tension that can be worked with consciously. The gift of the conjunction is intensity and focus ... when you have a conjunction in your chart, that area of life is never background noise. It is always, for better or worse, turned on.`,
    inYourChart: `If you have a conjunction in your birth chart, the planets involved are permanently fused in your experience. You do not toggle between them ... they operate as a single drive. This can make you extraordinarily focused in the area of life they touch, but it can also create a blind spot where you assume everyone experiences that energy the way you do. The key to working with a conjunction is awareness: learning to name the two separate planetary principles at work, even when they feel like one thing. The tighter the orb (the closer to exact 0°), the more intensely this fusion operates.`,
    workingWithIt: `Conjunctions do not need to be "fixed" ... they are engines. The work is understanding what fuel they run on. If your conjunction involves benefic planets (Venus, Jupiter), the challenge is managing abundance and excess. If it involves malefics (Mars, Saturn), the challenge is channeling intensity without burning out or rigidifying. Study each planet in the conjunction separately, then ask yourself: how do these two forces show up together in my life? Where do I have unusual strength ... and where do I have trouble seeing myself clearly?`,
    planetPairs: [
      { planets: 'Sun–Moon', interpretation: 'Your identity and emotional needs are aligned ... you know what you want and what you feel, often simultaneously. The challenge is perspective: you may struggle to step outside your own experience and see how others feel differently. New Moon births carry this energy.' },
      { planets: 'Sun–Mercury', interpretation: 'Your mind and identity are one ... you think in terms of who you are and communicate with natural authority. Nearly everyone has this conjunction since Mercury never strays far from the Sun. The tighter the orb, the more your thinking defines your sense of self.' },
      { planets: 'Sun–Venus', interpretation: 'You radiate warmth and attractiveness naturally. Charm is not something you perform ... it is woven into your identity. The shadow is a need for approval or a tendency to smooth over conflict at the expense of truth. Creative gifts are often strong.' },
      { planets: 'Sun–Mars', interpretation: 'Willpower and action are fused ... you do not deliberate long before acting. This conjunction produces natural athletes, entrepreneurs, and anyone who leads by doing. The shadow is aggression or impatience with slower approaches.' },
      { planets: 'Sun–Jupiter', interpretation: 'Optimism, generosity, and self-confidence are amplified. You believe in yourself and in the future, sometimes to a fault. This conjunction brings luck but also a tendency toward overcommitment, overindulgence, or assuming things will work out without effort.' },
      { planets: 'Sun–Saturn', interpretation: 'Your identity is shaped by responsibility, discipline, and a deep awareness of limitation. You may have grown up quickly or carry a seriousness that others notice. The gift is durability and authority earned through effort ... the shadow is self-doubt or excessive rigidity.' },
      { planets: 'Moon–Venus', interpretation: 'Emotional life and relational warmth are fused ... you nurture through beauty, affection, and comfort. Relationships feel like home. The challenge is distinguishing between genuine emotional needs and the desire to keep things pleasant.' },
      { planets: 'Moon–Mars', interpretation: 'Your emotions are immediate and action-oriented ... you feel and react almost simultaneously. This conjunction produces passionate, protective people who struggle with patience. Anger and vulnerability are closely linked.' },
      { planets: 'Moon–Saturn', interpretation: 'Emotional life carries the weight of responsibility and sometimes early loss or restriction. You may have learned to contain your feelings before you learned to feel them. The gift is emotional resilience and depth ... the shadow is emotional withholding.' },
      { planets: 'Venus–Mars', interpretation: 'Desire and attraction are fused into a single, magnetic force. You pursue what you love with directness and intensity. This conjunction brings passion to relationships but can blur the line between wanting and having, pursuit and connection.' },
      { planets: 'Jupiter–Saturn', interpretation: 'Expansion and contraction operate as a single engine ... you build things that are both ambitious and structurally sound. This conjunction marks generational turning points and, in a birth chart, produces people who balance vision with discipline.' },
      { planets: 'Saturn–Pluto', interpretation: 'Power and structure are fused ... you understand authority at a deep level and may have experienced its heavy side early in life. This conjunction produces transformation through endurance and a capacity to rebuild from the ground up.' },
    ],
  },

  sextile: {
    name: 'Sextile',
    slug: 'sextile',
    symbol: '⚹',
    degree: 60,
    orb: 4,
    nature: 'harmonious',
    keywords: ['opportunity', 'cooperation', 'skill', 'communication', 'gentle flow', 'activation'],
    summary: 'Two planets 60° apart, offering opportunities that require conscious effort to activate.',
    description: `The sextile is the quiet achiever of the aspects ... a 60° angle between two planets that creates natural compatibility and opens doors, but only for those who bother to walk through them. Unlike the trine, which flows effortlessly, the sextile requires a degree of conscious effort. The energy is available, the connection is real, but it will not activate itself. You have to do something with it.

Sextiles connect signs that share a compatible polarity (both masculine/active or both feminine/receptive) but belong to different elements. This creates a productive cross-pollination: Fire and Air sextiles generate ideas and action, while Earth and Water sextiles blend practicality with intuition. The result is a relationship between planetary energies that feels natural but not automatic ... more like a skill than a gift.

In practice, sextiles show up as talents that develop through use. They are the aspects behind the person who "just picked it up" ... not because it was effortless, but because the internal wiring made learning feel enjoyable rather than forced. The sextile's shadow is its subtlety: because it does not demand attention the way squares and oppositions do, sextile energies can go entirely undeveloped if the person never explores them.`,
    inYourChart: `Sextiles in your chart represent latent abilities and cooperative energies between different parts of your personality. They do not create the dramatic urgency of a square or the effortless flow of a trine ... they sit somewhere in between, offering support that you can choose to develop or ignore. Look at your sextiles as invitations: if you invest time in the areas they connect, the returns will come more easily than you expect. The key is noticing them in the first place, since sextiles rarely announce themselves.`,
    workingWithIt: `To activate a sextile, engage both planets deliberately. If you have a Mercury-Mars sextile, put your ideas into action ... write, debate, teach. If you have a Venus-Jupiter sextile, explore your aesthetic sensibility through travel, culture, or generous social connection. The sextile rewards effort without demanding struggle. Think of it as a muscle that responds well to exercise ... it will not develop on its own, but it will not resist you either. Sextiles are particularly useful in timing: when a transit activates a natal sextile, pay attention to the opportunities that appear.`,
    planetPairs: [
      { planets: 'Sun–Moon', interpretation: 'Your conscious identity and emotional needs support each other ... you have an inner coherence that helps you navigate life without constant internal conflict. You adapt to situations with a blend of intention and instinct.' },
      { planets: 'Mercury–Venus', interpretation: 'Words and aesthetics cooperate naturally ... you communicate with grace and may have a talent for writing, diplomacy, or any form of expression that combines beauty with meaning. Social skills come easily when you engage them.' },
      { planets: 'Mercury–Mars', interpretation: 'Your mind and your drive work well together ... you think quickly, argue effectively, and translate ideas into action. This sextile supports debate, strategy, and any work that requires both mental sharpness and physical initiative.' },
      { planets: 'Venus–Mars', interpretation: 'Attraction and pursuit are in friendly dialogue ... you can balance receptivity with initiative in relationships. Flirtation comes naturally, and you tend to navigate romantic dynamics with more ease than most.' },
      { planets: 'Venus–Jupiter', interpretation: 'Pleasure and expansion cooperate ... you enjoy life generously and attract good fortune through warmth and openness. This sextile supports social abundance, creative growth, and a natural talent for making others feel welcome.' },
      { planets: 'Mars–Jupiter', interpretation: 'Action and optimism reinforce each other ... you take risks that tend to work out because your timing and confidence are naturally aligned. Physical vitality and competitive drive are strong when you choose to activate them.' },
      { planets: 'Jupiter–Saturn', interpretation: 'Expansion and discipline are in productive dialogue ... you can dream big and build the structure to support those dreams. This sextile produces long term planners who also know when to take a leap.' },
      { planets: 'Moon–Neptune', interpretation: 'Emotional sensitivity and imagination cooperate ... you have a natural intuition that, when developed, becomes a genuine gift for understanding unspoken feelings. Creative and spiritual pursuits benefit from this connection.' },
    ],
  },

  square: {
    name: 'Square',
    slug: 'square',
    symbol: '□',
    degree: 90,
    orb: 8,
    nature: 'challenging',
    keywords: ['tension', 'friction', 'growth', 'motivation', 'crisis', 'action'],
    summary: 'Two planets 90° apart, creating friction that demands growth and produces motivation.',
    description: `The square is the engine of the birth chart ... a 90° angle between two planets that generates friction, tension, and an irresistible pressure to act. Squares are uncomfortable. They create internal conflicts that cannot be ignored, situations that recur until they are faced directly, and a restless drive that refuses to let you settle for the path of least resistance. They are also, without question, the most productive aspect in astrology.

Squares connect signs that share the same modality (Cardinal, Fixed, or Mutable) but belong to incompatible elements. Cardinal squares (Aries-Cancer, Cancer-Libra, etc.) create crises of action ... the question is always "what do I do?" Fixed squares (Taurus-Leo, Leo-Scorpio, etc.) create crises of will ... the question is "who yields?" Mutable squares (Gemini-Virgo, Virgo-Sagittarius, etc.) create crises of meaning ... the question is "what is true?"

The people with the most interesting lives, the most significant accomplishments, and the deepest earned wisdom almost always have prominent squares in their charts. Squares do not let you coast. They do not let you avoid. They demand that you engage with the contradiction between two fundamental parts of yourself, and in that engagement, you grow. The shadow of the square is burnout, chronic frustration, or the tendency to project one side of the conflict outward onto others instead of owning both sides internally.`,
    inYourChart: `Squares in your chart show where life will not let you off the hook. The planets involved represent two parts of yourself that are both real, both important, and fundamentally at odds in their approach. You cannot satisfy one without frustrating the other ... at least not without conscious work. The early experience of a square is often frustration and repeated conflict in the same life areas. The mature experience of a square is dynamic energy and motivated action. The goal is not to eliminate the tension but to use it as fuel.`,
    workingWithIt: `The first step is accepting that both planets in the square have legitimate needs. If your Moon squares your Mars, your need for emotional safety and your need for action and independence will repeatedly collide ... but both needs are real. The second step is developing the capacity to hold both sides simultaneously rather than swinging between them. This is rarely comfortable, but it is where the growth lives. Squares become easier with age and self-awareness, not because the tension disappears but because you learn to channel it rather than being overwhelmed by it. Many of the most successful people in history had prominent squares.`,
    planetPairs: [
      { planets: 'Sun–Moon', interpretation: 'Your identity and your emotional needs pull in different directions ... what you want to become and what makes you feel safe are in tension. This square creates a productive inner restlessness that drives personal evolution but can also make you feel internally divided.' },
      { planets: 'Sun–Mars', interpretation: 'Your will and your drive are at cross-purposes ... you may act impulsively, struggle with anger, or feel like your energy works against you as often as it works for you. The gift is an engine of ambition that never stops pushing.' },
      { planets: 'Sun–Saturn', interpretation: 'Your identity meets constant resistance from duty, limitation, or self-doubt. You earn everything the hard way ... but what you earn, you keep. This square produces late bloomers who become authorities in their field through sheer persistence.' },
      { planets: 'Moon–Mars', interpretation: 'Your emotions and your impulse to act are in constant friction ... you may react before you have fully processed what you feel, or suppress feelings until they erupt. Learning to pause between feeling and action is the work of a lifetime.' },
      { planets: 'Moon–Saturn', interpretation: 'Emotional life carries the weight of responsibility, restriction, or early deprivation. You may struggle to receive nurturing or to believe you deserve comfort. The gift is emotional maturity and the capacity to provide structure for others.' },
      { planets: 'Moon–Pluto', interpretation: 'Your emotional life is intense, compulsive, and transformative ... you feel things at depths that most people never reach. Power dynamics in close relationships are a recurring theme. The gift is psychological insight that comes from refusing to stay on the surface.' },
      { planets: 'Venus–Mars', interpretation: 'Desire and love are in tension ... you may pursue people who are not good for you or struggle to balance independence with intimacy. Passion runs high but so does frustration in relationships. Creative energy is abundant.' },
      { planets: 'Venus–Saturn', interpretation: 'Love and limitation are intertwined ... you may feel unworthy of affection, choose partners who withhold it, or build walls around your heart. The gift is loyalty and the capacity for love that endures because it was hard won.' },
      { planets: 'Venus–Pluto', interpretation: 'Relationships carry intensity, possessiveness, and the potential for deep transformation. You love with a ferocity that can overwhelm both you and your partners. The gift is a capacity for intimacy that most people are afraid to reach.' },
      { planets: 'Mars–Saturn', interpretation: 'Action meets restriction ... you may feel like you are driving with the brakes on, or alternate between explosive bursts and frozen paralysis. The mature expression is disciplined, strategic action that builds lasting results.' },
      { planets: 'Jupiter–Saturn', interpretation: 'Faith and doubt, expansion and contraction, pull against each other throughout your life. You oscillate between ambitious vision and cautious restraint. The gift is the wisdom to know when to grow and when to consolidate.' },
      { planets: 'Saturn–Pluto', interpretation: 'Control and transformation are locked in an ongoing power struggle ... you may encounter authority in its most uncompromising forms. The gift is the capacity to endure extreme pressure and emerge fundamentally changed.' },
    ],
  },

  trine: {
    name: 'Trine',
    slug: 'trine',
    symbol: '△',
    degree: 120,
    orb: 8,
    nature: 'harmonious',
    keywords: ['flow', 'ease', 'talent', 'harmony', 'grace', 'complacency'],
    summary: 'Two planets 120° apart, creating natural harmony and effortless flow between their energies.',
    description: `The trine is the aspect of natural flow ... a 120° angle between two planets that allows their energies to move together without friction, resistance, or conscious effort. Where the square demands growth through struggle, the trine offers gifts that arrive fully formed. Talents that seem innate, situations that resolve themselves, relationships that feel easy from the start ... these are the signatures of the trine.

Trines connect signs of the same element: Fire trines Fire (Aries-Leo-Sagittarius), Earth trines Earth (Taurus-Virgo-Capricorn), Air trines Air (Gemini-Libra-Aquarius), and Water trines Water (Cancer-Scorpio-Pisces). Because the planets share an elemental language, they understand each other immediately. There is no translation needed, no friction to generate heat, no crisis to force engagement. The energy simply flows.

This is both the trine's great gift and its subtle danger. Trines can produce genuine talent ... but talent that is never tested rarely reaches its full potential. The person with a Grand Trine (three trines forming a triangle) may be the most gifted person in the room and the least motivated to develop those gifts. Trines need squares or oppositions elsewhere in the chart to provide the friction that turns natural ability into actual achievement. Without that friction, the trine's ease can become complacency, and its flow can become stagnation.`,
    inYourChart: `Trines in your chart show where life comes easiest ... where you have natural talent, inherent understanding, and a flow state that others may struggle their entire lives to achieve. These are areas you may take for granted precisely because they require so little effort. The planets involved cooperate automatically, and you may not even realize this cooperation is unusual until you notice how much others struggle with the same things. The risk is that you never fully develop these gifts because the urgency is never there.`,
    workingWithIt: `The counterintuitive advice for trines is to add friction deliberately. If you have a Sun-Jupiter trine, your natural optimism and self-belief flow easily ... but without challenge, they may never deepen into wisdom. Seek out experiences that test your trine talents. Enter competitions, accept difficult projects, put your gifts in situations where they must perform under pressure. Trines respond beautifully to intentional development because the foundation is already solid ... all they need is a reason to grow. If you have multiple trines, look for the squares and oppositions in your chart: those are the aspects that will motivate you to actually use what the trines gave you.`,
    planetPairs: [
      { planets: 'Sun–Moon', interpretation: 'Your identity and your emotional nature are in harmony ... you feel comfortable being who you are and rarely experience the internal division that comes from conflicting needs. Others find you centered and authentic. The risk is taking this self-consistency for granted.' },
      { planets: 'Sun–Jupiter', interpretation: 'Confidence and expansion flow naturally ... you expect good things and often receive them. Generosity, optimism, and a natural sense of abundance are woven into your personality. The challenge is developing the discipline to match your vision.' },
      { planets: 'Sun–Saturn', interpretation: 'Your identity and your sense of responsibility are aligned ... discipline feels natural rather than imposed. You take on authority comfortably and build things that last. Others trust you instinctively because your reliability is genuine, not performed.' },
      { planets: 'Moon–Venus', interpretation: 'Your emotional needs and your capacity for love and beauty are in effortless harmony ... you create comfort naturally and attract affection without trying. Home and relationships tend to be sources of genuine peace.' },
      { planets: 'Moon–Neptune', interpretation: 'Emotional sensitivity and imagination flow together ... you have a natural intuitive gift and a rich inner world. Creative expression, empathy, and spiritual sensitivity come easily. The risk is retreating into fantasy rather than engaging reality.' },
      { planets: 'Moon–Pluto', interpretation: 'Your emotional depth is a natural strength ... you understand psychology instinctively and can hold space for intense feelings without being overwhelmed. Transformation feels less like crisis and more like shedding old skin.' },
      { planets: 'Venus–Mars', interpretation: 'Attraction and action cooperate gracefully ... you pursue what you desire with charm rather than force, and your relationships tend to balance passion with affection. Creative and romantic energy flow naturally together.' },
      { planets: 'Venus–Jupiter', interpretation: 'Love and abundance are in harmony ... you attract good fortune through warmth, generosity, and genuine appreciation of beauty. Social life tends to be rich, and financial matters often work out with less stress than expected.' },
      { planets: 'Mars–Jupiter', interpretation: 'Action and optimism reinforce each other ... your physical energy and competitive drive are supported by a natural faith that things will work out. Risk taking tends to be rewarded, though overconfidence is the shadow.' },
      { planets: 'Mars–Saturn', interpretation: 'Energy and discipline are aligned ... you can sustain effort over long periods without the burnout that this combination often produces in harder aspects. Strategic, patient action is your natural mode.' },
      { planets: 'Jupiter–Saturn', interpretation: 'Vision and structure cooperate ... you can dream big and build the foundation to support it. This trine produces people who achieve substantial things quietly, without the drama that often accompanies ambition.' },
      { planets: 'Saturn–Pluto', interpretation: 'Endurance and transformation flow together ... you handle crisis with structural clarity, rebuilding without losing your foundation. Power feels natural to you rather than threatening, and you tend to earn authority through competence.' },
    ],
  },

  opposition: {
    name: 'Opposition',
    slug: 'opposition',
    symbol: '☍',
    degree: 180,
    orb: 8,
    nature: 'challenging',
    keywords: ['polarity', 'awareness', 'projection', 'balance', 'relationship', 'seesaw'],
    summary: 'Two planets 180° apart, creating a tug-of-war that demands awareness and balance.',
    description: `The opposition is the aspect of awareness ... a 180° angle between two planets that creates a polarity, a tug-of-war between two equally valid but seemingly incompatible forces. Unlike the square, which generates internal friction you must resolve through action, the opposition tends to play out through relationships. You identify with one end of the polarity and project the other end onto someone else ... a partner, a rival, an authority figure ... until you learn to own both sides.

Oppositions connect signs that share the same modality and are complementary elements: Aries-Libra (self vs. other), Taurus-Scorpio (security vs. transformation), Gemini-Sagittarius (information vs. meaning), Cancer-Capricorn (home vs. career), Leo-Aquarius (individual vs. collective), Virgo-Pisces (analysis vs. intuition). Each axis represents a fundamental life polarity that cannot be resolved by choosing one side. Both are necessary.

The gift of the opposition is perspective ... the ability to see both sides of any situation, once you stop identifying exclusively with one planet and rejecting the other. The mature opposition produces people with remarkable balance, objectivity, and the ability to hold complexity. The immature opposition produces people who swing between extremes or who keep attracting the same type of person or situation because they are projecting half of themselves outward.`,
    inYourChart: `Oppositions in your chart highlight the life polarities you are here to integrate. The two planets involved represent real, legitimate parts of yourself that you may experience as being in conflict ... not because they are incompatible, but because you have not yet learned to hold both simultaneously. In early life, you will likely favor one planet and attract the other through relationships, events, or recurring patterns. As you mature, the goal is to internalize both sides, becoming a person who can move fluidly between the two poles rather than being stuck at one end.`,
    workingWithIt: `The key to oppositions is owning both sides. If your Venus opposes your Saturn, you may swing between indulgence and austerity, warmth and coldness, pleasure and duty ... or you may attract partners who embody the side you are neglecting. The work is integration: finding a way to be both loving and disciplined, both open and boundaried. Oppositions are relationship aspects ... they often improve dramatically when you stop looking for someone else to carry the other end and start carrying it yourself. Full Moon births carry the Sun-Moon opposition, embodying this tension between identity and emotional need.`,
    planetPairs: [
      { planets: 'Sun–Moon', interpretation: 'Your identity and emotional needs pull in opposite directions ... what you want to become and what you need to feel safe are in constant dialogue. Full Moon births carry this tension. The gift is awareness of your own complexity and the capacity to understand others deeply.' },
      { planets: 'Sun–Saturn', interpretation: 'Your sense of self meets external authority or internal limitation head-on ... you may struggle with father figures, bosses, or your own self-criticism. The gift is that opposition forces you to define yourself clearly against real resistance.' },
      { planets: 'Sun–Pluto', interpretation: 'Your identity is in a tug-of-war with power and transformation ... you may attract controlling situations or feel compelled to reinvent yourself repeatedly. The gift is a depth of self-understanding that comes from refusing to stay comfortable.' },
      { planets: 'Moon–Saturn', interpretation: 'Your emotional needs and your sense of duty are at odds ... nurturing and discipline feel like they belong to different people. Relationships may mirror this split. The gift is emotional strength forged through the integration of vulnerability and responsibility.' },
      { planets: 'Moon–Pluto', interpretation: 'Emotional life is intense and polarized ... you may oscillate between emotional openness and emotional control, or attract relationships that mirror this dynamic. The gift is transformative emotional depth.' },
      { planets: 'Venus–Mars', interpretation: 'Love and desire are in dialogue ... you may experience relationships as a constant negotiation between what you attract and what you pursue. The tension produces magnetic charisma and a rich romantic life, but balance requires effort.' },
      { planets: 'Venus–Saturn', interpretation: 'Love and limitation face each other across the chart ... relationships may feel like work, or you may attract partners who represent the restraint or seriousness you are not expressing yourself. The gift is love that deepens through commitment.' },
      { planets: 'Venus–Pluto', interpretation: 'Attraction and intensity are polarized ... relationships carry a transformative charge that can feel overwhelming. Jealousy, possessiveness, and deep bonding are themes. The gift is a capacity for love that is unflinchingly honest.' },
      { planets: 'Mars–Saturn', interpretation: 'Your drive and your discipline are in a tug-of-war ... you may feel alternately explosive and paralyzed. The gift is learning strategic patience: knowing when to push and when to wait, which is a rare and powerful skill.' },
      { planets: 'Jupiter–Saturn', interpretation: 'Optimism and caution are in direct dialogue ... you see both the possibility and the limitation in every situation. The gift is balanced judgment that neither overreaches nor plays it too safe.' },
      { planets: 'Mars–Pluto', interpretation: 'Will and power confront each other ... you may encounter power struggles or feel a compulsive drive that is difficult to moderate. The gift is extraordinary willpower and the capacity to transform through sustained, focused action.' },
      { planets: 'Saturn–Pluto', interpretation: 'Structure and transformation are in opposition ... you may experience breakdowns that force rebuilding, or encounter institutional power in its most uncompromising form. The gift is resilience forged in fire.' },
    ],
  },
}
