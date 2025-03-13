// import { http } from '@/utils/request';
 
// export function getWeekApi(params) {
//     return http.get('csv/weeklyAttendances', params)
// }
// export function getQuarterApi(params) {
//     return http.get('csv/quarterlyAttendance', params)
// }
import request from "./base";

function getWeekApi (numWeek) {
    return request(`/csv/weeklyAttendances?numWeek=${numWeek}`, "GET");
}

function getQuarterApi () {
    return request("/csv/quarterlyAttendance", "GET");
}

export { getWeekApi, getQuarterApi };