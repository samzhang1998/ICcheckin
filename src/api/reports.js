import { http } from '@/utils/request';
 
export function getWeekApi(params) {
    return http.get('csv/weeklyAttendance', params)
}
export function getQuarterApi(params) {
    return http.get('csv/quarterlyAttendance', params)
}