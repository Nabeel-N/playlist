import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { ArtistController } from "../controllers/artist.controller";

const router = Router();
const artistController = new ArtistController();

router.get("/artist", authMiddleware, artistController.getAll);

export default router;
