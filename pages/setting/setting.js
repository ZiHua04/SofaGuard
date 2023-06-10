// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  upimage:function(){
    wx.chooseImage({
      count: 1, // 最多只能选择一张图片
      sizeType: ['compressed'], // 压缩图像文件
      sourceType: ['album', 'camera'], // 可以从相册或相机选择图片
      success(res) {
        // 将选择的图片上传到服务器
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://images.bemfa.com/upload/v1/upimages.php', // 服务器 URL
          filePath: tempFilePaths[0], // 上传的文件路径
          name: 'image', // 文件对应的 key，服务端可以通过这个 key 获取文件的二进制内容
          header: {
            'Content-Type': 'image/png', // 设置图片文件类型为PNG格式
            'Authorization': '7e5233d024874b63a5929338ee676385', // 设置访问令牌
            'Authtopic': 'test' // 设置主题信息
          },
          success(res) {
            console.log(res.data) // 上传成功后返回的数据
          },
          fail(err) {
            console.error(err) // 上传失败后的错误信息
          }
        })
      },
      fail(err) {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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