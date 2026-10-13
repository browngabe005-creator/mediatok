# MediaTok email verification and password recovery

This update adds verification links and password-reset links for **email/password accounts only**. Discord accounts remain independent; matching email addresses do not merge accounts. The migration is additive and does not reset, recreate, or delete the existing D1 database.

## Email delivery setup (Resend + Cloudflare DNS)

MediaTok sends transactional messages through Resend's HTTPS API from the existing Cloudflare Worker. Follow the current official guide: https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/

1. Create/sign in to a Resend account at https://resend.com/.
2. In Resend, open **Domains** and add `mediatok.org` (or a dedicated sending subdomain if you prefer).
3. Resend will show DNS records such as DKIM, SPF, and DMARC. In Cloudflare, open the `mediatok.org` zone → **DNS** → **Records** and add the records exactly as Resend displays them. Do not delete existing records; add only the required records and resolve any conflicts carefully.
4. Return to Resend and verify the domain. Wait for DNS propagation if it does not verify immediately.
5. In Resend, create an API key with sending permissions for the verified domain. Keep it private; never put it in this ZIP, frontend code, or chat.
6. From a terminal in the extracted project directory, run:

   ```powershell
   npx wrangler secret put RESEND_API_KEY
   ```

   Paste the API key into the hidden terminal prompt. Do not share it.
7. Set the sender address as a Worker variable in Cloudflare **Workers & Pages → mediatok → Settings → Variables and Secrets**:

   `AUTH_FROM_EMAIL = MediaTok <auth@mediatok.org>`

   Use an address on the domain/subdomain you verified with Resend. If you use a different sending subdomain, change the address to match it.

## Apply the database migration and deploy

1. Back up the project folder and keep the existing D1 database.
2. Resolve Cloudflare authorization error 7403 first if it still occurs. Make sure Wrangler is logged into the account that owns the existing `mediatok` database. Do not create a replacement database.
3. Apply the additive migration to the existing remote D1 database:

   ```powershell
   npx wrangler d1 migrations apply mediatok --remote
   ```

4. Deploy:

   ```powershell
   npx wrangler deploy
   ```

5. Test with a mailbox you control: register → open verification email → sign in. Then use **Forgot password?** and complete a reset. Check spam/junk if a message is delayed.

## Behaviour and security notes

- Verification links expire after 24 hours; reset links expire after 1 hour. Both are single-use and only their SHA-256 hashes are stored in D1.
- Passwords use PBKDF2-HMAC-SHA-256 hashing. A successful reset invalidates the account's existing sessions.
- Reset requests return a generic response to avoid confirming whether an email belongs to an account.
- A per-account cooldown limits repeat verification/reset emails. Before a large public launch, add broader IP-based rate limiting and abuse monitoring.
- Existing email accounts created before this migration remain unverified and must use the resend-verification action. Existing Discord accounts are not required to verify through this flow.
- Email verification/reset only works after the sender domain, `RESEND_API_KEY`, and `AUTH_FROM_EMAIL` are correctly configured. This ZIP cannot configure provider accounts or DNS on your behalf.
