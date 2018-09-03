var app = app || {};

(function () {
    'use strict';

    var type = Backbone.Collection.extend({
        model: app.AttributeType,

        initialize :function () {

            for (let name in app.fieldTypes) {
                if (app.fieldTypes.hasOwnProperty(name)) {
                    let type = app.fieldTypes[name];
                    let current = new app.AttributeType();
                    current.setName(name);
                    current.setCategory(type.category);
                    if (type.maxLength !== undefined)
                        current.setLength(type.maxLength);
                    if (type.minValue !== undefined)
                        current.setMin(type.minValue);
                    if (type.maxValue !== undefined)
                        current.setMax(type.maxValue);
                    if (type.validator !== undefined)
                        current.setValidator(type.validator);
                    if (type.regex !== undefined)
                        current.setRegex(type.regex);

                    this.add(current);
                }
            }
        }
    });
    app.type = new type();

})();