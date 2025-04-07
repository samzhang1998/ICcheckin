import { http } from '@/utils/request';
 
export function sendOutsideClockin(data ) {
    return http.post('affairs/', data)
}
 