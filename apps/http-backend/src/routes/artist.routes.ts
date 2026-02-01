import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { ArtistController } from "../controllers/artist.controller";

const router = Router();
const artistController = new ArtistController();

router.get("/", authMiddleware, artistController.getAll);
router.post("/", authMiddleware, artistController.create);

export default router;
