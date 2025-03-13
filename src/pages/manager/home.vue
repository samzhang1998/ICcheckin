<template>
	<view class="maindiv"> 
        <!-- <view class="userinfo">
            <view >
                <view class="name">Manager A</view>
                <view class="position">General Manager</view> 
            </view>
            <view class="belldiv">
                <image src="/static/bell.png" class="bllimg"  /> 
            </view>
        </view>  -->
        <identity></identity>

        <view class="content">
            <view class="line1">
                <uni-data-select
                class="uni-input userinput inputdepart" 
                    v-model="currenttype"
                    :localdata="leavetypes" 
                    :clear="false" 
                    @change="typechanged"
                    placeholder="select leave type"
                    ></uni-data-select> 
            </view>
            <view class="submsg">Paid Period 1 Sept 2024 - 1 Sept 2025</view> 
            <view v-for="(item, index) in totals" :key="index">
                <view class="line2"  v-if="item.leaveTypeName == currenttype" >
                    <view class="items">
                        <view class="items-line1">
                            <image src="/static/Clock_icon.png" class="Clockicon"  /> 
                            <view class="status">Available</view>
                        </view>
                        <view class="times">{{ item.balance }} Hours</view>
                    </view> 
                    <view class="items">
                        <view class="items-line1">
                            <image src="/static/Clock_icon.png" class="Clockicon"  /> 
                            <view class="status">Leave used</view>
                        </view>
                        <view class="times">{{ item.used }} Hours</view>
                    </view> 
                </view>
            </view>
        </view> 

        <view class="btns">
            <view class="actiontbn" :class="btnindex === 1 ? 'activetbn' : ''" @click="activebtns(1)">Review</view>
            <view class="actiontbn" :class="btnindex === 2 ? 'activetbn' : ''" @click="activebtns(2)">Approved</view>
            <view class="actiontbn" :class="btnindex === 3 ? 'activetbn' : ''" @click="activebtns(3)">Rejected</view>
        </view>
 
        <view class="content2">
            <view v-for="(item, index) in requests" :key="index"  @click="detail(item)">
                <view v-if="btnindex===1 && item.status =='PENDING'">
                    <view class="line1">
                        <view class="msg">{{item.requestTimestamp}}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.startTime }} </view>
                            <view class="times">  {{ item.endTime }}</view>
                        </view> 
                        <view class="items"> 
                            <view class="status">Total Leave</view> 
                            <view class="times">{{ item.totalhour }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3">
                        <view class="linelefe" >
                            <image src="/static/red.png" class="redicon"  />
                            <view class="status">Pending</view>
                        </view> 
                        <view class="statustxt">Submit by {{ item.user }}</view> 
                    </view>
                </view>
                <view v-if="btnindex==2 && item.status =='APPROVED'">
                    <view class="line1">
                        <view class="msg">{{item.requestTimestamp}}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.startTime }} </view>
                            <view class="times">  {{ item.endTime }}</view>
                        </view> 
                        <view class="items"> 
                            <view class="status">Total Leave</view> 
                            <view class="times">{{ item.totalhour }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3"> 
                        <view class="linelefe" >
                            <image src="/static/checkedtrue.png" class="redicon"  />
                            <view class="status">Approved</view>
                        </view>
                        <view class="statustxt">Submit by {{ item.user }}</view> 
                    </view>
                </view>
                <view v-if="btnindex==3 && item.status =='REJECTED'">
                    <view class="line1">
                        <view class="msg">{{item.requestTimestamp}}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.startTime }} </view>
                            <view class="times">  {{ item.endTime }}</view>
                        </view> 
                        <view class="items"> 
                            <view class="status">Total Leave</view> 
                            <view class="times">{{ item.totalhour }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3"> 
                        <view class="linelefe"  >
                            <image src="/static/reject.png" class="redicon"  />
                            <view class="status">Rejected</view>
                        </view>
                        <view class="statustxt">Submit by {{ item.user }}</view> 
                    </view>
                </view>
            </view>
        </view> 

        <view class="vbtm">
            <view class="btn" @click="update">Submit Leave</view>
        </view> 

	</view>
</template>
  
<script>
    import {getRequestsApi, getLeaveTotalApi} from "@/api/leave";
	export default {
        data() {
            return { 
                btnindex:1,
                event: {
                    activetime:6,
                    name:"SEO Meeting with Lee Massage",
                    date:"24 Feb 2025",
                    time:"3pm - 4pm",
                    note:"note",
                    righttxt:"Shuoqi Wang"
                },
                user:{
                    email:"",
                    lastName:"",
                    firstName:"",
                    phone:"",
                    department:"",
                    title:"",
                    role:"" 
                },
                requests:[],
                totals:[],
                leavetypes:[],
                currenttype:"",
                userid:""
            };
        },
		methods: { 
            typechanged(e){
                console.log(e)
                this.currenttype = e
            },
            getLeaveTotal(){
                getLeaveTotalApi(this.userid ).then((res)=>{ 
                    this.totals = res.data
                    this.leavetypes = []
                    for(let i =0; i < this.totals.length; i++){
                        let item ={
                            value:this.totals[i].leaveTypeName,
                            text:this.totals[i].leaveTypeName
                        }
                        this.leavetypes.push(item)
                        this.currenttype = this.totals[i].leaveTypeName
                    }
                })
            },
            detail(item){
                uni.navigateTo({
                    url: '/pages/manager/detail?request='+JSON.stringify(item)  
                });
            },
            activebtns(index){
                this.btnindex = index

            },
            preWeek(){ 
            },  
            update(){
                uni.showToast({
                    title: "Saved",
                    icon: "success",
                    duration: 3000,
                });
            },
            formatdate(dateString){
                //const dateString = "31-05-2025 23:00:00";

                // 拆分日期和时间部分
                const [datePart, timePart] = dateString.split(" ");

                // 拆分日、月、年
                const [day, month, year] = datePart.split("-");

                // 拆分时、分、秒
                const [hours, minutes, seconds] = timePart.split(":");

                // 创建 Date 对象
                // 注意：JavaScript 的月份是从 0 开始的，所以需要将月份减 1
                const date = new Date(year, month - 1, day, hours, minutes, seconds);

                return date
            },
            getLeaves(){
                getRequestsApi().then((res)=>{
                    console.log(res)
                    this.requests = res.data
                    for(let i = 0; i < this.requests.length;i++){
                        let starttime = this.formatdate(this.requests[i].startTime) 
                        let endtime = this.formatdate(this.requests[i].endTime) 
                        const timeDifference = endtime - starttime; 
                        // 将时间差转换为小时
                        this.requests[i].totalhour =  Math.floor(timeDifference / (1000 * 60 * 60)); 
                    }
                })
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
                this.userid = uni.getStorageSync("id");  
                this.user.lastName = uni.getStorageSync("lastName");  
                this.user.firstName = uni.getStorageSync("firstName");  
                this.user.phone = uni.getStorageSync("phone");  
                this.user.department = uni.getStorageSync("department");  
                this.user.title = uni.getStorageSync("title");  
                this.user.role = uni.getStorageSync("role");    
            }
		},
        mounted() {  
        }, 
        onShow () {
            this.getUserInfo()
            this.getLeaves()
            this.getLeaveTotal()
        },
	}
</script>
  
<style scoped lang="scss">
	 .maindiv{ 
        min-height: 100vh;
        padding: 15rpx; 
        background-color: #F8F8F8;
        .inputdepart{
            width: 200rpx;;
            padding-left:0;
            margin-left:0;
        }
        .btns{
            margin-top: 40rpx;
            margin-bottom: 40rpx;
            display: flex;
            justify-content: space-between;
            border-radius: 30rpx;
            background-color:white;
            .actiontbn{
                width: 240rpx;
                height: 60rpx;
                color: #475467;
                
                text-align: center;
                line-height: 60rpx; 
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                
            }
            .activetbn{
                border-radius: 30rpx;
                color:white;
                background-color: #EFC462;
            }
        }
       
        .vbtm{
            position: fixed;
            bottom: 80rpx;
            height: 154rpx;
            width:750rpx; 
            
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
        .userinfo{
            display: flex;
            justify-content: space-between;
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
            .belldiv{
                width: 60rpx;
                height: 60rpx;
                border-radius: 30rpx;
                border:1px solid #F1F1F1;  
                text-align: center;
                .bllimg{
                    width: 48rpx;
                    height: 48rpx;
                    margin-top:5rpx;
                } 
            }
            
        } 
        .content2{
            padding: 15rpx; 
            border-radius: 8px;
            background-color: white;
            .line3{
                display: flex;
                justify-content: space-between;
                margin-top: 25rpx;
                .linelefe{
                    display: flex;
                    .redicon{
                        width: 40rpx;
                        height: 40rpx;
                        margin-right: 10rpx;
                    }
                    .status{
                        color: #838383;
                        font-family: Inter;
                        font-size: 12px;
                        font-style: normal;
                        line-height: 40rpx;
                        font-weight: 500; 
                    }
                }
                .statustxt{
                    color: var(--Color, #141414);
                    font-family: Inter;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500; 
                    line-height: 40rpx;
                }
            }
            .line2{
                display: flex;
                justify-content: space-between;
                border-radius: var(--Spacing-2, 8px);
                border: 1px solid var(--Color-Gray-Gray-200, #EAECF0);
                background: var(--Color-Gray-Gray-100, #F9FAFB);
                padding: 45rpx 25rpx;
                margin-top: 25rpx;
                .status{
                    color: var(--Color-Gray-Gray-500, #667085);
                    font-family: Inter;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.5px;
                }
                .times{
                    color: var(--Color-Text-Text-Body, #344054);
                    font-family: Inter;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: bold;
                    line-height: normal;
                    letter-spacing: -0.5px;
                }
            }
            .line1{
                .msg{
                    color: var(--Color-Text-Text-Primary, #101828);
                    font-family: Inter;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 140%; /* 19.6px */
                }
            }
        }
        .content{
            padding: 15rpx; 
            border-radius: 8px;
            background-color: white;
            .line2{
                display: flex;
                justify-content: space-between;
                .items{
                    border-radius: var(--Spacing-2, 8px);
                    border: 1px solid var(--Color-Gray-Gray-50, #EBECEE);
                    background-color: #F9F9F9;
                    width: 290rpx;
                    padding:25rpx;
                    margin-top: 30rpx;
                    .items-line1{
                        display: flex;
                        .Clockicon{
                            width:32rpx;
                            height: 32rpx;
                        }
                        .status{
                            color: var(--Color-Text-Text-Secondary, #475467);
                            font-family: Nunito;
                            font-size: 12px;
                            font-style: normal;
                            font-weight: 500;
                            line-height: normal;
                            letter-spacing: -0.5px;
                        }
                    }
                    .times{
                        color: var(--Color-text-primary, #161B23);

                        /* Typography/Title/Large */
                        font-family: var(--Title-Large-Font, Roboto);
                        font-size: var(--Title-Large-Size, 22px);
                        font-style: normal;
                        font-weight: bold;
                        line-height: var(--Title-Large-Line-Height, 28px); /* 127.273% */
                        letter-spacing: var(--Title-Large-Tracking, 0px);
                    }
                    
                }
            }
            .line1{
                display: flex;
                .arrowdown{
                    width: 48rpx;
                    height: 48rpx;
                }
            }
            .submsg{
                color: var(--Color-Text-Text-Secondary, #475467);
                font-family: Nunito;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 140%; /* 16.8px */
            }
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
     }
</style>
