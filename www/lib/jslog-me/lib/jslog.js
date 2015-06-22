/*global define, global, amd, window*/
/*jslint white: true*/
/*jshint multistr: true */
(function(f, define){
    'use strict';
    define([], f);
})(function() {
    'use strict';
    var JsLogExport,
        LOGGER_HOST = 'jslog.me',
        LOGGER_PATH = '/log',
        LOGGER_URL = '//'+LOGGER_HOST+LOGGER_PATH,
        SEND_POSTPONE_INTERVAL = 10000,
        SERVER_REQUEST_TIMEOUT = 10000,
        MAX_PACKET_SIZE = 4*1024*1024,
        MAX_PENDING_PACKET_SIZE = 5240,
        DEFAULT_MAX_POSTPONE_SIZE = 1024*1024,
        JSLOG_ME_LOCALSTORAGE = 'JSLOG_ME_POSTPONED_ITEMS',
        DEFAULT_PROTOCOL = 'http:',
        consoleHookSet = false,
        hostId;
    (function(){

        function JsLogOptions() {
            this.enabled = true;
            this.logUncaughtExceptions = true;
            this.hookConsole = true;
            this.trackHost = true;
            this.collectSystemInfo = true;
            this.trackLaunches = true;
            this.key = '';
            this.version = '';
            this.sessionId = this.guid();
        }

        JsLogOptions.prototype.guid = (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
            };
        })();

        function SenderService() {
            this.inOperation = false;
            this.xmlHttpRequest = createRequest();
            this.http = null;
            if (!this.xmlHttpRequest) {
                try {
                    this.http = require('http');
                } catch(e) {
		    this.http = null;
                }
            }

        }

        SenderService.prototype.sendXmlHttpRequest = function(protocol, postData, forceSend, successHandler, failHandler) {
            var that = this,
                xmlHttpRequest = this.xmlHttpRequest;
            //
            this.inOperation = true;
            xmlHttpRequest.open("POST", protocol + LOGGER_URL, true);
            xmlHttpRequest.timeout = SERVER_REQUEST_TIMEOUT;
            xmlHttpRequest.setRequestHeader("Content-Type", 'application/json; charset=UTF-8');
            xmlHttpRequest.onreadystatechange = function () {
                if (xmlHttpRequest.readyState === 4) {
                    that.inOperation = false;
                    if (xmlHttpRequest.status === 200 || xmlHttpRequest.status === 400) {
                        // Request sent successfully
                        successHandler(postData);
                    } else {
                        // Fail handler
                        failHandler(postData);
                    }
                }
            };
            try {
                xmlHttpRequest.send(postData);
            } catch(e) {
                failHandler(postData);
            }
        };

        SenderService.prototype.sendNodeJsHttpRequest = function(protocol, postData, forceSend, successHandler, failHandler) {
            // An object of options to indicate where to post to
            var post_options = {
                    host: LOGGER_HOST,
                    port: '80',
                    path: LOGGER_PATH,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                post_req = this.http.request(post_options, function (res) {
                });
            // post the data
            post_req.write(postData);
            post_req.end();
        };

        /**
         *
         * @param {string} protocol
         * @param {string} postData
         * @param {boolean} forceSend
         * @param {Function} successHandler
         * @param {Function} failHandler
         */
        SenderService.prototype.sendPacket = function(protocol, postData, forceSend, successHandler, failHandler) {
            if (this.inOperation) {
                if (!forceSend) {
                    failHandler(postData);
                    return;
                }
            }
            if (this.xmlHttpRequest) {
                this.sendXmlHttpRequest(protocol, postData, forceSend, successHandler, failHandler);
            } else
            if (this.http) {
                this.sendNodeJsHttpRequest(protocol, postData, forceSend, successHandler, failHandler);
            } else
            {

            }
        };

        function PendingQueue() {
            this.timePrefix = getEpochTime() + '';
            this.counter = 0;
            this.postponed = {};
            this.postponedLength = 0;
            this.postponedSize = 0;
            this.lastItem = undefined;
            this.loadPostponedData();
        }

        /**
         * Initial load of pending queue stored in local storage
         * @return {*}
         */
        PendingQueue.prototype.loadPostponedData =  function() {
            if (typeof window === 'object' && window && window.localStorage) {
                try {
                    this.postponed = {};
                    this.lastItem = undefined;
                    this.postponedSize = 0;
                    var prefixLength = JSLOG_ME_LOCALSTORAGE.length,
                        count = 0;
                    for (var idx in window.localStorage) {
                        if (window.localStorage.hasOwnProperty(idx) && (idx.indexOf(JSLOG_ME_LOCALSTORAGE)===0)) {
                            var key = idx.substr(prefixLength);
                            this.lastItem = key;
                            this.postponed[key] = window.localStorage[idx];
                            this.postponedSize = this.postponedSize + this.postponed[key].length;
                            count++;
                        }
                    }
                    this.postponedLength = count;
                    if (count) {
                        return this.postponed;
                    } else {
                        return undefined;
                    }
                } catch (e) {
                    return undefined;
                }
            } else {
                return undefined;
            }
        };

        /**
         * Store postponed item
         * @param {string} lastItem
         * @param {string} packetData
         */
        function storePostponedItem(lastItem, packetData) {
            if (typeof window === 'object' && window && window.localStorage) {
                try {
                    window.localStorage[JSLOG_ME_LOCALSTORAGE+lastItem] = packetData;
                } catch (e) {
                }
            }
        }

        /**
         * Add packet
         * @param {string} packedData
         */
        PendingQueue.prototype.add = function(packedData) {
            function appendNewItem() {
                that.counter++;
                that.lastItem = that.timePrefix + that.counter;
                that.postponed[that.lastItem] = packedData;
                that.postponedSize = that.postponedSize + packedData.length;
                storePostponedItem(that.lastItem, packedData);
            }
            var that = this;
            if (that.postponedSize > DEFAULT_MAX_POSTPONE_SIZE) {
                return;
            }
            if (this.lastItem) {
                var lastData = this.postponed[that.lastItem];
                if (lastData.length > MAX_PENDING_PACKET_SIZE) {
                    appendNewItem();
                } else {
                    var newData = mergePackedArrays(lastData, packedData);
                    that.postponed[that.lastItem] = newData;
                    storePostponedItem(that.lastItem, newData);
                    that.postponedSize = that.postponedSize + newData.length - lastData.length;
                }
            } else {
                appendNewItem();
            }
        };

        var PACKET_REGEXP = /^\s*\[\s*(.+)\s*\]\s*$/;
        /**
         *
         * @param {string} packedArray1
         * @param {string} packedArray2
         */
        function mergePackedArrays(packedArray1, packedArray2) {
            var internals1 = packedArray1.match(PACKET_REGEXP),
                internals2 = packedArray2.match(PACKET_REGEXP);
            if (internals1 && internals2 && (internals1.length>1) && (internals2.length>1)) {
                return '['+internals1[1]+', '+internals2[1]+']';
            } else
            if (internals1) {
                return packedArray1;
            } else
            if (internals2) {
                return packedArray2;
            } else {
                return '[]';
            }
        }

        /**
         * Returns number of postponed items
         * @return {Number}
         */
        PendingQueue.prototype.haveItems = function() {
            return this.postponedLength;
        };

        /**
         * Fetch a single item from pending queue
         * @return {*}
         */
        PendingQueue.prototype.fetchItem = function() {
            if (!this.postponedLength) {
                return undefined;
            }
            for(var idx in this.postponed) {
                if (this.postponed.hasOwnProperty(idx)) {
                    return {
                        key: idx,
                        value: this.postponed[idx]
                    };
                }
            }
            return undefined;
        };

        /**
         * Delete item from pending queue
         * @param {string} itemName
         */
        PendingQueue.prototype.deleteItem = function(itemName) {
            this.postponedLength--;
            this.postponedSize = this.postponedSize - this.postponed[itemName].length;
            delete this.postponed[itemName];
            if (typeof window === 'object' && window && window.localStorage) {
                try {
                    delete window.localStorage[JSLOG_ME_LOCALSTORAGE+itemName];
                } catch (e) {
                }
            }
            if (this.lastItem === itemName) {
                this.lastItem = undefined;
            }
        };

        function PendingSenderService(protocol, /**SenderService*/sender, /**PendingQueue*/queue, /**JsLog*/logger) {
            this.protocol = protocol;
            this.sender = sender;
            this.queue = queue;
            this.logger = logger;
            this.start();
        }

        PendingSenderService.prototype.sendPendingItem = function () {
            if (this.sender.inOperation || !this.queue.haveItems()) {
                return;
            }
            var item = this.queue.fetchItem(),
                that = this;
            if (item) {
                var key = item.key,
                    value = item.value;
                this.sender.sendPacket(this.protocol, value, false, function(){
                    // success handler
                    that.queue.deleteItem(key);
                    that.sendPendingItem();
                }, function(){
                    // fail handler
                    postponeWorkingQueue(that.logger);
                });
            }
        };

        PendingSenderService.prototype.start = function() {
            if (this.handle) {
                return;
            }
            var that = this;
            this.handle  = setInterval(function(){
                that.sendPendingItem();
            }, SEND_POSTPONE_INTERVAL);
        };

        PendingSenderService.prototype.stop = function() {
            if (this.handle) {
                clearInterval(this.handle);
                this.handle = undefined;
            }
        };

        function JsLog(options) {
            this.options = new JsLogOptions();
            if (options !== undefined) {
                this.options = this.parseOptions(options);
            }
            var protocol;
            if (typeof window !== 'undefined') {
                protocol = window.location.protocol;
                if (!((protocol.toLowerCase() === 'http:') || (protocol.toLowerCase() === 'https:'))) {
                    protocol = DEFAULT_PROTOCOL;
                }
            } else {
                protocol = DEFAULT_PROTOCOL;
            }
            this.protocol = protocol;
            this.systemInfoSent = false;
            this._batchQueue = [];
            this._packetSize = 0;
            this.senderService = new SenderService();
            this.pendingSenderService = new PendingSenderService(protocol, this.senderService, pendingQueue, this);
            this.init();
        }

        /**
         *
         * @param {JsLog} that
         */
        function postponeWorkingQueue(that) {
            if (that._batchQueue.length) {
                var packetData = generatePacketData(that);
                that.postpone(packetData);
            }
        }

        /**
         * Raw sender
         * @param {string} protocol
         * @param {JsLog} that
         * @param {string|undefined} postData
         * @param {bool} [forceSend=false]
         */
        function rawSendToServer(protocol, that, postData, forceSend) {
            forceSend = !!forceSend;
            if (batchQueueSize(that) > MAX_PACKET_SIZE) {
                var oldData = generatePacketData(that);
                that.postpone(oldData);
            }
            if (postData) {
                addToBatch(that, postData);
            }
            if ((!that.senderService.inOperation || forceSend) && that._batchQueue.length) {
                var packetData = generatePacketData(that);
                that.senderService.sendPacket(protocol, packetData, forceSend, function(){
                    // Success handler
                    rawSendToServer(protocol, that, undefined, false);
                }, function(){
                    // Fail handler
                    that.postpone(packetData);
                    rawSendToServer(protocol, that, undefined, false);
                });
            }
        }

        /**
         * Add message to a batch
         *
         * @param {JsLog} that
         * @param {string} postData
         */
        function addToBatch(that, postData) {
            that._batchQueue.push(postData);
        }

        /**
         * Generate a packet from queue
         * @param {JsLog} that
         * @returns string
         */
        function generatePacketData(that) {
            var result = '[' + that._batchQueue.join(', ') + ']';
            that._batchQueue = [];
            return result;
        }

        /**
         * Get apx queue size in chars
         * @param {JsLog} that
         * @return {number}
         */
        function batchQueueSize(that) {
            var size = 0;
            for (var i=0; i<that._batchQueue.length; i++) {
                size = size + that._batchQueue[i].length;
            }
            return size;
        }

        JsLog.prototype.renewSession = function() {
            this.options.sessionId = this.options.guid();
            this.systemInfoSent = false;
        };

        JsLog.prototype.parseOptions = function(options) {
            var result = new JsLogOptions();
            for (var idx in options) {
                if (options.hasOwnProperty(idx) && result.hasOwnProperty(idx)) {
                    result[idx] = options[idx];
                }
            }
            return result;
        };



        JsLog.prototype.sendToServer = function(key, eventType, data) {
            if (!this.options.enabled) {return;}
            if (data instanceof Error) {
                data = exceptionToObject(data);
            }
            var rawData = {
                key: key,
                sessionId: this.options.sessionId,
                hostId: hostId,
                time: getEpochTime(),
                type: eventType,
                data: data},
                packetData = JSON.stringify(rawData);

            rawSendToServer(this.protocol, this, packetData);
        };

        function bind(context, fn) {
            return function() {
                return fn.apply(context, arguments);
            };
        }

        function getEpochTime() {
            if (Date.now) {
                return Date.now();
            } else {
                return new Date().getTime();
            }
        }

        /**
         * Get HTTP request object
         *
         * @returns XMLHttpRequest
         */
        function createRequest() {
            try {
                if (typeof XMLHttpRequest === 'undefined') {
                    XMLHttpRequest = function() {
                        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
                        catch(e) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
                        catch(e) {}
                        try { return new ActiveXObject("Msxml2.XMLHTTP"); }
                        catch(e) {}
                        try { return new ActiveXObject("Microsoft.XMLHTTP"); }
                        catch(e) {}
                        throw new Error('XMLHttpRequest not supported');
                    };
                }
                return new XMLHttpRequest();
            } catch(e) {
                return undefined;
            }
        }


        function initialSystemInfo(/**JsLog*/log) {
            if (!log.systemInfoSent) {
                log.systemInfo(log.options.collectSystemInfo);
            }
        }

        JsLog.prototype.postpone = function(packetData) {
            pendingQueue.add(packetData);
        };

        JsLog.prototype.log = function() {
            try {
                initialSystemInfo(this);
                var sendArgs = (arguments.length>1)?arguments:arguments[0];
                this.sendToServer(this.options.key, 'log', sendArgs);
                if (typeof oldConsoleLog === 'function') {
                    oldConsoleLog.apply(console, arguments);
                }
            } catch (e) {
            }
        };

        JsLog.prototype.expand = function(data) {
            var visitedObjects = [];
            function expandOneLevel(data){
                if (typeof data !== 'object' || data === null) {
                    return data;
                }
                var result = {},
                    properties = Object.getOwnPropertyNames(data).sort();
                visitedObjects.push(data);
                for(var key in properties) {
                    if (properties.hasOwnProperty(key)) {
                        var propertyName = properties[key],
                            propertyValue = data[propertyName];
                        if (typeof propertyValue === 'undefined' || typeof propertyValue === 'function') {
                            continue;
                        }
                        if (visitedObjects.indexOf(propertyValue)>=0) {
                            propertyValue = '<circular ref>';
                        }
                        result[propertyName] = expandOneLevel(propertyValue);
                    }
                }
                visitedObjects.pop();
                return result;
            }
            return expandOneLevel(data);
        };

        JsLog.prototype.info = function() {
            try {
                initialSystemInfo(this);
                var sendArgs = (arguments.length>1)?arguments:arguments[0];
                this.sendToServer(this.options.key, 'info', sendArgs);
                if (typeof oldConsoleInfo === 'function') {
                    oldConsoleInfo.apply(console, arguments);
                }
            } catch (e) {
            }
        };

        JsLog.prototype.warn = function() {
            try {
                initialSystemInfo(this);
                var sendArgs = (arguments.length>1)?arguments:arguments[0];
                this.sendToServer(this.options.key, 'warn',  sendArgs);
                if (typeof oldConsoleWarn === 'function') {
                    oldConsoleWarn.apply(console, arguments);
                }
            } catch (e) {
            }
        };

        function expandParameters(sendArgs) {
            if (sendArgs instanceof Array) {
                // multiple args
                var result = [];
                for (var idx in sendArgs) {
                    if (sendArgs.hasOwnProperty(idx)) {
                        result.push(JsLog.prototype.expand(sendArgs[idx]));
                    }
                }
                return result;
            } else {
                // single arg
                return JsLog.prototype.expand(sendArgs);
            }
        }

        JsLog.prototype.error = function() {
            try {
                initialSystemInfo(this);
                var sendArgs = (arguments.length>1)?arguments:arguments[0];
                this.sendToServer(this.options.key, 'error',  expandParameters(sendArgs));
                if (typeof oldConsoleError === 'function') {
                    oldConsoleError.apply(console, arguments);
                }
            } catch (e) {
            }
        };

        JsLog.prototype.exception = function(data) {
            try {
                initialSystemInfo(this);
                var sendArgs = (arguments.length>1)?arguments:arguments[0];
                this.sendToServer(this.options.key, 'exception', expandParameters(sendArgs));
                if (typeof oldConsoleException === 'function') {
                    oldConsoleException.apply(console, arguments);
                }
            } catch (e) {
            }
        };

        JsLog.prototype.systemInfo = function(fillRealData) {
            try {
                var systemInfoData = {};
                if (fillRealData && typeof navigator === 'object') {
                    systemInfoData.userAgent = navigator.userAgent;
                    systemInfoData.platform = navigator.platform;
                    systemInfoData.version = this.options.version;
                } else {
                    systemInfoData.userAgent = '';
                    systemInfoData.platform = '';
                    systemInfoData.version = this.options.version;
                }
                this.systemInfoSent = true;
                this.sendToServer(this.options.key, 'systemInfo', systemInfoData);
            } catch (e) {
            }
        };

        function exceptionToObject(exception) {
            var result = {};
            if (!exception) {
                return result;
            }
            if (typeof exception.name !== 'undefined') {
                result.name = exception.name;
            }
            if (typeof exception.message !== 'undefined') {
                result.message = exception.message;
            }
            if (typeof exception.stack !== 'undefined') {
                result.stack = exception.stack;
            }
            if (typeof exception.fileName !== 'undefined') {
                result.fileName = exception.fileName;
            }
            if (typeof exception.lineNumber !== 'undefined') {
                result.lineNumber = exception.lineNumber;
            }
            if (typeof exception.columnNumber !== 'undefined') {
                result.columnNumber = exception.columnNumber;
            }
            if (typeof exception.description !== 'undefined') {
                result.description = exception.description;
            }
            return result;
        }

        JsLog.prototype.init = function() {
            if (!this.options.enabled) {return;}
            this.pendingSenderService.sendPendingItem();
            if (this.options.trackHost) {this.trackHost();}
            if (this.options.hookConsole) {this.hookConsole();}
            if (this.options.logUncaughtExceptions) {this.hookUncaughtExceptions();}
            if (this.options.trackLaunches) {this.systemInfo(this.options.collectSystemInfo);}
        };

        var oldConsoleLog,
            oldConsoleWarn,
            oldConsoleError,
            oldConsoleInfo,
            oldConsoleException;

        JsLog.prototype.trackHost = function() {
            if (hostId) {return;}
            // put tracking option in local storage
            if (typeof window === 'object' && 'localStorage' in window && window.localStorage !== null) {
                try {
                    hostId = window.localStorage.getItem('JsLogToken');
                } catch (e) {
                    hostId = null;
                }
                if (!hostId) {
                    hostId = JsLogOptions.prototype.guid();
                    try {
                        window.localStorage.setItem('JsLogToken', hostId);
                    } catch(e) {

                    }
                }
            } else {
                hostId = JsLogOptions.prototype.guid();
            }
        };

        JsLog.prototype.hookConsole = function() {
            if (consoleHookSet) {
                // console already defined
                return;
            }
            if (typeof console !== 'undefined') {
                oldConsoleLog = console.log;
                oldConsoleWarn = console.warn;
                oldConsoleError = console.error;
                oldConsoleInfo = console.info;
                oldConsoleException = console.exception;
                console.log = bind(this,this.log);
                console.warn = bind(this,this.warn);
                console.error = bind(this,this.error);
                console.info = bind(this,this.info);
                console.exception = bind(this,this.exception);
            } else {
                console = {
                    log: bind(this,this.log),
                    warn: bind(this,this.warn),
                    error: bind(this,this.error),
                    info: bind(this,this.info),
                    exception: bind(this,this.exception)
                };
            }
            consoleHookSet = true;
        };

        JsLog.prototype.hookUncaughtExceptions = function() {
            // Browser
            if (typeof window !== 'undefined') {
                window.onerror = bind(this, this.windowErrorHandler);
            }
            // NodeJS
            if (typeof process !== 'undefined') {
                process.on('uncaughtException', bind(this, this.windowErrorHandler));
            }
        };

        JsLog.prototype.windowErrorHandler = function(msg, url, line, column, errorObj) {
            if (!this.options.enabled) {return;}
            try {
                if (errorObj) {
                    this.sendToServer(this.options.key, 'uncaughtException',
                        {
                            msg: msg,
                            url: url,
                            line: line,
                            column: column,
                            errorObj: exceptionToObject(errorObj)
                        });
                } else {
                    this.sendToServer(this.options.key, 'uncaughtException',
                        exceptionToObject(msg));
                }
            } catch (e) {

            }
        };

        var pendingQueue = new PendingQueue();

        // singleton
        if (typeof window !== 'undefined') {
            window.JsLog = window.JsLog || JsLog;
        }
        JsLogExport = JsLog;
    })();
    return JsLogExport;
}, typeof define == 'function' && define.amd ? define : function(_, f){
   if (typeof module !== 'undefined') {
	module.exports = f();
   } else {
	f(); 
   }
});
