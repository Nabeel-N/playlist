import { PlaylistRepository } from "../repository/playlist.repository";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;

  constructor(playlistRepository: PlaylistRepository) {
    this.playlistRepository = playlistRepository;
  }

  /**
   * Logic to fetch a specific playlist and verify ownership
   */
  async getPlaylistById(id: string, userId: string) {
    // 1. Fetch the playlist using the new repository method that includes songs
    const playlist = await this.playlistRepository.findByIdWithSongs(id);

    // 2. Safety Check: If the playlist doesn't exist or belongs to another user
    if (!playlist || playlist.userId !== userId) {
      return null;
    }

    return playlist;
  }

  /**
   * Logic to fetch all playlists for a user
   */
  async getUserPlaylists(userId: string) {
    return await this.playlistRepository.findByUserId(userId);
  }

  /**
   * Logic to create a new playlist
   */
  async createPlaylist(name: string, userId: string) {
    return await this.playlistRepository.create(name, userId);
  }

  /**
   * Logic to update an existing playlist
   */
  async updatePlaylist(id: string, name: string, userId: string) {
    const playlist = await this.playlistRepository.findById(id);

    if (!playlist || playlist.userId !== userId) return null;

    return await this.playlistRepository.update(id, name);
  }

  /**
   * Logic to delete a playlist
   */
  async deletePlaylist(id: string, userId: string) {
    const playlist = await this.playlistRepository.findById(id);

    if (!playlist || playlist.userId !== userId) return false;

    await this.playlistRepository.delete(id);
    return true;
  }

  async addSongToPlaylist(playlistId: string, songId: string, userId: string) {
    // 1. Verify the playlist exists and belongs to the logged-in user
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist || playlist.userId !== userId) {
      return null; // Deny access
    }

    // 2. Connect the song to the playlist
    return await this.playlistRepository.addSong(playlistId, songId);
  }
}
