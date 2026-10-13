# MediaTok v39 — profile image + follower badge repair

Based on the complete v38 project.

- Restores the profile photo in the profile header and edit-profile preview. Uses the uploaded avatar URL first, then the linked Discord avatar, and initials only if neither image works.
- Removes the extra follower/following panel that broke the profile header grid.
- Shows just a small, clickable **Followers** count in the role/rank row. The Following counter is not displayed.
- Leaves the follow/unfollow button, following data, forum chat, notification bell, search, Workers and D1 bindings untouched.
- No D1 migrations or data resets required.

## Deploy

Extract the ZIP and run `npm install`, then `npx wrangler deploy` in the extracted project folder targeting your existing mediatok Worker. Do not create a new project or database.

## Check

Visit your own profile and another member's. Ensure the avatar is visible, the row shows the role badge and small Followers button, and there is no Following counter. Resize to a narrow phone width and check the header action buttons do not cover the profile picture. Refresh with Ctrl+Shift+R if using cached assets. View page source and look for `mediatok-ui-build` = `v39-profile-avatar-followers` to confirm the new frontend was deployed. The `/api/health` version remains v38 because this is a frontend-only patch.
