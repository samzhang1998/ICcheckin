<template>
	<view class="maindiv"> 
        <view class="btns">
            <view class="actiontbn" :class="btnindex === 1 ? 'activetbn' : ''" @click="activebtns(1)">Pending</view>
            <view class="actiontbn" :class="btnindex === 2 ? 'activetbn' : ''" @click="activebtns(2)">Approved</view>
            <view class="actiontbn" :class="btnindex === 3 ? 'activetbn' : ''" @click="activebtns(3)">Rejected</view>
        </view> 
        <view class="content2">
            <view class="title" v-if="btnindex === 1">
                Pending Leaves
            </view>
            <view class="title" v-else-if="btnindex === 2">
                Approved Leaves
            </view>
            <view class="title" v-else-if="btnindex === 3">
                Rejected Leaves
            </view>
            <view v-for="(leave, index) in sortedRequests" :key="index" class="leave"  @click="detail(leave)">
                <view class="leave_title">
                    <view class="leave_type">
                        <image src="/static/Calendar_light.png" alt="date"></image>
                        {{ leave.requestType }}
                    </view>
                    <text>{{ leave.requestTimestamp }}</text>
                </view>
                <view class="leave_info">
                    <view class="line">
                        <text class="line_title">Leave Date</text>
                        <text class="line_title">Total Leave</text>
                    </view>
                    <view class="line">
                        <view class="times">
                            <view>{{ leave.startTime }} </view>
                            <view>{{ leave.endTime }}</view>
                        </view>                        
                        <view class="hours">{{ leave.requestedHours }} Hours</view>
                    </view>
                    <view class="line1">
                        <text>Status: {{ status(leave.status) }}</text>
                    </view>
                    <view class="line1">
                        <text>By: {{ leave.user }}</text>
                        <view class="action" v-if="btnindex === 1 && user.role[0] === 'ADMIN' && (leave.status === 'PENDING' || leave.status === 'WAITING_CANCELLATION_CONFIRMATION')">
                            <image src="/static/Leave_approved.png" alt="approve" @click.stop="viewLeave(leave.requestId, true)"></image>
                            <image src="/static/reject.png" alt="reject" @click.stop="viewLeave(leave.requestId, false)"></image>
                        </view>
                    </view>                    
                </view>
            </view> 
        </view>
	</view>
</template>
  
