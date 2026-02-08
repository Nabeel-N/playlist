import prisma from "@repo/db";

export class FollowedRepository {
  constructor() {}

  async getUserLibrary(userId: string) {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        playlists: {
          select: {
            id: true,
            name: true,
          },
        },
        followedArtists: {
          select: {
            id: true,
            name: true,
            profilePic: true,
          },
        },
        followedPodcasts: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            genre: true,
          },
        },
      },
    });
  }
}
