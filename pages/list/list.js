Page({
  data: {
    datalist: [],

  },

  // 搜索
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    // getList(this);
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    // getList(this);
  },
  inputTyping: function(e) {
    //搜索数据
    // getList(this, e.detail.value);
    this.setData({
      inputVal: e.detail.value
    });
    //根据内容搜索
    //连接数据库
    const db = wx.cloud.database()
    
    var that = this
    db.collection('anylist')
      .orderBy('createTime', 'desc') //按发布视频排序
    .where({
      
      //使用正则查询，实现对搜索的模糊查询
      title: db.RegExp({
        regexp: this.data.inputVal,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
       
    }).get({
      
      success: res => {
       
        console.log(res)
        that.setData({
          datalist: res.data
        })
      }
    })
  },
  //我们再js里可以接收两个数据
  previewImg: function(e) {
    let imgData = e.currentTarget.dataset.img;
    console.log("item2", imgData[0])
    console.log("item.fileIDs", imgData[1])
    //大图预览
    wx.previewImage({
      //当前显示图片
      current: imgData[0],
      //所有图片
      urls: imgData[1]
    })
  },


  //获取数据库数据
  onLoad() {
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
  },

  // 跳转到美食页
  goDelicious(event) {
    wx.navigateTo({
      url: "../Delicious/Delicious",
    })
  },
  // 跳转到美景页
  goScenery(event) {
    wx.navigateTo({
      url: "../Scenery/Scenery",
    })
  },
  // 跳转到发表页
  goSelect(event) {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "../Select/Select",
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


  },



  // 跳转到收藏页
  goPersonal(event) {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "../shoucang/shoucang",
          })
          // 已经授权
          console.log('授权成功')
        } else {
          wx.showToast({
            icon: "none",
            title: '请授权登录后操作',
           
          })
          console.log('授权失败')
          wx.navigateTo({
            url: '../index/index', //跳转到授权页面
          })
        }
      }
    })


  },

 
  
  //跳转到详情页
  goDetail(event) {
    //获取字段id
    console.log("点击获取的数据", event)
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: "/pages/detail/detail?id=" + event.currentTarget.dataset.item._id,
          })
          // 已经授权
          console.log('授权成功')
        } else {
          wx.showToast({
            icon: "none",
            title: '请授权登录后操作',
          })
          console.log('授权失败')
          wx.navigateTo({
            url: '../index/index', //跳转到授权页面
          })
        }
      }
    })


  },
  // 点击轮播图的时候跳转
  carouselToDetail(event) {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log('点击轮播图的时候跳转', event);
          let id = event.target.dataset.id;
          wx.navigateTo({
            url: '/pages/detail/detail?id=' + id,
          })
          // 已经授权
          console.log('授权成功')
        } else {
          wx.showToast({
            icon: "none",
            title: '请授权登录后操作',

          })
          console.log('授权失败')
          wx.navigateTo({
            url: '../index/index', //跳转到授权页面
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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