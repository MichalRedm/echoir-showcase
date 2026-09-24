# Echoir Brand Identity & Design System Assets

This directory contains the official brand assets, vector definitions, and high-resolution renders for **echoir**. All assets are deterministically generated from source SVG definitions and a single source of truth geometry configuration.

---

## 1. Brand Concept: "The Singing Score"

The Echoir brand mark synthesizes two foundational choral concepts into a single geometric symbol:
1. **The Open Choral Score**: An open songbook displaying rhythmic staff lines, representing digitized sheet music and collaborative rehearsal literature.
2. **The Treble Clef**: A continuous, flowing treble clef whose central vertical stem serves as the structural spine and hinge of the open score.
3. **Harmonic Voice-Part Spectrum**: The treble clef is rendered in an emerald-to-cyan-to-indigo gradient reflecting the vocal range and polyphony of a four-part choir (SATB).

---

## 2. Color Palette & Harmonic Voice Tokens

| Voice / Role | Token Name | Hex Code | Purpose in UI & Brand |
| :--- | :--- | :--- | :--- |
| **Soprano** | `--brand-soprano` | `#34d399` / `#10b981` | Upper clef crown, active playback states, live audio waveforms, positive indicators |
| **Alto** | `--brand-alto` | `#38bdf8` / `#06b6d4` | Mid clef body, active badges, secondary navigational accents, interactive links |
| **Tenor** | `--brand-tenor` | `#6366f1` / `#4f46e5` | Lower clef root, primary brand buttons, modal borders, focus rings |
| **Bass** | `--brand-bass` | `#1e1b4b` / `#08070d` | Score binding pages, deep tonal dark surfaces, canvas backgrounds |
| **Canvas Dark** | `--surface-canvas` | `#0c0a17` | Root viewport background in tonal dark mode |
| **Surface Card** | `--surface-card` | `#161423` | Raised dashboard panels and modal dialogs |

---

## 3. Brand Asset Inventory

| Asset File | Format | Dimensions | Description & Optimal Usage |
| :--- | :---: | :---: | :--- |
| [`echoir_wordmark.svg`](./echoir_wordmark.svg) | SVG | 800×240 | **Primary Horizontal Lockup (Dark)**: App icon + white typography + English tagline (`DIGITAL CHORAL SONGBOOK`). |
| [`echoir_wordmark_light.svg`](./echoir_wordmark_light.svg) | SVG | 800×240 | **Primary Horizontal Lockup (Light)**: App icon + dark slate typography + English tagline. |
| [`echoir_wordmark.png`](./echoir_wordmark.png) | PNG | 800×240 | Raster render of dark horizontal lockup with alpha transparency. |
| [`echoir_wordmark_light.png`](./echoir_wordmark_light.png) | PNG | 800×240 | Raster render of light horizontal lockup with alpha transparency. |
| [`echoir_wordmark_pl.svg`](./echoir_wordmark_pl.svg) | SVG | 800×240 | Production horizontal lockup with Polish tagline (`CYFROWY ŚPIEWNIK CHÓRALNY`). |
| [`echoir_app_icon.png`](./echoir_app_icon.png) | PNG | 512×512 | High-DPI squircle app icon for mobile launchers, PWA manifests, and social avatars. |
| [`echoir_app_icon.svg`](./echoir_app_icon.svg) | SVG | 512×512 | Vector source for squircle app icon with 112px border radius. |
| [`echoir_mark_dark.svg`](./echoir_mark_dark.svg) | SVG | 512×512 | Standalone mark (clef + score) on transparent background for dark surfaces. |
| [`echoir_mark_light.svg`](./echoir_mark_light.svg) | SVG | 512×512 | Standalone mark on white rounded square for light-themed media. |
| [`echoir_official_brand_showcase.png`](./echoir_official_brand_showcase.png) | PNG | 1280×960 | Full design system overview sheet with component cards, lockups, and scalability tests. |
| [`echoir_social_preview.png`](./echoir_social_preview.png) | PNG | 1200×630 | Open Graph card for GitHub repository previews, social link sharing, and metadata headers. |
| [`echoir_favicon.svg`](./echoir_favicon.svg) | SVG | 512×512 | Tier 1 edge-to-edge scaled favicon mark without squircle for maximum micro-tab clarity. |

---

## 4. Two-Tier Icon Architecture

To solve the visual degradation of complex app icons in 16×16px and 32×32px browser tabs:
- **Tier 1 (Browser Tabs, 16–48px)**: The dark squircle boundary is removed. The core mark is enlarged ~1.46× to reach the canvas edges, and staves/shadows are thickened for maximum contrast and legibility in dense browser tab bars.
- **Tier 2 (High-DPI App Tiles, 180–512px)**: The dark squircle container (`rx="112"`), subtle border stroke, and atmospheric drop shadow are preserved for Apple Touch Icons, Android splash screens, and desktop shortcuts.
