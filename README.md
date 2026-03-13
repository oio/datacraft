# Fridge Zodiac

Upload a photo of your fridge and an AI will tell you what zodiac sign it is. Built as a tongue-in-cheek astrology app — "astrology for people who work in spreadsheets."

## How It Works

1. **Upload** a photo of your fridge (or skip to get a random reading)
2. **ML5.js** classifies the image using a MobileNet-based model trained on fridge photos
3. **Get your result** — a zodiac sign, confidence score, personality blurb, and the chance to tell us if we got it right

If no trained model is available, it falls back to random cosmic intuition.

## Tech Stack

- **SvelteKit** (Svelte 5 with runes)
- **TailwindCSS 4**
- **ML5.js 0.5.0** — transfer learning with MobileNet FeatureExtractor
- **Vite**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint + Prettier checks |
| `npm run format` | Auto-format with Prettier |

## Training Your Own Model

1. Add fridge images to `static/images/{zodiac-sign}/` folders
2. Update `static/dataset.json` with image paths and labels
3. Visit `/train` to run transfer learning in the browser
4. Export the model and place files in `static/models/fridge-zodiac/`

## Project Structure

```
src/
├── lib/
│   ├── assets/        # Images, icons, zodiac sign SVGs
│   ├── components/    # Shared UI components (Drop, Pill, etc.)
│   ├── zodiac.js      # Zodiac sign data and utilities
│   └── index.js       # Sign definitions and personality copy
├── routes/
│   ├── +page.svelte        # Home — upload your fridge photo
│   ├── loader/+page.svelte # Loads ML5 model and classifies image
│   ├── lezgo/+page.svelte  # Results page with prediction
│   └── train/+page.svelte  # Model training interface
└── app.html

static/
├── images/    # Training images by zodiac sign
├── models/    # Exported ML5 model files
└── dataset.json
```
