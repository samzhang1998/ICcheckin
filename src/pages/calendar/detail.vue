<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek" />
            <text> Event Details</text>
        </view>
        <view class="event">
            <view class="flex line1">
                <view class="flex">
                    <view class="eventtitle">{{ event.title }}</view>
                    <view class="eventrepeat">({{ event.repeat.description }})</view>
                </view>
                <image src="/static/edit.png" alt="logo" class="editicon" @click="EditEvent" />
            </view>
            <view class="flex">
                <view class="date">{{ event.date.substring(8, event.date.length) }} {{ event.date.substring(5,
                    event.date.length - 3) | getMonthAbbr }} , </view>
                <view class="range">{{ event.startTimeStr || event.startTime }}-{{ event.endTimeStr || event.endTime }}
                </view>
            </view>
            <view class="flex flexlocation">
                <view class="location">{{ event.location }}</view>
                <view class="user">{{ event.creatorFirstName[0].toUpperCase() }}{{
                    event.creatorLastName[0].toUpperCase() }}</view>
            </view>
        </view>


        <view class="content">
            <view class="subtitle">Details</view>
            <view class="item">
                <view class="subtitle2">Lecturer</view>
                <view class="txt">{{ event.creatorFirstName }} {{ event.creatorLastName }}</view>
            </view>
            <view class="item">
                <view class="subtitle2">Attendees</view>
                <view class="txt">{{ event.users }} </view>
            </view>
            <view class="item">
                <view class="subtitle2">Description</view>
                <view class="txt">{{ event.description }} </view>
            </view>
            <view class="item">
                <view class="subtitle2">Repeat</view>
                <view class="txt">{{ event.repeat.description }} </view>
            </view>
            <view class="item">
                <view class="subtitle2">Alert</view>
                <view class="txt">{{ event.alertsr }} </view>
            </view>
        </view>
        <button @click="addCanlendar">Add to Canlendar</button>
        <view class="deltbn" v-if="event.creatorId == userinfo.id" @click="delevent">Delete Event</view>
        <Eventform ref="eventEditForm" :id="event.id" :eventRequest="eventRequest"
            @cancelLeaveRequest="cancelLeaveRequest" />
    </view>
</template>

