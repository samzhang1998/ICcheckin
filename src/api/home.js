import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "POST", body);
}

function clockOutRequest (body) {
    return request("/attendances/checkouts", "POST", body);
}

function departmentRequest () {
    return request("/users/departmentInfos", "GET");
}

function attendanceAllRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/all?userId=${userId}`, "GET");
}

export {
    clockInRequest,
    clockOutRequest,
    departmentRequest,
    attendanceAllRequest
}