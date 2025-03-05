import request from "./base";

function logInRequest (email, password) {
    return request("/login/", "post", {email, password});
}

export {
    logInRequest
}