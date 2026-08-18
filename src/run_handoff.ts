import { handleHandoffBody } from "./handoff_service.js";

const result = await handleHandoffBody({
  orderId: "order-2048",
  sellerAssets: [
    { name: "deployment-guide.pdf", status: "ready" },
    { name: "license-key.txt", status: "ready" }
  ],
  buyerUpdates: [
    { note: "Use the EU deployment region", accepted: true }
  ]
});

console.log(JSON.stringify(result, null, 2));
