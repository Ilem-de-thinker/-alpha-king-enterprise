const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'alpharking-secret-key-change-in-production';
const DB_PATH = path.join(__dirname, 'data.db');

app.use(cors());
app.use(express.json());

let db;

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    next();
  } catch { return res.status(401).json({ message: 'Invalid token' }); }
}

function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function row(r) {
  if (!r) return null;
  const o = {};
  for (const k of Object.keys(r)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    let val = r[k];
    if (k === 'tags' && typeof val === 'string') val = JSON.parse(val);
    if (k === 'body_paragraphs' && typeof val === 'string') val = JSON.parse(val);
    if (k === 'quick_links' && typeof val === 'string') val = JSON.parse(val);
    if (k === 'service_links' && typeof val === 'string') val = JSON.parse(val);
    if (k === 'policies' && typeof val === 'string') val = JSON.parse(val);
    if (k === 'is_read') { o.read = Boolean(val); continue; }
    if (k === 'ord') { o.order = val; continue; }
    if (k === 'parent_id') { o.parentId = val; continue; }
    if (k === 'post_id') { o.postId = val; continue; }
    if (k === 'featured_image') { o.featuredImage = val; continue; }
    if (k === 'read_time') { o.readTime = val; continue; }
    if (k === 'published_at') { o.publishedAt = val; continue; }
    if (k === 'created_at') { o.createdAt = val; continue; }
    if (k === 'updated_at') { o.updatedAt = val; continue; }
    if (k === 'cta_primary_text') { o.ctaPrimaryText = val; continue; }
    if (k === 'cta_primary_url') { o.ctaPrimaryUrl = val; continue; }
    if (k === 'cta_secondary_text') { o.ctaSecondaryText = val; continue; }
    if (k === 'cta_secondary_url') { o.ctaSecondaryUrl = val; continue; }
    if (k === 'main_image') { o.mainImage = val; continue; }
    if (k === 'accent_image') { o.accentImage = val; continue; }
    if (k === 'float_card_icon') { o.floatCardIcon = val; continue; }
    if (k === 'float_card_value') { o.floatCardValue = val; continue; }
    if (k === 'float_card_label') { o.floatCardLabel = val; continue; }
    if (k === 'badge_value') { o.badgeValue = val; continue; }
    if (k === 'badge_label') { o.badgeLabel = val; continue; }
    if (k === 'cta_text') { o.ctaText = val; continue; }
    if (k === 'cta_url') { o.ctaUrl = val; continue; }
    if (k === 'lead_paragraph') { o.leadParagraph = val; continue; }
    if (k === 'secondary_image') { o.secondaryImage = val; continue; }
    if (k === 'hero_image') { o.heroImage = val; continue; }
    if (k === 'button_text') { o.buttonText = val; continue; }
    if (k === 'button_url') { o.buttonUrl = val; continue; }
    if (k === 'background_image') { o.backgroundImage = val; continue; }
    if (k === 'brand_description') { o.brandDescription = val; continue; }
    if (k === 'contact_address') { o.contactAddress = val; continue; }
    if (k === 'contact_phone') { o.contactPhone = val; continue; }
    if (k === 'contact_email') { o.contactEmail = val; continue; }
    if (k === 'contact_hours') { o.contactHours = val; continue; }
    o[camel] = val;
  }
  if (o.approved !== undefined) o.approved = Boolean(o.approved);
  if (o.subscribed !== undefined) o.subscribed = Boolean(o.subscribed);
  delete o.is_read;
  return o;
}

function rows(rs) { return (rs || []).map(row); }

function q(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    if (sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().includes('RETURNING')) {
      stmt.bind(params);
      const results = [];
      while (stmt.step()) results.push(stmt.getAsObject());
      stmt.free();
      return results;
    } else {
      stmt.run(params);
      stmt.free();
      saveDb();
      return { changes: db.getRowsModified() };
    }
  } catch (e) {
    console.error('DB Error:', e.message, 'SQL:', sql, 'Params:', params);
    throw e;
  }
}

function qOne(sql, params = []) {
  const r = q(sql, params);
  return r.length ? r[0] : null;
}

