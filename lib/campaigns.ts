export type Campaign = {
  id: string
  name: string
  impressions: number
  clicks: number
  spend: number
  currency: 'USD'
  ctr: number
  cpm: number
}

type CampaignInput = Omit<Campaign, 'ctr' | 'cpm'>

export const simulatedCampaigns: CampaignInput[] = [
  {
    id: 'campaign-a',
    name: 'Campaign A',
    impressions: 100_000,
    clicks: 2_500,
    spend: 500,
    currency: 'USD',
  },
  {
    id: 'campaign-b',
    name: 'Campaign B',
    impressions: 75_000,
    clicks: 1_800,
    spend: 375,
    currency: 'USD',
  },
  {
    id: 'campaign-c',
    name: 'Campaign C',
    impressions: 120_000,
    clicks: 4_200,
    spend: 600,
    currency: 'USD',
  },
]

export function withCampaignMetrics(campaign: CampaignInput): Campaign {
  const ctr = campaign.impressions === 0 ? 0 : (campaign.clicks / campaign.impressions) * 100
  const cpm = campaign.impressions === 0 ? 0 : (campaign.spend / campaign.impressions) * 1_000

  return {
    ...campaign,
    ctr: Number(ctr.toFixed(2)),
    cpm: Number(cpm.toFixed(2)),
  }
}

export function getCampaign(id: string): Campaign | undefined {
  const campaign = simulatedCampaigns.find((item) => item.id === id)
  return campaign ? withCampaignMetrics(campaign) : undefined
}

export function getCampaigns(): Campaign[] {
  return simulatedCampaigns.map(withCampaignMetrics)
}

export function calculateOverallCtr(campaigns: Pick<Campaign, 'impressions' | 'clicks'>[]): number {
  const totalImpressions = campaigns.reduce((total, campaign) => total + campaign.impressions, 0)
  const totalClicks = campaigns.reduce((total, campaign) => total + campaign.clicks, 0)

  return totalImpressions === 0 ? 0 : (totalClicks / totalImpressions) * 100
}
