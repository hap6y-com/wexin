//app.js

App({  
  onLaunch: function () {
    //云开发初始化
    wx.cloud.init({
      env:"yunkaifa1-y9yel"
    })
    // wx.setTabBarBadge({
    //   index: 1,
    //   text: '99+'
    // })
  },
   //get locationInfo
   getLocationInfo: function (cb) {
    var that = this;
    if (this.globalData.locationInfo) {
      cb(this.globalData.locationInfo)
    } else {
      wx.getLocation({
        type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        success: function (res) {
          that.globalData.locationInfo = res;
          cb(that.globalData.locationInfo)
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
    }
    
  },
  globalData:{
    // Flag:false,
    userInfo:{},
    locationInfo: null
  }, 

 


})