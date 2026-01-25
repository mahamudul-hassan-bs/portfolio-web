import { Request, Response } from "express";
import Experience from "../models/Experience";

export const getAllExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.find().sort({
      order: 1,
      startDate: -1,
    });
    return res.json(experience);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching experience" });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    return res.json(experience);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching experience" });
  }
};

export const createExperience = async (req: any, res: Response) => {
  try {
    const {
      company,
      role,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      description,
      logo,
    } = req.body;

    if (!company || !role || !employmentType || !startDate || !description) {
      return res.status(400).json({
        message:
          "Company, role, employment type, start date, and description are required",
      });
    }

    const experience = new Experience({
      company,
      role,
      employmentType,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      currentlyWorking: currentlyWorking || false,
      description,
      logo: logo || null,
      order: 0,
    });

    await experience.save();

    return res.status(201).json({
      message: "Experience added successfully",
      experience,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error creating experience" });
  }
};

export const updateExperience = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      company,
      role,
      employmentType,
      startDate,
      endDate,
      currentlyWorking,
      description,
      logo,
      order,
    } = req.body;

    let experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (company) experience.company = company;
    if (role) experience.role = role;
    if (employmentType) experience.employmentType = employmentType;
    if (startDate) experience.startDate = new Date(startDate);
    if (endDate !== undefined)
      experience.endDate = endDate ? new Date(endDate) : undefined;
    if (currentlyWorking !== undefined)
      experience.currentlyWorking = currentlyWorking;
    if (description) experience.description = description;
    if (logo !== undefined) experience.logo = logo || null;
    if (order !== undefined) experience.order = order;

    await experience.save();

    return res.json({
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error updating experience" });
  }
};

export const deleteExperience = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    return res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error deleting experience" });
  }
};
