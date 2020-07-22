
let ID = ""
let shoucang = false
let dianzan = false


Page({
  data: {
    Deldetail: "",
    imgUrl: "../../images/icon/shoucang-no.png",
    dianzanUrl: "../../images/icon/dianzan-no.png",
    pinglun: [],//评论数组
    content: "",
    nickName: "",
    avatarUrl: "",
    love_count: 0,
    attention_count: 0,
  },
  //我们再js里可以接收两个数据
  previewImg: function (e) {
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

  onLoad(options) {

    ID = options.id
    console.log("详情页接收的id", ID)//取出id
    wx.cloud.database().collection("anylist")
      .doc(ID)//传进id
      .get()
      .then(res => {
        console.log("详情页成功", res)
        shoucang = res.data.shoucang
        dianzan = res.data.dianzan

        this.setData({
          Deldetail: res.data,
          imgUrl: shoucang ? "../../images/icon/shoucang-yes.png" : "../../images/icon/shoucang-no.png",
          dianzanUrl: dianzan ? "../../images/icon/dianzan-yes.png" : "../../images/icon/dianzan-no.png",
          pinglun: res.data.pinglun,
          love_count: res.data.love_count,
          attention_count: res.data.attention_count,
        })
      })

      .catch(res => {
        console.log("详情页失败", res)
      })
  },

  // 收藏点击
  clickMe() {
    this.setData({
      imgUrl: shoucang ? "../../images/icon/shoucang-no.png" : "../../images/icon/shoucang-yes.png"
    })
    if (shoucang) {
      //如果已收藏
      this.setData({
        love_count: this.data.love_count - 1
      })

    } else {
      //如果未收藏
      this.setData({
        love_count: this.data.love_count + 1
      })
    }
    shoucang = !shoucang//取反

    //调用云函数
    wx.cloud.callFunction({
      name: "caozuo",
      data: {
        action: "shoucang",
        id: ID,
        shoucang: shoucang,
         love_count: this.data.love_count
      }
    }).then(res => {//更新成功
      console.log("改变收藏状态成功", res)
    })
      .catch(res => {
        console.log("改变收藏状态失败", res)
      })
    wx.showToast({
      icon: "none",
      title: shoucang ? '收藏成功，可在收藏夹查看' : '取消收藏',
      number: 7000
    })

  },


  //点赞点击
  clickMe2() {
    this.setData({
      dianzanUrl: dianzan ? "../../images/icon/dianzan-no.png" : "../../images/icon/dianzan-yes.png"
    })
    if (dianzan) {
      //如果已收藏
      this.setData({
        attention_count: this.data.attention_count - 1
      })

    } else {
      //如果未收藏
      this.setData({
        attention_count: this.data.attention_count + 1
      })
    }
    dianzan = !dianzan//取反

    //调用云函数
    wx.cloud.callFunction({
      name: "caozuo",
      data: {
        action: "dianzan",
        id: ID,
        dianzan: dianzan,
        attention_count: this.data.attention_count
      }
    }).then(res => {//更新成功
      console.log("小程序改变点赞状态成功", res)
    })
      .catch(res => {
        console.log("小程序改变点赞状态失败", res)
      })
    wx.showToast({
      icon: "none",
      title: dianzan ? '点赞成功' : '取消点赞',
      number: 7000
    })
  },

  //获取用户输入的评论内容
  getContent(event) {
    this.setData({
      content: event.Deldetail.value
    })
    // console.log("获取输入的值",content)
  },
  // 发表评论
  fabiao() {
    let content = this.data.content
    if (content.length < 1) {
      wx.showToast({
        icon: "none",
        title: '评论太短了',
      })
      return
    }
    let pinglunItem = {}
    pinglunItem.name = this.data.nickName
    pinglunItem.content = content
    let pinglunArr = this.data.pinglun
    pinglunArr.push(pinglunItem) //往数组后面新加数据
    console.log("添加后的评论数组", pinglunArr)
    wx.showLoading({
      title: '发表中...',
    })
    wx.cloud.callFunction({
      name: "caozuo",
      data: {
        action: "fabiao",
        id: ID,
        pinglun: pinglunArr
      }
    }).then(res => {//更新成功
      console.log("小程序评论发表成功", res)
      //实时页面刷新
      this.setData({
        pinglun: pinglunArr,
        content: ""
      })
      wx.hideLoading()//隐藏发表中图标
    })
      .catch(res => {
        console.log("小程序评论发表失败", res)
        wx.hideLoading()
      })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;


    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function (res) {
        console.log(res);
        var avatarUrl = 'userInfo.avatarUrl';
        //var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
      }
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },


})