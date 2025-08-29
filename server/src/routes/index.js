import express from "express";

import userRoutes from "./user.route.js";
// import BlogRoutes from "./blog.route.js";

const router = express.Router();

router.use("/user", userRoutes);
// router.use("/blog", BlogRoutes);

export default router;

// http://localhost:5000
