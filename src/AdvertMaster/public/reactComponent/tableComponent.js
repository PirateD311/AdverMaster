/**
 * Created by liuxun on 16/9/16.
 */
//import React,{PropTypes,Component} from 'react';
//基础表格react组件
let MyTable = React.createClass({
    /*对每个组件实例只调用一次*/
    getInitialState:function(){

        return {
            "tableStyle":{"tableTitle":"默认表格名","colTitle":"日期,网站主,媒介成员,CPA,富媒体,CPC,CPM,网站IP","tableCategory":"normal"},
            "ajaxData":{"url":"","method":"","postData":{}},
            "showData":null
        };
    },
    /*首次render渲染前调用*/
    componentWillMount:function(){
        this.ajaxTableData();
        console.log("componentWillMount...");
    },
    /*渲染后调用，真实dom已生成，可使用this.getDOMNode()方法访问它*/
    componentDidMount:function(){
        console.log("componentDidMount...");
    },
    refreshTableData:function(){

    },
    ajaxTableData:function(){
        let self =this;
        if(this.props.ajaxData){
            $.ajax({
                "url":this.props.ajaxData.url,
                "method":this.props.ajaxData.method,
                "data":this.props.ajaxData.postData,
                "dataType":this.props.ajaxData.dataType,
                "success":function(res){
                    if(res.code === 1)
                        self.setState({"showData":res.data});
                },
                "error":function(){console.log("Ajax error.")}
            });
        }else{
            console.log("Not Ajax tableData.");
        }
    },
    createTable:function(){
        console.log("createTable");
        let aTableData = this.props.data||this.state.showData||[{
            "sOwnerUserName":"liuxun",
            "sWebIp":"10.137.27.155",
            "sWebDomain":"www.rrrr58.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nCPA":0,
            "nCPC":0,
            "nCPM":0
        }];

        let sColName = this.props.colName||this.state.tableStyle.colTitle;
        let aColKey = this.props.colNey||["sWebRegisterDate","sOwnerUserName","sMeijie","nCPA","nFumeiti","nCPC","nCPM","sWebIp"];
        let aColTitle = sColName.split(',');

        let aTableBody = [];
        aTableBody.push(aColTitle.map((res) => (<td>{res}</td>)));
        if(this.props.tableStyle && "WithOption" == this.props.tableStyle.tableCategory){
            aTableBody.push((<td>操作</td>))
        }

        aTableData.map((tabledata) => {
            let aTd = [];
            if(true){
                aColKey.map((colkey) =>{aTd.push((<td>{tabledata[colkey]}</td>))});
                if(this.props.tableStyle && "WithOption" == this.props.tableStyle.tableCategory){
                    aTd.push((<td><OptionWzzBtn  data={aTableData} btnName="审批" /></td>))
                }
            }else{
                for(let k in tabledata){
                    aTd.push((<td>{tabledata[k]}</td>));
                }
                if(this.props.tableStyle && "WithOption" == this.props.tableStyle.tableCategory){
                    aTd.push((<td><OptionWzzBtn  data={aTableData} btnName="审批" /></td>))
                }
            }
            aTableBody.push((<tr>{aTd}</tr>));
        });

        return aTableBody;


    },
    render:function(){
        console.log("render...");
        let defaultTitleStyle = {borderColor:"#999",borderThickness:"1px",textAlign:"center"};
        let defaultTableWrap = {padding:" 1em 1em",border:" 2px solid",borderRadius: "1em"};
        return (
            <div style={defaultTableWrap}>
                <h4 style={defaultTitleStyle}>{this.props.TableTitle||this.state.tableStyle.tableTitle}</h4>
                <table className="table table-striped table-hover table-bordered">
                    <tbody>{this.createTable()}</tbody>
                </table>
            </div>
        )
    }
});
//表格操作控件
let OptionWzzBtn=React.createClass({
    render:function(){
        //console.log("btn 数据：",JSON.stringify(this.props.data))
        return (
            <input className="btn-xs" onClick={this.handleOptionClick} type="button" value={this.props.btnName} />
        )
    },
    componentDidMount:function(){

    },
    handleSubmit:function(){
        console.log("ddd");
        console.log("doYes")
        var postData={
            "web_ip":this.props.data.web_ip,
        };
        switch (this.props.btnName){
            case "审批":
                postData.web_register_state=1;
                postData.web_state=1;
                console.log(this.props.data.web_ip);
                var addFlowStatData={"web_owner":this.props.data.web_owner_name,"web_ip":this.props.data.web_ip,"web_domain":this.props.web_domain};
                $.post("/gly/addFlowStat",addFlowStatData,function(res){

                });
                break;
            case "暂停":
                postData.web_register_state=2;
            case "锁定":
                postData.web_register_state=3;
                break;
            case "拒绝":
                postData.web_register_state=4;
                break;
            case "网站说明":
                postData.web_register_state=2;
                break;
            default :break;
        };
        console.log(JSON.stringify(postData));
        $.post("/gly/editWzz",postData,function(res){
            if(res.code==1)
                alert("操作成功！");
            else
                alert("操作失败！");
        });
        $("#NiceDialog").hide();
        $("#handleFreshTableBtn").click();
    },
    handleOptionClick:function(){
        var dialogInfo="确定要对 "+this.props.data.web_owner_name+" 进行操作？";
        React.render(
            <NiceDialog handle={this.handleSubmit} dialogInfo={dialogInfo} />,
            document.getElementById('NiceDialogContainer')
        );
        $("#NiceDialog").show();
    }

});
//操作弹出框
let NiceDialog=React.createClass({
    render:function(){
        return (
            <div id="NiceDialog" className="nice-dialog">
                <div onClick={this.handleClose} className="dialog-close">X</div>
                <div className="dialog-infowarp">
                    <h4>{this.props.dialogInfo}</h4>
                </div>
                <div className="dialog-btn">
                    <button onClick={this.props.handle}>确定</button>
                    <button onClick={this.handleClose}>取消</button>
                </div>
            </div>
        )
    },
    handleClose:function(){
        $("#NiceDialog").hide();
    }

});


