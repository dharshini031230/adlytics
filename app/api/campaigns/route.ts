import { getCampaigns } from '@/lib/campaigns'

export function GET() {
  return Response.json(getCampaigns())
}
