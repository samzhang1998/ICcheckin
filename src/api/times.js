import { http } from '@/utils/request';
 
export function updateTimeApi(payload, params) {
    return http.put('admin/clockTime', payload, {params:params});
} 
export function getTimeApi(params) {
    return http.get('admin/clockTime', params)
}
 