import { ArtistRepository } from "../repository/artist.repository";

export class ArtistService {
  private artistRepository: ArtistRepository;

  constructor() {
    this.artistRepository = new ArtistRepository();
  }

  async getAll() {
    return await this.artistRepository.findAll();
  }
}
