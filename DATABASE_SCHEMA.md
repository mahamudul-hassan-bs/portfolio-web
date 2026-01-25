# Database Schema Reference

## User Model

Admin authentication model

```typescript
{
  _id: ObjectId
  email: String (required, unique)
  password: String (hashed, required)
  role: String (enum: ['admin'], default: 'admin')
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Admin login and authentication

---

## Profile Model

Portfolio owner's profile (singleton - only one document)

```typescript
{
  _id: ObjectId
  name: String (required)
  title: String (required)
  introduction: String (required)
  profileImage: String (optional)
  resume: String (optional, PDF URL)
  email: String (required)
  phone: String (optional)
  location: String (optional)
  socialLinks: {
    github: String
    linkedin: String
    twitter: String
    portfolio: String
  }
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Display portfolio owner info on all pages

---

## Blog Model

Blog post with publication management

```typescript
{
  _id: ObjectId
  title: String (required)
  slug: String (required, unique, lowercase)
  content: String (required, rich text)
  excerpt: String (required, preview text)
  coverImage: String (optional)
  tags: [String]
  published: Boolean (default: false)
  publishedAt: Date (set when published)
  author: String (default: 'Mahamudul Hassan Barshan')
  views: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Blog posts with tag filtering, view tracking

---

## Project Model

Portfolio projects with tech stack

```typescript
{
  _id: ObjectId
  title: String (required)
  description: String (required)
  shortDescription: String (required)
  image: String (optional)
  techStack: [String] (required)
  githubLink: String (optional)
  liveLink: String (optional)
  featured: Boolean (default: false)
  order: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Display projects with filtering for featured projects

---

## Skill Model

Technical skills with proficiency levels

```typescript
{
  _id: ObjectId
  name: String (required)
  category: String (enum: ['Frontend', 'Backend', 'Tools', 'Other'], required)
  level: Number (0-100, required)
  icon: String (optional)
  visible: Boolean (default: true)
  order: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Display skills grouped by category with proficiency bars

---

## Education Model

Educational background

```typescript
{
  _id: ObjectId
  institution: String (required)
  degree: String (required)
  fieldOfStudy: String (required)
  startYear: Number (required)
  endYear: Number (optional)
  currentlyStudying: Boolean (default: false)
  description: String (optional)
  order: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Display education timeline

---

## Experience Model

Work experience timeline

```typescript
{
  _id: ObjectId
  company: String (required)
  role: String (required)
  employmentType: String (enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'], required)
  startDate: Date (required)
  endDate: Date (optional)
  currentlyWorking: Boolean (default: false)
  description: String (required, rich text)
  order: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

**Usage**: Display work experience timeline

---

## Sample Data Structure

### Example Blog Document

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Getting Started with Next.js 14",
  "slug": "getting-started-nextjs-14",
  "excerpt": "Learn the basics of Next.js 14...",
  "content": "# Getting Started\n\nNext.js 14...",
  "tags": ["Next.js", "React", "Tutorial"],
  "published": true,
  "publishedAt": "2024-12-28T10:00:00Z",
  "author": "Mahamudul Hassan Barshan",
  "views": 234,
  "createdAt": "2024-12-27T15:30:00Z",
  "updatedAt": "2024-12-28T10:00:00Z"
}
```

### Example Skill Document

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "React",
  "category": "Frontend",
  "level": 95,
  "visible": true,
  "order": 1,
  "createdAt": "2024-12-27T15:30:00Z",
  "updatedAt": "2024-12-27T15:30:00Z"
}
```

### Example Project Document

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "E-Commerce Platform",
  "shortDescription": "A full-featured online store",
  "description": "Complete e-commerce solution...",
  "techStack": ["Next.js", "MongoDB", "Stripe"],
  "featured": true,
  "githubLink": "https://github.com/...",
  "liveLink": "https://example.com",
  "order": 1,
  "createdAt": "2024-12-27T15:30:00Z",
  "updatedAt": "2024-12-27T15:30:00Z"
}
```

---

## Query Examples

### Get Published Blogs

```javascript
Blog.find({ published: true }).sort({ publishedAt: -1 });
```

### Get Featured Projects

```javascript
Project.find({ featured: true }).sort({ order: 1 });
```

### Get Frontend Skills

```javascript
Skill.find({ category: "Frontend", visible: true }).sort({ order: 1 });
```

### Get Current Work Experience

```javascript
Experience.find({ currentlyWorking: true });
```

### Get Ongoing Education

```javascript
Education.find({ currentlyStudying: true });
```

---

## Indexing Recommendations

For better query performance, add these indexes:

```javascript
// User
User.collection.createIndex({ email: 1 }, { unique: true });

// Blog
Blog.collection.createIndex({ slug: 1 }, { unique: true });
Blog.collection.createIndex({ published: 1, publishedAt: -1 });
Blog.collection.createIndex({ tags: 1 });

// Skill
Skill.collection.createIndex({ category: 1, visible: 1 });

// Experience
Experience.collection.createIndex({ currentlyWorking: 1 });

// Education
Education.collection.createIndex({ currentlyStudying: 1 });
```

---

## Data Relationships

```
User (Admin)
  ├── Creates/Updates → Blog
  ├── Creates/Updates → Project
  ├── Creates/Updates → Skill
  ├── Creates/Updates → Education
  ├── Creates/Updates → Experience
  └── Creates/Updates → Profile

Public Access:
  ├── Read → Profile
  ├── Read → Blog (only published)
  ├── Read → Project (all)
  ├── Read → Skill (only visible)
  ├── Read → Education (all)
  └── Read → Experience (all)
```

---

## Best Practices

1. **Always use timestamps** - `createdAt` and `updatedAt` included in all models
2. **Use slugs for URLs** - Blog posts use slug for better SEO
3. **Soft delete consideration** - Add `deletedAt` field if audit trail needed
4. **Indexing** - Add indexes for frequently queried fields
5. **Validation** - Use Mongoose schema validation
6. **References** - Currently no document references; keep it denormalized
7. **Pagination** - Implement for large result sets (Blog posts)

---

_Last Updated: December 28, 2024_
