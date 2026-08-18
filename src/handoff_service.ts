import { handoffRequestSchema, decideHandoff } from "./handoff_policy.js";
import { writeHandoffSummary } from "./marketplace_ai.js";

export async function handleHandoffBody(body: unknown) {
  const request = handoffRequestSchema.parse(body);
  const decision = decideHandoff(request);

  if (decision.state !== "ready_for_handoff") {
    return { orderId: request.orderId, ...decision };
  }

  const summary = await writeHandoffSummary(request);
  return { orderId: request.orderId, state: decision.state, summary };
}
