import { Router } from "express";
import { SongController } from "../controllers/song.controller";
import { SongService } from "../services/song.service";
import { SongRepository } from "../repository/song.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const songRepository = new SongRepository();
const songService = new SongService(songRepository);
const songController = new SongController(songService);

// 1. Static/Specific Routes go FIRST
router.post("/", authMiddleware, songController.create);
router.get("/", authMiddleware, songController.getAll);
router.get("/liked", authMiddleware, songController.getLikedSongs);

// 2. Dynamic Routes go LAST
router.get("/:id", authMiddleware, songController.getById);
router.post("/:id/like", authMiddleware, songController.toggleLike);

export default router;
