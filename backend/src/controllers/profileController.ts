import { Request, Response } from "express";
import Profile from "../models/Profile";

export const getProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();

    if (!profile) {
      // Return default profile if none exists
      return res.json({
        name: "Mahamudul Hassan Barshan",
        title: "Full-Stack Developer",
        introduction:
          "Building modern web applications with Next.js and Node.js",
        email: "contact@example.com",
        socialLinks: {},
      });
    }

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching profile" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const {
      name,
      title,
      introduction,
      email,
      phone,
      location,
      socialLinks,
      profileImage,
      resume,
    } = req.body;

    let profile = await Profile.findOne();

    if (!profile) {
      profile = new Profile({
        name,
        title,
        introduction,
        email,
        phone,
        location,
        socialLinks,
        profileImage,
        resume,
      });
    } else {
      if (name) profile.name = name;
      if (title) profile.title = title;
      if (introduction) profile.introduction = introduction;
      if (email) profile.email = email;
      if (phone) profile.phone = phone;
      if (location) profile.location = location;
      if (socialLinks) profile.socialLinks = socialLinks;
      if (profileImage) profile.profileImage = profileImage;
      if (resume) profile.resume = resume;
    }

    await profile.save();

    return res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error updating profile" });
  }
};
