import { Router } from "express";
import { PlaylistController } from "../controllers/playlist.controller";
import { PlaylistService } from "../services/playlist.service";
import { PlaylistRepository } from "../repository/playlist.repository";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const playlistRepository = new PlaylistRepository();
const playlistService = new PlaylistService(playlistRepository);
const playlistController = new PlaylistController(playlistService);

router.post("/create", authMiddleware, playlistController.create);

export default router;
