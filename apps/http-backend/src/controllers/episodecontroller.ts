import { EpisodeServices } from "../services/episode.services";
import { Request, Response } from "express";

export class EpisodeController {
  episodeservice: EpisodeServices;
  constructor(episodeservice: EpisodeServices) {
    this.episodeservice = episodeservice;
  }

  create = async (req: Request, res: Response) => {
    const { title, duration, url, podcastId } = req.body;
    if (!title || !duration || !url || !podcastId) {
      res.status(400).json({
        message: "title, duration (seconds), url, and podcastId are required",
      });
      return;
    }

    try {
      const episode = await this.episodeservice.create(
        title,
        duration,
        url,
        podcastId,
      );

      res.status(201).json(episode);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error creating episode" });
    }
  };

  get = async (req: Request, res: Response) => {
    try {
      const episode = await this.episodeservice.getAll();
      return res.status(200).json({
        episode,
      });
    } catch (e) {
      console.error(e);
      throw new Error("error in get method of Episode");
    }
  };
}
