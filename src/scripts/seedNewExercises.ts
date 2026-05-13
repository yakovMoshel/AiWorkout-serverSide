import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../api/models/Exercise';

dotenv.config();

const newExercises = [
  { name: 'Back Extensions', image: '/uploads/exercises/Back Extensions.png' },
  { name: 'Barbell Bench Press', image: '/uploads/exercises/Barbell Bench Press.png' },
  { name: 'Barbell Bent-Over Rows', image: '/uploads/exercises/Barbell Bent-Over Rows.png' },
  { name: 'Barbell Bicep Curls', image: '/uploads/exercises/Barbell Bicep Curls.png' },
  { name: 'Barbell Deadlifts', image: '/uploads/exercises/Barbell Deadlifts.png' },
  { name: 'Bicycle Crunches', image: '/uploads/exercises/Bicycle Crunches.png' },
  { name: 'Bird Dogs', image: '/uploads/exercises/Bird Dogs.png' },
  { name: 'Bodyweight Squats', image: '/uploads/exercises/Bodyweight Squats.png' },
  { name: 'Bulgarian Split Squats', image: '/uploads/exercises/Bulgarian Split Squats.png' },
  { name: 'Chin-Ups', image: '/uploads/exercises/Chin-Ups.png' },
  { name: 'Concentration Curls', image: '/uploads/exercises/Concentration Curls.png' },
  { name: 'Dumbbell Bicep Curls', image: '/uploads/exercises/Dumbbell Bicep Curls.png' },
  { name: 'Dumbbell Flyes', image: '/uploads/exercises/Dumbbell Flyes.png' },
  { name: 'Dumbbell Row', image: '/uploads/exercises/Dumbbell Row.png' },
  { name: 'Dumbbell Shoulder Press', image: '/uploads/exercises/Dumbbell Shoulder Press.png' },
  { name: 'Dumbbell Tricep Extensions', image: '/uploads/exercises/Dumbbell Tricep Extensions.png' },
  { name: 'Front Raises', image: '/uploads/exercises/Front Raises.png' },
  { name: 'Front Squats', image: '/uploads/exercises/Front Squats.png' },
  { name: 'Glute Bridges', image: '/uploads/exercises/Glute Bridges.png' },
  { name: 'Goblet Squats', image: '/uploads/exercises/Goblet Squats.png' },
  { name: 'Hammer Curls', image: '/uploads/exercises/Hammer Curls.png' },
  { name: 'Incline Dumbbell Press', image: '/uploads/exercises/Incline Dumbbell Press.png' },
  { name: 'Jump Rope', image: '/uploads/exercises/Jump Rope.png' },
  { name: 'Jumping Jacks', image: '/uploads/exercises/Jumping Jacks.png' },
  { name: 'Kettlebell Swings', image: '/uploads/exercises/Kettlebell Swings.png' },
  { name: 'Lat Pulldown', image: '/uploads/exercises/Lat Pulldown.png' },
  { name: 'Lateral Raises', image: '/uploads/exercises/Lateral Raises.png' },
  { name: 'Leg Press', image: '/uploads/exercises/Leg Press.png' },
  { name: 'Leg Raises', image: '/uploads/exercises/Leg Raises.png' },
  { name: 'Mountain Climbers', image: '/uploads/exercises/Mountain Climbers.png' },
  { name: 'Push-Ups', image: '/uploads/exercises/Push-Ups.png' },
  { name: 'Russian Twists', image: '/uploads/exercises/Russian Twists.png' },
  { name: 'Sit-Ups', image: '/uploads/exercises/Sit-Ups.png' },
  { name: 'Standing Calf Raises', image: '/uploads/exercises/Standing Calf Raises.png' },
  { name: 'Step-Ups with Dumbbells', image: '/uploads/exercises/Step-Ups with Dumbbells.png' },
  { name: 'Superman Exercise', image: '/uploads/exercises/Superman Exercise.png' },
  { name: 'Tricep Dips', image: '/uploads/exercises/Tricep Dips.png' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to MongoDB');

  let added = 0;
  let skipped = 0;

  for (const ex of newExercises) {
    const result = await Exercise.updateOne(
      { name: ex.name },
      { $setOnInsert: ex },
      { upsert: true }
    );
    if (result.upsertedCount > 0) {
      console.log(`✓ Added: ${ex.name}`);
      added++;
    } else {
      console.log(`- Skipped (exists): ${ex.name}`);
      skipped++;
    }
  }

  console.log(`\nDone: ${added} added, ${skipped} skipped`);
  await mongoose.disconnect();
}

seed().catch(console.error);
