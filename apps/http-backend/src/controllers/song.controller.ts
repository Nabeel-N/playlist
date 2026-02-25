import { Request, Response } from "express";
import { SongService } from "../services/song.service";
import { REPLCommand } from "repl";
export class SongController {
  private songService: SongService;

  constructor(songService: SongService) {
    this.songService = songService;
  }

  create = async (req: Request, res: Response) => {
    const { name, artistId, thumbnail, url } = req.body;

    if (!name || !artistId || !thumbnail || !url) {
      res
        .status(400)
        .json({ message: "Name, artistId, thumbnail, and url are required" });
      return;
    }

    try {
      const song = await this.songService.create(
        name,
        artistId,
        thumbnail,
        url,
      );
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

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Song ID is required" });
      return;
    }

    try {
      const song = await this.songService.getById(id as string);

      if (!song) {
        res.status(404).json({ message: "Song not found" });
        return;
      }

      res.status(200).json(song);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error fetching song by ID" });
    }
  };

  toggleLike = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    if (typeof id !== "string") {
      res.status(400).json({ message: "Invalid song ID" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      // 3. Pass the 'id' variable to your service
      const result = await this.songService.toggleLike(userId, id);
      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error toggling like" });
    }
  };

  // Inside your SongController class:

  getLikedSongs = async (req: Request, res: Response) => {
    // Extract the logged-in user's ID
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const songs = await this.songService.getLikedSongs(userId);
      res.status(200).json({ songs });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error fetching liked songs" });
    }
  };
}
