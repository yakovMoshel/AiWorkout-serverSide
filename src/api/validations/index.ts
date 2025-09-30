import { body } from "express-validator";
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
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
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

export const loginValidation=[
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom(async (value) => {
      const userDoc = await User.findOne({ email: value });
      if (!userDoc) {
        return Promise.reject("E-Mail not found.");
      }
    })
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
]