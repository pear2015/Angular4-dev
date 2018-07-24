/**
 * Created by gaoqiang on 2016/6/14.
 */
describe("Test logger", function() {

  var winston = window.nodeRequire('winston');
  var winstonConfig = window.nodeRequire('winston-daily-rotate-file')
  var setlogger = require('./logger.js');

  it('shows setlogger is not null', function () {
    expect(setlogger).not.toBeNull();
  })

  it('shows logger is not null', function () {
    var logger = setlogger({verbose:'silly',logPath: 'C:\\Users\\loginfo'},winston,winstonConfig);
    logger.info('111');
    expect(logger).not.toBeNull();
  })

})
