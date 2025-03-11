import { http } from '@/utils/request';
 
export function getEventsApi(userid, params) {
    return http.get('events/users/'+userid+'/events', params)
}
 