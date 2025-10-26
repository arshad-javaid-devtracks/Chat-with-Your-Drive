# Chat-with-Your-Drive

A lightweight Retrieval-Augmented Generation (RAG) setup powered by n8n, paired with a minimal web chat portal that sends user prompts to an n8n webhook and renders the AI response. Built to be simple to deploy, easy to customize, and fast to prototype.

## 🌟 Overview
- Orchestrate RAG flows in n8n using a prebuilt workflow: `chat-with-your-drive.json`.
- Interact via a static, no-build chat UI in `drive-chat/` that POSTs to your n8n Webhook node.
- Bring-your-own model, vector store, and data sources inside n8n.

## 🧩 Architecture
- **n8n workflow** (`chat-with-your-drive.json`):
  - Exposes a Webhook endpoint to receive chat messages.
  - Implements the RAG logic (prompting, retrieval, composition) inside n8n nodes.
  - Responds with plain text or JSON (the web UI auto-detects common fields like `reply`, `result`, `output`, `message`).
- **Web chat portal** (`drive-chat/`):
  - Static HTML/CSS/JS. No bundler, no build step.
  - Sends `{ chatInput, sessionId }` to your webhook and renders the reply.

## 📁 Repository Structure
- `chat-with-your-drive.json` — Importable n8n workflow.
- `drive-chat/` — Static chat client:
  - `index.html`, `styles.css`, `app.js`
  - `config.example.js` → copy to `config.js` and set your webhook URL
  - `README.md` — quick-start for the chat portal

## ✅ Prerequisites
- n8n (self-hosted or cloud) with access to required credentials (e.g., LLM/api providers).
- A reachable Webhook URL from your browser/client (public URL if hosting the portal remotely).
- Optional: any vector DB or data source you plan to use in your n8n workflow.

## 🚀 Setup
### 1) Import the n8n workflow
1. Open your n8n instance.
2. Import `n8n-rag-studio-with-webhook.json` (Settings → Import from file).
3. Open the Webhook node and note the production/test webhook URL.
4. Configure any credentials, model providers, or data connections referenced by the workflow.

### 2) Configure the web chat portal
1. Go to `drive-chat/`.
2. Copy the example config:
   ```bash
   cp config.example.js config.js
   ```
3. Edit `config.js` and set:
   ```js
   export const webhookUrl = "https://your-n8n-domain/webhook/your-endpoint";
   ```
4. Open the portal locally:
   ```bash
   open index.html
   ```

### 3) CORS (if hosting on a different domain)
If the portal origin differs from n8n, set response headers in your Webhook response (Respond to Webhook node → Additional Fields → Response Headers):
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Methods: POST, OPTIONS`

Optionally add a Webhook for `OPTIONS` preflight that returns 200 with the same headers.

## 🧪 Usage
- Type your question in the chat portal; it will POST to the webhook as:
  ```json
  { "chatInput": "Your question...", "sessionId": "uuid" }
  ```
- The workflow returns the AI reply; the portal displays it. If JSON is returned, the portal tries `reply`, `result`, `output`, then `message` fields.

## 🛠 Customize
- UI: edit `drive-chat/styles.css`, `drive-chat/index.html`, and `drive-chat/app.js`.
- Branding: replace `drive-chat/favicon.svg` and update titles.
- RAG logic: modify nodes inside the n8n workflow (retrieval strategy, prompt templates, model, tools).

## 📦 Deploy Suggestions
- Chat portal: any static host (GitHub Pages, Netlify, Vercel static, S3+CloudFront).
- n8n: your preferred environment (Docker, VM, PaaS), ensure webhook is publicly reachable.

## 👤 Author
- Arshad Javaid  
- Email: arshad.javaid.devtracks@gmail.com

## 📜 License
- Please add a LICENSE file to specify terms of use (MIT/Apache-2.0/etc.). If you share your preferred license, I can add it here and in a `LICENSE` file.
