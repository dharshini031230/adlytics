# AdTech Campaign API Explorer

A small, beginner-friendly Next.js app that demonstrates how an advertising analytics API can return campaign data and performance metrics. The dashboard loads its campaign list from the app's own API, and the API Explorer lets you send a GET request and inspect the JSON response.

All included campaign data is simulated for demonstration purposes. It does not come from an advertising platform.

## What is a REST API?

A REST API gives applications a predictable way to request or update resources over HTTP. This project uses `GET` requests to read campaign data. The server responds with JSON, a text format commonly used to exchange data between applications. The dashboard calls the same endpoints that are available to other clients.

## Available endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/campaigns` | Returns all campaigns and their calculated metrics. |
| `GET` | `/api/campaigns/[id]` | Returns one campaign by ID, including its calculated metrics. |
| `GET` | `/api/campaigns/[id]/stats` | Returns impressions, clicks, spend, CTR, and CPM for one campaign. |

Campaign IDs are `campaign-a`, `campaign-b`, and `campaign-c`. For example, `/api/campaigns/campaign-a/stats` returns Campaign A's statistics. Unknown campaign IDs return HTTP `404` with a JSON `error` message.

## Metric calculations

- **CTR (click-through rate)** = clicks ÷ impressions × 100. It is shown as a percentage.
- **CPM (cost per mille / thousand impressions)** = spend ÷ impressions × 1,000. It is shown in the campaign's currency.

For example, Campaign A has a 2.50% CTR and a $5.00 CPM. Metric values are rounded to two decimal places.

## Run locally

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard. No accounts, API keys, databases, or external services are required.

## Test the project

Use the API Explorer on the dashboard to select an endpoint and send a request, or open these paths in your browser:

- `/api/campaigns`
- `/api/campaigns/campaign-a`
- `/api/campaigns/campaign-a/stats`
- `/api/campaigns/not-a-campaign` (returns a JSON 404 response)

You can also check the production build with:

```bash
pnpm build
```

## Deploy to Vercel

1. Push the project to a GitHub repository, or import the project directory in Vercel.
2. In Vercel, choose **Add New → Project** and select the repository.
3. Keep the detected Next.js framework settings and deploy. No environment variables are needed.

Vercel will build and deploy the Next.js app, including the Route Handler API endpoints.
