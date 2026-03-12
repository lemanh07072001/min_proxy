import { redirect } from 'next/navigation'

export default function AdminPartialOrdersPage({ params }: { params: { lang: string } }) {
  redirect(`/${params.lang}/admin/orders`)
}
