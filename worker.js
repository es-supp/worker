function withCors(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return withCors(new Response(null, { status: 204 }));
      }

      if (request.method === "POST") {
        const data = await request.json();
        const id = Date.now().toString();

        await env.DB.put(id, JSON.stringify(data));

        console.log("Datos:", data);

        return withCors(
          new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" },
          })
        );
      }

      return withCors(new Response("Active worker"));
    } catch (err) {
      console.error(err);
      return withCors(
        new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
  },
};
