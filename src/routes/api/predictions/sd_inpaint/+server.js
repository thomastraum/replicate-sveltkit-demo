import { json, error } from '@sveltejs/kit';

import { REPLICATE_API_TOKEN } from '$env/static/private';

/** @type {Object} */
let userConnections = {};


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }) {
  try {
    const { prompt } = await request.json();
    console.log('POST:prompt', prompt);

    // call API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Pinned to a specific version of Stable Diffusion
        // See https://replicate.com/stability-ai/stable-diffussion/versions
        version: "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c",
        // This is the text prompt that will be submitted by a form on the frontend
        input: { prompt: prompt },
      }),
    });

    if (response.status !== 201) {
      let error = await response.json();
      return error(500, `api/predictions/sd_inpaint post: ${error.detail}`)
    }
    const prediction = await response.json();

    // I could call the prediction with the ID straight away here and stream the result
    // it will return something instantly, though. I want an event to be emitted when the prediction is ready


    return json(prediction);
  } catch (err) {
    console.error('POST', err);
    return json({ success: false, message: 'POST' });
  }
}
