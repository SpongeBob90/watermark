(function(){
    $.fn.watermark =function(text,options){
        var defaultVal = {
            color:"#000000",
            angle:-45,
            fontSize:16,
            fontFamily:"arial",
            opacity:0.2,
            zIndex:9999,
            horizontalMargin:80,
            verticalMargin:80

        };

        //var argNum = arguments.length;
        var personNumber = "0000000";
        var result = defaultVal;
        if(arguments.length === 0){

        }else if(arguments.length === 1){
            if(typeof arguments[0] === "object"){
                result = $.extend({},defaultVal,arguments[0]);
            }else{
                if(arguments[0]){
                    //personNumber = parseInt(arguments[0],2);
                    personNumber = hexToDec(arguments[0]);
                }
            }
        }else if(arguments.length === 2){
            if(arguments[0]){
                //personNumber = parseInt(arguments[0],2);
                personNumber = hexToDec(arguments[0]);
            }
            result = $.extend({},defaultVal,arguments[1]);
        }

        //转码
        function decToHex(str) {
            var res=[];
            for(var i=0;i < str.length;i++)
                res[i]=("00"+str.charCodeAt(i).toString(16)).slice(-4);
            return "\\u"+res.join("\\u");
        }
        //解码
        function hexToDec(str) {
            str=str.replace(/\\/g,"%");
            return unescape(str);
        }

        return this.each(function(){
            //获取body宽度和高度
            var bodyW = $(this).width();
            var bodyH = $(this).height();

            //根据角度计算矩阵值
            var rad = result.angle*(Math.PI/180);
            var M11 = Math.cos(rad);
            var M12 = -Math.sin(rad);
            var M21 = Math.sin(rad);
            var M22 = Math.cos(rad);

            //alert(Math.cos(rad)+'==='+Math.sin(rad))

            //生成一个临时水印，用来获取后面水印相关值
            var tempWaterHtml = '<span class="tempWaterMark" style="position:absolute; top:40px; left:40px; filter:progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\', M11 = '+M11+' , M12 = '+M12+' , M21 = '+M21+' , M22 = '+M22+') Alpha(Opacity=' + result.opacity*100 + '); opacity:' + result.opacity + ';  transform: rotate('+result.angle+'deg); font-size:' + result.fontSize + 'px; color:'+result.color+'; font-family:' + result.fontFamily + '; z-index:'+result.zIndex+';">' + personNumber + '</span>';

            $(this).append(tempWaterHtml);



            //计算旋转后水印元素的真实尺寸
            var waterW = 0;
            var waterH = 0;

            //旋转之前的宽度和高度
            if($.support.msie){
                waterW = $(".tempWaterMark").width();
                waterH = $(".tempWaterMark").height();
            }else{
                var realityW = $(".tempWaterMark").width();
                var realityH = $(".tempWaterMark").height();

                waterW = Math.ceil(realityW*Math.abs(Math.cos(result.angle*(Math.PI/180))) + realityH*Math.abs(Math.cos((90-result.angle)*(Math.PI/180))));
                waterH = Math.ceil(realityW*Math.abs(Math.sin(result.angle*(Math.PI/180))) + realityH*Math.abs(Math.sin((90-result.angle)*(Math.PI/180))));
            }

            //火狐中第一行水印的top值和第一列的left值
            var originalLeft = 10;
            if($.support.msie){
                var originalTop = 10;
            }else{
                var originalTop = realityW/2;
            }

            $(".tempWaterMark").remove();

            //根据宽度高度和配置的间隔计算每页显示水印的行数和列数  row  行  col列
            var rowNum = Math.ceil(bodyH/(waterH+result.verticalMargin));
            var colNum = Math.ceil(bodyW/(waterW+result.horizontalMargin));

            //循环生成水印
            var waterMark = '';
            for(var i = 0 ; i < rowNum ; i++){
                for(var j = 0 ; j < colNum ; j++){
                    if(i === 0){
                        waterMark+= '<span class="waterMark" style="position:absolute; top:'+(originalTop + result.verticalMargin*i)+'px; left:'+(originalLeft+waterW*j + result.horizontalMargin*j)+'px; filter:progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\', M11 = '+M11+' , M12 = '+M12+' , M21 = '+M21+' , M22 = '+M22+') Alpha(Opacity=' + result.opacity*100 + '); opacity:' + result.opacity + ';  transform: rotate('+result.angle+'deg); font-size:' + result.fontSize + 'px; color:'+result.color+'; font-family:' + result.fontFamily + '; z-index:'+result.zIndex+'; white-space:nowrap;">' + personNumber + '</span>';
                    }else{
                        waterMark+= '<span class="waterMark" style="position:absolute; top:'+(originalTop+waterH*i + result.verticalMargin*i)+'px; left:'+(originalLeft+waterW*j + result.horizontalMargin*j)+'px; filter:progid:DXImageTransform.Microsoft.Matrix(SizingMethod=\'auto expand\', M11 = '+M11+' , M12 = '+M12+' , M21 = '+M21+' , M22 = '+M22+') Alpha(Opacity=' + result.opacity*100 + '); opacity:' + result.opacity + ';  transform: rotate('+result.angle+'deg); font-size:' + result.fontSize + 'px; color:'+result.color+'; font-family:' + result.fontFamily + '; z-index:'+result.zIndex+'; white-space:nowrap;">' + personNumber + '</span>';
                    }
                }
            }

            $(this).append(waterMark);

            //绑定鼠标滑过效果
            $(".waterMark").hover(function(){
                $(".waterMark").animate({"opacity":result.opacity},300);
                $(this).animate({"opacity":0},300);
            },function(){

            });
            $("body").hover(function(){},function(){
                $(".waterMark").animate({"opacity":result.opacity},300);
            });

        })
    }
})(jQuery);