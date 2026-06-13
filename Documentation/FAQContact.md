# FAQ & Contact API

## List FAQ Items

- **URL:** `/api/faq/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "question": "How do I get started with AlpharKing Enterprise?",
    "answer": "Getting started is easy. Simply reach out through our contact form...",
    "order": 1
  },
  {
    "id": "uuid",
    "question": "What industries do you serve?",
    "answer": "We serve a wide range of industries including finance, healthcare...",
    "order": 2
  }
]
```

---

## Create FAQ Item (Admin)

- **URL:** `/api/faq/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|question|string|Yes|FAQ question|
|answer|string|Yes|FAQ answer|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "question": "Do you offer ongoing support?",
  "answer": "Yes, we provide 24/7 support for all our enterprise clients.",
  "order": 5
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "question": "Do you offer ongoing support?",
  "answer": "Yes, we provide 24/7 support for all our enterprise clients.",
  "order": 5
}
```

---

## Update FAQ Item (Admin)

- **URL:** `/api/faq/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|question|string|No|FAQ question|
|answer|string|No|FAQ answer|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "answer": "Updated answer text"
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete FAQ Item (Admin)

- **URL:** `/api/faq/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## Submit Contact Message (Public)

- **URL:** `/api/contact/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Sender's name|
|email|string|Yes|Sender's email|
|phone|string|No|Phone number|
|service|string|No|Service interested in (one of the 6 services)|
|message|string|Yes|Message content|

- **Example Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Blockchain Development",
  "message": "I would like to discuss a blockchain project for my company."
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "message": "Message sent successfully"
}
```

---

**Error Responses**

**400 Bad Request**

```json
{
  "name": ["This field is required."],
  "email": ["This field is required."],
  "message": ["This field is required."]
}
```

---

## List Contact Submissions (Admin)

- **URL:** `/api/contact/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "service": "Blockchain Development",
    "message": "I would like to discuss a blockchain project...",
    "read": false,
    "createdAt": "2025-06-01T10:00:00Z"
  }
]
```

---

**Error Responses**

**401 Unauthorized**

```json
{
  "error": "Authentication required"
}
```

---

## Mark Contact as Read (Admin)

- **URL:** `/api/contact/<uuid:pk>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "service": "Blockchain Development",
  "message": "Message content...",
  "read": true,
  "createdAt": "2025-06-01T10:00:00Z"
}
```

---

**Error Responses**

**404 Not Found**

```json
{
  "error": "Not found"
}
```

---

## Delete Contact Submission (Admin)

- **URL:** `/api/contact/<uuid:pk>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## Subscribe to Newsletter (Public)

- **URL:** `/api/newsletter/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|email|string|Yes|Email address to subscribe|

- **Example Request:**
```json
{
  "email": "user@example.com"
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "message": "Subscribed successfully"
}
```

---

**Error Responses**

**400 Bad Request**

```json
{
  "email": ["Enter a valid email address."]
}
```

---

## Unsubscribe from Newsletter (Public)

- **URL:** `/api/newsletter/<str:email>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **URL Parameters:**

|Parameter|Type|Description|
|---|---|---|
|email|string|Email address to unsubscribe|

- **Example Request:**
```
DELETE /api/newsletter/user@example.com/
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "message": "Unsubscribed successfully"
}
```

---

**Error Responses**

**404 Not Found**

```json
{
  "error": "Email not found"
}
```

---

## List Newsletter Subscribers (Admin)

- **URL:** `/api/newsletter/list/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "subscribed": true,
    "createdAt": "2025-06-01T10:00:00Z"
  }
]
```

---

### **Notes**

- Contact form submission is public (no authentication required)
- Listing submissions, marking as read, and deleting require admin authentication
- Newsletter operations: subscribe (public), unsubscribe (public), list (admin only)
- Service field in contact form accepts one of: Blockchain Development, Smart Contract Development, Decentralized Applications (DApps), Web3 Integration, Token Development, Blockchain Consulting
- All admin endpoints require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
