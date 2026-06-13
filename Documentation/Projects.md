# Projects API

## List Featured Projects

- **URL:** `/api/projects/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "title": "Enterprise Asset Management Platform",
    "description": "A blockchain-powered platform designed to improve transparency, security, and efficiency in managing enterprise assets across global operations.",
    "image": "",
    "category": "Blockchain Platform",
    "order": 1
  },
  {
    "id": "uuid",
    "title": "Decentralized Marketplace",
    "description": "A Web3 marketplace enabling secure peer-to-peer transactions with smart contract escrow and decentralized governance.",
    "image": "",
    "category": "Web3 Platform",
    "order": 2
  },
  {
    "id": "uuid",
    "title": "Smart Contract Automation System",
    "description": "A solution that automates contract execution and business workflows using self-executing smart contracts.",
    "image": "",
    "category": "Smart Contracts",
    "order": 3
  }
]
```

---

## Create Project (Admin)

- **URL:** `/api/projects/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|Yes|Project title|
|description|string|Yes|Project description|
|image|string|No|Project image URL|
|category|string|Yes|Project category|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "title": "Decentralized Identity System",
  "description": "A blockchain-based identity verification system for secure KYC processes.",
  "image": "https://example.com/project.jpg",
  "category": "Blockchain Platform",
  "order": 4
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "title": "Decentralized Identity System",
  "description": "A blockchain-based identity verification system for secure KYC processes.",
  "image": "https://example.com/project.jpg",
  "category": "Blockchain Platform",
  "order": 4
}
```

---

## Update Project (Admin)

- **URL:** `/api/projects/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|No|Project title|
|description|string|No|Project description|
|image|string|No|Project image URL|
|category|string|No|Project category|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "title": "Updated Project Title",
  "description": "Updated description for the project."
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Project (Admin)

- **URL:** `/api/projects/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

### **Notes**

- Projects are ordered by the `order` field ascending
- The image field accepts a URL string
- All admin endpoints require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
