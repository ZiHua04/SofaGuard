// pages/setting/setting.js
var app = getApp();
import mqtt from '../../utils/mqtt.min';//加载mqtt库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phonenum:'',
    uid: '7e5233d024874b63a5929338ee676385',
    topic: "phonenum",
  },
  saveifo(){
    this.data.client.publish(this.data.topic,this.data.phonenum);
  },
  savephonenum:function(e){
    this.setData({
      phonenum:e.detail.value
    })
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
        that.setData({phonenum:msg})
      }
      //打印消息
      console.log('收到消息：'+msg)
    })
    //断线重连
    this.data.client.on("reconnect", function () {
      console.log("重新连接")
    });
  },
  getPhoneNum(){
    var that = this;
    wx.request({
      url: 'https://api.bemfa.com/api/device/v1/data/3/get/',
      data: {
        uid: that.data.uid,
        topic: that.data.topic,
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      success(res){
        console.log(res)
        if("undefined" != typeof res.data.data){
          console.log(res.data.data[0].msg)
          that.setData({
            phonenum:res.data.data[0].msg
          })
        }
      }

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.mqttConnect()
    this.getPhoneNum()
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