(function ($) {
    $.fn.extend({
        "upImage": function (options) {
                        /**
                                 * 绑定事件，以便点击后进行操作上传头像操作。
                                 */
            this.bind("click",function(){
                                api.actionSheet({
                                        title : '上传头像',
                                            cancelTitle : '取消',
                                            buttons : ['拍照', '手机相册','删除头像']
                                        }, function(ret, err) {
                                                if (ret) {
                                                        _getPicture(ret.buttonIndex);
                                                }
                                        });

            })
            if (!_paramesValid(options)){
                            alert('参数不合法');
                            return this;
            }
            //默认参数
                            var defaluts = {
                                imageDom: this,
                                valueDom: $("#headPic")
                            };
            var opts = $.extend({}, defaluts, options);

                                /**
                                 *  根据用户选择的图片获取方式，来调用对应的方法获取头像
                                  * @param {Object} type
                                 */
                                function _getPicture(type){
                                        if(type == 1){
                                                _getPictureByCamery();
                                        }else if (type == 2){
                                                _getPictureByMedia();
                                        }else if (type == 3){
                                                //删除已上传的头像
                                                _fetchResult("");


                                        }
                                }
            /**
             * 工具方法，获取指定范围的随机数,可用于生成随机文件名
             *
                                 * @param {Object} minNum
                                 * @param {Object} maxNum
             */
            function _getRoundNumber(minNum, maxNum) {
                                        switch(arguments.length) {
                                                case 1:
                                                        return parseInt(Math.random() * minNum + 1);
                                                        break;
                                                case 2:
                                                        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
                                                        break;
                                                default:
                                                        return 0;
                                                        break;
                                        }
                                }
                                /**
                                 * 从摄像头拍摄照片,
                                 *
                                 */
                                function _getPictureByCamery(){
                                        api.getPicture({
                                            sourceType : 'camera',
                                            encodingType : 'jpg',
                                            mediaValue : 'pic',
                                            allowEdit : false,
                                            quality : 96,
                                            saveToPhotoAlbum : false
                                    }, function(ret, err) {
                                                    if(ret && ret.data.length >0 ){
                                                            _clipImage(ret.data);
                                                    }
                                    })
                                }
                                /**
                                 * 从手机相册中选择照片
                                 *
                                 */
                                function _getPictureByMedia(){

                                        //手机相册选图片
                                                var obj = api.require('UIMediaScanner');
                                                obj.open({
                                                        type : 'picture',
                                                        column : 4,
                                                        max : 1,
                                                        sort : {
                                                                key : 'time',
                                                                order : 'desc'
                                                        },
                                                        texts : {
                                                                stateText : '已选择*项',
                                                                cancelText : '取消',
                                                                finishText : '选择'
                                                        },
                                                        styles : {
                                                                bg : '#fff',
                                                                mark : {
                                                                        icon : '',
                                                                        position : 'bottom_right',
                                                                        size : 20
                                                                },
                                                                nav : {
                                                                        bg : '#eee',
                                                                        stateColor : '#000',
                                                                        stateSize : 18,
                                                                        cancleBg : 'rgba(0,0,0,0)',
                                                                        cancelColor : '#000',
                                                                        cancelSize : 18,
                                                                        finishBg : 'rgba(0,0,0,0)',
                                                                        finishColor : '#000',
                                                                        finishSize : 18
                                                                }
                                                        }
                                                }, function(ret) {
                                                        //将选择的图像进行剪辑
                                                        if (ret.eventType != 'cancel' && ret.list.length > 0) {
                                                                      obj.transPath({
                                                                                    path:ret.list[0].path
                                                                                }, function(ret, err) {
                                                                                    if (ret) {
                                                                                        _clipImage(ret.path);
                                                                                    } else {
                                                                                               alert('获取图片路径出错，请重试。');
                                                                                    }
                                                                                });
                                                        }
                                                });
                                }
                                /**
                                 * 剪辑图片 传入图片地址。 剪辑后的结果保存在项目的temp/headpic/下以tmp开头的5位随机数命名的文个件
                                  * @param {Object} path 要剪辑的图片原始地址
                                 */
                                function _clipImage(path){
                                        $("body").append('<div id="imageClipBox" class="imageClipBox"><div class="btn"><button id="imageClipSave" name="save" >保存头像 </button><button id="imageClipCancel" name="cancel" >取消 </button></div></div>');
                                            $("#imageClipBox").css({"visibility":"visible"});
                                            $("#imageClipSave").click(function(){
                                                    _saveImageClip();
                                            });
                                            $("#imageClipCancel").click(function(){
                                                    $("#imageClipBox").css({"visibility":"hidden"});
                                                    FNImageClip.close();
                                            });
                                            var FNImageClip = api.require('FNImageClip');
                                            //alert(path);
                            FNImageClip.open({
                                    rect : {
                                            x : 0,
                                            y : 0,
                                            w : api.winWidth,
                                            h : api.winHeight - $("#imageClipBox").height()
                                    },
                                    srcPath : path,
                                    mode : 'image',
                                    style : {
                                            mask : 'rgba(0,0,0,0.75)',
                                            clip : {
                                                    w : api.winWidth * 0.8,
                                                    h : api.winWidth * 0.8,
                                                    x : api.winWidth * 0.1,
                                                    y : api.winWidth * 0.4,
                                                    borderColor : '#0f0',
                                                    borderWidth : 1,
                                                    appearance : 'rectangle'
                                            }
                                    },
                            }, function(ret, err) {
                            });
                                }
                                /**
                                 * 保存剪辑结果，保存在项目的temp/headpic/下以tmp开头的5位随机数命名的文个件
                                 *
                                 */
                                function _saveImageClip(){
                                        var FNImageClip = api.require('FNImageClip');
                                        var number = _getRoundNumber(10000, 30000);
                                        var fileDest = 'fs://tmp/headpic/tmp_' + number + '.jpg';
                                        FNImageClip.save({
                                                destPath : 'fs://tmp/headpic/tmp_' + number + '.jpg',
                                                copyToAlbum : false,
                                                quality : 1
                                        }, function(ret, err) {
                                                $("#imageClipBox").css({"visibility":"hidden"});
                                                _fetchResult(ret.destPath);
                                                FNImageClip.close();
                                        })
                                }

                                /**
                                 *  将本扩展操作的结果(即剪辑好的图片地址)返回给对应的控制，此控制在调用本扩展时，传入。.
                                 *
                                  * @param {Object} src
                                 */
                                function _fetchResult(src){
                                        if(src == ""){
                                                opts.imageDom.attr("src","../image/photo.png");
                                                opts.valueDom.val("");
                                        }else{
                                                opts.imageDom.attr("src",src);
                                                opts.valueDom.val(src);
                                        }
                                }


        }




    });

    function _paramesValid(options) {
                        return !options || (options && typeof options === "object") ? true : false;
                    }
})(jQuery);
