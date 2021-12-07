/*引入各个组件*/
var passwordKeyboard = require('./passwordKeyboard/passwordKeyboard.js');

/*helper method*/
/*
* extend
* @desc 将newObje与oldObje合并,并且更新oldObj的值
* @param (Obj,Obj)
* @exmple
*       var obj1={name:'wangji',age:'18'};
*       var obj2={age:'21'};
*       var obj3=extend(obj1,obj2)
*       obj3=={name:'wangji',age:'18'}
*/
function extend(oldobj,newobj){
    for(var property in newobj){
        oldobj[property]=newobj[property];
    }
    return oldobj;
}


/*
 * update
 * @desc 更新组件data
 * @param (string,Obj)
 */
function update(cmName,dataObj,page){
    var pagestack=getCurrentPages();
    var that = page || pagestack[pagestack.length-1];
    var componentDataOnMounting = that.data[cmName];
    var newDataObj = extend(componentDataOnMounting,dataObj);
    var pageData={};
    pageData[cmName]=newDataObj;
    console.log(that,'that',pageData,'pagedata')
    that.setData(pageData);
    console.log(that.data,'data')
}

module.exports={
    setData:update,
    passwordKeyboard:passwordKeyboard
}