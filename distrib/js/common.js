/** 
 * -------------------------------------------------
 * Copyright (c) 2014, All rights reserved. 
 * Hualala-Merchant-Management
 * 
 * @version : 0.1.0
 * @author : HuHao
 * @description : Hualala Merchant Management System.  
 * -------------------------------------------------
 */ 

//
//  ____  _                           _
// / ___|| |_ __ _ _ __   ___  ___   (_)___  (*)
// \___ \| __/ _` | '_ \ / _ \/ __|  | / __|
//  ___) | || (_| | |_) |  __/\__ \_ | \__ \
// |____/ \__\__,_| .__/ \___||___(_)/ |___/
//              |_|              |__/
//
// (*) the Javascript MVC microframework that does just enough
//
// (c) Hay Kranen < hay@bykr.org >
// Released under the terms of the MIT license
// < http://en.wikipedia.org/wiki/MIT_License >
//
// Stapes.js : http://hay.github.com/stapes
;(function() {
    'use strict';

    var VERSION = "0.8.1";

    // Global counter for all events in all modules (including mixed in objects)
    var guid = 1;

    // Makes _.create() faster
    if (!Object.create) {
        var CachedFunction = function(){};
    }

    // So we can use slice.call for arguments later on
    var slice = Array.prototype.slice;

    // Private attributes and helper functions, stored in an object so they
    // are overwritable by plugins
    var _ = {
        // Properties
        attributes : {},

        eventHandlers : {
            "-1" : {} // '-1' is used for the global event handling
        },

        guid : -1,

        // Methods
        addEvent : function(event) {
            // If we don't have any handlers for this type of event, add a new
            // array we can use to push new handlers
            if (!_.eventHandlers[event.guid][event.type]) {
                _.eventHandlers[event.guid][event.type] = [];
            }

            // Push an event object
            _.eventHandlers[event.guid][event.type].push({
                "guid" : event.guid,
                "handler" : event.handler,
                "scope" : event.scope,
                "type" : event.type
            });
        },

        addEventHandler : function(argTypeOrMap, argHandlerOrScope, argScope) {
            var eventMap = {},
                scope;

            if (typeof argTypeOrMap === "string") {
                scope = argScope || false;
                eventMap[ argTypeOrMap ] = argHandlerOrScope;
            } else {
                scope = argHandlerOrScope || false;
                eventMap = argTypeOrMap;
            }

            for (var eventString in eventMap) {
                var handler = eventMap[eventString];
                var events = eventString.split(" ");

                for (var i = 0, l = events.length; i < l; i++) {
                    var eventType = events[i];
                    _.addEvent.call(this, {
                        "guid" : this._guid || this._.guid,
                        "handler" : handler,
                        "scope" : scope,
                        "type" : eventType
                    });
                }
            }
        },

        addGuid : function(object, forceGuid) {
            if (object._guid && !forceGuid) return;

            object._guid = guid++;

            _.attributes[object._guid] = {};
            _.eventHandlers[object._guid] = {};
        },

        // This is a really small utility function to save typing and produce
        // better optimized code
        attr : function(guid) {
            return _.attributes[guid];
        },

        clone : function(obj) {
            var type = _.typeOf(obj);

            if (type === 'object') {
                return _.extend({}, obj);
            }

            if (type === 'array') {
                return obj.slice(0);
            }
        },

        create : function(proto) {
            if (Object.create) {
                return Object.create(proto);
            } else {
                CachedFunction.prototype = proto;
                return new CachedFunction();
            }
        },

        createSubclass : function(props, includeEvents) {
            props = props || {};
            includeEvents = includeEvents || false;

            var superclass = props.superclass.prototype;

            // Objects always have a constructor, so we need to be sure this is
            // a property instead of something from the prototype
            var realConstructor = props.hasOwnProperty('constructor') ? props.constructor : function(){};

            function constructor() {
                // Be kind to people forgetting new
                if (!(this instanceof constructor)) {
                    throw new Error("Please use 'new' when initializing Stapes classes");
                }

                // If this class has events add a GUID as well
                if (this.on) {
                    _.addGuid( this, true );
                }

                realConstructor.apply(this, arguments);
            }

            if (includeEvents) {
                _.extend(superclass, Events);
            }

            constructor.prototype = _.create(superclass);
            constructor.prototype.constructor = constructor;

            _.extend(constructor, {
                extend : function() {
                    return _.extendThis.apply(this, arguments);
                },

                // We can't call this 'super' because that's a reserved keyword
                // and fails in IE8
                'parent' : superclass,

                proto : function() {
                    return _.extendThis.apply(this.prototype, arguments);
                },

                subclass : function(obj) {
                    obj = obj || {};
                    obj.superclass = this;
                    return _.createSubclass(obj);
                }
            });

            // Copy all props given in the definition to the prototype
            for (var key in props) {
                if (key !== 'constructor' && key !== 'superclass') {
                    constructor.prototype[key] = props[key];
                }
            }

            return constructor;
        },

        emitEvents : function(type, data, explicitType, explicitGuid) {
            explicitType = explicitType || false;
            explicitGuid = explicitGuid || this._guid;

            // #30: make a local copy of handlers to prevent problems with
            // unbinding the event while unwinding the loop
            var handlers = slice.call(_.eventHandlers[explicitGuid][type]);

            for (var i = 0, l = handlers.length; i < l; i++) {
                // Clone the event to prevent issue #19
                var event = _.extend({}, handlers[i]);
                var scope = (event.scope) ? event.scope : this;

                if (explicitType) {
                    event.type = explicitType;
                }

                event.scope = scope;
                event.handler.call(event.scope, data, event);
            }
        },

        // Extend an object with more objects
        extend : function() {
            var args = slice.call(arguments);
            var object = args.shift();

            for (var i = 0, l = args.length; i < l; i++) {
                var props = args[i];
                for (var key in props) {
                    object[key] = props[key];
                }
            }

            return object;
        },

        // The same as extend, but uses the this value as the scope
        extendThis : function() {
            var args = slice.call(arguments);
            args.unshift(this);
            return _.extend.apply(this, args);
        },

        // from http://stackoverflow.com/a/2117523/152809
        makeUuid : function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        },

        removeAttribute : function(keys, silent) {
            silent = silent || false;

            // Split the key, maybe we want to remove more than one item
            var attributes = _.trim(keys).split(" ")
                ,mutateData = {}
                ;

            // Actually delete the item
            for (var i = 0, l = attributes.length; i < l; i++) {
                var key = _.trim(attributes[i]);

                if (key) {
                    // Store data for mutate event
                    mutateData.key = key;
                    mutateData.oldValue = _.attr(this._guid)[key];

                    delete _.attr(this._guid)[key];

                    // If 'silent' is set, do not throw any events
                    if (!silent) {
                        this.emit('change', key);
                        this.emit('change:' + key);
                        this.emit('mutate', mutateData);
                        this.emit('mutate:' + key, mutateData);
                        this.emit('remove', key);
                        this.emit('remove:' + key);
                    }

                    // clean up
                    delete mutateData.oldValue;
                }
            }
        },

        removeEventHandler : function(type, handler) {
            var handlers = _.eventHandlers[this._guid];

            if (type && handler) {
                // Remove a specific handler
                handlers = handlers[type];
                if (!handlers) return;

                for (var i = 0, l = handlers.length, h; i < l; i++) {
                    h = handlers[i].handler;
                    if (h && h === handler) {
                        handlers.splice(i--, 1);
                        l--;
                    }
                }
            } else if (type) {
                // Remove all handlers for a specific type
                delete handlers[type];
            } else {
                // Remove all handlers for this module
                _.eventHandlers[this._guid] = {};
            }
        },

        setAttribute : function(key, value, silent) {
            silent = silent || false;

            // We need to do this before we actually add the item :)
            var itemExists = this.has(key);
            var oldValue = _.attr(this._guid)[key];

            // Is the value different than the oldValue? If not, ignore this call
            if (value === oldValue) {
                return;
            }

            // Actually add the item to the attributes
            _.attr(this._guid)[key] = value;

            // If 'silent' flag is set, do not throw any events
            if (silent) {
                return;
            }

            // Throw a generic event
            this.emit('change', key);

            // And a namespaced event as well, NOTE that we pass value instead of
            // key here!
            this.emit('change:' + key, value);

            // Throw namespaced and non-namespaced 'mutate' events as well with
            // the old value data as well and some extra metadata such as the key
            var mutateData = {
                "key" : key,
                "newValue" : value,
                "oldValue" : oldValue || null
            };

            this.emit('mutate', mutateData);
            this.emit('mutate:' + key, mutateData);

            // Also throw a specific event for this type of set
            var specificEvent = itemExists ? 'update' : 'create';

            this.emit(specificEvent, key);

            // And a namespaced event as well, NOTE that we pass value instead of key
            this.emit(specificEvent + ':' + key, value);
        },

        trim : function(str) {
            return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        },

        typeOf : function(val) {
            if (val === null || typeof val === "undefined") {
                // This is a special exception for IE, in other browsers the
                // method below works all the time
                return String(val);
            } else {
                return Object.prototype.toString.call(val).replace(/\[object |\]/g, '').toLowerCase();
            }
        },

        updateAttribute : function(key, fn, silent) {
            var item = this.get(key);

            // In previous versions of Stapes we didn't have the check for object,
            // but still this worked. In 0.7.0 it suddenly doesn't work anymore and
            // we need the check. Why? I have no clue.
            var type = _.typeOf(item);

            if (type === 'object' || type === 'array') {
                item = _.clone(item);
            }

            var newValue = fn.call(this, item, key);
            _.setAttribute.call(this, key, newValue, silent || false);
        }
    };

    // Can be mixed in later using Stapes.mixinEvents(object);
    var Events = {
        emit : function(types, data) {
            data = (typeof data === "undefined") ? null : data;

            var splittedTypes = types.split(" ");

            for (var i = 0, l = splittedTypes.length; i < l; i++) {
                var type = splittedTypes[i];

                // First 'all' type events: is there an 'all' handler in the
                // global stack?
                if (_.eventHandlers[-1].all) {
                    _.emitEvents.call(this, "all", data, type, -1);
                }

                // Catch all events for this type?
                if (_.eventHandlers[-1][type]) {
                    _.emitEvents.call(this, type, data, type, -1);
                }

                if (typeof this._guid === 'number') {
                    // 'all' event for this specific module?
                    if (_.eventHandlers[this._guid].all) {
                        _.emitEvents.call(this, "all", data, type);
                    }

                    // Finally, normal events :)
                    if (_.eventHandlers[this._guid][type]) {
                        _.emitEvents.call(this, type, data);
                    }
                }
            }
        },

        off : function() {
            _.removeEventHandler.apply(this, arguments);
        },

        on : function() {
            _.addEventHandler.apply(this, arguments);
        }
    };

    _.Module = function() {

    };

    _.Module.prototype = {
        each : function(fn, ctx) {
            var attr = _.attr(this._guid);
            for (var key in attr) {
                var value = attr[key];
                fn.call(ctx || this, value, key);
            }
        },

        extend : function() {
            return _.extendThis.apply(this, arguments);
        },

        filter : function(fn) {
            var filtered = [];
            var attributes = _.attr(this._guid);

            for (var key in attributes) {
                if ( fn.call(this, attributes[key], key)) {
                    filtered.push( attributes[key] );
                }
            }

            return filtered;
        },

        get : function(input) {
            if (typeof input === "string") {
                // If there is more than one argument, give back an object,
                // like Underscore's pick()
                if (arguments.length > 1) {
                    var results = {};

                    for (var i = 0, l = arguments.length; i < l; i++) {
                        var key = arguments[i];
                        results[key] = this.get(key);
                    }

                    return results;
                } else {
                    return this.has(input) ? _.attr(this._guid)[input] : null;
                }
            } else if (typeof input === "function") {
                var items = this.filter(input);
                return (items.length) ? items[0] : null;
            }
        },

        getAll : function() {
            return _.clone( _.attr(this._guid) );
        },

        getAllAsArray : function() {
            var arr = [];
            var attributes = _.attr(this._guid);

            for (var key in attributes) {
                var value = attributes[key];

                if (_.typeOf(value) === "object" && !value.id) {
                    value.id = key;
                }

                arr.push(value);
            }

            return arr;
        },

        has : function(key) {
            return (typeof _.attr(this._guid)[key] !== "undefined");
        },

        map : function(fn, ctx) {
            var mapped = [];
            this.each(function(value, key) {
                mapped.push( fn.call(ctx || this, value, key) );
            }, ctx || this);
            return mapped;
        },

        // Akin to set(), but makes a unique id
        push : function(input, silent) {
            if (_.typeOf(input) === "array") {
                for (var i = 0, l = input.length; i < l; i++) {
                    _.setAttribute.call(this, _.makeUuid(), input[i], silent || false);
                }
            } else {
                _.setAttribute.call(this, _.makeUuid(), input, silent || false);
            }

            return this;
        },

        remove : function(input, silent) {
            if (typeof input === 'undefined') {
                // With no arguments, remove deletes all attributes
                _.attributes[this._guid] = {};
                this.emit('change remove');
            } else if (typeof input === "function") {
                this.each(function(item, key) {
                    if (input(item)) {
                        _.removeAttribute.call(this, key, silent);
                    }
                });
            } else {
                // nb: checking for exists happens in removeAttribute
                _.removeAttribute.call(this, input, silent || false);
            }

            return this;
        },

        set : function(objOrKey, valueOrSilent, silent) {
            if (typeof objOrKey === "object") {
                for (var key in objOrKey) {
                    _.setAttribute.call(this, key, objOrKey[key], valueOrSilent || false);
                }
            } else {
                _.setAttribute.call(this, objOrKey, valueOrSilent, silent || false);
            }

            return this;
        },

        size : function() {
            var size = 0;
            var attr = _.attr(this._guid);

            for (var key in attr) {
                size++;
            }

            return size;
        },

        update : function(keyOrFn, fn, silent) {
            if (typeof keyOrFn === "string") {
                _.updateAttribute.call(this, keyOrFn, fn, silent || false);
            } else if (typeof keyOrFn === "function") {
                this.each(function(value, key) {
                    _.updateAttribute.call(this, key, keyOrFn);
                });
            }

            return this;
        }
    };

    var Stapes = {
        "_" : _, // private helper functions and properties

        "extend" : function() {
            return _.extendThis.apply(_.Module.prototype, arguments);
        },

        "mixinEvents" : function(obj) {
            obj = obj || {};

            _.addGuid(obj);

            return _.extend(obj, Events);
        },

        "on" : function() {
            _.addEventHandler.apply(this, arguments);
        },

        "subclass" : function(obj, classOnly) {
            classOnly = classOnly || false;
            obj = obj || {};
            obj.superclass = classOnly ? function(){} : _.Module;
            return _.createSubclass(obj, !classOnly);
        },

        "version" : VERSION
    };

    // This library can be used as an AMD module, a Node.js module, or an
    // old fashioned global
    if (typeof exports !== "undefined") {
        // Server
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = Stapes;
        }
        exports.Stapes = Stapes;
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(function() {
            return Stapes;
        });
    } else {
        // Global scope
        window.Stapes = Stapes;
    }
})();
;/* 
 * Shortcut list: 
$X = IX.get;
$XA = IX.cvtToArray;
$XD = IX.Dom;
$XE = IX.err;
$XF = IX.getPropertyAsFunction;
$XH = IX.HtmlDocument;
$XP = IX.getProperty;
 *
*/

/**
 *  IX is a basic library which provider following functions: {
 *  	isEmpty(param) : return if param is undefined, null or empty string.
 *  	isObject(parma) : return if param is an instance of object.
 *  	isString(param) : return if param is an instance of string. Empty string will not be taken as String.
 *  	isFn(param): return if param is an instance of string.
 *  	isBoolean(param): return if param is an Boolean.
 *  	isArray(param) : return if param is an instance of Array.
 *		getClass(param) : return param's type with toLowerCase
 *  
 *  	hasProperty(object, propertyName)
 *  	setProperty(object, propertyName, defaultValue)
 *  	getProperty(object, propertyName, defaultValue): 
 *  			if object has a property named as propertyName, return its value no matter if it is null or empty;
 *  			otherwise return the defaultValue; 
 *  	getPropertyAsFunction
 *		clone(object): create a duplicate object and return it. 
 *				The new object is totally different with object although the value is same.
 *
 *		ns(namespaceName): check if namespaceName is existed in current page window. 
 *				If not, create it to keep. 
 *		nsExisted(namespaceName) : return if namespaceName is existed in current page wilndow.
 *		getNS(namespaceName): check if namespaceName is existed in current page window,
 *				If yes, return the object identified by namespaceName. Otherwise, return false.
 *
 *		iterate(arrayObject, fn): iterate to call fn for every elements in arrayObject by sequence.
 *				fn is a function to accept such object and index of object in arrayObject. 
 *				it can be defined as function(item, indexOfItemInArray)
 *		fnIterate(arrayObject, fnName): similar with iterate function, but no need to provide function.

 *				fnName should be a string to identified a function for each element in array.
 *		loop(arrayObject, accumulator, iterateFunction): iterate to do accumulation for every elements in arrayObject by sequence.
 *				iterateFunction can be defined as function(oldAccumulator, item, indexOfItemInArray), its task is
 *					deal with the item and the oldAccumulator and return the newAccumulator to help loop function to 
 *					get the result of accumulation.
 * 		partLoop(arrayObject, startIndex, endIndex, accumulator, iterateFunction):  basically, it is same as loop function.
 * 				But it will not deal with all elements by the elements from startIndex to endIndex(not include endIndex).
 * 					If the startIndex or endIndex is over-ranged, it just uses the proper index. 
 *      loopDsc(arrayObject, accumulator, iterateFunction): basically, it is same as loop function. 
 *      		But it will deal with element from the last one to the first one.
 *      each(object, accumulator, iterateFunction) : it will deal with all properties for object and return the accumulated result.
 *      		 iterateFunction can be defined as function(oldAccumulator, propertyValue, propertyName, indexOfPropertyInObject), 
 *      			its task is	deal with the property and the oldAccumulator and return the newAccumulator to help each function to 
 *					get the result of accumulation.
 *		
 *		extend(dst, src): copy all properties from src to dst no matter if the property has existed in dst. 
 *				After copying, return new dst. src will not be changed but dst should be changed.
 *		inherit(src, ...): create a new object, copy all properties from each src by sequence.
 *				After copying, return new object. Each src will not be changed.
 *
 *		isMSIE: the value to indicate if current browser is MicroSoft IE.
 *		isMSIE7: the value to indicate if current browser is MicroSoft IE 7.0.
 *		isSafari: the value to indicate if current browser is Safari.
 *		getUrlParam(key, defaultValue) : try to return the value of parameter identified by key in current URL. 
 *				If current URL has not included the key, return the default value.
 *		listen(type, target, eventName,  handerFunction): try to attach/detach an event handler on specified target.
 *				type: "attach" or "detach"
 *				target: should be a DOM object.
 *				eventName:  for example "click", "mousemove",...
 *				handlerFunction : an event handler.
 *
 *		toAnchor(anchorName): let current focus jump to specified anchor named as anchorName.
 *
 *		emptyFn: just a function shell but do nothing.
 *		execute(functionName, arguments): find the object which namespace is functionName. 
 *				If it is function, call it using the given arguments which is array.
 *		tryFn(functionObject): try to execute the given functionObject. If the given object is not function, do nothing.
 *
 *		get(domEl): try to get a DOM element by domEl which can be element or id of element.	
 *  }
 */
