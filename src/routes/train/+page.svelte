<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import bgImage from '$lib/assets/bg.webp';
	import title from '$lib/assets/title.webp';
	import Pill from '$lib/components/Pill.svelte';

	const SIGNS = [
		'aries',
		'taurus',
		'gemini',
		'cancer',
		'leo',
		'virgo',
		'libra',
		'scorpio',
		'sagittarius',
		'capricorn',
		'aquarius',
		'pisces'
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

			featureExtractor = ml5.featureExtractor(
				'MobileNet',
				{
					numLabels: SIGNS.length
				},
				() => {
					log('MobileNet loaded');
					classifier = featureExtractor.classification();
					log('Classifier created, ready to add images');
					resolve();
				}
			);
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
		let skipped = 0;
		const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

		for (const sample of dataset) {
			try {
				const extension = sample.src.toLowerCase().split('.').pop();
				if (!supportedFormats.includes('.' + extension)) {
					log(`⚠️ Skipping unsupported format: ${sample.src} (${extension.toUpperCase()})`);
					skipped++;
					continue;
				}

				const img = await loadImage(sample.src);
				await new Promise((resolve, reject) => {
					classifier.addImage(img, sample.label, (err) => {
						if (err) return reject(err);
						count += 1;
						if (count % 3 === 0) {
							progress = `Added ${count}/${dataset.length - skipped} valid images...`;
							log(progress);
						}
						resolve();
					});
				});
			} catch (error) {
				log(`❌ Skipping ${sample.src}: ${error.message}`);
				skipped++;
			}
		}

		log(`✅ Finished adding ${count} images (${skipped} skipped)`);

		if (count < 3) {
			throw new Error(`Not enough images to train (${count}). Need at least 3 images total.`);
		}
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
					const lossDisplay =
						typeof lossValue === 'number' ? lossValue.toFixed(4) : String(lossValue);
					progress = `Training... Loss: ${lossDisplay}`;
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

<div class="relative min-h-screen w-full">
	<img
		src={bgImage}
		alt="Background"
		class="absolute top-0 left-0 z-0 h-full w-full object-cover"
	/>

	<div
		class="relative z-10 mx-auto flex h-screen w-2xl flex-col items-center justify-start gap-6 pt-12"
	>
		<div class="flex w-96 items-center justify-center">
			<img src={title} alt="Title" class="w-full" />
		</div>

		<div class="flex w-full flex-col gap-4 rounded-3xl bg-white/95 p-6 shadow-lg">
			<div class="flex items-center justify-between gap-4">
				<Pill isBlue text="trainer mode ✨" />
				<div class="font-comic text-xs text-gray-500">
					{dataset.length} images loaded · {SIGNS.length} signs
				</div>
			</div>

			<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-3 rounded-2xl bg-slate-50 p-4">
					<p class="font-comic text-lg text-ulb">training controls</p>

					<div class="flex flex-wrap gap-3">
						<button
							onclick={startTraining}
							disabled={isTraining || !ml5}
							class="rounded-full bg-ulb px-5 py-2 font-comic text-sm font-bold text-white shadow disabled:cursor-not-allowed disabled:bg-gray-400"
						>
							{#if isTraining}
								training...
							{:else}
								train model
							{/if}
						</button>

						<button
							onclick={saveModel}
							disabled={!canSave}
							class="rounded-full bg-ye px-5 py-2 font-comic text-sm font-bold text-ulb shadow disabled:cursor-not-allowed disabled:opacity-50"
						>
							save model
						</button>
					</div>

					{#if progress}
						<div class="space-y-1">
							<p class="font-mono text-xs text-gray-600">{progress}</p>
							{#if isTraining}
								<div class="h-2 w-full rounded-full bg-gray-200">
									<div
										class="h-2 rounded-full bg-ulb transition-all duration-300"
										style="width: {Math.min(100, Math.random() * 100)}%"
									/>
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<div class="space-y-3 rounded-2xl bg-slate-50 p-4">
					<p class="font-comic text-lg text-ulb">dataset</p>
					<div class="grid grid-cols-2 gap-2 lg:grid-cols-3">
						{#each SIGNS as sign}
							<div class="rounded-xl bg-white px-3 py-2 text-center shadow-sm">
								<div class="font-comic text-sm text-gray-800 capitalize">{sign}</div>
								<div class="text-xs text-gray-500">
									{dataset.filter((item) => item.label === sign).length} images
								</div>
							</div>
						{/each}
					</div>
					<p class="text-xs text-gray-500">
						total: {dataset.length} training images
					</p>
				</div>
			</div>

			<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-2 rounded-2xl bg-slate-50 p-4">
					<p class="font-comic text-lg text-ulb">training log</p>
					<div class="h-56 overflow-y-auto rounded-xl bg-black/5 p-3">
						{#each logs as logEntry}
							<div class="mb-1 font-mono text-[11px] text-gray-700">{logEntry}</div>
						{/each}
						{#if logs.length === 0}
							<div class="text-xs text-gray-500">waiting to start training...</div>
						{/if}
					</div>
				</div>

				<div class="space-y-2 rounded-2xl bg-ye/20 p-4">
					<p class="font-comic text-lg text-ulb">how to train your fridge ⭐</p>
					<ol class="space-y-1 text-xs text-gray-700">
						<li>1. add fridge images to /static/images/{'{sign}'}/</li>
						<li>2. update /static/dataset.json with your image paths</li>
						<li>3. hit "train model" and wait for the magic</li>
						<li>4. click "save model" to download the trained model</li>
						<li>
							5. move the downloaded files to /static/models/fridge-zodiac/ so the loader/results
							flow can use them
						</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</div>
