exports.getCookie = function(opts, cb){
    var db = nano(opts.db.url);
    nano.auth(opts.username, opts.password, function(err, body, headers){
        if(err){
            cb(err);
        }else{
            if(headers && headers['set-cookie']){
                cb(null, headers['set-cookie']);
            }
        }
    });
}