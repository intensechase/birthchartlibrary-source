// SERVER ONLY. Hand-checked reading entries in the site voice (docs/redesign/
// 2026-11-20-reading-spec.md). One entry per placement, shared by every chart
// that has it, written in "you". A placement with no entry here is left out of
// the reading or shown with only its facts; never filled with a template.
//
// Keys: aspects 'A|type|B' (A before B in BODY order; ASC and MC are always B),
// pairs 'SUN_ASC:Aries|Pisces', openers 'SUN:Aries', 'MOON:Cancer', 'ASC:Pisces',
// patterns 'PATTERN:kite', sign on a house 'HOUSE:n|Sign' (e.g. 7th, Libra). American spelling,
// no hyphens in copy.

export interface Entry {
  hook: string         // the opening line or two; also the card line in "What stands out"
  text: string         // the rest, paragraphs split by a blank line
  short?: string[]     // "In short": three traits
  watch?: string       // "Watch for": one line
}

export const ENTRIES: Record<string, Entry> = {
  'MOON|opposition|NEPTUNE': {
    hook: 'You can feel what everyone in the room is feeling. Eventually you get around to yourself.',
    text: 'With the Moon and Neptune facing each other this closely, moods come in without knocking: you leave a party carrying the host\'s bad week home with you, and it takes a night\'s sleep to hand it back. People call that being too sensitive. It\'s the same equipment that makes you the first one to notice a friend isn\'t okay, usually before the friend does. The catch is that Neptune shows people at their best, so you tend to fall for the version of someone they haven\'t become yet.',
    short: ['empathetic', 'imaginative', 'deeply loyal to potential'],
    watch: 'saying yes to keep the peace, then needing a week alone to recover.',
  },

  'MOON|trine|PLUTO': {
    hook: 'When something terrible happens, people call you. Not because you\'ll say the right thing. Because you\'ll stay.',
    text: 'The Moon and Pluto working together means your feelings go all the way down and you can follow them there without drowning. Grief, rage, the conversation nobody else will have: you can sit in a room with it and keep your pulse. Most people can\'t, which is why they lean on you.\n\nIt also means you know things about people they haven\'t told you. You read motive the way other people read a menu. Kept kindly, that\'s the best kind of friend. Kept quietly, it can look like you\'re always one step ahead of everyone, including the ones who love you.',
    short: ['steady in a crisis', 'loyal for life', 'hard to fool'],
    watch: 'knowing what someone feels and acting on it before they\'ve said it out loud.',
  },

  'URANUS|conjunction|MC': {
    hook: 'You could do the same job for twenty years, as long as it changes every two.',
    text: 'The Midheaven is the top of the chart, the part of you the public sees: work, reputation, what you\'re known for. Uranus sitting right on it puts the rule breaker in the front window. Everyone born within a few years of you shares your Uranus sign; having it land exactly here is yours alone.\n\nIt shows up as a working life that needs room. The day a job turns into a script, something in you starts packing. People read that as restless. It\'s the same equipment that sees where the work is headed before the meeting about it, and the best fit is a role where changing how things are done is the job, not a side effect of you showing up.',
    short: ['original', 'independent', 'allergic to scripts'],
    watch: 'quitting the whole thing when only one part of it needed to change.',
  },

  'MERCURY|conjunction|ASC': {
    hook: 'People meet your mind before they meet you.',
    text: 'Mercury on the rising sign puts the talker at the front door. You ask the first question, name what everyone is thinking, and people tend to remember what you said before they remember what you wore. Quiet rooms get a commentary track whether they asked for one or not.\n\nThe nervous energy that comes with it reads as curiosity, which is lucky, because it usually is. You think best out loud and with company; a problem you can talk through is half solved.',
    short: ['quick', 'curious', 'first to speak'],
    watch: 'answering the question before it\'s finished being asked.',
  },

  'JUPITER|conjunction|ASC': {
    hook: 'Strangers tell you their life story in line at the pharmacy. You didn\'t ask. Your face did.',
    text: 'Jupiter on the rising sign gives you a presence that reads as warm, generous and a little larger than the room. People assume you\'re at ease, that things work out for you, that you\'re the one to ask. Some days that\'s true. On the others you come across as more relaxed than you feel, which is a gift for everyone else and a small job for you.\n\nThe same openness that brings people in also makes it hard to say no to them. Generosity is the strength here. Pacing it is the skill.',
    short: ['warm', 'easy to talk to', 'generous to a fault'],
    watch: 'promising big in the moment, then living up to it at your own expense.',
  },

  'SUN_ASC:Aries|Pisces': {
    hook: 'People meet the soft one first. The one with opinions shows up about twenty minutes later.',
    text: 'An Aries Sun wants to go first. Pisces rising is the face it wears to get there: gentle, open, easy to underestimate. So people expect someone who goes with the flow, and then meet the part of you that already decided where the flow is going.\n\nThe upside is real. You can start things without anyone feeling pushed, and lead without the room bracing for it. The snag is the gap between the soft front and the fast engine. Some days it feels like being two people, and the trick is letting both of them in on the plan.',
    short: ['soft entry', 'fast engine', 'more stubborn than you look'],
    watch: 'going along in the moment and pushing back in the car on the way home.',
  },

  // Batch 1, fire core (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-01-fire-core.md
  "SUN:Leo": { hook: "You don't need everyone to look at you. Just everyone you like.", text: '' },
  "SUN:Sagittarius": { hook: "You'll believe almost anything once. That's how you found the few things worth believing twice.", text: '' },
  "MOON:Aries": { hook: "Your feelings arrive fast and leave faster, which is why you've already forgiven someone who's still apologizing.", text: '' },
  "MOON:Leo": { hook: "You don't need to be adored. Noticed would do. Somehow that's the harder one to get.", text: '' },
  "MOON:Sagittarius": { hook: "When it gets heavy, you need air: a drive, a trip, a new idea. Leaving the room is how you stay in the relationship.", text: '' },
  "ASC:Aries": { hook: "You walk in like you were already late, even when you're early.", text: '' },
  "ASC:Leo": { hook: "People assume you planned the entrance. You just opened the door.", text: '' },
  "ASC:Sagittarius": { hook: "You talk to people in elevators. Worse, they talk back.", text: '' },
  "SUN_ASC:Aries|Aries": {
    hook: "What you see is what you get, and you see it about three seconds before everyone else.",
    text: "Aries twice means the engine and the face match. There's no gap between what you want and how you come across, which saves everybody time: people know where they stand because you told them. The cost is that a first impression becomes the whole impression. Someone meets you on a rushed day and files you under \"a lot.\" Give them a second meeting. The gift is courage, the useful kind: you go first, and other people find out it's survivable.",
    short: ["direct", "brave", "impatient for good reasons"],
    watch: "mistaking speed for certainty.",
  },
  "SUN_ASC:Aries|Leo": {
    hook: "You're the one who says \"let's go,\" and then turns it into an event.",
    text: "Aries wants to start. Leo rising wants it to look good while it starts. Together you lead with warmth instead of elbows, which is rarer than it sounds, and rooms tend to arrange themselves around you without being asked. The snag is timing. Leo rising watches the audience and Aries hates waiting, so when the applause is slow you're tempted to move to the next thing. Some of the best things you start need a quiet middle.",
    short: ["bold", "warm", "natural host"],
    watch: "dropping a project the day it stops being fun to talk about.",
  },
  "SUN_ASC:Aries|Sagittarius": {
    hook: "You don't make plans. You make departures.",
    text: "All fire, aimed outward. Aries brings the nerve and Sagittarius rising brings the open road, so you come across as easy, funny and up for it, and mostly you are. People bring you their ideas because you're the one who will actually try them. Honesty comes out unfiltered: you say the true thing, and the tactful version arrives later, like a delayed text. The gift is optimism with legs.",
    short: ["adventurous", "candid", "contagious"],
    watch: "promising the trip before checking the calendar.",
  },
  "SUN_ASC:Leo|Aries": {
    hook: "People meet the sprinter first. The ones who stay meet the big, loyal heart.",
    text: "Aries rising moves first and asks later. Underneath, a Leo Sun wants what it builds to matter and to last. So the first impression is energy and nerve, and the second is warmth: you remember birthdays, you show up, and you take it personally when someone you love gets overlooked. Pride runs both. It's what makes you generous, and it's also why an apology takes a day longer than it should.",
    short: ["brave", "generous", "fiercely loyal"],
    watch: "treating a small slight like a challenge to a duel.",
  },
  "SUN_ASC:Leo|Leo": {
    hook: "You were never going to blend in, so you've made peace with being easy to find.",
    text: "The Sun rules Leo, so with Leo rising the Sun is also your chart ruler: who you are and how you show up are the same project. You bring the light into a room, and people relax because someone is clearly hosting. The part nobody guesses is that being visible all the time is work. You need a few people who like you when you're off duty. Find them and keep them.",
    short: ["radiant", "generous", "easy to find"],
    watch: "performing \"fine\" when you're not.",
  },
  "SUN_ASC:Leo|Sagittarius": {
    hook: "You tell a story about the time you got lost, and somehow everyone wants to get lost with you.",
    text: "Sagittarius rising meets the world wide open: curious, funny, a little restless. Behind it, a Leo Sun wants all that wandering to add up to something people remember. It's a teacher's combination, or a performer's: you make big ideas feel like a party. The risk is spreading out. Every new place, plan and person is interesting, and Leo's wish to finish proudly can get lost in Sagittarius's need to keep moving.",
    short: ["expansive", "warm", "a natural storyteller"],
    watch: "saying yes to the next adventure before the last one is unpacked.",
  },
  "SUN_ASC:Sagittarius|Aries": {
    hook: "You'll try anything once. Twice if it scared you the first time.",
    text: "Aries rising is the push and Sagittarius is the reason. The first impression is a dare; the person underneath is chasing meaning. Some days you come across bolder than you feel, which works out, because acting brave is often how you find out you are. People follow you into new things. Patience is the missing piece: you want the answer, the trip and the result now, and the good ones usually take a season.",
    short: ["daring", "honest", "freedom first"],
    watch: "leaving to find something that would have shown up if you'd stayed.",
  },
  "SUN_ASC:Sagittarius|Leo": {
    hook: "You walk in like the party started when you got there. Sometimes it did.",
    text: "Leo rising gives you a warm, sure presence. The Sagittarius Sun behind it is a seeker, curious about everything and committed to very little until it's sure. People see confidence and assume certainty. Really you're still figuring it out, out loud and generously. That openness is the gift: you make people feel the world is bigger and friendlier than they thought.",
    short: ["big hearted", "magnetic", "always learning"],
    watch: "confusing an audience with an answer.",
  },
  "SUN_ASC:Sagittarius|Sagittarius": {
    hook: "Your idea of settling down is a favorite airport.",
    text: "Jupiter rules Sagittarius, so with the Sun and rising sign both here, Jupiter runs the whole show: faith, growth, more. You meet the world with a grin and a question, and you mean both. The honesty is famous. You'll tell someone the truth they needed, and now and then the one they didn't ask for. Underneath the restlessness is a real philosophy, and people come to you for it. The work is depth: picking a few things and staying long enough to see what they become.",
    short: ["free", "frank", "quietly wise"],
    watch: "calling it freedom when it's really not wanting to be pinned down.",
  },

  // Batch 2, earth core (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-02-earth-core.md
  "SUN:Taurus": { hook: "You're not slow. You're just only doing this once.", text: '' },
  "SUN:Virgo": { hook: "You noticed the typo in the birthday card. You also remembered the birthday.", text: '' },
  "SUN:Capricorn": { hook: "You don't do overnight success. You do the overnight part.", text: '' },
  "MOON:Taurus": { hook: "Your feelings don't come and go. They move in, unpack and stay.", text: '' },
  "MOON:Virgo": { hook: "When you're worried, you clean. When you're really worried, you alphabetize.", text: '' },
  "MOON:Capricorn": { hook: "You handle feelings the way you handle everything: later, properly and alone.", text: '' },
  "ASC:Taurus": { hook: "People relax around you. Something about you says nobody's leaving until dinner's done.", text: '' },
  "ASC:Virgo": { hook: "You walk in and quietly fix the thing that was bothering everyone.", text: '' },
  "ASC:Capricorn": { hook: "People assume you're in charge. By the end of the meeting, you usually are.", text: '' },
  "SUN_ASC:Taurus|Taurus": {
    hook: "You know what you like. You've known since about 2009.",
    text: "Taurus twice, and Venus rules both, so the person inside and the one at the door want the same things: good food, real comfort, people who stay. You come across as calm because you mostly are. It takes a lot to move you and almost nothing to make you loyal. The cost is the same stillness: when something should change, you can outwait it for years. The gift is that whatever you build, a friendship, a garden, a savings account, is still standing long after the flashier ones fell down.",
    short: ["steady", "loyal", "quietly sensual"],
    watch: "calling it patience when it's really not wanting to move.",
  },
  "SUN_ASC:Taurus|Virgo": {
    hook: "You show up with a plan and a snack, and you're right about both.",
    text: "Virgo rising meets the world as the helpful one: sharp eyed, organized, a little reserved until it knows the room. Underneath, a Taurus Sun wants a good life more than a perfect one. That's a useful tension. Virgo spots what's wrong; Taurus decides whether it's worth fixing, and usually lets the small stuff go. People trust you with practical things first, then with everything. The work is believing compliments, which Virgo rising tends to audit.",
    short: ["capable", "grounded", "kind in practical ways"],
    watch: "fixing someone's problem when they only wanted company.",
  },
  "SUN_ASC:Taurus|Capricorn": {
    hook: "You don't talk about your goals. You just keep showing up with them finished.",
    text: "Capricorn rising looks serious at first meeting, older than your years and hard to read. Saturn runs the front door, and it doesn't hand out keys on day one. Behind it, Taurus is warmer than anyone expects, and a lot more fun after dinner. Together you can work longer than most people and enjoy the reward more than most people. The snag is the reveal: some people never stay long enough to meet the Taurus.",
    short: ["dependable", "ambitious", "secretly funny"],
    watch: "making people earn the warm version of you.",
  },
  "SUN_ASC:Virgo|Taurus": {
    hook: "You seem relaxed. Inside, a small committee is reviewing the meeting.",
    text: "Your first impression is unhurried and easy, the Taurus rising kind, and people feel comfortable before you've said much. The Virgo Sun behind it is busier: noticing, sorting, improving. That makes you very good at work that has to be done right and still feel easy, like cooking for twelve or editing a friend's résumé without making them cry. The cost is that nobody sees how much effort the calm takes. Tell someone.",
    short: ["calm", "precise", "generous with skill"],
    watch: "doing the hidden work and then resenting that it's hidden.",
  },
  "SUN_ASC:Virgo|Virgo": {
    hook: "You've read the reviews. All of them. The angry ones were the most useful.",
    text: "Mercury rules Virgo and is at its strongest there, so with the Sun and rising both here, your mind is the whole engine. You notice everything and say about a third of it, which is usually the right third. People bring you the thing that has to work: the document, the plan, the best man's speech. The hard part is aiming that eye at yourself, where it gets less generous. You'd never talk to a friend the way you edit yourself.",
    short: ["sharp", "useful", "quietly funny"],
    watch: "treating good enough like a moral failing.",
  },
  "SUN_ASC:Virgo|Capricorn": {
    hook: "You don't want credit. You want it done right, and then maybe a little credit.",
    text: "Capricorn rising gives you authority early: people hand you responsibility at nineteen and never take it back. The Virgo Sun underneath is the craftsman, happiest when the details click. It's a builder's chart. Saturn makes you patient and Mercury makes you exact, so the work holds up. The risk is that work becomes the only language you speak fluently. Rest isn't a reward you have to earn. It's part of the build.",
    short: ["disciplined", "exact", "trustworthy"],
    watch: "answering \"how are you\" with your task list.",
  },
  "SUN_ASC:Capricorn|Taurus": {
    hook: "You'd rather buy one good coat than five fun ones. You still have the coat.",
    text: "To strangers you seem warm and easygoing, which is Taurus rising doing its job, and you're better company than Capricorns usually get credit for. Underneath sits Saturn's sign: ambition, structure, the long view. People see the comfort and miss the plan, which suits you fine. You build slowly and you build to last. The snag is that two earth signs can make change feel like a threat. Sometimes the solid thing is the thing that needs to move.",
    short: ["patient", "grounded", "quietly ambitious"],
    watch: "staying in something because leaving would waste the investment.",
  },
  "SUN_ASC:Capricorn|Virgo": {
    hook: "You make it look easy. It wasn't. You just did the hard part before anyone got there.",
    text: "Virgo rising meets people helpful and precise; the Capricorn underneath has the five year plan. Together you're the one a group quietly relies on, who reads the fine print and also knows where it's all going. Your humor is dry enough that people often miss it the first time. The cost is a standard nobody can meet, including you. Lower the bar on the small things so there's energy left for the big ones.",
    short: ["competent", "wry", "dependable"],
    watch: "hearing every suggestion as a critique.",
  },
  "SUN_ASC:Capricorn|Capricorn": {
    hook: "You've had a retirement plan since your first job. It has tabs.",
    text: "Saturn rules Capricorn, so with the Sun and rising both here, Saturn runs the show: patience, structure, the long climb. You come across as serious, even older than your age, and you tend to get lighter as the years go on, as if you paid the hard part up front. People trust you with responsibility because you actually take it. The thing to protect is joy. Achievement is a fine goal. It's a terrible mood.",
    short: ["steady", "ambitious", "deeply responsible"],
    watch: "saving the good part of life for when the work is done, which it never is.",
  },

  // Batch 3, fire meets earth (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-03-fire-meets-earth.md
  "SUN_ASC:Aries|Taurus": {
    hook: "You charge, but only after lunch.",
    text: "Taurus rising slows the door down. People meet someone calm, warm and in no hurry, and then the Aries Sun shows up the first time something needs doing. Venus rules your chart and Mars rules your Sun, and the old astrologers listed Venus as the only planet Mars gets along with, which tracks: you fight for comfort, for the people you love, for a good life, and rarely for sport. The snag is that both signs can dig in. Once you've decided, the decision has a lease.",
    short: ["brave", "steady", "loyal"],
    watch: "being right so firmly that nobody can bring you new information.",
  },
  "SUN_ASC:Aries|Virgo": {
    hook: "You want to go now, and you've already checked the tire pressure.",
    text: "Virgo rising meets the world careful, observant and helpful, so people are surprised how fast you move once you've decided. The Aries underneath wants action; the Virgo in front wants it done properly. When they agree, you're the rare person who is both quick and right. When they don't, you get impatient with yourself for checking twice. Mercury runs your chart, which makes words your tool: you can talk someone into trying, then hand them the list.",
    short: ["quick", "capable", "precise"],
    watch: "snapping at small mistakes because you were already in a hurry.",
  },
  "SUN_ASC:Aries|Capricorn": {
    hook: "You look like a five year plan. You feel like a starting pistol.",
    text: "Capricorn rising gives you a serious, capable first impression. Saturn runs your chart, and people assume you're patient. The Aries Sun underneath is not. That tension is the whole story: Saturn wants to build slowly and Mars wants it built yesterday. The old books warn that this mix starts many things and finishes few. The fix is easy to say and hard to do: let the Capricorn choose which fights are worth starting, then let the Aries win them.",
    short: ["driven", "disciplined", "impatient with excuses"],
    watch: "treating rest as falling behind.",
  },
  "SUN_ASC:Leo|Taurus": {
    hook: "You know how to make a room feel like a good evening.",
    text: "First meetings with you feel like a slow Sunday: easy, warm, unhurried, the Taurus rising signature. The Leo Sun behind it wants to make something people remember. Both are fixed signs, so you're loyal past reason and very hard to rush. You throw the dinner, you keep the friends from third grade, and you'd rather have one beautiful thing than ten fine ones. The cost is stubbornness times two. When you're hurt, you don't leave. You go very still and wait.",
    short: ["warm", "loyal", "generous host"],
    watch: "waiting for the apology instead of asking for it.",
  },
  "SUN_ASC:Leo|Virgo": {
    hook: "You'd rather fix the lighting than stand in it. Then someone notices you fixed the lighting.",
    text: "Virgo rising is modest at first meeting: helpful, precise, a little reserved. The Leo Sun underneath has a big heart and wants it to count. So you show love by doing, not announcing: the edited speech, the remembered allergy, the ride at 2 a.m. People find out how warm you are slowly, and then all at once. The hard part is asking for credit. Leo needs to be seen, and Virgo thinks wanting that is vain. It isn't.",
    short: ["modest", "warm", "quietly brilliant"],
    watch: "doing everything for a thank you you never ask for.",
  },
  "SUN_ASC:Leo|Capricorn": {
    hook: "People take you seriously before you've said a word, and then you make them laugh.",
    text: "In a new room you're composed and capable, a little formal even, which is how Capricorn rising works. The Leo Sun behind it is warmer and more playful than the front door lets on. The old astrologers counted the Sun and Saturn as enemies, and you'll feel why: one part of you wants applause, the other thinks wanting it is unprofessional. Put together, it's natural authority, a leader people respect first and like soon after. Let the warmth out earlier. It's your best tool.",
    short: ["dignified", "warm", "ambitious"],
    watch: "earning the room's respect and forgetting to enjoy it.",
  },
  "SUN_ASC:Sagittarius|Taurus": {
    hook: "You want to see the whole world, as long as you can sleep in your own bed.",
    text: "Sagittarius wants the road; Taurus rising wants the porch. People meet the calm, comfortable version of you first, easygoing and good company, with Venus ruling the chart. The Sagittarius underneath is more restless than it looks: big questions, sudden plans, the urge to go. You do best when the adventure has a home base, and when the people you love are along for it.",
    short: ["easygoing", "curious", "generous"],
    watch: "planning the trip forever because leaving the couch is hard.",
  },
  "SUN_ASC:Sagittarius|Virgo": {
    hook: "You'll read four books before the trip. You'll also miss the train talking to a stranger.",
    text: "Strangers read you as careful and well organized: Virgo rising, run by Mercury, makes a tidy first impression. The Sagittarius Sun underneath is big picture: meaning, travel, the next idea. Mercury is at its weakest in Sagittarius, the place where details lose to vision, so this chart is a running argument between the map and the horizon. When it works, you're a fine teacher: you can explain the big idea and the footnotes. Pick which one matters today.",
    short: ["curious", "thoughtful", "funny"],
    watch: "researching instead of going.",
  },
  "SUN_ASC:Sagittarius|Capricorn": {
    hook: "You look like the responsible one. Ask what you'd do with a free year.",
    text: "Capricorn rising makes a sober first impression: steady, a little reserved, someone you'd trust with the keys. Saturn rules your chart and Jupiter rules your Sun, and the old astrologers counted those two as friends: growth and structure working together. The Sagittarius underneath is a believer, curious, hopeful and honest to the point of bluntness. Together you make big plans that actually happen, because Capricorn writes the budget for Sagittarius's dream.",
    short: ["principled", "ambitious", "quietly optimistic"],
    watch: "postponing the adventure until it's safe, which it never fully is.",
  },
  "SUN_ASC:Taurus|Aries": {
    hook: "You come in fast and stay forever.",
    text: "Aries rising is the first impression: direct, energetic, quick to act. Then people find the Taurus Sun, and the speed turns out to have a destination. You start like a sprinter and keep going like a farmer. It's a strong combination for anything physical, any business you own, anything you build with your hands. The friction is temper: Aries flares fast and Taurus remembers. When the flare passes, let the memory go with it.",
    short: ["energetic", "determined", "loyal"],
    watch: "holding a grudge long after you won the argument.",
  },
  "SUN_ASC:Taurus|Leo": {
    hook: "You walk in like you own the place. Give it ten years and you might.",
    text: "Leo rising gives you presence: warm, confident, a little regal, with the Sun ruling the chart. Underneath, the Taurus Sun cares less about the spotlight than about what lasts: a home, a craft, a bank account, people. Two fixed signs means loyalty you could build on and stubbornness you could build a wall with. People remember you. What they miss is how much patient work holds the performance up.",
    short: ["magnetic", "steady", "generous"],
    watch: "refusing to change your mind in public because the audience is watching.",
  },
  "SUN_ASC:Taurus|Sagittarius": {
    hook: "You'd happily try the new restaurant. You'll order what you always order.",
    text: "At a party, you're the one talking to the host's neighbor, the caterer and the dog: that's Sagittarius rising. The Taurus Sun underneath likes what it likes and isn't in a hurry to change. So you're open in conversation and settled in life, which makes people comfortable telling you things. Jupiter and Venus, the two good fortune planets of the old books, rule this pair, and it shows in generosity: good food, a full table, a laugh. The pull is between the trip and the garden. Make room for both.",
    short: ["friendly", "grounded", "generous"],
    watch: "promising to change and then getting comfortable.",
  },
  "SUN_ASC:Virgo|Aries": {
    hook: "You see the problem in a second and fix it in two.",
    text: "Aries rising gives you a fast, direct first impression: you act before most people finish thinking. The Virgo Sun underneath is the reason the action works. You've already noticed what's wrong and what it needs. Mars rules your chart and Mercury your Sun, so you're sharp in both senses: quick and, now and then, cutting. People rely on you in a crisis because you don't freeze. Watch your tone. You're usually right; you don't have to be right loudly.",
    short: ["decisive", "sharp", "useful"],
    watch: "criticism that arrives faster than kindness.",
  },
  "SUN_ASC:Virgo|Leo": {
    hook: "You make it look effortless. It took four drafts.",
    text: "Leo rising is the opening number: warm, confident, a little dramatic. The Virgo Sun behind it is a perfectionist who notices everything, including your own flaws. So the show is real, and so is the rehearsal. You're good at making other people look good too: the host who fixes the seating chart, the friend who polishes the toast. The work is letting yourself be seen before it's perfect. People love the draft version of you more than you think.",
    short: ["polished", "warm", "hardworking"],
    watch: "hiding until it's flawless.",
  },
  "SUN_ASC:Virgo|Sagittarius": {
    hook: "You come across easygoing. You have a spreadsheet for the vacation.",
    text: "Meet you once and you seem like the easiest person in the world to travel with; Sagittarius rising is open, funny and game. The Virgo Sun underneath is careful and exact. Jupiter is at a disadvantage in Virgo, so the planet that runs your first impression and the sign that runs your core don't naturally speak the same language. Yet the mix is valuable: big vision with real follow through. You're the friend who says \"let's go to Portugal\" and then actually books it.",
    short: ["adventurous", "organized", "honest"],
    watch: "fussing over the details until the trip stops being fun.",
  },
  "SUN_ASC:Capricorn|Aries": {
    hook: "You'd climb the mountain at a run if anyone let you.",
    text: "Aries rising is the push: direct, competitive, first through the door, with Mars ruling the chart. The Capricorn Sun underneath is the plan. Mars is exalted in Capricorn, at its best there, which is good news for this pairing: your drive has a direction. People see a fighter; the ones who stay see a strategist. The cost is a chart that treats life like a race. Stop now and then and look at the view. That's part of why you climbed.",
    short: ["driven", "strategic", "tough"],
    watch: "picking a fight with the clock.",
  },
  "SUN_ASC:Capricorn|Leo": {
    hook: "You look like you're having fun. You're also running the event.",
    text: "Leo rising lights you up in public: bright, generous, sure of itself. The Capricorn Sun underneath is all business: goals, standards, the long climb. You can do both at once, host the party and run it. Some days the two pull apart: one part wants applause, the other wants results. Let them trade. Results earn the applause, and the applause is allowed.",
    short: ["commanding", "generous", "ambitious"],
    watch: "performing confidence on the days you need help.",
  },
  "SUN_ASC:Capricorn|Sagittarius": {
    hook: "You meet people with a joke and leave them with a plan.",
    text: "Sagittarius rising is easy to like: friendly, frank, a little restless, with Jupiter ruling the chart. Underneath, the Capricorn Sun takes things seriously, especially the future. People assume you're winging it. You're not; you've just made the planning look relaxed. The tension is between the open road and the ladder, freedom against the climb. You get the most from this chart when the climb takes you somewhere new.",
    short: ["optimistic", "practical", "wiser than the jokes"],
    watch: "saying it's fine with a grin when it isn't.",
  },

  // Batch 4, air core (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-04-air-core.md
  "SUN:Gemini": { hook: "You don't have one hobby. You have a rotation.", text: '' },
  "SUN:Libra": { hook: "You can see both sides of everything, which is why ordering dinner takes a while.", text: '' },
  "SUN:Aquarius": { hook: "You're the most normal person you know. Nobody agrees.", text: '' },
  "MOON:Gemini": { hook: "You process feelings by talking. Sometimes to the person, usually to three other people first.", text: '' },
  "MOON:Libra": { hook: "You can't relax in a room where two people are fighting, even if they're on TV.", text: '' },
  "MOON:Aquarius": { hook: "You feel things deeply. You'd just rather discuss them than have them.", text: '' },
  "ASC:Gemini": { hook: "You've made a friend in the time it took to order coffee.", text: '' },
  "ASC:Libra": { hook: "People tell you you're easy to talk to. You're also very hard to read.", text: '' },
  "ASC:Aquarius": { hook: "You walk in like you're from somewhere slightly in the future.", text: '' },
  "SUN_ASC:Gemini|Gemini": {
    hook: "You can hold four conversations at once and win three of them.",
    text: "Mercury rules Gemini, so with the Sun and rising both here, your mind runs the front door and the whole house. You meet people quickly, read them quickly and keep up with anyone. The old books called this sign witty and a lover of learning, and they had you right: curiosity is your engine and boredom is the only thing that scares you. The cost is depth. You know a little about everything, and the people close to you sometimes want you to know a lot about them.",
    short: ["quick", "curious", "funny"],
    watch: "changing the subject when it gets personal.",
  },
  "SUN_ASC:Gemini|Libra": {
    hook: "You can talk to anyone. More impressive, you can get them to talk to each other.",
    text: "Libra rising gives you grace at first meeting; people feel welcome before they know why. The Gemini Sun underneath is the conversation itself: ideas, jokes, questions. Together you're a natural go between, the friend who introduces everyone and remembers what they have in common. The snag is decisions. Gemini sees ten options and Libra wants all of them to be fair. At some point, someone has to pick the restaurant.",
    short: ["charming", "clever", "social"],
    watch: "agreeing with everyone, then needing a day to find out what you think.",
  },
  "SUN_ASC:Gemini|Aquarius": {
    hook: "You have opinions about the future. Several. They update.",
    text: "Aquarius rising comes across friendly but independent, a little unusual. Its modern ruler Uranus, with Saturn as the traditional one, gives your first impression an inventor's air. The Gemini Sun behind it is quick and curious. Together it's a mind that loves new ideas and the people who have them, and you'd rather talk about what could be than what is. The cost is the body and the heart: you can spend a long time thinking about life before living some of it.",
    short: ["inventive", "sociable", "original"],
    watch: "treating your own feelings like an interesting theory.",
  },
  "SUN_ASC:Libra|Gemini": {
    hook: "You're charming on purpose and funny by accident.",
    text: "Your first impression talks: lively, quick, full of questions, the Gemini rising way. Behind it, the Libra Sun cares about harmony, fairness and the way people treat each other. So the chatter has a point: you're connecting people, smoothing things over, finding the version everyone can live with. The old books describe this temperament as cheerful, open hearted and a peacemaker, which is you on a good day and most other days. The work is your own opinion. You can argue every side so well that you forget which one is yours.",
    short: ["charming", "witty", "diplomatic"],
    watch: "arguing every side until you lose track of yours.",
  },
  "SUN_ASC:Libra|Libra": {
    hook: "You notice when the picture frame is crooked. You also notice who's been left out of the conversation.",
    text: "Venus rules Libra, so with the Sun and rising both here, Venus runs the show: beauty, balance, partnership. You come across gracious and easy, and people relax because you're clearly paying attention to them. Saturn is exalted in Libra, and that's the hidden steel: under the charm is a real sense of justice, and you'll work hard to make things fair. The snag is conflict. You'll do almost anything to avoid a fight, including staying unhappy longer than you should.",
    short: ["gracious", "fair", "quietly principled"],
    watch: "keeping the peace at your own expense.",
  },
  "SUN_ASC:Libra|Aquarius": {
    hook: "You care about fairness in your friendships and in the world, and you have notes on both.",
    text: "Aquarius rising gives you a cool, friendly first impression, independent and a little ahead of the room. The Libra Sun underneath is warmer than it looks and deeply invested in people getting along. Together it's an idealist's chart: you'd like the world to be fairer, and you have ideas about how. You're often the one who organizes, includes, speaks up. The cost is distance. People can tell you care about everyone and can't always tell you care about them in particular. Tell them.",
    short: ["fair minded", "friendly", "visionary"],
    watch: "being kind to everyone and close to no one.",
  },
  "SUN_ASC:Aquarius|Gemini": {
    hook: "You know a little about everything and a lot about one strange thing.",
    text: "People meet a quick talker with a hundred questions; that's Gemini rising. The Aquarius Sun underneath is the independent thinker, drawn to ideas nobody else has tried yet. The old books say a sharp Mercury in an air sign finds \"admirable Inventions,\" and this pairing has that flavor: you can talk to anyone, and you'll still follow your own conclusions. The work is follow through. The idea arrives fast. The finished thing needs you to stay.",
    short: ["curious", "original", "sociable"],
    watch: "leaving the idea at the exciting part.",
  },
  "SUN_ASC:Aquarius|Libra": {
    hook: "You're easy to like and hard to know, and you're fine with that.",
    text: "On first meeting you're polite, warm and easy on the eyes: Libra rising. The Aquarius Sun behind it is cooler and more independent: your own ideas, your own schedule. People are drawn in by the charm and then surprised by the conviction. You're a natural at group projects that actually matter, because you can bring people along and keep the vision. The snag is closeness. You're friendly with everyone and let very few people all the way in.",
    short: ["charming", "independent", "principled"],
    watch: "keeping it light when someone wants to go deeper.",
  },
  "SUN_ASC:Aquarius|Aquarius": {
    hook: "You were into it before it was cool, and you left when it got cool.",
    text: "With the Sun and rising both in Aquarius, its modern ruler Uranus and its traditional ruler Saturn share the show: the rule breaker and the rule keeper. That explains a lot. You're unconventional, but on principle, and loyal to your own way of doing things. The old books call Aquarius humane, affable and envious of no one, and you are: you're honestly glad when your friends win. People find you refreshing and a little hard to predict. The work is letting someone close enough to see the feelings you'd rather think about.",
    short: ["independent", "humane", "original"],
    watch: "being everyone's friend and nobody's person.",
  },

  // Batch 5, water core (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-05-water-core.md
  "SUN:Cancer": { hook: "You remember how everyone takes their coffee. You also remember what they said in 2014.", text: '' },
  "SUN:Scorpio": { hook: "You're not secretive. You just don't see why anyone needs to know.", text: '' },
  "SUN:Pisces": { hook: "You cry at commercials, and you're the calmest person in a real emergency.", text: '' },
  "MOON:Scorpio": { hook: "You forgive. You also remember, in detail.", text: '' },
  "MOON:Pisces": { hook: "You can feel a room change before anyone says a word, and then you spend the evening quietly fixing it.", text: '' },
  "ASC:Cancer": { hook: "People tell you their problems within ten minutes of meeting you. You never asked.", text: '' },
  "ASC:Scorpio": { hook: "People assume you know something. Usually you do.", text: '' },
  "SUN_ASC:Cancer|Cancer": {
    hook: "Home isn't where you live. It's who you've decided to take care of.",
    text: "The Moon rules Cancer, so with the Sun and rising both here, the Moon runs your chart: feeling, memory, home. You come across gentle and protective, and people open up to you fast because you're clearly safe. Your moods move like tides, and you've learned to work with them instead of against them. The shell is real, though. When you're hurt, you go quiet and sideways, and people have to guess. They do better when you tell them.",
    short: ["caring", "intuitive", "protective"],
    watch: "retreating instead of saying what hurt.",
  },
  "SUN_ASC:Cancer|Scorpio": {
    hook: "You're the softest person anyone knows, behind a door with three locks.",
    text: "Scorpio rising meets the world intense and private, with Pluto as its modern ruler and Mars as the traditional one. The Cancer Sun behind it is tender, family minded and loyal to the bone. So the first impression is guarded and the second is devoted. People who get through your door rarely leave, and you'd do anything for them. The cost is trust: you test people before you let them in, sometimes for years. Some of them already passed.",
    short: ["loyal", "perceptive", "fiercely protective"],
    watch: "testing people who already proved themselves.",
  },
  "SUN_ASC:Cancer|Pisces": {
    hook: "You've adopted at least one person who didn't ask to be adopted.",
    text: "Pisces rising meets people soft, kind and a little dreamy, with Neptune as its modern ruler and Jupiter as the traditional one. Behind it, the Cancer Sun wants to protect and nurture. It's one of the gentlest pairings there is: you feel what others feel and want to help. Jupiter, the old planet of generosity, is exalted in Cancer and rules Pisces, so your kindness tends to come back around. The work is boundaries. Absorbing everyone's weather isn't the same as helping them carry it.",
    short: ["compassionate", "imaginative", "nurturing"],
    watch: "taking on feelings that aren't yours to carry.",
  },
  "SUN_ASC:Scorpio|Cancer": {
    hook: "You'll find out everything about a person while telling them almost nothing.",
    text: "Cancer rising makes you approachable, the person strangers ask for directions and friends call first. Underneath, the Scorpio Sun is the investigator: deep, private, all or nothing. People feel safe with you and don't notice how much you're noticing. It's a strong chart for any work that runs on trust: care, counseling, being the friend people call at 3 a.m. The snag is letting go. Once you love someone or something, the grip is firm, sometimes after it should loosen.",
    short: ["perceptive", "caring", "intensely loyal"],
    watch: "knowing everyone's secrets and keeping all of your own.",
  },
  "SUN_ASC:Scorpio|Scorpio": {
    hook: "You don't do anything halfway, including small talk, which is why you skip it.",
    text: "With the Sun and rising both in Scorpio, its modern ruler Pluto and its traditional ruler Mars run the show: depth and drive. You come across intense, magnetic and hard to read, and people either trust you completely or stay a little wary. Both reactions make sense to you. You go all in on people, work and causes, and you're very hard to fool. The old books credit Scorpio with nerve and a good understanding, and that's the gift: you can look at hard things without flinching. The work is softness. You're allowed to need people too.",
    short: ["intense", "loyal", "perceptive"],
    watch: "mistaking control for safety.",
  },
  "SUN_ASC:Scorpio|Pisces": {
    hook: "You can tell what someone's really feeling. You'd just rather not say how.",
    text: "Pisces rising meets people gentle, open and kind. The Scorpio Sun under it is anything but vague: focused, private, deep. Two water signs means a lot of intuition, and you read moods, motives and rooms without trying. People confide in you because you seem soft, then find you're also the one who won't let them lie to themselves. The cost is overwhelm. You take in a great deal and need real time alone to set it down.",
    short: ["intuitive", "compassionate", "deep"],
    watch: "disappearing when it all gets to be too much.",
  },
  "SUN_ASC:Pisces|Cancer": {
    hook: "You'd give someone your last dollar and then make them dinner.",
    text: "Cancer rising wraps your first impression in warmth; people feel looked after within minutes. The Pisces Sun behind it is imaginative, empathetic and generous to a fault. Together it's pure water: you feel deeply and look after people without being asked. Your home is usually where your friends end up. The gift is kindness that doesn't keep score. The cost is losing track of where you end and other people begin, and resenting it later.",
    short: ["kind", "imaginative", "devoted"],
    watch: "giving until you're empty and calling it love.",
  },
  "SUN_ASC:Pisces|Scorpio": {
    hook: "You seem mysterious. Really, you're just feeling everything at once.",
    text: "Scorpio rising gives you a guarded, intense first impression, and people sense depth before you say a word. The Pisces Sun underneath is softer than the door suggests: dreamy, compassionate, creative. You protect the tender part with the tough part, which works most of the time. It's a strong chart for art, healing and any work that goes below the surface. The work is trusting people with the gentle half before they've completely earned it.",
    short: ["deep", "creative", "protective"],
    watch: "hiding the soft part so well that nobody gets to love it.",
  },
  "SUN_ASC:Pisces|Pisces": {
    hook: "You'll believe in someone long after the evidence says stop. Sometimes you're right.",
    text: "With the Sun and rising both in Pisces, its modern ruler Neptune and its traditional ruler Jupiter share the show: imagination and faith. You meet the world soft, open and kind, and people tell you things they've never told anyone. Venus is exalted in Pisces, which gives you an artist's eye and a big heart. The gift is compassion without conditions. The cost is drift: you can go with the current for years. Pick a direction you love and let it carry you somewhere on purpose.",
    short: ["compassionate", "imaginative", "gentle"],
    watch: "waiting to be rescued from a situation you could leave.",
  },

  // Batch 6, fire meets air (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-06-fire-meets-air.md
  "SUN_ASC:Aries|Gemini": {
    hook: "You're the first to volunteer and the first to have a better idea halfway through.",
    text: "Gemini rising is quick and talkative, so people meet your wit before your nerve. Then the Aries Sun shows up and the talk turns into action. It's a fast chart: ideas and the courage to try them, often on the same afternoon. People find you fun to be around and hard to keep up with. The cost is attention. With so many good starts, the finish line can feel like somebody else's job.",
    short: ["quick", "bold", "funny"],
    watch: "dropping a good thing because a newer thing walked in.",
  },
  "SUN_ASC:Aries|Libra": {
    hook: "You fight for other people better than you fight for yourself, and you fight well.",
    text: "Aries and Libra sit opposite each other, which means you were likely born near sunset, with the Sun heading for the western horizon. It shows in the chart's shape. Libra rising, ruled by Venus, meets people gracious and fair; the Aries underneath is pure Mars, direct and brave. Me and we, in one person. You're good at partnerships because you bring both: the charm to start them and the nerve to say the hard thing. The work is letting your own wants count as much as keeping the peace.",
    short: ["brave", "gracious", "fair"],
    watch: "swallowing the argument, then losing your temper over something small.",
  },
  "SUN_ASC:Aries|Aquarius": {
    hook: "You'd break a rule just to prove it was a bad rule. Then you'd write a better one.",
    text: "Aquarius rising gives a cool, independent first impression. Modern astrology gives it to Uranus; the old books gave it to Saturn, and also said Saturn is at its weakest in Aries: patience in a sign that has none. That's this chart's inside joke. You look like you have a system, and underneath, an Aries Sun wants to move now. Together you're a reformer, the person who notices what's broken and is willing to go first fixing it. People follow you because you mean it.",
    short: ["independent", "daring", "principled"],
    watch: "fighting the whole system when the problem was one person.",
  },
  "SUN_ASC:Leo|Gemini": {
    hook: "Every story you tell gets a little better, and nobody minds.",
    text: "Gemini rising makes you easy to start talking to and hard to stop. The Leo Sun underneath gives the chatter a heart: you're not just talking, you're performing, and you want the room to have a good time. Teaching, writing, hosting, any job with an audience suits you. People feel lighter around you. The cost is that a quick wit can hide a big heart. Let people see you care how it went, not just how it sounded.",
    short: ["witty", "warm", "expressive"],
    watch: "making a joke when you mean something.",
  },
  "SUN_ASC:Leo|Libra": {
    hook: "You can make a crowded room feel like dinner for six.",
    text: "Libra rising, ruled by Venus, gives you grace and good manners at first meeting. The Leo Sun underneath brings the warmth and the wish to shine. The old astrologers counted the Sun and Venus as friends, and they work well together here: charm with substance, style with a real heart. You're a natural with people, and you care how things look because you care how people feel. The snag is approval. Wanting to be liked can water down what you really think.",
    short: ["charming", "generous", "stylish"],
    watch: "softening your opinion until it isn't yours anymore.",
  },
  "SUN_ASC:Leo|Aquarius": {
    hook: "You want to be special and you want everyone to be equal, and somehow you make it work.",
    text: "Aquarius rising meets the world cool, friendly and independent. The Leo Sun underneath is warm, proud and wants to be seen. They're opposite signs, so you carry both ends at once: one part of you loves the group and the other wants to lead it. You end up a leader of the slightly unusual kind, the one who gets people excited about a cause. The work is letting people close enough to see the warm part first.",
    short: ["warm", "original", "idealistic"],
    watch: "playing it cool when you'd rather be adored.",
  },
  "SUN_ASC:Sagittarius|Gemini": {
    hook: "You ask a stranger one question and come back with their life story and a book recommendation.",
    text: "Gemini rising and a Sagittarius Sun sit across the sky from each other: the near and the far, the question and the big answer. Mercury rules your chart and Jupiter your Sun, and the old astrologers called those two friends. People meet a quick, chatty mind and then find a seeker behind it, hungry for meaning and the bigger picture. You're a great explainer of big ideas. The cost is restlessness doubled: two changeable signs, both curious, neither keen to stay put.",
    short: ["curious", "talkative", "open minded"],
    watch: "collecting experiences instead of having them.",
  },
  "SUN_ASC:Sagittarius|Libra": {
    hook: "You're honest with everyone. You're just very nice about it.",
    text: "Libra rising is your diplomat: gracious, tactful, good at reading the room. Underneath, the Sagittarius Sun believes in telling the truth and seeing the world. So the blunt thing gets said, but kindly, and people tend to thank you for it. It's a sociable, generous chart that does best with company: travel with friends, a cause shared with people you like. The snag is commitment. Libra weighs every option and Sagittarius wants to keep them all open.",
    short: ["fair", "adventurous", "warm"],
    watch: "keeping every door open until none of them leads anywhere.",
  },
  "SUN_ASC:Sagittarius|Aquarius": {
    hook: "Your plans for the future would sound unrealistic if you hadn't already done half of them.",
    text: "People sense right away that you think for yourself; Aquarius rising wears its independence openly. The Sagittarius Sun underneath is an optimist and a believer. Together you're future minded in the best way: big ideas about how things could be, plus the nerve to go find out. You make friends across every kind of line. The cost is the here and now. You can be so busy with where things are going that you miss who is standing right in front of you.",
    short: ["visionary", "friendly", "free spirited"],
    watch: "planning the world and missing the person next to you.",
  },
  "SUN_ASC:Gemini|Aries": {
    hook: "You say it first and think about it second, and you're right more often than that should allow.",
    text: "Aries rising, Mars's sign, makes you the first one to speak in any meeting. The Gemini Sun behind it is quick, curious and funny. That makes you excellent in an argument, a pitch or an interview: you think on your feet and you're not afraid to land the point. People find you exciting. The cost is a sharp tongue. Mars and Mercury together can cut, and the joke you were proud of can sting longer than you meant.",
    short: ["fast", "witty", "fearless"],
    watch: "winning the argument and losing the friend.",
  },
  "SUN_ASC:Gemini|Leo": {
    hook: "You walk in like a headliner and talk like everyone's best friend.",
    text: "Leo rising gives you presence: warm, confident, a little dramatic, with the Sun ruling the chart. The Gemini Sun underneath is the storyteller. You love an audience and have plenty to say to it. Writing, speaking, performing, selling, anything with words and a crowd suits you, and people remember meeting you. The work is depth. Leo wants loyalty and Gemini wants variety, and the people you love need to know which one they're getting.",
    short: ["charismatic", "clever", "playful"],
    watch: "keeping so many friends that none of them feels close.",
  },
  "SUN_ASC:Gemini|Sagittarius": {
    hook: "You meet the world wide open and you have a question for every part of it.",
    text: "Sagittarius rising and a Gemini Sun face each other across the sky. Jupiter runs your chart and Mercury runs your Sun, and the old books placed each planet at its weakest in the other's sign. That sounds bad and plays out as a lively argument: the big picture against the details, the belief against the fact check. You come across friendly, funny and adventurous. The gift is a mind that can travel and report back. The work is landing somewhere long enough to finish the story.",
    short: ["curious", "adventurous", "articulate"],
    watch: "changing direction every time the idea gets hard.",
  },
  "SUN_ASC:Libra|Aries": {
    hook: "You come on strong and mean well, and people find that out in that order.",
    text: "Aries rising is the first impression: direct, energetic, ready to go. The Libra Sun underneath wants harmony, fairness and good company. They're opposite signs, and you carry the whole axis: me and us, push and partner. People expect a fighter and find a peacemaker with a backbone. The work is timing. Aries speaks before Libra has weighed it, and some evenings go to smoothing over what you said that morning.",
    short: ["bold", "diplomatic", "fair"],
    watch: "apologizing for being direct when direct was right.",
  },
  "SUN_ASC:Libra|Leo": {
    hook: "You're the one people want at their party and at their wedding.",
    text: "Leo rising meets the world warm and confident, and since Leo belongs to the Sun, your own Sun runs the chart. Underneath, the Libra Sun is all relationship: grace, taste, fairness. The old books put the Sun at its weakest in Libra, the sign of us rather than me, and that explains your best trick: you shine, but you shine on other people. You're generous with praise and very good at making a room feel beautiful. The cost is needing approval. Some decisions only you can make, whether or not the room claps.",
    short: ["gracious", "warm", "stylish"],
    watch: "deciding by applause.",
  },
  "SUN_ASC:Libra|Sagittarius": {
    hook: "You'll talk to anyone about anything, and somehow make it sound fair.",
    text: "Sagittarius rising gives you an open, friendly first impression; Jupiter rules the chart, and people expect fun. The Libra Sun behind it wants harmony and real connection. Together it's a sociable, curious, generous chart: good company on a trip, great at bringing different kinds of people together, quick to see the other side. The snag is saying no. Sagittarius wants the next adventure and Libra hates to disappoint anyone, so you agree to too much.",
    short: ["friendly", "fair", "adventurous"],
    watch: "overbooking yourself to keep everyone happy.",
  },
  "SUN_ASC:Aquarius|Aries": {
    hook: "You'll go first, especially if nobody thinks it can be done.",
    text: "Aries rising is the dare: direct, quick, independent, with Mars ruling the chart. The Aquarius Sun behind it is the idea, original and principled. Put them together and you get a pioneer, someone who acts on what everyone else is still debating. People find you bracing in the best way. The cost is patience with the slow parts: committees, explanations, other people's doubts. Bring a few people along. The idea goes farther with company.",
    short: ["pioneering", "independent", "bold"],
    watch: "going it alone when you didn't have to.",
  },
  "SUN_ASC:Aquarius|Leo": {
    hook: "You don't want the spotlight on you. You want it on the idea.",
    text: "Leo rising gives you warmth and presence, with the Sun ruling the chart, and your Sun sits in Aquarius, where the old books said it is weakest: it serves the group instead of itself. That's the heart of this chart. You come across like a star, and underneath you care more about the cause than the credit. People rally to you. The work is the personal part. Being loved one on one can feel harder than being admired by many.",
    short: ["charismatic", "principled", "generous"],
    watch: "being admired by many and known by few.",
  },
  "SUN_ASC:Aquarius|Sagittarius": {
    hook: "Your friends span four continents and several belief systems.",
    text: "Sagittarius rising makes you easy to meet: open, funny, curious about wherever someone is from. The Aquarius Sun underneath is independent and future minded. It's one of the friendliest pairings there is: curious about everyone and judgmental about almost no one. You love ideas that make the world bigger. The snag is roots. Freedom is your favorite word, and sometimes the people who love you want to hear a smaller one, like stay.",
    short: ["open minded", "friendly", "idealistic"],
    watch: "treating every commitment like a cage.",
  },

  // Batch 7, fire meets water (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-07-fire-meets-water.md
  "SUN_ASC:Aries|Cancer": {
    hook: "You'd fight anyone for your people. You'd just rather be home with them.",
    text: "Cancer rising, the Moon's sign, meets the world gentle and careful, so people take you for soft until someone you love is threatened. Then the Aries Sun arrives. It's protective fire: brave on behalf of your family, your friends, your corner of the world. Your moods can turn fast, warm one minute and sharp the next, because the Moon and Mars both like to react first. The gift is courage with a reason. The work is letting a feeling settle before you act on it.",
    short: ["protective", "brave", "warmhearted"],
    watch: "snapping first and hugging second.",
  },
  "SUN_ASC:Aries|Scorpio": {
    hook: "You don't start fights. You finish them, and you remember who started.",
    text: "In the old books Mars rules both Aries and Scorpio, so with an Aries Sun and Scorpio rising, one planet runs your core and your front door (modern astrology adds Pluto to Scorpio). Aries is the open flame, Scorpio the banked coals. People meet someone intense and controlled, then discover how direct you can be. You have unusual nerve, the kind that holds steady under pressure. The cost is intensity with no off switch: everything matters, and resting can feel like losing.",
    short: ["fearless", "determined", "intense"],
    watch: "turning a disagreement into a contest.",
  },
  "SUN_ASC:Leo|Cancer": {
    hook: "You take care of everyone, and you'd like a little applause for it. Fair.",
    text: "Cancer rising is ruled by the Moon and your Leo Sun by the Sun, so the two lights of the sky split your chart between them: the private glow and the public one. People meet someone warm, kind and a little shy, and then find the performer underneath. You're happiest with a full house of family, friends and the people you've adopted along the way. The snag is sensitivity. Leo's pride and Cancer's shell both take things personally, and a small slight can stay with you a long time.",
    short: ["warm", "nurturing", "big hearted"],
    watch: "going quiet when what you need is to be noticed.",
  },
  "SUN_ASC:Leo|Scorpio": {
    hook: "You walk in calm and leave everyone wondering what you're thinking.",
    text: "Scorpio rising keeps the door half closed, and people lean in to see what's behind it. The Leo Sun underneath wants warmth, loyalty and to be seen. Two fixed signs, both proud, so you're loyal past reason and very hard to move. People sense power in you and respond to it. The tension is between hiding and shining: Scorpio keeps it close and Leo wants it out. When you let the heart show, you're unforgettable.",
    short: ["magnetic", "loyal", "strong willed"],
    watch: "holding out until someone proves they deserve the real you.",
  },
  "SUN_ASC:Leo|Pisces": {
    hook: "You'll light up a room, then go home and cry at a movie. Both are real.",
    text: "Pisces rising meets people soft, kind and open, with Neptune as its modern ruler and Jupiter as its traditional one. The Leo Sun behind it is generous and creative and wants its life to mean something. It's an artist's chart: imagination plus the nerve to show it. People feel welcome with you right away. The cost is that you absorb a lot, and Leo doesn't like admitting it's tired. Let somebody take care of you sometimes.",
    short: ["creative", "generous", "gentle"],
    watch: "giving the show everything and saving nothing for yourself.",
  },
  "SUN_ASC:Sagittarius|Cancer": {
    hook: "You love an adventure as long as it ends at the kitchen table.",
    text: "With Cancer rising, people meet the host before the traveler: warm, protective, making sure everyone ate. The Sagittarius Sun underneath is restless, curious and honest. Jupiter, your Sun's ruler, is exalted in Cancer in the old books, which suits this pairing: your big heart and your big ideas both want to look after people. You teach, host, travel and bring home stories. The tension is home against horizon. You want to belong and you want to go, and you need a life that allows both.",
    short: ["generous", "caring", "curious"],
    watch: "feeling homesick on the trip and restless at home.",
  },
  "SUN_ASC:Sagittarius|Scorpio": {
    hook: "You'll tell someone the whole truth, but only after you've decided they can handle it.",
    text: "Scorpio rising gives you a private, intense first impression. The Sagittarius Sun behind it is open, philosophical and blunt. So people meet someone careful, then find a person who will say anything once trust is in place. It's a seeker's chart with depth: you want to know what's true, and you'll look in the dark corners for it. The cost is extremes. You can swing from all in to gone, and the people around you feel the whiplash.",
    short: ["truth seeking", "intense", "adventurous"],
    watch: "leaving once you've seen enough, without saying why.",
  },
  "SUN_ASC:Sagittarius|Pisces": {
    hook: "You believe in people, possibilities and the occasional miracle, and you're not embarrassed about it.",
    text: "In the old books Jupiter rules both Sagittarius and Pisces, so with your Sun in one and the other rising, Jupiter runs your whole chart: faith, generosity, a sense that things will work out (modern astrology adds Neptune to Pisces). People meet someone gentle and open, then find a restless optimist underneath. You're kind to strangers and endlessly curious. The cost is limits. Two changeable signs, both big hearted, can say yes to everything.",
    short: ["idealistic", "compassionate", "adventurous"],
    watch: "rescuing people who could rescue themselves.",
  },
  "SUN_ASC:Cancer|Aries": {
    hook: "You come on strong to protect the soft part.",
    text: "Aries rising walks in first and asks questions later. The Cancer Sun underneath is tender, family minded and remembers everything. So the push is real, but it's usually for someone: you charge in on behalf of the people you love. When you're hurt, Aries wants to fight and Cancer wants to hide, and you can do both in one afternoon. The gift is fierce devotion. The work is saying the soft thing out loud instead of acting it out.",
    short: ["protective", "brave", "loyal"],
    watch: "getting angry when you're actually hurt.",
  },
  "SUN_ASC:Cancer|Leo": {
    hook: "You love feeding people. You love it even more when they say so.",
    text: "Leo rising gives you a big, generous presence, and because Leo is the Sun's sign, your Sun steers the whole chart. Your Sun sits in Cancer, where the old books say it has no dignity at all, and that tracks: you don't shine for yourself so much as for your people. You come across confident and bold; underneath you're sensitive and deeply attached. Your home is a stage and a shelter at once. The cost is that you need appreciation and don't always ask for it. Ask.",
    short: ["warm", "devoted", "generous"],
    watch: "keeping score of the care you gave.",
  },
  "SUN_ASC:Cancer|Sagittarius": {
    hook: "You'll travel the world and send a postcard to everyone you love.",
    text: "Sagittarius rising makes you look like the one who'd move abroad on a whim. Underneath, the Cancer Sun is a homebody at heart, tied to family and memory, and people are surprised how sentimental you are. It works best when you bring home with you: friends on the trip, the family recipe in a borrowed kitchen. The snag is feeling torn between staying and going, and guilty either way.",
    short: ["warm", "adventurous", "sentimental"],
    watch: "feeling guilty for wanting both.",
  },
  "SUN_ASC:Scorpio|Aries": {
    hook: "You go straight at the problem and keep going until it's actually solved.",
    text: "Aries rising is the open blade: direct, quick, ready. The Scorpio Sun behind it is deep, private and determined. You have more courage than most people know what to do with. You're good in emergencies and better in long hard projects, because Scorpio adds staying power to the Aries charge. The cost is how hard you can be on other people and on yourself. Not everything is a battle, even when it feels like one.",
    short: ["driven", "fearless", "relentless"],
    watch: "treating every setback as a personal challenge.",
  },
  "SUN_ASC:Scorpio|Leo": {
    hook: "People see the confidence. Very few see the depth, and you like it that way.",
    text: "Leo rising gives you the kind of presence people notice from across a room. The Scorpio Sun underneath is intense, private and fiercely loyal. Both are fixed signs, so once you commit, you commit for good, and you can outlast nearly anyone. You come across generous and commanding while, underneath, you're watching closely. The tension is between showing and hiding. Leo wants to be known, Scorpio wants to stay safe, and real closeness needs a little of both.",
    short: ["magnetic", "loyal", "powerful"],
    watch: "holding a grudge behind a smile.",
  },
  "SUN_ASC:Scorpio|Sagittarius": {
    hook: "You'll say the true thing, and you'll know exactly how hard it lands.",
    text: "Sagittarius rising is the easygoing front: friendly, frank, quick to laugh. The Scorpio Sun underneath is deep, private and perceptive. So people expect light and get depth. You're a natural researcher, traveler or teacher of hard subjects, curious about everything and especially what's hidden. The cost is the gap between the open front and the private center. People think they know you sooner than they do.",
    short: ["perceptive", "adventurous", "honest"],
    watch: "hiding the serious part behind a joke.",
  },
  "SUN_ASC:Pisces|Aries": {
    hook: "You're gentle until something's unfair, and then you're not.",
    text: "Aries rising looks like confidence: direct, energetic, already moving. The Pisces Sun behind it is sensitive, imaginative and kind. You act fast on what you feel, especially for anyone who can't defend themselves. People see the courage and miss how much you're absorbing. Your energy runs in bursts: all out, then a need to retreat and recover. Plan for the second part.",
    short: ["compassionate", "brave", "intuitive"],
    watch: "burning out after the rescue.",
  },
  "SUN_ASC:Pisces|Leo": {
    hook: "You make art out of everything, including bad days.",
    text: "Leo rising gives you a sense of occasion; even a Tuesday feels like an event when you walk in. Underneath, the Pisces Sun is dreamy, compassionate and deeply creative. It's a performer's chart, or an artist's: you can take what you feel and give it a stage. People are moved by you. The cost is mixed signals. Leo wants applause and Pisces is a little embarrassed to want it, so people can't always tell what you need.",
    short: ["creative", "warm", "empathetic"],
    watch: "needing praise and pretending you don't.",
  },
  "SUN_ASC:Pisces|Sagittarius": {
    hook: "You'll follow a feeling across the country and call it a plan.",
    text: "Sagittarius rising meets the world open, funny and ready to go. The Pisces Sun underneath is gentle, spiritual and imaginative. Two changeable signs and a lot of faith: you trust the road, the story, the people you meet, and that trust takes you places others never go. The cost is structure. Without some, the wandering stops being fun. A few fixed points, a home base and a friend who checks in keep the adventure an adventure.",
    short: ["free spirited", "kind", "imaginative"],
    watch: "waiting for a sign instead of choosing.",
  },

  // Batch 8, earth meets air (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-08-earth-meets-air.md
  "SUN_ASC:Taurus|Gemini": {
    hook: "You can talk your way into anything, then refuse to be talked out of it.",
    text: "Ask anyone who's met you once and they'll say chatty, quick, fun; Gemini rising does the introductions. Spend a month with you and they'll say steady, which is the Taurus Sun. The combination is a practical mind with a light touch: you can explain how things work and make it entertaining. People underestimate how fixed your values are because your conversation is so flexible. The cost is restless on the surface and stubborn underneath, which can confuse the people closest to you.",
    short: ["witty", "steady", "practical"],
    watch: "changing the subject instead of changing your mind.",
  },
  "SUN_ASC:Taurus|Libra": {
    hook: "You have excellent taste and you're not shy about it.",
    text: "Venus rules both Taurus and Libra, so your core and your first impression answer to the same planet: beauty, pleasure, people. You're easy to like, and you notice everything about how a place looks, sounds and feels. Libra rising makes you gracious; the Taurus Sun underneath makes the grace last, because you're loyal once you choose. The snag is comfort. Two Venus signs can avoid an unpleasant conversation for a very long time.",
    short: ["gracious", "loyal", "artistic"],
    watch: "keeping things pleasant instead of keeping them honest.",
  },
  "SUN_ASC:Taurus|Aquarius": {
    hook: "You'd break with tradition, but only after thinking it over for ten years.",
    text: "People first meet the independent thinker, a little unconventional and hard to predict: that's Aquarius rising. Underneath sits a Taurus Sun that wants stability, comfort and things that last. Venus rules your Sun and, in the old system, Saturn rules your rising sign, and the old astrologers called those two enemies. You know the feeling: pleasure against principle, the cozy life against the right one. When they cooperate, you build something new that actually stands. Both signs are fixed, so once you've decided, nobody is moving you.",
    short: ["principled", "steady", "original"],
    watch: "digging in on an idea just because you said it out loud.",
  },
  "SUN_ASC:Virgo|Gemini": {
    hook: "You notice everything, and you have a comment for most of it.",
    text: "Mercury rules both Gemini and Virgo, so your mind runs the whole operation: the quick talk out front and the careful analysis behind it. People find you clever, funny and useful, in that order. You can learn almost anything fast and explain it better than the person who taught you. The cost is a mind that won't switch off. Two Mercury signs can turn a small worry into a long night.",
    short: ["clever", "precise", "helpful"],
    watch: "talking yourself into a worry you could have slept through.",
  },
  "SUN_ASC:Virgo|Libra": {
    hook: "You make things nicer for everyone, then quietly check that it worked.",
    text: "Libra rising is charm and good manners, the person who makes a dinner feel easy. Behind it, the Virgo Sun is doing the actual work: the seating, the timing, the dish someone can't eat. You care about beauty and you care about doing things properly, and when those line up, the result is lovely and nobody sees the effort. The snag is self criticism. Libra wants approval and Virgo audits it, so a compliment can feel like a test.",
    short: ["gracious", "thoughtful", "precise"],
    watch: "hearing one critique louder than ten compliments.",
  },
  "SUN_ASC:Virgo|Aquarius": {
    hook: "You'd like to fix the world. You've started with a very detailed list.",
    text: "Strangers read you as cool, friendly and a bit unusual: Aquarius rising. The Virgo Sun behind it is practical and exact. Together you're a reformer with a toolkit, someone who cares about the big picture and knows the details that make it work. You're often the one who actually improves a system instead of just complaining about it. The cost is warmth on the surface. People can admire your mind and not realize how much you care.",
    short: ["useful", "original", "principled"],
    watch: "showing love by fixing things when someone wanted a hug.",
  },
  "SUN_ASC:Capricorn|Gemini": {
    hook: "You make serious things sound easy and easy things sound like a plan.",
    text: "Gemini rising makes you quick and conversational, and people don't expect how much ambition is sitting underneath. The Capricorn Sun is the long game. The old astrologers liked Saturn and Mercury together: a curious, industrious mind that can find out anything. That's you at work: you learn the system, then master it, then explain it to everyone else. The cost is sounding breezy about things you're privately carrying very hard.",
    short: ["clever", "ambitious", "dry humored"],
    watch: "joking about the pressure instead of naming it.",
  },
  "SUN_ASC:Capricorn|Libra": {
    hook: "You're very good at getting your way politely.",
    text: "On first meeting you're gracious and diplomatic, Libra rising at its best. The Capricorn Sun behind it is ambitious and serious. Saturn, your Sun's ruler, is exalted in Libra in the old books, which suits you: your discipline shows up as fairness, good judgment and a talent for contracts, negotiations and partnerships. You know how to make the deal everyone can live with. The cost is that work and love can blur. Not every partnership has to be productive.",
    short: ["diplomatic", "ambitious", "fair"],
    watch: "treating a relationship like a project to manage.",
  },
  "SUN_ASC:Capricorn|Aquarius": {
    hook: "You respect the rules enough to know exactly which ones to break.",
    text: "In the old system Saturn rules both Capricorn and Aquarius, so the same planet runs your core and your front door (modern astrology gives Aquarius to Uranus). It shows. You come across independent and a little unconventional, and underneath you're disciplined and serious. You're the rare person who can reform something from the inside, because you understand how it was built. The cost is distance. People respect you before they feel close to you.",
    short: ["disciplined", "independent", "wise"],
    watch: "keeping everyone at a respectful arm's length.",
  },
  "SUN_ASC:Gemini|Taurus": {
    hook: "You look relaxed, and you are, mostly, but your mind is doing laps.",
    text: "Taurus rising slows you down in the world's eye: calm, warm, in no hurry. The Gemini Sun behind it is quick, curious and always collecting something new to think about. People feel comfortable with you because you seem settled, and then they're entertained for hours. It's a good chart for any work that needs both patience and wit. The tension is pace. Part of you wants a nap and part of you wants a new hobby.",
    short: ["easygoing", "curious", "funny"],
    watch: "starting the new hobby from the couch.",
  },
  "SUN_ASC:Gemini|Virgo": {
    hook: "You read the manual, wrote a better one and explained it to the group.",
    text: "Virgo rising looks careful, modest and organized. Underneath, the Gemini Sun is quick, playful and full of ideas, so people expect someone reserved and find someone very funny. Both halves love information: one collects it and the other sorts it. You're excellent at teaching, editing, troubleshooting, anything that turns a mess into sense. The cost is nerves. A busy mind and a careful eye can tip into worry fast.",
    short: ["smart", "funny", "organized"],
    watch: "worrying out loud until everyone else is worried too.",
  },
  "SUN_ASC:Gemini|Capricorn": {
    hook: "You look like the adult in the room. You're also the one making everyone laugh.",
    text: "Capricorn rising is serious at first meeting: composed, capable, a little guarded. The Gemini Sun underneath is quick and curious and finds almost everything interesting. That pairing makes you a sharp operator: you can talk to anyone, and you take your goals seriously. Your humor is dry and frequent, and sometimes nobody catches it. The cost is lightness. Capricorn can convince you that play has to be earned.",
    short: ["witty", "capable", "versatile"],
    watch: "saving fun for after the work is done.",
  },
  "SUN_ASC:Libra|Taurus": {
    hook: "You make every place you live a little more beautiful, and you never rush it.",
    text: "Taurus rising makes you calm and welcoming, and people relax around you. The Libra Sun behind it wants harmony, beauty and good company. Together you're the friend with the nice home, the good playlist and the open door. You have an eye for quality and the patience to wait for it. The snag is conflict: both signs prefer a pleasant life, so hard conversations get postponed until they're harder.",
    short: ["gracious", "warm", "artistic"],
    watch: "postponing the hard talk.",
  },
  "SUN_ASC:Libra|Virgo": {
    hook: "You're the person who notices what would make it better, and says it nicely.",
    text: "Strangers see someone modest, helpful and careful: that's Virgo rising. Then they get to know the Libra Sun, which loves people, fairness and beauty. You're a refiner. You make things kinder, cleaner, more balanced, and you have taste and judgment you usually keep to yourself until asked. The cost is self doubt. The old books say Venus, your Sun's ruler, is least comfortable in Virgo, your rising sign, and you can be harder on your own appeal than anyone else is.",
    short: ["thoughtful", "gracious", "discerning"],
    watch: "underselling yourself.",
  },
  "SUN_ASC:Libra|Capricorn": {
    hook: "You negotiate like a diplomat and plan like a general.",
    text: "People hand you the serious jobs; Capricorn rising looks like someone who'll get it done. The Libra Sun underneath is gracious and fair and wants everyone treated well. It's a leader's chart of the quiet kind: you bring people to agreement and make sure the agreement holds. The cost is a heavy sense of duty. You can be fair to everyone except yourself.",
    short: ["fair", "responsible", "composed"],
    watch: "putting yourself last on the list of people to be fair to.",
  },
  "SUN_ASC:Aquarius|Taurus": {
    hook: "You have radical ideas and a very regular breakfast.",
    text: "Taurus rising makes you seem easygoing and grounded, the calm one. The Aquarius Sun underneath is independent and original, with opinions about how things could be better, and people are surprised how unconventional you are once you start talking. Both signs are fixed, so you're loyal to your people and your principles and slow to change either. The cost is stubbornness wearing two outfits: comfort and conviction.",
    short: ["steady", "original", "loyal"],
    watch: "refusing to budge and calling it principle.",
  },
  "SUN_ASC:Aquarius|Virgo": {
    hook: "You care about humanity in general and the details in particular.",
    text: "Virgo rising is the modest, useful first impression: helpful, observant, a little reserved. Behind it, the Aquarius Sun is a big picture thinker who wants the world to work better. Together you're the person who turns an idea into a system that actually helps people. You'd rather be useful than praised. The cost is feeling, which both signs prefer to study. Let some things be felt before they're fixed.",
    short: ["helpful", "inventive", "principled"],
    watch: "fixing a feeling before you've let yourself feel it.",
  },
  "SUN_ASC:Aquarius|Capricorn": {
    hook: "You look conventional, which is the perfect cover.",
    text: "Capricorn rising makes you look serious and established, someone who knows the rules. Underneath, the Aquarius Sun is independent and quietly radical. That's a useful disguise: people trust the Capricorn and later find out the Aquarius has been redesigning the whole thing. You're patient enough to make change last. The cost is being alone with your own ideas. Find the few people who get both halves.",
    short: ["disciplined", "original", "quietly radical"],
    watch: "carrying a vision alone.",
  },

  // Batch 9, earth meets water (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-09-earth-meets-water.md
  "SUN_ASC:Taurus|Cancer": {
    hook: "Your idea of a perfect weekend involves a blanket, a pot of something and nobody leaving early.",
    text: "Cancer rising is the first thing people feel: kindness, a little shyness, the sense that you'd look after them. The Taurus Sun behind it makes that care practical. You feed people, keep in touch and remember the details. It's one of the most homemaking charts there is, and the people in your life tend to stay for decades. The cost is holding on. Both signs dislike change, so letting go of a place, a habit or a person takes you a long time.",
    short: ["nurturing", "loyal", "steady"],
    watch: "keeping things the same because change feels like loss.",
  },
  "SUN_ASC:Taurus|Scorpio": {
    hook: "You don't let many people in. The ones you do get you for life.",
    text: "Taurus and Scorpio sit opposite each other, which put your Sun near the western horizon when you were born, around sunset. People meet the Scorpio first: guarded, magnetic, watching. The Taurus Sun underneath is warmer and simpler than that door suggests: good food, real comfort, steady love. Both signs are fixed, so you're the most loyal person most people know, and the most stubborn. The old books put Venus, your Sun's ruler, at a disadvantage in Scorpio. Pleasure has to pass a security check first.",
    short: ["loyal", "sensual", "intense"],
    watch: "holding a grudge as long as you hold a friendship.",
  },
  "SUN_ASC:Taurus|Pisces": {
    hook: "You're gentle with people and firm with your plans.",
    text: "First impressions of you are soft: kind, open, a little dreamy, which is Pisces rising. The Taurus Sun underneath has its feet on the ground. That makes you an artist with a practical streak, the friend who imagines the garden and then digs it. People feel safe and inspired around you at the same time. The cost is avoidance. When something hurts, Pisces wants to drift and Taurus wants to stay put, and the problem waits.",
    short: ["kind", "creative", "grounded"],
    watch: "letting a problem wait because facing it feels unkind.",
  },
  "SUN_ASC:Virgo|Cancer": {
    hook: "You show you care by remembering the medicine, the birthday and the thing they said they were nervous about.",
    text: "Cancer rising makes you warm and approachable, the person people tell things to. Behind it, the Virgo Sun is the helper with a list. Together you care for people in very specific ways, and nobody does it better. You're a natural in any work that heals, teaches or tends. The cost is worry: you feel everyone's problems and want to solve all of them. Some of them aren't yours.",
    short: ["caring", "attentive", "practical"],
    watch: "worrying about people as a way of loving them.",
  },
  "SUN_ASC:Virgo|Scorpio": {
    hook: "You notice what people hide. They're usually not hiding it as well as they think.",
    text: "Scorpio rising makes people wonder what you're thinking. Usually it's an analysis. The Virgo Sun behind that guarded look is sharp, exact and quietly funny. Together you're an investigator: researcher, editor, diagnostician, the friend who sees the real problem. People trust your judgment because you don't flatter. The cost is how hard you can be, on yourself most of all. Precision and intensity together leave very little room for a mistake.",
    short: ["perceptive", "precise", "private"],
    watch: "holding yourself to a standard you'd never hold a friend to.",
  },
  "SUN_ASC:Virgo|Pisces": {
    hook: "You'll organize the whole thing and then cry at the speeches.",
    text: "Virgo and Pisces are opposite signs: the details and the ocean. People meet the Pisces first, gentle and open, and then discover a precise mind behind it. The old books put Mercury, your Sun's ruler, at its weakest in Pisces, and you know the struggle: the facts and the feelings don't always agree. When they work together, you're a healer, someone who cares deeply and knows exactly what to do. The cost is limits. You can give and serve until there's nothing left.",
    short: ["compassionate", "practical", "intuitive"],
    watch: "serving everyone and asking for nothing.",
  },
  "SUN_ASC:Capricorn|Cancer": {
    hook: "You'd build a house for your family with your own hands, and then worry about the roof.",
    text: "Capricorn and Cancer face each other across the sky: the career and the home, the public life and the private one. People meet the Cancer first, warm, protective and kind. Underneath, the Capricorn Sun is ambitious and serious, and you work hard so the people you love are safe. The old books put the Moon, your chart's ruler, at its weakest in Capricorn, and it shows when you're tired: feelings get filed away as tasks. Let some of them stay feelings.",
    short: ["devoted", "responsible", "protective"],
    watch: "providing for people instead of being with them.",
  },
  "SUN_ASC:Capricorn|Scorpio": {
    hook: "You don't announce your plans. You announce your results.",
    text: "Scorpio rising gives you a reserved, powerful presence, and people sense quickly that you're not to be underestimated. The Capricorn Sun behind it is strategic and patient. Mars, Scorpio's old ruler, is exalted in Capricorn, so this chart has unusual drive with real discipline behind it. You can wait for the right moment and then act completely. People find you impressive and hard to read. The cost is trust: you'd rather do it yourself than depend on anyone.",
    short: ["strategic", "determined", "private"],
    watch: "trusting no one so you never have to be let down.",
  },
  "SUN_ASC:Capricorn|Pisces": {
    hook: "You're a dreamer with a spreadsheet.",
    text: "People meet someone soft, kind and easy to talk to; that's Pisces rising. Behind it, the Capricorn Sun is ambitious, practical and responsible. It's a lovely combination for creative work that has to pay the bills, or caring work that needs a system: you can imagine something and then build it. The cost is that the two sides don't always trust each other. Capricorn calls the dream unrealistic, Pisces calls the plan cold. Both are wrong, and both are useful.",
    short: ["imaginative", "responsible", "kind"],
    watch: "talking yourself out of the dream before you try it.",
  },
  "SUN_ASC:Cancer|Taurus": {
    hook: "You make people feel at home anywhere, which is lucky, because you'd rather never leave home.",
    text: "Taurus rising makes you steady and welcoming, and people relax the moment they arrive. The Cancer Sun underneath is tender and family minded. The Moon, which rules Cancer, is exalted in Taurus in the old books, and you feel like proof: your emotions are calmest when life is comfortable, the fridge is full and your people are close. The cost is change. Even good change can feel like losing something.",
    short: ["nurturing", "calm", "loyal"],
    watch: "resisting a good change because it isn't familiar.",
  },
  "SUN_ASC:Cancer|Virgo": {
    hook: "You've packed snacks for everyone, including the person who said they didn't want any.",
    text: "Virgo rising looks modest and helpful. The Cancer Sun behind it is deeply caring and remembers everything. Together you're the friend who notices when someone's off and quietly does something about it. People rely on you more than they realize. The cost is taking on too much. Your care is real, and so is your tiredness.",
    short: ["caring", "helpful", "observant"],
    watch: "doing for others until you're running on empty.",
  },
  "SUN_ASC:Cancer|Capricorn": {
    hook: "People see the capable one. Your family sees the softie.",
    text: "Capricorn rising is the professional face: composed, reliable, a little formal. Your Cancer Sun sits right across the sky from it, and the two are a matched set, the public role and the private heart. You work hard in public so home can stay soft. People trust you with responsibility. The cost is that feelings can hide behind duties, and the people who love you would rather have the feelings.",
    short: ["responsible", "tender", "dependable"],
    watch: "being needed instead of being known.",
  },
  "SUN_ASC:Scorpio|Taurus": {
    hook: "You want very few things. You want them completely.",
    text: "Taurus rising makes you seem calm, easy and grounded. The Scorpio Sun underneath is intense and private and feels everything at full depth. Mars, Scorpio's old ruler, is at a disadvantage in Taurus, which tracks: your drive goes underground and comes out slowly, steadily and impossible to stop. Both signs are fixed. When you love something, it's forever. When you're hurt, that's forever too, unless you choose otherwise.",
    short: ["steady", "intense", "loyal"],
    watch: "making a slight permanent.",
  },
  "SUN_ASC:Scorpio|Virgo": {
    hook: "You see through people kindly. Mostly.",
    text: "Virgo rising gives a modest, observant first impression, and people don't expect the depth. The Scorpio Sun behind it is intense and perceptive, so you're always taking in more than you let on. You're excellent with problems other people can't solve: the bug, the diagnosis, the hidden reason. People bring you their messes and you sort them. The cost is suspicion. A careful eye and a private heart can see betrayal where there's only a mistake.",
    short: ["perceptive", "capable", "discreet"],
    watch: "assuming the worst when the explanation is ordinary.",
  },
  "SUN_ASC:Scorpio|Capricorn": {
    hook: "You play the long game, and you're winning.",
    text: "Capricorn rising looks composed and serious, someone with a plan. The Scorpio Sun underneath has the will to see it through. Saturn rules your chart, and in the old books Mars rules your Sun's sign (modern astrology adds Pluto): discipline plus force. You can work quietly for years toward something and then take it. People respect you and are a little wary of you, and you don't mind. The cost is softness. Strength is your comfort zone; tenderness takes practice.",
    short: ["ambitious", "determined", "powerful"],
    watch: "treating vulnerability like a weakness.",
  },
  "SUN_ASC:Pisces|Taurus": {
    hook: "You make a calm place for people and then fill it with music.",
    text: "Taurus rising makes you warm, steady and easy to be around. The Pisces Sun underneath is imaginative and tender. Venus rules your chart and is exalted in Pisces, your Sun's sign, so this is one of the most artistic, affectionate pairings in the zodiac. You have a gift for beauty and comfort, and people feel cared for around you. The cost is drift. You'd sometimes rather stay comfortable than face what needs doing.",
    short: ["artistic", "gentle", "steady"],
    watch: "staying cozy when something needs facing.",
  },
  "SUN_ASC:Pisces|Virgo": {
    hook: "You look organized. Inside, a poet and an accountant share an office.",
    text: "Virgo rising presents tidy, helpful and modest. Your Pisces Sun sits opposite it, and that axis is the whole chart: order and imagination, the checklist and the dream. You can be both, which makes you rare. You serve people with real compassion and real competence. The cost is guilt. Pisces feels it could always give more, and Virgo is sure it could have done better.",
    short: ["compassionate", "capable", "creative"],
    watch: "feeling guilty for having limits.",
  },
  "SUN_ASC:Pisces|Capricorn": {
    hook: "You're the kindest person in the meeting, and you're running it.",
    text: "Capricorn rising gives you authority and composure, and people take you seriously right away. The Pisces Sun underneath is soft, intuitive and deeply caring. Jupiter, Pisces' old ruler, is in its fall in Capricorn, which describes the push and pull well: faith and generosity meeting duty and limits. You're at your best when your work helps people, leadership with a heart. The cost is carrying everyone's feelings while looking like you carry none.",
    short: ["compassionate", "capable", "steady"],
    watch: "looking fine while absorbing everything.",
  },

  // Batch 10, air meets water (owner approved 11/20): docs/redesign/drafts/2026-11-20-batch-10-air-meets-water.md
  "SUN_ASC:Gemini|Cancer": {
    hook: "You'll talk about anything except how you're doing, then tell one friend everything at midnight.",
    text: "The old astrologers gave reason to Mercury and feeling to the Moon, and said whichever is stronger in a chart leads. In yours, both are in charge: Mercury rules your Gemini Sun and the Moon rules your Cancer rising. People meet someone gentle and caring, then discover a quick, curious mind behind it. You're wonderful at the conversations that matter, where someone needs to be heard and also needs an idea. The cost is mixed signals: you can think your way around a feeling, then feel it all at once.",
    short: ["caring", "clever", "intuitive"],
    watch: "joking past a feeling until it ambushes you.",
  },
  "SUN_ASC:Gemini|Scorpio": {
    hook: "You ask the questions other people are afraid to ask, and you listen to every answer.",
    text: "Scorpio rising makes you look intense and hard to read. Then you open your mouth and you're funny, curious and surprisingly light: that's the Gemini Sun. Together you're a natural interviewer, researcher or detective, quick to ask and slow to forget. People tell you their secrets because you seem to understand, and because you do. The cost is control. You like to know everything and reveal little, which can leave the people close to you guessing.",
    short: ["curious", "perceptive", "magnetic"],
    watch: "collecting secrets and sharing none.",
  },
  "SUN_ASC:Gemini|Pisces": {
    hook: "You can tell a story that makes a whole table go quiet, then make them laugh at the end.",
    text: "With Pisces rising, people feel instantly at ease: you seem gentle, open, a little dreamy. Your Gemini Sun gives that softness a voice: words, ideas, stories. It's a writer's chart, or a teacher's, or anyone's who translates feelings into language. Both signs are changeable, so you adapt to every room. The cost is focus. You pick up every mood and every idea, and it can be hard to know which ones are yours.",
    short: ["imaginative", "articulate", "empathetic"],
    watch: "becoming whoever the room needs and losing track of yourself.",
  },
  "SUN_ASC:Libra|Cancer": {
    hook: "You host like it's an art form, because for you, it is.",
    text: "First meetings with you feel warm and safe; Cancer rising puts people at ease. Libra, your Sun sign, adds grace, taste and a deep wish for everyone to get along. You're the friend who remembers the anniversary, smooths the argument and sets a beautiful table. Relationships are your real talent. The cost is your own needs. Cancer looks after others and Libra keeps the peace, and between them your wants can slide to the bottom of the list.",
    short: ["gracious", "caring", "loyal"],
    watch: "saying \"I'm fine\" so the evening stays nice.",
  },
  "SUN_ASC:Libra|Scorpio": {
    hook: "You're charming in public and intense in private, and the right people get both.",
    text: "Scorpio rising is guarded and magnetic; people sense depth before you speak. The Libra Sun behind it wants harmony and real partnership. In the old books Mars, Scorpio's ruler, is weak in Libra, the sign of compromise, and that's your balancing act: power held with manners. You make a loyal, passionate partner and a fair, formidable negotiator. The cost is hiding what you want behind politeness, then resenting not getting it.",
    short: ["magnetic", "fair", "devoted"],
    watch: "being polite about something that matters.",
  },
  "SUN_ASC:Libra|Pisces": {
    hook: "You see the best in people. Sometimes you see it before it exists.",
    text: "Pisces rising makes you soft, open and kind on first meeting. Venus rules your Libra Sun and is exalted in Pisces in the old books, so love, beauty and art run through this whole chart. You're romantic in every sense: about people, places and possibilities. People feel accepted around you. The cost is clarity. You'd rather believe the lovely version, and sometimes the lovely version isn't true.",
    short: ["romantic", "artistic", "kind"],
    watch: "falling for potential instead of the person.",
  },
  "SUN_ASC:Aquarius|Cancer": {
    hook: "You care about the whole world, and you'd also like everyone to come over for dinner.",
    text: "People meet the Cancer first: warm, protective, easy to talk to. Your Aquarius Sun is independent and future minded. The old books put Saturn, Aquarius's ruler, at its weakest in Cancer, and you'll recognize the tug of war: freedom against belonging, the big cause against the small circle. When they work together, you build communities, chosen families and groups that actually look after their members. The cost is feeling torn between needing people and needing space.",
    short: ["caring", "independent", "community minded"],
    watch: "pulling away right after letting someone close.",
  },
  "SUN_ASC:Aquarius|Scorpio": {
    hook: "You're very hard to fool and even harder to change.",
    text: "Scorpio rising gives you a watchful, intense presence. The Aquarius Sun behind it is independent, rational and firmly principled. Both signs are fixed, and in the old books their rulers, Mars and Saturn, were enemies: force against restraint. In you they make a reformer with real nerve, someone who sees what's wrong and won't let it go. People respect you, sometimes nervously. The cost is rigidity. Once you've decided, new information has a hard time getting in.",
    short: ["determined", "perceptive", "original"],
    watch: "winning on principle and losing the relationship.",
  },
  "SUN_ASC:Aquarius|Pisces": {
    hook: "You'd volunteer to save the world, as long as the job could be a little strange.",
    text: "Neither of your signs had its modern ruler when the old books were written: Uranus was found in 1781 and Neptune in 1846. Fitting, because this chart is about what's ahead. Pisces rising meets people gentle and open; the Aquarius Sun is inventive and independent. You're an idealist with imagination, kind to everyone and attached to very few rules. The cost is the ground. Big dreams need small steps, and neither sign loves the small steps.",
    short: ["visionary", "compassionate", "unconventional"],
    watch: "living in the future and missing this week.",
  },
  "SUN_ASC:Cancer|Gemini": {
    hook: "You keep the conversation light until you trust someone, and then you tell them everything.",
    text: "Gemini rising makes you chatty, curious and easy to meet. Behind it is a Cancer Sun that feels deeply and remembers everything. People think they know you after one talk and find out much later how much was underneath. You're a good listener with a quick tongue, comforting and funny at once. The cost is that feelings can hide behind conversation, and the people you love can miss what you need.",
    short: ["warm", "witty", "sensitive"],
    watch: "changing the subject when it's your turn to share.",
  },
  "SUN_ASC:Cancer|Libra": {
    hook: "Your house is where everyone ends up after the party.",
    text: "Libra rising gives you grace and good manners, and people find you easy and pleasant. The Cancer Sun behind it is tender, protective and devoted to family, blood or chosen. Together you make relationships the center of your life, and you're good at them: thoughtful, fair, generous. The cost is conflict. Libra avoids it and Cancer is hurt by it, so the important argument can go unspoken for years.",
    short: ["gracious", "nurturing", "devoted"],
    watch: "letting resentment build where a conversation should be.",
  },
  "SUN_ASC:Cancer|Aquarius": {
    hook: "You look independent. You'd quietly do anything for your people.",
    text: "Aquarius rising comes across cool, friendly and self sufficient. Underneath, your Cancer Sun is warm, sensitive and deeply attached. People can mistake your poise for distance, until they need help and you're the first one there. You care for groups and causes as fiercely as for family. The cost is the gap between the cool front and the tender center: you can feel unseen even by friends.",
    short: ["loyal", "independent", "caring"],
    watch: "acting fine while waiting for someone to notice you're not.",
  },
  "SUN_ASC:Scorpio|Gemini": {
    hook: "You're the funniest person at the table, and you're also reading everyone at it.",
    text: "Gemini rising makes you light, quick and talkative, the sort of person people warm to instantly. Your Scorpio Sun is anything but light: deep, private and very observant. So the jokes come with a second channel running underneath, noting who laughed and who didn't. You're excellent at research, writing and any job that needs both charm and depth. The cost is trust. You let people see the surface easily and the center rarely.",
    short: ["witty", "perceptive", "private"],
    watch: "using humor as a locked door.",
  },
  "SUN_ASC:Scorpio|Libra": {
    hook: "You make it look effortless and keep the effort to yourself.",
    text: "Libra rising is polished and gracious, someone who makes people feel welcome. The Scorpio Sun behind it is passionate, perceptive and loyal for life. You can charm a room and read it at the same time. In love you're romantic and all in. The cost is the gap between the pleasant front and the strong feelings behind it: when something's wrong, you may smile through it until it erupts.",
    short: ["charming", "intense", "loyal"],
    watch: "smiling through something until you can't.",
  },
  "SUN_ASC:Scorpio|Aquarius": {
    hook: "You can't be pushed, only persuaded, and you'll want evidence.",
    text: "Aquarius rising makes a cool, independent first impression: friendly but not easily known. Your Scorpio Sun is intense, passionate and private. Two fixed signs, so you're the steadiest person in a crisis and the most immovable in an argument. You think for yourself and feel things all the way down, and people find you fascinating and a little hard to reach. The cost is isolation. Being strong and self sufficient can turn into a habit of never asking.",
    short: ["independent", "intense", "steadfast"],
    watch: "never asking for help.",
  },
  "SUN_ASC:Pisces|Gemini": {
    hook: "You can talk to anyone about anything, and feel everything while you do it.",
    text: "Gemini rising is the quick, chatty face, and people expect someone breezy. Your Pisces Sun is sensitive, imaginative and feels everything. Both signs are changeable, so you adapt to people easily and pick up whatever they're carrying. You're a natural storyteller and a comforting friend. The cost is scattered energy. With so much coming in, it's hard to choose one direction and stay with it.",
    short: ["imaginative", "sociable", "sensitive"],
    watch: "spreading yourself thin to keep everyone happy.",
  },
  "SUN_ASC:Pisces|Libra": {
    hook: "You fall in love with places, songs and people with equal sincerity.",
    text: "Libra rising makes you graceful and easy to like, with an eye for beauty. The Pisces Sun behind it is a romantic and an artist. Together you have fine taste and a soft heart, and people feel loved around you without quite knowing why. The cost is decisions: Libra weighs everyone's feelings and Pisces feels them, so choosing what you want can take a while.",
    short: ["romantic", "gracious", "artistic"],
    watch: "waiting for everyone to agree before you choose.",
  },
  "SUN_ASC:Pisces|Aquarius": {
    hook: "You're a dreamer who prefers group projects.",
    text: "Aquarius rising comes across friendly, original and a little detached. Underneath, your Pisces Sun is compassionate, intuitive and imaginative. You care about people in general and in particular, and you have ideas about making things kinder. It's a humanitarian's chart: art for a cause, help with a vision. The cost is grounding. You can float between your ideals and your feelings and lose the practical next step.",
    short: ["compassionate", "visionary", "kind"],
    watch: "skipping the practical next step.",
  },

  // Aspects A1, the inner circle (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-01-inner-circle.md
  "SUN|conjunction|MERCURY": {
    hook: "You don't have thoughts about yourself. You are your thoughts, out loud, in real time.",
    text: "Mercury never strays far from the Sun, so this pairing is common, but yours is a true meeting: who you are and how you think arrive together. You talk the way you are, and people learn your whole personality from one conversation. Lilly would check how close. Within about eight and a half degrees he called Mercury combust, outshone by the Sun, and modern astrologers read that as a mind so tied to your identity that disagreeing with your ideas feels like disagreeing with you. Within a quarter of a degree he called it cazimi, in the heart of the Sun, and counted it a strength.\n\nEither way, your words carry conviction, and your opinions sound like facts because to you they feel like facts.",
    short: ["articulate", "self assured", "quick"],
    watch: "hearing criticism of an idea as criticism of you.",
  },
  "SUN|conjunction|VENUS": {
    hook: "You make things nicer just by turning up, and people notice the difference when you leave.",
    text: "Venus stays close to the Sun, never more than about 47 degrees away, and in your chart she sits right on top of it. Your sense of self and your sense of beauty are the same thing. You care how a room looks, how a meal tastes, how people feel around you, and that care is part of who you are, not a skill you picked up. Lilly's Venus at her best makes people pleasant, cheerful and well dressed, with an eye for art. That's you at your best too. Charm comes easily, and so does being liked. The harder part is being disliked: you can shape yourself around keeping things pleasant and lose some of your own edges doing it.",
    short: ["charming", "artistic", "warm"],
    watch: "smoothing over a disagreement that needed to happen.",
  },
  "MERCURY|conjunction|VENUS": {
    hook: "You can say the hard thing so gracefully that people thank you for it.",
    text: "Your mind and your taste work as one. Words come out well chosen, and you have an ear for what sounds right: a good sentence, a good song, a good joke at the right moment. Lilly gave Venus the poetic and Mercury the eloquent, and together they make a writer, a diplomat or simply the friend who always knows what to put in the card. You probably think in images and phrases, and you notice clumsy wording the way some people notice a crooked picture frame. The risk is choosing the pleasant version of the truth over the plain one.",
    short: ["eloquent", "tactful", "artistic"],
    watch: "saying what's nice when what's true would help more.",
  },
  "SUN|conjunction|MARS": {
    hook: "You start things. Usually before anyone has finished explaining why you shouldn't.",
    text: "Mars sitting on your Sun puts drive straight into your identity. You feel most like yourself when you're doing something hard, winning something or fixing something with your own hands. Lilly's strong Mars is valiant, courageous and open in speech, and you probably recognize all three, along with a temper that flares fast and burns out faster. People find you energizing or exhausting, sometimes in the same afternoon. The Sun is the stronger planet here, so your will usually steers your fire instead of the other way around. Mostly.",
    short: ["brave", "direct", "energetic"],
    watch: "treating every disagreement like a contest you have to win.",
  },
  "MERCURY|conjunction|MARS": {
    hook: "You argue for sport, and you're very good at the sport.",
    text: "Your mind runs hot and fast. Ideas come out sharp, sometimes sharper than you meant, and you can win a debate before the other person has found their footing. That makes you a natural critic, editor, lawyer or troubleshooter: anyone whose job is to find the weak point and say so. Lilly's Mercury is sharp witted and Mars is open in speech, and the two together don't do small talk. You think best under pressure, decide quickly and say what you mean. The cost is collateral damage. A sentence can land like a punch when you only meant to make a point.",
    short: ["quick witted", "decisive", "outspoken"],
    watch: "winning the argument and losing the room.",
  },
  "VENUS|conjunction|MARS": {
    hook: "Lilly said Mars has only one friend among the planets, Venus, and that she doesn't love him back. In your chart they share a room anyway.",
    text: "Attraction and drive work as one in you. You go after what you want, in love and in everything else, and you want things in a warm, physical, wholehearted way. Desire is a big part of your life, and you're honest about it. Creative work with real heat in it suits you, the kind where beauty and effort meet: dance, sport, music, cooking for a crowd. The old tension still shows. Venus wants harmony and Mars wants to win, and in relationships you can be tender and fierce in a single evening. Most of your partners find that more exciting than alarming.",
    short: ["passionate", "magnetic", "creative"],
    watch: "turning a romance into a contest.",
  },

  // Aspects A2, Sun and Moon (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-02-sun-and-moon.md
  "SUN|conjunction|MOON": {
    hook: "You were born at the new Moon, and you have a new Moon's habit: you'd rather begin than review.",
    text: "When the Sun and Moon meet, the Moon goes dark, and what you want and what you need point the same way. That makes you unusually single minded. You don't argue with yourself much; you decide and go. Lilly noticed that a Moon under the Sun's beams keeps a person's manners less on display, and you may know the feeling: people take a while to read you, because there's no inner tug of war showing on your face. The strength is focus. The limit is perspective, since you can find it hard to imagine wanting anything other than what you want.",
    short: ["focused", "self contained", "driven"],
    watch: "assuming everyone else wants what you want.",
  },
  "SUN|sextile|MOON": {
    hook: "Your head and your heart mostly agree, and when they don't, they're polite about it.",
    text: "A sextile is a friendly, easy angle, and between the Sun and Moon it means what you want and what you need are on speaking terms. You can usually tell what would make you happy, and you can usually go and get it without a war inside. People find you easy to be around because you're easy to be inside of. The catch with an easy aspect is that it waits for you to use it: the cooperation is there, but nothing forces it. Pick what you want, then let the part of you that knows what you need help you get there.",
    short: ["balanced", "approachable", "steady"],
    watch: "coasting on the ease instead of building on it.",
  },
  "SUN|square|MOON": {
    hook: "You were born at a quarter Moon, half lit, and some days you feel exactly like that.",
    text: "The Sun and Moon at right angles means what you want and what you need pull in different directions. Your ambitions say go; your feelings say stay. Or the other way around. It can feel like being two people sharing a lease. That friction is also your engine. You get things done because you're never quite settled, and you understand inner conflict in other people because you live with it. You might spend your twenties choosing one side and your forties learning to give both a vote. The second way works better.",
    short: ["driven", "restless", "self aware"],
    watch: "ignoring a need until it overrules the plan.",
  },
  "SUN|trine|MOON": {
    hook: "You like yourself, mostly, and it shows.",
    text: "A trine is the easiest aspect there is, and between the Sun and Moon it means your goals and your needs grew up in the same house. What you want tends to be good for you, and what feels right tends to work out. People find you calm and comfortable, and you tend to give yourself the benefit of the doubt. The risk is the comfort itself. With so little inner friction, you might settle for good when great was one push away.",
    short: ["content", "emotionally steady", "easygoing"],
    watch: "choosing comfortable over growing.",
  },
  "SUN|opposition|MOON": {
    hook: "You were born at the full Moon, the brightest night of the month, and you see both sides of almost everything.",
    text: "At the full Moon the Sun and Moon stand on opposite sides of the sky, and the Moon is lit all the way. In your chart, what you want and what you need face each other across the room. That makes you naturally fair, because you can always see the other point of view, often because it's already inside you. Relationships matter a great deal: you tend to meet the other half of yourself in partners and close friends. The strain is balance. You can swing between your own goals and other people's needs, and full of light as you are, it can be hard to rest.",
    short: ["perceptive", "fair", "relationship focused"],
    watch: "waiting for someone else to settle your inner argument.",
  },

  // Aspects A3, Moon with Jupiter and Saturn (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-03-moon-jupiter-saturn.md
  "MOON|conjunction|JUPITER": {
    hook: "Your feelings come in one size: generous.",
    text: "Jupiter on your Moon makes your emotional life big, warm and optimistic. You comfort people easily, you feed them, you take them in, and they come away feeling better than they arrived. Lilly's Jupiter is the greater fortune: magnanimous, affable, indulgent to family, and your Moon wears every one of those. Cancer, the Moon's own sign, is where Jupiter is exalted, and this conjunction carries some of that feeling of home. The excess is the tradeoff. Too much food, too many promises, too much faith in someone who hasn't earned it yet. Your heart doesn't do portion control.",
    short: ["generous", "optimistic", "nurturing"],
    watch: "saying yes to everyone because no feels unkind.",
  },
  "MOON|sextile|JUPITER": {
    hook: "Things tend to work out for you emotionally, and you're quick to notice the openings.",
    text: "The Moon and Jupiter in an easy sextile give you a light, hopeful temperament. You bounce back from disappointment faster than most, and you make friends without trying, because people feel welcome around you. Opportunities often come through people who simply like you. A sextile is quiet, though. The luck is there, but it shows up as a door slightly open, not a red carpet, and you still have to walk through.",
    short: ["hopeful", "friendly", "resilient"],
    watch: "waiting for a lucky break instead of making the call.",
  },
  "MOON|square|JUPITER": {
    hook: "You want more: more feeling, more comfort, more of whatever's good. Some days \"enough\" is a moving target.",
    text: "Jupiter squares your Moon, and the planet of more pushes on the part of you that just wants to feel okay. That makes you warm and big hearted, quick to give, quick to promise, quick to believe the best of people. It also makes you prone to overdoing it: the second dessert, the extra commitment, the trip you can't quite afford because it would feel so good. Lilly warned that a badly placed Jupiter lets everyone cheat him, and you may know the feeling of being too generous with the wrong person. The square isn't a flaw. It's a big heart that needs a budget.",
    short: ["big hearted", "enthusiastic", "generous"],
    watch: "overpromising, then feeling guilty when you can't deliver.",
  },
  "MOON|trine|JUPITER": {
    hook: "You have a gift for feeling good, and it rubs off on people.",
    text: "Your emotional optimism is mostly earned: you tend to land on your feet, and you trust that you will. People find you comforting and fun, the friend who can make a bad day feel survivable. You're generous without keeping score. Since things come so easily, the risk is taking it for granted, coasting on good luck and good humor when a little discipline would turn them into something lasting.",
    short: ["cheerful", "generous", "lucky"],
    watch: "letting good fortune replace effort.",
  },
  "MOON|opposition|JUPITER": {
    hook: "You give with your whole heart, and then you wonder why nobody gave back as much.",
    text: "With Jupiter opposite your Moon, other people often seem to hold the key to your happiness. You're drawn to big personalities, big promises and big ideas, and you tend to alternate: overgiving, then expecting a lot in return. When it works, you're a warm, encouraging presence who believes in people, sometimes before they believe in themselves. When it doesn't, you feel let down by people who never knew what you were hoping for. Say what you need out loud. It helps more than you think.",
    short: ["generous", "idealistic", "warm"],
    watch: "expecting others to read your mind.",
  },
  "MOON|conjunction|SATURN": {
    hook: "You learned to take care of yourself early, and you do it well. Letting someone else do it is the hard part.",
    text: "Saturn on your Moon puts structure around your feelings. You're steady, responsible and calm under pressure, and people trust you in a crisis because you don't panic. Lilly's well placed Saturn is reserved in words, patient and careful, and you probably recognize all three. The Moon is weakest in Capricorn, Saturn's sign, and this conjunction has some of that flavor: needs get handled efficiently instead of felt. You may have grown up fast. The softness is still in there, just behind a very good lock.",
    short: ["dependable", "self reliant", "steady"],
    watch: "acting fine when you're actually lonely.",
  },
  "MOON|sextile|SATURN": {
    hook: "You're calm in a way that makes other people calmer.",
    text: "The Moon and Saturn in a friendly sextile give your feelings a sensible backbone. You can feel something deeply and still make a practical decision about it. People come to you for grounded advice, and you're loyal for the long haul. Commitment doesn't scare you; it reassures you. Your emotional life gets better with age, as experience gives you more to trust. The quiet risk is caution winning too often, choosing safe over happy because safe is easier to plan for.",
    short: ["grounded", "loyal", "sensible"],
    watch: "turning down joy because it doesn't come with a guarantee.",
  },
  "MOON|square|SATURN": {
    hook: "You carry your feelings like a responsibility: carefully, and mostly alone.",
    text: "With Saturn squaring your Moon, emotional life can feel like hard work. You may have felt early on that your needs were too much, or that love had to be earned, and you learned to need less and do more. That makes you capable, disciplined and tough, the kind of person who keeps going when others quit. It can also make you hard on yourself and slow to ask for comfort. The good news is that Saturn rewards time. The warmth you build on purpose tends to be the kind that lasts.",
    short: ["resilient", "responsible", "deep"],
    watch: "deciding your needs don't count before anyone else has a say.",
  },
  "MOON|trine|SATURN": {
    hook: "You're emotionally sturdy, and people can tell. You're the one they lean on.",
    text: "Saturn's trine gives you patience with your own feelings and other people's. You don't rush, you don't dramatize, and you finish what you start. Lilly's Saturn at its best is patient in labor and careful, and with the Moon that becomes a quiet, reliable kind of care: the friend who shows up every week, not just in emergencies. Your love is built to last. The risk is seriousness. You might forget that it's fine to have fun before the work is done.",
    short: ["steady", "patient", "reliable"],
    watch: "saving joy for later, then forgetting to schedule it.",
  },
  "MOON|opposition|SATURN": {
    hook: "You want closeness and you want safety, and for a long time they seemed like opposite things.",
    text: "Saturn sits opposite your Moon, and warmth and limits tend to arrive through other people: a parent who was strict or busy, a partner who's steady but reserved, a boss who withholds praise. You can find yourself playing the responsible one or waiting for someone else to give permission to feel. Over time you learn to be your own steady adult, and then the relationships ease up. You're fiercely loyal, and you don't make promises you won't keep.",
    short: ["loyal", "serious", "protective"],
    watch: "waiting for permission to need something.",
  },

  // Aspects A4, Moon with Mercury, Venus and Mars (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-04-moon-personal.md
  "MOON|conjunction|MERCURY": {
    hook: "You think with your feelings and feel with your thoughts, and you can explain both, at length.",
    text: "Lilly called the Moon and Mercury together the mark of ingenious people, and the conjunction is the purest version: your mind and your mood move as one. You read people quickly, you remember how every conversation felt, and you put emotions into words better than most. Your thinking changes with your mood, which keeps you responsive and curious, and sometimes means Tuesday's opinion is gone by Thursday. Writing, teaching, counseling and any work that turns feelings into language suits you.",
    short: ["perceptive", "articulate", "curious"],
    watch: "talking through a feeling so fast you never actually feel it.",
  },
  "MOON|sextile|MERCURY": {
    hook: "You're easy to talk to, and you're good at saying what everyone else was thinking.",
    text: "Lilly ranked the Moon and Mercury in sextile above the trine for a good mind, and it shows in you as a light, flexible intelligence that keeps your feelings company instead of fighting them. You notice moods, you find the right words and you can change a tense conversation with one well timed line. You learn by talking and listening. The skill is real but quiet: use it on purpose, and it becomes a talent for writing, teaching or bringing people round.",
    short: ["quick", "friendly", "perceptive"],
    watch: "keeping things light when a conversation needs to go deeper.",
  },
  "MOON|square|MERCURY": {
    hook: "Your thoughts and your feelings talk over each other, and sometimes they're both right.",
    text: "You can know something logically and feel the opposite, both at full volume. Lilly read this square, in strong places, as a stubborn, restless wit, and you may recognize the restless part: a mind that won't switch off when you're upset, an argument you rerun at 2 a.m. The upside is sharpness. You notice contradictions everyone else misses, including your own, and you make a formidable debater. Give your feelings a minute before you give them a verdict.",
    short: ["sharp", "expressive", "restless"],
    watch: "arguing with someone when you're really upset about something else.",
  },
  "MOON|trine|MERCURY": {
    hook: "You can talk about feelings without making anyone uncomfortable, which is rarer than it sounds.",
    text: "Thinking and feeling cooperate easily in you. You understand what you feel, you can say it plainly, and you remember the people and places that mattered. Lilly counted the Moon and Mercury in trine among the good wits, and yours is a practical, people smart kind: good with names, good with stories, good with the right comforting sentence. Learning comes easily when you care about the subject. The only trap is ease itself. You can explain a feeling so neatly that you skip doing anything about it.",
    short: ["articulate", "empathetic", "quick to learn"],
    watch: "explaining a feeling instead of acting on it.",
  },
  "MOON|opposition|MERCURY": {
    hook: "You see every side of a feeling, and then you see a few more.",
    text: "Mercury opposite your Moon means you often find out what you think by talking to someone else, and what you feel by hearing them answer. That makes you a natural listener and a good mediator, because you hold two views at once without needing one to lose. The strain is indecision and a mind that keeps the debate going long after it should close. Some choices only feel right after you've made them.",
    short: ["thoughtful", "communicative", "fair minded"],
    watch: "asking everyone's opinion and trusting none of them, including yours.",
  },
  "MOON|conjunction|VENUS": {
    hook: "You make people feel at home, and you make home feel like something worth coming back to.",
    text: "Lilly lists Venus among the Moon's friends, and here they sit together: your feelings and your sense of beauty and affection are one. You're gentle, warm and tuned to comfort, the soft blanket, the right music, the kind word. People relax around you. Love matters enormously, and you show it through care and small pleasures. The risk is avoiding anything unpleasant, including the honest conversation that would make a relationship stronger.",
    short: ["affectionate", "gentle", "charming"],
    watch: "keeping the peace at the cost of the truth.",
  },
  "MOON|sextile|VENUS": {
    hook: "You have a knack for making ordinary days pleasant, for yourself and everyone around you.",
    text: "The Moon and her friend Venus in a friendly sextile give you easy warmth and good taste. You make friends without effort, you remember what people like, and you can turn a dull afternoon into a nice one with very little. Your relationships tend to be kind. Like every sextile, it rewards use: the more you put your charm to work, in hosting, art or simply reaching out, the more it gives back.",
    short: ["warm", "sociable", "tasteful"],
    watch: "waiting to be invited when you could do the inviting.",
  },
  "MOON|square|VENUS": {
    hook: "What comforts you and what you love aren't always the same thing, and you've noticed.",
    text: "Venus squares your Moon. You might want romance and then feel unsettled by it, or crave comfort and then feel bored once you have it. That tension makes you affectionate, romantic and very sensitive to atmosphere, and it can lead to indulging a mood with food, shopping or a relationship that feels good more than it does good. It also gives you real artistic feeling, because you know longing from the inside. Ask what you need before you reach for what you want.",
    short: ["romantic", "sensitive", "artistic"],
    watch: "treating a bad mood with a treat instead of an answer.",
  },
  "MOON|trine|VENUS": {
    hook: "You're easy to love, and you make loving look easy.",
    text: "The Moon and Venus are friends in Lilly's scheme, and in an easy trine they give you a natural grace with people. You're affectionate, kind and pleasant to be around, and your relationships tend to run more smoothly than most. You have good taste and a gift for comfort, and your home is probably a nice place to be. The only snag with this much charm is that you might never have to learn to handle conflict, until one day you do.",
    short: ["affectionate", "graceful", "kind"],
    watch: "smoothing over problems instead of solving them.",
  },
  "MOON|opposition|VENUS": {
    hook: "You look for love outside yourself, and you usually find it.",
    text: "Affection, beauty and approval often seem to come from other people, with Venus opposite your Moon. You're warm, attractive and attentive, and you notice what partners want. The tug is between your own needs and keeping others happy, and you can tip into pleasing people more than knowing what you want. Relationships teach you a lot. The best ones are with people who ask what you need, and wait for the answer.",
    short: ["charming", "devoted", "sensitive"],
    watch: "losing track of your own wants inside a relationship.",
  },
  "MOON|conjunction|MARS": {
    hook: "You feel things fast and hot, and you act on them before most people have finished noticing them.",
    text: "Mars on your Moon puts heat straight into your feelings. You're brave, protective and direct, quick to defend the people you love and quick to anger when you feel slighted. Lilly says the other planets hate Mars, the Moon among them, and the pairing does have friction: your emotions want comfort and your drive wants action. In you they become courage. You do something about what you feel. The flare passes quickly, but the words said during it don't always.",
    short: ["passionate", "protective", "courageous"],
    watch: "reacting before you know what you actually feel.",
  },
  "MOON|sextile|MARS": {
    hook: "You have just enough fire to get things done and just enough feeling to care who gets hurt.",
    text: "The Moon and Mars in an easy sextile give your emotions energy without too much heat. You stand up for yourself without starting wars, you act on your feelings in useful ways, and you bounce back from setbacks. People find you warm and spirited. The sextile is an opening, not a guarantee, so the drive is there when you call on it. Exercise, work you care about or a cause will put it to good use.",
    short: ["spirited", "brave", "resilient"],
    watch: "letting the energy go flat for lack of a goal.",
  },
  "MOON|square|MARS": {
    hook: "You go from calm to furious and back again in the time it takes someone else to notice anything happened.",
    text: "Emotions turn into action fast in you, sometimes faster than is wise. Lilly's Mars is impatient of injuries or affronts, and your Moon feels every one of them. You're protective, energetic and honest about how you feel, and you can be a fierce ally. You can also pick fights with the people closest to you when you're tired or hurt. Give the anger a job: a hard workout, a problem to fix, a wrong to set right.",
    short: ["energetic", "protective", "intense"],
    watch: "turning hurt into anger because anger feels safer.",
  },
  "MOON|trine|MARS": {
    hook: "You turn feelings into action, and it usually works.",
    text: "Emotional courage comes naturally to you. You know what you want, you go after it, and you don't stew. You stand up for others naturally and you're good in a crisis, because acting calms you down. People find you lively and reassuring at once. Things come easily enough that you may not notice when someone needs gentleness more than a solution.",
    short: ["courageous", "active", "warm"],
    watch: "fixing a problem when someone only wanted to be heard.",
  },
  "MOON|opposition|MARS": {
    hook: "You keep running into strong people, and you keep finding out how strong you are.",
    text: "Mars opposite your Moon means conflict often seems to start with someone else: the partner who pushes, the boss who provokes, the friend who takes offense. You're sensitive to anger in others, and you can swing between giving in and fighting back. Over time, the work is owning your own fire instead of waiting for someone else to light it. When you do, you're a formidable protector of everyone you love.",
    short: ["spirited", "protective", "reactive"],
    watch: "reacting to someone's mood instead of naming your own.",
  },

  // Aspects A5, Sun with Jupiter and Saturn (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-05-sun-jupiter-saturn.md
  "SUN|conjunction|JUPITER": {
    hook: "You walk into a room like you were expected, and somehow you usually were.",
    text: "Jupiter on your Sun is the greater fortune sitting on the planet of the self, and Lilly counted the two as friends. You come across confident, generous and lucky, and you aim high in an honorable way: big plans, big heart, big laugh. People want you on their side. You're also the one who hands out the good luck once it arrives, quick to share credit and cover the check. The only risk is too much of a good thing: overconfidence, overcommitment, a belief that it'll all work out that skips the part where you make it work out.",
    short: ["confident", "generous", "optimistic"],
    watch: "promising more than any one person could deliver.",
  },
  "SUN|sextile|JUPITER": {
    hook: "Doors open for you, and you can tell which ones are worth it.",
    text: "Jupiter's easy sextile to your Sun gives you a hopeful, open nature and a knack for being in the right place. Mentors like you, strangers trust you, and opportunities tend to come through people you were kind to years ago. Your optimism is practical: you expect things to work out and you put in enough effort to help them along. Use it on purpose, and it compounds.",
    short: ["hopeful", "likable", "well connected"],
    watch: "letting a good opportunity pass because another one always comes.",
  },
  "SUN|square|JUPITER": {
    hook: "A good life isn't enough for you. You want a great one, and preferably by Friday.",
    text: "Jupiter squaring your Sun gives your ambitions a restless, outsized quality. You think big, act on hunches and believe in yourself, sometimes more than the facts would. That confidence carries you into opportunities that more cautious people miss. It can also carry you past your limits: the extra commitment, the risky bet, the grand plan announced before the details exist. Lilly's Jupiter at his weakest wastes what he's been given. At your best, you grow into the size of your promises.",
    short: ["ambitious", "generous", "bold"],
    watch: "overreaching and calling it faith.",
  },
  "SUN|trine|JUPITER": {
    hook: "Things tend to go your way, and you're gracious about it.",
    text: "The Sun and its friend Jupiter in an easy trine give you natural confidence, warmth and a generous outlook. You're the kind of person others feel lucky to know. They share the fire triplicity in the old books, and it shows as enthusiasm that lifts a room. Good things often come easily: help when you need it, a second chance, the right person at the right time. The only risk is coasting, since a life this pleasant doesn't force you to push.",
    short: ["warm", "fortunate", "big hearted"],
    watch: "settling for easy when great was within reach.",
  },
  "SUN|opposition|JUPITER": {
    hook: "Other people believe in you, sometimes more than you do, and it's worth listening.",
    text: "Jupiter opposite your Sun puts growth and good fortune on the far side of the room, often in the form of other people: a generous partner, a mentor who opens doors, a friend whose confidence rubs off. You're drawn to larger than life personalities. The tug is between your own goals and the bigger world others offer, and you can swing toward overpromising to keep up. Decide what you're after, then let the generous people help you get it.",
    short: ["generous", "sociable", "aspiring"],
    watch: "borrowing someone else's dream because it's bigger than yours.",
  },
  "SUN|conjunction|SATURN": {
    hook: "You were born serious. It took you a while to discover you're also funny.",
    text: "Saturn sitting on your Sun puts weight on who you are. You take responsibility early, you work hard, and you don't expect anything to be handed to you, often because it wasn't. Lilly's well placed Saturn is patient in labor and careful, and you have both in abundance. Confidence comes slowly and then stays. Your best years may arrive later than other people's, and they tend to last. Lighten up where you can; your standards will survive.",
    short: ["disciplined", "responsible", "enduring"],
    watch: "waiting to enjoy life until you've earned it.",
  },
  "SUN|sextile|SATURN": {
    hook: "You're ambitious in a sensible way, and it pays off steadily.",
    text: "Saturn's friendly sextile gives your sense of self a spine. You plan, you follow through, and older or more experienced people tend to trust you early. Discipline feels natural to you instead of punishing. You build your life one sound decision at a time, and the results last. The opening is there to use: pick the long project, and you'll likely finish it.",
    short: ["reliable", "practical", "patient"],
    watch: "choosing the safe option every single time.",
  },
  "SUN|square|SATURN": {
    hook: "You've been told no more than most people. You heard it as \"not yet.\"",
    text: "Saturn squaring your Sun can feel like a constant headwind: obstacles, delays, a demanding parent or boss, a voice in your head asking whether you've done enough. Lilly treated Saturn and the Sun as no friends to each other, and this square has that friction. It also builds a remarkable kind of strength. You learn to work hard, to prepare, to keep going when it's hard. Success comes slower and means more. Go easy on yourself along the way; the critic isn't always right.",
    short: ["determined", "hardworking", "resilient"],
    watch: "measuring your worth only by what you've achieved.",
  },
  "SUN|trine|SATURN": {
    hook: "You make steady progress look easy. It isn't. You're just good at it.",
    text: "Saturn's trine gives you patience, structure and a sense of timing. You can commit to a long goal and keep at it without drama, and people trust you with responsibility because you handle it well. Your confidence grows with experience, so you often get better with age. The risk is caution: with such a good sense of what's realistic, you may never test what's possible.",
    short: ["steady", "wise", "dependable"],
    watch: "letting realistic talk you out of ambitious.",
  },
  "SUN|opposition|SATURN": {
    hook: "You've met your share of walls. Most of them taught you something.",
    text: "Saturn faces your Sun from across the chart, and limits and authority tend to show up in other people: a strict parent, a tough boss, a partner who's older or more serious, a world that seems to demand proof before it lets you in. You can feel judged, or slip into judging yourself. Over time, you become the authority you once had to answer to, and usually a fairer one. Your relationships improve when you stop handing other people the job of telling you you're good enough.",
    short: ["serious", "persistent", "fair"],
    watch: "looking to others for permission you can give yourself.",
  },

  // Aspects A6, Sun with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-06-sun-outer.md
  "SUN|conjunction|URANUS": {
    hook: "You were never going to do it the normal way. You might not even know what the normal way is.",
    text: "Uranus, the chart's break in the pattern, sits right on your Sun. Your identity is built on independence: you need to be yourself, loudly or quietly, and conventions you didn't choose don't hold you long. People see you as original, sometimes eccentric, often ahead of the curve. You change direction suddenly and you're usually right to. The cost is restlessness and a hard time with anything that feels like a cage, including commitments you actually want.",
    short: ["original", "independent", "inventive"],
    watch: "rebelling against things just because someone expected you to accept them.",
  },
  "SUN|sextile|URANUS": {
    hook: "You're the right amount of different: unusual enough to be interesting, sensible enough to be trusted.",
    text: "With Uranus sextile your Sun, you get a fresh way of seeing things and the practical sense to use it. You're quick to spot a better method, open to new technology and new people, and comfortable with change. Your originality is an asset, not a disruption. Like any sextile, it waits for you to act: share the idea, try the new thing, and it usually pays off.",
    short: ["inventive", "open minded", "adaptable"],
    watch: "keeping your best ideas to yourself.",
  },
  "SUN|square|URANUS": {
    hook: "Every few years you burn your life down a little and rebuild it better. Friends have learned to expect it.",
    text: "Uranus squaring your Sun pushes against anything settled. You need freedom and you need change, and when life gets too fixed you shake it, sometimes on purpose, sometimes by surprise. That makes you brave about reinvention and allergic to authority that hasn't earned it. It can also make you abrupt: quitting the job, ending the relationship, moving cities, before trying the smaller fix. Your breakthroughs are real. So are the bridges.",
    short: ["independent", "bold", "unpredictable"],
    watch: "changing everything when one thing would do.",
  },
  "SUN|trine|URANUS": {
    hook: "You change easily, and you make change look like a good idea.",
    text: "Uranus trines your Sun, so your originality arrives in a form that doesn't frighten anyone. You're curious, quick to adapt and comfortable being a little different. New ideas, gadgets, places and people suit you, and you often find a smarter way to do ordinary things. Luck seems to arrive in sudden ways. With this much ease, you might not push your originality as far as it could go.",
    short: ["original", "adaptable", "lucky"],
    watch: "staying clever when you could be groundbreaking.",
  },
  "SUN|opposition|URANUS": {
    hook: "You keep meeting people who shake up your life. Eventually you notice you invite them.",
    text: "Across the chart from your Sun, Uranus brings surprise and independence through other people: unpredictable partners, sudden changes, people who refuse your plans. You may feel pulled between wanting stability and wanting freedom, and the freedom often shows up through someone else. Over time you learn to claim your own independence instead of waiting for someone to force it. Then your relationships get more interesting and less chaotic.",
    short: ["independent", "unconventional", "alert"],
    watch: "blaming others for disruptions you secretly wanted.",
  },
  "SUN|conjunction|NEPTUNE": {
    hook: "You're a little hard to photograph. People say you look different in every picture, and they're right.",
    text: "Neptune, the chart's dissolving edge, sits on your Sun. Your identity is soft at the edges: imaginative, compassionate, tuned to music, art and other people's feelings. You can become what a room needs, which makes you a gifted artist, healer or performer. The same gift can make it hard to say who you are when no one's watching. Others project their dreams onto you. Find work and people that honor the dreamer and give you solid ground.",
    short: ["imaginative", "compassionate", "artistic"],
    watch: "losing yourself in someone else's idea of you.",
  },
  "SUN|sextile|NEPTUNE": {
    hook: "You've got a gentle imagination, and you know how to put it to use.",
    text: "Neptune and your Sun share a light sextile, so creativity, intuition and kindness come without too much fog. You notice moods, you feel for people and you can turn feelings into art, care or vision. Others find you soothing. It's an opening, not a push, so the gift grows when you practice: write it, paint it, play it, volunteer it.",
    short: ["intuitive", "creative", "kind"],
    watch: "leaving the dream as a daydream.",
  },
  "SUN|square|NEPTUNE": {
    hook: "You can see the best version of everything, which is lovely, and occasionally expensive.",
    text: "Neptune squaring your Sun blurs the line between who you are and who you hope to be. You're idealistic, imaginative and compassionate, often drawn to art, spirituality or helping people. You can also struggle with direction: unsure what you want, easily swayed, or tempted to escape when life gets harsh. People and plans can turn out to be different from how they looked. The gift is real vision. The work is checking it against the facts before you commit.",
    short: ["idealistic", "artistic", "compassionate"],
    watch: "falling for the potential and missing the reality.",
  },
  "SUN|trine|NEPTUNE": {
    hook: "You have a soft touch, a big imagination and the kind of luck that feels like grace.",
    text: "With Neptune flowing into your Sun by trine, creativity and intuition come naturally. You sense what people need, you're drawn to beauty and meaning, and art, music or service often come easily. People find you inspiring and kind. Things tend to work out in ways that feel almost meant to. Because the gift is so effortless, you may not discipline it, so give it a schedule.",
    short: ["intuitive", "inspired", "gentle"],
    watch: "waiting for inspiration instead of practicing.",
  },
  "SUN|opposition|NEPTUNE": {
    hook: "You've been fooled once or twice, mostly because you wanted to believe. You still do, and that's not all bad.",
    text: "With Neptune facing your Sun, dreams, ideals and confusion tend to arrive through the people you love. You're drawn to artists, rescuers and people who need rescuing. Relationships can feel magical and then disappointing when the fog lifts. You're compassionate and imaginative, and you learn over time to keep your own outline when you love someone. The clearer you are about yourself, the better your dreams turn out.",
    short: ["compassionate", "idealistic", "sensitive"],
    watch: "seeing people as you wish they were.",
  },
  "SUN|conjunction|PLUTO": {
    hook: "You don't do anything halfway, including change. You reinvent yourself completely, more than once.",
    text: "Pluto, the planet of transformation and power, sits on your Sun. You have intensity people feel before you've said anything. You go deep, you hold your ground and you have unusual willpower: when you decide, you're hard to stop. You may have lived through something early that changed you, and you've come back stronger each time. The shadow is control. Not everything needs to be mastered to be safe.",
    short: ["intense", "powerful", "resilient"],
    watch: "trying to control what you could just trust.",
  },
  "SUN|sextile|PLUTO": {
    hook: "You've got quiet power, the kind that gets things done without announcing it.",
    text: "A Pluto sextile adds focus and depth to who you are. You can see what's really going on, you're good in a crisis and you can change your life when you need to without tearing it apart. People trust your judgment on serious matters. Use the opening: you have the strength to take on hard projects, so take them on.",
    short: ["focused", "perceptive", "capable"],
    watch: "holding back power you've already earned.",
  },
  "SUN|square|PLUTO": {
    hook: "You've had to fight for your place, and you know exactly how strong you are because of it.",
    text: "Pluto squaring your Sun brings power struggles: with authority, with circumstances, sometimes with yourself. You may have faced pressure early, and it forged an intense, determined will. You don't give up, and you don't like being controlled. The square also asks you to transform again and again, letting go of old versions of yourself that no longer fit. When you stop fighting for control and start using your power on purpose, you become formidable in the best way.",
    short: ["determined", "intense", "transformative"],
    watch: "turning every disagreement into a battle for control.",
  },
  "SUN|trine|PLUTO": {
    hook: "You have reserves of strength most people never find out they have.",
    text: "Pluto's easy trine to your Sun gives you depth, stamina and a natural sense of power. You can handle intensity without being swallowed by it, and you come through crises changed for the better. People sense that you're capable and trustworthy with serious things. Because the strength comes so naturally, you may not test it often. When you do, you can achieve more than you expect.",
    short: ["resilient", "deep", "capable"],
    watch: "underusing your strength because you rarely need it.",
  },
  "SUN|opposition|PLUTO": {
    hook: "Powerful people find you. So far, you've learned something from each of them.",
    text: "Power and intensity tend to come at you from outside with Pluto opposing your Sun: partners, rivals, bosses and family. You're drawn to strong personalities and to situations that test your will. Relationships can become struggles over who leads. Over time you find your own power, and you stop giving it away or fighting for it. Then you become a steady, magnetic presence who can stand beside anyone as an equal.",
    short: ["magnetic", "perceptive", "resilient"],
    watch: "giving your power away and resenting it later.",
  },

  // Aspects A7, Mars with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-07-mars-outer.md
  "MARS|conjunction|URANUS": {
    hook: "You move first and explain later, and the explanation is usually \"it seemed like a good idea at the time.\" Often it was.",
    text: "Mars is your drive, and Uranus, the break in the pattern, sits right on it. Your energy comes in bursts: sudden decisions, sudden starts, sudden exits. You hate being told how to do something and you work best on your own terms, often with tools or methods nobody else has tried. Under pressure you're quick and inventive. Patience is the weak spot. When something stalls, your instinct is to blow it up and start over.",
    short: ["bold", "inventive", "independent"],
    watch: "quitting right before it would have worked.",
  },
  "MARS|sextile|URANUS": {
    hook: "You're good at the quick fix nobody else thought of.",
    text: "The link between your drive and Uranus is light and useful. You take initiative in fresh ways, you adapt fast when plans change, and you're comfortable trying something new under pressure. Teams like you because you get unstuck quickly. This one only works when you act on it, so take the odd shortcut that occurs to you and see where it goes.",
    short: ["resourceful", "quick", "adaptable"],
    watch: "waiting for permission you don't need.",
  },
  "MARS|square|URANUS": {
    hook: "You don't do slow burns. You do sudden ones.",
    text: "Your drive and Uranus pull at a hard angle, and the result is energy that arrives all at once. You're brave, original and impatient with rules that make no sense, and you'll fight for freedom, yours or anyone's. Lilly's Mars was already impatient of servitude; this square makes that a headline. The risk is acting before you've thought: the snapped reply, the rash move, the risk taken for the thrill of it. Build in a pause. Ten seconds is often enough.",
    short: ["daring", "original", "electric"],
    watch: "blowing things up because waiting felt unbearable.",
  },
  "MARS|trine|URANUS": {
    hook: "When something needs doing in a new way, people tend to look at you.",
    text: "Uranus flows easily into your Mars, so your courage comes with originality attached. You act decisively, you try new methods without fuss and you're good at turning a sudden idea into something real. Change energizes you rather than throwing you. Because it all comes so easily, you might coast on quick wins instead of building something that lasts.",
    short: ["decisive", "inventive", "energized by change"],
    watch: "chasing the next new thing before finishing this one.",
  },
  "MARS|opposition|URANUS": {
    hook: "Somebody is always changing the plan on you. Lately you've started changing it first.",
    text: "Uranus sits across the chart from your Mars, so the unpredictable often comes through other people: partners who bolt, bosses who switch course, rivals who play by different rules. You can feel provoked, then react hard. Eventually the surprise becomes useful instead of something to fight, and you become very good at improvising. Your relationships go better when freedom is built in on both sides.",
    short: ["quick reacting", "independent", "adaptable"],
    watch: "answering every surprise with a fight.",
  },
  "MARS|conjunction|NEPTUNE": {
    hook: "You fight best for things you believe in, and you believe in things most people have given up on.",
    text: "Neptune, the chart's dissolving edge, sits on your Mars, so your drive is mixed with imagination and ideals. You're moved to act by causes, stories and other people's pain more than by plain ambition. Art suits you, as do performance, dance, healing and activism: any work where effort serves a vision. Direct confrontation can feel murky; you may go quiet instead of saying you're angry. Learn to name what you want plainly. Your ideals will still be there.",
    short: ["inspired", "compassionate", "creative"],
    watch: "fighting for everyone except yourself.",
  },
  "MARS|sextile|NEPTUNE": {
    hook: "You put real effort into things you find beautiful, and it shows.",
    text: "Your drive and your imagination work together in a gentle way. You're willing to work hard for art, for a cause or for someone who needs help, and your instincts about people are usually good. You can motivate others by showing them what's possible. The skill is there; it grows when you give it a regular outlet, like a practice, a craft or a volunteer shift.",
    short: ["inspired", "helpful", "intuitive"],
    watch: "saving your energy for a dream you never schedule.",
  },
  "MARS|square|NEPTUNE": {
    hook: "You know exactly what you'd do if the world were fair. Figuring out what to do in this one takes longer.",
    text: "Your drive and Neptune pull against each other. You're idealistic about action: you want your effort to mean something, and ordinary goals can leave you cold. You can be deeply creative and compassionate, and good at work driven by vision. You can also lose steam, doubt your aims or go after something that turns out to be a mirage. When you're angry, it may come out sideways. Pick concrete goals that serve your ideals, and check the facts before you charge.",
    short: ["idealistic", "imaginative", "sensitive"],
    watch: "confusing a feeling of purpose with a plan.",
  },
  "MARS|trine|NEPTUNE": {
    hook: "You have a way of making hard work look graceful.",
    text: "Neptune feeds your Mars through an easy trine. Your effort carries imagination, and your imagination comes with stamina. Dance, music, film, sport with real artistry in it, caring work, causes: you can give a lot to these without burning out on them. You read people's motives well. With this much natural grace, the danger is avoiding the plain, dull parts of a goal.",
    short: ["graceful", "inspired", "generous"],
    watch: "skipping the boring work that makes a dream real.",
  },
  "MARS|opposition|NEPTUNE": {
    hook: "You've been surprised by people more than once, and you're learning to trust your instincts sooner.",
    text: "Neptune opposes your Mars, so what blurs your drive often comes from outside: people whose motives are unclear, partners who drift, situations that look one way and turn out another. You can end up working hard for someone else's dream or doubting your own. The answer is clarity. Say what you want, ask what they want, and you'll find you're compassionate and effective at once.",
    short: ["sensitive", "compassionate", "adaptable"],
    watch: "taking on someone else's fight because you couldn't say no.",
  },
  "MARS|conjunction|PLUTO": {
    hook: "When you decide to do something, you're nearly impossible to stop.",
    text: "Pluto, the planet of transformation and power, sits on your Mars, and your drive runs deep. You have huge stamina, a strong will and the ability to keep going long after others quit. You're intense about the things you want and fierce about the people you protect. You probably hate feeling powerless more than almost anything. Used well, this is the energy of someone who rebuilds companies, careers and lives. The shadow is a need to win at any cost.",
    short: ["determined", "powerful", "relentless"],
    watch: "treating every conflict like a war.",
  },
  "MARS|sextile|PLUTO": {
    hook: "You're the calm one in a crisis, and quietly the most effective.",
    text: "Pluto backs your Mars with a light, steady link. You have concentration and staying power, and you can focus your energy on one hard thing until it's done. People trust you with the tough jobs. You don't need to make noise about your strength. Use this one on purpose: take on the project that would scare other people off.",
    short: ["focused", "resilient", "effective"],
    watch: "underestimating how much you can take on.",
  },
  "MARS|square|PLUTO": {
    hook: "You don't back down. It's both your best quality and the one that gets you into trouble.",
    text: "Your drive and Pluto meet at a hard angle, and the friction produces enormous will. You're intense, competitive and tireless, and you've likely had to fight for things, with people or circumstances that pushed back hard. That makes you formidable. The same grip can hold on too long, or turn small disagreements into tests of strength. Your power is real. The work is choosing which fights deserve it.",
    short: ["intense", "tireless", "strong willed"],
    watch: "fighting for control in battles that don't matter.",
  },
  "MARS|trine|PLUTO": {
    hook: "You have stamina that surprises people, sometimes including you.",
    text: "Pluto lends your Mars an easy depth. Your energy is concentrated and renewable: you can work hard, recover quickly and keep at a goal through setbacks. Under pressure you get calmer and more effective. You're comfortable with intensity and you don't scare easily. Because it all comes naturally, you might not tackle anything big enough to show what you're capable of. Find something worthy of the effort.",
    short: ["resilient", "powerful", "steady under pressure"],
    watch: "playing small with a big engine.",
  },
  "MARS|opposition|PLUTO": {
    hook: "You attract strong people, and sometimes they test you. You usually pass.",
    text: "The big power moves in your life often come from others, with Pluto opposing your Mars: a domineering boss, an intense partner, a rival who won't quit. You can get drawn into contests of will, and you're more than capable of winning them. With practice, you work out when to stand your ground and when the fight isn't worth it. Then your strength becomes something people rely on instead of something they push against.",
    short: ["strong willed", "resilient", "magnetic"],
    watch: "letting someone else's intensity decide your next move.",
  },

  // Aspects A8, Venus with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-08-venus-outer.md
  "VENUS|conjunction|URANUS": {
    hook: "Your love life has never once followed the script, and you wouldn't want it to.",
    text: "Venus and Uranus share a degree in your chart, so what you find beautiful is often what's unusual. Different people attract you, and the spark matters more to you than the fit, at least at first. You need room inside a relationship, and you give room back. Your taste in art, clothes and friends tends to run ahead of the crowd. Attraction can arrive like lightning and leave the same way; the bonds that last are the ones that keep surprising you.",
    short: ["original", "magnetic", "free spirited"],
    watch: "mistaking excitement for compatibility.",
  },
  "VENUS|sextile|URANUS": {
    hook: "You make friends easily with people nobody else quite knows what to do with.",
    text: "Venus and Uranus are on friendly terms here, so your social life has a lively, open quality. You like variety, you enjoy people from very different worlds, and your taste mixes the classic with the new. In love you keep things fresh without making them unstable. The opening rewards a little nerve: say yes to the unexpected invitation.",
    short: ["sociable", "open minded", "fun"],
    watch: "keeping everyone at a friendly distance.",
  },
  "VENUS|square|URANUS": {
    hook: "You fall fast. You also need the door left open.",
    text: "Venus wants closeness and Uranus wants freedom, and in your chart they're at odds. You're attracted to excitement, to people who are a little unpredictable or unavailable, and you can grow restless once things settle. That gives your relationships electricity and an on again, off again rhythm. It also gives you real originality in style and art. The work is building a love that has space in it, so you don't have to leave to breathe.",
    short: ["exciting", "independent", "creative"],
    watch: "ending something good because it got calm.",
  },
  "VENUS|trine|URANUS": {
    hook: "Your relationships have room in them, and that's exactly why they last.",
    text: "Uranus brings an easy sparkle to your Venus. You're friendly, quick to connect and comfortable with people who are nothing like you. Romance tends to arrive in surprising ways and works out better than it should on paper. Your taste is original without being difficult. Because freedom and affection balance so naturally for you, you might not realize how rare that is.",
    short: ["charming", "original", "easygoing"],
    watch: "taking your easy connections for granted.",
  },
  "VENUS|opposition|URANUS": {
    hook: "The people you fall for keep surprising you. Some of the surprises are even good.",
    text: "With Uranus facing your Venus, the unpredictable shows up through partners: people who need their freedom, relationships that start or end suddenly, attractions you didn't see coming. Some days you want closeness, some days space, and sometimes you choose partners who carry the space part for you. As you claim your own independence, love gets steadier and still stays interesting.",
    short: ["magnetic", "independent", "adventurous"],
    watch: "choosing people who can't stay so you never have to.",
  },
  "VENUS|conjunction|NEPTUNE": {
    hook: "You fall in love with the whole story, and you tell it beautifully.",
    text: "Neptune joins your Venus, the planet Lilly called the author of mirth and jollity, and the result is romance with no edges. You're tender, artistic and generous, tuned to music, film, poetry and anyone who's hurting. Love can feel like a spiritual experience. You're also prone to seeing people through a soft focus and missing the flaws until much later. Your gift for beauty is real. Pair it with honest eyes.",
    short: ["romantic", "artistic", "compassionate"],
    watch: "loving who someone could be more than who they are.",
  },
  "VENUS|sextile|NEPTUNE": {
    hook: "You have a gentle eye for beauty and a kind heart to match.",
    text: "The sextile between Venus and Neptune softens your taste and your affections. You like art that moves you, you're kind without trying and people feel understood around you. Romance has a touch of magic in it without losing its footing. Give your creativity a regular outlet and it'll keep growing.",
    short: ["kind", "artistic", "sensitive"],
    watch: "keeping your talent private out of modesty.",
  },
  "VENUS|square|NEPTUNE": {
    hook: "You find the best in anyone. That's a gift and an occasional problem.",
    text: "Neptune squares your Venus, so love and idealism get tangled. You're romantic, compassionate and drawn to people who need something, whether rescue, understanding or inspiration. You may give more than you get, or fall for an image and feel let down by the person behind it. Money can slip away the same way. The upside is huge: real artistic feeling and a capacity for unselfish love. The skill to build is seeing clearly while still loving.",
    short: ["romantic", "generous", "imaginative"],
    watch: "confusing sacrifice with love.",
  },
  "VENUS|trine|NEPTUNE": {
    hook: "You have a soft, artistic touch, and people feel it.",
    text: "Venus and Neptune flow into each other by trine. You're warm, gentle and naturally attuned to beauty in music, art and people. Love comes with tenderness and imagination, and you're generous in a way that rarely costs you. Others find you inspiring and kind. It all flows easily, so your talents may stay pleasant hobbies unless you take them seriously.",
    short: ["tender", "inspired", "graceful"],
    watch: "letting a real gift stay a pastime.",
  },
  "VENUS|opposition|NEPTUNE": {
    hook: "You've loved some people more than they deserved. You're getting better at choosing.",
    text: "With Neptune across from your Venus, the fog tends to roll in through other people. You're drawn to dreamers, artists and people who need saving, and relationships can start out magical and turn confusing. You're deeply compassionate and very romantic. Over the years, you learn to love with your eyes open, and the love you find then is worth the wait.",
    short: ["devoted", "romantic", "compassionate"],
    watch: "filling in the blanks about someone with wishful thinking.",
  },
  "VENUS|conjunction|PLUTO": {
    hook: "You don't do casual. When you love someone, it's total.",
    text: "Pluto meets your Venus, so love and desire run deep and intense. You're loyal, magnetic and drawn to relationships that change you. Shallow connections bore you. Feelings this strong can tip into jealousy or a need to hold on, and you may learn some hard lessons in love before you learn how to trust. Through those lessons you become someone whose love transforms people for the better.",
    short: ["intense", "loyal", "magnetic"],
    watch: "holding on so tightly that love can't breathe.",
  },
  "VENUS|sextile|PLUTO": {
    hook: "Your affection has depth, and people sense they can trust you with serious things.",
    text: "Pluto lends your Venus a light, steady intensity. You're loyal, perceptive about people's real feelings and good at relationships that grow over time. You can turn a hard experience into a closer bond. With money and value, you have good instincts about what's worth investing in. Act on those instincts more often.",
    short: ["loyal", "perceptive", "sincere"],
    watch: "hiding how much you care.",
  },
  "VENUS|square|PLUTO": {
    hook: "You love hard and you've been hurt hard, and you'd still choose to feel it all.",
    text: "Venus and Pluto clash in your chart, so love comes with intensity and some power struggles. You're passionate, magnetic and fiercely loyal, and complicated or controlling partners can pull at you. Jealousy, all or nothing feelings and relationships that change you completely are part of the story. So is deep growth. As you learn to love without needing to control, or to be controlled, your relationships become remarkably strong.",
    short: ["passionate", "loyal", "transformative"],
    watch: "confusing intensity with intimacy.",
  },
  "VENUS|trine|PLUTO": {
    hook: "Your love runs deep without drama, which is a rare combination.",
    text: "The Venus and Pluto trine gives your feelings depth and staying power. You're magnetic, loyal and emotionally honest, and hard times usually bring your relationships closer. People are drawn to your quiet intensity. You also have good instincts about money and what lasts. Depth is your default, so how much you give can go unnoticed, even by you.",
    short: ["magnetic", "devoted", "emotionally honest"],
    watch: "expecting everyone to love as deeply as you do.",
  },
  "VENUS|opposition|PLUTO": {
    hook: "You tend to love powerful people, and loving them has made you stronger.",
    text: "Pluto faces your Venus, so the intensity in your love life often arrives through partners: strong personalities, deep attractions, relationships that test you. You can feel pulled into power struggles or swept up in someone else's world. Over time you find your own center, and then you can love deeply without losing yourself.",
    short: ["magnetic", "passionate", "resilient"],
    watch: "giving up yourself to keep a relationship.",
  },

  // Aspects A9, Mercury with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-09-mercury-outer.md
  "MERCURY|conjunction|URANUS": {
    hook: "Your brain skips steps. Usually it lands somewhere the rest of us get to a week later.",
    text: "Mercury takes on the color of whatever planet it meets, and yours meets Uranus. You think in flashes, jump between ideas and see connections nobody else noticed. You're drawn to new technology, odd facts and arguments that turn things upside down. Your speech can be blunt, fast or delightfully strange. Explaining how you got there is the hard part, because you often don't know yourself.",
    short: ["brilliant", "inventive", "quick"],
    watch: "losing people by skipping the steps in between.",
  },
  "MERCURY|sextile|URANUS": {
    hook: "You learn fast and you love a good new idea, especially one that actually works.",
    text: "The link between your mind and Uranus is light and practical. You pick up new tools and subjects quickly, you think on your feet and you can explain unusual ideas so they make sense. Conversations with you go places. Follow your curiosity on purpose, through a course, a side project, a strange book, and you'll keep finding useful things.",
    short: ["clever", "curious", "articulate"],
    watch: "letting good ideas stay as conversation.",
  },
  "MERCURY|square|URANUS": {
    hook: "You change your mind fast, and you're right more often than people expect.",
    text: "Uranus squares your Mercury. Your mind is restless, original and quick to challenge anything that sounds like received wisdom. You argue for the unusual position, sometimes just to see if it holds. That makes you inventive and hard to bore. The flip side is a scattered streak, impatience with details and the odd abrupt remark. Slow down when it counts. Your best ideas survive a second look.",
    short: ["original", "sharp", "provocative"],
    watch: "saying the shocking thing before the true one.",
  },
  "MERCURY|trine|URANUS": {
    hook: "Ideas come to you out of nowhere, and they tend to be good ones.",
    text: "Uranus flows into your Mercury, so original thinking comes naturally. You're quick, inventive and open to new ways of seeing, and complicated ideas come out of you sounding simple. Science, technology, writing and any problem nobody has solved yet suit you. Learning feels fun rather than hard, and you can get by on talent. Your ideas get even better when you finish them.",
    short: ["inventive", "quick", "open minded"],
    watch: "relying on flashes instead of follow through.",
  },
  "MERCURY|opposition|URANUS": {
    hook: "Other people keep shaking up your thinking, and most days you enjoy it.",
    text: "With Uranus across from your Mercury, the jolts to your thinking often come through conversations. You meet people with radical views, debates that turn sharp and news that changes your plans. You can get defensive or contrary in return. The growth comes when you can take in the new idea without needing to win, and your mind gets wider for it.",
    short: ["quick", "alert", "open to debate"],
    watch: "arguing the opposite just because someone else said it first.",
  },
  "MERCURY|conjunction|NEPTUNE": {
    hook: "You think in pictures, music and feelings, and you can make other people see them too.",
    text: "Mercury meets Neptune, and your mind runs on imagination more than logic. You're intuitive, poetic and good at sensing what's left unsaid. Fiction, music, film, design and anything that speaks to the heart suits you. Facts, lists and fine print are harder, and you may forget details or tell a story the way it felt instead of how it happened. Write things down and check them twice, and your imagination can do its best work.",
    short: ["imaginative", "intuitive", "poetic"],
    watch: "filling gaps in the facts with what feels true.",
  },
  "MERCURY|sextile|NEPTUNE": {
    hook: "You have a gentle way with words and a good sense of what people mean.",
    text: "Mercury and Neptune share a soft sextile, so your thinking has an intuitive layer. You pick up on mood, read between the lines and put feelings into words kindly. Writing, music, counseling and teaching come naturally. The talent grows when you use it regularly, so keep a notebook and fill it.",
    short: ["intuitive", "imaginative", "kind with words"],
    watch: "keeping your creative ideas to yourself.",
  },
  "MERCURY|square|NEPTUNE": {
    hook: "Your imagination is extraordinary. Your memory for where you put your keys, less so.",
    text: "Your mind and Neptune pull against each other, so thinking and imagining blur. You're creative, intuitive and deeply empathetic, with a gift for stories, images and ideas that move people. You can also misread situations, believe what you hope is true or get lost in daydreams when focus is needed. Communication can go sideways without anyone meaning it. Clear notes, direct questions and a second look turn this into a real artistic edge.",
    short: ["creative", "intuitive", "empathetic"],
    watch: "hearing what you hoped instead of what was said.",
  },
  "MERCURY|trine|NEPTUNE": {
    hook: "When you explain a feeling or an idea, it comes out beautiful.",
    text: "Neptune lends your Mercury an easy imagination. You think in images and stories, you understand people intuitively and you have a natural gift for writing, music or art. Your words can comfort and inspire. The flow is free, and the discipline that would make it remarkable is the part you'll have to supply.",
    short: ["imaginative", "eloquent", "intuitive"],
    watch: "daydreaming instead of drafting.",
  },
  "MERCURY|opposition|NEPTUNE": {
    hook: "You've learned to check the details, mostly the hard way.",
    text: "Neptune faces your Mercury, so confusion in your thinking often comes from outside: mixed messages, vague promises, people whose words don't match their actions. You're open minded and imaginative, and you want to believe people. Over time you develop a sharp nose for the difference between a good story and a true one, which makes you wiser and harder to fool.",
    short: ["imaginative", "open", "sensitive"],
    watch: "taking someone at their word without checking.",
  },
  "MERCURY|conjunction|PLUTO": {
    hook: "You don't make small talk. You make big talk, and people tell you their secrets.",
    text: "Pluto joins your Mercury, so your mind goes straight for what's hidden. You're a natural researcher, investigator or therapist, and you can't rest until you understand how something really works. Your words carry weight, and you can persuade, probe or cut very precisely. You may also brood, hold on to a thought for too long or use words as a weapon when hurt. Your depth is a gift. Use it to uncover, not to win.",
    short: ["penetrating", "persuasive", "intense"],
    watch: "turning conversations into interrogations.",
  },
  "MERCURY|sextile|PLUTO": {
    hook: "You notice what other people miss, and you know what to do with it.",
    text: "Pluto gives your Mercury a quiet depth. You're good at research, strategy and getting to the heart of a problem. People confide in you because you listen closely and don't gossip. The talent stays hidden unless you use it, so take on the puzzles that need a detective.",
    short: ["perceptive", "strategic", "discreet"],
    watch: "keeping your insights to yourself.",
  },
  "MERCURY|square|PLUTO": {
    hook: "You win arguments, but you've learned that winning isn't always the point.",
    text: "Your mind and Pluto clash, which gives your thinking intensity and force. You dig for the truth, you won't accept easy answers and you can be fiercely persuasive. You may have had to defend your ideas against strong people early. Investigators, critics and advocates are built from this. On a bad day you turn suspicious, chew on one thought for weeks or cut too deep in an argument. Your words land hard, so aim them carefully.",
    short: ["probing", "persuasive", "determined"],
    watch: "needing to have the last word.",
  },
  "MERCURY|trine|PLUTO": {
    hook: "You can see straight through a problem to its root.",
    text: "Mercury and Pluto share a trine, so your thinking has depth and focus without strain. You concentrate well, you research thoroughly and you can persuade quietly and effectively. Psychology, science, investigation and strategy come naturally. People trust your judgment on serious matters. With so much natural focus, take on questions big enough to deserve it.",
    short: ["focused", "insightful", "persuasive"],
    watch: "spending deep thinking on shallow problems.",
  },
  "MERCURY|opposition|PLUTO": {
    hook: "You've met some powerful talkers. You've become one.",
    text: "Pluto opposes your Mercury, so intense ideas and strong opinions often come at you from others: forceful debaters, secretive people, conversations that turn into power struggles. You can feel pressured to agree, or dig in out of stubbornness. Eventually you can hold your view under pressure and still hear the truth in someone else's. Then you become a remarkably persuasive voice.",
    short: ["persuasive", "perceptive", "resilient"],
    watch: "turning disagreement into a contest of wills.",
  },

  // Aspects A10, Mercury with Jupiter and Saturn (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-10-mercury-jupiter-saturn.md
  "MERCURY|conjunction|JUPITER": {
    hook: "You don't just know things. You know things about the things, and you'd love to tell someone.",
    text: "Lilly said Mercury joined with Jupiter makes a person honest, learned and of upright judgment, and the conjunction puts those qualities in one place. Your mind is broad and generous. You love big ideas, good teachers and long conversations about meaning, and people walk away from your explanations feeling smarter. You tend to see the whole picture before the details. That's the trade: brilliant overviews, and the occasional missed fine print.",
    short: ["learned", "generous minded", "optimistic"],
    watch: "promising the big picture and skipping the small print.",
  },
  "MERCURY|sextile|JUPITER": {
    hook: "You're a natural teacher, even when nobody asked for a lesson.",
    text: "Jupiter, one of Mercury's friends in Lilly's list, links lightly to your mind. Learning is a pleasure for you, and what you know rarely stays theory: you make it useful for others. You're fair in an argument and good at finding the hopeful angle. Opportunities often arrive through writing, travel or the right conversation, so keep talking and keep reading.",
    short: ["curious", "fair", "encouraging"],
    watch: "collecting knowledge you never put to work.",
  },
  "MERCURY|square|JUPITER": {
    hook: "You have more ideas than hours, and you've started all of them.",
    text: "Your mind and Jupiter push each other to excess. You think big, talk with conviction and love a grand theory. That makes you an inspiring speaker and a fun person to brainstorm with. It also tempts you to exaggerate, overcommit or decide before you've checked the facts. Lilly's Jupiter brings honesty to the mind; your version asks for honesty about limits too. Pick one big idea and finish it.",
    short: ["enthusiastic", "expansive", "persuasive"],
    watch: "saying yes to everything that sounds interesting.",
  },
  "MERCURY|trine|JUPITER": {
    hook: "Good judgment comes easily to you, and people notice.",
    text: "With Mercury trine its friend Jupiter, your thinking is open, fair and optimistic. You learn widely, you see the sense in different points of view and your explanations stay simple. Teaching, publishing, law and travel suit you. People ask your opinion because it's both kind and sound. Stretch yourself with something difficult now and then, since your mind can handle far more than it usually gets.",
    short: ["wise", "fair minded", "articulate"],
    watch: "staying in subjects that come easily.",
  },
  "MERCURY|opposition|JUPITER": {
    hook: "You keep meeting people with big opinions, and you've learned something from every one of them.",
    text: "Jupiter faces your Mercury, so expansive ideas often come at you through others: teachers, preachers, salespeople, friends with a grand plan. You can be swept up in someone else's vision or find yourself arguing against it on principle. Both teach you. Once your own philosophy settles, you become the person who can hear any big idea and pull out the part that's true.",
    short: ["open minded", "curious", "diplomatic"],
    watch: "adopting someone else's beliefs wholesale.",
  },
  "MERCURY|conjunction|SATURN": {
    hook: "You think before you speak, and when you speak, people write it down.",
    text: "Lilly wrote that Saturn with Mercury makes the wit more wary, constant and persevering, and that Saturn helps the memory. That's you. Your mind is careful, structured and patient, built for subjects that take years to master. You may have been a quiet or serious child, slow to speak up and quick to notice. Your thinking can lean toward worry or harsh self judgment, and you may doubt ideas that are actually very good. Trust the work you've put in.",
    short: ["careful", "thorough", "wise"],
    watch: "keeping a good idea to yourself because it isn't perfect yet.",
  },
  "MERCURY|sextile|SATURN": {
    hook: "You're the person who actually reads the instructions, and things work out better for it.",
    text: "Saturn, a friend to Mercury in Lilly's scheme, gives your thinking a practical backbone. You organize well, remember what matters and turn ideas into plans. People trust what you say because you've checked it. The opening is quiet but valuable: tackle the subject or skill that takes patience, and you'll likely master it.",
    short: ["practical", "organized", "reliable"],
    watch: "sticking to what's proven when a new idea deserves a try.",
  },
  "MERCURY|square|SATURN": {
    hook: "You've worked hard to be taken seriously, and now you are.",
    text: "Saturn squares your Mercury, so your thinking meets resistance: doubt, criticism, a feeling of having to prove you're smart enough. That pressure builds real discipline. You think carefully, you prepare and your opinions are hard won. The cost is a tendency toward pessimism, rigid views or an inner critic that's louder than it should be. Your mind is sharper than your doubts allow. Let yourself speak before you're certain.",
    short: ["disciplined", "precise", "persistent"],
    watch: "staying silent because you're afraid of being wrong.",
  },
  "MERCURY|trine|SATURN": {
    hook: "You make clear thinking look simple. It took practice, but it's your gift.",
    text: "Saturn steadies your Mercury through an easy trine. You concentrate well, you think logically and you remember what you learn. Lilly's curious, persevering mind shows up in you as a love of mastering something properly. Planning, research, building and teaching suit you. Your judgment is respected because it's sound. Let some play into your thinking too; your ideas get better with a little risk.",
    short: ["logical", "patient", "dependable"],
    watch: "dismissing ideas that aren't practical yet.",
  },
  "MERCURY|opposition|SATURN": {
    hook: "People have doubted your ideas. You've answered by getting very, very good.",
    text: "With Saturn across from your Mercury, criticism and caution often come through others: a strict teacher, a skeptical boss, a partner who wants proof. You can get defensive or start doubting yourself. Under that pressure your thinking becomes precise and well supported. In the long run you become the careful, credible voice you once had to argue with.",
    short: ["precise", "serious", "credible"],
    watch: "letting one critic stand in for everyone.",
  },

  // Aspects A11, Moon with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-11-moon-outer.md
  "MOON|conjunction|URANUS": {
    hook: "You need space the way other people need a hug, and it took you years to stop apologizing for it.",
    text: "Your feelings arrive like weather, because Uranus sits on your Moon: sudden, bright, gone. You can be fine at breakfast and ready to move cities by lunch, and then fine again. Routines that comfort other people make you itch. You're drawn to friends who are a little odd and homes that don't look like anyone else's. Closeness works best when it comes with a long leash on both ends, and the people who understand that tend to stay a very long time.",
    short: ["independent", "unconventional", "quick to rebound"],
    watch: "leaving the room, or the relationship, when a feeling gets too close.",
  },
  "MOON|sextile|URANUS": {
    hook: "You bounce back faster than anyone expects, including you.",
    text: "Uranus keeps your Moon lightly on its toes. You like a bit of novelty in your week, a new café, a new friend, a new way of doing the dishes, and change rarely rattles you for long. Friends find you refreshing because you don't hold on to bad moods. Lean into it: when life feels stale, a small change is usually all the reset you need.",
    short: ["adaptable", "upbeat", "open"],
    watch: "brushing past a feeling that deserved a second look.",
  },
  "MOON|square|URANUS": {
    hook: "You were the kid who rearranged their bedroom at midnight. You might still be.",
    text: "With Uranus squaring your Moon, comfort and freedom keep tripping over each other. You want a home base and you want to bolt from it, sometimes in the same week. Moods change fast and without warning, and people close to you may feel like they're guessing. Underneath is real originality: you don't need life to look normal to feel right. The trick is building stability that has a window in it, a routine you chose, a partner who doesn't need to know where you are every minute.",
    short: ["original", "restless", "resilient"],
    watch: "creating a crisis to break up the calm.",
  },
  "MOON|trine|URANUS": {
    hook: "Your friends come from everywhere, and somehow they all get along at your place.",
    text: "Uranus flows into your Moon, so you're emotionally open and quick to adjust. Surprises feel like adventures more than threats. You give your loved ones room to be themselves, and they give it back. Your gut often lands on a fresh answer before your head has finished the question. Change is easy for you; staying put through a dull stretch is the skill you get to practice.",
    short: ["open hearted", "adaptable", "intuitive"],
    watch: "moving on before a good thing has had time to deepen.",
  },
  "MOON|opposition|URANUS": {
    hook: "The people you get close to keep surprising you. You keep choosing them anyway.",
    text: "Uranus sits across from your Moon, so the jolts often come through home and relationships: a partner who needs space, a family that moved around, friends who come and go. You may have learned early to expect change, and you handle it well. Part of you wants a steady nest and part of you picks people who'd never sit still in one. Once you admit that you want both, you can build a life that has both.",
    short: ["adaptable", "independent", "alert"],
    watch: "mistaking someone's unavailability for mystery.",
  },
  "MOON|conjunction|NEPTUNE": {
    hook: "You can feel a song from the next room. Sad movies have always been a problem.",
    text: "Neptune joins your Moon, so the line between your feelings and everyone else's is thin. You soak up moods, music and atmospheres, and you're kind in a deep, instinctive way. That makes you gifted at art, care and anything that needs imagination. It also means you need real recovery time, quiet, water, sleep, after crowds or hard days. Learn which feelings are yours. The rest you can put down.",
    short: ["empathetic", "imaginative", "gentle"],
    watch: "carrying other people's moods home as if they were yours.",
  },
  "MOON|sextile|NEPTUNE": {
    hook: "You notice when someone's having a hard day, and you're kind about it without making a thing of it.",
    text: "Neptune lends your Moon a soft intuition. You read moods easily, you're comforted by music and beauty, and a quiet imaginative life keeps you steady. People feel safe around you. This is a talent you can grow on purpose, through art, care work or just checking in on the friend who went quiet.",
    short: ["intuitive", "kind", "imaginative"],
    watch: "keeping your own needs quiet while you tend everyone else's.",
  },
  "MOON|square|NEPTUNE": {
    hook: "You've rescued a few people who didn't want rescuing. You meant well every time.",
    text: "Neptune squares your Moon, so needs and dreams blur. You want comfort and you want something magical, and ordinary life can feel thin by comparison. You're deeply compassionate and imaginative, and very easy to move. You can also be easy to mislead, especially by people who need you. Moods can drift with no clear cause. Rest, routine and honest friends who tell you what they see keep you grounded, and your gift for empathy stays a gift.",
    short: ["compassionate", "imaginative", "sensitive"],
    watch: "confusing being needed with being loved.",
  },
  "MOON|trine|NEPTUNE": {
    hook: "You make people feel understood, and you barely have to try.",
    text: "Your Moon and Neptune share an easy trine, so imagination and feeling run together without strain. You're intuitive about people, moved by beauty and comforted by music, art and water. Your home probably has some magic in it, the right light, the right playlist. Others come to you for calm. With empathy this natural, it's worth giving it a real outlet, whether that's art, care work or simply showing up.",
    short: ["intuitive", "gentle", "imaginative"],
    watch: "drifting when a decision needs making.",
  },
  "MOON|conjunction|PLUTO": {
    hook: "Your feelings don't come in small sizes. When you care, it's everything.",
    text: "Your emotional life runs deep and strong, with Pluto right on your Moon. You feel things intensely, you remember them for a long time and you'd walk through fire for your people. Surface friendships don't satisfy you. You can sense what's going on under the surface of a room, and you're drawn to what others avoid. The shadow is holding on: grudges, control, a need to know everything. Letting go is the hardest thing you'll learn, and the most freeing.",
    short: ["intense", "loyal", "perceptive"],
    watch: "guarding your feelings so tightly that nobody can reach them.",
  },
  "MOON|sextile|PLUTO": {
    hook: "You're the friend people call when it's serious.",
    text: "Pluto gives your Moon quiet depth and resilience. You handle hard feelings without falling apart, and you can help others through theirs. You see what people really mean, and you keep their confidences. Your emotional life renews itself: after a loss you come back stronger. Lend that strength to others and it grows.",
    short: ["resilient", "perceptive", "trustworthy"],
    watch: "never letting anyone see you struggle.",
  },
  "MOON|square|PLUTO": {
    hook: "You don't trust easily, and you've earned that. You also love harder than almost anyone.",
    text: "Feelings come with high stakes when Pluto squares the Moon. You may have grown up around strong emotions or power struggles, and you learned to watch closely and protect yourself. As an adult you feel intensely, sense hidden motives and can be fiercely loyal or completely closed off, rarely in between. Control can feel like safety. The real work, and the real reward, is learning that you can be close to someone and still be safe.",
    short: ["intense", "protective", "deeply loyal"],
    watch: "testing people to see if they'll stay.",
  },
  "MOON|opposition|PLUTO": {
    hook: "Strong people have shaped your life, and you've become one of them.",
    text: "Pluto opposes your Moon, so emotional intensity often arrives through others: a powerful parent, a consuming relationship, a friend whose crisis becomes yours. You can feel pulled into someone else's depths or locked in a struggle over who controls the closeness. Gradually your own footing gets firmer, and then you can be deeply intimate without losing yourself.",
    short: ["intense", "perceptive", "resilient"],
    watch: "letting someone else's storm decide your mood.",
  },

  // Aspects A12, Mars with the Sun, Jupiter and Saturn (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-12-mars-sun-jupiter-saturn.md
  "SUN|sextile|MARS": {
    hook: "You get things done without making a scene about it.",
    text: "Your will and your drive cooperate. You have steady energy, you take initiative when it counts and you can stand up for yourself without starting a war. Sport, building, competing or any work with a clear goal suits you. The sextile hands you the energy and leaves the aim to you, so pick a target worth the effort.",
    short: ["energetic", "capable", "confident"],
    watch: "spending your drive on busywork.",
  },
  "SUN|square|MARS": {
    hook: "You were born ready for a fight, and you've mostly learned to pick the good ones.",
    text: "Mars squares your Sun, so your identity and your drive are always slightly at odds. You have huge energy, a competitive streak and a temper that comes up fast. You hate being told what to do. That friction makes you brave, hardworking and impossible to ignore, the person who takes on the hard job and wins. The cost shows up as rushing, clashing with authority and treating small slights as challenges. Exercise and a real goal keep the fire useful.",
    short: ["courageous", "driven", "competitive"],
    watch: "fighting battles that aren't worth your energy.",
  },
  "SUN|trine|MARS": {
    hook: "You have stamina other people envy, and you make effort look natural.",
    text: "Your will and your drive trine each other, so they agree more often than they argue. You act with confidence, recover quickly and enjoy a challenge without needing a fight. Leadership comes naturally because you just start, and people follow. Physical activity probably suits you well. With energy this reliable, you might coast where you could compete.",
    short: ["vigorous", "confident", "decisive"],
    watch: "settling for easy wins.",
  },
  "SUN|opposition|MARS": {
    hook: "You keep running into people who push. You've become very good at pushing back.",
    text: "Mars faces your Sun, so drive and conflict often arrive through others: rivals, demanding partners, people who challenge you head on. You may swing between giving way and coming out swinging. Competition brings out your best. As you learn to own your own fire, you stop needing someone else to strike the match, and your relationships become partnerships instead of contests.",
    short: ["assertive", "energetic", "competitive"],
    watch: "turning partners into opponents.",
  },
  "MARS|conjunction|JUPITER": {
    hook: "You don't do anything at half speed. Including relaxing.",
    text: "Lilly named Mars as Jupiter's only enemy, yet in your chart they share a place: enthusiasm with muscle. You're bold, generous and adventurous, ready to take on big challenges and fight for what you believe in. Sport, travel, entrepreneurship and crusades suit you. Your confidence is contagious. The risk is overdoing it: taking on too much, overestimating your stamina or charging in before checking the map.",
    short: ["bold", "enthusiastic", "generous"],
    watch: "confusing more with better.",
  },
  "MARS|sextile|JUPITER": {
    hook: "When you go after something, luck tends to meet you halfway.",
    text: "Mars and Jupiter link lightly, so your effort and your optimism support each other. You take healthy risks, you're good at seeing an opportunity and moving on it, and you're generous with your energy. People enjoy working with you. The opening rewards action, so when a chance comes, take it.",
    short: ["enterprising", "optimistic", "energetic"],
    watch: "waiting for a sure thing.",
  },
  "MARS|square|JUPITER": {
    hook: "Your ambitions are big, and so is your appetite for risk.",
    text: "Mars and Jupiter push each other into excess. You're enthusiastic, restless and eager to do more, faster, bigger. That gives you real courage, the willingness to bet on yourself. It also tempts you to overcommit, overspend energy or act on conviction before you've checked the facts. Lilly's old enmity between these two shows up as impatience with limits. When you aim the fire, you can accomplish remarkable things.",
    short: ["ambitious", "daring", "enthusiastic"],
    watch: "betting everything on one big move.",
  },
  "MARS|trine|JUPITER": {
    hook: "You make bold moves look easy, and they usually work.",
    text: "Mars and Jupiter work smoothly together in your chart. You're confident, energetic and good at turning plans into action. Travel, sport, teaching, business and adventure come naturally. You act generously, and your calls are usually right. Since bold moves keep paying off, you may never stretch for the one that would really change things.",
    short: ["confident", "active", "fortunate"],
    watch: "playing safe because you can.",
  },
  "MARS|opposition|JUPITER": {
    hook: "You attract big personalities and big promises, and you've learned to read the fine print.",
    text: "Jupiter faces your Mars, so expansion and excess tend to arrive in other people: partners with grand plans, bosses who overpromise, friends who egg you on. You can get carried away or push back hard on principle. Once you start choosing your own adventures instead of joining someone else's, you're a powerful ally to anyone with a good cause.",
    short: ["spirited", "generous", "adventurous"],
    watch: "getting swept into someone else's crusade.",
  },
  "MARS|conjunction|SATURN": {
    hook: "Work comes easily to you. Stopping, not so much.",
    text: "Lilly said that what the heat of Mars stirs up, the cold of Saturn undoes, and with these two together you know the feeling of a brake and an accelerator pressed at once. Frustration can build up when you can't act. Over time you master that tension, and it becomes extraordinary endurance and control. You work hard, you plan your moves and you can do difficult, precise things others can't. Let yourself rest, and let the anger out in a safe place before it stiffens.",
    short: ["disciplined", "enduring", "controlled"],
    watch: "bottling frustration until it hardens.",
  },
  "MARS|sextile|SATURN": {
    hook: "You're the steady worker everybody wants on the team.",
    text: "Mars and Saturn link lightly, so your drive comes with patience. You plan before you act, you finish what you start and your stamina holds. The hard, careful jobs tend to land on your desk. Use this on purpose: take on the long project, and you'll likely see it through.",
    short: ["disciplined", "reliable", "persistent"],
    watch: "playing it safe when a bold move is called for.",
  },
  "MARS|square|SATURN": {
    hook: "You've had to push through walls. Now you know you can.",
    text: "Saturn squares your Mars, so action and restraint clash. You may have felt blocked or held back early, by rules, by circumstance or by your own caution. That built grit. Keeping going when it's hard is second nature, and you can achieve things others give up on. Lilly's old line fits the risk: Mars starts, Saturn stops, and you can find yourself beginning projects and stalling. Steady pacing and realistic goals turn the friction into strength.",
    short: ["determined", "tough", "resilient"],
    watch: "starting strong and stalling halfway.",
  },
  "MARS|trine|SATURN": {
    hook: "Hard things, done slowly and well: that's your specialty.",
    text: "Mars and Saturn trine each other here. You're disciplined without being rigid, patient without losing drive. You plan your moves, you pace yourself and you finish. Engineering, building, surgery, sport and long careers suit you. People trust you because you're reliable. With control this natural, let yourself take an occasional risk.",
    short: ["controlled", "persistent", "capable"],
    watch: "never letting yourself go full speed.",
  },
  "MARS|opposition|SATURN": {
    hook: "Someone has always been standing in your way. You've learned to go around, over or through.",
    text: "With Saturn across from your Mars, obstacles often come through others: strict authority, cautious partners, people who say no. You can feel frustrated or blocked, and swing between pushing too hard and giving up. Eventually the limits become tools instead of enemies, and you become very hard to stop.",
    short: ["persistent", "strategic", "tough"],
    watch: "fighting the rules instead of working with them.",
  },

  // Aspects A13, Venus with Jupiter and Saturn, Jupiter with Saturn (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-13-venus-jupiter-saturn.md
  "VENUS|conjunction|JUPITER": {
    hook: "Lilly called them the lesser and the greater fortune. You got both in one spot.",
    text: "Venus and Jupiter together make you warm, generous and easy to like. You enjoy life's pleasures, good food, good company, beautiful things, and you share them freely. Love tends to arrive with abundance, and you're often lucky in friendship and money. Your generosity is genuine. The only problem is excess: one more dessert, one more purchase, one more yes. Enjoy it all, with a little restraint.",
    short: ["generous", "affectionate", "fortunate"],
    watch: "spending your luck faster than it comes in.",
  },
  "VENUS|sextile|JUPITER": {
    hook: "People like having you around, and good things seem to follow.",
    text: "Venus and Jupiter connect lightly, so your warmth and your optimism support each other. You're sociable, kind and generous, and you often find opportunities through friends. Art, hospitality and anything with people at its center suit you. Say yes to invitations; that's where this one pays off.",
    short: ["friendly", "generous", "optimistic"],
    watch: "letting good connections drift for lack of follow up.",
  },
  "VENUS|square|JUPITER": {
    hook: "You love big: big gestures, big parties, big feelings. Your bank account has opinions.",
    text: "Venus squares Jupiter, and the square only knows one word: more. You're warm, generous and fun to be around, and your appetite for pleasure and romance is strong. Indulgence is the trap, whether that's overspending, overeating or promising your heart too quickly. You may also expect more from love than any one person can give. The generosity is a gift. A little moderation lets you keep it.",
    short: ["generous", "romantic", "fun loving"],
    watch: "treating more as the answer to every mood.",
  },
  "VENUS|trine|JUPITER": {
    hook: "Life tends to be kind to you, and you pass it on.",
    text: "Lilly's two fortunes, Venus and Jupiter, trine each other in your chart. You're gracious, cheerful and generous, and you attract good friends and pleasant circumstances. Love, money and beauty tend to come with less struggle than for most. People feel lucky around you. Because so much comes easily, the challenge is to aim the luck at something that matters.",
    short: ["gracious", "lucky", "warm"],
    watch: "letting comfort take the place of ambition.",
  },
  "VENUS|opposition|JUPITER": {
    hook: "You attract generous people, and sometimes you give too much back.",
    text: "Jupiter faces your Venus, so abundance often arrives through partners: people who spoil you, invite you along and widen your world. You can overextend in return or expect more than a relationship can hold. Knowing where generosity ends and excess starts is the lesson, and once it's learned your relationships get rich in the best sense.",
    short: ["sociable", "warm hearted", "generous"],
    watch: "keeping score of who gave more.",
  },
  "VENUS|conjunction|SATURN": {
    hook: "You take love seriously. Once you commit, you mean it.",
    text: "Lilly wrote that Venus agrees with Saturn in coldness but parts ways in manners, Saturn the parent of sadness and Venus the mother of mirth. With the two in one place, you know both. Love may have come late or with lessons, and showing affection may not come easily. You're also loyal, steady and drawn to people who are older or more established. Your love grows stronger with time. Let yourself enjoy it now, not only once it's proved.",
    short: ["loyal", "serious", "enduring"],
    watch: "holding back affection until you're sure it's safe.",
  },
  "VENUS|sextile|SATURN": {
    hook: "You build relationships that last, one sensible step at a time.",
    text: "Venus and Saturn link gently, so your heart has good judgment. You're loyal, you choose friends carefully, and you're good with money and long commitments. People trust your taste because it's classic and well considered. Invest in the friendship, the craft or the partnership that will still matter in twenty years.",
    short: ["loyal", "sensible", "steady"],
    watch: "waiting so long to commit that the moment passes.",
  },
  "VENUS|square|SATURN": {
    hook: "Love has asked you for patience. You've given it, and it's made you wise.",
    text: "Saturn squares your Venus, so affection and caution clash. Somewhere along the way, love may have seemed to come with conditions, or you wondered if you were enough. That can make you guarded, critical of yourself or slow to trust. You're also deeply loyal and willing to work at relationships others would abandon. Love that's earned means more to you. The work is believing you deserve it without having to prove it.",
    short: ["loyal", "serious", "devoted"],
    watch: "expecting rejection and pulling away first.",
  },
  "VENUS|trine|SATURN": {
    hook: "You love steadily, and people feel safe with you.",
    text: "Venus and Saturn meet in a gentle trine, the easy side of Lilly's pairing that shares Libra. You're loyal, sensible and graceful, and what you build with people lasts. You have a classic eye for beauty and good judgment about money. People admire your quiet reliability. Allow some spontaneity; love likes a surprise now and then.",
    short: ["steady", "faithful", "elegant"],
    watch: "letting routine take the place of romance.",
  },
  "VENUS|opposition|SATURN": {
    hook: "You've waited for love, and you've worked for it. It's worth it.",
    text: "Saturn opposes your Venus, so the serious side of love often comes through others: a partner who's reserved, older or burdened, a relationship with heavy responsibilities. You may feel lonely even when you're with someone. The turn comes when you start asking for warmth directly, and giving it the same way. Then the loyalty and depth you bring to love become your greatest strengths.",
    short: ["loyal", "patient", "mature"],
    watch: "accepting less than you need because you're used to it.",
  },
  "JUPITER|conjunction|SATURN": {
    hook: "You were born in the year of a great conjunction, when the two slowest planets Lilly knew met, as they do about every twenty years.",
    text: "Lilly gave Saturn with Jupiter prudence, wisdom and \"great councell and judgment.\" In you it shows as a balance of hope and realism: you can dream big and plan carefully. Your timing in life may come in long cycles. When the two work together, you build things that last.",
    short: ["wise", "balanced", "purposeful"],
    watch: "letting caution and hope cancel each other out.",
  },
  "JUPITER|sextile|SATURN": {
    hook: "You can feel when it's time to push and when it's time to wait.",
    text: "Jupiter and Saturn connect lightly, so growth and caution support each other. You plan well, you spot opportunities and you can build steadily without overreaching. On practical, long range questions, people come to you. Make use of it, especially in business, study or any project that grows over years.",
    short: ["prudent", "sensible", "steady"],
    watch: "being so balanced you never take a leap.",
  },
  "JUPITER|square|SATURN": {
    hook: "Part of you wants to say yes to everything, and part of you wants a guarantee first.",
    text: "Expansion and restraint keep trading places under this square. You may swing between big plans and big doubts, or feel that every opportunity comes with a catch. This square is common, about one chart in nine on this site. The skill it asks for is making your caution work for your ambition: the doubt checks the plan, the plan answers the doubt. Then you build something solid enough to grow.",
    short: ["ambitious", "cautious", "determined"],
    watch: "swinging between overconfidence and doubt.",
  },
  "JUPITER|trine|SATURN": {
    hook: "You know how to grow things slowly, and that's why they last.",
    text: "Hope and patience cooperate here, Jupiter trining Saturn. You're practical about your dreams and hopeful about hard work. Long careers, steady investments and patient projects suit you. Lilly's prudent, wise pairing shows up in you as good judgment that people rely on. Let yourself take a risk now and then; your foundations can handle it.",
    short: ["prudent", "wise", "balanced"],
    watch: "sticking with a sure thing past its time.",
  },
  "JUPITER|opposition|SATURN": {
    hook: "You've learned to take advice from optimists and pessimists, and then decide for yourself.",
    text: "Jupiter and Saturn face each other, so the pull between more and enough often plays out through other people: a hopeful partner and a cautious parent, a boss who expands and a boss who cuts. You may feel torn between taking the leap and staying safe. In the end your own balance is what you trust, and others start turning to it too.",
    short: ["balanced", "thoughtful", "fair"],
    watch: "letting others decide how much to risk.",
  },

  // Aspects A14, inner circle part two (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-14-inner-circle-2.md
  "MERCURY|sextile|VENUS": {
    hook: "You can say almost anything nicely, and people actually listen.",
    text: "Mercury and Venus never get far apart, and a sextile is as wide as they go. Lilly said Mercury with Venus makes a person more eloquent and \"lovesome,\" and you get the lighter version: a pleasant way with words, a good ear for music and a talent for smoothing things over. Writing notes, giving toasts, settling disputes: you're good at all three. Put the charm to use and it opens doors.",
    short: ["tactful", "articulate", "charming"],
    watch: "smoothing things over when the edge was the point.",
  },
  "MERCURY|sextile|MARS": {
    hook: "You think fast and act on it, and you're usually right to.",
    text: "Your mind has energy without the sting, thanks to a Mercury and Mars sextile. You're decisive, quick in a debate and good at practical problems. You like getting to the point, and people appreciate that you do. Sport commentary, troubleshooting, sales and any job that rewards a quick, clear answer suit you.",
    short: ["quick", "decisive", "direct"],
    watch: "answering before the question's finished.",
  },
  "MERCURY|square|MARS": {
    hook: "You don't lose arguments. You've lost a few friends over winning them.",
    text: "Mercury and Mars clash, so your words come out hot. Lilly said Mars makes Mercury more confident, and here confidence can tip into sharpness. You think fast, speak bluntly and can cut through nonsense in seconds. Advocates, critics and competitors run on this. So do arguments you didn't need to have and replies harsher than you meant. Count to five before the last word. The point will still land.",
    short: ["sharp", "outspoken", "quick witted"],
    watch: "saying the cutting thing because it's true.",
  },
  "MERCURY|trine|MARS": {
    hook: "Your mind runs fast and your follow through keeps up.",
    text: "Mars gives your Mercury easy energy. You're decisive, practical and confident in your opinions, and ideas turn into action fast. You speak clearly and persuade without bullying. Debate, writing on deadline and hands on problem solving suit you. Speed is the habit; some of your ideas deserve more time than you give them.",
    short: ["quick", "confident", "practical"],
    watch: "deciding before you've heard the other side.",
  },
  "MERCURY|opposition|MARS": {
    hook: "People pick fights with your ideas. You've gotten very good at defending them.",
    text: "Debate and conflict tend to arrive from other people when Mars opposes Mercury: argumentative partners, combative colleagues, critics. Defensiveness is the first reflex. Sharpness is the long term result. Argue the point instead of the person, and you become a persuasive, respected voice.",
    short: ["sharp", "persuasive", "resilient"],
    watch: "hearing an attack in an ordinary disagreement.",
  },
  "VENUS|sextile|MARS": {
    hook: "You flirt well, you play well and you make friends easily.",
    text: "Venus and Mars, Lilly's odd couple, link lightly here, so attraction and drive cooperate. Your wants are clear, and you pursue them pleasantly. You're warm, playful and socially confident. Creative projects with energy in them, dance, sport, design, suit you. Make the first move more often; it usually works.",
    short: ["charming", "playful", "confident"],
    watch: "waiting to be chosen.",
  },
  "VENUS|square|MARS": {
    hook: "Calm has never been the word for your love life, and you like it that way.",
    text: "Venus and Mars clash, so tenderness and desire pull in different directions. Lilly said Mars loves Venus and she doesn't love him back, and you know the tension: you want harmony and you want heat. Attraction is strong and often stormy, and relationships can swing from passion to argument. You're also creative and magnetic. When you let both sides of you show, softness and fire, you stop needing drama to feel alive.",
    short: ["passionate", "magnetic", "creative"],
    watch: "mistaking conflict for chemistry.",
  },
  "VENUS|trine|MARS": {
    hook: "You're easy to be attracted to, and easy to be with.",
    text: "Venus and Mars cooperate smoothly in your chart. Lilly's Venus softens Mars \"by good words and her meeknesse,\" and you have that knack: you go after what you want warmly. Romance, art and physical activity come naturally. Your relationships balance affection and passion well. The one skill this leaves you short on is conflict, simply because you get so little practice.",
    short: ["affectionate", "attractive", "creative"],
    watch: "avoiding hard conversations because things are usually easy.",
  },
  "VENUS|opposition|MARS": {
    hook: "You keep meeting your match. Sometimes you meet your opponent.",
    text: "Mars across from your Venus means attraction and conflict often arrive together, through partners who push your buttons and pull you in. Relationships move between closeness and competition, sometimes in one evening. You're passionate and very aware of the other person. Own both your softness and your fire, and your partnerships turn equal and exciting.",
    short: ["passionate", "attentive", "magnetic"],
    watch: "wanting what you can't have more than what you've got.",
  },

  // Aspects A15, Jupiter with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-15-jupiter-outer.md
  "JUPITER|conjunction|URANUS": {
    hook: "Your best breaks arrive out of nowhere. You've learned to keep a bag packed.",
    text: "Jupiter, the greater fortune, catches up with Uranus roughly every fourteen years, and your birth fell close to one of those catch ups. Luck for you tends to be sudden: the unexpected offer, the move that changes everything, the idea that takes off. You believe in freedom and progress, and you're happiest when life keeps opening new doors. Steady growth bores you a little.",
    short: ["adventurous", "progressive", "lucky in surprises"],
    watch: "leaping at every new door just because it's new.",
  },
  "JUPITER|sextile|URANUS": {
    hook: "You spot the new thing early, and you're usually glad you did.",
    text: "The link between Jupiter and Uranus gives you a nose for opportunity in change. New technology, new ideas and new places usually pay off for you. You're open minded without being reckless. Act on the hunches; this one pays when you move.",
    short: ["forward looking", "open", "inventive"],
    watch: "noticing the trend and leaving it to others.",
  },
  "JUPITER|square|URANUS": {
    hook: "You get restless when life gets comfortable, and that restlessness has taken you interesting places.",
    text: "Jupiter squaring Uranus pushes you toward big, sudden changes. You crave freedom and growth, sometimes at the same time, and you can bet on a new direction before the old one is finished. That gives you courage and a taste for adventure. It can also scatter your luck. The breakthroughs that last are the ones you stay with after the thrill wears off.",
    short: ["adventurous", "restless", "bold"],
    watch: "quitting the good thing for the exciting thing.",
  },
  "JUPITER|trine|URANUS": {
    hook: "Change tends to treat you well, and you've noticed.",
    text: "Jupiter and Uranus share an easy trine, so luck often arrives through the unexpected. You adapt quickly, you're open to new people and ideas, and fortunate surprises come more often than not. Your optimism has an inventive streak. Since change rarely hurts you, you can afford to take a bigger chance than you think.",
    short: ["lucky", "progressive", "adaptable"],
    watch: "waiting for luck to show up instead of chasing it.",
  },
  "JUPITER|opposition|URANUS": {
    hook: "Other people keep handing you surprising opportunities. Some of them are even the ones you wanted.",
    text: "With Jupiter and Uranus opposed, growth and disruption pull from opposite sides. Opportunities often arrive through others, and so do upsets. A stable, generous life appeals to you. So does total freedom. The skill is choosing which surprises to say yes to.",
    short: ["independent", "open", "adventurous"],
    watch: "saying yes to every new plan someone else brings.",
  },
  "JUPITER|conjunction|NEPTUNE": {
    hook: "You believe in something bigger than yourself, and it shows in how you treat people.",
    text: "You arrived during a Jupiter and Neptune meeting, a thirteen year event. Your faith, hope and imagination run large. You're compassionate, generous and drawn to art, spirituality or causes that help people. The best in the world is easy for you to find. The risk is finding it where it isn't.",
    short: ["idealistic", "compassionate", "inspired"],
    watch: "believing a promise because you want it to be true.",
  },
  "JUPITER|sextile|NEPTUNE": {
    hook: "Kindness comes back to you, often in ways you didn't expect.",
    text: "Generosity and imagination back each other up under this sextile. You're drawn to art, faith or service, and helping is where meaning shows up for you. People sense your goodwill. Give it a regular outlet and it grows.",
    short: ["kind", "imaginative", "hopeful"],
    watch: "keeping your ideals in your head instead of your calendar.",
  },
  "JUPITER|square|NEPTUNE": {
    hook: "Your heart is huge. Your budget, occasionally, is not.",
    text: "Jupiter squaring Neptune inflates your ideals. You're generous, idealistic and deeply compassionate, ready to give to anyone with a sad story or a beautiful dream. Wonderful friend, easy mark: both describe you. You may chase a vision that doesn't hold up, or overextend your trust and your money. Keep the faith, and keep the receipts.",
    short: ["generous", "idealistic", "imaginative"],
    watch: "giving more than you can afford to someone who won't give it back.",
  },
  "JUPITER|trine|NEPTUNE": {
    hook: "Your luck is the soft kind. It turns up when you're being kind.",
    text: "Jupiter and Neptune flow together. You're compassionate, imaginative and drawn to beauty and meaning. Faith, art, music or service often feel natural. Good things seem to come back around to you. Because this flows so freely, it's easy to stay dreamy instead of doing.",
    short: ["compassionate", "inspired", "gentle"],
    watch: "confusing good intentions with good results.",
  },
  "JUPITER|opposition|NEPTUNE": {
    hook: "You've been dazzled by a few people who couldn't deliver. You still believe in people, but now you check.",
    text: "Jupiter facing Neptune puts hope and illusion on opposite sides. Big promises, grand visions and inspiring people tend to arrive from outside, and some prove less solid than they looked. You're generous and idealistic, and belief comes easily. Learning where faith ends and evidence starts makes you wiser, and no less hopeful.",
    short: ["idealistic", "generous", "hopeful"],
    watch: "trusting the vision before you've seen the plan.",
  },
  "JUPITER|conjunction|PLUTO": {
    hook: "When you want something, you want all of it, and you usually get further than anyone expected.",
    text: "Once every twelve and a half years or so, Jupiter passes Pluto. You were born on one of the passes. Growth and power combine in you: big ambitions, deep convictions and a talent for transforming whatever you take on. You think in terms of influence and impact. The danger is overreach, wanting so much control or success that you forget why you started.",
    short: ["ambitious", "powerful", "determined"],
    watch: "confusing more power with more good.",
  },
  "JUPITER|sextile|PLUTO": {
    hook: "Growing things that matter, quietly and well, is your specialty.",
    text: "A Jupiter and Pluto sextile gives your ambitions depth. You see where real influence lies, and you can build it steadily. Research, finance, healing and leadership suit you. Act on the openings; they reward patience and nerve.",
    short: ["strategic", "resourceful", "focused"],
    watch: "thinking too small for what you can actually do.",
  },
  "JUPITER|square|PLUTO": {
    hook: "A little success won't do. You want to change things, and you're willing to fight for it.",
    text: "Jupiter squaring Pluto gives you drive on a large scale. You're ambitious, persuasive and intense about your beliefs. You may clash with powerful people or institutions, and you're not afraid to. That can make you a force for real change. It can also tip into overreach or zealotry. Your power is greatest when your aims are clear and your methods are fair.",
    short: ["ambitious", "intense", "persuasive"],
    watch: "believing the cause justifies any method.",
  },
  "JUPITER|trine|PLUTO": {
    hook: "Power comes to you without much drama, and you mostly use it well.",
    text: "Jupiter and Pluto support each other easily here. You have deep confidence, good instincts about money and influence, and setbacks that turn into growth. Serious responsibility finds its way to you. Since success comes this naturally, aim it at something worth transforming.",
    short: ["resourceful", "confident", "influential"],
    watch: "using your strength only for yourself.",
  },
  "JUPITER|opposition|PLUTO": {
    hook: "Powerful people and big opportunities find you. Reading the terms is a skill you've earned.",
    text: "Jupiter facing Pluto sets growth and control against each other. Opportunities often come with strings: a powerful partner, an influential boss, a deal that asks for something back. Other people's ambitions can carry you off. Once you decide what you want, you handle power well, yours and theirs.",
    short: ["ambitious", "perceptive", "resilient"],
    watch: "trading your independence for someone else's success.",
  },

  // Aspects A16, Saturn with Uranus, Neptune and Pluto (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-16-saturn-outer.md
  "SATURN|conjunction|URANUS": {
    hook: "You respect tradition, you'd like to tear it up, and you've found a way to do both.",
    text: "Saturn and Uranus meet only about every forty five years, and they were together when you were born. The old and the new are fused in you. You can build new things on solid foundations, reform a system from inside or bring discipline to a radical idea. You may feel the pull between security and freedom very sharply. When you combine them, you're the rare person who makes change last.",
    short: ["reforming", "disciplined", "original"],
    watch: "freezing between the safe choice and the bold one.",
  },
  "SATURN|sextile|URANUS": {
    hook: "You're good at updating old systems without breaking them.",
    text: "Saturn and Uranus cooperate lightly here. You respect what works and you're open to improving it. Practical innovation is your strength: new tools for old jobs, fresh structures that hold. People trust you to manage change sensibly. Take the lead when a system needs modernizing.",
    short: ["practical", "progressive", "sensible"],
    watch: "waiting for permission to improve things.",
  },
  "SATURN|square|URANUS": {
    hook: "Rules make you restless, and freedom makes you nervous. You've built a life that handles both.",
    text: "Saturn squaring Uranus sets security and change at odds. Holding on and breaking away take turns, or clash with authority while craving structure of your own. That tension can make you a powerful reformer, someone who knows exactly which rules are worth breaking. Progress comes in jolts, followed by careful rebuilding.",
    short: ["independent", "determined", "reforming"],
    watch: "rebelling against the very structure you need.",
  },
  "SATURN|trine|URANUS": {
    hook: "You make progress look orderly, which is a rare talent.",
    text: "Saturn and Uranus are on good terms in your chart. You can introduce change without chaos and keep structure without stiffness. Science, technology, organizing and long term reforms suit you. Your ideas are original and well built. Since this comes so naturally, don't underrate how useful it is to others.",
    short: ["innovative", "steady", "capable"],
    watch: "keeping your best ideas inside safe limits.",
  },
  "SATURN|opposition|URANUS": {
    hook: "The old guard and the rebels both want you on their side. You get to choose.",
    text: "Saturn opposing Uranus stretches you between tradition and revolution. Duty pulls one way, freedom the other, and sometimes each arrives as a person. That pressure teaches you to weigh change carefully. In the end you can bridge the two, the person who understands why the rules exist and why they need to change.",
    short: ["balanced", "independent", "principled"],
    watch: "letting other people define the fight for you.",
  },
  "SATURN|conjunction|NEPTUNE": {
    hook: "You try to make dreams real, and you've learned exactly how much work that takes.",
    text: "Saturn and Neptune meet about every thirty six years. Structure and imagination merge in you. You can give form to ideals: build the hospital, finish the film, turn faith into practice. You may also feel the gap between vision and reality keenly, with periods of doubt or disappointment. Your gift is patience with a dream. Keep both your discipline and your hope.",
    short: ["visionary", "disciplined", "compassionate"],
    watch: "giving up on an ideal because it took longer than you hoped.",
  },
  "SATURN|sextile|NEPTUNE": {
    hook: "You have a practical way of being kind.",
    text: "Saturn and Neptune link lightly, so ideals and structure help each other. You can organize compassion, run the volunteer schedule, budget for the dream. Art and service suit you when they come with a plan. People rely on your grounded idealism. Use it regularly.",
    short: ["grounded", "kind", "imaginative"],
    watch: "filing your dreams under \"someday.\"",
  },
  "SATURN|square|NEPTUNE": {
    hook: "You've lived through some disillusionment. You came out of it with clearer eyes and the same good heart.",
    text: "Saturn squaring Neptune puts reality and ideals in tension. You may doubt your dreams or feel that the world keeps falling short of what it could be. Boundaries can blur, then harden. The work is building something real that honors your ideals without pretending they're already true. When you manage it, you're unusually wise about both hope and limits.",
    short: ["idealistic", "realistic", "resilient"],
    watch: "swinging between cynicism and wishful thinking.",
  },
  "SATURN|trine|NEPTUNE": {
    hook: "You turn ideals into something you can actually build.",
    text: "Saturn trines Neptune here. You're practical about your dreams and imaginative about your work. Long creative projects, caring professions and anything that needs both vision and patience suit you. People trust you because your ideals come with follow through. Give the dream its due; you're well equipped to finish it.",
    short: ["practical", "imaginative", "dependable"],
    watch: "playing it so safe the dream never starts.",
  },
  "SATURN|opposition|NEPTUNE": {
    hook: "You've met realists and dreamers, and you've borrowed from both.",
    text: "Saturn opposing Neptune stretches you between duty and imagination. Other people may seem to carry one side: a strict authority and a lost cause, a practical partner and a dreamy friend. What's expected and what you long for rarely line up at first. Over the years you learn to give both a place, and you become someone who can hold a vision steady under pressure.",
    short: ["thoughtful", "compassionate", "steady"],
    watch: "letting others decide which part of you is real.",
  },
  "SATURN|conjunction|PLUTO": {
    hook: "Enduring and rebuilding: you've done both, more than once.",
    text: "Saturn and Pluto meet roughly every thirty three years. Structure and transformation combine in you. You take power seriously, you're resilient under pressure and you can tear down what isn't working and rebuild something stronger. Your life may include long, hard chapters. Each one tends to leave you more capable.",
    short: ["resilient", "serious", "powerful"],
    watch: "carrying burdens long after they're yours to carry.",
  },
  "SATURN|sextile|PLUTO": {
    hook: "You're good at building things that last, especially under pressure.",
    text: "Saturn and Pluto cooperate lightly. You have discipline and depth, and you handle responsibility and power well. Organizing, managing and rebuilding suit you. When a structure needs reform, you know where to begin. Take the hard projects; they suit you.",
    short: ["disciplined", "resourceful", "steady"],
    watch: "taking on everyone's load because you're the one who can.",
  },
  "SATURN|square|PLUTO": {
    hook: "Pressure doesn't break you. It shapes you.",
    text: "Saturn squaring Pluto brings power and structure into conflict. You may have faced hard limits or strong authority early, and you learned endurance and control. You can be tough, ambitious and very hard to defeat. The shadow is rigidity, holding so tightly to control that change becomes a crisis. Your strength grows when you let old structures go before they're pried away.",
    short: ["tough", "determined", "enduring"],
    watch: "confusing control with safety.",
  },
  "SATURN|trine|PLUTO": {
    hook: "You have deep reserves of strength, and you use them wisely.",
    text: "With Saturn and Pluto trine, endurance comes without strain. You're disciplined, focused and able to work steadily toward big goals. Power and responsibility sit naturally with you, and you handle crises calmly. People trust you to manage serious things. Aim this steady strength at something worth building.",
    short: ["steady", "resourceful", "determined"],
    watch: "settling for stability when transformation is possible.",
  },
  "SATURN|opposition|PLUTO": {
    hook: "You've stood up to powerful forces, and you're still standing.",
    text: "Saturn opposing Pluto sets duty and power against each other. Strong authorities, hard circumstances or intense people may test your limits. You can feel pressured from outside, or caught between obligation and the need to change. Under that pressure you develop real endurance. With time you claim your own authority, steady and hard to shake.",
    short: ["resilient", "principled", "strong"],
    watch: "fighting a battle that isn't yours.",
  },

  // Aspects A17, generational notes (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-17-outer-generational.md
  // Aspects A17, generational notes (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-17-outer-generational.md
  "URANUS|conjunction|NEPTUNE": {
    hook: "Anyone born from about 1989 to 1997 has this one. Your generation treats the edges of things as optional.",
    text: "Uranus breaks patterns and Neptune dissolves edges, and here they sit together. Lines between real and virtual, between categories, between what's possible and what's imagined feel negotiable to the people who carry it. That's a creative gift and an occasional source of fog.",
    short: ["imaginative", "fluid", "idealistic"],
    watch: "losing track of what's real in a world that blurs it.",
  },
  "URANUS|sextile|NEPTUNE": {
    hook: "A quiet link between change and imagination: reform with a vision, invention with a heart.",
    text: "The late 1960s had it, roughly 1964 to 1969, and it returned in 2024. It doesn't shout. It shows up as a generation's knack for giving ideals new forms.",
    short: ["inventive", "idealistic", "open"],
    watch: "leaving the vision to someone else.",
  },
  "URANUS|square|NEPTUNE": {
    hook: "Rebellion and faith pull at each other in this one, and both run strong.",
    text: "It belongs to the 1950s, about 1950 through 1959. The people born then share a habit of questioning what they're told to believe, and a hunger to believe in something anyway.",
    short: ["questioning", "searching", "idealistic"],
    watch: "trading one illusion for another.",
  },
  "URANUS|trine|NEPTUNE": {
    hook: "New ways to dream, and new dreams to chase.",
    text: "Births from about 1935 to 1947 carry this easy trine between change and imagination. It reads as openness to new ideals and creative ways of living them.",
    short: ["visionary", "adaptable", "hopeful"],
    watch: "expecting change to arrive on its own.",
  },
  "URANUS|opposition|NEPTUNE": {
    hook: "Freedom and faith stand facing each other here.",
    text: "Those born roughly 1902 to 1914 share it: the pull of revolution and the pull of ideals, often at odds. It marks a generation that stood between an old world and a new one.",
    short: ["principled", "searching", "resilient"],
    watch: "feeling torn between what's new and what's sacred.",
  },
  "URANUS|conjunction|PLUTO": {
    hook: "A generation built to overturn things and remake them from the ground up.",
    text: "Uranus joined Pluto across the mid to late 1960s, about 1962 to 1969. Sudden change and deep transformation fuse in the people born then, and old structures rarely survive their attention unchanged.",
    short: ["radical", "transformative", "intense"],
    watch: "tearing down without a plan to rebuild.",
  },
  "URANUS|sextile|PLUTO": {
    hook: "Change and power cooperate here: reform that sticks, innovation that goes deep.",
    text: "Two recent stretches carry it, the early 1940s (about 1942 to 1946) and the 1990s (about 1992 to 2000). It's a talent for changing things without wrecking them.",
    short: ["resourceful", "reforming", "steady"],
    watch: "waiting for permission to change what needs changing.",
  },
  "URANUS|square|PLUTO": {
    hook: "Upheaval and reinvention, with a refusal to accept the old order.",
    text: "The 1930s had it, about 1929 to 1937, and so did 2008 to 2019. Sudden change grinds against deep power, and the age groups born under it tend to come of age pushing hard on the systems around them.",
    short: ["bold", "resilient", "transformative"],
    watch: "treating every system as something to fight.",
  },
  "URANUS|trine|PLUTO": {
    hook: "An easy talent for reinvention.",
    text: "It covered roughly 1918 to 1925 and returned in 2024. Sudden change and deep transformation flow together, so deep change can look natural.",
    short: ["innovative", "resilient", "capable"],
    watch: "assuming change will always go your way.",
  },
  "URANUS|opposition|PLUTO": {
    hook: "The urge to break free, and the knowledge of how hard power pushes back.",
    text: "Revolution and control face each other in the charts of those born roughly 1899 to 1905. The generation carries both sides of that standoff.",
    short: ["determined", "independent", "tested"],
    watch: "fighting the same battle on every front.",
  },
  "NEPTUNE|conjunction|PLUTO": {
    hook: "One of the rarest meetings in the sky, about once every five centuries.",
    text: "The last one covers births from about 1885 to 1898. Dream and transformation merge, and the ideals of that generation ran deep.",
    short: ["visionary", "transformative", "profound"],
    watch: "believing in a vision so completely you stop questioning it.",
  },
  "NEPTUNE|sextile|PLUTO": {
    hook: "You share this with most people alive today.",
    text: "It covers nearly everyone born from 1943 to 1996, and it came back in 2018. Dream and power support each other quietly, the long background hum of several generations. On its own it says almost nothing about you in particular.",
    short: ["imaginative", "resilient", "quietly deep"],
    watch: "assuming a shared trait is a personal one.",
  },
  "NEPTUNE|square|PLUTO": {
    hook: "Ideals and power struggling against each other.",
    text: "In the data it marks births from about 1808 to 1827. That generation felt both the pull of visions and the force of change.",
    short: ["searching", "intense", "resilient"],
    watch: "letting a cause become a compulsion.",
  },
  "NEPTUNE|trine|PLUTO": {
    hook: "Ideals and power moving in step.",
    text: "Most of the 1700s carried it, roughly 1707 to 1793. Imagination and transformation flow easily together, which gives a deep, steady sense of purpose.",
    short: ["purposeful", "deep", "imaginative"],
    watch: "taking a shared vision for granted.",
  },
  "NEPTUNE|opposition|PLUTO": {
    hook: "A long standoff between ideals and transformation.",
    text: "This one is very rare: in the charts on this site it turns up only for births in the 1640s. Dream and power face off.",
    short: ["profound", "intense", "visionary"],
    watch: "feeling caught between what you believe and what you can change.",
  },

  // Aspects A18, planets on the North Node (owner approved 11/20): docs/redesign/drafts/2026-11-20-aspects-18-north-node.md
  "SUN|conjunction|NORTH_NODE": {
    hook: "You were born in an eclipse season, when the Sun lines up with the Moon's path. Your direction and your identity line up.",
    text: "The North Node marks where you're growing, and your Sun, the self you're becoming, sits right on it. Lilly counted the Dragon's Head as a fortune that adds to whatever good it touches, and here it touches the center of the chart. Becoming more fully yourself is the growth. People often sense you're headed somewhere. The pull backward is toward the South Node's old comfort, the sign and house opposite, where you can hide in what's easy.",
    short: ["purposeful", "visible", "growing"],
    watch: "retreating into the familiar when being seen gets uncomfortable.",
  },
  "MOON|conjunction|NORTH_NODE": {
    hook: "What you need and where you're headed turn out to be the same thing.",
    text: "Following your feelings tends to move you forward, because your Moon is on the node. Home, care, family and emotional honesty are part of your growth, not a distraction from it. You may be unusually in tune with what people around you need, and with the mood of your times. Across the chart, the South Node keeps an older habit: shutting feelings down to get things done. Trusting your instincts is the stretch, and it pays.",
    short: ["intuitive", "responsive", "warm"],
    watch: "overriding your gut because logic feels safer.",
  },
  "MERCURY|conjunction|NORTH_NODE": {
    hook: "Learning, talking and writing aren't just things you do. They're where you're going.",
    text: "With Mercury on the Dragon's Head, your mind is aimed at your growth edge. Ideas, questions, conversations and the right words open doors for you. You may find your path through teaching, writing or connecting people. Your old comfort, back at the South Node, is staying quiet or sticking to what you already know. Ask the question. Send the message. Your voice is part of the way forward.",
    short: ["curious", "communicative", "quick to learn"],
    watch: "keeping quiet in the moments your voice is needed.",
  },
  "VENUS|conjunction|NORTH_NODE": {
    hook: "Love, beauty and friendship are where your life is growing.",
    text: "Venus is one of Lilly's two fortunes, and he said the Dragon's Head increases the good of the good planets. Here they're together. Relationships, art, pleasure and the things you value move you forward, and opening your heart tends to pay off. You may be drawn to people and beauty that feel new and a little unfamiliar. When love feels risky, you lean back toward the South Node's old ease.",
    short: ["affectionate", "artistic", "magnetic"],
    watch: "retreating to old habits when love asks you to stretch.",
  },
  "MARS|conjunction|NORTH_NODE": {
    hook: "Courage is the direction you're headed. Every time you act, you move forward.",
    text: "Taking action, standing up for yourself and chasing what matters are part of your growth, with Mars on the node. Lilly said the Dragon's Head softens the harder planets, and Mars was the hardest of all, so here his drive tends to come out constructive rather than reckless. Competition, physical challenges and bold choices suit you. The pull backward is the South Node's habit of waiting, yielding or dodging conflict.",
    short: ["brave", "driven", "decisive"],
    watch: "holding back when the moment calls for action.",
  },

  // Angles AN1, squares to the Midheaven (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-01-squares-mc.md
  "SUN|square|MC": {
    hook: "You want to be recognized for who you really are, not for the role you were handed.",
    text: "The Sun, the self you're becoming, squares your Midheaven, and so the point opposite it, home and roots, as well. Lilly counted the Sun as one of the planets that do the 10th house the most good, but at this angle it pushes rather than settles: your identity and your public path don't line up automatically. You may change direction more than once before the work fits the person. Home and family can pull against ambition too. The friction is useful. It keeps you from settling for a career that isn't yours.",
    short: ["ambitious", "self directed", "restless"],
    watch: "choosing a path to prove something instead of to be someone.",
  },
  "MOON|square|MC": {
    hook: "Your feelings have a vote in your career, and they use it.",
    text: "Needs and ambitions keep tugging across the chart, with the Moon at right angles to your Midheaven. Home, family and comfort pull one way, work and reputation the other, and moods can shape your choices more than a résumé would ever show. You do your best work somewhere that feels emotionally right. When it doesn't, you know quickly. Build a home base that steadies you, and the career gets easier.",
    short: ["responsive", "caring", "intuitive"],
    watch: "making big career moves on a bad day.",
  },
  "MERCURY|square|MC": {
    hook: "Your career runs on talking, writing and thinking, and it changes as often as your mind does.",
    text: "Lilly gave Mercury \"the Wisdome and parts of the mind,\" and here it pushes against your public direction. You may juggle more than one line of work, or wrestle with how to say what you do. Ideas come fast, and they don't always match what the job wants. Plans made at the kitchen table get rewritten at the office. Your edge is adaptability. Find work where your quick mind is the asset, not the distraction.",
    short: ["versatile", "articulate", "inventive"],
    watch: "spreading yourself across too many directions.",
  },
  "VENUS|square|MC": {
    hook: "You want work that's pleasant, and you won't pretend otherwise.",
    text: "Venus, Lilly's planet of \"the Delight,\" pulls at a right angle to your public life. Pleasure, beauty and relationships pull against duty and ambition. Creative or social work tends to call you, and love and career can compete for the same hours. Charm helps you professionally, sometimes more than you realize. The tension asks you to take your own enjoyment seriously, as a guide, not a distraction.",
    short: ["charming", "artistic", "sociable"],
    watch: "letting the easy option outrank the meaningful one.",
  },
  "MARS|square|MC": {
    hook: "Nobody handed you your place. You took it, one fight at a time.",
    text: "Drive and the public world clash here. Lilly's Mars brings \"the Strength of body to endure,\" and you've needed it: rivals, demanding bosses or a home life that pushed you out early. You work hard and compete hard. Conflict with authority can flare up. Point the energy at a goal you chose, and you'll get further than anyone who had it easy.",
    short: ["driven", "competitive", "tireless"],
    watch: "turning every boss into an opponent.",
  },
  "JUPITER|square|MC": {
    hook: "You aim high, and there's always another, higher goal behind the last one.",
    text: "Jupiter, one of the planets Lilly said fortunes the house of career, squares it here instead, so growth comes with overreach. You aim high, take on a lot and expect things to work out, and often they do. The risk is taking on too much at work or at home, or promising more than any schedule allows. Choose fewer, larger goals and give them everything.",
    short: ["ambitious", "optimistic", "generous"],
    watch: "overcommitting because every opportunity looks golden.",
  },
  "SATURN|square|MC": {
    hook: "Nothing about your career came easy. That's exactly why it holds.",
    text: "Saturn pulls on both ends of the career and home axis. Lilly said Saturn in the 10th limits honor, and the square can feel similar: delays, demanding authority figures, responsibilities at home that slowed your start. It builds remarkable patience and skill. Your success tends to arrive later and last longer. Keep going, and go easier on yourself on the way.",
    short: ["persistent", "responsible", "hardworking"],
    watch: "waiting for permission you already earned.",
  },
  "URANUS|square|MC": {
    hook: "You've changed careers, or at least wanted to, more than once. Each change made sense at the time.",
    text: "Your public path has sudden turns: Uranus squares the Midheaven. Conventional jobs and rigid bosses make you restless, and home life may have been unsettled too. You do your best work with freedom: freelancing, inventing, working in fields that are still being made up. Expect the twists. They tend to lead somewhere interesting.",
    short: ["independent", "inventive", "unconventional"],
    watch: "quitting before you've built what you came for.",
  },
  "NEPTUNE|square|MC": {
    hook: "You want your work to mean something. Plain ambition has never been enough.",
    text: "With Neptune square the Midheaven, your sense of direction can blur. You may be unsure what you're meant to do, drawn to art, care or ideals, or disillusioned by a job that looked better from outside. Home life can feel hazy at times too. The gift is vision: you can see what work could be. Pair it with clear plans and honest advice from people you trust.",
    short: ["idealistic", "creative", "compassionate"],
    watch: "choosing a dream job you haven't actually looked at closely.",
  },
  "PLUTO|square|MC": {
    hook: "Power and your public life have a complicated history, and you've learned a lot from it.",
    text: "Career and family can both bring power struggles when Pluto squares the Midheaven. You may have clashed with controlling authorities or carried heavy pressure at home. That forged an intense, determined drive. You don't want a job; you want impact. Your career may go through complete reinventions. Each one tends to leave you stronger.",
    short: ["intense", "determined", "transformative"],
    watch: "turning every workplace into a power struggle.",
  },

  // Angles AN2, squares to the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-02-squares-asc.md
  "SUN|square|ASC": {
    hook: "The person you are and the person people meet aren't quite the same, and you've noticed the gap.",
    text: "Your core self and your first impression don't match up neatly; the Sun sits square to the rising point. People may read you as more of one thing than you feel inside. Partners often draw out the side of you that the first impression hides. Over time you close the gap by showing more of what's under the surface, and people respond to the real thing.",
    short: ["strong willed", "complex", "ambitious"],
    watch: "performing a version of yourself you've outgrown.",
  },
  "MOON|square|ASC": {
    hook: "Your face tells people how you feel, sometimes before you know yourself.",
    text: "Your moods sit close to the surface, crossing the way you present. You can't always keep a professional mask on, and partners feel your emotional weather quickly. That makes you sincere and easy to read, which most people find warm. It can also leave you feeling exposed. Give yourself private time to settle before big meetings or hard conversations.",
    short: ["sincere", "sensitive", "expressive"],
    watch: "letting a mood make the first impression for you.",
  },
  "MERCURY|square|ASC": {
    hook: "You talk your way into rooms and, now and then, into trouble.",
    text: "Lilly said Mercury rejoices in the 1st house, and here it squares the rising point instead, so thinking and manner don't always cooperate. You think fast, speak quickly and may say more than you planned. Debate comes naturally with partners and rivals. People see you as clever and restless. Slow the first sentence down, and the rest will land better.",
    short: ["quick", "talkative", "sharp"],
    watch: "answering before you've listened.",
  },
  "VENUS|square|ASC": {
    hook: "You're charming, and you're never entirely sure people like you for the right reasons.",
    text: "Venus squares the rising point, and the wish to please competes with the wish to be yourself. You care how you look and how you're received, and you can bend to suit a partner more than you mean to. Your taste and warmth are real assets. The work is letting people see your edges too.",
    short: ["charming", "attractive", "accommodating"],
    watch: "reshaping yourself to be liked.",
  },
  "MARS|square|ASC": {
    hook: "You come across as more intense than you feel, and people step back a little.",
    text: "Lilly's Mars is blunt and quick to take offense, and from this angle it shapes first impressions. You're direct, energetic and ready to push, and partners and rivals feel it. Conflict can find you even when you didn't go looking. Physical activity and clear goals keep the edge useful.",
    short: ["energetic", "direct", "bold"],
    watch: "meeting a challenge with a fight it didn't need.",
  },
  "JUPITER|square|ASC": {
    hook: "You fill a room. Sometimes more of it than you meant to.",
    text: "With Jupiter square the rising point, your presence comes across large: generous, confident, a little more than people expected. You're quick to promise and quick to help, with partners and strangers alike. That warmth wins friends. It can also lead to overcommitting or overselling yourself. Let your size come from substance and it never feels like too much.",
    short: ["generous", "outgoing", "confident"],
    watch: "promising more than you can show up for.",
  },
  "SATURN|square|ASC": {
    hook: "People take you seriously the moment they meet you, even when you're joking.",
    text: "Saturn's square makes your first impression careful and reserved. Maybe you were self conscious early, or carried responsibility young, and it shows as a guarded, steady presence. Partners can feel like tests, or like teachers. Your reliability is a gift. Let people see the warmth behind it sooner.",
    short: ["reserved", "dependable", "serious"],
    watch: "holding back so long people stop trying.",
  },
  "URANUS|square|ASC": {
    hook: "People never quite know what you'll do next. Neither, sometimes, do you.",
    text: "Your manner has a sudden, unconventional streak, courtesy of Uranus. You need room in relationships and resist anyone who tries to pin you down. Your style may change without warning. People find you interesting, occasionally unsettling. Freedom with honesty works far better for you than freedom by disappearing.",
    short: ["original", "independent", "surprising"],
    watch: "pulling away the moment someone gets close.",
  },
  "NEPTUNE|square|ASC": {
    hook: "People see in you whatever they're hoping to see, and it takes a while for them to meet the real you.",
    text: "Neptune blurs your outline from this angle. You're gentle, imaginative and hard to pin down, and partners may project their dreams onto you, or you onto them. You can drift into roles that don't suit you. Clear boundaries, and saying plainly what you want, help the real person come through.",
    short: ["gentle", "imaginative", "elusive"],
    watch: "becoming whoever the other person needs.",
  },
  "PLUTO|square|ASC": {
    hook: "You come across as intense even when you're relaxed, and people tend to remember you.",
    text: "There's a depth to your presence that people feel before they understand it. That's Pluto at work. Relationships can turn into power struggles, and you may have learned early to guard yourself. You can transform how you present more than once in a lifetime. When you trust people, your intensity becomes magnetism instead of armor.",
    short: ["intense", "magnetic", "private"],
    watch: "testing people before letting them in.",
  },

  // Angles AN3, planets on the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-03-conj-asc.md
  "SUN|conjunction|ASC": {
    hook: "You walk in and the room reorganizes around you. You didn't ask it to.",
    text: "With the Sun on the rising point, your whole self is at the front door. There's no gap between the inside and the impression; people get the real thing on the first meeting. Lilly gave the Sun a gravity of manner mixed with pleasantness, and that's the impression: warm, a little commanding, hard to overlook. You tend to lead without trying. The risk is that being seen becomes a need, and quiet seasons feel like failure.",
    short: ["radiant", "confident", "direct"],
    watch: "needing the spotlight to feel like yourself.",
  },
  "MOON|conjunction|ASC": {
    hook: "You can't hide a feeling to save your life, which is exactly why people believe you.",
    text: "Your feelings lead, with the Moon rising. People sense right away that you care, and they open up. Your face is expressive, your moods visible, and your first reactions honest. You pick up on the atmosphere of a room the moment you enter it. That makes you approachable and comforting. It also means you need somewhere private to put the feelings you collect.",
    short: ["approachable", "caring", "responsive"],
    watch: "taking on every mood in the room as your own.",
  },
  "VENUS|conjunction|ASC": {
    hook: "People like you before you've said a word, and you've always been a little suspicious of that.",
    text: "Venus rising with you, Lilly's planet of delight, makes you pleasant, graceful and easy to meet. You care about how things look, including you, and putting people at ease comes naturally. Doors open more easily than they do for most. Your challenge is being taken seriously past the charm, and letting yourself be disliked now and then.",
    short: ["charming", "graceful", "welcoming"],
    watch: "keeping everyone comfortable at the cost of honesty.",
  },
  "MARS|conjunction|ASC": {
    hook: "You don't enter rooms. You arrive.",
    text: "Drive and courage sit right on the surface here. You move quickly, speak plainly and act before others have finished deciding. Lilly gave Mars \"the Strength of body to endure,\" and people read you as tough, energetic, ready for a challenge. You're a natural at competition and anything physical. Your temper may show faster than you'd like, and it cools just as fast.",
    short: ["bold", "energetic", "forthright"],
    watch: "coming on so strong people brace before you've meant anything by it.",
  },
  "SATURN|conjunction|ASC": {
    hook: "You were the serious kid. Now you're the person everyone trusts to handle it.",
    text: "Saturn rising with you makes your first impression reserved, careful and older than your years. People sense you won't waste their time. Maybe you felt awkward or watched as a child, and learned to hold yourself carefully. Patient and careful, Lilly's two words for a well placed Saturn, describe how you carry yourself. You often grow more relaxed and more confident with age.",
    short: ["reserved", "dependable", "composed"],
    watch: "keeping your guard up long after it's needed.",
  },
  "URANUS|conjunction|ASC": {
    hook: "You've never once blended in, even when you tried.",
    text: "Something unusual comes first when Uranus is rising: a look, a manner, a way of speaking that people remember. You need freedom to be yourself and you resist being defined by anyone. You may reinvent your image more than once. People find you exciting or baffling, and the right ones find you both. Being different is your calling card.",
    short: ["original", "independent", "electric"],
    watch: "rebelling against expectations nobody actually had.",
  },
  "NEPTUNE|conjunction|ASC": {
    hook: "People describe you differently depending on who's describing.",
    text: "Neptune rising with you softens your outline. Gentle, dreamy, hard to read: that's the impression, and people project what they want onto you. You're sensitive to atmosphere and good at blending in, which suits acting, art and caring work. The challenge is keeping your own shape around other people. Strong friendships and clear habits keep you anchored.",
    short: ["gentle", "imaginative", "chameleon like"],
    watch: "letting other people decide who you are.",
  },
  "PLUTO|conjunction|ASC": {
    hook: "You've walked into rooms and watched people go quiet. You still aren't sure why.",
    text: "Pluto rising with you gives you a presence people feel before they understand it: intense, private, magnetic. You notice what others hide and keep your own cards close. You may reinvent yourself completely more than once. People either trust you deeply or keep their distance. Let a few in, and your intensity becomes one of the most loyal forces they've known.",
    short: ["intense", "perceptive", "magnetic"],
    watch: "guarding yourself so well no one gets to know you.",
  },

  // Angles AN4, planets on the Midheaven (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-04-conj-mc.md
  "SUN|conjunction|MC": {
    hook: "You were made to be seen doing the thing you're best at.",
    text: "Your identity is on public display, with the Sun right on the Midheaven. Lilly said the Sun does much good in the house of honor, and you likely feel drawn to a visible role: leading, performing, building a name. Recognition matters to you, and your work feels like a direct expression of who you are. The risk is letting who you are rise and fall with your public success.",
    short: ["ambitious", "visible", "purposeful"],
    watch: "measuring your worth by your title.",
  },
  "MOON|conjunction|MC": {
    hook: "The public knows how you feel. That's often why they trust you.",
    text: "Your emotional life shows in your public one when the Moon is this high. Work that involves caring, feeding, housing or understanding people suits you, and your reputation tends to rest on the comfort you give. Careers can shift with your needs and moods. Your gift is connection with the public. Guard some privacy for yourself.",
    short: ["caring", "responsive", "relatable"],
    watch: "letting public moods decide your private ones.",
  },
  "MERCURY|conjunction|MC": {
    hook: "You're known for what you say, and you probably say a lot of it.",
    text: "Lilly gave Mercury \"the Wisdome and parts of the mind,\" and sitting on your Midheaven it points your calling toward words, ideas and connections. Writing, teaching, speaking, selling, analyzing: whatever the title, the work runs on your mind. You may do several things at once or change direction often. Your public voice is a real asset. Make sure it's saying what you actually think.",
    short: ["articulate", "clever", "versatile"],
    watch: "juggling so many projects none gets your best.",
  },
  "VENUS|conjunction|MC": {
    hook: "You're liked in public, and your work tends to make things more beautiful.",
    text: "Venus, Lilly's planet of \"the Delight,\" crowns your chart, pointing your calling toward art, beauty, hospitality, diplomacy or anything that brings people pleasure. Charm helps your standing, and people tend to root for you. Your career may grow through relationships as much as skill. Let your taste lead; it's one of your strongest assets.",
    short: ["charming", "artistic", "well liked"],
    watch: "choosing the pleasant job over the fulfilling one.",
  },
  "MARS|conjunction|MC": {
    hook: "You built your reputation by doing the hard thing first.",
    text: "Mars on the Midheaven points your career toward action. Your calling may involve competition, physical skill, leadership, emergencies or building things. You're known for drive and courage, and you don't wait for permission. Clashes with authority can happen. Over time, you often become the authority.",
    short: ["driven", "courageous", "enterprising"],
    watch: "winning the job by burning the bridges.",
  },
  "JUPITER|conjunction|MC": {
    hook: "Opportunities find you in public, and you're generous with them.",
    text: "Jupiter sits on your Midheaven, the other planet Lilly said does much good in the house of honor. Your reputation tends to grow with ease: people believe in you, mentors open doors, and your work often involves teaching, law, travel, publishing or anything that widens other people's world. You're known for generosity and vision. The risk is overreaching, since success can come quickly.",
    short: ["successful", "generous", "respected"],
    watch: "assuming the next opportunity will be as easy as the last.",
  },
  "SATURN|conjunction|MC": {
    hook: "Your success came late and slow, and nobody can take it from you.",
    text: "Saturn on the Midheaven is the placement Lilly said limits honor. You'll recognize the pattern: delays, demanding bosses, a sense that recognition has to be earned twice. That pressure builds real authority. You're known for reliability, discipline and competence, and you often rise to the top of whatever you commit to, eventually. Keep your integrity. It's what your reputation rests on.",
    short: ["disciplined", "respected", "enduring"],
    watch: "working so hard for recognition you forget to enjoy it.",
  },
  "NEPTUNE|conjunction|MC": {
    hook: "Your public image has a haze around it, and you've figured out how to use it.",
    text: "Neptune on the Midheaven softens how the world sees you. Art, film, music, healing or spiritual work may call you, and your reputation can carry a touch of glamour or mystery. Career direction can stay unclear for years. When it settles, you're often doing work that inspires people. Be careful with contracts and promises; get it in writing.",
    short: ["inspired", "artistic", "compassionate"],
    watch: "drifting in your career while waiting for the dream job.",
  },
  "PLUTO|conjunction|MC": {
    hook: "You're known for intensity, and your career has died and been reborn more than once.",
    text: "Pluto crowning the chart points your calling toward power and transformation. You're drawn to work with real stakes: research, crisis, finance, psychology, reform, anything that changes things at the root. People sense your influence. Your public life may go through dramatic upheavals, and you come back from them stronger. Use the power responsibly, and it lasts.",
    short: ["powerful", "determined", "transformative"],
    watch: "needing control of every situation you're in.",
  },

  // Angles AN5, planets opposite the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-05-opp-asc.md

  // Angles AN5, planets opposite the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-05-opp-asc.md
  "SUN|opposition|ASC": {
    hook: "You come alive in partnership. Some of your best qualities only show up when someone else is in the room.",
    text: "The Sun sits on your Descendant, across from your rising sign, so you find yourself through other people. Partners, collaborators and close rivals reflect who you are back to you. Strong, confident people pull you in, and sometimes you hand them a spotlight you could share. Work with a partner suits you. The growth is owning your own light, not only admiring it in someone else.",
    short: ["cooperative", "loyal", "warm"],
    watch: "letting a partner carry the parts of you that are yours to live.",
  },
  "MOON|opposition|ASC": {
    hook: "You need people, and you're honest about it.",
    text: "The Moon on your Descendant, its natural house in Lilly's table, makes partnership an emotional need. You feel most secure with someone close, and you're tuned to partners' moods, sometimes more than your own. You're nurturing and attentive. The work is not letting your sense of safety depend entirely on one person's attention.",
    short: ["devoted", "caring", "responsive"],
    watch: "losing your own mood inside someone else's.",
  },
  "MERCURY|opposition|ASC": {
    hook: "Your sharpest ideas show up mid conversation, so you pick people who can keep up.",
    text: "Your mind does its best work through others, with Mercury on the Descendant. Talking things through, debating and working out ideas with a partner are where you shine. You're drawn to clever, talkative people. Negotiation, consulting and anything one on one suit you. The risk is letting someone else's opinion stand in for your own.",
    short: ["communicative", "diplomatic", "curious"],
    watch: "deciding what you think only after hearing what they think.",
  },
  "VENUS|opposition|ASC": {
    hook: "Love finds you more easily than most, and you've always had an eye for a good partner.",
    text: "Venus on your Descendant brings warmth and grace to your relationships. You attract kind, attractive people and you're a generous, considerate partner. Collaboration and diplomacy come naturally. You may define yourself through relationships more than you realize. Keep some pleasures that are just yours.",
    short: ["affectionate", "diplomatic", "charming"],
    watch: "needing a relationship to feel complete.",
  },
  "MARS|opposition|ASC": {
    hook: "The people you're drawn to tend to push back, and you like that more than you admit.",
    text: "Energy and friction come through others with Mars at the setting point. Lilly named Mars in the 7th as a source of trouble, and in practice it shows as passion and conflict mixed together: bold partners, fierce rivals, relationships that push you. You may let others express the anger you don't. Owning your own fire makes your partnerships steadier and more exciting at once.",
    short: ["passionate", "assertive", "spirited"],
    watch: "picking fights through other people.",
  },
  "JUPITER|opposition|ASC": {
    hook: "Other people tend to be lucky for you, and you're generous right back.",
    text: "Good fortune tends to come through partners and collaborators, Jupiter's gift from the 7th. You attract generous, optimistic people, and partnerships often open doors. You're a warm and giving partner yourself. The risk is expecting a relationship to make everything better, or overpromising to someone you love.",
    short: ["generous", "sociable", "fortunate"],
    watch: "expecting a partner to supply the faith you could give yourself.",
  },
  "SATURN|opposition|ASC": {
    hook: "Commitment is a serious word to you, and you've been willing to wait for the right people.",
    text: "Saturn at the setting point puts weight on partnership. Lilly read Saturn in the 7th as a sign of difficulty, and in modern terms it shows as caution, delays or relationships with heavy responsibilities. Older or more serious partners often appeal. You're loyal and committed, and what you build with people gets stronger with time. Let them be enjoyable as well as solid.",
    short: ["loyal", "committed", "mature"],
    watch: "treating love like a duty to be performed.",
  },
  "URANUS|opposition|ASC": {
    hook: "Your relationships never follow the usual script, and you prefer it that way.",
    text: "With Uranus across from your rising sign, surprise comes through other people. You attract independent, unusual people, and relationships can begin or end suddenly. You need a partner who gives you room, and you give room back. Conventional arrangements may never suit you. When both people have freedom, the bond lasts.",
    short: ["independent", "unconventional", "open minded"],
    watch: "choosing partners who are already halfway out the door.",
  },
  "NEPTUNE|opposition|ASC": {
    hook: "You fall for people's potential, and sometimes they rise to it.",
    text: "Neptune on your Descendant softens the line between you and your partners. You're drawn to dreamers, artists and those who need help, and relationships can feel spiritual, romantic or confusing. You give a great deal. Keep your eyes open as well as your heart, and choose people who show you who they are.",
    short: ["romantic", "compassionate", "devoted"],
    watch: "rescuing someone instead of partnering with them.",
  },
  "PLUTO|opposition|ASC": {
    hook: "Every close relationship leaves you a different person, and you wouldn't undo one.",
    text: "Intensity arrives through others when Pluto opposes the rising sign: powerful partners, deep bonds, rivals who test you. Control and trust are the lessons, usually learned inside a relationship. You're drawn to depth, never small talk. When you meet someone as an equal, the bond is profound.",
    short: ["intense", "loyal", "transformative"],
    watch: "giving your power away to keep someone close.",
  },

  // Reading angles AN6, planets opposite the Midheaven (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-06-opp-mc.md
  "SUN|opposition|MC": {
    hook: "Your proudest work happens where nobody is keeping score.",
    text: "The Sun at the bottom of the chart burns underground. Lilly made the Sun the natural partner of this angle and said it does no harm there; he read it as a father \"of a noble disposition.\" Taken loosely, someone near the root of your life set a standard you still measure yourself against. Who you are rests on private things: a place, a circle, a craft you'd do unpaid. Public success matters less to you than people expect, and that frees you. The work is letting your light reach past your own front door.",
    short: ["steady", "private", "loyal"],
    watch: "hiding good work because no one asked to see it.",
  },
  "MOON|opposition|MC": {
    hook: "You can work anywhere, but you have to come back somewhere.",
    text: "With the Moon on the IC, the lowest point of the chart, your moods run on where you sleep. Lilly called this point the Angle of the Earth, and the Moon there needs ground under it: a place, a routine, the people who've known you longest. Ambition can wait; feeling settled can't. You may move more than most, looking for the right spot, or plant yourself early and refuse to budge. Your emotional life is the foundation the public one is built on, so guard it.",
    short: ["rooted", "protective", "intuitive"],
    watch: "letting a bad week in private sink a good season at work.",
  },
  "MERCURY|opposition|MC": {
    hook: "You think best alone, with your own books around you and no one waiting for an answer.",
    text: "With Mercury at the root of the chart, your mind works underground first. You research, remember and turn things over long before you say them in public. Lilly's list for this angle includes lands and \"all ancient Dwellings,\" and you may have a real feel for history: local stories, archives, the past of a place. Writing or working on your own terms suits you. The risk is keeping your best ideas in a drawer.",
    short: ["thoughtful", "studious", "private"],
    watch: "waiting for the perfect moment to share what you know.",
  },
  "VENUS|opposition|MC": {
    hook: "The prettiest room you'll ever make is one most people never see.",
    text: "Venus on the IC puts your taste under everything public. Lilly's list for this angle includes gardens, orchards and fields, and Venus there likes things that grow slowly and look good doing it. You want comfort before applause. Love tends to mean shared space: a lease, a table, a garden someone else helps plant. Your public life gets easier when the private one is sweet. Just don't save all the charm for the people who already have it.",
    short: ["affectionate", "gracious", "settled"],
    watch: "treating a pleasant private life as a reason to stay small.",
  },
  "MARS|opposition|MC": {
    hook: "You'd fight a whole city council over one tree on your street.",
    text: "Your fire lives at the low point of the chart, the far end from your public image. Lilly gave this angle land, houses and the tilling of the earth, and Mars there wants ground to defend: property, a project you own outright, the people under your roof. You work hardest on what's yours. Restlessness can show up as remodeling, moving or arguments where you live. Give the energy a job you own and the friction drops.",
    short: ["protective", "determined", "independent"],
    watch: "bringing the day's battles back with you every night.",
  },
  "JUPITER|opposition|MC": {
    hook: "Whatever you build tends to outlast the reason you built it.",
    text: "The great benefic does good work underground. Lilly gave this angle lands, houses and inheritance, and he counted Jupiter among the best signs for keeping an estate, so things you plant here tend to grow: property, a family business, a place people keep coming back to. Generosity starts at your door. You may care more about a full table than a big title, and that choice usually pays. The risk is stretching yourself thin looking after everybody.",
    short: ["generous", "hospitable", "grounded"],
    watch: "promising more help than one household can hold.",
  },
  "SATURN|opposition|MC": {
    hook: "You're good with old things: buildings, traditions, people who've been around a while.",
    text: "Saturn in the cellar of your chart makes your foundations serious. Lilly put \"all ancient Dwellings\" under this angle, and Saturn, the slowest of the old planets, is comfortable with whatever has stood a long time. You build slowly and you build for keeps. Security matters more to you than recognition, and you may take on responsibility for a place or a group earlier than you'd like. The reward comes late and lasts. Let some of it be fun.",
    short: ["patient", "responsible", "steady"],
    watch: "making your private life one more job.",
  },
  "URANUS|opposition|MC": {
    hook: "You've never wanted the life everyone else is saving up for.",
    text: "Uranus on the IC shakes the ground floor. Your foundations keep changing, or you keep changing them: new cities, odd living arrangements, work that needs a laptop and nothing else. Stability comes from freedom, not from staying put. You may feel more yourself in a borrowed apartment than anywhere you've owned. The task is giving yourself one steady thing to stand on, even if it's a habit and not an address.",
    short: ["independent", "inventive", "restless"],
    watch: "uprooting yourself just to avoid feeling stuck.",
  },
  "NEPTUNE|opposition|MC": {
    hook: "Somewhere in your head is a place you've never lived, and you keep trying to find it.",
    text: "With Neptune on the floor of the chart, the ground under you blurs into something like a dream. You may long for a place that feels right more than you've found one, or you make a space that's half sanctuary, half studio. Water, music and quiet help. Your private imagination feeds everything you show the world. Watch the line between the life you hope for and the one you have; both deserve your attention.",
    short: ["imaginative", "sensitive", "spiritual"],
    watch: "decorating a fantasy while the real place needs repair.",
  },
  "PLUTO|opposition|MC": {
    hook: "Your strength comes from somewhere you rarely talk about.",
    text: "Pluto buries its power deep when it sits at the base of the chart. Lilly said this angle shows \"the determination or end of any thing,\" how matters finally come out, and with Pluto there you tend to finish what others abandon. You rebuild from the ground up more than once. You share the foundations of your life with very few people. What you've come through quietly is the source of the steadiness others see.",
    short: ["resilient", "private", "deep"],
    watch: "holding the private world so tightly that nobody else can help.",
  },

  // Reading angles AN7, planets trine the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-07-trine-asc.md
  "SUN|trine|ASC": {
    hook: "People can tell what you're about within a few minutes, and they usually like it.",
    text: "Your core self and your first impression share an element, so there's little gap between your nature and your manner. Lilly counted the trine among the \"arguments of Love, Unity and Friendship,\" and here the friendship is between you and your own manner. From the rising sign the Sun usually lands in the 5th or 9th house, so play, creative work, travel and study bring out your best. Confidence arrives without forcing. Spend it backing things worth backing.",
    short: ["confident", "consistent", "warm"],
    watch: "coasting on a good first impression.",
  },
  "MOON|trine|ASC": {
    hook: "Your face shows what you feel, and somehow that works in your favor.",
    text: "With the Moon trine your rising sign, your feelings and your manner agree. People read you correctly, which makes you easy to trust. Instinct tends to steer you well, especially toward company and pleasure or toward new places and ideas, the 5th and 9th houses where the Moon usually sits from here. You're on friendly terms with your own moods, more than most people manage. Still, some of them deserve a second look before you act.",
    short: ["genuine", "approachable", "intuitive"],
    watch: "assuming everyone can read you as clearly as you read yourself.",
  },
  "MERCURY|trine|ASC": {
    hook: "You explain things so plainly that people forget they were ever confused.",
    text: "Mind and manner are linked when Mercury trines the rising sign. You say what you mean, and it comes out sounding like you. Teaching, writing, travel and anything with a learning curve fit you well; from this angle Mercury tends to land in the 9th or 5th house, the rooms for study and for play. Talk is one of your pleasures. The catch is cleverness standing in for depth.",
    short: ["articulate", "curious", "quick"],
    watch: "settling for the fast answer when the full one is close.",
  },
  "VENUS|trine|ASC": {
    hook: "You make a good first impression without trying, and a better second one.",
    text: "Grace shows in your manners, your clothes, the tone of your voice when Venus trines your rising sign. Lilly gave Venus the 5th house as her joy, \"the house of Pleasure, Delight and Merriment,\" and from here she often sits there, so art, music and good company come naturally. People want you around. That warmth can carry you past hard conversations, though, so have them anyway.",
    short: ["charming", "artistic", "kind"],
    watch: "using charm to skip what needs saying.",
  },
  "MARS|trine|ASC": {
    hook: "Courage shows up on time for you, and it brings the energy to back it.",
    text: "Mars in a trine to the rising sign hands you vigor you didn't have to earn. You chase your aims in the open, and it reads as confidence, not aggression. Sport, adventure, competitive games and causes you'd cross a country for all fit you. Lilly's trine is an aspect of friendship, so this is Mars on your side: drive without the usual collisions. The limit is your calendar.",
    short: ["energetic", "brave", "decisive"],
    watch: "starting three things for every one you finish.",
  },
  "JUPITER|trine|ASC": {
    hook: "Luck seems to find you, but mostly you go out looking for it.",
    text: "A hopeful, open manner invites good things, and Jupiter trine your rising sign supplies exactly that. Travel, teaching, faith or study often widen your life; from this angle Jupiter is often found in the 9th, where Lilly read it as \"devout\" or \"modestly given.\" People trust your optimism because it's sincere. Generosity tends to come back around. Keep a little skepticism for offers that sound too good.",
    short: ["optimistic", "generous", "sincere"],
    watch: "believing every promising thing you're told.",
  },
  "SATURN|trine|ASC": {
    hook: "You look like someone who can be trusted with the keys.",
    text: "A trine from Saturn gives your manner steadiness. You're rarely the loudest person in the room, but you're often the one people ask. Discipline sits comfortably on you; you can study, train and practice longer than most. From here Saturn usually falls in a house of pleasure or learning, so the seriousness goes into a craft, a field of learning or a long project you actually enjoy. Reliable is a fine reputation. It shouldn't be your only one.",
    short: ["dependable", "patient", "capable"],
    watch: "taking on rules nobody asked you to keep.",
  },
  "URANUS|trine|ASC": {
    hook: "Your odd ideas tend to land, which keeps you having them.",
    text: "Independence looks easy on you with Uranus trine the rising sign. You seem original without being difficult. Invention, science, travel and any field that rewards a fresh angle are natural ground for you. Change tends to arrive as opportunity more than shock. The weak spot is moving on before the new thing has paid off.",
    short: ["original", "open minded", "quick"],
    watch: "dropping a good idea the moment it stops being new.",
  },
  "NEPTUNE|trine|ASC": {
    hook: "People tell you things they don't tell anyone, and they're not sure why.",
    text: "With Neptune flowing to your rising sign, your manner is gentle and receptive, a little dreamy. Art, music, spiritual life and anything imaginative come through you naturally, often by way of play or faith. Your read on people is usually right. All that openness costs you something in boundaries, since you take in more than you mean to.",
    short: ["compassionate", "artistic", "perceptive"],
    watch: "absorbing other people's moods and calling them your own.",
  },
  "PLUTO|trine|ASC": {
    hook: "Within a minute of arriving, you know who actually runs the place.",
    text: "Pluto trine the rising sign gives you a quiet intensity people respect. You read situations fast and change course without much drama. Research, psychology and anything that rewards digging pay off for you. Your own reinventions tend to look smooth from the outside, whatever they cost inside. Use what you see to help people, not to steer them.",
    short: ["perceptive", "magnetic", "resilient"],
    watch: "knowing more than you say and using it as leverage.",
  },

  // Reading angles AN8, planets trine the Midheaven (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-08-trine-mc.md
  "SUN|trine|MC": {
    hook: "What you're good at and what you get paid for tend to line up.",
    text: "The Sun in harmony with your Midheaven links purpose to work. You don't have to become someone else to succeed. From this angle the Sun usually sits in the 2nd or 6th house, so the path runs through steady earning or daily craft more than a sudden break. Recognition comes while you're simply doing the job well. Pick goals big enough to keep that ease honest.",
    short: ["purposeful", "capable", "consistent"],
    watch: "settling for comfortable when you could aim higher.",
  },
  "MOON|trine|MC": {
    hook: "The public seems to like you before you've done much to earn it.",
    text: "Feelings and career pull the same way with the Moon trine the Midheaven. Work with people, food, care, the public or anything that needs a feel for mood rewards you. You can tell what an audience or a client needs before they say it. Word of mouth does a lot of your advertising. Your moods, though, shouldn't set the pace of your plans.",
    short: ["intuitive", "responsive", "well liked"],
    watch: "choosing work by how it feels this month.",
  },
  "MERCURY|trine|MC": {
    hook: "Your words pay the bills, or they easily could.",
    text: "Thinking and talking become part of your trade when Mercury trines the Midheaven. Writing, selling, teaching, analysis and detail work reward you. Lilly gave the 6th house servants and employees, and from here Mercury often sits there or in the 2nd, the house of money: you're a sharp hand at daily work and comfortable talking numbers. People trust what you say about the job. Keep learning, or ease turns into routine.",
    short: ["skilled", "clear", "practical"],
    watch: "staying in a role long after it has taught you everything it can.",
  },
  "VENUS|trine|MC": {
    hook: "Doors open for you at work more often than they open for most.",
    text: "Venus trine the Midheaven brings grace to how you work in public. Art, design, hospitality, diplomacy and any job where being liked helps all fit you. From this angle Venus often sits in the 2nd, Lilly's house of money and goods, so taste and income can go together. Colleagues remember you warmly. Make sure your skill gets as much credit as your charm.",
    short: ["gracious", "artistic", "diplomatic"],
    watch: "letting likability do the work your talent should.",
  },
  "MARS|trine|MC": {
    hook: "You put in long days, and somehow they don't look like a struggle.",
    text: "With Mars trine the Midheaven, ambition gets steady fuel. Lilly said Mars rejoices in the 6th house, the house of employees and daily labor, and from here Mars often sits there: you like real work with visible results. Competitive fields, building, hands on jobs and leading a crew reward you. Initiative gets noticed. Pace yourself so drive doesn't tip into overwork.",
    short: ["driven", "hardworking", "decisive"],
    watch: "treating rest as something you have to earn.",
  },
  "JUPITER|trine|MC": {
    hook: "Your career has had more lucky breaks than you'd admit out loud.",
    text: "Of all the links to a career, Jupiter's trine is one of the kindest. Lilly said Jupiter in the 2nd, where it often sits from here, is \"an argument of an estate,\" and the modern reading is close: growth, good mentors, chances that show up when needed. Teaching, law, publishing, travel and anything that widens people's world reward you. You're generous with colleagues, and it comes back. Keep choosing, since too many open doors can stall you.",
    short: ["fortunate", "generous", "expansive"],
    watch: "saying yes to every opportunity and finishing none.",
  },
  "SATURN|trine|MC": {
    hook: "Your reputation was built one brick at a time, and it holds.",
    text: "Saturn trine your Midheaven rewards slow, careful effort. Structure, management, long careers and expertise earned over years fit you. From here Saturn tends to sit in the 2nd or 6th, so it shows in thrift and in work done properly. You may climb later than your peers, but you rarely slide back. Enjoy the view on the way up.",
    short: ["disciplined", "reliable", "patient"],
    watch: "waiting for permission you already have.",
  },
  "URANUS|trine|MC": {
    hook: "Your career path makes sense only in hindsight.",
    text: "Change works for your public life when Uranus trines the Midheaven. Technology, science, freelancing and anything new reward you, and switching fields tends to go better for you than for most. Colleagues assume you're ahead of the curve. You'd trade a title for freedom in how you work. The task is sticking with one thing long enough to be known for it.",
    short: ["innovative", "independent", "adaptable"],
    watch: "changing jobs whenever you get comfortable.",
  },
  "NEPTUNE|trine|MC": {
    hook: "Your work tends to carry something people can't quite name.",
    text: "Neptune trine the Midheaven links imagination to your career. Art, film, music, care work, charity and spiritual work all fit you. You sense what the public wants before it knows. Your best jobs feel like a calling. Keep the business side clear: contracts read, hours counted.",
    short: ["imaginative", "inspired", "compassionate"],
    watch: "working for meaning and forgetting to get paid.",
  },
  "PLUTO|trine|MC": {
    hook: "You tend to end up in charge of the hard projects, and you finish them.",
    text: "A trine from Pluto gives you quiet power at work. Research, finance, crisis management, investigation and any job that takes nerve reward you. You can rebuild a career without losing your footing. Others sense your depth and hand you serious responsibility. Use that influence in the open.",
    short: ["powerful", "strategic", "resilient"],
    watch: "gathering control nobody else can check.",
  },

  // Reading angles AN9, planets sextile the rising sign (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-09-sextile-asc.md
  "SUN|sextile|ASC": {
    hook: "People find you easy to approach, and you'd rather keep it that way.",
    text: "Your core self has an easy line to the outside world when the Sun sextiles your rising sign. You don't need a spotlight to feel like yourself; a good conversation, a group or a shared project will do. From here the Sun is usually found in the 3rd or 11th, among neighbors or friends, and Lilly named the Sun as the 11th house's natural partner. Opportunities come through who you know. Show up for them.",
    short: ["friendly", "confident", "open"],
    watch: "waiting for an invitation instead of making one.",
  },
  "MOON|sextile|ASC": {
    hook: "Strangers start talking to you in line, and you don't mind at all.",
    text: "The Moon sextile your rising sign gives your manner a friendly, responsive quality. From here the Moon is often in the 3rd, which Lilly called its joy, a place of much travel where the Moon is \"seldom quiet,\" or in the 11th, among friends. Errands turn into conversations; a short trip turns into a story. The sextile is a milder trine, so the ease is real but you have to reach for it. Accept the invitations that feel right.",
    short: ["sociable", "adaptable", "kind"],
    watch: "staying so busy with people that you never sit with your own feelings.",
  },
  "MERCURY|sextile|ASC": {
    hook: "You can talk to almost anyone, and you usually learn something when you do.",
    text: "Words come quickly with Mercury sextile the ascendant, and so do questions. Writing, teaching, sales and anything with a steady flow of people fit you. Mercury here often falls in the 3rd, Lilly's house of letters, messengers and short journeys, which reads close to a job description. Curiosity keeps you young. Finish some of the books you start.",
    short: ["witty", "curious", "flexible"],
    watch: "scattering your attention across too many threads.",
  },
  "VENUS|sextile|ASC": {
    hook: "People feel welcome around you, and they keep coming back.",
    text: "Venus sextile the rising sign lends your manner warmth and taste. You're good at gatherings, introductions and small kindnesses. Friendships turn into collaborations here, and collaborations into friendships. Venus tends to fall in the 3rd or 11th from here, so the pleasure is social: notes, visits, friends of friends. Let the charm work for things you care about.",
    short: ["warm", "tasteful", "likable"],
    watch: "agreeing just to keep the evening pleasant.",
  },
  "MARS|sextile|ASC": {
    hook: "You pick your battles, and you pick them well.",
    text: "A sextile from Mars supplies useful drive. Lilly thought Mars did reasonably well in the 3rd; this aspect often puts it there or in the 11th, so energy goes into errands, projects with friends and quick decisions. You're practical about courage. You'll act when it matters and skip the fights that don't. The opening is there; take it on purpose.",
    short: ["active", "practical", "direct"],
    watch: "rushing the step that needs a second look.",
  },
  "JUPITER|sextile|ASC": {
    hook: "Friends have opened more doors for you than any résumé.",
    text: "Luck sits within reach when Jupiter sextiles your rising sign. From here it often lands in the 11th, the house where Lilly said Jupiter \"doth especially rejoyce,\" so friends, groups and allies tend to bring good things. You're encouraging, and people want to help you back. The chances are real, but they come as offers, not deliveries. Answer them.",
    short: ["hopeful", "friendly", "generous"],
    watch: "assuming the next good break will find you without your help.",
  },
  "SATURN|sextile|ASC": {
    hook: "You were probably called mature for your age, and you took it as a compliment.",
    text: "With Saturn sextile your rising sign, you carry yourself with quiet competence. You plan, you show up, and people remember. From here Saturn often lands in the 11th, so you may keep a few old friends over many new ones, or in the 3rd, where it makes a careful speaker and writer. The sextile gives Saturn's discipline a friendlier face. Build things that last, and let yourself be young now and then.",
    short: ["sensible", "loyal", "careful"],
    watch: "saying no to fun out of habit.",
  },
  "URANUS|sextile|ASC": {
    hook: "Your friends are an unusual bunch, and you collected every one on purpose.",
    text: "New people and new ideas find an open door when Uranus sextiles the rising sign. Technology, science, activism or any group with a fresh angle tends to pull you in. You update your views when the evidence changes, and people respect that. Short notice doesn't bother you. Keep a few things steady so the changes have somewhere to land.",
    short: ["inventive", "open minded", "friendly"],
    watch: "chasing novelty for its own sake.",
  },
  "NEPTUNE|sextile|ASC": {
    hook: "You can make an ordinary afternoon feel a little like a story.",
    text: "A sextile from Neptune adds a gentle, imaginative quality to the way you meet people. Music, art, film and quiet acts of kindness come naturally. You tend to find your people in creative or spiritual circles, and intuition helps you choose them well. The work is grounding your ideas in something you can share.",
    short: ["imaginative", "gentle", "perceptive"],
    watch: "letting a lovely plan stay a plan.",
  },
  "PLUTO|sextile|ASC": {
    hook: "You notice what people mean, not just what they say.",
    text: "Pluto sextile the rising sign sharpens your perception without making you hard to be around. You're good at research, at strategy, at seeing where a conversation is really going. Friends bring you their problems because you don't flinch. Change in your life tends to come through people you meet and ideas you pick up. Keep the insight kind.",
    short: ["insightful", "steady", "resourceful"],
    watch: "reading people so well you stop letting them surprise you.",
  },

  // Reading angles AN10, planets sextile the Midheaven (owner approved 11/20): docs/redesign/drafts/2026-11-20-angles-10-sextile-mc.md
  "SUN|sextile|MC": {
    hook: "When you're doing work you believe in, people notice without being told.",
    text: "The Sun sextile your Midheaven gives your sense of purpose a clear route into your career. You tend to get chances through people: a partner, a colleague, someone who saw what you did. Leadership fits you best when it's shared. The openings are steady rather than dramatic, so it pays to take the right ones.",
    short: ["purposeful", "cooperative", "warm"],
    watch: "waiting for a big break while small ones keep arriving.",
  },
  "MOON|sextile|MC": {
    hook: "People open up to you at work, and that turns into opportunity.",
    text: "With the Moon sextile your Midheaven, your feelings help your career instead of getting in its way. Work with people, care, food or the public rewards you, and your instincts about colleagues are usually sound. Support often comes from those who've known you a long time. Follow the work that feels right, then give it structure.",
    short: ["caring", "intuitive", "adaptable"],
    watch: "drifting from role to role with your moods.",
  },
  "MERCURY|sextile|MC": {
    hook: "The right conversation has changed your career more than once.",
    text: "Mercury sextile the Midheaven puts your ideas within reach of the people who can use them. Writing, research, analysis, consulting and any job built on clear thinking reward you. Contracts and negotiations tend to go your way. You learn a job fast. Keep your sources, contacts and notes in order; they're half your career.",
    short: ["sharp", "resourceful", "articulate"],
    watch: "talking through ideas instead of shipping them.",
  },
  "VENUS|sextile|MC": {
    hook: "Your career has gone smoother every time you made a friend at work.",
    text: "Goodwill turns into opportunity when Venus sextiles your Midheaven. Art, design, hospitality, beauty and any work built on relationships fit you. Partners and patrons often help, and Venus can sit in the 8th from this angle, Lilly's house of other people's money: grants, investors, shared ventures. You make work pleasant for others. Ask for the role you want, not only the one that's offered.",
    short: ["gracious", "collaborative", "artistic"],
    watch: "waiting to be noticed.",
  },
  "MARS|sextile|MC": {
    hook: "You do well when there's a clear goal and room to move.",
    text: "Mars sextile your Midheaven turns energy into progress. You take initiative at work, and it's welcomed rather than resented. Competitive fields, building, sport and physical work all suit you. Openings come when you act on them. Keep a reserve for the long projects.",
    short: ["energetic", "decisive", "capable"],
    watch: "burning through energy on small wins.",
  },
  "JUPITER|sextile|MC": {
    hook: "Help tends to arrive at work just when you need it.",
    text: "Jupiter sextile your Midheaven opens doors through generosity, yours and other people's. Teaching, publishing, law, travel and any growing field reward you. Allies, partners and shared ventures tend to help your work along. The offers are steady. Pick the ones that fit.",
    short: ["optimistic", "generous", "lucky"],
    watch: "saying yes to more than you can do well.",
  },
  "SATURN|sextile|MC": {
    hook: "Your career rewards patience, and you have more of it than most.",
    text: "Steady effort pays off with Saturn sextile your Midheaven. Lilly said Saturn rejoices in the 12th, and this sextile often places it there, or else in the 8th: you do well with long research, quiet preparation and other people's resources handled carefully. Management, planning and expert work fit you. Mentors notice the reliable ones. Take the credit when it comes.",
    short: ["patient", "careful", "capable"],
    watch: "preparing so long that the chance moves on.",
  },
  "URANUS|sextile|MC": {
    hook: "Your career has taken at least one turn nobody saw coming, including you.",
    text: "Uranus sextile the Midheaven makes change useful. Technology, science, freelancing and new fields reward you. You spot openings early and you're willing to try them. Colleagues value your fresh eye. Build enough routine that your best ideas get finished.",
    short: ["inventive", "adaptable", "forward looking"],
    watch: "leaving just before the payoff.",
  },
  "NEPTUNE|sextile|MC": {
    hook: "Your work has a way of reaching people quietly.",
    text: "Neptune sextile the Midheaven links imagination to opportunity. Art, music, film, writing, care work and charitable causes fit you, especially behind the scenes. You sense what people need and make things for it. Your calling may come into focus slowly. Keep notes, keep drafts, keep the receipts.",
    short: ["imaginative", "compassionate", "intuitive"],
    watch: "undervaluing work that came easily.",
  },
  "PLUTO|sextile|MC": {
    hook: "Your strongest work happens where most people aren't looking.",
    text: "Pluto sextile the Midheaven gives you a talent for influence behind the scenes. From here Pluto tends to occupy the 8th house, which Lilly gave to other people's money, or the 12th, the hidden side of life. Finance, research, psychology, investigation and strategy reward you. You can change course in your career without a crisis. Trust your sense of where the real power sits, and use it fairly.",
    short: ["strategic", "perceptive", "quietly ambitious"],
    watch: "staying in the background after you've earned a seat at the table.",
  },

  // Reading houses H10, the sign on your 10th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-10-midheaven.md
  "HOUSE:10|Aries": {
    hook: "You'd rather start the company than climb someone else's ladder.",
    text: "Lilly called this cusp the Medium coeli, the middle of heaven, and with Aries there the public sees a starter. You do well where speed and nerve count: launching things, leading from the front, fields with a clear winner. The Sun is exalted in Aries, so being out in front tends to suit you. Patience is the skill to build. Careers are long, and those who stay through the slow middle often finish ahead.",
  },
  "HOUSE:10|Taurus": {
    hook: "Your reputation is that you deliver, and it took years to earn.",
    text: "With Taurus on the Midheaven, steadiness is what you're known for. The old books gave Taurus the manners of the ox, hardworking, and that's how ambition looks here: patient, practical, built to last. Work with something real in it suits you: money, land, food, design, anything people can hold. Venus rules the sign, so taste matters in your work too. You don't need to move fast; you need to keep moving.",
  },
  "HOUSE:10|Gemini": {
    hook: "Ask what you do for a living and you might need a minute.",
    text: "Gemini on the 10th gives you a public life with more than one track. Lilly's sources called Gemini \"a lover of arts and learning,\" and it tends to show up in words, ideas, teaching, media and trade. People know you as the one who knows a little about everything and a lot about a few things. Two careers at once isn't unusual for you. The trick is letting one of them grow deep.",
  },
  "HOUSE:10|Cancer": {
    hook: "The work you're proudest of looks after someone.",
    text: "Cancer at the Midheaven means a protective streak in public. You tend to be known for care: of people, of places, of a team that turns into a kind of family. Food, homes, hospitality, history and anything that keeps people safe fit you well. Jupiter is exalted in Cancer, and generosity becomes part of your reputation. Your feelings about the work drive the work, so choose something you can feel good about for years.",
  },
  "HOUSE:10|Leo": {
    hook: "You were never going to have a job nobody could see.",
    text: "The Sun's own sign holds your Midheaven, and Lilly said the Sun placed in this house does \"much Fortunate\" it; some of that brightness carries with Leo here. You're meant to be visible: leading, performing, creating, running the show. People remember your style as much as your results. Warmth is your best management tool. The risk is needing applause to know you did well.",
  },
  "HOUSE:10|Virgo": {
    hook: "You're the one people call when it has to be right.",
    text: "Virgo at the Midheaven makes skill your reputation. Mercury rules Virgo and is exalted there, and the old books saw the sign as studious, judicious and \"excellently well spoken.\" Editing, analysis, research, skilled trades and any service that has to be done properly suit you. You earn trust by being exact. You may also undersell yourself, so let someone else list your accomplishments if you can't.",
  },
  "HOUSE:10|Libra": {
    hook: "Your career keeps turning into people work, whether you planned it or not.",
    text: "Libra on the 10th makes your public life a matter of relationships. Venus rules the sign and Saturn is exalted in it, so your reputation rests on grace and fairness together: the negotiator, the designer, the one who finds terms both sides can sign. Partnerships often move your career more than solo effort does. The hard part is a decision that will disappoint someone. Make it anyway.",
  },
  "HOUSE:10|Scorpio": {
    hook: "You'd rather have real influence than a big title.",
    text: "Scorpio on the Midheaven lends your public life depth and a certain privacy. The old books granted the sign \"good understanding,\" and you're known for seeing what others miss. Research, finance, investigation, psychology and crisis work suit you, along with anything where trust is earned slowly. Pluto rules the sign (Mars did in the old scheme), so you can rebuild a career from nothing if you have to. Let people see a little more of your work than you'd like.",
  },
  "HOUSE:10|Sagittarius": {
    hook: "Your work needs a reason bigger than the paycheck, or you lose interest.",
    text: "Jupiter's sign crowns your chart, and Lilly counted Jupiter among the planets that fortune this house. You do well where ideas travel: teaching, publishing, law, travel, faith. People see you as honest and a little restless. The sign was called \"valiant and without feare,\" and you'll take a professional risk others won't. Finish a few things before chasing the next horizon.",
  },
  "HOUSE:10|Capricorn": {
    hook: "You were planning your career while other kids were planning recess.",
    text: "This is the natural fit. Lilly gave the 10th house Capricorn as its cosignificator, and Saturn, the sign's ruler, likes structure, rank and time. You're built for the long climb. Management, government, building, institutions and anything with a ladder suit you. Respect matters more to you than fame. Plan a few things that have nothing to do with work.",
  },
  "HOUSE:10|Aquarius": {
    hook: "You'd rather change how the work gets done than just do it.",
    text: "Aquarius at the Midheaven gives your public life an independent, forward looking edge. Uranus rules the sign, with Saturn as its traditional ruler, so you mix new ideas with real structure: technology, science, reform, communities and causes. The old books called the sign \"very humane, affable,\" and colleagues trust that you're fair. You may work best a little outside the system. Make sure people know what you've built.",
  },
  "HOUSE:10|Pisces": {
    hook: "Your career might not fit on a business card, and that's fine.",
    text: "Pisces on the 10th puts an imaginative sign on the highest point of your chart. Neptune rules it now and Jupiter ruled it before, and Venus is exalted there, so your public life leans toward art, music, film, care, spiritual work or anything that helps people feel less alone. Your path may wander before it settles. People sense your compassion before they see your résumé. Keep a little structure around the dream so it gets finished.",
  },

  // Reading houses H7, the sign on your 7th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-07-descendant.md
  "HOUSE:7|Aries": {
    hook: "You like people who say exactly what they want, partly because you rarely do.",
    text: "Lilly called this cusp the Angle of the West, and with Aries setting there, Libra is rising: the polite, balanced self you present tends to pair with someone more direct. Bold partners, quick rivals and collaborators who push the pace bring out the nerve you keep tucked behind your manners. Lilly also gave this house open opponents, and you do your best work against a worthy one. Start the argument yourself now and then.",
  },
  "HOUSE:7|Taurus": {
    hook: "You trust people who stay put.",
    text: "Taurus on the 7th sits across from Scorpio rising. You come across as intense and guarded, and you want steadiness in return: partners who are calm, loyal and at ease with routine. Venus is the ruler here, so warmth and physical comfort matter in your closest bonds. Agreements made here are slow to sign and hard to break, which is mostly good. Check now and then that steady hasn't turned into stuck.",
  },
  "HOUSE:7|Gemini": {
    hook: "The people you keep are the ones who can talk back.",
    text: "With Gemini on the 7th and Sagittarius rising, you lead with big ideas and look for someone to argue them with. Quick, curious, funny partners suit you, and so do collaborators who know things you don't. Relationships run on conversation; when the talk stops, so does the interest. Mercury runs this sign, so the fine print of an agreement gets your attention too. Don't confuse a clever partner with a committed one.",
  },
  "HOUSE:7|Cancer": {
    hook: "You look tough, and the people closest to you know better.",
    text: "Capricorn rising puts Cancer on your 7th. In public you're capable and serious, and partnership is where you get to be cared for. Warm, protective people appeal to you, and close bonds can feel like family quickly. The Moon rules Cancer, and Lilly named the Moon a natural partner of this house, so feelings run strong here. Let someone look after you without keeping score.",
  },
  "HOUSE:7|Leo": {
    hook: "You fall for people who light up a room, and then you study how they do it.",
    text: "Opposite your Aquarius rising, Leo holds the 7th. People meet someone cool, independent and a bit detached, and you're drawn to warmth: generous, confident partners who aren't shy about loving you out loud. The Sun is Leo's ruler, so love is often where you finally feel seen. Rivals tend toward drama too. Keep some of the fire for yourself instead of handing it all to them.",
  },
  "HOUSE:7|Virgo": {
    hook: "Competence looks attractive to you, and a tidy calendar can feel almost romantic.",
    text: "Your rising sign is Pisces, so Virgo gets the 7th. You meet the world with softness and imagination, and you partner best with someone practical, observant and reliable. They keep the details; you keep the dream. With Mercury in charge, good partnerships run on clear agreements and honest feedback. The risk is criticism flowing both ways. Thank each other out loud.",
  },
  "HOUSE:7|Libra": {
    hook: "You charge ahead, and somehow you keep ending up with diplomats.",
    text: "This is the sign's natural seat: Lilly made Libra a cosignificator of the 7th. Aries is rising, so you show the world a fast, direct self, and you need partners with grace and patience who smooth what you start. Venus governs Libra, and fairness is the test of every close bond. Let the other person finish their sentence.",
  },
  "HOUSE:7|Scorpio": {
    hook: "Easygoing on the surface, you still want a love that goes all the way down.",
    text: "Scorpio on the 7th pairs with Taurus rising. On first meeting you seem calm and steady, and intensity pulls you in: magnetic, private partners who want to know everything about you. Pluto rules this sign, with Mars in the older scheme, so trust and loyalty carry real weight. Rivals can be fierce as well. Say what you need instead of waiting to see if they guess.",
  },
  "HOUSE:7|Sagittarius": {
    hook: "You talk to everyone, but the one you keep has usually been somewhere.",
    text: "Sagittarius on the 7th faces Gemini rising. You lead with curiosity and quick talk, and you look for someone bigger in scope: adventurous, honest, wise or simply foreign to everything you knew. Jupiter rules Sagittarius, and partners often widen your world through travel, study or belief. You need freedom inside commitment, and so do they. Keep the promises small enough to keep.",
  },
  "HOUSE:7|Capricorn": {
    hook: "You look after everyone, so the person you choose had better carry some weight.",
    text: "Cancer rising leaves Capricorn on the 7th. You meet people with warmth and protectiveness, and steadiness appeals to you: serious, capable partners, often older or more established. Under Saturn, relationships may start slowly and grow sturdier every year. Agreements suit you when they're clear. Don't let a partnership become all responsibility and no play.",
  },
  "HOUSE:7|Aquarius": {
    hook: "You shine in public, and you want a partner who doesn't need you to.",
    text: "Leo is rising, so Aquarius takes the 7th. Strangers find you warm and expressive, and you like people who are independent, unusual and a little hard to impress. Friendship is the base of your best relationships. Uranus rules Aquarius (Saturn in the older scheme), so you need space as much as closeness, and so do they. Make room for difference without mistaking distance for freedom.",
  },
  "HOUSE:7|Pisces": {
    hook: "You fix everyone's problems, and you fall for the one who doesn't care if things get fixed.",
    text: "With Virgo rising, Pisces holds the setting point. Your public face is careful and capable, and gentle, imaginative, forgiving people win you over. Neptune is the modern ruler and Jupiter the old one, so love can feel like rescue or like art. Keep your eyes open, since you may love a partner's potential more than the person. Choose someone who meets you halfway.",
  },

  // Reading houses H4, the sign on your 4th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-04-ic.md
  "HOUSE:4|Aries": {
    hook: "Your home is never finished, and you like it that way.",
    text: "This is the Imum Coeli, Lilly's Angle of the Earth, and Aries there keeps your private life in motion. You'd rather build, fix and rearrange than sit still in a finished room. Libra holds your Midheaven, so at work you pass for a diplomat, and the energy you hold back at work gets spent where you live. Give it a project: a workshop, a garden, a run before breakfast. Quarrels at your address burn hot and fast, so cool them before they set.",
  },
  "HOUSE:4|Taurus": {
    hook: "You can judge a good chair by sitting in it for three seconds.",
    text: "Taurus puts Venus's earthy sign under everything else in your chart. Lilly gave this angle lands, gardens and fields, and Taurus there wants real ground: a place you own or can make your own, good food, a bed worth the money. Scorpio on the Midheaven makes your public life intense; the private one is where you recover. You hold on to places and things for a long time. That loyalty is a strength, until it keeps you somewhere you've outgrown.",
  },
  "HOUSE:4|Gemini": {
    hook: "Your place has books in every room, and at least one stack you'll get to someday.",
    text: "Gemini on the 4th fills your private life with talk. Under Mercury, your rooms collect books, devices, messages and visitors. You may move more than most, or keep two places at once. With Sagittarius on the Midheaven you range far in public; behind your own door you want variety on a smaller scale. Leave one corner quiet so your mind has somewhere to land.",
  },
  "HOUSE:4|Cancer": {
    hook: "You notice the light in a kitchen before you notice its size.",
    text: "This is the angle's natural sign: Lilly gave the 4th Cancer as its cosignificator. The Moon rules here, so your private world runs on feeling, memory and comfort. Capricorn crowns your chart, which makes you look composed and hardworking in public, and your softness lives behind your own door. You keep things: letters, recipes, the old chair. Make sure the past you're keeping is one you like.",
  },
  "HOUSE:4|Leo": {
    hook: "You host the best dinners, and your place looks like you meant it.",
    text: "The Sun's sign sits at the base of your chart, and Lilly named the Sun a natural partner of this angle. Your private life wants warmth and a little grandeur: color, good lighting, people around the table. Aquarius on the Midheaven can make you seem cool and independent at work, so the heat comes out at home. Pride in your place is healthy. Just don't need the guests to tell you it's good.",
  },
  "HOUSE:4|Virgo": {
    hook: "You can't relax until the dishes are done, and you've made your peace with that.",
    text: "Virgo on the 4th brings order to your private life. Mercury's rule means your space works best with systems: lists, labeled jars, a place for everything. Your Midheaven is in Pisces, so public life may drift and dream; the private side is where you get your footing back. A tidy room is a kind of rest for you. Leave a little mess somewhere so rest doesn't turn into another job.",
  },
  "HOUSE:4|Libra": {
    hook: "A room that's slightly off bothers you until you fix it.",
    text: "Libra on the 4th wants harmony underneath everything. Venus governs it, so beauty, balance and good company make your private life feel right. Aries holds the Midheaven, and you push hard in public; in private you want peace. You share your space easily and furnish it well. Keep one quiet place that's only yours, since you give so much of the room to others.",
  },
  "HOUSE:4|Scorpio": {
    hook: "Very few people have seen the inside of your life, and that's on purpose.",
    text: "Scorpio on the 4th keeps your private world deep and closely guarded. Lilly gave this angle \"Treasures hidden,\" and with Scorpio there you keep your real self underground. Pluto leads here (Mars once did), and you can rebuild your foundations from scratch when you need to. Taurus on the Midheaven gives you a calm, steady public face. Let a trusted few all the way in.",
  },
  "HOUSE:4|Sagittarius": {
    hook: "You feel most at home somewhere you've never been before.",
    text: "Sagittarius on the 4th gives your private life a wide horizon. With Jupiter in charge, your base can be a big place, a foreign one, or several over the years. You need room: space for books, guests, ideas and the occasional sudden trip. Gemini on the Midheaven keeps your public life quick and crowded. Your private base is where you think big. Keep it open, and keep it somewhere you'll actually come back to.",
  },
  "HOUSE:4|Capricorn": {
    hook: "You wanted to own your place long before you could afford it.",
    text: "Capricorn lays a serious foundation under your chart. Saturn is its ruler, and Lilly put \"all ancient Dwellings\" under this angle: old buildings, lasting structures, things built to stand. You treat your private life as a long project. Cancer on the Midheaven means the caring, protective side is the one the public sees. In private, let someone else carry some of the weight.",
  },
  "HOUSE:4|Aquarius": {
    hook: "Your place works best when it doesn't look like anyone else's.",
    text: "Aquarius under your chart gives you an independent, slightly unusual private life. Uranus is the modern ruler and Saturn the old one, and you might share a house with friends, live alone by choice or build something odd and perfect. Leo on the Midheaven puts you on display; behind the door you want freedom. You'd pick community over tradition. Make room for closeness too, not only space.",
  },
  "HOUSE:4|Pisces": {
    hook: "You need a room where nothing is expected of you.",
    text: "Pisces puts a dreamy sign at your chart's foundation. Neptune rules it now and Jupiter ruled it before, so your private life leans toward retreat: water, music, art, a door that closes. Virgo on the Midheaven makes you precise and useful in public. In private you let the edges blur. Look after the practical side too, since leaks and bills don't wait for the mood.",
  },

  // Reading houses H11, the sign on your 11th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-11-friends.md
  "HOUSE:11|Aries": {
    hook: "Your friends are the ones who dare you.",
    text: "With Aries on the 11th, friendship runs on action. Lilly gave this house friends, hope and trust, and a fire sign there fills your circle with bold people: teammates, training partners, people who start things. You make friends by doing something together. Your hopes come in bursts, big and urgent. Pick the one worth chasing for longer than a season.",
  },
  "HOUSE:11|Taurus": {
    hook: "You've had the same best friend for years, maybe decades.",
    text: "Taurus builds a circle slowly and keeps it. You'd rather have five friends you can call at 3 a.m. than fifty you can't. Shared meals, good music and plain comfort hold your friendships together, which is Venus, the sign's ruler, at work. Your hopes are practical: a home, savings, a life that feels secure. Let a new person in now and then; old circles need fresh air.",
  },
  "HOUSE:11|Gemini": {
    hook: "You could introduce half your town to the other half.",
    text: "Gemini on the 11th fills your circle with talkers, thinkers and people from every corner. Lilly tied this house to praise and good word, and you trade in it: introductions, news, the right name at the right time. Groups that learn together suit you, from book clubs to night classes. Your hopes change as you learn. Write down the ones that keep coming back.",
  },
  "HOUSE:11|Cancer": {
    hook: "Your friends turn into family, and a few of them have nicknames only you use.",
    text: "Here the Moon's sign governs friendship, and your people are few, close and protective. You remember birthdays and show up with soup. Your hopes often center on belonging and a settled life. You're the one who checks in after the hard week. Let your friends look after you too; it isn't only your job.",
  },
  "HOUSE:11|Leo": {
    hook: "You throw the party, and you remember who came.",
    text: "Lilly made the Sun the 11th house's natural partner, and here its own sign sits on the cusp. Your circle is warm, loyal and a little theatrical. Generosity holds it together, and you often end up at the center of the group. You hope to make something and be known for it. Make sure the spotlight passes around the table.",
  },
  "HOUSE:11|Virgo": {
    hook: "You run the group chat and actually book the table.",
    text: "Virgo makes you the useful friend. You show affection by helping: proofreading the letter, planning the trip, finding a good mechanic. Your circle tends to include capable, thoughtful people with skills to trade, and shared projects keep it alive. Your hopes are precise. Don't wait for them to be perfect before you say them out loud.",
  },
  "HOUSE:11|Libra": {
    hook: "You collect friends easily, and you hate leaving anyone out.",
    text: "Libra on the 11th gives your social life grace. Your friends are usually pleasant, artistic and well mannered, and you're good at bringing different people together. Lilly gave this house allies and counselors, and in a group you usually keep the peace. Your hopes lean toward fairness and good company. Notice when you agree with the room just to avoid friction.",
  },
  "HOUSE:11|Scorpio": {
    hook: "You have few friends, and you'd do almost anything for each of them.",
    text: "Lilly's 11th covers \"the Fidelity or falsenesse of Friends,\" and with Scorpio there loyalty is the whole test. You keep a small, trusted circle and share real things with it. Groups you join can change you, and you them. Your hopes run private and intense. Let one or two people know what they are.",
  },
  "HOUSE:11|Sagittarius": {
    hook: "Your friends live in several time zones.",
    text: "Jupiter rules this sign, and Lilly said Jupiter \"doth especially rejoyce\" in the 11th, so friendship tends to bring you luck: people who open doors, teach you things, take you places. Your circle may span countries, faiths and opinions. You hope on a grand scale. Keep a few close friends who know you, not only the many who know of you.",
  },
  "HOUSE:11|Capricorn": {
    hook: "You trust friends who've proved themselves over time.",
    text: "Capricorn on the 11th makes friendship serious. Saturn's sign builds a circle that's small, often older or more established, and slow to form. You may meet friends through work or shared responsibility, and those bonds last. Your hopes are long term: a career, a legacy, something solid. Make time for the friends who just make you laugh.",
  },
  "HOUSE:11|Aquarius": {
    hook: "You belong to more groups than most people know exist.",
    text: "Aquarius is at home here: Lilly gave the 11th Aquarius as a cosignificator. Expect a broad, unusual, idealistic circle, full of causes, communities and people who think differently. You're loyal to ideas and to the people who share them. Your hopes reach beyond yourself. One close friend counts as much as a movement.",
  },
  "HOUSE:11|Pisces": {
    hook: "You make friends with strangers, and some of them stay for life.",
    text: "Pisces softens your social life. Artists, dreamers and people who need a kind ear find you, and you give them sympathy and time. Your hopes are often spiritual or creative. Some friendships feel fated, though they're mostly just kind. Choose friends who give back, so your kindness isn't spent on people who only take.",
  },

  // Reading houses H5, the sign on your 5th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-05-pleasure.md
  "HOUSE:5|Aries": {
    hook: "You'd rather play the game than watch it.",
    text: "Aries makes fun competitive and quick. Sport, dares, a new hobby every season: your pleasure comes from doing. Romance starts fast with you and burns bright. Creative work goes best in bursts, with a deadline. Learn to enjoy the parts that don't involve winning.",
  },
  "HOUSE:5|Taurus": {
    hook: "Your idea of a perfect evening involves a long dinner and nowhere to be.",
    text: "Lilly said Venus joys in the 5th, and Taurus, one of her signs, gives pleasure a slow, sensual quality: food, music, gardens and good craft are your play. Romance is warm, unhurried and loyal. You make things with your hands and take your time doing it. Don't let comfort become the only kind of fun you allow.",
  },
  "HOUSE:5|Gemini": {
    hook: "Your hobbies come in stacks.",
    text: "Gemini on the 5th turns play into a mental sport. Games, puzzles, writing, flirting with words: your fun is quick and talkative. Romance starts in conversation and stays alive there. Creative work suits you in short forms, like essays, sketches and songs. Finish one project for every three you start.",
  },
  "HOUSE:5|Cancer": {
    hook: "The best parties you've been to happened in someone's kitchen.",
    text: "Cancer keeps pleasure personal and close. You like cooking for people, old movies, traditions, anything with a little nostalgia in it. Romance needs safety before it can be fun. Your creative work often draws on memory. Let yourself play for the joy of it, not only to take care of everyone else.",
  },
  "HOUSE:5|Leo": {
    hook: "You've never met a stage you didn't consider.",
    text: "Leo belongs on this cusp: Lilly gave the 5th Leo as a cosignificator. Performing, creating, courting, celebrating: you were built for pleasure on a large scale, and play is where you feel most yourself. Your generosity makes every party better. Make things for the fun of making them, not only for the applause.",
  },
  "HOUSE:5|Virgo": {
    hook: "Your hobby probably has a spreadsheet.",
    text: "Virgo on the 5th turns fun into craft. You enjoy getting good at things: baking, woodwork, an instrument, a sport with technique. Romance is thoughtful, shown in small attentions more than grand gestures. Creative work improves under your care. Allow yourself one hobby you're bad at, and enjoy being bad at it.",
  },
  "HOUSE:5|Libra": {
    hook: "A beautiful evening is your favorite kind of art.",
    text: "Venus's airy sign sits in the house where Venus rejoices, and pleasure turns social and refined: concerts, galleries, dinners for six. Romance sits close to the center of your life, and you court with style. Creative work goes best with a partner or an audience. Don't wait for someone to join you before you start enjoying yourself.",
  },
  "HOUSE:5|Scorpio": {
    hook: "You don't do casual, even with hobbies.",
    text: "Scorpio on the 5th makes pleasure intense. You play to win, love all the way and disappear into creative work for hours. Mysteries, research, deep talk and anything with risk appeal to you. Romance is passionate and private. Keep some fun light, so not every pleasure has to mean something.",
  },
  "HOUSE:5|Sagittarius": {
    hook: "Your idea of a vacation involves a passport and a loose plan.",
    text: "Sagittarius makes fun an adventure. Travel, sport, big ideas and good company: you like pleasure that widens your world. Jupiter, the sign's ruler, makes you a generous host and a better guest. Romance needs freedom and humor. Stay long enough to enjoy what you found.",
  },
  "HOUSE:5|Capricorn": {
    hook: "You relax by working on something, and you're fine with that.",
    text: "Capricorn on the 5th makes pleasure purposeful. You enjoy mastery: a long project, a skill built over years, a creative goal with milestones. Romance starts slowly and grows serious. Fun can feel like something you have to earn. It isn't. Schedule play the way you schedule work, then keep the appointment.",
  },
  "HOUSE:5|Aquarius": {
    hook: "Your hobbies are hard to explain at parties, which is part of the appeal.",
    text: "Aquarius makes fun inventive and a little unusual. Technology, science, games with friends and causes you enjoy fighting for: play is where your originality shows. Romance tends to start as friendship. Creative work suits you when it's experimental. Let yourself be silly sometimes, not only clever.",
  },
  "HOUSE:5|Pisces": {
    hook: "You can lose an afternoon to music and call it well spent.",
    text: "Venus is exalted in Pisces and rejoices in the 5th, so with Pisces on this cusp, music, film, water and romance carry real magic for you. You're a tender, imaginative partner. Creative work flows when you stop judging it. Keep one foot on the ground so the fun doesn't drift into escape.",
  },

  // Reading houses H2, the sign on your 2nd house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-02-money.md
  "HOUSE:2|Aries": {
    hook: "You earn fast and spend faster, usually on something you needed yesterday.",
    text: "Aries puts money on the move. You'd rather go out and earn than wait for a raise, and work you can start yourself tends to pay. Spending can be impulsive. Lilly's 2nd covers \"Profit or game, losse or damage,\" and with Aries there both arrive quickly. A simple rule, like waiting a day before any big purchase, saves you a lot.",
  },
  "HOUSE:2|Taurus": {
    hook: "You know what things are worth, and you won't pay a dollar more.",
    text: "Few signs fit a house better: Lilly gave the 2nd Taurus as a cosignificator. You value quality, comfort and things that last, and you build money slowly and keep it. Land, craft and anything real appeal more than speculation. Saving is already your strength, so spend a little on joy.",
  },
  "HOUSE:2|Gemini": {
    hook: "You've had more than one source of income at a time, probably right now.",
    text: "Gemini keeps money flexible. Earnings flow from words, trade, ideas and side projects, and you're quick to spot a deal. Income may vary month to month. Track it, because a clever mind is better at making money than at remembering where it went.",
  },
  "HOUSE:2|Cancer": {
    hook: "There's money tucked away somewhere for emergencies, and you've never told anyone.",
    text: "Cancer on the 2nd ties money to security. Your finances can rise and fall with your mood, and you feel safest with savings in the bank. You value things with memories attached: heirlooms, photos, a chair that was your grandmother's. Spending often goes to people you love. Make sure some of it goes to your own future too.",
  },
  "HOUSE:2|Leo": {
    hook: "You'd rather have one beautiful thing than ten ordinary ones.",
    text: "Leo gives money a generous, showy streak. You enjoy spending on quality, gifts and experiences, and you earn best doing work you're proud of. Lilly warned that the Sun placed in the 2nd scatters what it holds, and with the Sun's own sign on this cusp the lesson is similar: generosity needs a budget. Your self worth and your net worth are different numbers.",
  },
  "HOUSE:2|Virgo": {
    hook: "You know exactly how much you spent on coffee last month.",
    text: "Virgo makes money a matter of care. You budget, compare and research, and you earn well through skill and service; detailed or technical work tends to pay. You may worry about money even when it's fine. Let the numbers reassure you. They usually do.",
  },
  "HOUSE:2|Libra": {
    hook: "Your money tends to come through people, and so does your spending.",
    text: "Libra links money with relationships and taste. Art, design, beauty and partnership can all bring income, and you spend on things that make life lovely. You like fair deals and shared accounts that balance. Watch that keeping the peace doesn't mean covering more than your share.",
  },
  "HOUSE:2|Scorpio": {
    hook: "You don't talk about money, but you think about it a lot.",
    text: "Scorpio on the 2nd makes money private and strategic. Finances can transform here: lost and rebuilt, invested and grown. You're good at research and you know how to hold on. Control over your own resources matters to you. Don't let money become a way to keep score with people you love.",
  },
  "HOUSE:2|Sagittarius": {
    hook: "You've spent your last dollar on a plane ticket, and you'd do it again.",
    text: "Jupiter's sign sits in the house Lilly gave Jupiter as its natural partner, where he called it \"an argument of an estate.\" Teaching, travel, publishing or faith in a bigger idea can all pay. You're generous and optimistic about it. Keep the optimism, and put some of it in savings.",
  },
  "HOUSE:2|Capricorn": {
    hook: "You started saving earlier than anyone you know.",
    text: "Capricorn on the 2nd makes money a long game. You build slowly, plan for decades and respect a budget. You value what endures: property, a career, a name for paying your debts. Thrift is a strength until it turns into worry. Spend something on the present now and then.",
  },
  "HOUSE:2|Aquarius": {
    hook: "Your finances make more sense to you than to your accountant.",
    text: "Aquarius makes money unconventional. Income may come through technology, freelance work or ideas ahead of their time, and you value freedom more than things. Lilly's 2nd also covers a person's helpers, \"the Querents second,\" and yours are often people who share your causes. Keep a steady base under the experiments.",
  },
  "HOUSE:2|Pisces": {
    hook: "Money leaves your hands easily, often for someone else's.",
    text: "Pisces softens the edges of money. You can earn through art, music, care work or anything imaginative, and you give generously. Budgets bore you. Automate the dull parts, so your kindness doesn't leave you short.",
  },

  // Reading houses H8, the sign on your 8th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-08-shared.md
  "HOUSE:8|Aries": {
    hook: "When something has to end, you'd rather end it cleanly and fast.",
    text: "Aries brings speed to the deepest house in your chart. You face hard changes head on, and you tend to recover quickly once the decision is made. Shared money moves fast too: joint accounts, loans, investments you jump into. Intimacy starts with heat and honesty. Slow down long enough to check the terms before you sign.",
  },
  "HOUSE:8|Taurus": {
    hook: "You hold on to what you share, and you expect others to do the same.",
    text: "Taurus wants shared resources to be stable. Legacies belong to this house in Lilly, along with money that reaches you through others, and you handle both with patience: you save, you invest carefully, you keep things that were passed down. Intimacy deepens slowly and means a lot once it does. Change is hard for you. Let go of what's finished, even if it was comfortable.",
  },
  "HOUSE:8|Gemini": {
    hook: "You want to talk the hard thing through, ideally twice.",
    text: "Gemini meets deep matters with curiosity. You research, ask questions and turn intimacy into conversation. Shared money works best with clear paperwork: contracts, agreements, a record of who owes what. Change goes easier once you understand it. Sometimes the feeling comes before the explanation, and that's all right.",
  },
  "HOUSE:8|Cancer": {
    hook: "What you share with someone, you protect like it's yours alone.",
    text: "Cancer on the 8th ties intimacy to safety. You need to feel secure before you let anyone close, and once you do, you're fiercely loyal. Shared money and inherited things carry emotion for you: an heirloom can matter more than its price. Big changes stir up the past. Give yourself time to grieve what changes, then build the next home.",
  },
  "HOUSE:8|Leo": {
    hook: "You'll put everything into a bond, and you want the same back.",
    text: "Leo brings warmth and pride to the most private corner of your chart. Intimacy is wholehearted for you, generous and a little dramatic. You're open handed with shared money, sometimes more than is wise. Hard changes hit your pride first. Let people see you struggle; it doesn't make you smaller.",
  },
  "HOUSE:8|Virgo": {
    hook: "You keep the joint account balanced to the cent.",
    text: "Virgo puts order where things usually get messy. You handle shared money, taxes and other people's paperwork carefully, and you're the one who reads the will. Intimacy builds through small acts of service and trust earned slowly. In a crisis you get practical fast. Worry can stand in for feeling, so notice when you're organizing instead of grieving.",
  },
  "HOUSE:8|Libra": {
    hook: "You believe a partnership should be fair in the bank and in the bedroom.",
    text: "Libra on the 8th makes intimacy a matter of balance. You want shared money handled evenly, and you negotiate terms well. The 8th also holds a person's allies in a dispute, Lilly's \"Defendants friends,\" and you tend to smooth things over. Change goes best with a partner beside you. Don't keep the peace at the cost of saying what you need.",
  },
  "HOUSE:8|Scorpio": {
    hook: "You don't trust easily, and when you do, it's complete.",
    text: "Lilly gave the 8th Scorpio as its cosignificator, so the sign is on home ground. Intimacy is deep and private for you, and trust is the whole price of entry. You handle shared money strategically and keep your own counsel. You can come through big changes stronger, almost renewed. Don't test people so hard that only the toughest stay.",
  },
  "HOUSE:8|Sagittarius": {
    hook: "You look for the meaning in every ending, and you usually find one.",
    text: "Sagittarius brings faith to the hard parts of life. Change feels like a door, not a wall, and you can help others see it that way. Joint resources can be generous here: gifts, support, partners who help you grow. Intimacy needs humor and freedom. Optimism helps, but take time to feel the loss before you look for the lesson.",
  },
  "HOUSE:8|Capricorn": {
    hook: "You plan for the long term, including the things nobody likes to plan for.",
    text: "Saturn shares this house with Scorpio in Lilly's scheme, and Capricorn, Saturn's sign, makes the 8th serious and careful. You handle debts, estates and joint finances responsibly, often for others. Intimacy builds slowly and lasts. You face hard changes with discipline. Let someone help carry the weight when it's heavy.",
  },
  "HOUSE:8|Aquarius": {
    hook: "You want closeness without losing yourself, and you've found ways to have both.",
    text: "Aquarius on the 8th needs room inside intimacy. You prefer honest, unconventional arrangements to rules handed down. Shared money may come through groups, communities or unusual sources. Sudden changes don't rattle you as much as they rattle others. Remember that independence and trust can live together.",
  },
  "HOUSE:8|Pisces": {
    hook: "You merge with people easily, sometimes more than you meant to.",
    text: "Pisces softens every boundary in the most private part of your chart. Intimacy feels spiritual, close to a kind of dissolving. You're generous with shared resources and may not track them closely. Change arrives like a tide and carries you. Keep some edges, and keep the paperwork, so giving doesn't become losing.",
  },

  // Reading houses H9, the sign on your 9th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-09-horizons.md
  "HOUSE:9|Aries": {
    hook: "You'd rather book the trip tonight than read about the place for a year.",
    text: "Aries turns belief into an adventure. You learn by doing, travel on short notice and argue for what you believe. Long journeys and learning are Lilly's 9th house topics, and both come to you in bursts. You'd make a spirited teacher. Give a big idea time before you charge off to defend it.",
  },
  "HOUSE:9|Taurus": {
    hook: "Your beliefs took a long time to form, and they aren't moving.",
    text: "Taurus makes faith and learning practical. You trust what you can test, taste or hold, and the places you love to travel tend to be beautiful, quiet and full of good food. You study slowly and remember for good. Philosophy, for you, is how you live. Stay open to a new idea even when the old one is comfortable.",
  },
  "HOUSE:9|Gemini": {
    hook: "You read three books at once and quote all of them.",
    text: "Gemini on the 9th makes your mind restless for knowledge. \"Books, Learning\" are on Lilly's list for this house, and you collect both, along with languages, podcasts and long conversations. You travel to talk to people. Your beliefs stay flexible, which keeps you curious and sometimes undecided. Pick a few big questions to stay with for years.",
  },
  "HOUSE:9|Cancer": {
    hook: "The trips that matter to you lead back to people you love.",
    text: "Cancer gives belief and learning a personal root. Your faith, or your philosophy, is tied to family, tradition and feeling. You may travel to find your origins, or carry home with you wherever you go. You learn best where you feel safe. Let new ideas in even when they unsettle the old ones.",
  },
  "HOUSE:9|Leo": {
    hook: "You believe in things out loud.",
    text: "Lilly said the Sun rejoices in the 9th, and Leo, the Sun's sign, gives this house confidence and warmth. You're a natural teacher, speaker or champion of a cause. Travel and study are a stage where you shine. Your convictions are generous. Leave space for people who see the world differently.",
  },
  "HOUSE:9|Virgo": {
    hook: "You'd rather understand one thing well than everything badly.",
    text: "Virgo brings precision to the big questions. You study carefully, test every claim and prefer facts to faith, or a faith you can practice daily. Travel is planned down to the hour. You make a thorough teacher and a demanding student. Let some mysteries stay unsolved; not everything fits a system.",
  },
  "HOUSE:9|Libra": {
    hook: "You see every side of a big question, and you enjoy the debate.",
    text: "Libra makes belief a matter of fairness and balance. You're drawn to law, ethics, art and the cultures that do beauty well. Travel is best with a companion. Lilly's 9th also covers a partner's family, and you usually get along with them. Take a stand when it matters, even if it upsets the balance.",
  },
  "HOUSE:9|Scorpio": {
    hook: "You want the truth, especially the part nobody mentions.",
    text: "Scorpio sends you digging into the big questions. You're drawn to psychology, mysteries, hidden history and beliefs that transform people. Lilly listed dreams and visions under this house, and you take yours seriously. Your convictions run deep and private. Share them with people who've earned it.",
  },
  "HOUSE:9|Sagittarius": {
    hook: "Your passport is one of your favorite possessions.",
    text: "Sagittarius fits the 9th exactly: Lilly gave the 9th Sagittarius and Jupiter as cosignificators. You're a natural traveler, student and believer in something larger. Foreign places, big books and long talks feed you. Your optimism is contagious. Keep your feet on the ground long enough to finish what you learn.",
  },
  "HOUSE:9|Capricorn": {
    hook: "You trust wisdom that's been tested by time.",
    text: "Capricorn on the 9th makes learning serious and useful. You prefer traditions with a track record and degrees that lead somewhere. Travel tends to be for work or purpose. Your beliefs mature slowly and get stronger with age. Let yourself wonder, not only study.",
  },
  "HOUSE:9|Aquarius": {
    hook: "Your beliefs were never handed to you; you built them.",
    text: "Aquarius makes your beliefs original. You're drawn to science, future ideas, reform and communities that think differently. Travel may be to unusual places or with unusual people. You question every dogma, including your own. Keep the open mind, and add a little warmth to the arguments.",
  },
  "HOUSE:9|Pisces": {
    hook: "Some of your truest beliefs arrived in a dream.",
    text: "Pisces gives the 9th a spiritual, imaginative quality. Lilly listed \"Dreams, Visions\" here, and you're open to faith, mysticism, music and art that feels sacred. Travel near water or to holy places can move you deeply. Your compassion is part of your philosophy. Ground your visions so other people can share them.",
  },

  // Reading houses H3, the sign on your 3rd house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-03-nearby.md
  "HOUSE:3|Aries": {
    hook: "You say what you think, and you usually say it first.",
    text: "Aries makes everyday talk quick and direct. You argue well, decide fast and get bored with long explanations. Mars is one of this house's partners in Lilly, so the fire fits. Short trips are spur of the moment. Count to three before you send the sharp message.",
  },
  "HOUSE:3|Taurus": {
    hook: "You take your time with words, and people listen when you finally speak.",
    text: "Taurus slows your daily mind down in a good way. You learn steadily, speak with care and like routines: the same walk, the same café, the same neighbors. Your voice can be calm and pleasing. You don't change your mind easily. Hear the new information before you file it under wrong.",
  },
  "HOUSE:3|Gemini": {
    hook: "You've texted, called and emailed three people before breakfast.",
    text: "Gemini sits in its own house here: Lilly gave the 3rd Gemini as its cosignificator. Letters, messages, errands and neighborhood news are your daily life. You learn fast, talk easily and know what's going on down the street. Your mind never fully rests. Make time for one thing at a time.",
  },
  "HOUSE:3|Cancer": {
    hook: "You remember what the neighbors' kids were called twenty years ago.",
    text: "Cancer lends your day to day thinking a long memory and a soft voice. You talk most freely with people you trust, and your words carry feeling. Close kin, cousins and neighbors may feel like family. Your thinking leans on instinct. Check the facts when your feelings are doing the arguing.",
  },
  "HOUSE:3|Leo": {
    hook: "You tell a story like you're on stage, and people stay to hear the end.",
    text: "Leo makes everyday talk warm, dramatic and generous. You enjoy teaching, explaining and making people laugh. Your words carry confidence. Neighbors and close kin tend to remember you. Let other people tell their stories too.",
  },
  "HOUSE:3|Virgo": {
    hook: "You notice the typo, and you've probably mentioned it.",
    text: "Virgo sharpens your daily mind. You think in details, write clearly and like your errands done in the right order. Mercury rules the sign, so this house suits you well: learning, editing, explaining. Criticism comes easily. Pair it with praise and people will hear both.",
  },
  "HOUSE:3|Libra": {
    hook: "You can say a hard thing so nicely that people thank you for it.",
    text: "Libra gives your everyday talk tact and charm. You weigh both sides before you answer, and you can keep the peace in a family chat or on a street. Conversation is one of your pleasures. Decisions can take a while. Pick, then let it go.",
  },
  "HOUSE:3|Scorpio": {
    hook: "You hear what people aren't saying.",
    text: "Scorpio makes your daily mind sharp and searching. You research, investigate and remember. Rumors and secrets, which Lilly put in this house, tend to find their way to you. You speak with weight and choose your words carefully. Keep a few conversations light, just for the ease of it.",
  },
  "HOUSE:3|Sagittarius": {
    hook: "Every errand turns into a small adventure.",
    text: "Sagittarius makes everyday life roomy. You talk big, think in ideas and like getting out of the house. Short trips, classes and long phone calls keep you happy. You say what you believe, sometimes before you've checked it. Honesty is your gift; tact can come with practice.",
  },
  "HOUSE:3|Capricorn": {
    hook: "You think before you speak, and you rarely have to take it back.",
    text: "Capricorn puts structure into how you think and talk. You learn methodically, write with care and treat your words as commitments. Short trips tend to have a purpose. Among close kin, you were likely the serious one. Let your sense of humor show more often; it's better than you think.",
  },
  "HOUSE:3|Aquarius": {
    hook: "Your mind goes sideways, and that's where the good ideas are.",
    text: "Aquarius makes your daily thinking original. You're drawn to technology, odd facts and conversations that question everything. Your neighbors might find you a little unusual, and they tend to like it. You speak your mind plainly. Keep curiosity about the people who disagree with you.",
  },
  "HOUSE:3|Pisces": {
    hook: "You think in pictures, and words arrive a little after.",
    text: "Pisces gives your everyday mind an imaginative, intuitive flow. You pick up moods in a room before facts, and you write or speak best when inspired. Errands can drift. Your words can be kind and healing to others. Keep a list, so the day's practical pieces don't float away.",
  },

  // Reading houses H6, the sign on your 6th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-06-daily.md
  "HOUSE:6|Aries": {
    hook: "Your to do list never stood a chance.",
    text: "Aries puts speed into your daily work. You like tasks you can start and finish fast, and you work best with some independence and a little competition. Lilly said Mars rejoices in the 6th, and with its own sign here, hard work feels natural. Routines bore you unless they move. Build in breaks so the pace doesn't wear you down.",
  },
  "HOUSE:6|Taurus": {
    hook: "Your best days run on the same comfortable rhythm.",
    text: "Taurus makes daily life steady. You like a routine you can count on, work with something tangible in it and a pleasant place to do it. You're patient and reliable at work, and coworkers lean on you. Animals tend to calm you. Change your habits on purpose now and then so they don't harden.",
  },
  "HOUSE:6|Gemini": {
    hook: "Three tabs open and a podcast going is your ideal workday.",
    text: "Gemini makes daily life busy and varied. You juggle tasks, messages and errands, and work that involves talking, writing or moving around suits you. Coworkers enjoy your conversation. A day with no variety drains you. Keep one quiet hour so the important task gets finished.",
  },
  "HOUSE:6|Cancer": {
    hook: "You take care of your coworkers like they're family, and some of them notice.",
    text: "Cancer brings care into daily work. You like work that helps people or feeds them, and you create a warm atmosphere wherever you work. Pets matter a great deal to you. Your mood shapes your day more than your schedule does. Look after your own needs before everyone else's.",
  },
  "HOUSE:6|Leo": {
    hook: "Even your routine has a little flair.",
    text: "Leo wants daily work you can be proud of. You bring warmth and energy to a team, and you shine brightest when someone notices. Pride in good work keeps you going. Some tasks are thankless. Do them well anyway; the satisfaction is yours either way.",
  },
  "HOUSE:6|Virgo": {
    hook: "You've reorganized a coworker's desk, and they thanked you.",
    text: "Lilly gave the 6th Virgo and Mercury as cosignificators, so this sign fits the house closely. Order, method and useful service are second nature. You notice what needs fixing and you fix it. Small animals and gardens may thrive in your care. Leave room for good enough, since perfect costs more than it pays.",
  },
  "HOUSE:6|Libra": {
    hook: "A partner, a pleasant desk and good light, and you'll outwork anyone.",
    text: "Libra wants harmony in daily life. You're a fair, cooperative coworker, and an unbalanced workplace bothers you. Beauty in your surroundings makes you more productive. Conflict at work drains you quickly. Address the small problems before they become big ones.",
  },
  "HOUSE:6|Scorpio": {
    hook: "Give you a hard problem and a door that closes, and you'll disappear for hours.",
    text: "Scorpio makes daily work intense and focused. You like jobs that need depth: research, investigation, fixing what others gave up on. You're loyal to coworkers you trust and wary of the rest. Your habits can be all or nothing. Choose routines that renew you, not only ones that test you.",
  },
  "HOUSE:6|Sagittarius": {
    hook: "You need a job with a little travel in it, even if it's just across town.",
    text: "Sagittarius makes daily life roomy. Routine feels like a cage unless there's learning, movement or a bigger purpose in it. You're an encouraging coworker and a good teacher on the job. Animals, especially big outdoor ones, may feature in your life. Finish the boring parts; they hold up the interesting ones.",
  },
  "HOUSE:6|Capricorn": {
    hook: "You were the most reliable person at your first job, and probably your last one.",
    text: "Capricorn makes daily work disciplined. You keep schedules, meet deadlines and take responsibility seriously. People trust you with important tasks. Rest seems like a reward you haven't earned yet. Book it the way you book everything else.",
  },
  "HOUSE:6|Aquarius": {
    hook: "You've improved a process nobody asked you to touch.",
    text: "Aquarius brings invention to daily work. You prefer flexible hours, new tools and the freedom to do things your way. You're a friendly, fair coworker who treats everyone the same. Rigid routines frustrate you. Keep a few steady habits as a base for the experiments.",
  },
  "HOUSE:6|Pisces": {
    hook: "Your best work happens when you forget you're working.",
    text: "Pisces makes daily life fluid. You do well in caring, creative or quiet work, and you absorb the mood of a workplace. Animals and people in need find you. Schedules slip when you're inspired. Keep simple routines to hold the day together.",
  },

  // Reading houses H12, the sign on your 12th house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-12-hidden.md
  "HOUSE:12|Aries": {
    hook: "You recharge alone, and usually by moving.",
    text: "Aries in the most private part of your chart means some of your fire stays hidden. You may be bolder in private than people guess. A solo run, a long drive or a project nobody sees can be your way of resting. Anger you swallow tends to come back later. Find a private outlet for it, and it won't need a public one.",
  },
  "HOUSE:12|Taurus": {
    hook: "Your favorite kind of rest involves a nap and no witnesses.",
    text: "Taurus makes solitude comfortable. You restore yourself through quiet pleasures: a bath, a garden, music with your eyes closed. You may keep more of your needs to yourself than you should. Some of your best qualities, like patience and loyalty, work quietly behind the scenes. Let people see how much you care about comfort; it's nothing to hide.",
  },
  "HOUSE:12|Gemini": {
    hook: "Your head keeps talking long after everyone else has gone to sleep.",
    text: "Gemini makes your inner life busy. You process by writing, reading or talking to yourself, and journals may matter more to you than you admit. A lot of your thinking happens privately before it reaches anyone else. Quiet can feel noisy. Give your mind something to do when you need it to rest.",
  },
  "HOUSE:12|Cancer": {
    hook: "You feel more than you show, and you've gotten good at not showing it.",
    text: "Cancer in the hidden house keeps your feelings close. You care deeply in private and may look after people without telling anyone. Memories, especially old ones, live here. Your safest place may be a room no one else uses. Let someone into it now and then.",
  },
  "HOUSE:12|Leo": {
    hook: "Your best performance might be the one nobody sees.",
    text: "Leo in the 12th puts some of your light behind the curtain. You may be more creative, generous or proud in private than you seem in public. Recognition can feel awkward, even when you want it. Charity work and quiet acts of kindness suit you. Let yourself be seen a little more; you're allowed.",
  },
  "HOUSE:12|Virgo": {
    hook: "You worry quietly, and you'd rather nobody knew.",
    text: "Virgo in the hidden house turns your sharp eye inward. You notice your own flaws first and may fix things for others without credit. Quiet service, research and solitary craft can be deeply restful. Worry works best on paper. Write the list, then close the notebook.",
  },
  "HOUSE:12|Libra": {
    hook: "You keep the peace so well that nobody sees what it costs you.",
    text: "Libra in the 12th hides your need for harmony. You may avoid conflict in private, smoothing things over inside your own head. Beauty and art restore you when you're alone. Relationships carry a quiet weight you don't always mention. Say what bothers you before it piles up.",
  },
  "HOUSE:12|Scorpio": {
    hook: "You have a private world, and very few people have the key.",
    text: "With Scorpio here, your inner world runs deep and guarded. You process big feelings alone and come out changed. Research, psychology and anything that looks below the surface appeals to you. Secrets are safe with you, including your own. Find one person you can tell the truth to.",
  },
  "HOUSE:12|Sagittarius": {
    hook: "Your faith is private, and stronger than you let on.",
    text: "Sagittarius in the 12th puts your optimism somewhere quiet. You may hold beliefs you rarely discuss, or find meaning in solitude, retreats or long walks alone. Good luck tends to arrive when you least expect it, often through help you didn't see coming. Trust that quiet faith; it's carried you this far.",
  },
  "HOUSE:12|Capricorn": {
    hook: "You carry responsibilities nobody else knows about.",
    text: "Lilly said Saturn joys in the 12th, and Capricorn, Saturn's sign, fits this quiet house well. You work hard behind the scenes and may hold yourself to rules no one asked you to keep. Solitude feels productive to you. Your private ambitions run deep. Let yourself rest without justifying it.",
  },
  "HOUSE:12|Aquarius": {
    hook: "Your strangest ideas live in a notebook nobody's read.",
    text: "Aquarius on the 12th keeps an inventive, independent life going inside you. You may need more time alone than people realize, and your best ideas often arrive there. Quiet causes and anonymous help appeal to you. You can feel like an outsider even in groups you love. That distance is useful; just don't let it become loneliness.",
  },
  "HOUSE:12|Pisces": {
    hook: "Solitude doesn't feel lonely to you. It feels like coming home.",
    text: "Lilly gave the 12th Pisces as its cosignificator, so this sign is right where it belongs. Dreams, music, imagination and compassion fill your private hours. You need regular retreat to stay well. Spiritual practice, art or simple quiet refills you. Guard that time, because the world will always want more of you.",
  },

  // Reading houses H1, the sign on your 1st house (owner approved 11/20): docs/redesign/drafts/2026-11-20-houses-01-self.md
  "HOUSE:1|Aries": {
    hook: "You start before the starting gun.",
    text: "Your body moves before your plan does. Lilly linked this house to the head and face, and Aries, the head of the zodiac, leads with both: head first, every time. New beginnings are your favorite part of anything. You run hot and cool down fast. Learn your own warning signs and you'll spend less time apologizing.",
  },
  "HOUSE:1|Taurus": {
    hook: "You move at your own speed, and the world adjusts.",
    text: "Physically you're steady and grounded. Lilly's description calls Taurus \"well set,\" and you carry yourself like someone who doesn't need to hurry. You start slowly and finish what you start. Comfort and pleasure matter to your body. Move a little more than you'd choose to; it keeps the steadiness from turning into stillness.",
  },
  "HOUSE:1|Gemini": {
    hook: "Your hands talk as much as your mouth does.",
    text: "Quick, light and restless: Gemini sets your pace. Lilly pictured the sign as tall, active and \"of excellent understanding,\" and you likely think faster than you speak. You start many things at once, and your energy comes in bursts. Rest your mind as deliberately as you rest your body.",
  },
  "HOUSE:1|Cancer": {
    hook: "Your mood reaches your face a few seconds ahead of you.",
    text: "With Cancer here, body and feeling are tightly linked. Under the Moon, your energy rises and falls in tides. You approach new things carefully, testing the water first. Once you feel safe, you commit fully. Comfort and a soft landing help you begin.",
  },
  "HOUSE:1|Leo": {
    hook: "You stand like you're about to be introduced.",
    text: "There's warmth and strength in how you hold yourself. Lilly's Leo is \"strong valiant and active,\" and posture, pride and some flair come with it. You begin things boldly and like to lead. Your energy is generous. Give it somewhere to go, or it turns into restlessness.",
  },
  "HOUSE:1|Virgo": {
    hook: "You've noticed a loose thread on your sleeve right now.",
    text: "Virgo makes you precise in how you move and how you look after yourself. Lilly pictured the sign as slender and studious. You begin things with a plan. Your nerves can run your body more than you'd like. Give yourself permission to be unfinished.",
  },
  "HOUSE:1|Libra": {
    hook: "Your idea of getting ready involves checking the whole outfit twice.",
    text: "Grace comes through in how you move and dress. In Lilly's description Libra is tall and slender with a lovely face, and appearance matters to you, starting with your own. Beginnings come easier with company. Indecision can slow your first step. Choose, and adjust as you go.",
  },
  "HOUSE:1|Scorpio": {
    hook: "You can go very still, and people notice.",
    text: "Your presence is intense and controlled; Lilly drew Scorpio as strong, square and solid. You start things privately and finish them completely, and your energy runs deep rather than wide. You recover from hard times remarkably well. Let yourself relax in public now and then.",
  },
  "HOUSE:1|Sagittarius": {
    hook: "You walk fast, talk with your hands and laugh loudly.",
    text: "Sagittarius brings an outdoor kind of energy to your body. Lilly's Sagittarius is well favored and strong, and you tend to move freely and take up room. New beginnings feel like adventures. You'd rather be outside than in. Finish one journey before you plan the next.",
  },
  "HOUSE:1|Capricorn": {
    hook: "You were serious young, and you get lighter every decade.",
    text: "Discipline and composure show in how you carry yourself. Saturn rules the sign, and you tend to start slowly and gain strength with age. New things get caution and a plan. Your stamina is real. Let your body rest before it insists.",
  },
  "HOUSE:1|Aquarius": {
    hook: "Your style is your own, and it doesn't change with trends.",
    text: "Aquarius lends you an independent, slightly unusual way of carrying yourself. Lilly calls the sign \"rational, humane,\" and you tend to look calm while your mind races ahead. You start things your own way, on your own schedule, and you need freedom to move. Check in with your body, not only your ideas.",
  },
  "HOUSE:1|Pisces": {
    hook: "You can feel the mood of a room through the floor.",
    text: "Pisces makes your presence soft and receptive. You absorb the energy around you, so your body often knows how a room feels before your mind does. New beginnings come through intuition more than plans. Rest and water restore you. Set gentle boundaries so you don't carry everyone's mood home.",
  },

  'SUN:Aries': { hook: 'You\'d rather try and be wrong than wait and be right.', text: '' },
  'MOON:Cancer': { hook: 'Home isn\'t a place for you. It\'s the battery.', text: '' },
  'ASC:Pisces': { hook: 'People feel calmer around you and can\'t say why. Neither can you.', text: '' },

  'PATTERN:kite': {
    hook: 'A Grand Trine is talent that can sit on the couch. The Kite is the planet that hands it the car keys.',
    text: 'Three planets in the same element, each a third of the circle from the others, make a Grand Trine: a closed loop where things come easily. Easy is nice. Easy is also how gifts stay at home. A fourth planet opposite one corner, and friendly with the other two, turns that loop into a Kite. The opposition is the string; it pulls the talent out into the wind where it has to do something.\n\nThe fourth planet, the tip of the Kite, is the one to watch. It\'s where the pressure lives, and also where the whole pattern gets put to work.',
  },
}

