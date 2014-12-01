JavaScript基础知识
===
# 词法结构
## 什么是词法结构
> 程序设计语言的一套基本规则，描述如何用这种语言编写程序。它是一门语言的最低层次的语法。
> 例如：指定变量名是什么样子的；注释应该使用什么字符；语句直接如何分割等等

## 字符集
1. ** 何为字符集？ **
> 字符集就是多个字符的集合，字符集有很多种，每种字符集包含的字符个数不同。

	常见的字符集：`ASCII`,`ISO Latin-1`,`GB2312`,`BIG5`,`GB18030`,`Unicode`    
	如果计算机要处理各种字符集文字，就需要进行相应的[字符编码](http://zh.m.wikipedia.org/zh-cn/%E5%AD%97%E7%AC%A6%E7%BC%96%E7%A0%81 "字符编码")。

2. ** 那Javascript是用什么字符集编写的呢？ **

	JavaScript程序是是用Unicode字符集编写的。    
	在ECMAScript V3标准中允许Unicode字符出现在JS程序的任何地方，但是该标准的第一，第二版中都只允许Unicode字符出现在注释或用引号括起的字符串直接量中，所有的元素只能用ASCII字符集。ECMAScript标准化之前的JavaScript版本则根本不支持Unicode编码

		var 我 = "BlueFish";
		console.log(我);
		
3. ** JavaScript是一种区分大小写的语言 **

	这里需要注意HTML并不区分大小写，尽管XHTML区分大小写。许多js对象和属性都与它们所代表的HTML标记和属性同名。但是Javascript中它们通常是小写。

		例如：
			html中：
			<input type="button" name=“ok” onclick=“...” />
			<input type="button" name=“ok” onClick=“...” />
			html中都可以解析。
			但是在JS代码中只能使用onclick
4. ** 好的编码习惯是要不要省略分号 **

	js像c，c++，java语言一样，都是使用分号分割语句，但是js中如果语句放置在不同的行中，就可以省去分号。   

		这是正确的
		a = 3;
		b = 4;
		这也是正确的
		a = 3
		b = 4
		这是错误的
		a = 3 b = 4
	但是省略分号不是一个好习惯。** Why？**   
	理论上，js允许在任意两个记号间放置换行符，但是实际上js在解析时会自动插入分号，这个规则往往会导致很多异常和程序逻辑的错误。

		var a = 3;
		if (a == 3) {
			return 
			true;
		}
		问题：js会怎样？
		注意：这样的代码不会引起语法错误，但是却会因为产生了不明确的状态，导致逻辑上的错误
5. ** 善于使用注释 **
6. ** 什么是直接量（literal） **

	> 直接量就是程序中直接显示出来的数据值。
	
7. ** 标示符(identifier) **

	> 就是一个名字。在JavaScript中标示符用来命名变量和函数，或者作为JS代码中某些循环的标签。
	
	标示符的命名规则：第一个字符必须是字母、下划线(_)或者美元符号($)；接下来的字符可以是字母、数字（数字不能作为首字符，因为这样规定，javascript可以轻易的区分标示符和数字）、下划线或者美元符号。
	最重要的一点，标示符不能和JavaScript语言中的关键字同名。
	

8. ** 保留字 **

	下面的关键字是ECMAScript v3标准化保留的关键字：    
	`break` `do` `if` `switch` `typeof` `case` `else` `in` `this` `var` `catch` `false` `instanceof` `throw` `void` `continue` `finally` `new` `true` `while` `default` `for` `null` `try` `with` `delete` `function` `return`
	下面的关键字虽然js现在不使用，但是为了扩展语言ECMAScript v3保留了下来：    
	`abstract` `double` `goto` `native` `static` `boolean` `enum` `implements` `package` `super` `byte` `export` `import` `private` `synchronized` `char` `extends` `int` `protected` `throws` `class` `final` `interface` `public` `transient` `const` `float` `long` `short` `volatile` `debugger`
	ECMAScript v4中还加入了`as` `is` `namespace` `use`的用法。
	
	为了避免以后js会使用这些关键字，在代码中要尽量避免使用它们。同时还要避免把js预定义的全局变量名或全局函数名用作标示符。如果使用它们，当这个属性是只读的，你可能会得到一个错误，或者重定义了一个已经存在的变量或函数，导致程序逻辑错误。
	下面是应避免使用的其它标示符：    
	`arguments` `encodeURI` `Infinity` `Object` `String` `Array` `Error` `isFinite` `parseFloat` `SyntaxError` `Boolean` `escape` `isNaN` `parseInt` `TypeError` `Date` `eval` `Math` `RangeError` `undefined` `decodeURI` `EvalError` `NaN` `ReferenceError` `unescape` `decodeURIComponent` `Function` `Number` `RegExp` `URIError`
	
# 数据类型(datatype)
1. ** 什么是数据类型？？ **
	
	> 在一门程序设计语言中，能够表示并操作的值的类型成为数据类型
	
	
2. **JavaScript的数据类型有哪些？？**

	* 三种基本数据类型：`数字(Number)`、`文本字符串(String)`和`布尔值(Boolean)`
	* 两种小数据类型：`空NULL`、`未定义Undefined`
	* 符合数据类型：`对象Object` 
		* 已命名的值的无序集合（object） 
		* 有编号值的有序集合（array）
		* 函数---具有可执行代码的对象（function）
				
			** NOTE: **
				
				数组和对象是同一种数据类型，但是它们的行为却极不相同，所以可以看做是两种不同的类型。除了函数和数组之外，js核心还定义了其它的专用对象（Date、RegExp、Error），它们不是新的数据类型，而是对象的子类（sub class）


	** 下面的代码结果是什么？ **
		
		var arr = [1,2,3], 
			obj = {a:1,b:2},
			fun = function () {
				console.info("Hello world");
			};
		console.info(typeof arr);				//object
		console.info(arr instanceof Object);	//true
		console.info(arr instanceof Array);	//true
		console.info(arr instanceof Function);	//false
		
		console.info(typeof obj);				//object
		console.info(obj instanceof Object);	//true
		console.info(obj instanceof Array);	//false
		console.info(obj instanceof Function);	//false
		
		console.info(typeof fun);				//function
		console.info(fun instanceof Object);	//true
		console.info(fun instanceof Array);	//false
		console.info(fun instanceof Function);	//true
		
		console.info(typeof Object);			//function
		console.info(typeof Array);				//function
		console.info(typeof Function);			//function
		
		console.info(typeof null);				//object
		console.info(typeof undefined);			//undefined
		console.info(undefined == null);		//true
		console.info(undefined === null);		//false ？？？抓狂了！！别急，我们下面解释
		
		console.info(toString.call(arr));		//[object Array]
		console.info(toString.call(obj));		//[object Object]
		console.info(toString.call(fun));		//[object Function]
		
		console.info(toString.call(Array));	//[object Function]
		console.info(toString.call(Object));	//[object Function]
		console.info(toString.call(Function));	//[object Function]

3. ** 数字 **	

	> ** JavaScript中，所有的数字都是由64位浮点型表示的（IEEE754）。 **
	
	* 整形直接量
	* 八进制和十六进制直接量
		
		十六进制是以0x、0X开头，其后跟随十六进制数字串的直接量；
		八进制是以0开头，其后跟随八进制数字序列的直接量；
		最好不要使用八进制直接量，因为可能不同的js实现支持八进制不同。
	* 浮点型直接量
		
	* 特殊的数值
		
		常量 | 含义 
		:----------- | :-----------
		Infinity     | 表示无穷大的特殊值 （JavaScript 1.3+）     
		NaN          | 特殊的非数字值（JavaScript 1.3+）     
		Number.MAX_VALUE | 可表示的最大数字
		Number.MIN_VALUE | 可表示的最小数字（与0最接近的数字）
		Number.NaN	| 表示特殊的非数字值
		Number.POSITIVE_INFINITY | 正无穷大的特殊值
		Number.NEGATIVE_INFINITY | 负无穷大的特殊值
				
	* 字符串
		> 字符串(string)是由Unicode字符、数字、标点符号等组成的序列，是JavaScript用来表示文本的数据类型。程序中的字符串直接量是包含在单引号或双引号中。JS没有表示单个字符的char数据类型，而是用长度为1的字符串作为表示单个字符
	
		1. 在JavaScript 1.3之前的版本中，字符串只支持ASCII、Latin-1字符。ECMAScript V1标准是允许字符串直接量使用Unicode字符的。还可以采用转移序列把Unicode字符添加到字符串中。
		
			常用的转移序列：
		
			序列 | 字符 
			:----------- | :-----------
			\0     | NUL字符(\u0000)    
			\b           | 退格符(\u0008)     
			\t | 水平制表符(\u0009) 
			\n | 换行符(\u000A)
			\v	| 垂直制表符(\u000B)
			\f | 换页符(\u000C)
			\r | 回车符(\u000D)		
			\" | 双引号(\u0022)		
			\' | 单引号或撇号(\u0027)		
			\\ | 反斜线(\u005C)		
			\xXX | 由两位十六进制数值XX置顶的Latin-1字符		
			\uXXXX | 由四位十六进制XXXX指定的Unicode字符
			\XXX | 由一位到三位八进制数(1到377)指定	的Latin-1字符。ECMAScript V3不支持，不要使用这种转义序列
		
		2. 字符串的使用
		
			JS中字符串和数组一样，都是以0开始索引的。
			
				var msg = 'hello ' + 'world';
				console.info(msg.charAt(msg.length - 1));
				console.info(msg.substring(1,4));
				console.info(msg.indexOf('o'));
				//注意！！
				var last_char = msg[msg.length - 1];
				
			**注意：**
			
			在JS某些版本中，是可以使用数组的表示方法将当个字符从字符串中读取的（但是这样不能写入），如上面代码中的最后一句。这个方法与使用charAt接口等效。但是这种形式不是ECMAScript V3标准的一部分，也不可移植。因此应该尽量避免这样使用。
			
			上面使用了字符串对象的方法，与对象数据类型的属性和方法用法是相同的，但是这并不意味着字符串就是一种对象类型。后面会在** 传值与传址 ** 部分解释其中的原因。
			
4. 布尔值
	
	布尔类型只有两个值:**true**，**false**

5. 函数

	JS函数可带有实际参数或形式参数，用于指定这个函数执行计算要使用的一个或多个值，函数还可以返回一个值，如果没有指定返回值，默认返回undefined，用来表示函数运行的结果。除了标准的函数定义方式外，还有函数直接量方式定义。因为函数与字符串，数字一样都是一种数据类型。
	> 函数直接量是用关键字function后加可选的函数名、用括号括起来的参数里列表和用花括号括起来的函数体定义的。函数直接量可以出现在其他js表达式中。
	
		var square = function (x) {return x*x;}
		var f = function fact(x) {
			if（x <= 1） {
				return 1;
			} else {
				return x * fact(x - 1);
			}
		}
		//注意，这里并没有创建一个名为fact的函数，只是允许函数体用这个名字来引用自身。JavaScript1.5之前版本中并没有正确实现这种命名的函数直接量。
		
	* Agruments对象
	
	在函数中使用arguments这个特殊对象，开发者可以无需明确指出参数名就能访问这个参数。arguments对象索引从0开始访问。
	
	* Arguments的length属性
	
	ECMAScript标准中不会验证传递给函数的参数个数是否等于函数定义的参数个数，这与c，c++等其他程序设计语言很不相同。	开发者定义的函数可以接收任意个参数（Netscape文档中最多可以接收25个）。
	
	arguments.length声明了传递给当前函数参数的个数，而不是期望传递的参数个数，只在函数内部有效。还要注意该属性不具备Array.length属性的专有行为（它不是真正意义上的数组类型）。
		
		var fn = function (a,b,c) {
			console.info(arguments instanceof Array);
			console.info(arguments instanceof Object);
		};
	
	用arguments.length获取传入参数的个数就可以模拟重载。
	
	* Arguments的callee属性
	
	用来引用当前正在运行的函数。这给未命名函数提供一种自我引用的方式。该属性只在函数体内被定义
		
		var factorial = function (x) {
			if (x <= 1) {
				return 1;
			} else {
				return x * arguments.callee(x - 1);
			}
		}
	
	* Function的length属性
	
	因为函数是引用类型，所以它也有方法和属性。ECMAScript定义的函数的length属性是**只读**的，声明的是函数声明的参数个数，与arguments.length不同，它在函数体内部和外部都有效。
	
	* 结合上面的这几种属性我们可以编写一个判断传入函数的参数个数是否正确的方法
		
			var checkArgs = function (args) {
				var actual = args.legnth,
					expected - args.callee.length;
				if (actual != expected) {
					throw new Error("实际传入参数与函数声明参数个数不符");
				}
			};
			var f = function (x, y, z) {
				check(arguments);
				return x + y + z;
			};
			f(1, 3);
			f(1, 2, 3);
		
	* Function的apply()和call()方法
	
		> call 和 apply都是为了改变函数运行时的上下文（context），而提供的方法
		> javascript的函数存在几个概念：`定义时上下文`，`运行时上下文`，`上下文可以动态改变`
	
		这两个方法可以简单的理解为动态的更改函数运行空间，或称为动态更改this指向的对象，区别在于提供给函数的参数上的调用方式不同。
	
			fun.call(object, arg1, arg2,...);
			fun.apply(object, [arg1, arg2, ....]);
	
		使用这两个方法，可以像其他对象的方法一样调用。call()和apply()的第一个参数都是要调用的函数的对象，在函数体内，这一参数是关键字this的值（即把第一个参数赋值给函数体内的this，this以后指向的是第一个参数）。call()方法的剩余参数是传递给要调用函数的值，apply()方法与call()方法相似，只不过要传递的参数是数组形式的。
		
		**call，apply的应用场景:**
			
			//1.数据类型判断（如上面讲数据类型时的范例代码）
			Object.prototype.toString.call(obj);
			
			
			//2.当你想在当前上下文中，使用别的类提供的方法时
			function Man () {};
			Man.prototype = {
				valet : false,
				wakeUp : function (e) {
					console.log(this.value + "? Some breakfast, please.");
				}
			};
			var wooster = new Man();
			var button = document.getElementById('moring');
			button.addEventListener(
				'click',
				wooster.wakeUp,	//????运行结果是什么？
				false
			);
			var button = document.getElementById('morning2');
			button.addEventListener(
				'click',
				function () {
					Man.prototype.wakeUp.apply(wooster, arguments);//？？？运行结果？？
				},
				false
			);
			
			
			//3.前面提到的arguments与Array很像，但是它并不是Array，所以不具备Array专属的属性和方法。但是如果你想使用Array.push的方法，该如何解决呢？
			var fun = function (a, b, c) {
				console.info(arguments);
				Array.prototype.push.call(arguments, 4, 5, 6);
				console.info(arguments);
				console.info(arguments.length);
			};
			
			
			//4.JavaScript没有私有方法的概念，想用闭包实现该如何解决？？？
			(function () {
				var Person = function () {
					this.doSomeThing = function () {
						_privateFunc.call(this);
					};
				};
				//私有方法
				var _privateFunc = function () {
					...
				};
				window.Person = Person;
			}).call(window);
			
			//5.当你的类提供的方法有callback时，你如果又想让callback里的context（上下文）是当前对象的上下文，该如何解决？？
			//如果不适用call，apply，你是无法在callback中使用tom当前的上下文，只能使用tom.other调用这个函数
			var Person = function () {...};
			Person.prototype.say = function (callback) {
				callback();
			};
			Person.prototyp.other = function () {...};
			var tom = new Person();
			tom.say(function () {
				tom.other();
			});
		
			//当使用apply，call就能解决这个问题了
			var Person = function () {};
			Person.prototype.say = function (callback) {
				callback.call(this);
			};
			Person.prototype.other = function () {
				...
			};
			var tom = new Person();
			tom.say(function () {
				this.other();
			});

6. 对象转换

	当一个非空对象用于布尔环境的时候，它转换为true；当一个对象用于字符串环境，js调用对象的toString（）方法，并且使用该函数返回的字符串的值。当一个对象用于数字环境，JS首先调用该对象的valueOf（）方法。如果这个方法返回一个基本类型的值，这个值会被使用。然而在大多数情况下valueOf（）方法返回的是对象自己，在这种情况下，js首先使用toString（）方法把对象转换为一个字符串，然后再试图把该字符串转换为一个数字。
	
7. null与undefined的区别

	大多数计算机语言只有一个表示“无”的值，例如C语言中的NULL，java中的null，ruby中的nil，python中的none，但是javascript中却有两个用来表示“无”的值：null和undefined
	
		console.info(undefined == null);
		
	上面的代码可以看出null与undefined没什么区别。
	
		console.info(undefined === null);
	
	但是严格比较时却为false，看来它们还是有所不同的。这样从历史来分析。
	
	在95年，javascript诞生时，就像Java一样，只设置了null表示“无”的值，根据C语言的传统，null被设计成可以自动转换成0。
	
		console.info(Number(null));
		console.info(5 + null);
	但是js的设计者Brendan Eich，觉得这么做还不够，有两个原因：
	
	首先，null像java一样，被当成了对象，但是javascript的数据类型分成原始类型(primitive)和合成类型(complex)两大类。Eich觉得“无”的值，最好不是对象。    
	其次，JavaScript的最初版本是没有包括错误处理机制的，发生数据不匹配时，往往是自动转换类型或者默默的失败。所以Eich觉得，如果null自动转为0，很不容易发现错误。    
	因此Brendan Eich又设计了undefined
	
	所以js最初的版本是这样区分的：null是一个表示“无”的对象，转换为数值时为0；undefined是一个表示“无”的原始值，转为数值时为NaN
	
		Number(undefined)
		5 + undefined
		
	但是上面这种区分方式，很快就被证明不可行。目前，null与undefined基本是同义的，只有一些细微的差别。
	> null表示“没有对象”，即该处不应该有值。典型用法是：
		
	> 1. 作为函数的参数，表示该函数的参数不是对象
	2. 作为对象原型链的终点
	
		Object.getPrototypeOf(Object.prototype)
	
	> undefined表示“缺少值”，就是此处应该有一个值，但是还没有定义。典型用法是：
	
	> 1. 变量被声明了，但没有赋值时，就等于undefined
	2. 调用函数时，应该提供的参数没有提供，该参数等于undefined
	3. 对象没有赋值的属性，该属性的值为undefined
	4. 函数没有返回值时，默认返回undefined
	
		var a；
		
		function fn (x) {console.info(x);};
		fn();
		
		var o = new Object();
		console.info(o.a);
		
		var x = fn();
		console.info(x);

8. 类型转换小结

	> 类型转换的基本规则是：当一种类型的值用于需要某种其他类型的值的环境中，JavaScript自动尝试把值转换为所需类型。

	值 | 字符串	| 数字	| 布尔	|	对象	|	 
	:----------- | :-----------	
	未定义的值     | “undefined” | NaN | false | Error
	null | “null” | 0 | false | Error
	非空字符串 | 不变 | 字符串的数字值或者NaN | true | String对象
	空字符串 | 不变 | 0 | false | String对象
	0 | “0” | 不变 | false | Number对象
	NaN | “NaN” | 不变 | false | Number对象
	无穷 | “Infinity” | 不变 | true | Number对象
	负无穷 | “-Infinity” | 不变 | true | Number对象
	任意其他的数字 | 数字的字符串值 | 不变 | true | Number对象
	true | “true” | 1 | 不变 | Boolean对象
	false | “false” | 0 | 不变 | Boolean对象
	对象 | toString() | valueOf(),toString(),或者NaN| true | 不变
	
9. 传值和传址

	> 在JavaScript中和所有编程语言中一样，可以用3种重要的方式来操作一个数据值：
	> 
	1. 可以复制它。例如，可以把它赋个一个新的变量；
	2. 可以把它作为参数传递给一个函数或方法；
	3. 可以把它和另一个值进行比较看两个值是否相等。
	> 
	要理解任何的编程语言，都必须理解这三种操作在这种语言中是如何实现的。
	有两种基本上截然不同的方式可以操作数据的值--这两种技术分别叫做传值和传址。
	
	操作 | 传值	| 传址	
	:----------- | :-----------	 | :-------
	复制 | 实际复制的是值，存在两个不同的、独立的拷贝 | 复制的只是对数值的引用。如果通过这个新的引用修改了数值，这个改变对最初的引用来说也可见
	传递 | 传递给函数的是值的一个独立的拷贝，对它的改变在函数外部没有影响 | 传递给函数的是对数值的一个引用。如果函数通过传递给它的引用修改了数值，这个改变在函数外部也可见
	比较 | 比较的是两个独立的值（通过逐字节比较），以判断他们是否相同 | 比较的是两个引用，以判断它们引用的是否是同一个数值。对两个不同的数值的引用不相等，即使对两个数值是由相同的字节构成的
	
	JavaScript的基本规则是：基本数据类型通过传值来操作，而引用类型，是通过传址操作。
	
	数字和布尔类型在JavaScript中是基本类型，对象、数组和函数都是引用类型
	
	类型 | 复制	| 传递 | 比较	
	:----------- | :-----------	 | :------- | :------
	数字 | 传值 | 传值 | 传值
	布尔 | 传值 | 传值 | 传值
	字符串 | 不可变 | 不可变 | 传值
	对象 | 传址 | 传址 | 传址
	
# 变量

1. 变量的类型

	JavaScript是没有变量类型规则的，因为它是非类型(notype)的语言。
	
2. 变量的声明
	
	JS中,在使用一个变量之前,必须先声明（declare）它，使用var关键字进行声明（如果没有声明，js会隐式的声明它）。
	
	因为js是非类型的语言，所以在js中重复声明一个变量，不仅是合法的，而且不会造成任何错误，如果重复的声明有一个初始值，那么它担当的只不过是一个赋值语句的角色。
	
	如果尝试读取一个未声明的变量的值，js会生成一个错误；如果尝试给一个未用var声明的变量赋值，js会隐式声明这个变量，但是隐式声明的变量总是被创建成全局变量，即使该变量只在一个函数体内使用。
	
	由于隐式声明这种特性，可能会造成很多程序逻辑上的问题。比如你想创建的是局部变量，结果变成了全局变量，所以最好的办法就是无论全局变量还是局部变量，最好都使用var语句创建。
	
3. 变量的作用域

	> 一个变量的作用域（scope）是程序中定义这个变量的区域。全局（global）变量的作用域是全局性的，局部变量是在函数之内声明的变量，就只在函数体内部有定义。
	
	我们通过几段代码来了解作用域
	
	** 全局变量与局部变量 **
		
		var scope = "global";
		function checkscope () 	{
			var scope = "local";
			console.info(scope);
		}
		checkscope();
		console.info(scope);
		
	**隐式声明变量的问题**

		scope = "global";
		function checkscope () {
			scope = "local";
			console.info(scope);
			myscope = "local1";
			console.info(myscope);
		}
		checkscope();
		console.info(scope);
		console.info(myscope);
		
	** 没有块级作用域规则(即函数中声明的所有变量在整个函数中都有定义) **

		function test (o) {
			var i = 0;
			if (typeof o == "object") {
				var j = 0;
				for (var k = 0; k < 10; k++) {
					console.info(k);
				}
				console.info(k);
			}
			console.info(j);
		}

	** 没有块级作用域规则带来的奇怪结果 **

		var scope = "global";
		function fun () {
			console.info(scope);
			var scope = "local";
			console.info(scope);
		};
		fun();
		console.info(scope);
		//这个例子说明了为什么将所有的变量声明集中起来放置在函数的开头是一个很好的编程习惯
		
	** 我们来深入理解下变量作用域 **
	
	既然我们知道全局变量是全局对象的属性，局部变量是一个特殊的调用对象的属性，那么如果一个函数定义嵌套在另一个函数中，那么在嵌套的函数中声明的变量就具有嵌套的局部作用域。
	> 每个JavaScript执行环境都有一个和它关联在一起的作用域链（scope chain）。这个作用域链是一个对象列表或对项链。当JS代码需要查询变量x的值时（变量名解析(variable name resolution)的过程）,它就开始查看该链的第一个对象。如果那个对象有一个名为x的属性，那么就采用那个属性的值。如果第一个对象没有名为x的属性，JS就会继续查询链中的第二个对象。如果第二个对象仍然没有名为x的属性，那么就会继续查询下一个对象，以此类推。
	> 在JS的顶层代码中，作用域链就只由一个对象构成，那就是全局对象。所有的变量都是在这一对象中查询的。如果一个变量并不存在，那么这个变量的值就是未定义的。
		
4. 垃圾收集
	
	> C，C++这样的语言对于内存的回收，是开发人员的责任，开发人员需要手动的释放使用的内存。
	> JavaScript使用一种垃圾收集(garbage collection)的方法。把这件事情交个程序去做。
	
		var s = "hello";
		var u = s.toUpperCase();
		s = u;
		//最终“hello”不能再被访问。这块内存垃圾收集机制会帮开发人员处理掉。