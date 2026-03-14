import prisma from "@repo/db";

export class PodcastRepository {
  async create(
    name: string,
    profilePic: string,
    genre: string,
    about: string,
    authorId: string,
  ) {
    return await prisma.podcast.create({
      data: {
        name,
        profilePic,
        genre,
        about,
        rating: 0.0,
        authorId,
      },
    });
  }

  async findAll() {
    return await prisma.podcast.findMany();
  }

  async findByUserId(authorId: string) {
    return await prisma.podcast.findMany({
      where: { authorId },
    });
  }
}
