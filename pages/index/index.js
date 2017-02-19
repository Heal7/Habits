var app = getApp();
Page({
  data: {},
  onLoad: function () {
    this.setData({
      user_info:app.globalData.user_info
    });
    this.setTime();
    this.getLocation();
    this.checkout();
  },
  onShow:function(){
    var calendar_sign_data = wx.getStorageSync('calendar_sign_data') || [];
    this.setData({
       calendar_sign_data:calendar_sign_data
    })
  },
  //显示明日天气
  showWeather:function(){
    this.setData({
      show_weather:true,
      show_day:true,
      select_day:'select'
    });
  },
  //关闭明日天气
  close:function(){
    this.setData({
      show_weather:false,
      show_night:false,
      select_night:''
    })
  },
  //切换白天天气
  changeDay:function(){
    this.setData({
      show_day:true,
      show_night:false,
      select_day:'select',
      select_night:''
    });
  },
  //切换夜晚天气
  changeNight:function(){
    this.setData({
      show_day:false,
      show_night:true,
      select_day:'',
      select_night:'select'
    })
  },
  //设置当前时间
  setTime:function(){
    var _this = this,
        date = new Date(),
        hour = date.getHours();
    if(hour >= 0 && hour <= 5){
      _this.showTitle('GoodNight！');
    }else if(hour >= 6 && hour <=8){
     _this.showTitle('NewMoring!');
    }else if(hour >=9 && hour <=11){
      _this.showTitle('Morning!');
    }else if(hour >= 12 && hour <= 14){
      _this.showTitle('GoodNoon!');
    }else if(hour >=15 && hour <=18){
      _this.showTitle('GoodAfternoon!');
    }else if(hour >=19 && hour <=24){
      _this.showTitle('GoodEvening!');
    }
  },
  //设置提示内容
  showTitle:function(res){
    this.setData({
      time:res
    })
  },
  //输入框失去焦点
  blurInput:function(res){
    this.data.value = res.detail.value;
  },
  //检查缓存中是否有数据
  checkout:function(){
    var _this = this,calendar_sign_data = wx.getStorageSync('calendar_sign_data');
    if(calendar_sign_data.length){
      _this.setSaveTime();
    };
    setInterval(function(){
      if(calendar_sign_data.length){
        _this.setSaveTime();
      }
    },30000)
  },
  //设置习惯创建时间和当前时间相差时间
  setSaveTime:function(){
    var _this = this,
          date = new Date(),
          now_seconds = date.getTime(),
          calendar_sign_data = wx.getStorageSync('calendar_sign_data');
    for(var i = 0,len = calendar_sign_data.length;i<len;i++){
        var second = (now_seconds - calendar_sign_data[i].save_seconds)/1000;
        if(second < 3600){
          if(second<60){
            calendar_sign_data[i].save_time = '1'+" "+'min';
          }else{
            calendar_sign_data[i].save_time = Math.floor(second/60) + " "+ 'min';
          }
        }else if(second < 86400){
          calendar_sign_data[i].save_time = Math.floor(second/60/60)+ " "+ 'h';
        }else if(second < 2592000){
          calendar_sign_data[i].save_time = Math.floor(second/60/60/24)+ " "+ 'd';
        }else if(second < 2592000*30){
          calendar_sign_data[i].save_time = Math.floor(second/60/60/24/30)+ " "+ 'm';
        }else if(second < 2592000*30*12){
          calendar_sign_data[i].save_time = Math.floor(second/60/60/24/30/12)+ " "+ 'y';
        };
    };
    _this.setData({
        calendar_sign_data:calendar_sign_data
    });
    wx.setStorageSync('calendar_sign_data', calendar_sign_data);
  },
  //表单提交
  formSubmit:function(){
      var _this = this,
          calendar_sign_data = _this.data.calendar_sign_data,
          _data = {},
          date = new Date(),
          save_seconds = date.getTime(),
          id = _this.getRandomId();
      setTimeout(function(){
          var inDetail = _this.data.value;
          if(inDetail.toString().length <= 0){
              wx.showToast({
                title:'请输入习惯！',
                icon:'loading',
                duration:1800
              })
              return false;
          }
          //新增记录

          _data.id = id;
          _data.title = inDetail;
          _data.save_seconds = save_seconds;
          _data.save_time = '1'+" "+'min',
          _data.calendar_sign_count = '0';
          calendar_sign_data.push(_data);
          wx.setStorageSync('calendar_sign_data', calendar_sign_data);
          _this.setData({
              calendar_sign_data:calendar_sign_data,
              in_value:'',
              value:''
          });
          _this.checkout();
      },300);
  },
  //得到一个随机id
  getRandomId:function(){
    var calendar_sign_data = wx.getStorageSync('calendar_sign_data') || [],
        id = Math.round(Math.random()*5000),return_id;
    if(calendar_sign_data.length){
      for(var index in calendar_sign_data){
        if(calendar_sign_data[index].id == id ){
          that.getRandomId();
          break;
        }else{
         return_id = id;
        };
      }
    }else{
      return_id = id;
    };
    return return_id;
  },
  //删除行
  deleteRow: function(e){
     var _this = this,
         id = e.target.dataset.indexId,
         calendar_sign_data = _this.data.calendar_sign_data;
     if(calendar_sign_data.length){
       for(var index in calendar_sign_data){
         if(calendar_sign_data[index].id == id){
           calendar_sign_data.splice(index,1);
           wx.setStorageSync('calendar_sign_data', calendar_sign_data);
           _this.setData({
             calendar_sign_data:calendar_sign_data
           });
           break;
         };
       }
     };
  },
  //页面跳转
  navigateTo:function(e){
      console.log("---index page navigateTo calendarsign---");
      var id = e.target.dataset.indexId,title = e.target.dataset.value;
      console.log(e);
      wx.navigateTo({
        url: '../calendarsign/calendarsign?id=' + id + '&title=' + title,
      })
  },
  //获取地点
  getLocation:function(){
    var _this = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        _this.setData({
          lat:res.latitude,
          lng:res.longitude
        });
        _this.getWeather();
      }
    })
  },
  //获取天气数据
  getWeather:function(){
    var _this = this;
    wx.request({
      url: 'http://saweather.market.alicloudapi.com/gps-to-weather?from=1&lat='+_this.data.lat+'&lng='+_this.data.lng,
      data: {},
      method: 'GET', 
       header: {
        "Authorization":'APPCODE 1d3e37de8ea24122b6fcd016fc407622'
      }, 
      success: function(res){
        console.log(res);
        var _data = res.data.showapi_res_body,t_day = _data.f2.day,year = t_day.slice(0,4),month = t_day.slice(4,6),day = t_day.slice(6),t_time = year+'.'+month+'.'+day;
        _this.setData({
          t_time:t_time,
          address:_data.cityInfo.c3,
          weather_pic:_data.now.weather_pic,
          temperature:_data.now.temperature+'°',
          weather:_data.now.weather+'，',
          wind_direction:_data.now.wind_direction,
          t_day_weather:_data.f1.day_weather,
          t_day_weather_pic:_data.f1.day_weather_pic,
          t_day_temperature:_data.f1.day_air_temperature+'°',
          t_day_wind:_data.f1.day_wind_direction,
          t_night_weather:_data.f1.night_weather,
          t_night_weather_pic:_data.f1.night_weather_pic,
          t_night_temperature:_data.f1.night_air_temperature+'°',
          t_night_wind:_data.f1.night_wind_direction
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})
