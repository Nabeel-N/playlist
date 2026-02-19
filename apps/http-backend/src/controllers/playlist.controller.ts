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
      console.error(e);
      res.status(500).json({ message: "Error creating playlist" });
    }
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (typeof id !== "string") {
      res.status(400).json({ message: "Invalid Playlist ID" });
      return;
    }

    try {
      const playlist = await this.playlistService.getPlaylistById(id, userId);

      if (!playlist) {
        res.status(404).json({ message: "Playlist not found" });
        return;
      }

      res.status(200).json(playlist);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error fetching specific playlist" });
    }
  };

  /**
   * GET /playlist
   */
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
      console.error(e);
      res.status(500).json({ message: "Error fetching playlists" });
    }
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = (req as any).user?.id;

    if (!name) {
      res.status(400).json({ message: "Playlist name is required" });
      return;
    }

    try {
      const result = await this.playlistService.updatePlaylist(
        id as string,
        name,
        userId,
      );

      if (!result) {
        res
          .status(404)
          .json({ message: "Playlist not found or ownership denied" });
        return;
      }

      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error updating playlist" });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    try {
      const success = await this.playlistService.deletePlaylist(
        id as string,
        userId,
      );

      if (!success) {
        res
          .status(404)
          .json({ message: "Playlist not found or ownership denied" });
        return;
      }

      res.status(200).json({ message: "Playlist deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error deleting playlist" });
    }
  };

  addSong = async (req: Request, res: Response) => {
    const playlistId = req.params.id;
    const { songId } = req.body;
    const userId = (req as any).user?.id; // Assumes authMiddleware sets this

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!songId) {
      res.status(400).json({ message: "songId is required in the body" });
      return;
    }

    try {
      const result = await this.playlistService.addSongToPlaylist(
        playlistId as string,
        songId,
        userId,
      );

      if (!result) {
        res
          .status(404)
          .json({ message: "Playlist not found or ownership denied" });
        return;
      }

      res
        .status(200)
        .json({ message: "Song added successfully", playlist: result });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Error adding song to playlist" });
    }
  };
}
