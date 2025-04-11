 
 
import { http } from '@/utils/request';
 
export function sendOutsideClockin( data ) { 
    return http.post('affairs/', data)
}

export function getOutsideClockin( data ) { 
    return http.get('attendances/records', data)
}
