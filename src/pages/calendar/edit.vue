<template>
    <view class="maindiv">
        <view class="title">
            <image src="/static/back_icon.png" alt="logo" @click="preWeek" />
            <text> Event Details</text>
        </view>
        <view class="event"> 
            <Eventform :eventRequest="eventRequest" @cancelLeaveRequest="cancelLeaveRequest"/>
        </view>
        <view >
            <Users />
        </view>
              
        <view class="deltbn" @click="showTree">Add Event</view>
    </view>
</template>

<script>
import { DeleteEventApi } from "@/api/events";
import Eventform from '@/components/event/eventform.vue';
import Users from '@/components/event/users.vue';
import { getAlertEnumApi,
     getRepeatListApi,
     AddEventApi,
     EditEventApi,
    getUsers  } from '@/api/events'; 
export default {
    components: {
        Eventform ,
        Users
    },
    data() {
        return {
            eventRequest:true,
            value: "",   
            UserList:[],
            event: {
                activetime: 6,
                title: "SEO Meeting with Lee Massage",
                date: "24 Feb 2025",
                time: "3pm - 4pm",
                description: "note",
                righttxt: "Shuoqi Wang"
            }

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
        cancelLeaveRequest(){
            this.eventRequest = false 
        },
        bindClick(e) {
				console.log('点击item，返回数据' + JSON.stringify(e))
			},
        showTree() {
            // 打开选择器
            this.$refs.popup.open('bottom');
            // 关闭选择器
            // this.$refs.pengTree._hide();
        },
        treeCancel(e) {
            console.log("你点击了取消");
            console.log(e);
        },
        treeConfirm(e) {
            console.log("你点击了确定");
            console.log(e);
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
                            console.log(res)
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
        groupBy(array, key) {
            return array.reduce((result, currentItem) => {
                const groupKey = currentItem[key];
                if (!result[groupKey]) {
                    result[groupKey] = {
                        "label": currentItem['regionName'],
                        id: "",
                        children: []
                    };
                }
                result[groupKey].id += "," + currentItem.userId
                let user = {
                    id: currentItem.userId,
                    label: currentItem.firstName + " " + currentItem.lastName
                }
                result[groupKey].children.push({ ...user });
                return result;
            }, {});
        },
        getAllUserlist() {
            getUsers().then(({  data, status, msg } ) => {
                let users = this.groupBy(data, "regionId");
                let keys = Object.keys(users)
                this.UserList = []
                keys.map((item) => {
                    this.UserList.push(users[item])
                })
                console.log(this.UserList)
            })
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
        this.getAllUserlist()
    }
}
</script>

<style scoped lang="scss" src="./edit.scss"></style>
