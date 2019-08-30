const remote = require('electron').remote;
const config = require('electron-json-config')
const fs = require('fs');

var context = { TOMAR_EVIDENCIA: 'tomarEvidencia',
				EXPORTAR: 'exportar',
				CONFIGURAR: 'configurar',
				menuSelected:'ejem',
				setMenu: function( opt ) {
					menu( opt );
				},
				setFoco: function( opt ) {
					setFocos(opt);
				},
				countFiles: function( path ) {
					return countFile( path );
				},
				clsmin: function() {
					if ( config.get('clsMin') ) {
						windowClose();
					} else {
						windowMinimize();
					}
				},
				capitalizeFirstLetter: function( value ) {
					return capitalizeFirstLetter( value );
				},
				capitalizeSentence: function( sentence ) {
					return capitalizeSentence( sentence );
				},
				getExtension: function( filename ) {
					return getExtension( filename );
				}
			}

function init() {
	document.querySelector('#menuTomarEvidencia').addEventListener('click', function(){ menu( context.TOMAR_EVIDENCIA ) })
	document.querySelector('#menuExportar').addEventListener('click', function(){ menu( context.EXPORTAR ) })
	document.querySelector('#menuConfigurar').addEventListener('click', function(){ menu( context.CONFIGURAR ) })
	menu( context.TOMAR_EVIDENCIA )
}

function menu(opt) {

	if( opt === context.TOMAR_EVIDENCIA ) {
		
		context.menuSelected = context.TOMAR_EVIDENCIA
		var txt_numero = document.querySelector('#txt_numero')
		if( txt_numero.value == null || txt_numero.value == '' ) {
			txt_numero.value = '1'
		}
		document.querySelector('#tomarEvidencia').style.display='block'
		document.querySelector('#exportar').style.display='none'
		document.querySelector('#configurar').style.display='none'
	
	} else if ( opt === context.EXPORTAR ) {

		context.menuSelected = context.EXPORTAR
		document.querySelector('#tomarEvidencia').style.display='none'
		document.querySelector('#exportar').style.display='block'
		document.querySelector('#configurar').style.display='none'

	} else if ( opt === context.CONFIGURAR ) {
		
		context.menuSelected = context.CONFIGURAR
		document.querySelector('#tomarEvidencia').style.display='none'
		document.querySelector('#exportar').style.display='none'
		document.querySelector('#configurar').style.display='block'
		
	}
	
	setFocos( opt )
	
}

function setFocos( opt ) {

	if( opt === context.TOMAR_EVIDENCIA ) {

		var req = document.querySelector('#txt_requerimiento')
		var num = document.querySelector('#txt_numero')
		var tst = document.querySelector('#txt_prueba')
		var des = document.querySelector('#txt_descripcion')
		if ( req != null && req.value == '' ) {
			req.focus()
		} else if( num != null && num.value == '' ) {
			num.focus()
		} else if ( tst != null && tst.value == '' ) {
			tst.focus()
		} else if ( des != null && des.value == '' ) {
			des.focus()
		}
		
	}
	
}

function windowMinimize(){
	var window = remote.getCurrentWindow();
	window.minimize();  
}

function windowClose(){
	var window = remote.getCurrentWindow();
	window.close();  
}

function capitalizeFirstLetter( string ) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeSentence( sentence ){
	sentence = sentence.toLowerCase();
    return sentence.replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1){
       return $1.toUpperCase(); 
    });
}

function countFile( path ) {
    let count=0;
	let files = fs.readdirSync( path );
    for( var i=0; i < files.length; i++ ) {
        var pathAux = path + '/' + files[i];
        var stat = fs.lstatSync( pathAux )
        if ( stat.isDirectory() ) {
            count += countFile( pathAux ) 
        }  
        count++;
	}
    return count;
}

function getExtension( filename ) {
	return filename.split('.').pop();
}

init()
module.exports = context



