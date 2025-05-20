<style>
/* Sidebar nav styling */
.docs-container { display: flex; }
.docs-content { flex: 1; padding-right: 220px; }
.docs-sidebar { position: fixed; top: 100px; right: 20px; width: 200px; }
.docs-sidebar ul { list-style: none; padding: 0; }
.docs-sidebar li { margin-bottom: 0.5rem; }
.docs-sidebar a { text-decoration: none; color: #007bff; }
.docs-sidebar a:hover { text-decoration: underline; }
@media (max-width: 768px) {
  .docs-sidebar { display: none; }
  .docs-content { padding-right: 0; }
}
</style>

<div class="docs-container">

  <div class="docs-content">

# Patient Records API

Base URL: `https://api.yourapp.com` (or `http://localhost:3333` in development)

---

<a id="authentication"></a>

## Authentication

All endpoints under `/patients` require an `Authorization` header with a Bearer token obtained from login or register.

<a id="post-register"></a>

### POST `/register`

Register a new user.

**Request Body** (JSON)

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "secret123"
}
```

**Success Response** (201 Created)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "jdoe",
    "email": "jdoe@example.com"
  }
}
```

**Error Responses**

- **400 Bad Request**: Registration failed or validation error.

```json
{
  "message": "Registration failed",
  "error": "Password is too short"
}
```

---

<a id="post-login"></a>

### POST `/login`

Log in an existing user.

**Request Body** (JSON)

```json
{
  "email": "jdoe@example.com",
  "password": "secret123"
}
```

**Success Response** (200 OK)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "jdoe",
    "email": "jdoe@example.com"
  }
}
```

**Error Responses**

- **401 Unauthorized**: Invalid credentials.

```json
{
  "message": "Invalid credentials",
  "error": "Password mismatch"
}
```

---

<a id="patients"></a>

## Patients

All requests below must include the header:

```
Authorization: Bearer <token>
```

<a id="get-patients"></a>

### GET `/patients`

Fetch a paginated list of patients, with optional search.

**Query Parameters**

- `q` (string, optional): search term (name, DOB, allergies, etc.)
- `page` (integer, default `1`)
- `perPage` (integer, default `10`)

**Success Response** (200 OK)

```json
{
  "data": [
    {
      "id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "date_of_birth": "1980-05-20",
      "gender": "M",
      "weight": 80,
      "height": 180,
      "blood_type": "O+",
      "medical_history": "None",
      "allergies": "Peanuts"
    },
    ...
  ],
  "total": 42,
  "perPage": 10,
  "page": 1,
  "lastPage": 5
}
```

<a id="post-patients"></a>

### POST `/patients`

Create a new patient record.

**Request Body** (JSON)

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1990-12-01",
  "gender": "F",
  "weight": 65,
  "height": 170,
  "blood_type": "A-",
  "medical_history": "Asthma",
  "allergies": "None"
}
```

**Success Response** (201 Created)

```json
{
  "id": 7,
  "first_name": "Jane",
  "last_name": "Smith",
  "date_of_birth": "1990-12-01",
  "gender": "F",
  "weight": 65,
  "height": 170,
  "blood_type": "A-",
  "medical_history": "Asthma",
  "allergies": "None"
}
```

<a id="get-patientsid"></a>

### GET `/patients/:id`

Fetch a single patient by ID.

**Path Parameters**

- `id` (integer): Patient ID

**Success Response** (200 OK)

```json
{
  "id": 5,
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1980-05-20",
  "gender": "M",
  "weight": 80,
  "height": 180,
  "blood_type": "O+",
  "medical_history": "None",
  "allergies": "Peanuts"
}
```

**Error Responses**

- **404 Not Found**: when no patient exists with the given `id`.

---

<a id="put-patientsid"></a>

### PUT `/patients/:id`

Update fields for an existing patient.

**Path Parameters**

- `id` (integer): Patient ID

**Request Body** (JSON)

```json
{
  "first_name": "Johnny",
  "medical_history": "Updated history"
}
```

**Success Response** (200 OK)

```json
{
  "id": 5,
  "first_name": "Johnny",
  "last_name": "Doe",
  "date_of_birth": "1980-05-20",
  "gender": "M",
  "weight": 80,
  "height": 180,
  "blood_type": "O+",
  "medical_history": "Updated history",
  "allergies": "Peanuts"
}
```

<a id="delete-patientsid"></a>

### DELETE `/patients/:id`

Remove a patient record.

**Path Parameters**

- `id` (integer): Patient ID

**Success Response** (204 No Content)

> Response body is empty.

**Error Responses**

- **404 Not Found**: No patient with that `id`.

---

> **Note:** All date fields are in `YYYY-MM-DD` format. Adjust headers and request URLs to your deployment environment.

  </div>

  <nav class="docs-sidebar">
    <ul>
      <li><a href="#authentication">Authentication</a></li>
      <li><a href="#post-register">Register (POST)</a></li>
      <li><a href="#post-login">Login (POST)</a></li>
      <li><a href="#patients">Patients</a></li>
      <li><a href="#get-patients">List Patients (GET)</a></li>
      <li><a href="#post-patients">Create Patient (POST)</a></li>
      <li><a href="#get-patientsid">Get Patient (GET)</a></li>
      <li><a href="#put-patientsid">Update Patient (PUT)</a></li>
      <li><a href="#delete-patientsid">Delete Patient (DELETE)</a></li>
    </ul>
  </nav>

</div>
