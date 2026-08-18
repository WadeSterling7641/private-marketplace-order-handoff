import { createServer } from "node:http";
import { ZodError } from "zod";
import { handleHandoffBody } from "./handoff_service.js";

const port = Number(process.env.PORT ?? 3000);

createServer(async (request, response) => {
  if (request.method !== "POST" || request.url !== "/handoffs") {
    response.writeHead(404, { "content-type": "application/json" });
    response.end(JSON.stringify({ error: "Route not found" }));
    return;
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of request) chunks.push(Buffer.from(chunk));
    const result = await handleHandoffBody(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(result));
  } catch (error) {
    const invalidRequest = error instanceof ZodError || error instanceof SyntaxError;
    response.writeHead(invalidRequest ? 400 : 502, { "content-type": "application/json" });
    response.end(JSON.stringify({
      error: invalidRequest ? "Invalid handoff request" : "Handoff generation failed"
    }));
  }
}).listen(port, () => {
  console.log(`Handoff service listening on http://localhost:${port}`);
});
