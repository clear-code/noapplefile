var NoApplefile = {
	get namespace()
	{
		delete this.namespace;

		var ns = { window : {} };
		this.loader.loadSubScript('chrome://noapplefile/content/lib/db.js', ns);
		this.loader.loadSubScript('chrome://noapplefile/content/lib/overrideHandler.js', ns);
		this.loader.loadSubScript('chrome://noapplefile/content/lib/prefs.js', ns);
		ns.getDS();

		return this.namespace = ns;
	},
	get loader()
	{
		delete this.loader;
		return this.loader = Components.classes['@mozilla.org/moz/jssubscript-loader;1']
								.getService(Components.interfaces.mozIJSSubScriptLoader);
	},
	get prefs()
	{
		delete this.prefs;
		return this.prefs = this.namespace.window['piro.sakura.ne.jp'].prefs;
	},
	get blockedTypes()
	{
		delete this.blockedTypes;
		return this.blockedTypes = this.prefs.getPref('extensions.noapplefile@clear-code.com.blockedTypes')
										.split(/[,\s]+/);
	},

	isDSLoaded : function()
	{
		var ns = this.namespace;
		var container = ns.gRDF.GetResource('urn:mimetypes');
		var mimeTypes = ns.gRDF.GetResource(ns.NC_RDF('MIME-types'));
		var root = ns.gRDF.GetResource('urn:mimetypes:root');
		return ns.gDS.HasAssertion(container, mimeTypes, root, true);
	},

	init : function()
	{
		this.overrideFunctions();
		this.deleteBlockedTypesWithDelay();
	},

	deleteBlockedTypesWithDelay : function()
	{
		// do operations with a delay, because the datasource is not loaded yet
		// on the startup time on Thunderbird 2.
		var count = 0;
		var timer = window.setInterval(function(aSelf) {
			if (!aSelf.isDSLoaded() && count++ < 200)
				return;
			window.clearInterval(timer);
			aSelf.deleteBlockedTypes();
		}, 100, this);
	},

	deleteBlockedTypes : function()
	{
		var ns = this.namespace;
		var count = 0;
		this.blockedTypes.forEach(function(aType) {
				if (!ns.mimeHandlerExists(aType))
					return;
				ns.removeOverride(aType);
				count++;
			}, this);

		if (count) {
			var remoteDS = ns.gDS.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
			if (remoteDS)
				remoteDS.Flush();
		}

		return count;
	},

	mapContentType : function(aType, aFileName)
	{
		return this.blockedTypes.indexOf(aType) > -1 ?
				(aFileName.match(/\.([^\.]+)/) ?
					(
						this.prefs.getPref('extensions.noapplefile@clear-code.com.types.'+RegExp.$1) ||
						'application/x-'+RegExp.$1
					) :
					this.prefs.getPref('extensions.noapplefile@clear-code.com.defaultType')
				) :
				aType ;
	},

	overrideFunctions : function()
	{
		if ('createNewAttachmentInfo' in window) {
			eval('window.createNewAttachmentInfo = '+
				window.createNewAttachmentInfo.toSource()
				.replace(
					/this.contentType = contentType/,
					'this.contentType = NoApplefile.mapContentType(contentType, displayName) || contentType'
				)
			);
		}
	},

	handleEvent : function(aEvent)
	{
		switch (aEvent.type)
		{
			case 'load':
				window.removeEventListener('load', this, false);
				this.init();
				return;
		}
	}
};

