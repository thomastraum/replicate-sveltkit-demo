import { json, error } from '@sveltejs/kit';
import { REPLICATE_API_TOKEN } from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export const GET = async ({ params, url, locals, route }) => {

  const id = params.id;
  // console.log('GET:id', id);

  const response = await fetch(
    `https://api.replicate.com/v1/predictions/${id}`,
    {
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    let error = await response.json();
    return error(500, `api/predictions/sd_inpaint post: ${error.detail}`)
  }

  const prediction = await response.json();
  console.log('GET:prediction status', prediction.status);
  return json(prediction);

};