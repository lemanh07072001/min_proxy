'use client'

import Script from 'next/script'

import { siteConfig } from '@/configs/siteConfig'

const StructuredData = () => {
  // Không render nếu chưa setup tên site
  if (!siteConfig.name) return null

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": siteConfig.url,
    ...(siteConfig.favicon ? { "logo": siteConfig.favicon } : {}),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Vietnamese", "English"]
    },
    "sameAs": []
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

