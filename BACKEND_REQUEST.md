# Backend API Request — AlpharKing Enterprise

> Complete backend specification to power all frontend features across 6 pages.

## Pages & Features

| Page | File | Backend Features Needed |
|---|---|---|
| Landing / Home | `index.html` | Hero, Trust Bar, Services, Why Us, Counters, Featured Projects, CTA, Latest Posts, Newsletter |
| About | `about.html` | Company Story, Vision/Mission/Values, Team Members, Counters, Newsletter |
| Services | `services.html` | Service Listings, Process Steps, FAQ, CTA |
| Contact | `contact.html` | Contact Form, Office Info, Social Links |
| Blog Listing | `post.html` | Posts Grid, Categories, Tags, Search, Pagination, Recent Posts, Newsletter |
| Single Post | `single-post.html` | Post Content, Comments, Comment Form, Sidebar |

---

## API Endpoints

### Authentication (Admin)

```
POST   /api/auth/login          → { email, password } → { token, user }
POST   /api/auth/logout         → invalidate token
GET    /api/auth/me             → current admin user
```

All admin endpoints below require `Authorization: Bearer <token>`.

---

### Posts (Blog / Insights)

```
GET    /api/posts               → paginated list, query params: page, limit, category, tag, search
GET    /api/posts/:slug         → single post with content, author, tags, comments
POST   /api/posts               → create post (admin)
PUT    /api/posts/:id           → update post (admin)
DELETE /api/posts/:id           → delete post (admin)
```

**Post fields:**
- `id` (string/uuid)
- `title` (string)
- `slug` (string, auto-generated from title)
- `excerpt` (string)
- `content` (rich text / markdown)
- `featuredImage` (string, URL)
- `category` (string, one of: Blockchain, Web3, Smart Contracts, DeFi, Tokenization, Enterprise)
- `tags` (array of strings)
- `author` (string)
- `readTime` (string, e.g. "6 min read")
- `publishedAt` (datetime)
- `createdAt` (datetime)
- `updatedAt` (datetime)

---

### Comments

```
GET    /api/posts/:id/comments          → list approved comments for a post
POST   /api/posts/:id/comments          → submit new comment { name, email, content }
PUT    /api/comments/:id                → approve/edit comment (admin)
DELETE /api/comments/:id                → delete comment (admin)
```

**Comment fields:**
- `id` (string/uuid)
- `postId` (string)
- `name` (string)
- `email` (string)
- `content` (string)
- `createdAt` (datetime)
- `approved` (boolean, default false)

---

### Categories

```
GET    /api/categories                  → list all categories with post counts
POST   /api/categories                  → create category (admin)
PUT    /api/categories/:id              → update category (admin)
DELETE /api/categories/:id              → delete category (admin)
```

**Category fields:**
- `id` (string/uuid)
- `name` (string)
- `slug` (string)
- `postCount` (integer, computed)

**Seed data (6 categories):**
1. Blockchain (12)
2. Web3 (8)
3. Smart Contracts (6)
4. DeFi (9)
5. Tokenization (15)
6. Enterprise (11)

---

### Tags

```
GET    /api/tags                        → list all tags
POST   /api/tags                        → create tag (admin)
DELETE /api/tags/:id                    → delete tag (admin)
```

**Tag fields:**
- `id` (string/uuid)
- `name` (string)
- `slug` (string)

**Seed tags:** Blockchain, Web3, Smart Contracts, DeFi, Tokenization, Enterprise, DApps, Ethereum, Security

---

### Services

```
GET    /api/services                    → list all services (ordered)
GET    /api/services/:slug              → single service
POST   /api/services                    → create service (admin)
PUT    /api/services/:id                → update service (admin)
DELETE /api/services/:id                → delete service (admin)
```

**Service fields:**
- `id` (string/uuid)
- `title` (string)
- `slug` (string)
- `icon` (string, icon class name)
- `description` (string)
- `order` (integer)

**Seed data (6 services):**
1. Blockchain Development
2. Smart Contract Development
3. Decentralized Applications (DApps)
4. Web3 Integration
5. Token Development
6. Blockchain Consulting

---

### Team Members

```
GET    /api/team                        → list all members (ordered)
POST   /api/team                        → create member (admin)
PUT    /api/team/:id                    → update member (admin)
DELETE /api/team/:id                    → delete member (admin)
```

