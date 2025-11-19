<script>
	import bgImage from '$lib/assets/bg.webp';
	import title from '$lib/assets/title.webp';
	import ballImg from '$lib/assets/ball.webp';
	import Drop from '$lib/components/Drop.svelte';
</script>

<div class="relative min-h-screen w-full">
	<img
		src={bgImage}
		alt="Background"
		class="absolute top-0 left-0 z-0 h-full w-full object-cover"
	/>

	<div
		class="relative z-10 mx-auto flex h-screen w-2xl flex-col items-center justify-start gap-6 pt-18"
	>
		<div class="relative flex w-md items-center justify-center">
			<img
				src={title}
				alt="Title"
				class="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2"
			/>
			<img src={ballImg} alt="Ball" class="relative z-0 w-2/3" />
		</div>
		<p class="w-2/3 text-center font-comic text-white">
			wef aegrg raeg r wef aegrg raeg r wef aegrg raeg r wef aegrg raeg r wef aegrg raeg r wef aegrg
			raeg r wef aegrg raeg r wef aegrg raeg r wef aegrg raeg r wef aegrg raeg r
		</p>

		<Drop />
	</div>
</div>
