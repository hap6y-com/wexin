// pages/Publishb/Publishb.js
let app = getApp();

let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    fileID: [],
    desc: '',
    title: " ",
    avatarUrl: [],
    nickName: ""
  },

  //获取输入标题
  getContent(event) {
    console.log("输入的a标题", event.detail.value)
    this.setData({
      title: event.detail.value
    })
  },

  //获取输入内容
  getInput(event) {
    console.log("输入的内容", event.detail.value)
    this.setData({
      desc: event.detail.value
    })
  },


  //选择图片
  ChooseImage() {
    console.log(this.data.imgList.length)
    wx.chooseImage({
      count: 9, //默认9,我们这里最多选择8张
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("选择图片成功", res)
        this.setData({
          imgList: this.data.imgList.concat(res.tempFilePaths)
        })
      }
    });
  },

  //删除图片
  DeleteImg(e) {
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  //上传数据
  publish() {
    let title = this.data.title
    let desc = this.data.desc
    let imgList = this.data.imgList
    if (!title || title.length < 2) {
      wx.showToast({
        icon: "none",
        title: '请输入标题'
      })
      return
    }
    if (!desc || desc.length < 6) {
      wx.showToast({
        icon: "none",
        title: '内容需要大于6个字'
      })
      return
    }
    if (!imgList || imgList.length < 1) {
      wx.showToast({
        icon: "none",
        title: '请选择图片'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })

    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileID: this.data.fileID.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    Promise.all(promiseArr).then(res => {
      wx.cloud.database().collection('anylist').add({
        data: {
          fileID: this.data.fileID,
          pinglun: [],
          label: "shi",
          avatar: this.data.avatarUrl,
          // date: app.getNowFormatDate(),
          date: util.formatTime(new Date()),
          // createTime: db.serverDate(),
          createTime: util.formatTime(new Date()),
          desc: this.data.desc,
          author: this.data.nickName,
          title: this.data.title,
          attention_count: 0,
          love_count:0,
          images: this.data.imgList
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          console.log('发布成功', res)
          wx.navigateTo({
            url: '../Delicious/Delicious',
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
        // var avatarUrl = 'userInfo.avatarUrl';
        //var nickName = 'userInfo.nickName';
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})