'use client'

import Script from 'next/script'

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Proxy for Marketing",
    "description": "Dịch vụ proxy chất lượng cao, bảo mật tuyệt đối",
    "url": process.env.NEXT_PUBLIC_APP_URL || "https://mktproxy.com",
    "logo": "/images/logo/MKT_PROXY_2.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Vietnamese", "English"]
    },
    "sameAs": [
      "https://facebook.com/mktproxy",
      "https://twitter.com/mktproxy"
    ]
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}

export default StructuredData

