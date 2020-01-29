let express = require( 'express' );
let bodyParser = require( 'body-parser' );
let mongoose = require( 'mongoose' );
let jsonParser = bodyParser.json();
let uuid = require('uuid');

let { DATABASE_URL, PORT } = require( './config' );
let {BookmarkController} = require('./model');


let app = express();

let server;

/* Tu código va aquí */

app.get('/api/bookmarks', jsonParser, (req, res) => {
	return res.status(200).send();
})

app.put('/api/bookmarks/:id', jsonParser, (req, res) => {
	if(!req.body.id) {
		return res.status(406).send('No se proporciono el id en el cuerpo del request');
	}

	if(req.body.id != req.params.id) {
		return res.status(409).send("Los ids no coinciden");
	}

	let {id, titulo, descripcion, url} = req.body;

	if(!titulo && !descripcion && !url) {
		return res.status(406).send('No se proporcionaron campos apra actualizar');
	}

	let newBookmark = {};

	if(titulo) {
		newBookmark.titulo = titulo;
	}

	if(descripcion) {
		newBookmark.descripcion = descripcion;
	}

	if(url) {
		newBookmark.url = url;
	}

	BookmarkController.update(id, newBookmark)
		.then(nb => {
			return res.status(200).json(nb);
		})
		.catch(error => {
			console.log(error);
			return res.status(500).send('DB error');
		})
})

function runServer( port, databaseUrl ){
	return new Promise( (resolve, reject ) => {
		mongoose.connect( databaseUrl, response => {
			if ( response ){
				return reject( response );
			}
			else{
				server = app.listen(port, () => {
					console.log( "App is running on port " + port );
					resolve();
				})
				.on( 'error', err => {
					mongoose.disconnect();
					return reject(err);
				})
			}
		});
	});
}

function closeServer(){
	return mongoose.disconnect()
		.then( () => {
			return new Promise( (resolve, reject) => {
				console.log( 'Closing the server' );
				server.close( err => {
					if ( err ){
						return reject( err );
					}
					else{
						resolve();
					}
				});
			});
		});
}
runServer( PORT, DATABASE_URL );

module.exports = { 
    app, 
    runServer, 
    closeServer 
}