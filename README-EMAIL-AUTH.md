MediaTok email/password authentication addition

This version adds independent email/password sign-up and sign-in alongside Discord OAuth. It does not merge accounts, even if an email address matches a Discord account.

EMAIL VERIFICATION AND PASSWORD RESET
- Email verification and password reset are implemented in this package using Resend. They remain unavailable until you configure a verified sending domain, the RESEND_API_KEY secret, and AUTH_FROM_EMAIL.
- See README-EMAIL-VERIFICATION-RESET.md for the step-by-step provider, DNS, migration, and deployment instructions.
- Passwords are stored as PBKDF2-HMAC-SHA-256 hashes (310,000 iterations), never as plaintext.
- Migrations are additive; they do not delete or reset existing D1 data.

DEPLOY
1. Back up the project folder.
2. Confirm Wrangler is authenticated to the Cloudflare account that owns the existing mediatok Worker and D1 database.
3. Apply the additive migration to the existing database:
   npx wrangler d1 migrations apply mediatok --remote
4. Deploy the Worker and assets:
   npx wrangler deploy

If Cloudflare returns error 7403, stop and fix account/token permissions first. Do not recreate or reset D1.

TROUBLESHOOTING EMAIL SIGN-UP / SIGN-IN
- wrangler.jsonc now contains AUTH_FROM_EMAIL and "keep_vars": true. Previously a variable set only in the Cloudflare dashboard was wiped by every `wrangler deploy`, which made verification emails fail with "Email sending is not configured".
- RESEND_API_KEY is a secret and is not touched by deploys. Set it once with: npx wrangler secret put RESEND_API_KEY
- The sender domain in AUTH_FROM_EMAIL must be verified in Resend, or Resend will reject every send.
- To let people sign up and sign in with no verification email, set EMAIL_VERIFICATION_REQUIRED to "false" in wrangler.jsonc and redeploy. Existing unverified accounts can then sign in too. Set it back to "true" once email delivery works.
