var rtnCd = String.fromCharCode(13); 
var slct =app.activeDocument.selection[0];
var prLength = slct.paragraphs.length;
var swpChar = [  //replace characters
		{"orgCd":"32","swpCh":"●"},
		{"orgCd":"7","swpCh":"●"},
		{"orgCd":"9","swpCh":"●"},
		{"orgCd":"9742","swpCh":"●"},
		{"orgCd":"65296","swpCh":"0"},
		{"orgCd":"65297","swpCh":"1"},
		{"orgCd":"65298","swpCh":"2"},
		{"orgCd":"65299","swpCh":"3"},
		{"orgCd":"65300","swpCh":"4"},
		{"orgCd":"65301","swpCh":"5"},
		{"orgCd":"65302","swpCh":"6"},
		{"orgCd":"65303","swpCh":"7"},
		{"orgCd":"65304","swpCh":"8"},
		{"orgCd":"65305","swpCh":"9"}];

//select grade
var dlg = app.dialogs.add({name:"ルビグレード", canCancel:true,});
with (dlg){
	with (dialogColumns.add()){
		with (borderPanels.add()){
			var myGrade = realEditboxes.add({editValue:1, minWidth:80});
			}
		}
	}
if (dlg.show()){
	grade = myGrade.editValue;
	dlg.destroy();
	}

for (i=0;i<prLength;i++) {
	var myParagraphs = slct.paragraphs[i];
	var postData = myParagraphs.contents;
	if (postData == rtnCd) {continue}
	swpLen = swpChar.length;
	for (n=0;n<swpLen;n++){
		while (postData.indexOf (String.fromCharCode (swpChar[n].orgCd))>=0) {
			postData = postData.replace (String.fromCharCode (swpChar[n].orgCd), swpChar[n].swpCh);
			}
		}
	poststring = "appid=<Yahoo API APPLICATION ID>" 
					 + "&grade=" + grade + "&sentence=" + postData;
	poststring = encodeURI(poststring);
	var len = poststring.length;
	var cnnct = new Socket;
	if (cnnct.open("jlp.yahooapis.jp:80", "binary")) {
		cnnct.write("GET /FuriganaService/V1/furigana?" + poststring + " HTTP/1.0\n"
						+ "Host: jlp.yahooapis.jp\n"
						+ "User-Agent: Mozilla/5.0 (Windows NT 5.1; ja)\n"
						+ "Connection: close\n\n");
		var rply = cnnct.read(999999);
		cnnct.close();
		} else {
			alert ("could not connect.");
			}
	var getCnt = rply.slice (rply.indexOf("<?xml"));
    //getCnt = getCnt.substr(0, getCnt.length - 5)  //when use 1.1 protocol version, remove "//" to activate this line.
	getCnt = cdconv_8to16(getCnt);
	if (getCnt!="ERROR"){
		stRuby (myParagraphs, getCnt);
		} else {
			alert ("An error has occurred. Skip set ruby, paragraph number=" + (i+1));
			}
	}


function stRuby (myParagraphs, getCnt) {
	var cntr = 0;
	var rbXml = new XML(getCnt);
	var nsURI = rbXml.namespace();
	var nmSpc = new Namespace(nsURI);
	setDefaultXMLNamespace(nmSpc);
	var rbRslt = rbXml.Result.WordList.Word;
	var objLgth = rbRslt.length();
	for (k=0;k<objLgth;k++){
		if (rbRslt[k].children().length() > 3){
			sbLen = rbRslt[k].SubWordList[0].SubWord.length();
			for (j=0;j<sbLen;j++){
				gtString = rbRslt[k].SubWordList[0].SubWord[j].Surface[0].toString();
				gtRuby   = rbRslt[k].SubWordList[0].SubWord[j].Furigana[0].toString();
				if (gtString == gtRuby){
					cntr += gtString.length;
					} else {
						var prChr = myParagraphs.characters.itemByRange (cntr, cntr+gtString.length-1);
						prChr.rubyType = RubyTypes.GROUP_RUBY;
						prChr.rubyString = gtRuby;
						prChr.rubyFlag =true;
						cntr += gtString.length;
						}
				}
			} else if (rbRslt[k].children().length() == 3) {
				gtString = rbRslt[k].Surface[0].toString();
				gtRuby  = rbRslt[k].Furigana[0].toString();
				if (gtString == gtRuby){
					cntr += gtString.length;
					} else {
						var prChr = myParagraphs.characters.itemByRange (cntr, cntr+gtString.length-1);
						prChr.rubyType = RubyTypes.GROUP_RUBY;
						prChr.rubyString = gtRuby;
						prChr.rubyFlag =true;
						cntr += gtString.length;
						}
			} else {
				cntr += rbRslt[k].Surface[0].toString().length;
				}
		}
	}


function cdconv_8to16 (str) {
    var fChr, sChr, tChr;
    var rtStr = "";
    var lgth = str.length;
    var idx = 0;
    while(idx < lgth) {
		fChr = str.charCodeAt(idx++);
		cdHd = fChr >> 4;
		if (cdHd==14){
			sChr = str.charCodeAt(idx++);
			tChr = str.charCodeAt(idx++);
			rtStr += String.fromCharCode(((fChr & 0x0f) << 12)|((sChr & 0x3f) << 6)|(tChr & 0x3f));
			} else if (cdHd==13||cdHd==12){
				sChr = str.charCodeAt(idx++);
				rtStr += String.fromCharCode(((fChr & 0x1f) << 6)|(sChr & 0x3f));
				} else if (cdHd>=0&&cdHd<=8){
					rtStr += str.charAt(idx-1);
					} else {
						return "ERROR";
						}
		}
	return rtStr;
	}