window.IX = (function(){
	var currentVersion="1.0";
	
	var isEmptyFn = function(str){
		return (str===undefined||str===null||str==="");		
	};
	var BaseTypes = {
		"object": Object,
		"function": Function,
		"string":String,
		"boolean":Boolean,
		"number": Number
	};
	var isTypeFn = function(type){
		var fn =function(obj){
			return (!isEmptyFn(obj) && (typeof(obj)==type || obj instanceof BaseTypes[type]));
		};
		return fn; 
	};

	var typeUtils = {
		isEmpty : isEmptyFn,
		isBoolean : isTypeFn("boolean"),
		isObject : isTypeFn("object"),
		isString : isTypeFn("string"),
		isNumber : isTypeFn("number"),
		isFn : isTypeFn("function"),
		isArray : function(ob) {return (!!ob && ob instanceof Array);},
		isElement: function(el){return el.nodeType===1;},
		getClass : function (ob) { return Object.prototype.toString.call(ob).match(/^\[object\s(.*)\]$/)[1].toLowerCase();}
	};
	
	var loopFn = function(varr,sIdx,eIdx, acc0, fun, isAscLoop) {
		if (varr==null ||varr.length==0){
			return acc0;
		}
		var len=varr.length;
		eIdx = (eIdx==-1)?len: eIdx;
		if (sIdx>=eIdx){
			return acc0;
		}
		var acc = acc0, min = Math.max(0, sIdx), max = Math.min(len, eIdx);
		var xlen = len -1;
		for (var i=0; i<=xlen; i+=1) {
			var idx = isAscLoop?i:(xlen-i);
			//try{
			if (idx>=min && idx <max && (idx in varr)){
				acc = fun(acc, varr[idx], idx);
			}
			//}catch(e){
				//alert(e);
			//}
		}
		return acc;
	};
	var iterateFn = function(arr, fun){
		if (isEmptyFn(arr))
			return;
		var len = arr.length;
		for (var i=0; i<len; i+=1)			
			fun(arr[i], i);
	};
	var loopUtils = {
		iterate: iterateFn,
		fnIterate :function(arr, fname){
			iterateFn(arr, function(item){
				if ((fname in item) && typeUtils.isFn(item[fname]))
					item[fname]();
			});
		},
		loop:function(varr, acc0, fun) {
			return loopFn(varr, 0, -1, acc0, fun, true);
		},
		loopbreak: function(varr, fun) {
			try{
				loopFn(varr, 0, -1, 0, fun, true);
			}catch(_ex){
				//log(_ex);
			}
		},
		partLoop:function(varr,sIdx,eIdx, acc0, fun) {
			return loopFn(varr,sIdx,eIdx, acc0, fun, true);
		},
		loopDsc:function(varr, acc0, fun) {
			return loopFn(varr,0, -1, acc0, fun, false);
		},
		map : function(arr, fun){
			return loopFn(arr, 0, -1, [], function(acc, item, idx){
				acc.push(fun(item,idx));
				return acc;
			}, true);
		},
		each:function(obj, acc0, fun){
			var acc = acc0, p="", idx = 0;
			for (p in obj){
				acc = fun(acc, obj[p], p, idx);
				idx+=1;
			}
			return acc;
		}
	};

	var arrUtils = {
		cvtToArray : function (iterable) {
			if (!iterable)
				return [];
			if (iterable.toArray)
				return iterable.toArray();
	
			var results = [];
			var len = iterable.length;
			for (var i = 0; i < len; i++)
				results.push(iterable[i]);
		    return results;
		}
	};
	
	/**
	 * Creates a deep copy of an object.
	 * Attention: there is no support for recursive references.
	 * @param {Object} object The object to be cloned.
	 * @returns {Object} The object clone.
	 * @example
	 * var obj =  {
	 *         name : 'John',
	 *         cars : {
	 *                 Mercedes : { color : 'blue' },
	 *                 Porsche : { color : 'red' }
	 *         }
	 * };
	 * var clone = IX.clone( obj );
	 * clone.name = 'Paul';
	 * clone.cars.Porsche.color = 'silver';
	 * alert( obj.name );	// John
	 * alert( clone.name );	// Paul
	 * alert( obj.cars.Porsche.color );	// red
	 * alert( clone.cars.Porsche.color );	// silver
	 */
	var cloneFn =function(obj) {
		var clone;

		// Array.
		if (typeUtils.isArray(obj)) {
			clone = [];
			for (var i = 0; i < obj.length; i++)
				clone[i] = cloneFn(obj[i]);
			return clone;
		}

		// "Static" types.
		if (obj === null || (typeof(obj) != 'object') || (obj instanceof String) || (obj instanceof Number)
				|| (obj instanceof Boolean) || (obj instanceof Date) || (obj instanceof RegExp)) {
			return obj;
		}

		// Objects.
		clone = new obj.constructor();
		for (var propertyName in obj) {
			var property = obj[propertyName];
			clone[propertyName] = cloneFn(property);
		}
		return clone;
	};

	/*
		deepCompare
	*/
    var deepCompare = function (y, x) {
        if (x == null || y == null || x == undefined || y == undefined) return x == y;
        for (p in y) {
            if (!(p in x) || typeof (x[p]) == 'undefined')
                return false;
            if (y[p]) {
                if (typeof (x[p]) != typeof (y[p])) return false;
                switch (typeof (y[p])) {
                    case 'object':
                        if (!deepCompare(y[p], x[p]))
                            return false;
                        break;
                    case 'function':
                        if (typeof (x[p]) == 'undefined' || y[p].toString() != x[p].toString())
                            return false;
                        break;
                    default:
                        if (y[p] != x[p])
                            return false;
                }
            }
            else if (x[p])
                return false;
        }
        for (p in x) {
            if (!(p in y) || typeof (y[p]) == 'undefined')
                return false;
        }
        return true;
    };
	var propertyUtils = {
		hasProperty : function(obj, pName){
			if (!obj)
				return false;
			try{
				if(pName in obj) return true;
			}catch(ex){}
			var names = pName.split(".");
			var pObj = obj;
			var len = names.length;
			for (var i=0; i<len; i++) {
				try{
					if (pObj && (names[i] in pObj)) 
						pObj = pObj[names[i]];
					 else 
						return false;
				}catch(_ex){
					return false;
				}
			}
			return true;
		},
		getProperty : function(obj, pName, defV) {
			var v = (defV!=undefined) ? defV : null;
			if (obj==null)
				return v;
			try{
				if(pName in obj) return obj[pName];
			}catch(ex){}
			var names = pName.split(".");
			var pObj = obj;
			var len = names.length;
			for (var i=0; i<len; i++) {
				try{
					if (pObj && (names[i] in pObj)) {
						pObj = pObj[names[i]];
					} else {
						return v;
					}
				}catch(_ex){
					return v;
				}
			}
			return pObj;
		},
		setProperty : function(obj, pName, v){
			try{
				if(pName in obj) {
					obj[pName] = v;
					return;
				}
			}catch(ex){}
			var names = pName.split(".");
			var pObj = obj, _name = names.pop();
			var len = names.length;
			for (var i=0; i<len; i++) {
				var _sname = names[i];
				try{
					if (!(_sname in pObj) || !pObj[_sname] || typeof pObj[_sname] !="object" )
						pObj[_sname] = {};
				} catch(e){
					pObj[_sname] = {};
				}
				pObj = pObj[_sname];
			}
			pObj[_name] = v;
		},
		getPropertyAsFunction:function(obj, fName){
			var fn = IX.getProperty(obj, fName);
			return IX.isFn(fn)?fn : IX.emptyFn;
		},
		clone :cloneFn,
		deepCompare: deepCompare
	};

	var nsLoopFn = function(nsname, fn){
		var names = nsname.split(".");
		if (names[0]=="window")
			names.shift();
		var nsObj = window, flag = true, i=0, len = names.length; 
		while(i<len && flag){
			var curname = names[i];
			flag = fn(curname, nsObj);
			if(flag)
				nsObj = nsObj[curname];
			i++;
		}
		return flag;
	};
	var namespaceUtils = {
		ns : function(nsname){
			nsLoopFn(nsname, function(name, obj){
				if (!(name in obj))
					obj[name] = {};
				return true;
			});
		},
		nsExisted : function(nsname){
			return nsLoopFn(nsname, function(name, obj){
				return obj && (name in obj);
			});
		},
		setNS : function(nsname, obj){
			var names = nsname.split(".");
			if (names[0]=="window")
				names.shift();
			if (names.length==0 || IX.isEmpty(names[0]))
				return;
			var nsObj = window, len = names.length;
			for (var i=0; i<len-1; i++){
				var curname = names[i];
				if (!(curname in nsObj))
					nsObj[curname] = {};
				nsObj = nsObj[curname];
			}
			nsObj[names[len-1]] = obj;
		},
		getNS :function(objName) {
			return nsLoopFn(objName, function(name, obj){
				return (name in obj)?obj[name]:false;
			});
		}
	};

	var extendFn = function(dst, src) {
		if (dst==null || dst==undefined)
			dst = {};
		for (var _p in src)
			dst[_p] = src[_p];
		return dst;
	};
	var extendUtils = {
		// obj = IX.extend(dst, src);
		// obj will has all members in both dst and src, 
		// in same time, dst will has all members in src. 
		extend: extendFn,
		// obj = IX.inherit(src1, src2, src3,...);
		// obj will has all members in all src*, 
		// and all src* will not be changed. 
		inherit : function(){
			return loopUtils.loop(arrUtils.cvtToArray(arguments), {}, function(acc, item){
				return extendFn(acc, item);
			});
		}
	};

	var getTimeInMS = function() {return (new Date()).getTime();};
	var ua = navigator.userAgent.toLowerCase();
	var checkUA = function(keywords){
		return ua.indexOf(keywords)!=-1;
	};
	var hasEventListener = ("addEventListener" in window) ;
	var _handlerWrapper = function(handler) {
		var fn = function(evt){
			var e = evt || window.event;
			if (!("target" in e))
				e.target = e.srcElement; // for IE hack
			return handler(e);
		};
		return fn;
	};
	var _bindHandlers = function(el, handlers, isBind, isOnce){
		if(!el) return;
				
		isBind&&(el._EVENTNAMES||(el._EVENTNAMES={}));
		IX.iterate(["click", "dblclick", "focus", "blur", "keyup", "keydown", "mouseover", "mouseout", "resize", "scroll" ,"mousedown", "mousemove", "mouseup","touchstart", "touchend", "touchmove"], function(eventName){
			if (eventName in handlers){								
				if(isBind){
					if(isOnce&&el._EVENTNAMES[eventName])
						return;			
					el._EVENTNAMES[eventName] = true;
				}

				IX[isBind?"attachEvent":"detachEvent"](el, eventName, _handlerWrapper(handlers[eventName]));
			}			
		});
	};
	var browserUtils = {
		isMSIE7:(document.all && checkUA("msie 7.0")),
		isSafari:(window.openDatabase && checkUA("safari")),
		
		isMSIE: checkUA("msie") && !checkUA("opera"),    //匹配IE浏览器

		isOpera : checkUA("opera"),   //匹配Opera浏览器
		isChrome: checkUA("chrome"),   //匹配Chrome浏览器
		isFirefox: checkUA("firefox") && !checkUA("webkit"),   //匹配Firefox浏览器
		// isYunfisClient: checkUA("Yunfis") || !checkUA("yunfis"),   //匹配yunfis客户端
		
		isMSWin : checkUA("windows"),
		
		getTimeInMS : getTimeInMS,
		
		getComputedStyle : (document.defaultView && "getComputedStyle" in document.defaultView) ? function(el){
			return document.defaultView.getComputedStyle(el);  
		}:function(el){		
			return el.currentStyle || el.style; 
		},
		
		getUrlParam :function (key, defV){
			var paramList = window.location.search.substring(1).split("&");
			var len = paramList.length;
			for(var i=0; i<len; i+=1){
				var _p = paramList[i]; 
				if(_p.indexOf(key+"=")==0)
					return _p.substring(key.length+1);
			}
			return defV;
		},
		/** low performance. should not use it */
		listen : function(type, target, eName, fn){
			var _p = hasEventListener ?  {
				fname : type=="detach"?"removeEventListener":"addEventListener",
				etype  :eName
			} :{
				fname : type+ "Event",
				etype : "on" + eName
			};
			target[_p.fname](_p.etype, fn, false);
		},
		attachEvent : hasEventListener?function(target, eName, fn){
				target.addEventListener(eName, fn, false);
			}:function(target, eName, fn){
				target.attachEvent("on" + eName, fn);
			},
		detachEvent : hasEventListener?function(target, eName, fn){
				target.removeEventListener(eName, fn, false);
			}:function(target, eName, fn){
				target.detachEvent("on" + eName, fn);
			},
		bind : function(el, handlers) {_bindHandlers(el, handlers, true);},		
		//unbind : function(el, handlers) {_bindHandlers(el, handlers, false);}, //TODO: invalid	
		//Attach a handler to an event for the element. The handler is executed at most once per element.
		bindOnce: function(el, handlers){			
			_bindHandlers(el, handlers, true,true);
		},
		on : function(target, eName, fn) {
			target["on" + eName] = fn;
		}
	};
	
	var locationUtils = {				
		toAnchor : function(name){
			window.location.hash = "#" + name;
		}		
	};
	
	var emptyFn=function(){/**Empty Fn*/};
	var selfFn = function(o){return o;};
	/**
	 *  _config :{
	 *     maxAge : timeInMSec, default no limit;
	 *     expire:
	 *  } 
	 */
	var checkReadyFn = function(condFn, execFn, period, _config){		
		var _period = Math.max(20, period || 100);
		var maxAge = $XP(_config, "maxAge", null), expireFn = $XF(_config, "expire"), startTick = null;
		if (isNaN(maxAge))
			maxAge = null;		
		function _checkFn(){			
			if (condFn())
				execFn();
			else if (maxAge!=null && (getTimeInMS()-startTick)>maxAge)
				expireFn();
			else
				setTimeout(_checkFn, _period);
		}
		if (maxAge!=null)
			startTick = getTimeInMS();
		_checkFn();
	};
	var executeUtils = {
		emptyFn : emptyFn,
		selfFn: selfFn,
		safeExec : function(fn){
			//try {
				fn();
			//}catch(e){
			//	alert(IX.Test.listProp(e));
			//}
		},
		execute : function(fname, args) {
			var fn = namespaceUtils.getNS(fname);
			if (typeUtils.isFn(fn)){
				fn.apply(null, args);
			}
		},
		checkReady : checkReadyFn, 
		tryFn : function(fn){
			return (typeUtils.isFn(fn))? fn() : emptyFn();
		}
	};
	
	var domUtils = {
		decodeTXT : function(txt){
			return (txt+"").replaceAll("&nbsp;", ' ').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
		},
		encodeTXT : function(txt){
			return (txt+"").replaceAll('&', '&amp;').replaceAll("<","&lt;").replaceAll(">", "&gt;").replaceAll(" ", "&nbsp;");
		},
		createDiv : function(id,clz){
//			log ("createDiv :" + id + " " + clz);
			var node = document.createElement('div');
			if (!IX.isEmpty(clz))
				node.className = clz;
			node.id = id;
			document.body.appendChild(node);
			return node;
		},
		get : function(domEl){
			if (IX.isEmpty(domEl))
				return null;
			if (typeUtils.isString(domEl) || typeUtils.isNumber(domEl) )
				return document.getElementById(domEl);
			if ("ownerDocument" in domEl)
				return domEl;
			return null;	
		}
	};
	var errUtils = {
		err : function(errMsg) {
			alert(errMsg);
		}
	};
	var mathUtils = {
		inRange : function(x, x1, x2){return (x-x1)*(x-x2)<=0;}	
	};
	
	var _idx = 0;
	var idUtils = {
		id : function(){
			_idx ++;
			return "ix"+_idx;
		}	
	};

	var ifRectIntersect = function (_rect1, _rect2) {
        return Math.abs(_rect1.maxx + _rect1.minx - _rect2.minx - _rect2.maxx) <= _rect2.maxx - _rect2.minx + _rect1.maxx - _rect1.minx
            && Math.abs(_rect1.maxy + _rect1.miny - _rect2.miny - _rect2.maxy) <= _rect2.maxy - _rect2.miny + _rect1.maxy - _rect1.miny;
    };
	
	return extendUtils.inherit(typeUtils, arrUtils, propertyUtils, namespaceUtils, loopUtils, 
			extendUtils, browserUtils, locationUtils, executeUtils,domUtils,errUtils, mathUtils, idUtils, {
		version: currentVersion,
		ifRectIntersect: ifRectIntersect
	});
})();
$X = IX.get;
/**
 * $XA is an shortcut to IX.cvtToArray.	
 * @param {} iterable : an object which can be iterated.
 * @return : Array object
 */
$XA = IX.cvtToArray;
$XE = IX.err;
/**
 * $XP is an shortcut for IX.getProperty. For example:
 * 		var myId = $XP(config, "id", 123)
 * 		it means assign config.id to myId, if config has no property named as "id", assign 123 to myId. 
 *  
 */
$XP = IX.getProperty;
/**
 * $XF is an shortcut for IX.getPropertyAsFunction. For example:
 * 		var closeFn = $XF(config, "close")
 * 		it means assign config.close to closeFn, if config has no property named as "close", assign IX.emptyFn to closeFn. 
 *  
 */
$XF = IX.getPropertyAsFunction;

IX.Test =(function(){
	var detectAttrsFn = function(obj, checkFn, injectorFn) { // injectorFn: function(result, name, value)
		var count = 0;
		return  IX.each(obj, "", function(acc, item, nc){
			try{
				if (checkFn(item,nc)){
					count += 1;
					return injectorFn(acc,  nc, item) + (count%5==4?"\r\n":"");
				}
			}catch(e){alert(e);}
			return acc;
		});
	};
	var listFn = function(obj, matchorFn, type){
		if (type!="fun" && IX.isString(obj)){
			return "String:" + obj.toString();
		}
		var isListFn = type=="fun"; 
		return (isListFn?"Funcs:":"Props:") + detectAttrsFn(obj, function(o){
				return (((!isListFn && !IX.isFn(o)) || (isListFn && IX.isFn(o))));
			}, function(r, n, v) {
				return [r, n, isListFn?"": [':"', (""+v).trunc(60), '" '].join(""), ", "].join("");
			}
		);
	};
	return {
		listProp:function(obj, matchor) {
			return listFn(obj, matchor, "");
		},
		listFun:function(obj, matchor) {
			return listFn(obj, matchor, "fun");
		}
	};
})();

window.log = ("IXDEBUG" in window)? function(s){
	if (console)
		console.log(s);
} : IX.emptyFn;

// Debug 当IXDEBUG为true时，可以进入Debug模式
IX.Debug = (function () {
	return {
		info : function (s) {
			if ("IXDEBUG" in window && window.IXDEBUG === true && console) {
				console.log(s);
			}
		}
	};
})();

//////////////////////////////////////////////////// TEST-Utils finished////////

/**
 *  IX.Array is a supplement for Array.prototype. It includes: {
 *  	init(length, defaultValue): create a new Array that each element is set to defaultValue.
 *  	isFound(element, arrayObject, equalFn): return if element is in current arrayObject by equalFn.
 *  			For equalFn, should be defined as function(a,b) and return boolean value; 
 *  			if the caller don't provide the function and a has equal operator, use a.equal to compare.
 *  			otherwise, using default operator "==".
 *  	toSet(arrayObject, equalFn): return unduplicated array of arrayObject by equalFn.
 *  	isSame(arrayObject1, arrayObject2, equalFn): return if arrayObject1 is same set as arrayObject2 no matter thr order of array elements.
 *  	compact(arrayObject, validFn):return an array object which remove all not valid elements from arrayObject by validFn. 	 
 *  	remove(arrayObject, element, equalFn): return new array object which removed matched elements from arrayObject.
 *  	pushx(arrayObject, item): return arrayObject which add item as last element.
 *  	indexOf(arrayObject, matchFn): return the index of first matched element. If no matched, return -1;
 *  	splice(arrayObject, startIndex, deleteCount, insertArrayObject): 
 *  			delete "deleteCount" elements from startIndex in arrayObject and insert insertArrayObject into startIndex of arrayObject
 *  			after all, return the new array object.   
 *  }
 * 
 */
IX.Array = (function(){
	var getEqualFn = function(equalFn){
		return IX.isFn(equalFn)?equalFn:function(a, b) {
			return (IX.isObject(a) &&("equal" in a) &&  IX.isFn(a.equal))?a.equal(b):(a==b);
		};
	};
	
	var isFoundFn = function(elem, arr, equalFn){
		if (arr==null ||arr.length==0)
			return false;
		for (var i=arr.length-1; i>=0; i--) {
			if (equalFn(elem, arr[i]))
				return true;
		}
		return false;
	};
	/** merge arr1 and and arr2 into new arr:
	 * 	arr1: [1,3,5,7,9, 19,21,22], arr2: [2,3,4, 18,19,20]
	 * merge[arr1,arr2] = [2,1,  3,  4,18, 5,7,9,  19, 21,22, 20] 
	 *  3 and 19 are key points:  
	 */ 
	var _merge = function(arr1, arr2, equalFn){
		var _arr1 = arr1 ||[], _arr2 = arr2 ||[];
		var i=0, j=0, k=0, arr = [];
		var len1= _arr1.length, len2 = _arr2.length;
		for(i=0; i<len2; i++){
			for (j=0; j<len1; j++){
				if (equalFn(_arr2[i], _arr1[j])) {
					for (k=0; k<i; k++)
						arr.push(_arr2.shift());
					_arr2.shift();
					for (k=0; k<=j; k++)
						arr.push(_arr1.shift());
					return arr.concat(_merge(_arr1, _arr2, equalFn));
				}
			}
		}
		return arr.concat(_arr1, _arr2);
	};
	
	var _self = null;
	_self = {
		init : function(len, defV){
			var arr = [];
			for (var i=0; i<len; i++)
				arr[i] = IX.clone(defV);
			return arr;
		},
		isFound : function(elem, arr, equalFn){
			return isFoundFn(elem, arr, getEqualFn(equalFn));
		},
		toSet : function(arr, equalFn) {
			var fn = getEqualFn(equalFn);
			return IX.loop(arr, [], function(acc, item){
				if (!_self.isFound(item, acc, fn))
					acc.push(item);
				return acc;
			});
		},
		sort : function(arr, cmpFn){
			var arr1 = IX.map(arr, function(item){return item;});
			return arr1.sort(cmpFn);
		},
		isSameSet:function(_arr1, _arr2, equalFn){
			var arr1 = _self.toSet(_arr1), arr2 = _self.toSet(_arr2);
			if (arr1==null && arr2==null)
				return true;
			if (arr1==null || arr2==null || arr1.length!=arr2.length)
				return false;
			if (arr1.length==0 && arr2.length==0)
				return true;
			
			var fn = getEqualFn(equalFn);
			for (var i=arr1.length-1; i>=0; i--){
				if (!isFoundFn(arr1[i], arr2, fn))
					return false;
			}
			return true;
		},
		compact: function(arr, validFn) {
			var fn = IX.isFn(validFn)?validFn:function(item){return item;};
			return IX.loop(arr, [], function(acc, item) {
				if (fn(item))
					acc.push(item);
				return acc;
			});
		},
		remove:function(arr, elem, equalFn){
			var fn = getEqualFn(equalFn);
			return IX.loop(arr, [], function(acc, item){
				if (!fn(elem, item))
					acc.push(item);
				return acc;
			});
		},
		pushx:function(arr, item){
			arr.push(item);
			return arr;
		},
		
		flat : function(arr) {
			return IX.isArray(arr)?IX.loop(arr, [], function(acc, item){
				return acc.concat(_self.flat(item));
			}) : [arr];
		},
		indexOf :function(arr, matchFn) {
			if(!arr || arr.length==0)
				return -1;
			var len = arr.length;
			for (var i=0; i<len; i++) {
				if (matchFn(arr[i]))
					return i;
			}
			return -1;
		},

		// exmaples:
		// arr= ["a", "b", "c", "d"]
		// (arr, 4) : return []
		// (arr, 3):  remove 1 elem: arr[3]; return ["a", "b", "c"];
		// (arr, 3, 4) : return []
		// (arr, 1, 2) : remove 2 elems: arr[1], arr[2]; return ["a", "d"];
		// (arr, 1, 2, ["g", "k", "l"]) : remove 2 elems: arr[1], arr[2] and add 3 elems; 
		//              return ["a", "g", "k", "l", "d"];
		// (arr, 1, 0, ["g", "k", "l"]) : remove 0 elems and add 3 elems; 
		//              return ["a", "g", "k", "l", "b", "c", "d"];
		splice:function(arr, start, deleteCount, insertArray) {
			var count = isNaN(deleteCount)?1:deleteCount;
			var len = arr.length;
			if (start<0 || start>len || count<0 || (start+count)>len){
				return [];
			}
			var iArr = insertArray?insertArray:[];
			return [].concat(arr.slice(0, start), iArr, arr.slice(start+count));
		},
		
		/** merge arr1 and and arr2 into new arr:
		 * 	arr1: [1,3,5,7,9, 19,21,22], arr2: [2,3,4, 18,19,20]
		 * merge[arr1,arr2] = [2,  1,3,  4,18, 5,7,9,19, 21,22, 20] 
		 *  3 and 19 are key points:  
		 */ 
		merge : function(arr1, arr2, equalFn){
			return _merge(arr1, arr2, getEqualFn(equalFn));
		}
	};
	return _self;
})();

IX.IState = (function(){
	return {
		toggle :function(origStat, newStat){
			return (newStat==undefined)?!origStat : newStat;
		}
	};
})();

IX.IManager = function(){
	var _ht = {};
	return {
		isRegistered : function(name){
			return (name in _ht) && (_ht[name]);
		},
		register: function(name, obj) {
			_ht[name] = obj;
		},
		unregister : function(name){
			_ht[name] = null;
		},
		get: function(name){
			return (name in _ht)?_ht[name]: null;
		},
		clear : function() {
			_ht = {};
		},
		destroy : function() {
			delete _ht;
		}
	};
};

IX.IList = function(){
	var _keyList = [];
	var IXArray =  IX.Array;
	var indexOfFn = function(key) {
		return key ? IXArray.indexOf(_keyList, function(item) {
			return item == key;
		}) : -1;
	};
	var removeFn = function(idx) {
		if (idx >= 0 && idx<_keyList.length)
			_keyList = _keyList.slice(0, idx).concat(_keyList.slice(idx+1));
	};
	var appendFn = function(key){
		if (!_keyList || _keyList.length == 0)
			_keyList = [key];
		else {
			var idx = indexOfFn(key);
			removeFn(idx);
			_keyList.push(key);
		}
	};
	return {
		isEmpty :function(){return _keyList.length==0;},
		isLast : function(k){return _keyList.length>0 && k==_keyList[_keyList.length-1];},
		getList : function(){return _keyList;},
		getSize: function(){return _keyList.length;},
		indexOf : indexOfFn,
		remove : removeFn,
		tryRemove : function(key){
			removeFn(indexOfFn(key));
		},
		append : appendFn,
		tryAdd :function(key){
			if (!_keyList || _keyList.length == 0)
				_keyList = [key];
			else if (indexOfFn(key) <0)
				_keyList.push(key);
		},
		insertBefore : function(key, dstKey) {
			// find the dstKey, if not exist, append current key to the end of list.
			var dstIdx = indexOfFn(dstKey);
			if (dstIdx == -1) {
				appendFn(key);
				return;
			}
			// find the key, if current key is before dstKey, do nothing.
			var idx = indexOfFn(key);
			if (idx != -1 && dstIdx - idx == 1)
				return;
			// else remove the existed record and insert it before dstKey.
			if (idx >= 0) {
				removeFn(idx);
				dstIdx = indexOfFn(dstKey);
			}
			_keyList = _keyList.slice(0, dstIdx).concat([key], _keyList.slice(idx));
		},
		clear : function(){
			_keyList = [];
		},
		destroy : function(){
			delete _keyList;
		}
	};
};
IX.I1ToNManager = function(eqFn) {
	var _eqFn = IX.isFn(eqFn)?eqFn : function(item, value){return item==value;};
	
	var _mgr = new IX.IManager();
	
	var hasEntryFn = function(key) {
		var list = _mgr.get(key);
		return list && list.length>0;		
	};
	var indexOfFn = function(arr, value) {
		return IX.Array.indexOf(arr, function(item){return _eqFn(item, value);});
	};
	
	return IX.inherit(_mgr, {
		hasValue :hasEntryFn,
		put : function(k, v) {
			if (!hasEntryFn(k)) {
				_mgr.register(k, [v]);
				return;
			}
			var list = _mgr.get(k);
			if (indexOfFn(list, v)==-1)
				_mgr.register(k, list.concat(v));
		},
		remove : function(k, v){
			var list = _mgr.get(k);
			var idx = indexOfFn(list, v);
			if (idx >= 0)
				_mgr.register(k, IX.Array.splice(list, idx));	
		}	
	});
};
IX.IListManager = function() {
	var _super = new IX.IManager();
	var _list = new IX.IList();
	
	var registerFn = function(key, obj) {		
		_super.register(key, obj);
		var idx = _list.indexOf(key);
		if (obj) {
			if (idx == -1)
				_list.append(key);
		} else 
			_list.remove(idx);
	};
	var listFn = function(keys) {
		return IX.map(keys, function(item) {return _super.get(item);});
	};
	return IX.inherit(_super, {
		// register should not change the sequence of key.
		register : registerFn,
		unregister : function(key){registerFn(key);},
		isEmpty :function(){return _list.isEmpty();},
		getSize : function(){return _list.getSize();},
		hasKey : _super.isRegistered,
		isLastKey : function(key){return _list.isLast(key);},
		getKeys : function() {return _list.getList();},
		getByKeys : function(keys){return listFn(keys);},
		getAll : function() {return listFn(_list.getList());},
		iterate: function(fn){IX.iterate(_list.getList(), function(item){fn(_super.get(item));}); },
		getFirst : function() {
			var arr = _list.getList();
			if (!arr || arr.length == 0)
				return null;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				var inst = _super.get(arr[i]);
				if (inst) 
					return inst;
			}
			return null;
		},
		// only for key. append will remove existed record in keyList and append it to the end
		append : _list.append,
		insertBefore : _list.insertBefore,
		remove : function(key) {registerFn(key);},
		
		clear : function(){
			_super.clear();
			_list.clear();
		},
				
		destroy : function() {
			_super.destroy();
			delete _super;
			_list.destroy();
			delete _list;
		}
	});
};

