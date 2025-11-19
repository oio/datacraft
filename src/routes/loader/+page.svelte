<script>
	import bgImage from '$lib/assets/bg.webp';
	import title from '$lib/assets/title.webp';
	import loader from '$lib/assets/loader.gif';
	import Pill from '$lib/components/Pill.svelte';
	import { goto } from '$app/navigation';

	setTimeout(() => {
		goto('/lezgo');
	}, 3000);
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
			<Pill text="reading fridge data..." />
		</div>
	</div>
</div>
