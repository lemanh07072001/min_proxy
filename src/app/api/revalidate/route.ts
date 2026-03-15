import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * POST /api/revalidate?tag=branding
 * Gọi từ FE sau khi admin update settings → xóa server cache ngay
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const tag = searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag' }, { status: 400 })
  }

  revalidateTag(tag)

  return NextResponse.json({ revalidated: true, tag })
}
