# ninejs/css

Modules used to embed inject css into your own modules.

## Folders

- **build**: Modules used to enhance optimizer builders. At this moment this folder only contains an optimizer for the [Dojo Toolkit builder](https://github.com/dojo/util "Dojo Toolkit builder").

## ninejs/css/style

ninejs/css/style has an alias which is ninejs/css. From now on let's refer to this module as ninejs/css (perhaps because it's shorter). Users should really use ninejs/css directly. At some point in the future there won't be ninejs/css/style and it would all be only one module. There's no point in having 2 AMD modules do the exact same thing.
Injects css into your web application. This is the only real function of ninejs/css/style.

### How can I use ninejs/css?

Let's say you have a new module:

```javascript
define(['ninejs/ui/extend'], function(extend) {
	'use strict';
	var SuperModule = extend({
		doSomething: function() { }
	});
	return SuperModule;
});
```

Now suppose that new module does a lot of stuff and creates some widgets by your own authory. You would probably want some CSS to be shipped with your module too (because it would probably not look good without it's style). That's where ninejs/css comes into play:

```javascript
define(['ninejs/ui/extend', 'ninejs/css!./SuperModule.css'], function(extend, css) {
	'use strict';
	css.enable();
	var SuperModule = extend({
		doSomething: function() { }
	});
	return SuperModule;
});
```
So you define a dependency which is basically "ninejs/css" with a plugin that points to your css resource. Relative paths are OK. AMD paths are OK too (eg: 'ninejs/css!dijit/themes/claro.css' refers to dijit's prefix location in your AMD loader config).
At that point your dependency returns a css object that has an "enable" method. Whenever you want your css to be applied (probably at module definition time mostly) you can call enable and it will be applied.

#### How can I automatically apply my style on call without having to invoke the enable method?

Well actually that is possible and there are 2 ways to do it:
```javascript
define(['ninejs/ui/extend', 'ninejs/css!./SuperModule.css!enable'], function(extend, css) {
	'use strict';
	var SuperModule = extend({
		doSomething: function() { }
	});
	return SuperModule;
});
```
One is by appending "!enable"
```javascript
define(['ninejs/ui/extend', 'ninejs/css/styleEnable!./SuperModule.css'], function(extend, css) {
	'use strict';
	var SuperModule = extend({
		doSomething: function() { }
	});
	return SuperModule;
});
```
The other is by requiring ninejs/css/styleEnable instead.
I don't know if we will continue to support both in the future, but if I ever do I will try to let you know.

### Why do I need to use ninejs/css? Can't I just include my style in my html as usual?

You are absolutely right, you can include your style tags (or link style tags) in your html, however:
- You should try to make sure that when you are shipping a module you ship it with it's corresponding styles, otherwise users would probably be unable to make it work in the first try.
- Using ninejs/css as a plugin enabled AMD module will give you the huge benefit of allowing your module to be optimized by AMD optimizers (such as RequireJS's r (not ready yet) or Dojo Toolkit builder). Having your css module optimized would allow it to be included in your layers.

### What else can I do with ninejs/css?

ninejs/css is part of 9js's Widget/Skin/Template/Style combo. If you used ninejs/ui/Widget you would probably know that you need at least one Skin (Skins are the combination of a template and zero or more css files) to make it usable.
Skins refer to templates and css resources. All are optimizable by an AMD optimizer. You can see more detail in ninejs/ui/Skin docs.

### Known Issues
- [ ] ninejs/css and ninejs/css/style should be the exact same module