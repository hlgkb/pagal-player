var treeView = this,
    fs = require("fs"),
    open_dir = {},
    pagal = null,
    pagalCore = null,
    fs = null,
	current_menu_item = false;

exports.init = function(passedValue) {
    pagalCore = passedValue;
    pagal = pagalCore.pagal;
    fs = pagal.fs;

    pagal.treeView = treeView;

    if(pagal.openedDir != null)
    {
        try {
            fs.readdir(pagal.openedDir, function (err, files) {
                if (err) {
                    console.log(err.message);
                } else {
                    files_ = treeView.sortFiles(files, pagal.openedDir);
                    treeView.injectFilesToRoot(files_, pagal.elements.openDirec, pagal.openedDir, pagal);
                }

            });
        } catch(err) {

        }
        
    }
    
}

exports.sortFiles = function (files, cwd) {
    var mainBuffer = [],
        folderBuffer = [],
        fileBuffer = [],
        key = null,
        fstat = null,
        uid = null;

    for (key in files) {
		uid = cwd + "/" + files[key];
		try {
			fstat = fs.statSync( uid );
		} catch (err) {
            console.log(err.message);
		}

		if ( fstat.isFile()) {
            if(pagal.checkExtension(uid, pagal.acceptableFile)) fileBuffer.push( files[key] );
		} else {
			if(files[key] == pagal.openedDirBase) {
				folderBuffer.push( files[key] );
				break;
			}
			
		}
	}

    for ( key in folderBuffer ) {
		mainBuffer.push( folderBuffer[key] );
	}
	for ( key in fileBuffer ) {
		mainBuffer.push( fileBuffer[key] );
	}
	return mainBuffer;

    
}

exports.injectFilesToRoot = function(files, projectRoot, cwd, pagal) {
	var key;
	for ( key in files ) {
		treeView.createProjectItem( files[key], projectRoot, cwd, pagal );
	}
};

exports.createProjectItem = function( file, projectRoot, cwd, pagal ) {

	var list_item, list_span, uri, fstat;

	uri = cwd + "/" + file;

	list_item = window.document.createElement("li");
	list_item.setAttribute("data-uri", uri);

	list_span = window.document.createElement("span");
	list_span.innerHTML = file;

	list_item.appendChild(list_span);
	if(pagal.elements.openDirec == projectRoot) {
		console.log("jQuery object");
		projectRoot.append(list_item);
	} else {
		console.log("Normal javascript object");
		projectRoot.appendChild(list_item);
	}
	

	//Onclick.
	list_item.onmousedown = function(e){
		e.preventDefault();
		e.stopPropagation();

		if ( open_dir.hasOwnProperty(uri) ) {
			treeView.handleSecondClick( uri, list_item );
			return;
		}

		treeView.handleClick( file, list_item, cwd, pagal );

	};

	//Fix this.
	//We shouldn't be checking stats more than once.
	fs.stat( uri, function(err, file) {

		if ( err ) {
			return;
		}

		if ( file.isFile() ) {
			list_item.setAttribute( "data-type", "file" );
		} else {
			list_item.setAttribute( "data-type", "folder" );
		}

	} );
    return list_item;
};

exports.handleClick = function( file, list_item, cwd, pagal ) {

	var uri;

	uri = cwd + "/" + file;

	if ( current_menu_item !== false && list_item !== current_menu_item ) {
		current_menu_item.className = "";
	}

	list_item.className = "current";
	current_menu_item = list_item;

	//File or directory?
	fs.stat( uri, function(err, data) {

		if ( err ) {
			
			return;
		}

		if ( data.isFile() ) {
			
		} else if ( data.isDirectory() ) {
			//Expand.
			treeView.expandDir( list_item, pagal );
			open_dir[uri] = list_item;
		}

	});

};

exports.expandDir = function( list_item, bs ) {

	var uri, submenu;

	uri = list_item.getAttribute("data-uri");

	fs.readdir( uri, function(err, files) {

		if (err) {
			bs.bsError(err);
			return;
		}

		files = treeView.sortFiles( files, uri );

		submenu = window.document.createElement("ul");
		submenu.className = "submenu";
		submenu.setAttribute("data-uri", uri);

		list_item.appendChild(submenu);

		treeView.injectFilesToRoot( files, submenu, uri, pagal);

	});

};

exports.handleSecondClick = function( uri, list_item ) {

	var submenu, i, max, duri;

	submenu = list_item.querySelectorAll("ul.submenu");
	max = submenu.length;

	if ( max > 0 ) {
		for ( i=0; i<max; i++ ) {
			duri = null;
			duri = submenu[i].getAttribute("data-uri");
			delete open_dir[duri];
		}
		submenu[0].className = "submenu display-none";
		setTimeout(function(){
			list_item.removeChild( submenu[0] );
		}, 100);
	}

};