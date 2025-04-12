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

function getLateTotal () {
    return request("/admin/attendances/summary/today-late", "GET")
}

function getAttendancesStatistics (body) {
    return request("/admin/attendances/statistics", "POST", body)
}

function getAllRegion () {
    return request("/regions", "GET")
}

function leaveView (ids, body) {
    return request(`/admin/requests?ids=${ids}`, "PUT", body)
}

function getRecordDepartment (body) {
    return request ("/admin/attendances/departments", "POST", body)
}

function getUserAttendance (body) {
    return request ("/admin/attendances/users", "POST", body)
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
    addCompany,
    getLateTotal,
    getAttendancesStatistics,
    getAllRegion,
    leaveView,
    getRecordDepartment,
    getUserAttendance
}