import { generatePageMetadata, pageMetadataConfigs } from '@/utils/generatePageMetadata'
import type { Locale } from '@/configs/configi18n'

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params
  return generatePageMetadata(pageMetadataConfigs.pricing, resolvedParams.lang, '/pricing')
}

export default function PricingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Bảng Giá Proxy</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Gói Cơ Bản</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">99,000 VNĐ/tháng</p>
          <ul className="space-y-2">
            <li>✓ 1 IP Proxy</li>
            <li>✓ Tốc độ 100Mbps</li>
            <li>✓ Hỗ trợ 24/7</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-500">
          <h3 className="text-xl font-semibold mb-4">Gói Pro</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">299,000 VNĐ/tháng</p>
          <ul className="space-y-2">
            <li>✓ 5 IP Proxy</li>
            <li>✓ Tốc độ 500Mbps</li>
            <li>✓ Hỗ trợ 24/7</li>
            <li>✓ API Access</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Gói Enterprise</h3>
          <p className="text-2xl font-bold text-blue-600 mb-4">Liên hệ</p>
          <ul className="space-y-2">
            <li>✓ Unlimited IP</li>
            <li>✓ Tốc độ 1Gbps+</li>
            <li>✓ Hỗ trợ 24/7</li>
            <li>✓ Dedicated Support</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
