#targetengine session

var idleTask = app.idleTasks.add({name:'mergeCells', sleep:200})
					.addEventListener(IdleEvent.ON_IDLE, mergeCells);

function mergeCells(){
	app.idleTasks.itemByName("mergeCells").remove();
	var tgt = app.selection;
	if (tgt.length==0) {
		idleTask = app.idleTasks.add({name:'mergeCells', sleep:200})
			.addEventListener(IdleEvent.ON_IDLE, mergeCells);
		return;
		}
	if (tgt[0].reflect.name=="Cell"&&tgt[0].cells.length>1) {
		while (app.selection[0].cells.length>1)
			app.selection[0].cells[0].merge(app.selection[0].cells[1]);
		}
	idleTask = app.idleTasks.add({name:'mergeCells', sleep:200})
				.addEventListener(IdleEvent.ON_IDLE, mergeCells);
	}
