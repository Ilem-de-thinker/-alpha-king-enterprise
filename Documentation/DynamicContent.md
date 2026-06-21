# Dynamic Content API

> **📸 Image Upload:** All image fields (`mainImage`, `accentImage`, `image`, `backgroundImage`, `heroImage`, `secondaryImage`) support **direct file upload to Cloudinary**.  
> To upload an image, send a **`multipart/form-data`** request with the image file in the corresponding field.  
> You can also pass an existing URL string if you already have an image hosted elsewhere.

---

## Hero Section

- **URL:** `/api/hero/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "hero",
  "badge": "AlpharKing Enterprise · Building Trusted Blockchain Solutions",
  "title": "Building the Future of Blockchain Innovation",
  "highlight": "Blockchain",
  "subtitle": "",
  "ctaPrimaryText": "Start Your Project",
  "ctaPrimaryUrl": "/services.html",
  "ctaSecondaryText": "Explore Our Work",
  "ctaSecondaryUrl": "/services.html",
  "mainImage": "",
  "accentImage": "",
  "floatCardIcon": "fa-line-chart",
  "floatCardValue": "+18.4%",
  "floatCardLabel": "Annual Returns",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Hero Section (Admin)

- **URL:** `/api/hero/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|badge|string|No|Badge text above title|
|title|string|No|Main heading|
|highlight|string|No|Highlighted word in title|
|subtitle|string|No|Description paragraph|
|ctaPrimaryText|string|No|Primary button text|
|ctaPrimaryUrl|string|No|Primary button URL|
|ctaSecondaryText|string|No|Secondary button text|
|ctaSecondaryUrl|string|No|Secondary button URL|
|mainImage|file / string|No|Image file (uploaded to Cloudinary) or existing URL|
|accentImage|file / string|No|Image file (uploaded to Cloudinary) or existing URL|
|floatCardIcon|string|No|Font Awesome icon class|
|floatCardValue|string|No|Stat value|
|floatCardLabel|string|No|Stat label|

- **Example Request:**
```json
{
  "title": "Updated Hero Title",
  "subtitle": "New description paragraph"
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "hero",
  "title": "Updated Hero Title",
  "subtitle": "New description paragraph",
  ...
}
```

---

## List Hero Stats

- **URL:** `/api/hero-stats/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "value": "50+",
    "label": "Projects Delivered",
    "order": 1
  },
  {
    "id": "uuid",
    "value": "98%",
    "label": "Client Satisfaction",
    "order": 2
  },
  {
    "id": "uuid",
    "value": "5+",
    "label": "Years Experience",
    "order": 3
  }
]
```

---

## Create Hero Stat (Admin)

- **URL:** `/api/hero-stats/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|value|string|Yes|Stat value (e.g. "100+")|
|label|string|Yes|Stat label|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "value": "100+",
  "label": "Clients Served",
  "order": 4
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

---

## Update Hero Stat (Admin)

- **URL:** `/api/hero-stats/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Hero Stat (Admin)

- **URL:** `/api/hero-stats/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Trust Bar Items

- **URL:** `/api/trust-bar/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "icon": "fa-shield",
    "text": "Security First",
    "order": 1
  },
  {
    "id": "uuid",
    "icon": "fa-check-circle",
    "text": "Industry Expertise",
    "order": 2
  }
]
```

---

## Create Trust Bar Item (Admin)

- **URL:** `/api/trust-bar/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|icon|string|Yes|Font Awesome icon class|
|text|string|Yes|Display text|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "icon": "fa-star",
  "text": "New Feature",
  "order": 7
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

---

## Update Trust Bar Item (Admin)

- **URL:** `/api/trust-bar/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Trust Bar Item (Admin)

- **URL:** `/api/trust-bar/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Counters

- **URL:** `/api/counters/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "icon": "fa-users",
    "number": 50,
    "suffix": "+",
    "label": "Projects Delivered",
    "order": 1
  }
]
```

---

## Create Counter (Admin)

- **URL:** `/api/counters/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|icon|string|Yes|Font Awesome icon class|
|number|integer|Yes|Stat number|
|suffix|string|No|Suffix (e.g. "+", "%")|
|label|string|Yes|Stat label|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "icon": "fa-star",
  "number": 100,
  "suffix": "+",
  "label": "Awards Won",
  "order": 5
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

---

## Update Counter (Admin)

- **URL:** `/api/counters/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Counter (Admin)

