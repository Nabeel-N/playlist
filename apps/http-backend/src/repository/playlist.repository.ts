import prisma from "@repo/db";

export class PlaylistRepository {
  /**
   * Creates a new playlist linked to a specific user
   */
  async create(name: string, userId: string) {
    return await prisma.playlist.create({
      data: {
        name,
        userId,
      },
    });
  }

  /**
   * Basic fetch for playlist metadata only
   */
  async findById(id: string) {
    return await prisma.playlist.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch a single playlist AND all associated songs
   * This is used by the Playlist Detail page
   */
  async findByIdWithSongs(id: string) {
    return await prisma.playlist.findUnique({
      where: { id },
      include: {
        songs: true, // Joins the Song table in the response
      },
    });
  }

  /**
   * Fetch all playlists belonging to a specific user
   */
  async findByUserId(userId: string) {
    return await prisma.playlist.findMany({
      where: { userId },
    });
  }

  /**
   * Updates playlist name
   */
  async update(id: string, name: string) {
    return await prisma.playlist.update({
      where: { id },
      data: { name },
    });
  }

  /**
   * Deletes a playlist from the database
   */
  async delete(id: string) {
    return await prisma.playlist.delete({
      where: { id },
    });
  }
}
