 
import request from "./base";
export function sendOutsideClockin(data ) {
    return request('/affairs/',"post", data, 'multipart/form-data')
}
 