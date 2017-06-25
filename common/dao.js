const r = require("rethinkdb");

let connection = null;
r.connect({ host: 'localhost', port: 32770 }, function(err, conn) {
    if (err) throw err;
    connection = conn;
})


try {
    r.dbCreate('borsa').run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    })
}  catch (ReqlRuntimeError) {
    console.log("borse database exists");
}


try {
    r.db('borsa').tableCreate('offers').run(connection, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    })
} catch (ReqlOpFailedError) {
    console.log("offer table exists");
}