- **URL:** `/api/counters/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## Why Us Section

- **URL:** `/api/why-us/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "why-us",
  "tag": "Why AlpharKing Enterprise",
  "title": "Building Trusted Blockchain Solutions",
  "highlight": "Blockchain Solutions",
  "description": "",
  "image": "img/bg-img/5.jpg",
  "badgeValue": "50+",
  "badgeLabel": "Projects Delivered",
  "ctaText": "Discover Our Story",
  "ctaUrl": "/about.html",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Why Us Section (Admin)

- **URL:** `/api/why-us/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|tag|string|No|Section tag|
|title|string|No|Main heading|
|highlight|string|No|Highlighted word|
|description|string|No|Description text|
|image|file / string|No|Image file (uploaded to Cloudinary) or existing URL|
|badgeValue|string|No|Badge stat value|
|badgeLabel|string|No|Badge stat label|
|ctaText|string|No|Button text|
|ctaUrl|string|No|Button URL|

---

## List Why Us Checklist Items

- **URL:** `/api/why-us/checklist/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "icon": "fa-check-circle",
    "title": "Security First",
    "description": "Every solution is developed with a strong focus on security...",
    "order": 1
  }
]
```

---

## Create Why Us Checklist Item (Admin)

- **URL:** `/api/why-us/checklist/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|icon|string|No|Font Awesome icon (default: fa-check-circle)|
|title|string|Yes|Item title|
|description|string|No|Item description|
|order|integer|No|Display order|

---

## Update Why Us Checklist Item (Admin)

- **URL:** `/api/why-us/checklist/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Why Us Checklist Item (Admin)

- **URL:** `/api/why-us/checklist/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## CTA Banner Section

- **URL:** `/api/cta-banner/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "cta-banner",
  "title": "Ready to Build Your Blockchain Solution?",
  "highlight": "Blockchain Solution?",
  "description": "",
  "buttonText": "Start Your Project",
  "buttonUrl": "/contact.html",
  "backgroundImage": "",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update CTA Banner (Admin)

- **URL:** `/api/cta-banner/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|No|Banner title|
|highlight|string|No|Highlighted text|
|description|string|No|Description|
|buttonText|string|No|Button label|
|buttonUrl|string|No|Button URL|
|backgroundImage|file / string|No|Background image file (uploaded to Cloudinary) or existing URL|

---

## About Page Content

- **URL:** `/api/about/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "about",
  "tag": "Who We Are",
  "title": "Making Blockchain Practical & Accessible",
  "highlight": "Practical & Accessible",
  "leadParagraph": "",
  "bodyParagraphs": [],
  "mainImage": "img/bg-img/14.jpg",
  "secondaryImage": "img/bg-img/5.jpg",
  "badgeValue": "5+",
  "badgeLabel": "Years of Innovation",
  "ctaText": "View Our Services",
  "ctaUrl": "/services.html",
  "heroImage": "",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update About Page (Admin)

- **URL:** `/api/about/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|tag|string|No|Section tag|
|title|string|No|Main heading|
|highlight|string|No|Highlighted word|
|leadParagraph|string|No|Lead paragraph|
|bodyParagraphs|array of strings|No|Array of body paragraphs|
|mainImage|file / string|No|Main image file (uploaded to Cloudinary) or existing URL|
|secondaryImage|file / string|No|Secondary image file (uploaded to Cloudinary) or existing URL|
|badgeValue|string|No|Badge stat value|
|badgeLabel|string|No|Badge stat label|
|ctaText|string|No|Button text|
|ctaUrl|string|No|Button URL|
|heroImage|file / string|No|Hero background image file (uploaded to Cloudinary) or existing URL|

---

## List About Features

- **URL:** `/api/about/features/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "icon": "fa-check",
    "text": "Blockchain Development & Architecture",
    "order": 1
  }
]
```

---

## Create About Feature (Admin)

- **URL:** `/api/about/features/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|icon|string|No|Font Awesome icon (default: fa-check)|
|text|string|Yes|Feature text|
|order|integer|No|Display order|

---

## Update About Feature (Admin)

- **URL:** `/api/about/features/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete About Feature (Admin)

- **URL:** `/api/about/features/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## MVV Section (Vision, Mission & Values)

- **URL:** `/api/mvv/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "mvv",
  "tag": "Our Foundation",
  "title": "Vision, Mission & Values",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update MVV Section (Admin)

- **URL:** `/api/mvv/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|tag|string|No|Section tag|
|title|string|No|Section title|

---

## List MVV Items

- **URL:** `/api/mvv/items/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "icon": "fa-eye",
    "title": "Our Vision",
    "description": "To become a leading provider of innovative blockchain solutions...",
    "order": 1
  },
  {
    "id": "uuid",
    "icon": "fa-bullseye",
    "title": "Our Mission",
    "description": "To build reliable, scalable, and impactful blockchain systems...",
    "order": 2
  },
  {
    "id": "uuid",
    "icon": "fa-heart",
    "title": "Our Values",
    "description": "Transparency, innovation, security-first thinking...",
    "order": 3
  }
]
```

---

## Create MVV Item (Admin)

- **URL:** `/api/mvv/items/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|icon|string|Yes|Font Awesome icon|
|title|string|Yes|Item title|
|description|string|Yes|Item description|
|order|integer|No|Display order|

