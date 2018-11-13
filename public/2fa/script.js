$(document).ready(function () {
    var keys;
    var container = $('#2fa-container');
    var template = $('#template');
    $.ajax({
        url: '/info', success: function (data, status, jqXHR) {
            console.log(data);
            if (data['error']) {
                console.log(data['error']);
            } else {
                keys = data;
                for(var key in keys) {
                    $.ajax({url: '/info/' + keys[key], success: function (data, status, jqXHR) {
                            if (data['error']) {
                                console.log(data['error']);
                                return;
                            }
                            var item = template.clone();
                            item.attr("id", data['name']);
                            item.find("h1").text(data['name']);
                            item.find("h3").text(data['code']);

                            container.append(item);
                        },
                        error: function (jqXHR, starts, error) {
                            console.log(error);
                        }});
                }
            }
        },
        error: function (jqXHR, starts, error) {
            console.log(error);
        }
    });
    setInterval(function () {
        for(var key in keys) {
            $.ajax({url: '/info/' + keys[key], success: function (data, status, jqXHR) {

                    var item = $("#" + data['name']);
                    item.find("h1").text(data['name']);
                    item.find("h3").text(data['code']);
                },
                error: function (jqXHR, starts, error) {
                    console.log(error);
                }});
        }
    }, 1000);
});
