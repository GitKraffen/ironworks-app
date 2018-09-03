'use strict';
var GeneratorTemplate = require('./generatorTemplate');
module.exports = class JavaManagerGenerator extends GeneratorTemplate {
    constructor(){
        super();
    }
    newEntity(name) {
        this.generatedCode += //'import %%PACKAGE%%\n\n' +
            'import java.util.List;\n' +
            'import java.util.Date;\n' +
            'import java.util.Iterator;\n' +
            'import java.util.ArrayList;\n' +
            '\n' +
            'import org.hibernate.HibernateException;\n' +
            'import org.hibernate.Session;\n' +
            'import org.hibernate.Transaction;\n' +
            'import org.hibernate.cfg.Configuration;\n' +
            'import org.hibernate.SessionFactory;\n' +
            'import org.hibernate.cfg.Configuration;\n' +
            '\n' +
            'public class Manage' + name +' ';
            this.generatedCode += '{\n' +
            '   private static SessionFactory factory;\n' +
            '\n' +
            '   static {\n' +
            '       try {\n' +
            '           factory = new Configuration().\n' +
            '                   configure().\n' +
            '                           addAnnotatedClass(' + name + '.class).\n' +
            '                           buildSessionFactory();\n' +
            '       } catch (Throwable ex) {\n' +
            '           System.err.println("Failed to create sessionFactory object." + ex);\n' +
            '           throw new ExceptionInInitializerError(ex);\n' +
            '       }\n' +
            '   }\n';
        this.generatedCode += 'public ' + name + ' add' + name + '(' + name + ' new' + name + '){\n' +
            '       Session session = factory.openSession();\n' +
            '       Transaction tx = null;\n' +
            '\n' +
            '       try {\n' +
            '           tx = session.beginTransaction();\n' +
            'session.save(new' + name + ');\n' +
            '           tx.commit();\n' +
            '       } catch (HibernateException e) {\n' +
            '           if (tx!=null) tx.rollback();\n' +
            '           e.printStackTrace();\n' +
            '       } finally {\n' +
            '           session.close();\n' +
            '       }\n' +
            '       return new' + name + ';\n' +
            '   }\n' +

            'public List<' + name + '> list' + name + 's() {\n' +
            '       Session session = factory.openSession();\n' +
            '       Transaction tx = null;\n' +
            '       List<' + name + '> toReturn = new ArrayList<' + name + '>();\n' +
            '\n' +
            '       try {\n' +
            '           tx = session.beginTransaction();\n' +
            '           List ' + name.toLowerCase() + 's = session.createQuery("FROM ' + name + '").list();\n' +
            '           for (Iterator iterator = ' + name.toLowerCase() + 's.iterator(); iterator.hasNext();){\n' +
            '               ' + name + ' ' + name.toLowerCase() + ' = (' + name + ') iterator.next();\n' +
            '               toReturn.add(' + name.toLowerCase() + ');\n' +
            '           }\n' +
            '           tx.commit();\n' +
            '       } catch (HibernateException e) {\n' +
            '           if (tx!=null) tx.rollback();\n' +
            '           e.printStackTrace();\n' +
            '       } finally {\n' +
            '           session.close();\n' +
            '       }\n' +
            '       return toReturn;\n' +
            '   }\n' +

            'public void update' + name + '(' + name + ' ' + name.toLowerCase() + '){\n' +
            '       Session session = factory.openSession();\n' +
            '       Transaction tx = null;\n' +
            '\n' +
            '       try {\n' +
            '           tx = session.beginTransaction();\n' +
            '           session.update(' + name.toLowerCase() + ');\n' +
            '           tx.commit();\n' +
            '       } catch (HibernateException e) {\n' +
            '           if (tx!=null) tx.rollback();\n' +
            '           e.printStackTrace();\n' +
            '       } finally {\n' +
            '           session.close();\n' +
            '       }\n' +
            '   }\n' +

            'public void delete' + name + '(' + name + ' ' + name.toLowerCase() + '){\n' +
            '       Session session = factory.openSession();\n' +
            '       Transaction tx = null;\n' +
            '\n' +
            '       try {\n' +
            '           tx = session.beginTransaction();\n' +
            '           session.delete(' + name.toLowerCase() + ');\n' +
            '           tx.commit();\n' +
            '       } catch (HibernateException e) {\n' +
            '           if (tx!=null) tx.rollback();\n' +
            '           e.printStackTrace();\n' +
            '       } finally {\n' +
            '           session.close();\n' +
            '       }\n' +
            '   }\n' +
            '}\n';

    }

    closeEntity() {
        this.generatedCode += '%%SPLIT%%';
    }
    newSubEntity(name, parentName) {
        this.temporaryClassKey = this.temporarySubEntity;
        this.newEntity(name);
    }
    closeSubEntity(parentName) {
        this.closeEntity();
    }

}