**TeamMember fields:**
- `id` (string/uuid)
- `name` (string)
- `role` (string)
- `image` (string, URL)
- `linkedin` (string, URL)
- `twitter` (string, URL)
- `order` (integer)

**Seed data (4 members):**
1. Adebayo Ogunlesi — Founder & CEO
2. Chioma Nwachukwu — Head of Engineering
3. Emeka Obi — Lead Blockchain Developer
4. Fatima Mohammed — Enterprise Solutions Lead

---

### Featured Projects

```
GET    /api/projects                    → list all featured projects
POST   /api/projects                    → create project (admin)
PUT    /api/projects/:id                → update project (admin)
DELETE /api/projects/:id                → delete project (admin)
```

**Project fields:**
- `id` (string/uuid)
- `title` (string)
- `description` (string)
- `image` (string, URL)
- `category` (string)
- `order` (integer)

**Seed data (3 projects):**
1. Enterprise Asset Management Platform
2. Decentralized Marketplace
3. Smart Contract Automation System

---

### FAQ

```
GET    /api/faq                         → list all FAQ items (ordered)
POST   /api/faq                         → create FAQ (admin)
PUT    /api/faq/:id                     → update FAQ (admin)
DELETE /api/faq/:id                     → delete FAQ (admin)
```

**FaqItem fields:**
- `id` (string/uuid)
- `question` (string)
- `answer` (string)
- `order` (integer)

**Seed data (4 items):**
1. How do I get started with AlpharKing Enterprise?
2. What industries do you serve?
3. Do you provide smart contract auditing?
4. Can you work with existing systems?

---

### Contact Form Submissions

```
POST   /api/contact                     → submit { name, email, phone, service, message }
GET    /api/contact                     → list submissions (admin)
PUT    /api/contact/:id                 → mark as read (admin)
DELETE /api/contact/:id                 → delete submission (admin)
```

**ContactMsg fields:**
- `id` (string/uuid)
- `name` (string)
- `email` (string)
- `phone` (string, optional)
- `service` (string, one of the 6 service titles)
- `message` (string)
- `read` (boolean, default false)
- `createdAt` (datetime)

---

### Newsletter Subscriptions

```
POST   /api/newsletter                  → subscribe { email }
DELETE /api/newsletter/:email           → unsubscribe
GET    /api/newsletter                  → list subscribers (admin)
```

**Newsletter fields:**
- `id` (string/uuid)
- `email` (string, unique)
- `subscribed` (boolean, default true)
- `createdAt` (datetime)

---

### Hero Section (Landing Page)

```
GET    /api/hero                       → get hero section content
PUT    /api/hero                       → update hero section (admin)
```

**Hero fields:**
- `id` (string, singleton)
- `badge` (string) — "AlpharKing Enterprise · Building Trusted Blockchain Solutions"
- `title` (string) — "Building the Future of Blockchain Innovation"
- `highlight` (string) — "Blockchain" (the highlighted word)
- `subtitle` (string) — description paragraph
- `ctaPrimaryText` (string) — "Start Your Project"
- `ctaPrimaryUrl` (string) — "/services.html"
- `ctaSecondaryText` (string) — "Explore Our Work"
- `ctaSecondaryUrl` (string) — "/services.html"
- `mainImage` (string, URL) — left hero image
- `accentImage` (string, URL) — right accent image
- `floatCardIcon` (string) — "fa-line-chart"
- `floatCardValue` (string) — "+18.4%"
- `floatCardLabel` (string) — "Annual Returns"
- `updatedAt` (datetime)

---

### Hero Stats (Landing Page)

```
GET    /api/hero-stats                 → list hero stats (ordered)
POST   /api/hero-stats                 → create stat (admin)
PUT    /api/hero-stats/:id             → update stat (admin)
DELETE /api/hero-stats/:id             → delete stat (admin)
```

**HeroStat fields:**
- `id` (string/uuid)
- `value` (string) — "50+"
- `label` (string) — "Projects Delivered"
- `order` (integer)

**Seed data (3):**
1. 50+ — Projects Delivered
2. 98% — Client Satisfaction
3. 5+ — Years Experience

---

### Trust Bar (Scrolling Bar)

```
GET    /api/trust-bar                  → list all trust items (ordered)
POST   /api/trust-bar                  → create item (admin)
PUT    /api/trust-bar/:id              → update item (admin)
DELETE /api/trust-bar/:id              → delete item (admin)
```

