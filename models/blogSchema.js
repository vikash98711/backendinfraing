import mongoose from 'mongoose';

// Define Blog Schema
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  descriptionImage: {
    type: String,
    required: false,  // Optional: Can be null if not uploaded
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

// Create and export the model
const Blog = mongoose.model('Blog', BlogSchema);
export default Blog;
