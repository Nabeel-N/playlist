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

  // Add this inside your SongService class
  async toggleLike(userId: string, songId: string) {
    const existingLike = await this.songRepository.findLikedSong(
      userId,
      songId,
    );

    if (existingLike) {
      await this.songRepository.unlikeSong(userId, songId);
      return { liked: false }; // It was removed
    } else {
      await this.songRepository.likeSong(userId, songId);
      return { liked: true }; // It was added
    }
  }

  // Inside your SongService class:

  async getLikedSongs(userId: string) {
    return await this.songRepository.findLikedSongs(userId);
  }
}
