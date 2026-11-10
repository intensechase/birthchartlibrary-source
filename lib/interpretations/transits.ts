import type { Transit } from '@/lib/swisseph/transits'

const PLANET_NAMES: Record<string, string> = {
  SUN: 'the Sun', MOON: 'the Moon', MERCURY: 'Mercury', VENUS: 'Venus',
  MARS: 'Mars', JUPITER: 'Jupiter', SATURN: 'Saturn', URANUS: 'Uranus',
  NEPTUNE: 'Neptune', PLUTO: 'Pluto', NORTH_NODE: 'the North Node', CHIRON: 'Chiron',
}

const ASPECT_PHRASES: Record<string, string> = {
  conjunct: 'merging with',
  opposite: 'sitting across from',
  square: 'challenging',
  trine: 'flowing harmoniously with',
  sextile: 'gently supporting',
}

const HOUSE_THEMES: Record<number, string> = {
  1: 'identity and self-expression',
  2: 'finances and personal values',
  3: 'communication and daily learning',
  4: 'home and emotional foundations',
  5: 'creativity, romance, and joy',
  6: 'health, work, and daily routines',
  7: 'partnerships and close relationships',
  8: 'transformation and deep bonds',
  9: 'beliefs, travel, and expanding horizons',
  10: 'career and public reputation',
  11: 'friendships and community',
  12: 'reflection, rest, and inner life',
}

const PLANET_ENERGY: Record<string, string> = {
  SUN: 'vitality and purpose',
  MOON: 'emotions and instincts',
  MERCURY: 'thinking and communication',
  VENUS: 'love and attraction',
  MARS: 'drive and ambition',
  JUPITER: 'growth and opportunity',
  SATURN: 'discipline and responsibility',
  URANUS: 'change and innovation',
  NEPTUNE: 'imagination and intuition',
  PLUTO: 'transformation and power',
  NORTH_NODE: 'growth and purpose',
  CHIRON: 'healing and wisdom',
}

// ─── Transit planet → natal planet descriptions ─────────────────────────────
// Key format: `${transitPlanet}_${natalPlanet}`
// Each has aspect-specific text: { conjunct, trine, square, opposite, sextile }

