import { body, param } from "express-validator";
import User from "./../models/User";

export const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (userDoc) {
        return Promise.reject("E-Mail exists already, please pick a different one.");
      }
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  body("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a name."),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

const VALID_GOALS = ["weight_loss", "muscle_gain", "endurance", "maintenance"];
const VALID_EXPERIENCE = ["beginner", "intermediate", "advanced"];
const VALID_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const workoutSetupValidation = [
  body("gender")
    .trim()
    .notEmpty()
    .withMessage("Gender is required.")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender value."),
  body("age")
    .isInt({ min: 10, max: 120 })
    .withMessage("Age must be between 10 and 120."),
  body("height")
    .isFloat({ min: 50, max: 300 })
    .withMessage("Height must be between 50 and 300 cm."),
  body("weight")
    .isFloat({ min: 20, max: 500 })
    .withMessage("Weight must be between 20 and 500 kg."),
  body("goal")
    .trim()
    .isIn(VALID_GOALS)
    .withMessage("Invalid goal."),
  body("experience")
    .trim()
    .isIn(VALID_EXPERIENCE)
    .withMessage("Invalid experience level."),
  body("trainingDays")
    .isArray({ min: 1 })
    .withMessage("Select at least one training day."),
  body("trainingDays.*")
    .isIn(VALID_DAYS)
    .withMessage("Invalid training day."),
  body("healthNotes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Health notes must be under 500 characters."),
  body("sessionDuration")
    .optional()
    .isInt({ min: 15, max: 180 })
    .withMessage("Session duration must be between 15 and 180 minutes."),
  body("planDurationWeeks")
    .optional()
    .isInt({ min: 1, max: 52 })
    .withMessage("Plan duration must be between 1 and 52 weeks."),
];

export const nutritionSetupValidation = [
  body("goal")
    .trim()
    .isIn(VALID_GOALS)
    .withMessage("Invalid goal."),
  body("weight")
    .isFloat({ min: 20, max: 500 })
    .withMessage("Weight must be between 20 and 500 kg."),
  body("targetWeight")
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage("Target weight must be between 20 and 500 kg."),
  body("activityLevel")
    .optional()
    .trim()
    .isIn(["Sedentary", "Light", "Moderate", "Active", "Very Active"])
    .withMessage("Invalid activity level."),
  body("dietaryRestrictions")
    .optional()
    .isArray()
    .withMessage("Dietary restrictions must be an array."),
  body("dietaryRestrictions.*")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Each dietary restriction must be under 50 characters."),
];

export const profileEditValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),
  body("weight")
    .optional()
    .isFloat({ min: 20, max: 500 })
    .withMessage("Weight must be between 20 and 500 kg."),
  body("goal")
    .optional()
    .trim()
    .isIn(VALID_GOALS)
    .withMessage("Invalid goal."),
];

export const exerciseLogValidation = [
  body("exerciseName")
    .trim()
    .notEmpty()
    .withMessage("Exercise name is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Exercise name must be under 100 characters."),
  body("sets")
    .isArray({ min: 1 })
    .withMessage("At least one set is required."),
  body("sets.*.weight")
    .isFloat({ min: 0, max: 1000 })
    .withMessage("Weight must be between 0 and 1000 kg."),
  body("sets.*.reps")
    .isInt({ min: 1, max: 200 })
    .withMessage("Reps must be between 1 and 200."),
];
