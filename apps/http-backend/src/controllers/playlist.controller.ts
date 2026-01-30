import { Request, Response } from "express";
import { PlaylistService } from "../services/playlist.service";

export class PlaylistController {
  private playlistService: PlaylistService;

  constructor(playlistService: PlaylistService) {
    this.playlistService = playlistService;
  }

  create = async (req: Request, res: Response) => {
    const { name } = req.body;
    const userId = (req as any).user?.id;
    console.log(userId);

    if (!name) {
      res.status(400).json({ message: "Playlist name is required" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const result = await this.playlistService.createPlaylist(name, userId);
      res.status(201).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error creating playlist" });
    }
  };

  get = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const playlists = await this.playlistService.getUserPlaylists(userId);
      res.status(200).json({ playlists });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error fetching playlists" });
    }
  };
}
