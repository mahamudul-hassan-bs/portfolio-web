import { Request, Response } from "express";
import Education from "../models/Education";

export const getAllEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.find().sort({ order: 1, startYear: -1 });
    return res.json(education);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching education" });
  }
};

export const getEducationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    return res.json(education);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching education" });
  }
};

export const createEducation = async (req: any, res: Response) => {
  try {
    const {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      currentlyStudying,
      description,
      logo,
    } = req.body;

    if (!institution || !degree || !fieldOfStudy || !startYear) {
      return res.status(400).json({
        message:
          "Institution, degree, field of study, and start year are required",
      });
    }

    const education = new Education({
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      currentlyStudying: currentlyStudying || false,
      description,
      logo: logo || null,
      order: 0,
    });

    await education.save();

    return res.status(201).json({
      message: "Education added successfully",
      education,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error creating education" });
  }
};

export const updateEducation = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      institution,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      currentlyStudying,
      description,
      logo,
      order,
    } = req.body;

    let education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    if (institution) education.institution = institution;
    if (degree) education.degree = degree;
    if (fieldOfStudy) education.fieldOfStudy = fieldOfStudy;
    if (startYear) education.startYear = startYear;
    if (endYear !== undefined) education.endYear = endYear;
    if (currentlyStudying !== undefined)
      education.currentlyStudying = currentlyStudying;
    if (description) education.description = description;
    if (logo !== undefined) education.logo = logo || null;
    if (order !== undefined) education.order = order;

    await education.save();

    return res.json({
      message: "Education updated successfully",
      education,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating education" });
  }
};

export const deleteEducation = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    return res.json({ message: "Education deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error deleting education" });
  }
};
