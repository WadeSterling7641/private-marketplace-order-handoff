import assert from "node:assert/strict";
import test from "node:test";
import { decideHandoff } from "../src/handoff_policy.js";

test("holds an order until every seller asset is ready", () => {
  const decision = decideHandoff({
    orderId: "order-2048",
    sellerAssets: [
      { name: "deployment-guide.pdf", status: "ready" },
      { name: "license-key.txt", status: "pending" }
    ],
    buyerUpdates: [{ note: "Use the EU deployment region", accepted: true }]
  });

  assert.deepEqual(decision, {
    state: "awaiting_seller_assets",
    pendingAssets: ["license-key.txt"]
  });
});

test("releases a complete and confirmed order for handoff", () => {
  const decision = decideHandoff({
    orderId: "order-2048",
    sellerAssets: [{ name: "deployment-guide.pdf", status: "ready" }],
    buyerUpdates: [{ note: "Use the EU deployment region", accepted: true }]
  });

  assert.deepEqual(decision, { state: "ready_for_handoff" });
});
