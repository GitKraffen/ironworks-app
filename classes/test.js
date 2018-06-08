'use strict'
var JavaGenerator = require('./javaGenerator');
var SQLGenerator = require('./sqlGenerator');
var XMLGenerator = require('./xmlGenerator');

/*
    let data = [{
        name: 'Utente',
        attributes: [{
            name: 'username',
            type: 'String'
        },
            {
                name: 'password',
                type: 'String'
            }],
        subEntities: [{
            name: 'Boh',
            attributes: [{
                name: 'username',
                type: 'String'
            },
                {
                    name: 'password',
                    type: 'String'
                }],
        },
            {
                name: 'lul',
                attributes: [{
                    name: 'code',
                    type: 'String'
                }
                ],
            }]

    }];
*/
let data = [{
    name: 'Utente',
    attributes: [{
        name: 'username',
        type: 'String',
        length: '20',
        pk: true,
        nn: true,
        uq: true,
        ai: true,
        def: 'user'
    },
    {
       name: 'password',
       type: 'int',
       length: '',
       pk: false,
       nn: true,
       uq: false,
       ai: false,
       def: ''
    }],
    subEntities: [{
        name: 'Ciao',
        attributes: [{
            name: 'Elia',
            type: 'String',
            length: '20',
            pk: true,
            nn: true,
            uq: true,
            ai: true,
            def: 'elia'
        }]}]}];
let jg = new JavaGenerator();
jg.generate(data);
