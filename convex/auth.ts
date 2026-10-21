import Google from '@auth/core/providers/google';
import { convexAuth } from '@convex-dev/auth/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google({
    profile(profile) {
      if (profile.email_verified !== true) throw new Error('يلزم حساب Google ببريد موثّق');
      return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
    },
  })],
  callbacks: {
    async redirect({ redirectTo }) {
      const allowed = (process.env.APP_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
      const destination = new URL(redirectTo, process.env.SITE_URL);
      if (!allowed.includes(destination.origin)) throw new Error('عنوان العودة غير مسموح');
      return destination.toString();
    },
  },
});
