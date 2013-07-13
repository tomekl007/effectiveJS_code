//item 13
function wrapElements(a) {
var result = [], i, n;
for (i = 0, n = a.length; i < n; i++) {
	result[i] = function() { 
		console.log("i : "+  i); 
		return a[i]; };
}
	return result;
}
var wrapped = wrapElements([10, 20, 30, 40, 50]);
var f = wrapped[0]

//remedy
function wrapElements(a) {
	var result = [];
	for (var i = 0, n = a.length; i < n; i++) {
		(function() {
			var j = i;
			result[i] = function() { return a[j]; };
		})();
	}
	return result;
}
var wrapped = wrapElements([10, 20, 30, 40, 50]);
var f = wrapped[0]
f();

//or
function wrapElements(a) {
	var result = [];
	for (var i = 0, n = a.length; i < n; i++) {
		(function(j) {
			result[i] = function() { return a[j]; };
		})(i);
	}
	return result;
}
var wrapped = wrapElements([10, 20, 30, 40, 50]);
var f = wrapped[0]
f();

//item 15
function f() { return "global"; }
function test(x) {
	var g = f, result = [];
	if (x) {
		g = function() { return "local"; }
		result.push(g());
	}
	result.push(g());
	return result;
}
//item 16
//dangerous
var y = "global";
function test(src) {
	eval(src); // may dynamically bind
		return y;
	} test("var y='local';"); // "local"
	  test("var z = 'local';"); // "global"

//preventing scope pollution
var y = "global";
function test(src) {
	(function() { eval(src); })();
		return y;
} 
test("var y='local';"); // "global"    
test("var z = 'local';"); // "global"

//Item 17 
//direct eval
var x = "global";
function test() {
	var x = "local";
	return eval("x"); // direct eval
} test(); // "local"

//indirect eval (prefered)
var x = "global";
function test() {
	var x = "local";
	var f = eval;
	return f("x"); // indirect eval
} test(); // "global"

//Item 19 Higher Order Functions
[3, 1, 4, 1, 5, 9].sort(function(x, y) {
	if (x < y) {
		return -1;
	}
	if (x > y) {
		return 1;
	}
	return 0;
}); // [1, 1, 3, 4, 5, 9]
var names = ["Fred", "Wilma", "Pebbles"];
var upper = names.map(function(name) {
	return name.toUpperCase();
});
upper; // ["FRED", "WILMA", "PEBBLES"]

//ITEM 21 Call 
var table,table2 = {
	entries: [],
	addEntry: function(key, value) {
		console.log(this);
		this.entries.push({ key: key, value: value });
	},
	forEach: function(f, thisArg) {
		var entries = this.entries;
		for (var i = 0, n = entries.length; i < n; i++) {
			var entry = entries[i];
			f.call(thisArg, entry.key, entry.value, i);
		}
	}//,
	//toString : function (){
	//	return key + " " + value;
	//}
};

table.addEntry(1,"jeden");
table.addEntry(2,"dwa");

table.forEach(table2.addEntry, table2);

//Item 21 apply
var buffer = {
	state: [],
		append: function() {
			for (var i = 0, n = arguments.length; i < n; i++) {
				this.state.push(arguments[i]);
			}
		}
};

buffer.append("Hello, ");
//buffer.append(firstName, " ", lastName, "!");
//buffer.append(newline);

function getInputStrings(){
	return ["some strings"];
}
buffer.append.apply(buffer, getInputStrings());

//Item 23 Never modify global 'arguments' 
//isnstead do safe copy
function callMethod(obj, method) {
	var args = [].slice.call(arguments, 2);
	console.log(args[0]);
	console.log(args[1]);
		return obj[method].apply(obj, args);
}

var obj = {
	add: function(x, y) { return x + y; }
};
callMethod(obj, "add", 17, 25); // 42


function values() {
var i = 0, n = arguments.length, a = arguments;
	return {
		hasNext: function() {
			return i < n;
		},
		next: function() {
			if (i >= n) {
			throw new Error("end of iteration");
			}
			return a[i++];
		}
	};
} 
var it =
values(1, 4, 1, 4, 2, 1, 3, 5, 6);
it.next(); // 1
it.next(); // 4
it.next(); // 1

//item 25 use bind to exract methods

var buffer = {
entries: [],
	add: function(s) {
		console.log("this : " + this);// + "entries : " + entries);
		this.entries.push(s);
	},
	concat: function() {
		return this.entries.join("");
	}
};

var source = ["867", "-", "5309"];
source.forEach(buffer.add); // error: entries is undefined
//solution 1 
var source = ["867", "-", "5309"];
source.forEach(buffer.add, buffer);
buffer.concat(); // "867-5309"
//solution 2
var source = ["867", "-", "5309"];
source.forEach(function(s) {
	buffer.add(s);
});
buffer.concat(); // "867-5309"
//solution 3
var source = ["867", "-", "5309"];
source.forEach(buffer.add.bind(buffer));
buffer.concat(); // "867-5309"

