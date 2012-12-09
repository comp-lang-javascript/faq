10.11 - How do I prompt a "Save As" dialog for an accepted mime type?
=====================================================================

It is not possible with client-side javascript.

Some browsers accept the Content-Disposition header, but this
must be added by the server. Taking the form:-
`Content-Disposition: attachment; filename=filename.ext`

----

* <http://classicasp.aspfaq.com/general/how-do-i-prompt-a-save-as-dialog-for-an-accepted-mime-type.html>
* <http://support.microsoft.com/kb/q260519/>
