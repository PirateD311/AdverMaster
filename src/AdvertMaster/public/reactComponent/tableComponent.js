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
        var tableStyle = this.state.tableStyle;
        for(key in this.props.tableStyle){
            tableStyle[key] = this.props.tableStyle[key];
        }

        this.setState({"tableStyle":tableStyle});
        //this.ajaxTableData();
        console.log("componentWillMount...");
    },
    /*渲染后调用，真实dom已生成，可使用this.getDOMNode()方法访问它*/
    componentDidMount:function(){
        console.log("componentDidMount...");
    },
    ajaxTableData:function(){
        /*
        let self =this;
        if(this.state.ajaxData.url === this.props.ajaxData.url)
        {
            return ;
        }
        if(this.props.ajaxData){
            $.ajax({
                "url":this.props.ajaxData.url,
                "method":this.props.ajaxData.method||"post",
                "data":this.props.ajaxData.postData||"",
                "dataType":this.props.ajaxData.dataType||"json",
                "success":function(res){
                    if(res.code === 1){
                        if(res.tableStyle){
                            console.log(res.tableStyle);
                            self.setState({"showData":res.data,"ajaxData":{"url":self.props.ajaxData.url,"method":"","postData":{}},"tableStyle":res.tableStyle});
                            return ;
                        }else{
                            self.setState({"showData":res.data,"ajaxData":{"url":self.props.ajaxData.url,"method":"","postData":{}}});
                        }

                    }else{
                        alert("查询数据失败！");
                        return null;
                    }
                },
                "error":function(){console.log("Ajax error.");return null;}
            });
        }else{
            console.log("Not Ajax tableData.");
            return null;
        }
        */
    },
    createTable:function(){
        console.log("createTable");
        let aTableData = this.props.showData||this.state.showData||[{
            "sOwnerUserName":"null",
            "sWebIp":"0.0.0.0",
            "sWebDomain":"www.xxx.com",
            "sWebRegisterDate":"2012/12/21",
            "nWebState":"1",
            "nCPA":0,
            "nCPC":0,
            "nCPM":0
        }];

        let aColKey = this.props.tableStyle.colKey||this.state.tableStyle.colKey||["sWebRegisterDate","sOwnerUserName","sMeijie","nCPA","nFumeiti","nCPC","nCPM","sWebIp"];

        if(!Array.isArray(aColKey))
            aColKey = aColKey.split(',');
        let sColName = this.props.tableStyle.colTitle||this.state.tableStyle.colTitle;
        let aColTitle ;
        if(Array.isArray(sColName))
            aColTitle = sColName;
        else
            aColTitle = sColName.split(',');

        console.log(aTableData);
        console.log(aColTitle);
        console.log(aColKey);
        console.log(this.props.tableStyle);
        let aTd = [];
        let aTableBody = [];
        //begin添加标题行
        aTd.push(aColTitle.map((res) => (<td>{res}</td>)));
        if(TABLE_CATEGORY_WITHOPTION == this.props.tableStyle.tableCategory){
            console.log("It's option table.");
            aTd.push((<td>操作</td>))
        }
        aTableBody.push((<tr style={{"color":"white","background-color":"#428bca"}}>{aTd}</tr>));

        //end添加标题行
        //begin遍历数据，逐行添加数据
        aTableData.map((tabledata) => {
            aTd = [];
            aColKey.map((colkey) =>{aTd.push((<td>{tabledata[colkey]}</td>))});//从数据中取出每一列应展示的值。es6新写法

            if(this.props.tableStyle && TABLE_CATEGORY_WITHOPTION == this.props.tableStyle.tableCategory){//如果表格类型为带操作扭得，在末尾添加操作扭
                aTd.push((<td><OptionWzzBtn  data={tabledata} btnName="审批" /><OptionWzzBtn  data={tabledata} btnName="锁定" /></td>))
            }

            aTableBody.push((<tr>{aTd}</tr>));//添加本行至tBady
        });
        console.log("end create table");
        //end遍历数据，逐行添加数据

        return aTableBody;
    },
    render:function(){
        console.log("MyTable Render...");
        //this.ajaxTableData();
        let defaultTitleStyle = {borderColor:"#999",borderThickness:"1px",textAlign:"center"};
        let defaultTableWrap = {padding:" 1em 1em",border:" 2px solid",borderRadius: "1em"};
        return (
            <div style={defaultTableWrap}>
                <h4 style={defaultTitleStyle}>{this.props.tableStyle.tableTitle||this.state.tableStyle.tableTitle}</h4>
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
        console.log("ModifyBtn Submit.");
        var postData={
            "web_ip":this.props.data.sWebIp,
        };
        switch (this.props.btnName){
            case "审批":
                $.post("/getWebSiteInfo/activeSite",postData,function(res){
                    alert(res.info);
                });
                break;
            case "暂停":
                postData.web_register_state=2;
            case "锁定":
                $.post("/getWebSiteInfo/lockSite",postData,function(res){
                    alert(res.info);
                });
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

        $("#NiceDialog").hide();
        $("#handleFreshTableBtn").click();
    },
    handleOptionClick:function(){
        var dialogInfo="确定要对 "+this.props.data.sOwnerUserName+"进行"+this.props.btnName+"操作？";
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
        let self = this;
        $(".left-nav h5").click(function(){
            $(this).next().toggle(200,function(){
            });
        });
        $(".left-nav li").click(function(){
            $(".left-nav li").removeClass("selected");
            $(this).addClass("selected");
            self.props.changeUrl($(this).attr("data-url"));
        });
    },
    render:function(){
        return (
            <div>
                <div className="left-nav">
                    <h5>系统管理</h5>
                    <ul className="list-group">
                        <li data-url="/getWebSiteInfo/qryAllFlowStat" className="list-group-item selected"><a target="main">系统首页</a></li>
                        <li className="list-group-item "><a href="/register" target="main">新站投放</a></li>
                        <li className="list-group-item"><a target="main">恢复投放</a></li>
                        <li className="list-group-item"><a target="main">佣金查询</a></li>
                        <li className="list-group-item"><a target="_blank">KPI登录</a></li>
                        <li className="list-group-item"><a target="_blank">技术支持</a></li>
                    </ul>
                    <h5>网站管理</h5>
                    <ul className="list-group nav-hide">
                        <li data-url="/getWebSiteInfo/qryAllSiteInfo" className="list-group-item" ><a target="main">所有网站</a></li>
                        <li data-url="/getWebSiteInfo/verifyWebApplication"  className="list-group-item wzgl"><a target="main">待审核网站</a></li>
                        <li data-url="/getWebSiteInfo/allUser" className="list-group-item " className="list-group-item wzgl"><a  target="_blank">锁定网站</a></li>
                        <li data-url="/getWebSiteInfo/qryAllUser" className="list-group-item"><a  target="_blank">所有会员</a></li>
                        <li data-url="/getWebSiteInfo/qryAllUser"   className="list-group-item "><a  target="main">正常会员</a></li>
                    </ul>
                    <h5>广告管理</h5>
                    <ul className="list-group nav-hide">
                        <li className="list-group-item"><a  target="main">广告供求管理</a></li>
                        <li className="list-group-item"><a  target="main">站长广告申请</a></li>
                        <li className="list-group-item"><a  target="main">广告位申请</a></li>
                        <li className="list-group-item"><a  target="main">效果管理</a></li>
                    </ul>
                    <h5>CRM管理</h5>
                    <ul className="list-group nav-hide" >系统管理
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

let WZZBMP = React.createClass({
    getInitialState:function(){
        return {"url":"getWebSiteInfo","showData":[],"tableStyle":{}};
    },
    changeUrl:function(url){
        let self =this;
        $.ajax({
            "url":url,
            "method":"post",
            "data":"",
            "dataType":"json",
            "success":function(res){
                if(res.code === 1){
                    if(res.tableStyle){
                        console.log(res);
                        console.log(self);
                        self.setState({"showData":res.data,"tableStyle":res.tableStyle,"url":url});
                        return ;
                    }else{
                        self.setState({"showData":res.data,"url":url});
                        return ;
                    }

                }else{
                    alert("Ajax Data Failed.");
                    return null;
                }
            },
            "error":function(){console.log("Ajax error.");return null;}
        });
    },
    render:function(){
        return (
            <div className="container">
                <div className="row">
                    <div id = "leftNavBarContainer" className="col-md-2">
                        <MyNavBar changeUrl = {this.changeUrl}  />
                    </div>
                    <div className="col-md-10 right-warp" >
                        <div className="right-head"><img src="http://img3.imgtn.bdimg.com/it/u=3093510935,3806129624&fm=21&gp=0.jpg" /></div>
                        <div id="StatTable">
                            <MyTable showData={this.state.showData} tableStyle={this.state.tableStyle} ajaxData={{"url":this.state.url}}  />
                        </div>
                        <div id="NiceDialogContainer"></div>
                        <div><a href="tencent://message/?uin=3278192278&Site=www.ete.cn&Menu=yes"> 测试qq</a></div>
                    </div>
                </div>
            </div>
        )
    }
});

