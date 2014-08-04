# 前端开发CallServer接口开发流程
## 什么是CallServer接口？
> CallServer接口就是前端与后端数据的接口，一般来说就是前端发送指定的Ajax请求，获取后端回复的数据
## 为何要定义CallServer接口？
> 优点：代码统一规范，提高开发效率，避免做重复劳动，同时利于前端原型开发，让数据与业务解耦合    
> ## 如果不使用统一的CallServer：    
> **码农A需要获取用户数据，于是码农A实现了Ajax请求**<br/>
> `XXX.getUserCallServer({id : １}, function (cbFn) {...});`<br/>
> **码农B也需要获取用户数据，于是码农B实现了另一个Ajax请求**<br/>
> `YYY.getUserCallServer({uid :１}, function (cbFn) {...});`<br/>
> **于是后端开发人员疯掉了**<br/>
> **码农C刚加入公司，看到这里也疯掉了，不知道该使用那个接口**<br/>
> ## 如果使用统一CallServer：
> **码农A发现获取用户数据没有实现，于是码农A实现了对应的接口调用方法**<br/>
> `Hualala.CommonCallServer.getUserData(params, cbFn);`
> **码农B查询CallServer接口文件，发现获取用户数据的接口已经存在，于是码农B调用接口实现业务，so easy！**<br/>
> `Hualala.CommonCallServer.getUserData({id :１}, function () {....})`<br/>
> **后端开发人员发现CallServer接口文件里有新的接口需要实现，后端人员照做**
> **新加入的码农C,看到获取用户数据已经有这个接口了，轻松调用实现业务，so easy！**
## 前端开发人员该如何工作？
### 前端开发人员在实现接口时需要关注的地方
	/root
		/interface
			/def  //数据结构的定义，分模块或者分类别保存，方便查看
				/dp_app.js
				/dp_group.js
				/dp_user.js
				/....*.js
			/interface.js  //与后端的接口声明，请求参数，返回数据要详细注释
		/distrib
			global-callserver-common.js
			global-callserver-user.js
			global-callserver-shop.js
			....
			global-const.js
			global-url.js
		/proto
			global-callserver-common.js	  //类似global-callserver-[name].js的文件，均是接口实现文件，
			global-callserver-user.js     //所有的这些接口文件，都必须在interface/interface.js下进行声明，注释
			global-callserver-shop.js     //这些接口文件，只是用于前端原型开发和测试，需要实现假数据
			....
			test.js    //前端原型需要使用的假数据，由这个文件进行动态加载，
			global-const.js    //这个文件定义的是，所有站点的路径静态参数（针对前端原型使用）
			global-url.js      //url引擎库，与一些公共的url获取方法（针对前端原型使用）

		/test
			/data    //所有前端原型开发时使用的假数据，都要存放在这个目录下，根据模块，或者分类进行保存，
				/app.js     //所有假数据都是js实现的，
				/user.js    //方便proto/test.js进行动态加载
				/order.js
				/shop.js
				......

> **根据上面目录的说明，我们可以看到数据与业务代码是明显分离开的。**    
> **需要注意的是`proto`目录下的`js`文件只是为前端原型开发时使用，对于发布给后端使用的真正代码，这些文件必须重新实现，保存在`distrib`目录下(除了`test.js`)**