import {getValueByIndex,getLabels} from '../../utils/utils'
var database = require('../../utils/clouldDatabase').default

const app = getApp()

Page({
    data:{
        title:"",
        content:"",
        topicArray:getLabels(),
        pickerIndex:0,
        loginInfo:{},
        tempImgPaths: [],
        fileIDs: [],
        swiperHeightPx:"",
        swiperHeight:0
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

    // TODO: add clear image function
    onUploadClick(e) {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success:res=> {
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
              this.setData({
                tempImgPaths: tempFilePaths
              })
            },
            fail:err=> {
                // this.setData({
                //     tempImgPaths: []
                //   })
            }
          })
    },

    onImgLoad:function(e){
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

    onAuthorizeClick(e) {
        wx.showLoading({
          title: '等待授权',
          mask: true
        })
        console.log('click test', e)
    },

    getUserInfo(info) {
        wx.hideLoading()
        const userInfo = info.detail.userInfo
        console.log('on get user info', userInfo)
        app.globalData.wxUserInfo = userInfo
        this.setData({
          loginInfo: userInfo
        })
      },

    pickerHandler:function(e){
        console.log('pickerHandler, 携带数据为：', e.detail.value)
        this.setData({pickerIndex:e.detail.value})
    },

    formSubmit:function(e){
        wx.showLoading({
            title: '提交中...',
          })
        let that = this
        this.uploadImages(
            (isSuccess) => {
                let title = e.detail.value.title
                let content = e.detail.value.content
                let tabValue = getValueByIndex(this.data.pickerIndex)
                console.log('即将提交：', title + ', ' + content + ', ' + tabValue)
                //发送请求
                that.submitPost(title,content,tabValue)
            }
        )
    },

    uploadImages: function (callback) {
        if (this.data.tempImgPaths.length == 0) {
            callback(false)
            return
        }
        const promiseArr = []
        //只能一张张上传 遍历临时的图片数组
        for (let i = 0; i < this.data.tempImgPaths.length;i++) {
          let filePath = this.data.tempImgPaths[i]
          let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
          //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
          promiseArr.push(new Promise((reslove,reject)=>{
            wx.cloud.uploadFile({
              cloudPath: new Date().getTime() + suffix,
              filePath: filePath, // 文件路径
            }).then(res => {
              // get resource ID
              console.log(res.fileID)
              this.setData({
                fileIDs: this.data.fileIDs.concat(res.fileID)
              })
              reslove()
            }).catch(error => {
              console.log(error)
            })
          }))
        }
        Promise.all(promiseArr).then(res=>{
            callback(true)
            wx.hideLoading()
            wx.showToast({
              title: '图片上传完成',
            })
        }).catch(error => {
            callback(false)
            wx.hideLoading()
            wx.showToast({
              title: '某个图片上传失败',
            })
          })
      },

    submitPost(title, content, tabValue) {
        let that = this
        database.insertDb('test_post', this.getData(title, content, tabValue), 
        (res) => {
            console.log('insert success:', res)
            wx.hideLoading()
            wx.switchTab({
                url: '../index/index', 
                success: function (e) { 
                    var page = getCurrentPages().pop()
                    if (page == undefined || page == null) return
                    page.onLoad()
                    that.resetData()
                } 
            }) 
        },
        (err) => {
            console.log('insert fail:', err)
            wx.hideLoading()
        })
    },

    getData(title, content, tab) {
        return {
            author: {
                loginname: this.data.loginInfo.nickName,
                avatar_url: this.data.loginInfo.avatarUrl
            },
            title: title,
            content: content,
            imageIds: this.data.fileIDs,
            create_at: JSON.parse(JSON.stringify(new Date())),
            last_reply_at: JSON.parse(JSON.stringify(new Date())),
            reply_count: 0,
            visit_count: 0,
            top: false,
            tab: tab
        }
    },

    resetData() {
        this.setData({
            title:"",
            content:"",
            pickerIndex:0,
            tempImgPaths:[],
            fileIDs:[],
            imageHeightPx:"",
            imageHeight:0
        })
    },
})