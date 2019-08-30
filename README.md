<p align="center">
  <img src="https://github.com/lbgutierrez/sherlock/blob/master/sources/assets/icons/sherlock.png?raw=true">
</p>

# Sherlock

Sherlock es una herramienta cuyo objeto principal es acelerar la toma de evidencias durante el ciclo de desarrollo y certificacion del software

# Generacion del ejecutable

Acceder por linea de comando a la ruta donde se encuentran los fuentes del proyecto

$ cd {path-sherlock}/sources

Ejecutar el siguiente comando para crear el ejecutable

$ electron-packager . exe-sherlock --platform=win32 --arch=x64 --electron-version=3.0.11 --icon=../sources/sherlock.ico --overwrite