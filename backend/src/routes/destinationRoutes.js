import { Router } from "express";
import { deleteDestination } from "../controllers/tripController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.delete("/destinations/:id", authMiddleware, deleteDestination);

export default router;
