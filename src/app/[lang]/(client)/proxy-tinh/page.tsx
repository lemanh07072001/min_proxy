

import "@/app/[lang]/(client)/proxy-tinh/styles.css"

import ProxyCard from '@/app/[lang]/(client)/components/proxy-card/ProxyCard'

export default function StaticProxy() {
  const proxyProviders = [
    {
      provider: 'Viettel Proxy',
      logo: '/images/softwares/viettel.png',
      color: 'viettel-theme',
      price: '1,000đ',
      features: [
        {
          title: 'Tốc độ cao',
          class: 'success'
        },
        {
          title: 'Ổn định',
          class: 'info'
        }
      ]
    },
    {
      provider: 'VNPT Proxy',
      logo: '/images/softwares/vnpt.png',
      color: 'vnpt-theme',
      price: '1,200đ',
      features: [
        {
          title: 'Bảo mật',
          class: 'success'
        },
        {
          title: 'Đáng tin cậy',
          class: 'info'
        }
      ]
    },
    {
      provider: 'FPT Proxy',
      logo: '/images/softwares/fpt.png',
      color: 'fpt-theme',
      price: '1,100đ',
      features: [
        {
          title: 'Nhanh chóng',
          class: 'success'
        },
        {
          title: 'Chất lượng',
          class: 'info'
        }
      ]
    },
  ];

  return (
    <div className="main-content-modern">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Proxy Dân Cư</h1>
          <p className="page-subtitle">Chọn gói proxy phù hợp với nhu cầu của bạn</p>
        </div>
      </div>

      {/* Proxy Cards */}
      <div className="proxy-grid">
        {proxyProviders.map((provider, index) => (
          <ProxyCard
            key={index}
            provider={provider.provider}
            logo={provider.logo}
            color={provider.color}
            price={provider.price}
            features={provider.features}
          />
        ))}
      </div>


    </div>
    )
}