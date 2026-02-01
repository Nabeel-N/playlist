import { Request, Response } from "express";
import { ArtistService } from "../services/artist.service";
export class ArtistController {
  private artistService: ArtistService;

  constructor() {
    this.artistService = new ArtistService();
  }

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
