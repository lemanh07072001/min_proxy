import spec from '@/specs/openapi.json' // đặt file ở /specs hoặc /src/specs

export async function GET() {
  return Response.json(spec, {
    headers: { 'Content-Type': 'application/json' }
  })
}