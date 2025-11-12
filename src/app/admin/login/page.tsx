'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '登录失败，请稍后重试')
        setLoading(false)
        return
      }

      const redirect = searchParams.get('redirect') || '/admin/dashboard'
      setTimeout(() => {
        window.location.href = redirect
      }, 200)
    } catch (err) {
      console.error('登录错误:', err)
      setError('网络错误，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-100/10 bg-white/5 shadow-2xl shadow-slate-950/40 backdrop-blur">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-[var(--admin-sidebar)] px-10 py-12 text-white lg:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-white/60">Azuxa Admin</p>
            <h1 className="mt-6 text-3xl font-semibold">管理中台登录</h1>
            <p className="mt-4 text-white/70">访问站点内容、编辑工作流与系统监控。需要帮助时请联系运维团队。</p>
          </div>
        </div>

        <div className="px-8 py-10 text-slate-900 lg:px-12">
          <div>
            <h2 className="mt-3 text-3xl font-semibold text-white/100">欢迎回来</h2>
            <p className="mt-2 text-sm text-slate-500">请输入管理员账号和密码。</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-slate-600">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-white/100 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20"
                placeholder="请输入用户名"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-600">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-white/100 placeholder:text-slate-400 focus:border-[var(--admin-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]/20"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[var(--admin-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-[var(--admin-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-xs text-slate-500">
            <p>© 2025 Azuxa&apos;s BlogSpace · 内部环境</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-100/10 bg-white/5 p-12 text-center text-white shadow-2xl shadow-slate-950/40">
      <p className="text-sm text-white/70">正在加载登录模块...</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-[160px]" />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 text-white">
        <Suspense fallback={<AuthFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
