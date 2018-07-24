var screenManager = function ScreenManager(electron) {

    var _leftSceen;
    var _middleScreen;
    var _rightScreen;
    var _screens = electron.screen.getAllDisplays();

    return {
        GetAllScreens: getAllScreens,
        GetLeft: getLeft,
        GetMiddle: getMiddle,
        GetRight: getRight,
        GetPrimary: getPrimary,
        GetScreenByCondition: getScreenByCondition
    }

    /*
    * 获取所有的显示屏幕
    */
    function getAllScreens() {

        this.getLeft();
        this.getMiddle();
        this.getRight();

        return [_leftSceen, _middleScreen, _rightScreen];
    }

    /*
    * 获取中屏
    */
    function getMiddle() {
        if (!_screens || _screens.length == 0) return;
        _middleScreen = _screens.find((display) => {
            return display.bounds.x === 0;
        });
        return _middleScreen;
    }

    /*
    * 获取左屏
    */
    function getLeft() {
        if (!_screens || _screens.length == 0) return;
        _leftSceen = _screens.find((display) => {
            return display.bounds.x < 0;
        });
        return _leftSceen;
    }

    /*
    * 获取右屏
    */
    function getRight() {
        if (!_screens || _screens.length == 0) return;
        _rightScreen = _screens.find((display) => {
            return display.bounds.x > 0;
        });
        return _rightScreen;
    }


    /**
     * 获取主屏幕
     * 
     */
    function getPrimary() {
        return electron.screen.getPrimaryDisplay();
    }


    /**
     * 根据条件获取屏幕信息，<0 为左屏幕，0 为主屏，>0 为右屏幕
     * 
     * @param {any} condition 任意整数
     * @returns 
     */
    function getScreenByCondition(condition) {
        if (condition > 0) {
            return getRight();
        }
        if (condition < 0) {
            return getLeft();
        }
        return getPrimary();
    }

}

module.exports = screenManager;