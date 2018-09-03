var app = app || {};

'use strict';
let basicValidatorFuctionText = function(attribute) {
    console.log(this.getLength());
    console.log(attribute.getdefault().length);
    return this.getLength() > attribute.getdefault().length && attribute.getLength() >= attribute.getdefault().length;
};
let basicValidatorFuctionNumbers = function(attribute) {
    console.log(attribute.getdefault());
    return this.getMax() >= attribute.getdefault() && attribute.getdefault() >= this.getMin() && helper.isInt(attribute.getdefault());
};

app.fieldTypes = {
    varchar: {
        category: 'text',
        maxLength: 255,
        javaName: 'String',
        validator: basicValidatorFuctionText
    },
    tinytext: {
        category: 'text',
        maxLength: 255,
        javaName: 'String',
        validator: basicValidatorFuctionText
    },
    text: {
        category: 'text',
        maxLength: 65535,
        javaName: 'String',
        validator: basicValidatorFuctionText
    },
    mediumtext: {
        category: 'text',
        maxLength: 16777215,
        javaName: 'String',
        validator: basicValidatorFuctionText
    },
    longtext: {
        category: 'text',
        maxLength: 4294967295,
        javaName: 'String',
        validator: basicValidatorFuctionText
    },
    tinyint: {
        category: 'int',
        minValue: -128,
        maxValue: 127,
        javaName: 'short',
        validator: basicValidatorFuctionNumbers
    },
    int: {
        category: 'int',
        minValue: -2147483648,
        maxValue: 2147483647,
        javaName: 'int',
        validator: basicValidatorFuctionNumbers
    },
    mediumint: {
        category: 'int',
        minValue: -8388608,
        maxValue: 8388607,
        javaName: 'long',
        validator: basicValidatorFuctionNumbers
    },
    bigint: {
        category: 'int',
        minValue: -9223372036854775808,
        maxValue: 9223372036854775807,
        javaName: 'long',
        validator: basicValidatorFuctionNumbers
    },
    date: {
        category: 'date',
        regex: /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/,
        javaName: 'String',
        validator: function (attribute) {
                return attribute.getdefault().length < 11 && (this.getRegex().test(String(attribute.getdefault())) || attribute.getdefault() === 'NOW()'|| attribute.getdefault() === 'now()');
        }
    }
};