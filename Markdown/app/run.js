// NOTE:  This is a very first pass, borrowing heavily from JSDOc Toolkit, and
// hacked together.  There is a tremendous amount of clean-up necessary here!
// http://code.google.com/p/jsdoc-toolkit/

function FilePath(absPath, separator) {
	this.slash =  separator || "/"; 
	this.root = this.slash;
	this.path = [];
	this.file = "";
	
	var parts = absPath.split(/[\\\/]/);
	if (parts) {
		if (parts.length) this.root = parts.shift() + this.slash;
		if (parts.length) this.file =  parts.pop()
		if (parts.length) this.path = parts;
	}
	
	this.path = this.resolvePath();
}

FilePath.prototype.resolvePath = function() {
	var resolvedPath = [];
	for (var i = 0; i < this.path.length; i++) {
		if (this.path[i] == "..") resolvedPath.pop();
		else if (this.path[i] != ".") resolvedPath.push(this.path[i]);
	}
	return resolvedPath;
};

FilePath.prototype.toDir = function() {
	if (this.file) this.file = "";
	return this;
};

FilePath.prototype.upDir = function() {
	this.toDir();
	if (this.path.length) this.path.pop();
	return this;
};

FilePath.prototype.toString = function() {
	return this.root
		+ this.path.join(this.slash)
		+ ((this.path.length > 0)? this.slash : "")
		+ this.file;
};

FilePath.fileName = function(path) {
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(nameStart);
};

FilePath.fileExtension = function(filename) {
   return filename.split(".").pop().toLowerCase();
};

FilePath.dir = function(path) {
	var nameStart = Math.max(path.lastIndexOf("/")+1, path.lastIndexOf("\\")+1, 0);
	return path.substring(0, nameStart-1);
};


importClass(java.lang.System);

SYS = {
	os: [
		new String(System.getProperty("os.arch")),
		new String(System.getProperty("os.name")),
		new String(System.getProperty("os.version"))
	].join(", "),
	slash: System.getProperty("file.separator")||"/",
	userDir: new String(System.getProperty("user.dir")),
	javaHome: new String(System.getProperty("java.home")),
	pwd: undefined
};

// jsrun appends an argument, with the path to here.
if (arguments[arguments.length-1].match(/^-j=(.+)/)) {
	if (RegExp.$1.charAt(0) == SYS.slash || RegExp.$1.charAt(1) == ":") { // absolute path to here
		SYS.pwd = new FilePath(RegExp.$1).toDir().toString();
	}
	else { // relative path to here
		SYS.pwd = new FilePath(SYS.userDir + SYS.slash + RegExp.$1).toDir().toString();
	}
	arguments.pop();
}
else {
	print("The run.js script requires you use jsrun.jar.");
	quit();
}

var File = Packages.java.io.File;

