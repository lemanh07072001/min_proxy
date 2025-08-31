import './styles.css'

import ProxyCard from '@/app/[lang]/(private)/(client)/components/proxy-card/ProxyCard'

interface StaticProxyPageProps {
  data: any
}

export default function StaticProxyPage({ data }: StaticProxyPageProps) {
  return (
    <>
      {data.map((provider: any, index: any) => (
        <ProxyCard
          key={index}
          provider={provider.provider}
          logo={provider.logo}
          color={provider.color}
          price={provider.price}
          features={provider.features}
        />
      ))}
    </>
  )
}
