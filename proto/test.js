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
        Test.TestRoot + "/user.js",
        Test.TestRoot + "/crm.js",
        Test.TestRoot + "/crm_vip_levels.js",
        Test.TestRoot + "/crm_member_daily.js",
        Test.TestRoot + "/mcm.js",
        Test.TestRoot + "/saas/saas_categories.js",
        Test.TestRoot + "/saas/saas_departments.js",
        Test.TestRoot + "/saas/saas_goods.js",
        Test.TestRoot + "/shop.members.js",
        Test.TestRoot + "/shop.table.js",
        Test.TestRoot + "/shop.saas.js",
        Test.TestRoot + "/shop.js",




        Test.TestRoot + "/saas/channel.js",
        Test.TestRoot + "/saas/saas_departmenttype.js",
        Test.TestRoot + "/saas/subject.js",
        Test.TestRoot + "/saas/subjectTree.js",
        Test.TestRoot + "/saas/remarks.js",
        Test.TestRoot + "/saas/saas_printtype.js",

        Test.TestRoot + "/weixin/accounts.js"







	];

	Test.readyToTest = function (pageFn) {
		IX.Net.loadJsFiles(TestFiles, pageFn);
	};
})();