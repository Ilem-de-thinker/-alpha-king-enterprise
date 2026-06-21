# Blog API

> **📸 Image Upload:** The `featuredImage` field supports **direct file upload to Cloudinary**.  
> To upload an image, send a **`multipart/form-data`** request with the image file in the `featuredImage` field.  
> You can also pass an existing URL string if you already have an image hosted elsewhere.

---

## List Posts

- **URL:** `/api/posts/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Query Parameters:**

|Parameter|Type|Required|Description|
|---|---|---|---|
|page|integer|No|Page number for pagination (default: 1)|
|limit|integer|No|Number of posts per page (default: 10)|
|category|string|No|Filter by category name|
|tag|string|No|Filter by tag slug|
|search|string|No|Search in title, excerpt, and content|

- **Example Request:**
```
GET /api/posts/?page=1&limit=6&category=Blockchain
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "count": 6,
  "next": "http://127.0.0.1:8000/api/posts/?page=2&limit=6",
  "previous": null,
  "results": [
    {
      "id": "6c9afcf8-2fde-4ec7-9918-f3a78fc25252",
      "title": "The Future of Blockchain in Enterprise Solutions",
      "slug": "the-future-of-blockchain-in-enterprise-solutions",
      "excerpt": "Discover how blockchain technology is transforming enterprise operations...",
      "featuredImage": "",
      "category": "Blockchain",
      "tags": [
        {"id": "uuid", "name": "Blockchain", "slug": "blockchain"},
        {"id": "uuid", "name": "Enterprise", "slug": "enterprise"}
      ],
      "author": "Adebayo Ogunlesi",
      "readTime": "6 min read",
      "publishedAt": "2024-12-15T00:00:00Z",
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## Retrieve Single Post

- **URL:** `/api/posts/<slug>/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **URL Parameters:**

|Parameter|Type|Description|
|---|---|---|
|slug|string|The slug of the post|

- **Example Request:**
```
GET /api/posts/the-future-of-blockchain-in-enterprise-solutions/
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "6c9afcf8-2fde-4ec7-9918-f3a78fc25252",
  "title": "The Future of Blockchain in Enterprise Solutions",
  "slug": "the-future-of-blockchain-in-enterprise-solutions",
  "excerpt": "Discover how blockchain technology is transforming enterprise operations...",
  "content": "Lorem ipsum dolor sit amet...",
  "featuredImage": "",
  "category": "Blockchain",
  "tags": [
    {"id": "uuid", "name": "Blockchain", "slug": "blockchain"}
  ],
  "author": "Adebayo Ogunlesi",
  "readTime": "6 min read",
  "publishedAt": "2024-12-15T00:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-01T00:00:00Z",
  "comments": [
    {
      "id": "uuid",
      "postId": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "content": "Great article!",
      "approved": true,
      "createdAt": "2025-01-02T00:00:00Z"
    }
  ]
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

## Create Post (Admin)

- **URL:** `/api/posts/`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|Yes|Post title|
|excerpt|string|Yes|Short description|
|content|string|Yes|Post body (markdown/rich text)|
|featuredImage|file / string|No|Image file (uploaded to Cloudinary) or existing URL|
|category|string|Yes|One of: Blockchain, Web3, Smart Contracts, DeFi, Tokenization, Enterprise|
|tags|array of strings|No|List of tag names|
|author|string|Yes|Author name|
|readTime|string|Yes|e.g. "6 min read"|
|publishedAt|datetime|Yes|ISO 8601 datetime|

- **Example Request:**
```json
{
  "title": "New Blockchain Trends",
  "excerpt": "Exploring the latest trends in blockchain technology",
  "content": "Full article content here...",
  "featuredImage": "https://example.com/image.jpg",
  "category": "Blockchain",
  "tags": ["Blockchain", "Web3"],
  "author": "Adebayo Ogunlesi",
  "readTime": "5 min read",
  "publishedAt": "2025-06-01T10:00:00Z"
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "title": "New Blockchain Trends",
  "slug": "new-blockchain-trends",
  "excerpt": "Exploring the latest trends...",
  "content": "Full article content here...",
  "featuredImage": "https://example.com/image.jpg",
  "category": "Blockchain",
  "author": "Adebayo Ogunlesi",
  "readTime": "5 min read",
  "publishedAt": "2025-06-01T10:00:00Z",
  "createdAt": "2025-06-01T10:00:00Z",
  "updatedAt": "2025-06-01T10:00:00Z"
}
```

---

**Error Responses**

**400 Bad Request**

```json
{
  "title": ["This field is required."]
}
```

**401 Unauthorized**

```json
{
  "error": "Authentication credentials were not provided"
}
```

---

## Update Post (Admin)

- **URL:** `/api/posts/<id>/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|title|string|Yes|Post title|
|excerpt|string|Yes|Short description|
|content|string|Yes|Post body|
|featuredImage|file / string|No|Image file (uploaded to Cloudinary) or existing URL|
|category|string|Yes|One of the valid categories|
|tags|array of strings|No|List of tag names|
|author|string|Yes|Author name|
|readTime|string|Yes|e.g. "6 min read"|
|publishedAt|datetime|Yes|ISO 8601 datetime|

- **Example Request:**
```json
{
  "title": "Updated Title",
  "excerpt": "Updated excerpt",
  "content": "Updated content",
  "category": "Web3",
  "tags": ["Web3", "DApps"],
  "author": "Chioma Nwachukwu",
  "readTime": "7 min read",
  "publishedAt": "2025-06-01T10:00:00Z"
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "uuid",
  "title": "Updated Title",
  "slug": "updated-title",
  "excerpt": "Updated excerpt",
  "content": "Updated content",
  "featuredImage": "",
  "category": "Web3",
  "author": "Chioma Nwachukwu",
  "readTime": "7 min read",
  "publishedAt": "2025-06-01T10:00:00Z",
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-06-01T10:00:00Z"
}
```

---

## Delete Post (Admin)

- **URL:** `/api/posts/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Post Comments

- **URL:** `/api/posts/<id>/comments/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **URL Parameters:**

|Parameter|Type|Description|
|---|---|---|
|id|uuid|The post ID|

- **Example Request:**
```
GET /api/posts/6c9afcf8-2fde-4ec7-9918-f3a78fc25252/comments/
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "postId": "6c9afcf8-2fde-4ec7-9918-f3a78fc25252",
    "name": "John Doe",
    "email": "john@example.com",
    "content": "Great article!",
    "approved": true,
    "createdAt": "2025-01-02T00:00:00Z"
  }
]
```

---

## Submit Comment (Public)

- **URL:** `/api/posts/<id>/comments/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Commenter's name|
|email|string|Yes|Commenter's email|
|content|string|Yes|Comment text|

