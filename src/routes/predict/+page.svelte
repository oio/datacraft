<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let ml5 = null;
  let classifier = null;
  let selectedImage = null;
  let predictions = [];
  let isLoading = false;
  let imagePreview = '';
  let dragOver = false;

  const zodiacDescriptions = {
    aries: "Energetic and bold - this fridge has fire energy!",
    taurus: "Reliable and grounded - a steady companion for your kitchen.",
    gemini: "Versatile and adaptable - this fridge has dual personality.",
    cancer: "Nurturing and protective - perfect for family meals.",
    leo: "Bold and dramatic - this fridge demands attention!",
    virgo: "Organized and precise - everything has its place.",
    libra: "Balanced and elegant - harmony in the kitchen.",
    scorpio: "Mysterious and intense - deep and transformative energy.",
    sagittarius: "Adventurous and spacious - ready for culinary journeys.",
    capricorn: "Structured and reliable - built to last.",
    aquarius: "Innovative and unique - ahead of its time.",
    pisces: "Intuitive and flowing - goes with the flow of your needs."
  };

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
      
      // Try to load the trained model
      try {
        classifier = await ml5.imageClassifier('/models/fridge-zodiac/model.json');
        console.log('Model loaded successfully');
      } catch (error) {
        console.log('No trained model found. Please train a model first.');
      }
    } catch (error) {
      console.error('Error initializing ML5:', error);
    }
  });

  function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      processImageFile(file);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave() {
    dragOver = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    dragOver = false;
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  }

  function processImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target.result;
      const img = new Image();
      img.onload = () => {
        selectedImage = img;
        predictions = [];
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function classifyImage() {
    if (!selectedImage || !classifier) {
      alert('Please select an image and make sure the model is loaded');
      return;
    }

    isLoading = true;
    try {
      const results = await classifier.classify(selectedImage);
      predictions = results.map(result => ({
        sign: result.label,
        confidence: Math.round(result.confidence * 100),
        description: zodiacDescriptions[result.label]
      }));
    } catch (error) {
      console.error('Classification error:', error);
      alert('Error classifying image. Make sure you have a trained model.');
    } finally {
      isLoading = false;
    }
  }

  function getZodiacEmoji(sign) {
    const emojis = {
      aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
      leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
      sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓"
    };
    return emojis[sign] || "⭐";
  }
</script>

<svelte:head>
  <title>Fridge Zodiac Predictor</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
  <div class="mx-auto max-w-4xl">
    <h1 class="mb-6 text-4xl font-bold text-gray-800">
      🥶⭐ Fridge Zodiac Predictor
    </h1>
    
    <div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
      <h2 class="mb-4 text-2xl font-semibold text-gray-700">Upload Your Fridge</h2>
      
      <div
        class="relative rounded-lg border-2 border-dashed p-8 text-center transition-colors {dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300'}"
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        on:drop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          on:change={handleFileSelect}
          class="absolute inset-0 cursor-pointer opacity-0"
        />
        
        {#if imagePreview}
          <img src={imagePreview} alt="Selected fridge" class="mx-auto mb-4 max-h-64 rounded" />
        {:else}
          <div class="text-gray-500">
            <div class="mb-2 text-6xl">📷</div>
            <div>Drop an image here or click to select</div>
          </div>
        {/if}
      </div>

      <button
        on:click={classifyImage}
        disabled={!selectedImage || !classifier || isLoading}
        class="mt-4 w-full rounded bg-purple-500 py-3 font-semibold text-white hover:bg-purple-600 disabled:bg-gray-400"
      >
        {#if isLoading}
          🔮 Consulting the stars...
        {:else}
          🔮 Discover Zodiac Sign
        {/if}
      </button>
    </div>

    {#if predictions.length > 0}
      <div class="mb-6 rounded-lg bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-2xl font-semibold text-gray-700">Zodiac Predictions</h2>
        
        <div class="space-y-4">
          {#each predictions as prediction, i}
            <div class="rounded-lg {i === 0 ? 'bg-gradient-to-r from-purple-100 to-pink-100' : 'bg-gray-50'} p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{getZodiacEmoji(prediction.sign)}</span>
                  <div>
                    <div class="text-lg font-semibold capitalize">{prediction.sign}</div>
                    <div class="text-sm text-gray-600">{prediction.description}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-purple-600">{prediction.confidence}%</div>
                  <div class="text-xs text-gray-500">confidence</div>
                </div>
              </div>
              
              <div class="mt-2">
                <div class="h-2 w-full rounded bg-gray-200">
                  <div 
                    class="h-2 rounded {i === 0 ? 'bg-purple-500' : 'bg-gray-400'} transition-all duration-500"
                    style="width: {prediction.confidence}%"
                  ></div>
                </div>
              </div>
            </div>
          {/each}
        </div>

        {#if predictions[0]}
          <div class="mt-6 rounded-lg bg-yellow-50 p-4">
            <h3 class="mb-2 font-semibold text-yellow-800">
              🌟 Your fridge is most likely a {predictions[0].sign.toUpperCase()}!
            </h3>
            <p class="text-yellow-700">{zodiacDescriptions[predictions[0].sign]}</p>
          </div>
        {/if}
      </div>
    {/if}

    {#if !classifier}
      <div class="rounded-lg bg-red-50 p-4">
        <h3 class="mb-2 font-semibold text-red-800">Model Not Found</h3>
        <p class="text-red-700">
          No trained model found. Please <a href="/train" class="underline">train a model</a> first, 
          then place the generated model files in /static/models/fridge-zodiac/
        </p>
      </div>
    {/if}

    <div class="mt-6 rounded-lg bg-blue-50 p-4">
      <h3 class="mb-2 font-semibold text-blue-800">How it Works</h3>
      <p class="text-blue-700 text-sm">
        This AI model analyzes visual features of your fridge and matches them to zodiac personality traits. 
        Upload a clear photo of your fridge to discover its astrological personality!
      </p>
    </div>
  </div>
</div>