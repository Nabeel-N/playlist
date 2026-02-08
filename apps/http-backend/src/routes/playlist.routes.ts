import { Router } from "express";
import { PlaylistController } from "../controllers/playlist.controller";
import { PlaylistService } from "../services/playlist.service";
import { PlaylistRepository } from "../repository/playlist.repository";

const router = Router();
const playlistRepository = new PlaylistRepository();
const playlistService = new PlaylistService(playlistRepository);
const playlistController = new PlaylistController(playlistService);

router.get("/", playlistController.get);

router.post("/", playlistController.create);

router.get("/:id", playlistController.getById);

router.put("/:id", playlistController.update);

router.delete("/:id", playlistController.delete);

export default router;
