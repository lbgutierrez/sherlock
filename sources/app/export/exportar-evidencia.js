const {dialog} = require('electron').remote;
const renderer = require('../renderer.js');
const config = require('electron-json-config')
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const fs = require('fs');
const fse = require('fs-extra')

function init() {
    document.querySelector('#btn_exp_requerimiento').addEventListener('click', selectFolderReq )
    document.querySelector('#btn_exp_aceptar').addEventListener('click', getScreenshots)
}

function selectFolderReq() {
	var defPath= config.get('pathEvid');
	dialog.showOpenDialog({
		title:"Selecciona una carpeta",
		properties: ["openDirectory"],
		defaultPath: defPath
	}, (folderPaths) => {
		if ( folderPaths === undefined ) {
			return '';
		} else {
			document.querySelector('#txt_exp_requerimiento').value = folderPaths
		}
	});
}

function getScreenshots() {

    const inteFolder = document.querySelector('#txt_exp_requerimiento').value + '/Screenshots/I';
    const unitFolder = document.querySelector('#txt_exp_requerimiento').value + '/Screenshots/U';
    
    console.log( inteFolder );
   
    let eviData = new Object();
    eviData.consultor = ( config.get('dpName') ) ? config.get('dpName') : '';
    if ( fs.existsSync( inteFolder ) ) {
        console.log('CantFiles: ' + renderer.countFiles( inteFolder ) );
        eviData.integ = readfiles( inteFolder );

    } else {
        console.log( 'No se encontraron evidencias de integración');
    }
    if ( fs.existsSync( unitFolder ) ) {
        console.log('CantFiles: ' + renderer.countFiles( inteFolder ) );
        eviData.unit = readfiles( unitFolder );
    } else {
        console.log( 'No se encontraron evidencias unitarias');
    }

    console.log( eviData );
    exportarDocumento( eviData );

}

var evidences = new Array();
var evidence = null;
var images = null;
function readfiles( path ) {
    let files = fs.readdirSync( path );
    
    for ( let file of files ) {
        let pathAux = path + '/' + file;
        let parentFolder = path.substring(path.lastIndexOf("/")+1, path.legth);
        let stat = fs.lstatSync( pathAux )

        if ( stat.isDirectory() ) {
            evidence = new Object();
            evidence.name = file;
            evidence.title = '';
            evidence.images = [];

            evidences.push( evidence );
            readfiles( pathAux );
        } else {
            let found = false
            for(var i = 0; i < evidences.length; i++) {
                if (evidences[i].name == parentFolder) {
                    found = true;
                    evidence = evidences[i]
                    images = evidences[i].images
                    break;
                }
            }
                            
            if (file != 'EVData.json') {
                if ( found ) {
                    var image = new Object();
                    image.title = getTitle( file );
                    image.path = pathAux
                    
                    images.push( image );
                } else {
                    console.log( "Archivo ignorado" )
                }
            } else {
                let rawdata = fs.readFileSync( pathAux );
                let evData = JSON.parse(rawdata);
                console.log(evidence)
                evidence.title = evData.testName;
            }

        }

    }

    evidence = new Object();
    evidence.evidences = evidences;

    return evidence;
}

function getTitle( name ) {
    return name.substring( name.indexOf(" - ")+3, name.length-4 );
}

function exportarDocumento( data ) {
    var ImageModule = require('open-docxtemplater-image-module');
 
    var path = require('path');

    //Load the docx file as a binary
    var content = fs
        .readFileSync(path.resolve(__dirname, './Template-default.docx'), 'binary');

    //Below the options that will be passed to ImageModule instance
    var opts = {}
    opts.centered = false; //Set to true to always center images
    opts.fileType = "docx"; //Or pptx
    
    //Pass your image loader
    opts.getImage = function(tagValue, tagName) {
        //tagValue is 'examples/image.png'
        //tagName is 'image'
        return fs.readFileSync(tagValue);
    }
    
    //Pass the function that return image size
    opts.getSize = function(img, tagValue, tagName) {
        //img is the image returned by opts.getImage()
        //tagValue is 'examples/image.png'
        //tagName is 'image'
        //tip: you can use node module 'image-size' here
        return [600, 370];
    }
    
    var imageModule = new ImageModule(opts);
    
    console.log(JSON.stringify( data ));

    var zip = new JSZip(content);
    var doc = new Docxtemplater()
        .attachModule(imageModule)
        .loadZip(zip)
        .setData(data)
        .render();
    
    var buffer = doc
            .getZip()
            .generate({type:"nodebuffer"});
    
    let outPath = document.querySelector('#txt_exp_requerimiento').value + '\\Documentation';
    if ( !fse.pathExistsSync( outPath ) ) {
        console.log('No existe Path Out!')
        fse.ensureDirSync( outPath );
    }
    let version = parseInt(renderer.countFiles( outPath )) + 1;
    console.log('version: ' + parseInt( renderer.countFiles( outPath ) ));
    let file = 'Evidencia_v' + version + '.docx';

    fs.writeFileSync(path.resolve(__dirname, outPath + '\\' + file ), buffer);
}

init();