'use client'

import { useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Activity, BadgeCheck, Braces, CircleDollarSign, MousePointer2, Radio, RefreshCw, Send, Sparkles, Target, type LucideIcon } from 'lucide-react'
import { calculateOverallCtr, type Campaign } from '@/lib/campaigns'

type EndpointOption = {
  label: string
  path: string
  description: string
}

type ApiResult = {
  status: number
  body: unknown
}

const endpointOptions: EndpointOption[] = [
  {
    label: 'List all campaigns',
    path: '/api/campaigns',
    description: 'Returns the complete campaign collection.',
  },
  {
    label: 'Get one campaign',
    path: '/api/campaigns/campaign-a',
    description: 'Returns full details for Campaign A.',
  },
  {
    label: 'Get campaign stats',
    path: '/api/campaigns/campaign-a/stats',
    description: 'Returns the performance metrics for Campaign A.',
  },
]

const fetcher = async (url: string): Promise<Campaign[]> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Campaign data could not be loaded.')
  return response.json()
}

const numberFormat = new Intl.NumberFormat('en-US')

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

type MetricCardProps = {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  tone: 'blue' | 'violet' | 'green' | 'amber'
}

function MetricCard({ label, value, helper, icon: Icon, tone }: MetricCardProps) {
  const iconTone = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  }[tone]

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-xs text-slate-500">{helper}</p>
    </article>
  )
}

