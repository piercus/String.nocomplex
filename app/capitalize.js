define( function() {

    String.prototype.capitalize = function() {
        return ( this[ 0 ].toUpperCase() + this.substr( 1, this.length - 1 ) );
    };

} );
