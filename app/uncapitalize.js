define( function() {

    String.prototype.uncapitalize = function() {
        return ( this[ 0 ].toLowerCase() + this.substr( 1, this.length - 1 ) );
    };

} );