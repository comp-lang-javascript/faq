10.7 - Why do I get permission denied when accessing a frame/window?
====================================================================

In the normal browser security model, a script may only access the
properties of documents served from the same domain or IP address,
protocol, and port.

Any attempt to access a property in such cases will result in a 
"Permission Denied" error. Signed scripts or trusted ActiveX objects can
overcome this in limited situations.

----

* <http://msdn.microsoft.com/en-us/library/ms533028%28VS.85%29.aspx>
* <https://developer.mozilla.org/En/Same_origin_policy_for_JavaScript>