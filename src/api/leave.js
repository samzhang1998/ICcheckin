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

export {
    leaveBalanceRequest,
    leaveInfoRequest,
    sendLeaveRequest
}