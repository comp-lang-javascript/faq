10.3 - How do I find the size of the window/browser canvas area? 
================================================================

While it is often asked about window size, what is more relevant is 
the "canvas area" of the browser. 

Where supported in NN: (>NN4.0)

    var winWidth = window.innerWidth; 
    var winHeight = window.innerHeight; 

Where supported in IE: (>IE4.0)

    var winWidth = document.body.clientWidth; 
    var winHeight = document.body.clientHeight; 

Where supported in modern browsers:

    var winWidth = document.documentElement.clientWidth; 
    var winHeight = document.documentElement.clientHeight; 

Where supported in DOM compliant browsers:

    var winWidth, winHeight, d=document; 
    if (typeof window.innerWidth!='undefined') { 
      winWidth = window.innerWidth; 
      winHeight = window.innerHeight; 
    } else { 
      if (d.documentElement && 
        typeof d.documentElement.clientWidth!='undefined' && 
        d.documentElement.clientWidth!==0) { 
          winWidth = d.documentElement.clientWidth; 
          winHeight = d.documentElement.clientHeight; 
      } else { 
        if (d.body && typeof d.body.clientWidth!='undefined') {
          winWidth = d.body.clientWidth; 
          winHeight = d.body.clientHeight; 
        } 
      } 
    }
     
Note: The dimensions can not be determined accurately until after the 
document has finished loading.

----

* <http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/clientWidth.asp>
* <http://docs.sun.com/source/816-6408-10/window.htm#1202446>
* <http://msdn.microsoft.com/workshop/author/om/measuring.asp>
