const config = require('electron-json-config')
const renderer = require('../renderer.js')
const keycode = require('keycode');
const fse = require('fs-extra')

function init() {

	document.querySelector('#txt_numero').addEventListener('change', changeEvidencia, false);

	if ( config.get('pathTemp') !== null || config.get('pathTemp') !== ''
				&&  config.get('pathEvid') !== null || config.get('pathEvid') ) {

		var req = ( config.get('evidId') != undefined ) ? config.get('evidId') : ''
		var num = ( config.get('evidNum') != undefined ) ? config.get('evidNum') : '1'
		var test = ( config.get('evidTest') != undefined ) ? config.get('evidTest') : ''
		var type =( config.get('evidType') != undefined ) ? config.get('evidType') : 'U';

		if ( type == 'U' ) {
			document.querySelector('input[name="rdo_test_type"][value="U"]').checked = true;
		} else {
			document.querySelector('input[name="rdo_test_type"][value="I"]').checked = true;
		}		
		document.querySelector('#txt_requerimiento').value = req
		document.querySelector('#txt_numero').value = num
		document.querySelector('#txt_prueba').value = test
		document.querySelector('#txt_descripcion').value = ''
		document.querySelector('#btn_te_aceptar').addEventListener('click', aceptarEvidencia)
		document.querySelector('#btn_te_cancelar').addEventListener('click', cancelarEvidencia)
		document.querySelector('#btn_te_resetTest').addEventListener('click', reestablecerPruebas)
		document.querySelector('#img_tmp').src = 'file://' + config.get('pathTemp') + "/tmp-screenshot.png"
		
		renderer.setFoco( renderer.TOMAR_EVIDENCIA )

	} else {

		renderer.selectMenu( renderer.CONFIGURAR )

	}
}

function aceptarEvidencia() {

	var evidType = document.querySelector('input[name="rdo_test_type"]:checked').value;
	var evidId = document.querySelector('#txt_requerimiento').value;
	var evidNum = document.querySelector('#txt_numero').value;
	var evidTest = document.querySelector('#txt_prueba').value;
	var evidDes = document.querySelector('#txt_descripcion').value;

	if ( evidType != null && evidType != ''	&& evidId != null && evidId != ''
			&& evidNum != null && evidNum != '' && evidDes != null && evidDes != ''
			&& evidTest != null && evidTest != '' ) {

		evidDes = renderer.capitalizeFirstLetter( evidDes );
		evidTest = renderer.capitalizeFirstLetter( evidTest );
		config.set('evidId', evidId);
		config.set('evidNum', evidNum);
		config.set('evidType', evidType);
		config.set('evidTest', evidTest);
		
		var pathEvid = config.get('pathEvid');
		var pathReq = pathEvid + '\\' + evidId 

		if ( !fse.pathExistsSync( pathReq ) ) {

			let unitPathReq = pathReq + '\\' + 'Screenshots\\U';
			let integratePathReq = pathReq + '\\' + 'Screenshots\\I'
		
			fse.ensureDirSync( unitPathReq );
			fse.ensureDirSync( integratePathReq );

		}

		let destpathAux = pathReq + '\\Screenshots\\' + evidType + '\\' + getNameEvidence( evidNum );
		
		if ( !fse.pathExistsSync( destpathAux ) ) {
			fse.ensureDirSync( destpathAux );
		}

		let files = fse.readdirSync( destpathAux );
		console.log('files: ' + files)
		
		let countFiles = 0;
		for ( var i=0; i < files.length; i++) {
			if( renderer.getExtension( files[i] ) == 'png') {
				countFiles++;
			}
		}

		let fileNumAux = '000';
		fileNumAux = fileNumAux + (countFiles+1);
		fileNumAux = fileNumAux.substring(fileNumAux.length-3, fileNumAux.length);
		
		var srcpath = config.get('pathTemp') + '\\tmp-screenshot.png';
		var dstpath	= destpathAux + '\\' + fileNumAux + ' - ' + evidDes +'.png';
	
		fse.move(srcpath, dstpath)
			.then(() => {
				console.log('success!')
				document.querySelector('#txt_descripcion').value = '';
				
				let eviObj = new Object();
				eviObj.id = evidId
				eviObj.type = evidType;
				eviObj.num = evidNum;
				eviObj.testName = evidTest;
				console.log(eviObj);
				let data = JSON.stringify( eviObj ); 
				fse.writeFileSync( destpathAux + '\\EVData.json', data );

				renderer.clsmin();
			})
			.catch(err => {
				console.error(err)
		});

	} else {

		renderer.setFoco( renderer.TOMAR_EVIDENCIA )

	}

}

function cancelarEvidencia() {

	renderer.clsmin();

}

function reestablecerPruebas() {
	var evidType = document.querySelector('input[name="rdo_test_type"]:checked').value;
	var evidId = document.querySelector('#txt_requerimiento').value;
	var evidNum = document.querySelector('#txt_numero').value;

	var pathReq = config.get('pathEvid') + '\\' + evidId + '\\Screenshots\\' + evidType + '\\' + getNameEvidence( evidNum )

	if ( fse.pathExistsSync( pathReq ) ) {
		let files = fse.readdirSync( pathReq );
		for ( let file of files ) {
			if ( renderer.getExtension( file ).toUpperCase() == 'PNG' ) {
				fse.remove( pathReq + '\\' + file, err => {
					if (err) return console.error(err)
					console.log('success!')
				})
			}
		}
	}
}

function getNameEvidence( evidNum ) {
	let evidNumAux = '000' + evidNum;
	evidNumAux = evidNumAux.substring(evidNumAux.length-3, evidNumAux.length);
	return 'EV_' + evidNumAux;
}

function changeEvidencia() {
	let pathEvid = config.get('pathEvid');
	let evidType = config.get('evidType');
	let evidId = document.querySelector('#txt_requerimiento').value;
	let evidNum = document.querySelector('#txt_numero').value;

	let evDataPath = pathEvid + '\\' + evidId + '\\Screenshots\\' + evidType + '\\' + getNameEvidence(evidNum) + '\\EVData.json' ;

	if ( fse.existsSync( evDataPath ) ) {
		let rawdata = fse.readFileSync( evDataPath );  
		if ( rawdata.length > 0 ) {
			let evData = JSON.parse(rawdata);  
			document.querySelector('#txt_prueba').value = evData.testName;
		} else {
			console.log('archivo vacio');
			document.querySelector('#txt_prueba').value = '';
		}		
	} else {
		document.querySelector('#txt_prueba').value = '';
	}

}

document.addEventListener( 'keydown', function(e) {

	if ( keycode.isEventKey(e, 'enter') ) {
		aceptarEvidencia();
	} else if ( keycode.isEventKey(e, 'esc') ) {
		renderer.clsmin();
	} /*else if ( keycode.isEventKey(e, '+') ) {
		console.log('+');
	}*/
	
});


init()