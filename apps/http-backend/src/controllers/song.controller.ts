import { Request, Response } from "express";
import { SongService } from "../services/song.service";
export class SongController {
  private songService: SongService;

  constructor(songService: SongService) {
    this.songService = songService;
  }

  create = async (req: Request, res: Response) => {
    const { name, artist, thumbnail } = req.body;

    if (!name || !artist || !thumbnail) {
      res
        .status(400)
        .json({ message: "Name, artist, and thumbnail are required" });
      return;
    }

    try {
      const song = await this.songService.create(name, artist, thumbnail);
      res.status(201).json(song);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error creating song" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const songs = await this.songService.getAll();
      res.status(200).json({ songs });
    } catch (e) {
      res.status(500).json({ message: "Error fetching songs" });
    }
  };
}
