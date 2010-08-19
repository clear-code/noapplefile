var topDir = baseURL+'../../';

var NoApplefile;
var rdf;

function setUp()
{
	NoApplefile = utils.import(topDir+'content/noapplefile/noapplefile.js', {}).NoApplefile;

	delete NoApplefile.namespace;
	NoApplefile.namespace = { window : {} };
	utils.include(topDir+'content/noapplefile/lib/db.js', NoApplefile.namespace);
	utils.include(topDir+'content/noapplefile/lib/overrideHandler.js', NoApplefile.namespace);
	utils.include(topDir+'content/noapplefile/lib/prefs.js', NoApplefile.namespace);

	utils.loadPrefs(topDir+'defaults/preferences/noapplefile.js');

	rdf = utils.makeTempFile(topDir+'tests/fixtures/mimeTypes.hasApplefile.rdf');
	NoApplefile.namespace.getDS(rdf);
}


function test_deleteBlockedTypes()
{
	assert.equals(1, NoApplefile.deleteBlockedTypes());
	var contents = utils.readFrom(rdf);
	assert.equals(-1, contents.indexOf('application/applefile'), contents);
}

test_mapContentType.parameters = {
	mappedPDF : {
		type     : 'application/applefile',
		filename : 'file.pdf',
		expected : 'application/pdf'
	},
	notMappedPDF : {
		type     : 'application/pdf',
		filename : 'file.pdf',
		expected : 'application/pdf'
	},
};
function test_mapContentType(aParameter)
{
	assert.equals(
		aParameter.expected,
		NoApplefile.mapContentType(aParameter.type, aParameter.filename)
	);
}


