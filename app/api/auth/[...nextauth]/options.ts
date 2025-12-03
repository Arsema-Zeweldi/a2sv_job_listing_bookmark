import GoogleProvider from "next-auth/providers/google";

export const options = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google: ", profile);

        let userRole = "Google User";

        return {
          ...profile,
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_Secret!,
    }),
  ],
};
