// 云函数入口文件
const cloud = require('wx-server-sdk')

//默认选中当前用户使用的环境 
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == "shoucang") {
    return await cloud.database().collection("anylist").doc(event.id)//查询要更新的文章
      .update({//更新数据
        data: {
          shoucang: event.shoucang,//收藏状态传入
          love_count: event.love_count//计数
        }

      })
      .then(res => {//更新成功
        console.log('收藏数', event.love_count)
        console.log("改变收藏状态成功", res)
        return res
      })
      .catch(res => {
        console.log("改变收藏状态失败", res)
        return res
      })
  } else if (event.action == "fabiao") {
    return await cloud.database().collection("anylist").doc(event.id)//查询要更新的文章
      .update({//更新数据
        data: {
          pinglun: event.pinglun//评论状态传入

        }
      })
      .then(res => {//更新成功
        console.log("评论发表成功", res)
        return res
      })
      .catch(res => {
        console.log("评论发表失败", res)
        return res
      })

  } else {
    return await cloud.database().collection("anylist").doc(event.id)//查询要更新的文章
      .update({//更新数据
        data: {
          dianzan: event.dianzan,//点赞状态传入
          attention_count: event.attention_count
        }
      })
      .then(res => {//更新成功
        console.log("改变点赞状态成功", res)
        return res
      })
      .catch(res => {
        console.log("改变点赞状态失败", res)
        return res
      })


  }



}



  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
