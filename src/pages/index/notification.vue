<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="goBack" />
            <text>Notification</text> 
        </view>      
        <view class="statuses">
            <view class="status" @click="changestatus(1)" :class="{activestatus:status==1}">All</view>
            <view class="status"  @click="changestatus(2)"  :class="{activestatus:status==2}">Unread</view>
        </view>
        <view 
            v-for="(item, index) in filtersNotifications"
            :key="index"
            class="notification" 
            @click="read(item.notificationId, item.requestId)">
            <view v-if="item.isRead === false" class="red_dot"></view>
            <view class="avator">
                {{ item.userName[0] }}
            </view>
            <view >
                <view class="sub_title">
                    <text class="note">{{ item.userName }}</text>
                    <text class="time">{{ item.createdAt }}</text>
                </view>
                <view class="notificationtype">{{ item.requestType }}</view>
                <view class="msg">{{ item.message }}</view>
            </view>
        </view>          
    </view>
</template>

<script>
    import { getUserNotification, setNotificationRead, getAllNotification } from '@/api/notification'
    export default {
        data () {
            return {
                filtersNotifications:[],
                status:1,// 1 for all 2 for unread
                role: uni.getStorageSync("role"),
                id: uni.getStorageSync("id"),
                notifications: [],
                options: [
                    {
                        text: "Mark as Read",
                        style: {
                            backgroundColor: "#007aff",
                            color: "#fff"
                        }
                    }
                ]
            }
        },
        methods: {
            changestatus(status){
                this.status = status
                if (this.status == 1){
                    this.filtersNotifications= this.notifications
                }else{
                    this.filtersNotifications = this.notifications.filter((item)=>{
                        return item.isRead == false
                    })
                }
            },
            goBack () {
                uni.navigateBack({
                    delta: 1
                });
            },
            async getNotification () {
                if (this.role[0] === "ADMIN") {
                    try {
                        const res = await getAllNotification();
                        console.log(res)
                        if (res.statusCode === 200) {
                            this.notifications = res.data.data.sort((a, b) => {
                                const dateA = new Date(a.createdAt.split(" ")[0].split("-").reverse().join("-") + "T" + a.createdAt.split(" ")[1]);
                                const dateB = new Date(b.createdAt.split(" ")[0].split("-").reverse().join("-") + "T" + b.createdAt.split(" ")[1]);
                                return dateB - dateA;
                            });
                            this.filtersNotifications = this.notifications
                            console.log("notification:", this.notifications);
                        } else {
                            console.log(res);
						    uni.showToast({ title: "Fail to get notifications", icon: "none" });
                        }
                    } catch (error) {
                        console.error("error:", error);
					    uni.showToast({ title: "Error of getting notifications", icon: "none" });
                    }
                } else {
                    try {
                        const res = await getUserNotification(this.id);
                        if (res.statusCode === 200) {
                            console.log("notifiction data:")
                            console.log(res.data.data)
                            this.notifications = res.data.data;
                            this.filtersNotifications = this.notifications
                            console.log("notification:", this.notifications);
                        } else {
                            console.log(res);
						    uni.showToast({ title: "Fail to get notifications", icon: "none" });
                        }
                    } catch (error) {
                        console.error("error:", error);
					    uni.showToast({ title: "Error of getting notifications", icon: "none" });
                    }
                }
            },
            async read (id, request) {
                uni.setStorageSync("thisRequest", request);
                if (this.role[0] === "ADMIN") {
                    try {
                        const res = await setNotificationRead(id);
                        if (res.statusCode === 200) {
                            console.log("read success", res);
                            uni.navigateTo({ url: "/pages/manager/detail" });
                        }
                    } catch (error) {
                        console.error("error:", error);
                        uni.showToast({ title: "Error", icon: "none" });
                    }
                } else {
                    try {
                        const res = await setNotificationRead(id);
                        if (res.statusCode === 200) {
                            console.log("read success", res);
                            uni.navigateTo({ url: "/pages/manager/notification-detail" });
                        }
                    } catch (error) {
                        console.error("error:", error);
                        uni.showToast({ title: "Error", icon: "none" });
                    }
                }                
            }
        },
        onShow () {
            this.getNotification();
        }
    }
</script>

<style scoped lang="scss">
    .maindiv{
        width: 750rpx;
        min-height: 100vh;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center; 
        //border:1px solid red;
        .statuses{
            width: 670rpx;
            //border:1px solid red;
            display: flex;
            border-radius: 35rpx;
            margin-top: 20rpx;
            margin-bottom: 20rpx;;
            background-color: white;
            justify-content: space-between ;
            .status{
                //
                text-align: center;
                width: 350rpx;
                height: 70rpx;
                font-family: Inter;
                font-weight: 500;
                line-height:  70rpx;
            }
            .activestatus{
                border-radius: 35rpx;
                color:white;
                background-color: #EFC462;
            }
        }
        .title {
            width: 750rpx;
            height: 150rpx;
            padding-bottom: 30rpx;
            background: #fff;
            display: flex;
            align-items: end;
            justify-content: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .title image {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            left: 40rpx;
        }
        .title text {
            color: #101828;
            font-family: Nunito;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .notification {
            width: 650rpx;
            padding: 30rpx 20rpx;
            display: flex;
            flex-direction: row;
            align-items: start;
            border-radius: 10px;
            background: #FFF;
            margin-top: 15rpx;
            .avator{
                margin-right: 15rpx;
                width: 96rpx;
                height: 96rpx;
                line-height: 96rpx;
                text-align: center;
               // background-color: ;
                border-radius: 30px;
                border: 1px solid #FFF;
                background-color: #EFC462;
                color:white;
                font-family: Inter;
                font-size: 24px;
                font-style: normal;
                font-weight: 500;
            }
            .red_dot {
                position: absolute;
                right: 50rpx;
                width: 12rpx;
                height: 12rpx;
                background-color: red;
                border-radius: 50%;
            }
            .sub_title {
                width: 400rpx;
                display: flex;
                flex-direction: row;  
                .note {
                    color: #101828;
                    text-align: center;
                    font-family: Nunito; 
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.28px;
                }
                .time {
                    color: #838383;
                    text-align: center;
                    font-family: Nunito; 
                    font-style: normal;
                    font-weight: 300;
                    font-size: 12px;
                    margin-top: 5px;
                    margin-left: 5px;
                    line-height: normal;
                    letter-spacing: -0.2px;
                }
            }
            .notificationtype{
                color:#808080;
                font-size: 12px;
                font-weight: 500;
            }
            .msg {
                color: #101828;
                text-align: center;
                font-family: Nunito; 
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: -0.2px;
            }
        }
    }
</style>