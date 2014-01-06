# String.nocomplex  
[![Build Status](https://secure.travis-ci.org/cagosta/String.nocomplex.png?branch=master)](https://travis-ci.org/cagosta/String.nocomplex)


## Introduction ##

String.prototype augmentations based on underscore.string. No complex.


I know this is bad but _( _( _( this ).is ).ugly() while this.is.clean().
Furthemore, I promise to modify all .prototype invocations on modules that are becoming popular.  


All methods are taken on [underscore.string](https://github.com/epeli/underscore.string)

## Usage ##



## Install ##

String.nocomplex is coded as [AMD module](http://requirejs.org/docs/whyamd.html) but can be installed with npm, bower or old-fashioned src=".min.js".

#### With npm: ####

```
npm install string-nocomplex
```

and use it with nodejs: 
```
var StringNocomplex = require('string-nocomplex')
```

#### With bower: ####

``` 
bower install String.nocomplex
```

Point `String.nocomplex` to `[bower_components_path]/String.nocomplex/app/String.nocomplex.js` into your requirejs path config 
and load it with requirejs:  

```javascript
require(['String.nocomplex/String.nocomplex'], function( StringNocomplex ){

})
```


#### With src=" .min.js" ####


Inside the `dist` folder, [download latest standalone minified version](https://raw.github.com/cagosta/String.nocomplex/master/dist/String.nocomplex-latest-standalone-min.js) or [development version](https://raw.github.com/cagosta/String.nocomplex/master/dist/String.nocomplex-latest-standalone.js) and include it in your html page:

```html
<script src="[path_to_source]/String.nocomplex-latest-standalone-min.js%>"></script>
```

The module is available via the scope 

```javascript
window.StringNocomplex
```

## To do ##

* more tests 
* atomised in amd modules ? 

## Documentation ##

See jsdoc-generated documentation in /documentation  

### Folder Structure ###

    app         ->  development files
    |- bower_components          ->  [bower](https://github.com/bower/bower) front-end packages
    |- main.js                   ->  main file for browser and node.js, handle AMD config
    |- string.nocomplex   -> main AMD module
    test        ->  unit tests
    |
    tasks       -> [Grunt](http://gruntjs.com/) tasks, see [generator-mangrove-module](https://github.com/cagosta/generator-mangrove-module)
    |
    dist        ->  distribution & build files
    |
    node_modules -> node packages
    |
    documentation  -> [jsdoc](http://usejsdoc.org/about-jsdoc3.html) generated documentation 


## Run unit tests ##

#### On the browser ####

Run `grunt test:browser` and open `test/` on your browser.

#### On a headless browser ####

`grunt test:headless` will run your tests in a headless browser, with [phantomjs](http://phantomjs.org/) and [mocha](http://visionmedia.github.io/mocha/)

### On node ####

`grunt test:node` will run your tests with node and mocha.  

Because of requirejs, the `mocha` command does not work.


## Build your own ##

This project uses [Node.js](http://nodejs.org/), [Grunt](http://gruntjs.com/) and [Require.js](http://requirejs.org/docs/optimization.html) for the build process. If for some reason you need to build a custom version install Node.js, `npm install` and run:

    grunt build

## Yeoman Mangrove module Generator ##

This module is based on a [Yeoman](https://github.com/yeoman/yeoman/wiki/Getting-Started) generator: [Generator-mangrove-module](https://github.com/cagosta/generator-mangrove-module)  
Check it for task-related references such as build, deploy etc ..


## Authors ##
* [Cyril Agosta](https://github.com/cagosta)


## License ##

[MIT License](http://www.opensource.org/licenses/mit-license.php)