<script>
    import {
        createEventCalendar,
        removeEventCalendar,
        getEventCalendar
    } from '@/uni_modules/bw-calendar-event';
    import {
        DeleteEventApi,
        getEventDetailApi
    } from "@/api/events";
    import Eventform from '@/components/event/eventform.vue';
    import Users from '@/components/event/users.vue';
    export default {
        components: {
            Eventform,
            Users
        },
        data() {
            return {
                eventRequest: false,
                event: {
                    id: null,
                    activetime: 6,
                    title: "SEO Meeting with Lee Massage",
                    date: "24 Feb 2025",
                    time: "3pm - 4pm",
                    description: "note",
                    righttxt: "Shuoqi Wang"
                },
                systemInfo: {},
                userinfo: {}

            };
        },
        filters: {

            getMonthAbbr(monthInput) {
                const monthNum = parseInt(monthInput, 10);
                const monthAbbrs = [
                    'Jan', 'Feb', 'Mar', 'Apr',
                    'May', 'Jun', 'Jul', 'Aug',
                    'Sep', 'Oct', 'Nov', 'Dec'
                ];

                if (monthNum >= 1 && monthNum <= 12) {
                    return monthAbbrs[monthNum - 1];
                }
                return 'Invalid Month';
            }
        },
        methods: {

            addCanlendar() {
                //console.log(uni)
                const title = this.event.title
                //日期格式yyyy-mm-dd MM:hh:ss
                if (this.systemInfo.platform === "ios") {
                    createEventCalendar({
                        title: title,
                        notes: this.event.description ? this.event.description : "",
                        startDate: this.event.date + " " + this.event.startTime, //'2025-07-15 10:00:10',
                        endDate: this.event.date + " " + this.event.endTime, //'2025-07-15 13:00:10',
                        alarmOffset: [-60 * 15],
                        isAllDay: false,
                        weeks: [],
                        success: (e) => {
                            uni.showToast({
                                icon: "success",
                                title: "Added."
                            })
                        },
                        fail: (e) => {
                            console.log(e);
                            if(e.message == 'repeat'){
                                 uni.showToast({
                                    icon: "success",
                                    title: "Added."
                                })
                            }else{
                                uni.showToast({
                                    icon: "error",
                                    title: e
                                })

                            }
                            
                        }
                    })
                } else {
                    const Calendar = plus.android.importClass("android.provider.CalendarContract");
                    const Intent = plus.android.importClass("android.content.Intent");

                    const intent = new Intent(Intent.ACTION_INSERT);
                    intent.setData(Calendar.Events.CONTENT_URI);
                    intent.putExtra(Calendar.Events.TITLE,title);
                    intent.putExtra(Calendar.Events.EVENT_LOCATION, this.event.location);
                    intent.putExtra(Calendar.Events.DESCRIPTION, this.event.description ? this.event.description : "");
                    intent.putExtra(Calendar.EXTRA_EVENT_BEGIN_TIME, new Date(this.event.date + " " + this.event.startTime).getTime());
                    intent.putExtra(Calendar.EXTRA_EVENT_END_TIME, new Date(this.event.date + " " + this.event.endTime).getTime());

                    const activity = plus.android.runtimeMainActivity();
                    activity.startActivity(intent);
                }


            },
            getUserInfo() {
                this.userinfo = uni.getStorageSync("userinfo")
                console.log(this.userinfo)
            },
            getDetail() {
                getEventDetailApi(this.event.id).then(({
                    data,
                    msg,
                    status
                }) => {

                    this.event = data
                    this.event.startTimeStr = this.event.startTime
                    this.event.endTimeStr = this.event.endTime
                    this.formatevent()
                })
            },
            cancelLeaveRequest() {
                this.eventRequest = false
                this.getDetail()

            },
            EditEvent() {
                //编辑事件
                this.eventRequest = true
                this.$refs.eventEditForm.setOldEventForm(this.event)
            },
            delevent() {
                let _this = this
                uni.showModal({
                    title: "Delete Event?",
                    content: "Please confirm delete this event.",
                    confirmText: "Confirm",
                    success: (res) => {
                        if (res.confirm) {
                            DeleteEventApi(_this.event.id).then((res) => {

                                if (res.status == 1) {
                                    uni.showModal({
                                        title: "Delete Event",
                                        content: "Event has been deleted.",
                                        showCancel: false,
                                        confirmText: "OK"
                                    })

                                    uni.navigateBack({
                                        delta: 1
                                    });
                                } else {
                                    uni.showModal({
                                        title: "Delete Event",
                                        content: res.msg,
                                        showCancel: false,
                                        confirmText: "OK"
                                    })
                                }
                            })
                        }
                    },
                });
            },
            preWeek() {
                uni.navigateBack({
                    delta: 1
                });
            },
            formatevent() {
                this.event.users = ""
                this.event.attendees.users.map((user) => {
                    this.event.users += " " + user.firstName + " " + user.lastName + ","
                })
                this.event.users = this.event.users.substr(0, this.event.users.length - 1);

                this.event.alertsr = ""
                this.event.alerts.map((alter) => {
                    this.event.alertsr += " " + alter.description + ","
                })
                this.event.alertsr = this.event.alertsr.substr(0, this.event.alertsr.length - 1);
            }
        },
        onLoad(options) {
            this.event = JSON.parse(options.event)
            console.log(this.event)
            this.formatevent()
            this.getUserInfo()
            this.systemInfo = uni.getSystemInfoSync();
        }
    }
</script>

<style scoped lang="scss" src="./detail.scss"></style>