const TRANSIT_PAIRS: Record<string, Record<string, string>> = {
  // ─── SUN transits ─────────────────────────────────────────────────────────
  SUN_SUN: {
    conjunct: `This is your solar return... the Sun returning to the exact position it held when you were born. It's a reset of your vital energy, a birthday renewal that invites you to ask what you want the next year of your life to be about.`,
    trine: `The transiting Sun is harmonizing with your natal Sun... your sense of identity feels supported and clear right now. This is a moment where being yourself comes naturally, where confidence flows without effort.`,
    square: `The transiting Sun is creating friction with your natal Sun... you may feel challenged to defend who you are or pushed to grow beyond a comfortable version of yourself. The tension is productive... it's asking you to evolve.`,
    opposite: `The transiting Sun sits directly across from your natal Sun... this is the halfway point of your solar year, a moment of perspective. Others may mirror back parts of yourself you don't always see. Listen to what the reflection shows you.`,
    sextile: `The transiting Sun is gently energizing your natal Sun... a subtle boost to your confidence and clarity. This is a good day to take initiative on something that matters to you... the universe is quietly on your side.`,
  },
  SUN_MOON: {
    conjunct: `The transiting Sun is illuminating your natal Moon... your emotional world is lit up, visible, and hard to ignore. What you feel and what you project are merging... this is a moment of emotional honesty, whether you planned it or not.`,
    trine: `The Sun is flowing harmoniously with your natal Moon... your head and heart are in agreement today. Decisions come more easily because what you think and what you feel are pointing in the same direction.`,
    square: `The Sun is creating tension with your natal Moon... your conscious goals and your emotional needs may feel at odds. The discomfort is real but temporary... it's asking you to honor both sides rather than suppressing one.`,
    opposite: `The Sun and your natal Moon are in opposition... this is a tug-of-war between your public self and your private emotional world. Something needs balancing... probably the ratio of what you give to others versus what you keep for yourself.`,
    sextile: `The Sun is gently supporting your natal Moon... a day where your emotional instincts and your sense of purpose work well together. Trust what feels right... it probably is.`,
  },
  SUN_MERCURY: {
    conjunct: `The transiting Sun is merging with your natal Mercury... your mind is lit up, your words carry more weight, and your thinking feels unusually sharp. This is a powerful moment for communication, important conversations, or any work that requires mental clarity.`,
    trine: `The Sun is flowing with your natal Mercury... ideas come easily, conversations feel productive, and your ability to express yourself is enhanced. Use this for writing, presenting, or any task that benefits from clear thinking.`,
    square: `The Sun is challenging your natal Mercury... you may feel mentally restless, misunderstood, or frustrated by communication that isn't landing. Slow down before sending that message... clarity requires patience today.`,
    opposite: `The Sun is opposite your natal Mercury... someone else's perspective may challenge your way of thinking. This isn't a threat... it's an invitation to see your own ideas from a different angle.`,
    sextile: `The Sun gently energizes your natal Mercury... a subtle sharpness to your thinking and a ease to your communication. Good day for learning, short trips, or catching up with someone you've been meaning to talk to.`,
  },
  SUN_VENUS: {
    conjunct: `The transiting Sun is illuminating your natal Venus... love, beauty, and pleasure are in the spotlight. You may feel more attractive, more attracted, or more aware of what brings you joy. This is a day to enjoy something beautiful without guilt.`,
    trine: `The Sun is harmonizing with your natal Venus... relationships feel warmer, aesthetics matter more, and the things you value feel validated. This is one of the more pleasant transits... lean into the ease.`,
    square: `The Sun is pressing against your natal Venus... you may feel tension between what you want and what you think you should want. Desire and duty are negotiating... let them talk without rushing to a conclusion.`,
    opposite: `The Sun opposes your natal Venus... someone else may embody the qualities you admire or desire. This transit illuminates what you value by showing you its reflection in others.`,
    sextile: `The Sun gently supports your natal Venus... a quietly lovely day for connection, creativity, and small pleasures. Nothing dramatic... just a softness to the day that's worth noticing.`,
  },
  SUN_MARS: {
    conjunct: `The transiting Sun is merging with your natal Mars... energy, drive, and assertiveness are amplified. You may feel restless, competitive, or ready to fight for something that matters. Channel this... don't just burn it.`,
    trine: `The Sun is flowing with your natal Mars... your energy and your purpose are aligned. This is a day where action feels natural and productive... the motivation you've been waiting for may have just arrived.`,
    square: `The Sun is creating friction with your natal Mars... you may feel irritable, impatient, or confrontational. The anger isn't random... it's pointing at something that needs to change. Direct it wisely.`,
    opposite: `The Sun opposes your natal Mars... someone else's will or energy may push against yours. This isn't about winning... it's about understanding what you're actually fighting for.`,
    sextile: `The Sun gently energizes your natal Mars... a subtle boost to your confidence and physical vitality. Good day for exercise, taking initiative, or finishing something you've been putting off.`,
  },
  SUN_JUPITER: {
    conjunct: `The transiting Sun is merging with your natal Jupiter... optimism swells, opportunities feel closer, and your faith in the bigger picture is renewed. This is one of the most expansive transits of the year... say yes to something that stretches you.`,
    trine: `The Sun is flowing with your natal Jupiter... luck, growth, and good timing converge. This is a day where things tend to work out better than expected... trust the momentum.`,
    square: `The Sun is pressing against your natal Jupiter... the tension between ambition and excess may surface. You may overcommit, overpromise, or overestimate. Confidence is great... just keep it grounded.`,
    opposite: `The Sun opposes your natal Jupiter... someone or something may challenge your beliefs or your sense of what's possible. The expansion you need might come from an unexpected direction.`,
    sextile: `The Sun gently supports your natal Jupiter... a quiet day of good fortune and easy growth. Doors open... but only if you walk toward them.`,
  },
  SUN_SATURN: {
    conjunct: `The transiting Sun is merging with your natal Saturn... this is a serious, grounding transit. Responsibility weighs heavier, but so does the potential for lasting achievement. What you build under this influence has staying power... if you're willing to do the work.`,
    trine: `The Sun is flowing with your natal Saturn... discipline and purpose align. This is a productive day for structured work, long-term planning, or anything that requires patience and follow-through.`,
    square: `The Sun is pressing against your natal Saturn... you may feel blocked, burdened, or confronted by limitations. The wall you're hitting isn't permanent... it's showing you where you need to build strength.`,
    opposite: `The Sun opposes your natal Saturn... authority figures, deadlines, or obligations may demand your attention. This transit asks whether the structures in your life support you or confine you.`,
    sextile: `The Sun gently supports your natal Saturn... a steady, reliable day where effort pays off quietly. No fireworks... just solid progress on things that matter.`,
  },
  SUN_URANUS: {
    conjunct: `The transiting Sun is merging with your natal Uranus... expect the unexpected. This transit electrifies your sense of individuality and may bring sudden insights, disruptions, or a fierce need for freedom. Something wants to break free today.`,
    trine: `The Sun is flowing with your natal Uranus... change feels exciting rather than threatening. You may have a breakthrough idea, an unexpected opportunity, or a moment of clarity that shifts your perspective.`,
    square: `The Sun is pressing against your natal Uranus... restlessness and rebellion bubble up. You may feel trapped by routines or structures that usually feel fine. The disruption is uncomfortable but it's showing you where you've outgrown something.`,
    opposite: `The Sun opposes your natal Uranus... someone else's unpredictability may force you to adapt. This transit challenges your comfort zone through external surprises.`,
    sextile: `The Sun gently energizes your natal Uranus... a subtle spark of originality and independence. Good day for trying something new or approaching an old problem from a fresh angle.`,
  },
  SUN_NEPTUNE: {
    conjunct: `The transiting Sun is merging with your natal Neptune... the line between imagination and reality blurs. You may feel more creative, more intuitive, and more susceptible to illusion. Trust your instincts but verify the facts.`,
    trine: `The Sun is flowing with your natal Neptune... inspiration comes easily, empathy deepens, and the spiritual or artistic dimensions of life feel more accessible. This is a beautiful day for creative work or quiet reflection.`,
    square: `The Sun is pressing against your natal Neptune... confusion, escapism, or disillusionment may surface. Something you believed in may look different under this light. Let the fog clear before making decisions.`,
    opposite: `The Sun opposes your natal Neptune... someone else may seem idealized or deceptive. This transit dissolves certainty... and sometimes that dissolution is exactly what's needed to see more clearly.`,
    sextile: `The Sun gently supports your natal Neptune... a day of subtle beauty and quiet inspiration. Pay attention to your dreams, your intuitive hits, and the art that moves you.`,
  },
  SUN_PLUTO: {
    conjunct: `The transiting Sun is merging with your natal Pluto... intensity amplifies, power dynamics surface, and something hidden may demand to be seen. This is a transformative transit... it strips away pretense and reveals what's underneath. Let it.`,
    trine: `The Sun is flowing with your natal Pluto... you may feel a deep, quiet power today. Your ability to see beneath the surface is enhanced, and your capacity to transform a situation through sheer willpower is unusually strong.`,
    square: `The Sun is pressing against your natal Pluto... control issues, power struggles, or buried emotions may surface. The pressure you feel is trying to push something out that no longer belongs inside.`,
    opposite: `The Sun opposes your natal Pluto... someone else may trigger your deepest fears or desires. This transit exposes the power dynamics you usually keep invisible... let it teach you something.`,
    sextile: `The Sun gently supports your natal Pluto... a day of subtle depth and quiet transformation. You may notice patterns, read between lines, or find strength you didn't know you had.`,
  },
  SUN_NORTH_NODE: {
    conjunct: `The transiting Sun is illuminating your North Node... your soul's growth direction is lit up today. You may encounter a person, opportunity, or situation that feels fated... aligned with the version of yourself you're becoming.`,
    trine: `The Sun is flowing with your North Node... your purpose feels clear and your path feels supported. This is a day where growth happens naturally... just keep moving in the direction that feels unfamiliar but right.`,
    square: `The Sun is pressing against your North Node... you may feel pulled between comfort and growth. The tension is your soul's growing pains... lean toward what challenges you rather than what's easy.`,
    opposite: `The Sun is conjunct your South Node... old patterns, familiar habits, and past-life tendencies are activated. This is a day to notice what you default to... and ask whether it still serves you.`,
    sextile: `The Sun gently supports your North Node... a quiet nudge in the direction of your growth. Pay attention to what excites you today... it may be pointing toward your next step.`,
  },
  SUN_CHIRON: {
    conjunct: `The transiting Sun is illuminating your natal Chiron... your deepest wound is lit up, visible, and asking for attention. This may feel tender, but the awareness itself is the healing. You can't transform what you refuse to see.`,
    trine: `The Sun is flowing with your natal Chiron... healing feels more accessible today. You may find wisdom in your pain, or find yourself able to help someone else with exactly the thing that once hurt you most.`,
    square: `The Sun is pressing against your natal Chiron... an old wound may get poked. The irritation isn't random... it's showing you where healing is still incomplete. Treat yourself with the compassion you'd offer a friend.`,
    opposite: `The Sun opposes your natal Chiron... someone else may mirror your wound back to you. What bothers you most about them may be teaching you something about your own unfinished healing.`,
    sextile: `The Sun gently supports your natal Chiron... a quiet day of integration. The wound isn't gone, but today it feels less like a burden and more like a source of understanding.`,
  },
  // ─── VENUS transits ──────────────────────────────────────────────────────
  VENUS_SUN: {
    conjunct: `Venus is crossing your natal Sun... charm, attractiveness, and pleasure are heightened. You may feel more beautiful, more magnetic, or more aware of what brings you joy. This is one of the loveliest transits of the year... enjoy something without overthinking it.`,
    trine: `Venus harmonizes with your natal Sun... your sense of identity and your sense of beauty are in sync. You feel good about who you are today, and others notice. Relationships, creativity, and self-expression all benefit.`,
    square: `Venus presses against your natal Sun... tension between what you desire and who you are may surface. You might want something that doesn't quite fit the image you've built... let the desire teach you something about what's been missing.`,
    opposite: `Venus opposes your natal Sun... someone else may embody the beauty, grace, or values you admire. The attraction or envy you feel is a mirror... it's showing you a quality you're ready to develop in yourself.`,
    sextile: `Venus gently supports your natal Sun... a quiet day of ease, warmth, and self-appreciation. Small pleasures feel more satisfying than usual. Let yourself enjoy the day without needing it to be productive.`,
  },
  VENUS_MOON: {
    conjunct: `Venus is merging with your natal Moon... your emotional world is softened, sweetened, and craving comfort. Tenderness flows easily... toward yourself, toward others, toward life in general. This is a day for nurturing connections and emotional honesty.`,
    trine: `Venus flows with your natal Moon... feelings of love and security blend beautifully. Your relationships feel warmer, your home feels cozier, and your emotional needs feel met. Soak it in.`,
    square: `Venus presses against your natal Moon... what you want emotionally and what you're getting may feel mismatched. The longing is real... use it to clarify what you actually need, not just what you're used to.`,
    opposite: `Venus opposes your natal Moon... a partner or close person may trigger emotional needs you've been suppressing. The discomfort is pointing at something your heart has been trying to say.`,
    sextile: `Venus gently supports your natal Moon... a quiet warmth in your emotional life today. Small gestures of affection feel more meaningful than grand ones. Notice who makes you feel safe.`,
  },
  VENUS_MERCURY: {
    conjunct: `Venus is merging with your natal Mercury... your words become sweeter, your thinking turns toward beauty, and communication takes on a graceful quality. This is ideal for love letters, creative writing, negotiations, or any conversation where charm matters.`,
    trine: `Venus flows with your natal Mercury... eloquence and aesthetics blend. You can talk about feelings without being awkward, and think about beauty without being superficial. A harmonious day for social and creative communication.`,
    square: `Venus presses against your natal Mercury... you might say something about love or money that comes out wrong, or overthink something that just wants to be felt. Let the heart lead on this one.`,
    opposite: `Venus opposes your natal Mercury... someone else's compliment, critique, or romantic communication may require your attention. How you respond reveals what you value more than what you say.`,
    sextile: `Venus gently supports your natal Mercury... pleasant conversations, smooth negotiations, and an eye for detail in creative work. A subtly lovely day for anything involving words and aesthetics.`,
  },
  VENUS_VENUS: {
    conjunct: `Venus is returning to its natal position... this is your Venus return, a reset of your relationship to love, beauty, money, and pleasure. What you desire and what you attract are being recalibrated. Pay attention to what feels genuinely valuable versus what you've been settling for.`,
    trine: `Venus harmonizes with your natal Venus... you feel at home in your own attractiveness, your own values, your own sense of what's beautiful. This is a day of self-alignment... what you want and what you are feel like the same thing.`,
    square: `Venus challenges your natal Venus... dissatisfaction with a relationship, your appearance, or your financial situation may surface. The discomfort is useful... it's showing you where your values have shifted.`,
    opposite: `Venus opposes your natal Venus... someone else may represent the love, beauty, or lifestyle you desire. The comparison isn't about inadequacy... it's about clarity. What do you actually want?`,
    sextile: `Venus gently energizes your natal Venus... a subtle but real enhancement to your social life, your creative eye, and your ability to attract what you want. Lean toward pleasure today.`,
  },
  VENUS_MARS: {
    conjunct: `Venus is merging with your natal Mars... desire and charm fuse. Your attraction power is amplified, your physical energy carries a magnetic quality, and the line between wanting something and going after it dissolves. Passion is the word for today.`,
    trine: `Venus flows with your natal Mars... what you want and how you pursue it are beautifully aligned. Assertiveness comes with grace, desire comes with confidence. This is an excellent day for romance, creative action, or anything that requires both beauty and boldness.`,
    square: `Venus presses against your natal Mars... tension between desire and aggression, between attracting and pursuing. You might push too hard for something that requires softness, or hold back when boldness is needed.`,
    opposite: `Venus opposes your natal Mars... someone else may attract and challenge you simultaneously. The push-pull dynamic is magnetic... just make sure you're responding to the real person and not just the chemistry.`,
    sextile: `Venus gently supports your natal Mars... a subtle alignment of desire and drive. You know what you want and you pursue it with just the right touch. Good day for dates, creative projects, or physical activities you enjoy.`,
  },
  VENUS_JUPITER: {
    conjunct: `Venus is merging with your natal Jupiter... generosity, abundance, and big love expand. This is one of the most fortunate transits possible... opportunities for pleasure, profit, or meaningful connection are genuinely enhanced. Say yes to something generous today.`,
    trine: `Venus flows with your natal Jupiter... luck in love, money, and social situations feels effortless. Abundance is the theme... not just material, but emotional and spiritual. Enjoy it without feeling guilty.`,
    square: `Venus presses against your natal Jupiter... overindulgence, overspending, or over-promising in relationships may tempt you. The desire for more is real... just make sure "more" is what you actually need.`,
    opposite: `Venus opposes your natal Jupiter... someone else's generosity or extravagance may contrast with your own. This transit asks whether you're being too restrained or they're being too excessive... probably a bit of both.`,
    sextile: `Venus gently supports your natal Jupiter... a quietly fortunate day for relationships and finances. Small opportunities for growth and pleasure present themselves... don't overlook them because they seem modest.`,
  },
  VENUS_SATURN: {
    conjunct: `Venus is merging with your natal Saturn... love gets serious. You may feel the weight of commitment, the reality of what a relationship costs, or a sobering clarity about what you truly value. This isn't romantic... but it's honest, and honest builds something that lasts.`,
    trine: `Venus flows with your natal Saturn... lasting love, enduring beauty, and wise financial decisions are favored. This is a day where commitment feels like freedom rather than restriction. Build something permanent with what you love.`,
    square: `Venus presses against your natal Saturn... loneliness, rejection, or a feeling of not being enough may surface. The coldness you feel isn't permanent... it's Saturn testing whether your desire for love is real enough to work for.`,
    opposite: `Venus opposes your natal Saturn... duty and pleasure pull in opposite directions. A relationship may feel burdened by obligation, or a creative pursuit may feel blocked by practicality. Find the middle... not compromise, integration.`,
    sextile: `Venus gently supports your natal Saturn... a quiet, mature appreciation for what's real and lasting in your life. Not exciting, but deeply satisfying. Good day for financial planning or deepening a committed relationship.`,
  },
  VENUS_URANUS: {
    conjunct: `Venus is merging with your natal Uranus... expect the unexpected in love, money, or aesthetics. A sudden attraction, an impulse purchase, or a radical shift in what you find beautiful may surprise you. This transit breaks patterns... let it.`,
    trine: `Venus flows with your natal Uranus... excitement in relationships feels welcome rather than destabilizing. You may be attracted to someone unusual, discover a new aesthetic, or experience freedom within a connection. Freshness is the gift.`,
    square: `Venus presses against your natal Uranus... restlessness in relationships or sudden dissatisfaction with something you used to love may unsettle you. The disruption is uncomfortable but revealing... what you're bored with may have already served its purpose.`,
    opposite: `Venus opposes your natal Uranus... someone else's unpredictability may shake your relational stability. The question isn't whether to cling or run... it's whether you can love something you can't control.`,
    sextile: `Venus gently energizes your natal Uranus... a spark of novelty in your social or romantic life. Something slightly unconventional appeals to you today... follow the curiosity.`,
  },
  VENUS_NEPTUNE: {
    conjunct: `Venus is merging with your natal Neptune... romance turns ethereal, beauty becomes transcendent, and the line between love and fantasy dissolves. This is one of the most creatively inspiring transits... and one of the most deceptive. Enjoy the dream, but know you're dreaming.`,
    trine: `Venus flows with your natal Neptune... compassion, artistic sensitivity, and unconditional love flow freely. This is a day for music, poetry, spiritual connection, or simply being moved by something beautiful. Let yourself feel without judgment.`,
    square: `Venus presses against your natal Neptune... illusion in love, financial confusion, or aesthetic dissatisfaction may cloud your judgment. What looks perfect may be a projection... wait for the fog to clear before committing to anything.`,
    opposite: `Venus opposes your natal Neptune... someone may seem too perfect, or a situation may feel too good to be true. The idealization isn't wrong exactly... it's just incomplete. See the whole picture before giving your heart.`,
    sextile: `Venus gently supports your natal Neptune... a subtle, dreamy quality to your emotional and creative life today. Inspiration comes through beauty, compassion comes through softness. A quietly magical day.`,
  },
  VENUS_PLUTO: {
    conjunct: `Venus is merging with your natal Pluto... desire intensifies, obsession flares, and love becomes a transformative force. You may feel magnetically drawn to someone or something with an almost compulsive quality. This transit reveals what you truly desire... beneath the polite version.`,
    trine: `Venus flows with your natal Pluto... deep emotional connections feel empowering rather than threatening. Your capacity for intimacy, vulnerability, and passionate engagement is unusually strong. Let someone in... all the way.`,
    square: `Venus presses against your natal Pluto... jealousy, possessiveness, or power dynamics in a relationship may surface. The intensity is real... and it's pointing at something you've been afraid to want or afraid to lose.`,
    opposite: `Venus opposes your natal Pluto... someone else may trigger your deepest desires or darkest fears about love. The magnetism is undeniable... the question is whether it's leading toward transformation or repetition.`,
    sextile: `Venus gently supports your natal Pluto... a quiet deepening of emotional bonds and an enhanced appreciation for what's raw and real. Surface-level charm bores you today... you want substance.`,
  },
  VENUS_NORTH_NODE: {
    conjunct: `Venus is crossing your North Node... a relationship, a value, or a beautiful experience may appear that aligns with your soul's growth direction. This is a fated quality to connection today... pay attention to who and what shows up.`,
    trine: `Venus harmonizes with your North Node... your sense of beauty and your sense of purpose point the same direction. What attracts you today is leading you somewhere meaningful.`,
    square: `Venus challenges your North Node... comfort and growth are pulling in different directions. The easy choice feels good but the right choice feels like the one that stretches you.`,
    opposite: `Venus crosses your South Node... familiar patterns of love, comfort, and value are activated. Notice whether you're choosing what you truly want or just what you've always known.`,
    sextile: `Venus gently supports your North Node... a subtle alignment between what brings you pleasure and what brings you growth. They don't have to be different things.`,
  },
  VENUS_CHIRON: {
    conjunct: `Venus is illuminating your natal Chiron... the wound around love, beauty, or self-worth is visible today. You may feel more vulnerable in relationships, more sensitive to rejection, or more aware of what you've been denying yourself. The tenderness is the healing.`,
    trine: `Venus flows with your natal Chiron... your ability to love from a place of woundedness becomes a gift rather than a liability. You can offer compassion today precisely because you know what it feels like to need it.`,
    square: `Venus presses against your natal Chiron... an old wound around love or self-worth may get reopened. The pain isn't new... but your capacity to hold it with grace might be. Don't armor up... stay open.`,
    opposite: `Venus opposes your natal Chiron... someone else's beauty, love, or ease with pleasure may highlight what feels broken in you. The comparison hurts... but it's also showing you exactly where the healing wants to happen.`,
    sextile: `Venus gently supports your natal Chiron... a quiet day where beauty and pain coexist without conflict. You may find comfort in art, music, or a connection that sees you as you are... wounds and all.`,
  },

  // ─── MARS transits ───────────────────────────────────────────────────────
  MARS_SUN: {
    conjunct: `Mars is crossing your natal Sun... raw energy floods your sense of self. You feel bolder, more physical, more willing to fight for what you want. This is powerful fuel... channel it into action rather than aggression.`,
    trine: `Mars flows with your natal Sun... your drive and your identity are aligned. Physical energy, confidence, and initiative come naturally. This is one of the best days to start something that requires courage.`,
    square: `Mars presses against your natal Sun... frustration, anger, or ego conflicts may flare. Someone or something is challenging who you are. The heat is real... use it to forge something rather than burn something down.`,
    opposite: `Mars opposes your natal Sun... someone else's will clashes with yours. This isn't about backing down... it's about understanding whether you're fighting for something real or just defending your pride.`,
    sextile: `Mars gently energizes your natal Sun... a subtle boost to your confidence and physical vitality. Good day for exercise, taking initiative, or asserting yourself in a situation that's been too passive.`,
  },
  MARS_MOON: {
    conjunct: `Mars is merging with your natal Moon... emotions become fiery, reactive, and hard to contain. You may feel irritable, passionate, or emotionally courageous... sometimes all at once. The intensity is asking you to act on what you feel rather than swallow it.`,
    trine: `Mars flows with your natal Moon... emotional courage and physical energy work together. You can stand up for your feelings without being destructive about it. A powerful day for honest emotional expression.`,
    square: `Mars presses against your natal Moon... anger and vulnerability collide. You may lash out emotionally or feel attacked where you're most sensitive. The reaction is disproportionate to the trigger... that's how you know it's touching something deeper.`,
    opposite: `Mars opposes your natal Moon... someone else's aggression or assertiveness may threaten your emotional safety. The challenge is responding from strength rather than defensiveness.`,
    sextile: `Mars gently supports your natal Moon... emotional assertiveness comes more easily today. You can set boundaries without guilt and express needs without apology.`,
  },
  MARS_MERCURY: {
    conjunct: `Mars is merging with your natal Mercury... your mind is sharp, fast, and combative. Words become weapons or tools depending on how you wield them. Debates, negotiations, and strategic thinking are amplified... just watch for verbal aggression.`,
    trine: `Mars flows with your natal Mercury... decisive communication and quick thinking align. You can cut through mental fog and say exactly what needs saying. Excellent for presentations, difficult conversations, or competitive mental work.`,
    square: `Mars presses against your natal Mercury... arguments, hasty words, and mental impatience may dominate. Your mind is moving faster than your filter. Slow down before hitting send on that message.`,
    opposite: `Mars opposes your natal Mercury... someone else's directness may provoke a mental confrontation. Engage the argument on its merits... don't let it become personal.`,
    sextile: `Mars gently energizes your natal Mercury... a subtle sharpness to your communication. Good for tackling tasks that require both mental focus and physical energy.`,
  },
  MARS_VENUS: {
    conjunct: `Mars is merging with your natal Venus... desire and attraction ignite. The tension between pursuing and attracting dissolves into something magnetic. This is one of the most passionate transits... creativity, romance, and physical pleasure are all amplified.`,
    trine: `Mars flows with your natal Venus... what you want and what you attract are harmoniously aligned. Confidence in relationships, creative energy, and physical enjoyment all benefit from this transit.`,
    square: `Mars presses against your natal Venus... desire and values may conflict. You might want something that clashes with what you know is good for you... or push too hard for affection. The tension is revealing what you truly need.`,
    opposite: `Mars opposes your natal Venus... the push-pull between desire and love plays out through someone else. The attraction is intense but the question is whether passion and genuine care are pointing the same direction.`,
    sextile: `Mars gently supports your natal Venus... a pleasant alignment of desire and grace. Good day for dates, creative work, or anything that benefits from both boldness and beauty.`,
  },
  MARS_MARS: {
    conjunct: `Mars is returning to its natal position... this is your Mars return, a reset of your drive, ambition, and physical energy that happens roughly every two years. How you assert yourself is being recalibrated. What are you willing to fight for now?`,
    trine: `Mars harmonizes with your natal Mars... your energy is flowing in its natural groove. Physical vitality, competitive drive, and courage feel effortless. Act on what matters to you... the momentum is real.`,
    square: `Mars challenges your natal Mars... frustration, conflict, and blocked energy may make you feel like a pressure cooker. The aggression needs an outlet... exercise, competition, or tackling a hard problem are better than picking a fight.`,
    opposite: `Mars opposes your natal Mars... someone else's drive directly conflicts with yours. This is a test of how you handle opposition... with maturity or with escalation. The choice defines you more than the outcome.`,
    sextile: `Mars gently energizes your natal Mars... a subtle boost to your natural assertiveness. Good day for physical activity, taking initiative, or finishing something that requires sustained effort.`,
  },
  MARS_JUPITER: {
    conjunct: `Mars is merging with your natal Jupiter... ambition expands, confidence soars, and the urge to go big is almost irresistible. This is one of the most enterprising transits... bold action and good fortune converge. Take the risk... but make it a calculated one.`,
    trine: `Mars flows with your natal Jupiter... energy and optimism fuel each other. Your ability to take action on your biggest goals is genuinely enhanced. Fortune favors the bold today... and you're feeling bold.`,
    square: `Mars presses against your natal Jupiter... overconfidence, recklessness, or biting off more than you can chew may backfire. The enthusiasm is great... the overreach is the problem. Scale the ambition to match your actual bandwidth.`,
    opposite: `Mars opposes your natal Jupiter... someone else's grand plans or moral certainty may clash with your actions. The conflict between doing and believing needs resolution... are you walking your talk?`,
    sextile: `Mars gently supports your natal Jupiter... a quiet confidence that helps you take the next step toward something meaningful. Not explosive... just steady, purposeful forward motion.`,
  },
  MARS_SATURN: {
    conjunct: `Mars is merging with your natal Saturn... discipline and drive combine into something formidable. This transit can feel heavy... frustrated energy, blocked ambition, or exhaustion. But what you build under this pressure is built to last. Endure.`,
    trine: `Mars flows with your natal Saturn... controlled energy, strategic action, and patient effort produce real results. This is the transit for hard work that actually pays off. No shortcuts needed... the steady approach is the fast approach.`,
    square: `Mars presses against your natal Saturn... you may feel blocked, restricted, or furious at limitations. The wall you're hitting is real, but it's not permanent. The question is whether to push through or find a different path around.`,
    opposite: `Mars opposes your natal Saturn... external authority or obligations may block your desires. The frustration is legitimate... but fighting the structure directly may cost more than adapting to it.`,
    sextile: `Mars gently supports your natal Saturn... disciplined energy that gets things done without drama. Good day for tasks requiring patience, precision, and sustained physical or mental effort.`,
  },
  MARS_URANUS: {
    conjunct: `Mars is merging with your natal Uranus... expect sudden bursts of energy, impulsive actions, or a fierce need to break free from constraint. This transit is electric and unpredictable... accidents, breakthroughs, and rebellions all live here. Stay conscious.`,
    trine: `Mars flows with your natal Uranus... your actions are inventive, your energy is exciting, and your willingness to try something unconventional is rewarded. This is a day for bold experiments and creative risks.`,
    square: `Mars presses against your natal Uranus... recklessness, sudden anger, or an irresistible urge to blow something up may surface. The restlessness is real but the collateral damage doesn't have to be. Find a constructive outlet for the chaos.`,
    opposite: `Mars opposes your natal Uranus... someone else's unpredictability may force you to react under pressure. Flexibility is your friend today... rigidity will break.`,
    sextile: `Mars gently energizes your natal Uranus... a spark of originality in your actions. Good day for trying a new approach to an old problem or breaking a routine that's gone stale.`,
  },
  MARS_NEPTUNE: {
    conjunct: `Mars is merging with your natal Neptune... action and imagination blur together. You may feel inspired to fight for a dream or confused about what you're fighting for at all. This transit is powerful for creative or spiritual work... and treacherous for anything requiring clear strategy.`,
    trine: `Mars flows with your natal Neptune... your actions are guided by intuition and your energy serves a higher purpose. This is beautiful for artistic creation, spiritual practice, or any effort motivated by compassion rather than competition.`,
    square: `Mars presses against your natal Neptune... your energy may feel scattered, your actions may miss their mark, or you may be deceived about what you're actually doing. Double-check your motives... are you acting from inspiration or escapism?`,
    opposite: `Mars opposes your natal Neptune... someone else's passivity, deception, or idealism may frustrate your desire for direct action. The enemy you're fighting may be a phantom... make sure it's real before you swing.`,
    sextile: `Mars gently supports your natal Neptune... a subtle alignment of will and imagination. Good day for creative work, meditation in motion, or any action that serves something larger than yourself.`,
  },
  MARS_PLUTO: {
    conjunct: `Mars is merging with your natal Pluto... this is one of the most intense transits in astrology. Raw power, deep desire, and the will to dominate or transform are all amplified. Use this force wisely... it can move mountains or create destruction depending on where you aim it.`,
    trine: `Mars flows with your natal Pluto... you have access to a deep, quiet power today. Your ability to take decisive action, to persist through resistance, and to transform a situation through sheer force of will is extraordinary. Don't waste it on small things.`,
    square: `Mars presses against your natal Pluto... power struggles, obsessive drives, or confrontations with forces beyond your control may surface. The intensity is real... the question is whether you're trying to control or trying to transform. Only one of those works.`,
    opposite: `Mars opposes your natal Pluto... someone else's power may directly challenge yours. This transit strips away pretense and reveals who actually holds the leverage. Respond with strategy, not rage.`,
    sextile: `Mars gently supports your natal Pluto... a quiet intensity to your actions today. You may handle a difficult situation with more depth and resilience than you expected. Trust your instincts in moments that require courage.`,
  },
  MARS_NORTH_NODE: {
    conjunct: `Mars is crossing your North Node... action aligned with your soul's growth direction is available today. What you do now may have a fated quality... the energy you invest in your evolution is being amplified. Move toward what scares you a little.`,
    trine: `Mars harmonizes with your North Node... the courage to grow comes naturally. Physical energy and spiritual direction point the same way. Act on what you know you're meant to do.`,
    square: `Mars challenges your North Node... old patterns of assertion may conflict with the direction your soul is trying to take. The familiar fight is comfortable but the new one is where the growth lives.`,
    opposite: `Mars activates your South Node... habitual aggression, old competitive patterns, or knee-jerk reactions are triggered. Notice what you default to and ask if that's still who you want to be.`,
    sextile: `Mars gently supports your North Node... a quiet push in the direction of your purpose. The initiative you take today, even if small, is aligned with something larger.`,
  },
  MARS_CHIRON: {
    conjunct: `Mars is illuminating your natal Chiron... the wound around anger, assertion, or physical vulnerability is activated. You may feel rage at an old injustice or discover courage you didn't know you had. Fighting for your own healing is the bravest thing you can do.`,
    trine: `Mars flows with your natal Chiron... your ability to act from a place of woundedness becomes a source of strength. You can fight for others who share your pain, or channel your hurt into something constructive. Warrior and healer merge.`,
    square: `Mars presses against your natal Chiron... anger and vulnerability collide painfully. You may feel attacked where you're most tender, or lash out from a place of unhealed pain. The reaction is information... treat it as a map, not a weapon.`,
    opposite: `Mars opposes your natal Chiron... someone else's aggression may reopen an old wound. The pain isn't about them... it's about what their behavior reminds you of. Respond to the present, not the past.`,
    sextile: `Mars gently supports your natal Chiron... a quiet courage around your deepest vulnerability. You may find yourself able to take action on healing that you've been avoiding. Small brave steps count.`,
  },

  // ─── JUPITER transits ──────────────────────────────────────────────────
  JUPITER_SUN: {
    conjunct: `Jupiter is crossing your natal Sun... this is one of the most expansive and fortunate transits of the decade. Your sense of self enlarges, opportunities multiply, and optimism feels grounded in reality. Say yes to growth... the universe is opening doors.`,
    trine: `Jupiter harmonizes with your natal Sun... confidence, luck, and a sense of being on the right path converge. This is a period where things tend to work out. Don't just wait for fortune... actively pursue what you want.`,
    square: `Jupiter presses against your natal Sun... excess, overconfidence, or growth in the wrong direction may challenge you. The expansion is real but it needs focus. More isn't always better... better is better.`,
    opposite: `Jupiter opposes your natal Sun... someone else's success or generosity may challenge your sense of self. The comparison isn't about inadequacy... it's about seeing what bigger version of yourself is possible.`,
    sextile: `Jupiter gently supports your natal Sun... a quiet period of growth and good fortune. Opportunities come, but they come modestly. Look for the door that's slightly ajar rather than waiting for one to fly open.`,
  },
  JUPITER_MOON: {
    conjunct: `Jupiter is merging with your natal Moon... emotional generosity, domestic expansion, and a deep sense of wellbeing are available. Your capacity to nurture and be nurtured grows. This is a beautiful transit for family, home, and emotional healing.`,
    trine: `Jupiter flows with your natal Moon... emotional abundance and inner peace come easily. You feel secure, generous, and optimistic about your private life. Let the good feeling spread to those around you.`,
    square: `Jupiter presses against your natal Moon... emotional excess, overprotectiveness, or expanding beyond your emotional capacity may strain you. The heart is willing but the container may need reinforcing.`,
    opposite: `Jupiter opposes your natal Moon... the tension between public growth and private comfort asks for balance. You can have both... but not by ignoring either.`,
    sextile: `Jupiter gently supports your natal Moon... a quiet warmth in your emotional life. Small blessings in your home, family, or inner world are worth noticing and savoring.`,
  },
  JUPITER_MERCURY: {
    conjunct: `Jupiter is merging with your natal Mercury... your mind expands dramatically. Big ideas, important conversations, and opportunities through learning or communication are highlighted. This is excellent for publishing, teaching, studying, or any endeavor where thinking big matters.`,
    trine: `Jupiter flows with your natal Mercury... wisdom and communication align. Your ability to see the big picture while articulating the details is enhanced. Excellent for writing, presentations, or any intellectual pursuit.`,
    square: `Jupiter presses against your natal Mercury... mental overload, overpromising, or trying to learn everything at once may scatter your focus. The intellectual appetite is huge... give it structure.`,
    opposite: `Jupiter opposes your natal Mercury... someone else's ideas or philosophical position may broaden your perspective uncomfortably. The expansion of mind comes through listening, not arguing.`,
    sextile: `Jupiter gently supports your natal Mercury... a pleasant boost to your learning and communication. Good day for reading, conversations with wise people, or making plans that require broad thinking.`,
  },
  JUPITER_VENUS: {
    conjunct: `Jupiter is merging with your natal Venus... love, pleasure, and abundance amplify beautifully. This is one of the most fortunate transits for relationships, finances, and creative pursuits. Something genuinely good wants to come to you... let it.`,
    trine: `Jupiter flows with your natal Venus... grace, beauty, and good fortune in relationships and money come easily. Generosity feels natural, connections deepen, and aesthetic sensibilities are heightened. Enjoy this one.`,
    square: `Jupiter presses against your natal Venus... overindulgence in love, spending, or pleasure may have consequences. The desire for more is real... but discernment about what "more" means is the real gift.`,
    opposite: `Jupiter opposes your natal Venus... someone else's abundance or beauty may stir envy or desire. Use the feeling as information about what you want to grow in your own life.`,
    sextile: `Jupiter gently supports your natal Venus... small blessings in love and money. A pleasant social encounter, a modest financial gain, or a moment of genuine beauty may brighten your day.`,
  },
  JUPITER_MARS: {
    conjunct: `Jupiter is merging with your natal Mars... ambition, courage, and physical energy expand dramatically. This is the transit of the entrepreneur, the athlete, the person who bets big and wins. Take bold action... the wind is at your back.`,
    trine: `Jupiter flows with your natal Mars... confidence and luck fuel your actions. Your timing is good, your energy is high, and your willingness to take risks is rewarded. Move forward with what you've been planning.`,
    square: `Jupiter presses against your natal Mars... overextension, recklessness, or conflicts fueled by inflated confidence may backfire. The energy is enormous... aim it carefully.`,
    opposite: `Jupiter opposes your natal Mars... someone else's ambition or aggression may challenge you to match their energy. Compete wisely... not every battle is worth the escalation.`,
    sextile: `Jupiter gently supports your natal Mars... a quiet boost to your drive and initiative. Good day for starting something that requires both courage and faith.`,
  },
  JUPITER_JUPITER: {
    conjunct: `Jupiter is returning to its natal position... this is your Jupiter return, happening roughly every 12 years. It marks a new cycle of growth, luck, and expansion in your life. What you begin now has the potential to define the next decade. Dream accordingly.`,
    trine: `Jupiter harmonizes with your natal Jupiter... growth flows naturally. Your optimism is well-founded, your opportunities are real, and your philosophical outlook is expanding in healthy ways. Trust the process.`,
    square: `Jupiter challenges your natal Jupiter... growing pains. The expansion you want may be bumping against the beliefs that got you this far. Something in your worldview needs updating.`,
    opposite: `Jupiter opposes your natal Jupiter... the halfway point of your Jupiter cycle. Assess what you've grown into and whether it still fits. Mid-course corrections made now carry enormous weight.`,
    sextile: `Jupiter gently supports your natal Jupiter... a quiet period of aligned growth. The seeds you planted during your last Jupiter return are bearing fruit... tend them.`,
  },
  JUPITER_SATURN: {
    conjunct: `Jupiter is merging with your natal Saturn... expansion meets structure. The tension between growing and building, between faith and discipline, resolves into something powerful. This is a transit for building big... but building smart.`,
    trine: `Jupiter flows with your natal Saturn... the rare alignment of ambition and patience. What you build now is both visionary and practical. Long-term plans made under this transit have an unusual chance of succeeding.`,
    square: `Jupiter presses against your natal Saturn... the desire to grow may feel blocked by responsibilities or limitations. The restriction is real but so is the growth... the answer is patience, not abandonment.`,
    opposite: `Jupiter opposes your natal Saturn... freedom and duty pull in opposite directions. You can't have limitless expansion without structure... and structure without expansion becomes a cage. Find the integration.`,
    sextile: `Jupiter gently supports your natal Saturn... a productive period where measured growth happens steadily. No drama... just the satisfying accumulation of effort turning into something real.`,
  },
  JUPITER_URANUS: {
    conjunct: `Jupiter is merging with your natal Uranus... breakthroughs, sudden opportunities, and radical expansion are possible. This is one of the most exciting transits in astrology... the unexpected becomes fortunate. Be ready for surprise... and be ready to say yes to it.`,
    trine: `Jupiter flows with your natal Uranus... freedom, innovation, and luck converge beautifully. Your willingness to do things differently is rewarded. This is a time for inventive solutions and unconventional paths.`,
    square: `Jupiter presses against your natal Uranus... restlessness, impulsive decisions, or overreaching toward freedom may destabilize you. The desire for change is valid... the execution needs wisdom.`,
    opposite: `Jupiter opposes your natal Uranus... external changes or other people's radicalism may disrupt your plans. The disruption carries hidden opportunity... look for it before reacting.`,
    sextile: `Jupiter gently supports your natal Uranus... a spark of exciting possibility. A new idea, an unexpected connection, or a flash of insight may open a door you didn't know existed.`,
  },
  JUPITER_NEPTUNE: {
    conjunct: `Jupiter is merging with your natal Neptune... faith, imagination, and spiritual aspiration expand enormously. This is a transit of dreams made large... beautiful for creative and spiritual work, dangerous for anything requiring realism. Believe in something... but don't lose your footing.`,
    trine: `Jupiter flows with your natal Neptune... compassion, creativity, and spiritual connection deepen effortlessly. You may feel genuinely inspired, genuinely kind, and genuinely connected to something beyond yourself. This is rare... honor it.`,
    square: `Jupiter presses against your natal Neptune... idealism without grounding, spiritual inflation, or escapism disguised as faith may confuse you. The dream is beautiful... make sure it has a foundation.`,
    opposite: `Jupiter opposes your natal Neptune... someone else's vision or spirituality may challenge your own. The disillusionment that comes isn't failure... it's clarity making room for a deeper faith.`,
    sextile: `Jupiter gently supports your natal Neptune... a quiet period of spiritual and creative enrichment. Inspiration comes softly... through music, nature, prayer, or a moment of unexpected beauty.`,
  },
  JUPITER_PLUTO: {
    conjunct: `Jupiter is merging with your natal Pluto... power, ambition, and transformative potential reach their peak. This is the transit of empires... personal or professional. What you pursue now has the potential to fundamentally change your life. Aim high, but stay ethical.`,
    trine: `Jupiter flows with your natal Pluto... deep power and broad opportunity align. Your ability to influence, to transform, and to succeed through sheer depth of purpose is extraordinary. Use it for something that matters.`,
    square: `Jupiter presses against your natal Pluto... the desire for power or control may become obsessive. The ambition is legitimate... but the means matter as much as the ends. Check your methods.`,
    opposite: `Jupiter opposes your natal Pluto... external power structures may challenge your growth. The confrontation with authority or hidden forces is uncomfortable but potentially liberating if you engage it honestly.`,
    sextile: `Jupiter gently supports your natal Pluto... a quiet empowerment. Your capacity for deep, lasting change is enhanced without the drama that usually accompanies transformation.`,
  },
  JUPITER_NORTH_NODE: {
    conjunct: `Jupiter is crossing your North Node... this is a deeply fortunate alignment with your soul's purpose. Opportunities for growth that align with your deepest direction may appear. The universe is supporting your evolution... trust the path that feels meaningful rather than just comfortable.`,
    trine: `Jupiter harmonizes with your North Node... growth and purpose are aligned. The direction that excites you is also the direction that evolves you. Follow it with confidence.`,
    square: `Jupiter challenges your North Node... expansion in the wrong direction may distract from your real growth. Not all opportunities serve your purpose... discern which ones are aligned and which are just shiny.`,
    opposite: `Jupiter crosses your South Node... old patterns of growth and comfort are amplified. The expansion feels easy because it's familiar... but easy isn't always what your soul came here for.`,
    sextile: `Jupiter gently supports your North Node... a quiet nudge toward your life's purpose. The growth available now is modest but meaningful... don't overlook it.`,
  },
  JUPITER_CHIRON: {
    conjunct: `Jupiter is illuminating your natal Chiron... your deepest wound becomes your greatest source of wisdom. This transit expands your capacity for healing... both receiving it and offering it. The pain isn't gone, but its meaning is revealed.`,
    trine: `Jupiter flows with your natal Chiron... healing feels expansive rather than heavy. You may find yourself teaching, counseling, or simply modeling resilience in a way that genuinely helps others.`,
    square: `Jupiter presses against your natal Chiron... the wound may feel bigger than usual because growth is asking you to outgrow the identity built around it. The pain of healing is different from the pain of staying wounded.`,
    opposite: `Jupiter opposes your natal Chiron... someone else's healing journey or wisdom tradition may challenge yours. The discomfort is an invitation to expand how you understand your own wound.`,
    sextile: `Jupiter gently supports your natal Chiron... a quiet period of healing growth. Something that once hurt begins to feel more like wisdom than injury.`,
  },

  // ─── SATURN transits ──────────────────────────────────────────────────
  SATURN_SUN: {
    conjunct: `Saturn is crossing your natal Sun... this is one of the most significant transits of your life, happening roughly every 29 years. Everything feels heavier... responsibilities mount, illusions fall away, and what remains is what's real. This is not punishment... it's the universe asking who you actually are when the extras are stripped away.`,
    trine: `Saturn harmonizes with your natal Sun... discipline and identity align. You feel capable, mature, and clear about what you're building. Hard work produces tangible results under this transit.`,
    square: `Saturn presses against your natal Sun... the structures of your life are being stress-tested. Career, health, or identity may feel burdened. The question isn't whether it's hard... it's whether what you're carrying is worth the weight.`,
    opposite: `Saturn opposes your natal Sun... the halfway point of your Saturn cycle brings a reckoning. Others may impose limits, responsibilities may peak, and the gap between who you wanted to become and who you've actually become is impossible to ignore.`,
    sextile: `Saturn gently supports your natal Sun... quiet progress through steady effort. Nothing dramatic, but the work you're doing now is building a foundation that will hold for years.`,
  },
  SATURN_MOON: {
    conjunct: `Saturn is crossing your natal Moon... emotional austerity. Feelings feel heavier, lonelier, or more real than usual. The comfort you seek may feel unavailable... not because it doesn't exist, but because Saturn is asking you to become your own source of emotional security.`,
    trine: `Saturn flows with your natal Moon... emotional maturity deepens. You can hold difficult feelings without being destroyed by them. Relationships that survive this transit are the ones built on genuine substance.`,
    square: `Saturn presses against your natal Moon... emotional restriction, family burdens, or a profound sense of loneliness may weigh on you. The coldness isn't permanent... it's asking you to find warmth from within.`,
    opposite: `Saturn opposes your natal Moon... external demands conflict with your emotional needs. You can't pour from an empty cup... this transit forces you to reckon with what you've been neglecting inside.`,
    sextile: `Saturn gently supports your natal Moon... emotional stability through discipline. Not exciting, but deeply reassuring. The routines you build around self-care now will serve you for years.`,
  },
  SATURN_MERCURY: {
    conjunct: `Saturn is crossing your natal Mercury... thinking becomes serious, precise, and possibly pessimistic. Mental chatter quiets... what's left is the thought that actually matters. This is a powerful transit for study, planning, and any communication that requires weight.`,
    trine: `Saturn flows with your natal Mercury... structured thinking produces excellent results. Your ability to organize complex information, write clearly, and plan methodically is at its peak. Do the hard mental work now.`,
    square: `Saturn presses against your natal Mercury... mental blocks, negative thinking, or difficulty communicating may frustrate you. The ideas are there... they're just trapped behind an inner critic that's louder than usual.`,
    opposite: `Saturn opposes your natal Mercury... someone else's rules, expectations, or criticism may challenge your thinking. The restriction feels unfair, but the feedback may contain something useful if you can hear past the delivery.`,
    sextile: `Saturn gently supports your natal Mercury... steady, focused mental work is favored. Good for contracts, detailed planning, or any thinking that benefits from patience and precision.`,
  },
  SATURN_VENUS: {
    conjunct: `Saturn is crossing your natal Venus... love gets real. Relationships are tested for substance, beauty feels less important than truth, and what you value is being weighed against what you've been pretending to value. This is lonely if a relationship can't hold the weight... and deeply bonding if it can.`,
    trine: `Saturn flows with your natal Venus... lasting love and enduring beauty are favored. Commitments made now have staying power. Your relationship to money, art, and pleasure matures into something sustainable.`,
    square: `Saturn presses against your natal Venus... dissatisfaction in love, scarcity in finances, or a feeling of being unloved may surface. The deprivation is temporary... but the lesson about what you truly need is permanent.`,
    opposite: `Saturn opposes your natal Venus... a partner or close relationship may feel burdened by obligation. The question is whether duty has replaced love or whether love is being strengthened by duty. Only honest conversation reveals which.`,
    sextile: `Saturn gently supports your natal Venus... quiet appreciation for what's real in your relationships and finances. Not glamorous, but genuinely satisfying. Value what endures.`,
  },
  SATURN_MARS: {
    conjunct: `Saturn is crossing your natal Mars... your drive meets a wall. Energy feels blocked, ambitions feel frustrated, and the usual ways of pushing through may not work. This isn't defeat... it's Saturn asking you to be strategic instead of forceful. Controlled power outlasts brute force.`,
    trine: `Saturn flows with your natal Mars... disciplined action produces lasting results. Your ability to work hard, sustain effort, and channel energy toward long-term goals is at its peak. This is the transit for building something that requires stamina.`,
    square: `Saturn presses against your natal Mars... frustration, anger at restrictions, or physical exhaustion may dominate. The energy is blocked... but the block is showing you where you've been wasting force on things that don't matter.`,
    opposite: `Saturn opposes your natal Mars... someone else's authority or limitations may directly block your actions. The confrontation requires patience... the walls that won't move need to be worked around, not charged through.`,
    sextile: `Saturn gently supports your natal Mars... steady, controlled energy that accomplishes more than it appears to. Patient effort, disciplined exercise, and strategic action are all favored.`,
  },
  SATURN_JUPITER: {
    conjunct: `Saturn is crossing your natal Jupiter... the great teacher meets the great expander. Your beliefs, your optimism, and your growth trajectory are being reality-tested. What's genuinely viable survives... what was inflated deflates. This is wisdom earned through confrontation with limits.`,
    trine: `Saturn flows with your natal Jupiter... wisdom and structure combine beautifully. Your ability to grow within realistic boundaries, to plan expansively but practically, is at its best. Excellent for long-term professional and educational goals.`,
    square: `Saturn presses against your natal Jupiter... faith meets doubt. Your beliefs about what's possible are being challenged by what's actually happening. The contraction is uncomfortable but it's making your optimism more honest.`,
    opposite: `Saturn opposes your natal Jupiter... the tension between playing it safe and taking a leap is at its peak. Neither pure caution nor pure faith serves you... the answer is calculated risk.`,
    sextile: `Saturn gently supports your natal Jupiter... measured growth that doesn't overextend. The progress is modest but sustainable. Build on what's working rather than chasing what's exciting.`,
  },
  SATURN_SATURN: {
    conjunct: `Saturn is returning to its natal position... this is your Saturn return, one of the most defining astrological events of your life. Happening around ages 29 and 58, it marks the transition from one life phase to the next. Everything that isn't structurally sound in your life will be tested. What survives is what you build the next chapter on.`,
    trine: `Saturn harmonizes with your natal Saturn... a period of structural alignment. The responsibilities you carry feel manageable, the path you're on feels correct, and the effort you've invested is beginning to show results. Keep building.`,
    square: `Saturn challenges your natal Saturn... a quarter-life or mid-life pressure point. The structures you've built are being stress-tested... career, relationships, health, identity. What cracks was already fragile. What holds is genuinely yours.`,
    opposite: `Saturn opposes your natal Saturn... the halfway point of your Saturn cycle brings a reckoning with authority, responsibility, and the life you've constructed. Are you living your life or the life that was expected of you?`,
    sextile: `Saturn gently supports your natal Saturn... a productive period where discipline feels natural rather than imposed. The framework of your life is solid... small adjustments keep it that way.`,
  },
  SATURN_URANUS: {
    conjunct: `Saturn is crossing your natal Uranus... the old order meets the revolutionary impulse. Structures you've built may feel suddenly suffocating, or radical changes may be forced into a more sustainable form. The tension between tradition and innovation is the point... neither alone is sufficient.`,
    trine: `Saturn flows with your natal Uranus... innovation becomes practical. Your ability to bring radical ideas into structured reality is enhanced. This is excellent for implementing change that actually sticks.`,
    square: `Saturn presses against your natal Uranus... the battle between freedom and structure intensifies. You may feel trapped by responsibilities or destabilized by changes you didn't choose. The breakthrough requires both courage and patience.`,
    opposite: `Saturn opposes your natal Uranus... external authority and your inner rebel face off. The question isn't which one wins... it's how they learn to coexist.`,
    sextile: `Saturn gently supports your natal Uranus... a quiet period where new ideas can be integrated into existing structures without disruption. Evolution over revolution.`,
  },
  SATURN_NEPTUNE: {
    conjunct: `Saturn is crossing your natal Neptune... dreams meet reality. Illusions dissolve, spiritual bypassing stops working, and what you believed in is tested against what actually is. This can feel like disillusionment... or like the beginning of a faith that's earned rather than assumed.`,
    trine: `Saturn flows with your natal Neptune... spirituality and practicality merge. Your ability to bring imaginative vision into concrete form is unusually strong. Art, healing work, and spiritual practice all benefit from this grounded inspiration.`,
    square: `Saturn presses against your natal Neptune... confusion about what's real, loss of faith, or the painful collapse of an illusion may surface. The fog is clearing... what remains may be less beautiful but infinitely more trustworthy.`,
    opposite: `Saturn opposes your natal Neptune... external structures may crush a dream, or reality may force you to abandon a fantasy. The loss is real... but what replaces it has the potential to actually work.`,
    sextile: `Saturn gently supports your natal Neptune... a period where dreams can be given practical form. The inspiration is subtle, but the ability to act on it is real.`,
  },
  SATURN_PLUTO: {
    conjunct: `Saturn is crossing your natal Pluto... one of the heaviest transits in astrology. Power structures are tested, control issues intensify, and transformation becomes unavoidable. What emerges is forged under extreme pressure... and it's permanent. This is the transit that builds empires or dismantles them.`,
    trine: `Saturn flows with your natal Pluto... deep, strategic power is available. Your ability to transform situations through sustained effort, to wield authority with integrity, and to endure what others can't is at its peak.`,
    square: `Saturn presses against your natal Pluto... power struggles, obsessive control, or confrontation with forces beyond your influence may dominate. The pressure is immense... but resistance is how diamonds form.`,
    opposite: `Saturn opposes your natal Pluto... external power structures may directly challenge your own. The confrontation with authority, mortality, or deep psychological patterns is unavoidable. Face it directly.`,
    sextile: `Saturn gently supports your natal Pluto... a quiet period of deep, lasting transformation. Changes happen slowly but irreversibly. Trust the process.`,
  },
  SATURN_NORTH_NODE: {
    conjunct: `Saturn is crossing your North Node... your soul's growth direction meets the great teacher. The path forward may feel heavy, demanding, and devoid of shortcuts. But what you build toward your purpose now... with discipline, patience, and integrity... becomes the foundation of your life's work.`,
    trine: `Saturn harmonizes with your North Node... the discipline to grow and the direction to grow in are aligned. Effort invested in your soul's purpose yields tangible, lasting results.`,
    square: `Saturn challenges your North Node... the weight of responsibility may feel like it's pulling you away from your purpose. The detour isn't wasted time... it's building the strength you'll need for the next phase.`,
    opposite: `Saturn crosses your South Node... old karmic patterns crystallize. Habits you've relied on for lifetimes are being tested. What served you in the past may now be the very thing holding you back.`,
    sextile: `Saturn gently supports your North Node... steady, patient progress toward your purpose. No shortcuts, no miracles... just the accumulation of meaningful effort.`,
  },
  SATURN_CHIRON: {
    conjunct: `Saturn is crossing your natal Chiron... the wound becomes the work. Your deepest vulnerability is being asked to carry real-world weight... not to break you, but to forge the wound into wisdom that can be shared. This is heavy... and profoundly meaningful.`,
    trine: `Saturn flows with your natal Chiron... the maturity to hold your wound without being defined by it. Healing work, counseling, or mentoring others through similar pain is deeply supported now.`,
    square: `Saturn presses against your natal Chiron... the wound feels heavier, the healing feels slower, and the temptation to give up on something that still hurts is real. Don't. The pressure is creating something permanent.`,
    opposite: `Saturn opposes your natal Chiron... external demands may reopen an old wound. The collision of responsibility and vulnerability is painful but clarifying... you can't heal what you won't acknowledge.`,
    sextile: `Saturn gently supports your natal Chiron... a quiet period of mature healing. The wound doesn't go away... but your relationship to it deepens into something you can work with rather than suffer through.`,
  },

  // ─── URANUS transits ──────────────────────────────────────────────────
  URANUS_SUN: {
    conjunct: `Uranus is crossing your natal Sun... your identity is being electrified. Who you thought you were is being disrupted by who you're becoming. Expect sudden changes in direction, liberation from old roles, and a fierce need to be authentically yourself... even if it surprises everyone.`,
    trine: `Uranus harmonizes with your natal Sun... freedom and identity align. Changes feel exciting rather than destabilizing. You're evolving into a more authentic version of yourself... and the world is making room.`,
    square: `Uranus presses against your natal Sun... disruption to your identity, career, or life direction may feel unwelcome. The instability is real... but so is the freedom on the other side of it.`,
    opposite: `Uranus opposes your natal Sun... other people or external events may force changes you didn't choose. The disruption to your sense of self is uncomfortable but potentially liberating... if you let it reshape you rather than just react.`,
    sextile: `Uranus gently supports your natal Sun... a subtle but real evolution of your identity. New interests, new possibilities, and a growing sense of who you could become are emerging quietly.`,
  },
  URANUS_MOON: {
    conjunct: `Uranus is crossing your natal Moon... emotional earthquakes. Your sense of security is being disrupted, your domestic life may change suddenly, and feelings you've kept suppressed may surface without warning. The instability is uncomfortable... and necessary. A new emotional foundation is being built.`,
    trine: `Uranus flows with your natal Moon... emotional freedom feels exciting. You may find liberation from old emotional patterns, fresh starts in your domestic life, or a sudden clarity about what you actually need to feel safe.`,
    square: `Uranus presses against your natal Moon... emotional volatility, domestic disruption, or sudden changes in your sense of security may unsettle you. The ground beneath your emotional life is shifting... let it settle into a new shape.`,
    opposite: `Uranus opposes your natal Moon... someone else's unpredictability may threaten your emotional stability. The disruption isn't personal... it's catalytic. Your concept of home and safety is being upgraded.`,
    sextile: `Uranus gently supports your natal Moon... a subtle freshness to your emotional life. Old emotional habits soften, new feelings emerge, and your relationship with home and family evolves quietly.`,
  },
  URANUS_MERCURY: {
    conjunct: `Uranus is crossing your natal Mercury... your mind is being rewired. Sudden insights, radical new ideas, and a complete shift in how you think and communicate are possible. Information that changes everything may arrive without warning.`,
    trine: `Uranus flows with your natal Mercury... brilliance, originality, and mental breakthroughs come more easily. Your thinking is ahead of its time right now... trust the unconventional idea.`,
    square: `Uranus presses against your natal Mercury... mental restlessness, information overload, or nervous energy may scatter your focus. The disruption to your thinking is uncomfortable but may produce a genuine breakthrough if you can slow down enough to catch it.`,
    opposite: `Uranus opposes your natal Mercury... someone else's radical thinking may challenge your mental framework. The disruption to your worldview is temporary... what replaces it may be more interesting.`,
    sextile: `Uranus gently supports your natal Mercury... a spark of originality in your thinking. New perspectives, unusual connections, and innovative solutions are available if you look for them.`,
  },
  URANUS_VENUS: {
    conjunct: `Uranus is crossing your natal Venus... love, money, and beauty are being electrified. Sudden attractions, unexpected financial changes, or a radical shift in your aesthetics and values may surprise you. What you wanted yesterday may bore you today... and something you never considered may captivate you.`,
    trine: `Uranus flows with your natal Venus... excitement in love and creativity feels welcome. New relationships, unconventional beauty, and fresh approaches to money and pleasure are all favored.`,
    square: `Uranus presses against your natal Venus... restlessness in relationships, impulsive spending, or sudden dissatisfaction with what you used to love may destabilize you. The disruption is revealing what you've outgrown.`,
    opposite: `Uranus opposes your natal Venus... someone else's freedom or unpredictability may challenge your relationships or values. The instability is a catalyst for figuring out what you actually want versus what you've been accepting.`,
    sextile: `Uranus gently supports your natal Venus... a subtle spark of novelty in your social, romantic, or creative life. Something slightly unexpected catches your eye... follow the interest.`,
  },
  URANUS_MARS: {
    conjunct: `Uranus is crossing your natal Mars... sudden bursts of energy, impulsive actions, and a fierce need for freedom may dominate. This transit is exciting and dangerous in equal measure... breakthroughs and breakdowns both live here. Stay conscious of where you aim this force.`,
    trine: `Uranus flows with your natal Mars... bold, inventive action is rewarded. Your willingness to try unconventional approaches and take calculated risks is at its best. Act decisively on what excites you.`,
    square: `Uranus presses against your natal Mars... accidents, explosive anger, or reckless impulses may surface. The energy needs an outlet... physical activity, creative destruction, or calculated risk-taking are safer than suppression.`,
    opposite: `Uranus opposes your natal Mars... someone else's sudden actions may provoke you into reacting. The challenge is responding with innovation rather than matching their chaos.`,
    sextile: `Uranus gently energizes your natal Mars... a subtle urge to try something new physically or to approach conflict in an unconventional way. Good day for breaking a routine.`,
  },
  URANUS_JUPITER: {
    conjunct: `Uranus is crossing your natal Jupiter... sudden expansion, unexpected luck, and radical growth are possible. This is one of the most exciting transits in astrology... the breakthrough you've been waiting for may arrive in a form you didn't expect.`,
    trine: `Uranus flows with your natal Jupiter... freedom and growth harmonize beautifully. Opportunities come through unconventional channels, and your willingness to think differently is rewarded with genuine expansion.`,
    square: `Uranus presses against your natal Jupiter... overexcitement, impulsive risk-taking, or growth in the wrong direction may challenge you. The opportunity is real... the question is whether you're ready for it.`,
    opposite: `Uranus opposes your natal Jupiter... someone else's radical optimism or sudden good fortune may disrupt your plans. Adapt rather than resist... the change may open doors you didn't know existed.`,
    sextile: `Uranus gently supports your natal Jupiter... a subtle opportunity for growth through innovation. Stay open to the unexpected... it may carry more wisdom than the planned approach.`,
  },
  URANUS_SATURN: {
    conjunct: `Uranus is crossing your natal Saturn... the structures of your life are being revolutionized. Rules you've followed, institutions you've relied on, and patterns you've maintained may suddenly feel obsolete. The disruption is real... and so is the liberation on the other side.`,
    trine: `Uranus flows with your natal Saturn... reform without destruction. Your ability to update old systems, innovate within existing structures, and evolve without burning everything down is enhanced.`,
    square: `Uranus presses against your natal Saturn... the battle between freedom and security intensifies. Something has to give... either the structure adapts to the new reality or it cracks under the pressure.`,
    opposite: `Uranus opposes your natal Saturn... external disruptions challenge your foundations. The tension between holding on and letting go is at its peak... the answer is usually strategic release rather than total surrender.`,
    sextile: `Uranus gently supports your natal Saturn... gradual, manageable change to existing structures. Evolution over revolution... small updates that prevent the need for dramatic upheaval.`,
  },
  URANUS_URANUS: {
    conjunct: `Uranus is returning to its natal position... this happens around age 84 and represents a complete revolution of the Uranian cycle. For most people, this is felt as squares and oppositions at key life stages... each one a call to embrace the next level of authenticity.`,
    trine: `Uranus harmonizes with your natal Uranus... your individuality feels supported by the times. The changes happening in the world align with the changes happening in you. You're not behind... you're exactly where you need to be.`,
    square: `Uranus challenges your natal Uranus... a generational pressure point around ages 21 and 63. The need to differentiate yourself from expectations, to claim your own path, intensifies. The discomfort is the sound of you outgrowing something.`,
    opposite: `Uranus opposes your natal Uranus... the midlife awakening around age 42. Everything you've built is questioned not because it's wrong, but because you've changed. The person who made those choices isn't the person standing here now. Let the update happen.`,
    sextile: `Uranus gently supports your natal Uranus... a quiet period of personal evolution that feels natural rather than forced. Change comes easily because it's aligned with who you're becoming.`,
  },
  URANUS_NEPTUNE: {
    conjunct: `Uranus is crossing your natal Neptune... spiritual awakening through disruption. Your beliefs, your imagination, and your relationship with the transcendent are being electrified. Old spiritual frameworks may shatter... making room for something more authentic and alive.`,
    trine: `Uranus flows with your natal Neptune... innovation and inspiration merge. Creative breakthroughs, spiritual insights, and technological solutions to humanistic problems are all enhanced.`,
    square: `Uranus presses against your natal Neptune... confusion amplifies as the rational and the mystical collide. What you believed may not survive what you're discovering... let the old faith dissolve so a new one can form.`,
    opposite: `Uranus opposes your natal Neptune... external disruptions challenge your inner world. The tension between what's real and what's imagined is intense... and potentially clarifying.`,
    sextile: `Uranus gently supports your natal Neptune... a subtle blending of innovation and imagination. Creative solutions to spiritual questions, or spiritual depth in technological innovation, are quietly available.`,
  },
  URANUS_PLUTO: {
    conjunct: `Uranus is crossing your natal Pluto... revolutionary transformation at the deepest level. Power structures, hidden patterns, and psychological foundations are being disrupted and rebuilt simultaneously. This is a once-in-a-lifetime transit... what it destroys needed to go, and what it creates will last.`,
    trine: `Uranus flows with your natal Pluto... deep transformation happens through innovation. Your ability to reinvent yourself at the most fundamental level is supported. Breakthroughs in psychology, power dynamics, or personal evolution are available.`,
    square: `Uranus presses against your natal Pluto... intense, destabilizing forces are at work. Power struggles, psychological upheaval, or confrontation with shadow material may surface. The disruption goes deep... and the transformation goes deeper.`,
    opposite: `Uranus opposes your natal Pluto... external forces challenge your deepest power structures. The confrontation is generational in scope and personal in impact. What survives is what's genuinely yours.`,
    sextile: `Uranus gently supports your natal Pluto... a quiet but real evolution of your relationship with power, control, and transformation. Deep changes happen without drama.`,
  },
  URANUS_NORTH_NODE: {
    conjunct: `Uranus is crossing your North Node... your soul's growth direction is being electrified. The path forward may look radically different from what you expected... and that's exactly the point. Follow the disruption... it's leading you somewhere essential.`,
    trine: `Uranus harmonizes with your North Node... freedom and purpose align. The unconventional path is the right path. Trust the instinct that says "this is weird but it feels right."`,
    square: `Uranus challenges your North Node... the desire for freedom may conflict with your soul's direction. Not all rebellion is growth... discern which disruptions serve your evolution and which are just avoidance.`,
    opposite: `Uranus activates your South Node... old patterns of rebellion, detachment, or restlessness are triggered. Notice whether you're running toward something or running from something.`,
    sextile: `Uranus gently supports your North Node... a subtle spark of insight about your purpose. The direction forward becomes a little clearer through an unexpected perspective.`,
  },
  URANUS_CHIRON: {
    conjunct: `Uranus is crossing your natal Chiron... your deepest wound is being electrified. Healing may come through sudden insight, unexpected events, or a radical shift in how you understand your own pain. The breakthrough hurts... and it liberates.`,
    trine: `Uranus flows with your natal Chiron... innovative approaches to healing are available. What didn't work before may work now through a completely different method. Try the unconventional cure.`,
    square: `Uranus presses against your natal Chiron... the wound is agitated by change. Old pain surfaces in new ways, and the familiar coping mechanisms may stop working. The disruption is forcing you toward a new relationship with what hurts.`,
    opposite: `Uranus opposes your natal Chiron... someone else's radical behavior may reopen your deepest wound. The trigger is external but the healing is internal. Use the shock as information.`,
    sextile: `Uranus gently supports your natal Chiron... a quiet shift in how you carry your wound. Something that always felt fixed begins to feel movable. A small breakthrough in an old pattern.`,
  },

  // ─── NEPTUNE transits ─────────────────────────────────────────────────
  NEPTUNE_SUN: {
    conjunct: `Neptune is crossing your natal Sun... your identity dissolves and reforms over a period of years. You may feel less certain about who you are, more permeable, more influenced by your environment. This is disorienting... and potentially beautiful. The self that emerges is more compassionate and more authentic than the one that's dissolving.`,
    trine: `Neptune harmonizes with your natal Sun... a gentle softening of your identity that opens you to creativity, spirituality, and deeper empathy. You don't lose yourself... you expand yourself.`,
    square: `Neptune presses against your natal Sun... confusion about your direction, your identity, or your purpose may persist for months. The fog is real... but fighting it makes it worse. Surrender to not knowing and let clarity emerge on its own timeline.`,
    opposite: `Neptune opposes your natal Sun... other people or external circumstances may confuse your sense of self. Someone may idealize you or deceive you... or you may project qualities onto others that actually live within you.`,
    sextile: `Neptune gently supports your natal Sun... a subtle enhancement of intuition, creativity, and spiritual receptivity. Who you are becomes a little more fluid, a little more open, a little more connected to something beyond yourself.`,
  },
  NEPTUNE_MOON: {
    conjunct: `Neptune is crossing your natal Moon... the emotional body becomes oceanic. Feelings flow without boundaries, intuition amplifies to an almost psychic degree, and the need for transcendence through home, family, or emotional connection deepens profoundly. Beautiful for healing and art... disorienting for practical life.`,
    trine: `Neptune flows with your natal Moon... emotional and spiritual life blend into something gentle and nourishing. Compassion deepens, creativity flows, and the need for beauty in your daily emotional world feels like a genuine need, not a luxury.`,
    square: `Neptune presses against your natal Moon... emotional confusion, boundary dissolution, or escapism may cloud your inner world. What you feel may not be entirely yours... learn to distinguish your emotions from the ones you're absorbing from others.`,
    opposite: `Neptune opposes your natal Moon... someone else's emotional confusion or spiritual needs may dissolve your boundaries. The empathy is beautiful... but without discernment it becomes self-abandonment.`,
    sextile: `Neptune gently supports your natal Moon... a quiet deepening of emotional sensitivity and intuitive awareness. Dreams may be more vivid, feelings more subtle, and the need for beauty in your private life more insistent.`,
  },
  NEPTUNE_MERCURY: {
    conjunct: `Neptune is crossing your natal Mercury... your mind becomes a channel for something beyond logic. Creativity, poetry, and spiritual insight flow... but so does confusion, forgetfulness, and susceptibility to misinformation. This transit makes you a better artist and a worse accountant.`,
    trine: `Neptune flows with your natal Mercury... imagination and communication merge beautifully. Your ability to express the inexpressible, to write what moves people, and to think in images rather than just words is enhanced. Use this for creative and spiritual work.`,
    square: `Neptune presses against your natal Mercury... foggy thinking, miscommunication, and deception (of self or others) may persist. Don't sign contracts, don't trust your first reading of a situation, and don't assume you're being told the whole truth.`,
    opposite: `Neptune opposes your natal Mercury... someone else's words may confuse, enchant, or mislead you. The information you're receiving needs verification... beauty of expression doesn't guarantee truth of content.`,
    sextile: `Neptune gently supports your natal Mercury... a subtle enhancement of imaginative thinking. Good for creative writing, brainstorming, and any mental work that benefits from a less literal approach.`,
  },
  NEPTUNE_VENUS: {
    conjunct: `Neptune is crossing your natal Venus... love becomes transcendent. You may fall in love with an ideal, a fantasy, or something genuinely otherworldly. This transit produces the most beautiful art and the most heartbreaking romantic illusions... sometimes both at once. Love wisely, but let yourself love.`,
    trine: `Neptune flows with your natal Venus... romance, beauty, and spiritual love merge effortlessly. This is one of the most artistically and romantically inspired transits possible. Create beauty, receive love, and let yourself be moved.`,
    square: `Neptune presses against your natal Venus... romantic deception, financial confusion, or aesthetic disillusionment may cloud your judgment. What looks perfect may not be real... and what's real may not look perfect. Wait for clarity.`,
    opposite: `Neptune opposes your natal Venus... someone else may embody an ideal you're projecting. The enchantment is powerful... but the person underneath the projection is human. See them, not just what you want them to be.`,
    sextile: `Neptune gently supports your natal Venus... a quiet, dreamy quality to your love life and creative sensibilities. Beauty feels more accessible, tenderness comes more easily. A softly magical period.`,
  },
  NEPTUNE_MARS: {
    conjunct: `Neptune is crossing your natal Mars... your drive dissolves and reforms. You may feel confused about what you want, unmotivated in traditional ways, or drawn to fight for causes larger than yourself. Physical energy may fluctuate unpredictably. The action this transit asks for is spiritual... not forceful.`,
    trine: `Neptune flows with your natal Mars... intuitive action and inspired effort converge. Your ability to act on behalf of something beautiful, spiritual, or compassionate is enhanced. Fight for the dream.`,
    square: `Neptune presses against your natal Mars... energy dissipation, misdirected effort, or deception around what you're actually doing may frustrate you. Check your motives... are you acting from inspiration or avoidance?`,
    opposite: `Neptune opposes your natal Mars... someone else's passivity or deception may undermine your efforts. The enemy you're fighting may not be real... or the ally you're trusting may not be honest.`,
    sextile: `Neptune gently supports your natal Mars... a subtle alignment of action and intuition. Trust the gentle impulse rather than forcing the aggressive one.`,
  },
  NEPTUNE_JUPITER: {
    conjunct: `Neptune is crossing your natal Jupiter... faith expands into something vast and formless. Your spiritual life, your imagination, and your belief in what's possible grow beyond anything concrete. This is beautiful for spiritual awakening... and dangerous for practical planning. Dream enormously, but keep one foot on the ground.`,
    trine: `Neptune flows with your natal Jupiter... spiritual abundance and practical generosity merge. Your faith in life is rewarded with experiences that confirm it. This is a deeply blessed period for growth, travel, and philosophical expansion.`,
    square: `Neptune presses against your natal Jupiter... spiritual confusion, grandiose delusions, or faith misplaced in the wrong vessel may challenge you. The longing for meaning is real... the direction it's pulling you may not be.`,
    opposite: `Neptune opposes your natal Jupiter... someone else's spiritual certainty or excessive optimism may conflict with your own. The dissolution of a belief is painful but may be making room for a truer one.`,
    sextile: `Neptune gently supports your natal Jupiter... a quiet deepening of faith and imagination. Inspiration comes through generosity, through nature, through the simple act of believing in something good.`,
  },
  NEPTUNE_SATURN: {
    conjunct: `Neptune is crossing your natal Saturn... the structures you've built are dissolving. This is one of the most disorienting long-term transits... rules stop working, certainties evaporate, and the ground you thought was solid turns to water. What survives this dissolution is what's genuinely meaningful. Everything else was scaffolding.`,
    trine: `Neptune flows with your natal Saturn... the ability to give dreams a practical form is enhanced. Spiritual discipline, artistic commitment, and compassionate leadership are all supported. Build something beautiful that also works.`,
    square: `Neptune presses against your natal Saturn... chronic confusion about responsibilities, loss of structural support, or the slow erosion of something you relied on may persist. The dissolution is painful... but what's dissolving may have been holding you prisoner.`,
    opposite: `Neptune opposes your natal Saturn... the tension between what's real and what's imagined, between structure and surrender, is at its peak. Something concrete must be released so something more alive can take its place.`,
    sextile: `Neptune gently supports your natal Saturn... a subtle softening of rigid structures. Rules become more flexible, responsibilities carry more meaning, and duty begins to feel like devotion.`,
  },
  NEPTUNE_NEPTUNE: {
    conjunct: `Neptune is returning... but this transit takes about 165 years, so you'll only experience squares and oppositions in a human lifetime. Each one marks a generational spiritual shift.`,
    trine: `Neptune harmonizes with your natal Neptune... your generation's spiritual and creative energy is flowing well. You feel in tune with the collective imagination. Artistic and spiritual work resonates with the times.`,
    square: `Neptune challenges your natal Neptune... a generational spiritual crisis around ages 41-42. The dreams and illusions of your youth are being dissolved by midlife reality. What remains is a more honest, if less romantic, spirituality.`,
    opposite: `Neptune opposes your natal Neptune... around age 82, the full arc of your spiritual life is visible. The tension between youthful idealism and the wisdom of age resolves into something gentle and complete.`,
    sextile: `Neptune gently supports your natal Neptune... the spiritual and imaginative dimensions of your generation's experience are quietly enriched. Subtle inspiration is available through art, nature, and contemplation.`,
  },
  NEPTUNE_PLUTO: {
    conjunct: `Neptune is crossing your natal Pluto... the deepest transformation meets the most transcendent dissolving. This generational transit takes decades and works at the collective level, but personally it may manifest as a profound spiritual transformation that operates beneath conscious awareness.`,
    trine: `Neptune flows with your natal Pluto... the ability to transform through surrender, to find power in letting go, and to access the spiritual dimensions of deep psychological work is enhanced for your generation.`,
    square: `Neptune presses against your natal Pluto... the tension between dissolution and transformation, between surrender and power, creates deep collective and personal tension. What emerges is a new understanding of spiritual power.`,
    opposite: `Neptune opposes your natal Pluto... the full spectrum of spiritual transformation is activated at the generational level. What your generation fears most and what it most yearns for are being illuminated simultaneously.`,
    sextile: `Neptune gently supports your natal Pluto... a quiet but profound alignment of spiritual sensitivity and transformative depth. Healing happens in the background, almost invisibly.`,
  },
  NEPTUNE_NORTH_NODE: {
    conjunct: `Neptune is crossing your North Node... your soul's direction dissolves into something larger and less definable. The path forward may feel unclear... because it's not a path in the conventional sense. It's a surrender to a purpose that can't be planned, only lived.`,
    trine: `Neptune harmonizes with your North Node... your growth direction aligns with something spiritual, creative, or compassionate. Trust the pull toward something you can't fully explain.`,
    square: `Neptune challenges your North Node... confusion between escapism and genuine spiritual growth may stall your evolution. Not every dream is a calling... discern which dissolution serves your soul and which is just avoidance.`,
    opposite: `Neptune crosses your South Node... old patterns of escapism, fantasy, or spiritual bypassing are activated. The comfort of the dream may be keeping you from the growth of waking up.`,
    sextile: `Neptune gently supports your North Node... a subtle spiritual nudge in the direction of your purpose. The guidance comes through intuition, dreams, and the quiet voice that speaks when you stop trying to hear it.`,
  },
  NEPTUNE_CHIRON: {
    conjunct: `Neptune is crossing your natal Chiron... your deepest wound dissolves into something larger. The pain may feel boundless... but so does the compassion that comes from allowing it to flow through you rather than fighting it. This is healing through surrender.`,
    trine: `Neptune flows with your natal Chiron... healing through creativity, spirituality, and compassion is deeply supported. Your wound becomes a channel for something beautiful when you stop trying to fix it and simply let it be.`,
    square: `Neptune presses against your natal Chiron... the wound becomes more confusing, more diffuse, harder to name. The healing isn't being blocked... it's being deepened beyond what language can capture. Be patient with the process.`,
    opposite: `Neptune opposes your natal Chiron... someone else's pain or spiritual journey may mirror your own wound in ways that dissolve your defenses. The vulnerability is overwhelming... and exactly what's needed.`,
    sextile: `Neptune gently supports your natal Chiron... a quiet, almost imperceptible healing. The wound softens, the edges blur, and what once felt sharp begins to feel like tenderness.`,
  },

  // ─── PLUTO transits ───────────────────────────────────────────────────
  PLUTO_SUN: {
    conjunct: `Pluto is crossing your natal Sun... your identity is being fundamentally transformed. This transit, which unfolds over 2-3 years, strips away every inauthentic layer of who you've been and forces you to rebuild from the core. Who emerges is someone you couldn't have imagined before... more powerful, more honest, and more alive.`,
    trine: `Pluto harmonizes with your natal Sun... deep personal power flows naturally. Your ability to transform situations, to influence outcomes, and to live with authentic intensity is enhanced. Lead from the deepest part of yourself.`,
    square: `Pluto presses against your natal Sun... power struggles, identity crises, or confrontation with forces that seem to threaten your existence may dominate a period of years. The destruction is selective... what dies needed to. What survives is who you actually are.`,
    opposite: `Pluto opposes your natal Sun... others may attempt to control, dominate, or fundamentally change you. The confrontation with external power forces you to discover your own. What they can't take from you is what's truly yours.`,
    sextile: `Pluto gently supports your natal Sun... a subtle but real deepening of your personal power. Transformation happens quietly, almost invisibly, but the person you're becoming is noticeably different from who you were.`,
  },
  PLUTO_MOON: {
    conjunct: `Pluto is crossing your natal Moon... your emotional world is being rebuilt from the foundation. This multi-year transit may involve the loss, transformation, or complete restructuring of your home life, family relationships, or inner emotional landscape. What emerges is an emotional depth and resilience you didn't know you had.`,
    trine: `Pluto flows with your natal Moon... emotional empowerment through depth. Your ability to sit with intense feelings, to nurture from a place of genuine strength, and to transform emotional patterns that have run your life is enhanced.`,
    square: `Pluto presses against your natal Moon... emotional intensity, family crises, or the surfacing of deeply buried psychological material may dominate. The feelings are overwhelming because they've been underground for so long. Let them surface.`,
    opposite: `Pluto opposes your natal Moon... someone else's emotional power or psychological depth may feel threatening. The confrontation with intimacy, dependency, or control in close relationships forces honest reckoning.`,
    sextile: `Pluto gently supports your natal Moon... a quiet deepening of emotional life. Feelings become richer, instincts become sharper, and the capacity for genuine emotional intimacy grows without drama.`,
  },
  PLUTO_MERCURY: {
    conjunct: `Pluto is crossing your natal Mercury... your mind is being transformed at the deepest level. Obsessive thinking, penetrating insight, and the compulsion to understand what's hidden may dominate. Your communication becomes powerful enough to change people... use that power carefully.`,
    trine: `Pluto flows with your natal Mercury... strategic thinking, psychological insight, and the ability to communicate with transformative impact are all enhanced. Your words carry unusual weight and depth.`,
    square: `Pluto presses against your natal Mercury... obsessive thoughts, paranoid thinking, or power struggles through communication may surface. Your mind is powerful right now... make sure it's not turning that power against you.`,
    opposite: `Pluto opposes your natal Mercury... someone else's words may feel manipulative or psychologically threatening. The power dynamics playing out through communication need to be named before they can be navigated.`,
    sextile: `Pluto gently supports your natal Mercury... a subtle depth to your thinking. You may notice patterns, hidden motivations, and unspoken truths that usually escape detection. Use the insight constructively.`,
  },
  PLUTO_VENUS: {
    conjunct: `Pluto is crossing your natal Venus... love becomes a transformative force that can't be controlled or contained. Obsessive attraction, the death and rebirth of a relationship, or a complete overhaul of your values may unfold over years. What you desire after this transit is fundamentally different from what you desired before.`,
    trine: `Pluto flows with your natal Venus... deep, transformative love and profound creative power are available. Your ability to attract, to create, and to form bonds that change both people is at its peak. Let love be powerful.`,
    square: `Pluto presses against your natal Venus... jealousy, obsession, or power dynamics in relationships may surface with painful intensity. The love is real... but so is the shadow. Face what you've been hiding in your relationships.`,
    opposite: `Pluto opposes your natal Venus... someone else may wield power in your relationship in ways that force transformation. The attraction may be irresistible and the dynamics may be toxic... or the confrontation may be exactly what's needed to deepen into real intimacy.`,
    sextile: `Pluto gently supports your natal Venus... a quiet deepening of your capacity for love and creative expression. Surface-level beauty loses its appeal... what you're drawn to now has depth and substance.`,
  },
  PLUTO_MARS: {
    conjunct: `Pluto is crossing your natal Mars... your will becomes volcanic. The drive for power, the capacity for sustained effort, and the willingness to destroy what doesn't serve you are amplified to an extreme degree. This transit can build empires or burn them... the difference is consciousness.`,
    trine: `Pluto flows with your natal Mars... extraordinary power, endurance, and strategic action are available. Your ability to persist through any obstacle, to channel intense energy productively, and to fight for what matters is formidable.`,
    square: `Pluto presses against your natal Mars... rage, power struggles, or confrontation with forces that seem to threaten your survival may surface. The intensity is real and potentially destructive... channel it into transformation rather than warfare.`,
    opposite: `Pluto opposes your natal Mars... someone else's power or aggression may directly challenge yours. The confrontation tests whether your strength comes from genuine power or from the need to dominate. Only real power survives this test.`,
    sextile: `Pluto gently supports your natal Mars... a quiet but real intensification of your drive and willpower. You can handle more, endure more, and accomplish more than usual without anyone noticing the extra gear.`,
  },
  PLUTO_JUPITER: {
    conjunct: `Pluto is crossing your natal Jupiter... the potential for massive growth, profound transformation, and the accumulation of power is at its peak. This transit can bring wealth, influence, or spiritual awakening at a scale that reshapes your life. Aim high and stay ethical.`,
    trine: `Pluto flows with your natal Jupiter... expansive transformation. Your ability to grow through depth, to find abundance through authenticity, and to influence large-scale outcomes is extraordinary.`,
    square: `Pluto presses against your natal Jupiter... the desire for more power, more growth, more influence may become obsessive or corrupt. The ambition is legitimate... the methods need scrutiny.`,
    opposite: `Pluto opposes your natal Jupiter... someone else's power or ideology may challenge your beliefs and growth trajectory. The confrontation is an opportunity to expand beyond what you thought was possible... or to recognize what needs to be let go.`,
    sextile: `Pluto gently supports your natal Jupiter... quiet but real opportunities for deep growth and lasting influence. The transformation is subtle but the results compound over time.`,
  },
  PLUTO_SATURN: {
    conjunct: `Pluto is crossing your natal Saturn... the deepest structures of your life are being transformed. Authority, career, duty, and the very foundations you've built your life on are undergoing a complete metamorphosis. This is one of the heaviest transits possible... and what emerges from it is unbreakable.`,
    trine: `Pluto flows with your natal Saturn... the ability to build structures of lasting power. Your capacity for strategic long-term planning, for wielding authority with depth and integrity, and for creating something permanent is at its peak.`,
    square: `Pluto presses against your natal Saturn... immovable structures meet irresistible transformation. Something that felt permanent is being destroyed or fundamentally altered. The resistance is natural... and ultimately futile. Adapt.`,
    opposite: `Pluto opposes your natal Saturn... external power structures directly challenge your own. The confrontation with authority, institutions, or the limits of what you've built forces a deep reckoning with what's truly worth defending.`,
    sextile: `Pluto gently supports your natal Saturn... quiet, deep, lasting transformation of your foundations. Nothing dramatic on the surface... but the bedrock of your life is being strengthened in ways that will matter for decades.`,
  },
  PLUTO_NORTH_NODE: {
    conjunct: `Pluto is crossing your North Node... your soul's purpose is being transformed. The direction of your growth becomes intense, unavoidable, and deeply powerful. What you're evolving toward isn't comfortable... it's essential. Follow the depth.`,
    trine: `Pluto harmonizes with your North Node... deep transformation and soul purpose align. The evolution feels inevitable in the best way... like becoming who you were always meant to be.`,
    square: `Pluto challenges your North Node... intense resistance to growth, or growth that feels forced rather than chosen. The transformation is happening whether you cooperate or not... cooperation just makes it less painful.`,
    opposite: `Pluto activates your South Node... deep karmic patterns and past-life power dynamics are surfacing. What you've always relied on for survival is being dismantled so something new can take its place.`,
    sextile: `Pluto gently supports your North Node... a quiet but powerful alignment of transformation and purpose. The depth you're developing is exactly what your soul came here to cultivate.`,
  },
  PLUTO_CHIRON: {
    conjunct: `Pluto is crossing your natal Chiron... the deepest wound meets the most transformative force in astrology. What emerges from this multi-year process is not just healing but a complete alchemical transformation of your pain into power. The wound doesn't disappear... it becomes your greatest source of strength and wisdom.`,
    trine: `Pluto flows with your natal Chiron... deep healing through transformation. Your ability to turn suffering into wisdom, to mentor others through their darkest moments, and to alchemize pain into purpose is profoundly supported.`,
    square: `Pluto presses against your natal Chiron... the wound is being pushed to the surface with relentless intensity. What you've been avoiding, suppressing, or medicating demands to be faced. The confrontation is painful... and it's the beginning of the most meaningful healing of your life.`,
    opposite: `Pluto opposes your natal Chiron... someone else may force you to confront your deepest wound through their own intensity. The crisis they create is the catalyst your healing has been waiting for.`,
    sextile: `Pluto gently supports your natal Chiron... a quiet, deep healing that happens almost beneath awareness. The wound doesn't scream anymore... it teaches.`,
  },

  // ─── NORTH NODE transits ──────────────────────────────────────────────
  NORTH_NODE_SUN: {
    conjunct: `The North Node is crossing your natal Sun... a moment of destiny around your identity and purpose. People, situations, or opportunities that feel fated may appear. This transit says: the direction your soul needs to grow is through becoming more fully yourself.`,
    trine: `The North Node harmonizes with your natal Sun... your sense of self and your growth direction are aligned. Being yourself is the path forward.`,
    square: `The North Node challenges your natal Sun... growing pains around identity. Who you're becoming may conflict with who you've been.`,
    opposite: `The South Node crosses your Sun... old identity patterns are activated. The comfort of the familiar self may be keeping you from the person you're meant to become.`,
    sextile: `The North Node gently supports your natal Sun... a subtle sense that being authentic is leading you somewhere meaningful.`,
  },
  NORTH_NODE_MOON: {
    conjunct: `The North Node is crossing your natal Moon... emotional growth is your destiny right now. Your feelings, your needs, and your capacity for nurturing are being called toward their highest expression.`,
    trine: `The North Node flows with your natal Moon... your emotional instincts are guiding you toward growth. Trust what you feel.`,
    square: `The North Node challenges your natal Moon... emotional patterns may resist the growth your soul is seeking. The comfortable feeling may not be the right one.`,
    opposite: `The South Node crosses your Moon... habitual emotional responses are highlighted. Notice what you default to emotionally and ask if it still serves your evolution.`,
    sextile: `The North Node gently supports your natal Moon... quiet emotional growth that happens through listening to your instincts more carefully.`,
  },
  NORTH_NODE_VENUS: {
    conjunct: `The North Node is crossing your natal Venus... a fated quality to love, beauty, and values enters your life. Relationships that begin now may carry special significance for your soul's growth.`,
    trine: `The North Node flows with your natal Venus... what you love and what you're growing toward are aligned. Follow your heart... it knows the way.`,
    square: `The North Node challenges your natal Venus... what you desire and what you need for growth may conflict. The easy pleasure isn't always the right choice.`,
    opposite: `The South Node crosses your Venus... old patterns in love and values are activated. The relationship that feels familiar may be the one holding you back.`,
    sextile: `The North Node gently supports your natal Venus... a subtle alignment of love and purpose. What brings you joy is also moving you forward.`,
  },
  NORTH_NODE_MARS: {
    conjunct: `The North Node is crossing your natal Mars... the courage to act on your soul's purpose is activated. Bold moves made now may have a fated quality. Fight for your growth.`,
    trine: `The North Node flows with your natal Mars... action and destiny align. What you do today matters more than usual.`,
    square: `The North Node challenges your natal Mars... the impulse to act and the direction of growth may feel at odds. Channel the energy wisely.`,
    opposite: `The South Node crosses your Mars... old aggressive patterns or habitual ways of asserting yourself are triggered. Notice if you're fighting from habit or from purpose.`,
    sextile: `The North Node gently supports your natal Mars... a subtle boost to the courage needed for growth. Take the small brave step.`,
  },

  // ─── CHIRON transits ──────────────────────────────────────────────────
  CHIRON_SUN: {
    conjunct: `Chiron is crossing your natal Sun... your core identity meets the wounded healer. Over this multi-year transit, the ways your sense of self was wounded early in life become visible and available for healing. The pain of not being seen as who you really are becomes the doorway to radical self-acceptance.`,
    trine: `Chiron harmonizes with your natal Sun... a period where healing and self-expression support each other. Your wounds become wisdom, and sharing your truth becomes the medicine.`,
    square: `Chiron presses against your natal Sun... the wound around identity, recognition, or self-worth is activated. The pain you're feeling isn't about the current situation... it's about the original one. Treat the root, not the symptom.`,
    opposite: `Chiron opposes your natal Sun... someone else may mirror your deepest insecurity about who you are. The reflection hurts because it's accurate... and accuracy is the beginning of healing.`,
    sextile: `Chiron gently supports your natal Sun... a quiet integration of wound and identity. You begin to see your pain not as a flaw but as the most human and relatable part of who you are.`,
  },
  CHIRON_MOON: {
    conjunct: `Chiron is crossing your natal Moon... the deepest emotional wound is being revisited. Feelings of abandonment, inadequacy, or emotional hunger that trace back to childhood may surface. The tears aren't weakness... they're the beginning of the emotional healing you've been postponing.`,
    trine: `Chiron flows with your natal Moon... emotional healing happens through nurturing and being nurtured. Your capacity for empathy becomes your greatest gift.`,
    square: `Chiron presses against your natal Moon... emotional wounds are activated by current circumstances. The sensitivity you're feeling has old roots... tending them changes everything.`,
    opposite: `Chiron opposes your natal Moon... someone else's emotional needs may trigger your own unhealed material. The caretaker in you may need to be the one cared for.`,
    sextile: `Chiron gently supports your natal Moon... a quiet healing of emotional patterns. The inner child feels a little safer, a little more held, a little more willing to trust.`,
  },
  CHIRON_VENUS: {
    conjunct: `Chiron is crossing your natal Venus... the wound around love, beauty, and self-worth is illuminated. Over this transit, your relationship to being loved and feeling worthy of love undergoes a profound healing. The scar becomes the most beautiful part.`,
    trine: `Chiron flows with your natal Venus... healing through beauty, love, and creative expression. Art made from pain becomes art that heals others.`,
    square: `Chiron presses against your natal Venus... pain in relationships or around self-worth surfaces. The rejection you fear says more about the original wound than the current situation.`,
    opposite: `Chiron opposes your natal Venus... someone else's love or beauty may highlight what feels broken in you. The comparison is the wound talking... not the truth.`,
    sextile: `Chiron gently supports your natal Venus... a quiet mending of the relationship between love and pain. Beauty and vulnerability begin to coexist without conflict.`,
  },
  CHIRON_MARS: {
    conjunct: `Chiron is crossing your natal Mars... the wound around anger, assertion, and physical power is being healed. Over this transit, the ways you were taught to suppress or misuse your energy become visible. Reclaiming your right to act, to fight, and to take up space is the healing.`,
    trine: `Chiron flows with your natal Mars... the ability to act from a place of healed strength. Your assertiveness carries wisdom, and your courage carries compassion.`,
    square: `Chiron presses against your natal Mars... anger and vulnerability collide. The rage may be old... let it surface so it can finally be released rather than recycled.`,
    opposite: `Chiron opposes your natal Mars... someone else's aggression or power may reopen a wound around your own ability to fight back. Respond from healing, not from the wound.`,
    sextile: `Chiron gently supports your natal Mars... a quiet reclamation of energy. Something that was suppressed begins to move again... gently, carefully, but unmistakably alive.`,
  },

  // ─── MERCURY transits ────────────────────────────────────────────────────
  MERCURY_SUN: {
    conjunct: `Mercury is crossing your natal Sun... your mind and your identity merge. Words feel more personal today, and what you say carries the weight of who you are. This is a powerful moment for self-expression... write, speak, or pitch something that matters to you.`,
    trine: `Mercury is harmonizing with your natal Sun... your thinking is sharp and your communication is confident. Ideas flow naturally from a place of genuine self-knowledge. Trust what comes to mind.`,
    square: `Mercury is creating friction with your natal Sun... your words and your intentions may feel misaligned. You know what you mean, but it's not landing the way you want. Slow down and clarify before assuming you've been understood.`,
    opposite: `Mercury opposes your natal Sun... someone else's ideas or communication style may challenge your perspective. The disagreement isn't personal... it's intellectual. Let it sharpen your thinking rather than threaten your identity.`,
    sextile: `Mercury gently supports your natal Sun... a quiet mental clarity that makes self-expression feel easy. Good day for emails, conversations, or decisions that require you to articulate what you want.`,
  },
  MERCURY_MOON: {
    conjunct: `Mercury is merging with your natal Moon... thoughts and feelings become indistinguishable. You may find yourself thinking about emotional matters with unusual clarity, or feeling your way through intellectual problems. Let the head and heart collaborate.`,
    trine: `Mercury flows with your natal Moon... you can articulate your feelings today in a way that others actually understand. Emotional intelligence is heightened. This is an excellent moment for honest conversations about how you feel.`,
    square: `Mercury presses against your natal Moon... your rational mind and your emotional instincts are arguing. Logic says one thing, your gut says another. Neither is wrong... the answer lives somewhere between them.`,
    opposite: `Mercury opposes your natal Moon... what someone says may hit an emotional nerve. The reaction you're having reveals more about your inner world than about their words. Notice what gets triggered.`,
    sextile: `Mercury gently supports your natal Moon... a day where you can think about feelings and feel about thoughts without either getting in the way. Journaling or talking things through with someone you trust is especially productive.`,
  },
  MERCURY_MERCURY: {
    conjunct: `Mercury is returning to its natal position in your chart... this is your Mercury return, a mental reset that happens roughly once a year. Your thinking style is renewed, recalibrated. Pay attention to what ideas feel fresh and what mental habits feel stale.`,
    trine: `Mercury harmonizes with your natal Mercury... your mind is running smoothly, processing information at its natural best. Learning, reading, writing, and conversation all feel unusually satisfying today.`,
    square: `Mercury challenges your natal Mercury... mental restlessness, miscommunication, or information overload may frustrate you. Your usual way of processing isn't working quite right... adapt rather than force it.`,
    opposite: `Mercury opposes your natal Mercury... other people's logic may conflict with yours. This isn't about who's smarter... it's about recognizing that there's more than one valid way to think about any given thing.`,
    sextile: `Mercury gently energizes your natal Mercury... a subtle boost to your mental acuity. Good day for puzzles, planning, short trips, or any task that rewards quick thinking and clear communication.`,
  },
  MERCURY_VENUS: {
    conjunct: `Mercury is merging with your natal Venus... words become beautiful and beauty becomes something you can articulate. This is a lovely transit for writing, design, aesthetic decisions, or telling someone what they mean to you.`,
    trine: `Mercury flows with your natal Venus... charm comes naturally to your communication today. What you say sounds better, lands softer, and connects more gracefully. Use this for diplomacy, creative writing, or social situations.`,
    square: `Mercury presses against your natal Venus... what you think and what you value may feel at odds. You might say something awkward about something beautiful, or think too hard about something that just wants to be enjoyed.`,
    opposite: `Mercury opposes your natal Venus... someone else may express something that touches your sense of beauty or values. Let their perspective enrich yours rather than competing with it.`,
    sextile: `Mercury gently supports your natal Venus... a pleasant undercurrent to your conversations and thinking. Aesthetic appreciation sharpens, social interactions smooth out. A quietly charming day.`,
  },
  MERCURY_MARS: {
    conjunct: `Mercury is merging with your natal Mars... your mind is sharp, your words are direct, and your thinking has an edge to it. This is powerful for debate, strategy, or any situation that requires mental assertiveness. Just watch for verbal aggression.`,
    trine: `Mercury flows with your natal Mars... decisive thinking and confident communication align. You can cut through complexity quickly today. Good for negotiations, problem-solving, or anything requiring mental and physical coordination.`,
    square: `Mercury presses against your natal Mars... arguments may flare, impatience with slow thinking intensifies, and your words may be sharper than intended. The mental energy is powerful... but it needs a target, not a victim.`,
    opposite: `Mercury opposes your natal Mars... someone's words may provoke you, or your directness may provoke them. The friction is intellectual at its core... try to engage the idea, not the emotion behind it.`,
    sextile: `Mercury gently energizes your natal Mars... a subtle mental sharpness that makes you quicker on your feet. Good for tackling problems you've been avoiding or speaking up about something you've been holding back.`,
  },
  MERCURY_JUPITER: {
    conjunct: `Mercury is merging with your natal Jupiter... your mind expands. Big ideas feel within reach, optimism colors your thinking, and the desire to learn something meaningful is strong. This is a day for vision... just make sure the details don't get lost in the excitement.`,
    trine: `Mercury flows with your natal Jupiter... broad thinking and practical communication work together beautifully. This is excellent for teaching, publishing, long-range planning, or any conversation that benefits from wisdom and perspective.`,
    square: `Mercury presses against your natal Jupiter... you may overestimate, over-promise, or try to tackle an idea that's bigger than you can execute right now. The ambition is good... the timing might need adjusting.`,
    opposite: `Mercury opposes your natal Jupiter... someone else's belief system or big idea may challenge your own. This isn't a threat to your worldview... it's an invitation to expand it.`,
    sextile: `Mercury gently supports your natal Jupiter... a pleasant mental openness that makes learning feel enjoyable and conversations feel meaningful. Follow your curiosity today... it knows where it's going.`,
  },
  MERCURY_SATURN: {
    conjunct: `Mercury is merging with your natal Saturn... your thinking becomes serious, structured, and precise. This is a transit for planning, organizing, and saying the hard thing that needs to be said. Frivolous thinking drops away... what remains is what matters.`,
    trine: `Mercury flows with your natal Saturn... discipline and mental clarity combine. Your thinking is methodical, your words carry authority, and your ability to focus on complex tasks is enhanced. Use this for important documents, contracts, or long-term decisions.`,
    square: `Mercury presses against your natal Saturn... mental blocks, self-doubt, or difficulty communicating may surface. The ideas are there... they're just struggling to get past an inner critic. Be patient with yourself.`,
    opposite: `Mercury opposes your natal Saturn... rules, deadlines, or authority figures may demand your mental attention. The restriction feels limiting, but it may also be clarifying... constraints can sharpen thinking.`,
    sextile: `Mercury gently supports your natal Saturn... a quiet day of focused, productive thinking. Nothing flashy... just the satisfying kind of mental work that builds something lasting.`,
  },
  MERCURY_URANUS: {
    conjunct: `Mercury is merging with your natal Uranus... expect mental lightning. Sudden insights, unconventional ideas, and a fierce need to think differently may electrify your mind. This transit breaks mental patterns... let it surprise you.`,
    trine: `Mercury flows with your natal Uranus... original thinking comes easily and innovation feels natural. You may connect dots that others can't see, or solve a problem with an approach nobody expected. Trust the weird idea.`,
    square: `Mercury presses against your natal Uranus... mental restlessness, scattered thinking, or a rebellious urge to say something disruptive may surface. The breakthrough is buried in the chaos... but you have to slow down to find it.`,
    opposite: `Mercury opposes your natal Uranus... someone else's radical idea or unexpected news may jolt your thinking. The disruption isn't comfortable, but it might be exactly the perspective shift you needed.`,
    sextile: `Mercury gently energizes your natal Uranus... a spark of originality in your thinking today. Good for brainstorming, experimenting, or approaching a familiar problem from a completely new angle.`,
  },
  MERCURY_NEPTUNE: {
    conjunct: `Mercury is merging with your natal Neptune... your thinking becomes more intuitive, more imaginative, and less reliable. This is beautiful for creative writing, poetry, or meditation... and terrible for contracts, logistics, or anything requiring precision. Know which mode you're in.`,
    trine: `Mercury flows with your natal Neptune... imagination and communication blend seamlessly. You can articulate the ineffable today... feelings that usually resist language become expressible. Beautiful transit for art, music, or spiritual writing.`,
    square: `Mercury presses against your natal Neptune... confusion, misunderstanding, or deception may cloud your thinking. What seems clear might not be... double-check facts, reread emails, and don't sign anything you haven't fully understood.`,
    opposite: `Mercury opposes your natal Neptune... someone else's words may be unclear, misleading, or too good to be true. This transit tests your discernment... trust your intuition, but verify the details.`,
    sextile: `Mercury gently supports your natal Neptune... a subtle imaginative quality to your thinking today. Daydreaming may be more productive than usual... let your mind wander and see where it leads.`,
  },
  MERCURY_PLUTO: {
    conjunct: `Mercury is merging with your natal Pluto... your mind goes deep. Surface-level thinking won't satisfy you today... you want the truth beneath the truth. This is a powerful transit for research, investigation, therapy, or any conversation that requires total honesty.`,
    trine: `Mercury flows with your natal Pluto... your ability to see through pretense and get to the core of any issue is enhanced. Strategic thinking, psychological insight, and persuasive communication are all unusually strong.`,
    square: `Mercury presses against your natal Pluto... obsessive thinking, paranoia, or a need to control information may surface. Your mind is powerful today... make sure it's serving you and not consuming you.`,
    opposite: `Mercury opposes your natal Pluto... someone else's words may feel manipulative, or a hidden truth may surface through conversation. Power dynamics are playing out through language... notice who's trying to control the narrative.`,
    sextile: `Mercury gently supports your natal Pluto... a quiet depth to your thinking today. You may notice patterns others miss, or understand motivations that aren't being spoken aloud. Use the insight wisely.`,
  },
  MERCURY_NORTH_NODE: {
    conjunct: `Mercury is crossing your North Node... a conversation, idea, or piece of information may point you toward your soul's growth direction. Pay attention to what you learn today... it may be more significant than it seems in the moment.`,
    trine: `Mercury harmonizes with your North Node... your thinking naturally aligns with your growth path. Ideas that excite you today are probably leading somewhere important. Follow the curiosity.`,
    square: `Mercury challenges your North Node... old thinking patterns may resist the new direction your soul is trying to take. The mental discomfort is growing pains... let the new perspective in.`,
    opposite: `Mercury crosses your South Node... familiar mental habits are activated. Notice what you default to in your thinking today... and ask whether those patterns are serving your growth or keeping you comfortable.`,
    sextile: `Mercury gently supports your North Node... a subtle mental nudge in the direction of your purpose. A conversation or insight today may plant a seed that grows into something meaningful later.`,
  },
  MERCURY_CHIRON: {
    conjunct: `Mercury is illuminating your natal Chiron... words may touch your deepest wound today, either through something you hear or something you finally say out loud. Naming the pain is part of healing it... let language be medicine.`,
    trine: `Mercury flows with your natal Chiron... you can articulate your vulnerabilities in a way that helps both you and others. Teaching, counseling, or simply having an honest conversation about something painful may be deeply healing today.`,
    square: `Mercury presses against your natal Chiron... communication may feel painful or clumsy around sensitive topics. The words you're looking for exist... they're just harder to reach when the wound is involved. Be gentle with yourself.`,
    opposite: `Mercury opposes your natal Chiron... someone else's words may inadvertently poke an old wound. The reaction you have tells you something important about what still needs tending inside.`,
    sextile: `Mercury gently supports your natal Chiron... a quiet day where insight into your own healing feels accessible. You may understand something about your pain that you couldn't articulate before.`,
  },
}

