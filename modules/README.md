# ninejs/modules

Contains modules used to build basic ninejs features.

## Defining a module

    var moduleDefine = require('ninejs/modules/moduleDefine');
    moduleDefine(['dependency1Name', 'dependency2Name', { id: 'ninejs', version: '0.1.0', features: { harmony: true } }], function (unitDefine) {
        unitDefine({ id: 'mySuperModule', version: '1.0.0' }, function (dependency1, dependency2, dependency2) {
            ///
            return unitObj; //whatever you return here is your unit and could be used as a dependency for other units
        });
    });
    
You can specify dependencies either by id or version or features (id is required, version defaults to '*') or by it's id as a string. You can do the same while defining units.

## Folders

- **webserver**: The webserver module (server side).

## ninejs/modules/Module



## ninejs/modules/serverBoot

## ninejs/modules/clientBoot

