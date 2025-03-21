<template>
	<view class="maindiv">
        <view class="title">
            <text>My Profile</text> 
        </view> 
        <view class="userinfo">
            <view class="name">{{ user.firstName }}  {{ user.lastName }}</view>
            <view class="position">{{ user.department }} {{ user.title }}</view> 
        </view>
        <view class="item">
            <view class="itemtitle">Contact</view>
            <view class="itemcontents">
                <view class="itemcontent"> 
                    <image src="/static/sms.png" alt="logo" class="img"  />
                    <view class="msg">{{ user.email }}</view>
                </view>  
                <view class="itemcontent"> 
                    <image src="/static/phone.png" alt="logo" class="img"  />
                    <view class="msg">{{ user.phone }}</view>
                </view>
            </view>
        </view> 
        <view class="item">
            <view class="itemtitle">Account</view>
            <view class="itemcontents">
                <view class="itemcontent" @click="goto('/pages/profile/data')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <view class="msg">Personal Data</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>  
                <view class="itemcontent" v-if="isadmin" @click="goto('/pages/manager/management/office')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <view class="msg">Office Setting</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
            </view>
        </view>
        <view class="item" v-if="!isemployee">
            <view class="itemtitle">Management</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/manager/management/list')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <view class="msg">Employee Management</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>  
                <view class="itemcontent" v-if="isadmin" @click="goto('/pages/manager/settings')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <view class="msg">Attendance Setting</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
                <view class="itemcontent" @click="goto('/pages/manager/report')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <view class="msg">Attendance Report</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>   
            </view>
        </view> 
        <view class="item" :style="{marginBottom: '30rpx'}">
            <view class="itemtitle">Settings</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/profile/password')"> 
                    <image src="/static/setting.png" alt="logo" class="img"  />
                    <view class="msg">Change Password</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
                <view class="itemcontent" @click="logout"> 
                    <image src="/static/logout.png" alt="logo" class="img"  />
                    <view class="msg">Logout</view>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>  
            </view>
        </view>
	</view>
</template>
  
<script>
import {updateUserApi, getUserDetailApi, logoutRequestApi} from "@/api/users";
	export default {
        data() {
            return { 
               event:   {
                    activetime:6,
                    name:"SEO Meeting with Lee Massage",
                    date:"24 Feb 2025",
                    time:"3pm - 4pm",
                    note:"note",
                    righttxt:"Shuoqi Wang"
                }  ,
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    department:"",
                    title:"",
                    role:"" 
                },
                isemployee: false,
                isadmin: false
            };
        },
		methods: { 
            logout(){
                logoutRequestApi({userId: uni.getStorageSync("id")}).then((res)=>{});
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
            goto(url){ 
                uni.navigateTo({
                    url: url // 目标页面的路径
                });
            
            },
            getUserInfo(){
                this.user.token = uni.getStorageSync("token");  
                if (this.user.token == ''){
                    // 跳转登录
                    uni.navigateTo({
                        url: '/pages/index/index' // 目标页面的路径
                    });
                    return 
                }
                this.user.email = uni.getStorageSync("email");  
                this.user.id = uni.getStorageSync("id");  
                this.user.lastName = uni.getStorageSync("lastName");  
                this.user.firstName = uni.getStorageSync("firstName");  
                this.user.phone = uni.getStorageSync("phone");
                this.user.department = uni.getStorageSync("department");  
                this.user.title = uni.getStorageSync("title");  
                this.user.role = uni.getStorageSync("role");  
                console.log("///////////////////////////////") 
                console.log(this.user.role)
                if (this.user.role[0] === "EMPLOYEE") {
                    this.isemployee = true
                } else {
                    this.isemployee = false
                }
                if (this.user.role[0] === "ADMIN") {
                    this.isadmin = true
                } else {
                    this.isadmin = false
                }
                console.log(this.user)
            }
		},
        onShow () {
            this.getUserInfo()
        },
        mounted () { 
        }, 
	}
</script>
  
<style scoped lang="scss">
	.maindiv {
        width: 750rpx;
        min-height: 100vh; 
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20rpx;
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
        .title text {
            color: #101828;
            font-size: 35rpx;
            font-weight: 600;
            line-height: 140%;
            text-align: center;
        }
        .item {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10rpx;
            .itemtitle {
                color: #344054;
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
            .itemcontents {
                width: 640rpx;
                padding: 20rpx;
                border-radius: 8px; 
                border: 1px solid #DADADA;
                background: #FFF;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20rpx;
                .itemcontent {
                    width: 640rpx;  
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10rpx;
                }
                .imgfloatright {
                    width: 36rpx;
                    height: 36rpx;
                }                
                .img { 
                    width: 36rpx;
                    height: 36rpx;
                }
                .msg{
                    flex: 1; 
                    color: #4F5464;
                    font-family: Nunito;
                    font-size: 26rpx; 
                    font-style: normal;
                    font-weight: 500; 
                }
            }
        }
        .userinfo {
            width: 680rpx;
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 10rpx;
            .name {
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 550;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: #101828; 
                font-family: Nunito;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.32px;
            }
        }
    }
</style>