**TrustBarItem fields:**
- `id` (string/uuid)
- `icon` (string) — Font Awesome class (e.g. "fa-shield")
- `text` (string) — "Security First"
- `order` (integer)

**Seed data (6):**
1. fa-shield — Security First
2. fa-check-circle — Industry Expertise
3. fa-users — Tailored Solutions
4. fa-lock — Scalable Architecture
5. fa-trophy — Transparent Process
6. fa-globe — Long-Term Partnership

---

### Counters (Stats Section)

```
GET    /api/counters                   → list all counters (ordered)
POST   /api/counters                   → create counter (admin)
PUT    /api/counters/:id               → update counter (admin)
DELETE /api/counters/:id               → delete counter (admin)
```

**Counter fields:**
- `id` (string/uuid)
- `icon` (string) — Font Awesome class (e.g. "fa-users")
- `number` (integer) — 50
- `suffix` (string) — "+"
- `label` (string) — "Projects Delivered"
- `order` (integer)

**Seed data (4):**
1. fa-users — 50+ — Projects Delivered
2. fa-briefcase — 30+ — Enterprise Clients
3. fa-globe — 12+ — Industries Served
4. fa-trophy — 5+ — Years of Innovation

---

### Why Us Section (Landing Page)

```
GET    /api/why-us                     → get why-us section content
PUT    /api/why-us                     → update why-us section (admin)
```

**WhyUs fields:**
- `id` (string, singleton)
- `tag` (string) — "Why AlpharKing Enterprise"
- `title` (string) — "Building Trusted Blockchain Solutions"
- `highlight` (string) — "Blockchain Solutions"
- `description` (string)
- `image` (string, URL) — "img/bg-img/5.jpg"
- `badgeValue` (string) — "50+"
- `badgeLabel` (string) — "Projects Delivered"
- `ctaText` (string) — "Discover Our Story"
- `ctaUrl` (string) — "/about.html"
- `updatedAt` (datetime)

---

### Why Us Checklist Items

```
GET    /api/why-us/checklist           → list checklist items (ordered)
POST   /api/why-us/checklist           → create item (admin)
PUT    /api/why-us/checklist/:id       → update item (admin)
DELETE /api/why-us/checklist/:id       → delete item (admin)
```

**WhyUsChecklistItem fields:**
- `id` (string/uuid)
- `icon` (string) — "fa-check-circle"
- `title` (string) — "Security First"
- `description` (string)
- `order` (integer)

**Seed data (3):**
1. Security First — "Every solution is developed with a strong focus on security..."
2. Industry Expertise — "Our team stays at the forefront of blockchain innovation..."
3. Tailored Solutions — "Every project is designed around the specific needs..."

---

### CTA Banner Section

```
GET    /api/cta-banner                 → get CTA banner content
PUT    /api/cta-banner                 → update CTA banner (admin)
```

**CtaBanner fields:**
- `id` (string, singleton)
- `title` (string) — "Ready to Build Your Blockchain Solution?"
- `highlight` (string) — "Blockchain Solution?"
- `description` (string)
- `buttonText` (string) — "Start Your Project"
- `buttonUrl` (string) — "/contact.html"
- `backgroundImage` (string, URL)
- `updatedAt` (datetime)

---

### Featured Projects (Testimonials Section on Landing)

```
GET    /api/projects                   → list all featured projects (ordered)
POST   /api/projects                   → create project (admin)
PUT    /api/projects/:id               → update project (admin)
DELETE /api/projects/:id               → delete project (admin)
```

**Project fields:**
- `id` (string/uuid)
- `title` (string)
- `description` (string)
- `image` (string, URL)
- `category` (string) — "Blockchain Platform", "Web3 Platform", etc.
- `order` (integer)

**Seed data (3):**
1. Enterprise Asset Management Platform — "A blockchain-powered platform designed to improve transparency..."
2. Decentralized Marketplace — "A Web3 marketplace enabling secure peer-to-peer transactions..."
3. Smart Contract Automation System — "A solution that automates contract execution and business workflows..."

---

### About Page — Company Story

```
GET    /api/about                       → get about page content
PUT    /api/about                       → update about page (admin)
```

