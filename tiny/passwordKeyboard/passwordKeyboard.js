/*公共变量*/
//var RSAKey = require('./rsa.js');
//var app = getApp();
// var wxhttp = require("../../../utils/wxhttp.js");
// var confJs = require("../../../utils/conf.js");
// //var tiny = require("../tiny.js");
// var conf = confJs.conf;
var {keyboard} = require("../boardImg");
/*构造方法*/
function setup(name, keyboardType) {
    //声明常用变量
    var field;
    var that = this;
    var app = getApp();
    var pageStack = getCurrentPages();
    var currentPage = pageStack[pageStack.length - 1];
    setTimeout(() => {
        componentData.keyboardData = keyboard; 
        app.tiny.setData(name, componentData, currentPage);
    }, 10);
   
   

    //将组件data与page的data合并
    var pageData = {};
    if (keyboardType == 'number') {
        //数字密码键盘
        var componentData = pageData[name] = {
            hidden: true,
            numberKeyboardShow: true,
            uppercaseKeyboardShow: false,
            lowercaseKeyboardShow: false,
            clickNumberHandler: name + '_onclickkey',
            simulationInput: [],
            actualInput: [],
            reSimulationInput: [],
            reActualInput: [],
            keyboardType: 'number'
        };
    } else {
        var componentData = pageData[name] = {
            hidden: true,
            digitSymbol1KeyboardShow: false,
            uppercaseKeyboardShow: false,
            lowercaseKeyboardShow: true,
            clickNumberHandler: name + '_onclickkey',
            simulationInput: [],
            actualInput: [],
            reSimulationInput: [],
            reActualInput: [],
        };
    }
    currentPage.setData(pageData);
    //隐藏密码键盘
    currentPage.hideKeyboard = function () {
        currentPage.setData({
            cursorShow: false
        })
        currentPage.passwordKeyboard.closeKeyboard(currentPage.data.passwordKeyboard);
    }
    //每个数字按钮的点击事件
    currentPage[name + '_onclickkey'] = function (event) {
        console.log(event,'event')
        var componentData = currentPage.data[name];
        if (event.target.dataset.num == "F2") { //删除键
            if (field == 'password') {
                componentData.simulationInput.pop();
                componentData.actualInput.pop();
                componentData[field] = componentData.simulationInput.join('');
            } else if (field == 'confirmPassword') {
                componentData.reSimulationInput.pop();
                componentData.reActualInput.pop();
                componentData[field] = componentData.reSimulationInput.join('');
            }
        } else if (event.target.dataset.num == "F4") {
            //切换至数字字符键盘
            componentData.digitSymbol1KeyboardShow = true;
            componentData.uppercaseKeyboardShow = false;
            componentData.lowercaseKeyboardShow = false;
        } else if (event.target.dataset.num == "F7") {
            //切换至字母键盘
            componentData.digitSymbol1KeyboardShow = false;
            componentData.digitSymbol2KeyboardShow = false;
            componentData.uppercaseKeyboardShow = false;
            componentData.lowercaseKeyboardShow = true;
        } else if (event.target.dataset.num == "F3") {
            //切换至小写键盘
            if (componentData.keyboardType != 'number') {
                componentData.numberKeyboardShow = false;
                componentData.uppercaseKeyboardShow = false;
                componentData.lowercaseKeyboardShow = true;
            }
        } else if (event.target.dataset.num == "F1") {
            //大小写键盘切换
            componentData.uppercaseKeyboardShow = !currentPage.data[name].uppercaseKeyboardShow;
            componentData.lowercaseKeyboardShow = !currentPage.data[name].lowercaseKeyboardShow;
        } else if (event.target.dataset.num == "F8") {
            //特殊字符键盘切换
            componentData.digitSymbol1KeyboardShow = !currentPage.data[name].digitSymbol1KeyboardShow;
            componentData.digitSymbol2KeyboardShow = !currentPage.data[name].digitSymbol2KeyboardShow;
        } else if (event.target.dataset.num == "F6") {
            //CSII科蓝软件
        } else if (event.target.dataset.num == "F5") {
            //完成
            componentData.hidden = true;
            componentData.current = '';
        } else {
            //输入密码
            if (componentData.keyboardType == 'number') {
                //数字密码键盘密码数为6位
                var len = componentData.actualInput.length;
                if (len == 5) {
                    currentPage.hideKeyboard();
                } else if (len == 6) {
                    currentPage.hideKeyboard();
                    return;
                }
            }
            if (field == 'password') {
                componentData.actualInput.push(event.target.dataset.num);
                componentData.simulationInput.push('*');
                componentData[field] = componentData.simulationInput.join('');
            } else if (field == 'confirmPassword') {
                componentData.reActualInput.push(event.target.dataset.num);
                componentData.reSimulationInput.push('*');
                componentData[field] = componentData.reSimulationInput.join('');
            }
        }
        app.tiny.setData(name, componentData);
    };


    //返回公共API
    return {
        openKeyboard: function (preData, params) {
            //使用preData校正componentData中存储的密码信息
            componentData = preData;
            //显示密码键盘
            if (!componentData.hidden && field == params) {
                //有密码键盘且点击相同密码框
                return;
            } else {
                showKeyboard();
            }

            function showKeyboard() {
                componentData.hidden = false;
                componentData.current = params;
                field = params;
                app.tiny.setData(name, componentData);
            }
        },
        closeKeyboard: function (preData) {
            //隐藏密码键盘
            componentData = preData;
            componentData.hidden = true;
            componentData.current = '';
            app.tiny.setData(name, componentData);
        }
    }
}
module.exports = setup;