import { Router } from "express";
import { PodcastController } from "../controllers/podcast.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const podcastController = new PodcastController();

router.post("/", authMiddleware, podcastController.create);
router.get("/", authMiddleware, podcastController.getAll);

export default router;