//item 26 currying
function simpleURL(protocol, domain, path) {
	return protocol + "://" + domain + "/" + path;
}
var paths = ['first', 'second'];
var siteDomain = 'domain';
var urls = paths.map(simpleURL.bind(null, "http", siteDomain));

var f = simpleURL.bind(null, 'http', siteDomain);
f('s');

//INHERITANCE
function User(name, passwordHash) {
	this.name = name;
	this.passwordHash = passwordHash;
}
User.prototype.toString = function() {
	return "[User " + this.name + "]";
};
User.prototype.checkPassword = function(password) {
	return hash(password) === this.passwordHash;
};
var u = new User("sfalken",
"0ef33ae791068ec64b502d6cb0191387");

Object.getPrototypeOf(u);

//Item 36 store instance State only on Instance Objects
function Tree(x) {
	this.value = x;
	this.children = []; // instance state
} 
Tree.prototype = {
	addChild: function(x) {
		this.children.push(x);
	}
};

var left = new Tree(2);
left.addChild(1);
left.addChild(3);
var right = new Tree(6);
right.addChild(5);
right.addChild(7);
var top = new Tree(4);
top.addChild(left);
top.addChild(right);
top.children; // [1, 3, 5, 7, left, right]

//Item 37 implicit binding of this
function CSVReader(separators) {
	this.separators = separators || [","];
	this.regexp =
		new RegExp(this.separators.map(function(sep) {
			return "\\" + sep[0];
		}).join("|"));
}

CSVReader.prototype.read = function(str) {
	var lines = str.trim().split(/\n/);
	return lines.map(function(line) {
		return line.split(this.regexp); // wrong this!
	});
};
var reader = new CSVReader();
reader.read("a,b,c\nd,e,f\n"); // [["a,b,c"], ["d,e,f"]]

//solution 1
CSVReader.prototype.read = function(str) {
	var lines = str.trim().split(/\n/);
	return lines.map(function(line) {
		return line.split(this.regexp);
	}, this); // forward outer this-binding to callback
	//map has optional second arg, to use as a this-binding for
	//the callback
};
var reader = new CSVReader();
reader.read("a,b,c\nd,e,f\n");
// [["a","b","c"], ["d","e","f"]]

//solution 2 
CSVReader.prototype.read = function(str) {
var lines = str.trim().split(/\n/);
var self = this; // save a reference to outer this-binding
return lines.map(function(line) {
	return line.split(self.regexp); // use outer this
	});
};
var reader = new CSVReader();
reader.read("a,b,c\nd,e,f\n");
// [["a","b","c"], ["d","e","f"]]

//Item 38
function Actor(x,y){
	console.log("call actor constuctor with x ,y : " + x + ", " + y);
	this.x = x;
	this.y = y;
}

Actor.prototype.moveTo = function(x,y){
	this.x = x;
	this.y = y;
};

function SpaceShip(x,y){
	Actor.call(this,x,y);
	this.points = 0;
}
//and "chain" objects by prototype
SpaceShip.prototype = Object.create(Actor.prototype);

//item 47 never add enumerable properies to Object.prototype
Object.defineProperty(Object.prototype, "allKeys", {
	value: function() {
		var result = [];
		for (var key in this) {
			result.push(key);
		}
		return result;
	},
	writable: true,
	enumerable: false,
	configurable: true
});

({a:1,b:2,c:3}).allKeys();//not print allKeys

//Item 49 iterate over array : for, not for ... in !
//for in always iterates over keys 
var scores = [98, 74, 85, 77, 93, 100, 89];
var total = 0;
for (var score in scores) {
	total += score;
}
 var mean = total / scores.length;

var scores = [98, 74, 85, 77, 93, 100, 89];
var total = 0;
for (var i = 0, n = scores.length; i < n; i++) {
	total += scores[i];
} 
var mean = total / scores.length;
//item 50 prefer iteration methods to loop
function takeWhile(a, pred) {
	var result = [];
	for (var i = 0, n = a.length; i < n; i++) {
		if (!pred(a[i], i)) {
			break;
		}
	result[i] = a[i];
	}
	return result;
}
var prefix = takeWhile([1, 2, 4, 8, 16, 32], function(n) {
return n < 10;
}); // [1, 2, 4, 8]

//or
Array.prototype.takeWhile = function(pred) {
	var result = [];
	for (var i = 0, n = this.length; i < n; i++) {
		if (!pred(this[i], i)) {
			break;
		}
	result[i] = this[i];
	}
	return result;
};
var prefix = [1, 2, 4, 8, 16, 32].takeWhile(function(n) {
return n < 10;
}); // [1, 2, 4, 8]

//there are methods every and some
function takeWhile(a, pred) {
	var result = [];
	a.every(function(x, i) {
	if (!pred(x)) {
		return false; // break
	}
	result[i] = x;
		return true; // continue
	});
return result;
}

//Item 51
var result = Array.prototype.map.call("abc", function(s) {
	return s.toUpperCase();
}); // ["A", "B", "C"]

//Item 52
//Use array literals:
var a = [1,2,3];
// instead of array contructor:
var a = new Array(1,2,3);