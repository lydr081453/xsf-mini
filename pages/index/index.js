//index.js
//获取应用实例
const app = getApp();
var bannerUrls;
var photoNews;

var url = "http://xiaoshefei.test/api/products";
var page = 1;
var page_size = 6;
var sort = "last";
var is_easy = 0;
var lange_id = 0;
var pos_id = 0;
var unlearn = 0;
var is_list_bottom = false;

// 请求商品列表
var loadMore = function (that) {
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      page: page,
      page_size: page_size,
      sort: sort,
      is_easy: is_easy,
      lange_id: lange_id,
      pos_id: pos_id,
      unlearn: unlearn
    },
    success: function (res) {
      //console.info(that.data.list);
      var list = that.data.list;
      for (var i = 0; i < res.data.data.length; i++) {
        list.push(res.data.data[i]);
      }
      that.setData({
        list: list
      });
      page++;
      that.setData({
        hidden: true
      });
    }
  });
}

Page({
  data: {
    //motto: 'Hello World',
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,

    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,

    changeIndicatorDots: function (e) {
      this.setData({
        indicatorDots: !this.data.indicatorDots
      })
    },
    changeAutoplay: function (e) {
      this.setData({
        autoplay: !this.data.autoplay
      })
    },
    intervalChange: function (e) {
      this.setData({
        interval: e.detail.value
      })
    },
    durationChange: function (e) {
      this.setData({
        duration: e.detail.value
      })
    },
  },
    //轮播结束
  //轮播高度自适应——获取图片高度
  imgHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height;//图片高度
    var imgw = e.detail.width;//图片宽度
    var swiperH = winWid * imgh / imgw + "px"
    this.setData({
      Height: swiperH//设置高度
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    loadMore(that);

    //链接数据库
    wx.request({
      url: 'http://xiaoshefei.test/api/photos',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var bannerUrls =[];
        var photoNews = [];
        for (var i = 0; i < res.data.data.length; i++){
          if (res.data.data[i].type=='banner'){
            bannerUrls.push(res.data.data[i]);
          }else{
            photoNews.push(res.data.data[i]);
          }
        }

        that.setData({
          bannerUrls: bannerUrls,
          photoNews: photoNews
        });
      }
    })

    
  },

  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    loadMore(that);
    is_list_bottom = true;
    console.log("lower");
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    // page = 0;
    // this.setData({
    //   list: [],
    //  scrollTop: 0
    // });
    //loadMore(this);
    //console.log("lower");
  }
})