<script>
    import {getRequestsApi} from "@/api/leave";
    import {leaveView} from '@/api/admin';
	export default {
        name: "AdminLeavePage",
        props: {
            user: Object,
            reloadTrigger: Boolean,
            systemInfo: Object
        },
        data() {
            return { 
                btnindex:1,
                requests:[],
                totals:[],
                leavetypes:[],
                userid:"",
                sortedRequests:[],
            };
        },
        watch: {
            reloadTrigger(newValue) {
                if (newValue) {
                    this.getLeaves();
                }
            }
        },
        mounted () {
            this.getLeaves();
            
        },
        computed: { 
        },
		methods: { 
            detail(item){  
                uni.navigateTo({
                    url: `/pages/manager/detail?data=`+JSON.stringify(item)  
                });
            },
            activebtns(index){
                this.btnindex = index
                this.sortedRequests = this.requests.filter((item) =>{
                   
                    if (this.btnindex == 1 && (item.status == 'PENDING' || item.status == 'WAITING_CANCELLATION_CONFIRMATION')){
                        return true 
                    }else if (this.btnindex==2 && item.status == 'APPROVED' ){
                        return true
                    }else if (this.btnindex==3 && (item.status == 'REJECTED' || item.status == 'CANCELLED')){
                        return true 
                    }else{
                        return false
                    }
                })
            },
            formatTime (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                const parts = date.toLocaleDateString("en-AU", { day: "numeric", month: "short" }).split(" ");
                if (this.systemInfo.platform === 'android') {
                    return `${parts[2]} ${parts[1]}`;
                } else   {
                    return `${parts[0]} ${parts[1]}`                 
                } 
            },
            formatDate (time) {
                if (!time) return "Invalid Date";
                const [day, month, year] = time.split(" ")[0].split("-");
                const date = new Date(`${year}-${month}-${day}`);
                const parts = date.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }).split(" ");
                if (this.systemInfo.platform === 'android') {
                    return `${parts[2]} ${parts[1]} ${parts[3]}`;
                } else if (this.systemInfo.platform === 'ios') {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                } else {
                    return `${parts[0]} ${parts[1]} ${parts[2]}`;
                }                
            },
            getLeaves(){
                
                getRequestsApi().then((res)=>{
                    
                    console.log("Leave management:", res.data);
                    this.requests = res.data.data
                    this.activebtns(1)
                })
            },
            status (st) {
                if (st === "WAITING_CANCELLATION_CONFIRMATION") {
                    return "Cancelling"
                } else if (st === "APPROVED") {
                    return "Approved"
                } else if (st === "CANCELLED") {
                    return "Cancelled"
                } else if (st === "REJECTED") {
                    return "Rejected"
                } else {
                    return "Pending"
                }
            },
            async viewLeave (id, action) {
                try {
                    const data = {
                        approve: action,
                        comment: ""
                    }
                    const res = await leaveView(id, data);
                    if (res.data.status === 1) {
                        uni.reLaunch({ url: "/pages/leave/leave" });
                        console.log("success:", res.data)
                    } else if (res.statusCode === 403) {
                        uni.navigateTo({
                            url: '/pages/index/index'
                        });
                    } else {
                        console.log("Fail:", res);
                        uni.showToast({ title: "Fail to view leaves", icon: "none" });
                    }
                } catch (error) {
                    console.error("Error:", error);
                    uni.showToast({ title: "Error of viewing leaves", icon: "none" });
                }
            }
		}
	}
</script>

