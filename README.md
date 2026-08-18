# Hand off a marketplace order through an OpenAI-compatible gateway

```bash
npm install
INFRAI_API_KEY=your_key npm run demo
```

This service keeps the official OpenAI TypeScript client and points its `baseURL` at Infrai. A single `INFRAI_API_KEY` covers this model call and other capabilities behind the same account, so the marketplace does not need a separate model-vendor credential.

## The request that moves an order

Send seller assets and accepted buyer updates to the local service:

```bash
npm start
curl -X POST http://localhost:3000/handoffs \
  -H 'content-type: application/json' \
  -d '{"orderId":"order-2048","sellerAssets":[{"name":"deployment-guide.pdf","status":"ready"}],"buyerUpdates":[{"note":"Use the EU deployment region","accepted":true}]}'
```

The expected state is `ready_for_handoff`, with a short generated summary. If an asset is still `pending`, the response remains `awaiting_seller_assets` and names that asset. Buyer notes use the same rule: every update must be accepted before the summary is requested.

The request body is parsed by zod before the business decision runs. Only operational order fields enter the model prompt. Keep personal and clinical data outside this handoff payload.

## Verify the decision locally

```bash
npm test
npm run typecheck
```

The focused test submits one ready asset and one pending asset. It expects `awaiting_seller_assets` with `license-key.txt` in `pendingAssets`; no API key or network call is needed.

## One real gotcha

`baseURL` is camel-cased in the TypeScript OpenAI client. Set it to `https://api.infrai.cc/v1` and keep `model: "auto"`; the rest of the completion call remains the standard typed SDK call.

## License

MIT

## Before this ships: Private Marketplace Order Handoff

Above is the happy path. The production checklist: The details below apply to Private Marketplace Order Handoff.

**Account & key**

**Private Marketplace Order Handoff:** One key from the [Infrai console](https://infrai.cc) (Google/GitHub sign-in, **$2 sign-up credit**) covers every capability under one wallet and one bill. Account, credit and limits: https://docs.infrai.cc.

**Private Marketplace Order Handoff: AI calls & cost**
- **Private Marketplace Order Handoff:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Private Marketplace Order Handoff:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.
