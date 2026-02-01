import { Request, Response } from "express";
import { ArtistService } from "../services/artist.service";

export class ArtistController {
  private artistService: ArtistService;

  constructor() {
    this.artistService = new ArtistService();
  }

  create = async (req: Request, res: Response) => {
    const { name, bio, profilePic } = req.body;

    // 2. Validation
    if (!name || !bio) {
      res.status(400).json({
        message: "You need to add name and bio to create an Artist",
      });
      return;
    }

    try {
      const artist = await this.artistService.create(name, bio, profilePic);

      res.status(201).json(artist);
    } catch (e) {
      console.log(e);

      res.status(500).json({ message: "Error creating artist" });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const artists = await this.artistService.getAll();
      res.status(200).json({ artists });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error fetching artists" });
    }
  };
}
