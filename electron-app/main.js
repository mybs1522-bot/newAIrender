const { app, BrowserWindow, shell, session } = require("electron");
const path = require("path");

const APP_URL = "https://www.avada.space";

// Internal domains that stay inside the app
const INTERNAL = ["avada.space", "www.avada.space"];

function isInternal(url) {
  try {
    return INTERNAL.some((d) => new URL(url).hostname === d);
  } catch {
    return false;
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: "Interior Designer AI",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // Make Google think this is a real Chrome browser
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });

  // ── Override user-agent on all requests from this session ──────────────
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    callback({ requestHeaders: details.requestHeaders });
  });

  // ── Intercept navigation to external URLs (e.g. Google OAuth 302) ──────
  win.webContents.on("will-navigate", (event, url) => {
    if (!isInternal(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // ── Intercept window.open() calls for external URLs ─────────────────────
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!isInternal(url)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  win.loadURL(APP_URL + "/render");
  win.removeMenu();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
