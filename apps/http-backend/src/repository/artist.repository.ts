// src/repository/artist.repository.ts
import prisma from "@repo/db";

export class ArtistRepository {
  
  async findAll() {
    return await prisma.artist.findMany({
      include: {
        songs: true, // Optional: Include their songs too!
        followedBy: false, // Don't include huge list of followers
      },
    });
  }
}
