import prisma from "@repo/db";

export class SongRepository {
  async create(name: string, artistId: string, thumbnail: string, url: string) {
    return await prisma.song.create({
      data: {
        name,
        thumbnail,
        url,
        artistId: artistId,
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