async function initDb() {
  const SQL = await initSqlJs();
  const exists = fs.existsSync(DB_PATH);
  const buffer = exists ? fs.readFileSync(DB_PATH) : null;
  db = new SQL.Database(buffer);

  db.run(`CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
    role TEXT DEFAULT 'admin', created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
    excerpt TEXT, content TEXT, featured_image TEXT, category TEXT,
    tags TEXT DEFAULT '[]', author TEXT, read_time TEXT,
    published_at TEXT, created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY, post_id TEXT, name TEXT NOT NULL,
    email TEXT NOT NULL, content TEXT NOT NULL,
    approved INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, slug TEXT UNIQUE NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS hero (
    id TEXT PRIMARY KEY DEFAULT 'hero', badge TEXT, title TEXT, highlight TEXT,
    subtitle TEXT, cta_primary_text TEXT, cta_primary_url TEXT,
    cta_secondary_text TEXT, cta_secondary_url TEXT,
    main_image TEXT, accent_image TEXT,
    float_card_icon TEXT, float_card_value TEXT, float_card_label TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS hero_stats (
    id TEXT PRIMARY KEY, value TEXT, label TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS trust_bar_items (
    id TEXT PRIMARY KEY, icon TEXT, text TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS counters (
    id TEXT PRIMARY KEY, icon TEXT, number INTEGER DEFAULT 0,
    suffix TEXT DEFAULT '+', label TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS why_us (
    id TEXT PRIMARY KEY DEFAULT 'why-us', tag TEXT, title TEXT, highlight TEXT,
    description TEXT, image TEXT, badge_value TEXT, badge_label TEXT,
    cta_text TEXT, cta_url TEXT, updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS why_us_checklist (
    id TEXT PRIMARY KEY, icon TEXT, title TEXT, description TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cta_banner (
    id TEXT PRIMARY KEY DEFAULT 'cta-banner', title TEXT, highlight TEXT,
    description TEXT, button_text TEXT, button_url TEXT, background_image TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT,
    image TEXT, category TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS about (
    id TEXT PRIMARY KEY DEFAULT 'about', tag TEXT, title TEXT, highlight TEXT,
    lead_paragraph TEXT, body_paragraphs TEXT DEFAULT '[]',
    main_image TEXT, secondary_image TEXT,
    badge_value TEXT, badge_label TEXT, cta_text TEXT, cta_url TEXT,
    hero_image TEXT, updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS about_features (
    id TEXT PRIMARY KEY, icon TEXT DEFAULT 'fa-check', text TEXT NOT NULL, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS mvv (
    id TEXT PRIMARY KEY DEFAULT 'mvv', tag TEXT, title TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS mvv_items (
    id TEXT PRIMARY KEY, icon TEXT, title TEXT, description TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
    icon TEXT, description TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS process_steps (
    id TEXT PRIMARY KEY, step TEXT, title TEXT, description TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT,
    image TEXT, linkedin TEXT, twitter TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS faq_items (
    id TEXT PRIMARY KEY, question TEXT NOT NULL, answer TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS contact_msgs (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL,
    phone TEXT, service TEXT, message TEXT,
    is_read INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS newsletters (
    id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL,
    subscribed INTEGER DEFAULT 1, created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS newsletter_section (
    id TEXT PRIMARY KEY DEFAULT 'newsletter-section', title TEXT, description TEXT,
    icon TEXT, placeholder TEXT, button_text TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS footer (
    id TEXT PRIMARY KEY DEFAULT 'footer', brand_description TEXT,
    quick_links TEXT DEFAULT '[]', service_links TEXT DEFAULT '[]',
    contact_address TEXT, contact_phone TEXT, contact_email TEXT,
    contact_hours TEXT, policies TEXT DEFAULT '[]',
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS nav_items (
    id TEXT PRIMARY KEY, label TEXT NOT NULL, url TEXT,
    parent_id TEXT, ord INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS company (
    id TEXT PRIMARY KEY DEFAULT 'company', name TEXT, logo TEXT,
    description TEXT, email TEXT, phone TEXT, address TEXT, hours TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS social (
    id TEXT PRIMARY KEY DEFAULT 'social', facebook TEXT, twitter TEXT,
    linkedin TEXT, instagram TEXT, updated_at TEXT DEFAULT (datetime('now'))
  )`);

  saveDb();
}

