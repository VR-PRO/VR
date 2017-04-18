/**
 * 描述:登录模块-js
 */
(function() {


    $(document).ready(function() {
        var btnLoginAction = $("#btnLoginAction");
        var inputUserName = $("#inputUserName");
        var inputPassword = $("#inputPassword");
        var loginForm = $("#loginForm");
        var inputErrorMsg = $("#inputErrorMsg");

        var login = {
            validate: function() {
                var username = $.trim(inputUserName.val());
                var pwd = $.trim(inputPassword.val());

                vrHelper.cookie.set("_vr_pc_account_cookie_", username, 365);
                return true;
            },
            submit: function() {
                if (login.validate()) {
                    btnLoginAction.html("登录中...");
                    btnLoginAction.attr("disabled", true);
                    btnLoginAction.attr("readonly", true);
                    loginForm.submit();
                }
            },
            bindEvent: function() {

                $(document).on('keydown', function(event) {
                    (event.keyCode == 13) && login.submit();
                });

                $(document).off('click', "#btnLoginAction");
                $(document).on('click', "#btnLoginAction", function() { login.submit(); });
            },
            init: function() {

                btnLoginAction.attr("disabled", false);
                btnLoginAction.attr("readonly", false);
                btnLoginAction.html("登录");

                var mobile = vrHelper.cookie.get("_vr_pc_account_cookie_");
                if (mobile) {
                    inputUserName.val(mobile);
                    inputPassword.focus();
                }
                var inputErrorMsgStr = $.trim(inputErrorMsg.val());
                inputErrorMsgStr && message.error(inputErrorMsgStr);
                login.bindEvent();
            }
        };

        login.init();
    });

})();