<template>
	<view class="maindiv"> 
        <view class="btns">
            <view class="actiontbn" :class="btnindex === 1 ? 'activetbn' : ''" @click="activebtns(1)">Review</view>
            <view class="actiontbn" :class="btnindex === 2 ? 'activetbn' : ''" @click="activebtns(2)">Approved</view>
            <view class="actiontbn" :class="btnindex === 3 ? 'activetbn' : ''" @click="activebtns(3)">Rejected</view>
        </view> 
        <view class="content2">
            <view v-for="(item, index) in sortedRequests" :key="index"  @click="detail(item)">
                <view v-if="btnindex === 1 && (item.status === 'PENDING' || item.status === 'WAITING_CANCELLATION_CONFIRMATION')">
                    <view class="line1">
                        <view class="msg">{{item.requestDate}}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.start }} - {{ item.end }}</view>
                        </view> 
                        <view class="items right"> 
                            <view class="status">{{ item.requestType }}</view> 
                            <view class="times">{{ Math.ceil(item.requestedHours) }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3">
                        <view class="linelefe" >
                            <image src="/static/red.png" class="redicon"  />
                            <view class="status">{{ status(item.status) }}</view>
                        </view> 
                        <view class="statustxt">Submit by {{ item.user }}</view> 
                    </view>
                </view>
                <view v-if="btnindex==2 && item.status =='APPROVED'">
                    <view class="line1">
                        <view class="msg">{{ item.requestDate }}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.start }} - {{ item.end }}</view>
                        </view> 
                        <view class="items right"> 
                            <view class="status">{{ item.requestType }}</view> 
                            <view class="times">{{ Math.ceil(item.requestedHours) }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3"> 
                        <view class="linelefe" >
                            <image src="/static/checkedtrue.png" class="redicon"  />
                            <view class="status">{{ status(item.status) }}</view>
                        </view>
                        <view class="statustxt">Submit by {{ item.user }}</view> 
                    </view>
                </view>
                <view v-if="btnindex==3 && (item.status ==='REJECTED' || item.status ==='CANCELLED')">
                    <view class="line1">
                        <view class="msg">{{item.requestDate}}</view> 
                    </view> 
                    <view class="line2">
                        <view class="items"> 
                            <view class="status">Leave Date</view> 
                            <view class="times">{{ item.start }} - {{ item.end }}</view>
                        </view> 
                        <view class="items right"> 
                            <view class="status">{{ item.requestType }}</view> 
                            <view class="times">{{ Math.ceil(item.requestedHours) }} Hours</view>
                        </view> 
                    </view>
                    <view class="line3"> 
                        <view class="linelefe"  >
                            <image src="/static/reject.png" class="redicon"  />
                            <view class="status">{{ status(item.status) }}</view>
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
                const sort = this.requests.sort((a, b) => {
                    const dateA = new Date(a.requestTimestamp.split(" ")[0].split("-").reverse().join("-") + "T" + a.requestTimestamp.split(" ")[1]);
                    const dateB = new Date(b.requestTimestamp.split(" ")[0].split("-").reverse().join("-") + "T" + b.requestTimestamp.split(" ")[1]);
                    return dateB - dateA;
                });
                return sort.map(item => ({
                    ...item,
                    requestDate: this.formatDate(item.requestTimestamp),
                    start: this.formatTime(item.startTime),
                    end: this.formatTime(item.endTime)
                }));
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
                    this.requests = res.data
                })
            },
            status (st) {
                if (st === "WAITING_CANCELLATION_CONFIRMATION") {
                    return "CANCEL PENDING"
                } else {
                    return st
                }
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
            margin-bottom: 30rpx;
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
                    gap: 20rpx;                    
                }
                .right {
                    width: 150rpx;
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