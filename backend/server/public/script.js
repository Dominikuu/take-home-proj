$(function() {
    let serviceURL = ''
    const getUrlParameter = function getUrlParameter(sParam) {
        const sPageURL = window.location.search.substring(1)
        const sURLVariables = sPageURL.split('&')
        let sParameterName;
        for (let i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return '';
    };

    const getServiceUrl = () => {
        serviceURL =  sessionStorage.getItem('serviceURL')
        if (!serviceURL) {
            serviceURL = getUrlParameter('serviceURL')
            sessionStorage.setItem('serviceURL',serviceURL )
        }
    }

    var defaultConfig = {
        type: 'info',
        autoDismiss: true,
        container: '#toasts',
        autoDismissDelay: 4000,
        transitionDuration: 500
    };

    $.toast = function(config) {
        var size = arguments.length;
        var isString = typeof(config) === 'string';

        if (isString && size === 1) {
            config = {
                message: config
            };
        }

        if (isString && size === 2) {
            config = {
                message: arguments[1],
                type: arguments[0]
            };
        }

        return new toast(config);
    };

    $(document).ready(function() {
        $('button.submit').prop('disabled', 'disabled');
        getServiceUrl()
    });
    var toast = function(config) {
        config = $.extend({}, defaultConfig, config);
        // show "x" or not
        var close = config.autoDismiss ? '' : '&times;';


        // toast template
        var toast = $([
            '<div class="toast ' + config.type + '">',
            '<div class="icon ' + config.type + '"></div>',
            '<div class="content">',
            '<div class="type">' + config.type + '</div>',
            '<div class="message">' + config.message + '</div>',
            '</div>',
            '<div class="close">' + close + '</div>',
            '</div>'
        ].join(''));

        // handle dismiss
        toast.find('.close').on('click', function() {
            var toast = $(this).parent();

            toast.addClass('hide');

            setTimeout(function() {
                toast.remove();
            }, config.transitionDuration);
        });

        // append toast to toasts container
        $(config.container).append(toast);

        // transition in
        setTimeout(function() {
            toast.addClass('show');
        }, config.transitionDuration);

        // if auto-dismiss, start counting
        if (config.autoDismiss) {
            setTimeout(function() {
                toast.find('.close').click();
            }, config.autoDismissDelay);
        }

        return this;
    };
    // Disable submit button
    $('form input').on('keyup blur', function() {
        if ($('form').valid()) {
            $('button.submit').prop('disabled', false);
        } else {
            $('button.submit').prop('disabled', 'disabled');
        }
    });
    // Form validation
    // ------Registration------
    $("form[name='registration']").validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            name: "Please enter your name",
            lastname: "Please enter your lastname",
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            email: "Please enter a valid email address"
        },
        errorElement: 'div'
    });
    // ------Login------
    $("form[name='login']").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            email: "Please enter a valid email address"
        },
        errorElement: 'div'
    });
    // ------Send email------
    $("form[name='send-email']").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            email: "Please enter a valid email address"
        },
        errorElement: 'div'
    });
    // ------Reset password------
    $("form[name='reset-password']").validate({
        rules: {
            password: {
                required: true,
                minlength: 5
            }
        },
        messages: {
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
        },
        errorElement: 'div'
    });

    // Event listener
    $("#logout").on("click", () => {
        $.ajax({
            type: 'GET',
            url: '/simplesso/logout',
            dataType: 'json',
            success: function(msg) {
                $.toast('success', msg);
                window.location.href = '/';
            },
            error: function(res, exe) {
                const { message } = JSON.parse(res.responseText);
                $.toast('error', message);
            }
        });
    })

    $("#login").on("click", () => {
        const data = $("#login-form").serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data['serviceURL'] = serviceURL
        $.ajax({
            type: 'POST',
            url: '/simplesso/login',
            data,
            success: function({ ssoToken }) {
                $.toast('success', 'LOGIN_SUCCESS');
                const url = serviceURL? `${serviceURL}#/?ssoToken=${ssoToken}`: '/'
                setTimeout(() => {
                    window.location.href = url;
                }, 3000)

            },
            error: function(res, exe) {
                const { message } = JSON.parse(res.responseText);
                $.toast('error', message);
            }
        });
    });

    $("#register").on("click", () => {
        const data = $("#register-form").serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        data['serviceURL'] = serviceURL
        console.log(serviceURL)
        window.location.href = `login?serviceURL=${serviceURL}`;
        $.ajax({
            type: 'POST',
            url: '/simplesso/register',
            data,
            success: function(msg) {
                $.toast('success', msg);
                setTimeout(() => {
                    window.location.href = serviceURL? `login?serviceURL=${serviceURL}`: 'login';
                }, 3000)
            },
            error: function(res, exe) {
                const { message } = JSON.parse(res.responseText);
                $.toast('error', message);
            }
        });
    });
    $("#send").on("click", function() {
        const data = $("#send-email-form").serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        $('#send').prop('disabled', 'disabled');
        $.ajax({
            type: 'POST',
            url: '/simplesso/send-email',
            data,
            success: function({ message }) {
                $.toast('success', message);
                let count = 0
                const RESEND_LIMIT = 30
                $('.resend').css("visibility", "visible");
                const interval = setInterval(() => {
                    count += 1
                    $('.time-left').text(RESEND_LIMIT - count)
                    if (count >= RESEND_LIMIT) {
                        clearInterval(interval)
                        $('.resend').css("visibility", "hidden");
                        $('#send').prop('disabled', false);
                    }
                }, 1000)
            },
            error: function(res, exe) {
                const { message } = JSON.parse(res.responseText);
                $.toast('error', message);
                $('#send').prop('disabled', false);
            },

        });
    });
    $("#reset").on("click", function() {
        const { password, confirmPassword } = $("#reset-password-form").serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        if (password !== confirmPassword) {
            console.log("PASSWORD_COMPATIBLE")
            return
        }
        const id = getUrlParameter('id')
        const token = getUrlParameter('token')
        $.ajax({
            type: 'POST',
            url: '/simplesso/reset-password',
            data: { id, token, password },
            success: function({ message }) {
                $.toast('success', message);
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000)
            },
            error: function(res, exe) {
                const { message } = JSON.parse(res.responseText);
                $.toast('error', message);
            }
        });
    })

    $("#back").on("click", function() {
        window.location.href = '/simplesso/login';
    })
});