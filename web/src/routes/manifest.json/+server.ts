import { manifest } from '$lib/manifest';

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
