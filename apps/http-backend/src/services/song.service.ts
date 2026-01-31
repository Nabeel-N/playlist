import { SongRepository } from "../repository/song.repository";
export class SongService {
  private songRepository: SongRepository;

  constructor(songRepository: SongRepository) {
    this.songRepository = songRepository;
  }

  async create(name: string, artist: string, thumbnail: string) {
    return await this.songRepository.create(name, artist, thumbnail);
  }

  async getAll() {
    return await this.songRepository.findAll();
  }
}
