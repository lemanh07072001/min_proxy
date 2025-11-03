import EditServicePage from '@/views/Client/Admin/ServiceType/EditServicePage'

export default function Page({ params }: { params: { id: string } }) {
  return <EditServicePage serviceId={params.id} />
}
