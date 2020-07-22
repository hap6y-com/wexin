//index.js
//获取应用实例
const app = getApp()

Page({// 注册当前页面
  data: {
    motto: '开始使用你的旅游小贴士吧',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  handleClick(){
    //点击跳转到list页面
    wx.switchTab({
      url: '../list/list'
  })
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  
  onLoad: function () {
    if (!app.globalData.userInfo) {
      // console.log("获取成功", app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        //  console.log("获取成功111", res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // app.globalData.userInfo = res.userInfo
          // console.log("获取成功", res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    console.log("获取成功", e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
