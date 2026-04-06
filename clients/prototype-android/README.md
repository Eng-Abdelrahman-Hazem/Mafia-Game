# Prototype Android APK (WebView Wrapper)

This packages the existing `clients/prototype-web` playable prototype into an Android app so you can produce an APK immediately from Android Studio.

## What this is
- A **semi-ready APK target** for internal testing.
- Uses a WebView to load local files from `app/src/main/assets/www/index.html`.
- Good for quick deployment/testing while Unity client is still in progress.

## 1) Prerequisites
- Android Studio (latest stable)
- Android SDK Platform 34 installed in SDK Manager
- JDK 17 (bundled with Android Studio)

## 2) Open and build in Android Studio
1. Open Android Studio.
2. Click **Open** and select `clients/prototype-android`.
3. Wait for Gradle sync to finish.
4. In top menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. When build completes, click **Locate**.

APK path is typically:
`clients/prototype-android/app/build/outputs/apk/debug/app-debug.apk`

## 3) Install on Android phone
### Option A: USB install
1. Enable Developer options + USB debugging on phone.
2. Connect phone by USB.
3. In Android Studio terminal:
   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

### Option B: Manual transfer
1. Copy `app-debug.apk` to phone.
2. Open file on phone and allow install from unknown apps.

## 4) Update game visuals/mechanics from web prototype
When you change `clients/prototype-web`, resync:
```bash
./clients/prototype-android/scripts/sync-web-assets.sh
```
Then rebuild APK.

## Notes
- This is an internal prototype package, not store-ready.
- For Play Store release later, we need signing config, icons, privacy policy links, and integration with live backend auth/gameplay API.
