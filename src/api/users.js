import { http } from '@/utils/request';
import request from "./base";
 
export function getUsersApi(params) {
    return http.get('users/', params)
}


export function getUserDetailApi(userid) {
    return http.get('users/'+userid+'/details')
}

export function changePwdApi(userid, payload) {
    return http.put('users/'+userid+'/password', payload)
}


export function updateUserApi( payload) {
    return http.put('users/editDetails', payload);
} 


export function logoutApi() {
    return http.put('logout', null, null)
}

export function logoutRequestApi(userId) {
    return request('/logout/', 'POST', userId)
}
