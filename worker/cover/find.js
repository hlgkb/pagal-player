var fs = require('fs');
var http = require("http");
var imdb = require("imdb-api");
var movieArt = require("movie-art");
var nameParser = require("video-name-parser");
var cover = {},
    target = {};

var storage = {};
cover.search = 0;

cover.readStoredCover = function(file) {
    var configJson, configObject, key, fileFound = true;
		try {
			configJson = fs.readFileSync(file, {
				encoding: "utf-8"
			});
		} catch (err) {
			console.log("No config.json file found");
			fileFound = false;
		}

		if (fileFound === true) {
			try {
				configObject = JSON.parse(configJson);
			} catch (err) {
				console.log("Hawa Invalid config.json file.");
			}

            for (key in configObject) {
				storage[key] = configObject[key];
			}
		}
}
cover.download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};


cover.findCover = function(newtarget) {
    cover.stopSearch();
    
    target = newtarget;
    var desc =  nameParser(target.filename);
    target.name = desc.name;
    target.type = desc.type;
    target.year = desc.year;
    if(storage[target.name]) {
        target.callback({url:"C:\\Users\\hlgkb\\AppData\\Local\\pagal-player\\covers\\"+storage[target.name],id:target.id});
    } else {
        cover.find();
    }
    
};

cover.find = function() {
    var type = "movie";
    var width = "w185";
    var year = (target.year) || null;
    var name = target.name;
    var id = target.id;
    if(target.type == "series") {
        type = "tv";
    }

    movieArt(name, year, width, type, function (err, url) {
        if(err) {
            //cover.tryLater(1500);
            target.callback({err: err});
            return;            
        }
        target.callback({url:url,id:id});
        target = {};
    });  

};

cover.tryLater = function(timems) {
    cover.stopSearch();
    cover.search = setTimeout(function(){
        cover.find();
    });
};

cover.stopSearch = function() {
    if(cover.search) {
        clearTimeout(cover.search);
        cover.search = null;
    }    
}

self.onmessage = function(msg) {
    target = msg.data;
    target.callback = function(url) {
        postMessage(url);
    }
    cover.readStoredCover("C:\\Users\\hlgkb\\AppData\\Local\\pagal-player\\cover.json");
    cover.findCover(target);
}


