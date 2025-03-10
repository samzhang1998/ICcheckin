<template>
    <view class="working_hour">
        <view class="recording_title">
            <text class="title">{{ title }}</text>
            <text class="sub_title">{{ date }}</text>
        </view>
        <view class="recording_card">
            <view class="recording">
                <view class="recording_type">
                    <image src="/static/Clock_icon.png" alt="clock"></image>
                    <text class="recording_period">Last Attendance</text>
                </view>
                <view class="recording_hrs">{{ attendanceHrs }}</view>
            </view>
            <view class="recording">
                <view class="recording_type">
                    <image src="/static/Clock_icon.png" alt="clock"></image>
                    <text class="recording_period">Today</text>
                </view>
                <view class="recording_hrs">{{ workingHrs }}</view>
            </view>
        </view>
        <button :style="{background: isClockedIn ? '#000' : '#EFC462'}" @click="handleClick">{{ buttonText }}</button>
    </view>
</template>

<script>
import { workingHours } from '../../api/home';

    export default {
        name: "WorkingHour",
        props: {
            date: String,
            workingHrs: String,
            attendanceHrs: String,
            buttonText: {
                type: String,
                default: "Clock In Now"
            },
            isClockedIn: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                hours: [
                    {
                        time: 'Today',
                        total: this.workingHrs
                    },
                    {
                        time:'This Pay Period',
                        total: '32.00 Hrs'
                    }
                ]
            }
        },
        computed: {
            title () {
                return this.isClockedIn? "You have already checked in!" : "You have not checked in now!";
            }
        },
        methods: {
            handleClick() {
                this.$emit("buttonClick");
            }
        }
    }
</script>

<style scoped>
    .working_hour {
        width: 80%;
        padding: 5%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 12px;
        border-radius: 10px;
        background: #FEFEFE;
    }
    .recording_title {
        display: flex;
        flex-direction: column;
        align-items: start;
    }
    .title {
        color: #101828;
        font-size: 14px;
        font-weight: 600;
        line-height: 140%;
    }
    .sub_title {
        color: #475467;
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
    }
    .recording_card {        
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .recording {
        width: 160px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: start;
        gap: 8px;
        padding: 3%;
        border-radius: 8px;
        border: 1px solid #EBECEE;
        background: #F9F9F9;
    }
    .recording_type {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        gap: 3px;
    }
    .recording image {
        width: 16px;
        height: 16px;
    }
    .recording_period {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.5px;
        color: #475467;
    }
    .recording_hrs {
        color: #161B23;
        font-size: 22px;
        font-weight: 400;
        line-height: 28px; /* 127.273% */
        letter-spacing: 0px;
    }
    button {
        display: flex;
        width: 100%;
        height: 48px;
        padding: 12px 20px;
        justify-content: center;
        align-items: center;
        gap: 10px;
        flex-shrink: 0;
        border-radius: 100px;
        border: none;
        color: #fff;
        text-align: center;
        font-family: Nunito;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: 0.1px;
	}
</style>