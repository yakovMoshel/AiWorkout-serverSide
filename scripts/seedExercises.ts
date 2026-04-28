import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import mongoose from 'mongoose';
import Exercise from '../src/api/models/Exercise';

const exercises = [
  { name: 'Back Extensions',      image: '/uploads/exercises/Back Extensions.png' },
  { name: 'Barbell Bench Press',  image: '/uploads/exercises/Barbell Bench Press.png' },
  { name: 'Barbell Bent-Over Rows', image: '/uploads/exercises/Barbell Bent-Over Rows.png' },
  { name: 'Barbell Bicep Curls',  image: '/uploads/exercises/Barbell Bicep Curls.png' },
  { name: 'Barbell Deadlifts',    image: '/uploads/exercises/Barbell Deadlifts.png' },
  { name: 'Concentration Curls',  image: '/uploads/exercises/Concentration Curls.png' },
  { name: 'Dumbbell Flyes',       image: '/uploads/exercises/Dumbbell Flyes.png' },
  { name: 'Front Raises',         image: '/uploads/exercises/Front Raises.png' },
  { name: 'Hammer Curls',         image: '/uploads/exercises/Hammer Curls.png' },
  { name: 'Incline Dumbbell Press', image: '/uploads/exercises/Incline Dumbbell Press.png' },
  { name: 'Lat Pulldown',         image: '/uploads/exercises/Lat Pulldown.png' },
  { name: 'Lateral Raises',       image: '/uploads/exercises/Lateral Raises.png' },
  { name: 'Leg Press',            image: '/uploads/exercises/Leg Press.png' },
  { name: 'Standing Calf Raises', image: '/uploads/exercises/Standing Calf Raises.png' },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB\n');

  let inserted = 0;
  let skipped = 0;

  for (const ex of exercises) {
    const result = await Exercise.updateOne(
      { name: { $regex: new RegExp(`^${ex.name}$`, 'i') } },
      { $setOnInsert: ex },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      console.log(`✅ Added: ${ex.name}`);
      inserted++;
    } else {
      console.log(`⏭️  Skipped (already exists): ${ex.name}`);
      skipped++;
    }
  }

  console.log(`\nDone — ${inserted} added, ${skipped} skipped`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
