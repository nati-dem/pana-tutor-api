const NodeCache = require( "node-cache" );

export class AppCache {

    private static _cache;

    static getInstance(){
        if(!this._cache){
            this._cache = new NodeCache();
        }
        return this._cache;
    }

}
