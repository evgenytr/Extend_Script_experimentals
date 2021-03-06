function svgOptimizer(f){
	var re = [
		/^<\?xml.+?>\s*/, /<!--.+-->\s*/, /version="1\.1"\s*/,
		/id=".+"\s*/, /style=".+?"\s*/, /xml:space=".+?"\s*/,
		/xmlns:xlink.+xlink"\s*/, /x=".+?px"\s*/, /y=".+?px"\s*/,
		/width=".*?px"\s*/, /height=".*?px"\s*/, /<style.+>\s*/, /<\/style>\s*/];
	var re1 = /\.(.+?)\{(fill):(#[0-9A-Fa-f]{6});\}/g;
	var sty = [];
	if (f.open("r")){
		var svgStr = f.read();
		for (var i=0;i<re.length;i++) svgStr = svgStr.replace(re[i], "");
		sty = svgStr.match (re1);
		for (i=0;i<sty.length;i++){
			sty[i].match(re1);
			svgStr = svgStr.replace('class="'+RegExp.$1+'"', RegExp.$2+'="'+RegExp.$3+'"');
			}
		for (i=0;i<sty.length;i++) svgStr = svgStr.replace(re1, "");
		svgStr =svgStr.replace(/[\n\t]+/g, "");
		f.close();
		//$.writeln(svgStr);
		f.open("w");
		f.write(svgStr);
		f.close();
		}
	}



var svgfile = File.openDialog("Select SVG File...");

svgOptimizer(svgfile);
