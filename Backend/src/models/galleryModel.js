import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imagen: {
    type: String,
    required: true,
  },
});

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;