<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import bgImage from '$lib/assets/bg.webp';
	import title from '$lib/assets/title.webp';
	import loader from '$lib/assets/loader.gif';
	import Pill from '$lib/components/Pill.svelte';
	import { goto } from '$app/navigation';

	let status = 'Loading ML5...';
	let ml5 = null;
	let classifier = null;

	onMount(async () => {
		if (!browser) return;

		try {
			// Check if we have an uploaded image
			const fridgeImageData = sessionStorage.getItem('fridgeImage');
			if (!fridgeImageData) {
				// No image uploaded, use random selection
				setTimeout(() => {
					sessionStorage.setItem('predictionResult', JSON.stringify({ random: true }));
					goto('/lezgo');
				}, 2000);
				return;
			}

			// Load ML5 and classify the image
			status = 'Loading ML5...';
			const script = document.createElement('script');
			script.src = 'https://unpkg.com/ml5@0.5.0/dist/ml5.min.js';
			document.head.appendChild(script);
			
			await new Promise((resolve) => {
				script.onload = resolve;
			});

			ml5 = window.ml5;
			status = 'Loading trained model...';

			try {
				classifier = await ml5.imageClassifier('/models/fridge-zodiac/model.json');
				status = 'Analyzing your fridge...';

				// Create image element from stored data
				const img = new Image();
				img.onload = async () => {
					try {
						const results = await classifier.classify(img);
						const topPrediction = results[0];
						
						// Store the prediction result
						sessionStorage.setItem('predictionResult', JSON.stringify({
							sign: topPrediction.label,
							confidence: Math.round(topPrediction.confidence * 100),
							allResults: results.map(r => ({
								sign: r.label,
								confidence: Math.round(r.confidence * 100)
							}))
						}));
						
						// Navigate to results
						setTimeout(() => {
							goto('/lezgo');
						}, 1500);
					} catch (error) {
						console.error('Classification error:', error);
						fallbackToRandom();
					}
				};
				img.onerror = () => {
					console.error('Image load error');
					fallbackToRandom();
				};
				img.src = fridgeImageData;

			} catch (error) {
				console.error('Model loading error:', error);
				status = 'Model not found, using cosmic intuition...';
				fallbackToRandom();
			}

		} catch (error) {
			console.error('ML5 loading error:', error);
			fallbackToRandom();
		}
	});

	function fallbackToRandom() {
		setTimeout(() => {
			sessionStorage.setItem('predictionResult', JSON.stringify({ random: true }));
			goto('/lezgo');
		}, 2000);
	}
</script>

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
		<div class="flex w-24 items-center justify-center pt-24">
			<img src={loader} alt="Loader" class="w-full" />
		</div>
		<div class="-rotate-2">
			<Pill text={status} />
		</div>
	</div>
</div>
