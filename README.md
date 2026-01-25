# Portfolio Website with CMS Blog Platform

A complete, production-ready full-stack portfolio website with an integrated CMS for managing blog posts, projects, skills, education, and work experience.

## ✨ Features

### Public Website

- 🏠 Beautiful home page with hero section
- 👤 About page with biography and skills
- 🎨 Projects portfolio with tech stack display
- 📝 Blog listing with tag filtering
- 📖 Individual blog posts with view tracking
- 📧 Contact form
- 📱 Fully responsive design

### Admin Dashboard

- 🔐 Secure admin authentication (JWT)
- 👤 Profile management
- 📝 Blog CRUD with draft/publish toggle
- 🎨 Project management with featured flag
- ⚡ Skills management with categories
- 🎓 Education management
- 💼 Experience management
- 📊 Dashboard with statistics

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **HTTP Client**: Fetch API

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Security**: bcryptjs for password hashing

### Deployment

- **Frontend**: Vercel (optimized)
- **Backend**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
portfolio-website/
├── frontend/                          # Next.js 14 App
│   ├── app/
│   │   ├── (admin)/                  # Admin routes group
│   │   │   ├── page.tsx              # Login page
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx        # Admin layout
│   │   │       ├── page.tsx          # Dashboard home
│   │   │       ├── profile/          # Edit profile
│   │   │       ├── blog/             # Blog management
│   │   │       ├── projects/         # Project management
│   │   │       ├── skills/           # Skills management
│   │   │       ├── education/        # Education management
│   │   │       └── experience/       # Experience management
│   │   ├── (public)/                 # Public pages group
│   │   │   ├── about/
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/           # Dynamic blog post
│   │   │   └── contact/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/                          # Utilities
│   ├── public/                       # Static assets
│   └── package.json
│
├── backend/                          # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Profile.ts
│   │   │   ├── Blog.ts
│   │   │   ├── Project.ts
│   │   │   ├── Skill.ts
│   │   │   ├── Education.ts
│   │   │   └── Experience.ts
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── profileController.ts
│   │   │   ├── blogController.ts
│   │   │   ├── projectController.ts
│   │   │   ├── skillController.ts
│   │   │   ├── educationController.ts
│   │   │   └── experienceController.ts
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── profileRoutes.ts
│   │   │   ├── blogRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   ├── skillRoutes.ts
│   │   │   ├── educationRoutes.ts
│   │   │   └── experienceRoutes.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT validation
│   │   │   └── errorHandler.ts      # Error handling
│   │   ├── utils/
│   │   │   └── helpers.ts           # Password hashing, JWT, etc
│   │   └── server.ts
│   └── package.json
│
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── API_DOCUMENTATION.md             # Complete API reference
├── DATABASE_SCHEMA.md               # Database models reference
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend available at: **http://localhost:3000**

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend available at: **http://localhost:5000**

## 📚 Documentation

### Comprehensive Guides

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete setup and deployment guide
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Detailed API endpoint documentation
- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Database model reference

### Key Information

#### Admin Credentials

```
Email: admin@example.com
Password: admin123
```

⚠️ Change these before production!

#### Environment Variables

**Frontend** (`.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Backend** (`.env`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Profile

- `GET /api/profile` - Get portfolio profile
- `PUT /api/profile` - Update profile (protected)

### Blog

- `GET /api/blogs` - List blogs (paginated)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)

### Projects

- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get project
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Skills

- `GET /api/skills` - List visible skills
- `GET /api/skills/:id` - Get skill
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### Education

- `GET /api/education` - List education
- `POST /api/education` - Create education (protected)
- `PUT /api/education/:id` - Update education (protected)
- `DELETE /api/education/:id` - Delete education (protected)

### Experience

- `GET /api/experience` - List experience
- `POST /api/experience` - Create experience (protected)
- `PUT /api/experience/:id` - Update experience (protected)
- `DELETE /api/experience/:id` - Delete experience (protected)

## 📊 Database Models

### Implemented Models

- **User** - Admin authentication
- **Profile** - Portfolio owner information (singleton)
- **Blog** - Blog posts with publishing status
- **Project** - Portfolio projects
- **Skill** - Technical skills with proficiency levels
- **Education** - Educational background
- **Experience** - Work experience

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

## 🎨 Customization

### Colors

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#1F2937',      // Headings - Dark gray
  secondary: '#6366F1',    // Buttons - Indigo
  accent: '#EC4899',       // Hover - Pink
}
```

### Fonts

Update in `frontend/tailwind.config.js` and `frontend/globals.css`

### Content

All portfolio content is managed through the admin dashboard or directly edited in MongoDB.

## 🚢 Deployment

### Vercel (Frontend)

```bash
# Push to GitHub and connect repo
# Auto-deploys on push
```

### Render/Railway (Backend)

```
Build: npm run build
Start: npm start
```

### MongoDB Atlas (Database)

Update connection string in production `.env`

## 🛠 Development

### Add New Admin Page

1. Create folder in `frontend/app/(admin)/dashboard/`
2. Add `page.tsx`
3. Import Header from layout
4. Use API client to fetch/update data

### Add New API Endpoint

1. Create controller in `backend/src/controllers/`
2. Create routes in `backend/src/routes/`
3. Import and register in `backend/src/server.ts`

## 📋 Features Status

- [x] Project initialization
- [x] Database models (7 schemas)
- [x] Complete API (42 endpoints)
- [x] Admin authentication
- [x] Frontend public pages
- [x] Admin dashboard
- [x] Responsive design
- [ ] Rich text editor integration
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Blog comments
- [ ] Search functionality
- [ ] Analytics

## 🐛 Troubleshooting

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section for:

- MongoDB connection issues
- CORS errors
- Port conflicts
- Token validation problems

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🙌 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Get started immediately!** Both servers are ready to run:

```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev

# Visit http://localhost:3000
```

For detailed instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
