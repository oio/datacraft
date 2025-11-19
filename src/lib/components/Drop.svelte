<script>
	import { goto } from '$app/navigation';

	import DropIcon from '$lib/assets/DropIcon.svelte';
</script>

<div
	onclick={() => goto('/loader')}
	class="relative container flex h-30 w-2/3 items-center justify-center"
>
	<div class="w-12">
		<DropIcon />
	</div>
	<div class="absolute -right-8 -bottom-3 -rotate-5">
		<div class="h-full w-full rounded-full bg-ye px-4">
			<p class="text-center font-comic text-lg font-bold text-ulb">drop your fridge</p>
		</div>
	</div>
</div>

<style>
	.container {
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%23FFDD31' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 24px;
	}
</style>
