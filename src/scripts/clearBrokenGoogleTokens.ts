import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import mongoose from 'mongoose';
import User from '../api/models/User';

async function run() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log('Connected to MongoDB');

  const result = await User.updateMany(
    {
      googleTokens: { $exists: true, $ne: null },
      'googleTokens.refresh_token': { $exists: false },
    },
    { $unset: { googleTokens: '' } }
  );

  console.log(`Cleared broken Google tokens from ${result.modifiedCount} user(s).`);
  console.log('These users will be prompted to reconnect Google on next calendar action.');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
