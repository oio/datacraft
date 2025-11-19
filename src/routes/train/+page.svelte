<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const SIGNS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];

  let ml5 = null;
  let featureExtractor = null;
  let classifier = null;
  let dataset = [];
  let logs = [];
  let isTraining = false;
  let canSave = false;
  let progress = '';

  function log(msg) {
    console.log(msg);
    logs = [...logs, `${new Date().toLocaleTimeString()}: ${msg}`];
  }

  onMount(async () => {
    if (!browser) return;

    try {
      // Load ML5 dynamically
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/ml5@0.5.0/dist/ml5.min.js';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });

      ml5 = window.ml5;
      log('ML5 loaded successfully');
      await initModel();
      await loadDataset();
    } catch (error) {
      log(`Error initializing: ${error.message}`);
    }
  });

  async function loadDataset() {
    try {
      const response = await fetch('/dataset.json');
      dataset = await response.json();
      log(`Loaded dataset with ${dataset.length} samples`);
    } catch (error) {
      log(`Error loading dataset: ${error.message}`);
    }
  }

  async function initModel() {
    return new Promise((resolve) => {
      log('Loading MobileNet feature extractor...');
      
      featureExtractor = ml5.featureExtractor('MobileNet', {
        numLabels: SIGNS.length
      }, () => {
        log('MobileNet loaded');
        classifier = featureExtractor.classification();
        log('Classifier created, ready to add images');
        resolve();
      });
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  async function addAllImages() {
    if (!classifier) throw new Error('Classifier not initialized');

    let count = 0;
    for (const sample of dataset) {
      try {
        const img = await loadImage(sample.src);
        await new Promise((resolve, reject) => {
          classifier.addImage(img, sample.label, (err) => {
            if (err) return reject(err);
            count += 1;
            if (count % 5 === 0) {
              progress = `Added ${count}/${dataset.length} images...`;
              log(progress);
            }
            resolve();
          });
        });
      } catch (error) {
        log(`Skipping ${sample.src}: ${error.message}`);
      }
    }

    log(`Finished adding ${count} images`);
  }

  async function startTraining() {
    if (!dataset.length) {
      log('Dataset not loaded yet');
      return;
    }
    if (!classifier) {
      log('Classifier not ready yet');
      return;
    }

    isTraining = true;
    canSave = false;
    log('Adding images to classifier...');
    
    try {
      await addAllImages();
      log('Starting training...');
      
      classifier.train((lossValue) => {
        if (lossValue == null) {
          log('Training finished! ✅');
          isTraining = false;
          canSave = true;
        } else {
          progress = `Training... Loss: ${lossValue.toFixed(4)}`;
          log(progress);
        }
      });
    } catch (error) {
      log(`Training error: ${error.message}`);
      isTraining = false;
    }
  }

  function saveModel() {
    if (classifier && canSave) {
      log('Saving model...');
      classifier.save();
    }
  }
</script>

<svelte:head>
  <title>Fridge → Zodiac Trainer</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
  <div class="mx-auto max-w-4xl">
    <h1 class="mb-6 text-4xl font-bold text-gray-800">
      🥶 → ⭐ Fridge to Zodiac Trainer
    </h1>
    
    <div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Training Controls</h2>
      
      <div class="flex gap-4">
        <button
          on:click={startTraining}
          disabled={isTraining || !ml5}
          class="rounded bg-blue-500 px-6 py-2 font-semibold text-white hover:bg-blue-600 disabled:bg-gray-400"
        >
          {#if isTraining}
            Training...
          {:else}
            Train Model
          {/if}
        </button>

        <button
          on:click={saveModel}
          disabled={!canSave}
          class="rounded bg-green-500 px-6 py-2 font-semibold text-white hover:bg-green-600 disabled:bg-gray-400"
        >
          Save Model
        </button>
      </div>

      {#if progress}
        <div class="mt-4">
          <div class="text-sm text-gray-600">{progress}</div>
          {#if isTraining}
            <div class="mt-2 h-2 w-full rounded bg-gray-200">
              <div class="h-2 rounded bg-blue-500 transition-all duration-300" style="width: {Math.random() * 100}%"></div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Dataset Info</h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {#each SIGNS as sign}
          <div class="rounded bg-gray-100 p-3 text-center">
            <div class="text-lg font-medium capitalize">{sign}</div>
            <div class="text-sm text-gray-600">
              {dataset.filter(item => item.label === sign).length} images
            </div>
          </div>
        {/each}
      </div>
      <div class="mt-4 text-sm text-gray-600">
        Total: {dataset.length} training images
      </div>
    </div>

    <div class="rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Training Log</h2>
      <div class="h-64 overflow-y-auto rounded bg-gray-50 p-4">
        {#each logs as logEntry}
          <div class="mb-1 font-mono text-sm">{logEntry}</div>
        {/each}
        {#if logs.length === 0}
          <div class="text-gray-500">Waiting to start training...</div>
        {/if}
      </div>
    </div>

    <div class="mt-6 rounded-lg bg-yellow-50 p-4">
      <h3 class="mb-2 font-semibold text-yellow-800">Instructions:</h3>
      <ol class="space-y-1 text-sm text-yellow-700">
        <li>1. Add fridge images to /static/images/{'{sign}'}/</li>
        <li>2. Update /static/dataset.json with your image paths</li>
        <li>3. Click "Train Model" to start training</li>
        <li>4. Once training finishes, click "Save Model" to download the trained model</li>
        <li>5. Move the downloaded files to /static/models/ for use in the prediction page</li>
      </ol>
    </div>
  </div>
</div>