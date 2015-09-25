'use strict';

var extend, assert;
extend = require('../extend').default;
assert = require('assert');

/* global describe, it */
describe('core/extend :: declaring Types', function () {
	describe('-> Simple Types', function () {
		it('should define a simple type', function (done) {
			var MyClass = extend('MyClass', {
				a: 1,
				add: function(x) {
					this.a += x;
					return this.a;
				}
			});
			var obj = new MyClass();
			obj.add(2);
			assert(obj.a === 3);
			done();
		});
		it('should inherit a simple type', function (done) {
			var MyClass = extend({
				a: 1,
				add: function(x) {
					this.a += x;
					return this.a;
				}
			});
			var MyClass2 = extend(MyClass, {
				b: 5
			});
			var obj = new MyClass2();
			obj.add(2);
			assert(obj.a === 3);
			assert(obj.b === 5);
			assert(obj.add === MyClass.prototype.add);
			done();
		});
	});
	describe('-> Prototypes', function () {
		it('should pass this simple prototype test', function (done) {
			var MyClass = extend({
				a: 5
			});
			var MyClass2 = extend(MyClass, {
				b: 4
			});
			var MyClass3 = extend({
				c: 3
			});
			var MyClass4 = extend(MyClass3, MyClass2, {
				d: 2
			});
			var obj = new MyClass4();
			assert(obj.a === 5);
			done();
		});
	});
	describe('-> Multiple Inheritance', function () {
		it('should define a simple multiple inheritance', function (done) {
			var MyClass = extend({
				a: 1,
				b: 5,
				add: function(x) {
					this.a += x;
					return this.a;
				}
			});
			var MyOtherClass = extend({
				a: 3,
				add: function(x) {
					this.a += 2*x;
					return this.a;
				}
			});
			var MyClass2 = extend(MyClass, MyOtherClass, {
				b: 15
			});
			var obj = new MyClass2();
			obj.add(obj.b);
			assert(obj.a === 33);
			assert(obj.add === MyOtherClass.prototype.add);
			done();
		});
	});
	describe('-> Decorators', function () {
		it('should use after decorator correctly', function (done) {
			var MyClass = extend({
				a: 1,
				b: 5,
				doSomething: function() {
					this.c = this.a + this.b;
				}
			});
			var MyOtherClass = extend(MyClass, {
				a: 3,
				doSomething: extend.after(function() {
					this.c *= 2;
				})
			});
			var obj = new MyOtherClass();
			obj.doSomething();
			assert(obj.c === 16);
			assert(obj.add !== MyOtherClass.prototype.doSomething);
			done();
		});
		it('should use before decorator correctly', function (done) {
			var MyClass = extend({
				a: 1,
				b: 5,
				doSomething: function() {
					this.c += this.a + this.b;
				}
			});
			var MyOtherClass = extend(MyClass, {
				a: 3,
				c: 1,
				doSomething: extend.before(function() {
					this.c *= 2;
				})
			});
			var obj = new MyOtherClass();
			obj.doSomething();
			assert(obj.c === 10);
			assert(obj.add !== MyOtherClass.prototype.doSomething);
			done();
		});
		it('should use around decorator correctly', function (done) {
			var MyClass = extend({
				a: 1,
				b: 5,
				doSomething: function() {
					this.c = this.a + this.b;
				}
			});
			var MyOtherClass = extend(MyClass, {
				a: 3,
				c: 1,
				doSomething: extend.around(function(original) {
					return function() {
						this.c *= 2;
						original.apply(this, arguments);
						this.c *= 3;
					};
				})
			});
			var obj = new MyOtherClass();
			obj.doSomething();
			assert(obj.c === 24);
			assert(obj.add !== MyOtherClass.prototype.doSomething);
			done();
		});
		it('should use postConstruct correctly', function (done) {
			var MyClass = extend({
				a: 1
			}, extend.postConstruct(function() {
				this.a *= 2;
			}), function() {
				this.a += 4;
			});
			var obj = new MyClass();
			assert(obj.a === 10);
			done();
		});
	});
	describe('-> Private members', function () {
		it('should let me use private members easier', function (done) {
			var MyClass = function() {
				var priv1 = 5;
				extend.mixin(this, {
					doSomething: function() {
						this.value = priv1 - 1;
					}
				});
			};
			var obj = new MyClass();
			obj.doSomething();
			assert(obj.value === 4);
			done();
		});
	});
});