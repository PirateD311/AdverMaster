/**
 * Created by liuxun on 16/11/10.
 */
const SITE_STATE_UNACTIVE = "未激活";
const SITE_STATE_NORMAL = "正常";
const SITE_STATE_LOCK = "锁定";

const TABLE_CATEGORY_NORMAL = "normal";
const TABLE_CATEGORY_WITHOPTION = "option";

global.CONST = {
    SITE_STATE_UNACTIVE:SITE_STATE_UNACTIVE,
    SITE_STATE_NORMAL:SITE_STATE_NORMAL,
    SITE_STATE_LOCK:SITE_STATE_LOCK,

    TABLE_CATEGORY_NORMAL:TABLE_CATEGORY_NORMAL,
    TABLE_CATEGORY_WITHOPTION:TABLE_CATEGORY_WITHOPTION
};
//Project Root Path
global.ROOTPATH = "/home/weblx/workspace/node/AdvertMaster/"

//ResultCode
global.RESULT_CODE_SUCCESS = 1;
global.RESULT_CODE_DBERROR = 2;
global.RESULT_CODE_NOTFOUND = 3;
global.RESULT_CODE_NOPERMISSION = 4;

//用户类型
global.USERTYPE_NORMAL = "普通注册会员";
global.USERTYPE_SITE_MASTER = "站长";
global.USERTYPE_ADVERTISER = "广告主";
global.USERTYPE_BUSINESS_MASTER = "业务管理员";
global.USERTYPE_GOD = "神";
//用户状态
global.USERSTATE_UNACTIVE = "未激活";
global.USERSTATE_NORMAL = "正常";
global.USERSTATE_LOCK = "锁定";
//广告展示类型
global.ADVERTTYPE_FMT = "富媒体";
global.ADVERTTYPE_TC = "弹窗";
global.ADVERTTYPE_NX = "内镶";

global.FMT_SIZE_S = "";
global.FMT_SIZE_M = "height:200px;width:300px";
global.FMT_SIZE_L = "";

global.ADVERTSTATE_UNACTIVE = "未激活";
global.ADVERTSTATE_NORMAL = "正常";
global.ADVERTSTATE_LOCK = "锁定";

global.ADVERTCHARGETYPE_CLICK = '点击';
global.ADVERTCHARGETYPE_VIEW = '展示';

//上传路径
global.AVATAR_UPLOAD_FOLDER = "upload/tmp/";
//素材保存路径
global.AVATAR_MATERIAL_DIR = "upload/img/";

//账单类型
global.BILL_CLASS_DEPOSIT = "广告主充值";
global.BILL_CLASS_PAY = "站长佣金";

//global.config = new config();

global.CONFIG = {
    APP_DOMAIN:"http://www.168lm.cn/",
    DEBUG_MODE:false,
    SITE_COUNT_DISCOUNT : 0.85,
    ADVERT_COUNT_DISCOUNT : 0.85,//广告折扣为实际展示量为给广告主展示的量的比例
}