import { Request, Response } from "express";
import Skill from "../models/Skill";

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string;

    let query: any = { visible: true };
    if (category) {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ order: 1, name: 1 });

    return res.json(skills);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching skills" });
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json(skill);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching skill" });
  }
};

export const createSkill = async (req: any, res: Response) => {
  try {
    const { name, category, level, icon, visible } = req.body;

    if (!name || !category || level === undefined) {
      return res
        .status(400)
        .json({ message: "Name, category, and level are required" });
    }

    if (level < 0 || level > 100) {
      return res
        .status(400)
        .json({ message: "Level must be between 0 and 100" });
    }

    const skill = new Skill({
      name,
      category,
      level,
      icon,
      visible: visible !== false,
      order: 0,
    });

    await skill.save();

    return res.status(201).json({
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating skill" });
  }
};

export const updateSkill = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, level, icon, visible, order } = req.body;

    let skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (level !== undefined) {
      if (level < 0 || level > 100) {
        return res
          .status(400)
          .json({ message: "Level must be between 0 and 100" });
      }
      skill.level = level;
    }
    if (icon) skill.icon = icon;
    if (visible !== undefined) skill.visible = visible;
    if (order !== undefined) skill.order = order;

    await skill.save();

    return res.json({
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating skill" });
  }
};

export const deleteSkill = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    return res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting skill" });
  }
};
