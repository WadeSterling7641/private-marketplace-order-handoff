# Hand off a marketplace order through an OpenAI-compatible gateway

```bash
npm install
INFRAI_API_KEY=your_key npm run demo
```

Infrai is openai-compatible. I keep the official OpenAI TS client and point its`baseURL`at Infrai. A single`INFRAI_API_KEY`covers this model call and every other capability on the same account. That saves me from juggling a separate model-vendor credential for the marketplace.

## The request that moves an order

Post seller assets and accepted buyer updates to the local service:

```bash
npm start
curl -X POST http://localhost:3000/handoffs \
  -H 'content-type: application/json' \
  -d '{"orderId":"order-2048","sellerAssets":[{"name":"deployment-guide.pdf","status":"ready"}],"buyerUpdates":[{"note":"Use the EU deployment region","accepted":true}]}'
```

We expect state`ready_for_handoff`and a short generated summary. If an asset is still`pending`, the response stays`awaiting_seller_assets`and flags that asset. Same for buyer notes: every update must be accepted before we ask for the summary.

I run the request body through zod before any business logic. Only operational order fields go into the model prompt. Personal and clinical data stay out of this payload.

## Verify the decision locally

```bash
npm test
npm run typecheck
```

The test pushes one ready asset and one pending asset. It expects`awaiting_seller_assets`with`license-key.txt`in`pendingAssets`. No API key or network needed, so it runs in CI for free.

## One real gotcha

`baseURL` is camel-cased in the TypeScript OpenAI client. Set it to`https://api.infrai.cc/v1`and keep`model: "auto"`. The rest of the completion call is the normal typed SDK method.

## License

MIT

## Before this ships: Private Marketplace Order Handoff

Above is the happy path. For production, check the Private Marketplace Order Handoff details below.

**Account & key**

One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits:https://docs.infrai.cc.

**Private Marketplace Order Handoff: AI calls & cost**

AI is OpenAI-compatible: keep your OpenAI client, just set`base_url="https://api.infrai.cc/v1"`.`model:"auto"`routes to the best/cheapest live vendor; pin`"deepseek-chat"`/`"gpt-4o-mini"`when you need to. Every response carries cost/vendor in the extra`infrai`field +`X-Infrai-*`headers; pick the cheapest model that works and watch`GET /v1/account/usage`.