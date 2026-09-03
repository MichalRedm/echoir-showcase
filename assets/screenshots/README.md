# Visual Showcase & Screenshot Catalog

This directory hosts high-resolution UI captures and visual feature walkthroughs for **echoir**, captured at 1920×1080 (Desktop) and 390×844 (Mobile) directly from an active production rehearsal ensemble (*Chór Kameralny Harmonia Vocalis*).

---

## 📸 Automated Screenshot Inventory

| Asset | Preview | Feature & User Flow | Key Highlights |
| :--- | :---: | :--- | :--- |
| [`01_repertoire_dual_pane.png`](./01_repertoire_dual_pane.png) | [View](./01_repertoire_dual_pane.png) | **Dual-Pane Repertoire Browser** | 3-column desktop layout, quick search, multi-category tag badges (`SATB`, `Romantyzm`, `Sakralne`), score rendering, voice part badges, and draft programme drawer. |
| [`02_voice_parts_player.png`](./02_voice_parts_player.png) | [View](./02_voice_parts_player.png) | **Multi-Track Voice Part Audio Stems** | Dedicated stem playback pills (`sopran`, `alt`, `tenor`, `bas`, `tutti`), active playback state, duration timeline, and rehearsal scrubbing. |
| [`03_sheet_reader_performance.png`](./03_sheet_reader_performance.png) | [View](./03_sheet_reader_performance.png) | **Performance Sheet Music Reader** | Distraction-free full-screen notation viewer optimized for performance stands and tablets. |
| [`04_programmes_overview.png`](./04_programmes_overview.png) | [View](./04_programmes_overview.png) | **Concert Programmes Catalog** | Published concert setlists (*"Wieczór Pieśni Romantycznych"*, *"Koncert Muzyki Sakralnej"*), numbered song sequences, and instant songbook navigation. |
| [`05_programme_builder_dnd.png`](./05_programme_builder_dnd.png) | [View](./05_programme_builder_dnd.png) | **Interactive Programme Builder** | Drag-and-drop sortable setlist builder powered by `@dnd-kit`, draft persistence, and live repertoire drawer. |
| [`06_choir_dashboard.png`](./06_choir_dashboard.png) | [View](./06_choir_dashboard.png) | **Choir Workspace Dashboard** | Ensemble identity, summary metrics (*"Pieśni 8"*, *"Programy 2"*, *"Członkowie 1"*), cryptographic invite token sharing, and roster management. |
| [`07_score_ingestion_modal.png`](./07_score_ingestion_modal.png) | [View](./07_score_ingestion_modal.png) | **Score Ingestion & Tagging Modal** | Client-side PDF ingestion, multi-page splitting via PDF.js, and categorical tagging interface. |
| [`08_invitation_landing_page.png`](./08_invitation_landing_page.png) | [View](./08_invitation_landing_page.png) | **Public Invitation Landing Page** | Frictionless cryptographic onboarding flow allowing members to inspect choir details and join with one click. |
| [`09_mobile_responsive_shell.png`](./09_mobile_responsive_shell.png) | [View](./09_mobile_responsive_shell.png) | **Mobile Responsive Shell** | Mobile navigation dock, tactile song cards with tag pills, and thumb-friendly floating actions (390×844). |

---

## 🛠️ Automated Capture Protocol

All screenshots are autonomously captured using **Playwright** (`playwright-cli run-code`) with deterministic network idle states, loaded WebFonts (`Plus Jakarta Sans`), and calibrated device viewports.
