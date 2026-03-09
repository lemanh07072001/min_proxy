'use client'

import ProfilePage from '@/views/Client/Profile/ProfilePage'
import { useProfile } from '@/hooks/apis/useProfile'

export default function Profile() {
  const { data: dataUser, isLoading } = useProfile()

  if (isLoading || !dataUser) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          height: '200px',
          borderRadius: '12px',
          background: 'var(--mui-palette-action-hover, #e2e8f0)',
          animation: 'skeletonPulse 1.5s ease-in-out infinite'
        }} />
        <style>{`@keyframes skeletonPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    )
  }

  return <ProfilePage dataProfile={dataUser} />
}
