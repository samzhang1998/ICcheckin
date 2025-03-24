import request from "./base";

function getUserNotification (id) {
    return request(`/notifications/users/${id}?size=30`, "GET");
}

function setNotificationRead (id) {
    return request(`/notifications/${id}/mark-as-read`, "PUT");
}

function getAllNotification () {
    return request("/notifications/pendings", "GET");
}

function initializePushNotifications () {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('Push notifications permission denied.');
      }
    });
  
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success:', token.value);
      // Send this token to your Spring Boot backend
    });
  
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });
  
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });
  
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push action performed:', action);
    });
}

export {
    getUserNotification,
    setNotificationRead,
    getAllNotification,
    initializePushNotifications
}
