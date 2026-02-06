import { Router } from "express";
import { PlaylistController } from "../controllers/playlist.controller";
import { PlaylistService } from "../services/playlist.service";
import { PlaylistRepository } from "../repository/playlist.repository";

const router = Router();
const playlistRepository = new PlaylistRepository();
const playlistService = new PlaylistService(playlistRepository);
const playlistController = new PlaylistController(playlistService);

// Since index.ts already uses app.use("/playlist", ...),
// these paths should be relative to that.

// GET http://localhost:8080/playlist/
router.get("/", playlistController.get);

// POST http://localhost:8080/playlist/
router.post("/", playlistController.create);

// GET http://localhost:8080/playlist/:id
// This matches your frontend fetch call
router.get("/:id", playlistController.getById);

// PUT http://localhost:8080/playlist/:id
router.put("/:id", playlistController.update);

// DELETE http://localhost:8080/playlist/:id
router.delete("/:id", playlistController.delete);

export default router;
