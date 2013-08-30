/*
 * grunt-couchapp https://github.com/elf/grunt-couchapp
 *
 * Copyright (c) 2012 Ken "Elf" Mathieu Sternberg
 * Licensed under the MIT license.
 */

var path, couchapp, nanolib, urls;

path = require('path');
couchapp = require('couchapp');
urls = require('url');

module.exports = function(grunt) {

  // ==========================================================================
  // TASKS
  // ==========================================================================

    grunt.registerMultiTask("couchapp", "Install Couchapp", function() {
        var appobj, done;
        done = this.async();
        appobj = require(path.join(process.cwd(), path.normalize(this.data.app)));
        return couchapp.createApp(appobj, this.data.db, function(app) {
            return app.push(done);
        });
    });

    grunt.registerMultiTask("rmcouchdb", "Delete a Couch Database", function() {
        var done, parts, nano, dbname, _this;
        _this = this;
        done = this.async();
        parts = urls.parse(this.data.db);
        dbname = parts.pathname.replace(/^\//, '');
        auth = parts.auth ? parts.auth+'@' : '';
        try {
            nano = require('nano')(parts.protocol + '//' + auth + parts.host);
            nano.db.destroy(dbname, function(err) {
                if (err) {
                    if (err.status_code && err.status_code === 404) {
                        if (_this.data.options && _this.data.options.okay_if_missing) {
                            grunt.log.writeln("Database " + dbname + " not present... skipping.");
                            return done(null, null) ;
                        } else {
                            grunt.warn("Database " + dbname + " does not exist.");
                        }
                    } else {
                        grunt.warn(err);
                    }
                }
                return done(err, null);
            });
        } catch (e) {
            grunt.warn(e);
            done(e, null);
        }
    });

    grunt.registerMultiTask("mkcouchdb", "Delete a Couch Database", function() {
        var done, parts, nano, dbname, _this;
        _this = this;
        done = this.async();
        parts = urls.parse(this.data.db);
        dbname = parts.pathname.replace(/^\//, '');
        auth = parts.auth ? parts.auth+'@' : '';
        try {
            nano = require('nano')(parts.protocol + '//' + auth + parts.host);
            nano.db.create(dbname, function(err) {
                if (_this.data.options && _this.data.options.okay_if_exists) {
                    if (err){
                        grunt.log.writeln("Database " + dbname + " exists, skipping");
                    }
                    return done(null, null);
                } else {
                    if (err){
                        grunt.warn(err);
                    }
                    return done(err, null);
                }
            });
        } catch (e) {
            grunt.warn(e);
            done(e, null);
        }
    });

};