**About fields:**
- `id` (string, singleton)
- `tag` (string) — "Who We Are"
- `title` (string) — "Making Blockchain Practical & Accessible"
- `highlight` (string) — "Practical & Accessible"
- `leadParagraph` (string) — "AlpharKing Enterprise was founded with a simple mission..."
- `bodyParagraphs` (string[]) — array of paragraphs
- `mainImage` (string, URL) — "img/bg-img/14.jpg"
- `secondaryImage` (string, URL) — "img/bg-img/5.jpg"
- `badgeValue` (string) — "5+"
- `badgeLabel` (string) — "Years of Innovation"
- `ctaText` (string) — "View Our Services"
- `ctaUrl` (string) — "/services.html"
- `heroImage` (string, URL) — page hero background
- `updatedAt` (datetime)

---

### About Page — Feature List

```
GET    /api/about/features              → list about feature items (ordered)
POST   /api/about/features              → create feature (admin)
PUT    /api/about/features/:id          → update feature (admin)
DELETE /api/about/features/:id          → delete feature (admin)
```

**AboutFeature fields:**
- `id` (string/uuid)
- `icon` (string) — "fa-check"
- `text` (string) — "Blockchain Development & Architecture"
- `order` (integer)

**Seed data (4):**
1. Blockchain Development & Architecture
2. Smart Contract Design & Auditing
3. Web3 & DApp Development
4. Token Ecosystem & Digital Assets

---

### Vision / Mission / Values

```
GET    /api/mvv                         → get MVV section content
PUT    /api/mvv                         → update MVV section (admin)
```

**Mvv fields:**
- `id` (string, singleton)
- `tag` (string) — "Our Foundation"
- `title` (string) — "Vision, Mission & Values"
- `updatedAt` (datetime)

---

### MVV Items

```
GET    /api/mvv/items                   → list MVV items (ordered)
POST   /api/mvv/items                   → create item (admin)
PUT    /api/mvv/items/:id               → update item (admin)
DELETE /api/mvv/items/:id               → delete item (admin)
```

**MvvItem fields:**
- `id` (string/uuid)
- `icon` (string) — "fa-eye", "fa-bullseye", "fa-heart"
- `title` (string) — "Our Vision" / "Our Mission" / "Our Values"
- `description` (string)
- `order` (integer)

**Seed data (3):**
1. fa-eye — Our Vision — "To become a leading provider of innovative blockchain solutions..."
2. fa-bullseye — Our Mission — "To build reliable, scalable, and impactful blockchain systems..."
3. fa-heart — Our Values — "Transparency, innovation, security-first thinking..."

---

### Services Page — Process Steps

```
GET    /api/process                     → list all process steps (ordered)
POST   /api/process                     → create step (admin)
PUT    /api/process/:id                 → update step (admin)
DELETE /api/process/:id                 → delete step (admin)
```

**ProcessStep fields:**
- `id` (string/uuid)
- `step` (string) — "01", "02", etc.
- `title` (string) — "Discovery"
- `description` (string)
- `order` (integer)

**Seed data (5):**
1. 01 — Discovery
2. 02 — Strategy
3. 03 — Development
4. 04 — Deployment
5. 05 — Support

---

### Services Page — Service Detail Sections

```
GET    /api/services                    → list all services (ordered)
GET    /api/services/:slug              → single service
POST   /api/services                    → create service (admin)
PUT    /api/services/:id                → update service (admin)
DELETE /api/services/:id                → delete service (admin)
```

**Service fields:**
- `id` (string/uuid)
- `title` (string)
- `slug` (string)
- `icon` (string) — icon class name
- `description` (string)
- `order` (integer)

**Seed data (6):**
1. Blockchain Development
2. Smart Contract Development
3. Decentralized Applications (DApps)
4. Web3 Integration
5. Token Development
6. Blockchain Consulting

---

### Newsletter Section

```
GET    /api/newsletter-section          → get newsletter section content
PUT    /api/newsletter-section          → update newsletter section (admin)
```

**NewsletterSection fields:**
- `id` (string, singleton)
- `title` (string) — "Stay Informed"
- `description` (string) — "Weekly blockchain insights, industry analysis, and company updates."
- `icon` (string) — "fa-envelope-o"
- `placeholder` (string) — "Enter your email address"
- `buttonText` (string) — "Subscribe"
- `updatedAt` (datetime)

---

### Footer

```
GET    /api/footer                      → get footer content
PUT    /api/footer                      → update footer (admin)
```

**Footer fields:**
- `id` (string, singleton)
- `brandDescription` (string)
- `quickLinks` (array of `{ label, url }`)
- `serviceLinks` (array of `{ label, url }`)
- `contactAddress` (string)
- `contactPhone` (string)
- `contactEmail` (string)
- `contactHours` (string)
- `policies` (array of `{ label, url }`)
- `updatedAt` (datetime)

