import request from "./base";

function leaveBalanceRequest () {
    const userId = localStorage.getItem("id");
    return request(`/users/${userId}/leaveBalances`, "GET");
}

export {
    leaveBalanceRequest
}