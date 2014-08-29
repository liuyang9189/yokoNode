$(function(){

    /*
    *release.html 发布页
    */
    //富文本编辑器
    CKEDITOR.replace( 'editor', {
        toolbar: [
            [ 'Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink', 'Image' ],
            [ 'FontSize', 'TextColor', 'BGColor' ]
        ]
    });


    /*
    *loginSuccessful.html 登陆成功页
    */
    //点击‘显示全部’
    $(".content-min a").click(function(){
        $(this).parent().hide().siblings(".content-big").show();
    });
    //点击‘收起’
    $(".content-big a").click(function(){
        $(this).parent().hide().siblings(".content-min").show();
    });
    //点击‘更多’
    $("#load-more").click(function(){
        var liLength = $(".conntainer-left li").length;
        var end = liLength+10;
        $.ajax({
            url:"/index.do?starting="+liLength+"&end="+end,
            cache: false,
            dataType:"json",
            error:function(){
                console.log("index.do ajax error")
            },
            success:function(data){
                var oHtml = "";
                for(var i=0;i<data.length;i++){
                    oHtml += '<li>'
                        + '<h4><a href="/admin/'+data[i].id+'.do">'+data[0].title+'</a></h4>'
                        + '<h5>'+data[0].createName+'</h5>'
                        + '<p class="content-min">'+data[0].min_content+'<a href="javascript:;">显示全部</a></p>'
                        + '<div class="content-big">'
                        + '<a href="javascript:;">收起</a>'
                        + '<p>'+data[0].content+'</p>'
                        + '</div>'
                        + '</li>';
                }
                $(".conntainer-left ul").append(oHtml);
            }
        });
    });


});