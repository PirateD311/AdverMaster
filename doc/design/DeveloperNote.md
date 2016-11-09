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
  
