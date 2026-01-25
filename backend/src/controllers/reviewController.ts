import { Request, Response } from "express";
import Review from "../models/Review";

export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ featured: true }).sort({ order: 1 });
    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getAllReviewsAdmin = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().sort({ order: 1 });
    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ message: "Failed to fetch review" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { clientName, clientTitle, clientImage, rating, comment, featured } =
      req.body;

    if (!clientName || !comment) {
      return res
        .status(400)
        .json({ message: "Client name and comment are required" });
    }

    const review = new Review({
      clientName,
      clientTitle,
      clientImage,
      rating: rating || 5,
      comment,
      featured: featured !== undefined ? featured : true,
      order: 0,
    });

    await review.save();
    return res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Failed to create review" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { clientName, clientTitle, clientImage, rating, comment, featured } =
      req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (clientName !== undefined) review.clientName = clientName;
    if (clientTitle !== undefined) review.clientTitle = clientTitle;
    if (clientImage !== undefined) review.clientImage = clientImage;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (featured !== undefined) review.featured = featured;

    await review.save();
    return res.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ message: "Failed to update review" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    return res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ message: "Failed to delete review" });
  }
};
