import prisma from "@repo/db";
export class EpisodeRepository {
  constructor() {}

  async create(
    title: string,
    duration: number,
    url: string,
    podcastId: string,
  ) {
    return await prisma.episode.create({
      data: {
        title: title,
        duration,
        url,
        podcastId,
      },
    });
  }

  async getEpisode() {
    return prisma.episode.findMany();
  }
}
