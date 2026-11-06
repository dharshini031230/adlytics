import assert from 'node:assert/strict'
import test from 'node:test'
import { GET as getCampaigns } from '../app/api/campaigns/route'
import { GET as getCampaign } from '../app/api/campaigns/[id]/route'
import { GET as getCampaignStats } from '../app/api/campaigns/[id]/stats/route'
import { calculateOverallCtr, getCampaigns as listCampaigns, withCampaignMetrics } from '../lib/campaigns'

test('CTR is clicks divided by impressions, expressed as a percentage', () => {
  const campaign = withCampaignMetrics({
    id: 'test-campaign',
    name: 'Test Campaign',
    impressions: 100_000,
    clicks: 2_500,
    spend: 500,
    currency: 'USD',
  })

  assert.equal(campaign.ctr, 2.5)
})

test('CPM is spend per thousand impressions', () => {
  const campaign = withCampaignMetrics({
    id: 'test-campaign',
    name: 'Test Campaign',
    impressions: 100_000,
    clicks: 2_500,
    spend: 500,
    currency: 'USD',
  })

  assert.equal(campaign.cpm, 5)
})

test('overall CTR uses total clicks divided by total impressions', () => {
  const campaigns = listCampaigns()
  const totalClicks = campaigns.reduce((total, campaign) => total + campaign.clicks, 0)
  const totalImpressions = campaigns.reduce((total, campaign) => total + campaign.impressions, 0)

  assert.equal(calculateOverallCtr(campaigns), (totalClicks / totalImpressions) * 100)
  assert.equal(calculateOverallCtr(campaigns), (8_500 / 295_000) * 100)
})

test('zero impressions return zero metrics without dividing by zero', () => {
  const campaign = withCampaignMetrics({
    id: 'empty-campaign',
    name: 'Empty Campaign',
    impressions: 0,
    clicks: 0,
    spend: 0,
    currency: 'USD',
  })

  assert.equal(campaign.ctr, 0)
  assert.equal(campaign.cpm, 0)
  assert.equal(calculateOverallCtr([campaign]), 0)
})

test('GET /api/campaigns returns HTTP 200 and all three campaigns', async () => {
  const response = getCampaigns()
  const campaigns = await response.json()

  assert.equal(response.status, 200)
  assert.equal(campaigns.length, 3)
  assert.deepEqual(campaigns.map((campaign: { id: string }) => campaign.id), [
    'campaign-a',
    'campaign-b',
    'campaign-c',
  ])
})

test('GET /api/campaigns/[id] returns HTTP 200 and one campaign', async () => {
  const response = await getCampaign(new Request('http://localhost/api/campaigns/campaign-a'), {
    params: Promise.resolve({ id: 'campaign-a' }),
  })
  const campaign = await response.json()

  assert.equal(response.status, 200)
  assert.equal(campaign.id, 'campaign-a')
  assert.equal(campaign.ctr, 2.5)
  assert.equal(campaign.cpm, 5)
})

test('GET /api/campaigns/[id]/stats returns HTTP 200 and campaign metrics', async () => {
  const response = await getCampaignStats(new Request('http://localhost/api/campaigns/campaign-a/stats'), {
    params: Promise.resolve({ id: 'campaign-a' }),
  })
  const stats = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(stats, {
    impressions: 100_000,
    clicks: 2_500,
    spend: 500,
    ctr: 2.5,
    cpm: 5,
  })
})

test('unknown campaign IDs return HTTP 404 with a JSON error', async () => {
  const response = await getCampaign(new Request('http://localhost/api/campaigns/missing-id'), {
    params: Promise.resolve({ id: 'missing-id' }),
  })

  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), { error: "Campaign 'missing-id' was not found." })
})

test('unknown campaign IDs also return HTTP 404 from the stats endpoint', async () => {
  const response = await getCampaignStats(new Request('http://localhost/api/campaigns/missing-id/stats'), {
    params: Promise.resolve({ id: 'missing-id' }),
  })

  assert.equal(response.status, 404)
  assert.deepEqual(await response.json(), { error: "Campaign 'missing-id' was not found." })
})
