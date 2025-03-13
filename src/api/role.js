import { http } from '@/utils/request';
 
export function saveAsManagerApi(userId) { 
    return http.put('userRole/'+userId+'/managers' );
} 
 