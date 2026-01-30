import prisma from "@repo/db";

export class AuthService {
  // "Upsert" = Update if exists, Insert if new
  async handleGoogleLogin(profile: any) {
    const email = profile.emails?.[0]?.value;
    const googleId = profile.id;
    const name = profile.displayName;
    const avatar = profile.photos?.[0]?.value;

    if (!email) {
      throw new Error("Google profile is missing email");
    }

    const user = await prisma.user.upsert({
      where: {
        email: email,
      },
      update: {
        name: name,
        googleId: googleId,
        avatar: avatar,
      },
      create: {
        email: email,
        googleId: googleId,
        name: name,
        avatar: avatar,
      },
    });

    return user;
  }
}
