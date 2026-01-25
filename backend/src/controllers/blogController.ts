import { Request, Response } from "express";
import Blog from "../models/Blog";
import { generateSlug } from "../utils/helpers";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ published: true })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ published: true });

    return res.json({
      blogs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching blogs" });
  }
};

export const getAllBlogsAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    return res.json({
      blogs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching blogs" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching blog" });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, published: true });

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching blog" });
  }
};

export const createBlog = async (req: any, res: Response) => {
  try {
    const { title, content, excerpt, coverImage, tags } = req.body;

    if (!title || !content || !excerpt) {
      return res
        .status(400)
        .json({ message: "Title, content, and excerpt are required" });
    }

    const slug = generateSlug(title);
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return res
        .status(400)
        .json({ message: "A blog with this title already exists" });
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      tags: tags || [],
      published: false,
    });

    await blog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating blog" });
  }
};

export const updateBlog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, coverImage, tags, published } = req.body;

    let blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (title) {
      blog.title = title;
      blog.slug = generateSlug(title);
    }
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (coverImage) blog.coverImage = coverImage;
    if (tags) blog.tags = tags;

    if (published && !blog.published) {
      blog.published = true;
      blog.publishedAt = new Date();
    }

    await blog.save();

    return res.json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating blog" });
  }
};

export const deleteBlog = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting blog" });
  }
};
