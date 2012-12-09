10.2 - How do I access a frame's content? 
=========================================


To reference another frame on the _same domain_: 
------------------------------------------------

The content window of a `FRAME` or `IFRAME` can be 
accessed by the `frames` collection. 

Example: 

    var fwin; 
    fwin = self.frames[0]; // or: 
    fwin = self.frames["iframeName"]; 

or, from the `IFRAME` or `FRAME` element: 

    var iframeEl = document.getElementById("myFrame"); 
    // Nonstandard, but widely supported.
    var fwin = iframeEl.contentWindow; 
    // DOM2 HTML Standard. 
    var fdoc = iframeEl.contentDocument; 

A global identifier `moomin` in the the iframe's content window 
is accessed as `fwin.moomin`.


To communicate between frames on _different_ domains:
-----------------------------------------------------

Where supported, (IE8, Firefox 3, Opera 9, Safari 4), use 
`window.postMessage( message[, port], otherDomain);`. 

Example: <http://jibbering.com/faq/example/postMessage.html>

Where `window.postMessage` is not supported, the `window.name` property
can be set on the other window, which can poll for updates to that 
property using `setInterval(checkWinName, 100);` where `checkWinName` 
is a function that polls to check the value of 
`self.name`.

----

* <http://en.wikipedia.org/wiki/Same_origin_policy> 
* <http://www-archive.mozilla.org/docs/dom/domref/dom_frame_ref5.html> 
* <https://developer.mozilla.org/en/DOM/window.postMessage> 
* <http://msdn.microsoft.com/en-us/library/cc197015(VS.85).aspx> 
