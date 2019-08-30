const electron = require('electron')
const {Menu, Tray} = require('electron')
//Module to save configuration
const Config = require('electron-config');
const config = new Config();

//get global variables
const gvar = require('electron-json-config')
//Module  to take a screenshot of desktop
const screenshot = require('screenshot-desktop')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

var path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let urlImage

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 670, height: 570, icon: path.join(__dirname, '/sherlock.ico')})

  //console.log('new instance BrowserWindow ... OK')
  
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
  //console.log('openDevTools ... OK')
  
  if(gvar.get('clsMin')) {
	  mainWindow.on('minimize', function(event){
		//app.quit()
		event.preventDefault();
		mainWindow.hide()
	  })
  }
  //console.log('minimize event ... OK' )

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow)
let tray = null
app.on('ready', () => {
  tray = new Tray('./sherlock.ico');
  const contextMenu = Menu.buildFromTemplate([
   // {label: 'Item1', type: 'radio'},
   // {label: 'Item2', type: 'radio'},
   // {label: 'Item3', type: 'radio', checked: true},
	{label: 'Abrir', click: ()=> {
		openWindow();
	}},
    {label: 'Salir', click: ()=> {
		//mainWindow.destroy();
        app.quit();
	}}
  ]);
  tray.setToolTip('Doble clic para tomar un pantallazo.');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
	  //console.log('tray.double-click');
	  //Este if evita que se duplique la ventana
	  
	  //if (mainWindow === null || mainWindow === undefined) {
		openWindow();
	  //} else {
	//	  mainWindow.show()
	  //}
		  
	});
  //createWindow();
})

// Quit when all windows are closed.
app.on('window-all-closed', function (event) {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    //app.quit()
	event.preventDefault();
	app.close
	
  }
})



app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    openWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function openWindow() {
	var filename = gvar.get('pathTemp') + '/tmp-screenshot.png'
	if ( gvar.get('pathTemp') == undefined ) {
		var filename = 'C:/temp/tmp-screenshot.png'
	}
	
	screenshot({ filename: filename }).then( ( imgPath ) => {
		console.log('img temp: ' + imgPath);
		urlImage = imgPath
		if ( imgPath !== '') {
			if ( mainWindow == null ) {
				console.log('create windows')
				createWindow();
			} else {
				console.log('reload windows')
				mainWindow.reload()
				setTimeout(()=>{
					mainWindow.show()
				}, 500);
			}
		} else {
			console.log("Screenshot failed");
		}
	}).catch( ( e ) => {
		console.log('Error: ', e)
	});
	
}