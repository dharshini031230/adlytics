import { getCampaign } from '@/lib/campaigns'

type CampaignStatsRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: CampaignStatsRouteContext) {
  const { id } = await params
  const campaign = getCampaign(id)

  if (!campaign) {
    return Response.json({ error: `Campaign '${id}' was not found.` }, { status: 404 })
  }

  return Response.json({
    impressions: campaign.impressions,
    clicks: campaign.clicks,
    spend: campaign.spend,
    ctr: campaign.ctr,
    cpm: campaign.cpm,
  })
}
