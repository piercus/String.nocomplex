(function () {
/**
 * almond 0.2.7 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

//  Underscore.string
//  (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
//  Underscore.string is freely distributable under the terms of the MIT license.
//  Documentation: https://github.com/epeli/underscore.string
//  Some code is borrowed from MooTools and Alexandru Marasteanu.
//  Version '2.3.2'

! function( root, String ) {
  

  // Defining helper functions.

  var nativeTrim = String.prototype.trim;
  var nativeTrimRight = String.prototype.trimRight;
  var nativeTrimLeft = String.prototype.trimLeft;

  var parseNumber = function( source ) {
    return source * 1 || 0;
  };

  var strRepeat = function( str, qty ) {
    if ( qty < 1 ) return '';
    var result = '';
    while ( qty > 0 ) {
      if ( qty & 1 ) result += str;
      qty >>= 1, str += str;
    }
    return result;
  };

  var slice = [].slice;

  var defaultToWhiteSpace = function( characters ) {
    if ( characters == null )
      return '\\s';
    else if ( characters.source )
      return characters.source;
    else
      return '[' + _s.escapeRegExp( characters ) + ']';
  };

  // Helper for toBoolean
  function boolMatch( s, matchers ) {
    var i, matcher, down = s.toLowerCase();
    matchers = [].concat( matchers );
    for ( i = 0; i < matchers.length; i += 1 ) {
      matcher = matchers[ i ];
      if ( !matcher ) continue;
      if ( matcher.test && matcher.test( s ) ) return true;
      if ( matcher.toLowerCase() === down ) return true;
    }
  }

  var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'"
  };

  var reversedEscapeChars = {};
  for ( var key in escapeChars ) reversedEscapeChars[ escapeChars[ key ] ] = key;
  reversedEscapeChars[ "'" ] = '#39';

  // sprintf() for JavaScript 0.7-beta1
  // http://www.diveintojavascript.com/projects/javascript-sprintf
  //
  // Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
  // All rights reserved.

  var sprintf = ( function() {
    function get_type( variable ) {
      return Object.prototype.toString.call( variable ).slice( 8, -1 ).toLowerCase();
    }

    var str_repeat = strRepeat;

    var str_format = function() {
      if ( !str_format.cache.hasOwnProperty( arguments[ 0 ] ) ) {
        str_format.cache[ arguments[ 0 ] ] = str_format.parse( arguments[ 0 ] );
      }
      return str_format.format.call( null, str_format.cache[ arguments[ 0 ] ], arguments );
    };

    str_format.format = function( parse_tree, argv ) {
      var cursor = 1,
        tree_length = parse_tree.length,
        node_type = '',
        arg, output = [],
        i, k, match, pad, pad_character, pad_length;
      for ( i = 0; i < tree_length; i++ ) {
        node_type = get_type( parse_tree[ i ] );
        if ( node_type === 'string' ) {
          output.push( parse_tree[ i ] );
        } else if ( node_type === 'array' ) {
          match = parse_tree[ i ]; // convenience purposes only
          if ( match[ 2 ] ) { // keyword argument
            arg = argv[ cursor ];
            for ( k = 0; k < match[ 2 ].length; k++ ) {
              if ( !arg.hasOwnProperty( match[ 2 ][ k ] ) ) {
                throw new Error( sprintf( '[_.sprintf] property "%s" does not exist', match[ 2 ][ k ] ) );
              }
              arg = arg[ match[ 2 ][ k ] ];
            }
          } else if ( match[ 1 ] ) { // positional argument (explicit)
            arg = argv[ match[ 1 ] ];
          } else { // positional argument (implicit)
            arg = argv[ cursor++ ];
          }

          if ( /[^s]/.test( match[ 8 ] ) && ( get_type( arg ) != 'number' ) ) {
            throw new Error( sprintf( '[_.sprintf] expecting number but found %s', get_type( arg ) ) );
          }
          switch ( match[ 8 ] ) {
            case 'b':
              arg = arg.toString( 2 );
              break;
            case 'c':
              arg = String.fromCharCode( arg );
              break;
            case 'd':
              arg = parseInt( arg, 10 );
              break;
            case 'e':
              arg = match[ 7 ] ? arg.toExponential( match[ 7 ] ) : arg.toExponential();
              break;
            case 'f':
              arg = match[ 7 ] ? parseFloat( arg ).toFixed( match[ 7 ] ) : parseFloat( arg );
              break;
            case 'o':
              arg = arg.toString( 8 );
              break;
            case 's':
              arg = ( ( arg = String( arg ) ) && match[ 7 ] ? arg.substring( 0, match[ 7 ] ) : arg );
              break;
            case 'u':
              arg = Math.abs( arg );
              break;
            case 'x':
              arg = arg.toString( 16 );
              break;
            case 'X':
              arg = arg.toString( 16 ).toUpperCase();
              break;
          }
          arg = ( /[def]/.test( match[ 8 ] ) && match[ 3 ] && arg >= 0 ? '+' + arg : arg );
          pad_character = match[ 4 ] ? match[ 4 ] == '0' ? '0' : match[ 4 ].charAt( 1 ) : ' ';
          pad_length = match[ 6 ] - String( arg ).length;
          pad = match[ 6 ] ? str_repeat( pad_character, pad_length ) : '';
          output.push( match[ 5 ] ? arg + pad : pad + arg );
        }
      }
      return output.join( '' );
    };

    str_format.cache = {};

    str_format.parse = function( fmt ) {
      var _fmt = fmt,
        match = [],
        parse_tree = [],
        arg_names = 0;
      while ( _fmt ) {
        if ( ( match = /^[^\x25]+/.exec( _fmt ) ) !== null ) {
          parse_tree.push( match[ 0 ] );
        } else if ( ( match = /^\x25{2}/.exec( _fmt ) ) !== null ) {
          parse_tree.push( '%' );
        } else if ( ( match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec( _fmt ) ) !== null ) {
          if ( match[ 2 ] ) {
            arg_names |= 1;
            var field_list = [],
              replacement_field = match[ 2 ],
              field_match = [];
            if ( ( field_match = /^([a-z_][a-z_\d]*)/i.exec( replacement_field ) ) !== null ) {
              field_list.push( field_match[ 1 ] );
              while ( ( replacement_field = replacement_field.substring( field_match[ 0 ].length ) ) !== '' ) {
                if ( ( field_match = /^\.([a-z_][a-z_\d]*)/i.exec( replacement_field ) ) !== null ) {
                  field_list.push( field_match[ 1 ] );
                } else if ( ( field_match = /^\[(\d+)\]/.exec( replacement_field ) ) !== null ) {
                  field_list.push( field_match[ 1 ] );
                } else {
                  throw new Error( '[_.sprintf] huh?' );
                }
              }
            } else {
              throw new Error( '[_.sprintf] huh?' );
            }
            match[ 2 ] = field_list;
          } else {
            arg_names |= 2;
          }
          if ( arg_names === 3 ) {
            throw new Error( '[_.sprintf] mixing positional and named placeholders is not (yet) supported' );
          }
          parse_tree.push( match );
        } else {
          throw new Error( '[_.sprintf] huh?' );
        }
        _fmt = _fmt.substring( match[ 0 ].length );
      }
      return parse_tree;
    };

    return str_format;
  } )();



  // Defining underscore.string

  var _s = {

    VERSION: '2.3.0',

    isBlank: function( str ) {
      if ( str == null ) str = '';
      return ( /^\s*$/ ).test( str );
    },

    stripTags: function( str ) {
      if ( str == null ) return '';
      return String( str ).replace( /<\/?[^>]+>/g, '' );
    },

    capitalize: function( str ) {
      str = str == null ? '' : String( str );
      return str.charAt( 0 ).toUpperCase() + str.slice( 1 );
    },

    chop: function( str, step ) {
      if ( str == null ) return [];
      str = String( str );
      step = ~~step;
      return step > 0 ? str.match( new RegExp( '.{1,' + step + '}', 'g' ) ) : [ str ];
    },

    clean: function( str ) {
      return _s.strip( str ).replace( /\s+/g, ' ' );
    },

    count: function( str, substr ) {
      if ( str == null || substr == null ) return 0;

      str = String( str );
      substr = String( substr );

      var count = 0,
        pos = 0,
        length = substr.length;

      while ( true ) {
        pos = str.indexOf( substr, pos );
        if ( pos === -1 ) break;
        count++;
        pos += length;
      }

      return count;
    },

    chars: function( str ) {
      if ( str == null ) return [];
      return String( str ).split( '' );
    },

    swapCase: function( str ) {
      if ( str == null ) return '';
      return String( str ).replace( /\S/g, function( c ) {
        return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
      } );
    },

    escapeHTML: function( str ) {
      if ( str == null ) return '';
      return String( str ).replace( /[&<>"']/g, function( m ) {
        return '&' + reversedEscapeChars[ m ] + ';';
      } );
    },

    unescapeHTML: function( str ) {
      if ( str == null ) return '';
      return String( str ).replace( /\&([^;]+);/g, function( entity, entityCode ) {
        var match;

        if ( entityCode in escapeChars ) {
          return escapeChars[ entityCode ];
        } else if ( match = entityCode.match( /^#x([\da-fA-F]+)$/ ) ) {
          return String.fromCharCode( parseInt( match[ 1 ], 16 ) );
        } else if ( match = entityCode.match( /^#(\d+)$/ ) ) {
          return String.fromCharCode( ~~match[ 1 ] );
        } else {
          return entity;
        }
      } );
    },

    escapeRegExp: function( str ) {
      if ( str == null ) return '';
      return String( str ).replace( /([.*+?^=!:${}()|[\]\/\\])/g, '\\$1' );
    },

    splice: function( str, i, howmany, substr ) {
      var arr = _s.chars( str );
      arr.splice( ~~i, ~~howmany, substr );
      return arr.join( '' );
    },

    insert: function( str, i, substr ) {
      return _s.splice( str, i, 0, substr );
    },

    include: function( str, needle ) {
      if ( needle === '' ) return true;
      if ( str == null ) return false;
      return String( str ).indexOf( needle ) !== -1;
    },

    join: function() {
      var args = slice.call( arguments ),
        separator = args.shift();

      if ( separator == null ) separator = '';

      return args.join( separator );
    },

    lines: function( str ) {
      if ( str == null ) return [];
      return String( str ).split( "\n" );
    },

    reverse: function( str ) {
      return _s.chars( str ).reverse().join( '' );
    },

    startsWith: function( str, starts ) {
      if ( starts === '' ) return true;
      if ( str == null || starts == null ) return false;
      str = String( str );
      starts = String( starts );
      return str.length >= starts.length && str.slice( 0, starts.length ) === starts;
    },

    endsWith: function( str, ends ) {
      if ( ends === '' ) return true;
      if ( str == null || ends == null ) return false;
      str = String( str );
      ends = String( ends );
      return str.length >= ends.length && str.slice( str.length - ends.length ) === ends;
    },

    succ: function( str ) {
      if ( str == null ) return '';
      str = String( str );
      return str.slice( 0, -1 ) + String.fromCharCode( str.charCodeAt( str.length - 1 ) + 1 );
    },

    titleize: function( str ) {
      if ( str == null ) return '';
      str = String( str ).toLowerCase();
      return str.replace( /(?:^|\s|-)\S/g, function( c ) {
        return c.toUpperCase();
      } );
    },

    camelize: function( str ) {
      return _s.trim( str ).replace( /[-_\s]+(.)?/g, function( match, c ) {
        return c ? c.toUpperCase() : "";
      } );
    },

    underscored: function( str ) {
      return _s.trim( str ).replace( /([a-z\d])([A-Z]+)/g, '$1_$2' ).replace( /[-\s]+/g, '_' ).toLowerCase();
    },

    dasherize: function( str ) {
      return _s.trim( str ).replace( /([A-Z])/g, '-$1' ).replace( /[-_\s]+/g, '-' ).toLowerCase();
    },

    classify: function( str ) {
      return _s.titleize( String( str ).replace( /[\W_]/g, ' ' ) ).replace( /\s/g, '' );
    },

    humanize: function( str ) {
      return _s.capitalize( _s.underscored( str ).replace( /_id$/, '' ).replace( /_/g, ' ' ) );
    },

    trim: function( str, characters ) {
      if ( str == null ) return '';
      if ( !characters && nativeTrim ) return nativeTrim.call( str );
      characters = defaultToWhiteSpace( characters );
      return String( str ).replace( new RegExp( '\^' + characters + '+|' + characters + '+$', 'g' ), '' );
    },

    ltrim: function( str, characters ) {
      if ( str == null ) return '';
      if ( !characters && nativeTrimLeft ) return nativeTrimLeft.call( str );
      characters = defaultToWhiteSpace( characters );
      return String( str ).replace( new RegExp( '^' + characters + '+' ), '' );
    },

    rtrim: function( str, characters ) {
      if ( str == null ) return '';
      if ( !characters && nativeTrimRight ) return nativeTrimRight.call( str );
      characters = defaultToWhiteSpace( characters );
      return String( str ).replace( new RegExp( characters + '+$' ), '' );
    },

    truncate: function( str, length, truncateStr ) {
      if ( str == null ) return '';
      str = String( str );
      truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice( 0, length ) + truncateStr : str;
    },

    /**
     * _s.prune: a more elegant version of truncate
     * prune extra chars, never leaving a half-chopped word.
     * @author github.com/rwz
     */
    prune: function( str, length, pruneStr ) {
      if ( str == null ) return '';

      str = String( str );
      length = ~~length;
      pruneStr = pruneStr != null ? String( pruneStr ) : '...';

      if ( str.length <= length ) return str;

      var tmpl = function( c ) {
        return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ';
      },
        template = str.slice( 0, length + 1 ).replace( /.(?=\W*\w*$)/g, tmpl ); // 'Hello, world' -> 'HellAA AAAAA'

      if ( template.slice( template.length - 2 ).match( /\w\w/ ) )
        template = template.replace( /\s*\S+$/, '' );
      else
        template = _s.rtrim( template.slice( 0, template.length - 1 ) );

      return ( template + pruneStr ).length > str.length ? str : str.slice( 0, template.length ) + pruneStr;
    },

    words: function( str, delimiter ) {
      if ( _s.isBlank( str ) ) return [];
      return _s.trim( str, delimiter ).split( delimiter || /\s+/ );
    },

    pad: function( str, length, padStr, type ) {
      str = str == null ? '' : String( str );
      length = ~~length;

      var padlen = 0;

      if ( !padStr )
        padStr = ' ';
      else if ( padStr.length > 1 )
        padStr = padStr.charAt( 0 );

      switch ( type ) {
        case 'right':
          padlen = length - str.length;
          return str + strRepeat( padStr, padlen );
        case 'both':
          padlen = length - str.length;
          return strRepeat( padStr, Math.ceil( padlen / 2 ) ) + str + strRepeat( padStr, Math.floor( padlen / 2 ) );
        default: // 'left'
          padlen = length - str.length;
          return strRepeat( padStr, padlen ) + str;
      }
    },

    lpad: function( str, length, padStr ) {
      return _s.pad( str, length, padStr );
    },

    rpad: function( str, length, padStr ) {
      return _s.pad( str, length, padStr, 'right' );
    },

    lrpad: function( str, length, padStr ) {
      return _s.pad( str, length, padStr, 'both' );
    },

    sprintf: sprintf,

    vsprintf: function( fmt, argv ) {
      argv.unshift( fmt );
      return sprintf.apply( null, argv );
    },

    toNumber: function( str, decimals ) {
      if ( !str ) return 0;
      str = _s.trim( str );
      if ( !str.match( /^-?\d+(?:\.\d+)?$/ ) ) return NaN;
      return parseNumber( parseNumber( str ).toFixed( ~~decimals ) );
    },

    numberFormat: function( number, dec, dsep, tsep ) {
      if ( isNaN( number ) || number == null ) return '';

      number = number.toFixed( ~~dec );
      tsep = typeof tsep == 'string' ? tsep : ',';

      var parts = number.split( '.' ),
        fnums = parts[ 0 ],
        decimals = parts[ 1 ] ? ( dsep || '.' ) + parts[ 1 ] : '';

      return fnums.replace( /(\d)(?=(?:\d{3})+$)/g, '$1' + tsep ) + decimals;
    },

    strRight: function( str, sep ) {
      if ( str == null ) return '';
      str = String( str );
      sep = sep != null ? String( sep ) : sep;
      var pos = !sep ? -1 : str.indexOf( sep );
      return~ pos ? str.slice( pos + sep.length, str.length ) : str;
    },

    strRightBack: function( str, sep ) {
      if ( str == null ) return '';
      str = String( str );
      sep = sep != null ? String( sep ) : sep;
      var pos = !sep ? -1 : str.lastIndexOf( sep );
      return~ pos ? str.slice( pos + sep.length, str.length ) : str;
    },

    strLeft: function( str, sep ) {
      if ( str == null ) return '';
      str = String( str );
      sep = sep != null ? String( sep ) : sep;
      var pos = !sep ? -1 : str.indexOf( sep );
      return~ pos ? str.slice( 0, pos ) : str;
    },

    strLeftBack: function( str, sep ) {
      if ( str == null ) return '';
      str += '';
      sep = sep != null ? '' + sep : sep;
      var pos = str.lastIndexOf( sep );
      return~ pos ? str.slice( 0, pos ) : str;
    },

    toSentence: function( array, separator, lastSeparator, serial ) {
      separator = separator || ', ';
      lastSeparator = lastSeparator || ' and ';
      var a = array.slice(),
        lastMember = a.pop();

      if ( array.length > 2 && serial ) lastSeparator = _s.rtrim( separator ) + lastSeparator;

      return a.length ? a.join( separator ) + lastSeparator + lastMember : lastMember;
    },

    toSentenceSerial: function() {
      var args = slice.call( arguments );
      args[ 3 ] = true;
      return _s.toSentence.apply( _s, args );
    },

    slugify: function( str ) {
      if ( str == null ) return '';

      var from = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
        to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
        regex = new RegExp( defaultToWhiteSpace( from ), 'g' );

      str = String( str ).toLowerCase().replace( regex, function( c ) {
        var index = from.indexOf( c );
        return to.charAt( index ) || '-';
      } );

      return _s.dasherize( str.replace( /[^\w\s-]/g, '' ) );
    },

    surround: function( str, wrapper ) {
      return [ wrapper, str, wrapper ].join( '' );
    },

    quote: function( str, quoteChar ) {
      return _s.surround( str, quoteChar || '"' );
    },

    unquote: function( str, quoteChar ) {
      quoteChar = quoteChar || '"';
      if ( str[ 0 ] === quoteChar && str[ str.length - 1 ] === quoteChar )
        return str.slice( 1, str.length - 1 );
      else return str;
    },

    exports: function() {
      var result = {};

      for ( var prop in this ) {
        if ( !this.hasOwnProperty( prop ) || prop.match( /^(?:include|contains|reverse)$/ ) ) continue;
        result[ prop ] = this[ prop ];
      }

      return result;
    },

    repeat: function( str, qty, separator ) {
      if ( str == null ) return '';

      qty = ~~qty;

      // using faster implementation if separator is not needed;
      if ( separator == null ) return strRepeat( String( str ), qty );

      // this one is about 300x slower in Google Chrome
      for ( var repeat = []; qty > 0; repeat[ --qty ] = str ) {}
      return repeat.join( separator );
    },

    naturalCmp: function( str1, str2 ) {
      if ( str1 == str2 ) return 0;
      if ( !str1 ) return -1;
      if ( !str2 ) return 1;

      var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
        tokens1 = String( str1 ).toLowerCase().match( cmpRegex ),
        tokens2 = String( str2 ).toLowerCase().match( cmpRegex ),
        count = Math.min( tokens1.length, tokens2.length );

      for ( var i = 0; i < count; i++ ) {
        var a = tokens1[ i ],
          b = tokens2[ i ];

        if ( a !== b ) {
          var num1 = parseInt( a, 10 );
          if ( !isNaN( num1 ) ) {
            var num2 = parseInt( b, 10 );
            if ( !isNaN( num2 ) && num1 - num2 )
              return num1 - num2;
          }
          return a < b ? -1 : 1;
        }
      }

      if ( tokens1.length === tokens2.length )
        return tokens1.length - tokens2.length;

      return str1 < str2 ? -1 : 1;
    },

    levenshtein: function( str1, str2 ) {
      if ( str1 == null && str2 == null ) return 0;
      if ( str1 == null ) return String( str2 ).length;
      if ( str2 == null ) return String( str1 ).length;

      str1 = String( str1 );
      str2 = String( str2 );

      var current = [],
        prev, value;

      for ( var i = 0; i <= str2.length; i++ )
        for ( var j = 0; j <= str1.length; j++ ) {
          if ( i && j )
            if ( str1.charAt( j - 1 ) === str2.charAt( i - 1 ) )
              value = prev;
            else
              value = Math.min( current[ j ], current[ j - 1 ], prev ) + 1;
            else
              value = i + j;

          prev = current[ j ];
          current[ j ] = value;
        }

      return current.pop();
    },

    toBoolean: function( str, trueValues, falseValues ) {
      if ( typeof str === "number" ) str = "" + str;
      if ( typeof str !== "string" ) return !!str;
      str = _s.trim( str );
      if ( boolMatch( str, trueValues || [ "true", "1" ] ) ) return true;
      if ( boolMatch( str, falseValues || [ "false", "0" ] ) ) return false;
    }
  };

  // Aliases

  _s.strip = _s.trim;
  _s.lstrip = _s.ltrim;
  _s.rstrip = _s.rtrim;
  _s.center = _s.lrpad;
  _s.rjust = _s.lpad;
  _s.ljust = _s.rpad;
  _s.contains = _s.include;
  _s.q = _s.quote;
  _s.toBool = _s.toBoolean;

  // Exporting

  // CommonJS module is defined
  if ( typeof exports !== 'undefined' ) {
    if ( typeof module !== 'undefined' && module.exports )
      module.exports = _s;

    exports._s = _s;
  }

  // Register as a named module with AMD.
  if ( typeof define === 'function' && define.amd )
    define( 'underscore.string', [], function() {
      return _s;
    } );


  // Integrate with Underscore.js if defined
  // or create our own underscore object.
  root._ = root._ || {};
  root._.string = root._.str = _s;
}( this, String );
/**
 * String.nocomplex version: "0.0.5" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
 * Available via the MIT license.
 * see: http://github.com/cagosta/String.nocomplex for details
 */

