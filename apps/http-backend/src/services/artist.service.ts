import { ArtistRepository } from "../repository/artist.repository";

export class ArtistService {
  private artistRepository: ArtistRepository;

  constructor() {
    this.artistRepository = new ArtistRepository();
  }

  async create(name: string, bio: string, profilePic: string) {
    return await this.artistRepository.create(name, bio, profilePic);
  }

  async getAll() {
    return await this.artistRepository.findAll();
  }
}
