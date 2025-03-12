import { http } from '@/utils/request';
 
export function saveAsManagerApi(payload, params) {
    return http.put('/userRole/permissions', payload, {params:params});
} 
 