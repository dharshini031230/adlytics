import { getCampaign } from '@/lib/campaigns'

type CampaignRouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: CampaignRouteContext) {
  const { id } = await params
  const campaign = getCampaign(id)

  if (!campaign) {
    return Response.json({ error: `Campaign '${id}' was not found.` }, { status: 404 })
  }

  return Response.json(campaign)
}
