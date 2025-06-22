import { http } from '@/utils/request';
 
export function getEventsApi(userid, params) {
    return http.get('events/users/'+userid+'/events', params)
}


export function getEventListApi(params){
    return http.get('apiv1.0.0/event/events', params)
}
 

export function getEventDetailApi(eventid ){ 
    return http.get('apiv1.0.0/event/'+eventid  )
}
 
export function EditEventApi(eventid, data){
    return http.put('apiv1.0.0/event/'+eventid,data)
}

export function DeleteEventApi(eventid, data){
    return http.delete('apiv1.0.0/event/'+eventid,data)
}


export function AddEventApi(data){
    return http.post('apiv1.0.0/event',data)
}

export function getAlertEnumApi( ){ 
    return http.get('apiv1.0.0/event/alertEnum'  )
}

export function getRepeatListApi(  ){ 
    return http.get('apiv1.0.0/event/repeatEnum' )
}

export function getUpcomingListApi( params ){ 
    return http.get('apiv1.0.0/event/upcoming/events' , {params})
}