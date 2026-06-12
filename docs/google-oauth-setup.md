# Google OAuth Setup

TMP already has the application-side Google OAuth flow wired through Supabase:

- Login/register creates one TMP account with buyer sourcing enabled by default.
- `signInWithGoogle` starts Supabase OAuth.
- `/auth/callback` exchanges the auth code and creates the TMP profile.
- Supplier access is added later from `/dashboard/profile`, where the user enters business details and can start the verification subscription.

No Google client secret should be added to this Next.js app or Vercel frontend environment. Google OAuth credentials belong in Supabase Auth provider settings.

## Values To Use Later

Current Supabase project:

```text
https://gkydovzspwnwlyfsmgln.supabase.co
```

Google authorized redirect URI:

```text
https://gkydovzspwnwlyfsmgln.supabase.co/auth/v1/callback
```

Supabase redirect allow list:

```text
http://localhost:3000/auth/callback
https://YOUR_VERCEL_DOMAIN/auth/callback
https://YOUR_PRODUCTION_DOMAIN/auth/callback
```

Replace the Vercel and production domains once they are final.

## Google Cloud Checklist

1. Create a Google Cloud project for TMP.
2. Configure the OAuth consent screen / Google Auth Platform branding.
3. Add authorized domains:
   - `supabase.co`
   - your Vercel domain
   - your production domain once available
4. Create an OAuth client:
   - Application type: Web application
   - Authorized redirect URI: `https://gkydovzspwnwlyfsmgln.supabase.co/auth/v1/callback`
5. Copy the Google Client ID and Client Secret.
6. In Supabase, go to Authentication > Sign In / Providers > Google.
7. Enable Google and paste the Client ID and Client Secret.
8. In Supabase Authentication > URL Configuration, set:
   - Site URL: your production URL when ready
   - Redirect URLs: local, Vercel preview/production, and final domain callback URLs

## Ownership Transfer Notes

Starting from a personal Google account is okay for MVP setup. Later, add the permanent Google account or Google Workspace admin as a project Owner in Google Cloud IAM, then move billing if needed. Once the new account has confirmed access, the original personal account can be downgraded or removed.

For a production company setup, a Google Workspace account is cleaner because ownership, billing, and recovery sit with the business instead of one personal inbox.
