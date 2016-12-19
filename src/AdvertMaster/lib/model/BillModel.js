/**
 * Created by liuxun on 16/12/8.
 */
const DBManager = require('../database/MongoDBManager').DBManager;
const Util = require('../myutil');

function createBill(data)
{

    return DBManager.getBillModel()
    .create(data)
    .then(bill=>
    {
        if(bill.sClass == BILL_CLASS_DEPOSIT)
        {
            logger.debug("广告主%s 充值 %d",data.sFrom,data.nMoney);
            DBManager.getUserModel()
            .findOneAndUpdate({sUserName:data.sFrom},{$inc:{nBalance:data.nMoney}})
            .then(user=>
            {
                if(!user)
                    logger.debug("充值失败");
                else
                    logger.debug(user);
            })
            .catch(e=>
            {
                logger.debug(e);
            });
        }
    })
}
module.exports.createBill = createBill;

function getBill(data)
{
    var screen = ['nId','sDate','sClass','sFrom','sTo','sPayWay','sState'];
    var query = Util.filter(screen,data);
    return DBManager.getBillModel().find(query);
}
module.exports.getBill = getBill;