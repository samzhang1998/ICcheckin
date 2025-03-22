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

function deleteUser (id) {
    return request(`/admin/user?id=${id}`, "DELETE");
}

function deleteCompany (id) {
    return request(`/companys/${id}`, "DELETE");
}

function resetUserPassword (id) {
    return request(`/admin/users/${id}/actions/reset-password`, "POST");
}

function reviewLeaveCancel (id, body) {
    return request(`/admin/requests/${id}`, "PUT", body);
}

function addCompany (body) {
    return request("/companys", "POST", body);
}

export { 
    getOfficeRequest,
    getRoleRequest,
    createUserRequest,
    addLeaveBalance,
    getLeaveTypeRequest,
    deleteUser,
    deleteCompany,
    resetUserPassword,
    reviewLeaveCancel,
    addCompany
}