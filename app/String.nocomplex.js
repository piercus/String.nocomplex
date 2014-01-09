/**
 * String.nocomplex version: "0.0.7" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/String.nocomplex for details
 */

define( [
    'underscore.string',
    './uncapitalize'
 ], function( helpers, uncapitalize ) {


    
    var slice = Array.prototype.slice,
        addMethod = function( method ) {
            String.prototype[ method ] = function() {
                var args = slice.call( arguments )
                args.unshift( this )
                return helpers[ method ].apply( this, args )
            }
        }

    for ( var method in helpers )
        if ( helpers.hasOwnProperty( method ) ) {
            addMethod( method )
        }

    return String.prototype

} )