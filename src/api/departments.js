import { http } from '@/utils/request';
 
export function postAddressApi(payload) {
    return http.post('/address/address/', payload);
} 
export function getAdminRequestApi(params) {
    return http.get('admin/getRequests', params)
}

export function getDepartmentsApi(params) {
    return http.get('departments/', params)
}