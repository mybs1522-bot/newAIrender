# Interior Designer AI — Desktop App

Custom Electron wrapper that fixes Google OAuth in desktop environments.

## How it works
- All `avada.space` pages load inside the app
- Any external URL (e.g. Google OAuth) opens in your real system browser
- The device auth flow transfers your session back to the app automatically

## Development

```bash
npm install
npm start
```

## Build installer

**Windows (.exe):**
```bash
npm run build-win
```

**macOS (.dmg):**
```bash
npm run build-mac
```

Output files are in the `dist/` folder.

## Icons
- Place `icon.ico` (Windows) in this folder before building
- Place `icon.icns` (macOS) in this folder before building
