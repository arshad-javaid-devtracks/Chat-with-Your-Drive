# AI Chat Portal (Static)

A lightweight web chat that posts messages to your n8n webhook and renders the reply. No build step.

## Quick start

- Copy config and open in browser:
```bash
cp config.example.js config.js
open index.html
```

- Edit `config.js` → set `webhookUrl` to your n8n endpoint.

## CORS notes

If you host this on a different domain than n8n, set response headers in your n8n workflow (Respond to Webhook node → Additional Fields → Response Headers):

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Methods: POST, OPTIONS`

Optionally add a Webhook node for `OPTIONS` preflight that returns 200 with the same headers.

## Expected payload & response

- Request body:
```json
{ "chatInput": "Hello world", "sessionId": "uuid" }
```
- Response can be either plain text or JSON. The portal tries these fields when JSON:
`reply`, `result`, `output`, `message`.

## Deploy suggestions

- Any static host: GitHub Pages, Vercel (static), Netlify Drop, S3+CloudFront.

## Customize

- Styles in `styles.css`
- Branding icon: `favicon.svg`
- Basic state kept in `localStorage` (session id + history)
