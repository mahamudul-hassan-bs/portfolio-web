# Portfolio Website Setup & Development Guide

## 🎉 Project Complete!

Your full-stack portfolio website with CMS blog platform is now ready for development. Here's everything you need to know to get started.

---

## 📁 Project Structure

```
portfolio-website/
├── frontend/               # Next.js 14 React App
│   ├── app/               # App Router
│   │   ├── (public)/      # Public pages group
│   │   ├── (admin)/       # Admin pages group
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities & helpers
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/               # Express.js API Server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── models/       # MongoDB Mongoose schemas
│   │   ├── routes/       # API route handlers
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Helper functions
│   │   └── server.ts     # Express app setup
│   └── package.json
│
└── README.md

```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file (already created as .env.local)
# No action needed - already configured

# Start development server
npm run dev
```

Frontend runs at: **http://localhost:3000**

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (already created as .env)
# Update MONGODB_URI if using different connection string

# Start development server
npm run dev
```

Backend runs at: **http://localhost:5000**

---

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user (protected)

### Profile (Singleton)

- `GET /api/profile` - Get portfolio profile
- `PUT /api/profile` - Update profile (protected)

### Blog

- `GET /api/blogs` - List published blogs (paginated)
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create blog (protected)
- `PUT /api/blogs/:id` - Update blog (protected)
- `DELETE /api/blogs/:id` - Delete blog (protected)

### Projects

- `GET /api/projects` - List projects (supports ?featured=true)
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Skills

- `GET /api/skills` - List visible skills (supports ?category=Frontend)
- `GET /api/skills/:id` - Get skill by ID
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### Education

- `GET /api/education` - List education entries
- `GET /api/education/:id` - Get education by ID
- `POST /api/education` - Create education (protected)
- `PUT /api/education/:id` - Update education (protected)
- `DELETE /api/education/:id` - Delete education (protected)

### Experience

- `GET /api/experience` - List experience entries
- `GET /api/experience/:id` - Get experience by ID
- `POST /api/experience` - Create experience (protected)
- `PUT /api/experience/:id` - Update experience (protected)
- `DELETE /api/experience/:id` - Delete experience (protected)

---

## 🛠 Database Setup

### MongoDB Connection

#### Option 1: Local MongoDB

```bash
# Make sure MongoDB is running locally
mongod
```

Use connection string: `mongodb://localhost:27017/portfolio`

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com](https://mongodb.com)
2. Create cluster
3. Get connection string
4. Update `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
```

### Database Models Created

- **User** - Admin users with email/password
- **Profile** - Portfolio owner info (singleton)
- **Blog** - Blog posts with slug-based routing
- **Project** - Portfolio projects with tech stack
- **Skill** - Technical skills with categories
- **Education** - Educational background
- **Experience** - Work experience

---

## 🔐 Admin Authentication

### Demo Credentials

```
Email: admin@example.com
Password: admin123
```

⚠️ **Important**: Change these credentials before production!

### How to Change Admin Password

1. Create admin user in database:

```javascript
// Connect to MongoDB and run
const User = require("./backend/src/models/User");
const { hashPassword } = require("./backend/src/utils/helpers");

const newPassword = await hashPassword("your-new-password");
User.findOneAndUpdate(
  { email: "admin@example.com" },
  { password: newPassword },
  { new: true }
);
```

2. Or create a new admin setup script (recommended)

---

## 📝 Frontend Pages

### Public Pages (No Auth Required)

- **Home** (`/`) - Hero section with featured projects
- **About** (`/about`) - Biography, skills overview
- **Projects** (`/projects`) - Project portfolio grid
- **Blog** (`/blog`) - Blog listing with tag filtering
- **Blog Detail** (`/blog/[slug]`) - Individual blog post
- **Contact** (`/contact`) - Contact form

### Admin Pages (Auth Required)

- **Login** (`/admin`) - Admin login page
- **Dashboard** (`/admin/dashboard`) - Overview & stats
- **Profile** (`/admin/dashboard/profile`) - Edit portfolio info
- **Blog Management** (`/admin/dashboard/blog`) - Create/edit/delete posts
- **Projects Management** (`/admin/dashboard/projects`) - Manage projects
- **Skills Management** (`/admin/dashboard/skills`) - Add/edit skills
- **Education** (`/admin/dashboard/education`) - Manage education
- **Experience** (`/admin/dashboard/experience`) - Manage work history

---

## 🎨 Styling & Customization

### Tailwind CSS

Colors are defined in `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: '#1F2937',      // Dark gray - headings
  secondary: '#6366F1',    // Indigo - buttons, links
  accent: '#EC4899',       // Pink - hover effects
}
```

Customize these colors to match your brand!

### Global Styles

- `frontend/globals.css` - Base styles
- Uses Tailwind CSS for all styling
- Responsive design (mobile-first)

---

## 🔄 Data Flow

### Creating a Blog Post (Example)

1. **Admin Login** → `/admin`
2. **Go to Blog** → `/admin/dashboard/blog`
3. **Click "New Post"** → `/admin/dashboard/blog/new`
4. **Fill Form** (title, content, tags, etc.)
5. **Submit** → POST `/api/blogs` (creates draft)
6. **Publish** → PUT `/api/blogs/:id` (sets published=true)
7. **View Live** → `/blog/:slug` (public page)

### Frontend Fetches Data

- Public pages fetch from `/api/` endpoints
- Data displayed with dummy data fallback
- Real data loads from MongoDB when available

---

## 📦 Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Portfolio
```

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_key_change_in_production
CORS_ORIGIN=http://localhost:3000
```

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Already optimized for Vercel
# Just push to GitHub and connect repo
# Auto-deploys on push
```

### Backend (Render / Railway)

```bash
# Build command: npm run build
# Start command: npm start
# Set environment variables in platform dashboard
```

### Database (MongoDB Atlas)

- Already cloud-hosted
- Just update connection string in production `.env`

---

## 🛠 Next Steps & Future Enhancements

### Completed ✅

- [x] Full project structure
- [x] All API endpoints
- [x] Admin authentication
- [x] Frontend pages (public & admin)
- [x] Database models
- [x] Responsive design

### Ready to Build Next 🚀

1. **Rich Text Editor** - Add TipTap/Slate for blog content
2. **File Upload** - Implement image uploads for projects/cover
3. **Email Integration** - Contact form email notifications
4. **Analytics** - Track page views, blog reads
5. **Comments** - Blog post comments system
6. **Draft Preview** - Preview drafts before publishing
7. **SEO** - Meta tags, sitemap, robots.txt
8. **Dark Mode** - Theme toggle
9. **Search** - Blog search functionality
10. **API Documentation** - Swagger/OpenAPI docs

---

## 🐛 Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED
→ Make sure MongoDB is running: mongod
→ Check connection string in .env
```

### CORS Errors

```
Error: Access to XMLHttpRequest blocked by CORS
→ Check CORS_ORIGIN in backend .env
→ Should match your frontend URL
```

### Token Validation Errors

```
Error: Invalid token
→ Clear localStorage: localStorage.clear()
→ Re-login
→ Check JWT_SECRET is same in backend
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
→ Change PORT in .env or kill process on that port
→ lsof -i :3000 (macOS/Linux)
→ netstat -ano | findstr :3000 (Windows)
```

---

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 📞 Support & Questions

For issues or questions:

1. Check troubleshooting section above
2. Review console/terminal error messages
3. Check MongoDB connection
4. Ensure all env variables are set correctly

---

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🎉**

Start by running both servers and visiting `http://localhost:3000` to see your portfolio in action!