/**
 * data : {
 * 		type : "array"/"json", [option; default :"json"]
 * 		// for array:
 * 		fields :["name1", "name2", ...],
 * 		items:[ [value1, value2, ...], ...]
 * 		// for json:
 * 		items : [{name1: value1, name2: value2},...]
 *  }
 *  return: [{name1: value1, name2: value2},...]
 */
IX.DataStore = function(data){
	var _items = $XP(data, "items", []);
	if (_items.length>0 && $XP(data, "type", "json")!="json"){
		var _fields = $XP(data, "fields", []);
		_items =  IX.map(_items, function(row){
			return IX.loop(_fields, {}, function(acc, col, idx){
				acc[col] = IX.isArray(row)?row[idx]:row[col];
				return acc;
			});
		});
	}
	
	return IX.map(_items, function(item){
		var id = $XP(item, "id");
		if (IX.isEmpty(id))
			item.id = IX.id();
		return item;
	});
};

IX.Date = (function(){
	var _isUTC = false;
	var fields4Day = ["FullYear", "Month", "Date"], fields4Time = ["Hours", "Minutes", "Seconds"];
	var ds = "-", ts = ":";
	
	var _formatStr = function(str, sp) {
		if (IX.isEmpty(str))
			return "";
		str = str.split(sp, 3);
		return IX.map(sp==ds?[4,2,2]:[2,2,2], function(item, idx){
			var nstr = (str.length>idx?str[idx]:"");
			return ("0".multi(item) + nstr).substr(nstr.length, item);
		}).join(sp);
	}; 
	
	var _format = function(date, fields, sp){
		var getPrefix = "get" + (_isUTC?"UTC":"");
		var str = IX.map(fields, function(item){
			return date[getPrefix + item]()*1 + (item=="Month"?1:0);
		}).join(sp);
		return _formatStr(str, sp);
	};
	
	var format = function(date, type) {
		if (type=="Date")
			return _format(date, fields4Day, ds);
		if (type=="Time")
			return _format(date, fields4Time, ts);
		return _format(date, fields4Day, ds) + " " + _format(date,fields4Time, ts);
	};

	var checkData =function(acc, item, idx){
		return acc || isNaN(item) || item.indexOf(".")>=0 || (idx==0 && item.length!=4) || (idx>0 && item.length>2);
	};
	var checkTime =function(acc, item, idx){
		return acc || isNaN(item) || item.indexOf(".")>=0 || item.length>2;
	};
	var isValid = function(str, type){
		var isDate = type == "Date";
		var sps  = str.split(isDate?ds :ts, 3);
		if (sps.length!=3 || IX.loop(sps, false, isDate?checkData:checkTime))
			return false;
		if (isDate){
			var m = sps[1]*1;
			var d = sps[2]*1;
			return !(m<=0 || m>12 || d<=0 || d>31);
		}
		var h = sps[0]*1;
		var m = sps[1]*1;
		var s = sps[2]*1;
		return  !(h<0||h>23 || m<0||m>59 || s<0|| s>59);
	};
	
	return {
		setDS : function(v){ds = v;},
		setTS : function(v){ts = v;},
		setUTC : function(isUTC){
			_isUTC= isUTC;
		}, 
		getDS : function(){return ds;},
		getTS : function(){return ts;},
		isUTC :function(){
			return _isUTC;
		},
		// return YYYY/MM/DD hh:mm:ss 
		format:format,
		// return YYYY/MM/DD
		formatDate:function(date) {
			return format(date, "Date");
		},
		// return hh:mm:ss
		formatTime:function(date) {
			return format(date, "Time");
		},
		
		// return YYYY/MM/DD hh:mm:ss 
		formatStr:function(str) {
			str = (str + " ").split(" ");
			return _formatStr(str[0], ds) + " " + _formatStr(str[1], ts);
		},
		// return YYYY/MM/DD
		formatDateStr:function(str){
			return _formatStr(str, ds);
		},
		// return hh:mm:ss
		formatTimeStr:function(str){
			return _formatStr(str, ts);
		},
		
		getDateText : function(olderTSInSec, tsInSec) {
			var interval = tsInSec -olderTSInSec ;
			if (interval<10)
				return "刚才";
			if (interval<60)
				return Math.round(interval) + "秒钟前";
			interval /= 60;	
			if (interval<60)
				return Math.round(interval) + "分钟前";
			interval /= 60;
			if (interval<24)
				return Math.round(interval) + "小时前";
			interval /= 24;	
			if (interval<7)
				return Math.round(interval) + "天前";			
			interval /= 7;	
			if (interval<4.33)
				return Math.round(interval) + "周前";
			interval /= 4.33;
			if (interval<12)
				return Math.round(interval) + "个月前";
			return Math.round(interval/12) + "年前";		
		},
		
		// accept YYYY/MM/DD hh:mm:ss return true/false;
		isValid : function(dateStr, type) {
			var dt = dateStr.split(" ");
			if (type=="Date" ||type=="Time")
				return dt.length==1 && isValid(dt[0], type);
			
			return dt.length==2 && isValid(dt[0], "Date") && isValid(dt[1], "Time");
		},
		/*
			para: 
				_date: date string, e.g. 2010-01-01 9:20:30 or 2010/01/01 9:20:30
				_format: format string, e.g. "yyyy-MM-dd HH:mm:ss"
			return 
				string
		*/
		getDateByFormat: function (_dateStr, _formatType) {
            try {
            	if(_dateStr == null || _dateStr === "") return "";
                var _dateObj = typeof _dateStr == "number" ? new Date(_dateStr) : typeof _dateStr == "string" ? new Date((_dateStr+"").replace(/-/g, "/")) : _dateStr, dateFormat = _formatType || "yyyy-MM-dd HH:mm:ss";

                dateFormat = dateFormat.replace("yyyy", _dateObj.getFullYear());
                var _month = _dateObj.getMonth() + 1,
					_day = _dateObj.getDate(),
					_hour = _dateObj.getHours(),
					_minute = _dateObj.getMinutes(),
					_second = _dateObj.getSeconds();
                dateFormat = dateFormat.replace("MM", _month > 9 ? _month : ("0" + _month));
                dateFormat = dateFormat.replace("dd", _day > 9 ? _day : ("0" + _day));
                dateFormat = dateFormat.replace("HH", _hour > 9 ? _hour : ("0" + _hour));
                dateFormat = dateFormat.replace("mm", _minute > 9 ? _minute : ("0" + _minute));
                dateFormat = dateFormat.replace("ss", _second > 9 ? _second : ("0" + _second));

                return dateFormat;
            } catch (ex) {
                return _dateStr;
            }
        },
        getTimeTickInSec : function (_dateStr) {
        	var _str = IX.Date.getDateByFormat(_dateStr, 'yyyy/MM/dd HH:mm:ss');
        	return parseInt((new Date(_str)).getTime() / 1000);
        }
	};
})();
/**
 *	IX.Net is a library for networking. It includes: {
 *		loadFile(url, responseHandler): active AJAX requirement and let responseHandler deal with response(Text).
 *		loadCss(cssUrl): load CSS and  apply to current document.
 *		loadJsFiles(jsFileUrlArray, postHandler): load all js files in array, and execute postHandler after all jsFiles are loaded.
 *		tryFn(fnName, argsArray,  dependency): try to execute function fnName with parameters argsArray.
 *				If the function is not existed, resolve the dependency and try it again.
 *				dependency:{
 *					beforeFn: function before applying dependency.
 *					cssFiles: all required CSS files for current function call.
 *					jsFiles: all required JS files for current function call.
 *					afterFn: function after executing current function call.
 *					delay: the milliseconds for waiting after js files are loaded.
 *				}
 *	}
 */
IX.Net = (function(){
	var head= document.getElementsByTagName('head')[0];
	var getRequestFn = function(){
		if ("XMLHttpRequest" in window) {
			return new XMLHttpRequest();
		}
		if ("ActiveXObject" in window){
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		return null;
	};
	var loadFn = function(durl, cbFun){
		var request = getRequestFn();
		if(!request){
			$XE("unsupport AJAX. Failed");return;
		}
		request.onreadystatechange  = function(){
			if (request.readyState == 4){
				if (request.status == 200){
					if (IX.isFn(cbFun)){cbFun(request.responseText);}
				} else { 
					$XE("There was an error: (" + request.status + ") " + request.statusText);
				}
			}
		};
		request.open("GET", durl, true);
		request.send("");
	};
	var loadJsFn = function(durl, nextFn){
		var script= document.createElement('script');
		script.type= 'text/javascript';
		script.src= durl;
		if (IX.isFn(nextFn)){
			if (script.readyState){ // IE
				script.onreadystatechange= function () {
					log("STATE: [" +durl +"]:" +  this.readyState);
					if (script.readyState == 'complete' || script.readyState=='loaded') {
						script.onreadystatechange = null;
						nextFn();
					}
				};
			} else {
				script.onload= nextFn;
			}
		}
		head.appendChild(script);
	};
	var loadJsFilesInSeqFn = function(jsFiles, nextFn){
		var _nextFn = IX.isFn(nextFn)?nextFn:IX.emptyFn;
		if (!jsFiles || jsFiles.length==0)
			return _nextFn();
		var n = jsFiles.length;
		var idx =0;
		var fn = function(){
			loadJsFn(jsFiles[idx], function(){
				idx +=1;
				return (idx<n)?fn():_nextFn();
			});
		};
		fn();
	};
	var loadCssFn = function(cssFile){
		var cssNode = document.createElement('link');
		cssNode.type = 'text/css';
		cssNode.rel = 'stylesheet';
		cssNode.href = cssFile;
		cssNode.media = 'screen';
		head.appendChild(cssNode);
	};
	return {
		loadFile:loadFn,
		loadCss:loadCssFn,
		loadJsFiles:function(jsFiles, nextFun, mode){
			//if (!mode || mode=="seq" ){
				loadJsFilesInSeqFn(jsFiles, nextFun);
			//}
		},
		tryFn:function(fnName, argList,dependencyConfig){
			var fn = function(){				
				IX.execute(fnName, argList);
				IX.tryFn(dependencyConfig.afterFn);
			};
			if (!IX.nsExisted(fnName)){
				if (!dependencyConfig){
					return;
				}
				var config = dependencyConfig;
				IX.tryFn(config.beforeFn);
				IX.iterate(config.cssFiles, loadCssFn);
				var delay = config.delay || 100;
				loadJsFilesInSeqFn(config.jsFiles, function(){
					setTimeout(fn,delay);
				});
			} else
				fn();
		}
	};
})();

IX.win = (function(){
	var fnHT = {}, eventFnHT = {}, handlersHT = IX.I1ToNManager();
	var keySn = 0;
	var genKey = function(){return "f_" + (keySn++);};
	
	var hasEventListener = ("addEventListener" in window) ;
	var attachEvent = hasEventListener?function(target, eName, fn){
		target.addEventListener(eName, fn, false);
	}:function(target, eName, fn){
		target.attachEvent("on" + eName, fn);
	};
	var detachEvent = hasEventListener?function(target, eName, fn){
		target.removeEventListener(eName, fn, false);
	}:function(target, eName, fn){
		target.detachEvent("on" + eName, fn);
	};
	
	var executeEvent = function(eName, e){
		IX.iterate(handlersHT.get(eName), function(fKey){
			//try{
			if (IX.isFn(fnHT[fKey]))
				fnHT[fKey](e);
			//}catch(ex){
			//	console.log(ex);
			//}
		});
	};
	
	var _register = function(eName, fn){
		var _key = genKey();

	 	if(!fn._key){
	 		fn._key = _key;
			fnHT[_key] = fn;
			handlersHT.put(eName, _key);		
		}

		if (eName in eventFnHT)
			return _key;
		eventFnHT[eName] = function(evt){
			var e = evt || window.event;
			if (!("target" in e))
				e.target = e.srcElement; // for IE hack
			return executeEvent(eName, e);
		};
		attachEvent(window, eName, eventFnHT[eName]);
		return _key;
	};
	var _unregister = function(eName, fnKey){
		fnHT[fnKey] = null;
		handlersHT.remove(eName, fnKey);
		if (handlersHT.hasValue(eName))
			return;
		detachEvent(window, eName, eventFnHT[eName]);
		eventFnHT[eName] = null;
	};
	
	var _bindHandlers = function(handlers, isBind){
		var bindFn = isBind?_register: _unregister;
		var ids = IX.loop(["click", "resize", "scroll" ,"mousedown", "mouseover", "mouseout"], {}, function(acc, eventName){
			if (eventName in handlers)
				acc[eventName] = bindFn(eventName, handlers[eventName]);
			return acc;
		});
		if (isBind)
			return ids;
	};
	return {
		/**
		 * handlers :{
		 * 		click : fun
		 * 		resize : fun
		 * }
		 * return {
		 * 		click : handlerId1,
		 * 		resize : handlerId2
		 * }
		 */
		bind : function(handlers){return _bindHandlers(handlers, true);},
		/**
		 * handlerIds {
		 * 		click : handlerId1,
		 * 		resize : handlerId2
		 * }
		 */
		unbind : function(handlerIds){_bindHandlers(handlerIds, false);},
		scrollTo : function(x,y){
			window.scrollTo(x, y);
			executeEvent("scroll", null);
		}
	};
})();

$Xw = IX.win;

(function() {	
function defaultParamFn(_name, _params){return _params;}
function defaulRspFn(data, cbFn){IX.isFn(cbFn) && cbFn(data);}
function getFunProp(_cfg, _name, defFn){
	var _fn = $XP(_cfg, _name);
	return IX.isFn(_fn)?_fn :defFn;
}

function ajaxRouteFn(callerRouteDef){
	return {
		channel : $XP(callerRouteDef, "channel", callerRouteDef.name),
		type : $XP(callerRouteDef, "type", "POST"),
		dataType : $XP(callerRouteDef, "dataType", "form"),
		onsuccess : getFunProp(callerRouteDef, "onsuccess", defaulRspFn),
		preAjax : getFunProp(callerRouteDef, "preAjax", defaultParamFn),
		postAjax : $XF(callerRouteDef, "postAjax"),
		onfail : getFunProp(callerRouteDef, "onfail", defaulRspFn)
	};
}
function urlRouteFn(routeDef, ifAjax){
	var _url = $XP(routeDef, "url");
	if (IX.isEmpty(_url))
		return null;
	var route = ifAjax ? ajaxRouteFn(routeDef) : {};
	route.url = _url;
	route.urlType = $XP(routeDef, "urlType", "base") + "Url";	
	return route;	
}
function createRouteHT(routes, ifAjax){
	return IX.loop(routes, {}, function(acc, routeDef){
		var _name = $XP(routeDef, "name");
		if (IX.isEmpty(_name))
			return acc;
		var route = urlRouteFn(routeDef, ifAjax);
		if (route)
			acc [_name] = route;
		return acc;
	});
}

function UrlRouter(routes, urlFac){
	var _routeHT = createRouteHT(routes);
	var r = function(_name, params){
		return urlFac.genUrl(_routeHT[_name], params);
	};
	return r;
}

function tryLockChannel(channel){
	var id = "ajaxChannel_" + channel;
	if ($X(id))
		return false;
	IX.createDiv(id, "ajax-channel");
	//console.log ("lock channel: " + channel);
	return true;
}
function unlockChannel(channel){
	var el = $X("ajaxChannel_" + channel);
	if (el)
		el.parentNode.removeChild(el);
	//console.log ("unlock channel: " + channel);
}
function AjaxCaller(routes, _ajaxFn, urlFac, chkRes){
	var _callerHT = createRouteHT(routes, true);
	var c = function(_name, params, cbFn, failFn){
		var _caller = _callerHT[_name];
		if (!_caller)
			return;

		var channel = params && params._channel_ ? params._channel_ : _caller.channel;
		if (!$XP(params, '_t')) {
			params = IX.inherit(params, {_t : ''});
		}

		if (!tryLockChannel(channel)){
			_caller.onfail({
				code : 0,
				err : "channel in using:"+ channel
			}, failFn, params);			
			return;
		}
		var _cbFn = IX.isFn(cbFn) ? cbFn : IX.emptyFn;
		var _contentType =  _caller.dataType == 'json' ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8';
		var _data = _caller.preAjax(_name, params);
		_data = _caller.dataType == 'json' ? JSON.stringify(_data) : _data;
		_ajaxFn({
			url : urlFac.genUrl(_caller, params),
			type :  _caller.type,
			contentType : _contentType,
			data : _data,
			success : function(data) {
				unlockChannel(channel);
				// if (IX.isFn(chkRes) && !chkRes(data)) return ;
				IX.isFn(chkRes) && chkRes(data);
				_caller.onsuccess(data, _cbFn, params);
			},
			fail: function(data){
				unlockChannel(channel);
				_caller.onfail(data, failFn, params);
			},
			error: function(data){
				unlockChannel(channel);
				_caller.onfail(data, failFn, params);
			}
		});
		_caller.postAjax(_name, params, _cbFn);
	};
	return c;
}

function UrlFactory(){
	var _urls = {};
	var genUrl = function(_route, params){
		if (!_route)
			return "";
		var url = _route.url;
		var _url = IX.isFn(url)?url(params):url.replaceByParams(params);
		var _urlBase = (_route.urlType in _urls)?_urls[_route.urlType] : _urls.baseUrl;
		return _urlBase + _url;
	};
	return {
		init : function(cfg){_urls = IX.inherit(_urls, cfg);},
		genUrl : genUrl
	};
}

function UrlEngine(ifAjax){  
	var _ajaxFn = null, _urlFac = new UrlFactory();
	
	var init = function(cfg){
		if (ifAjax && IX.isFn(cfg.ajaxFn))
			_ajaxFn = cfg.ajaxFn;
		_urlFac.init(cfg);		
	};
	return IX.inherit({
		/** cfg : {
		 * 		ajaxFn :function(ajaxParams)
		 * 		baseUrl : "https://...",
		 * 		[name]Url : "https: //...."
		 * }
		 */
		init : init, // function(cfg)
		reset : init,	
		/** routes : [{ 
		 * 		name : "page.entry",
		 * 		url : "/session" / function(params){return "/abc";},
		 * 		urlType : "urlName", //default "base"
		 * 	}]	
		 *  return : function(name, params){}
		 */
		createRouter : function(routes){
			return new UrlRouter(routes, _urlFac);
		}	
	}, ifAjax?{
		/** routes : [{ 
		 * 		name : "signIn",
		 * 		url : "/session" / function(params){return "/abc";},
		 * 		urlType : "urlName", //default "base"
		 * 
		 * 		channel : "named-channel", //default common
		 * 		type : "POST"/"GET"/"DELETE" , //default "POST"
		 * 		preAjax : function(name, params){return params;}, // default null;
		 * 		postAjax : function(name, params, cbFn){}, //default null;
		 * 		onsuccess : function(data,cbFn, params), 
		 * 		onfail : function(data, failFn, params) // default null;
		 * 	}]	
		 * return : function(name, params, cbFn, failFn){}
		 */
		createCaller: function(routes, chkRes){
			return new AjaxCaller(routes, function(ajaxParam){
				if (IX.isFn(_ajaxFn)) _ajaxFn(ajaxParam);
			}, _urlFac, chkRes);
		}
	} : {});
}
 
IX.urlEngine = new UrlEngine();
IX.ajaxEngine = new UrlEngine(true);
})();
/**
 * 	IX.Xml is a library to deal with XML string or document. It includes: {
 * 		parser(xmlString): it convert xmlString to XML document object and return.
 * 		getXmlString(xmlDocument) : it convert XML document to string and return.
 *  	duplicate(xmlDocument) : it duplicate xml document object and return.
 * 	}
 */
IX.Xml = (function(){return {
	parser:function(str){
		str = IX.isString(str)?str:"";
		var doc = null;
		if ("DOMParser" in window) {
			doc = (new DOMParser()).parseFromString(str, "text/xml");
		}else if ("ActiveXObject" in window){
			doc=new ActiveXObject("Microsoft.XMLDOM");
			doc.async="false";
			doc.loadXML(str);
		} else {
			$XE("this browser can't support XML parser.");
		}
		return doc;
	},
	getXmlString:function(xmlDoc){
		if(!xmlDoc==null){
			return "";
		}
		if(IX.nsExisted("document.implementation.createDocument")) {
			return (new XMLSerializer()).serializeToString(xmlDoc);
		}else if ("ActiveXObject" in window){
			return xmlDoc.xml;
		} else {
			$XE("this browser can't support XML parser.");
		}
		return "";
	},
	duplicate:function(xmlDoc){
		return this.parser(this.getXmlString(xmlDoc));
	}
};})();

/**
 * 	IX.Dom is a library to deal with DOM. It includes :{
 * 		first(node, tagN): try to get the first child of DOM element node which tag name is tagN.
 * 		next(node, tagN): try to get the first next sibling of DOM element node which tag name is tagN.
 * 		cdata(node, tagN): try to get the text of DOM element node which is involved by CDATA tag.
 * 		text (node, tagN): try to get the text of DOM element node.
 * 		attr (node, attN): try to get the value of attribute of DOM element node which name is attrN.
 * 		
 * 		inTag(tagN, content, attrs): 
 * 		inPureTag(tagN, content, attrs): 
 * }
 */
IX.Dom = (function(){
	var loopFn = function(node, type, checkFn, valueFn) {
		if (!node) return valueFn(null);
		var cnode = ("firstChild" in node)?node[type=="first"?"firstChild":"nextSibling"]:null;
		while(cnode!=null && !checkFn(cnode))
			cnode = cnode.nextSibling;
		return valueFn(cnode);
	};
	
	var getFn = function(node, tagN, type){
		return IX.isString(tagN)?loopFn(node, type, function(cnode){
					return cnode.nodeName.toLowerCase()==tagN;
				},function(cnode){
					return cnode;
				}
			):null;
	};
	var textFn = IX.isMSIE?function(node){return node? node.innerText:"";}:function(node){return node?node.textContent:"";};
	
	var cdataFn = function(node){
		if (!node)
			return "";
		return loopFn(node,"first",function(cnode){
				return cnode.nodeType==4;
			},function(cnode){
				return cnode?cnode.nodeValue:"";
			}
		);
	};
	var firstFn = function(node,tagN) {
		return getFn(node,tagN, "first");
	};
		
	var inTagFn = function(tag, content, attrs){//attrs should like [[pramName, paramValue],...
		var _attrs = IX.loop(attrs, [],  function(acc, item){
			return acc.concat(' ', item[0], '="', item[1], '"');
		});
		var arr = [].concat("<", tag, _attrs, ">", content, "</", tag, ">");
		return arr.join("");
	};
	var inPureTagFn = function(tag, content, attrs){
		return inTagFn(tag, ["<![CDATA[", content, "]]>"].join(""),  attrs);
	};
	var attrFn = function(node, attN){
		if(!node)
			return "";
		var val = node.getAttribute(attN);
		return IX.isEmpty(val)?"":val;
	};
	var setAttrFn = function(node, attN, val){
		if(!node)
			return;
		if (val)
			node.setAttribute(attN, val);
		else
			node.removeAttribute(attN);			
	};
	return {
		first:firstFn,
		next:function(node, tagN){
			return getFn(node, tagN,"next");
		},
		cdata:function(node, tagN){
			return cdataFn(firstFn(node, tagN));
		},
		text:function(node, tagN){
			return textFn(firstFn(node, tagN));
		},
		attr:attrFn,
		setAttr:setAttrFn,
		dataAttr :function(node, name){
			return attrFn(node, "data-" + name);
		},
		setDataAttr : function(node, name, val){
			setAttrFn(node, "data-" + name, val);
		},
		remove: function(node){
			if(node)
				if(node.parentNode)
					node.parentNode.removeChild(node);
		},
		isAncestor : function(node, ancestor){
			var el = node;
			while(el){				
				if (el== ancestor)
					return true;
				var nodeName = el.nodeName.toLowerCase();
				el = (nodeName=="body")? null: el.parentNode;
			}
			return false;
		},
		ancestor : function(node, tagName){
			if (!node)
				return null;
			var el =  node;
			while(el){
				var nodeName = el.nodeName.toLowerCase();
				if (nodeName==tagName)
					break;
				el =(nodeName=="body")? null: el.parentNode;
			}
			return el;
		},
		is : function(el, tagName){
			return el.nodeName.toLowerCase() == tagName;
		},
		inTag : inTagFn,
		inPureTag : inPureTagFn
	};
})();
$XD = IX.Dom;
/*
*		getStyle(node, styleName): get node's style. e.g. $XD.getStyle(node, "border-left-width"), $XD.getStyle(node, "font-size")
*/
IX.HtmlDocument = (function(){
	var hasFn = function(el, clzName){
		return el!=null && ("className" in el)&& IX.Array.isFound(clzName, (el.className+"").split(" "));
	};
	var removeFn = function(el, clzName){
		if (!el) return;
		var clz = IX.Array.remove(el.className.split(" "), clzName);
		el.className = clz.join(" ");
	};
	var addFn = function(el, clzName) {
		if (!el) return;
		var clzs = IX.Array.toSet(el.className.split(" ").concat(clzName));
		el.className = clzs.join(" ");
	};
	var nextFn = function(node, clzName){
		if (!node)
			return null;
		var el = node.nextSibling;
		while(el){
			if (hasFn(el, clzName))
				return el;
			el = el.nextSibling;
		}
		return el;
	};

	var getStyle = function(_elem,styles){
        var _value=null, elem= IX.get(_elem);
        styles = styles != "float" ? styles : document.defaultView ? "float" : "styleFloat";
        if(styles == "opacity"){
        	if(elem.filters){//IE, two ways to get opacity because two ways to set opacity and must be set opacity before get
        		if(elem.filters.length > 0){
		            try {
		                _value = elem.filters['DXImageTransform.Microsoft.Alpha'].opacity / 100;
		            }catch(e) {
		                try {
		                    _value = elem.filters('alpha').opacity;
		                } catch(err){}
		            }
	        	}else{
	        		_value = "1";
	        	}
        	}else{//w3c
        		_value = elem.style.opacity;
        	}
        }else{
	        _value=elem.style[styles] || elem.style[styles.camelize()];
	        if(!_value){
	             if (document.defaultView && document.defaultView.getComputedStyle) {
	                var _css=document.defaultView.getComputedStyle(elem, null);
	                _value= _css ? _css.getPropertyValue(styles) : null;
	             }else if (elem.currentStyle){
	                _value = elem.currentStyle[styles.camelize()];
	             }
	        }
	        if(_value=="auto" && IX.Array.indexOf(["width","height"], function(_i){return styles == _i;}) > -1 && elem.style.display!="none"){
	            _value=elem["offset"+styles.capitalize()]+"px";
	        }
        }
        return _value=="auto" ? null :_value;
    };
	return {
		getStyle : getStyle,
		hasClass : hasFn,
		removeClass : removeFn,
		addClass : addFn,
		toggleClass : function(el, clzName){
			if (!el) return;
			if (hasFn(el, clzName))
				removeFn(el, clzName);
			else addFn(el, clzName);
		},
		next :nextFn,
		first : function(parentEl, clzName){
			if (!parentEl)
				return null;
			var el = parentEl.firstChild;
			return hasFn(el, clzName)?el: nextFn(el, clzName);
		},
		isAncestor : function(node, pnode) {
			if (!node)
				return false;
			var el =  node;
			while(el!=null){
				if (el==pnode)
					return true;
				el = el.parentNode;
				if (el && el.nodeName.toLowerCase()=="body")
					break;
			}
			return false;
		},
		ancestor : function(node, clzName){
			if (!node)
				return null;
			var el =  node;
			while(el!=null && !hasFn(el, clzName)){
				el = el.parentNode;
				if (el && el.nodeName.toLowerCase()=="body")
					el = null;
			}
			return el;
		},
		
		getWindowScreen : function(){
			var body = document.documentElement;
			var win = window;
			var _scrollX = "scrollX" in win?win.scrollX:body.scrollLeft,
				_scrollY = "scrollX" in win?win.scrollY:body.scrollTop;
			
			return {
				scroll : [_scrollX, _scrollY, body.scrollWidth, body.scrollHeight],
				size : [body.clientWidth, body.clientHeight]
			};
		},
		getScroll: function(_dom){
            if (_dom && _dom.nodeType != 9){//not document
            	return {
                    scrollTop: _dom.scrollTop,
                    scrollLeft: _dom.scrollLeft
                };
            }
            var _window = !_dom ? window : _dom.defaultView || _dom.parentWindow;
            return { scrollTop: _window.pageYOffset
				    || _window.document.documentElement.scrollTop
				    || _window.document.body.scrollTop
				    || 0,
                scrollLeft: _window.pageXOffset
				    || _window.document.documentElement.scrollLeft
				    || _window.document.body.scrollLeft
				    || 0
            };
		},
		getZIndex : function(el) {
			var style = null, zIndex = null;
			while(el && el.tagName.toLowerCase()!="body"){
				style = IX.getComputedStyle(el);				
				if (style.zIndex !="auto")
					return style.zIndex - 0;
				el = el.offsetParent;
			}
			return 0;
		},
		/* ri : [ left, top, width, height] */
		rect : function(el, ri){
			IX.iterate(["left", "top", "width", "height"], function(attr, idx){
				if (ri[idx]!=null)
					el.style[attr] = ri[idx] + "px";
			});
		},
		getWindowScrollTop : function() {
			return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop	|| 0;
		},
		getPosition : function(el, isFixed){
			// getBoundingClientRect : Supported by firefox,chrome,IE8+,opera,safari
			// Return {top, left, right, bottom[, width, height]}
			// width and height are not supported in IE
			// top|left|right|bottom are offset value for visible part of window.
			var rect = el.getBoundingClientRect(),
				doc = document.documentElement || document.body;
			return [
				rect.left + (isFixed ? 0 : window.scrollX || doc.scrollLeft),
				rect.top + (isFixed ? 0 : window.scrollY || doc.scrollTop),
				el.offsetWidth,
				el.offsetHeight
			];
		}
	};	
})();
$XH = IX.HtmlDocument;

IX.Cookie = (function(){
	var getOptions = function(options){
		if (!options)
			return [];
		var vals = [];
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			vals.push('; expires=' + date.toUTCString()); // use expires attribute, max-age is not supported by IE
		}
		if ("path" in options)vals.push('; path=' + options.path);
		if ("domain" in options)vals.push('; domain=' + options.domain);
		if ("secure" in options)vals.push('; secure=' + options.secure);
		vals.push(';HttpOnly');
		return vals;
	};
	var _set = function(name, value, options){
		var vals = [name, '=', encodeURIComponent(value)].concat(getOptions(options));
		document.cookie = vals.join('');	
	};
	
	return {
		get : function(name){
			if (IX.isEmpty(document.cookie))
				return "";
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookieN = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookieN.substring(0, name.length + 1) == (name + '='))
					return decodeURIComponent(cookieN.substring(name.length + 1));
	        }
	        return "";
		},
		set : _set,
		remove : function(name){
			_set(name, '', {
				expires: -1
			});
		}
	};
})();

