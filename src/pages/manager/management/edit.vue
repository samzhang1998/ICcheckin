<template>
	<view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo"  @click="back" />
            <text>Employee Management</text> 
        </view> 
        <view class="content">
            <view class="userinfo">
                <view class="name">{{user.firstName}} {{user.lastName}}</view>
                <view class="position">Details about my personal data</view> 
                
            </view> 

            <view class="item">
                <view class="itemtitle">First Name</view>
                <view class="itemcontents"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus  :value="user.firstName" disabled /> 
                </view>
            </view> 

            <view class="item">
                <view class="itemtitle">Last Name</view>
                <view class="itemcontents"> 
                    <image src="/static/user.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus  :value="user.lastName"  disabled /> 
                </view>
            </view> 

            <view class="item">
                <view class="itemtitle">Contact Number</view>
                <view class="itemcontents"> 
                    <image src="/static/calendar.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus  :value="user.phone"  disabled/> 
                </view>
            </view> 

            <view class="item">
                <view class="itemtitle">Title</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus  :value="user.title" disabled /> 
                </view>
            </view> 

            <view class="item">
                <view class="itemtitle">Department</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img"  /> 
                    <input class="uni-input userinput" focus  :value="user.department" disabled /> 
                </view>
            </view> 

            <view class="item"  >
                <view class="itemtitle">Sick Leave Balance(hours)</view>
                <view class="itemcontents"> 
                    <image src="/static/Time_progress_light.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus    v-model="user.sickleavehour"/>
                    <image src="/static/Edit_light.png" alt="logo" class="img imgfloatright"  /> 
                </view>
            </view> 

            <view class="item">
                <view class="itemtitle">Anual Leave Balance(hours)</view>
                <view class="itemcontents"> 
                    <image src="/static/Time_progress_light.png" alt="logo" class="img"  />
                    <input class="uni-input userinput" focus   v-model="user.annualeavehour"  />
                    <image src="/static/Edit_light.png" alt="logo" class="img imgfloatright"  /> 
                </view>
            </view> 
            <view class="action" @click="save">
                Set as Manager 
            </view>

        </view>

        <view class="vbtm">
            <view class="btn" @click="update">Update</view>
        </view> 

        <uni-popup ref="popup"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Confirm Manager Setting</view>
                <view class="content2">Once you confirm, {{user.firstName}} {{user.lastName}} will be set as Manager</view>
                <view class="btn" @click="confirm" >Yes</view>
                <view class="btn btn-white" @click="close" >No, Let me check</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupconfirmed"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content  "  >
                <view class="title">Confirmed</view>
                <view class="content2">{{user.firstName}} {{user.lastName}} has been setup as manager</view>
                <view class="btn" @click="closeConfirm" >Done</view>
                 
            </view>
        </uni-popup>


	</view>
</template>
  
