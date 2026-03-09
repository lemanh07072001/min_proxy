'use client'

import Script from 'next/script'

import { siteConfig } from '@/configs/siteConfig'

const StructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "logo": siteConfig.favicon,
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