IO = {
	saveFile: function(/**string*/ outDir, /**string*/ fileName, /**string*/ content) {
		var out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(outDir+SYS.slash+fileName),
				IO.encoding
			)
		);
		out.write(content);
		out.flush();
		out.close();
	},
	readFile: function(/**string*/ path) {
		if (!IO.exists(path)) {
			throw "File doesn't exist there: "+path;
		}
		return readFile(path, IO.encoding);
	},
	copyFile: function(/**string*/ inFile, /**string*/ outDir, /**string*/ fileName) {
		if (fileName == null) fileName = FilePath.fileName(inFile);
	
		var inFile = new File(inFile);
		var outFile = new File(outDir+SYS.slash+fileName);
		
		var bis = new Packages.java.io.BufferedInputStream(new Packages.java.io.FileInputStream(inFile), 4096);
		var bos = new Packages.java.io.BufferedOutputStream(new Packages.java.io.FileOutputStream(outFile), 4096);
		var theChar;
		while ((theChar = bis.read()) != -1) {
			bos.write(theChar);
		}
		bos.close();
		bis.close();
	},
	mkPath: function(/**Array*/ path) {
		if (path.constructor != Array) path = path.split(/[\\\/]/);
		var make = "";
		for (var i = 0, l = path.length; i < l; i++) {
			make += path[i] + SYS.slash;
			if (! IO.exists(make)) {
				IO.makeDir(make);
			}
		}
	},
	makeDir: function(/**string*/ path) {
		(new File(path)).mkdir();
	},
	ls: function(/**string*/ dir, /**number*/ recurse, _allFiles, _path) {
		if (_path === undefined) { // initially
			var _allFiles = [];
			var _path = [dir];
		}
		if (_path.length == 0) return _allFiles;
		if (recurse === undefined) recurse = 1;
		
		dir = new File(dir);
		if (!dir.directory) return [String(dir)];
		var files = dir.list();
		
		for (var f = 0; f < files.length; f++) {
			var file = String(files[f]);
			if (file.match(/^\.[^\.\/\\]/)) continue; // skip dot files
	
			if ((new File(_path.join(SYS.slash)+SYS.slash+file)).list()) { // it's a directory
				_path.push(file);
				if (_path.length-1 < recurse) IO.ls(_path.join(SYS.slash), recurse, _allFiles, _path);
				_path.pop();
			}
			else {
				_allFiles.push((_path.join(SYS.slash)+SYS.slash+file).replace(SYS.slash+SYS.slash, SYS.slash));
			}
		}
	
		return _allFiles;
	},
	exists: function(/**string*/ path) {
		file = new File(path);
	
		if (file.isDirectory()){
			return true;
		}
		if (!file.exists()){
			return false;
		}
		if (!file.canRead()){
			return false;
		}
		return true;
	},
	open: function(/**string*/ path, /**string*/ append) {
		var append = true;
		var outFile = new File(path);
		var out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(outFile, append),
				IO.encoding
			)
		);
		return out;
	},
	setEncoding: function(/**string*/ encoding) {
		if (/ISO-8859-([0-9]+)/i.test(encoding)) {
			IO.encoding = "ISO8859_"+RegExp.$1;
		}
		else {
			IO.encoding = encoding;
		}
	},
	encoding: "utf-8",
	include: function(relativePath) {
		load(SYS.pwd+relativePath);
	},
	includeDir: function(path) {
		if (!path) return;
		
		for (var lib = IO.ls(SYS.pwd+path), i = 0; i < lib.length; i++) 
			if (/\.js$/i.test(lib[i])) load(lib[i]);
	},
    copyDir: function(fromDir, toDir, recurse, callback) {
        var charCount = fromDir.length;
        if (callback === undefined) {callback = function(){};}
        if (recurse === undefined) {recurse = 1;}
        var paths = IO.ls(fromDir, recurse);
        for (var i = 0, len = paths.length; i < len; i++) {
            var trailingPath = paths[i].substring(charCount);
            var newPath = toDir + trailingPath;
            var newDir = newPath.split("\\");
            newDir.pop();
            newDir = newDir.join("/");
            IO.makeDir(newDir);
            IO.copyFile(paths[i], newDir);
            callback(paths[i], newDir);
        }
        return paths.length;
    }
};

// now run the application
IO.include("Opt.js");
IO.include("showdown.js");
// IO.include("js-markdown-extra.js");
IO.include("json2.js");
APP = {};

if (typeof arguments == "undefined") arguments = [];
APP.opts = Opt.get(
    arguments, 
    {
        c: "tableOfContents",
        i: "inputDir",
        h: "help",
        o: "outputDir",
        r: "resourceDir",
        t: "templateDir"
    }
);

if (APP.opts.h) {
    print("\nCreates HTML output from markdown files.")
	print("\nUSAGE: java -jar jsrun.jar app/run.js [OPTIONS]");
	print("");
	print("OPTIONS:");
	print("  -c or --tableOfContents\n          Table of Contents file (json) (relative to output dir.)");
	print("  -i or --inputDir\n          Input directory (containing markdown files.)");
	print("  -h or --help\n          Show this message and exit.");
	print("  -o or --outputDir\n          Output directory (where HTML files will be placed.");
	print("  -r or --resourceDir\n          Resource directory (containing CSS, Javascript, etc.)");
	print("  -t or --templateDir\n          Template directory (containing HTML to mix in with output files.)");
	
	quit();
}

var inputDir = APP.opts.i;

if (!inputDir) {
    print("No input dir.  Use -i=path/to/input");
    quit();
}

