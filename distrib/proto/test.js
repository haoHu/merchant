(function () {
	IX.ns("Test");

	Test.SrcRoot = "../";
	Test.ImageRoot = "../img";
	Test.SiteUrl = "./";
	Test.TestRoot = "../../test/data";

	var TestFiles = [
		Test.TestRoot + "/app.js",
		Test.TestRoot + "/query.js"
	];

	Test.readyToTest = function (pageFn) {
		IX.Net.loadJsFiles(TestFiles, pageFn);
	};
})();