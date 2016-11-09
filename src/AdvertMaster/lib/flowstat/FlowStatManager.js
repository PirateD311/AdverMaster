/**
 * Created by liuxun on 16/11/9.
 */
const DBManager = require("../database/MongoDBManager").DBManager;
const Util = require("../myutil");

function FlowStatManager(){
    var aStatCache = [];
    this.processStatAdvertReq = function(sHostIp,sAdvertId,sVisitorIp){
        var bIsStatFind = false;
        for(i in aStatCache){
            if(aStatCache[i].sHostIp === sHostIp && aStatCache[i].sAdvertId === sAdvertId){
                aStatCache[i].increase(sVisitorIp);
                bIsStatFind = true;
                return;
            }
        }
        if(!bIsStatFind){
            var oStat = new StatBase(sHostIp,sAdvertId);
            oStat.increase(sVisitorIp);
            aStatCache.push(oStat);
        }
    }
}
module.exports.FlowStatManager = new FlowStatManager();
function StatBase(sHostIp,sAdvertId){
    this.sHostIp = sHostIp;
    this.sAdvertId = sAdvertId;

    DBManager.getWebFlowStatModel().findOne({"sWebIp":sHostIp},function(err,doc){
        if(err){
            throw err;
        }else{
            this.nCPC = 0;
            this.nCPA = 0;
            this.nCPM = 0;
        }
    })

    var aVisitorCache = [];

    this.increase = function(sVisitorIp){
        DBManager.getWebFlowStatModel().findOne({"sWebIp":this.sHostIp,sWebState:CONST.SITE_STATE_NORMAL},function(err,doc){
            if(err){
                throw err;
            }else{
                if(!doc)return false;
                this.nCPC = doc.nCPC;
                this.nCPA = doc.nCPA;
                this.nCPM = doc.nCPM;

                console.log("Before:"+this.showStat());
                if(Util.isInArray(sVisitorIp,aVisitorCache)[0]){
                    console.log("Find ip in cache.");
                    this.nCPC++;
                    DBManager.getWebFlowStatModel().update({"sWebIp":this.sHostIp},{nCPC:this.nCPC},function(err){
                        if(err)throw err;
                    });
                }else{
                    console.log("ip:%s is a new visitor.",sVisitorIp);
                    newVisitor(sVisitorIp);
                    this.nCPA++;
                    this.nCPC++;
                    this.nCPM++;
                    DBManager.getWebFlowStatModel().update({"sWebIp":this.sHostIp},{nCPC:this.nCPC,nCPA:this.nCPA,nCPM:this.nCPM},function(err){
                        if(err)throw err;
                    });
                }
                console.log("After:"+this.showStat());
            }
        }.bind(this));

    }
    this.showStat = function(){
        var sStatInfo = "\nsHostIp : "+this.sHostIp+"\tsAdvertId : "+this.sAdvertId+"\n";
        sStatInfo += "CPC : "+this.nCPC+"\t"+"CPA : "+this.nCPA+"\t"+"CPM : "+this.nCPM+"\n";
        return sStatInfo;
    }

    var newVisitor = function(sVisitorIp){
        aVisitorCache.push(sVisitorIp);
        setTimeout(function(){
            console.log("User visitor long ago.Delete cache.");
            console.log(aVisitorCache);
            aVisitorCache.splice(Util.isInArray(sVisitorIp,aVisitorCache)[1],1);
            console.log(aVisitorCache);
        },30000);
    }
}





