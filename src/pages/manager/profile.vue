<template>
	<view class="maindiv">
        <view class="header">
            <image src="/static/back_icon.png" alt="logo" class="arrowimg arrowleft" @click="preWeek"/>
            <view class="title">My Profile</view> 
        </view> 
        <view class="userinfo">
            <view class="name">Eniasls Nunito</view>
            <view class="position">UI/UX Designer</view> 
        </view>
        <view class="item">
            <view class="itemtitle">Contact</view>
            <view class="itemcontents">
                <view class="itemcontent"> 
                    <image src="/static/sms.png" alt="logo" class="img"  />
                    <views class="msg">Eniasls Nunito@gmail.com</views>
                </view>  
                <view class="itemcontent"> 
                    <image src="/static/phone.png" alt="logo" class="img"  />
                    <views class="msg">0459 823 271</views>
                </view>
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Account</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/profile/data')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <views class="msg">Personal Data</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view>  
                <view class="itemcontent"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Office Setting</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view>   
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Management</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/manager/management/list')"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <views class="msg">Employee Management</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view>  
                <view class="itemcontent" @click="goto('/pages/manager/settings')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Attendance Setting</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view> 
                <view class="itemcontent" @click="goto('/pages/manager/report')"> 
                    <image src="/static/folder.png" alt="logo" class="img"  />
                    <views class="msg">Attendance Report</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view>   
            </view>
        </view> 

        <view class="item">
            <view class="itemtitle">Settings</view>
            <view class="itemcontents">
                <view class="itemcontent"  @click="goto('/pages/profile/password')"> 
                    <image src="/static/setting.png" alt="logo" class="img"  />
                    <views class="msg">Change Password</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view> 
                <view class="itemcontent"  @click="logout"> 
                    <image src="/static/logout.png" alt="logo" class="img"  />
                    <views class="msg">Logout</views>
                    <image src="/static/arrow-right.png" alt="logo" class="image imgfloatright"  />
                </view>  
            </view>
        </view> 


	</view>
</template>
  
<script>
import {updateUserApi, getUserDetailApi,logoutApi} from "@/api/users";
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
                }  
            };
        },
		methods: { 
            preWeek(){ 
            },  
            logout(){
                uni.setStorageSync("token", '');
                logoutApi().then((res)=>{
                   console.log(res
                    //待完善，跳转到首页或登录页
                   )
                })
            }, 
            goto(url){
                
                uni.navigateTo({
                    url: url // 目标页面的路径
                });
            
            },
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
                .image{ 
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
