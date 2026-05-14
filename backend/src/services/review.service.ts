import Review, { IReview } from "../models/Review";
import Item from "../models/Item";
import User from "../models/User";

export const createReview = async (reviewData: Partial<IReview>): Promise<IReview> => {
  const review = await Review.create(reviewData);

  const ownerReviews = await Review.find({ ownerId: review.ownerId });
  const reviewCount = ownerReviews.length;
  const averageRating =
    reviewCount === 0
      ? 0
      : ownerReviews.reduce((sum, currentReview) => sum + currentReview.rating, 0) / reviewCount;

  const roundedAverage = Number(averageRating.toFixed(1));

  await User.findByIdAndUpdate(review.ownerId, {
    rating: roundedAverage,
    reviewCount,
  });

  await Item.updateMany({ ownerId: review.ownerId }, { ownerRating: roundedAverage });

  return review;
};

export const getReviewsByOwnerId = async (ownerId: string): Promise<IReview[]> => {
  return Review.find({ ownerId }).sort({ createdAt: -1 });
};

export const getReviewsByItemId = async (itemId: string): Promise<IReview[]> => {
  return Review.find({ itemId }).sort({ createdAt: -1 });
};