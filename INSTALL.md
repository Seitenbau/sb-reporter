# Systemanforderungen

* Node.JS ^8.2.1
* npm ^5.4.1
* yarn ^1.3.2
* MongoDB-server (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/) 

# Herunterladen

Herunterladen über `git clone :repo...`

# Konfiguration

* Übergreifend:
  * ports und urls in `./config.js` anpassen

* Third-Api-Service
  * Bekannte APIS in `./Third-Api-Service/config.js` registrieren
  * Optional: Transformer in `./Third-Api-Service/transformers/` anlegen und Programmieren

* Generator-Service:
  * HTML-Template- und gleichnamiges CSS-file  `./Generator-Service/templates/` legen  
    __Note__: Das html- und das CSS-file müssen zwingend den gleichen Namen tragen.  

# Installation
Folgende befehle in angegeben Ordnern Ausführen.
1. `./`: `npm install`
2. `./Third-Api-Service`: `npm install`
3. `./Generator-Service`: `npm install`
4. `./Berichtsgenerator-Server`: `npm install`
5. `./Berichtsgenerator-Client`: `yarn install`
5. `./Berichtsgenerator-Client`: `yarn build`
6. `./`: `npm start`
