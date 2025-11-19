<script>
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Cosmic Cooler</title>
</svelte:head>

{@render children()}
