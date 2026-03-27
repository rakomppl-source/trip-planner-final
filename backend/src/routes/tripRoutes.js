import { Router } from "express";
import {
  createTrip,
  createTripDestination,
  deleteTrip,
  getTripDestinations,
  getTrips
} from "../controllers/tripController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTrips);
router.post("/", createTrip);
router.delete("/:id", deleteTrip);
router.get("/:id/destinations", getTripDestinations);
router.post("/:id/destinations", createTripDestination);

export default router;
