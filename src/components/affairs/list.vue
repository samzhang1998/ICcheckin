<template>
    <view class="attencelist">
        <view class="linetitle">
            <text class="list_title">Attendance records</text>
            <text class="list_title list_title_all" @click="gotolist">All</text>
        </view>
        <view v-for="(item, index) in affairs" :key="index" class="history_card">
            <view class="headerline">
                <view class="left">
                    <image src="/static/Calendar_page_icon.png" class="img"></image>
                    <text class="date">{{ item.signInTime | filterDate }}</text>
                </view>
                <view class="latemsg" v-if="item.lateTime">
                    {{ item.lateTime }}
                </view>
            </view>
            <view class="time">
                <view class="img_box">
                    <image v-if="item.signInLocationType == 'OUTRANGE'" src="/static/hin.png"></image>
                    <image v-else src="/static/lin.png"></image>
                </view>
                <text>{{ item.signInTime | filterTime }}</text>
                <view class="img_box">
                    <image v-if="item.signInLocationType == 'OUTRANGE'" src="/static/hin.png"></image>
                    <image v-else src="/static/lin.png"></image>
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
        affairs: Array
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
            uni.navigateTo({ url: "/pages/home/attendance-history-list" })
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
    .linetitle {
        display: flex;
        justify-content: space-between;
        width: 650rpx;
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
    }

    .history_card {
        margin-top: 25rpx;
        width: 600rpx;
        display: flex;
        padding: 25rpx;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        border-radius: 8px;
        border: 1px solid var(--stroke, #F1F1F1);
        background: #FFF;

        .headerline {
            display: flex;
            justify-content: space-between;
            width: 600rpx;

            margin-bottom: 25rpx;
            ;

            .left {
                display: flex;
            }

            .latemsg {
                color: #F95555;
                font-family: Inter;
                font-size: 12px;
                font-weight: 500;
            }

            .date {
                color: var(--Main-Text, #333);
                font-family: Inter;
                font-size: 16px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }

        }
    }

    .time image {
        width: 40rpx;
        height: 40rpx;
    }

    .img {
        width: 40rpx;
        height: 40rpx;
    }

    .time {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 20rpx;

        .img_box {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
        }
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

}
</style>