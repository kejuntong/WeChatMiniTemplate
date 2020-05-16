import {getValueByIndex,getLabels} from '../../utils/utils'
var database = require('../../utils/clouldDatabase').default

const app = getApp()

Page({
    data:{
        sendForm:{},
        topicArray:getLabels(),
        pickerIndex:0,
        disabled:false,
        loginInfo:{}
    },

    onLoad:function(){
        // TODO: check the wx storage
        // let that = this
        // wx.getStorage({
        //   key:'loginInfo',
        //   success:function(res){
        //       that.setData({loginInfo:res.data})
        //   }
        // })

        console.log('login info: ', app.globalData.wxUserInfo)
        this.setData({
            loginInfo: app.globalData.wxUserInfo
        })
    },

    pickerHandler:function(e){
        console.log('pickerHandler, 携带数据为：', e.detail.value)
        this.setData({pickerIndex:e.detail.value})
    },

    formSubmit:function(e){
        let title = e.detail.value.title
        let content = e.detail.value.content
        let tabValue = getValueByIndex(this.data.pickerIndex)
        console.log('即将提交：', title + ', ' + content + ', ' + tabValue)
        //发送请求
        wx.showLoading({title:'posting...'})
        database.insertDb('test_post', this.getData(title, tabValue), 
        (res) => {
            console.log('insert success:', res)
            wx.hideLoading()
        },
        (err) => {
            console.log('insert fail:', err)
            wx.hideLoading()
        })
    },

    getData(title, tab) {
        return {
            author: {
                loginname: this.data.loginInfo.nickName,
                avatar_url: this.data.loginInfo.avatarUrl
            },
            title: title,
            create_at: JSON.parse(JSON.stringify(new Date())),
            last_reply_at: JSON.parse(JSON.stringify(new Date())),
            reply_count: 0,
            visit_count: 0,
            top: false,
            tab: tab
        }
    }
})