import prisma from "@repo/db";

export class ArtistRepository {
  async create(name: string, bio: string, profilePic: string) {
    return await prisma.artist.create({
      data: {
        name,
        bio,
        profilePic,
      },
    });
  }
  async findAll() {
    return await prisma.artist.findMany({
      include: {
        songs: true,
        followedBy: false,
      },
    });
  }
}
