# ninejs/core

Contains core modules.
Modules inside ninejs/core can be used either in client-side (browser) or server-side (Node.js)

## Folders

- **ext**: Mixins used to augment classes. For example, `Properties` mixin allows your classes to have a get, set and watch methods (just like Dojo's Stateless).
- **logic**: Modules used to build and evaluate boolean expressions.

## ninejs/core/extend

extend allows your to build classes in an OOP style. It is heavily inspired in [Kris Zyp's compose](https://github.com/kriszyp/compose "kris zyp's compose") features.

### Creating a class with extend:

```javascript
define(['ninejs/core/extend'], function(extend) {
	'use strict';
	var MyClass = extend();
	var obj = new MyClass();
});
```

Of course, there is no fun in just creating an empty class. Lets create one that has a few methods and properties.

```javascript
define(['ninejs/core/extend'], function(extend) {
	'use strict';
	var MyClass = extend({
		prop1: 'test ',
		action: function(val) {
			console.log(this.prop1 + val);
		}
	});
	var obj = new MyClass();
	obj.action('123');
	//'test 123'
});
```
At the moment, methods you create within a class get defined in that class's prototype. Other fields you define get set in your instance after all the constructors are set.

### Using extend in Node.js

Want to create and/or extend classes in your server side Node.js? No problem!

ninejs/core/extend works in AMD environments as well as Node.js cjs because it detects your environment (for other environments it just sets an `extend` variable in your global).

```javascript
'use strict';
var extend = require('ninejs/core/extend');
var MyClass = extend({
	prop1: 'test ',
	action: function(val) {
		console.log(this.prop1 + val);
	}
});
var obj = new MyClass();
obj.action('123');
//'test 123'
```

### Mixing in some functions

With extend you may also use other functions (even ones not created with extend).

```javascript
define(['ninejs/core/extend'], function(extend) {
	'use strict';
	function Type1() {
		this.myVar = 3;
	}
	Type1.prototype.test = function() {
		return this.myVar;
	};
	var MyClass = extend(Type1, {
		prop1: 'test ',
		action: function(val) {
			console.log(this.prop1 + val + this.test());
		}
	});
	var obj = new MyClass();
	obj.action('123');
});
```

This effectively tells extend that you want to create a class based on Type1 (which is a function we just previously defined) and also want it to have the functionality described in the other json parameter (prop1 field and action method).
extend can have any number of parameters, each one describing either a function or an object. If it's a function then it is considered a constructor and will execute call it as a constructor at runtime time. On the other hand, if it's an object then all its functions get merged on the prototype and its other fields get assigned at runtime too.

### Overriding methods on a class

Lets say you want to extend a class in a way that you provide custom behaviour as well as the usual expected logic. Extend allows you to run your customization before, after or around executing the superclass method. Let's try it:

```javascript
define(['ninejs/core/extend'], function(extend) {
	'use strict';
	var SuperClass = extend({
		x: 3,
		update: function() {
			console.log(this.x);
		}
	});
	var MyClassBefore = extend(SuperClass, {
		update: extend.before(function() {
			console.log('Executing before superclass');
		})
	});
	var obj = new MyClassBefore();
	obj.update();

	var MyClassAfter = extend(SuperClass, {
		update: extend.after(function() {
			console.log('Executing after superclass');
		})
	});
	obj = new MyClassAfter();
	obj.update();

	var MyClassAround = extend(SuperClass, {
		update: extend.around(function(original) {
			return function() {
				console.log('This is before');
				original.apply(this, arguments);
				console.log('This is after');
			};
		})
	});
	obj = new MyClassAround();
	obj.update();

	var MyClassShadow = extend(SuperClass, {
		update: function() {
			console.log('This method is shadowing SuperClass\' update method');
		}
	});
	obj = new MyClassShadow();
	obj.update();
});
```

In the 4 previous examples we used extend.before, extend.after, extend.around and in the last one we just shadowed the update function (by only redefining it in the child class);

### Using extend as an object mixin

You can also call extend within an instance to have it mix in objects:

```javascript
'use strict';
var extend = require('extend');
var obj = { a:1, b:2, c:3 };
var otherObj = { b:4, d:4, e:5};
extend.mixin(obj, otherObj);
//obj = { a:1, b:4, c:3, d:4, e:5 };
```