---

### Navigation Menu

```
GET    /api/nav                         → get navigation menu
PUT    /api/nav                         → update navigation menu (admin)
```

**NavItem fields:**
- `id` (string/uuid)
- `label` (string)
- `url` (string, optional)
- `parentId` (string, null, optional — for dropdowns)
- `order` (integer)
- `children` (array, computed — nested items)

**Seed structure:**
1. Home → /index.html
2. About → /about.html
   - About Us → /about.html
   - Our Services → /services.html
3. Services → /services.html
4. Solutions → (no URL, dropdown only)
   - Blockchain Development → #
   - Smart Contracts → #
   - DApps → #
   - Enterprise Services → #
5. Insights → /post.html
6. Contact → /contact.html

---

### Company Info (Global)

```
GET    /api/company                     → get company info
PUT    /api/company                     → update company info (admin)
```

**Company fields:**
- `id` (string, singleton)
- `name` (string) — "AlpharKing Enterprise"
- `logo` (string) — "AK"
- `description` (string)
- `email` (string) — "hello@alpharkingenterprise.com"
- `phone` (string) — "+XXX XXX XXXX"
- `address` (string) — "Available Worldwide"
- `hours` (string) — "Mon–Fri, 9am – 6pm"
- `updatedAt` (datetime)

---

### Social Links

```
GET    /api/social                      → get social media links
PUT    /api/social                      → update social links (admin)
```

**Social fields:**
- `id` (string, singleton)
- `facebook` (string, URL)
- `twitter` (string, URL)
- `linkedin` (string, URL)
- `instagram` (string, URL)
- `updatedAt` (datetime)

---

## Database Models

```
AdminUser
  id          string (uuid)
  email       string (unique)
  password    string (hashed)
  role        string ("admin")
  createdAt   datetime

Post
  id            string (uuid)
  title         string
  slug          string (unique)
  excerpt       string
  content       text
  featuredImage string (url)
  category      string
  tags          string[]
  author        string
  readTime      string
  publishedAt   datetime
  createdAt     datetime
  updatedAt     datetime

Comment
  id        string (uuid)
  postId    string (ref → Post)
  name      string
  email     string
  content   string
  approved  boolean (default: false)
  createdAt datetime

Category
  id        string (uuid)
  name      string (unique)
  slug      string (unique)

Tag
  id    string (uuid)
  name  string (unique)
  slug  string (unique)

Hero (singleton)
  id              string
  badge           string
  title           string
  highlight       string
  subtitle        string
  ctaPrimaryText  string
  ctaPrimaryUrl   string
  ctaSecondaryText string
  ctaSecondaryUrl string
  mainImage       string (url)
  accentImage     string (url)
  floatCardIcon   string
  floatCardValue  string
  floatCardLabel  string
  updatedAt       datetime

HeroStat
  id       string (uuid)
  value    string
  label    string
  order    integer

TrustBarItem
  id    string (uuid)
  icon  string
  text  string
  order integer

Counter
  id      string (uuid)
  icon    string
  number  integer
  suffix  string
  label   string
  order   integer

WhyUs (singleton)
  id           string
  tag          string
  title        string
  highlight    string
  description  string
  image        string (url)
  badgeValue   string
  badgeLabel   string
  ctaText      string
  ctaUrl       string
  updatedAt    datetime

WhyUsChecklistItem
  id          string (uuid)
  icon        string
  title       string
  description string
  order       integer

CtaBanner (singleton)
  id              string
  title           string
  highlight       string
  description     string
  buttonText      string
  buttonUrl       string
  backgroundImage string (url)
  updatedAt       datetime

Project
  id          string (uuid)
  title       string
  description string
  image       string (url)
  category    string
  order       integer

About (singleton)
  id              string
  tag             string
  title           string
  highlight       string
  leadParagraph   string
  bodyParagraphs  string[]
  mainImage       string (url)
  secondaryImage  string (url)
  badgeValue      string
  badgeLabel      string
  ctaText         string
  ctaUrl          string
  heroImage       string (url)
  updatedAt       datetime

AboutFeature
  id    string (uuid)
  icon  string
  text  string
  order integer

Mvv (singleton)
  id        string
  tag       string
  title     string
  updatedAt datetime

MvvItem
  id          string (uuid)
  icon        string
  title       string
  description string
  order       integer

Service
  id          string (uuid)
  title       string
  slug        string (unique)
  icon        string
  description string
  order       integer

ProcessStep
  id          string (uuid)
  step        string
  title       string
  description string
  order       integer

TeamMember
  id       string (uuid)
  name     string
  role     string
  image    string (url)
  linkedin string
  twitter  string
  order    integer

FaqItem
  id        string (uuid)
  question  string
  answer    string
  order     integer

ContactMsg
  id        string (uuid)
  name      string
  email     string
  phone     string
  service   string
  message   string
  read      boolean (default: false)
  createdAt datetime

Newsletter
  id         string (uuid)
  email      string (unique)
  subscribed boolean (default: true)
  createdAt  datetime

NewsletterSection (singleton)
  id          string
  title       string
  description string
  icon        string
  placeholder string
  buttonText  string
  updatedAt   datetime

Footer (singleton)
  id              string
  brandDescription string
  quickLinks      json
  serviceLinks    json
  contactAddress  string
  contactPhone    string
  contactEmail    string
  contactHours    string
  policies        json
  updatedAt       datetime

NavItem
  id       string (uuid)
  label    string
  url      string
  parentId string (null, optional — for dropdowns)
  order    integer

Company (singleton)
  id          string
  name        string
  logo        string
  description string
  email       string
  phone       string
  address     string
  hours       string
  updatedAt   datetime

Social (singleton)
  id        string
  facebook  string
  twitter   string
  linkedin  string
  instagram string
  updatedAt datetime
```

