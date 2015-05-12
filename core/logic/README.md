# ninejs/core/logic

Modules used to build and evaluate boolean expressions

## Folders

- **nls**: Just i18n resources used by the Expression class when it's converting an expression to a human readable string. It is currently using Dojo Toolkit's i18n module.

## ninejs/core/logic/Expression

Allows your application to store, serialize and evaluate boolean expressions.

Expression class inherits dojo's Stateful, meaning that all properties have get, set and watch.

### Properties

| Property       | Type                | Description                       |
| :------------: | :-----------------: | --------------------------------- |
| operator       | String              | the operator of the expression. Valid values are:  `and`, `or`, `equals`, `notEquals`, `greaterThan`, `greaterThanOrEquals`, `lessThan`, `lesserThanOrEquals`, `contains`, `startsWith`, `endsWith` |
| isNegative     | Boolean             | if set to true this expression will evaluate to it's negative value |
| source         | Object or Function  | The left part of the expression. If set to a function it will evaluate the function before evaluating the expression. The only way to set a field as a source is by calling `expression.set('sourceValue', 'fieldName')`. If set to an object it's value will be treated as literal. Be careful not to call `expression.set('source', 'fieldName')` if you want to refer to a field because that way `source` will act as literally the string 'fieldName' |
| sourceSummary  | String              | The summary function that will be run in the source part. At the moment this list is unrestricted. Default value is `valueOf`  |
| target         | Object or Function  | The right part of the expression. It shares the same behaviour as the `source` property. Field setter is `expression.set('targetValue', 'fieldName')` |
| targetSummary  | String              | The summary function that will be run in the target part. At the moment this list is unrestricted. Default value is `valueOf`  |
| where       | Expression             | Filter expression that should be applied to the source summary. For example: { sourceField: 'people', sourceSumary: 'countOf', operator: 'greaterThan', 'target': 0, where: /* Expression that filters out people by age >= 21 */ } |
| expressionList | Array of Expression | if the `operator` property denotes a composite expression (if operator === 'and' || operator === 'or ) then this array of child expressions links all the expressions with the operator. For example, if operator is 'and' and this array has 5 values then this whole expression represents each child expression linked by 'and' operator |

### Methods

| Method         | Parameters          | Description                       |
| :------------: | :-----------------: | --------------------------------- |
| toString       |                     | returns a String representation of the current expression based on it's i18n locale (currently dojo toolkit's i18n). Defaults to en-US |
| evaluate       | data: Object, recordContextStack: Array | evaluates the expression based on the `data` parameter. Most of the time you should send `recordContextStack` as null or empty Array |
| reset          |                                         | resets the expression to a default state |
| clone          |                                         | returns a shallow copy of the current expression |
| toJson         |                                         | Serializes the current expression to JSON format |
| fromJson       |                                         | Deserializes the current expression from JSON format |
| isValid        |                                         | Returns whether this expression is complete and valid |


### Known issues

| Who      | Date      | Description                                                |
| :------- | --------- | -----------------------------------------------------------|
| @eburgos | 7/16/2013 | ninejs/core/logic/Expression is still unable to evaluate expressions because I haven't had the time to write out that logic and I haven't still need it in any project. Hopefully it gets implemented soon |
| @eburgos | 7/16/2013 | ninejs/core/logic/Expression depends on dojo's declare. Some day I'll transfer it to ninejs/core/extend |