function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const campaignDots = ['bg-blue-500', 'bg-violet-500', 'bg-emerald-500']

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-[0.08em] text-slate-500">
            <th scope="col" className="px-5 py-3.5 font-semibold">Campaign</th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold">Impressions</th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold">Clicks</th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold">Spend</th>
            <th scope="col" className="px-4 py-3.5 text-right font-semibold">CTR</th>
            <th scope="col" className="px-5 py-3.5 text-right font-semibold">CPM</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map((campaign, index) => (
            <tr key={campaign.id} className="transition-colors hover:bg-slate-50/70">
              <th scope="row" className="px-5 py-4 font-medium text-slate-900">
                <span className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-full ${campaignDots[index % campaignDots.length]}`} aria-hidden="true" />
                  <span>
                    {campaign.name}
                    <span className="mt-0.5 block font-mono text-xs font-normal text-slate-400">{campaign.id}</span>
                  </span>
                </span>
              </th>
              <td className="px-4 py-4 text-right tabular-nums text-slate-600">{numberFormat.format(campaign.impressions)}</td>
              <td className="px-4 py-4 text-right tabular-nums text-slate-600">{numberFormat.format(campaign.clicks)}</td>
              <td className="px-4 py-4 text-right tabular-nums text-slate-600">{formatCurrency(campaign.spend, campaign.currency)}</td>
              <td className="px-4 py-4 text-right font-medium tabular-nums text-slate-900">{campaign.ctr.toFixed(2)}%</td>
              <td className="px-5 py-4 text-right font-medium tabular-nums text-slate-900">{formatCurrency(campaign.cpm, campaign.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ApiExplorer() {
  const [selectedPath, setSelectedPath] = useState(endpointOptions[0].path)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const selectedEndpoint = endpointOptions.find((endpoint) => endpoint.path === selectedPath) ?? endpointOptions[0]

  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(selectedEndpoint.path)
      const body = await response.json()
      setResult({ status: response.status, body })
      if (!response.ok) {
        setError(typeof body?.error === 'string' ? body.error : `The request returned HTTP ${response.status}.`)
      }
    } catch {
      setResult(null)
      setError('The request could not be completed. Check that the API server is running and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="api-explorer" className="scroll-mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Braces aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold tracking-tight text-slate-950">API Explorer</h2>
            <p className="mt-1 text-sm text-slate-500">Try a live endpoint and inspect its JSON response.</p>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          GET request
        </span>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <form onSubmit={sendRequest} className="flex flex-col gap-5">
          <div>
            <label htmlFor="endpoint" className="mb-2 block text-sm font-medium text-slate-700">Endpoint</label>
            <select
              id="endpoint"
              value={selectedPath}
              onChange={(event) => setSelectedPath(event.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {endpointOptions.map((endpoint) => (
                <option key={endpoint.path} value={endpoint.path}>{endpoint.label}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Request URL</p>
            <div className="flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-emerald-800">GET</span>
              <code className="break-all text-xs text-slate-600 sm:text-sm">{selectedEndpoint.path}</code>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{selectedEndpoint.description}</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-300 disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? <RefreshCw aria-hidden="true" className="size-4 animate-spin" /> : <Send aria-hidden="true" className="size-4" />}
            {isLoading ? 'Sending request…' : 'Send request'}
          </button>
        </form>

        <div className="flex min-h-[270px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 px-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <span className="flex gap-1" aria-hidden="true"><span className="size-2 rounded-full bg-rose-400" /><span className="size-2 rounded-full bg-amber-300" /><span className="size-2 rounded-full bg-emerald-400" /></span>
              Response
            </div>
            {result ? (
              <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${result.status < 400 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300'}`}>
                HTTP {result.status}
              </span>
            ) : <span className="font-mono text-[11px] text-slate-500">Awaiting request</span>}
          </div>
          <div className="flex flex-1 flex-col p-4">
            {error ? <p role="alert" className="mb-3 rounded-md border border-rose-400/20 bg-rose-400/10 px-3 py-2 text-xs leading-relaxed text-rose-200">{error}</p> : null}
            <pre aria-live="polite" className="max-h-[320px] flex-1 overflow-auto font-mono text-xs leading-relaxed text-emerald-200 sm:text-[13px]">
              {result ? JSON.stringify(result.body, null, 2) : '// Select an endpoint and send a request to see the JSON response.'}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CampaignDashboard() {
  const { data: campaigns, error, isLoading, mutate } = useSWR<Campaign[]>('/api/campaigns', fetcher)
  const totalImpressions = campaigns?.reduce((sum, campaign) => sum + campaign.impressions, 0) ?? 0
  const totalClicks = campaigns?.reduce((sum, campaign) => sum + campaign.clicks, 0) ?? 0
  const totalSpend = campaigns?.reduce((sum, campaign) => sum + campaign.spend, 0) ?? 0
  const overallCtr = calculateOverallCtr(campaigns ?? [])

  return (
    <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <a href="#overview" className="flex w-fit items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <Activity aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight text-slate-950">Signal / Ads</span>
              <span className="block text-xs text-slate-500">Campaign API Explorer</span>
            </span>
          </a>
          <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
            <nav aria-label="Main navigation" className="flex items-center gap-1 text-sm">
              <a href="#campaigns" className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Campaigns</a>
              <a href="#api-explorer" className="rounded-lg px-3 py-2 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">API Explorer</a>
            </nav>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800">
              <Sparkles aria-hidden="true" className="size-3.5" /> Simulated data
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section id="overview" className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
              <span className="size-1.5 rounded-full bg-blue-600" aria-hidden="true" /> Analytics overview
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Campaign performance</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">A small, hands-on look at how campaign metrics flow through a REST API.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <BadgeCheck aria-hidden="true" className="size-4 text-emerald-600" />
            <span>Data loaded from <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-700">GET /api/campaigns</code></span>
            <span className="sr-only">Campaign data is retrieved from the API endpoint.</span>
          </div>
        </section>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading campaign metrics">
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />)}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
            <p className="font-semibold">Campaign data could not be loaded.</p>
            <p className="mt-1">Check that the API is available, then try again.</p>
            <button onClick={() => mutate()} className="mt-3 inline-flex items-center gap-1.5 font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200">
              <RefreshCw aria-hidden="true" className="size-3.5" /> Retry
            </button>
          </div>
        ) : campaigns ? (
          <>
            <section aria-label="Campaign totals" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Total impressions" value={numberFormat.format(totalImpressions)} helper="across 3 simulated campaigns" icon={Radio} tone="blue" />
              <MetricCard label="Total clicks" value={numberFormat.format(totalClicks)} helper="across 3 simulated campaigns" icon={MousePointer2} tone="violet" />
              <MetricCard label="Total spend" value={formatCurrency(totalSpend, 'USD')} helper="campaign budget used" icon={CircleDollarSign} tone="green" />
              <MetricCard label="Overall CTR" value={`${overallCtr.toFixed(2)}%`} helper="clicks ÷ impressions" icon={Target} tone="amber" />
            </section>

            <section id="campaigns" className="scroll-mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40">
              <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="font-semibold tracking-tight text-slate-950">Campaign breakdown</h2>
                  <p className="mt-1 text-sm text-slate-500">Performance metrics for each simulated campaign.</p>
                </div>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> {campaigns.length} campaigns
                </span>
              </div>
              <CampaignTable campaigns={campaigns} />
              <div className="flex flex-col gap-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <span>CTR = clicks ÷ impressions × 100</span>
                <span>CPM = spend ÷ impressions × 1,000</span>
              </div>
            </section>
          </>
        ) : null}

        <ApiExplorer />

        <footer className="flex flex-col gap-2 border-t border-slate-200/80 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Built to make advertising APIs easier to understand.</span>
          <span>See README.md for API examples and metric definitions.</span>
        </footer>
      </div>
    </main>
  )
}
