define(['jquery', 'attribute'], function($) {

    describe('just checking', function() {
        it('length', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setLength(14);
            expect(aaa.getLength()).equal(14);
        });
        it('name', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setName('name');
            expect(aaa.getName()).equal('name');
        });
        it('PK', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('primaryKey',true);
            expect(aaa.getProperty('primaryKey')).equal(true);
        });
        it('NN', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('notNull',true);
            expect(aaa.getProperty('notNull')).equal(true);
        });
        it('AI', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('autoIncrement',true);
            expect(aaa.getProperty('autoIncrement')).equal(true);
        });
        it('AI', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('defaultCheck',true);
            expect(aaa.getProperty('defaultCheck')).equal(true);
        });
        it('PK', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('primaryKey',true);
            expect(aaa.getProperty('primaryKey')).equal(true);
        });

        it('falsePK', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('primaryKey',true)
            aaa.setProperty('primaryKey',false);

            expect(aaa.getProperty('primaryKey')).equal(false);
        });

        it('falseNN', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('notNull',true)
            aaa.setProperty('notNull',false);

            expect(aaa.getProperty('notNull')).equal(false);
        });
        it('falseAI', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('autoIncrement',true);
            aaa.setProperty('autoIncrement',false);

            expect(aaa.getProperty('autoIncrement')).equal(false);
        });
        it('falseDefault', function () {
            'use strict';
            let aaa = new app.Attribute();
            aaa.setProperty('defaultCheck',true);
            aaa.setProperty('defaultCheck',false);

            expect(aaa.getProperty('defaultCheck')).equal(false);
        });

    });
});
