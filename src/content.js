export const profile = {
  name: 'Akshat Garg',
  role: 'Full-stack developer · React, Firebase, AWS',
  sub: 'CSE undergrad at VIT Bhopal and AWS Certified Solutions Architect – Associate. I build apps that replace paper-and-spreadsheet workflows.',
  email: 'akshatgarg0280@gmail.com',
  github: 'https://github.com/AkshatGarg2005',
  linkedin: 'https://www.linkedin.com/in/akshat-garg-vitbhopal/',
  resume: '/Akshat_Garg_Resume.pdf',
  photo: {
    src: '/akshat-800.jpg',
    srcSet: '/akshat-480.jpg 480w, /akshat-800.jpg 800w',
    sizes: '(min-width: 1024px) 360px, (min-width: 640px) 260px, 168px',
    width: 800,
    height: 1067,
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

export const education = {
  school: 'Vellore Institute of Technology, Bhopal',
  degree: 'B.Tech, Computer Science and Engineering',
  years: '2023–2027 (expected)',
  cgpa: '8.10/10',
}

export const about = "Off-screen, I'm into cinema and storytelling, and hunting down local food spots."
