const {dialog} = require('electron').remote;
const config = require('electron-json-config')
const renderer = require('../renderer.js')

function init() {
	console.log('init configurar')
	document.querySelector('#txt_path_evidencia').value = (config.get('pathEvid')) ? config.get('pathEvid') : '';
	document.querySelector('#txt_path_temporal').value = (config.get('pathTemp')) ? config.get('pathTemp') : '';
	document.querySelector('#txt_dp_name').value = (config.get('dpName')) ? config.get('dpName') : '';
	document.querySelector('#chk_cls_min').checked = (config.get('clsMin')) ? config.get('clsMin') : '';
	document.querySelector('#btn_cf_guardar').addEventListener('click', guardarConfiguracion)
	document.querySelector('#btn_cf_restablecer').addEventListener('click', restablecerConfiguracion)
	document.querySelector('#btn_evd_examinar').addEventListener('click', selectFolderEvid )
	document.querySelector('#btn_tmp_examinar').addEventListener('click', selectFolderTemp )
}

function guardarConfiguracion() {
	let dpName = document.querySelector('#txt_dp_name').value
	var pathEvid = document.querySelector('#txt_path_evidencia').value
	var pathTemp = document.querySelector('#txt_path_temporal').value
	var clsMin = document.querySelector('#chk_cls_min').checked
	console.log('clsMin: ' + clsMin)
	config.set('dpName', renderer.capitalizeSentence(dpName));
	config.set('pathEvid', pathEvid);
	config.set('pathTemp', pathTemp);
	config.set('clsMin', clsMin);
}

function restablecerConfiguracion() {
	document.querySelector('#txt_path_evidencia').value = config.get('pathEvid')
	document.querySelector('#txt_path_temporal').value = config.get('pathTemp')
}

function selectFolderEvid() {
	var defPath = document.querySelector('#txt_path_evidencia').value
	if (defPath == '') {
		defPath = 'C:/'
	}
	dialog.showOpenDialog({
		title:"Selecciona una carpeta",
		properties: ["openDirectory"],
		defaultPath: defPath
	}, (folderPaths) => {
		// folderPaths is an array that contains all the selected paths
		if(folderPaths === undefined){
			//console.log("No destination folder selected");
			return '';
		}else{
			//console.log(folderPaths);
			document.querySelector('#txt_path_evidencia').value = folderPaths
		}
	});
}

function selectFolderTemp() {
	var defPath = document.querySelector('#txt_path_temporal').value
	if (defPath == '') {
		defPath = 'C:/'
	}
	dialog.showOpenDialog({
		title:"Selecciona una carpeta",
		properties: ["openDirectory"],
		defaultPath: defPath
	}, (folderPaths) => {
		// folderPaths is an array that contains all the selected paths
		if(folderPaths === undefined){
			//console.log("No destination folder selected");
			return '';
		}else{
			//console.log(folderPaths);
			document.querySelector('#txt_path_temporal').value = folderPaths
		}
	});
}

init()
