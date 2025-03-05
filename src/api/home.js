import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "post", body);
}

export {
    clockInRequest
}