<style scoped lang="scss">
	.maindiv{
        width: 750rpx;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        align-items: center; 
        gap: 30rpx;
        background: linear-gradient(0deg, #FBFBFB 0%, #FBFBFB 100%), linear-gradient(0deg, rgba(228, 208, 189, 0.03) 9.72%, #FFF 100%), linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.00) 37.32%);
        .inputdepart{
            width: 200rpx;;
            padding-left:0;
            margin-left:0;
        }
        .btns{
            width: 675rpx;
            height: 60rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-radius: 100px;
            background: #FEFEFE;
            margin-top: 10rpx;
            .actiontbn{
                flex: 1;
                height: 60rpx;
                border-radius: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-family: Nunito;
                font-size: 16px;
                font-weight: 500;
                line-height: 140%;
                color: #475467;
            }
            .activetbn{
                color:white;
                background: #EFC462;
            }
        }       
        .content2{
            width: 600rpx;
            padding: 15rpx 25rpx;
            padding-bottom: 0;
            border-radius: 10px; 
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30rpx;
            .card {
                width: 600rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10rpx;
                margin-top: 10rpx;
            }
            .line3{
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30rpx;
                .linelefe{
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 10rpx;
                    .redicon{
                        width: 30rpx;
                        height: 30rpx;
                    }
                    .status{
                        color: #838383;
                        font-family: Nunito;
                        font-size: 22rpx;
                        font-style: normal;
                        line-height: 40rpx;
                        font-weight: 500; 
                    }
                }
                .statustxt{
                    color: #141414;
                    font-family: Nunito;
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: 500; 
                    line-height: 40rpx;
                }
            }
            .line2{
                display: flex;
                width: 540rpx;
                flex-direction: row;
                justify-content: space-between;
                border-radius: 10px;
                border: 1px solid #EAECF0;
                background: #F9FAFB;
                padding: 30rpx;
                margin-bottom: 10rpx;
                .items {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    gap: 20rpx;                    
                }
                .right {
                    width: 160rpx;
                }
                .status{
                    color: #667085;
                    font-family: Nunito;
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    letter-spacing: -0.5px;
                }
                .times{
                    color: #344054;
                    font-family: Nunito;
                    font-style: normal;
                    line-height: normal;
                    font-size: 30rpx;
                    font-weight: 500;
                    letter-spacing: -0.5px;
                }
            }
            .active {
                border: 1px solid #EFC462;
            }
            .line1{
                .msg{
                    width: 600rpx;
                    color: #101828;
                    font-family: Nunito;
                    font-size: 26rpx;
                    font-style: normal;
                    font-weight: 600;
                    line-height: 140%;
                    margin-bottom: 10rpx;
                }
            }
        } 
    }

    .box {
    width: 680rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30rpx;
}
.sub_title {
    width: 680rpx;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 10rpx;
    color: #333;
    font-family: Inter;
    font-size: 30rpx;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    image {
        width: 35rpx;
        height: 35rpx;
    }
}
.late_info {
    width: 640rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    border-radius: 5px 5px 0px 0px;
    border: 1px solid #F1F1F1;
    background: #FFF;
    .info {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 20rpx;
        .late_name {
            color: #000;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .late_role {
            color: #808080;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
        .late_times {
            display: flex;
            flex-direction: row;
            justify-content: start;
            align-items: center;
            gap: 20rpx;
            .late_time {
                width: 55rpx;
                height: 55rpx;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            text {
                color: #333;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .warn_time {
            color: #F95555;
            font-family: Inter;
            font-size: 22rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
    }
}
.select {
    width: 640rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    border: 1px solid #F1F1F1;
    background: #FFF;
    color: #333;
    font-family: Inter;
    font-size: 30rpx;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    image {
        width: 30rpx;
        height: 30rpx;
    }
}
.selection {
    width: 640rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 20rpx;
    border-radius: 6px;
    border: 1px solid #F1F1F1;
    background: #FFF;
    text {
        color: #333;
        font-family: Inter;
        font-size: 30rpx;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
}
.attendance_info {
    width: 640rpx;
    padding: 20rpx;
    gap: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: start;
    border-radius: 8px;
    border: 1px solid #F1F1F1;
    background: #FFF;
    .region {
        color: #000;
        font-family: Inter;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    .num {
        color: #808080;
        font-family: Inter;
        font-size: 26rpx;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    .records {
        width: 640rpx;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20rpx;
        .record {
            padding: 20rpx;
            padding-bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: start;
            border-radius: 10px;
            border: 1px solid #F1F1F1;
            background: #FCFCFC;
            gap: 30rpx;
            text {
                color: #333;
                font-family: Inter;
                font-size: 50rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
            .record_title {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 10rpx;
                color: #333;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                image {
                    width: 30rpx;
                    height: 30rpx;
                }
            }
        }            
    }
}
.leave {
    width: 680rpx;
    display: flex;
    flex-direction: column;
    background: #FFF;
    border-radius: 8px;
    border: 1px solid #F1F1F1;
    margin-top: 10rpx;
    .leave_title {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F1F1F1;
        .leave_type {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 10rpx;
            color: #333;
            font-family: Inter;
            font-size: 30rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            image {
                width: 35rpx;
                height: 35rpx;
            }
        }
        text {
            color: #808080;
            font-family: Inter;
            font-size: 26rpx;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
        }
    }
    .leave_info {
        width: 640rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 10rpx;
        .line {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            text { 
                color: #333;
                font-family: Inter;
                font-size: 30rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
            .line_title {
                color: #696969;
                font-family: Inter;
                font-size: 26rpx;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .line1 {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            margin-top: 20rpx;
            .action {
                display: flex;
                flex-direction: row;
                justify-content: end;
                align-items: center;
                gap: 20rpx;
                image {
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }
    }
}
.hours{
    color:#EFC462;
}
.title{
    text-align: left;
    color: #000; 
    font-family: Inter;
    font-size: 18px; 
    font-weight: 500;
    width: 690rpx; 
}
</style>