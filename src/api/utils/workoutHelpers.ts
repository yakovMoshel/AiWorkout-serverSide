/**
 * Helper functions for managing workout events in Google Calendar
 */

/**
 * Finds the next occurrence of a specific day of the week
 * @param baseDate - Start date
 * @param targetDay - Target day (0-6, where 0 = Sunday)
 * @param hour - Workout time (default: 9:00)
 * @param minute - Workout time (default: 0 minutes)
 */
export function getNextDayOfWeek(
  baseDate: Date, 
  targetDay: number, 
  hour: number = 9, 
  minute: number = 0
): Date {
  const result = new Date(baseDate);
  const currentDay = result.getDay();
  
  let daysToAdd = targetDay - currentDay;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }
  
  result.setDate(result.getDate() + daysToAdd);
  result.setHours(hour, minute, 0, 0); 
  
  return result;
}


/**
 * Creates a detailed workout description for a calendar event
 * @param exercises - List of exercises in the workout
 */
export function formatWorkoutDescription(exercises: any[]): string {
  let description = '🏋️‍♂️ Today\'s Workout:\n\n';
  
  exercises.forEach((exercise, index) => {
    description += `${index + 1}. ${exercise.name}\n`;
    description += `   📊 ${exercise.sets}\n`;
    description += `   🔄 ${exercise.repetitions}\n`;
    description += `   ⏱️ ${exercise.duration}\n`;
    description += `   🛠️ ${exercise.equipment}\n\n`;
  });
  
  description += '💡 Tips:\n';
  description += '• Warm up for 5-10 minutes before starting\n';
  description += '• Stay hydrated throughout your workout\n';
  description += '• Focus on proper form over heavy weights\n';
  description += '• Cool down and stretch after finishing\n';
  
  return description;
}

/**
 * Calculates total workout duration (including warm-up and cool-down)
 * @param exercises - List of exercises
 */
export function calculateTotalDuration(exercises: any[]): number {
  let totalMinutes = 15; // Warm-up
  
  exercises.forEach(exercise => {
    const duration = exercise.duration || '15 minutes';
    const minutes = parseInt(duration.match(/\d+/)?.[0] || '15');
    totalMinutes += minutes;
  });
  
  totalMinutes += 10; // Cool-down
  return totalMinutes;
}

/**
 * Identifies the focus area of the workout based on the first exercise
 * @param exercises - List of exercises
 */
export function getFocusArea(exercises: any[]): string {
  const firstExercise = exercises[0]?.name.toLowerCase() || '';
  
  if (firstExercise.includes('bench') || (firstExercise.includes('press') && firstExercise.includes('chest'))) {
    return 'Chest & Upper Body';
  } else if (firstExercise.includes('squat') || firstExercise.includes('leg')) {
    return 'Legs';
  } else if (firstExercise.includes('deadlift') || firstExercise.includes('back')) {
    return 'Back & Core';
  } else if (firstExercise.includes('shoulder') || firstExercise.includes('arm')) {
    return 'Arms & Shoulders';
  }
  
  return 'Full Body';
}

/**
 * Mapping of abbreviated day names to full English names
 */
export const dayMapping: { [key: string]: string } = {
  'Sun': 'Sunday',
  'Mon': 'Monday',
  'Tue': 'Tuesday',
  'Wed': 'Wednesday',
  'Thu': 'Thursday',
  'Fri': 'Friday',
  'Sat': 'Saturday',
};

/**
 * Mapping of day names to numbers (0 = Sunday)
 */
export const dayToNumber: { [key: string]: number } = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
};

/**
 * Mapping of days to RRULE format (for recurring events)
 */
export const dayToRRule: { [key: string]: string } = {
  'Sun': 'SU',
  'Mon': 'MO',
  'Tue': 'TU',
  'Wed': 'WE',
  'Thu': 'TH',
  'Fri': 'FR',
  'Sat': 'SA'
};