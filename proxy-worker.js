// Cloudflare Worker Script to Proxy Requests and Bypass CORS
// You can deploy this code at https://workers.cloudflare.com/

export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight (OPTIONS) requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow all origins (or change to "https://nizwarax.github.io")
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Api-Key",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. Determine the target URL based on the path
    const url = new URL(request.url);
    const targetBaseUrl = "https://gmail-verify.0b3n954kt1.workers.dev";

    // Create the actual destination URL
    const destinationUrl = `${targetBaseUrl}${url.pathname}${url.search}`;

    // 3. Create a new request to send to the original server
    // We clone the original request to preserve headers (like Authorization, X-Api-Key) and body
    const proxyRequest = new Request(destinationUrl, request);

    // (Optional) We can spoof the Origin header so the original server thinks it's coming from the allowed domain
    proxyRequest.headers.set("Origin", "https://gmailchecker.github.io");

    try {
      // 4. Fetch from the original server
      const response = await fetch(proxyRequest);

      // 5. Create a new response to send back to the client, adding CORS headers
      const proxyResponse = new Response(response.body, response);

      // Allow the frontend to read this response
      proxyResponse.headers.set("Access-Control-Allow-Origin", "*");
      // proxyResponse.headers.set("Access-Control-Allow-Origin", "https://nizwarax.github.io");

      return proxyResponse;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Proxy Error", details: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};