---

## Seed Data Required

| Entity | Type | Count | Notes |
|---|---|---|---|
| AdminUser | collection | 1 | Default admin credentials |
| Post | collection | 6 | All existing blog posts |
| Comment | collection | 3 | On the first post |
| Category | collection | 6 | Blockchain, Web3, Smart Contracts, DeFi, Tokenization, Enterprise |
| Tag | collection | 9 | Blockchain, Web3, Smart Contracts, DeFi, Tokenization, Enterprise, DApps, Ethereum, Security |
| Hero | singleton | 1 | Full hero section content |
| HeroStat | collection | 3 | 50+, 98%, 5+ |
| TrustBarItem | collection | 6 | All trust bar items |
| Counter | collection | 4 | All counter stats |
| WhyUs | singleton | 1 | Full why-us section |
| WhyUsChecklistItem | collection | 3 | Security, Expertise, Tailored |
| CtaBanner | singleton | 1 | CTA banner content |
| Project | collection | 3 | All featured projects |
| About | singleton | 1 | Full about page |
| AboutFeature | collection | 4 | All about feature checks |
| Mvv | singleton | 1 | MVV section header |
| MvvItem | collection | 3 | Vision, Mission, Values |
| Service | collection | 6 | All 6 services |
| ProcessStep | collection | 5 | All 5 process steps |
| TeamMember | collection | 4 | All team members |
| FaqItem | collection | 4 | All FAQ questions |
| NewsletterSection | singleton | 1 | Newsletter section content |
| Footer | singleton | 1 | Full footer content |
| NavItem | collection | 10 | All nav items (6 top-level + 4 children) |
| Company | singleton | 1 | Company info |
| Social | singleton | 1 | Social media links |

**Total: 15 singletons + 12 collections = 27 managed entities**

---

## Notes

- All slugs should be auto-generated from titles (lowercase, hyphenated, unique)
- Posts should support rich text or markdown for content
- Images should be stored as URLs (uploads handled separately or via external storage)
- The blog sidebar (categories, recent posts, tags, search) should be driven by the Posts, Categories, and Tags APIs
- Pagination on `post.html` should use `?page=1&limit=6` query params
- The newsletter and contact forms on every page post to their respective endpoints
- The "Solutions" dropdown in the nav currently links to `#` — these can be added as pages or remain as placeholder links
- Admin auth uses JWT tokens stored in localStorage on the frontend
- Singleton models (Hero, WhyUs, CtaBanner, About, Mvv, NewsletterSection, Footer, Company, Social) have a single record — GET returns the record, PUT replaces it
- Collection models (HeroStat, TrustBarItem, Counter, etc.) support full CRUD with ordering
- NavItem uses a self-referencing `parentId` for dropdown nesting
- Each page (index, about, services, contact, post, single-post) can pull only the sections it needs via its dedicated endpoint
