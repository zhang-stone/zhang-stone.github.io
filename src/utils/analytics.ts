import type { GAReportResponse, HeatmapValue } from '@/types/analytics'

const API_ENDPOINT = 'https://blog-server-tau.vercel.app/api/ga-report'

export async function fetchPVData(startDate: string, endDate: string): Promise<HeatmapValue[]> {
  try {
    // 调用 API
    const url = new URL(API_ENDPOINT)
    url.searchParams.set('startDate', startDate)
    url.searchParams.set('endDate', endDate)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error('Failed to fetch PV data')
    }

    const data: GAReportResponse = await response.json()

    // 转换为热力图格式
    // 如果 API 返回按日期聚合的数据
    const heatmapData: HeatmapValue[] = data.rows
      .filter((row) => row.date) // 只处理有日期的数据
      .map((row) => ({
        date: row.date!,
        count: row.screenPageViews,
      }))

    // 如果数据为空，生成模拟数据用于演示
    if (heatmapData.length === 0) {
      return generateMockData(startDate, endDate)
    }

    return heatmapData
  } catch (error) {
    console.error('Error fetching PV data:', error)
    // 出错时返回模拟数据
    return generateMockData(startDate, endDate)
  }
}

// 生成模拟数据（用于开发和演示）
function generateMockData(startDate: string, endDate: string): HeatmapValue[] {
  const data: HeatmapValue[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // 随机生成 0-50 的浏览量，工作日较多
    const isWeekend = d.getDay() === 0 || d.getDay() === 6
    const baseCount = isWeekend ? 5 : 15
    const randomCount = Math.floor(Math.random() * (isWeekend ? 20 : 35))

    data.push({
      date: d.toISOString().split('T')[0],
      count: baseCount + randomCount,
    })
  }

  return data
}

// 获取最近 N 天的日期范围
export function getDateRange(days: number = 365) {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  }
}
