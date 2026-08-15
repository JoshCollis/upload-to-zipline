# 3p.rs Share

A Firefox/Chromium extension forked from Upload to Zipline. Clicking its toolbar icon shortens the active HTTP(S) tab with Zipline and immediately copies the returned URL. It also retains right-click media uploads and link shortening.

Based on [jakedev796/upload-to-zipline](https://github.com/jakedev796/upload-to-zipline) and distributed under GPL-3.0.

<p align="center">
  <img src="upload-to-zipline.png" alt="Upload to Zipline options page" width="420" />
</p>

## Features

- Right-click any image, video, or audio → upload to your Zipline instance
- Toolbar icon shortens the current tab and copies the returned URL in one action
- Right-click any link → "Shorten URL with Zipline" (optional)
- Auto-delete uploads after a configurable expiry (1h to 1y)
- Per-upload max view-count limit
- Automatic clipboard copy of returned URLs
- Cross-browser: Chrome and Firefox built from one codebase

## Configuration

1. Open the extension's preferences from the browser's extension manager. If it is not configured yet, the first toolbar click opens preferences automatically.
2. **Request URL** — your Zipline upload endpoint, e.g. `https://your-zipline-instance.com/api/upload`.
3. **Authorization Token** — your personal Zipline auth token.
4. Toggle and configure any of the **Upload Options**: auto-delete expiry, max-views limit.
5. Toggle **Right-click URL shortening** in **Context Menu** if you want the link-shortening menu item.
6. Click **Save Settings**.

After setup, click the extension toolbar icon on any normal HTTP or HTTPS page. The current page is shortened and the result is copied without opening a popup.

> The request URL and auth token can both be copied from your Zipline account's `.sxcu` ShareX export.

## Development

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 8

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev            # Chromium with HMR
pnpm dev:firefox    # Firefox with HMR
```

WXT auto-launches the browser with the extension loaded.

### Build

```bash
pnpm build          # → .output/chrome-mv3/
pnpm build:firefox  # → .output/firefox-mv3/
```

Load `.output/<browser>-mv3/` unpacked in your browser:
- **Chrome:** `chrome://extensions` → enable Developer mode → "Load unpacked" → select `.output/chrome-mv3/`.
- **Firefox:** `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `.output/firefox-mv3/manifest.json`.

### Type check

```bash
pnpm compile
```

### Store-ready zips

```bash
pnpm zip          # → .output/upload-to-zipline-X.Y.Z-chrome.zip
pnpm zip:firefox  # → .output/upload-to-zipline-X.Y.Z-firefox.zip
```

## Architecture

Single source tree at the repo root, built for both browsers via [WXT](https://wxt.dev). Vue 3 + TypeScript for the popup and options surfaces, Tailwind v4 for styling. Background service worker (Chrome) / event page (Firefox) is a single `entrypoints/background.ts`. Settings are stored in `browser.storage.sync` so they roam across signed-in browsers.

```
entrypoints/    # background, popup, options
components/     # SettingsForm, ToggleSwitch, StatusMessage
composables/    # useSettings (typed storage wrapper)
types/          # Settings interface + presets
assets/         # Tailwind entry stylesheet
public/         # static icons
wxt.config.ts   # manifest + browser targets
```

## License

GNU General Public License v3.0 — see [LICENSE](LICENSE).