- **Example Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Great article! Very informative."
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "postId": "6c9afcf8-2fde-4ec7-9918-f3a78fc25252",
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Great article! Very informative.",
  "approved": false,
  "createdAt": "2025-06-01T10:00:00Z"
}
```

---

## Approve/Edit Comment (Admin)

- **URL:** `/api/comments/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|No|Commenter's name|
|email|string|No|Commenter's email|
|content|string|No|Comment text|
|approved|boolean|No|Approve or reject comment|

- **Example Request:**
```json
{
  "approved": true
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "uuid",
  "postId": "6c9afcf8-2fde-4ec7-9918-f3a78fc25252",
  "name": "John Doe",
  "email": "john@example.com",
  "content": "Great article!",
  "approved": true,
  "createdAt": "2025-01-02T00:00:00Z"
}
```

---

## Delete Comment (Admin)

- **URL:** `/api/comments/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Categories

- **URL:** `/api/categories/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Blockchain",
    "slug": "blockchain",
    "postCount": 12
  },
  {
    "id": "uuid",
    "name": "Web3",
    "slug": "web3",
    "postCount": 8
  }
]
```

---

## Create Category (Admin)

- **URL:** `/api/categories/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Category name|

- **Example Request:**
```json
{
  "name": "NFTs"
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "name": "NFTs",
  "slug": "nfts",
  "postCount": 0
}
```

---

## Update Category (Admin)

- **URL:** `/api/categories/<id>/`
- **Method:** `PUT`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Category name|

- **Example Request:**
```json
{
  "name": "Non-Fungible Tokens"
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Category (Admin)

- **URL:** `/api/categories/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

## List Tags

- **URL:** `/api/tags/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Blockchain",
    "slug": "blockchain"
  },
  {
    "id": "uuid",
    "name": "Web3",
    "slug": "web3"
  }
]
```

---

## Create Tag (Admin)

- **URL:** `/api/tags/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Tag name|

- **Example Request:**
```json
{
  "name": "NFT"
}
```
---

### **Response**

**Success Response**

**Status Code:** `201 Created`

```json
{
  "id": "uuid",
  "name": "NFT",
  "slug": "nft"
}
```

---

## Delete Tag (Admin)

- **URL:** `/api/tags/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

### **Notes**

- Post slugs are auto-generated from the title (lowercase, hyphenated)
- The `slug` field is used as the lookup for single post retrieval
- Comments submitted by the public are created with `approved: false` by default
- Admin users see all comments; public users only see approved comments
- Pagination is available on the posts list endpoint via `page` and `limit` query params
- The default page size is 10 items per page
