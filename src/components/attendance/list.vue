<template>
    <view class="attencelist">
        <view class="linetitle">
            <text class="list_title">Attendance records</text>
            <text class="list_title list_title_all" @click="gotolist">All</text>
        </view>

        <view v-for="(item, index) in history" :key="index" class="history_card">
            <view class="headerline">
                <view class="left">

                    <image src="/static/Calendar_page_icon.png" class="img"></image>
                    <text class="date">{{ item.signInTime | filterDate }}</text>
                </view>
                <text class="latemsg" v-if="item.lateTime">
                    {{ item.lateTime }}
                </text>
            </view>
            <view class="time">
                <view class="img_box">
                    <image class="img" v-if="item.signInLocationType == 'OUTRANGE'" src="/static/hin.png"></image>
                    <image class="img" v-else src="/static/lin.png"></image>
                </view>
                <text>{{ item.signInTime | filterTime }}</text>
                <view class="img_box">
                    <image class="img" v-if="item.signInLocationType == 'OUTRANGE'" src="/static/hin.png"></image>
                    <image class="img" v-else src="/static/lin.png"></image>
                </view>
                <text>{{ item.signOutTime | filterTime }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "Identity",
    props: {
        history: Array
    },
    filters: {
        filterDate(datestr) {
            if (datestr) {
                let datas = datestr.split(" ")
                return datas[0];

            } else {
                return ""
            }

        },
        filterTime(datestr) {
            if (datestr) {

                const [datePart, timePart] = datestr.split(' ');
                const [month, day, year] = datePart.split('-').map(Number);
                const [hours, minutes, seconds] = timePart.split(':').map(Number);

                let timestr = hours < 12 ? 'am' : 'pm';
                if (minutes == 0 || minutes == 0 ){
                    return hours + ":" + minutes + "0 " + timestr;

                }else{
                    return hours + ":" + minutes + " " + timestr;
                } 

            } else {
                return "not checked"
            }
        }
    },
    methods: {
        gotolist() {
            uni.navigateTo({ url:"/pages/calendar/attendance" })
        }
    }
}
</script>

<style scoped lang="scss">
.attencelist {
    width: 680rpx;
    padding: 25rpx 0; 
    margin-bottom: 30rpx;
    display: flex;
    flex-direction: column;
    align-items: start;
    border-radius: 8px;
    background: #FFF;
}
.list_title_all {
    color: #01aed3;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
}

.linetitle {
    display: flex;
    justify-content: space-between;
    width: 680rpx; 
    flex-direction: row;
}
.history_card {
    margin-top: 25rpx;
    width: 680rpx;
    display: flex;
    padding: 20rpx;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    border-radius: 8px;
    border: 1px solid  #F1F1F1 ;
    background: #FFF;
}
.img {
    width: 40rpx;
    height: 40rpx;
}
.time {
    width: 640rpx;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
}

.list_title {
    color: #2B2B2B;
    font-family: Nunito;
    font-style: normal;
    line-height: normal;
    font-size: 30rpx;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.time text {
    color: #333;
    font-family: Inter;
    font-size: 26rpx;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin: 0 20rpx;
}

.headerline {
    display: flex;
    justify-content: space-between;
    width: 640rpx; 
    margin-bottom: 25rpx; 
    flex-direction: row;  
}

.img_box {
    width: 50rpx;
    height: 50rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
}

.left {
    display: flex;
    flex-direction: row; 
}

.latemsg {
    color: #F95555;
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
}

.date {
    color:  #333;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
</style>