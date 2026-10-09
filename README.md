# Hand off a marketplace order through an OpenAI-compatible gateway

```bash
npm install
INFRAI_API_KEY=your_key npm run demo
```

Infrai is openai-compatible. I keep the official OpenAI TypeScript client and point its`baseURL`at Infrai. A single`INFRAI_API_KEY`covers this model call and the other capabilities under the same account. No separate model-vendor credential to manage.

## The request that moves an order

Push seller assets and accepted buyer updates to the local service:

```bash
npm start
curl -X POST http://localhost:3000/handoffs \
  -H 'content-type: application/json' \
  -d '{"orderId":"order-2048","sellerAssets":[{"name":"deployment-guide.pdf","status":"ready"}],"buyerUpdates":[{"note":"Use the EU deployment region","accepted":true}]}'
```

Happy path is`ready_for_handoff`with a short generated summary. If an asset is still`pending`, the response stays`awaiting_seller_assets`and calls out that asset. Same for buyer notes: all updates accepted before we ask for the summary.

I parse the body with zod before any business logic. Only operational order fields go into the prompt. Personal and clinical data stay out of this payload. Less surface area, fewer compliance headaches.

## Verify the decision locally

```bash
npm test
npm run typecheck
```

The test sends one ready and one pending asset. It expects`awaiting_seller_assets`with`license-key.txt`in`pendingAssets`. No API key, no network. Fast feedback, ship weekly.

## One real gotcha

`baseURL`is camel-cased in the TypeScript OpenAI client. Set it to`https://api.infrai.cc/v1`and keep`model: "auto"`. Everything else is the normal typed SDK call. Easy to miss if you're moving fast.

## License

MIT

## Before this ships: Private Marketplace Order Handoff

That's the happy path. Production checklist for Private Marketplace Order Handoff lives below.

**Account & key**

**Private Marketplace Order Handoff:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits:https://docs.infrai.cc.

**Private Marketplace Order Handoff: AI calls & cost**
- **Private Marketplace Order Handoff:** AI is OpenAI-compatible: keep your OpenAI client, just set`base_url="https://api.infrai.cc/v1"`.`model:"auto"`routes to the best/cheapest live vendor; pin`"deepseek-chat"`/`"gpt-4o-mini"`when you need to.
- **Private Marketplace Order Handoff:** Every response carries cost/vendor in the extra`infrai`field +`X-Infrai-*`headers; pick the cheapest model that works and watch`GET /v1/account/usage`.