# AdTech Campaign API Explorer

A beginner-friendly Next.js dashboard that demonstrates how an advertising analytics API returns campaign performance data. The dashboard fetches the campaign list from its own API, and the API Explorer lets you send a GET request and inspect the JSON response.

The included campaigns are simulated sample data stored in the project. They do not come from an advertising platform or external service.

## What is a REST API?

A REST API is a predictable way for one application to ask another application for information over HTTP. For example, the dashboard sends a `GET` request to `/api/campaigns`. The server responds with JSON, a text format that applications can easily read. These same endpoints can be called by a browser, another application, or the API Explorer on this page.

## API endpoints

Campaign IDs are `campaign-a`, `campaign-b`, and `campaign-c`.

### `GET /api/campaigns`

Returns all three campaigns. Each campaign includes the source data and its calculated CTR and CPM.

```json
[
  {
    "id": "campaign-a",
    "name": "Campaign A",
    "impressions": 100000,
    "clicks": 2500,
    "spend": 500,
    "currency": "USD",
    "ctr": 2.5,
    "cpm": 5
  },
  {
    "id": "campaign-b",
    "name": "Campaign B",
    "impressions": 75000,
    "clicks": 1800,
    "spend": 375,
    "currency": "USD",
    "ctr": 2.4,
    "cpm": 5
  },
  {
    "id": "campaign-c",
    "name": "Campaign C",
    "impressions": 120000,
    "clicks": 4200,
    "spend": 600,
    "currency": "USD",
    "ctr": 3.5,
    "cpm": 5
  }
]
```

### `GET /api/campaigns/[id]`

Returns one campaign, including its source data and calculated metrics. For example, `GET /api/campaigns/campaign-a` returns:

```json
{
  "id": "campaign-a",
  "name": "Campaign A",
  "impressions": 100000,
  "clicks": 2500,
  "spend": 500,
  "currency": "USD",
  "ctr": 2.5,
  "cpm": 5
}
```

### `GET /api/campaigns/[id]/stats`

Returns the key performance statistics for one campaign. For example, `GET /api/campaigns/campaign-a/stats` returns:

```json
{
  "impressions": 100000,
  "clicks": 2500,
  "spend": 500,
  "ctr": 2.5,
  "cpm": 5
}
```

## HTTP status codes

- **HTTP 200** means the request succeeded. The API returns the requested campaign data as JSON.
- **HTTP 404** means the campaign ID does not exist. The detail and stats endpoints return a JSON error, for example:

```json
{
  "error": "Campaign 'missing-id' was not found."
}
```

## Metric calculations

- **CTR (click-through rate)** = clicks ÷ impressions × 100. It is expressed as a percentage.
- **CPM (cost per mille, or cost per thousand impressions)** = spend ÷ impressions × 1,000. It is expressed in the campaign's currency.

For Campaign A, 2,500 clicks ÷ 100,000 impressions × 100 = **2.50% CTR**. Its $500 spend ÷ 100,000 impressions × 1,000 = **$5.00 CPM**. The API rounds these per-campaign metrics to two decimal places.

Overall CTR uses the totals, rather than averaging campaign CTRs: 8,500 total clicks ÷ 295,000 total impressions × 100 = **2.88%** when displayed to two decimal places. If impressions are zero, the CTR and CPM calculations return zero instead of dividing by zero.

## Run the project

Requirements: Node.js 20.9 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the dashboard and API Explorer. No accounts, API keys, databases, or external services are required.

## Run the automated tests

The tests use Node.js's built-in test runner and check the metric calculations and Route Handler responses. Run them with:

```bash
pnpm test
```

The tests do not require the development server to be running. To check the Vercel production build locally, run:

```bash
pnpm build
```

## Deploy to Vercel

1. Push the project to a GitHub repository, or import the existing repository in Vercel.
2. In Vercel, choose **Add New → Project** and select the repository.
3. Keep the detected Next.js framework settings and deploy. No environment variables are required.

Vercel builds the Next.js app and deploys the Route Handler API endpoints along with the dashboard.
