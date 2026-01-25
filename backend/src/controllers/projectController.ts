import { Request, Response } from "express";
import Project from "../models/Project";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const featured = req.query.featured === "true";

    let query: any = {};
    if (featured) {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({
      order: 1,
      createdAt: -1,
    });

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching projects" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json(project);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching project" });
  }
};

export const createProject = async (req: any, res: Response) => {
  try {
    const {
      title,
      description,
      shortDescription,
      image,
      techStack,
      githubLink,
      liveLink,
      featured,
    } = req.body;

    if (!title || !description || !shortDescription) {
      return res
        .status(400)
        .json({
          message: "Title, description, and short description are required",
        });
    }

    const project = new Project({
      title,
      description,
      shortDescription,
      image,
      techStack: techStack || [],
      githubLink,
      liveLink,
      featured: featured || false,
      order: 0,
    });

    await project.save();

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating project" });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      shortDescription,
      image,
      techStack,
      githubLink,
      liveLink,
      featured,
      order,
    } = req.body;

    let project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (shortDescription) project.shortDescription = shortDescription;
    if (image) project.image = image;
    if (techStack) project.techStack = techStack;
    if (githubLink) project.githubLink = githubLink;
    if (liveLink) project.liveLink = liveLink;
    if (featured !== undefined) project.featured = featured;
    if (order !== undefined) project.order = order;

    await project.save();

    return res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating project" });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.json({ message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting project" });
  }
};
