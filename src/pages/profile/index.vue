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
                    <views class="msg">{{ user.email }}</views>
                </view>  
                <view class="itemcontent"> 
                    <image src="/static/phone.png" alt="logo" class="img"  />
                    <views class="msg">{{ user.phone }}</views>
                </view>
            </view>
        </view> 
        <view class="item"  @click="goto('/pages/profile/data')">
            <view class="itemtitle">Account</view>
            <view class="itemcontents">
                <view class="itemcontent"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <views class="msg">Personal Data</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>  
                <view class="itemcontent" v-if="ismanager"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Office Setting</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
            </view>
        </view>
        <view class="item" v-if="ismanager">
            <view class="itemtitle">Management</view>
            <view class="itemcontents">                 
                <view class="itemcontent"  @click="goto('/pages/manager/management/list')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <views class="msg">Employee Management</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>
                <view class="itemcontent"  @click="goto('/pages/manager/home')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <views class="msg">Leave Management</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>  
                <view class="itemcontent" @click="goto('/pages/manager/settings')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Attendance Setting</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
                <view class="itemcontent" @click="goto('/pages/manager/report')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Attendance Report</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view>   
            </view>
        </view> 
        <view class="item" :style="{marginBottom: '30rpx'}">
            <view class="itemtitle">Settings</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/profile/password')"> 
                    <image src="/static/setting.png" alt="logo" class="img"  />
                    <views class="msg">Change Password</views>
                    <image src="/static/arrow-right.png" alt="logo" class="img imgfloatright"  />
                </view> 
                <view class="itemcontent" @click="logout"> 
                    <image src="/static/logout.png" alt="logo" class="img"  />
                    <views class="msg">Logout</views>
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
                ismanager:false
            };
        },
		methods: { 
            logout(){
                logoutRequestApi({userId: uni.getStorageSync("id")}).then((res)=>{
                    uni.setStorageSync("token", '');
                }) 
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
                this.ismanager = false
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
                if (this.user.role.includes( "ADMIN") ){
                    this.ismanager = true
                }
                console.log(this.ismanager)
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
        min-height: 100vh; 
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20rpx;
        .title {
            width: 750rpx;
            height: 200rpx;
            background: #fff;
            display: flex;
            align-items: center;
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
