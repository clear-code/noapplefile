function unifyMIMETypes()
{
	const Cc = Components.classes;
	const Ci = Components.interfaces;

	var loader = Cc['@mozilla.org/moz/jssubscript-loader;1'].getService(Ci.mozIJSSubScriptLoader);
	var ns = { window : {} };
	loader.loadSubScript('chrome://noapplefile/content/lib/db.js', ns);
	loader.loadSubScript('chrome://noapplefile/content/lib/overrideHandler.js', ns);
	loader.loadSubScript('chrome://noapplefile/content/lib/prefs.js', ns);

	var prefs = ns.window['piro.sakura.ne.jp'].prefs;
	ns.getDS();

	var count = 0;
	prefs.getChildren('extensions.noapplefile@clear-code.com.typesToUnify.')
		.forEach(function(aType) {
			var fromType = aType.split('.').pop();
			if (!ns.mimeHandlerExists(fromEntry.mimeType))
				return;

			count++;
			var toType = prefs.getPref(aType);
			var toEntry = new ns.HandlerOverride(ns.MIME_URI(toType));
			var fromEntry = new ns.HandlerOverride(ns.MIME_URI(fromType));

			fromEntry.isEditable = toEntry.isEditable = true;
			fromEntry.mUpdateMode = true;
			toEntry.mUpdateMode = ns.mimeHandlerExists(toEntry.mimeType);

			if (!toEntry.mimeType) { // initialize: inherit properties from the source
				toEntry.mimeType = toType;
				'alwaysAsk,appDisplayName,appPath,handleInternal,descriotion,saveToDisk,useSystemDefault'
					.split(',')
					.forEach(function(aProp) {
						toEntry[aProp] = fromEntry[aProp];
					});
			}

			fromEntry.extensions
				.replace(/^\s+|\s+$/g, '')
				.split(/\s+/)
				.forEach(function(aExtension) {
					fromEntry.removeExtension(aExtension);
					toEntry.addExtension(aExtension);
				});

			fromEntry.buildLinks();
			toEntry.buildLinks();
			ns.removeOverride(fromEntry.mimeType);
		});

	if (count) {
		var remoteDS = ns.gDS.QueryInterface(Ci.nsIRDFRemoteDataSource);
		if (remoteDS)
			remoteDS.Flush();
	}
}
