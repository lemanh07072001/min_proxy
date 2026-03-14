import React, { useState, useMemo } from 'react'

import { useSession } from 'next-auth/react'
import { Copy, Check, Play, Loader2, Terminal } from 'lucide-react'

import { apiEndpoints, categoryLabels, type ApiEndpoint } from '@/configs/apiDocsConfig'

// ─── Helpers ─────────────────────────────────────────────────

const LANGS = ['cURL', 'PHP', 'Node.js', 'Python', 'Go'] as const

// URL docs (hiển thị trong code examples) vs URL thật (dùng cho "Chạy thử")
const DOCS_BASE = process.env.NEXT_PUBLIC_API_DOCS_URL || process.env.NEXT_PUBLIC_API_URL || ''
const LIVE_BASE = process.env.NEXT_PUBLIC_API_URL || DOCS_BASE

function buildUrl(ep: ApiEndpoint): string {
  let url = ep.endpoint
  const qp: string[] = []

  ep.parameters?.forEach(p => {
    if (url.includes(`{${p.name}}`)) {
      url = url.replace(`{${p.name}}`, p.example)
    } else if (ep.method === 'GET') {
      qp.push(`${p.name}=${p.example}`)
    }
  })
  if (qp.length) url += '?' + qp.join('&')
  
return url
}

function genCode(ep: ApiEndpoint, lang: string, key: string): string {
  const url = buildUrl(ep)
  const k = key || 'YOUR_API_KEY'
  const isPost = ep.method === 'POST'
  const body = ep.requestBody
  const compact = body?.replace(/\n\s*/g, ' ').trim()

  switch (lang) {
    case 'cURL': {
      const p = ['curl']

      if (isPost) p.push('-X POST')
      p.push(`-H "X-API-Key: ${k}"`)

      if (isPost && compact) {
        p.push('-H "Content-Type: application/json"')
        p.push(`-d '${compact}'`)
      }

      p.push(`"${url}"`)
      
return p.join(' \\\n  ')
    }

    case 'PHP': {
      let c = `$ch = curl_init("${url}");\ncurl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`
      const h = [`  "X-API-Key: ${k}"`]

      if (isPost && compact) h.push(`  "Content-Type: application/json"`)
      c += `curl_setopt($ch, CURLOPT_HTTPHEADER, [\n${h.join(',\n')}\n]);\n`

      if (isPost && compact) {
        c += `curl_setopt($ch, CURLOPT_POST, true);\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${compact}');\n`
      }

      c += `\n$response = curl_exec($ch);\ncurl_close($ch);\n$data = json_decode($response, true);\nprint_r($data);`
      
return c
    }

    case 'Node.js': {
      const h = [`    "X-API-Key": "${k}"`]

      if (isPost && compact) h.push(`    "Content-Type": "application/json"`)
      let c = `const res = await fetch("${url}", {\n`

      if (isPost) c += `  method: "POST",\n`
      c += `  headers: {\n${h.join(',\n')}\n  }`
      if (isPost && compact) c += `,\n  body: JSON.stringify(${compact})`
      c += `\n});\nconst data = await res.json();\nconsole.log(data);`
      
return c
    }

    case 'Python': {
      const m = isPost ? 'post' : 'get'
      const a = [`"${url}"`, `headers={"X-API-Key": "${k}"}`]

      if (isPost && compact) a.push(`json=${compact}`)
      
return `import requests\n\nres = requests.${m}(\n  ${a.join(',\n  ')}\n)\nprint(res.json())`
    }

    case 'Go': {
      let c = 'package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"\n'

      if (isPost) c += '  "strings"\n'
      c += ')\n\nfunc main() {\n'

      if (isPost && compact) {
        c += `  body := strings.NewReader(\`${compact}\`)\n`
        c += `  req, _ := http.NewRequest("POST", "${url}", body)\n`
      } else {
        c += `  req, _ := http.NewRequest("GET", "${url}", nil)\n`
      }

      c += `  req.Header.Set("X-API-Key", "${k}")\n`
      if (isPost) c += `  req.Header.Set("Content-Type", "application/json")\n`
      c += `\n  resp, _ := http.DefaultClient.Do(req)\n  defer resp.Body.Close()\n  data, _ := io.ReadAll(resp.Body)\n  fmt.Println(string(data))\n}`
      
return c
    }

    default: return ''
  }
}

// ─── Copy Button ─────────────────────────────────────────────

function CopyBtn({ text, label }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false)
  const copy = () => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000) }

  
return (
    <button onClick={copy} className='flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors text-xs font-medium'>
      {ok ? <Check size={13} /> : <Copy size={13} />}
      <span>{ok ? 'Copied!' : (label || 'Copy')}</span>
    </button>
  )
}

// ─── Main Component ──────────────────────────────────────────

