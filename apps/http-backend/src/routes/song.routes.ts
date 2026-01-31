import { Router } from "express";
import { SongController } from "../controllers/song.controller";
import { SongService } from "../services/song.service";
import { SongRepository } from "../repository/song.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const songRepository = new SongRepository();

const songService = new SongService(songRepository);

const songController = new SongController(songService);

router.post("/", authMiddleware, songController.create);
router.get("/", authMiddleware, songController.getAll);

export default router;
