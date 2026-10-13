# MediaTok mobile and app-store roadmap

## Mobile UX included in this revision

- Six-item mobile navigation includes the Community Forum.
- Safe-area-aware top and bottom spacing for iPhone notches/home indicators.
- More room at the bottom of pages so the fixed navigation does not cover the final controls.
- Better mobile keyboard/modal spacing, touch targets, focus visibility, and landscape behavior.
- Responsive PWA metadata and existing install/service-worker assets are retained.

## Capacitor scaffold

This project now includes `capacitor.config.ts` and helper npm scripts as the first step toward Android and iOS builds. Capacitor supports packaging existing web apps for native platforms: https://capacitorjs.com/docs

From this folder, with Node.js installed:

```sh
npm install
npm run mobile:install
npm run mobile:add-android
# On macOS with Xcode installed:
npm run mobile:add-ios
```

Before running `npx cap sync` or submitting store builds, **the native API/authentication integration must be completed and tested**. The current web app uses same-origin relative `/api/*` and `/auth/*` requests and cookie sessions. A bundled Capacitor app runs on a local WebView origin, so those requests and sign-in redirects need a secure native-compatible API/session strategy and backend origin/CORS validation. Do not publish a native build until login, account recovery, image loading, uploads, community moderation, and account deletion have been verified on real devices.

## Store publishing prerequisites

- Choose/confirm the permanent bundle ID (`org.mediatok.app`) before the first store submission. Changing it later creates a different app identity.
- Create final store-quality icons/screenshots and accurate privacy disclosures.
- Provide a working account-deletion flow if users can create accounts, plus contact/support and moderation/report/block workflows for user-generated community content.
- Test on real iPhones and Android devices, including small screens, landscape, keyboard open, weak network, and offline launch.
- iOS builds require macOS and Xcode; Android builds require Android Studio and an Android SDK. See Capacitor's current environment requirements: https://capacitorjs.com/docs/getting-started/environment-setup

This scaffold is not itself a signed iOS/Android app, and does not mean the app is ready for store review.
