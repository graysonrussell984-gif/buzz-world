export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if the path is /chat and the method is POST
    if (url.pathname === '/chat' && request.method === 'POST') {
      // Your logic here
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'content-type': 'application/json' }
      });
    }

    // Return 404 for any other routes
    return new Response('Not Found', { status: 404 });
  },
};
