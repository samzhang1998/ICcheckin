import request from "./base";

function getOfficeRequest () {
    return request("/companys", "GET");
}

export { 
    getOfficeRequest 
}