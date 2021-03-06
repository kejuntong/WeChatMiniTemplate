//app.js

App({
  onLaunch: function (options) {
    console.log("app launch", options)
    wx.cloud.init({
      env: 'beimeixiaotong-8kxhj',
      traceUser: true
    })

    let that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('已授权', res)
              that.globalData.wxUserInfo = res.userInfo
            }
          })
        } else {
          console.log('微信没有授权')
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    wxUserInfo: null
  },

})