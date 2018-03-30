
var config = require('../../config')
var _observer=void 0;
var _lastClass=void 0;
Page({
  data: {
    images:[],
    word:'',
    currentPage:0,
    loadedPage:0,
    bottomText:"加载中..."
  },
  onReady (){
    this.onPullDownRefresh();
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: 'zZ表情包',
      path: '/pages/bqb/bqb?id=',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          icon:"none",
          duration: 2000
        })
      }
    }
  },
  onPullDownRefresh: function () {
    this.setData({
      word: "",
      currentPage:1,
      loadedPage:0,
      bottomText: "加载中..."
    });
    this._interceptNetWork(this._$_loadData);
  },
  onReachBottom :function(){
    if (this.data.loadedPage == this.data.currentPage){
      this.setData({
        currentPage: this.data.currentPage+1
      });
      var that=this;
      this._interceptNetWork(this._$_loadData,function(){
        that.setData({
          currentPage: that.data.currentPage - 1,
          bottomText: "请检查网络后再试"
        });
      })
    }
  },
  bindConfirm: function (e) {
    var that=this;
    this.setData({
      currentPage: 1,
      loadedPage: 0
    });
    var fu=function(){
      wx.showLoading({
        title: '加载中',
      });
      that._$_loadData();
    }
    this._interceptNetWork(fu);
  },
  bindInput:function(e) {
    this.setData({
      word: e.detail.value
    });
    if (e.detail.value.length===0){
      this.onPullDownRefresh();
    }
  },
  previewImage: function (e) {
    var that = this,
      //获取当前图片的下表
    index = e.currentTarget.dataset.index,
    //数据源
    pictures = that.data.images.map(function (currentValue, index, arr){
      return currentValue.fileParent + currentValue.fileName;
    });
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  },
  _interceptNetWork:function(func,error){
    wx.getNetworkType({
      success: function (res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        var networkType = res.networkType
        if ('none' == networkType){
          wx.showToast({
            title: '请检查网络',
            icon: 'none',
            duration: 2000
          })
          if (typeof error == 'function') {
            error();
          }
        }else{
          if (typeof func=='function'){
            func();
          }
        }
      }
    });
  },
  _$_loadData: function () {
    var that=this;
    wx.request({
      url: config.service.imagesUrl + "?page=" + that.data.currentPage
      + "&word=" + that.data.word, //仅为示例，并非真实的接口地址
      data: void 0,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (Array.isArray(res.data.data)){
          var rawImages = that.data.images;
          rawImages = rawImages ? rawImages : [];
          if (res.data.data.length==0){
            that.setData({
              bottomText:"没有啦"
            });
          }
          if (res.data.page==1) {
            rawImages=[];
          }
          that.setData({
            currentPage: res.data.page,
            loadedPage: that.data.currentPage,
            images: rawImages.concat(res.data.data)
          });
        }else{
          wx.showToast({
            title: '没找到相关资源',
            duration: 2000
          })
        }
      },fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: '没找到相关资源',
          duration: 2000
        })
      }
    })
  }
})