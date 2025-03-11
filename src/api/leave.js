import request from "./base";

function leaveBalanceRequest () {
    const userId = localStorage.getItem("id");
    return request(`/users/${userId}/leaveBalances`, "GET");
}

export {
    leaveBalanceRequest
}

import { http } from '@/utils/request';
 
export function leaveApprovalApi(payload) {
    return http.put('admin/approval', payload);
} 
 
export function getRequestsApi(params) {
    return http.get('admin/getRequests', params)
}

export function getLeaveTotalApi(userid) {
    return http.get('users/'+userid+'/leaveBalances')
}