export function describeTransit(t: Transit): string {
  const transitName = PLANET_NAMES[t.transitPlanet] || t.transitPlanet
  const natalName = PLANET_NAMES[t.natalPlanet] || t.natalPlanet
  const aspectPhrase = ASPECT_PHRASES[t.aspect] || t.aspect
  const houseTheme = HOUSE_THEMES[t.transitHouse] || ''
  const natalEnergy = PLANET_ENERGY[t.natalPlanet] || ''
  const transitEnergy = PLANET_ENERGY[t.transitPlanet] || ''

  const opening = `${transitName} in ${t.transitSign} is currently ${aspectPhrase} your natal ${natalName} in ${t.natalSign}.`

  // Try specific transit pair description first
  const pairKey = `${t.transitPlanet}_${t.natalPlanet}`
  const pair = TRANSIT_PAIRS[pairKey]
  if (pair && pair[t.aspect]) {
    return `${opening} ${pair[t.aspect]}`
  }

  // Fallback to generic descriptions
  let body = ''
  if (t.aspect === 'conjunct') {
    body = `This is a powerful alignment... ${transitEnergy} and ${natalEnergy} are fusing together in the area of ${houseTheme}. You may feel this as a heightened awareness or intensity around these themes.`
  } else if (t.aspect === 'trine' || t.aspect === 'sextile') {
    body = `This is a supportive aspect... ${transitEnergy} flows easily into your ${natalEnergy}, opening doors in the area of ${houseTheme}. Notice what feels effortless right now and lean into it.`
  } else if (t.aspect === 'square') {
    body = `This creates productive tension... ${transitEnergy} is pushing against your ${natalEnergy}, asking for adjustment in the area of ${houseTheme}. The friction you feel is an invitation to grow.`
  } else if (t.aspect === 'opposite') {
    body = `This creates a pull between two poles... ${transitEnergy} and your ${natalEnergy} are in dialogue across the axis of ${houseTheme}. Balance comes from honoring both sides rather than choosing one.`
  }

  return `${opening} ${body}`
}

