import request from "./base";

function getOfficeRequest () {
    return request("/companys", "GET");
}

function getRoleRequest () {
    return request("/userRole/roles", "GET");
}

function createUserRequest (body) {
    return request("/admin/createUser", "POST", body);
}

function addLeaveBalance (body) {
    return request("/admin/addUserLeaveBalance", "POST", body);
}

function getLeaveTypeRequest () {
    return request("/admin/getLeaveTypes", "GET");
}

export { 
    getOfficeRequest,
    getRoleRequest,
    createUserRequest,
    addLeaveBalance,
    getLeaveTypeRequest
}