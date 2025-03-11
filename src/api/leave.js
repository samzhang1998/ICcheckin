import request from "./base";

function leaveBalanceRequest () {
    const userId = localStorage.getItem("id");
    return request(`/users/${userId}/leaveBalances`, "GET");
}

function leaveInfoRequest () {
    const userId = localStorage.getItem("id");
    return request(`/users/${userId}/requests`, "GET");
}

function sendLeaveRequest (body) {
    return request("/requests/apply", "POST", body);
}

function sendRemoteRequest (body) {
    return request("/requests/applyRemote", "POST", body);
}

export {
    leaveBalanceRequest, 
    leaveInfoRequest,
    sendLeaveRequest,
    sendRemoteRequest
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
 