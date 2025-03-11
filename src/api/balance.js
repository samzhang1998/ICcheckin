import { http } from '@/utils/request';
 
  

export function editUserLeaveBalanceApi(payload) {
    return http.post('admin/editUserLeaveBalance', payload);
} 

