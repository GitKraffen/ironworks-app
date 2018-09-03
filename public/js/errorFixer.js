var app = app || {};

(function () {
    'use strict';

    /*
    * Codice errori:
    *   errXY00
    *   X = [E -> errore, A -> alert, L -> log]
    *   Y = [G -> grafica, L -> logica]
    *   si parte la numerazione da 01 !!!
    * */

    class ErrorFixer {
        constructor() {
            this.errors = {
                type: 'category',
                subCategory: {
                    'Ent': {
                        type: 'category',
                        description: 'Errori entity',
                        subCategory: {
                            'ill': {
                                type: 'categoryLeaf',
                                description: 'Illegalità nel contenuto della subentity',
                                error: new app.IllegalEntityError(),
                            },
                            'Col': {
                                type: 'categoryLeaf',
                                description: 'Errori concreti sulle collection di entities',
                                error: new app.EntitiesError(),
                            },
                            'Mod': {
                                type: 'categoryLeaf',
                                description: 'Errori entity model name',
                                error: new app.EntityError(),
                            },
                            'Attr': {
                                type: 'category',
                                description: 'Errori Entity attribute',
                                subCategory: {
                                    'Col': {
                                        type: 'categoryLeaf',
                                        description: 'Errori sulle collection di attributes di una entity',
                                        error: new app.EntityAttributesError(),
                                    },
                                    'Mod': {
                                        type: 'categoryLeaf',
                                        description: 'Errori attribute',
                                        error: new app.AttributeError(),
                                    },
                                    'ill': {
                                        type: 'categoryLeaf',
                                        description: 'Errori attribute',
                                        error: new app.IllegalAttributeError(),
                                    }                                
                                }
                            }
                        }
                    },
                    'Subent': {
                        type: 'category',
                        description: 'Errori entity',
                        subCategory: {
                            'ill': {
                                type: 'categoryLeaf',
                                description: 'Illegalità nel contenuto della subentity',
                                error: new app.IllegalSubentityError(),
                            },
                            'Col': {
                                type: 'categoryLeaf',
                                description: 'Errori concreti sulle collection di entities',
                                error: new app.SubentitiesError(),
                            },
                            'Mod': {
                                type: 'categoryLeaf',
                                description: 'Errori entity model name',
                                error: new app.SubentityError(),
                            },
                            'Attr': {
                                type: 'category',
                                description: 'Errori Subentity attribute',
                                subCategory: {
                                    'ill': {
                                        type: 'categoryLeaf',
                                        description: 'Errori attribute',
                                        error: new app.IllegalAttributeError(),
                                    },
                                    'Col': {
                                        type: 'categoryLeaf',
                                        description: 'Errori sulle collection di attributes di una subentity',
                                        error: new app.SubentityAttributesError(),
                                    },
                                    'Mod': {
                                        type: 'categoryLeaf',
                                        description: 'Errori attribute',
                                        error: new app.AttributeError(),
                                    }
                                }
                            }
                        }
                    },
                    'G': {
                        type: 'category',
                        description: 'Errori e log globali',
                        subCategory: {
                            'General': {
                                type: 'categoryLeaf',
                                description: 'Log globali',
                                error: new app.ErrorGlobals(),
                            }
                        }
                    }
                }
            }
        }

        getErrName(id) {
            let error = this.getError(id);
            return error.getName();
        }

        getErrDescription(id) {
            let error = this.getError(id);
            return error.description;
        }

        isFixable(id) {
            let error = this.getError(id);
            return (typeof error !== undefined && error.hasSolution());
        }

        getRoot(root) {
            // Grep base root
            let exploded = root.split('.');
            let rootObj = this.errors;
            for (let i = 0; i < exploded.length; i++) {
                if(rootObj.subCategory[exploded[i]] === undefined){
                    return false;
                }
                rootObj = rootObj.subCategory[exploded[i]];
            }

            return rootObj;
        }

        getError(id) {
            let exploded = id.split('.');
            let newID = exploded[ exploded.length - 1];
            exploded.splice(-1,1);
            let root = this.getRoot(exploded.join('.'));
            if (root.type !== 'categoryLeaf')
                return false;
            else
                return root.error.at(newID);
        }

        validate(root, subject,father = false) {
            // Grep base root
            let sent=true;
            let rootObj = this.getRoot(root);

            if (rootObj.type === 'category'){
                console.log('Errore, impossibile validare una categoria intera');
                sent=false;
            }
            else{
                if (rootObj.type === 'categoryLeaf') {
                    let object;
                    for (let i = 0; i < rootObj.error.length; i++) {
                        let errID = root + '.' + i;
                        object=rootObj.error.models[i];
                        if(typeof object.validate === 'function' && object.validate !== false){
                            if (!object.validate(subject)){
                                sent=false;
                                app.errorView.newError(errID, subject, father);
                            }
                        }
                        else{
                            console.log('No validator for error ' + errID);
                        }
                    }
                }
            }
            return sent;
        }


        fixError(id, params) {
            let error = this.getError(id);

            if (this.isFixable(id)) {
                error.fixProblem(params);
                this.trigger('something fixed','');
                return true;
            }else {
                return false;
            }
        }
    }

    app.errorFixer = new ErrorFixer();

    _.extend(app.errorFixer, Backbone.Events);
})();
