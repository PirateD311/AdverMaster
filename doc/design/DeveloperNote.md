#开发日志
2016/11/8
###完成内容
1. mongodb环境搭建及基本增删改查的调试
2. AdvertMaster项目mongodb的模型定义、操作类的创建。
3. 登录注册模块的页面及对应的数据库操作。
4. 广告主注册签约广告统计模块的页面及后台代码。  

###问题及解决
1. 使用`yum -y install mongodb`安装后mongo数据库无法启动的问题。报错信息：  
  **问题原因**：此问题是由于mongo数据库服务未启用造成，在进程中未找到mogon相关的的进程。原因是安装的mongodb为mongodb的客户端，环境中并未安装mongo的服务端，当然也没有启动mogon服务。  
  **解决**：使用`yum -y install mongodb-server`安装mongo的服务端，并使用`service mongod start`启动mongo服务。查到mongo服务进程存在后使用mongo命令进行连接。  
2. 使用`npm install mongoose`安装node的mongoose模块时安装进度缓慢，进度条长时间不动。  
  **问题原因**：此命令使用的是国外的npm包路径，由于墙的原因会造成网络不通畅。
  **解决**：使用`npm install -d mongoose --registry=http://registry.npm.taobao.org`命令进行安装。--registry 为更改使用阿里的国内npm镜像。  

---
2016/11/10
###完成内容
1.使用Cors技术解决跨域post请求问题，完成广告请求、基本流量统计模块。
2.串接并优化已完成的模块，打通基本的业务流程，代码优化，新增全局const类型的定义。
3.完成基本网站用户信息管理

###问题及解决
1.跨域post请求问题
**问题原因**：出于安全考虑，浏览器屏蔽了跨域请求，属于web技术栈经典问题。
**解决**：由于业务需求，需要进行跨域post请求，使用jsonp技术只支持get请求，故采用Cors技术。详见 Cors(http://www.ruanyifeng.com/blog/2016/04/cors.html)
2.mongoose中查出的文档(对象)，无法动态的添加属性。
**问题原因**：由于业务需求，需查两个不同文档并合并部分数据返回，此时发现向mongoose返回的doc中添加其他属性后无法生效。具体情况如下：
`DBManager.getUserModel().findOne({sUserName:doc[i].sOwnerUserName},function(err,doc2){
     if(!err&&doc2){
         console.log(doc2);
         doc[i]["sWebOwnerPhone"] = doc2.sUserPhone;//新增属性
         doc[i].sUserQQ = doc2.sUserQQ;
         console.log(doc[i].sWebOwnerPhone);//可以打印出新增属性，新增成功
         console.log(doc[i].sUserQQ);
         console.log(doc[i]);//直接打印对象确看不到新增属性
     }
 });`
**解决**：通过不断尝试，发现可能是mongoose文档中_id与__v这两个属性有古怪，深拷贝对象包含这两个属性，就只会显示这两个属性之前的属性。最后采用创建新的对象，只将需要的属性提取添加的方式解决。
