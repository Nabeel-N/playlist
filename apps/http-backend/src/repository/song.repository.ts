import prisma from "@repo/db";

export class SongRepository {
  async create(name: string, artist: string, thumbnail: string) {
    return await prisma.song.create({
      data: {
        name,
        artist,
        thumbnail,
      },
    });
  }

  async findAll() {
    return await prisma.song.findMany();
  }

  async findById(id: string) {
    return await prisma.song.findUnique({
      where: { id },
    });
  }
}
