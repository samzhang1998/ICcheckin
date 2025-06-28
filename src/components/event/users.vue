<template>
    <view  class="main"  > 
        <view class="items" >
            <image src="/static/guanbi.png" class="closeeventimg" @tap="closeEvent"/>
            <view class="uni-list">
                <view class="flex">
                    <checkbox-group @change="selectAllChanged"> 
                      <checkbox :value="1" :checked="allchecked" /> Select All
                    </checkbox-group>
                </view>
                <checkbox-group @change="checkboxChange"  :value="users"> 
                    <label class="uni-list-cell uni-list-cell-pd" v-for="item in UserList" :key="item.id">
                        <view class="rname">{{item.label }}</view>
                        <view class="region  flex" v-for="children in item.children" :key="children.id">
                             <checkbox :value="children.id" :checked="children.checked" /> 
                             <view class="rlable">{{ children.label }}</view>
                        </view> 
                    </label>
                </checkbox-group>
                <!-- <view class="region  emails flex" v-for="(item, index) in emails" :key="index">
                    <checkbox :value="item.email" :checked="item.checked" /> 
                    <input type="text" v-model="item.email" class="rlable"  placeholder="Type Email Address..."/> 
                </view> 
                <view class="btntxt" @click="addNewEmails">+ Add New</view> -->
            </view> 
        </view> 
    </view>
</template>

<script> 
export default {
    name: "LeaveRequest",
    components: { 
    },
    props: {
        selectedusers:{
            type: Array,
            default () {
                return []
            }
        },
        UserList: {
            type: Array,
            default () {
                return []
            }
        } 
    },
    data() {
        return {  
            emails:[],
            allchecked:false,  
            users:[],
        }
    },
    watch: {
        selectedusers(newval){
            console.log("//////////////////////")
            console.log(newval) 
        } 
    },
    methods: { 
        addNewEmails(){
            let item = {
                email:"",
                checked:false
            }
 
        },
        closeEvent(){
            console.log(this.users)
            let result = []
            for (let m =0 ; m < this.users.length; m ++){
                for (let i =0 ; i < this.UserList.length; i ++){
                    for (let j =0 ; j < this.UserList[i].children.length; j ++){
                         if(this.users[m] ==this.UserList[i].children[j].id  ){
                            let useritem = {
                                id:this.users[m] ,
                                name: this.UserList[i].children[j].label 
                            }
                            result.push(useritem)
                         } 
                    }
                }
            }
            this.$emit("closeUserDlg",result)
        },
        selectAllChanged(e){
            if(e.detail.value.length == 1){
                //全选
                for (let i =0 ; i < this.UserList.length; i ++){
                    for (let j =0 ; j < this.UserList.length; j ++){

                    }
                }
                this.UserList.map((region)=>{
                    region.children.map((user)=>{
                        user.checked =true
                    }) 
                })
            }else{
                this.UserList.map((region)=>{
                    region.children.map((user)=>{
                        user.checked =false
                    }) 
                }) 
            } 
            console.log(this.UserList)
        },
        checkboxChange(e){ 
            this.users = e.detail.value
        },
        setDefaultChecked(){
            //
        }
         
    },
    mounted(){ 
        if(this.selectedusers.length >0){
            this.setDefaultChecked()
        }
    }
}
</script>

<style scoped lang="scss" src="./users.scss"></style>