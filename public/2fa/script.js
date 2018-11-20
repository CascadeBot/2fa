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
                            item.find(".codes-button").click(function (e) {
                                itemClick(data['name']);
                            });
                            var timer = item.find(".timer svg circle");
                            runAnimate(timer);
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
        var date = new Date;
        var seconds = date.getSeconds();
        for(var key in keys) {
            $.ajax({url: '/info/' + keys[key], success: function (data, status, jqXHR) {

                    var item = $("#" + data['name']);
                    if(item.find("h3").text() !== data['code']) {
                        var timer = $(".timer svg circle");
                        runAnimate(timer);
                        item.find("h1").text(data['name']);
                        item.find("h3").text(data['code']);
                    }
                },
                error: function (jqXHR, starts, error) {
                    console.log(error);
                }});
        }
    }, 1000);

    function runAnimate(timer) {
        timer.stop();
        var date = new Date;
        var seconds = date.getSeconds();
        var time = seconds % 30;
        var animate = 30 - time;
        console.log("animating with time " + animate);
        timer.css("stroke-dashoffset", "0");
        timer.animate({
                'stroke-dashoffset': '113'
            },
            animate * 1000);
    }
    var clicked = {};
    function itemClick(name) {
        console.log(name);
        if(clicked['name']) {
            clicked['name'] = false;
            var item = $("#" + name);
            item.find('.codes-button').text('Click for backup Codes');
            var codes = item.find('.codes');
            item.find('.codes-container').css('visibility', 'hidden');
            codes.html('');
        } else {
            clicked['name'] = true;
            $.ajax({
                url: '/info/backup/' + name + '.json', success: function (data, status, jqXHR) {
                    var item = $("#" + name);
                    item.find('.codes-button').text('Click to hide codes');
                    var codes = item.find('.codes');
                    var html = '';
                    item.find('.codes-container').css('visibility', 'visible');
                    for (var key in data) {
                        html += "<li><input type='checkbox'> " + data[key] + "</li>";
                    }
                    codes.html(html);
                }, error: function (jqXHR, starts, error) {
                    console.log(error);
                }
            });
        }
    }
});
