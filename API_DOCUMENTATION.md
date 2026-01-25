# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-api-domain.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

Tokens are obtained via login and stored in localStorage on the client.

---

## Authentication Endpoints

### POST /auth/login

Login with admin credentials to get JWT token

**Request:**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401):**

```json
{
  "message": "Invalid credentials"
}
```

---

### GET /auth/me

Get current authenticated user info

**Headers:** Requires Authorization token

**Response (200):**

```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Profile Endpoints

### GET /profile

Get portfolio owner profile (PUBLIC)

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439001",
  "name": "Mahamudul Hassan Barshan",
  "title": "Full-Stack Developer",
  "introduction": "Building modern web applications...",
  "email": "contact@example.com",
  "phone": "+880123456789",
  "location": "Dhaka, Bangladesh",
  "profileImage": "https://...",
  "resume": "https://...",
  "socialLinks": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/...",
    "twitter": "https://twitter.com/...",
    "portfolio": "https://..."
  },
  "createdAt": "2024-12-27T15:30:00Z",
  "updatedAt": "2024-12-27T15:30:00Z"
}
```

---

### PUT /profile

Update profile (PROTECTED - Admin only)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "name": "Updated Name",
  "title": "Senior Developer",
  "introduction": "Updated intro...",
  "email": "newemail@example.com",
  "phone": "+880987654321",
  "location": "Dhaka",
  "socialLinks": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/..."
  }
}
```

**Response (200):**

```json
{
  "message": "Profile updated successfully",
  "profile": {
    /* updated profile */
  }
}
```

---

## Blog Endpoints

### GET /blogs

List published blog posts with pagination (PUBLIC)

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Posts per page

**Example:** `GET /blogs?page=1&limit=10`

**Response (200):**

```json
{
  "blogs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with Next.js 14",
      "slug": "getting-started-nextjs-14",
      "excerpt": "Learn the basics...",
      "coverImage": "https://...",
      "tags": ["Next.js", "React"],
      "published": true,
      "publishedAt": "2024-12-28T10:00:00Z",
      "author": "Mahamudul Hassan Barshan",
      "views": 234,
      "createdAt": "2024-12-27T15:30:00Z",
      "updatedAt": "2024-12-28T10:00:00Z"
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "limit": 10
  }
}
```

---

### GET /blogs/:slug

Get single blog post by slug (PUBLIC)

**Example:** `GET /blogs/getting-started-nextjs-14`

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with Next.js 14",
  "slug": "getting-started-nextjs-14",
  "content": "# Getting Started\n\nNext.js 14 is...",
  "excerpt": "Learn the basics...",
  "coverImage": "https://...",
  "tags": ["Next.js", "React"],
  "published": true,
  "publishedAt": "2024-12-28T10:00:00Z",
  "author": "Mahamudul Hassan Barshan",
  "views": 235,
  "createdAt": "2024-12-27T15:30:00Z",
  "updatedAt": "2024-12-28T10:00:00Z"
}
```

**Note:** Views automatically increment when post is fetched.

---

### POST /blogs

Create new blog post (PROTECTED)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "title": "My New Blog Post",
  "content": "# Heading\n\nContent here...",
  "excerpt": "Short preview of the post",
  "coverImage": "https://...",
  "tags": ["Next.js", "React", "Tutorial"]
}
```

**Response (201):**

```json
{
  "message": "Blog created successfully",
  "blog": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My New Blog Post",
    "slug": "my-new-blog-post",
    "published": false,
    ...
  }
}
```

---

### PUT /blogs/:id

Update blog post (PROTECTED)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "excerpt": "Updated excerpt",
  "tags": ["Updated", "Tags"],
  "published": true
}
```

**Response (200):**

```json
{
  "message": "Blog updated successfully",
  "blog": {
    /* updated blog */
  }
}
```

---

### DELETE /blogs/:id

Delete blog post (PROTECTED)

**Headers:** Requires Authorization token

**Response (200):**

```json
{
  "message": "Blog deleted successfully"
}
```

---

## Project Endpoints

### GET /projects

List all projects (PUBLIC)

**Query Parameters:**

- `featured` (optional) - Filter by featured: `?featured=true`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "title": "E-Commerce Platform",
    "shortDescription": "A full-featured online store",
    "description": "Complete e-commerce solution...",
    "image": "https://...",
    "techStack": ["Next.js", "MongoDB", "Stripe"],
    "githubLink": "https://github.com/...",
    "liveLink": "https://example.com",
    "featured": true,
    "order": 1,
    "createdAt": "2024-12-27T15:30:00Z",
    "updatedAt": "2024-12-27T15:30:00Z"
  }
]
```

---

### GET /projects/:id

Get single project by ID (PUBLIC)

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439021",
  "title": "E-Commerce Platform",
  ...
}
```

---

### POST /projects

Create new project (PROTECTED)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "title": "New Project",
  "description": "Detailed description...",
  "shortDescription": "Short summary",
  "image": "https://...",
  "techStack": ["React", "Node.js", "MongoDB"],
  "githubLink": "https://github.com/...",
  "liveLink": "https://example.com",
  "featured": false
}
```

**Response (201):**

```json
{
  "message": "Project created successfully",
  "project": {
    /* new project */
  }
}
```

---

### PUT /projects/:id

Update project (PROTECTED)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "title": "Updated Title",
  "featured": true,
  "order": 2,
  ...
}
```

