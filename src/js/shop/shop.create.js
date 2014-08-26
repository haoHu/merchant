(function ($, window) {
	IX.ns('Hualala.Shop');
	
	Hualala.Shop.initCreate = function ($wizard)
    {
        var $step1 = $wizard.find('#tab1');
            shopMap = Hualala.Shop.map({data: {
                isSearchMap: true,
                keyWord: '',
                shopName: '豆捞坊西直门店',
                tel: '010-65251157',
                address: '西直门西环广场'
            }});
        $wizard.bootstrapWizard();
        
        var bsWizard = $wizard.data('bootstrapWizard');
        bsWizard.show(0);
        $step1.find('#openingHoursStart, #openingHoursEnd').timepicker({
            minuteStep: 1,
            showMeridian: false,
            disableFocus : true,
            showInputs : false
        });
        
        $wizard.find('#nextStep').on('click', function()
        {
            var $curStep = bsWizard.activePane()
            if($curStep.is('#tab1'))
            {
                //return $activePane.data('bootstrapValidator').validate().isValid();
                bsWizard.next(); 
                shopMap.init();
                return;
            }
            
            if($curStep.is('#tab2'))
            {
                //console.log(shopMap.mapPoint);
                //return false;
            }
            bsWizard.next();
        });
        
        $step1.bootstrapValidator({
            /*feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            trigger: 'blur',*/
            fields: {
                shopName: {
                    message: '店铺名无效',
                    validators: {
                        notEmpty: {
                            message: '店铺名不能为空'
                        },
                        stringLength: {
                            min: 2,
                            max: 20,
                            message: '店铺名长度必须在2到20个字符之间'
                        }/*,
                        regexp: {
                            regexp: /^([\u4e00-\u9fa5\A-Za-z]-*\d*)$/,
                            message: '店铺名必须以汉字或英文字母开头，不能包含除-之外其它特殊字符'
                        }*/
                    }
                },
                cityID: {
                    validators: { notEmpty: { message: '请选择店铺所在城市' } }
                },
                tel: {
                    validators: {
                        notEmpty: { message: '店铺电话不能为空' },
                        telOrMobile: { message: '' }
                    }
                },
                address: {
                    validators: {
                        notEmpty: { message: '店铺地址不能为空' },
                        stringLength: {
                            min: 6,
                            max: 100,
                            message: '地址长度必须在6到100个字符之间'
                        }
                    }
                },
                PCC: {
                    validators: {
                        notEmpty: { message: '人均消费不能为空' },
                        numeric: { message: '人均消费必须是金额数字' }
                    }
                },
                operationMode: {
                    validators: {
                        notEmpty: { message: '请选择店铺运营模式' }
                    }
                },
                openingHoursStart: {
                    validators: {
                        notEmpty: { message: '每天营业开始时间不能空' },
                        time: { message: '' }
                    }
                },
                openingHoursEnd: {
                    validators: {
                        notEmpty: { message: '每天营业结束时间不能空' },
                        time: {
                            message: '',
                            startTimeField: 'openingHoursStart'
                        }
                    }
                },
                areaID: {
                    validators: {
                        notEmpty: { message: '请选择店铺所在地标' }
                    }
                },
                cuisineID1: {
                    validators: {
                        notEmpty: { message: '请选择菜系1' }
                    }
                }
            },
            onSuccess: function(e) {
                // Prevent form submission
                e.preventDefault();

                // Get the form instance
                var $step1 = $(e.target);

                // Get the BootstrapValidator instance
                var bv = $step1.data('bootstrapValidator');
                console.log(Hualala.Common.parseForm($step1));
                //alert('Form is valid!');
                // Use Ajax to submit form data
                //$.post($form.attr('action'), $form.serialize(), function(result) {
                    // ... Process the result ...
                //}, 'json');
            }
        });
        
        var $uploadImg = $('#uploadImg');
        $uploadImg.find('button, img').on('click', function()
        {
            Hualala.UI.uploadImg({
                onSuccess: function (imgPath, $dlg)
                {
                    var src = 'http://res.hualala.com/' + imgPath;
                    $uploadImg.find('#imagePath').val(imgPath);
                    $uploadImg.find('img').attr('src', src);
                    $dlg.modal('hide');
                }
            });
        });
		
	};
})(jQuery, window);