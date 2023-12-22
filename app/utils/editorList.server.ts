import api from './api';
import { ApiError, ApiResponse } from './types';
import dayjs from 'dayjs'

interface MyData {
  // 定義你的數據結構
  id: number;
  name: string;
}

export async function fetchEditorList(): Promise<Article[]> {

  const theDayThreeMonthsAgo_FORMATTED = dayjs().subtract(12, 'month').format('YYYY-MM-DD')
  const today_FORMATTED = dayjs().format('YYYY-MM-DD') // 08:00:00

  function parseStartOfDate_NUMBER(startDate: string) {
    return new Date(`${dayjs(startDate).format('YYYY-MM-DD')} 00:00:00`).getTime()
  }

  function parseEndOfDate_NUMBER(endDate: string) {
    return new Date(`${dayjs(endDate).format('YYYY-MM-DD')} 23:59:59`).getTime()
  }

  const startDate = parseStartOfDate_NUMBER(theDayThreeMonthsAgo_FORMATTED)
  const endDate = parseEndOfDate_NUMBER(today_FORMATTED)
  // editor?limit=10000&startDate=${startDate}&endDate=${endDate}&pageNumber=${1}&status=全部
  try {
    const response = await api.get<EditorListResponse>(`/editor?limit=10000&startDate=${startDate}&endDate=${endDate}&pageNumber=${1}&status=全部`)
      .then(res => res.data.data)
    return response;
  } catch (error) {
    throw error;
  }
}