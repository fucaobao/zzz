define("ZSYWEB.Pub", [], function(){
	var Pub = {
		bind : function(eventName, callback, inst) {
			Pub.unsubscribe(eventName, inst);
			Pub.subscribe(eventName, callback, inst);
		},
	    subscribe: function(eventName, callback, inst) {
	        var ev, suber, subscribeId, pointer = inst;
	        subscribeId = pointer.$pointer;
	        if (!subscribeId) {
	            return
	        }
	        if (!Pub.subers) {
	            Pub.subers = {}
	        }
	        if (!Pub.subers[subscribeId]) {
	            Pub.subers[subscribeId] = {};
	            Pub.subers[subscribeId].callbacks = {}
	        }
	        suber = Pub.subers[subscribeId];
	        (suber.callbacks[eventName] || (suber.callbacks[eventName] = [])).push({
	            'scope': inst,
	            'fun': callback
	        })
	    },
	    publish: function() {
	        var eventName, args, pointer, list, i, suber, subscribeId, inst, temp, cid, aPointer;
	        var argArr = Array.prototype.slice.call(arguments, 0);
	        if (arguments.length > 1) {
	            eventName = argArr.shift();
	            args = argArr;
	            inst = argArr.pop();
	            pointer = inst
	        } else {
	            return
	        }
	        subscribeId = pointer.$pointer;
	        suber = Pub.subers && Pub.subers[subscribeId];
	        cid = pointer.cid;
	        if (!suber || !suber.callbacks) {
	            return;
	        }
	        if (suber.callbacks[eventName]) {
	            list = suber.callbacks[eventName];
	            for (i = 0; i < list.length; i++) {
	                temp = list[i].scope;
	                var subId = temp.subId;
	                if ((typeof subId == "undefined" || typeof cid == "undefined")) {
	                    list[i].fun.apply(temp, args)
	                } else if ($.isArray(subId) && $.inArray(cid, subId) != -1) {
	                    list[i].fun.apply(temp, args)
	                } else if (subId == cid) {
	                    list[i].fun.apply(temp, args)
	                }
	            }
	        }
	    },
	    unsubscribe: function() {
	        var eventName, fun, subscribeId, pointer, i;
	        if (arguments.length == 3) {
	            eventName = arguments[0];
	            fun = arguments[1];
	            pointer = arguments[2]
	        } else if (arguments.length == 2) {
	            eventName = arguments[0];
	            pointer = arguments[1]
	        } else {
	            return
	        }
	        subscribeId = pointer.$pointer;
	        var suber = Pub.subers && Pub.subers[subscribeId];
	        if (!suber || !suber.callbacks) {
	            return
	        }
	        var callbacks = suber && suber.callbacks;
	        for (name in callbacks) {
	            if (name === eventName) {
	                for (i = 0; i < callbacks[eventName].length; i++) {
	                    if (pointer.cid === callbacks[eventName][i].scope.cid) {
	                        callbacks[eventName].splice(i, 1);
	                        i--
	                    }
	                }
	            }
	        }
	    }
	};
	NameSpace.Register("ZSYWEB.Pub", Pub);
	return Pub;
});