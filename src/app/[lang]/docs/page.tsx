'use client'
import dynamic from 'next/dynamic'
const RedocStandalone = dynamic(
  () => import('redoc').then(m => m.RedocStandalone),
  { ssr: false }
)

export default function RedocPage() {
  return <RedocStandalone specUrl="/api/docs" />   // ✅ specUrl
}