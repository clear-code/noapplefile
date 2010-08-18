var gDS = null;
function getDS()
{
	const mimeTypes = 'UMimTyp';
	var fileLocator = Components.classes['@mozilla.org/file/directory_service;1'].getService();
	if (fileLocator)
		fileLocator = fileLocator.QueryInterface(Components.interfaces.nsIProperties);
	var file = fileLocator.get(mimeTypes, Components.interfaces.nsIFile);
	var ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
	var fileHandler = ioService.getProtocolHandler('file').QueryInterface(Components.interfaces.nsIFileProtocolHandler);
	gDS = gRDF.GetDataSource(fileHandler.getURLSpecFromFile(file));
}
