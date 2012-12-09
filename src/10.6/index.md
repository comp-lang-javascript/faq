10.6 - How do I close a window and why does it not work on the first one?
=========================================================================

Use `windowRef.close()`, where windowRef is a window object reference, 
such as `window`, `top`, `parent`, `self`, or a reference obtained from 
the `window.open()` method. You can only close windows opened by
scripts, no others.

----

* <http://msdn.microsoft.com/workshop/author/dhtml/reference/methods/close_0.asp>
* <http://docs.sun.com/source/816-6408-10/window.htm#1201822>
