import { Request, Response } from "express";
import Tag from "../models/Tag";

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    return res.json({ tags: tags.map((t) => t.name) });
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching tags" });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const tagName = name.trim().toLowerCase();

    // Check if tag already exists
    let tag = await Tag.findOne({ name: tagName });
    if (tag) {
      return res.json({ tag: tag.name, message: "Tag already exists" });
    }

    // Create new tag
    tag = new Tag({ name: tagName });
    await tag.save();

    return res
      .status(201)
      .json({ tag: tag.name, message: "Tag created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating tag" });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tagName = name.toLowerCase();

    const tag = await Tag.findOneAndDelete({ name: tagName });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting tag" });
  }
};
