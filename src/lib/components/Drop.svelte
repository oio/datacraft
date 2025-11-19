<script>
	import { goto } from '$app/navigation';
	import DropIcon from '$lib/assets/DropIcon.svelte';

	let fileInput;
	let dragOver = false;

	function handleClick() {
		fileInput.click();
	}

	function handleFileSelect(event) {
		const file = event.target.files[0];
		if (file && file.type.startsWith('image/')) {
			// Store the image file in sessionStorage as a data URL for the loader
			const reader = new FileReader();
			reader.onload = (e) => {
				sessionStorage.setItem('fridgeImage', e.target.result);
				goto('/loader');
			};
			reader.readAsDataURL(file);
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
		if (files.length > 0 && files[0].type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				sessionStorage.setItem('fridgeImage', e.target.result);
				goto('/loader');
			};
			reader.readAsDataURL(files[0]);
		}
	}
</script>

<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	onchange={handleFileSelect}
	class="hidden"
/>

<div
	onclick={handleClick}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	class="relative container flex h-30 w-2/3 items-center justify-center cursor-pointer transition-all duration-300 {dragOver ? 'scale-105' : 'scale-100'}"
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
