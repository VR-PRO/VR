/**
 * 描述:登录模块-js
 * 时间:2016-11-11
 * *****变更记录*******
 *
 */
(function() {


    $(document).ready(function() {
        var btnLoginAction = $("#btnLoginAction");
        var inputUserName = $("#inputUserName");
        var inputPassword = $("#inputPassword");
        var inputJcaptchaCode = $("#inputJcaptchaCode");
        var inputJcaptchaCodeImg = $("#inputJcaptchaCodeImg");
        var spanChangeJcaptchaCode = $("#spanChangeJcaptchaCode");
        var loginForm = $("#loginForm");
        var inputErrorMsg = $("#inputErrorMsg");

        var login = {
            validate: function() {
                var username = $.trim(inputUserName.val());
                var pwd = $.trim(inputPassword.val());
                if (!zanke.test.mobile(username)) {
                    message.error('手机号格式不正确.');
                    return false;
                }
                if (inputJcaptchaCode.length > 0) {
                    var code = $.trim(inputJcaptchaCode.val());
                    if (code === "") {
                        message.error('图形验证码不可为空');
                        return false;
                    }
                }
                zanke.cookie.set("_zanke_pc_account_", username, 365);
                return true;
            },
            jcaptchaCodeImgClick: function() {
                zanke.debug('登录模块--刷新图形验证码--', { msg: '点击图片刷新图形验证码' });

                var dataSrc = inputJcaptchaCodeImg.attr("data-src") + "?t=" + (new Date().getTime());
                inputJcaptchaCodeImg.attr("src", dataSrc);
            },
            spanChangeJcaptchaCodeClick: function() {
                zanke.debug('登录模块--刷新图形验证码--', { msg: '点击刷新图形验证码' });

                var dataSrc = inputJcaptchaCodeImg.attr("data-src") + "?t=" + (new Date().getTime());
                inputJcaptchaCodeImg.attr("src", dataSrc);
            },
            submit: function() {
                zanke.debug('登录模块--登录的处理是否多次点击操作:', { msg: 'input ... ' });
                if (login.validate()) {
                    btnLoginAction.html("登录中...");
                    btnLoginAction.attr("disabled", true);
                    btnLoginAction.attr("readonly", true);

                    loginForm.submit();
                }
            },
            bindEvent: function() {

                $(document).on('keydown', function(event) {
                    if (event.keyCode == 13) {
                        login.submit();
                    }
                });
                $(document).off('click', "#spanChangeJcaptchaCode");
                $(document).on('click', "#spanChangeJcaptchaCode", function() { login.spanChangeJcaptchaCodeClick(); });

                $(document).off('click', "#inputJcaptchaCodeImg");
                $(document).on('click', "#inputJcaptchaCodeImg", function() { login.jcaptchaCodeImgClick(); });

                $(document).off('click', "#btnLoginAction");
                $(document).on('click', "#btnLoginAction", function() { login.submit(); });
            },
            init: function() {

                btnLoginAction.attr("disabled", false);
                btnLoginAction.attr("readonly", false);
                btnLoginAction.html("登录");

                var mobile = zanke.cookie.get("_zanke_pc_account_");
                if (mobile) {
                    $("#inputUserName").val(mobile);
                    $("#inputPassword").focus();
                }
                var inputErrorMsgStr = $.trim(inputErrorMsg.val());
                if (inputErrorMsgStr) {
                    try {
                        var errMsg = '未知错误';
                        switch (inputErrorMsgStr) {
                            case "com.zank.admin.exception.CaptchaErrorException":
                                {
                                    errMsg = '图形验证码错误';
                                }
                                break;
                            case "com.zank.admin.exception.CaptchaRequiredException":
                                {
                                    errMsg = '请输入图片验证码';
                                }
                                break;
                            case "org.apache.shiro.authc.UnknownAccountException":
                                {
                                    errMsg = '账号未注册，请先注册';
                                }
                                break;
                            case "org.apache.shiro.authc.LockedAccountException":
                                {
                                    errMsg = '账号处于停用状态，联系管理员启用';
                                }
                                break;
                            case "org.apache.shiro.authc.IncorrectCredentialsException":
                                {
                                    errMsg = '账号或密码错误';
                                }
                                break;
                            case "org.apache.shiro.authc.AuthenticationException":
                                {
                                    errMsg = '账号或密码错误';
                                }
                                break;
                        }
                        if (errMsg) {
                            message.error(errMsg);
                        }
                    } catch (e) {}
                }
                login.bindEvent();
            }
        };

        login.init();
    });

})();