"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Review {
  _id: string;
  clientName: string;
  clientTitle?: string;
  clientImage?: string;
  rating: number;
  comment: string;
  featured: boolean;
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(reviews.filter((r) => r._id !== id));
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Client Reviews</h1>
        <Link
          href="/admin/dashboard/reviews/new"
          className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90"
        >
          Add Review
        </Link>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-blue-950/10 backdrop-blur-3xl rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {review.clientImage && (
                    <img
                      src={review.clientImage}
                      alt={review.clientName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-primary">
                      {review.clientName}
                    </h3>
                    {review.clientTitle && (
                      <p className="text-gray-600 text-sm">
                        {review.clientTitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                  </span>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      review.featured
                        ? "bg-green-100/20 text-green-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {review.featured ? "Featured" : "Not Featured"}
                  </span>
                </div>
                <p className="text-gray-300 mt-3">{review.comment}</p>
              </div>
              <div className="space-x-2 ml-4">
                <Link
                  href={`/admin/dashboard/reviews/${review._id}`}
                  className="text-secondary hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
