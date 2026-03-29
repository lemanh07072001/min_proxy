import { siteConfig } from '@/configs/siteConfig'

export interface ServerPartner {
  id: number
  name: string
  logo_url: string | null
  logo_landing_url: string | null
  link: string | null
}

/**
 * Fetch partners server-side — cache 5 phút, tag 'partners'
 */
export async function getServerPartners(): Promise<ServerPartner[]> {
  try {
    const apiUrl = process.env.API_URL || siteConfig.apiUrl

    const res = await fetch(`${apiUrl}/get-partners`, {
      next: { tags: ['partners'], revalidate: 300 }
    })

    if (!res.ok) return []

    const json = await res.json()

    return (json?.data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      logo_url: p.logo_url,
      logo_landing_url: p.logo_landing_url,
      link: p.link
    }))
  } catch {
    return []
  }
}
