import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  imageBase64: { type: String },
});

export default mongoose.model('Exercise', exerciseSchema);