import { http } from '@/utils/request';
 
export function updateTimeApi(payload) {
    return http.put('admin/clockTime', payload);
} 
export function getTimeApi(params) {
    return http.get('admin/clockTime', params)
}
 