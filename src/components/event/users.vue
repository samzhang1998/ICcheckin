<template>
    <view  class="main"  > 
        <scroll-view class="items" @click.stop scroll-y>
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
            </view> 
        </scroll-view> 
    </view>
</template>

<script>
import { getAlertEnumApi,
     getRepeatListApi,
     AddEventApi,
     EditEventApi,
    getUsers  } from '@/api/events'; 
export default {
    name: "LeaveRequest",
    components: { 
    },
    props: {
        UserList: {
            type: Array,
            default () {
                return []
            }
        } 
    },
    data() {
        return {  
            allchecked:false,  
            users:[],
        }
    },
    computed: {

    },
    methods: { 
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
         
    },
    mounted(){
        
    }
}
</script>

<style scoped lang="scss" src="./users.scss"></style>