var prepage = 5;
var page = 1;
var pages = 0;
var comments = [];

//submit commnet
$('#messageBtn').on('click', function() {
    $.ajax({
        type: 'POST',
        url: '/api/comment',
        data: {
            contentid: $('#contentId').val(),
            content: $('#messageContent').val()
        },
        success: function(responseData) {
            //console.log(responseData);
            $('#messageContent').val('');
            comments = responseData.data.comments.reverse();
            renderComment();
        }
    })
});

// load commnets
$.ajax({
    url: '/api/comment',
    data: {
        contentid: $('#contentId').val()
    },
    success: function(responseData) {
        comments =responseData.data.reverse();
        renderComment();
    }
});

$('.pager').delegate('a', 'click', function() {
    if ($(this).parent().hasClass('previous')) {
        page--;
    } else {
        page++;
    }
    renderComment();
});

function renderComment() {

    $('#messageCount').html(comments.length);

    pages = Math.max(Math.ceil(comments.length / prepage), 1);
    var start = Math.max(0, (page-1) * prepage);
    var end = Math.min(start + prepage, comments.length);

    var $lis = $('.pager li');
    $lis.eq(1).html( page + ' / ' +  pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span><i class="fas fa-step-backward"></i></span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;"><i class="fas fa-angle-double-left"></i></a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span><i class="fas fa-step-forward"></i></span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;"><i class="fas fa-angle-double-right"></i></a>');
    }

    if (comments.length == 0) {
        $('.messageList').html('<div class="messageBox"><h4>Be the first one to leave comment!</h4></div>');
        $('.pager').hide()
    } else {
        $('.pager').show()
        var html = '';
        for (var i=start; i<end; i++) {
            html += '<div class="messageBox">'+
                '<p class="commnet-info"><span class="commnet-user">'+comments[i].username+'</span><i>&nbsp;@&nbsp;</i><span class="commnet-time">'+ formatDate(comments[i].postTime) +'</span></p><p class="commnet-content">'+comments[i].content+'</p>'+
                '</div>';
            console.log(comments[i].postTime);
        }
        $('.messageList').html(html);
    }

}

function formatDate(d) {
    const monthNames = ["Jan", "Feb" , "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct" , "Nov", "Dec"]

    var date1 = new Date(d);

    var houroffert = 9

    date = date1.getDate(); date = ("0"+date).substr(-2);
    hour = date1.getHours(); hour = (hour+houroffert)%24; hour = ("0"+hour).substr(-2);
    min = date1.getMinutes(); min = ("0"+min).substr(-2);
    sec = date1.getSeconds(); sec = ("0"+sec).substr(-2);

    return date1.getFullYear() + ',' + monthNames[date1.getMonth()] + ' ' + date + ' <i class="far fa-clock"></i> ' + hour + ':' + min + ':' + sec;
}