define( 'String.nocomplex/String.nocomplex',[
    'underscore.string'
 ], function( helpers ) {

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

} );
var EngineDetector = function() {
    this.isNode = false
    this.isBrowser = false
    this.isUnknown = false
    this._exports
    this.detect()
}

EngineDetector.prototype = {

    detect: function() {
        if ( typeof module !== 'undefined' && module.exports )
            this._setAsNode()
        else if ( typeof window !== "undefined" )
            this._setAsBrowser()
        else
            this._setAsUnknown()
    },

    _setAsNode: function() {
        this.isNode = true
        this.name = 'node'
    },

    _setAsBrowser: function() {
        this.isBrowser = true
        this._global = window
        this.name = 'browser'
    },

    _setAsUnknown: function() {
        this.isUnknown = true
        this.name = 'unknown'
    },

    setGlobal: function( e ) {
        this._global = e
    },

    ifNode: function( f ) {
        if ( this.isNode )
            f()
    },

    ifBrowser: function( f ) {
        if ( this.isBrowser )
            f()
    },


    exports: function( key, exported ) {
        if ( this.isNode ) {
            this._global.exports = exported
        } else if ( this.isBrowser )
            this._global[  key ] = exported
    },

}

var engine = new EngineDetector()


var baseUrl, requirejs;

