10.13 - How do I POST a form to a new window?
=============================================

Use the target attribute on the form, opening a window with
that name and your feature string in the onsubmit handler of the
FORM.

    <form action="" 
          method="post"
          target="wndname" 
          onsubmit="window.open('',this.target);return true;"
    >

----

* <http://www.htmlhelp.com/reference/html40/forms/form.html>