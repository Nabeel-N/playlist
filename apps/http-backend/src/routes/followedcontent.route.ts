import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { FollowedRepository } from "../repository/followedc.repository";
import { FollowedServices } from "../services/followedc.services";
import { FollowedController } from "../controllers/followedc.controller";

const router = Router();

const followedRepository = new FollowedRepository();
const followedServices = new FollowedServices(followedRepository);
const followedController = new FollowedController(followedServices);

router.get("/", authMiddleware, followedController.get);

export default router;
