(function () {
	IX.ns("Test");

	Test.SrcRoot = "../src";
	Test.ImageRoot = "../src/img";
	Test.SiteUrl = "/proto";
	Test.TestRoot = "../test/data";

	var TestFiles = [
		Test.TestRoot + "/app.js",
		Test.TestRoot + "/query.js",
		Test.TestRoot + "/account.js",
		Test.TestRoot + "/order.js",
        Test.TestRoot + "/foods.js",
        Test.TestRoot + "/user.js"
	];

	Test.readyToTest = function (pageFn) {
		IX.Net.loadJsFiles(TestFiles, pageFn);
	};
})();