import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    mainPhoto: {
      type: String, // uploaded image path or URL
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
