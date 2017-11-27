import "babel-polyfill"


import Vue from 'vue'

window.apiready = function() {
    window.$api =  $api
    api.toast({
        msg: '网络错误',
        duration: 10000,
        location: 'top'
    });
    var dialogBox;
    var ajpush;
    //vue.js
    var myapp = new Vue({
        el: "#wrap",
        data() {
            return {
                isActive: 0,
                headerOffset: {},
                footerOffset: {},
                gFrameIndex: 0,
                keyword: '',
                index: 0, //从登录跳转到首页加载的frame
                cartNum: 0,
                popupVisible: false,
                content: ''
            }
        },
        created() {
            alert('created')

        },
        mounted() {
            this.cartNum = Number(localStorage.getItem('cartNum'));
            this.funIniGroup(0);
            api.toast({
                msg: '网络错误',
                duration: 10000,
                location: 'top'
            });
            // this.isRegisterPush();

        },
        methods: {
            toJump(pageName) {
                api.openWin({
                    name: pageName,
                    url: 'widget://html/' + pageName + '.html',
                    animation: {
                        type: "none",
                    },
                })
            },
            initJG() {
                var _this = this;
                ajpush.init(function(ret) {
                    if (ret && ret.status) {
                        //success
                    }
                })
            },
            toMy() {
                api.sendEvent({
                    name: 'orderNum',
                    extra: {
                        success: 'true'
                    }
                });

                this.randomSwitchBtn(3, 'fourth_header', 'my');
                ajpush.setBadge({
                    badge: 0
                });
            },
            // 自己修复ios显示frame的时候bug
            // ios自己主动隐藏后，再open就不显示了
            showgroup(type) {
                api.setFrameGroupAttr({
                    name: type + 'group',
                    hidden: false
                });
            },
            // ===================================
            // 响应底部按钮的切换frame
            // ===================================
            switchframe(_index, className) {
                var _this = this;
                _this.isActive = _index;
                _this.$nextTick(function() {
                    _this.headerOffset = $api.offset($api.byId(className));

                    api.setFrameGroupAttr({
                        name: 'indexGroup',
                        rect: {
                            x: 0, //左上角x坐标
                            y: 0, //左上角y坐标
                            w: api.winWidth, //宽度，若传'auto'，frame组从x位置开始自动充满父页面宽度
                            h: api.frameHeight - _this.footerOffset.h //高度，若传'auto'，frame组从y位置开始自动充满父页面高度
                        }
                    });
                    api.setFrameGroupIndex({
                        name: 'indexGroup',
                        index: _index
                    });
                })

            },

            randomSwitchBtn(_index, className, pageName) {
                var _this = this;
                if (this.isActive == _index) {
                    return
                };
                if (_index == 2 || _index == 3) {

                    //api.getPrefs获取当前登录状态
                    api.getPrefs({
                        key: 'lsb_loginStatus'
                    }, function(ret, err) {
                        //当偏好设置尚未设置或者曾设置后被移除后，返回值(ret.value)均为空。

                        if (ret.value && ret.value != "") {
                            //已登录

                            _this.switchframe(_index, className);
                        } else {


                            api.openFrame({
                                name: 'login',
                                url: 'widget://html/login.html',
                                bounces: false,
                                animation: {
                                    type: "none",
                                },
                                pageParam: {
                                    changeID: _index,
                                },
                                slidBackEnabled: false
                            });

                        }
                    })
                } else {
                    _this.switchframe(_index, className)
                }
            },
            funIniGroup(changeID) {
                this.headerOffset = $api.offset($api.byId('first_header'));
                this.footerOffset = $api.offset($api.byId('footer'));
                var _this = this;
                var frames = [{
                    name: 'home',
                    url: 'widget://html/home.html',
                    bgColor: '#fff',
                    bounces: false
                }, {
                    name: 'sort',
                    url: 'widget://html/sort.html',
                    bgColor: '#fff',
                    bounces: false
                }, {
                    name: 'cart',
                    url: 'widget://html/cart.html',
                    bgColor: '#fff',
                    bounces: false,
                    reload: true
                }, {
                    name: 'my',
                    url: 'widget://html/my.html',
                    bgColor: '#fff',
                    bounces: false
                }];


                _this.index = changeID;
                _this.isActive = changeID;

                Vue.nextTick(function() {
                        _this.index == 0 ? _this.headerOffset = $api.offset($api.dom('#first_header')) : '';
                        _this.index == 1 ? _this.headerOffset = $api.offset($api.dom('#second_header')) : '';
                        _this.index == 2 ? _this.headerOffset = $api.offset($api.dom('#third_header')) : '';
                        _this.index == 3 ? _this.headerOffset = $api.offset($api.dom('#fourth_header')) : '';
                        api.closeFrameGroup({
                            name: 'indexGroup'
                        });
                        // alert('第一:'+api.frameHeight+'第二:'+_this.footerOffset.h)
                        alert(JSON.stringify(_this.footerOffset))
                        api.openFrameGroup({
                            name: 'indexGroup',
                            scrollEnabled: false,
                            rect: {
                                x: 0,
                                y: 0,
                                w: api.winWidth,
                                h: 667
                                // api.frameHeight - _this.footerOffset.h
                            },
                            index: _this.index,
                            frames: frames
                        }, function(ret, err) {

                        })
                    })
                    // })
            },

            // 搜索栏
            search() {
                var keyword = this.keyword;
                api.openWin({
                    name: 'list',
                    url: 'widget://html/list.html',
                    pageParam: {
                        query: {
                            type: 'search',
                            mark: keyword,
                            name: "搜索结果"
                        },
                    }
                });
                this.keyword = ''
            },
            maxTo(num) {
                if (Number(num) > 1000) {
                    return '···'
                } else {
                    return Number(num)
                }
            }
        },
        created() {

        }
    });
    // 完成首页初始化


    // ajpush = api.require('ajpush');

    // myapp.initJG();

    // dialogBox = api.require("dialogBox");
    api.sendEvent({
        name: 'initCart',
        extra: {
            success: 'true'
        }
    });
    api.addEventListener({
        name: 'cartNum'
    }, function(ret, err) {
        if (ret) {
            myapp.cartNum = Number(ret.value.num);
        }
    });
    api.addEventListener({
        name: 'toCart'
    }, function(ret, err) {
        if (ret) {
            myapp.switchframe(2, 'third_header');

        }
    });
    api.addEventListener({
        name: 'login'
    }, function(ret, err) {
        if (ret) {
            api.closeFrameGroup({
                name: 'indexGroup'
            });
            myapp.funIniGroup(ret.value.changeID);
        }
    });

    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if (ret) {

            dialogBox.alert({
                texts: {
                    title: "退出提示",
                    content: "您是否要退出本应用",
                    leftBtnTitle: '取消',
                    rightBtnTitle: '确认'
                },
                styles: {
                    bg: '#fff',
                    w: 300,
                    title: {
                        marginT: 20,
                        icon: 'widget://res/gou.png',
                        iconSize: 40,
                        titleSize: 14,
                        titleColor: '#000'
                    },
                    content: {
                        color: '#000',
                        size: 14
                    },
                    left: {
                        marginB: 7,
                        marginL: 20,
                        w: 130,
                        h: 35,
                        corner: 2,
                        bg: '#dadada',
                        color: '#000',
                        size: 12
                    },
                    right: {
                        marginB: 7,
                        marginL: 10,
                        w: 130,
                        h: 35,
                        corner: 2,
                        bg: '#dadada',
                        color: '#000',
                        size: 12
                    }
                }
            }, function(UserClick) {
                if (UserClick.eventType == "right") {
                    dialogBox.close({
                        dialogName: "alert"
                    });
                    api.closeWidget();
                } else if (UserClick.eventType == "left") {
                    dialogBox.close({
                        dialogName: "alert"
                    });
                }
            })
        }
    })
}
