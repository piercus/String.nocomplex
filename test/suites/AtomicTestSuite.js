define( [
    'String.nocomplex/capitalize'
 ], function(  ) {

    describe( 'String.nocomplex/capitalize', function() {

        it( 'sould have defined capitalize working method in String.prototype', function() {
            expect(String.prototype.capitalize).to.exist
            expect( "epeli".capitalize() ).to.equal( "Epeli" )
        } )

    } )

} )