# encoding: utf-8
#auto update the timestamp of image url
import re
import os, sys
import hashlib

#获取文件MD5值
def CalcMD5 (filepath):
	with open(filepath, 'rb') as f:
		md5obj = hashlib.md5()
		md5obj.update(f.read())
		hash = md5obj.hexdigest()
		hash = str(hash)
		# print(hash)
		return hash[0:8]

#css文件的目录存放路径，该脚本放在项目的根目录
#inputDir = '../WebRoot/asset/css/'
inputDir = './distrib/css/'
imgPath = re.compile('url\([\'\"]?((.+?)\.(png|jpg|jpeg|gif|eot|woff|ttf|svg)(\?\#iefix|\#glyphicons-halflingsregular|.))[\'\"]?\)', re.I)
# imgPath = re.compile('url\([\'\"]?((.+?)\.(png|jpg|jpeg|gif))[\'\"]?\)', re.I)
revRegex = re.compile('r([0-9]+) |')
#从url读取时间戳
def getTimestampArr(url):
	i = url.find('?')
	if i != -1:
		m = url.split('?')
		return m
	else:
		return[url, 0]
#根据传入的url，读取svn的文件版本号(commit)
# def getLastModifyVer(url):
# 	cmd = 'svn log ' + url + ' -r COMMITTED -q |head -2|tail -1'
# 	ret = os.popen(cmd)
# 	info = ret.read()
# 	#svn log提取文件的最近提交信息
# 	ver = revRegex.findall(info)

# 	if ver:
# 		ver = ver[0]
# 	else:
# 		ver = 0
# 	#print cmd + '\n'

# 	#print url + ' version code:' + ver + '\n'

# 	return ver
def getLastModifyVer(url):
	if not os.path.exists(url):
		print("cannot find file:" + url)
		ret = ''
	else :
		ret = 't=' + CalcMD5(url);
	return ret
files = os.listdir(inputDir)
cssFiles = []
#find all css files
for f in files:
	f = f.lower()
	if f.endswith('.css'):
		cssFiles.append(f)
#read all image url and compare the timestamp
for f in cssFiles:
	out = open(inputDir + f, 'r+')
	content = out.read()
	m = imgPath.findall(content)
	if m:
		replaceCache = {}
		for u in m:
			
			link = u[1] + '.' + u[2]
			
			#如果图片的url是绝对路径，则可能是不在git版本库的，干脆不处理
			if link.startswith('http://'):
				continue
			tarr = getTimestampArr(link)
			oldT = tarr[1]
			newT = getLastModifyVer(inputDir + link)

			if u[3] == '?#iefix' or u[3] == '#glyphicons-halflingsregular':
				cacheKey = link + u[3]
			else: 
				cacheKey = link

			if newT != oldT and (not replaceCache.has_key(cacheKey)):
				newUrl = tarr[0] + '?' + newT
				content = content.replace(link + u[3], newUrl + u[3].replace('?', ''))
				replaceCache[cacheKey] = 1
			else:
				continue
		out.seek(0)
		out.write(content)
		out.close()
