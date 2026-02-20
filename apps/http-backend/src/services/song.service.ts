import { SongRepository } from "../repository/song.repository";
export class SongService {
  private songRepository: SongRepository;

  constructor(songRepository: SongRepository) {
    this.songRepository = songRepository;
  }

  async create(name: string, artistId: string, thumbnail: string, url: string) {
    return await this.songRepository.create(name, artistId, thumbnail, url);
  }

  async getAll() {
    return await this.songRepository.findAll();
  }

  async getById(id: string) {
    return await this.songRepository.findById(id);
  }
}
