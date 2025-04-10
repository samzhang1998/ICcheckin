 
 
import { http } from '@/utils/request';
 
export function sendOutsideClockin( data ) {
    console.log(data)
    return http.post('affairs/', data)
}
 