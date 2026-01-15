import EditServicePage from '@/views/Client/Admin/ServiceType/EditServicePage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  
return <EditServicePage serviceId={id} />
}