---

## Update MVV Item (Admin)

- **URL:** `/api/mvv/items/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete MVV Item (Admin)

- **URL:** `/api/mvv/items/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## Newsletter Section

- **URL:** `/api/newsletter-section/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "newsletter-section",
  "title": "Stay Informed",
  "description": "Weekly blockchain insights, industry analysis, and company updates.",
  "icon": "fa-envelope-o",
  "placeholder": "Enter your email address",
  "buttonText": "Subscribe",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Newsletter Section (Admin)

- **URL:** `/api/newsletter-section/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|No|Section title|
|description|string|No|Section description|
|icon|string|No|Font Awesome icon|
|placeholder|string|No|Input placeholder text|
|buttonText|string|No|Subscribe button text|

---

## Footer Content

- **URL:** `/api/footer/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "footer",
  "brandDescription": "",
  "quickLinks": [
    {"label": "Home", "url": "/index.html"},
    {"label": "About", "url": "/about.html"}
  ],
  "serviceLinks": [
    {"label": "Blockchain Development", "url": "/services.html"}
  ],
  "contactAddress": "",
  "contactPhone": "",
  "contactEmail": "",
  "contactHours": "",
  "policies": [],
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Footer (Admin)

- **URL:** `/api/footer/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|brandDescription|string|No|Brand description text|
|quickLinks|array|No|Array of {label, url} objects|
|serviceLinks|array|No|Array of {label, url} objects|
|contactAddress|string|No|Office address|
|contactPhone|string|No|Phone number|
|contactEmail|string|No|Email address|
|contactHours|string|No|Business hours|
|policies|array|No|Array of {label, url} objects|

---

## Navigation Menu

- **URL:** `/api/nav/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "label": "Home",
    "url": "/index.html",
    "parent": null,
    "order": 1,
    "children": []
  },
  {
    "id": "uuid",
    "label": "About",
    "url": "/about.html",
    "parent": null,
    "order": 2,
    "children": [
      {
        "id": "uuid",
        "label": "About Us",
        "url": "/about.html",
        "parent": "parent-uuid",
        "order": 1,
        "children": []
      }
    ]
  }
]
```

---

## Create Nav Item (Admin)

- **URL:** `/api/nav/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|label|string|Yes|Navigation label|
|url|string|No|Link URL (null for dropdown parent)|
|parent|string (uuid)|No|Parent nav item ID for nesting|
|order|integer|No|Display order|

---

## Update Nav Item (Admin)

- **URL:** `/api/nav/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Nav Item (Admin)

- **URL:** `/api/nav/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## Company Info

- **URL:** `/api/company/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "company",
  "name": "AlpharKing Enterprise",
  "logo": "AK",
  "description": "",
  "email": "hello@alpharkingenterprise.com",
  "phone": "+XXX XXX XXXX",
  "address": "Available Worldwide",
  "hours": "Mon–Fri, 9am – 6pm",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Company Info (Admin)

- **URL:** `/api/company/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|No|Company name|
|logo|string|No|Logo text|
|description|string|No|Company description|
|email|string|No|Contact email|
|phone|string|No|Contact phone|
|address|string|No|Office address|
|hours|string|No|Business hours|

---

## Social Links

- **URL:** `/api/social/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "social",
  "facebook": "",
  "twitter": "",
  "linkedin": "",
  "instagram": "",
  "updatedAt": "2025-06-01T00:00:00Z"
}
```

---

## Update Social Links (Admin)

- **URL:** `/api/social/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|facebook|string|No|Facebook profile URL|
|twitter|string|No|Twitter profile URL|
|linkedin|string|No|LinkedIn profile URL|
|instagram|string|No|Instagram profile URL|

---

### **Notes**

- Singleton endpoints (Hero, WhyUs, CtaBanner, About, Mvv, NewsletterSection, Footer, Company, Social) use a fixed ID and only support GET (public) and PUT (admin)
- Collection endpoints (HeroStat, TrustBarItem, Counter, etc.) support full CRUD with ordering
- All admin write operations require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
- Items are returned in ascending order by the `order` field by default
- JSON array fields (bodyParagraphs, quickLinks, serviceLinks, policies) accept and return JSON arrays
