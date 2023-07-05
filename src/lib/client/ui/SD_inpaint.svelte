<script>
	import { onMount } from 'svelte';
	/** @type {string} */
	export let id;
	/** @type {string} */
	export let renders = `/uploads/${id}`;

	/** @type {string} */
	let src = `${renders}/startup.jpg`;

	function subscribe() {
		const sse = new EventSource(`/api/input/sd_inpaint/${id}`);
		console.log('new render', id);
		sse.onmessage = (e) => {
			src = '';
			src = `${renders}/${e.data}?${new Date().getTime()}`;
		};
		return () => sse.close();
	}

	onMount(() => {
		const unsub = subscribe();
		return unsub;
	});
</script>

<pre>{src}</pre>
<img class="h-auto max-w-full" {src} alt="" />
