//app.js

App({
  onLaunch: function (options) {
    console.log("app launch", options)
    wx.cloud.init({
      env: 'template-5fnnl',
      traceUser: true
    })
  },
  globalData: {
    userInfo: null
  }
})