import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import sharp from 'sharp';
import fs from 'fs';
import mongoose from 'mongoose';
import Exercise from '../api/models/Exercise';

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to MongoDB');

  const exercises = await Exercise.find({});
  console.log(`Processing ${exercises.length} exercises...`);

  for (const ex of exercises) {
    const imagePath = path.join(process.cwd(), ex.image);

    if (!fs.existsSync(imagePath)) {
      console.warn(`  SKIP "${ex.name}" — file not found: ${imagePath}`);
      continue;
    }

    const buffer = await sharp(imagePath)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 75 })
      .toBuffer();

    ex.imageBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    await ex.save();
    console.log(`  OK "${ex.name}" — ${(buffer.length / 1024).toFixed(1)} KB`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});