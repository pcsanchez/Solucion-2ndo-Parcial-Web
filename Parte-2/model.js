let mongoose = require( 'mongoose' );
let uuid = require( 'uuid' );

mongoose.Promise = global.Promise;

/* Tu código va aquí */

let bookmarkCollection = mongoose.Schema({
    id: String,
    titulo: String,
    descripcion: String,
    url: String
})

let Bookmark = mongoose.model('bookmark', bookmarkCollection);

let BookmarkController = {
    update: function(id, newBookmark) {
        return Bookmark.findOneAndUpdate({id: id}, newBookmark)
            .then( bm => {
                return bm;
            })
            .catch(error => {
                throw Error(error);
            })
    }
}

module.exports = {BookmarkController};