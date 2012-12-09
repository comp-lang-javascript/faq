10.4 - How do I check to see if a child window is open, before opening another?
===============================================================================

    var myWin;
    function openWin(aURL) {
      if (!myWin || myWin.closed ) {
        myWin = window.open(aURL,'myWin');
      } else {
        myWin.location.href = aURL;
        myWin.focus();
      }
    }

Popup windows cause usability problems and are generally best avoided.

----

* <https://developer.mozilla.org/en/DOM:window.open>
* <http://msdn.microsoft.com/en-us/library/ms533574%28VS.85%29.aspx>
* <http://docs.sun.com/source/816-6408-10/window.htm#1201877>
* <http://www.useit.com/alertbox/990530.html>
