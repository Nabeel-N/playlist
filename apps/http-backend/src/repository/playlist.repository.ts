import prisma from "@repo/db";

export class PlaylistRepository {
  async create(name: string, userId: string) {
    return await prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });
  }

  async findById(id: string) {
    return await prisma.playlist.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return await prisma.playlist.findMany({
      where: { userId },
    });
  }

  async update(id: string, name: string) {
    return await prisma.playlist.update({
      where: { id },
      data: { name },
    });
  }

  async delete(id: string) {
    return await prisma.playlist.delete({
      where: { id },
    });
  }

  
}
