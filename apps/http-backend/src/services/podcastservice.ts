import { PodcastRepository } from "../repository/podcastrepository";

export class PodcastService {
  private podcastRepository: PodcastRepository;

  constructor() {
    this.podcastRepository = new PodcastRepository();
  }

  async create(
    name: string,
    profilePic: string,
    genre: string,
    about: string,
    authorId: string,
  ) {
    return await this.podcastRepository.create(
      name,
      profilePic,
      genre,
      about,
      authorId,
    );
  }

  async getAll() {
    return await this.podcastRepository.findAll();
  }

  async getMyPodcasts(authorId: string) {
    return await this.podcastRepository.findByUserId(authorId);
  }
}
