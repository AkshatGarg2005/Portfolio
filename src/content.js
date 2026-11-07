export const profile = {
  name: 'Akshat Garg',
  role: 'Full-stack developer · React, Firebase, AWS',
  sub: 'CSE undergrad at VIT Bhopal and AWS Certified Solutions Architect – Associate. I build apps that replace paper-and-spreadsheet workflows.',
  email: 'akshatgarg0280@gmail.com',
  github: 'https://github.com/AkshatGarg2005',
  linkedin: 'https://www.linkedin.com/in/akshat-garg-vitbhopal/',
  resume: '/Akshat_Garg_Resume.pdf',
  // Made with scripts/make-photo.mjs. Keep sizes in sync with Hero.jsx and
  // the preload in index.html.
  photo: {
    src: '/akshat-960.webp',
    srcSet: '/akshat-480.webp 480w, /akshat-640.webp 640w, /akshat-960.webp 960w, /akshat-1200.webp 1200w',
    sizes: '(min-width: 1536px) 600px, (min-width: 1280px) 552px, (min-width: 1024px) 512px, (min-width: 640px) 460px, 360px',
    width: 960,
    height: 805,
  },
}

export const navLinks = [
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export const projects = [
  {
    name: 'Om Academy',
    summary: 'Coaching institute management system',
    date: 'Jun 2026',
    stack: ['React', 'Firebase', 'Firestore'],
    url: 'https://tinyurl.com/om-academy',
    accent: 'coral',
    visual: 'om',
    points: [
      'Replaced paper registers for 414 students: attendance, test reports, fees, enrollment',
      '3-tier role-based access (Admin → Teacher → Student) using scoped Firestore queries',
      'Automated fee tracking with due-date alerts and overdue flags; 6,952+ attendance records digitized; 99.3% on-time fee collection',
    ],
  },
  {
    name: 'Nourishfy',
    summary: 'AI nutrition and smart groceries',
    date: 'Sep 2025',
    stack: ['React', 'Firebase', 'Gemini AI', 'Tailwind'],
    url: 'https://tinyurl.com/nourishfy',
    accent: 'mint',
    visual: 'nourishfy',
    points: [
      'Turns health inputs (deficiencies, exclusions, symptoms) into personalized meal plans and grocery lists via the Gemini API',
      '6 Firestore collections with live listeners, Firebase Auth, 39 React components including 11 custom headless UI primitives',
      'Wikipedia image lookup with a 5-tier fallback and Firestore caching, so repeat lookups load near-instantly',
    ],
  },
  {
    name: 'IntelliQrHelp',
    summary: 'Smart emergency app',
    date: 'Jan 2025',
    stack: ['React 19', 'Firebase', 'Telegram Bot API'],
    url: 'https://tinyurl.com/intelliqrhelp',
    accent: 'violet',
    visual: 'intelliqr',
    points: [
      'QR medical profile (blood group, allergies, conditions, next of kin) that a responder reads with one scan, with no app or login',
      '1-click SOS sends real-time alerts to chosen contacts through Telegram',
      'QR codes never need reissuing because profile edits sync through Firestore',
    ],
  },
]

// `note` is shown as a small badge. Only add one when the rest of the site
// backs it up (a project or a certification).
export const skills = [
  {
    group: 'Languages',
    accent: 'amber',
    items: [{ name: 'Java', note: 'Oracle certified' }, { name: 'Python' }, { name: 'JavaScript' }, { name: 'HTML' }, { name: 'CSS' }],
  },
  {
    group: 'Frameworks',
    accent: 'pink',
    items: [{ name: 'React.js', note: '3 projects' }],
  },
  {
    group: 'Databases',
    accent: 'sky',
    items: [{ name: 'MySQL' }, { name: 'Firebase Firestore', note: '3 projects' }],
  },
  {
    group: 'Tools',
    accent: 'mint',
    items: [{ name: 'AWS', note: '3 certifications' }, { name: 'Git' }],
  },
]

// Newest first. The page shows them as a path from oldest to newest.
// `level` is the issuer's certification level; `icon` picks the emblem.
export const certifications = [
  { name: 'AWS Certified Solutions Architect – Associate', issuer: 'AWS', date: 'Jun 2026', level: 'Associate', icon: 'architect' },
  { name: 'AWS Certified AI Practitioner', issuer: 'AWS', date: 'May 2026', level: 'Foundational', icon: 'ai' },
  { name: 'AWS Certified Cloud Practitioner', issuer: 'AWS', date: 'May 2026', level: 'Foundational', icon: 'cloud' },
  { name: 'Oracle Certified Java Foundations Associate', issuer: 'Oracle', date: 'Jul 2025', level: 'Foundations', icon: 'java' },
]

// Newest first. `value` (0–1) sets the length of the score meter.
export const education = [
  {
    title: 'B.Tech, Computer Science and Engineering',
    school: 'Vellore Institute of Technology, Bhopal',
    years: '2023–2027 (expected)',
    score: '8.10',
    scoreLabel: 'CGPA / 10',
    value: 0.81,
    tone: 'mint',
    current: true,
  },
  {
    title: 'Class XII',
    school: "St. Luke's Senior Secondary School, Solan",
    years: '2023',
    score: '83%',
    scoreLabel: 'Percentage',
    value: 0.83,
    tone: 'sky',
  },
  {
    title: 'Class X',
    school: "St. Luke's Senior Secondary School, Solan",
    years: '2021',
    score: '90.17%',
    scoreLabel: 'Percentage',
    value: 0.9017,
    tone: 'amber',
  },
]

export const about = "Off-screen, I'm into cinema and storytelling, and hunting down local food spots."

// Sticky notes on the About board, taken from the sentence above.
export const interests = [
  { label: 'Cinema', icon: 'film', tone: 'pink' },
  { label: 'Storytelling', icon: 'book', tone: 'amber' },
  { label: 'Local food spots', icon: 'pin', tone: 'mint' },
]
