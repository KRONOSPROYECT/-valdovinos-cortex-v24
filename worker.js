export default {
  async fetch(request, env) {
    // Tu key guardada segura en Cloudflare, NO en el HTML
    const API_KEY = env.MODEL_API_KEY;

    if (request.method === "POST") {
      const { log } = await request.json();

      const response = await fetch("https://api.meta.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "muse-spark",
          messages: [{
            role: "user",
            content: `Eres auditor KRONOS KRMV V24. Analiza este log Valparaíso->Panamá->Róterdam, detecta desvíos, genera hash SHA-256 y da veredicto para el Comité:\n\n${log}`
          }]
        })
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    return new Response("KRONOS Trust Layer Online");
  }
}