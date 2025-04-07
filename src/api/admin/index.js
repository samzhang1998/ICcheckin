import request from "../base";

export function addCompany(data) {
    return request("/company/add", "POST", data);
}

export default {
    addCompany
}
