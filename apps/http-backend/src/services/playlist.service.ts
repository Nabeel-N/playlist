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

  // ... inside PlaylistService class ...

  async updatePlaylist(playlistId: string, name: string, userId: string) {
    // 1. Check if the playlist belongs to this user
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist || playlist.userId !== userId) {
      return null; // Not found or not authorized
    }

    // 2. Perform the update
    return await this.playlistRepository.update(playlistId, name);
  }

  async deletePlaylist(playlistId: string, userId: string) {
    // 1. Check ownership
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist || playlist.userId !== userId) {
      return false; // Not found or not authorized
    }

    // 2. Perform the delete
    await this.playlistRepository.delete(playlistId);
    return true;
  }
}
