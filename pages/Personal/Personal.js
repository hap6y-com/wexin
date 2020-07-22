Page({
  data: {
    datalist: [],
    
    // shoucang:shoucang 
    
  },
  //获取数据库数据
  onLoad() {
    var that = this;

    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          /**
          * 获取用户信息
          */
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var avatarUrl = 'userInfo.avatarUrl';
              var nickName = 'userInfo.nickName';
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl,
                [nickName]: res.userInfo.nickName,
              })
            }
          })
          // 已经授权
          console.log('授权成功')
        } else {
          wx.showToast({
            icon: "none",
            title: '请授权登录后操作',
            number: 7000
          })
          console.log('授权失败')
          wx.navigateTo({
            url: '../index/index', //跳转到授权页面
          })
        }
      }
    })

    // 调用云函数
    wx.cloud.database().collection('anylist')
      .orderBy('createTime', 'desc') //按发布视频排序
      .where({
        // title:"标题5"
        _openid: "ozzhe5VCY5Em0P5NEt87NXgQzaCQ"
        // desc:"描述2"
      })
      .get().then(res => {
        console.log("获取成功", res)
        this.setData({
          datalist: res.data
        })
      })

      .catch(res => {
        console.log("获取失败", res)
      })
  },
  //跳转到详情页
  goDetail(event) {
    //获取字段id
    console.log("点击获取的数据", event.currentTarget.dataset.item._id)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + event.currentTarget.dataset.item._id,
    })


    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.cloud.database().collection('anylist')
      .orderBy('createTime', 'desc') //按发布视频排序
      .get().then(res => {
        console.log("获取成功", res)
        this.setData({
          datalist: res.data
        })
      })
      .catch(res => {
        console.log("获取失败", res)
      })
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
})