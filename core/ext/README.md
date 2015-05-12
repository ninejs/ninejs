# ninejs/core/ext

Mixins to use in your classes (with ninejs/core/extend)

## ninejs/core/ext/Properties

Allows your class to have a getter `obj.get('propName')`, setter `obj.set('propName', value)` and susbcribe to property changes `obj.watch('propName', function(propName, oldValue, newValue) { })`.


| Method | Parameters         | Description                                       |
| -----: | ------------------ | ------------------------------------------------ |
| get    | propName           | gets the `propName` property by accessing it's getter method. If such method is not present then it just returns it's regular `propName` property |
| set    | propName, value    | sets the `propName` property it's `value` by calling it's setter method. Is such method is not present then it just sets it's regular `propName` property |
| watch  | propName, callback | sets a watch for changes on the `propName` property. On a change, the `callback` is called passing the `propName`, `oldValue` and `newValue` parameters |

To define a getter method just create a function and append "Getter" to it's name. A `name` property's getter would be `nameGetter` and it's setter would be `nameSetter`.
Sample:

```javascript
define(['ninejs/core/extend', 'ninejs/core/ext/Properties'], function(extend, Properties) {
	'use strict';
	var MyClass = extend(Properties, {
		nameGetter: function() {
			return this.name;
		},
		nameSetter: function(val) {
			this.name = val + ' 123';
		}
	});
	var obj = new MyClass();
	obj.set('name', 'test');
	obj.watch('name', function(propName, oldValue, newValue) {
		console.log('Changing from ' + oldValue + ' to ' + newValue);
	});
	console.log(obj.get('name'));
});
```
Properties also exposes a static `mixin` function. It acts like any other regular mixin function except that, while assigning properties, it will be calling the setters.

```javascript
define(['ninejs/core/extend', 'ninejs/core/ext/Properties'], function(extend, Properties) {
	'use strict';
	var MyClass = extend(Properties, {
		nameGetter: function() {
			return this.name;
		},
		nameSetter: function(val) {
			this.name = val + ' 123';
		}
	});
	var obj = new MyClass();
	Properties.mixin(obj, {
		name: 'test',
		lastName: 'tester'
	});
	console.log(obj.get('name'));
});
```