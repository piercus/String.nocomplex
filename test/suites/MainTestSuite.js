define( [
    'String.nocomplex/String.nocomplex'
 ], function( StringNocomplex ) {

    describe( 'String.nocomplex/String.nocomplex', function() {

        it( 'should load without blowing', function() {

            expect( StringNocomplex ).to.exist

        } )

        it( 'sould have defined methods in String.prototype', function() {

            expect( StringNocomplex ).to.equal( String.prototype )
            expect( "".slugify ).to.exist
            expect( "   epeli  ".trim() ).to.equal( "epeli" )
            expect( "   epeli  ".trim().capitalize() ).to.equal( "Epeli" )

            expect( "image.gif".endsWith( "gif" ) ).to.be.true
            expect( "_-foobar-_".trim( "_-" ) ).to.equal( "foobar" )

        } )

    } )

} )