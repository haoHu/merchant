(function(window, $) {
    IX.ns('Hualala.Shop');
    Hualala.Shop.initMember = function ($pageBody, params) {
        var tableHeaderCfg = [
                {key : "empCode", clz : "text", label : "员工编码"},
                {key : "empName", clz : "text", label : "员工姓名"},
                {key : "positionName", clz : "text", label : "职位"},
                {key : "empMobile", clz : "text", label : "手机号码"},
                {key : "roleNameLst", clz : "text role", label : "角色"},
                {key : "accountStatus", clz : "text", label : "启用状态"},
                {key : "rowControl", clz : "", label : "操作"}
            ],
            queryBoxTpl, resultTpl, editModalTpl, setRoleTpl;
        var shopID = params,
            groupID = $XP(Hualala.getSessionSite(), 'groupID', ''),
            members = null,
            roles = null,
            rights = null,
            selRoleIDs = [],
            selRightIDs = [],
            imgHost = Hualala.Global.IMAGE_RESOURCE_DOMAIN + '/',
            imgRoot = Hualala.Global.IMAGE_ROOT + '/';

        //加载模板：查询表单；数据表格
        initTemplate();
        //请求数据并渲染表格，renderData
        renderTable();
        //绑定事件：修改  删除  设置
        bindEvent();
        function initTemplate() {
            queryBoxTpl = Handlebars.compile(Hualala.TplLib.get('tpl_query_form'));
            resultTpl = Handlebars.compile(Hualala.TplLib.get('tpl_base_datagrid'));
            editModalTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_member'));
            setRoleTpl = Handlebars.compile(Hualala.TplLib.get('tpl_edit_role'));
            Handlebars.registerPartial("colBtns", Hualala.TplLib.get('tpl_base_grid_colbtns'));
            Handlebars.registerHelper('chkColType', function (conditional, options) {
                return (conditional == options.hash.type) ? options.fn(this) : options.inverse(this);
            });
            $pageBody.append($(queryBoxTpl({
                queryName: 'keywordLst',
                queryLabel: '手机号/姓名/员工',
                addBtnLabel: '新增人员',
                addBtnName: 'addMember'
            })));
        }

        function renderTable(postParams) {
            var queryParams = postParams || {shopID: shopID, groupID: groupID, keywordLst: ''};
            Hualala.Global.getShopMembers(queryParams, function(rsp) {
                if (rsp.resultcode == '000') {
                    members = rsp.data.records;
                    $pageBody.find('.table-responsive').remove();
                    $pageBody.append($(resultTpl(mapRenderData(rsp.data.records))));
                    createActiveSwitch();
                } else {
                    Hualala.UI.TopTip({type: 'danger', msg: rsp.resultmsg})
                }
            });
        }

        //组装表格显示的col
        function mapColItemRenderData(row, rowIdx, colKey) {
            var r = {value : "", text : ""}, v = $XP(row, colKey, '');
            switch(colKey) {
                case "rowControl" :
                    r = {
                        type : 'button',
                        btns : [
                            {
                                label : '权限设置',
                                link : 'javascript:void(0);',
                                key : $XP(row, 'empKey', ''),
                                type : 'setMember'
                            },
                            {
                                label : '重置密码',
                                clz: 'm-l',
                                link : 'javascript:void(0);',
                                key : $XP(row, 'empKey', ''),
                                type : 'resetPassword'
                            },
                            {
                                label : '修改',
                                link : 'javascript:void(0);',
                                clz: 'm-l',
                                key : $XP(row, 'empKey', ''),
                                type : 'editMember'
                            },
                            {
                                label : '删除',
                                link : 'javascript:void(0);',
                                clz : 'm-l',
                                key : $XP(row, 'empKey', ''),
                                type : 'delMember'
                            }
                        ]
                    };
                    break;
                case "accountStatus":
                    r.value = v;
                    r.text = '<input type="checkbox" name="accountStatus" data-id="'+$XP(row, 'empKey', '')+'" data-status="' + v +'">';
                    break;
                case "roleNameLst" :
                    r.value = r.text = $XP(row, colKey, '').replace(/,/g, ' ');
                    break;
                default :
                    r.value = r.text = $XP(row, colKey, '');
                    break;
            }
            return r;
        }

        //组装表格显示的rows
        function mapRenderData(records) {
            var self = this;
            var tblClz = "table-bordered table-striped table-hover ix-data-report",
                tblHeaders = IX.clone(tableHeaderCfg);
            var mapColsRenderData = function (row, idx) {
                var colKeys = _.map(tblHeaders, function (el) {
                    return {key: $XP(el, 'key', ''), clz: $XP(el, 'clz', '')};
                });
                var col = {clz: '', type: 'text'};
                var cols = _.map(colKeys, function (k, i) {
                    var r = mapColItemRenderData(row, idx, $XP(k, 'key', ''));
                    return IX.inherit(col, r, {clz: $XP(k, 'clz', '')});
                });
                return cols;
            };
            var rows = _.map(records, function (row, idx) {
                return {
                    clz: '',
                    cols: mapColsRenderData(row, idx)
                };
            });
            return {
                tblClz: tblClz,
                isEmpty: !records || records.length == 0 ? true : false,
                colCount: tableHeaderCfg.length,
                thead: tableHeaderCfg,
                rows: rows
            };

        }

        function bindEvent() {
            var clickEventMap = {
                search: renderTable,
                addMember: editMember,
                editMember: editMember,
                delMember: delMember,
                setMember: setMember,
                resetPassword: resetPassword
            };
            $pageBody.on('click', '.query-form .btn', function (e) {
                e.preventDefault();
                //查询, 新增
                var $el = $(this),
                    eventName = $el.attr('name'),
                    queryParams = {
                        keywordLst: $pageBody.find('.query-form input[name="keywordLst"]').val(),
                        groupID: groupID, shopID: shopID
                    };
                eventName == 'search' ? clickEventMap[eventName](queryParams) : clickEventMap[eventName]();
            }).on('click', 'table tr td a', function (e) {
                e.preventDefault();
                //修改, 删除, 设置
                var $el = $(this),
                    eventName = $el.data('type');
                clickEventMap[eventName]($el.data('key'));
            });
        }

        function editMember(empKey) {
            //添加或修改人员信息
            var memberInfo = {};
            if (empKey) {
                memberInfo = _.findWhere(members, {empKey: empKey});
                memberInfo.empRemark = Hualala.Common.decodeTextEnter(memberInfo.empRemark);
                memberInfo.photoImage = getPicUrl(memberInfo.photoImage, memberInfo.imgHWP);
            }
            var status = empKey ? '修改' : '添加',
                modalDialog = Hualala.UI.ModalDialog({
                    id: 'editMember',
                    title: status + '人员',
                    hideCloseBtn: 'false',
                    html: editModalTpl(IX.inherit({}, memberInfo)),
                    backdrop: 'static'
            }).show();
            modalDialog._.footer.find('.btn.btn-close').text('关闭');
            registerFormValidate(modalDialog._.body.find('.form-member'));
            bindUpdateMember(modalDialog, empKey);
        }

        function registerFormValidate($form) {
            $form.bootstrapValidator({
                fields: {
                    empCode: {
                        validators: {
                            notEmpty: {message: "编码不能为空"},
                            stringLength: {min: 1, max: 20, trim: true, message: '字符串长度在1-20位之间'}
                        }
                    },
                    empName: {
                        validators: {notEmpty: {message: '姓名必填'}}
                    },
                    IDCard: {
                        validators: {
                            notEmpty: {message: '身份证号必填'},
                            regexp: {
                                regexp: /(^\d{15}$)|(^\d{17}([0-9]|[xX])$)/,
                                message: '请输入正确的身份证号'
                            }
                        }
                    },
                    positionName: {
                        validators: {notEmpty: {message: '职位名称必填'}}
                    },
                    localPosLoginPWD: {
                        validators: {
                            notEmpty: {message: '密码不能为空'},
                            stringLength: {min: 2, max: 30, trim: true, message: '字符串长度在2-30位之间'}
                        }
                    },
                    empMobile: {
                        validators: {
                            notEmpty: {message: '电话号码必填'},
                            regexp: {regexp: /^1[358]\d{9}$/, message: '请输入正确的手机号'}
                        }
                    },
                    maxDiscountRate: {
                        validators: {
                            regexp: {
                                regexp: /(^0\.?\d{0,2}$)|(^1\.?0{0,2}$)/,
                                message: '请按提示输入有效的值'
                            }
                        }
                    },
                    maxFreeAmount: {
                        validators: {
                            regexp: {
                                regexp: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                                message: '请输入大于0的值，整数不超过8位，小数不超过2位'
                            }
                        }
                    }
                }
            });
        }

        function bindUpdateMember(modalDialog, empKey) {
            var $foodPic = modalDialog._.body.find('.food-pic'),
                $uploadBtn = $foodPic.find('label'),
                $img = $foodPic.find('img'),
                imgSrc = $img.attr('src'),
                imgPath, imgHWP;
            Hualala.UI.fileUpload($uploadBtn, function (rsp) {
                var path = rsp.url, hwp = rsp.imgHWP || '';
                imgPath = path;
                imgHWP = hwp;
                if (!window.FileReader) {
                    $img.attr('src', getPicUrl(path, imgHWP))
                }
            }, {
                onBefore: function ($elem, $file) {
                    imgSrc = $img.attr('src');
                    $foodPic.addClass('loading');
                    if(window.FileReader) previewImg($file[0], $img);
                },
                onFail: function() { if(window.FileReader) $img.attr('src', imgSrc); },
                onAlways: function() { $foodPic.removeClass('loading'); }
            });
            modalDialog._.footer.on('click', '.btn.btn-ok', function (e) {
                var $form = modalDialog._.body.find('.form-member');
                if(!$form.data('bootstrapValidator').validate().isValid()) return;
                var data = Hualala.Common.parseForm($form),
                    accountStatus = empKey ? {} : {accountStatus: 1},
                    postParams = IX.inherit({shopID: shopID, groupID: groupID, empKey: empKey}, data, {photoImage: imgPath}, accountStatus);
                postParams.empRemark = Hualala.Common.encodeTextEnter(postParams.empRemark);
                Hualala.Global[empKey ? 'updateShopMember' : 'addShopMember'](postParams, function (rsp) {
                    if (rsp.resultcode != '000') {
                        Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    Hualala.UI.TopTip({msg: '保存成功', type: 'success'});
                    modalDialog.hide();
                    renderTable();
                });
            });
        }

        function getPicUrl(path, hwp)
        {
            var h = hwp ? parseInt(120 * hwp) : '',
                cfg = hwp ? {width: 120, height: h} : {};
            if(!path) {
                return imgRoot + 'food_bg.png';
            } else if(path && (path.indexOf(imgRoot) != -1 || path.indexOf(imgHost) != -1)) {
                return path;
            } else{
                return Hualala.Common.getSourceImage(path, cfg);
            }

        }

        function delMember(empKey) {
            //删除人员
            Hualala.UI.Confirm({
                title: '删除人员',
                msg: '你确定要删除该人员吗？',
                okFn: function () {
                    Hualala.Global.deleteShopMember({empKey: empKey, shopID: shopID}, function (rsp) {
                        if (rsp.resultcode != '000') {
                            Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        Hualala.UI.TopTip({msg: '操作成功', type: 'success'});
                        renderTable();
                    });
                }
            });
        }

        function bindRoleSetModal(modalDialog, empKey) {
            var member = _.findWhere(members, {empKey: empKey + ''});
            //选择角色后重新渲染权限
            var reRenderRights = function() {
                var modalRights = _.map(rights, function (right) {
                        return IX.inherit({checked: _.contains(selRightIDs, right.rightID) ? 'checked' : ''}, right);
                    }),
                    modalData = {
                        empName: member.empName,
                        roles: _.map(IX.clone(roles), function (role) {
                            return IX.inherit(role, {checked: _.contains(selRoleIDs, role.roleID) ? 'checked' : ''});
                        }),
                        rightGroup: _.groupBy(modalRights, 'rightGroupName')
                    };
                modalDialog._.body.empty().html(setRoleTpl(modalData));
            };

            //给角色和权限的选择绑定事件
            modalDialog._.body.on('change', '.role-right .roles input[type="checkbox"]', function () {
                var $el = $(this),
                    key = $el.data('key') + '';

                //选择某个角色则对应的权限都要被选中
                $el.is(':checked') ? selRoleIDs.push(key) : (selRoleIDs = _.reject(selRoleIDs, function(id) {return id == key}));
                if (selRoleIDs.length == 0) {
                    selRightIDs = [];
                    reRenderRights();
                    return;
                }
                Hualala.Global.queryRights({roleID: selRoleIDs.join(',')}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    var records = rsp.data.records;
                    selRightIDs = records ? _.pluck(records, 'rightID') : [];
                    reRenderRights();
                });

            });
            //给保存绑定事件
            modalDialog._.footer.on('click', '.btn.btn-ok', function () {
                var notRightLst = _.pluck(_.reject(rights, function(right) {return _.contains(selRightIDs, right.rightID);}), 'rightID'),
                    roleNameLst = _.pluck(_.select(roles, function(role) {return _.contains(selRoleIDs, role.roleID)}), 'roleName'),
                    $member = $('.table-responsive table tr td a[data-key="' + empKey + '"]').first().parents('tr'),
                    setParams = {
                        shopID: shopID,
                        empKey: empKey,
                        roleIDLst: selRoleIDs.join(','),
                        rightIDLst: selRightIDs.join(','),
                        notRightList: notRightLst.join(','),
                        roleNameLst: roleNameLst.join(',')
                    };
                Hualala.Global.setRoleRight(setParams, function (rsp) {
                    if (rsp.resultcode != '000') {
                        Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    member.roleIDLst = setParams.roleIDLst;
                    member.rightIDLst = setParams.rightIDLst;
                    Hualala.UI.TopTip({msg: '设置成功', type: 'success'});
                    $member.find('td.role p').text(roleNameLst.join(' '));
                    modalDialog.hide();
                });
            });
        }

        function setMember(empKey) {
            //设置人员角色和权限
            rights = null;
            var member = _.findWhere(members, {empKey: empKey});
            selRoleIDs = _.compact(_.uniq(member.roleIDLst.split(',')));
            selRightIDs = _.compact(_.uniq(member.rightIDLst.split(',')));

            //渲染角色
            var renderRoleSet = function() {
                var modalRights = _.map(rights, function (right) {
                    return IX.inherit({checked: _.contains(selRightIDs, right.rightID) ? 'checked' : ''}, right);
                });
                var modalData = {
                    empName: member.empName,
                    roles: _.map(roles, function (role) {
                        return IX.inherit(role, {checked: _.contains(selRoleIDs, role.roleID) ? 'checked' : ''});
                    }),
                    rightGroup: _.groupBy(modalRights, 'rightGroupName')
                };
                var modalDialog = Hualala.UI.ModalDialog({
                    id: 'setRoles',
                    title: '权限设置',
                    html: setRoleTpl(modalData),
                    backdrop: 'static'
                }).show();
                bindRoleSetModal(modalDialog, empKey);
            };

            //渲染权限
            var renderRights = function() {
                if(rights) {
                    renderRoleSet();
                } else {
                    Hualala.Global.queryRights({roleID: ''}, function (rsp) {
                        if (rsp.resultcode != '000') {
                            Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                            return;
                        }
                        rights = rsp.data.records || [];
                        renderRoleSet();
                    });
                }
            };
            if (roles) {
                renderRights();
            } else {
                Hualala.Global.queryRoles({}, function (rsp) {
                    if (rsp.resultcode != '000') {
                        Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    roles = rsp.data.records;
                    renderRights();
                });
            }
        }

        //图片上传本地预览
        function previewImg(fileInput, $img)
        {
            if (fileInput.files && fileInput.files[0])
            {
                var reader = new FileReader();
                reader.onload = function(e){
                    $img.attr('src', e.target.result);
                }
                reader.readAsDataURL(fileInput.files[0]);
            }
        }

        function resetPassword(empKey) {
            var resetPasswordTpl = Handlebars.compile(Hualala.TplLib.get('tpl_reset_password')),
                modal = Hualala.UI.ModalDialog({
                    id: 'resetPassword',
                    hideCloseBtn: false,
                    title: '重置密码',
                    html: resetPasswordTpl(),
                    backdrop: 'static'
                }).show(),
                $form = modal._.body.find('form.form-reset');
            var bv = $form.bootstrapValidator({
                fields: {
                    empPWD: {
                        validators: {
                            notEmpty: {message: "必须填写新密码"},
                            stringLength: {min: 2, max: 30, trim: true, message: '字符串长度在2-30位之间'}
                        }
                    }
                }
            }).data('bootstrapValidator');
            modal._.body.on('change', 'input[name="displayPassword"]', function () {
                var $el = $(this),
                    $password = $el.parents('.form-group').prev().find('input[name="empPWD"]');
                if ($el.prop('checked')) {
                    $password.attr('type', 'text');
                } else {
                    $password.attr('type', 'password');
                }
            });
            modal._.footer.on('click', '.btn.btn-ok', function () {
                if(!bv.validate().isValid()) return;
                var postParams = IX.inherit({empKey: empKey, shopID: shopID}, Hualala.Common.parseForm($form));
                Hualala.Global.resetMemberPassword(_.omit(postParams, 'displayPassword'), function (rsp) {
                    if (rsp.resultcode != '000') {
                        Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                        return;
                    }
                    Hualala.UI.TopTip({msg: '修改成功', type: 'success'});
                    modal.hide();
                });
            });
        }

        function createActiveSwitch() {
            var $checkbox = $pageBody.find('table tbody tr td input[name="accountStatus"]');
            _.each($checkbox, function (input) {
                var $el = $(input);
                $el.bootstrapSwitch({
                    state: $el.data('status') == 1,
                    onColor: 'success',
                    onText: '已启用',
                    offText: '未启用',
                });
            });
            $checkbox.on('switchChange.bootstrapSwitch', function (el, state) {
                var $el = $(el.target),
                    text = state ? '开启' : '停止';
                Hualala.UI.Confirm({
                    title: text + '店员状态',
                    msg: '你确定要' + text + '该店员的状态吗？',
                    okFn: function () {
                        Hualala.Global.switchMember({shopID: shopID, accountStatus: +state, empKey: $el.data('id')}, function (rsp) {
                            if(rsp.resultcode != '000') {
                                $el.bootstrapSwitch('toggleState', true);
                                Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                                return;
                            }
                            Hualala.UI.TopTip({msg: '修改成功', type: 'success'});
                        });
                    },
                    cancelFn: function () {
                        $el.bootstrapSwitch('toggleState', true);
                    }
                });
            });
        }
    };

})(window, jQuery);