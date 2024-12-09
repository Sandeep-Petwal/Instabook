const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const authRoutes = express.Router();
const { verify } = require('../middleware/authentication');
const {
    logIn,
} = require("../controller/userController");

const {googleAuth} = require('../controller/googleAuth');

authRoutes.post("/login", asyncHandler(logIn));
authRoutes.post("/verify", verify);


// google auth
authRoutes.post("/auth/google", asyncHandler(googleAuth));

module.exports = authRoutes;