# How to Specify Variables #
- `${variable}`: Basic form
- `${variable|Type}`: If you are sure about the type of the variable.
    - Types supported: 
        - `String`: string values,
        - `9js`: for `9js` widgets,
        - `Dijit`: for `dijit` widgets, and
        - `DOM`: for any other widget

# How to Specify Function Calls #
The function name must exists on the template context, the syntax is as follow: `${func('param1', 'param2', ..., 'paramN')}`


# How to Specify Live Expressions #
***Live Expressions*** allow us to change the DOM after the component is initialized. Later if we change the variable value (on the context) the widget will change the corresponding DOM node.

- `<span>%{variable}</span>`


Actually this is the only way to represent a bounded variable.
