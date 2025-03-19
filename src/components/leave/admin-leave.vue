<template>
	<view class="maindiv"> 
        <view class="title">
            <text>Leave Management</text> 
        </view> 
        <view class="btns">
            <view class="actiontbn" :class="btnindex === 1 ? 'activetbn' : ''" @click="activebtns(1)">Review</view>
            <view class="actiontbn" :class="btnindex === 2 ? 'activetbn' : ''" @click="activebtns(2)">Approved</view>
            <view class="actiontbn" :class="btnindex === 3 ? 'activetbn' : ''" @click="activebtns(3)">Rejected</view>
        </view> 
        <view class="content2">
            <view v-for="(item, index) in sortedRequests" :key="index"  @click="detail(item)">
                <view v-if="btnindex === 1 && item.status ==='PENDING'">
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
                            <view class="status">{{ item.requestType }}</view> 
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
                            <view class="status">{{ item.requestType }}</view> 
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
                <view v-if="btnindex==3 && item.status ==='REJECTED'">
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
                            <view class="status">{{ item.requestType }}</view> 
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
	</view>
</template>
  
<script>
    import {getRequestsApi} from "@/api/leave";
	export default {
        name: "AdminLeavePage",
        props: {
            user: Object,
            reloadTrigger: Boolean
        },
        data() {
            return { 
                btnindex:1,
                requests:[],
                totals:[],
                leavetypes:[],
                userid:""
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
            sortedRequests () {
                return this.requests.sort((a, b) => {
                    const dateA = new Date(a.requestTimestamp.split(" ")[0].split("-").reverse().join("-") + "T" + a.requestTimestamp.split(" ")[1]);
                    const dateB = new Date(b.requestTimestamp.split(" ")[0].split("-").reverse().join("-") + "T" + b.requestTimestamp.split(" ")[1]);
                    return dateB - dateA;
                });
            }
        },
		methods: { 
            detail(item){
                uni.setStorageSync("requestData", item);
                uni.navigateTo({
                    url: `/pages/manager/detail`  
                });
            },
            activebtns(index){
                this.btnindex = index
            },
            preWeek(){ 
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
            }
		}
	}
</script>

<style scoped lang="scss">
	.maindiv{
        width: 750rpx;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center; 
        gap: 30rpx;
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
        .title text {
            color: #101828;
            font-family: Nunito;
            font-size: 35rpx;
            font-weight: 600;
            line-height: 140%;
            text-align: center;
        }
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
            .actiontbn{
                flex: 1;
                height: 60rpx;
                border-radius: 100px;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-family: Nunito;
                font-size: 22rpx;
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
            padding: 30rpx 40rpx;
            padding-bottom: 0;
            border-radius: 10px;
            background-color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 180rpx;
            .card {
                width: 600rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10rpx;
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
                    gap: 10rpx;
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
                    font-size: 22rpx;
                    font-style: normal;
                    font-weight: bold;
                    line-height: normal;
                    letter-spacing: -0.5px;
                }
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
</style>