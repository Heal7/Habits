//app.js
App({
  onLaunch: function () {
    this.getUserInfo();
  },
  getUserInfo:function(cb){
    var _this = this;
    wx.login({
      success: function(res){
        wx.getUserInfo({
          success: function(res){
            _this.globalData.user_info = res.userInfo;
          }
        })
      }
    })
  },
  globalData:{
    user_info:null
  }
});