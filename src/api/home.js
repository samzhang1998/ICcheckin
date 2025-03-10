import request from "./base";

function clockInRequest (body) {
    return request("/attendances/checkins", "POST", body);
}

function clockOutRequest (body) {
    return request("/attendances/checkouts", "POST", body);
}

function attendanceTodayRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/today?userId=${userId}`, "GET")
}

function departmentRequest () {
    return request("/users/departmentInfos", "GET");
}

function attendanceAllRequest () {
    const userId = localStorage.getItem("id");
    return request(`/attendances/all?userId=${userId}`, "GET");
}

function workingHoursToday (checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime) {
        const workingHrs = "0:00 Hrs";
        return workingHrs;
    }
    const [inHours, inMinutes] = checkInTime.split(":").map(Number);
    const [outHours, outMinutes] = checkOutTime.split(":").map(Number);
    const range = inHours*60 + inMinutes - outHours*60 - outMinutes;
    if (range < 0) {
        const workingHrs = "Invalid";
        return workingHrs;
    }
    const hours = Math.floor(range / 60);
    const minutes = range % 60;
    const workingHrs = `${hours}:${minutes} Hrs`;
    console.log("working today:", workingHrs);
    return workingHrs;
}

export {
    clockInRequest,
    clockOutRequest,
    attendanceTodayRequest,
    departmentRequest,
    attendanceAllRequest,
    workingHoursToday
}