interface ApiUsageProps { endpoints?: ApiEndpoint[] }

export default function ApiUsage({ endpoints }: ApiUsageProps) {
  const data = endpoints || apiEndpoints
  const { data: session } = useSession()
  const userApiKey = (session?.user as any)?.api_key || ''

  const [selectedApi, setSelectedApi] = useState(data[0]?.id || '')
  const [selectedLang, setSelectedLang] = useState<string>('cURL')
  const [selectedStatus, setSelectedStatus] = useState('200 OK')
  const [liveRes, setLiveRes] = useState<string | null>(null)
  const [liveStatus, setLiveStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const ep = data.find(a => a.id === selectedApi) || data[0]

  const grouped = useMemo(() => {
    const g: Record<string, ApiEndpoint[]> = {}

    data.forEach(a => { if (!g[a.category]) g[a.category] = []; g[a.category].push(a) })
    
return g
  }, [data])

  const methodColor = (m: string) => {
    if (m === 'GET') return 'bg-blue-600'
    if (m === 'POST') return 'bg-emerald-600'
    if (m === 'PUT') return 'bg-amber-600'
    if (m === 'DELETE') return 'bg-red-600'
    
return 'bg-gray-600'
  }


  const selectApi = (id: string) => {
    setSelectedApi(id); setSelectedStatus('200 OK'); setLiveRes(null); setLiveStatus(null)
  }

  const tryIt = async () => {
    if (!userApiKey) return
    setLoading(true); setLiveRes(null); setLiveStatus(null)

    try {
      const url = buildUrl(ep).replace(DOCS_BASE, LIVE_BASE)
      const headers: Record<string, string> = { 'X-API-Key': userApiKey }
      const opts: RequestInit = { method: ep.method, headers }

      if (ep.method === 'POST' && ep.requestBody) {
        headers['Content-Type'] = 'application/json'
        opts.body = ep.requestBody
      }

      const res = await fetch(url, opts)
      const d = await res.json()

      setLiveStatus(res.status)
      setLiveRes(JSON.stringify(d, null, 2))
    } catch (e: any) {
      setLiveStatus(0); setLiveRes(`Error: ${e.message}`)
    } finally { setLoading(false) }
  }

  const code = genCode(ep, selectedLang, userApiKey)

  return (
    <div className='flex rounded-xl overflow-hidden border border-gray-200 bg-white flex-1 min-h-0'>

      {/* ─── Sidebar ─── */}
      <div className='w-64 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0'>
        {/* Endpoint list */}
        <div className='flex-1 overflow-y-auto'>
          {Object.entries(grouped).map(([cat, apis]) => (
            <div key={cat}>
              <div className='px-4 pt-4 pb-2'>
                <span className='text-[11px] font-bold text-gray-400 uppercase tracking-wider'>{categoryLabels[cat] || cat}</span>
              </div>
              {apis.map(a => (
                <div key={a.id} onClick={() => selectApi(a.id)}
                  className={`group px-4 py-3 cursor-pointer transition-all ${
                    selectedApi === a.id
                      ? 'bg-white border-l-[3px] border-l-orange-500 shadow-sm'
                      : 'border-l-[3px] border-l-transparent hover:bg-white/60'
                  }`}>
                  <div className='flex items-center gap-2'>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${methodColor(a.method)} flex-shrink-0`}>
                      {a.method}
                    </span>
                    <span className={`text-sm ${selectedApi === a.id ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{a.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className='flex-1 flex flex-col overflow-hidden'>

        {/* Header: Endpoint URL + API Key */}
        <div className='flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white'>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${methodColor(ep.method)}`}>{ep.method}</span>
          <div className='flex-1 min-w-0'>
            <h2 className='text-base font-bold text-gray-900 m-0 leading-tight'>{ep.title}</h2>
            <code className='text-xs text-gray-500 font-mono mt-0.5 block truncate'>{ep.endpoint}</code>
          </div>
          <div className='flex items-center gap-2 flex-shrink-0'>
            {userApiKey ? (
              <div className='flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-1.5'>
                <span className='text-[10px] text-gray-500 uppercase font-semibold'>API Key</span>
                <code className='text-green-400 font-mono text-xs'>{userApiKey.slice(0, 12)}...{userApiKey.slice(-6)}</code>
                <CopyBtn text={userApiKey} />
              </div>
            ) : (
              <div className='bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700'>
                Chưa có API Key → <strong>Profile</strong>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout */}
        <div className='flex-1 flex overflow-hidden'>

          {/* Left: Info */}
          <div className='flex-1 overflow-y-auto p-6 space-y-5 border-r border-gray-100'>

            {/* Description */}
            <p className='text-sm text-gray-600 leading-relaxed m-0'>{ep.description}</p>

            {/* Parameters */}
            {ep.parameters && ep.parameters.length > 0 && (
              <div>
                <h3 className='text-sm font-semibold text-gray-800 mb-2'>Parameters</h3>
                <div className='rounded-lg border border-gray-200 overflow-hidden'>
                  <table className='w-full text-sm'>
                    <thead>
                      <tr className='bg-gray-50'>
                        <th className='text-left px-4 py-2 font-semibold text-gray-600 text-xs'>Tên</th>
                        <th className='text-left px-4 py-2 font-semibold text-gray-600 text-xs'>Kiểu</th>
                        <th className='text-left px-4 py-2 font-semibold text-gray-600 text-xs'></th>
                        <th className='text-left px-4 py-2 font-semibold text-gray-600 text-xs'>Mô tả</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {ep.parameters.map(p => (
                        <tr key={p.name}>
                          <td className='px-4 py-2.5'><code className='font-mono bg-gray-100 px-1.5 py-0.5 rounded text-rose-600 text-xs'>{p.name}</code></td>
                          <td className='px-4 py-2.5 text-gray-500 text-xs'>{p.type}</td>
                          <td className='px-4 py-2.5'>
                            {p.required
                              ? <span className='text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded'>Required</span>
                              : <span className='text-[10px] font-bold text-gray-400'>Optional</span>}
                          </td>
                          <td className='px-4 py-2.5 text-gray-600 text-xs'>{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body */}
            {ep.requestBody && (
              <div>
                <h3 className='text-sm font-semibold text-gray-800 mb-2'>Request Body</h3>
                <div className='bg-gray-900 rounded-lg overflow-hidden'>
                  <div className='flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700'>
                    <span className='text-gray-400 text-xs'>application/json</span>
                    <CopyBtn text={ep.requestBody} />
                  </div>
                  <pre className='p-4 overflow-x-auto text-sm leading-relaxed m-0'><code className='text-gray-300 font-mono'>{ep.requestBody}</code></pre>
                </div>
              </div>
            )}

            {/* Example Responses */}
            <div>
              <h3 className='text-sm font-semibold text-gray-800 mb-2'>Responses</h3>
              <div className='flex gap-2 mb-3'>
                {ep.statusCodes.map(s => (
                  <button key={s} onClick={() => setSelectedStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedStatus === s
                        ? s.startsWith('2') ? 'bg-green-50 text-green-700 border-green-300 ring-1 ring-green-200' : 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}>{s}</button>
                ))}
              </div>
              <div className='bg-gray-900 rounded-lg overflow-hidden'>
                <pre className='p-4 overflow-x-auto text-sm leading-relaxed m-0'><code className='text-gray-300 font-mono'>{ep.responses[selectedStatus] || 'No data'}</code></pre>
              </div>
            </div>
          </div>

          {/* Right: Code + Try it */}
          <div className='w-[480px] flex-shrink-0 flex flex-col overflow-hidden bg-gray-50'>

            {/* Language tabs */}
            <div className='flex items-center gap-1 px-4 py-3 border-b border-gray-200 bg-white'>
              <Terminal size={14} className='text-gray-400 mr-1' />
              {LANGS.map(l => (
                <button key={l} onClick={() => setSelectedLang(l)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedLang === l ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                  }`}>{l}</button>
              ))}
            </div>

            {/* Code block */}
            <div className='flex-1 overflow-y-auto'>
              <div className='bg-gray-900 m-4 mb-2 rounded-lg overflow-hidden'>
                <div className='flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700'>
                  <span className='text-gray-400 text-xs font-medium'>{selectedLang}</span>
                  <CopyBtn text={code} />
                </div>
                <pre className='p-4 overflow-x-auto text-[13px] leading-relaxed m-0'><code className='text-gray-300 font-mono'>{code}</code></pre>
              </div>

              {/* Try it button */}
              <div className='px-4 py-3'>
                <button onClick={tryIt} disabled={loading || !userApiKey}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    userApiKey
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}>
                  {loading ? <Loader2 size={16} className='animate-spin' /> : <Play size={16} />}
                  {loading ? 'Đang gọi API...' : userApiKey ? 'Chạy thử với API Key của bạn' : 'Cần API Key để chạy thử'}
                </button>
              </div>

              {/* Live response */}
              {liveRes && (
                <div className='bg-gray-900 mx-4 mb-4 rounded-lg overflow-hidden'>
                  <div className='flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700'>
                    <span className='text-gray-400 text-xs font-medium'>Response</span>
                    {liveStatus !== null && (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                        liveStatus >= 200 && liveStatus < 300 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>{liveStatus || 'Error'}</span>
                    )}
                    <div className='flex-1' />
                    <CopyBtn text={liveRes} />
                  </div>
                  <pre className='p-4 overflow-x-auto text-[13px] leading-relaxed max-h-[300px] m-0'><code className='text-gray-300 font-mono'>{liveRes}</code></pre>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