// ─── Moon in Signs (daily flavor) ────────────────────────────────────────────

const MOON_IN_SIGN: Record<string, string> = {
  Aries: `The Moon in Aries brings a restless, impulsive emotional charge... you may feel the urge to act before you think, to start something new, or to assert yourself in ways that surprise you. This is raw emotional fire... it wants movement, not patience. Let yourself be bold today, but notice where the impulse to react is actually a need to be heard.`,
  Taurus: `The Moon in Taurus slows your inner world to a steadier rhythm... comfort matters more than usual today, and you may find yourself reaching for what feels safe, familiar, and physically grounding. This is the Moon at its most sensual... good food, soft textures, a slower pace. Let yourself settle into the body rather than the mind.`,
  Gemini: `The Moon in Gemini scatters your emotional energy across a dozen directions at once... you may feel talkative, curious, easily distracted, and emotionally lighter than usual. This is the Moon in its most social mode... conversations feed you, new information excites you. Notice if the busyness is genuine curiosity or a way of avoiding a feeling that needs space.`,
  Cancer: `The Moon in Cancer is the Moon at home... emotions run deep, intuition sharpens, and the need for safety and belonging intensifies. You may feel more sensitive than usual, more aware of what others need, more affected by the emotional temperature of a room. This is a day for nurturing... yourself first, then others.`,
  Leo: `The Moon in Leo warms your emotional world with a need to be seen, appreciated, and creatively expressed... you may feel more generous, more dramatic, and more aware of whether the people around you are reflecting back the version of yourself you want to be. This is the Moon asking for recognition... give it to yourself before you look for it elsewhere.`,
  Virgo: `The Moon in Virgo brings a quiet, practical emotional clarity... you may feel the urge to organize, to fix, to make something work better than it did yesterday. This is the Moon in service mode... helpful, detail-oriented, slightly anxious if things aren't in order. Let yourself be useful today, but notice if the need to fix things is really a need to feel in control.`,
  Libra: `The Moon in Libra turns your emotional radar toward others... harmony, fairness, and relational balance feel more important than usual today. You may avoid conflict more readily, seek approval more actively, or notice beauty more sharply. This is the Moon asking for connection... but real connection sometimes requires the honesty that disrupts the peace.`,
  Scorpio: `The Moon in Scorpio intensifies everything beneath the surface... emotions feel heavier, instincts sharpen, and the desire to understand what's really going on runs deeper than usual. You may feel protective, suspicious, or drawn toward emotional truth that others would rather avoid. This is the Moon in its most investigative mode... trust what you sense, even if you can't prove it yet.`,
  Sagittarius: `The Moon in Sagittarius lifts your emotional energy upward and outward... you may feel optimistic, restless for meaning, hungry for perspective, or irritated by anything that feels small or petty. This is the Moon in its most philosophical mode... it wants to believe in something bigger. Let yourself dream today, but notice if the optimism is running from something uncomfortable.`,
  Capricorn: `The Moon in Capricorn brings a sober, grounded quality to your emotional world... feelings are filtered through a sense of duty and pragmatism today, and you may find yourself more focused on what needs to be done than on how you feel about it. This is the Moon in work mode... disciplined, responsible, slightly stoic. Give yourself permission to feel something unproductive.`,
  Aquarius: `The Moon in Aquarius creates a cool emotional detachment... you may feel more intellectual than emotional today, more interested in ideas than in feelings, more drawn to the collective than to the personal. This is the Moon in its most independent mode... community matters, but so does space. Notice where the detachment is clarity and where it might be avoidance.`,
  Pisces: `The Moon in Pisces dissolves the edges of your emotional world... boundaries blur, intuition floods in, and you may feel everything more deeply without being able to name exactly what you're feeling. This is the Moon at its most empathic and most vulnerable... creativity and compassion flow easily, but so does emotional absorption. Protect your energy today while staying open to what moves through you.`,
}

