<script>
	import { fly } from 'svelte/transition';
	import bgImage from '$lib/assets/bg.webp';
	import title from '$lib/assets/title.webp';
	import Pill from '$lib/components/Pill.svelte';
	import fridgy from '$lib/assets/fridgy.webp';
	import { signs } from '$lib';

	// Import all sign components
	import Aries from '$lib/assets/signs/Aries.svelte';
	import Taurus from '$lib/assets/signs/Taurus.svelte';
	import Gemini from '$lib/assets/signs/Gemini.svelte';
	import Cancer from '$lib/assets/signs/Cancer.svelte';
	import Leo from '$lib/assets/signs/Leo.svelte';
	import Virgo from '$lib/assets/signs/Virgo.svelte';
	import Libra from '$lib/assets/signs/Libra.svelte';
	import Scorpio from '$lib/assets/signs/Scorpio.svelte';
	import Saggitarius from '$lib/assets/signs/Saggitarius.svelte';
	import Capricorn from '$lib/assets/signs/Capricorn.svelte';
	import Aquarius from '$lib/assets/signs/Aquarius.svelte';
	import Pisces from '$lib/assets/signs/Pisces.svelte';

	// Map sign names to components
	const signComponents = {
		Aries,
		Taurus,
		Gemini,
		Cancer,
		Leo,
		Virgo,
		Libra,
		Scorpio,
		Sagittarius: Saggitarius,
		Capricorn,
		Aquarius,
		Pisces
	};

	const signKeys = Object.keys(signs);
	const sign = signs[signKeys[Math.floor(Math.random() * signKeys.length)]];
	const SignIcon = signComponents[sign.name];

	let isRight = $state(false);
	let hasClicked = $state(false);
	let selectedSign = $state('');
	let submitted = $state(false);
	let timeHasPassed = $state(false);

	const allSigns = [
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

	function handleSubmit() {
		if (selectedSign) {
			submitted = true;
		}
	}

	setTimeout(() => {
		timeHasPassed = true;
	}, 2000);
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

		<div class="relative h-96 w-7/12 pt-8">
			<img src={fridgy} alt="Fridgy" class="absolute z-0 h-full w-full rounded-3xl object-cover" />
			<div class="relative z-10 flex flex-col items-center justify-center gap-4 pt-9">
				<div class="flex h-24 w-24 items-center justify-center rounded-full bg-ulb">
					<div class="w-12">
						<SignIcon />
					</div>
				</div>
				<Pill
					isBlue
					text={`such ${
						['a', 'e', 'i', 'o', 'u'].includes(sign.name[0].toLowerCase()) ? 'an' : 'a'
					} ${sign.name.toLowerCase()} fridge 💅`}
				/>
				<p class="w-8/12 rounded-3xl bg-ulb px-2 py-2 text-center font-comic text-base text-white">
					{sign.sentences[Math.floor(Math.random() * sign.sentences.length)]}
				</p>
			</div>
		</div>

		{#if timeHasPassed}
			<div
				class="flex flex-col items-center justify-center gap-4 pt-8"
				transition:fly={{ y: -100, duration: 1000 }}
			>
				{#if !hasClicked}
					<p class="text-center font-comic text-lg font-bold text-ye">is this right?</p>
					<div class="flex items-center justify-center gap-4">
						<button
							onclick={() => {
								isRight = true;
								hasClicked = true;
							}}
							class="cursor-pointer"
						>
							<Pill text="yes!" />
						</button>
						<button
							onclick={() => {
								isRight = false;
								hasClicked = true;
							}}
							class="cursor-pointer"
						>
							<Pill text="no :(" />
						</button>
					</div>
				{/if}
				{#if isRight}
					<p class="text-center font-comic text-lg font-bold text-ye">fridge don't lie!</p>
				{/if}
				{#if hasClicked && !isRight && !submitted}
					<p class="text-center font-comic text-lg font-bold text-ye">what's your real sign?</p>
					<div class="flex flex-col items-center justify-center gap-3">
						<select
							value={selectedSign}
							onchange={(e) => (selectedSign = e.target.value)}
							class="w-48 rounded-full border-2 border-ulb bg-ye px-4 py-1 font-comic text-lg font-bold text-ulb focus:ring-2 focus:ring-ulb focus:outline-none"
						>
							<option value="">what's your sign?</option>
							{#each allSigns as signOption}
								<option value={signOption}>{signOption}</option>
							{/each}
						</select>
						<button
							onclick={handleSubmit}
							disabled={!selectedSign}
							class="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Pill text="send!" />
						</button>
					</div>
				{/if}
				{#if submitted}
					<p class="text-center font-comic text-lg font-bold text-ye">
						the fridge appreciates your feedback 🙏
					</p>
				{/if}
			</div>
		{/if}
	</div>
</div>
