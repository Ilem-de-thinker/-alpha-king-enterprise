# Authentication API

## Admin Login

- **URL:** `/api/auth/login/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|email|string|Yes|Admin email address|
|password|string|Yes|Admin password|

- **Example Request:**
```json
{
  "email": "admin@alpharkingenterprise.com",
  "password": "admin123"
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "477ff7a8-de64-4e66-affb-4e69ce94714f",
    "email": "admin@alpharkingenterprise.com",
    "role": "admin",
    "username": "admin"
  }
}
```

---

**Error Responses**

**401 Unauthorized**

```json
{
  "error": "Invalid credentials"
}
```

---

## Admin Logout

- **URL:** `/api/auth/logout/`
- **Method:** `POST`
- **Content-Type:** `application/json`
### **Request Body:**

|Field Name|Type|Required|Description|
|---|---|---|---|
|refresh|string|No|Refresh token to blacklist|

- **Example Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIs..."
}
```
---

### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "message": "Logged out"
}
```

---

**Error Responses**

**401 Unauthorized**

```json
{
  "error": "Authentication credentials were not provided"
}
```

---

## Current Admin User

- **URL:** `/api/auth/me/`
- **Method:** `GET`
- **Content-Type:** `application/json`
### **Response**

**Success Response**

**Status Code:** `200 OK`

```json
{
  "id": "477ff7a8-de64-4e66-affb-4e69ce94714f",
  "email": "admin@alpharkingenterprise.com",
  "role": "admin",
  "username": "admin"
}
```

---

**Error Responses**

**401 Unauthorized**

```json
{
  "error": "Authentication credentials were not provided"
}
```

---

### **Notes**

- All admin endpoints require Bearer Token in headers:
  ```
  Authorization: Bearer <token>
  ```
- The default admin credentials are:
  - Email: `admin@alpharkingenterprise.com`
  - Password: `admin123`
- Tokens are valid for 1 day by default
