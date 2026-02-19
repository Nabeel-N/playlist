import { FollowedRepository } from "../repository/followedc.repository";

export class FollowedServices {
  private followedRepository: FollowedRepository;

  constructor(followedrepo: FollowedRepository) {
    this.followedRepository = followedrepo;
  }

  async getLibraryContent(userId: string) {
    const data = await this.followedRepository.getUserLibrary(userId);

    if (!data) {
      return [];
    }

    const library = [
      ...data.playlists.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        type: "Playlist",
      })),
      ...data.followedArtists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.profilePic,
        type: "Artist",
        subtitle: "Artist",
      })),
      ...data.followedPodcasts.map((podcast) => ({
        id: podcast.id,
        name: podcast.name,
        image: podcast.profilePic,
        type: "Podcast",
        subtitle: "Podcast • " + podcast.genre,
      })),
    ];

    return library;
  }
}
