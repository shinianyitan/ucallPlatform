/*
* 智能机浏览器版本信息:
*
*/
var debug = false;
var browser = {
    versions: function() {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
/*
if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
    window.location = "https://itunes.apple.com/xxx";
}
else if (browser.versions.android) {
    window.location = "http://xxx/xxx.apk";
}
*/
// document.writeln("语言版本: " + browser.language);
// document.writeln(" 是否为移动终端: " + browser.versions.mobile);
// document.writeln(" ios终端: " + browser.versions.ios);
// document.writeln(" android终端: " + browser.versions.android);
// document.writeln(" 是否为iPhone: " + browser.versions.iPhone);
// document.writeln(" 是否iPad: " + browser.versions.iPad);
// document.writeln(navigator.userAgent);


//获取url参数
function urlrequest(paras) {
    var url = location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue.split("#")[0];
    }
}
String.prototype.format = function (args) {
    /*
    //两种调用方式
    var template1 = "我是{0}，今年{1}了";
    var template2 = "我是{name}，今年{age}了";
    var result1 = template1.format("loogn", 22);
    var result2 = template2.format({ name: "loogn", age: 22 });
    //两个结果都是"我是loogn，今年22了"
    */
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] !== undefined) {
                    var reg = new RegExp("({ *" + key + "( +(date|dateTime|eval))?( +(.*?))? *})", "gi");
                    result = result.replace(reg, function (patterStr) {
                        return formateDate(key, patterStr, args[key]);
                    });
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "gi");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
    function formateDate(key, string, data) {
        var temp = "";
        var reg = new RegExp("{ *(" + key + ")(?: +(date-ms|dateTime|eval))?(?: +(.*))? *}", "i");
        var patteres = string.match(reg);
        if (!patteres || patteres.length <= 2) {
            temp = args[key];
            temp = temp != null && temp != undefined ? temp : "";
            return temp;
        }
        var type = patteres[2];
        var expression = patteres[3];
        switch (type) {
            case "dateTime":
                temp = dateFormat(data, expression);
                break;
            case "date-ms"://  /Date(1429795218000)/格式毫秒
                temp = datemsFormat(data, expression);
                break;
            case "eval":
                if (expression) {
                    var value = data;
                    temp = eval(expression);
                } else {
                    temp = args[key];
                }
                break;
            default:
                temp = args[key];
                break;
        }
        temp = temp != null && temp != undefined ? temp : "";
        return temp;

    }

    function datemsFormat(str, fmt) {
        if (!str) return null;
        var d = eval('new ' + str.replace(/\//g, ''));
        return dateFormat(d, fmt);
    }
    function dateFormat(dateTime, fmt) {
        //author: meizz   
        if (!fmt) {
            fmt = "yyyy-MM-dd hh:mm:ss";
        }
        var o = {
            "M+": dateTime.getMonth() + 1,                 //月份   
            "d+": dateTime.getDate(),                    //日   
            "h+": dateTime.getHours(),                   //小时   
            "m+": dateTime.getMinutes(),                 //分   
            "s+": dateTime.getSeconds(),                 //秒   
            "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度   
            "S": dateTime.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
};


/*-----------与宿主交互---------------*/

var callClientProxy = {
    browserType: null,//0或空：android；1:ios；2:windows
    callcenterid: null,
    callId: null,
    employeeUid: null,
    callState: 0,
    serviceCode: null,
    otherCode: null,
    employeeName:null
};
callClientProxy.browserTypes= {
    android: 0,
    ios: 1,
    windows: 2,
    dedug:3
}
//主动设置浏览器类型
callClientProxy.setBrowserType = function(type) {
    this.browserType = type;
};
callClientProxy.setBrowserTypeEx = function (type) {
    this.browserType = type;
};
callClientProxy.browserType = urlrequest("browserType");
/*
if (callClientProxy.browserType == null) {
    //调用宿主获取浏览器类型
    try {
        callClientProxy.browserType=CallClient.browserType();//安卓
    }
    catch(e){    }
    try {
        //var url = 'UCall://browserType';//ios
        //window.location.href = url;
    }
    catch (e) {    }
    try {
       //TODO:windows
    }
    catch (e) {    }
}
*/
if (callClientProxy.browserType === null || callClientProxy.browserType === "" || typeof callClientProxy.browserType === "undefined") {
    //自动检测浏览器类型
    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        callClientProxy.browserType = "1";
    }
    else if (browser.versions.android) {
        callClientProxy.browserType = "0";
    }
    else {
        callClientProxy.browserType = "2";
    }
}
//alert("browserType:"+callClientProxy.browserType);

callClientProxy.GetEquid = function () {
    //alert("浏览器" + callClientProxy.browserType);
    try {
        var euid = "";
        if (this.browserType == 0 || this.browserType == "") {//android
            //alert("开始取" );
             euid = CallClient.GetEquid();
            //alert("取结束");
            //alert("CallClient111" + CallClient);
            return euid;//台席工号
        }
        if (this.browserType == 1) {//ios
            //
            return this.employeeUid;
        }
        if (this.browserType == 2) {//winform
            //
            return '620080003';
            return window.external.GetEquid();
        }
        if (this.browserType == 3) {//test
            return '11800015055';
        }
    }
    catch(e) {
        alert("取工号异常" + e);
    }
   
    return null;//demo
};
callClientProxy.EqName = function () {
    try {
        var euid = "";
        if (this.browserType == 0 || this.browserType == "") {//android
            euid = CallClient.GetEqName();
            return euid;//台席姓名
        }
        if (this.browserType == 1) {//ios
            return this.employeeName;
        }
        if (this.browserType == 2) {//winform
            return window.external.GetEqName();
        }
        if (this.browserType == 3) {//test
            return '11800015055';
        }
    }
    catch (e) {
        alert("取登录员工姓名错误" + e);
    }
    return null;//demo
};

callClientProxy.GetCallcenterid = function () {
    if (this.browserType == 0 || this.browserType == "") {//android
        return CallClient.GetOrganizationEuid();
    }
    if (this.browserType == 1) { //ios
        return this.callcenterid;
    }
    
    if (this.browserType == 2) { //winform
        return  window.external.GetCallcenterid();
    }
    
    if (this.browserType == 3) { //test
        return '201014';//demo
    }
    return null;
};
//获取App接口版本号
callClientProxy.GetApiVer = function (getApiVerCallback) {
    var url = 'UCall://GetApiVer?para={"callback":"{0}"}';
    url = url.format(getApiVerCallback);
    window.location.href = url;
};
//获取用户信息
callClientProxy.GetApiVer = function (callback) {
    var url = 'UCall://GetLoginUserInfo?para={"callback":"{0}"}';
    url = url.format(callback);
    window.location.href = url;
};
//关闭本页
callClientProxy.close = function () {
    

    if (this.browserType == 0 || this.browserType == "") {//android
        CallClient.QuestionnaireFinish();
    }
    if (this.browserType == 1) {//ios
        var url = 'UCall://close';
        //url = url.format(callback);
        window.location.href = url;;
    }
    if (this.browserType == 2) {//winform
        window.external.QuestionnaireFinish();
    }
};
//获取用户信息
//callClientProxy.close = function (callback) {
//    var url = 'UCall://GetLoginUserInfo?para={"callback":"{0}"}';
//    url = url.format(callback);
//    window.location.href = url;
//};


callClientProxy.WebLoaded = function () {
    this.Web1Loaded();
};
callClientProxy.Web1Loaded = function () {
    if (this.browserType === 0 || this.browserType === "") { //android
        CallClient.Web1Loaded();
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://Web1Loaded';
        window.location.href = url;
    }

};
//启动电话呼叫
callClientProxy.browserCall = function (called, name, caller, isRecord, url, callCallback, reportCallback) {
    /*
    *呼叫外线
    *
    *
    */
    //alert("this.browserType:"+this.browserType);
    if (this.browserType == 0 || this.browserType == "") { //android
        //alert("url跳转：" + url);
        CallClient.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 1) { //ios
        //.location.href = 'Call://{"Func":Call,"name"{0},"called":{1}"caller":{2},"isRecord":{3},"url":{4}}'.format(called, name, caller, isRecord, url);
        //var url = 'Call://{0}`{1}`{2}`{3}`{4}'.format(called, name, caller, isRecord, url);
        //var url = 'Call://{0},{1},{2},{3}'.format(called, name, caller, isRecord);
        var url = 'UCall://call?para={"name":"{0}","called":"{1}","caller":"{2}","isRecord":"{3}","type":"1","url":"{4}","callback":"{5}","report":"{6}","hide":0}'.format(name, called, caller, isRecord, url, callCallback, reportCallback);
       
        alert("url跳转22：" + url);
        try {
            window.location.href = url;

        } catch (e) {
            alert("browserCall异常:" + e);
        }
        //alert(url);
    }
    if (this.browserType == 2) { //android
        //window.location.href = url;
        window.open(url);
        //window.external.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
        //window.location.href = url;
        window.open(url);
    }
    if (debug) {
        setTimeout(function() {
            callTest(callCallback, reportCallback);
        }, 1000);
    } else {
        //window.location.href = uri;
    }
};
function callTest(callCallback, reportCallback) {
    try {
        eval("reportCallback('o1234567890', 0)");
        eval("reportCallback('o1234567890', 1)");
        eval("reportCallback('o1234567890', 2)"); 
    }
    catch (e){
        
    }
    try {
        eval("callCallback('o1234567890', 3)");

    }
    catch (e) {
        
    }
}
//挂机
callClientProxy.quitCall = function (callback, confid) {
    /*
    *呼叫外线
    *
    *
    */
    if (this.browserType == 0 || this.browserType == "") { //android
        //alert("url跳转：" + url);
        //CallClient.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://QuitCall?para={"callback":"{0} ","confid":"{1}"}';
        var url = url.format(callback, confid);
        window.location.href = url;
    }
    if (this.browserType == 2) { //android
        //window.open(url);
    }
    if (this.browserType == 3) {//test
        //window.open(url);
    }
    if (debug) {
        setTimeout(function() {
            quitCallTest(callback);
        }, 1000);
    } else {
        window.location.href = uri;
    }
};
function quitCallEnd(reslut) {
    var p = {
        reslut: reslut
    }
    console.log("挂机回调," + JSON.stringify(p));
}
function quitCallTest() {
    quitCallEnd(1);
}

//呼叫成员加入当前会话
callClientProxy.JoinMeeting = function (callback,called, name, type) {
    //type  1：外线；2：uid
    if (this.browserType == 0 || this.browserType == "") { //android
        CallClient.JoinMeeting(called, name, type,caller, isRecord, url);
    }
    if (this.browserType == 1) { //ios
        //.location.href = 'Call://{"Func":Call,"name"{0},"called":{1}"caller":{2},"isRecord":{3},"url":{4}}'.format(called, name, caller, isRecord, url);
        //var url = 'Call://{0}`{1}`{2}`{3}`{4}'.format(called, name, caller, isRecord, url);
        //var url = 'Call://{0},{1},{2},{3}'.format(called, name, caller, isRecord);
        var url = 'UCall://JoinMeeting?para={"callback":"{0}","called":"{1}","name":"{2}","type":"{3}"}';
        url = url.format(callback, called, name, type);
        window.location.href = url;
        //alert(url);
    }
    if (this.browserType == 2) { //winform
        window.external.JoinMeeting(called, name, type, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
       
    }
};

callClientProxy.GetCallState = function (callback) {
    try {
        var callState = "";
        if (this.browserType == 0 || this.browserType == "") {//android
            callState = CallClient.getCallState();
            return callState;//台席工号
        }
        if (this.browserType == 1) {//ios
            return this.callState;
        }
        if (this.browserType == 2) {//winform
            //
            //return 1;
            return window.external.GetCallState();
        }
        if (this.browserType == 3) {//test
            return 0;
        }
    }
    catch (e) {
        alert("取呼叫状态异常" + e);
    }

    return null;//demo
};
callClientProxy.GetOtherCode = function () {
    try {
        if (this.browserType == 0 || this.browserType == "") {//android
            //alert("开始取对方号码");
            otherCode = CallClient.getPhone();
            //alert("取对方号码结果" + otherCode);
            return otherCode;//台席工号
        }
        if (this.browserType == 1) {//ios
            return this.otherCode;
        }
        if (this.browserType == 2) {//winform
            //
            //return '13734567073';
            return window.external.GetOtherCode();
        }
        if (this.browserType == 3) {//test
            return 0;
        }
    }
    catch (e) {
        alert("取对方号码异常" + e);
    }

    return null;//demo
};
callClientProxy.getServiceCode = function () {
    try {
        var serviceCode = "";
        if (this.browserType == 0 || this.browserType == "") {//android
            serviceCode = CallClient.serviceCode();
            return serviceCode;//取业务Euid
        }
        if (this.browserType == 1) {//ios
            return this.serviceCode;
        }
        if (this.browserType == 2) {//winform
            //
            //return '620180005';
            return window.external.serviceCode();
        }
        if (this.browserType == 3) {//test
            return 0;
        }
    }
    catch (e) {
        alert("取工号异常" + e);
    }

    return null;
};
callClientProxy.GetCallId = function () {
    //alert("callClientProxy.GetCallId_browserType:" + this.browserType);
    if (this.browserType == 0 || this.browserType == "") {//android
        return CallClient.GetCallId();//呼叫编码
    }
    if (this.browserType == 1) {//ios
        return this.callId;

    }
    return "111111111111";
};

callClientProxy.getAcceptanceRe = function(b) {
    if (this.browserType == 0 || this.browserType == "") { //android
        CallClient.getAcceptanceRe(b);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://GetAcceptanceRe?b=1';
        window.location.href = url;
    }

};

callClientProxy.AcceptanceOfCompleted = function() {
    if (this.browserType == 0 || this.browserType == "") {//android
        CallClient.AcceptanceOfCompleted();
    }
    if (this.browserType == 1) {//ios
        var url = 'UCall://AcceptanceOfCompleted';
        window.location.href = url;
    }
};
callClientProxy.callClientBack = function () {
    if (this.browserType == 0 || this.browserType == "") {//android
        CallClient.Back();
    }
    if (this.browserType == 1) {//ios
        var url = 'UCall://Back';
        window.location.href = url;
    }
};
callClientProxy.WebFinish = function () {
    //web页面操作完毕，通知宿主
    this.AcceptanceOfCompleted();
};

callClientProxy.QuestionnaireCreated = function() {
    if (this.browserType == 0 || this.browserType == "") { //android
        CallClient.QuestionnaireCreated(); //web已经就绪
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://QuestionnaireCreated';
        window.location.href = url;
    }
};
callClientProxy.QuestionnaireFinish = function() {
    if (this.browserType == 0 || this.browserType == "") {//android
        CallClient.QuestionnaireFinish();
    }
    if (this.browserType == 1) {//ios
        //var url = 'UCall://QuestionnaireFinish';
        window.location.href = "UCall://close";
    }
    if (this.browserType == 2) {//winform
        window.external.QuestionnaireFinish();
    }
    
};

callClientProxy.loadWeb = function (url, title) {
    //开启新的webview加载指定页面 title：标题
    if (this.browserType == 0 || this.browserType == "") {//android
        //alert("url:" + url, ", title:" + title);
        CallClient.loadWeb(url, title);
    }else if (this.browserType == 1) { //ios
        window.location.href = url;
    } else {
        window.location.href = url;
    }
};
callClientProxy.loadModule = function (name) {
    var drhyReg = /^ucall:\/\/drhy/i;
    //通过制定模块名称调用app功能模块
    if (this.browserType == 0 || this.browserType == "") {//android
        //alert("name:" + name);
        CallClient.loadModule(name);
    }
    if (this.browserType == 1) {//ios
        var newWindowFlag = "fh_new_wnd=1";
        var p = name + (name.indexOf("?") < 0 ? ("?" + newWindowFlag) : ("&" + newWindowFlag));
        if (drhyReg.test(p)) {
            windows.location.href = 'UCall://Meeting?para={"callback":""," members":[],"url":""}';

        } else {
            window.location.href = "ucall://" + p;
        }
    }
};

//发短信
callClientProxy.sendMsg = function (param) {
    /*
    *呼叫外线
    *
    *
    */
    //alert("this.browserType:"+this.browserType);
    if (this.browserType == 0 || this.browserType == "") { //android

        var receivers = param.receivers;
        var p = JSON.stringify(receivers);
        CallClient.sendMsg(p);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://sendMsg?para={0}';
        url = url.format(JSON.stringify(param));
        window.location.href = url;
    }
    if (this.browserType == 2) { //android
        //window.location.href = url;
        //window.open(url);
        //window.external.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
        //window.location.href = url;
        //window.open(url);
    }
};

//调用手机拍照上传图片
callClientProxy.takePhoto = function (postUrl, mPostResult) {
    if (this.browserType == 0 || this.browserType == "") { //android
        return CallClient.takePhoto(postUrl, mPostResult);
    }
    return null;
};


callClientProxy.getBrowserType = function (type) {
    if (this.browserType == 0 || this.browserType == "") { //android
        return "android";
    }
    if (this.browserType == 1) { //ios
        return "ios"
    }
    if (this.browserType == 2) { //
        return "pc"
    }
};


///////////////
//调用手机拍照上传图片
callClientProxy.takePhotoBase64 = function (mPostResult) {
    if (this.browserType == 0 || this.browserType == "") { //android
        return CallClient.takePhoto(mPostResult);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://takePhoto?para={"callback":"{0}"}';
        url = url.format(mPostResult);
        window.location.href = url;
    }
    if (this.browserType == 2) { //android
        //window.location.href = url;
        //window.open(url);
        //window.external.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
        //window.location.href = url;
        //window.open(url);
    }
    return null;
};
///////////////
//调用获取gps位置
callClientProxy.GetCurPos = function (type, funcRet) {
    if (this.browserType == 0 || this.browserType == "") { //android
        return CallClient.GetCurPos(type, funcRet);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://GetCurPos?para={"callback":"{0}","type":"{1}"}';
        url = url.format(funcRet, type);
        window.location.href = url;
    }
    if (this.browserType == 2) { //android
        //window.location.href = url;
        //window.open(url);
        //window.external.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
        //window.location.href = url;
        //window.open(url);
    }
    return null;
}
//调用判断当前gps是否到达指定范围内
callClientProxy.CheckPosition = function (len, x, y, funcRet) {
    if (this.browserType == 0 || this.browserType == "") { //android
        return CallClient.GetCurPos(len, x, y, funcRet);
    }
    if (this.browserType == 1) { //ios
        var url = 'UCall://DiffCurPos?para={"callback":"{0}","x":"{1}","y":"{2}","len":"{3}"}';
        url = url.format(funcRet, x,y,len);
        window.location.href = url;
    }
    if (this.browserType == 2) { //android
        //window.location.href = url;
        //window.open(url);
        //window.external.Call(called, name, caller, isRecord, url);
    }
    if (this.browserType == 3) {//test
        //window.location.href = url;
        //window.open(url);
    }
    return null;
}
























///////////////


//iso回调函数 设置呼叫中心id
function SetOrganizationEuid(callcenterid) {
    callClientProxy.callcenterid = callcenterid;
    //alert("设置呼叫中心Id：" + callcenterid+"完毕");
}
//iso回调函数 设置工号
function SetEquid(equid) {
    //alertEx("得到结果：" + equid + "，" + new Date().getSeconds() + ":" + new Date().getMilliseconds());
    //gloabEquid = equid;
    callClientProxy.employeeUid = equid;
}
//iso回调函数 设置登录成员姓名
function SetEqName(name) {
    callClientProxy.employeeName = name;
}
//iso回调函数 设置通话编码
function SetCallId(callId) {
    //TODO:
    callClientProxy.callId = callId;
} 
//iso回调函数 设置通话状态
function SetCallState(callState) {
    callClientProxy.callState = callState;
}
//iso回调函数 设置对方号码
function SetOtherCode(otherCode) {
    //alert("设置对方号码：" + otherCode);
    callClientProxy.otherCode = otherCode;
}
//iso回调函数 设置业务编号
function SetServiceCode(serviceCode) {
    callClientProxy.serviceCode = serviceCode;
}



