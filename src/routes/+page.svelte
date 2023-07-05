<script>
	import { enhance } from '$app/forms';
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {object} */
	let prediction;
	/** @type {object} */
	let error;
	/** @type {boolean} */
	let loading = false;

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// this can be a webhooks endpoint
	async function pollingForSDImage() {
		while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
			await sleep(1000);
			const response = await fetch(`/api/predictions/sd_inpaint/${prediction.id}`);
			prediction = await response.json();
			if (response.status !== 200) {
				error = prediction.detail;
				return;
			}
			console.log({ prediction });
		}
	}

	/**
	 * @param {import('./$types').ActionData} result
	 */
	async function startPolling(result) {
		// start polling for the image
		if (result?.data?.success) {
			prediction = result.data.prediction;
			console.log('result.data.success', prediction);
			await pollingForSDImage();
		}	
	}

</script>

<main class="flex-grow">
	<div class="container mx-auto py-3">
		<p>
			Dream something with{' '}
			<a href="https://replicate.com/stability-ai/stable-diffusion">stability-ai/stable-diffusion</a
			>:
		</p>

		<form
			class="form"
			method="POST"
			use:enhance={({ formElement, formData, action, cancel, submitter }) => {
				loading = true;
				return async ({ result, update }) => {
					await startPolling(result);
					update();
				};
			}}
		>
			{#if form?.missing}<p class="error">The prompt field is required</p>{/if}
			{#if form?.apierror}<p class="error">{form.apierror}</p>{/if}
			<input
				type="text"
				name="prompt"
				value={form?.prompt ?? ''}
				placeholder="Enter a prompt to render an image"
			/>
			
			<button type="submit">Go!</button>
			{#if form?.success}
				<p>Success!</p>
			{/if}
		</form>

		{#if error}
			<div>{error}</div>
		{/if}

		{#if prediction}
			<div>
				{#if prediction.output}
					<div class="imageWrapper">
						<img
							fill
							src={prediction.output[prediction.output.length - 1]}
							alt="output"
							sizes="100vw"
						/>
					</div>
				{/if}
				<p>status: {prediction.status}</p>
				{#if prediction.status === 'processing'}
					<p>
						<a href={prediction.urls.cancel}>Cancel?</a>
					</p>
				{/if}
			</div>
		{/if}
	</div>
</main>
