10.14 - How do I open a new window with javascript?
===================================================

New windows can be opened on browsers that support the
`window.open` function and are not subject to the action of any
pop-up blocking mechanism with code such as:-

    var wRef;
    if (window.open) {
      wRef = window.open("http://example.com/page.html","windowName");
    }

----

* <https://developer.mozilla.org/en/DOM:window.open>
* <http://www.infimum.dk/HTML/JSwindows.html>
