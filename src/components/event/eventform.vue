<template>
    <view v-if="eventRequest" class="overlay"  >
        
        <scroll-view class="leave_request" @click.stop scroll-y>
            <image src="/static/guanbi.png" class="closeeventimg" @tap="closeEvent"/>
            <view class="leave_opt">
                <text class="title" v-if="id == null">Add Event</text>
                <text class="title" v-else>Edit Event</text>
                <text class="request_title">Event Name</text>
                <view class="selection">
                    <input class="uni-input" v-model="EventForm.title" />
                </view>
                <text class="request_title">Location</text>
                <view class="selection">
                    <input class="uni-input" v-model="EventForm.location" />
                </view>
                <text class="request_title">Event Date</text>
                <view class="selection">
                    <uni-datetime-picker type="date" :value="EventForm.date" class="datepicker"
                        @change="onEndChange" />
                    <picker mode="date" :value="EventForm.date" @change="onEndChange">
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view>
                <text class="request_title">Start Time</text>
                <view class="selection">
                    <picker mode="time" class="datepicker" :value="EventForm.startTime" @change="onStartTimeChange">
                        <text>{{ EventForm.startTime || "Select" }}</text>
                    </picker>
                    <picker mode="time" :value="EventForm.startTime" @change="onStartTimeChange">
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view>
                <text class="request_title">End Time</text>
                <view class="selection">
                    <picker mode="time" class="datepicker" :value="EventForm.endTime" @change="onEndTimeChange">
                        <text>{{ EventForm.endTime || "Select" }}</text>
                    </picker>
                    <picker mode="time" :value="EventForm.endTime" @change="onEndTimeChange">
                        <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                    </picker>
                </view>
                <text class="request_title">Attendees</text>
                <view class="selection" @click="addUsers">
                    <text v-if="EventForm.users.length>0"><span v-for="(item, index) in EventForm.users" :key="index"  class="alertitem">{{ item.name }} </span> </text>
                    <text v-else>Select</text>
                </view>
                <text class="request_title">Description</text>
                <view class="selection">
                    <input class="uni-input" v-model="EventForm.description" />
                </view>

                <text class="request_title">Repeat</text>
                <view class="selection" :class="repeatTypeSelection ? 'active' : ''" @click="showRepeatType">
                    <text>{{ EventForm.selectedRepeatType ? EventForm.selectedRepeatType : "Select" }}</text>
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                </view>
                <view v-if="repeatTypeSelection" class="type_menu">
                    <view v-for="(type, index) in repeatways" :key="index" class="type" @click="selectRepeatType(type)">
                        {{ type.description  }}
                    </view>
                </view>   

                <text class="request_title">Alert</text>
                <view class="selection" :class="leaveAlertSelection ? 'active' : ''" @click="showAlertType">
                    <text v-if="EventForm.selectedAlertType.length>0"><span v-for="(item, index) in EventForm.selectedAlertType" :key="index"  class="alertitem">{{ item }} </span> </text>
                    <text v-else>Select</text>
                    <image src="/static/Arrow_down.png" alt="arrow-down"></image>
                </view>
                <view v-if="leaveAlertSelection" class="type_menu">
                    <view v-for="(type, index) in alters" :key="index" class="type" @click="selectAlertType(type)">
                        {{ type.description }}
                    </view>
                </view>   
            </view>
            <button @click="handleSubmit">Submit Event</button>
        </scroll-view>
        
        <view class="contentusers"  v-if="showusers"> 
            <Users @closeUserDlg="closepopup" :selectedusers="selectedusers" :UserList="UserList" />
        </view> 
    </view>
</template>

<script>
import { getAlertEnumApi,
     getRepeatListApi,
     AddEventApi,
     EditEventApi,
    getUsers  } from '@/api/events'; 
    import Users from '@/components/event/users.vue';
