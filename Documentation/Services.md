# Services API

## List Services

- **URL:** `/api/services/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "title": "Blockchain Development",
    "slug": "blockchain-development",
    "icon": "fa-cubes",
    "description": "End-to-end blockchain development services tailored to your business needs...",
    "order": 1
  },
  {
    "id": "uuid",
    "title": "Smart Contract Development",
    "slug": "smart-contract-development",
    "icon": "fa-file-code-o",
    "description": "Expert smart contract development and auditing services...",
    "order": 2
  }
]
```

---

## Retrieve Single Service

- **URL:** `/api/services/<slug>/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **URL Parameters:**

|Parameter|Type|Description|
|---|---|---|
|slug|string|The slug of the service|

- **Example Request:**
```
GET /api/services/blockchain-development/
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "uuid",
  "title": "Blockchain Development",
  "slug": "blockchain-development",
  "icon": "fa-cubes",
  "description": "End-to-end blockchain development services tailored to your business needs...",
  "order": 1
}
```

---

**Error Responses**

**404 Not Found**

```json
{
  "error": "Resource not found"
}
```

---

## Create Service (Admin)

- **URL:** `/api/services/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|Yes|Service title|
|icon|string|Yes|Font Awesome icon class|
|description|string|Yes|Service description|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "title": "Blockchain Consulting",
  "icon": "fa-handshake-o",
  "description": "Strategic blockchain consulting to help you navigate the evolving landscape.",
  "order": 6
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "title": "Blockchain Consulting",
  "slug": "blockchain-consulting",
  "icon": "fa-handshake-o",
  "description": "Strategic blockchain consulting to help you navigate the evolving landscape.",
  "order": 6
}
```

---

## Update Service (Admin)

- **URL:** `/api/services/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|No|Service title|
|icon|string|No|Font Awesome icon class|
|description|string|No|Service description|
|order|integer|No|Display order|

---

### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Service (Admin)

- **URL:** `/api/services/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Process Steps

- **URL:** `/api/process/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "step": "01",
    "title": "Discovery",
    "description": "We begin by understanding your business needs, goals, and challenges...",
    "order": 1
  },
  {
    "id": "uuid",
    "step": "02",
    "title": "Strategy",
    "description": "Our team develops a comprehensive strategy and architecture...",
    "order": 2
  },
  {
    "id": "uuid",
    "step": "03",
    "title": "Development",
    "description": "We build your solution using agile methodologies...",
    "order": 3
  },
  {
    "id": "uuid",
    "step": "04",
    "title": "Deployment",
    "description": "We handle the deployment process, ensuring smooth integration...",
    "order": 4
  },
  {
    "id": "uuid",
    "step": "05",
    "title": "Support",
    "description": "Ongoing support and maintenance to ensure your solution continues...",
    "order": 5
  }
]
```

---

## Create Process Step (Admin)

- **URL:** `/api/process/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|step|string|Yes|Step number (e.g. "06")|
|title|string|Yes|Step title|
|description|string|Yes|Step description|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "step": "06",
  "title": "Optimization",
  "description": "Continuous optimization and performance tuning of the solution.",
  "order": 6
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

---

## Update Process Step (Admin)

- **URL:** `/api/process/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Process Step (Admin)

- **URL:** `/api/process/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

### **Notes**

- Service slugs are auto-generated from the title (lowercase, hyphenated)
- Services are retrieved by slug for single record access
- Process steps are ordered by the `order` field
- All admin endpoints require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
