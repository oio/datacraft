<script>
	let { text, isBlue } = $props();
</script>

<div class="rounded-full {isBlue ? 'bg-ulb' : 'bg-ye'} px-3 py-0">
	<p class="text-center font-comic text-lg font-bold {isBlue ? 'text-white' : 'text-ulb'}">
		{text}
	</p>
</div>
