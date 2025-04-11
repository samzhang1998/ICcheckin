import { http } from '@/utils/request';
 
export function getTodayAttendances( userId ) {
    return http.get('attendances/today', {userId :userId })
}
 
 export function getRecords( day ) {
     return http.get('attendances/records', {day:day})
 }
 