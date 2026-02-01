import { Request, Response } from "express";
import { PodcastService } from "../services/podcastservice";

export class PodcastController {
  private podcastService: PodcastService;

  constructor() {
    this.podcastService = new PodcastService();
  }

  create = async (req: Request, res: Response) => {
    const { name, profilePic, genre, about } = req.body;
    if (!name || !profilePic || !genre || !about) {
      res.status(400).json({
        message: "Name, profilePic, genre, and about are required",
      });
      return;
    }

    try {
      const podcast = await this.podcastService.create(
        name,
        profilePic,
        genre,
        about,
      );
      res.status(201).json(podcast);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error creating podcast" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const podcasts = await this.podcastService.getAll();
      res.status(200).json({ podcasts });
    } catch (e) {
      res.status(500).json({ message: "Error fetching podcasts" });
    }
  };
}