//导航条
let MyNavBar = React.createClass({
    propTypes:{

    },
    getDefaultProps:function(){

    },
    getInitialState:function(){
        return {};
    },
    componentDidMount:function(){

    },
    render:function(){
        return (
            <div>
                <div className="left-nav">
                    <h5>系统管理</h5>
                    <ul className="MM list-group">
                        <li posturl="/getWebSiteInfo" postdata="" posttable="flow" className="list-group-item selected llgl"><a  target="main">系统首页</a></li>
                        <li className="list-group-item "><a  target="main">新站投放</a></li>
                        <li className="list-group-item"><a  target="main">恢复投放</a></li>
                        <li className="list-group-item"><a  target="main">佣金查询</a></li>
                        <li className="list-group-item"><a  target="_blank">KPI登录</a></li>
                        <li className="list-group-item"><a  target="_blank">技术支持</a></li>
                    </ul>
                    <h5>网站管理</h5>
                    <ul className="MM list-group nav-hide">
                        <li posturl="/wzzbmp/queryWzz" postdata="{'web_register_state':1}" posttable="wzz" className="list-group-item wzgl"><a  target="main">网站主审核</a></li>
                        <li posturl="/wzz/queryWzz" postdata="" posttable="wzz" className="list-group-item wzgl" ><a  target="main">所有网站</a></li>
                        <li posturl="/wzz/queryWzz" postdata="{'web_register_state':0}" posttable="wzz" TableCol="" TableItemName="" TableTitle="" className="list-group-item wzgl"><a  target="main">待审核网站</a></li>
                        <li posturl="/wzz/queryWzz" postdata="{'web_state':1}" posttable="wzz" className="list-group-item "><a  target="main">正常会员</a></li>
                        <li posturl="/wzz/queryWzz" postdata="{'web_register_state':3}" posttable="wzz" className="list-group-item " className="list-group-item wzgl"><a  target="_blank">锁定网站</a></li>
                        <li className="list-group-item"><a  target="_blank">所有会员</a></li>
                    </ul>
                    <h5>广告管理</h5>
                    <ul className="MM list-group nav-hide">
                        <li className="list-group-item"><a  target="main">广告供求管理</a></li>
                        <li className="list-group-item"><a  target="main">站长广告申请</a></li>
                        <li className="list-group-item"><a  target="main">广告位申请</a></li>
                        <li className="list-group-item"><a  target="main">效果管理</a></li>
                    </ul>
                    <h5>CRM管理</h5>
                    <ul className="MM list-group nav-hide" >系统管理
                        <li className="list-group-item"><a  target="main">系统首页</a></li>
                        <li className="list-group-item"><a  target="main">新站投放</a></li>
                        <li className="list-group-item"><a  target="main">恢复投放</a></li>
                        <li className="list-group-item"><a  target="main">佣金查询</a></li>
                        <li className="list-group-item"><a  target="_blank">KPI登录</a></li>
                        <li className="list-group-item"><a  target="_blank">技术支持</a></li>
                    </ul>
                </div>
            </div>
        )
    }
});
//<div style="overflow: hidden;background-color: #d6e9c6;padding: 5px;min-height: 400px;">
console.log("myTable ok.")