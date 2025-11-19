# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload
- `npm run dev -- --open` - Start dev server and open in browser
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run lint` - Run ESLint and Prettier checks (both linting and formatting validation)

### Package Management
- `npm install` - Install dependencies after cloning or when package.json changes

## Project Architecture

This is a **SvelteKit application** using modern web technologies:

### Tech Stack
- **Framework**: SvelteKit with Svelte 5 (using new runes syntax)
- **Styling**: TailwindCSS 4.x with Vite plugin
- **Build Tool**: Vite
- **Language**: JavaScript with JSConfig for enhanced IDE support
- **Code Quality**: ESLint + Prettier with Svelte-specific plugins
- **Machine Learning**: ML5.js 0.5.0 for image classification with FeatureExtractor

### Project Structure
```
src/
├── lib/            # Shared utilities and components (use $lib alias)
│   ├── assets/     # Static assets like icons
│   └── zodiac.js   # Zodiac sign utilities and data
├── routes/         # SvelteKit file-based routing
│   ├── train/      # ML5 model training page
│   ├── loader/     # ML prediction & loading screen
│   ├── lezgo/      # Results page after prediction
│   ├── +layout.svelte   # Root layout component
│   ├── +page.svelte     # Home page
│   └── layout.css       # Global TailwindCSS imports
└── app.html        # HTML template

static/
├── images/         # Training images organized by zodiac signs
│   ├── aries/      # Aries fridge images
│   ├── taurus/     # Taurus fridge images
│   └── ...         # Other zodiac sign folders
├── models/         # Saved ML5 models
├── dataset.json    # Training dataset configuration
└── robots.txt
```

### Key Conventions
- **Routing**: Uses SvelteKit's file-based routing with `+page.svelte` and `+layout.svelte` conventions
- **Imports**: Use `$lib` alias for importing from `src/lib/`
- **Styling**: TailwindCSS classes, with global styles in `src/routes/layout.css`
- **Svelte 5**: Uses new runes syntax (`$props()`, `{@render children()}`)
- **Configuration**: ESLint config uses flat config format with Svelte-specific rules

### Development Notes
- The project uses SvelteKit's adapter-auto for deployment flexibility
- ESLint configuration includes both browser and Node.js globals
- Prettier and ESLint are configured to work together without conflicts
- TailwindCSS is integrated via Vite plugin for optimal performance

## ML5 Fridge Zodiac Classifier

This application features a unique ML5.js-powered image classifier that predicts zodiac signs based on fridge images.

### ML5 Implementation Details
- **Model**: Uses ML5.js FeatureExtractor with MobileNet backbone
- **Version**: ML5.js 0.5.0 (critical - newer 1.x versions use different API)
- **Training**: Transfer learning on fridge images labeled with zodiac signs
- **Prediction**: Real-time image classification in the browser

### Training Workflow
1. **Data Preparation**: Organize fridge images in `/static/images/{zodiac-sign}/` folders
2. **Dataset Configuration**: Update `/static/dataset.json` with image paths and labels
3. **Training**: Visit `/train` page to train the model using ML5 FeatureExtractor
4. **Model Export**: Download trained model files (model.json + weights)
5. **Deployment**: Place model files in `/static/models/fridge-zodiac/` for prediction use

### Prediction Workflow
1. **Image Upload**: User uploads a fridge photo on the home page
2. **Loader Step**: `/loader` route loads the ML5 model from `/static/models/fridge-zodiac/` and classifies the image
3. **Results**: `/lezgo` displays the predicted zodiac sign, confidence (when available), and personality copy

### Key Files
- `src/routes/train/+page.svelte` - Model training interface
- `src/routes/loader/+page.svelte` - Model loading & prediction
- `src/routes/lezgo/+page.svelte` - Result display interface  
- `src/lib/zodiac.js` - Zodiac sign data and utilities
- `static/dataset.json` - Training dataset configuration
- `static/images/` - Training images organized by zodiac sign
- `static/models/` - Exported ML5 model files

### Development Notes
- ML5.js is loaded dynamically via CDN to avoid SSR issues
- Uses browser environment checks for client-side only functionality
- Image processing handles drag-and-drop and file uploads
- Progress tracking and error handling for training workflow

### Testing
No testing framework is currently configured. Consider adding Vitest or Playwright for future testing needs.
