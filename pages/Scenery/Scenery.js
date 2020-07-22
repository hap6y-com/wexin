Page({
  data: {
    datalist: [],
    inputVal: '',
    markersData: [ //后台返回的标记点数组 
      {
        "id": 1, //Number
        "placeName": "深圳大学", //String
        "placeAddress": "",
        "placeLongitude": 113.9366756402588, //Number
        "placeLatitude": 22.53236865950445 //Number
      }, {
        "id": 2,
        "placeName": "腾讯大厦",
        "placeAddress": "",
        "placeLongitude": 113.93470153442384,
        "placeLatitude": 22.540058474209314
      }, {
        "id": 3,
        "placeName": "桂庙新村",
        "placeAddress": "",
        "placeLongitude": 113.93349990478517,
        "placeLatitude": 22.52650191497704
      }, {
        "id": 4,
        "placeName": "竹子林",
        "placeAddress": "",
        "placeLongitude": 114.011887,
        "placeLatitude": 22.536671
      }, {
        "id": 5,
        "placeName": "福禄居",
        "placeAddress": "",
        "placeLongitude": 114.02272,
        "placeLatitude": 22.539301
      }, {
        "id": 6,
        "placeName": "香蜜公园",
        "placeAddress": "",
        "placeLongitude": 114.02157,
        "placeLatitude": 22.54342
      }, {
        "id": 7,
        "placeName": "东海国际中心",
        "placeAddress": "",
        "placeLongitude": 114.02039,
        "placeLatitude": 22.53639
      }
    ],
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
    db.collection('anylist').where({
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
      .where({
        label: "jing"

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
  
  adddetial(event) {
    console.log('进入导航页面')
    let plugin = requirePlugin('routePlan');
    let key = 'MNNBZ-5EXCW-VIQRE-R7BVN-YXJTH-2CFEG'; //使用在腾讯位置服务申请的key
    let referer = 'tourism-test'; //调用插件的app的名称
    let endPoint = JSON.stringify({ //终点
      // 'name': '桂林',
      'name': this.data.markersData[0].placeName,
      // 'latitude': 25.224820,
      'latitude': this.data.markersData[0].placeLatitude,
      // 'longitude': 110.258789,
      'longitude': this.data.markersData[0].placeLongitude,
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&navigation=1'
    });
  }
})