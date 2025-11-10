'use client'

import { useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent, DatasetComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'

import { PageHeader, OverviewCard, ChartPanel } from '../_components'

echarts.use([LineChart, BarChart, PieChart, TooltipComponent, GridComponent, LegendComponent, DatasetComponent, CanvasRenderer])

const stats = [
  {
    title: '总游客数',
    value: '18,240',
    trend: '',
    trendLabel: '浏览量',
    variant: 'warning' as const,
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 12a7 7 0 1113.9 2.32" opacity="0.5" />
        <path d="M5 12v7m0 0h7" />
        <path d="M5 19l6.5-6.5" />
      </svg>
    ),
  },
  {
    title: '已发布内容',
    value: '54 篇文章',
    trend: '',
    trendLabel: '工作流',
    variant: 'default' as const,
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h14v16H5z" opacity="0.4" />
        <path d="M8 8h8" />
        <path d="M8 12h6" />
        <path d="M8 16h5" />
      </svg>
    ),
  },
]

const systemHealth = [
  { label: 'CPU 使用率', value: '46%', subLabel: '8 核心', trend: '+4.6%', tone: 'text-amber-400' },
  { label: '内存使用率', value: '63%', subLabel: '32 GB', trend: '-2.8%', tone: 'text-emerald-400' },
  { label: '请求数/分钟', value: '1.8k', subLabel: '98分位 280ms', trend: '+9.1%', tone: 'text-blue-400' },
]


const distributionData = [
  { value: 38, name: '技术' },
  { value: 22, name: '产品' },
  { value: 18, name: '文化' },
  { value: 12, name: '运营' },
  { value: 10, name: '社区' },
]

function EChartCanvas({ option, height = 320 }: { option: EChartsOption; height?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)
    chart.setOption(option)
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [option])

  return <div ref={ref} style={{ height }} className="w-full" />
}

export default function DashboardPage() {
  const growthOption = useMemo<EChartsOption>(() => ({
    grid: { left: 40, right: 20, top: 40, bottom: 30 },
    tooltip: { trigger: 'axis', backgroundColor: '#0f172a', textStyle: { color: '#e2e8f0' }, borderColor: '#1e293b' },
    legend: { data: ['游客数', '浏览量'], top: 0, textStyle: { color: '#64748b' } },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: '#cbd5f5' } },
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      {
        name: '游客数',
        type: 'line',
        smooth: true,
        data: [820, 932, 901, 934, 1020, 1130, 1290],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(37, 99, 235, 0.4)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.05)' },
          ]),
        },
        lineStyle: { width: 3 },
        symbolSize: 8,
      },
      {
        name: '浏览量',
        type: 'line',
        smooth: true,
        data: [420, 532, 601, 734, 890, 930, 1050],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(14, 165, 233, 0.35)' },
            { offset: 1, color: 'rgba(14, 165, 233, 0.05)' },
          ]),
        },
        lineStyle: { width: 3 },
        symbolSize: 8,
      },
    ],
  }), [])


  const requestOption = useMemo<EChartsOption>(() => ({
    grid: { left: 30, right: 10, top: 40, bottom: 30 },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['0时', '4时', '8时', '12时', '16时', '20时'], axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [
      {
        data: [900, 1120, 1320, 1520, 1220, 980],
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          borderRadius: 12,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2563eb' },
            { offset: 1, color: '#0ea5e9' },
          ]),
        },
      },
    ],
  }), [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="运营仪表板"
        description="观察游客数、已发布内容和系统健康状态。"
        actions={
          <Link
            href="/admin/content"
            className="rounded-2xl bg-[var(--admin-primary)] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[var(--admin-primary-hover)]"
          >
            新建条目
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {stats.map((card) => (
          <OverviewCard key={card.title} {...card} />
        ))}
        <div className="lg:col-span-2">
          <ChartPanel title="系统健康" description="实时基础设施快照" actions={<span className="text-xs text-slate-400">自动刷新 · 30秒</span>}>
            <div className="grid gap-4 md:grid-cols-3">
              {systemHealth.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200/60 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className={`mt-3 text-3xl font-semibold ${item.tone}`}>{item.value}</p>
                  <p className="text-xs text-slate-400">{item.subLabel}</p>
                  <p className="mt-4 text-sm font-medium text-slate-600">{item.trend}</p>
                </div>
              ))}
            </div>
          </ChartPanel>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ChartPanel title="用户增长" description="7天活跃与留存趋势">
            <EChartCanvas option={growthOption} height={360} />
          </ChartPanel>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ChartPanel title="请求吞吐量" description="每4小时窗口的边缘请求数">
            <EChartCanvas option={requestOption} height={220} />
          </ChartPanel>
        </div>

      </div>



    </div>
  )
}
