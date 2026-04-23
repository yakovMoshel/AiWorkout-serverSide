import mongoose from 'mongoose';

const setSchema = new mongoose.Schema(
  { weight: { type: Number, required: true }, reps: { type: Number, required: true } },
  { _id: false }
);

const exerciseLogSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exerciseName: { type: String, required: true },
  sets:         [setSchema],
  date:         { type: Date, default: Date.now },
  pr:           { type: Number, default: 0 },
});

export default mongoose.model('ExerciseLog', exerciseLogSchema);