<script>
    import { getUserDetailApi } from "@/api/users";
    import { saveAsManagerApi } from "@/api/role";
    import { getDepartmentsApi } from "@/api/departments";
    import { editUserLeaveBalanceApi } from "@/api/balance";

    
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
                    department:"",
                    email:"",
                    firstName:"",
                    id:"",
                    lastName:"",
                    leaveBalance:[],
                    phone:"",
                    title:"" ,
                    annualeavehour:0,
                    sickleavehour:0,
                    annualLeaveTypeId:null,
                    sickLeaveTypeId:null, 
                } ,
                userid:null,
                departments:[]
            };
        },
		methods: { 
            back(){
                uni.navigateBack({
                    delta: 1
                });
            },
            getDepartments(){
                getDepartmentsApi().then((res)=>{
                    console.log(res) 
                    this.departments = []
                    for(let i = 0 ; i < res.data.length; i++){
                        let item ={
                            value:res[i].departmentId,
                            text:res[i].departmentName
                        }
                        this.departments.push(item)

                    }
                }) 
            },
            preWeek(){ 
            },  
            save(){
                this.$refs.popup.open("bottom") 
               
            },
            update(){
                let data_sick = {
                    userId:this.user.id,
                    leaveTypeId:this.user.sickLeaveTypeId,
                    balance: this.user.sickleavehour
                }
                const sick_Promise = new Promise((resolve, rejuect)=>{

                    editUserLeaveBalanceApi(data_sick).then((res)=>{
                        console.log(res)
                        resolve(res)
                    }) 
                })

                let data_annual = {
                    userId:this.user.id,
                    leaveTypeId:this.user.annualLeaveTypeId,
                    balance: this.user.annualeavehour
                }

                const annual_Promise = new Promise((resolve, rejuect)=>{ 
                    editUserLeaveBalanceApi(data_annual).then((res)=>{
                        console.log(res)
                        resolve(res)
                    }) 
                }) 
                Promise.all([annual_Promise, sick_Promise]).then((res)=>{ 
                    uni.showToast({
                        title: "Saved",
                        icon: "success",
                        duration: 3000,
                    });
                }).catch((error)=>{
                    console.log(error) 
                })  
                
            },
            close(){
                this.$refs.popup.close()
            },
            confirm(){
                // 保存
                this.$refs.popup.close()
                
                let data ={
                    userId:this.user.id, 
                }
                saveAsManagerApi(this.user.id).then((res)=>{
                    if(res.status==1){
                        this.$refs.popupconfirmed.open("bottom") 
                    }else{
                        uni.showModal({
                            content: res.msg,
                            confirmText: 'OK', 
                            showCancel:false
                        }) 
                        return 
                    }
                }) 
            },
            closeConfirm(){
                this.$refs.popupconfirmed.close()
            },
            getUserDetail(){
                getUserDetailApi(this.userid).then((res)=>{
                    this.user = res.data
                    
                    if(this.user.leaveBalance.length>0){
                        for(let i = 0; i < this.user.leaveBalance.length; i++){
                            if(this.user.leaveBalance[i].leaveTypeName == "ANNUAL"){
                                this.user.annualeavehour = this.user.leaveBalance[i].balance
                                this.user.annualLeaveTypeId = this.user.leaveBalance[i].typeId
                            }else if (this.user.leaveBalance[i].leaveTypeName == "SICK"){
                                this.user.sickleavehour = this.user.leaveBalance[i].balance
                                this.user.sickLeaveTypeId = this.user.leaveBalance[i].typeId
                            }
                        }
                    }

                    console.log(this.user )
                })
            }
		},
        onLoad(options) {  
            this.getDepartments()
            this.userid = options.userid
            this.getUserDetail()
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
        .title {
            width: 750rpx;
            height: 200rpx;
            background: #F8F8F8;
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .title image {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            left: 40rpx;
        }
        .title text {
            color: #101828;
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .popup-content{
            height: 260rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white; 
            padding: 60rpx;
            text-align: center;
            .title{
                color: #000;
                font-family: Nunito;
                font-size: 20px;
                font-style: normal;
                font-weight: 600;
                line-height: var(--Body-Small-Line-Height, 16px); /* 80% */
                letter-spacing: -0.2px;
            }
            .content2{
                color: #838383;
                text-align: center;
                font-family: Nunito;
                font-size: 13px;
                font-style: normal;
                font-weight: 500;
                line-height: 130%; /* 16.9px */
                margin-top: 10rpx;
            }
            .btn{  
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 630rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
            .btn-white{
                background: white;
                color:#EFC462;
                border: 1px solid #EFC462;
            }
        }
        .vbtm{
            position: fixed;
            bottom: 0;
            height: 154rpx;
            width:750rpx;
            border-top: 1px solid #E9EAEC; 
            background: var(--Color-Surface-Primary, #FEFEFE);
            
            .btn{ 
                margin-left: 35rpx;
                margin-top: 20rpx;
                height: 80rpx; 
                line-height: 80rpx;
                width: 650rpx;
                text-align: center;
                border-radius: 100px;
                background: #EFC462;
                color:white;
            }
        }
        .content{
            min-height: 80vh;
            padding:25rpx;
            border-radius: 8px;
            background: #FFF;
            .action{
                color: #EFC462; 
                font-family: Nunito;
                font-size: 16px;
                font-style: normal; 
                line-height: 20px; /* 125% */
                text-align: center;
                margin-top:30rpx;
            }
            padding-bottom: 220rpx;
        }
        .item{
            margin-top: 20rpx;
            .itemtitle{
                color: var(--Color-Gray-Gray-600, #475467);
                font-family: Nunito;
                font-size: var(--Body-Small-Size, 12px);
                font-style: normal;
                font-weight: 400;
                line-height: var(--Body-Small-Line-Height, 16px); /* 133.333% */
                letter-spacing: -0.2px;
            }
            .itemcontents{
                display: flex;
                border-radius: 8px; 
                border: 1px solid #DADADA;
                background: #FFF;
                margin-top: 20rpx;
                height: 80rpx;
                line-height: 80rpx;
                .userinput{
                    height: 80rpx;
                    line-height: 80rpx;
                    margin-left: 20rpx; 
                }
                .imgfloatright{
                    position: absolute;
                    right: 50rpx;
                }
                .itemcontent{  
                    display: flex;
                    margin-top: 20rpx;
                    margin-left: 10rpx;
                }
                .img{ 
                    width: 36rpx;
                    height: 36rpx;  
                    margin-left: 20rpx; 
                    margin-top: 25rpx;
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
                color: var(--Color-Gray-Gray-500, #667085);
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%; /* 16.8px */
            }
        }
    }
    .suserinput  {
        height: 100rpx;
        line-height: 100rpx; 
        width: 620rpx;
        border:none !important;
    }
</style>