// ─── Moon in Houses (personalized daily focus) ──────────────────────────────

const MOON_IN_HOUSE: Record<number, string> = {
  1: `With the Moon passing through your first house, your emotions are close to the surface and visible to others... you may come across as more expressive, more reactive, or more present than usual. This is a day where how you feel and how you appear are unusually aligned. Pay attention to first impressions today... both the ones you make and the ones you receive.`,
  2: `The Moon moving through your second house draws your emotional attention to money, possessions, and what you value... you may feel more security-conscious than usual, more aware of what you have and what you need. This is your inner world asking a practical question... does your material life reflect what actually matters to you?`,
  3: `With the Moon in your third house, your mind is emotionally charged... conversations carry more weight, words land differently, and you may process feelings by talking or writing them out. This is a day for meaningful exchanges with siblings, neighbors, or anyone in your immediate circle. What you say today has more impact than you might expect.`,
  4: `The Moon passing through your fourth house activates your deepest sense of home and belonging... you may feel drawn inward, nostalgic, or unusually affected by family dynamics. This is the Moon in its most private position... the world outside matters less today than the world inside. Let yourself retreat if you need to... the foundation you tend now supports everything else.`,
  5: `With the Moon in your fifth house, your emotional energy turns toward play, creativity, and self-expression... you may feel more romantic, more playful, more willing to take a small risk for the sake of joy. This is the Moon inviting you to enjoy something without calculating its return. Create something, flirt with an idea, or simply let yourself have fun.`,
  6: `The Moon moving through your sixth house brings emotional awareness to your daily routines, your body, and your work... you may feel more attuned to your health, more bothered by disorder, or more emotionally invested in being useful. This is the Moon asking whether your habits serve you or drain you. Small adjustments made today tend to stick.`,
  7: `With the Moon in your seventh house, your emotions are oriented toward partnership and one-on-one connection... you may feel more aware of what you need from others and what they need from you. This is the Moon in its most relational position... balance, fairness, and genuine dialogue matter more today. Notice what surfaces when you stop performing and start listening.`,
  8: `The Moon passing through your eighth house deepens everything... emotions feel more intense, hidden truths push closer to the surface, and you may be drawn toward intimacy, vulnerability, or subjects that others avoid. This is the Moon in its most transformative position... something is ready to be released or reclaimed. Trust the discomfort... it's pointing at something real.`,
  9: `With the Moon in your ninth house, your emotional world expands outward... you may feel restless for meaning, drawn to learning something new, or inspired by a perspective that's larger than your current one. This is the Moon asking you to zoom out... what you feel today is connected to what you believe. Let your emotional compass point toward growth.`,
  10: `The Moon moving through your tenth house brings your emotions into your public and professional life... you may feel more ambitious, more sensitive to how you're perceived, or more aware of the gap between who you are and the reputation you carry. This is the Moon asking what success actually feels like... not what it looks like. Lead from something genuine today.`,
  11: `With the Moon in your eleventh house, your emotional energy turns toward community, friendships, and the causes you care about... you may feel more connected to your social circle, more aware of shared goals, or more emotionally invested in belonging to something larger. This is the Moon in its most collective position... the people around you reflect something you need to see about yourself.`,
  12: `The Moon passing through your twelfth house is the quietest, most introspective transit of the month... emotions may surface from somewhere you can't quite name, dreams may be more vivid, and you may feel a pull toward solitude, reflection, or rest. This is the Moon asking you to step back from the noise... what emerges in the silence is worth hearing. Don't fight the need to withdraw today.`,
}

export function describeMoonTransit(moonSign: string, moonHouse: number): string {
  const signText = MOON_IN_SIGN[moonSign] || `The Moon is moving through ${moonSign} today... this colors your emotional landscape in subtle but noticeable ways.`
  const houseText = MOON_IN_HOUSE[moonHouse] || `The Moon is passing through your ${ordinal(moonHouse)} house... pay attention to what stirs beneath the surface in this area of your life.`
  return `${signText}\n\n${houseText}`
}

function ordinal(n: number): string {
  return n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`
}
