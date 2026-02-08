// controllers/followedc.controller.ts
import { Request, Response } from "express";
import { FollowedServices } from "../services/followedc.services";

export class FollowedController {
  private followedService: FollowedServices;

  constructor(followedService: FollowedServices) {
    this.followedService = followedService;
  }

  get = async (req: Request, res: Response) => {
    const user = req.user as { id: string } | undefined;

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const libraryContent = await this.followedService.getLibraryContent(
      user.id,
    );
    return res.status(200).json(libraryContent);
  };
}
