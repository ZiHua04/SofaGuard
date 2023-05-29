// pages/index/contorl/contorl.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '7e5233d024874b63a5929338ee676385',
    topic: "test",
    device_status: "离线", //默认离线
    powerstatus:"已关闭"   //默认关闭
  },
  data: {
    imageRightSrc:"../../../image/arrowright.png",
    imageLeftSrc:"../../../image/arrowleft.png"
  },
  rightTouch:function(){
    this.setData({
      imageRightSrc:"../../../image/_arrowright.png"
    });
    wx.vibrateShort({
      success: function () {
        console.log('震动反馈成功')
      }
    })
  },
  rightTouchEnd:function(){
    this.setData({
      imageRightSrc:"../../../image/arrowright.png"
    })
  },
  leftTouch:function(){
    this.setData({
      imageLeftSrc:"../../../image/_arrowleft.png"
    });
    wx.vibrateShort({
      success: function () {
        console.log('震动反馈成功')
      }
    })
  },
  leftTouchEnd:function(){
    this.setData({
      imageLeftSrc:"../../../image/arrowleft.png"
    })
  },
  button1:function()
  {
    
      that.setData({
        powerstatus:"已打开"
      })
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/data/1/', //api接口，详见接入文档
        method:"POST",
        data: {  //请求字段，详见巴法云接入文档，http接口
          uid: that.data.uid,
          topic: that.data.topic,
          msg:"on"   //发送消息为on的消息
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          wx.showToast({
            title:'打开成功',
            icon:'success',
            duration:1000
          })
        }
      })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this

    //请求设备状态
    //设备断开不会立即显示离线，由于网络情况的复杂性，离线1分钟左右才判断真离线
    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/status/', //状态api接口，详见巴法云接入文档
      data: {
        uid: that.data.uid,
        topic: that.data.topic,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success (res) {
        console.log(res.data)
        if(res.data.status === "online"){
          that.setData({
            device_status:"在线"
          })
        }else{
          that.setData({
            device_status:"离线"
          })
        }
        console.log(that.data.device_status)
      }
    })

          //请求询问设备开关/状态
          wx.request({
            url: 'https://api.bemfa.com/api/device/v1/data/1/', //get接口，详见巴法云接入文档
            data: {
              uid: that.data.uid,
              topic: that.data.topic,
            },
            header: {
              'content-type': "application/x-www-form-urlencoded"
            },
            success (res) {
              console.log(res.data)
              if(res.data.msg === "on"){
                that.setData({
                  powerstatus:"已打开"
                })
              }
              console.log(that.data.powerstatus)
            }
          })


    //设置定时器，每五秒请求一下设备状态
    setInterval(function () {
      console.log("定时请求设备状态,默认五秒");
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/status/',  //get 设备状态接口，详见巴法云接入文档
        data: {
          uid: that.data.uid,
          topic: that.data.topic,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          if(res.data.status === "online"){
            that.setData({
              device_status:"在线"
            })
          }else{
            that.setData({
              device_status:"离线"
            })
          }
          console.log(that.data.device_status)
        }
      })

      //请求询问设备开关/状态
      wx.request({
        url: 'https://api.bemfa.com/api/device/v1/data/1/', //get接口，详见巴法云接入文档
        data: {
          uid: that.data.uid,
          topic: that.data.topic,
        },
        header: {
          'content-type': "application/x-www-form-urlencoded"
        },
        success (res) {
          console.log(res.data)
          if(res.data.msg === "on"){
            that.setData({
              powerstatus:"已打开"
            })
          }
          console.log(that.data.powerstatus)
        }
      })

    }, 5000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})