10.8 - How do I make a 10 second delay?
=======================================

There is no built-in way to pause execution in javascript such
as a sleep function, but hosts usually provide a method of some
form. Web browsers are designed for event driven programming and
only provide the `setTimeout` and `setInterval` functions
to facilitate timed delays. The delay before calling `getSnork` may
exceed the second parameter to `setTimeout` and `setInterval`
due to implementation differences among browsers.

To call the function `getSnork`, approximately 10 seconds
after the function `getMoomin()` completes, you would do this:

    getMoomin();
    setTimeout(getSnork, 10000);

Script execution is not stopped, and adding `getSnufkin()` after the
`setTimeout` line would immediately execute the function `getSnufkin`
before `getSnork`.

Achieving delays through running a loop of some sort for a pre-defined
period is a bad strategy, as that will inhibit whatever was supposed to
be happening during the delay, including blocking user interation.

Other (less event driven) hosts have different wait functions,
such as `WScript.Sleep()` in the Windows Script Host.

----

* <http://msdn.microsoft.com/en-us/library/ms536753%28VS.85%29.aspx>
* <http://docs.sun.com/source/816-6408-10/window.htm#1203758>
* <http://en.wikipedia.org/wiki/Event-driven_programming>
* <http://jibbering.com/faq/faq_notes/misc.html#mtSetTI>