import { PlaylistRepository } from "../repository/playlist.repository";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;

  constructor(playlistRepository: PlaylistRepository) {
    this.playlistRepository = playlistRepository;
  }

  async createPlaylist(name: string, userId: string) {
    if (!name || name.trim().length === 0) {
      throw new Error("Playlist name cannot be empty");
    }

    return await this.playlistRepository.create(name, userId);
  }

  async getUserPlaylists(userId: string) {
    return await this.playlistRepository.findByUserId(userId);
  }

  async updatePlaylist(playlistId: string, name: string, userId: string) {
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist || playlist.userId !== userId) {
      return null;
    }

    return await this.playlistRepository.update(playlistId, name);
  }

  async deletePlaylist(playlistId: string, userId: string) {
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist || playlist.userId !== userId) {
      return false;
    }

    await this.playlistRepository.delete(playlistId);
    return true;
  }
}
