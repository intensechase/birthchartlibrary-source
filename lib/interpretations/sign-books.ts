// Sign-specific book recommendations for zodiac sign pages
// Amazon affiliate tag: birthchartlib-20

export interface SignBook {
  title: string
  author: string
  amazonUrl: string
  blurb: string
}

export const SIGN_BOOKS: Record<string, SignBook[]> = {
  Aries: [
    { title: 'The Aries Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/184018535X?tag=birthchartlib-20', blurb: 'A deep dive into what makes Aries tick... courage, impatience, and the drive to be first.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Practical astrology guide that helps you understand your Sun, Moon, and Rising... starting with who you are.' },
    { title: 'The Only Astrology Book You\'ll Ever Need', author: 'Joanna Martine Woolfolk', amazonUrl: 'https://www.amazon.com/dp/1589796535?tag=birthchartlib-20', blurb: 'The classic reference with comprehensive sign profiles, compatibility, and planetary interpretations.' },
  ],
  Taurus: [
    { title: 'The Taurus Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185260?tag=birthchartlib-20', blurb: 'An intimate look at Taurus values... beauty, security, patience, and the art of building something that lasts.' },
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'Explores your North Node placement... essential for understanding what your soul is growing toward.' },
    { title: 'The Only Astrology Book You\'ll Ever Need', author: 'Joanna Martine Woolfolk', amazonUrl: 'https://www.amazon.com/dp/1589796535?tag=birthchartlib-20', blurb: 'The classic reference with comprehensive sign profiles, compatibility, and planetary interpretations.' },
  ],
  Gemini: [
    { title: 'The Gemini Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185279?tag=birthchartlib-20', blurb: 'A portrait of the sign that thinks in two directions at once... curiosity, duality, and the need to communicate.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Advanced chart interpretation through ancient techniques... perfect for Gemini\'s intellectual appetite.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Practical astrology guide that helps you understand your Sun, Moon, and Rising.' },
  ],
  Cancer: [
    { title: 'The Cancer Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185309?tag=birthchartlib-20', blurb: 'Explores the emotional depth, family bonds, and protective instincts that define Cancer.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'A compassionate, psychologically rich approach to chart reading... resonates with Cancer\'s emotional intelligence.' },
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'Explores your North Node placement and soul\'s evolutionary path.' },
  ],
  Leo: [
    { title: 'The Leo Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185295?tag=birthchartlib-20', blurb: 'A celebration of Leo\'s warmth, creativity, and the deep need to be seen and valued.' },
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'A sweeping history of astrology and culture... worthy of Leo\'s appetite for grand narratives.' },
    { title: 'The Only Astrology Book You\'ll Ever Need', author: 'Joanna Martine Woolfolk', amazonUrl: 'https://www.amazon.com/dp/1589796535?tag=birthchartlib-20', blurb: 'The classic reference with comprehensive sign profiles and compatibility.' },
  ],
  Virgo: [
    { title: 'The Virgo Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185317?tag=birthchartlib-20', blurb: 'A nuanced look at Virgo\'s analytical mind, service orientation, and quiet perfectionism.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Rigorous, technique-driven astrology... exactly what Virgo respects.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'A thoughtful, psychologically grounded approach to chart interpretation.' },
  ],
  Libra: [
    { title: 'The Libra Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185333?tag=birthchartlib-20', blurb: 'Explores Libra\'s quest for balance, beauty, and meaningful partnership.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Accessible and beautifully written... suits Libra\'s aesthetic and relationship focus.' },
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'Understand your soul\'s evolutionary direction through the North Node.' },
  ],
  Scorpio: [
    { title: 'The Scorpio Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185325?tag=birthchartlib-20', blurb: 'A deep exploration of Scorpio\'s intensity, transformation, and the power they carry.' },
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'A profound work connecting planetary cycles to historical transformation... Scorpio\'s kind of book.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Psychologically deep chart reading that honors complexity.' },
  ],
  Sagittarius: [
    { title: 'The Sagittarius Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185287?tag=birthchartlib-20', blurb: 'A portrait of the adventurer... Sagittarius\'s love of truth, freedom, and the big picture.' },
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Philosophy meets astrology in a sweeping narrative... perfect for Sagittarius\'s love of meaning.' },
    { title: 'The Only Astrology Book You\'ll Ever Need', author: 'Joanna Martine Woolfolk', amazonUrl: 'https://www.amazon.com/dp/1589796535?tag=birthchartlib-20', blurb: 'Comprehensive and wide-ranging... the reference book every sign should own.' },
  ],
  Capricorn: [
    { title: 'The Capricorn Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185341?tag=birthchartlib-20', blurb: 'Explores Capricorn\'s ambition, discipline, and the long game they were born to play.' },
    { title: 'Astrology and the Authentic Self', author: 'Demetra George', amazonUrl: 'https://www.amazon.com/dp/0892541490?tag=birthchartlib-20', blurb: 'Structured, rigorous, and rewarding... the kind of astrology book Capricorn respects.' },
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'Understand your karmic direction and the lessons you\'re here to master.' },
  ],
  Aquarius: [
    { title: 'The Aquarius Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185244?tag=birthchartlib-20', blurb: 'A look at Aquarius\'s independence, innovation, and the collective vision they carry.' },
    { title: 'Cosmos and Psyche', author: 'Richard Tarnas', amazonUrl: 'https://www.amazon.com/dp/0452288592?tag=birthchartlib-20', blurb: 'Intellectual, progressive, and paradigm-shifting... exactly Aquarius\'s frequency.' },
    { title: 'You Were Born for This', author: 'Chani Nicholas', amazonUrl: 'https://www.amazon.com/dp/0062820729?tag=birthchartlib-20', blurb: 'Practical and socially conscious astrology.' },
  ],
  Pisces: [
    { title: 'The Pisces Enigma', author: 'Jane Ridder-Patrick', amazonUrl: 'https://www.amazon.com/dp/1840185252?tag=birthchartlib-20', blurb: 'An exploration of Pisces\'s imagination, compassion, and the spiritual depth they inhabit.' },
    { title: 'The Inner Sky', author: 'Steven Forrest', amazonUrl: 'https://www.amazon.com/dp/0979067715?tag=birthchartlib-20', blurb: 'Poetic, compassionate, and spiritually aware... a book that speaks Pisces\'s language.' },
    { title: 'Astrology for the Soul', author: 'Jan Spiller', amazonUrl: 'https://www.amazon.com/dp/0553378384?tag=birthchartlib-20', blurb: 'The North Node book that helps you understand your soul\'s journey.' },
  ],
}
