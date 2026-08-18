import { z } from "zod";

export const handoffRequestSchema = z.object({
  orderId: z.string().min(1),
  sellerAssets: z.array(z.object({
    name: z.string().min(1),
    status: z.enum(["ready", "pending"])
  })).min(1),
  buyerUpdates: z.array(z.object({
    note: z.string().min(1),
    accepted: z.boolean()
  })).min(1)
});

export type HandoffRequest = z.infer<typeof handoffRequestSchema>;

export type HandoffDecision =
  | { state: "awaiting_seller_assets"; pendingAssets: string[] }
  | { state: "awaiting_buyer_confirmation"; pendingUpdates: string[] }
  | { state: "ready_for_handoff" };

export function decideHandoff(request: HandoffRequest): HandoffDecision {
  const pendingAssets = request.sellerAssets
    .filter((asset) => asset.status === "pending")
    .map((asset) => asset.name);
  if (pendingAssets.length > 0) {
    return { state: "awaiting_seller_assets", pendingAssets };
  }

  const pendingUpdates = request.buyerUpdates
    .filter((update) => !update.accepted)
    .map((update) => update.note);
  if (pendingUpdates.length > 0) {
    return { state: "awaiting_buyer_confirmation", pendingUpdates };
  }

  return { state: "ready_for_handoff" };
}
