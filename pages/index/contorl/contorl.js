// pages/index/contorl/contorl.js
const app = getApp()
import mqtt from '../../../utils/mqtt.min.js';//加载mqtt库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '76c9ac8524f64e1887c6a7c6272bbb23',
    topic: "esp",
    device_status: "离线", //默认离线
    powerstatus:"已关闭" ,  //默认关闭
    imageRightSrc:"../../../image/arrowright.png",
    imageLeftSrc:"../../../image/arrowleft.png",
    testled:false,
    testmas:"这段显示主题中的消息"

  },

  mqttConnect(){
    var that = this;
    var options= {
      keepalive: 60, //60s ，表示心跳间隔
      clean: true, //cleanSession不保持持久会话
      protocolVersion: 4, //MQTT v3.1.1
      clientId:this.data.uid
    }
    //初始化mqtt连接
    this.data.client = mqtt.connect('wxs://bemfa.com:9504/wss',options);
    // 连接mqtt服务器
    this.data.client.on('connect', function () {
      console.log('连接服务器成功')
      //订阅dht11温湿度主题
      that.data.client.subscribe(that.data.topic, function (err) {
        if (err) {
            console.log(err)
        }
      })
      
    })
    //接收消息
    that.data.client.on('message', function (topic, message) {
      console.log(topic)
      var  msg = message.toString()
      if(topic == that.data.topic){//如果是**主题的消息
        that.setData({testmas:msg})
      }
      //打印消息
      console.log('收到消息：'+msg)
    })
    //断线重连
    this.data.client.on("reconnect", function () {
      console.log("重新连接")
    });
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
    this.data.client.publish(this.data.topic,'right');
  },
  rightTouchEnd:function(){
    this.setData({
      imageRightSrc:"../../../image/arrowright.png"
    })
    this.data.client.publish(this.data.topic,"stop");
  },
  leftTouch:function(){
    this.setData({
      imageLeftSrc:"../../../image/_arrowleft.png"
    });
    wx.vibrateShort({
      success: function () {
        console.log('震动反馈成功')
      }
    });
    this.data.client.publish(this.data.topic,"left");
  },
  leftTouchEnd:function(){
    this.setData({
      imageLeftSrc:"../../../image/arrowleft.png"
    })
    this.data.client.publish(this.data.topic,"stop");
  },
  teston:function(){
    this.data.client.publish(this.data.topic,"on");
  },
  testoff:function(){
    this.data.client.publish(this.data.topic,"off");
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){
    //连接mqtt
    this.mqttConnect()
    //检查设备是否在线
    this.getOnline()
    //检查设备是打开还是关闭
    this.getOnOff()
    //获取服务器上现在存储的dht11数据
    //this.getdht11()
  },
  getOnline(){
    var that = this
    //请求设备状态,检查设备是否在线
     //api 接口详细说明见巴法云接入文档
    wx.request({
      url: 'https://api.bemfa.com/mqtt/status/', //状态api接口，详见巴法云接入文档
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
  },
  getOnOff(){
    //获取设备状态，检查设备是打开还是关闭
    //api 接口详细说明见巴法云接入文档
    var that = this
    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/data/3/get/', //状态api接口，详见巴法云接入文档
      data: {
        uid: that.data.uid,
        topic: that.data.topic,
        num:1
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success (res) {
        console.log(res)
        if("undefined" != typeof res.data.data){//判断是否获取到温湿度
          console.log(res.data.data[0].msg)
          if(res.data.data[0].msg == "on"){
            that.setData({
              checked:true,
              ledOnOff:"打开",
              ledicon: "/utils/img/lighton.png",
            })
          }else{
            that.setData({
              checked:false,
              ledOnOff:"关闭",
              ledicon: "/utils/img/lightoff.png",
            })
          }
        }

      }
    })    
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