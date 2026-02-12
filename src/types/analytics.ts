// GA API 原始响应
export interface GAReportResponse {
  summary: {
    propertyId: string
    rowCount: number
    currencyCode: string
    timeZone: string
  }
  rows: Array<{
    date?: string // 按日期聚合时使用
    pagePath?: string
    activeUsers: number
    screenPageViews: number
  }>
}

// 热力图数据格式
export interface HeatmapValue {
  date: string // YYYY-MM-DD 格式
  count: number // PV 数量
}