function seed() {
  const existing = qOne('SELECT COUNT(*) as c FROM admin_users');
  if (existing.c > 0) { console.log('Database already seeded'); return; }
  console.log('Seeding database...');

  const hash = bcrypt.hashSync('admin123', 10);
  q("INSERT INTO admin_users (id, email, password, role) VALUES (?, ?, ?, ?)", [uuidv4(), 'admin@alpharkingenterprise.com', hash, 'admin']);

  for (const name of ['Blockchain','Web3','Smart Contracts','DeFi','Tokenization','Enterprise']) {
    q("INSERT INTO categories (id, name, slug) VALUES (?, ?, ?)", [uuidv4(), name, slugify(name)]);
  }
  for (const name of ['Blockchain','Web3','Smart Contracts','DeFi','Tokenization','Enterprise','DApps','Ethereum','Security']) {
    q("INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)", [uuidv4(), name, slugify(name)]);
  }

  q("INSERT OR REPLACE INTO hero (id, badge, title, highlight, subtitle, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, main_image, accent_image, float_card_icon, float_card_value, float_card_label) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ['hero', 'AlpharKing Enterprise \u00b7 Building Trusted Blockchain Solutions', 'Building the Future of Blockchain Innovation', 'Blockchain', 'Transforming ideas into secure, scalable, and innovative blockchain solutions that drive growth and create new opportunities.', 'Start Your Project', '/services.html', 'Explore Our Work', '/services.html', '/img/bg-img/1.jpg', '/img/bg-img/3.jpg', 'fa-line-chart', '+18.4%', 'Annual Returns']);

  const stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '5+', label: 'Years Experience' }
  ];
  stats.forEach((s, i) => q("INSERT INTO hero_stats (id, value, label, ord) VALUES (?, ?, ?, ?)", [uuidv4(), s.value, s.label, i]));

  const trustItems = [
    'fa-shield,Security First', 'fa-check-circle,Industry Expertise', 'fa-users,Tailored Solutions',
    'fa-lock,Scalable Architecture', 'fa-trophy,Transparent Process', 'fa-globe,Long-Term Partnership'
  ];
  trustItems.forEach((t, i) => { const [icon, text] = t.split(','); q("INSERT INTO trust_bar_items (id, icon, text, ord) VALUES (?, ?, ?, ?)", [uuidv4(), icon, text, i]); });

  const counters = [
    { icon: 'fa-users', number: 50, label: 'Projects Delivered' },
    { icon: 'fa-briefcase', number: 30, label: 'Enterprise Clients' },
    { icon: 'fa-globe', number: 12, label: 'Industries Served' },
    { icon: 'fa-trophy', number: 5, label: 'Years of Innovation' }
  ];
  counters.forEach((c, i) => q("INSERT INTO counters (id, icon, number, suffix, label, ord) VALUES (?, ?, ?, ?, ?, ?)", [uuidv4(), c.icon, c.number, '+', c.label, i]));

  q("INSERT OR REPLACE INTO why_us (id, tag, title, highlight, description, image, badge_value, badge_label, cta_text, cta_url) VALUES (?,?,?,?,?,?,?,?,?,?)",
    ['why-us', 'Why AlpharKing Enterprise', 'Building Trusted Blockchain Solutions', 'Blockchain Solutions', 'We combine deep technical expertise with strategic insight to deliver blockchain solutions that solve real-world problems.', '/img/bg-img/5.jpg', '50+', 'Projects Delivered', 'Discover Our Story', '/about.html']);

  const checklist = [
    { title: 'Security First', desc: 'Every solution is developed with a strong focus on security, reliability, and best practices.' },
    { title: 'Industry Expertise', desc: 'Our team stays at the forefront of blockchain innovation and emerging technologies.' },
    { title: 'Tailored Solutions', desc: 'Every project is designed around the specific needs and objectives of our clients.' }
  ];
  checklist.forEach((c, i) => q("INSERT INTO why_us_checklist (id, icon, title, description, ord) VALUES (?, ?, ?, ?, ?)", [uuidv4(), 'fa-check-circle', c.title, c.desc, i]));

  q("INSERT OR REPLACE INTO cta_banner (id, title, highlight, description, button_text, button_url, background_image) VALUES (?,?,?,?,?,?,?)",
    ['cta-banner', 'Ready to Build Your Blockchain Solution?', 'Blockchain Solution?', 'Partner with AlpharKing Enterprise and bring your vision to life with secure, scalable blockchain technology.', 'Start Your Project', '/contact.html', '/img/bg-img/6.jpg']);

  const projects = [
    { title: 'Enterprise Asset Management Platform', desc: 'A blockchain-powered platform designed to improve transparency and traceability across digital asset operations.', img: '/img/bg-img/32.jpg', cat: 'Blockchain Platform' },
    { title: 'Decentralized Marketplace', desc: 'A Web3 marketplace enabling secure peer-to-peer transactions with reduced reliance on intermediaries.', img: '/img/bg-img/33.jpg', cat: 'Web3 Platform' },
    { title: 'Smart Contract Automation System', desc: 'A solution that automates contract execution and business workflows through blockchain technology.', img: '/img/bg-img/14.jpg', cat: 'Smart Contract System' }
  ];
  projects.forEach((p, i) => q("INSERT INTO projects (id, title, description, image, category, ord) VALUES (?, ?, ?, ?, ?, ?)", [uuidv4(), p.title, p.desc, p.img, p.cat, i]));

  q("INSERT OR REPLACE INTO about (id, tag, title, highlight, lead_paragraph, body_paragraphs, main_image, secondary_image, badge_value, badge_label, cta_text, cta_url, hero_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ['about', 'Who We Are', 'Making Blockchain Practical & Accessible', 'Practical & Accessible', 'AlpharKing Enterprise was founded with a simple mission: to make blockchain technology practical, secure, and accessible for businesses of all sizes.',
     JSON.stringify(['Our team brings together decades of combined experience in blockchain development, smart contract engineering, and enterprise digital transformation.', 'We believe that blockchain technology has the power to reshape industries, and we are committed to delivering solutions that create real, measurable impact.']),
     '/img/bg-img/14.jpg', '/img/bg-img/5.jpg', '5+', 'Years of Innovation', 'View Our Services', '/services.html', '/img/bg-img/2.jpg']);

  const features = [
    'Blockchain Development & Architecture', 'Smart Contract Design & Auditing',
    'Web3 & DApp Development', 'Token Ecosystem & Digital Assets'
  ];
  features.forEach((f, i) => q("INSERT INTO about_features (id, icon, text, ord) VALUES (?, ?, ?, ?)", [uuidv4(), 'fa-check', f, i]));

  q("INSERT OR REPLACE INTO mvv (id, tag, title) VALUES (?, ?, ?)", ['mvv', 'Our Foundation', 'Vision, Mission & Values']);

  const mvvItems = [
    { icon: 'fa-eye', title: 'Our Vision', desc: 'To become a leading provider of innovative blockchain solutions that transform how businesses operate and create value in the digital economy.' },
    { icon: 'fa-bullseye', title: 'Our Mission', desc: 'To build reliable, scalable, and impactful blockchain systems that solve real-world problems and drive enterprise growth.' },
    { icon: 'fa-heart', title: 'Our Values', desc: 'Transparency, innovation, security-first thinking, and a relentless focus on delivering measurable results for our clients.' }
  ];
  mvvItems.forEach((m, i) => q("INSERT INTO mvv_items (id, icon, title, description, ord) VALUES (?, ?, ?, ?, ?)", [uuidv4(), m.icon, m.title, m.desc, i]));

  const services = [
    { title: 'Blockchain Development', icon: 'icon-profits', desc: 'Custom blockchain platforms and decentralized systems built to meet specific business requirements.' },
    { title: 'Smart Contract Development', icon: 'icon-money-1', desc: 'Secure, audited, and efficient smart contracts that automate business processes and reduce operational costs.' },
    { title: 'Decentralized Applications (DApps)', icon: 'icon-coin', desc: 'User-friendly blockchain applications designed for scalability, performance, and security.' },
    { title: 'Web3 Integration', icon: 'icon-smartphone-1', desc: 'Connecting businesses to the decentralized web through wallets, token systems, and blockchain infrastructure.' },
    { title: 'Token Development', icon: 'icon-diamond', desc: 'Creation of utility tokens, governance tokens, stablecoins, and digital asset ecosystems.' },
    { title: 'Blockchain Consulting', icon: 'icon-piggy-bank', desc: 'Strategic guidance to help organizations understand, evaluate, and implement blockchain technology effectively.' }
  ];
  services.forEach((s, i) => q("INSERT INTO services (id, title, slug, icon, description, ord) VALUES (?, ?, ?, ?, ?, ?)", [uuidv4(), s.title, slugify(s.title), s.icon, s.desc, i]));

  const steps = [
    { step: '01', title: 'Discovery', desc: 'We learn about your business goals, challenges, and requirements.' },
    { step: '02', title: 'Strategy', desc: 'We design a tailored blockchain strategy and solution architecture.' },
    { step: '03', title: 'Development', desc: 'We build, test, and iterate on your solution with agile methodology.' },
    { step: '04', title: 'Deployment', desc: 'We deploy your solution and ensure smooth integration with existing systems.' },
    { step: '05', title: 'Support', desc: 'We provide ongoing support, maintenance, and optimization.' }
  ];
  steps.forEach((s, i) => q("INSERT INTO process_steps (id, step, title, description, ord) VALUES (?, ?, ?, ?, ?)", [uuidv4(), s.step, s.title, s.desc, i]));

  const team = [
    { name: 'Adebayo Ogunlesi', role: 'Founder & CEO', img: '/img/bg-img/team1.jpg' },
    { name: 'Chioma Nwachukwu', role: 'Head of Engineering', img: '/img/bg-img/team2.jpg' },
    { name: 'Emeka Obi', role: 'Lead Blockchain Developer', img: '/img/bg-img/team3.jpg' },
    { name: 'Fatima Mohammed', role: 'Enterprise Solutions Lead', img: '/img/bg-img/team4.jpg' }
  ];
  team.forEach((t, i) => q("INSERT INTO team_members (id, name, role, image, linkedin, twitter, ord) VALUES (?, ?, ?, ?, ?, ?, ?)", [uuidv4(), t.name, t.role, t.img, '#', '#', i]));

  const faqs = [
    { q: 'How do I get started with AlpharKing Enterprise?', a: 'Simply reach out through our contact form or schedule a consultation call. We will discuss your project needs and provide a tailored proposal.' },
    { q: 'What industries do you serve?', a: 'We serve a wide range of industries including finance, supply chain, healthcare, real estate, logistics, and government sectors.' },
    { q: 'Do you provide smart contract auditing?', a: 'Yes, we offer comprehensive smart contract audits including security analysis, gas optimization, and best practice recommendations.' },
    { q: 'Can you work with existing systems?', a: 'Absolutely. We specialize in integrating blockchain solutions with existing enterprise systems and legacy infrastructure.' }
  ];
  faqs.forEach((f, i) => q("INSERT INTO faq_items (id, question, answer, ord) VALUES (?, ?, ?, ?)", [uuidv4(), f.q, f.a, i]));

  q("INSERT OR REPLACE INTO newsletter_section (id, title, description, icon, placeholder, button_text) VALUES (?,?,?,?,?,?)",
    ['newsletter-section', 'Stay Informed', 'Weekly blockchain insights, industry analysis, and company updates.', 'fa-envelope-o', 'Enter your email address', 'Subscribe']);

  q("INSERT OR REPLACE INTO footer (id, brand_description, quick_links, service_links, contact_address, contact_phone, contact_email, contact_hours, policies) VALUES (?,?,?,?,?,?,?,?,?)",
    ['footer', 'Building secure, scalable, and innovative blockchain solutions for businesses, startups, and organizations around the world.',
     JSON.stringify([{ label: 'Home', url: '/' }, { label: 'About Us', url: '/about.html' }, { label: 'Services', url: '/services.html' }, { label: 'Insights', url: '/post.html' }, { label: 'Contact', url: '/contact.html' }]),
     JSON.stringify([{ label: 'Blockchain Development', url: '/services.html' }, { label: 'Smart Contracts', url: '/services.html' }, { label: 'DApps', url: '/services.html' }, { label: 'Web3 Integration', url: '/services.html' }, { label: 'Blockchain Consulting', url: '/services.html' }]),
     'Available Worldwide', '+XXX XXX XXXX', 'hello@alpharkingenterprise.com', 'Mon\u2013Fri, 9am \u2013 6pm',
     JSON.stringify([{ label: 'Privacy Policy', url: '#' }, { label: 'Terms of Use', url: '#' }, { label: 'Cookie Policy', url: '#' }])]);

  const navLabels = ['Home', 'About', 'Services', 'Solutions', 'Insights', 'Contact'];
  const navIds = {};
  navLabels.forEach((label, i) => {
    const id = uuidv4();
    navIds[label] = id;
    const url = label === 'Home' ? '/' : label === 'Insights' ? '/post.html' : label === 'Contact' ? '/contact.html' : (label === 'About' || label === 'Services') ? '/' + label.toLowerCase() + '.html' : null;
    q("INSERT INTO nav_items (id, label, url, parent_id, ord) VALUES (?, ?, ?, ?, ?)", [id, label, url, null, i]);
  });
  const children = [
    { label: 'About Us', url: '/about.html', parent: 'About' },
    { label: 'Our Services', url: '/services.html', parent: 'About' },
    { label: 'Blockchain Development', url: '#', parent: 'Solutions' },
    { label: 'Smart Contracts', url: '#', parent: 'Solutions' },
    { label: 'DApps', url: '#', parent: 'Solutions' },
    { label: 'Enterprise Services', url: '#', parent: 'Solutions' }
  ];
  children.forEach((c, i) => q("INSERT INTO nav_items (id, label, url, parent_id, ord) VALUES (?, ?, ?, ?, ?)", [uuidv4(), c.label, c.url, navIds[c.parent], i + 10]));

  q("INSERT OR REPLACE INTO company (id, name, logo, description, email, phone, address, hours) VALUES (?,?,?,?,?,?,?,?)",
    ['company', 'AlpharKing Enterprise', 'AK', 'Building secure, scalable, and innovative blockchain solutions for businesses, startups, and organizations around the world.', 'hello@alpharkingenterprise.com', '+XXX XXX XXXX', 'Available Worldwide', 'Mon\u2013Fri, 9am \u2013 6pm']);

  q("INSERT OR REPLACE INTO social (id, facebook, twitter, linkedin, instagram) VALUES (?,?,?,?,?)",
    ['social', '#', '#', '#', '#']);

  const posts = [
    { title: 'Blockchain Technology in Enterprise: A Strategic Overview', excerpt: 'Discover how enterprises are leveraging blockchain for transparency, security, and operational efficiency.', cat: 'Blockchain', tags: ['Blockchain', 'Enterprise'], author: 'Adebayo Ogunlesi', img: '/img/bg-img/10.jpg', time: '6 min read', date: '2026-04-26' },
    { title: 'Web3 Integration: A Guide for Forward-Thinking Businesses', excerpt: 'Learn how businesses can integrate Web3 technologies to unlock new opportunities and digital value.', cat: 'Web3', tags: ['Web3', 'Enterprise', 'DApps'], author: 'Chioma Nwachukwu', img: '/img/bg-img/11.jpg', time: '5 min read', date: '2026-04-20' },
    { title: 'Smart Contracts 101: Automating Business with Blockchain', excerpt: 'A comprehensive introduction to smart contracts and how they automate business processes.', cat: 'Smart Contracts', tags: ['Smart Contracts', 'Ethereum'], author: 'Emeka Obi', img: '/img/bg-img/12.jpg', time: '7 min read', date: '2026-04-14' },
    { title: 'DeFi in 2026: Trends and Opportunities for Enterprises', excerpt: 'Explore the latest trends in decentralized finance and what they mean for traditional businesses.', cat: 'DeFi', tags: ['DeFi', 'Blockchain'], author: 'Fatima Mohammed', img: '/img/bg-img/13.jpg', time: '8 min read', date: '2026-04-08' },
    { title: 'Tokenization: Unlocking Value Through Digital Assets', excerpt: 'How tokenization is transforming asset management and creating new investment opportunities.', cat: 'Tokenization', tags: ['Tokenization', 'Ethereum', 'Blockchain'], author: 'Adebayo Ogunlesi', img: '/img/bg-img/23.jpg', time: '6 min read', date: '2026-03-28' },
    { title: 'Blockchain Security: Best Practices for Enterprise Deployments', excerpt: 'Essential security considerations for enterprises deploying blockchain solutions at scale.', cat: 'Enterprise', tags: ['Security', 'Enterprise', 'Blockchain'], author: 'Chioma Nwachukwu', img: '/img/bg-img/24.jpg', time: '9 min read', date: '2026-03-15' }
  ];

  for (const p of posts) {
    const id = uuidv4();
    const content = `<h3>Introduction</h3><p>This article explores ${p.cat.toLowerCase()} and its impact on modern business. ${p.excerpt}</p><h3>Key Insights</h3><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><h3>Conclusion</h3><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`;
    q("INSERT INTO posts (id, title, slug, excerpt, content, featured_image, category, tags, author, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, p.title, slugify(p.title), p.excerpt, content, p.img, p.cat, JSON.stringify(p.tags), p.author, p.time, p.date]);

    if (p === posts[0]) {
      const comments = [
        { name: 'John Smith', email: 'john@example.com', content: 'Great article! Very informative and well-written.', approved: 1 },
        { name: 'Sarah Johnson', email: 'sarah@example.com', content: 'This really helped me understand blockchain better. Thanks!', approved: 1 },
        { name: 'Mike Davis', email: 'mike@example.com', content: 'I would love to see more case studies on this topic.', approved: 0 }
      ];
      for (const c of comments) {
        q("INSERT INTO comments (id, post_id, name, email, content, approved) VALUES (?, ?, ?, ?, ?, ?)",
          [uuidv4(), id, c.name, c.email, c.content, c.approved]);
      }
    }
  }

  saveDb();
  console.log('Database seeded successfully!');
}

