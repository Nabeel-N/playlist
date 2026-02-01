import prisma from "@repo/db";

export class PodcastRepository {
  async create(name: string, profilePic: string, genre: string, about: string) {
    return await prisma.podcast.create({
      data: {
        name,
        profilePic,
        genre,
        about,
        rating: 0.0,
      },
    });
  }

  async findAll() {
    return await prisma.podcast.findMany();
  }
}
