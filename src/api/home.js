import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "POST", body);
}

function attendanceTodayRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/today?userId=${userId}`, "GET");
}

function attendanceAllRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/all?userId=${userId}`, "GET");
}

export {
    clockInRequest,
    attendanceTodayRequest,
    attendanceAllRequest
}