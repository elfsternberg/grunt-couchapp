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

var genDB = function(db) {
  var parts, dbname, auth;
  parts = urls.parse(db);
  dbname = parts.pathname.replace(/^\//, '');
  auth = parts.auth ? (parts.auth + '@') : '';
  return {
    name: dbname,
    url: parts.protocol + '//' + auth + parts.host
  };
};


module.exports = function(grunt) {

  // ==========================================================================
  // TASKS
  // ==========================================================================

    grunt.registerMultiTask("couchapp", "Install Couchapp", function() {
        var appobj, done;
        done = this.async();
        if (require("fs").lstatSync(this.data.app).isDirectory()) { // if new-style (directory-based) couchapp app
            appobj = couchapp.loadFiles(this.data.app);
            delete appobj._attachments;
            delete appobj[''];
            couchapp.loadAttachments(appobj, this.data.app+"/_attachments");
        } else { // otherwise, fall back to old style.
            appobj = require(path.join(process.cwd(), path.normalize(this.data.app)))
        }

        return couchapp.createApp(appobj, this.data.db, function(app) {
            return app.push(done);
        });
    });

    grunt.registerMultiTask("rmcouchdb", "Delete a Couch Database", function() {
        var done, parts, nano, dbname, _this, db;
        _this = this;
        done = this.async();
        db = genDB(this.data.db);
        try {
            nano = require('nano')(db.url);
            if (db.name) {
                nano.db.destroy(db.name, function(err) {
                    if (err) {
                        if (err.status_code && err.status_code === 404) {
                            if (_this.data.options && _this.data.options.okay_if_missing) {
                                grunt.log.writeln("Database " + db.name + " not present... skipping.");
                                return done(null, null) ;
                            } else {
                                throw ("Database " + db.name + " does not exist.");
                            }
                        } else {
                            throw err;
                        }
                    }
                    // remove db was a success
                    return done();
                });
            } else {
                grunt.log.writeln("No database specified... skipping.");
                return done(null, null);
            }
        } catch (e) {
            grunt.warn(e);
            return done(e, null);
        }
        return null;
    });

    grunt.registerMultiTask("mkcouchdb", "Make a Couch Database", function() {
        var done, parts, nano, dbname, _this, db;
        _this = this;

        done = this.async();
        parts = urls.parse(this.data.db);
        db = genDB(this.data.db);
        try {
            if (db.name) {
                nano = require('nano')(db.url);
                nano.db.create(db.name, function(err, res) {
                    if (err) {
                        if (err.error && err.error=="unauthorized") {
                            grunt.warn(err.reason);
                            throw err;
                        } else if (err.code && err.description) { // probably connection error
                            throw err;
                        }
                        else if (err.error && err.error=="file_exists") {
                            if (_this.data.options && _this.data.options.okay_if_exists) {
                                grunt.log.writeln("Database " + db.name + " exists, skipping");
                                return done(null, null);
                            } else {
                                grunt.warn("Database " + db.name + " exists and okay_if_exists set to false. Aborting.");
                                throw err;
                            }
                        } else {
                            console.warn("Unrecognized error.");
                            throw err
                        }
                    } else if (res && res.ok==true) {
                        grunt.log.ok("Database " + db.name + " created.");
                        return done(null, null);
                    } else {
                        console.log("Unexpected response received.");
                        console.dir(res);
                        throw "Unexpected response";
                    }
                });
            } else {
                var err_msg = "No database specified to create!";
                throw err_msg;
            }
        } catch (e) {
            grunt.warn(e);
            return done(e, null);
        }
        return null;
    });

};
