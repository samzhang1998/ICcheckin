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

function signUpRequest (body) {
	return request("/visitor/signup", "POST", body);
}

export {
    logInRequest,
    deleteToken,
	visitorLoginRequest,
	signUpRequest
}