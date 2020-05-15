//index.js
var fetch = require('../../utils/api').default
var databse = require('../../utils/clouldDatabase').default
import {navList} from '../../utils/utils'

const app = getApp()

Page({
    data: {
        navList:navList,
        activeValue:'',
        topicList:[],
        showLoadMore:true,
        skip:0,
        tab:'',
        limit:5
    },

    navHandler(e) {
        let that = this
        that.setData({
            activeValue:e.target.dataset.value,
            tab:e.target.dataset.value,
            topicList:[]
        },() =>{
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 300
            })
            that.getAction()
        })
    },

    onShareAppMessage: function () {
        return {
            title: '仿CNode微社区',
            path: '/page/index/index'
        }
    },

    onPullDownRefresh:function() {
        let that = this
        that.setData({
            topicList:[],
            skip:0
        },() => {
            that.getAction()
            wx.stopPullDownRefresh()
        })
    },

    onReachBottom:function(){
        let that = this
        let skip = that.data.skip
        let limit = that.data.limit
        that.setData({
            skip:(skip+limit)
        },() => {
            setTimeout(()=>{
                if (that.data.showLoadMore) that.getAction()
                else console.log('show load more:', 'false')
            },600)
        })
    },

    getAction(){

        console.log('打印时间', JSON.stringify(new Date()))

        wx.showLoading({title:''})
        let that = this
        databse.queryDb('test_post', null, 
        that.data.limit, that.data.skip,
        (res) => {
            console.log('query success:', res.data)
            let data = [...that.data.topicList,...res.data]
            this.setData({
                topicList:data,
            })
            if(res.data.length < that.data.limit){
                this.setData({
                    showLoadMore:false
                })
            }
            wx.hideLoading()
        },
        (err) => {
            wx.hideLoading()
        })
    },

    onLoad:function() {
        this.getAction()
    },

})
