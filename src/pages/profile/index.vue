<template>
    <view class="maindiv">
        <view class="title">
            <text>My Profile</text>
        </view>
        <view class="userinfo">
            <view class="avartor">
                {{ user.firstName[0] }}{{ user.lastName[0] }}
            </view>
            <view class="info">
                <view class="name">{{ user.firstName }} {{ user.lastName }}</view>
                <view class="position">{{user.region}} / {{ user.department }} </view>
                <view class="role"> {{ user.role[0] }}</view>
            </view>
        </view>
        <view class="details">
            <view class="header"  @click="goto('/pages/profile/data')">
                <view class="header-left">
                    <image src="/static/i.png" alt="logo" class="i-img" />
                    <view class="header-txt">General Info</view>
                </view>
                <image src="/static/Edit_light.png" alt="logo" class="i-img imgfloatright" />
            </view>
            <view class="infors">
                <view class="info-title">
                    Email
                </view>
                <view class="info-value">
                    {{user.email}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Contact Number
                </view>
                <view class="info-value">
                    {{user.phone}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Address
                </view>
                <view class="info-value">
                    {{user.address}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Area
                </view>
                <view class="info-value">
                    {{user.region}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Department
                </view>
                <view class="info-value">
                    {{user.department}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Title
                </view>
                <view class="info-value">
                    {{user.title}}
                </view>
            </view>
            <view class="infors">
                <view class="info-title">
                    Working Time
                </view>
                <view class="info-value">
                    {{user.startOnTime}} -  {{user.endOnTime}}  
                </view>
            </view>
        </view>  
        <view class="btn btnAttendancet"   @click="goto('/pages/profile/password')"> 
            <view class="msglout">Change Password</view>
        </view>

        <view class="btn btnlogout" @click="logout">
            <image src="/static/logout.png" alt="logo" class="logoutimg img" />
            <view class="msglout">Log Out</view>
        </view>

    </view>
</template>

<script>
    import {
        updateUserApi,
        getUserDetailApi,
        logoutRequestApi
    } from "@/api/users";
    export default {
        data() {
            return {
                event: {
                    activetime: 6,
                    name: "SEO Meeting with Lee Massage",
                    date: "24 Feb 2025",
                    time: "3pm - 4pm",
                    note: "note",
                    righttxt: "Shuoqi Wang"
                },
                user: {
                    email: "",
                    lastName: "",
                    firstName: "",
                    phone: "",
                    department: "",
                    title: "",
                    role: ""
                },
                isemployee: false,
                isadmin: false
            };
        },
        methods: {
            logout() {
                logoutRequestApi({
                    userId: uni.getStorageSync("id")
                }).then((res) => {});
                const remember = uni.getStorageSync("rememberUser")
                if (remember) {
                    const email = uni.getStorageSync("savedEmail");
                    const password = uni.getStorageSync("savedPassword");
                    uni.clearStorageSync();
                    uni.setStorageSync("savedEmail", email);
                    uni.setStorageSync("savedPassword", password);
                } else {
                    uni.clearStorageSync();
                }
                uni.navigateTo({
                    url: '/pages/index/index' // 目标页面的路径
                });
                return
            },
            goto(url) {
                uni.navigateTo({
                    url: url // 目标页面的路径
                });

            },
            getUserInfo() {
                this.user.token = uni.getStorageSync("token");
                if (this.user.token == '') {
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return
                }
                this.user = uni.getStorageSync("userinfo")
                if (this.user.role[0] === "EMPLOYEE") {
                    this.isemployee = true
                } else {
                    this.isemployee = false
                }
                if (this.user.role[0] === "ADMIN") {
                    this.isadmin = true
                    uni.setTabBarItem({
                        index:0,
                        pagePath:"/pages/home/adminhome",
                    })
                    uni.setTabBarItem({
                        index:1,
                        visible:true,
                    })
                } else if (this.user.role[0] === "MANAGER") {
                    uni.setTabBarItem({
                        index:1,
                        pagePath:"/pages/home/manager-attendance",
                    })
                } else {
                    this.isadmin = false
                    uni.setTabBarItem({
                        index:1,
                        visible:false,
                    }) 
                } 
            }
        },
        onShow() {
            this.getUserInfo()
        },
        mounted() {},
    }
</script>

<style scoped lang="scss" src="./index.scss">

</style>