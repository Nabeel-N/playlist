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

  async findLikedSong(userId: string, songId: string) {
    return await prisma.likedSong.findUnique({
      where: { userId_songId: { userId, songId } },
    });
  }

  async likeSong(userId: string, songId: string) {
    return await prisma.likedSong.create({
      data: { userId, songId },
    });
  }

  async unlikeSong(userId: string, songId: string) {
    return await prisma.likedSong.delete({
      where: { userId_songId: { userId, songId } },
    });
  }


  async findLikedSongs(userId: string) {
    return await prisma.song.findMany({
      where: {
        likedBy: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }
}