/** interval : n milliseconds */
IX.Task = function(taskFn, interval, times){
	var ts = -1;
	var h = null;
	var execFlag = false;
	var _times = 0, _total = isNaN(times)?-1:times;
	var getTimeInMS = IX.getTimeInMS;
	function _fn(){
		if (!execFlag)
			return;
		taskFn(_times);
		_times ++ ;
		if (_total>0 && _times>=_total)
			return;
		var _ts = getTimeInMS();
		h= setTimeout(_fn, ts + 2 * interval - _ts);
		ts = _ts; 
	}
	
	return {
		start : function(){
			ts = getTimeInMS();
			execFlag = true;
			_times = 0;
			h = setTimeout(_fn, interval);
		},
		stop : function(){
			execFlag = false;
			clearTimeout(h);
			h = null;
			ts = -1;	
		}
	};
};
(function(){
/**
 * 
 * @param {} config 
 *  tpl :  the HTML template definition.
 *  tplDataFn : the function to provide data to tpl[tplId]
 *  
 * @return {}
 */
var tplRegex = new RegExp('(?:<tpl.*?>)|(?:<\/tpl>)', 'img');
var rpRegex = /([#\{])([\u4E00-\u9FA5\w\.-]+)[#\}]/g;
var idRegex = /['"]/;

var regSplit = function(str, reg){
	var _splitArr = [], _matchArr = str.match(reg), _len = _matchArr ? _matchArr.length : 0;
	for(var i = 0;i < _len;i++){
		var _arr = _matchArr[i], _idx = str.indexOf(_arr);
		if(_idx == -1)
			continue;
		_splitArr.push(str.substring(0,_idx));
		str = str.substring(_idx + _arr.length);
	}
	_splitArr.push(str);
	return {separate : _splitArr, arr : _matchArr};
};
var parseTpl = function(tplstr){
	var tplMgr = {};
	var newTpl = function(name, html){tplMgr[name] = {name : name,tpl : [html]};};
	var appendTpl = function(name, html){tplMgr[name].tpl.push(html);};
	var reformTpl = function(name){
		var curTpl = tplMgr[name];
		var html =  curTpl.tpl.join("");
		curTpl.tpl = html; 
		curTpl.list =  IX.Array.toSet(html.match(rpRegex)).sort();
	};
	var _openTpl = function(acc, newName, html){
		var newTplName = acc[0] + "." + newName;
		appendTpl(acc[0], "#"+ newName + "#");
		acc.unshift(newTplName);
		newTpl(newTplName, html);
		return acc;	
	};
	var _closeTpl = function(acc, html){
		reformTpl(acc[0]);
		acc.shift();
		appendTpl(acc[0], html);				
		return acc;
	};
	var _regSplit = tplstr.regSplit(tplRegex);
	var tplArr = _regSplit.arr, contentArr = _regSplit.separate;
	newTpl("root", contentArr[0]);
	var nameArr = IX.loop(tplArr, ["root"], function(acc, item, idx) {
		if (item=="</tpl>")
			return _closeTpl(acc, contentArr[idx + 1]);
		var arr = item.split(idRegex);
		return _openTpl(acc, arr[1], contentArr[idx + 1]);
	});
	reformTpl("root");
	
	return (nameArr.length==1 && nameArr[0]=="root")?tplMgr : null;
};

var emptyTpl = {
	render:function(){return "";},
	renderData:function(){return "";},
	destroy : function() {},
	getTpl: function(){return "";}
};
IX.ITemplate = function(config){
	var _tpl = $XP(config, "tpl", []);
	_tpl = [].concat(_tpl).join("");	
	if(IX.isEmpty(_tpl))
		return emptyTpl;	
	var tplMgr = parseTpl(_tpl);
	if (!tplMgr) {
		alert("unformated Tpl: " + _tpl);
		return emptyTpl;
	}
	
	var _dataFn = $XP(config, "tplDataFn");
	if (!IX.isFn(_dataFn))
		_dataFn = function(){return null;};
	
	var getProps = function(data, name){
		if (!IX.hasProperty(data,name))
			return null;
		var v = $XP(data, name);
		return IX.isEmpty(v)?"":v;
	};
	var renderFn = function(tplId, data){
		var tpl = tplMgr[tplId];
		if (!tpl) {
			alert("can't find templete by name: " + tplId);
			return "";
		}
		var html = tpl.tpl;
		var arr = IX.loop(tpl.list, [], function(acc, item){
			var t = item.charAt(0);
			var _name = item.substring(1, item.length-1);
			if (t=='{') {
				var v = getProps(data, _name);
				if (v!=null)
					acc.push([item, v]);			
			} else if (t=='#') {
				var h = IX.map($XP(data, _name, []), function(itm, idx) {
					var idata = IX.inherit(itm, {idx: idx});
					return renderFn(tplId+ "." + _name, idata);
				}).join("");
				acc.push([item, h]);
			}
			
			return acc;
		});
		return html.loopReplace(arr);
	};

	var _render = function(tplId, data){
		var id = "root";		
		if (!IX.isEmpty(tplId)) 
			id = tplId.indexOf("root")==0?tplId : ("root." + tplId);
		
		return renderFn(id, data?data:_dataFn(id)).replace(/\[(\{|\})\]/g, "$1");
	};	
	return IX.inherit({		
		render : function(tplId){return _render(tplId);},
		renderData : function(tplId, data){return _render(tplId, data);},
		destroy : function() {
			tplMgr.destroy();
			tplMgr = null;
		},
		getTpl: function(tplId){
			if(!tplId)
				return _tpl;

			var _get_p_tpl = function(_id){
				var tm = tplMgr["root." + _id];
				if(!tm) return "";
				var ids = _id.split(".");
				var s = tm.tpl, ci;

				if(!tm.list || tm.list.length == 0)
					return _id == tplId ? s : ("<tpl id = '" + ids[ids.length - 1] + "'>" + s + "</tpl>");
				
				for(var i = 0; i < tm.list.length; i ++){
					ci = tm.list[i].replace(/#/g, "");
					s = s.replace(new RegExp("#" + ci + "#", "img"),  _get_p_tpl(_id + "." + ci));
				}
				return s;
			};

			return _get_p_tpl(tplId);
		}
	});
};

/**
 * 	Extends String.prototype for some tool kits. 
 */
var substrByLength = function(str, maxLength){
	var stringArr = [], matchPRC_regx = /[^\u0020-\u007A]/g, strLen = str.length,
		simpleCharLen = (str.match(/[\u0020-\u007A]/g) || []).length,
		subStringByMaxLength = str.substring(0, maxLength);
	if((subStringByMaxLength.match(matchPRC_regx) || []).length){
		var count = 0;
		for(var i = 0;i < maxLength;i++){
			var key = str[i];
			if(key === undefined || count >= maxLength){
				i < maxLength - 1 && i < strLen && stringArr.push("..");
				break;
			}
			count += key.match(matchPRC_regx) ? 2 : 1;
			stringArr.push(key);
		}
	}else
		stringArr.push(subStringByMaxLength);
	return {
		reString : stringArr.join(""),
		reLength : strLen > maxLength ? maxLength : strLen,
		stringLength : (strLen - simpleCharLen) * 2 + simpleCharLen
	};
};
var UrlRegEx = /\w+:\/\/[\w.]+[^\s\"\'\<\>\{\}]*/g;
//var PwdPattern = /^(\w){6,20}$/;
//var EmailPattern = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
//var EmailPattern = /^[a-zA-Z0-9]{1}[\.a-zA-Z0-9_-]*[a-zA-Z0-9]{1}@[a-zA-Z0-9]+[-]{0,1}[a-zA-Z0-9]+[\.]{1}[a-zA-Z]+[\.]{0,1}[a-zA-Z]+$/;
//var EmailPattern = /^[_a-zA-Z0-9.]+@(?:[_a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,4}$/;
var EmailPattern = /^[_a-zA-Z0-9.]+[\-_a-zA-Z0-9.]*@(?:[_a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,4}$/;
var ScriptPattern = new RegExp( '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)', 'img');
var FormPattern = new RegExp( '(?:<form.*?>)|(?:<\/form>)', 'img'); 
var TrimPattern = /(^\s*)|\r/g;
var ReplaceKeyPattern = /{[^{}]*}/g;
IX.extend(String.prototype, {
	camelize: function(){ return this.replace(/\-(\w)/ig, function(B, A) {return A.toUpperCase();}); },
	capitalize: function(){ return this.charAt(0).toUpperCase() + _str.substring(1).toLowerCase(); },
	replaceAll:function(os, ns){return this.replace(new RegExp(os,"gm"),ns);},
	loopReplace:function(varr){return IX.loop(varr, this, function(acc, item){
		return acc.replaceAll(item[0], item[1]);
	});},
		
	trim:function(){
		var str = this.replace(TrimPattern, ""),
			end = str.length-1,
			ws = /\s/;
		while(ws.test(str.charAt(end)))	
			end --;
		return str.substring(0, end+1);
	},
	stripTags:function() {return this.replace(/<\/?[^>]+>/gi, '');},
	stripScripts: function() {return this.replace(ScriptPattern, '');},
	stripFormTag:function(){return this.replace(FormPattern, '');},
	strip:function() {return this.replace(/^\s+/, '').replace(/\s+$/, '');},
	substrByLength : function(len){ return substrByLength(this.toString(), len); },
	isSpaces:function() {return (this.replace(/(\n)|(\r)|(\t)/g, "").strip().length==0);},

	isPassword : function(){return this.length > 5 && this.length < 21;},
	isEmail : function(){
		var email = this.trim();
		return IX.isEmpty(email) || EmailPattern.exec(email);
	},
	
	trunc:function(len){return (this.length>len)?(this.substring(0, len-3)+"..."):this;},
	tail:function(len){return (this.length>len)?(this.substring(this.length-len)):this;},

	dehtml:function(){return this.loopReplace([["&", "&amp;"], ["<", "&lt;"],['"', "&quot;"]]);},
	enhtml:function(){return this.loopReplace([["&lt;", "<"],["&quot;",'"'], ["&amp;", "&"]]);},

	multi:function(len){ return IX.Array.init(len, this).join("");},
	
	pickUrls:function(){return this.match(UrlRegEx);},
	replaceUrls : function(_r, _f){return this.replace(_r || UrlRegEx, _f || function(a){return '<a href="'+ a + '" target="_blank">' + a + '</a>';});},
	regSplit : function(reg){ return regSplit(this, reg); },
	
	pick4Replace : function(){return this.match(ReplaceKeyPattern); },
	replaceByParams : function(data) {
		var items = IX.Array.compact(this.match(ReplaceKeyPattern));
		return IX.loop(items, this, function(acc, item){
			var _key = item.slice(1,-1);
			return IX.isEmpty(_key)?acc:acc.replaceAll(item, $XP(data, _key, ""));
		});
	},
	inPureTag :function(tagN, attrs){return IX.Dom.inPureTag(tagN, this, attrs);},
	inTag :function(tagN, attrs){return IX.Dom.inTag(tagN, this, attrs);},

	toSafe : function(){
		return this.replace(/\$/g, "&#36;");
	},
	/**
	 * 左补齐字符串
	 * @param  {Number} nLen	要补齐的长度
	 * @param  {String} ch 	要补齐的字符
	 * @return {String}		补齐后的字符串
	 */
	padLeft : function (nLen, ch) {
		var len = 0,
			s = this ? this : "";
		// 默认要补齐0
		ch = ch ? ch : '0';
		len = s.length;
		while(len < nLen) {
			s = ch + s;
			len++;
		}
		return s;
	},
	/**
	 * 右补齐字符串
	 * @param  {Number} nLen	要补齐的长度
	 * @param  {String} ch 		要补齐的字符
	 * @return {String}			补齐后的字符串
	 */
	padRight : function (nLen, ch) {
		var len = 0,
			s = this ? this : "";
		// 默认要补齐0
		ch = ch ? ch : '0';
		len = s.length;
		while(len < nLen) {
			s = s + ch;
			len++;
		}
		return s;
	},
	/**
	 * 左移小数点的位置（用于数学计算，相当于除以Math.pow(10, scale)）
	 * @param  {Number} scale 	要移位的刻度
	 * @return {String} 		返回移位后的数字字符串
	 */
	movePointLeft : function (scale) {
		var s, s1, s2, ch, ps, sign;
		ch = '.';
		sign = '';
		s = this ? this : "";
		if (scale <= 0) return s;
		ps = s.split('.');
		s1 = ps[0] ? ps[0] : "";
		s2 = ps[1] ? ps[1] : "";
		if (s1.slice(0, 1) == "-") {
			// 负数
			s1 = s1.slice(1);
			sign = '-';
		}
		if (s1.length <= scale) {
			ch = "0.";
			s1 = s1.padLeft(scale);
		}
		return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
	},
	/**
	 * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10, scale)）
	 * @param  {Number} scale 	要移位的刻度
	 * @return {String} 		返回移位后的数字字符串
	 */
	movePointRight : function (scale) {
		var s, s1, s2, ch, ps;
		ch = '.';
		s = this ? this : "";
		if (scale <= 0) return s;
		ps = s.split('.');
		s1 = ps[0] ? ps[0] : "";
		s2 = ps[1] ? ps[1] : "";
		if (s2.length <= scale) {
			ch = '';
			s2 = s2.padRight(scale);
		}
		return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
	},
	/**
	 * 移动小数点位置（用于数学计算，相当于（乘以／除以）Math.pow(10, scale)）
	 * @param  {Number} scale 		要移位的刻度（正数表示向右移动；负数表示向左移动；0返回原值）
	 * @return {String} 			返回移位后的数字字符串
	 */
	movePoint : function (scale) {
		if (scale >= 0) {
			return this.movePointRight(scale);
		} else {
			return this.movePointLeft(-scale);
		}
	}
});

/**
 * 		Extends Function.prototype which function bind.
 */
Function.prototype.bind = function() {
	var __method = this, args = $XA(arguments), object = args.shift();
	return function() {return __method.apply(object, args.concat($XA(arguments)));};
};
})();
/**
 * 	IX.UUID is a generator to create UUID.
 */
IX.UUID = (function(){
	var itoh = '0123456789ABCDEF';
	return {
		generate:function() {
			var  s = new Array() ;
			var i=0;
			for (i = 0; i <36; i++)
				s[i] = Math.floor(Math.random()*0x10);
			s[14] = 4;
			s[19] = (s[19] & 0x3) | 0x8;
			
			for (i = 0; i <36; i++) s[i] = itoh[s[i]];
			s[8] = s[13] = s[18] = s[23] = ''; // seperator
			return s.join('');
		}
	};
})();

IX.ns("IX.Util");
// Not be supported by IE serials
IX.Util.Image = (function(){
	var _getImageDataUrl = function(img,cw,ch, w, h){
		var canvas = document.createElement("canvas");
		canvas.width = cw;  
		canvas.height = ch;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, (cw-w)/2, (ch-h)/2, w, h);
		var dataURL = canvas.toDataURL("image/png");
		delete canvas;
		return dataURL;
	};
	var getRatioWH = function(w, h, rw, rh){
		var wratio = w/rw, hratio = h/rh;
		if (wratio>=1 && hratio>=1)
			return [rw, rh];
		wratio = Math.min(wratio, hratio);
		return [rw * wratio, rh *wratio];		
	};
	/* cfg : {width, height}
	 * return : {url, w, h, data}
	 */
	var getImageData = function(imgEl, cfg){
		if (!imgEl)
			return null;
		var img = new Image();
		img.src = imgEl.src;
		var wh =getRatioWH($XP(cfg, "width", img.width), $XP(cfg, "height", img.height), img.width, img.height);
		if (wh[0] * wh[1] == 0)
			return null;
		var dataURL = _getImageDataUrl(img, wh[0], wh[1], wh[0], wh[1]);
		delete img;
		return {
			url : imgEl.src,
			w: wh[0], 
			h: wh[1],
			data : dataURL
		};
	};
	var setImageData = function(imgEl, imgData, keepRatio){
		if (!imgEl)
			return;
		var img = new Image();
		img.src = imgData.data;
		var cwEl = keepRatio?imgEl:img;
		var wh =getRatioWH(cwEl.width, cwEl.height, img.width, img.height);
		//console.log(wh +":" + imgEl.width + ":" + imgEl.height);
		var dataURL = _getImageDataUrl(img,cwEl.width, cwEl.height, wh[0], wh[1]);
		delete img;
		imgEl.src = dataURL;
	};
	
	return {
		getData : getImageData,
		setData : setImageData
	};
})();
IX.Util.Date = function(timeInSecond) {
	var date = new Date(timeInSecond*1000);	
	var getFieldValues = function(_time){
		var getPrefix = "get" + (IX.Date.isUTC()?"UTC":"");
		return IX.map(["FullYear", "Month", "Date", "Hours", "Minutes", "Day"], function(f){
			var v  = _time[getPrefix + f]() - (f=="Month"?-1:0);
			if (f!="Hours" && f!="Minutes")
				return v;
			var s = "00"+ v;
			return s.substring(s.length-2);
		});
	};
	var _formatStr = function(x, len) {
		var str = "" + x;
		var l = len || 2;
		return ("0".multi(l) + str).substr(str.length, l);
	}; 
	var time = getFieldValues(date);
	return {
		toText: function(){return IX.Date.format(date);},
		toWeek : function() {return time[5];},
		toDate: function(incYear){
			var curTime = getFieldValues(new Date());
			incYear = incYear || (curTime[0]>time[0]);
			return [incYear?time[0]:"", incYear?"年":"",time[1], "月", time[2], "日"].join("");
		},
		toTime : function(){return [time[3], time[4]].join(":");},
		toShort : function(){
			var ds = IX.Date.getDS(), ts = IX.Date.getTS();
			var curTime = getFieldValues(new Date());
			var strs = new Array();
			var shouldAppend = false;
			if (time[0] != curTime[0]){
				shouldAppend = true;
				strs.push(_formatStr(time[0], 4));
				strs.push(ds);
			}
			if (shouldAppend || time[1] != curTime[1] || time[2] != curTime[2]){
				strs.push(_formatStr(time[1]));
				strs.push(ds);
				strs.push(_formatStr(time[2]));
				strs.push(' ');
			}
			strs.push(_formatStr(time[3]));
			strs.push(ts);
			strs.push(_formatStr(time[4]));	
			return strs.join("");
		},
		toInterval : function(tsInSec){
			var _date = tsInSec?(new Date(tsInSec*1000)) :(new Date());  
			var v = _date.getTime()/1000-timeInSecond;
			if (v< 10)
				return "刚才";
			else if (v<60)
				return Math.round(v)+ "秒之前";
			else if (v<3600)
				return Math.round(v/60) + "分钟前";
			var ds = "/", ts = ":";
			var curTime = getFieldValues(_date);
			var strs = new Array();
			var shouldAppend = false;
			if (time[0] != curTime[0]){
				shouldAppend = true;
				strs.push(_formatStr(time[0], 4));
				strs.push(ds);
			}
			if (shouldAppend || time[1] != curTime[1] || time[2] != curTime[2]){
				strs.push(_formatStr(time[1]));
				strs.push(ds);
				strs.push(_formatStr(time[2]));
				strs.push(' ');
			} else 
				strs.push("今天");
			
			strs.push(_formatStr(time[3]));
			strs.push(ts);
			strs.push(_formatStr(time[4]));	
			return strs.join("");
		},
		toSimpleInterval : function(){
			return IX.Date.getDateText(timeInSecond,IX.getTimeInMS() /1000);
		}
	};
}; 

IX.Util.Event = {
	target: function(e){
		return e.target||e.srcElement;
	},
	stopPropagation : function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器
		if ( e && e.stopPropagation )
			//因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		else
			//否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
	},
	preventDefault : function( e ) {	//阻止浏览器的默认行为
		//阻止默认浏览器动作(W3C)
		if ( e && e.preventDefault )
			e.preventDefault();
		//IE中阻止函数器默认动作的方式
		else
			window.event.returnValue = false;
		return false;
	},
	stop: function(e){
		IX.Util.Event.preventDefault(e);
		IX.Util.Event.stopPropagation(e);
	}
};
///////////////////////////////////////////////////// UTILS finished///////////
/**
 * 
 * Basic class definition
 * @param {} config {
 * 		id: the identified object(String, number, ...). If not provider, use IX.UUID to create one.
 * 		type: the object type, can be anything which's meaning is assigned by inherit class.
 * }
 * @return {
 * 		getId(): return current object identification.
 * 		setId(id): replace identification's value	
 * 		getType() : return current object type. Maybe null.
 * 		equal(dst) : return if they have same identification.
 * 		destroy(): it is better to have  for each new class.
 * }
 */
/** //Unused temporary 
IX.IObject = function(config){
	var _id = $XP(config, "id", IX.UUID.generate());
	var _type = $XP(config, "type");
	
	return {
		getId:function(){
			return _id;
		},
		setId:function(id){
			_id = id;
		},
		getType:function(){
			return _type;
		},
		equal : function(dst) {
			return _id == dst.getId(); 
		},
		destroy: function(){}
	};
};
*/
var getIXScriptEl = function(){
	if ("scripts" in document) {
		var scripts =document.scripts;
		for(var i=0; i<scripts.length; i++) {
			if (scripts[i].src.indexOf("ixutils.js")>=0)
				return scripts[i];
		}
	}
	var head = $XD.first(document.documentElement, "head");
	var ixEl = $XD.first(head, "script");
	while(ixEl){
		if (ixEl.src.indexOf("ixutils.js")>=0)
			break;			
		ixEl = $XD.next(ixEl, "script");
	}
	return ixEl;
};
(function(){
var ixEl = getIXScriptEl();
var path = ixEl?ixEl.src:"";
IX.SELF_PATH = path;
IX.SCRIPT_ROOT = path.substring(0, path.indexOf("lib/ixutils.js")); 
})();
;// Route Engine
(function () {
	var RouteAttrDefValue = {name :"", url : "", urlType : "site", type : "GET"};
	function urlItemFn(columns, urlDef){
		return IX.loop(columns, {}, function(acc, name, idx){
			var _value = urlDef.length>idx?urlDef[idx]:null;
			if (IX.isEmpty(_value))
				_value = RouteAttrDefValue[name];
			acc[name] = _value;
			return acc;
		});
	}
	// columns : ["name", "url", "urlType"] , // or  ["name", "url", "urlType", "type"]
	function UrlStore(columns){
		var _routes = new IX.IListManager();
		var _urlItemFn = function(urlDef){
			var routeName = urlDef[0];
			if (!IX.isEmpty(routeName))
				_routes.register(routeName, urlItemFn(columns, urlDef));
		};
		return {
			map : function(urlList){IX.iterate(urlList, _urlItemFn);},
			getAll : _routes.getAll,
			get :  _routes.get
		};
	}

	var urlEngine = IX.urlEngine, ajaxEngine = IX.ajaxEngine;
	var urlStore = new UrlStore(["name", "url", "urlType"]),
		ajaxStore = new UrlStore(["name", "url", "urlType", "type"]);
	var urlGenerator = null; //function(name, params){return "";};
	function _urlGenerator(name, params){
		return  IX.isFn(urlGenerator)?urlGenerator(name, params):"";
	}

	/** routeDef : "routeName" or  {
	 * 		name:  "routeName",
	 * 		channel: "",
	 * 		url : function(params){},
	 * 		preAjax : function(name, params){return paramsl;}, // default null;
	 * 		postAjax : function(name, params, cbFn){}, //default null;
	 * 		onsuccess : function(data,cbFn, params), 
	 * 		onfail : function(data, failFn, params) // default null;
	 *  }
	 */
	function createEntries(routes, isCaller){
		return ajaxEngine[isCaller?"createCaller": "createRouter"](IX.map(routes, function(routeDef){
			var isRef = IX.isString(routeDef);
			return IX.inherit(ajaxStore.get(isRef?routeDef:routeDef.name), isRef?{}:routeDef);
		}), function (res) {
			if($XP(res, 'resultcode', '') == 'FP10005') {
				document.location.href = Hualala.PageRoute.createPath('login');
				return false;
			}
			return true;
		});
	}
	function initEngine (cfg){
		urlEngine.init(cfg);
		ajaxEngine.init(cfg);
	}

	IX.ns("Hualala");

	Hualala.urlEngine = {
		init : initEngine,
		reset :initEngine,
		/**  urlList : [ [name, url, urlType], ...]  */
		mappingUrls : function(urlList){
			urlStore.map(urlList);
			urlGenerator = urlEngine.createRouter(urlStore.getAll());
		},
		genUrls : function(names){return IX.map(names, _urlGenerator);},
		genUrl : function(name, params){return _urlGenerator(name, params);}
	};
	Hualala.ajaxEngine = {
		init : initEngine,
		reset :initEngine,
		/**  urlList : [ [name, url, urlType, type], ...]  */
		mappingUrls : ajaxStore.map, //function(urlList)
		
		createCaller :  function(routes){return createEntries(routes, true);},
		createRoute : createEntries
	};
})();

// CommonFn
(function ($) {
	IX.ns("Hualala.Common");
	/**
	 * 根据图片服务器上的原始资源图片,按照配置信息，返回缩放、剪裁、水印等效果的图片链接
	 * 图片地址：
	 * [protocol] [domain] [path] [fileName] [extension]
	 * [http://] [res.hualala.com] [/group1/M00/1E/3B/][wKgBZE5Izt6pUY8WAAD2HTq6pjo419][.jpg]
	 * @param {String} path 图片资源的路径(必须)
	 * @param {Object} cfg 对于图片的配置信息
	 *         cfg : {
	 *         		//控制是否加水印
	 *         		watermark : true|false 	(是否需要打水印,默认为false)
	 *         		//控制缩放规则
	 *         		scale : 	'percent'(百分比缩放) | 
	 *         				'lockMin'(锁定比例按照最小值缩放)(默认) | 'lockMax'(锁定比例按照最大值缩放) | 'unlock'(取消锁定比例) |
	 *         				'lockMinZoomOut'(锁定比例，按照固定尺寸取小值缩小*只允许缩小*) | 
	 *         				'lockMinZoomIn'(锁定比例，按照固定尺寸取小值放大*只允许放大*) |
	 *         				'lockMaxZoomOut'(锁定比例，按照固定尺寸取大值缩小*只允许缩小*) |
	 *         				'lockMaxZoomIn'(锁定比例，按照固定尺寸取大值放大*只允许放大*) | 
	 *         				'unlockZoomOut'(取消锁定比例，按照固定尺寸缩小*只允许缩小*) | 
	 *         				'unlockZoomIn'(取消锁定比例，按照固定尺寸放大*只允许放大*) 
	 *         		width : 300,
	 *         		height : 200,
	 *         		//控制截取规则 
	 *         		//NOTE：一旦cut不为空，缩放规则自动取消
	 *         		cut : 	null(不截取) | 'normal'(正常截取图片) | 'max'(最大化截取图片矩形区域)
	 *         		offsetX : 0,
	 *         		offsetY : 0,
	 *         		//控制图片旋转
	 *         		rotate :  degree(顺时针0~360) | null
	 *         		//控制图片的质量
	 *         		quality : (图片质量百分数1-100) | null
	 *         }
	 * @return {String} 返回图片地址
	 */
	Hualala.Common.getSourceImage = function (path, cfg) {
		var settings = IX.inherit({
			watermark : false,
			scale : 'lockMin',
			width : null,
			height : null,
			cut : null,
			offsetX : null,
			offsetY : null,
			rotate : null,
			quality : null
		}, cfg);
		var imgDomain = !$XP(settings, 'watermark', false) ? 
			Hualala.Global.IMAGE_RESOURCE_DOMAIN : Hualala.Global.IMAGE_RESOURCE_WATERMARK_DOMAIN;
		if (!path || IX.isObject(path)) return '';
		var lastSlash = path.lastIndexOf('/');
			fileName = path.slice(lastSlash + 1),
			suffix = '',
			path = path.slice(0, lastSlash);
		suffix = fileName.replace(/^(.*)\.(jpg|jpeg|png|gif|ico)/i, '$2');
		fileName = fileName.replace(/^(.*)\.(jpg|jpeg|png|gif|ico)/i, '$1');

		var w = $XP(settings, 'width', null), h = $XP(settings, 'height', null),
			x = $XP(settings, 'offsetX', null), y = $XP(settings, 'offsetY', null);

		var scale = $XP(settings, 'scale'), scaleE = '';
		var cut = $XP(settings, 'cut', null), cutE = '';
		var rotate = $XP(settings, 'rotate', null), quality = $XP(settings, 'quality', null),
			paramE = [];
		var scaleRule = {
			// 协议类型< width- >x< height- >
			'percent' : '-',
			// 协议类型< width >x< height >
			'lockMin' : '',
			// 协议类型< width >x< height>_ 例如：300x200_
			'lockMax' : '_',
			// 协议类型 < width >x< height>! 例如：300x200!
			'unlock' : '!',
			// 协议类型 < width >x< height>) 例如：600x200)
			'lockMinZoomOut' : ')',
			// 协议类型 < width >x< height>( 例如：600x200(
			'lockMinZoomIn' : '(',
			// 协议类型 < width >x< height>)_ 例如：600x200)_
			'lockMaxZoomOut' : ')_',
			// 协议类型 < width >x< height>(_ 例如：600x200(_
			'lockMaxZoomIn' : '(_',
			// 协议类型 < width >x< height>)! 例如：600x200)!
			'unlockZoomOut' : ')!',
			// 协议类型 < width >x< height>(! 例如：600x200(!
			'unlockZoomIn' : '(!',
		};
		var cutRule = {
			// 协议类型 c< width >x< height>+< offset_x>+< offset_y>
			'normal' : 'c',
			'max' : 'C'
		};
		// 获取scale表达式
		if (IX.isEmpty(w) && IX.isEmpty(h)) {
			scaleE = '';
		} else if (IX.isEmpty(w) || IX.isEmpty(h)) {
			scaleE = scale == 'percent' ? 
				('=' + (IX.isEmpty(w) ? h : w) + scaleRule[scale]) : '';
		} else {
			scaleE = '=' + w + (scale == 'percent' ? scaleRule[scale] : '') + 'x' + h + scaleRule[scale];
		}

		// 获取截取参数
		// NOTE:一旦截取图片功能开启，缩放功能无效
		if (!IX.isEmpty(cut)) {
			scaleE = '';
			if (IX.isEmpty(w) || IX.isEmpty(h)) {
				cutE = '';
			} else {
				cutE = cutRule[cut] + w + 'x' + h + '+' + (x || 0) + '+' + (y || 0);
			}
		} else {
			cutE = '';
		}

		// 获取旋转图片参数
		if (!IX.isEmpty(rotate) && rotate > 0) {
			paramE.push('rotate=' + rotate);
		}
		// 获取图片的质量参数
		if (!IX.isEmpty(quality) &&  quality > 0) {
			paramE.push('quality=' + quality);
		}
		paramE = paramE.join('&');
		var ret = imgDomain + '/' 
			+ path + '/' 
			+ fileName + scaleE + cutE + '.' + suffix 
			+ (paramE.length > 0 ? ('?' + paramE) : '');
		return ret;
	};
})(jQuery);


// CommonFn
(function ($) {
	IX.ns("Hualala.Common");
	// Image Oprater
	var CacheTypes = {
		logo : "logo",
		photo : "user",
		docThumb : "thumb"
	};
	Hualala.Common.loadImageErr = function (imgEl, type) {
		if (!imgEl || !imgEl.parentNode)
			return ;
	};
	var defaultPhotoImg = null;
	Hualala.Common.avatarFn = function (src, type, clz) {
		if (IX.isEmpty(src)) {
			if (!defaultPhotoImg) {
				defaultPhotoImg = Hualala.Global.getDefaultImage("photo");
			}
			src = defaultPhotoImg;
		}
		return '<img src="' + src + '" class="' + (clz || "avatar-32") +
			'" onerror="Hualala.Common.loadImageErr(this, ' + "'" + (type || "photo") + "'" + ');"/>';
	};

	// Date
	Hualala.Date = IX.Util.Date;
	/**
	 * 格式化Ajax返回给前端的日期时间数据
	 * 后端返回前端时间日期数据格式为：yyyyMMddHHmmss，
	 * 我们要将这种奇怪的日期字符串格式转化为统一的标准的日期字符串格式yyyy/MM/dd HH:mm:ss
	 * @param  {String} v 	奇怪的日期时间数据字符串：yyyyMMddHHmmss
	 * @return {String}		统一的标准时间日期数据字符串 ： yyyy/MM/dd HH:mm:ss
	 */
	Hualala.Common.formatDateTimeValue = function (v) {
		if (IX.isEmpty(v) || !IX.isString(v)) return '';
		var fullLen = 14, l = v.length, r = '00000000000000';
		if (l < fullLen) {
			v += r.slice(0, (fullLen - l));
		}
		return v.replace(/([\d]{4})([\d]{2})([\d]{2})([\d]{2})([\d]{2})([\d]{2})/g, '$1/$2/$3 $4:$5:$6');
	};
    
    Hualala.Common.formatDateStr = function (str, l, sp)
    {
        sp = sp || '/'; 
        l == l || 8;
        var ln = str.length;
        if(ln < 8) return '';
        var ret = [str.substr(0, 4), str.substr(4, 2), str.substr(6, 2)].join(sp);
        if(l == 12 && ln >= 12)
            ret += ' ' + str.substr(8, 2) + ':' + str.substr(10, 2);
        else if(l == 14) 
        {
            if(ln >= 12)
                ret += ' ' + str.substr(8, 2) + ':' + str.substr(10, 2);
            if(ln >= 14)
                ret += ':' + str.substr(12, 2);
        }
            
        return ret;
    }

	/**
	 * 设置垂直居中位置
	 * offset : {top : [int], left : [int]}
	 */
	Hualala.Common.setCenter = function (el, parentEl, offset) {
		!parentEl && (parentEl = document.documentElement || document.body);
		!offset && (offset = {});
		el.style.top = (((parentEl.clientHeight - el.clientHeight) / 2) + (offset.top || 0)) + 'px';
		el.style.left = (((parentEl.clientWidth - el.clientWidth) / 2) + (offset.left || 0)) + 'px';
	};

	/**
	 * 获取字符串的字节长度
	 * str : [String]
	 */
	Hualala.Common.strByteLength = function (str) {
		var i, sum = 0;
		for (i = 0; i < str.length; i++) {
			var charCode = str.charCodeAt(i);
			if ((charCode >= 0) & (charCode <= 255)) {
				sum += 1;
			} else {
				sum += 2;
			}
		}
		return sum;
	};

	/**
	 * 按字节数截取字符串
	 * str : [String], n : [int]
	 */
	Hualala.Common.substrByte = function (str, n) {
		var s2 = str.slice(0, n),
			i = s2.replace(/[^\x00-\xff]/g, "**").length;
		if (i <= n) return s2;
		i -= s2.length;
		switch (i) {
			case 0 : return s2;
			case n : return str.slice(0, n >> 1);
			default :
				var k = n - i,
					s3 = str.slice(k, n),
					j = s3.replace(/[\x00-\xff]/g, "").length;
				return j ? str.slice(0, k) + Hualala.Common.substrByte(s3, j) : str.slice(0, k);
		}
	};

	/**
	 * 获取浏览器品牌及版本号信息
	 * @return {Object} {browserName:version}
	 */
	Hualala.Common.Browser = (function () {
		var browser = {},
			ua = navigator.userAgent.toLowerCase(),
			match = null;
		(match = ua.match(/rv:([\d.]+)\) like gecko/)) ? browser['ie'] = match[1] :
		(match = ua.match(/msie ([\d.]+)/)) ? browser['ie'] = match[1] :
		(match = ua.match(/chrome\/([\d.]+)/)) ? browser['chrome'] = match[1] : 
		(match = ua.match(/firefox\/([\d.]+)/)) ? browser['firefox'] = match[1] :
		(match = ua.match(/opera.([\d.]+)/)) ? browser['opera'] = match[1] : 
		(match = ua.match(/version\/([\d.]+).*safari/)) ? browser['safari'] = match[1] : 0;
		return browser;
	})();

	/**
	 * 获取事件间隔选项数据
	 * @param  {Object} cfg {startLabel, start, end}
	 *          cfg : {
	 *          	startLabel : 第一个选项的label，
	 *          	end : 结束的分钟
	 *          }
	 * @return {[type]}     [description]
	 */
	Hualala.Common.getMinuteIntervalOptions = function (cfg) {
		var startLabel = $XP(cfg, 'startLabel', '不限'),
			end = $XP(cfg, 'end', (Hualala.Constants.SecondsOfDay / 60)),
			list = Hualala.TypeDef.MinuteIntervalOptions(end);
		return _.map(list, function (el, i) {
			return IX.inherit(el, {
				label : i == 0 ? startLabel : $XP(el, 'label', '')
			});
		});
	};

    /**
	 * 将表单里内容转换为 plainObject
	 * @param  {DOM | jQuery Objuect | selector string} form
	 * @return {Object | null}    { formFiledName1: value1, formFiledName2: value2, ... }
	 */
    Hualala.Common.parseForm = function (form) {
		var $form = $(form);
        if(!$form[0]) return null;
        
        var fields = $form.serializeArray();
        if(!fields.length) return null;
        
        var result = {};
        $.each(fields, function (i, o) { result[o.name] = o.value; });
        
        return result;
		
	};
    
    //根据对象的一个属性检查某个对象是否在一个对象数组中
    Hualala.Common.inArray = function(arr, obj, key)
    {
        for(var i = 0, l = arr.length; i < l; i++)
        {
            if(arr[i][key] == obj[key]) return i;
        }
        return -1;
    }

	/**
	 * 号码遮罩
	 * @param  {String} code  需要进行遮罩的字符串
	 * @param  {Int} start 开始遮盖的字符串位置
	 * @param  {Int} end   遮盖结束位置
	 * @return {Object}		返回遮盖操作后的字符串和原始字符串{orig, val}       
	 */
	Hualala.Common.codeMask = function (code, start, end) {
		code = !code ? '' : code.toString();
		var len = code.length,
			str = '';
		start = IX.isEmpty(start) ? 0 : parseInt(start);
		end = IX.isEmpty(end) ? len : parseInt(end);
		str = code.slice(0, start) + code.slice(start, end).replace(/[\w]/g, '*') + code.slice(end);
		return {
			orig : code,
			val : str
		};
	};

	/**
	 * 根据银行代码获取银行基本信息
	 * @param  {String} bankCode 银行代码
	 * @return {Object}          银行信息{code, name, icon_16, icon_32, icon_48, icon_64}
	 */
	Hualala.Common.mapBankInfo = function (bankCode) {
		var banks = Hualala.TypeDef.BankOptions,
			bankHT = new IX.IListManager(),
			iconSizes = [16, 32, 48, 64];
		_.each(banks, function (el) {
			var c = $XP(el, 'value'),
				n = $XP(el, 'label');
			var icons = {};
			_.each(iconSizes, function (el) {
				icons['icon_' + el] = 'icon-' + c + '-' + el;
			});
			bankHT.register(c, IX.inherit({
				code : c,
				name : n
			}, icons));
		});
		return bankHT.get(bankCode);
	};

	/**
	 * 获取性别数据
	 * @param  {Int} 性别值
	 * @return {Object} 	{value(性别值), valueStr(性别字符值), label（性别）}
	 */
	Hualala.Common.getGender = function (v) {
		if (IX.isEmpty(v)) return null;
		var l = Hualala.TypeDef.GENDER;
		var m = _.find(l, function (el) {
			var id = $XP(el, 'value');
			return id == v;
		});
		return m;
	};

	/**
	 * 获取订单状态信息
	 * @param  {订单状态值} v
	 * @return {Object} 订单状态信息{value, label}
	 */
	Hualala.Common.getOrderStatus = function (v) {
		if (IX.isEmpty(v)) return null;
		var l = Hualala.TypeDef.OrderStatus;
		var m = _.find(l, function (el) {
			return $XP(el, 'value') == v;
		});
		return m;
	};

    /**
	 * 根据shopID获得店铺在哗啦啦www上的店铺URL
	 * @param  {String} shopID 店铺ID
	 * @return {String}    店铺URL
	 */
    Hualala.Common.getShopUrl = function(shopID)
    {
        return Hualala.Global.HualalaWebSite + '/shop_' + shopID;
    };

})(jQuery);

// Common Math Fn
(function ($) {
	// 提高数字的易读性，在数字每隔3位处增加逗号
	var prettyNumeric = function (num, separator) {
		if (isNaN(num)) return num.toString();
		var s = num.toString().split('.'),
			isNegative = num < 0 ? true : false,
			s1 = isNegative ? s[0].replace('-', '') : s[0],
			s2 = s[1] || '',
			l = s1.length,
			r = '';
		separator = !separator ? ',' : separator;
		if (l > 3) {
			var l1 = parseInt(l / 3),
				idx = l % 3;
			r = idx == 0 ? '' : s1.slice(0, idx) + separator;
			for (var i = 0; i < l1; i++) {
				r += s1.slice(idx + (i * 3), (idx + (i + 1) * 3)) + separator;
			}
			r = (isNegative ? '-' : '') + r.slice(0, -1) + (s2.length > 0 ? ('.' + s2) : '');
		} else {
			r = num;
		}
		return r;
	};
	// 如果字符串是易读的数字模式，使用这个函数可以还原成正常数字模式
	var restoreNumeric = function (str, separator) {
		separator = !separator ? ',' : separator;
		var s = str.split(separator).join('');
		return isNaN(s) ? str : Number(s);
	};
	// 美化价格显示，如果价格为整数，不现实小数点后的部分，如果价格为小数，显示小数点后2位
	var prettyPrice = function (price) {
		price = parseFloat(price).toFixed(2).toString();
		price = price.replace(/0+$/, '');
		var dot = price.indexOf('.');
		if (dot == price.length - 1) {
			price = price.substr(0, dot);
		}
		return price;
	};

	// 标准价格显示，自动补齐小数点后两位；标准价格显示：[整数部分].[角][分]
	var standardPrice = function (price) {
		if (isNaN(price)) return price;
		price = parseFloat(price).toFixed(2).toString();
		return price;
	};
	
	var add = function () {
		var baseNum = 0, args = $XA(arguments);
		var ret = 0;
		_.each(args, function (v) {
			var v1 = 0;
			try {
				v1 = v.toString().split('.')[1].length;
			} catch (e) {
				v1 = 0;
			}
			baseNum = v1 > baseNum ? v1 : baseNum;
		});
		// 使用字符串移动小数点方式规避javascript中由于精度差异导致的无法精确表示浮点数的bug
		// baseNum = Math.pow(10, baseNum);
		_.each(args, function (v) {
			// ret += v * baseNum;
			ret += Number(v.toString().movePoint(baseNum));
		});
		// return ret / baseNum;
		return Number(ret.toString().movePoint(-baseNum));
	};
	var sub = function () {
		var baseNum = 0, args = $XA(arguments),
		// 精度
			precision;
		var ret = 0;
		_.each(args, function (v) {
			var v1 = 0;
			try {
				v1 = v.toString().split(".")[1].length;
			} catch (e) {
				v1 = 0;
			}
			baseNum = v1 > baseNum ? v1 : baseNum;
		});
		precision = baseNum;
		// 使用字符串移动小数点方式规避javascript中由于精度差异导致的无法精确表示浮点数的bug
		// baseNum = Math.pow(10, baseNum);
		
		_.each(args, function (v, i) {
			// ret = i == 0 ? (v * baseNum) : (ret - v * baseNum);
			ret = i == 0 ?
				Number(v.toString().movePoint(baseNum)) : (ret - Number(v.toString().movePoint(baseNum)));
			// if (i == 0) {
			// 	// ret += v * baseNum;
			// 	ret += Number(v.toString().movePoint(baseNum));
			// } else {
			// 	// ret -= v * baseNum;
			// 	ret -= Number(v.toString().movePoint(baseNum));
			// }
		});
		// return (ret / baseNum).toFixed(precision);
		return Number(numberToFixed(Number(ret.toString().movePoint(-baseNum)), precision));
	};
	var multi = function () {
		var baseNum = 0, args = $XA(arguments);
		var ret = 1;
		_.each(args, function (v) {
			try {
				baseNum += v.toString().split('.')[1].length;
			} catch (e) {

			}
		});
		_.each(args, function (v) {
			ret *= Number(v.toString().replace(".", ""));
		});
		// 使用字符串移动小数点方式规避javascript中由于精度差异导致的无法精确表示浮点数的bug
		// return ret / Math.pow(10, baseNum);
		return Number(ret.toString().movePoint(-baseNum));
	};
	var div = function () {
		var baseNum = [], baseNum1 = [], args = $XA(arguments);
		var ret = 1, scale = 0;
		_.each(args, function (v) {
			try {
				baseNum.push(v.toString().split(".")[1].length);
			} catch (e) {
				baseNum.push(0);
			}
		});
		with (Math) {
			_.each(args, function (v, i) {
				var v1 = Number(v.toString().replace(".", ""));
				ret = i == 0 ? v1 : (ret / v1);
			});
			_.each(baseNum, function (v, i) {
				scale = i == 0 ? v : (scale - v);
			});
			// 使用字符串移动小数点方式规避javascript中由于精度差异导致的无法精确表示浮点数的bug
			// return ret * pow(10, scale);
			return Number(ret.toString().movePoint(-scale));
		}
	};
	var numberToFixed = function (num, scale) {
		var s, s1, s2, start;
		scale = scale || 0;
		s1 = num + "";
		start = s1.indexOf('.');
		s = s1.movePoint(scale);
		if (start >= 0) {
			s2 = Number(s1.substr(start + scale + 1, 1));
			if (s2 >= 5 && num >= 0 || s2 < 5 && num < 0) {
				s = Math.ceil(s);
			} else {
				s = Math.floor(s);
			}
		}
		return Number(s.toString().movePoint(-scale));
	};
	IX.ns("Hualala.Common");
	Hualala.Common.Math = {
		prettyNumeric : prettyNumeric,
		restoreNumeric : restoreNumeric,
		prettyPrice : prettyPrice,
		standardPrice : standardPrice,
		add : add,
		sub : sub,
		multi : multi,
		div : div,
		numberToFixed : numberToFixed
	};
})(jQuery);

// CommonFn Scroll
(function ($) {
	IX.ns("Hualala.Common");
	// 平滑滚动到obj元素顶部
	function smoothScroll (obj, during, fn) {
		$(document.body).animate({scrollTop : $(obj).offset().top}, during, 'swing', fn);
	};
	// 平滑滚动到obj元素中部
	function smoothScrollMiddle (obj, during, fn) {
		var $obj = $(obj),
			t = $obj.offset().top,
			oh = $obj.height(),
			wh = $(window).height();
		$(document.body).animate({scrollTop : t + oh/2 - wh / 2}, during, 'swing', fn);
	};
	Hualala.Common.smoothScroll = smoothScroll;
	Hualala.Common.smoothScrollMiddle = smoothScrollMiddle;

	/**
	 * 获取当前页面的角色权限
	 * @return {Object} 角色权限数据
	 * @param {String} name 当前页面名称
	 * @param {String} parentName 父级页面名称
	 * @param {Array} roles 当前用户的角色
	 * @param {NULL|Object} right 用户在当前页面的权限, null：证明没有权限访问页面
	 *        @param {String} name 页面名称
	 *        @param {String} url 页面链接
	 *        @param {NULL|Array} enabled 有权限进行的操作入口名称
	 *        @param {NULL|Array} disabled 无权限进行的操作入口名称
	 */
	var getCurPageUserRight = function () {
		var curPageCxt = Hualala.PageRoute.getPageContextByPath(location.href),
			parentName = $XP(curPageCxt, 'parentName', ''),
			name = $XP(curPageCxt, 'name', '');
		var roles = $XP(Hualala.getSessionUser(), 'role', []),
			userRights = Hualala.getSessionUserRight(),
			ht = new IX.IListManager();
		_.each(userRights, function (el) {
			ht.register(el.name, el);
		});
		var right = ht.get(name);
		return {
			name : name,
			parentName : parentName,
			roles : roles,
			right : right
		};
	};
	Hualala.Common.getCurPageUserRight = getCurPageUserRight;
    
    /**
	 * 对AJAX接口调用的封装
	 * @return {Object} jQuery Deferred 对象
	 * @param {String} api Hualala.Globel命名空间下的AJAX接口名称
	 * @param {Object} params 调用AJAX接口传递的参数
	 */
    function loadData(api, params, data, path)
    {
        var df = $.Deferred();
        
        if(data) df.resolve(data);
        else Hualala.Global[api](params, function(rsp)
        {
            if(rsp.resultcode != '000')
            {
                rsp.resultmsg && Hualala.UI.TopTip({msg: rsp.resultmsg, type: 'danger'});
                df.reject(rsp);
                return;
            }
            if(path === false)
            {
                df.resolve(rsp); return;
            }
            path = path || 'data.records';
            var sucData = rsp,
                paths = path.split('.'),
                l = paths.length - 1;
                
            for(var i = 0; i < l; i++)
                sucData = sucData[paths[i]] || {};
                
            df.resolve(sucData[paths[l]]);
        });
        
        return df.promise();
    }
    Hualala.Common.loadData = loadData;

    /*
    处理textarea空行问题
    参数：string
    返回 string
    */
    //编码textarea的内容
    function encodeTextEnter(text) {
        if (!text || typeof text != 'string') return text;
        return text.trim().replace(/[\n]/g, '<br/>');
    }
    Hualala.Common.encodeTextEnter = encodeTextEnter;
    //解码textarea的内容
    function decodeTextEnter(text) {
        if (!text) return text;
        return text.replace(/<br\/>/g, '\n');
    }
    Hualala.Common.decodeTextEnter = decodeTextEnter;

})(jQuery);





;(function ($) {
	IX.ns("Hualala.TypeDef");

	// 商户中心角色配置
	// DongBo 要求角色数据并不是保存在后台数据库中，而是将角色常量维护在后台代码中，所以
	// 前端也维护一份配置信息，与后台保持一致
	Hualala.TypeDef.SiteRoleType = [
		{id : 1, name : "店长", "sortIndex" : 5, "roleType" : "manager", "operationScope" : "single-shop", "desc" : "可以管理单店的信息和功能"},
		{id : 2, name : "财务", "sortIndex" : 4, "roleType" : "finance", "operationScope" : "settle", "desc" : "可以管理多个结算账户"},
		{id : 3, name : "区域经理", "sortIndex" : 3, "roleType" : "area-manager", "operationScope" : "multi-shop", "desc" : "可以开店，并管理多个店铺的基本信息和功能"},
		{id : 4, name : "集团经理", "sortIndex" : 2, "roleType" : "general", "desc" : "管理所有店铺信息和功能及结算数据"},
		{id : 5, name : "系统管理员", "sortIndex" : 1, "roleType" : "admin", "desc" : "超级管理员，全部权限"}
	];

	// 站点导航数据
	Hualala.TypeDef.SiteNavType = [
		{name : 'shop', label : '店铺', type:"link"},
		{name : 'setting', label : '业务', type:"link"},
		{name : 'order', label : '订单', type:"link"},
		{name : 'account', label : '结算', type:"link"},
		{name : 'crm', label : '会员', type:"subnav",
			subnavs : [
				{name : "crmMemberSchema", label : "会员概况", type : "link", src : "CRMMemberSubNavType"},
				{name : "crmDealSummary", label : "交易报表", type : "link", src : "CRMDealSubNavType"},
				{name : "crmParameter", label : "参数设置", type : "link", src : "CRMParamsSubNavType"}
			]
		},
		{name : 'mcm', label : '营销', type : "subnav",
			subnavs : [
				{name : "mcmGiftsMgr", label : "礼品管理", type : "link", src : ""},
				{name : "mcmEventMgr", label : "活动管理", type : "link", src : ""}
			]
		},
		//saas
		{name : 'saas', label : '收银软件', type:"link"},
		{name : 'weixin', label : '微信', type: "subnav",
			subnavs : [
				{name : "wxAccounts", label : "微信管理", type : "link", src : "WeixinAdminSubNavType"},
				{name : "wxAdvertorial", label : "素材管理", type : "link", src : "WeixinMaterialSubNavType"}
			]
		},
        {name : 'more', label : '更多', type: "subnav",
			subnavs : [
				{name : "agent", label : "代理程序", type : "link"},
				{name : "user", label : "权限", type : "link"}
			]
		}
        
	];
    
    Hualala.TypeDef.WeixinAdminSubNavType = [
		{name : "wxAccounts", label : "公众账号"},
        {name : "wxReply", label : "自动回复"},
		{name : "wxSubscribe", label : "关注自动回复"},
		{name : "wxMenu", label : "自定义菜单"}//,
        //{name : "wxQrCode", label : "二维码管理"}
	];
    Hualala.TypeDef.WeixinMaterialSubNavType = [
        {name : "wxAdvertorial", label : "软文管理"},
		{name : "wxContent", label : "图文管理"},
		{name : "wxText", label : "文本管理"}
	];

	Hualala.TypeDef.CRMMemberSubNavType = [
		{name : "crmMemberSchema", label : "会员概览", pkeys : []},
		{name : "crmQueryMember", label : "会员查询", pkeys : []},
		{name : "crmCardStats", label : "入会统计", pkeys : []}
	];
	Hualala.TypeDef.CRMDealSubNavType = [
		{name : "crmDealSummary", label : "储值消费汇总", pkeys : []},
		{name : "crmDealDetail", label : "交易明细", pkeys : []},
		{name : "crmRechargeReconciliation", label : "储值对账", pkeys : []},
		{name : "memberQueryDay", label : "会员日报表", pkeys : []}
	];
	Hualala.TypeDef.CRMParamsSubNavType = [
		{name : "crmParameter", label : "会员系统参数", pkeys : []},
        {name : "crmCardLevels", label : "会员等级", pkeys : []},
		{name : "crmRechargePackageBusiness", label : "充值套餐", pkeys : []},
		{name : "crmShopSpecialPrice", label : "店铺特惠", pkeys : []}
	];
    
    

	Hualala.TypeDef.OrderSubNavType = [
		// Note：先屏蔽，第二版本开放
		// {name : 'order', label : '概览', pkeys : []},
		{name : 'orderQuery', label : '订单查询', pkeys : ['startDate','endDate','cityID','shopID','queryStatus','userMobile','orderID','s_orderTotal','e_orderTotal','vipOrder']},
		{name : 'orderQueryDay', label : '订单日汇总', pkeys : ['startDate','endDate','cityID','shopID','queryStatus']},
		{name : 'orderQueryDuring', label : '订单期间汇总', pkeys : ['startDate','endDate','cityID','shopID','queryStatus']},
		{name : 'orderDishesHot', label : '菜品销量排行', pkeys : ['startDate','endDate','cityID','shopID','foodCategoryName']},
		{name : 'orderQueryCustomer', label : '顾客统计', pkeys : ['startDate','endDate','cityID','shopID','userLoginMobile','userName']}
	];

	/*saas*/
	Hualala.TypeDef.SaasSubNavType = [
		{name : 'saasReceivables', label : '收款项目', pkeys : []},
		{name : 'saasDepartment', label : '部门', pkeys : []},
		//{name : 'saasRemarks', label : '字典', pkeys : []},
		// {name : 'saasCategories', label : '商品分类', pkeys : []},
		// {name : 'saasCommodity', label : '商品', pkeys : []},
		{name : 'saasChannel', label : '渠道', pkeys : []}
		
	];

	Hualala.TypeDef.GENDER = [
		{value : '0', valueStr : 'female', label : '女士'},
		{value : '1', valueStr : 'male', label : '先生'},
		{value : '2', valueStr : 'unkonwn', label : '未知'}
	];
	/**
	 * 店铺备注类型
	 * 备注类型10:口味，20：作法，30：品注，40：单注，45：赠菜原因，50：退菜原因，60：退单原因
	 */
	Hualala.TypeDef.ShopNoteType = {
		TASTE : 10,
		COOKING : 20,
		FOOD_COMMENT : 30,
		ORDER_COMMENT : 40,
		FREE_REASON : 45,
		RETURN_REASON : 50,
		CHARGE_BACK : 60
	};
	/**
	 * 订单子类型
	 * 10：预订 11：闪吃  12：店内自助点菜 15：排队取号 20：外送 21：自提 
	 */
	Hualala.TypeDef.OrderSubType = {
		EATIN : 0,
		RESERVE : 10,
		Flash : 11,
		DIY : 12,
		QUEUE : 15,
		TAKEOUT : 20,
		PICKUP : 21
	};
	/**
	 * 时段类型定义
	 */
	Hualala.TypeDef.TimeID = {
		allday : {value : 0, label : "全天"},
		breakfast : {value : 1, label : "早餐"},
		lunch : {value : 2, label : "午餐"},
		afternoon : {value : 3, label : "下午茶"},
		dinner : {value : 4, label : "晚餐"},
		supper : {value : 5, label : "夜宵"}
	};
	/**
	 * 店铺状态
	 */
	Hualala.TypeDef.ShopStatus = [
		{value : 0, label : "待开放"},
		{value : 1, label : "正常"},
		{value : 2, label : "装修暂停营业"},
		{value : 3, label : "菜单更新暂停服务"},
		{value : 4, label : "信息更新暂停服务"},
		{value : 5, label : "店内放假暂停服务"},
		{value : 8, label : "信息完善中"},
		{value : 9, label : "已关闭"}
	];

	/** 
	 *查询订单的状态
	 *BUG #5570 【Dohko-dianpu】订单查询不能显示待消费订单且导出订单也无此数据
	 */
	Hualala.TypeDef.queryStatus = [
		{value : '2', label : "已消费"},
		{value : '1', label : "待消费"},			
		{value : '3', label : "已退款"}
	]
	/**
	 * 订单状态
	 * @type {Array}
	 */
	Hualala.TypeDef.OrderStatus = [
		// {value : '0', label : "已取消"},
		// {value : '10', label : "未完成"},
		// {value : '15', label : "已确认"},
		{value : '20', label : "待消费"},
		{value : '30', label : "已退单"},
		{value : '40', label : "已消费"}
		// {value : '50', label : "已完成 "},
	];

	/**
	 * 菜品属性
	 */
	Hualala.TypeDef.FoodAttr = {
		// 是否必点
		AUTOADD : 1,
		// 是否店家招牌菜
		SPECIALTY : 1,
		// 推荐菜
		RECOMMEND : 1,
		// 新菜
		NEW : 1,
		// 打折菜
		DISCOUNT : 1,
		// 允许点评
		COMMENTS : 1,
		// 能退订退款
		CANREFUND : 1,
		// 是套餐
		SETFOOD : 1,
		// 外送标记
		TakeawayTag : {
			NOTAKEAWAY : 0,
			TAKEAWAY : 1,
			ONLYTAKEAWAY : 2
		},
		HASIMAGE : 1
	};

    Hualala.TypeDef.FoodAttrSelect = {
        TakeawayType: [{name: '堂食外送均可', value: '1'}, {name: '仅堂食', value: '0'}, {name: '仅外送', value: '2'}],
        HotTag: [{name: '不辣', value: '0'}, {name: '微辣', value: '1'}, {name: '中辣', value: '2'}, {name: '重辣', value: '3'}]
    };
    Hualala.TypeDef.FoodSettings = [
        {name: 'IsNeedConfirmFoodNumber', text: '需要确定数量'},
        {name: 'isAutoAdd', text: '默认自动加入'}
        //{name: 'isComments', text: '允许点评'}暂时屏蔽掉
    ];
    Hualala.TypeDef.FoodAttrSNewR = [
        {name: 'isSpecialty', text: '招牌菜'},
        {name: 'isNew', text: '新菜'},
        {name: 'isRecommend', text: '推荐菜'}
    ];
	/**
	 * 交易类型 
	 * 101：网上订餐消费（卖出）+ 102：账户充值+ 199：账户资金调加+ 201：订餐消费后退款（退款）- 202：平台预付款- 203：提现- 204：支付平台服务费- 205：支付平台广告费- 206：支付平台信息费- 299：账户资金调减-
	 */
	Hualala.TypeDef.FSMTransType = [
		{value : '', label : "全部"},
		{value :511,label : "用户自助订餐/结帐", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 101, label : "网上订餐", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 102, label : "账户充值", tpl : "tpl_fsmcustomer_detail", queryCall : "Hualala.Global.queryAccountFsmCustomerDetail", queryKeys : "SUA_TransItemID,transType"},
		//{value : 103, label : "网上订餐用券", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 104, label : "到店消费验券", tpl : "tpl_chktick_detail", queryCall : null, queryKeys : null},
		{value : 105, label : "会员在线储值", tpl : "tpl_fsmcustomer_detail", queryCall : "Hualala.Global.queryAccountFsmCustomerDetail", queryKeys : "SUA_TransItemID,transType"},
		//{value : 199, label : "账户资金调加"},
		{value : 201, label : "订单退款", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 202, label : "平台预付款"},
		{value : 203, label : "提现", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"}
		// {value : 204, label : "支付平台服务费"},
		// {value : 205, label : "支付平台广告费"},
		// {value : 206, label : "支付平台信息费"},
		//{value : 207, label : "订餐消费后退券", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"},
		//{value : 299, label : "账户资金调减"},
		//{value : 410, label : "店内自助点菜结账", tpl : "tpl_orderpay_detail", queryCall : "Hualala.Global.queryAccountOrderPayDetail", queryKeys : "orderKey,orderID"}
	];
	/**
	 * 交易状态
	 * 0：等待交易完成 1：交易成功 2：交易关闭
	 * 
	 */
	Hualala.TypeDef.FSMTransStatus = [
		{value : '', label : "全部"},
		{value : 0, label : "等待交易完成"},
		{value : 1, label : "交易成功"},
		{value : 2, label : "交易关闭"}
	];
	/**
	 * 支付类型
	 *  10：预付款.现金 11：预付款.支票 12：预付款.银行转账 13：预付款.刷银行卡 18：预付款.商户让利 20：帐户充值.现金 21：帐户充值.支票 22：帐户充值.银行转账 23：帐户充值.刷银行卡 24：帐户充值.在线支付 30：帐户提现.现金 31：帐户提现.支票 32：帐户提现.银行转账 33：帐户提现.刷银行卡 
	 */
	Hualala.TypeDef.FSMTransDetail = [
		{value : 10, label : "预付款.现金"},
		{value : 11, label : "预付款.支票"},
		{value : 12, label : "预付款.银行转账"},
		{value : 13, label : "预付款.刷银行卡"},
		{value : 18, label : "预付款.商户让利"},
		{value : 20, label : "帐户充值.现金"},
		{value : 21, label : "帐户充值.支票"},
		{value : 22, label : "帐户充值.银行转账"},
		{value : 23, label : "帐户充值.刷银行卡"},
		{value : 24, label : "帐户充值.在线支付"},
		{value : 30, label : "帐户提现.现金"},
		{value : 31, label : "帐户提现.支票"},
		{value : 32, label : "帐户提现.银行转账"},
		{value : 33, label : "帐户提现.刷银行卡"}
	];

	/**
	 * 结算账户收款方方式
	 * @type {Array} 1:个人;2:单位
	 */
	Hualala.TypeDef.AccountReceiverTypes = [
		{value : 2, label : "单位"},
		{value : 1, label : "个人"}
	];

	Hualala.TypeDef.ShopOperationMode = [
		{value : 0, label : "正餐"},
		{value : 1, label : "快餐"},
		{value : 2, label : "美食广场"}
	];
	Hualala.TypeDef.ShopPrinterDataSet = {
		/* 打印机状态
		 * 0：未知 1：正常 2:打印机出错 3:打印机无法连接 4:打印机脱机 
		 * 5:上盖打开 6:切刀出错 7:纸将尽 8:缺纸
		 */
		currPrinterStatusData : [
			{value : "0", label : "未知"},
			{value : "1", label : "正常"},
			{value : "2", label : "打印机出错"},
			{value : "3", label : "打印机无法连接"},
			{value : "4", label : "打印机脱机"},
			{value : "5", label : "上盖打开"},
			{value : "6", label : "切刀出错"},
			{value : "7", label : "纸将尽"},
			{value : "8", label : "缺纸"}
		],
		/*打印机端口类型 : 0：未知 1：串口 2：并口 3：USB口 4：网口*/
		printerPortTypes : [
			{value : "0", label : "未知"},
			{value : "1", label : "串口"},
			{value : "2", label : "并口"},
			{value : "3", label : "USB口"},
			{value : "4", label : "网口"}
		],
		//打印机纸张宽度 80，76，58
		printerPaperSizeTypes :[
			{value: "58", label:"58毫米"},
			{value: "76", label:"76毫米"},
			{value: "80", label:"80毫米"}
		]
	};
	Hualala.TypeDef.ShopPromotionDataSet = {
		/* 促销或送适用的业务类型
		 * 0:预订（常规预订+闪吃预订） 1：外送/自提 2：全部 3:店内自助
		 */
		supportOrderTypes : [
			{value : 2, label : "全部"},
			{value : 0, label : "预订"},
			{value : 1, label : "外送"},
			{value : 3, label : "店内自助"}
		],
		/*tag : 标签（0无，1券，2返，3送，4赠，5惠）*/
		tagTypes : [
			{value : "0", label : "无"},
			{value : "1", label : "券"},
			{value : "2", label : "返"},
			{value : "3", label : "送"},
			{value : "4", label : "赠"},
			{value : "5", label : "惠"}
						],
		//促销规则
		stageTypes :[
			{value: "0", label:"下单就有优惠"},
			{value: "1", label:"消费每满一定金额就有优惠"},
			{value: "1", label:"消费一定金额就有优惠"}
		],
		//返券规则 1：不限制 2：用券不返券 3现金部分返券
		returnVoucherTypes:[
			{value:"1",label:"不限制"},
			{value:"2",label:"用券不返券"},
			{value:"3",label:"现金部分返券"}
		]
	};

	/**
	 * 店铺业务类型
	 * 10：常规预订，11：闪吃，20：外送，21：到店自提，41：店内点菜，42：店内买单
	 * 业务表单参数：
	 * advanceTime:提前预订时间 int 分钟 0：无需提前
	 * noticeTime:POS提前通知时间 int 分钟 0|null 立即通知
	 * minAmount:最低消费金额 int 0
	 * serviceAmount:服务费 int 0
	 * freeServiceAmount:免服务费菜品金额
	 * holidayFlag:节假日开放 0:包含节假日（默认），1:只能在节假日，2:不包含节假日
	 * openDays: 开放服务天数 int
	 * servicePeriods: 开放时段 string hhmm,hhmm; 支持结束日期小于终止日期，时段最小间隔不应小于2个小时
	 * reserveTableTime: 留位时间 int 分钟
	 * reserveTableDesc: 留位说明40字
	 * takeawayDeliveryAgent: 配送单位，默认"自助配送"
	 * takeawayDeliveryTime: 送达时间 int 分钟
	 * takeawayScope: floor 公里
	 * takeawayScopeDesc: 外卖送餐范围说明200字
	 * submitSMSTemplateID: 下单后短信模板ID
	 * checkSMSTemplateID: 验单后短信模板ID
	 * payMethod: 支付方式 int 0：仅支持在线支付（默认）；1：仅支持线下支付；2：都支持
	 * needInputTableName: 下单时需要输入桌号 int 0：不需要；1：需要
	 * supportInvoice: 提供发票 int 0：不需要;1:需要（默认）
	 * supportCommitToSoftware: 支持下单到餐饮软件 0：不支持（默认）；1：支持
	 * payMethodAtShop: 店内支付方式 int 0：均不支持（默认）；1：直接输入金额付款；2：扫码付款；3：均支持
	 * checkSpotOrder: 顾客可通过手机结账 int 0: 不支持；1:支持
	 * payBeforeCommit: 支付完成后才能下单 int 0：不支持（不支持）；1：支持
	 * fetchFoodMode : 取餐模式 int 0：流水号模式（默认）；1：牌号模式；2：收银台直接出餐
	 * commitSafeLevel：下单验证 int  1：不验证（默认） ； 2：在餐厅一定范围外需验证 ；3:必须验证
     * foodUITemplate ：菜品展示模式 int 1：列表模式（默认）；2：大图模式 ； 3：瀑布流模式
     * adsID ：软文介绍  int 0 未设置（默认）
     *
	 */
	Hualala.TypeDef.ShopBusiness = [
		{id : 41, label : "店内自助", name : "spot_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setSpotOrderParams',
			// formKeys : 'fetchFoodMode,payMethodAtShop,payBeforeCommit,supportCommitToSoftware',
			//formKeys : 'foodUITemplate,checkSpotOrder,commitSafeLevel,payBeforeCommit,supportCommitToSoftware',
			operationMode : {
				// 正餐
				// 0 : 'payMethodAtShop,payBeforeCommit,supportCommitToSoftware',
				// @Note for 1.1 delete supportCommitToSoftware(#4105)
				0 : 'foodUITemplate,payBeforeCommit,commitSafeLevel,adsID',
				// 快餐
				// @Note for 1.1 delete supportCommitToSoftware(#4105)
				1 : 'foodUITemplate,fetchFoodMode',
				2 : 'foodUITemplate,payBeforeCommit,commitSafeLevel,adsID'
			}
		},
		{
			id : 10, label : "订座点菜", name : "commonreserve_order", businessIsSupported : true, 
			callServer : 'Hualala.Global.setCommonReserveParams',
			formKeys : 'foodUITemplate,advanceTime,noticeTime,minAmount,reserveTableTime,reserveTableDesc,payMethod,adsID'
		},
		{id : 11, label : "闪吃", name : "justeat_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setJustEatParams',
			formKeys : 'foodUITemplate,advanceTime,noticeTime,minAmount,holidayFlag,servicePeriods,reserveTableTime,reserveTableDesc,payMethod,adsID'
		},
		{id : 20, label : "外送", name : "takeaway_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setTakeAwayParams',
			// formKeys : 'advanceTime,noticeTime,minAmount,serviceAmount,freeServiceAmount,holidayFlag,servicePeriods,takeawayDeliveryAgent,takeawayDeliveryTime,takeawayScope,takeawayScopeDesc,payMethod'
			formKeys : 'foodUITemplate,holidayFlag,servicePeriods,servicePeriods2,advanceTime,noticeTime,takeawayDeliveryTime,minAmount,serviceAmount,freeServiceAmount,takeawayScope,payMethod,adsID'
		},
		{id : 21, label : "自提", name : "takeout_order", businessIsSupported : true,
			callServer : 'Hualala.Global.setTakeOutParams',
			// formKeys : 'advanceTime,freeServiceAmount,holidayFlag,minAmount,serviceAmount,servicePeriods,noticeTime,payMethod'
			formKeys : 'foodUITemplate,holidayFlag,servicePeriods,servicePeriods2,noticeTime,advanceTime,minAmount,payMethod,adsID'
		},
		{id : 1000, label : "会员卡", name : "crm", businessIsSupported : true, callServer : null, formKeys : null},
		{id : 2000, label : "老板通", name : "bi", businessIsSupported : true, callServer : null, formKeys : null}
		// {id : 42, label : "店内买单", name : "spot_pay"}
	];

	/**
	 * 店铺业务状态切换的相关提示消息
	 * @type {Array}
	 * 10：常规预订，11：闪吃，20：外送，21：到店自提，41：店内点菜，42：店内买单，1000: 会员卡，2000: 老板通
	 * title : 业务名称
	 * id : 业务ID
	 * desc : 业务说明信息
	 * switchOn : 开启操作的确认文字
	 * switchOff : 关闭操作的确认文字
	 */
	Hualala.TypeDef.ShopBusinessSwitcherTips = [
		{
			id : 41, name : "spot_order", title : "店内自助", 
			desc : "开启此功能后顾客到店即可通过手机扫描二维码进行自助点菜、自助结账，此项功能将有效的缓解服务人员少、服务量大的问题，提升顾客体验、提升点菜、结账效率", 
			switchOn : "开启此功能请确保店内餐饮软件与哗啦啦接口打通，并已在店内安装了哗啦啦代理程序否则顾客将无法使用此功能！", 
			switchOff : "关闭此功能将导致顾客无法通过手机进行自助点菜结账！"
		},
		{
			id : 10, name : "commonreserve_order", title : "订座点菜", 
			desc : "开启此功能后顾客可通过手机或网上随时预订本店桌台、提前点菜、提前支付", 
			switchOn : "开启此功能请确保店内已安装了哗啦啦代理程序，否则将无法接收到顾客预订订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下预订订单！"
		},
		{
			id : 11, name : "justeat_order", title : "闪吃", 
			desc : "开启此功能后顾客可通过手机提前点菜、支付并填写到店就餐时间，店内收到订单通知后提前备餐，顾客到店就能就餐，吃完就闪。这项服务大大节省了顾客的就餐时间，服务体验明显提升", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则将无法接受顾客闪吃订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下闪吃订单，将丢失需要快速就餐的顾客！"
		},
		{
			id : 20, name : "takeaway_order", title : "外送", 
			desc : "开启此功能后顾客可通过手机下外卖订单，避免了订餐电话占线、接线口音、手写记录错误等诸多问题，让店内外卖业务不堵塞更顺畅高效", 
			switchOn : "开启此功能请确保店内已安装了哗啦啦代理程序，否则将无法接收到顾客外卖订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下外卖订单！"
		},
		{
			id : 21, name : "takeout_order", title : "自提", 
			desc : "开启此功能后顾客可通过手机提前点菜支付下单，并告知到店自取时间，店内收到订单通知后提前备餐，顾客到店即可提取", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则将无法接受顾客自提订单！", 
			switchOff : "关闭此功能将导致顾客无法通过网上下自提订单！"
		},
		
		{
			id : 1000, name : "crm", title : "会员卡", 
			desc : "开启此功能后，顾客即可随时随地自助注册成为会员，在线储值、卡余额核销、查询卡信息等全自助操作，结合有效的运营策略您将看到会员数、消费粘性及储值快速增长。", 
			switchOn : "开启此功能请确保店内已经安装了哗啦啦代理程序，否则顾客将无法使用会员功能！", 
			switchOff : "关闭此功能将导致本店已有会员无法在本店享受会员服务（会员优惠、积分、卡余额支付等）！"
		},
		{
			id : 2000, name : "bi", title : "老板通", 
			desc : "开启此功能后餐厅老板即可通过《哗啦啦-饮食老板通》APP随时随地掌握本店营业实况、运营趋势等重要经营数据", 
			switchOn : "开启此功能需要店内餐饮软件与哗啦啦接口打通，并已在店内安装了哗啦啦代理程序否则将无法使用此功能！", 
			switchOff : "关闭此功能将导致老板在《哗啦啦-饮食老板通》APP中无法查到本店数据信息！"
		}
	];

	Hualala.TypeDef.PayMethodOptions = [
		{value : 0, label : "仅支持在线支付"},
		{value : 1, label : "仅支持线下支付"},
		{value : 2, label : "线上及线下支付均支持"},
	];

	Hualala.TypeDef.PayMethodAtShopOptions = [
		{value : 0, label : "均不支持"},
		{value : 1, label : "直接输入金额付款"},
		{value : 2, label : "扫码付款"},
		{value : 3, label : "均支持"}
	];

	Hualala.TypeDef.FetchFoodModeOptions = [
		{value : 0, label : "流水号模式"},
		{value : 1, label : "牌号模式"},
		{value : 2, label : "收银台直接出餐"}
	];

	Hualala.TypeDef.HolidayFlagOptions = [
		{value : 0, label : "工作日及节假日均开放"},
		{value : 1, label : "仅节假日开放"},
		{value : 2, label : "仅工作日开放"}
	];

	Hualala.TypeDef.PayBeforeCommitOptions = [
		{value : 0, label : "餐后结账"},
		{value : 1, label : "餐前结账"}
		
	];
	//菜品展示模式
	Hualala.TypeDef.foodUITemplateOptions = [
		{value : 1, label : "列表模式"},
		{value : 2, label : "大图模式"},
		{value : 3, label : "瀑布流模式"}
	];
    //下单安全级别设置
    Hualala.TypeDef.CommitSafeLevelOptions = [
    	{value : 1, label : "不验证"},
    	{value : 2, label : "在餐厅一定范围外需验证"},
    	{value : 3, label : "必须验证"}
    ];
    //软文设置
    Hualala.TypeDef.adsIDOptions = [
    	{value : 0, label : "未设置" }
    	
    	
    ];
	/**
	 * 获取一天(默认)的时间间隔选项数据
	 * 1小时内，时间间隔15分钟
	 * 1-3小时内，时间间隔30分钟
	 * 3-12小时内，时间间隔3小时
	 * 24小时以上，时间间隔24小时
	 * @param {NULL | int} endMin 结束的分钟数
	 * @return {Array} 时间间隔选项数据[{value : minutes, label : 'time format string'}]
	 */
	Hualala.TypeDef.MinuteIntervalOptions = function (endMin) {
		var start = 0, end = endMin || Hualala.Constants.SecondsOfDay / 60, gap = 15, i = 1;
		var list = [], cur = 0, minsOfHour = Hualala.Constants.SecondsOfHour / 60,
			minsOfDay = minsOfHour * 24;
		var formatTime = function (m) {
			if (m == 0) return '不限';
			var day = m % minsOfDay == 0 ? m / minsOfDay : 0;
				hour = (m < minsOfHour || m % minsOfDay == 0) ? 0 : (m == minsOfHour) ? 1 : parseInt(m / minsOfHour),
				min = m % minsOfHour;
			return (day == 0 ? '' : day + '天') + (hour == 0 ? '' : hour + '小时') + (min == 0 ? '' : (min + '分钟'));
		};
		while(cur <= end) {
			list.push({
				value : cur,
				label : formatTime(cur)
			});
			if (cur < minsOfHour) {
				cur += gap * i;
			} else if (cur < minsOfHour * 3) {
				i = 2;
				cur += gap * i;
			} else if (cur < minsOfHour * 12) {
				i = 4 * 3;
				cur += gap * i;
			} else if (cur <= minsOfHour * 24) {
				i = 4 * 12;
				cur += gap * i;
			}
		}
		return list;
	};
	/*银行代码列表*/
	Hualala.TypeDef.BankOptions = [
		{
			value: "CBC",
			label: "中国建设银行"
		},
		{
			value: "BC",
			label: "中国银行"
		},
		{
			value: "ABC",
			label: "中国农业银行"
		},
		{
			value: "ICBC",
			label: "中国工商银行"
		},
		{
			value: "PSBC",
			label: "中国邮政储蓄"
		},
		{
			value: "CEBB",
			label: "中国光大银行"
		},
		{
			value: "CGB",
			label: "广发银行"
		},
		{
			value: "CMB",
			label: "招商银行"
		},
		{
			value: "CMBC",
			label: "民生银行"
		},
		{
			value: "CDB",
			label: "国家开发银行"
		},
		{
			value: "CIB",
			label: "兴业银行"
		},
		{
			value: "BCM",
			label: "交通银行"
		},
		{
			value: "HXB",
			label: "华夏银行"
		},
		{
			value: "SPDB",
			label: "浦发银行"
		},
		{
			value: "HSBC",
			label: "汇丰银行"
		},
		{
			value: "Other",
			label: "其它"
		}
	];

	/*用户账号状态*/
	Hualala.TypeDef.UserStatus = [
		{value : 0, label : "停用"},
		{value : 1, label : "正常"}
	];

	Hualala.TypeDef.MCMDataSet = {
		/*礼品类型*/
		GiftTypes : [
			{value : '', label : "全部"},
			{value : 10, label : "电子代金券", type : 'voucher', unit : '元', bgColor : "#ff6600",
				 navs : [
				 	{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"},
				 	{label : "赠送", value : "tab_give"},
				 	{label : "支付", value : "tab_pay"},
				 	{label : "网上出售", value : "tab_onlinesale"}
				 ]
			},
			// {value : 20, label : "菜品优惠券"},
			// {value : 30, label : "实物礼品"},
			{value : 40, label : "会员充值", type : 'card', unit : '元', bgColor : "#cc0000",
				navs : [
					{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"}
				]
			},
			{value : 42, label : "会员积分", type : 'point', unit : '点', bgColor : "#009999",
				navs : [
					{label : "发送数", value : "tab_send"},
				 	{label : "使用数", value : "tab_used"}
				]
			}
		],
		/*礼品发出方式*/
		GiftDistributeTypes : [
			{value : "", label : "全部"},
			{value : "10", label : "消费返券", include : true},
			{value : "20", label : "摇奖活动", include : true},
			{value : "30", label : "积分摇奖", include : true},
			{value : "40", label : "积分兑换", include : true},
			{value : "50", label : "订单摇奖"},
			{value : "60", label : "免费领取", include : true},
			{value : "70", label : "商家赠送", include : true},
			{value : "80", label : "商家支付", include : true},
			{value : "90", label : "商家卖出", include : true},
			{value : "91", label : "会员摇奖"},
			{value : "92", label : "免费领取"},
			{value : "93", label : "积分兑换"},
			{value : "94", label : "参与活动"},
			{value : "95", label : "有奖竞猜"},
			{value : "96", label : "套餐充值"}
		],
		/*礼品使用状态*/
		GiftStatus : [
			{value : "", label : "全部"},
			{value : "1", label : "可使用"},
			{value : "2", label : "已使用"},
			{value : "3", label : "已过期"},
			{value : "4", label : "已退订"}
		],
		/*礼品业务支持*/
		GiftSupportOrderTypes : [
			{value : 2, label : "全部支持"},
			{value : 0, label : "堂食"},
			{value : 1, label : "外送"}
		],
		/*礼品使用时段限制*/
		GiftUsingTimeTypes : [
			{value : "1", label : "早餐"},
			{value : "2", label : "午餐"},
			{value : "3", label : "下午茶"},
			{value : "4", label : "晚餐"},
			{value : "5", label : "夜宵"}
		],
		/*实物礼品派发状态*/
		GiftIsSended : [
			{value : "0", label : "待发送"},
			{value : "1", label : "已发送"}
		],
		/*消费金额限制类型*/
		GiftMonetaryLimitTypes : [
			{value : "0", label : "不限"},
			{value : "1", label : "每满"},
			{value : "2", label : "满"}
		],
		/*电子礼品类，是否支持线下使用*/
		GiftIsOfflineUsing : [
			{value : "0", label : "不支持"},
			{value : "1", label : "支持"}
		],
		/*电子礼品类，节假日使用限制*/
		GiftIsHolidayUsing : [
			{value : "0", label : "不限制"},
			{value : "1", label : "不含节假日"},
			{value : "2", label : "仅节假日"}
		],
		/*电子礼品类，菜品范围限制*/
		GiftFoodScope : [
			{value : "0", label : "不限"},
			{value : "1", label : "仅可打折菜品"}
		],
		/*礼品审核状态*/
		GiftAuditStatus : [
			{value : "0", label : "未提交审核"},
			{value : "1", label : "审核未通过"},
			{value : "2", label : "审核通过"},
			{value : "3", label : "审核中"}
		],
		/*营销活动类型定义*/
		EventTypes : [
			{value : "", label : "全部"},
			{value : "20", label : "摇奖活动", type : "lucky-joy", bgColor : "rgb(204, 0, 0)"},
			{value : "21", label : "免费领取", type : "free-get", bgColor : "rgb(102, 153, 0)"},
			{value : "22", label : "报名活动", type : "apply-evt", bgColor : "rgb(102, 51, 102)"},
			{value : "30", label : "积分兑换", type : "credit-exchange", bgColor : "rgb(0, 153, 204)"},
			{value : "40", label : "营销红包", type : "marketing-redenvelope", bgColor : "rgb(156, 111, 109)"},
			{value : "41", label : "消费红包", type : "consume-redenvelope", bgColor : "rgb(199, 148, 148)"}
		],
		/*营销活动摇奖方式*/
		EventLuckJoyTypes : [
			{value : "0", label : "大转盘"},
			{value : "1", label : "老虎机"},
			{value : "2", label : "刮刮卡"}
		],
		/*营销活动用户参与终端限制*/
		EventJoinClientTypes : [
			{value : "0", label : "不限制"},
			{value : "1", label : "仅限PC客户端"},
			{value : "2", label : "仅限手机客户端"},
			{value : "3", label : "仅限Pad客户端"},
			{value : "4", label : "仅限手机和Pad客户端"}
		],
		/*营销活动用户参与范围*/
		EventJoinUserRange : [
			{value : "0", label : "不限制"},
			{value : "1", label : "仅限绑定手机号码的用户"},
			{value : "2", label : "仅限在本集团订过餐的用户"}
		],
		/*营销活动开关*/
		EventIsActive : [
			{value : "", label : "不限"},
			{value : "0", label : "未启用"},
			{value : "1", label : "已启用"}
		],
		/*营销活动状态定义*/
		EventStatus : [

		],
		EventCardLevels : [
			// {value : "-1", label : "所有顾客参与（含非会员）"},
			{value : "0", label : "全部会员"}
		],
		EventCountCycleDays : [
			{value : 0, label : "不限次数"},
			{value : 1, label : "限制次数"},
			{value : 2, label : "限制参与次数的周期"}
		],
		IsVIPBirthdayMonth : [
			{value : 0, label : "不限制"},
			{value : 1, label : "仅本月生日的会员可参与"}
		],
		WinTypes : [
			{value : '', label : "不限"},
			{value : '0', label : "未中奖"}
		],
		JoinTypes : [
			{value : '', label : "不限"},
			{value : '0', label : "未入围"},
			{value : '1', label : "已入围"}
		]

	};

	

    Hualala.TypeDef.CRM = {
        //会员来源类型
        sourceType: {
            '10': 'WEB网站',
            '12': 'APP客户端',
            '14': '触屏版',
            '20': '店内',
            '22': '原会员导入',
            '30': '微信',
            '40': '淘宝',
            '50': '百度'
        },
        //会员来源途径
        sourceWay: { '0': '线下', '1': '线上' },
        transWay: { '0': '线下', '1': '线上' },
        //会员卡状态类型
        cardStatus: {
            '10': '正常',
            '20': '挂失中',
            '30': '冻结',
            '40': '注销'
        },
        //会员性别类型
        customerSex: { '0': '女', '1': '男', '2': '未知' },
        //会员交易类型
        transType: {
            '10': '初始转入', 
            '20': '储值', 
            '30': '消费', 
            '50': '活动赠积分', 
            '60': '积分兑换', 
            '70': '积分清零', 
            '80': '活动赠余额', 
            '90': '消费撤销'
        },
        //会员活动类型
        eventWay: {
            '20': '摇奖', 
            '21': '领取', 
            '22': '报名', 
            '24': '有奖竞答', 
            '30': '积分兑换'
        },
        //会员优惠券获取方式
        getWay: {
            '10': '消费返券',
            '20': '摇奖活动', 
            '30': '积分摇奖', 
            '40': '积分兑换', 
            '50': '订单摇奖',
            '60': '免费领取',
            '70': '商家赠送',
            '80': '商家支付',
            '90': '换卡转入 ',
            '91': '会员摇奖',
            '92': '免费领取',
            '93': '积分兑换',
            '94': '参与活动',
            '95': '有奖竞猜',
            '96': '套餐充值',  
            '100': '批量导入'
        },
        //会员优惠券状态
        giftStatus: { '1': '未使用', '2': '已使用', '3': '已过期', '4': '已退订' },
        //会员卡日志类型
        logType: {
            '0': '其它', 
            '10': '挂失', 
            '11': '解除挂失', 
            '20': '冻结', 
            '21': '解冻', 
            '30': '注销', 
            '31': '激活', 
            '40': '卡遗损补办', 
            '41': '换手机号', 
            '42': '补办实体卡', 
            '50': '转让', 
            '60': '升级', 
            '61': '降级'
        }
    };
    /**
	 * 是否内置渠道
	 * 0：内置渠道 1：不是内置渠道
	 * 
	 */
	Hualala.TypeDef.ChannelStatus = [
		{value : 0, label : "是"},
		{value : 1, label : "否"}
	];
	/**
	 * 部门类型
	 * 0：未知 1：出品部门 2：领料部门 3：出品及领料部门
	 * 
	 */
	Hualala.TypeDef.SaasDepartmentType = [
		{value : 0, label : "未知"},
		{value : 1, label : "出品部门"},
		{value : 2, label : "领料部门"},
		{value : 3, label : "出品及领料部门"}
	];
	/**
	 * 打印类型
	 * 0：不打印 1：一菜一单 2：多菜一单
	 * 
	 */
	Hualala.TypeDef.SaasPrintType = [
		{value : 0, title : "不打印"},
		{value : 1, title : "一菜一单"},
		{value : 2, title : "多菜一单"}
	];
	/**
	 *saas备注类型
	 *10：点单备注 20：作法 30：口味 40：退菜原因 50：增菜原因
	 *60：改价原因 70：改单原因  80：预订退订原因  90：外卖退单原因
	 */
	Hualala.TypeDef.SaasNotesType =[
		{value : "10",  label: "点单备注" },
		{value : "20",  label: "作法" },
		{value : "30",  label: "口味" },
		{value : "40",  label: "退菜原因" },
		{value : "50",  label: "增菜原因" },
		{value : "60",  label: "改价原因" },
		{value : "70",  label: "改单原因" },
		{value : "80",  label: "预订退订原因" },
		{value : "90",  label: "外卖退单原因" }
	];
	/**
	 *saas备注加价方式
	 *0：不加价 1：固定加价 2：按数量加价 3：按人数加价 
	 *
	 */
	Hualala.TypeDef.SaasaddPriceType =[
		{value : 0,  label: "不加价" },
		{value : 1,  label: "固定加价" },
		{value : 2,  label: "按数量加价" },
		{value : 3,  label: "按人数加价" }
	]

})(jQuery);











;(function ($) {
	IX.ns("Hualala.Constants");
	
	IX.extend(Hualala.Constants, {
		NameOfDay : ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		SecondsOfHour : 3600,
		SecondsOfDay : 24 * 3600,
		SecondsOfWeek : 7 * 24 * 3600,
		NumberKeys : [1,2,3,4,5,6,7,8,9,0],
		Alphabet : 'abcdefghijklmnopqrstuvwxyz'.split(''),
		PersonUnit : "人",
		CashUnit : "元"
	});
})(jQuery);;(function ($, window) {
	/**
	 * 实现前端Javascript的Router功能
	 * 使用一个单体Router进行实现。所以不适用于需要多个router的项目
	 * 优点：不需要在对象与对象之间传递router，也不用担心如何创建router
	 * 功能：
	 * 		1.支持散列输入的URL, 例如http://site.com#shop/list
	 * 		2.能够支持History API，但是要向后兼容，如果不支持History API的老版浏览器，我们需要使用location进行兼容
	 * 		3.提供简单可用的接口
	 * 		4.不会自动运行
	 * 		5.自动监听地址变化
	 * 		6.采用单体模式
	 * @type {Object}
	 */
	var Router = {
		// 用于保存当前已经注册的路由
		routes : [],
		// 使用模式，包含（hash|history）两个选项，用来判断router实现是否使用History API
		mode : null,
		// 应用的根路径。只有当使用pushState时，才有用处
		root : '',
		/**
		 * 配置：用于启动router
		 * @param  {Object} options {mode, root}
		 * @return {Router}         单体自身，用于链式调用
		 */
		config : function (options) {
			// 设定模式，只有支持pushState方法的，才可以使用History API，否则一律使用hash模式
			this.mode = $XP(options, 'mode', 'history') == 'history' && !!(history.pushState) ? 'history' : 'hash';
			// hash模式下，root才有使用，利用clearSlashes，删除掉options.root传入的URL的‘/’
			this.root = options && options.root ? ('/' + this.clearSlashes(options.root) + '/') : '/';
		},
		/**
		 * 获取当前URL，我们有两种模式，使用History API与location hash，所以要使用分支判断
		 * @return {[String]} 返回当前URL
		 */
		getFragment : function () {
			var fragment = '';
			if (this.mode == 'history') {
				fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
				// history模式下，需要删除所有get参数
				fragment = fragment.replace(/\?(.*)$/, '');
				// add hash part by huhao
				fragment = fragment + location.hash;

				// history模式下，需要将root部分删除
				fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
			} else {
				var match = window.location.href.match(/#(.*)$/);
				fragment = match ? match[1] : '';
			}
			return this.clearSlashes(fragment);
		},
		clearSlashes : function (path) {
			return path.toString().replace(/\/$/, '').replace(/^\//, '');
		},
		/**
		 * 添加路由
		 * 如果只传递一个方法，我们把它当做一个默认路由处理器,并把路由当做一个空字符串
		 * @param {String} re      路由匹配的规则（可以是实际的路由，也可以是正则字串）
		 * @param {Function} handler 路由的处理器
		 * @return {Router} 单体自身，用于链式调用
		 */
		add : function (re, handler) {
			if (IX.isFn(re)) {
				handler = re;
				re = '';
			}
			this.routes.push({re : re, handler : handler});
			return this;
		},
		/**
		 * 删除路由
		 * 传递一个合法的正则表达式或者handler处理器就可以删除路由
		 * @param  {regular|function} param 正则表达式|处理方法
		 * @return {Router}       单体自身，用于链式调用
		 */
		remove : function (param) {
			for (var i = 0, r, l = this.routes.length; i < l, r = this.routes[i]; i++) {
				if (r.handler === param || r.re === param) {
					this.routes.splice(i, 1);
					return this;
				}
			}
			return this;
		},
		/**
		 * 重置Router
		 * @return {Router} 
		 */
		flush : function () {
			this.routes = [];
			this.mode = null;
			this.root = '/';
			return this;
		},
		/**
		 * 比对注册的路由
		 * 可以使用传入的路由，也可以使用getFragment方法获取当前的路由，
		 * 然后循环查找进行匹配
		 * @param  {String} f 传入的路由
		 * @return {Router}       单体自身，用于链式调用
		 */
		check : function (f) {
			var fragment = f || this.getFragment();
			for (var i = 0, l = this.routes.length; i < l; i++) {
				var match = fragment.match(this.routes[i].re);
				if (match) {
					match.shift();
					this.routes[i].handler.apply({}, match);
					return this;
				}
			}
			return this;
		},
		/**
		 * 监控变化
		 * 我们不需要手动的不停运行check方法，我们需要一个地址栏发生变化时，通知我们的逻辑。
		 * 这种变化包括触发浏览器的返回、前进按钮。
		 * History API中的popstate事件，他是URL发生变化时执行的回调。但是一些浏览器在页面加载的时候不会触发这个事件。
		 * 同时，在mode被设定为hash的时候，我们也要执行监控，所以可以采用setInterval来轮询监控状态
		 * @return {Router}       单体自身，用于链式调用
		 */
		listen : function () {
			var self = this;
			// 我们需要保存一个当前的URL用于比较
			var current = self.getFragment();
			var fn = function () {
				if (current !== self.getFragment()) {
					current = self.getFragment();
					self.check(current);
				}
			};
			clearInterval(this.interval);
			this.interval = setInterval(fn, 50);
			return this;
		},
		/**
		 * 改变路由（URL）
		 * @param  {String} path 路由路径
		 * @return {Router}       单体自身，用于链式调用
		 */
		navigate : function (path) {
			path = path || '';
			if (this.mode == 'history') {
				// history.pushState(null, null, this.root + this.clearSlashes(path));
				history.pushState(null, null, this.root + "#" + this.clearSlashes(path));
			} else {
				window.location.href.match(/#(.*)$/);
				window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
			}
			return this;
		}
	};
	IX.ns('Hualala');
	Hualala.Router = Router;
})(jQuery, window);;/* 模糊拼音匹配算法
首次使用:
var p = new Pymatch([{id:1,name:"张三",py:"zhang;san"},{id:2,name:"李四",py:"li;si"},{id:5,name:"张JohnSmith李Mary四",py:"zhang;li;si"},{id:8,name:"查理",py:"cha,zha;li"}])
多音字的不同拼音用','分隔，如前面的"cha,zha"
直接匹配:
p.match("zs")相当于p.clear();p.input("zs");return p.get_match()
当用户开始输入:
p.input('z')
p.input('h')
p.input('an')
p.input('gsa')
p.input('n')
p.input("李四")
当用户回退:
p.back(1) // 回到输入了"zhangsan李"的状态
p.back(3) // 回到输入了"zhangs"的状态
清空所有输入:
p.clear()
当用户的联系人列表变化时(会自动清空所有输入):
p.setNames([{name:"张三",py:"zhang;san"},{name:"李四",py:"li;si"},{name:"张JohnSmith李Mary四",py:"zhang;li;si"},{name:"王二",py:"wang;er"}])

p的内部数据结构
rnames:[{id:1,...}, {id:2,...}, {id:5,...}, {id:8,...}, {id:9,...}], // ===原始的setNames设定的names
names:[["张三",["zhang"],["san"]],["李四",["li"],["si"]],["王三表",["wang"],["san"],["biao"]],[["张月五"],["zhang"],["yue"],["wu"]],["张;", ["zhang"], ["mary"]],["查理",["cha","zha"],["li"]]],
pyidx:{
z:[0,0,3,0,4,0], // 下标0,2,4,6,...表示z出现的名字在names中的位置
s:[0,1,1,1,2,1],
'ln':[1,0],
w:[2,0,3,2],
b:[2,2],
y:[3,1],
m:[4,1]
}
idx:{
张:[0,0,3,0,4,0],
三:[0,1,2,1],
李:[1,0],
四:[1,1],
王:[2,0],
表:[2,2],
月:[3,1],
五:[3,2]
}
*/
var Pymatch=(function(){
  function constructor(name2pys) { this.setNames(name2pys); }

  var simpy = { 'l': 'ln', 'n': 'ln' };
  var W_hzmatch = 1.2, // 汉字整字匹配权重
      W_first_exactly_match = 0.3, // 首字母精确匹配权重
      W_other_match = 1 - W_first_exactly_match, // 其它字母匹配权重
      W_fuzzy_match = 0.0, // 首字母模糊匹配权重
      W_zcs_match_zhchsh = 0.1; // 输入的zcs匹配拼音的zhchsh权重

  // 检查a,b是否模糊匹配
  function is_sim(a, b) {
    var sa=simpy[a];
    if(sa) {
      var sb = simpy[b];
      return sb && sa==sb;
    }
    return false;
  }

  function getAlt(py) {
    var c1 = py.charAt(0), c2;
    if(c1=='z' || c1=='c' || c1=='s') {
      c2 = py.charAt(1);
      return c1 + (c2 == 'h'? py.substr(2) : 'h' + py.substr(1));
    }
    var sc = simpy[c1];
    if(!sc) return false;
    c2 = sc.charAt(0);
    return (c2 == c1? sc.charAt(1): c2) + py.substr(1);
  }

  function split2(s, pinyin, cache) {
    var n=s.length, a=[];
    var t = s.charAt(0);
    if(t<'a' || t>'z') {
      if(n<=1)
        a = [[t]];
      else {
        var r = s.substr(1);
        var b = cache[r];
        if(b==undefined)
          b = split2(r, pinyin, cache);
        if(b) {
          if(b.length <= 1) b = b[0];
          a = [[t].concat(b)];
        }
      }
    }
    else {
      for(var k=1; k<=n; ++k) {
        t = s.substr(0, k);
        if(!pinyin[t])
          break;
        if(k<n) {
          var r = s.substr(k);
          var b = cache[r];
          if(b==undefined)
            b = split2(r, pinyin, cache);
          if(!b) continue;
          if(b.length <= 1) b = b[0];
          a.unshift([t].concat(b));
        }
        else
          a.unshift([t]);
      }
    }
    if(a.length <= 0)
      a = false;
    cache[s] = a;
    return a;
  }

  /* 检查拼音前缀是否和多音字的某个发音匹配
   pyprefix-拼音前缀
   pys-数组,每个元素是多音字的一个拼音
   isHz-true表示处理汉字模糊匹配, false不处理
   返回: false-不匹配, 浮点数-匹配度
   */
  function pymatch(pyprefix, pys, isHz) {
    var n = pys.length, i, k = pyprefix.length;
    for(i=0; i<n; ++i) {
      var py = pys[i];
      if(py.substr(0,k)==pyprefix) {
        var v = py.length-1;
        return v<=0? W_first_exactly_match: (W_first_exactly_match+W_other_match*(k-1)/v);
      }
    }

    if(isHz) {
      var alt = getAlt(pyprefix);
      if(!alt) return false;
      k = alt.length;
      for(i=0; i<n; ++i) {
        var py = pys[i];
        if(py.substr(0,k)==alt) {
          var v = py.length-1, m=W_fuzzy_match;
          var c1 = py.charAt(0);
          if(c1=='z'||c1=='c'||c1=='s') {
            m += W_zcs_match_zhchsh;
            var c2 = py.charAt(1);
            if(c2 == 'h') {
              k -= 1;
              v -= 1;
            }
          }
          if(v<=0)
            return m;
          return m+W_other_match*(k-1)/v;
        }
      }
    }
    return false;
  }

  /*
   pattern: split后的结果
   name: 数组, [0]是汉字名字, 从[1]开始是每个字的拼音数组(里面的元素是多音字的每个发音)
   i: 开始匹配的位置
   e: 结束匹配的位置(不含)
   inplace: false-一直向前找, true-就地匹配
   返回: false表示不匹配, [匹配位置, 匹配数, 匹配权重]
   */
  function pmatch(pattern, name, i, e, inplace) {
    if(!pattern) return false;
    var r, k=pattern.length, v=0;
    for(; v<k; ++v) {
      if(typeof(pattern[v])!="string")
        break;
    }
    while(i+v<=e) {
      var q = i, j=0, m=0.0;
      for(; j<v; ++j, ++q) {
        var p = pattern[j];
        var c = p.charAt(0);
        if(c>='a'&&c<='z') {
          r = pymatch(p, name[q], (name[0].charAt(q-1)!=';'));
          if(r===false) break;
          m += r;
        }
        else if(c == name[0].charAt(q-1))
          m += W_hzmatch;
        else
          break;
      }
      if(j>=v) {
        if(j>=k) return [i, v, m];
        for(; j<k; ++j) {
          var p = pattern[j];
          r = pmatch(p, name, q, e, true);
          if(r)
            return [i, v+r[1], m+r[2]];
        }
      }
      if(inplace) return false;
      ++i;
    }
    return false;
  }

  function match2(s, name, i, e) {
    if(s.length<=0) return false;

    if(i==undefined)
      i = 1;
    if(e==undefined)
      e = name.length;
    pinyin = {};
    for(var j=i; j<e; ++j) {
      var pys = name[j];
      var k = pys.length, m;
      var isHz = (name[0].charAt(j-1)!=';');
      for(m=0; m<k; ++m) {
        var py = pys[m];
        var n = py.length, v;
        for(v=1; v<=n; ++v)
          pinyin[py.substr(0,v)] = true;
        if(isHz) {
          var alt = getAlt(py);
          if(!alt) continue;
          n = alt.length;
          for(v=1; v<=n; ++v)
            pinyin[alt.substr(0,v)] = true;
        }
      }
    }

    var p = split2(s, pinyin, {});
    return pmatch(p, name, i, e, false);
  }

  // 匹配堆栈元素[idx, 匹配位置, 匹配数, 匹配权重]
  function input_c() {
    var k=this.stkp - 1;
    var i, n, a, b=[], t, ai;
    if(k<=0) {
      var c = this.instr[k];
      var is_py = (c>='a' && c<='z');
      if(is_py) {
        var sc = simpy[c];
        if(!sc) sc = c;
        a = this.pyidx[sc];
      }
      else
        a = this.idx[c];
      if(a) {
        n = a.length;
        for(i=0; i<n; i+=2) {
          var x = a[i], j=a[i+1], name=this.names[x];
          if(is_py) {
            var tpys = name[j+1];
            var tn = tpys.length, ti;
            var m = W_fuzzy_match; // 默认模糊匹配
            for(ti=0; ti<tn; ++ti) {
              var tpy = tpys[ti], d = tpy.charAt(0);
              if(c == d) {
                if(name[0].charAt(j)!=';' && (c=='z'||c=='c'||c=='s') && tpy.charAt(1)=='h')
                  m = W_zcs_match_zhchsh; // zcs匹配zh/ch/sh
                else
                  m = W_first_exactly_match; // 首字母精确匹配
                break;
              }
              if(is_sim(c, d))
                break;
            }
            if(ti>=tn) throw "Pymatch internal data error";
            t = [x, j+1, 1, m];
          }
          else
            t = [x, j+1, 1, W_hzmatch]; // 汉字整字匹配
          b.push(t);
        }
      }
    }
    else {
      a = this.stack[k-1];
      n = a.length;
      var s = this.instr.substr(0,k+1);
      for(i=0; i<n; ++i) {
        ai = a[i];
        var x = ai[0];
        t = match2(s, this.names[x], ai[1]);
        if(t)
          b.push([x].concat(t));
      }
    }
    this.stack[k] = b;
  }

  constructor.prototype = {
    setNames: function(name2pys) {
      this.rnames = name2pys;
      this.names = [];
      this.pyidx = {};
      this.idx = {};
      this.stack = [];
      this.instr = "";
      this.stkp = 0;

      var i, n = name2pys ? name2pys.length : 0;
      for(i=0; i<n; ++i) {
        var name2py = name2pys[i];
        var hz = name2py.name;
        var pys = name2py.py;
        pys = ((!pys || pys=="") ? []: pys.split(';'));
        var k=hz.length, j, m, nhz="", t=0, x=i;
        var searchLetter=true; // 0-正在寻找连续英文串的开始(大写或小写字母), 1-正在寻找结束
        for(j=0; j<k; ++j) {
          var c = hz.charAt(j);
          if(searchLetter) {
            if((c>='A' && c<='Z') || (c>='a'&&c<='z')) {
              searchLetter = false;
              m = j;
              continue;
            }
          }
          else {
            if(c>='a' && c<='z') continue;
            nhz += ';';
            pys.splice(t, 0, hz.substr(m, j-m).toLowerCase());
            ++t;
            if(c>='A' && c<='Z') {
              m = j;
              continue;
            }
            searchLetter = true;
          }
          if(nhz.indexOf(c) < 0) {
            var a = this.idx[c];
            if(a)
              a.push(x, t);
            else
              this.idx[c] = [x, t];
          }
          nhz += c;
          ++t;
        }
        if(!searchLetter) {
          nhz += ';';
          pys.splice(t, 0, hz.substr(m).toLowerCase());
          ++t;
        }
        var handledIdx={};
        for(j=0; j<t; ++j) {
          if(!pys[j])
          	continue;
			pys[j] = pys[j].split(',');
          var b = pys[j];
          var bn = b.length, bi;
          for(bi=0; bi<bn; ++bi) {
            var c = b[bi].charAt(0);
            var sc = simpy[c];
            if(sc) c = sc;
            if(handledIdx[c]) continue;
            var a = this.pyidx[c];
            if(a)
              a.push(x, j);
            else
              this.pyidx[c] = [x, j];
            handledIdx[c] = true;
          }
        }
        pys.unshift(nhz);
        this.names.push(pys);
      }
    },

    input: function(s) {
      var i, n=s.length;
      for(i=0; i<n; ++i) {
        var c = s.charAt(i);
        if(c==';') continue;
        var j = this.stkp;
        this.stkp = j+1;
        if(j>=this.instr.length || c != this.instr.charAt(j)) {
          if(c>='A' && c<='Z') c = c.toLowerCase();
          this.instr = this.instr.substr(0, j) + c;
          input_c.apply(this);
        }
      }
    },

    back: function(n) {
      var k = this.stkp;
      if(n<=k)
        this.stkp = k - n;
    },
    
    clear: function() { this.stkp = 0; },
    
    match: function(s) {
      this.clear();
      this.input(s);
      return this.get_match();
    },
    
    get_input: function() {
      return this.instr.substr(0,this.stkp);
    },
    
    get_match: function() {
      var k = this.stkp;
      if(k<=0) return [];
      var a = this.stack[k-1];
      var n = a.length, b=[];
      for(var i=0; i<n; ++i) {
        var ai = a[i], x = ai[0], e = this.names[x][0].length;
        // 第一个字母匹配的位置加权系数1.0, 出现的越早越好
        b.push([this.rnames[x], (ai[3] + (e - ai[1] + 1)/e)/e]);
      }
      b.sort(function(x,y){return y[1]-x[1];});
      return b;
    }
  };

  return constructor;
}());
;/*!
Math.uuid.js (v1.4)
http://www.broofa.com
mailto:robert@broofa.com

Copyright (c) 2010 Robert Kieffer
Dual licensed under the MIT and GPL licenses.
*/

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix)
 *   length - the desired number of characters
 *   radix  - the number of allowable values for each character.
 *
 * EXAMPLES:
 *   // No arguments  - returns RFC4122, version 4 ID
 *   >>> Math.uuid()
 *   "92329D39-6F5C-4520-ABFC-AAB64544E172"
 *
 *   // One argument - returns ID of the specified length
 *   >>> Math.uuid(15)     // 15 character ID (default base=62)
 *   "VcydxgltxrVZSTV"
 *
 *   // Two arguments - returns ID of the specified length, and radix. (Radix must be <= 62)
 *   >>> Math.uuid(8, 2)  // 8 character ID (base=2)
 *   "01001010"
 *   >>> Math.uuid(8, 10) // 8 character ID (base=10)
 *   "47473046"
 *   >>> Math.uuid(8, 16) // 8 character ID (base=16)
 *   "098F4D35"
 */
(function() {
  // Private array of chars to use
  var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  Math.uuid = function (len, radix) {
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  };

  // A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
  // by minimizing calls to random()
  Math.uuidFast = function() {
    var chars = CHARS, uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  };

  // A more compact, but less performant, RFC4122v4 solution:
  Math.uuidCompact = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
})();
;// Hualala.Matcher
(function(){
	IX.ns("Hualala");
	
	//支持的语言种类
	var langs = "zh-cn,zh-tw,en,";
	/*
		var matcher = new Matcher();
		matcher.match
			params : key  匹配条件
					 callback 回调 参数 infolist[{id,name,py}......]
					 lang 语言种类 但不会改变config.lang
		matcher.refresh	刷新匹配文件
	*/
	Hualala.Matcher = function(cfg){
		var config = $.extend(true, {
			lang : "zh-cn"
		}, cfg);

		var _matcher = new Pymatch([]);

		var _loadMatchConfig = function(lang, callback){
			//IX.Net.loadFile("../" + lang + ".json", function(rspTxt){});
			callback && callback();
		};

		var _match = function(key,data, callback){
			_matcher.setNames(data);
			callback.call(null,_matcher.match(key));	
		};
		_loadMatchConfig(config.lang);

		return {
			match: function(key, data, callback, lang){
				if(lang && langs.indexOf(lang + ",") > -1){
					_loadMatchConfig(lang, function(){
						_match(key,data, callback);
					});
				}else{
					_match(key, data, callback);
				}
			},
			refresh:function(lang){
				lang = lang && langs.indexOf(lang + ",") > -1 ? lang : config.lang;
				_loadMatchConfig(config.lang);
			}
		};
	};
})();
