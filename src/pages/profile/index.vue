<template>
	<view class="maindiv">
        <view class="header">
           
            <view class="title">My Profile</view> 
        </view> 
        <view class="userinfo">
            <view class="name">{{ user.firstName }}  {{ user.lastName }}</view>
            <view class="position">{{ user.title }}</view> 
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
        <view class="item">
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
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
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
        mounted() { 
        }, 
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .item{
            margin-top: 20rpx;
            .itemtitle{
                color: var(--Color-Gray-Gray-700, #344054);
                font-family: Nunito;
                font-size: 16px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
            .itemcontents{
                border-radius: 8px; 
                border: 1px solid #DADADA;
                background: #FFF;
                margin-top: 20rpx;
                padding-bottom: 15rpx;
                .imgfloatright{
                    position: absolute;
                    right: 10rpx;
                }
                .itemcontent{  
                    display: flex;
                    margin-top: 20rpx;
                    margin-left: 10rpx;
                }
                .img{ 
                    width: 36rpx;
                    height: 36rpx;  
                    margin-right: 20rpx; 
                }
                .msg{ 
                    color: #4F5464;
                    font-family: Nunito;
                    font-size: 14px; 
                    font-style: normal;
                    font-weight: 600; 
                    margin-bottom: 10rpx;
                }
            }
        }
        .userinfo{
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: #101828; 
                font-family: Nunito;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                letter-spacing: -0.32px;
            }
        }
        .content{
            padding: 15rpx; 
            border-radius: 8px;
            background-color: white;
            .date, .time , .notes{
                margin-top: 20rpx;;
                color: #838383; 
                font-family: Nunito;
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

            .name{
                color: #000; 
                font-family: Nunito;
                font-size: 16px;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
            }
        }
        .header{
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
            
            .arrowimg{
                width:60rpx;
                height: 60rpx;
            }
            .title{
                width: 700rpx;
                text-align: center;
                color: #101828; 
                font-family: Nunito;
                font-size: 18px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }

        } 
     }
</style>
