describe("Test window", function() {
  var flag =false;
  var loadFinish =false;
  var loadFail =false;
  var close =false;
  var logger ={
    info:function(){

    }
  };
  var browserWindow = function (){
    this.webContents={
      on: function (msg,callback){
        callback();
      }
    };
    this.loadURL =function (){
      flag =true;
      this.webContents.on('did-finish-load',function(){
        loadFinish=true;
      });
      this.webContents.on('did-fail-load',function(){
        loadFail=true;
      });
      this.on('closed',function(){
        close=true;
      });
    };
    this.on = function(msg,callback){
      callback(msg);
    }
  };
  browserWindow.logger = logger;

  var createWindow = require('./window.js');

  createWindow(browserWindow);

  it('shows createWindow success', function () {
    expect(flag).toBeTruthy();
  })

  it('shows createWindow load finish', function () {
    expect(loadFinish).toEqual(true);
  })

  it('shows createWindow load dail', function () {
    expect(loadFail).toEqual(true);
  })

  it('shows createWindow close', function () {
    expect(close).toEqual(true);
  })
});
