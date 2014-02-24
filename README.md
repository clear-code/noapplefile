This add-on prevents mails which Thunderbird sent from being rejected by specific mail servers such as Microsoft Exchange Server 2007.

## Detailed information

The cause of this problem is described as follows.

 * Some mail clients in Mac OS may attach both the actual file (data fork, e.g., application/pdf) and the meta data of the file (resource fork: application/applefile) in file attaching process for a file.
 * Exchange Server 2007 rejects a mail if the mail contains an attached file whose MIME Type is application/applefile.
 * If an attached file with the MIME Type unknown to Thunderbird is opened, Thunderbird records the relationship of the extension and the MIME Type of the file. Then if a file with the recorded extension is attached, Thunderbird uses the recorded MIME Type in priority to the MIME Type provided by OS.

As a result, Thunderbird may use the false MIME Type (application/applefile) instead of the actual MIME Type (application/pdf) in a mail, making the mail to be rejected by a recipient who uses Exchange Server.

A widely known workaround for the problem is that remove mimeTypes.rdf in a profile folder of Thunderbird. This workaround resets the recorded MIME types and make Thunderbird use the MIME Type provided by OS.

However, if you receive a mail with an attached file whose MIME Type is "application/applefile", Thunderbird records the false MIME Type into the mimeTypes.rdf and the problem recurs.

## Add-on details

This add-on ("No application/applefile") checks for the content of mimeTypes.rdf at start-up. If mimeTypes.rdf contains a problematic MIME Type "application/applefile", the add-on remove the MIME Type.

In addition, if the MIME Type of an attached mail is "application/applefile", the add-on guesses the correct MIME Type of the file from the extension of the file name, and make Thunderbird use the guessed MIME Type.

By doing so, this add-on prevents the problem.
