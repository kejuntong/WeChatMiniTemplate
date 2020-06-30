var databse = require('../../utils/clouldDatabase').default
import {navList} from '../../utils/utils'

Page({
    data:{
        navList:navList,
        detailInfo: {},
        // TODO: figure out how to directly use detailInfo
        isLoaded: false,
        id: '',
        loginInfo: {},
        swiperHeightPx:"",
        swiperHeight:0,
        swiperItems: []
    },

    onLoad:function(){
        console.log('test id:', this.options.id)
        if (!this.options.id) return
        this.setData({
            id: this.options.id
        },() =>{
            this.getAction()
        })
    },

    getAction: function(){
        wx.showLoading({title:'加载中...'})
        let that = this
        let where = {
            _id: that.data.id
        }
        databse.queryDb('test_post', where, null, null,
        (res) => {
            wx.hideLoading()
            if (res.data.length <= 0) {
                console.log('data length 0...')
                return
            }
            // TODO: figure out a better way
            if (res.data[0].imageIds > 0) {
                wx.showLoading({
                  title: '正在加载图片...',
                })
            }
            that.setData({
                isLoaded: true,
                detailInfo: res.data[0]
            })
        },
        (err) => {
            wx.hideLoading()
        })
    },

    onImgLoad:function(e){

        wx.hideLoading()
        console.log('kejun test.....')

        var winWid = wx.getSystemInfoSync().windowWidth;
        var imgh=e.detail.height;
        var imgw=e.detail.width;
        var swiperH=winWid*imgh/imgw 
        if (swiperH < this.data.swiperHeight) return
        this.setData({
            swiperHeight: swiperH,
            swiperHeightPx: swiperH+"px"
        })
    },

    // replyUpsHandler(e){
    //     let id = e.target.id
    //     let url = Api.replyUrl + '/' + id + '/ups'
    //     let data = {accesstoken:this.data.loginInfo.accesstoken}
    //     Api.fetchHandler('POST',url,data,(res) =>{
    //         if(res.success){
    //             wx.showToast({title:"评论成功！"})
    //         }else{

    //             wx.showToast({title:res.error_msg})
    //          }
    //     })
    // }
})