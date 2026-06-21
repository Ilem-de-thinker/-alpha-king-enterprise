# Team API

> **📸 Image Upload:** The `image` field supports **direct file upload to Cloudinary**.  
> To upload an image, send a **`multipart/form-data`** request with the image file in the `image` field.  
> You can also pass an existing URL string if you already have an image hosted elsewhere.

---

## List Team Members

- **URL:** `/api/team/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Adebayo Ogunlesi",
    "role": "Founder & CEO",
    "image": "",
    "linkedin": "",
    "twitter": "",
    "order": 1
  },
  {
    "id": "uuid",
    "name": "Chioma Nwachukwu",
    "role": "Head of Engineering",
    "image": "",
    "linkedin": "",
    "twitter": "",
    "order": 2
  },
  {
    "id": "uuid",
    "name": "Emeka Obi",
    "role": "Lead Blockchain Developer",
    "image": "",
    "linkedin": "",
    "twitter": "",
    "order": 3
  },
  {
    "id": "uuid",
    "name": "Fatima Mohammed",
    "role": "Enterprise Solutions Lead",
    "image": "",
    "linkedin": "",
    "twitter": "",
    "order": 4
  }
]
```

---

## Create Team Member (Admin)

- **URL:** `/api/team/`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|Yes|Member's full name|
|role|string|Yes|Job title / role|
|image|file / string|No|Profile image file (uploaded to Cloudinary) or existing URL|
|linkedin|string|No|LinkedIn profile URL|
|twitter|string|No|Twitter profile URL|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "name": "Grace Okonkwo",
  "role": "UI/UX Designer",
  "image": "https://example.com/grace.jpg",
  "linkedin": "https://linkedin.com/in/grace",
  "twitter": "https://twitter.com/grace",
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
  "name": "Grace Okonkwo",
  "role": "UI/UX Designer",
  "image": "https://example.com/grace.jpg",
  "linkedin": "https://linkedin.com/in/grace",
  "twitter": "https://twitter.com/grace",
  "order": 5
}
```

---

## Update Team Member (Admin)

- **URL:** `/api/team/<id>/`
- **Method:** `PUT`
- **Content-Type:** `multipart/form-data` (for file upload) or `application/json` (for URL strings)
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|name|string|No|Member's full name|
|role|string|No|Job title|
|image|file / string|No|Profile image file (uploaded to Cloudinary) or existing URL|
|linkedin|string|No|LinkedIn URL|
|twitter|string|No|Twitter URL|
|order|integer|No|Display order|

- **Example Request:**
```json
{
  "role": "Senior Blockchain Developer",
  "order": 3
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

---

## Delete Team Member (Admin)

- **URL:** `/api/team/<id>/`
- **Method:** `DELETE`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `204 No Content`

---

### **Notes**

- Team members are ordered by the `order` field ascending
- The `image` field accepts either a file upload (uploaded to Cloudinary) or an existing URL string
- LinkedIn, and Twitter fields are optional
- All admin endpoints require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
