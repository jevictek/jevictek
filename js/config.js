/**
 * @name    Moudle Config
 * @desc    模块路径配置
 * @author  M.J
 * @date    2014-11-10
 * @return  {null}
 */
require.config({

    //baseUrl: '',
    paths: {
        'jquery': 'component/lib/jquery',
        'ajaxForm': 'component/lib/ajaxForm',
        'artTemplate': 'component/artTemplate/artTemplate',
        'MDialog': 'component/MDialog/MDialog',
        'MTabs': 'component/MTabs/MTabs',
        'MDropdown': 'component/MDropdown/MDropdown',
        'MAlert': 'component/MAlert/MAlert',
        'MTips': 'component/MTips/MTips',
        'MVerify': 'component/MVerify/MVerify',
        'lofex': 'component/lofex/lofex',
        'gtable': 'component/gtable/gtable',
        'common': 'js/common'
    },
    shim: {
        'MDialog': {
            deps: ['css!component/MDialog/css/MDialog.css']
        }
        ,
        'gtable': {
            deps: ['css!component/gtable/css/gtable.css']
        }
    },
    map: {
        '*': {
            'css': 'component/lib/require-css'
        }
    }
});

/** 引入共用模块 */
require(['common']);