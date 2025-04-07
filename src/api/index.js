import request from "./base";

function logInRequest (email, password) {
    return request("/login/", "POST", {email, password});
}

export {
    logInRequest
}