engine.ifNode( function() {

    baseUrl = __dirname
    requirejs = require( 'requirejs' )
    engine.setGlobal( module )

} )

engine.ifBrowser( function() {
    baseUrl = '.'
} )


requirejs.config( {
    baseUrl: function(){ return ( typeof define === 'undefined') ? __dirname: '.'}(),
    shim: {
        mocha: {
            exports: 'mocha'
        }
    },
    paths: {
        'String.nocomplex': '.',
        almond: 'bower_components/almond/almond',
        chai: 'bower_components/chai/chai',
        'chai-as-promised': 'bower_components/chai-as-promised/lib/chai-as-promised',
        mocha: 'bower_components/mocha/mocha',
        'normalize-css': 'bower_components/normalize-css/normalize.css',
        requirejs: 'bower_components/requirejs/require',
        async: 'bower_components/requirejs-plugins/src/async',
        depend: 'bower_components/requirejs-plugins/src/depend',
        font: 'bower_components/requirejs-plugins/src/font',
        goog: 'bower_components/requirejs-plugins/src/goog',
        image: 'bower_components/requirejs-plugins/src/image',
        json: 'bower_components/requirejs-plugins/src/json',
        mdown: 'bower_components/requirejs-plugins/src/mdown',
        noext: 'bower_components/requirejs-plugins/src/noext',
        propertyParser: 'bower_components/requirejs-plugins/src/propertyParser',
        'Markdown.Converter': 'bower_components/requirejs-plugins/lib/Markdown.Converter',
        text: 'bower_components/requirejs-plugins/lib/text',
        'sinon-chai': 'bower_components/sinon-chai/lib/sinon-chai',
        sinonjs: 'bower_components/sinonjs/sinon',
        'underscore.string': 'bower_components/underscore.string/lib/underscore.string'
    }
} )


var isStandalone = !! requirejs._defined,
    synchronous = isStandalone

engine.ifNode(function(){

    synchronous = true

})

if ( synchronous ) { // case standalone

    var StringNocomplex = requirejs( 'String.nocomplex/String.nocomplex' )

    engine.exports( 'StringNocomplex', StringNocomplex )


} else {

    requirejs( [ 'String.nocomplex/String.nocomplex' ], function( StringNocomplex ) {
        engine.exports( 'StringNocomplex', StringNocomplex )
    } )

}
;
define("String.nocomplex/main", function(){});
}());