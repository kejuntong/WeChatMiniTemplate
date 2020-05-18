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
        imgSrc: [
            "../../assets/img/11.jpg",
            "../../assets/img/12.jpg",
            "../../assets/img/13.png",
          ],
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
        wx.showLoading({title:'加载中'})
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
            that.setData({
                isLoaded: true,
                detailInfo: res.data[0]
            })
        },
        (err) => {
            wx.hideLoading()
        })
    },

    replyUpsHandler(e){
        let id = e.target.id
        let url = Api.replyUrl + '/' + id + '/ups'
        let data = {accesstoken:this.data.loginInfo.accesstoken}
        Api.fetchHandler('POST',url,data,(res) =>{
            if(res.success){
                wx.showToast({title:"评论成功！"})
            }else{

                wx.showToast({title:res.error_msg})
             }
        })
    }
})