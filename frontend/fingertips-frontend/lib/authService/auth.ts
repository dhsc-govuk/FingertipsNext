import NextAuth from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import AzureADB2C from 'next-auth/providers/azure-ad-b2c';
import AzureADProvider from 'next-auth/providers/azure-ad';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    AzureADB2C({
      clientId: process.env.AUTH_AZURE_AD_B2C_CLIENT_ID,
      clientSecret: process.env.AUTH_AZURE_AD_B2C_CLIENT_SECRET,
      issuer: process.env.AUTH_AZURE_AD_B2C_ISSUER,
    }),

    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    }),
  ],
});
