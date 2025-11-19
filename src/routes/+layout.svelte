<script>
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Cosmic Cooler</title>
	<meta name="description" content="fridges don't lie" />
	<meta property="og:title" content="Cosmic Cooler" />
	<meta property="og:description" content="fridges don't lie" />
	<meta property="og:image" content="https://datacraft-seven.vercel.app/og.webp" />
	<meta property="og:url" content="https://datacraft-seven.vercel.app" />
	<meta property="og:type" content="article" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
</svelte:head>

{@render children()}
