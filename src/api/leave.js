import request from "./base";

function leaveBalanceRequest () {
    const userId = uni.getStorageSync("id");
    return request(`/users/${userId}/leaveBalances`, "GET");
}

function leaveInfoRequest () {
    const userId = uni.getStorageSync("id");
    return request(`/users/${userId}/requests`, "GET");
}

function specificLeave (id) {
    return request(`/requests/${id}`, "GET");
}

function sendLeaveRequest (body) {
    return request("/requests/apply", "POST", body);
}

function sendRemoteRequest (body) {
    return request("/requests/applyRemote", "POST", body);
}

function cancelLeaveRequest (id) {
    return request(`/requests/${id}/cancellation`, "PUT");
}

export {
    leaveBalanceRequest,
    leaveInfoRequest,
    sendLeaveRequest,
    sendRemoteRequest,
    specificLeave,
    cancelLeaveRequest
}

import { http } from '@/utils/request';
 
export function leaveApprovalApi(payload) {
    return http.put('admin/approval', payload);
}

export function remoteApprovalApi(payload) {
    return http.put('admin/approveRemote', payload);
}
 
export function getRequestsApi(params) {
    return http.get('admin/getRequests', params)
}

export function getLeaveTotalApi(userid) {
    return http.get('users/'+userid+'/leaveBalances')
}
