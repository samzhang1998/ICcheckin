import request from "./base";

function leaveBalanceRequest () {
    const userId = uni.getStorageSync("id");
    return request(`/users/${userId}/leaveBalances`, "GET");
}

function leaveInfoRequest () {
    const userId = uni.getStorageSync("id");
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