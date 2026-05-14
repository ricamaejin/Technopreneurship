import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  itemId: string;
  itemTitle: string;
  reviewerId: string;
  reviewerName: string;
  ownerId: string;
  ownerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    itemId: { type: String, required: true },
    itemTitle: { type: String, required: true },
    reviewerId: { type: String, required: true },
    reviewerName: { type: String, required: true },
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);

export default Review;