export default {
    name: "LeaveRequest",
    components: { 
        Users
    },
    props: {
        eventRequest: {
            type: Boolean,
            default: false
        },
        id: {
            type: Number,
            default: null
        }
    },
    data() {
        return { 
            showusers:false,
            selectedusers:[],
            EventForm: {
                title: "",
                location: "",
                alertCodes: [],
                attendees: {
                    userIds: [],
                    others: []
                },
                date: null,
                users:[],
                startTime: null,
                endTime: null,
                repeatCode: null,
                description: '',
                selectedAlertType:[]
            },
            repeatTypeSelection:false,
            leaveAlertSelection: false,
            selectedLeaveType: "",
            selectedStartDate: "",
            selectedStartTime: "",
            selectedEndDate: "",
            selectedEndTime: "",
            startDateValue: Date.now(),
            showStartDate: false,
            endDateValue: Date.now(),
            showEndDate: false,
            note: "",
            selectedEndValue: "",
            selectedStartValue: "",
            leaveTypes: [
                "ANNUAL",
                "SICK",
                "REMOTE",
                "MEETING",
                "OUTSIDE",
                "OTHER"
            ],
            alters:[],
            repeatways:[],
            UserList:[]
        }
    },
    computed: {

    },
    methods: {
        setOldEventForm(event){ 
            this.EventForm.title = event.title
            this.EventForm.location = event.location
            this.EventForm.date = event.date
            this.EventForm.startTime = event.startTimeStr
            this.EventForm.endTime = event.endTimeStr

            this.EventForm.repeatCode = event.repeat.code
            this.EventForm.description = event.description
            this.EventForm.selectedAlertType = []
            this.EventForm.alertCodes = []
            event.alerts.map((item)=>{
                this.EventForm.selectedAlertType.push(item.description)
                this.EventForm.alertCodes.push(item.code)
            })
            this.EventForm.attendees.users = [] // = event.alerts
            this.EventForm.attendees.userIds = []
            event.attendees.users.map((item)=>{
                this.EventForm.users.push({name:item.firstName + " " + item.lastName, id:item.id})
               
                this.EventForm.attendees.userIds.push(item.id)
            })
            this.EventForm.selectedRepeatType = event.repeat.description

        },
         getAlertEnum() {
            getAlertEnumApi().then((res) => {
                console.log(res)
                this.alters = res.data
            })
        },
        getRepeatList() {
            getRepeatListApi().then((res) => {
                console.log(res)
                this.repeatways = res.data
            })
        },
        closepopup(users){ 
            this.EventForm.users = users
            this.showusers = false 
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
                    label: currentItem.firstName + " " + currentItem.lastName,
                    checked:false
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
        bindClick(e) {
			console.log(  e.select)
		},
        addUsers() {  
            this.selectedusers = this.EventForm.users
            this.showusers = true
        },
        closeEvent() { 
            this.$emit("cancelLeaveRequest");
            this.selectedLeaveType = "";
            this.leaveAlertSelection = false;
        },
        showRepeatType() {
            
            this.repeatTypeSelection = !this.repeatTypeSelection;
        },
        showAlertType() {
            this.leaveAlertSelection = !this.leaveAlertSelection;
        },
        selectRepeatType(type){
            this.EventForm.repeatCode = type.code
            this.EventForm.selectedRepeatType = type.description 
            this.repeatTypeSelection = false
        },
        selectAlertType(type) { 
            let index  = this.EventForm.alertCodes.indexOf(type.code) 
            console.log(index)
            if (index == -1){
                this.EventForm.alertCodes.push(type.code)
                this.EventForm.selectedAlertType.push(type.description) 
            }else{ 
                this.EventForm.alertCodes.splice(index, 1)
                let deindex = this.EventForm.selectedAlertType.indexOf(type.description)
                this.EventForm.selectedAlertType.splice(deindex, 1)
                 
            } 
        },   
        onEndChange(e) {
            console.log(e)
            this.EventForm.date = e; 
        },
        onStartTimeChange(event) {
            this.EventForm.startTime = event.detail.value;
            if (this.EventForm.startTime && this.EventForm.endTime < this.EventForm.startTime) {
                this.EventForm.startTime = "";
                uni.showToast({ title: "Invalid end time", icon: "none" });
            }
        },
        onEndTimeChange(event) {
            this.EventForm.endTime = event.detail.value;
            if (this.EventForm.endTime && this.EventForm.endTime < this.EventForm.startTime) {
                this.EventForm.endTime = "";
                uni.showToast({ title: "Invalid end time", icon: "none" });
            }
        },
        // onEndTimeChange (event) {
        //     this.selectedEndTime = event.detail.value;                
        // },
        validForm(){
            if (this.EventForm.title == ""){
                uni.showModal({
                    content:"Please input the title",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.location == ""){
                uni.showModal({
                    content:"Please input the location",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.date == "" || this.EventForm.date == null){
                uni.showModal({
                    content:"Please select the date",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.startTime == ""){
                uni.showModal({
                    content:"Please select the start time",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.endTime == ""){
                uni.showModal({
                    content:"Please select the end time",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.repeatCode == ""){
                uni.showModal({
                    content:"Please select the repeat way",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            if (this.EventForm.alertCodes.length == 0){
                uni.showModal({
                    content:"Please select the alert way",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

             if (this.EventForm.attendees.userIds.length == 0){
                uni.showModal({
                    content:"Please select the attendees",
                    confirmText: 'OK',
                    showCancel: false
                })
                return false
            }

            return true  
        },
        async handleSubmit() {
            this.EventForm.attendees.userIds = []
             this.EventForm.users.map((user)=>{
                this.EventForm.attendees.userIds.push(user.id)
             })
            if(!this.validForm()){
                return 
            } 
            let data = {
                title: this.EventForm.title,
                location: this.EventForm.location, 
                attendees: {
                    userIds:this.EventForm.attendees.userIds,
                    others: []
                },
                date: this.EventForm.date,
                startTime: this.EventForm.startTime ,
                endTime: this.EventForm.endTime,
                repeatCode: this.EventForm.repeatCode,
                description: this.EventForm.description,
                alertCodes: this.EventForm.alertCodes
            } 
            if(data.startTime.split(":").length==2){
                data.startTime = data.startTime +":00"
            }
            if(data.endTime.split(":").length==2){
                data.endTime = data.endTime +":00"
            }
 
            uni.showLoading() 
            if (this.id != null && this.id > 0){
                //编辑
                EditEventApi(this.id, data).then((res)=>{
                    console.log(res)
                    if(res.status == 1){
                        uni.showModal({
                            content:"Event has been saved.",
                            confirmText: 'OK',
                            showCancel: false
                        }) 
                        this.$emit("cancelLeaveRequest")
                    }else{
                        uni.showModal({
                            content:res.msg,
                            confirmText: 'OK',
                            showCancel: false
                        }) 
                    }
                }).finally((res)=>{
                    uni.hideLoading()
                })

            }else{
                AddEventApi(data).then((res)=>{
                    console.log(res)
                    if(res.status == 1){
                        uni.showModal({
                            content:"Event has been saved.",
                            confirmText: 'OK',
                            showCancel: false
                        }) 
                        this.$emit("cancelLeaveRequest")
                    }else{
                        uni.showModal({
                            content:res.msg,
                            confirmText: 'OK',
                            showCancel: false
                        }) 
                    }
                }).finally((res)=>{
                    uni.hideLoading()
                })

            }
            
 
            
        },
        formatTime(dateStr) {
            let dates = dateStr.split(" ")
            console.log(dates)
            const date = new Date(`${dates[0]}T${dates[1]}:00`);
            return date.toISOString();
        }
    },
    mounted(){
        this.getAlertEnum()
        this.getRepeatList()
        this.getAllUserlist() 
    }
}
</script>

<style scoped lang="scss" src="./eventform.scss"></style>