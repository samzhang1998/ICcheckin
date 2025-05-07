import request from "./base";

function logInRequest (email, password) {
    return request("/login/", "POST", {email, password});
}

function deleteToken (token) {
    return request(`/device-tokens/${token}`, "DELETE");
}

function visitorLoginRequest () {
	return request("/visitor/login", "POST")
}

export {
    logInRequest,
    deleteToken,
	visitorLoginRequest
}