var outputDir = APP.opts.o || inputDir;

var templatePath = APP.opts.t || SYS.pwd + "templates";
var headerPath = templatePath + "/header.html";
var footerPath = templatePath + "/footer.html";
var tocPath = templatePath + "/toc.js"
var header = IO.readFile(headerPath);
var footer = IO.readFile(footerPath);
var toc = false;
try {
    toc = IO.readFile(tocPath);
} catch (e) {
    print(e.message);
}

print(" ");
print("\n****************************************");
print("Converting Markdown to HTML\n");
print("****************************************");
print(" ");
var showdown = new Showdown.converter();
IO.makeDir(outputDir);
var charsToReplace = inputDir.length;
var paths = IO.ls(inputDir, 10) || []; // recurse to ten levels deep
var count = 0;
var indexBuilder = (function() {
    var structure = {};
    var getFolder = function(parent, path) {
        if (path === "") {return parent;}
        var parts = path.substring(1).split("/");
        var folders = parent.folders || (parent.folders = []);
        var i, len, folder;
        for (i = 0, len = folders.length; i < len; i++) {
            folder = folders[i];
            if (folder.name == parts[0]) {
                parts.shift();
                return getFolder(folder, parts.join("/"));
            }
        }
        folder = {name: parts[0]};
        folders.push(folder);
        parts.shift();
        return getFolder(folder, parts.join("/"));
    }
    var indexBuilder = function(dirName, fileName, title) {
        var folder = getFolder(structure, dirName);
        (folder.files || (folder.files = [])).push({
            name: title,
            path: fileName
        });
    };
    indexBuilder.toString = function() {
        return JSON.stringify(structure, null, 4);;
    };
    return indexBuilder;
}());
var initDirLen = new File(outputDir).getCanonicalPath().length();
for (var i = 0, len = paths.length; i < len; i++) {
    var filePath = new FilePath(outputDir + paths[i].substring(charsToReplace));
    var dirName = FilePath.dir(filePath.toString());
    var fileName = FilePath.fileName(paths[i]);
    var fileExtension = FilePath.fileExtension(paths[i]);
    if (fileExtension !== "md") {continue;}
    count += 1;
    var newName = fileName.split(".");
    newName.pop();
    newName.push("html");
    newName = newName.join(".")
    print("Creating " + (new File(dirName + "/" + newName)).getCanonicalPath());
    var pathToRoot = new Array(dirName.substring(initDirLen).split(/[\\\/]/).length).join("../");
    IO.mkPath(dirName);
    var markdown = IO.readFile(paths[i]);
    var title = markdown.split(/\r?\n/)[0];
    indexBuilder(dirName.substring(initDirLen), newName, title);
    var html = showdown.makeHtml(markdown);
    // var html = Markdown(markdown);
    html = (header + html + footer).replace(/\$\{title\}/g, title).replace(/\$\{pathToRoot\}/g, pathToRoot);
    IO.saveFile(dirName, newName, html);
}
print("----------------------------------------");
print("\n" + count + " file" + (count === 1 ? "" : "s") + " converted.");
print(" ");
print("****************************************");
print("\n" + "Copying resource files." + "\n");
print("****************************************");
print(" ");
count = IO.copyDir(APP.opts.r || SYS.pwd + "resources", outputDir, 10, function(oldPath, newDir) {
    print("Copying " + (new File(oldPath)).getCanonicalPath() + 
        "\n     to " + (new File(newDir)).getCanonicalPath());
});

print("----------------------------------------");
print("\n" + count + " file" + (count === 1 ? "" : "s") + " copied.");

if (toc && APP.opts.c) {
    var filePath = new FilePath(outputDir + "/" + APP.opts.c);
    var dirName = FilePath.dir(filePath.toString());
    var fileName = FilePath.fileName(filePath.toString());
    print("----------------------------------------");
    print(" ");
    print("Creating Table of Contents in " + (new File(filePath.toString())).getCanonicalPath());
    IO.mkPath(dirName);
    IO.saveFile(dirName, fileName, toc.replace(/\$\{jsonToc\}/g, indexBuilder.toString()));
}
print(" ");
print("****************************************");
