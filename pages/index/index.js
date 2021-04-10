/*
 * 图像路径的更新在拍照页完成
 * 具体查看拍照页saveImg()方法
 */
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 判断显示文字还是图片(预览图片标识)
    frontShow: true,
    // 身份证正面路径
    frontSrc: '',
    // 识别的学号信息
    imgInfo: ''

  },
  reset() {
    this.setData({
      frontShow: true,
      frontSrc: '',
      imgInfo: ''
    })
  },
  submit() {
    var that = this;
    wx.request({
      url: app.config.apiUrl + '/Card/activeNotice',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      data: {
        card_id: that.data.imgInfo,
      },
      success(res) {
        if (res.data.code === 20000) {
          wx.showToast({
            title: "已通知该同学",
            icon: 'succes',
            duration: 1500,
            mask: true
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1500,
            mask: true
          })
        }
      }
    })
  },
  handleInputChange: function (e) {
    let value = e.detail.value;
    this.setData({
      imgInfo: value
    })
  },
  // 拍摄身份证正面-跳转到拍摄页
  goFront: function () {
    // wx.navigateTo({
    //   url: '/pages/frontOfIDCard/frontOfIDCard',
    // })

    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照

      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有

      success: function (res) {

        that.setData({
          frontSrc: res.tempFilePaths[0],
          frontShow: false
        })
        wx.uploadFile({
          url: app.config.apiUrl + '/Card/uploadImg',
          filePath: res.tempFilePaths[0],
          name: 'files',
          success: function (res) {
            var data = JSON.parse(res.data)
            if (data.words_result_num !== 2) {
              that.setData({
                imgInfo: '识别出错'
              })
            } else {
              that.setData({
                imgInfo: data.words_result[1].words
              })
            }
            // console.log(imgInfoData);
            //do something
          }
        })
      }
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
    //下面的部分用于调试图片的位置
    // this.setData({
    //   frontShow: false,
    //   frontSrc: '../../images/hjp-ro.jpg'
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.uploadFile({
      url: app.config.apiUrl + '/Card/uploadImg',
      filePath: that.data.frontSrc,
      name: 'files',
      success: function (res) {
        var data = JSON.parse(res.data)
        if (data.words_result_num !== 2) {
          that.setData({
            imgInfo: '识别出错，请手动输入'
          })
        } else {
          that.setData({
            imgInfo: data.words_result[1].words
          })
        }
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