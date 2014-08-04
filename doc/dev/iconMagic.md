# ICONMagic图片资源文件规则
## 资源文件目录
	/data
		/project(所有工程存放的根目录)
			/hualala_doc（一些全局的文档或者资源目录）
				/dianpu.hualala.com（商户中心工程的资源文档目录）
					/image_lib_v1（商户中心的图片资源目录）
						/background（用于重复平铺的素材资源）
						/iconfont（用于实现icon font的资源文件，每个icon font是一个文件）
						/ixicon（用于实现icon sprite 的图标资源文件）
						/picmap（用于存放一些不规则的图片资源）
						/doc（对于icon magic的使用说明文档）

## 功能说明
> 前端图片、图标素材一般包含几种形式：    
> ` icon sprite（图标拼接素材图）` ，` 背景平铺素材图`，`字体图标`，`不规则的图片素材`。       
> ` ICONMagic ` 是一个前端素材自动化生成*** 工具 ***，主要功能有：     
> 1. 将美工制作的各个图标素材拼接成一整张素材图片，同时生成对应的less文件，提供mixin方法，供开发人员使用。这样开发人员可以完全不用关心图标在拼接图中的具体位置。专注与页面制作；    
> 2. 将美工制作的各个字体图标文件生成为一个字体文件，同时生成对应的less mixin方法，供前端开发人员使用。这样开发人员可以不关心使用的图标到底是哪个字符。专注于页面实现；    
> 3. 将美工裁切的平铺类型的背景素材进行base64编码，同时生成对应的less文件，提供mixin方法，供开发人员使用。这样开发人员可以不需要关心背景素材图片的具体文件名。专注于页面实现；    
> 4. 将美工裁切的一些非标准的图标｜图片素材进行拼接，减少素材文件数量，同时生成对应的less文件，提供mixin方法，供前端开发人员使用。这样开发人员可以不需要关心素材的具体文件名。专注于页面实现。	

## 资源文件命名规则
### 1. background目录
``` 存放用于平铺的背景类素材图片			
```
		
> 图片命名规则：    
	[平铺方向：h｜v] _ [图片宽高：h｜w] _ ［图片名称].png
		    
	eg:
		h_33_btn.png
		v_16_ruler.png
		h_50_header.png
### 2. iconfont目录
``` 存放用于实现icon font的资源文件
```		
> 图片命名规则：		
	[大小写声明：l（小写）|u（大写）][字母] _ [icon名称].svg    
	[数字] _ [icon名称].svg    
	[普通单字字符]_[icon名称].svg    


	eg：
		la_lock.svg
		ua_close.svg
		0_users.svg
	
### 3. ixicon目录
``` 存放用于实现“css icon sprite”的资源文件 ```    
> 图片命名规则：    
	[图标规格(icon size)]_[图标名称].png    
		
	
	eg:
		12_arrow-down.png
		16_zoom-in.png
		24_photo-empty.png
		32_mail.png
		48_date.png
		
		
	
### 4. picmap目录
``` 存放一些不是规则正方形的图片资源文件 		
```
> 图片命名规则：    
	[图片名称].png 
		
	eg:
		box-mail.png
		logout.png
		btn-left.png
		btn-right.png