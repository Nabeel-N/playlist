import { EpisodeRepository } from "../repository/episode.repository";

export class EpisodeServices {
  episoderepo: EpisodeRepository;
  constructor(episoderepo: EpisodeRepository) {
    this.episoderepo = episoderepo;
  }

  async create(
    title: string,
    duration: number,
    url: string,
    podcastId: string,
  ) {
    return await this.episoderepo.create(title, duration, url, podcastId);
  }

  async getAll() {
    return await this.episoderepo.getEpisode();
  }
}
