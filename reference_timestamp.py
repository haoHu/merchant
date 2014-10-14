# encoding: utf-8
#auto update the timestamp of reference css and javascript files
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

#jsp文件的目录存放路径，该脚本放在项目根目录
inputDir = './distrib/proto/'
srcPath = re.compile('\.\/asset\/((.+?)\.(css|ico|js))', re.I)
cssPath = re.compile('href\=[\'\"]?((.+?)\.(css|ico))[\'\"]?', re.I)
jsPath = re.compile('src\=[\'\"]?((.+?)\.(js))[\'\"]?', re.I)
#从url读取时间戳
def getTimestampArr(url):
	i = url.find('?')
	if i != -1:
		m = url.split('?')
		return m
	else:
		return [url, 0]
#根据文件路径，获取文件MD5
def getLastModifyVer(url):
	if not os.path.exists(url):
		print("cannot find file:" + url)
		ret = ''
	else :
		ret = 't=' + CalcMD5(url)
	return ret
files = os.listdir(inputDir)
jspFiles = []
#find all jsp files
for f in files:
	f = f.lower()
	if (f.endswith('.jsp')):
		jspFiles.append(f)
#read all css and js file reference and compare the timestamp
for f in jspFiles:
	out = open(inputDir + f, 'r+')
	content = out.read()
	cssMatch = cssPath.findall(content)
	if cssMatch:
		cssReplaceCache = {}
		for u in cssMatch:
			link = u[1] + '.' + u[2]
			#如果引用文件链接是绝对路径，则可能是不在版本库中的，不需要处理
			if link.startswith('http://'):
				continue
			tarr = getTimestampArr(link)
			oldT = tarr[1]
			l1 = srcPath.findall(link)[0][0]
			print "reference css file :" + link
			# print l1
			newT = getLastModifyVer(inputDir + '../' + l1)
			cacheKey = link
			# print newT
			# print oldT
			if newT != oldT and (not cssReplaceCache.has_key(cacheKey)):
				newUrl = tarr[0] + '?' + newT
				content = content.replace(link, newUrl)
				cssReplaceCache[cacheKey] = 1
			else:
				continue
		out.seek(0)
		out.write(content)
		out.close()
for f in jspFiles:
	out = open(inputDir + f, 'r+')
	content = out.read()
	jsMatch = jsPath.findall(content)
	if jsMatch:
		jsReplaceCache = {}
		for u in jsMatch:
			link = u[1] + '.' + u[2]
			if link.startswith('http://'):
				continue
			tarr = getTimestampArr(link)
			oldT = tarr[1]
			l1 = srcPath.findall(link)[0][0]
			print "reference js file :" + link
			newT = getLastModifyVer(inputDir + '../' + l1)
			cacheKey = link
			if newT != oldT and (not jsReplaceCache.has_key(cacheKey)):
				newUrl = tarr[0] + '?' + newT
				content = content.replace(link, newUrl)
				jsReplaceCache[cacheKey] = 1
		out.seek(0)
		out.write(content)
		out.close()
