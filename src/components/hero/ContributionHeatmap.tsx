import { useEffect, useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import { fetchPVData, getDateRange } from '@/utils/analytics'
import type { HeatmapValue } from '@/types/analytics'
import { useAtomValue } from 'jotai'
import { themeAtom } from '@/store/theme'
import 'react-calendar-heatmap/dist/styles.css'

export function ContributionHeatmap() {
  const [data, setData] = useState<HeatmapValue[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useAtomValue(themeAtom)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const { startDate, endDate } = getDateRange(365)
      const pvData = await fetchPVData(startDate, endDate)
      setData(pvData)
      setLoading(false)
    }

    loadData()
  }, [])

  // 计算颜色等级（根据 PV 数量）
  const getColorClass = (value: any) => {
    if (!value || !value.count || value.count === 0) return 'color-empty'
    if (value.count < 10) return 'color-scale-1'
    if (value.count < 20) return 'color-scale-2'
    if (value.count < 30) return 'color-scale-3'
    return 'color-scale-4'
  }

  const { startDate, endDate } = getDateRange(365)

  if (loading) {
    return (
      <div className="w-[500px] h-[140px] flex items-center justify-center">
        <div className="animate-pulse text-secondary">加载访问数据中...</div>
      </div>
    )
  }

  return (
    <div className="">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">
          访问热力图
        </h3>
      </div>

      <div className={`heatmap-container ${theme}`}>
        <CalendarHeatmap
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          values={data}
          classForValue={getColorClass}
          showWeekdayLabels
        />
      </div>
    </div>
  )
}
