import { fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {};
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, fetch }) => {

    const data = await request.formData();
    const prompt = data.get('prompt');

    if (!prompt) {
      return fail(400, { prompt, missing: true });
    }

    // console.log('prompt', prompt);
    const response = await fetch('api/predictions/sd_inpaint', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status != 200) {
      return fail(400, { prompt, apierror: `api/predictions/sd_inpaint: ${response.statusText}` })
    } else {
      const prediction = await response.json();
      return { success: true, prediction };
    }

  }
};