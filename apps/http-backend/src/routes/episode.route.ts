import { Router } from "express";
import { EpisodeServices } from "../services/episode.services";
import { EpisodeController } from "../controllers/episodecontroller";
import { EpisodeRepository } from "../repository/episode.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const es = new EpisodeServices(new EpisodeRepository());
const ec = new EpisodeController(es);
const router = Router();

router.post("/", authMiddleware, ec.create);
router.get("/", authMiddleware, ec.get);
export default router;