// ===== API ROUTES =====
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
  const user = qOne('SELECT * FROM admin_users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

app.post('/api/auth/logout', requireAuth, (req, res) => res.json({ message: 'Logged out' }));

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = qOne('SELECT id, email, role FROM admin_users WHERE id = ?', [req.user.id]);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// ===== POSTS =====
app.get('/api/posts', (req, res) => {
  let sql = 'SELECT * FROM posts WHERE 1=1';
  const params = [];
  if (req.query.category) { sql += ' AND category = ?'; params.push(req.query.category); }
  if (req.query.tag) { sql += ' AND tags LIKE ?'; params.push('%' + req.query.tag + '%'); }
  if (req.query.search) { sql += ' AND (title LIKE ? OR excerpt LIKE ?)'; params.push('%' + req.query.search + '%', '%' + req.query.search + '%'); }
  sql += ' ORDER BY published_at DESC';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const total = qOne('SELECT COUNT(*) as c FROM (' + sql.replace('SELECT *', 'SELECT 1') + ')', params).c;
  const all = q(sql + ' LIMIT ? OFFSET ?', [...params, limit, offset]);
  res.json({ posts: rows(all), total, page, totalPages: Math.ceil(total / limit) });
});

app.get('/api/posts/:slug', (req, res) => {
  const post = qOne('SELECT * FROM posts WHERE slug = ? OR id = ?', [req.params.slug, req.params.slug]);
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(row(post));
});

app.post('/api/posts', requireAuth, (req, res) => {
  const id = uuidv4();
  const { title, slug, excerpt, content, featuredImage, category, tags, author, readTime, publishedAt } = req.body;
  const finalSlug = slug || slugify(title);
  const existing = qOne('SELECT id FROM posts WHERE slug = ?', [finalSlug]);
  if (existing) return res.status(400).json({ message: 'A post with this slug already exists' });
  q("INSERT INTO posts (id,title,slug,excerpt,content,featured_image,category,tags,author,read_time,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [id, title, finalSlug, excerpt || '', content || '', featuredImage || '', category || '', JSON.stringify(tags || []), author || '', readTime || '', publishedAt || new Date().toISOString()]);
  saveDb();
  res.status(201).json(row(qOne('SELECT * FROM posts WHERE id = ?', [id])));
});

app.put('/api/posts/:id', requireAuth, (req, res) => {
  const data = { ...req.body, updated_at: new Date().toISOString() };
  delete data.id;
  if (data.tags && Array.isArray(data.tags)) data.tags = JSON.stringify(data.tags);
  const keyMap = { title: 'title', slug: 'slug', excerpt: 'excerpt', content: 'content', featuredImage: 'featured_image', category: 'category', tags: 'tags', author: 'author', readTime: 'read_time', publishedAt: 'published_at', updated_at: 'updated_at' };
  const sets = Object.keys(data).filter(k => keyMap[k]).map(k => keyMap[k] + ' = ?');
  const vals = Object.keys(data).filter(k => keyMap[k]).map(k => data[k]);
  q("UPDATE posts SET " + sets.join(', ') + " WHERE id = ?", [...vals, req.params.id]);
  saveDb();
  res.json({ message: 'Updated' });
});

app.delete('/api/posts/:id', requireAuth, (req, res) => {
  q("DELETE FROM posts WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

// ===== COMMENTS =====
app.get('/api/posts/:id/comments', (req, res) => {
  const items = q("SELECT * FROM comments WHERE post_id = ? AND approved = 1 ORDER BY created_at DESC", [req.params.id]);
  res.json(rows(items));
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { name, email, content } = req.body;
  if (!name || !email || !content) return res.status(400).json({ message: 'Name, email, and content required' });
  q("INSERT INTO comments (id,post_id,name,email,content,approved) VALUES (?,?,?,?,?,0)", [uuidv4(), req.params.id, name, email, content]);
  saveDb();
  res.status(201).json({ message: 'Comment submitted for approval' });
});

app.put('/api/comments/:id', requireAuth, (req, res) => {
  const { approved, content } = req.body;
  if (approved !== undefined) q("UPDATE comments SET approved = ? WHERE id = ?", [approved ? 1 : 0, req.params.id]);
  if (content !== undefined) q("UPDATE comments SET content = ? WHERE id = ?", [content, req.params.id]);
  saveDb();
  res.json({ message: 'Updated' });
});

app.delete('/api/comments/:id', requireAuth, (req, res) => {
  q("DELETE FROM comments WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

app.get('/api/posts/default/comments', requireAuth, (req, res) => {
  const items = q("SELECT * FROM comments ORDER BY created_at DESC");
  res.json(rows(items));
});

// ===== CATEGORIES =====
app.get('/api/categories', (req, res) => {
  const cats = rows(q("SELECT * FROM categories ORDER BY name ASC"));
  for (const c of cats) {
    c.postCount = qOne("SELECT COUNT(*) as c FROM posts WHERE category = ?", [c.name]).c;
  }
  res.json(cats);
});

app.post('/api/categories', requireAuth, (req, res) => {
  const name = req.body.name;
  const slug = req.body.slug || slugify(name);
  const id = uuidv4();
  q("INSERT INTO categories (id,name,slug) VALUES (?,?,?)", [id, name, slug]);
  saveDb();
  res.status(201).json({ id, name, slug });
});

app.put('/api/categories/:id', requireAuth, (req, res) => {
  const { name, slug } = req.body;
  q("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [name, slug || slugify(name), req.params.id]);
  saveDb();
  res.json({ message: 'Updated' });
});

app.delete('/api/categories/:id', requireAuth, (req, res) => {
  q("DELETE FROM categories WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

// ===== TAGS =====
app.get('/api/tags', (req, res) => res.json(rows(q("SELECT * FROM tags ORDER BY name ASC"))));
app.post('/api/tags', requireAuth, (req, res) => {
  const name = req.body.name;
  const slug = req.body.slug || slugify(name);
  const id = uuidv4();
  q("INSERT INTO tags (id,name,slug) VALUES (?,?,?)", [id, name, slug]);
  saveDb();
  res.status(201).json({ id, name, slug });
});
app.delete('/api/tags/:id', requireAuth, (req, res) => {
  q("DELETE FROM tags WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

// ===== COLLECTION CRUD GENERATOR =====
function registerCollection(path, table, idField = 'id') {
  app.get(path, (req, res) => res.json(rows(q("SELECT * FROM " + table + " ORDER BY ord ASC"))));
  app.post(path, requireAuth, (req, res) => {
    const data = { ...req.body, ord: req.body.order ?? req.body.ord ?? 0 };
    const keys = Object.keys(data).filter(k => k !== 'id' && k !== 'order');
    const cols = keys.join(',');
    const placeholders = keys.map(() => '?').join(',');
    const vals = keys.map(k => data[k]);
    const id = uuidv4();
    q("INSERT INTO " + table + " (id," + cols + ") VALUES (?," + placeholders + ")", [id, ...vals]);
    saveDb();
    res.status(201).json(row({ id, ...data }));
  });
  app.put(path + '/:id', requireAuth, (req, res) => {
    const data = { ...req.body };
    delete data.id;
    if (data.order !== undefined) { data.ord = data.order; delete data.order; }
    const keys = Object.keys(data);
    if (!keys.length) return res.status(400).json({ message: 'No fields to update' });
    q("UPDATE " + table + " SET " + keys.map(k => k + ' = ?').join(',') + " WHERE " + idField + " = ?", [...keys.map(k => data[k]), req.params.id]);
    saveDb();
    res.json({ message: 'Updated' });
  });
  app.delete(path + '/:id', requireAuth, (req, res) => {
    q("DELETE FROM " + table + " WHERE " + idField + " = ?", [req.params.id]);
    saveDb();
    res.json({ message: 'Deleted' });
  });
}

registerCollection('/api/services', 'services');
registerCollection('/api/team', 'team_members');
registerCollection('/api/projects', 'projects');
registerCollection('/api/faq', 'faq_items');
registerCollection('/api/hero-stats', 'hero_stats');
registerCollection('/api/trust-bar', 'trust_bar_items');
registerCollection('/api/counters', 'counters');
registerCollection('/api/why-us/checklist', 'why_us_checklist');
registerCollection('/api/about/features', 'about_features');
registerCollection('/api/mvv/items', 'mvv_items');
registerCollection('/api/process', 'process_steps');

// ===== SINGLETONS =====
function registerSingleton(path, table) {
  app.get(path, (req, res) => {
    const r = qOne("SELECT * FROM " + table + " LIMIT 1");
    res.json(row(r) || {});
  });
  app.put(path, requireAuth, (req, res) => {
    const existing = qOne("SELECT id FROM " + table + " LIMIT 1");
    const data = { ...req.body, updated_at: new Date().toISOString() };
    delete data.id;
    if (existing) {
      const keys = Object.keys(data);
      q("UPDATE " + table + " SET " + keys.map(k => k + ' = ?').join(',') + " WHERE id = ?", [...keys.map(k => data[k]), existing.id]);
    } else {
      const keys = Object.keys(data);
      q("INSERT INTO " + table + " (id," + keys.join(',') + ") VALUES (?" + keys.map(() => ',?').join('') + ")", [table, ...keys.map(k => data[k])]);
    }
    saveDb();
    res.json({ message: 'Updated' });
  });
}

registerSingleton('/api/hero', 'hero');
registerSingleton('/api/why-us', 'why_us');
registerSingleton('/api/cta-banner', 'cta_banner');
registerSingleton('/api/about', 'about');
registerSingleton('/api/mvv', 'mvv');
registerSingleton('/api/newsletter-section', 'newsletter_section');
registerSingleton('/api/footer', 'footer');
registerSingleton('/api/company', 'company');
registerSingleton('/api/social', 'social');

// ===== NAV =====
app.get('/api/nav', (req, res) => res.json(rows(q("SELECT * FROM nav_items ORDER BY ord ASC"))));
app.post('/api/nav', requireAuth, (req, res) => {
  const { label, url, parentId, order } = req.body;
  const id = uuidv4();
  q("INSERT INTO nav_items (id,label,url,parent_id,ord) VALUES (?,?,?,?,?)", [id, label, url || null, parentId || null, order || 0]);
  saveDb();
  res.status(201).json({ id, label, url, parentId, order });
});
app.put('/api/nav/:id', requireAuth, (req, res) => {
  const { label, url, parentId, order } = req.body;
  q("UPDATE nav_items SET label=?,url=?,parent_id=?,ord=? WHERE id=?", [label, url || null, parentId || null, order || 0, req.params.id]);
  saveDb();
  res.json({ message: 'Updated' });
});
app.delete('/api/nav/:id', requireAuth, (req, res) => {
  q("DELETE FROM nav_items WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

// ===== CONTACT =====
app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message required' });
  q("INSERT INTO contact_msgs (id,name,email,phone,service,message,is_read) VALUES (?,?,?,?,?,?,0)", [uuidv4(), name, email, phone || '', service || '', message]);
  saveDb();
  res.status(201).json({ message: 'Message sent' });
});

app.get('/api/contact', requireAuth, (req, res) => {
  res.json(rows(q("SELECT * FROM contact_msgs ORDER BY created_at DESC")));
});

app.put('/api/contact/:id', requireAuth, (req, res) => {
  q("UPDATE contact_msgs SET is_read = ? WHERE id = ?", [req.body.read ? 1 : 0, req.params.id]);
  saveDb();
  res.json({ message: 'Updated' });
});

app.delete('/api/contact/:id', requireAuth, (req, res) => {
  q("DELETE FROM contact_msgs WHERE id = ?", [req.params.id]);
  saveDb();
  res.json({ message: 'Deleted' });
});

// ===== NEWSLETTER =====
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  const existing = qOne('SELECT id FROM newsletters WHERE email = ?', [email]);
  if (existing) return res.status(400).json({ message: 'Already subscribed' });
  q("INSERT INTO newsletters (id,email,subscribed) VALUES (?,?,1)", [uuidv4(), email]);
  saveDb();
  res.status(201).json({ message: 'Subscribed' });
});

app.get('/api/newsletter', requireAuth, (req, res) => {
  res.json(rows(q("SELECT * FROM newsletters ORDER BY created_at DESC")));
});

app.delete('/api/newsletter/:email', requireAuth, (req, res) => {
  q("UPDATE newsletters SET subscribed = 0 WHERE email = ?", [req.params.email]);
  saveDb();
  res.json({ message: 'Unsubscribed' });
});

// ===== START =====
initDb().then(() => {
  seed();
  app.listen(PORT, () => {
    console.log('AlpharKing server running on http://localhost:' + PORT);
    console.log('Admin login: admin@alpharkingenterprise.com / admin123');
  });
});
