import { PodcastRepository } from "../repository/podcastrepository";

export class PodcastService {
  private podcastRepository: PodcastRepository;

  constructor() {
    this.podcastRepository = new PodcastRepository();
  }

  async create(name: string, profilePic: string, genre: string, about: string) {
    return await this.podcastRepository.create(name, profilePic, genre, about);
  }

  async getAll() {
    return await this.podcastRepository.findAll();
  }
}
