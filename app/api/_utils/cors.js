export function applyCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Or use specific domain
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}