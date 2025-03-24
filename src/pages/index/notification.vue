<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="goBack" />
            <text>Notification</text> 
        </view>      
        <view 
            v-for="(item, index) in notifications"
            :key="index"
            class="notification" 
            @click="read(item.notificationId, item.requestId)">
            <view v-if="item.isRead === false" class="red_dot"></view>
            <view class="sub_title">
                <text class="note">You have a new message</text>
                <text class="time">{{ item.createdAt }}</text>
            </view>
            <text class="msg">{{ item.message }}</text>
        </view>          
    </view>
</template>

<script>
    import { getUserNotification, setNotificationRead, getAllNotification } from '@/api/notification'
    export default {
        data () {
            return {
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
            goBack () {
                uni.navigateBack({
                    delta: 1
                });
            },
            async getNotification () {
                if (this.role[0] === "ADMIN") {
                    try {
                        const res = await getAllNotification();
                        if (res.statusCode === 200) {
                            this.notifications = res.data.data.sort((a, b) => {
                                const dateA = new Date(a.createdAt.split(" ")[0].split("-").reverse().join("-") + "T" + a.createdAt.split(" ")[1]);
                                const dateB = new Date(b.createdAt.split(" ")[0].split("-").reverse().join("-") + "T" + b.createdAt.split(" ")[1]);
                                return dateB - dateA;
                            });
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
                            this.notifications = res.data.data;
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
        gap: 30rpx;
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
            width: 600rpx;
            padding: 30rpx 40rpx;
            display: flex;
            flex-direction: column;
            align-items: start;
            border-radius: 10px;
            background: #FFF;
            gap: 20rpx;
            .red_dot {
                position: absolute;
                right: 50rpx;
                width: 12rpx;
                height: 12rpx;
                background-color: red;
                border-radius: 50%;
            }
            .sub_title {
                width: 600rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                .note {
                    color: #101828;
                    text-align: center;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    letter-spacing: -0.28px;
                }
                .time {
                    color: #838383;
                    text-align: center;
                    font-family: Nunito;
                    font-size: 18rpx;
                    font-style: normal;
                    font-weight: 300;
                    line-height: normal;
                    letter-spacing: -0.2px;
                }
            }
            .msg {
                color: #101828;
                text-align: center;
                font-family: Nunito;
                font-size: 18rpx;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                letter-spacing: -0.2px;
            }
        }
    }
</style>