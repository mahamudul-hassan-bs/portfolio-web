import { Request, Response } from "express";
import Certification from "../models/Certification";

export const getAllCertifications = async (req: Request, res: Response) => {
  try {
    const certifications = await Certification.find({ visible: true }).sort({
      order: 1,
      issueDate: -1,
    });
    return res.json(certifications);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching certifications" });
  }
};

export const getAllCertificationsAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const certifications = await Certification.find().sort({
      order: 1,
      issueDate: -1,
    });
    return res.json(certifications);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching certifications" });
  }
};

export const getCertificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const certification = await Certification.findById(id);

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    return res.json(certification);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error fetching certification" });
  }
};

export const createCertification = async (req: any, res: Response) => {
  try {
    const {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      image,
      description,
      visible,
    } = req.body;

    if (!title || !issuer || !issueDate) {
      return res
        .status(400)
        .json({ message: "Title, issuer, and issue date are required" });
    }

    const certification = new Certification({
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      image,
      description,
      visible: visible !== undefined ? visible : true,
      order: 0,
    });

    await certification.save();

    return res.status(201).json({
      message: "Certification added successfully",
      certification,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error creating certification" });
  }
};

export const updateCertification = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      image,
      description,
      visible,
      order,
    } = req.body;

    let certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    if (title) certification.title = title;
    if (issuer) certification.issuer = issuer;
    if (issueDate) certification.issueDate = issueDate;
    if (expiryDate !== undefined) certification.expiryDate = expiryDate;
    if (credentialId !== undefined) certification.credentialId = credentialId;
    if (credentialUrl !== undefined)
      certification.credentialUrl = credentialUrl;
    if (image !== undefined) certification.image = image;
    if (description !== undefined) certification.description = description;
    if (visible !== undefined) certification.visible = visible;
    if (order !== undefined) certification.order = order;

    await certification.save();

    return res.json({
      message: "Certification updated successfully",
      certification,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error updating certification" });
  }
};

export const deleteCertification = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findByIdAndDelete(id);

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    return res.json({ message: "Certification deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error deleting certification" });
  }
};
