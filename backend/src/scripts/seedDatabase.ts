import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User";
import Profile from "../models/Profile";
import Blog from "../models/Blog";
import Project from "../models/Project";
import Skill from "../models/Skill";
import Education from "../models/Education";
import Experience from "../models/Experience";
import Tag from "../models/Tag";
import { hashPassword, generateSlug } from "../utils/helpers";

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Profile.deleteMany({});
    await Blog.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Education.deleteMany({});
    await Experience.deleteMany({});
    await Tag.deleteMany({});
    console.log("Cleared existing data");

    // 1. Create Admin User
    const hashedPassword = await hashPassword("admin123");
    const user = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("✓ Admin user created");

    // 2. Create Profile (Singleton)
    const profile = await Profile.create({
      name: "Mahamudul Hassan Barshan",
      title: "Full-Stack Developer",
      introduction:
        "I build modern, scalable web applications with passion for clean code and user experience.",
      profileImage: "https://via.placeholder.com/150",
      email: "contact@example.com",
      phone: "+880 1234 567890",
      location: "Bangladesh",
      socialLinks: {
        github: "https://github.com",
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        portfolio: "https://example.com",
      },
    });
    console.log("✓ Profile created");

    // 3. Create Blog Posts
    const blogs = await Blog.create([
      {
        title: "Getting Started with Next.js 14",
        slug: "getting-started-nextjs-14",
        excerpt:
          "Learn the basics of Next.js 14 and start building amazing applications with the App Router.",
        content: `# Getting Started with Next.js 14

Next.js 14 is an incredible framework for building modern web applications. In this comprehensive guide, we'll explore the key features and best practices.

## What is Next.js?

Next.js is a React framework that enables production-grade features like server-side rendering, static site generation, and API routes. It provides an excellent developer experience with hot module reloading and automatic code splitting.

## Key Features in Next.js 14

- **App Router**: The new file-based routing system that replaces the Pages Router
- **Server Components**: Build components that run on the server for better performance
- **API Routes**: Create backend endpoints without needing a separate server
- **Automatic Optimization**: Built-in image and font optimization
- **Middleware**: Handle authentication and redirects at the edge

## Getting Started

To create a new Next.js project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

Your application will be available at \`http://localhost:3000\`.

## Project Structure

The App Router uses a different structure:

- \`app/\` - Contains your routes and layouts
- \`public/\` - Static assets like images and fonts
- \`package.json\` - Project dependencies and scripts
- \`tailwind.config.js\` - Tailwind CSS configuration

## Creating Your First Page

Create a file at \`app/about/page.tsx\`:

\`\`\`typescript
export default function About() {
  return (
    <div>
      <h1>About Me</h1>
      <p>Welcome to my about page.</p>
    </div>
  )
}
\`\`\`

## Conclusion

Next.js 14 makes it incredibly easy to build fast, scalable web applications. The framework handles optimization, routing, and deployment seamlessly, letting you focus on building great features.`,
        tags: ["Next.js", "React", "Web Development", "Tutorial"],
        published: true,
        publishedAt: new Date("2024-01-15"),
        views: 342,
      },
      {
        title: "MongoDB Best Practices for Production",
        slug: "mongodb-best-practices",
        excerpt:
          "Essential tips and tricks for working with MongoDB in production environments.",
        content: `# MongoDB Best Practices for Production

MongoDB is a powerful NoSQL database, but using it effectively requires following certain best practices. This guide covers the essentials.

## Connection Pooling

Always use connection pooling to manage your database connections efficiently:

\`\`\`javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
\`\`\`

## Schema Design

Design your schemas carefully to optimize query performance:

1. **Denormalization**: Store frequently accessed data together
2. **Indexing**: Create indexes on fields you query frequently
3. **Validation**: Use schema validation to ensure data integrity

## Query Optimization

- Use projections to select only needed fields
- Create indexes on sorted fields
- Monitor slow queries with the MongoDB profiler

## Backup and Recovery

Implement a solid backup strategy:

- Regular automated backups
- Test restore procedures
- Use MongoDB Atlas for managed backups

## Security

Keep your database secure:

- Use strong passwords
- Enable authentication and authorization
- Restrict network access with IP whitelisting
- Encrypt data in transit and at rest

## Conclusion

Following these best practices will help you build robust MongoDB applications that scale effectively.`,
        tags: ["MongoDB", "Database", "Backend", "Production"],
        published: true,
        publishedAt: new Date("2024-01-10"),
        views: 287,
      },
      {
        title: "Building Scalable Node.js Applications",
        slug: "building-scalable-nodejs",
        excerpt:
          "Strategies for scaling Node.js applications to handle millions of users.",
        content: `# Building Scalable Node.js Applications

Scaling Node.js applications is crucial for handling increased traffic and load. This article covers key strategies.

## Horizontal Scaling

Distribute your application across multiple servers:

\`\`\`javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
}
\`\`\`

## Load Balancing

Use a load balancer like Nginx or HAProxy to distribute traffic:

\`\`\`nginx
upstream backend {
  server 127.0.0.1:3000;
  server 127.0.0.1:3001;
  server 127.0.0.1:3002;
}

server {
  listen 80;
  location / {
    proxy_pass http://backend;
  }
}
\`\`\`

## Caching Strategies

Implement caching to reduce database load:

- **Memory Cache**: Redis for fast data access
- **CDN**: Cache static assets globally
- **HTTP Caching**: Use cache headers effectively

## Database Optimization

- Use connection pooling
- Implement read replicas
- Optimize queries and add indexes
- Consider database sharding

## Monitoring and Profiling

Monitor application performance:

- Use APM tools like New Relic
- Track error rates and response times
- Profile CPU and memory usage
- Set up alerts for anomalies

## Conclusion

Scalable Node.js applications require careful architecture, monitoring, and optimization. Plan ahead and implement these strategies from the start.`,
        tags: ["Node.js", "Scalability", "Architecture", "Backend"],
        published: true,
        publishedAt: new Date("2024-01-05"),
        views: 521,
      },
    ]);
    console.log("✓ Blog posts created");

    // 4. Create Projects
    const projects = await Project.create([
      {
        title: "E-Commerce Platform",
        shortDescription:
          "A full-featured online store built with Next.js and Stripe",
        description:
          "A complete e-commerce solution with product management, shopping cart, payment processing via Stripe, user authentication, and admin dashboard for managing inventory and orders.",
        techStack: [
          "Next.js",
          "React",
          "MongoDB",
          "Stripe",
          "Tailwind CSS",
          "TypeScript",
        ],
        image: "https://via.placeholder.com/400x300",
        featured: true,
        liveLink: "https://ecommerce-demo.example.com",
        githubLink: "https://github.com/example/ecommerce",
        order: 1,
      },
      {
        title: "Task Management Application",
        shortDescription:
          "Collaborative task management tool with real-time updates",
        description:
          "Real-time task management application built with React and Node.js. Features include team collaboration, drag-and-drop board management, notifications, and activity tracking. Uses Socket.io for real-time updates.",
        techStack: [
          "React",
          "Node.js",
          "Socket.io",
          "MongoDB",
          "Express",
          "Tailwind CSS",
        ],
        image: "https://via.placeholder.com/400x300",
        featured: true,
        liveLink: "https://tasks-demo.example.com",
        githubLink: "https://github.com/example/tasks",
        order: 2,
      },
      {
        title: "Analytics Dashboard",
        shortDescription: "Data visualization and analytics platform",
        description:
          "Interactive dashboard for data analysis and reporting with real-time updates. Features include customizable charts, data export functionality, and advanced filtering. Built with React and D3.js.",
        techStack: [
          "React",
          "D3.js",
          "Express",
          "PostgreSQL",
          "Redux",
          "Material-UI",
        ],
        image: "https://via.placeholder.com/400x300",
        featured: false,
        liveLink: "https://analytics-demo.example.com",
        githubLink: "https://github.com/example/analytics",
        order: 3,
      },
      {
        title: "Weather App with Geolocation",
        shortDescription:
          "Real-time weather application with location-based services",
        description:
          "A weather application that uses geolocation to provide real-time weather data. Features include hourly forecasts, 7-day predictions, and weather alerts. Built with React and OpenWeather API.",
        techStack: [
          "React",
          "Next.js",
          "OpenWeather API",
          "Tailwind CSS",
          "Geolocation API",
        ],
        image: "https://via.placeholder.com/400x300",
        featured: false,
        liveLink: "https://weather-demo.example.com",
        githubLink: "https://github.com/example/weather",
        order: 4,
      },
      {
        title: "Blog CMS Platform",
        shortDescription: "Headless CMS for managing blog content",
        description:
          "A comprehensive content management system built with Node.js and MongoDB. Features include rich text editing, media management, SEO optimization, and content scheduling.",
        techStack: ["Node.js", "Express", "MongoDB", "React", "Mongoose"],
        image: "https://via.placeholder.com/400x300",
        featured: false,
        liveLink: "https://cms-demo.example.com",
        githubLink: "https://github.com/example/cms",
        order: 5,
      },
    ]);
    console.log("✓ Projects created");

    // 5. Create Skills
    const skills = await Skill.create([
      // Frontend Skills
      {
        name: "React",
        category: "Frontend",
        level: 95,
        description:
          "Expert in React with hooks, context, and performance optimization",
        visible: true,
      },
      {
        name: "Next.js",
        category: "Frontend",
        level: 90,
        description:
          "Proficient in Next.js 14 with App Router and server components",
        visible: true,
      },
      {
        name: "TypeScript",
        category: "Frontend",
        level: 88,
        description: "Strong TypeScript skills for type-safe applications",
        visible: true,
      },
      {
        name: "Tailwind CSS",
        category: "Frontend",
        level: 92,
        description:
          "Expert in utility-first CSS design and responsive layouts",
        visible: true,
      },
      {
        name: "JavaScript",
        category: "Frontend",
        level: 95,
        description: "Deep JavaScript knowledge including ES6+ features",
        visible: true,
      },
      // Backend Skills
      {
        name: "Node.js",
        category: "Backend",
        level: 92,
        description: "Experienced in building scalable Node.js applications",
        visible: true,
      },
      {
        name: "Express.js",
        category: "Backend",
        level: 90,
        description: "Proficient in Express.js for API development",
        visible: true,
      },
      {
        name: "MongoDB",
        category: "Backend",
        level: 88,
        description: "Strong MongoDB skills with Mongoose ODM",
        visible: true,
      },
      {
        name: "PostgreSQL",
        category: "Backend",
        level: 80,
        description: "Experienced with relational databases and SQL",
        visible: true,
      },
      {
        name: "REST APIs",
        category: "Backend",
        level: 90,
        description: "Expert in designing and building RESTful APIs",
        visible: true,
      },
      // Tools & DevOps
      {
        name: "Git & GitHub",
        category: "Tools",
        level: 90,
        description: "Proficient in version control and GitHub workflows",
        visible: true,
      },
      {
        name: "Docker",
        category: "Tools",
        level: 75,
        description: "Good knowledge of containerization and Docker",
        visible: true,
      },
      {
        name: "Vercel",
        category: "Tools",
        level: 85,
        description: "Expert in deploying Next.js apps on Vercel",
        visible: true,
      },
      {
        name: "AWS",
        category: "Tools",
        level: 70,
        description: "Familiar with AWS services and cloud deployment",
        visible: true,
      },
      {
        name: "Linux & CLI",
        category: "Tools",
        level: 85,
        description: "Strong command line and Linux administration skills",
        visible: true,
      },
    ]);
    console.log("✓ Skills created");

    // 6. Create Education
    const education = await Education.create([
      {
        institution: "University of Technology",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startYear: 2016,
        endYear: 2020,
        currentlyStudying: false,
        description:
          "Completed a comprehensive computer science program with focus on web development and software engineering.",
        order: 1,
      },
      {
        institution: "Online Learning Platform",
        degree: "Full Stack Web Development Bootcamp",
        fieldOfStudy: "Web Development",
        startYear: 2020,
        endYear: 2021,
        currentlyStudying: false,
        description:
          "Intensive bootcamp covering MERN stack and modern web development practices.",
        order: 2,
      },
      {
        institution: "Udemy",
        degree: "Advanced TypeScript Course",
        fieldOfStudy: "TypeScript",
        startYear: 2023,
        endYear: 2023,
        currentlyStudying: false,
        description:
          "Advanced course covering TypeScript advanced patterns and type system mastery.",
        order: 3,
      },
    ]);
    console.log("✓ Education created");

    // 7. Create Experience
    const experience = await Experience.create([
      {
        company: "Tech Startup Solutions",
        role: "Senior Full-Stack Developer",
        employmentType: "Full-time",
        startDate: new Date("2022-06-01"),
        endDate: null,
        currentlyWorking: true,
        description:
          "Leading development of scalable web applications using Next.js and Node.js. Managing a team of 3 developers and mentoring junior developers.",
        accomplishments: [
          "Architected and deployed a microservices-based payment system serving 100k+ transactions/day",
          "Reduced API response time by 45% through optimization and caching strategies",
          "Led migration from monolith to microservices architecture",
        ],
      },
      {
        company: "Digital Agency Pro",
        role: "Full-Stack Developer",
        employmentType: "Full-time",
        startDate: new Date("2020-08-01"),
        endDate: new Date("2022-05-31"),
        currentlyWorking: false,
        description:
          "Developed and maintained multiple client projects using React, Node.js, and MongoDB. Collaborated with designers and product managers.",
        accomplishments: [
          "Built 15+ responsive web applications for various clients",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
          "Mentored 2 junior developers in web development best practices",
        ],
      },
      {
        company: "Freelance",
        role: "Web Developer",
        employmentType: "Freelance",
        startDate: new Date("2019-01-01"),
        endDate: new Date("2020-07-31"),
        currentlyWorking: false,
        description:
          "Developed custom websites and web applications for various clients. Handled full project lifecycle from requirements to deployment.",
        accomplishments: [
          "Completed 20+ freelance projects with 100% client satisfaction",
          "Maintained an average project delivery time of 2 weeks",
          "Built reputation with 4.9/5 average rating across platforms",
        ],
      },
    ]);
    console.log("✓ Experience created");

    // 8. Create Tags
    const tags = [
      "All Posts",
      "Nodejs",
      "Next.js",
      "Chart.js",
      "Tutorial",
      "MongoDB",
      "React",
      "Web Development",
      "Database",
      "Backend",
      "Production",
      "Scalability",
      "Architecture",
    ];
    await Tag.insertMany(tags.map((name) => ({ name: name.toLowerCase() })));
    console.log("✓ Tags created");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nAdmin Credentials:");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log(
      "\n⚠️  IMPORTANT: Change these credentials before deploying to production!"
    );

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
