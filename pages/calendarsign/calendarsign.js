// pages/calendarsign/calendarsign.js
//获取应用实例
var app=getApp();
var calendarSignData;//日历签到数据
var date;//当前日期的几号
var calendarSignDay;//签到多少天

Page({
  data:{},

  //事件处理函数
  calendarSign:function(){

    var _this = this,calendar_sign_data = _this.data.calendar_sign_data,id = _this.data.id,date = _this.data.date;
      for(var index in calendar_sign_data){
        console.log(id);
        if(calendar_sign_data[index].id === id){
          if(calendar_sign_data[index].calendar_sign_date){
              calendar_sign_data[index].calendar_sign_date = date;
              calendar_sign_data[index].calendar_sign_count++;
              wx.setStorageSync('calendar_sign_data', calendar_sign_data);
              _this.setData({
                calendar_sign_date:date,
                calendar_sign_count:calendar_sign_data[index].calendar_sign_count
              })
          }else{
              calendar_sign_data[index].calendar_sign_date = date;
              calendar_sign_data[index].calendar_sign_count = 1;
              wx.setStorageSync('calendar_sign_data', calendar_sign_data);
              _this.setData({
                calendar_sign_date:date,
                calendar_sign_count:1
              });
          } 
          break;
        };
    };
    wx.showToast({
      title:'签到成功',
      icon:'success',
      duration:2000
    });
  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    console.log("---calendarsign page onLoad---");
    console.log("id是："+options.id);
    console.log("title是："+options.title);
    var _this = this,
        id = Number(options.id),
        title = options.title,
        calendar_sign_data =wx.getStorageSync('calendar_sign_data');
    _this.data.calendar_sign_data = calendar_sign_data;
    _this.data.id = id;
    _this.data.title = title;
    for(var index in calendar_sign_data){
      if(calendar_sign_data[index].id == id){
        if(calendar_sign_data[index].calendar_sign_date){
            _this.setData({
            calendar_sign_count:calendar_sign_data[index].calendar_sign_count,
            calendar_sign_date:calendar_sign_data[index].calendar_sign_date,
          });
        }else{
          _this.setData({
            calendar_sign_count:0,
            calendar_sign_date:date
        })
        } 
        break;
      };
    };
    this.setData({habitTitle:options.title});

    var mydate = new Date();//当前日期（星期、月、日、年、时分秒）
    var year = mydate.getFullYear();//年
    var month = mydate.getMonth()+1;//月
    var date = mydate.getDate();//日
    var day = mydate.getDay();//星期
    if(date-day>1){
      var nbsp = 7-((date-day-1)%7);//1号前面几个空格
    }else{
      var nbsp = day-date+1;
    }
    
    console.log(month+'月');
    console.log(date+'号');
    console.log('星期'+day);
    console.log('nbsp'+nbsp);

    var monthSize;
    if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
      monthSize = 31;
    }else if(month==4||month==6||month==9||month==10){
      monthSize = 30;
    }else if(month==2){
      if((year-2000)%4==0){
        monthSize = 29;
      }else{
        monthSize = 28;
      }
    };
    this.setData({
      year:year,
      month:month,
      nbsp:nbsp,
      monthSize:monthSize,
      date:date
    })
  }
})