import request from "./base";

function getOfficeRequest () {
    return request("/companys", "GET");
}

function getRoleRequest () {
    return request("/userRole/roles", "GET");
}

export { 
    getOfficeRequest,
    getRoleRequest
}