**Response (200):**

```json
{
  "message": "Project updated successfully",
  "project": {
    /* updated project */
  }
}
```

---

### DELETE /projects/:id

Delete project (PROTECTED)

**Response (200):**

```json
{
  "message": "Project deleted successfully"
}
```

---

## Skill Endpoints

### GET /skills

List visible skills (PUBLIC)

**Query Parameters:**

- `category` (optional) - Filter: `?category=Frontend`

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "name": "React",
    "category": "Frontend",
    "level": 95,
    "icon": "react.svg",
    "visible": true,
    "order": 1,
    "createdAt": "2024-12-27T15:30:00Z",
    "updatedAt": "2024-12-27T15:30:00Z"
  }
]
```

---

### GET /skills/:id

Get single skill (PUBLIC)

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439031",
  "name": "React",
  ...
}
```

---

### POST /skills

Create skill (PROTECTED)

**Headers:** Requires Authorization token

**Request:**

```json
{
  "name": "TypeScript",
  "category": "Frontend",
  "level": 85,
  "icon": "typescript.svg",
  "visible": true
}
```

**Response (201):**

```json
{
  "message": "Skill created successfully",
  "skill": {
    /* new skill */
  }
}
```

---

### PUT /skills/:id

Update skill (PROTECTED)

**Request:**

```json
{
  "level": 90,
  "visible": true,
  "order": 2
}
```

**Response (200):**

```json
{
  "message": "Skill updated successfully",
  "skill": {
    /* updated skill */
  }
}
```

---

### DELETE /skills/:id

Delete skill (PROTECTED)

**Response (200):**

```json
{
  "message": "Skill deleted successfully"
}
```

---

## Education Endpoints

### GET /education

List education entries (PUBLIC)

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439041",
    "institution": "University of Dhaka",
    "degree": "Bachelor of Science",
    "fieldOfStudy": "Computer Science",
    "startYear": 2018,
    "endYear": 2022,
    "currentlyStudying": false,
    "description": "Description...",
    "order": 1,
    "createdAt": "2024-12-27T15:30:00Z",
    "updatedAt": "2024-12-27T15:30:00Z"
  }
]
```

---

### POST /education

Create education entry (PROTECTED)

**Request:**

```json
{
  "institution": "University Name",
  "degree": "Bachelor",
  "fieldOfStudy": "Computer Science",
  "startYear": 2018,
  "endYear": 2022,
  "currentlyStudying": false,
  "description": "Additional info..."
}
```

**Response (201):**

```json
{
  "message": "Education added successfully",
  "education": {
    /* new education */
  }
}
```

---

### PUT /education/:id

Update education (PROTECTED)

**Request:** Same fields as POST

**Response (200):**

```json
{
  "message": "Education updated successfully",
  "education": {
    /* updated education */
  }
}
```

---

### DELETE /education/:id

Delete education (PROTECTED)

**Response (200):**

```json
{
  "message": "Education deleted successfully"
}
```

---

## Experience Endpoints

### GET /experience

List work experience (PUBLIC)

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439051",
    "company": "Tech Company Ltd",
    "role": "Senior Developer",
    "employmentType": "Full-time",
    "startDate": "2022-01-15T00:00:00Z",
    "endDate": null,
    "currentlyWorking": true,
    "description": "Developed and maintained...",
    "order": 1,
    "createdAt": "2024-12-27T15:30:00Z",
    "updatedAt": "2024-12-27T15:30:00Z"
  }
]
```

---

### POST /experience

Create experience (PROTECTED)

**Request:**

```json
{
  "company": "Company Name",
  "role": "Developer",
  "employmentType": "Full-time",
  "startDate": "2022-01-15",
  "endDate": null,
  "currentlyWorking": true,
  "description": "Job responsibilities..."
}
```

**Response (201):**

```json
{
  "message": "Experience added successfully",
  "experience": {
    /* new experience */
  }
}
```

---

### PUT /experience/:id

Update experience (PROTECTED)

**Request:** Same fields as POST

**Response (200):**

```json
{
  "message": "Experience updated successfully",
  "experience": {
    /* updated experience */
  }
}
```

---

### DELETE /experience/:id

Delete experience (PROTECTED)

**Response (200):**

```json
{
  "message": "Experience deleted successfully"
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**

```json
{
  "message": "Title, content, and excerpt are required"
}
```

**401 Unauthorized:**

```json
{
  "message": "Invalid token"
}
```

**404 Not Found:**

```json
{
  "message": "Blog post not found"
}
```

**500 Server Error:**

```json
{
  "message": "Server error during login"
}
```

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding:

- Login attempts: 5 per minute
- API calls: 100 per minute per IP
- File uploads: 10MB max

---

## CORS Configuration

Current CORS allowed origins:

- Development: `http://localhost:3000`
- Production: Update in `.env` → `CORS_ORIGIN`

---

_Last Updated: December 28, 2024_
