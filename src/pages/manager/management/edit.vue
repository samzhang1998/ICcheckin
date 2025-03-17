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
                    <image src="/static/user.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus  :value="user.firstName" disabled /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Last Name</view>
                <view class="itemcontents"> 
                    <image src="/static/user.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus  :value="user.lastName"  disabled /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Contact Number</view>
                <view class="itemcontents"> 
                    <image src="/static/calendar.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus  :value="user.phone"  disabled/> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Title</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus  :value="user.title" disabled /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Department</view>
                <view class="itemcontents"> 
                    <image src="/static/keyboard.png" alt="logo" class="img" /> 
                    <input class="uni-input userinput" focus  :value="user.department" disabled /> 
                </view>
            </view>
            <view class="item"  >
                <view class="itemtitle">Sick Leave Balance(hours)</view>
                <view class="itemcontents"> 
                    <image src="/static/Time_progress_light.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus    v-model="user.sickleavehour" />
                    <image src="/static/Edit_light.png" alt="logo" class="img" /> 
                </view>
            </view>
            <view class="item">
                <view class="itemtitle">Anual Leave Balance(hours)</view>
                <view class="itemcontents"> 
                    <image src="/static/Time_progress_light.png" alt="logo" class="img" />
                    <input class="uni-input userinput" focus   v-model="user.annualeavehour" />
                    <image src="/static/Edit_light.png" alt="logo" class="img" /> 
                </view>
            </view> 
            <view class="action" @click="save">
                Set as Manager 
            </view>
        </view>
        <view class="vbtm">
            <view v-if="newUser" class="btn" @click="setNew">Update</view>
            <view v-else class="btn" @click="update">Update</view>
        </view>
        <uni-popup ref="popup" backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Confirm Manager Setting</view>
                <view class="content2">Once you confirm, {{user.firstName}} {{user.lastName}} will be set as Manager</view>
                <view class="btn" @click="confirm" >Yes</view>
                <view class="btn btn-white" @click="close" >No, Let me check</view>
            </view>
        </uni-popup>
        <uni-popup ref="popupconfirmed"  backgroundColor="#fff" borderRadius="40rpx 40rpx 0 0" >
            <view class="popup-content">
                <view class="sub_title">Confirmed</view>
                <view class="content2">{{user.firstName}} {{user.lastName}} has been setup as manager</view>
                <view class="btn" @click="closeConfirm">Done</view>                 
            </view>
        </uni-popup>
	</view>
</template>
  
<script>
    import { getUserDetailApi } from "@/api/users";
    import { saveAsManagerApi } from "@/api/role";
    import { getDepartmentsApi } from "@/api/departments";
    import { editUserLeaveBalanceApi } from "@/api/balance";
    import { addLeaveBalance, getLeaveTypeRequest } from "@/api/admin";   
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
                newUser: false,
                leaveTypes: [],
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
            async getLeaveTypes () {
                try {
                    const res = await getLeaveTypeRequest();
                    if (res.statusCode === 200) {
                        this.leaveTypes = res.data.data;
                        console.log("leave types", this.leaveTypes);
                    } else {
                        console.log("error:", res);
					    uni.showToast({ title: "Fail to get leave types", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of getting leave types", icon: "none" });
                }
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
            async setNew () {
                const annualData = {
                    userId: this.user.id,
                    leaveTypeId: this.leaveTypes[0].leaveTypeId,
                    balance: this.user.annualeavehour,
                    used: 0
                }
                const sickData = {
                    userId: this.user.id,
                    leaveTypeId: this.leaveTypes[1].leaveTypeId,
                    balance: this.user.sickleavehour,
                    used: 0
                }
                console.log("annual", annualData);
                console.log("sick", sickData);
                try {
                    const res1 = await addLeaveBalance(annualData);
                    const res2 = await addLeaveBalance(sickData);
                    if (res1.statusCode === 200 & res2.statusCode === 200) {
                        console.log("success", res1.data);
                        console.log("success", res2.data);
                        uni.showToast({
                            title: "Saved",
                            icon: "success",
                            duration: 3000,
                        });
                    } else {
                        console.log("fail", res1);
                        console.log("fail", res2)
					    uni.showToast({ title: "Fail to edit leave balance", icon: "none" });
                    }
                } catch (error) {
                    console.error("error:", error);
					uni.showToast({ title: "Error of editing leave balance", icon: "none" });
                }
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
                    } else {
                        this.newUser = true;
                    }
                    console.log("This user:", this.user)
                })
            }
		},
        onLoad(options) {  
            this.getDepartments()
            this.userid = options.userid
            this.getUserDetail()
            this.getLeaveTypes()
        },
        mounted() { 
        }, 
	}
</script>
  
<style scoped lang="scss">
	.maindiv{
        width: 750rpx;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #F8F8F8;
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
            font-size: 35rpx;
            font-weight: 700;
            line-height: 140%;
            text-align: center;
        }
        .popup-content{
            width: 750rpx;
            padding: 40rpx 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30rpx;
            border-top-left-radius: 40rpx;
            border-top-right-radius: 40rpx; 
            background-color: white; 
            text-align: center;
            .sub_title{
                color: #000;
                font-family: Nunito;
                font-size: 35rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            .content2{
                color: #838383;
                text-align: center;
                font-family: Nunito;
                font-size: 25rpx;
                font-style: normal;
                font-weight: 500;
                line-height: 130%;
            }
            .btn{  
                display: flex;
                width: 675rpx;
                height: 85rpx;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 100px;
                border: none;
                background: #EFC462;
                color: #fff;
                text-align: center;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
            .btn-white{
                background: white;
                color:#EFC462;
                border: 1px solid #EFC462;
            }
        }
        .vbtm{
            position: sticky;
            bottom: 0;
            height: 150rpx;
            width:750rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-top: 1px solid #E9EAEC; 
            background: #FEFEFE;            
            .btn{ 
                display: flex;
                width: 675rpx;
                height: 85rpx;
                justify-content: center;
                align-items: center;
                flex-shrink: 0;
                border-radius: 100px;
                border: none;
                background: #EFC462;
                color: #fff;
                text-align: center;
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: 20px;
                letter-spacing: 0.1px;
            }
        }
        .content{
            width: 600rpx;
            padding: 30rpx 40rpx;
            border-radius: 10px;
            background: #FFF;
            display: flex;
            flex-direction: column;
            gap: 20rpx;
            margin: 30rpx 0;
            .action{
                color: #EFC462; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal; 
                line-height: 20px;
                text-align: center;
                margin-top:30rpx;
            }
        }
        .item{
            display: flex;
            flex-direction: column;
            gap: 10rpx;
            .itemtitle{
                color: #475467;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 16px;
                letter-spacing: -0.2px;
            }
            .itemcontents{
                width: 540rpx;
                padding: 20rpx 30rpx;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                gap: 10rpx;
                border-radius: 10px; 
                border: 1px solid #DADADA;
                background: #FFF;
                .userinput{
                    flex: 1;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 400;
                    letter-spacing: -0.2px;
                }
                .img{ 
                    width: 36rpx;
                    height: 36rpx;
                }
            }
        }
        .userinfo{
            .name{
                color: #101828; 
                font-family: Nunito;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 600;
                line-height: normal;
                letter-spacing: -0.4px;
            }
            .position{
                color: #667085;
                font-family: Nunito;
                font-size: 22rpx;
                font-style: normal;
                font-weight: 400;
                line-height: 140%;
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
