/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
  // A central reference to the root jQuery(document)
  rootjQuery,

  // The deferred used on DOM ready
  readyList,

  // Use the correct document accordingly with window argument (sandbox)
  document = window.document,
  location = window.location,
  navigator = window.navigator,

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // Save a reference to some core methods
  core_push = Array.prototype.push,
  core_slice = Array.prototype.slice,
  core_indexOf = Array.prototype.indexOf,
  core_toString = Object.prototype.toString,
  core_hasOwn = Object.prototype.hasOwnProperty,
  core_trim = String.prototype.trim,

  // Define a local copy of jQuery
  jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Used for matching numbers
  core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

  // Used for detecting and trimming whitespace
  core_rnotwhite = /\S/,
  core_rspace = /\s+/,

  // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
  rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

  // A simple way to check for HTML strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

  // Matches dashed string for camelizing
  rmsPrefix = /^-ms-/,
  rdashAlpha = /-([\da-z])/gi,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return ( letter + "" ).toUpperCase();
  },

  // The ready event handler and self cleanup method
  DOMContentLoaded = function() {
    if ( document.addEventListener ) {
      document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
      jQuery.ready();
    } else if ( document.readyState === "complete" ) {
      // we're here because readyState === "complete" in oldIE
      // which is good enough for us to call the dom ready!
      document.detachEvent( "onreadystatechange", DOMContentLoaded );
      jQuery.ready();
    }
  },

  // [[Class]] -> type pairs
  class2type = {};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem, ret, doc;

    // Handle $(""), $(null), $(undefined), $(false)
    if ( !selector ) {
      return this;
    }

    // Handle $(DOMElement)
    if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = rquickExpr.exec( selector );
      }

      // Match html or make sure no context is specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;
          doc = ( context && context.nodeType ? context.ownerDocument || context : document );

          // scripts is true for back-compat
          selector = jQuery.parseHTML( match[1], doc, true );
          if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
            this.attr.call( selector, context, true );
          }

          return jQuery.merge( this, selector );

        // HANDLE: $(#id)
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The current version of jQuery being used
  jquery: "1.8.2",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return core_slice.call( this );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems, name, selector ) {

    // Build a new jQuery matched element set
    var ret = jQuery.merge( this.constructor(), elems );

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    ret.context = this.context;

    if ( name === "find" ) {
      ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
    } else if ( name ) {
      ret.selector = this.selector + "." + name + "(" + selector + ")";
    }

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Add the callback
    jQuery.ready.promise().done( fn );

    return this;
  },

  eq: function( i ) {
    i = +i;
    return i === -1 ?
      this.slice( i ) :
      this.slice( i, i + 1 );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  slice: function() {
    return this.pushStack( core_slice.apply( this, arguments ),
      "slice", core_slice.call(arguments).join(",") );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: core_push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {

    // Abort if there are pending holds or we're already ready
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }

    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( !document.body ) {
      return setTimeout( jQuery.ready, 1 );
    }

    // Remember that the DOM is ready
    jQuery.isReady = true;

    // If a normal DOM Ready event fired, decrement, and wait if need be
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }

    // If there are functions bound, to execute
    readyList.resolveWith( document, [ jQuery ] );

    // Trigger any bound ready events
    if ( jQuery.fn.trigger ) {
      jQuery( document ).trigger("ready").off("ready");
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  isWindow: function( obj ) {
    return obj != null && obj == obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ core_toString.call(obj) ] || "object";
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !core_hasOwn.call(obj, "constructor") &&
        !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || core_hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  // data: string of html
  // context (optional): If specified, the fragment will be created in this context, defaults to document
  // scripts (optional): If true, will include scripts passed in the html string
  parseHTML: function( data, context, scripts ) {
    var parsed;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    if ( typeof context === "boolean" ) {
      scripts = context;
      context = 0;
    }
    context = context || document;

    // Single tag
    if ( (parsed = rsingleTag.exec( data )) ) {
      return [ context.createElement( parsed[1] ) ];
    }

    parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
    return jQuery.merge( [],
      (parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
  },

  parseJSON: function( data ) {
    if ( !data || typeof data !== "string") {
      return null;
    }

    // Make sure leading/trailing whitespace is removed (IE can't handle it)
    data = jQuery.trim( data );

    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    // Make sure the incoming data is actual JSON
    // Logic borrowed from http://json.org/json2.js
    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
      .replace( rvalidtokens, "]" )
      .replace( rvalidbraces, "")) ) {

      return ( new Function( "return " + data ) )();

    }
    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  parseXML: function( data ) {
    var xml, tmp;
    if ( !data || typeof data !== "string" ) {
      return null;
    }
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && core_rnotwhite.test( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
  },

  // args is for internal usage only
  each: function( obj, callback, args ) {
    var name,
      i = 0,
      length = obj.length,
      isObj = length === undefined || jQuery.isFunction( obj );

    if ( args ) {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.apply( obj[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( obj[ i++ ], args ) === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in obj ) {
          if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
            break;
          }
        }
      }
    }

    return obj;
  },

  // Use native String.trim function wherever possible
  trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
    function( text ) {
      return text == null ?
        "" :
        core_trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        ( text + "" ).replace( rtrim, "" );
    },

  // results is for internal usage only
  makeArray: function( arr, results ) {
    var type,
      ret = results || [];

    if ( arr != null ) {
      // The window, strings (and functions) also have 'length'
      // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
      type = jQuery.type( arr );

      if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
        core_push.call( ret, arr );
      } else {
        jQuery.merge( ret, arr );
      }
    }

    return ret;
  },

  inArray: function( elem, arr, i ) {
    var len;

    if ( arr ) {
      if ( core_indexOf ) {
        return core_indexOf.call( arr, elem, i );
      }

      len = arr.length;
      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

      for ( ; i < len; i++ ) {
        // Skip accessing in sparse arrays
        if ( i in arr && arr[ i ] === elem ) {
          return i;
        }
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var l = second.length,
      i = first.length,
      j = 0;

    if ( typeof l === "number" ) {
      for ( ; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }

    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var retVal,
      ret = [],
      i = 0,
      length = elems.length;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( ; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value, key,
      ret = [],
      i = 0,
      length = elems.length,
      // jquery objects are treated as arrays
      isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( key in elems ) {
        value = callback( elems[ key ], key, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    var tmp, args, proxy;

    if ( typeof context === "string" ) {
      tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    args = core_slice.call( arguments, 2 );
    proxy = function() {
      return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
    };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
  },

  // Multifunctional method to get and set values of a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
    var exec,
      bulk = key == null,
      i = 0,
      length = elems.length;

    // Sets many values
    if ( key && typeof key === "object" ) {
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
      }
      chainable = 1;

    // Sets one value
    } else if ( value !== undefined ) {
      // Optionally, function values get executed if exec is true
      exec = pass === undefined && jQuery.isFunction( value );

      if ( bulk ) {
        // Bulk operations only iterate when executing function values
        if ( exec ) {
          exec = fn;
          fn = function( elem, key, value ) {
            return exec.call( jQuery( elem ), value );
          };

        // Otherwise they run against the entire set
        } else {
          fn.call( elems, value );
          fn = null;
        }
      }

      if ( fn ) {
        for (; i < length; i++ ) {
          fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
        }
      }

      chainable = 1;
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: function() {
    return ( new Date() ).getTime();
  }
});

jQuery.ready.promise = function( obj ) {
  if ( !readyList ) {

    readyList = jQuery.Deferred();

    // Catch cases where $(document).ready() is called after the browser event has already occurred.
    // we once tried to use readyState "interactive" here, but it caused issues like the one
    // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      setTimeout( jQuery.ready, 1 );

    // Standards-based browsers support DOMContentLoaded
    } else if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", jQuery.ready, false );

    // If IE event model is used
    } else {
      // Ensure firing before onload, maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", DOMContentLoaded );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", jQuery.ready );

      // If IE and not a frame
      // continually check to see if the document is ready
      var top = false;

      try {
        top = window.frameElement == null && document.documentElement;
      } catch(e) {}

      if ( top && top.doScroll ) {
        (function doScrollCheck() {
          if ( !jQuery.isReady ) {

            try {
              // Use the trick by Diego Perini
              // http://javascript.nwbox.com/IEContentLoaded/
              top.doScroll("left");
            } catch(e) {
              return setTimeout( doScrollCheck, 50 );
            }

            // and execute any waiting functions
            jQuery.ready();
          }
        })();
      }
    }
  }
  return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
  var object = optionsCache[ options ] = {};
  jQuery.each( options.split( core_rspace ), function( _, flag ) {
    object[ flag ] = true;
  });
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  options: an optional list of space-separated options that will change how
 *      the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options = typeof options === "string" ?
    ( optionsCache[ options ] || createOptions( options ) ) :
    jQuery.extend( {}, options );

  var // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = !options.once && [],
    // Fire callbacks
    fire = function( data ) {
      memory = options.memory && data;
      fired = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      firing = true;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
          memory = false; // To prevent further calls using add
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( stack ) {
          if ( stack.length ) {
            fire( stack.shift() );
          }
        } else if ( memory ) {
          list = [];
        } else {
          self.disable();
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          // First, we save the current length
          var start = list.length;
          (function add( args ) {
            jQuery.each( args, function( _, arg ) {
              var type = jQuery.type( arg );
              if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
                list.push( arg );
              } else if ( arg && arg.length && type !== "string" ) {
                // Inspect recursively
                add( arg );
              }
            });
          })( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away
          } else if ( memory ) {
            firingStart = start;
            fire( memory );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          jQuery.each( arguments, function( _, arg ) {
            var index;
            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
              list.splice( index, 1 );
              // Handle firing indexes
              if ( firing ) {
                if ( index <= firingLength ) {
                  firingLength--;
                }
                if ( index <= firingIndex ) {
                  firingIndex--;
                }
              }
            }
          });
        }
        return this;
      },
      // Control if a given callback is in the list
      has: function( fn ) {
        return jQuery.inArray( fn, list ) > -1;
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        args = args || [];
        args = [ context, args.slice ? args.slice() : args ];
        if ( list && ( !fired || stack ) ) {
          if ( firing ) {
            stack.push( args );
          } else {
            fire( args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};
jQuery.extend({

  Deferred: function( func ) {
    var tuples = [
        // action, add listener, listener list, final state
        [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
        [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
        [ "notify", "progress", jQuery.Callbacks("memory") ]
      ],
      state = "pending",
      promise = {
        state: function() {
          return state;
        },
        always: function() {
          deferred.done( arguments ).fail( arguments );
          return this;
        },
        then: function( /* fnDone, fnFail, fnProgress */ ) {
          var fns = arguments;
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( tuples, function( i, tuple ) {
              var action = tuple[ 0 ],
                fn = fns[ i ];
              // deferred[ done | fail | progress ] for forwarding actions to newDefer
              deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
                function() {
                  var returned = fn.apply( this, arguments );
                  if ( returned && jQuery.isFunction( returned.promise ) ) {
                    returned.promise()
                      .done( newDefer.resolve )
                      .fail( newDefer.reject )
                      .progress( newDefer.notify );
                  } else {
                    newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                  }
                } :
                newDefer[ action ]
              );
            });
            fns = null;
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          return obj != null ? jQuery.extend( obj, promise ) : promise;
        }
      },
      deferred = {};

    // Keep pipe for back-compat
    promise.pipe = promise.then;

    // Add list-specific methods
    jQuery.each( tuples, function( i, tuple ) {
      var list = tuple[ 2 ],
        stateString = tuple[ 3 ];

      // promise[ done | fail | progress ] = list.add
      promise[ tuple[1] ] = list.add;

      // Handle state
      if ( stateString ) {
        list.add(function() {
          // state = [ resolved | rejected ]
          state = stateString;

        // [ reject_list | resolve_list ].disable; progress_list.lock
        }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
      }

      // deferred[ resolve | reject | notify ] = list.fire
      deferred[ tuple[0] ] = list.fire;
      deferred[ tuple[0] + "With" ] = list.fireWith;
    });

    // Make the deferred a promise
    promise.promise( deferred );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( subordinate /* , ..., subordinateN */ ) {
    var i = 0,
      resolveValues = core_slice.call( arguments ),
      length = resolveValues.length,

      // the count of uncompleted subordinates
      remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

      // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
      deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

      // Update function for both resolve and progress values
      updateFunc = function( i, contexts, values ) {
        return function( value ) {
          contexts[ i ] = this;
          values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
          if( values === progressValues ) {
            deferred.notifyWith( contexts, values );
          } else if ( !( --remaining ) ) {
            deferred.resolveWith( contexts, values );
          }
        };
      },

      progressValues, progressContexts, resolveContexts;

    // add listeners to Deferred subordinates; treat others as resolved
    if ( length > 1 ) {
      progressValues = new Array( length );
      progressContexts = new Array( length );
      resolveContexts = new Array( length );
      for ( ; i < length; i++ ) {
        if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
          resolveValues[ i ].promise()
            .done( updateFunc( i, resolveContexts, resolveValues ) )
            .fail( deferred.reject )
            .progress( updateFunc( i, progressContexts, progressValues ) );
        } else {
          --remaining;
        }
      }
    }

    // if we're not waiting on anything, resolve the master
    if ( !remaining ) {
      deferred.resolveWith( resolveContexts, resolveValues );
    }

    return deferred.promise();
  }
});
jQuery.support = (function() {

  var support,
    all,
    a,
    select,
    opt,
    input,
    fragment,
    eventName,
    i,
    isSupported,
    clickFn,
    div = document.createElement("div");

  // Preliminary tests
  div.setAttribute( "className", "t" );
  div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

  all = div.getElementsByTagName("*");
  a = div.getElementsByTagName("a")[ 0 ];
  a.style.cssText = "top:1px;float:left;opacity:.5";

  // Can't get basic test support
  if ( !all || !all.length ) {
    return {};
  }

  // First batch of supports tests
  select = document.createElement("select");
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName("input")[ 0 ];

  support = {
    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: ( div.firstChild.nodeType === 3 ),

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName("tbody").length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName("link").length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: ( a.getAttribute("href") === "/a" ),

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.5/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Make sure that if no value is specified for a checkbox
    // that it defaults to "on".
    // (WebKit defaults to "" instead)
    checkOn: ( input.value === "on" ),

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // Tests for enctype support on a form(#6743)
    enctype: !!document.createElement("form").enctype,

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

    // jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
    boxModel: ( document.compatMode === "CSS1Compat" ),

    // Will be defined later
    submitBubbles: true,
    changeBubbles: true,
    focusinBubbles: false,
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true,
    boxSizingReliable: true,
    pixelPosition: false
  };

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Test to see if it's possible to delete an expando from an element
  // Fails in Internet Explorer
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
    div.attachEvent( "onclick", clickFn = function() {
      // Cloning a node shouldn't copy over any
      // bound event handlers (IE does this)
      support.noCloneEvent = false;
    });
    div.cloneNode( true ).fireEvent("onclick");
    div.detachEvent( "onclick", clickFn );
  }

  // Check if a radio maintains its value
  // after being appended to the DOM
  input = document.createElement("input");
  input.value = "t";
  input.setAttribute( "type", "radio" );
  support.radioValue = input.value === "t";

  input.setAttribute( "checked", "checked" );

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "name", "t" );

  div.appendChild( input );
  fragment = document.createDocumentFragment();
  fragment.appendChild( div.lastChild );

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  fragment.removeChild( input );
  fragment.appendChild( div );

  // Technique from Juriy Zaytsev
  // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
  // We only care about the case where non-standard event systems
  // are used, namely in IE. Short-circuiting here helps us to
  // avoid an eval call (in setAttribute) which can cause CSP
  // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
  if ( div.attachEvent ) {
    for ( i in {
      submit: true,
      change: true,
      focusin: true
    }) {
      eventName = "on" + i;
      isSupported = ( eventName in div );
      if ( !isSupported ) {
        div.setAttribute( eventName, "return;" );
        isSupported = ( typeof div[ eventName ] === "function" );
      }
      support[ i + "Bubbles" ] = isSupported;
    }
  }

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, div, tds, marginDiv,
      divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
      body = document.getElementsByTagName("body")[0];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    container = document.createElement("div");
    container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
    body.insertBefore( container, body.firstChild );

    // Construct the test element
    div = document.createElement("div");
    container.appendChild( div );

    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    // (only IE 8 fails this test)
    div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName("td");
    tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Check if empty table cells still have offsetWidth/Height
    // (IE <= 8 fail this test)
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

    // Check box-sizing and margin behavior
    div.innerHTML = "";
    div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
    support.boxSizing = ( div.offsetWidth === 4 );
    support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

    // NOTE: To any future maintainer, we've window.getComputedStyle
    // because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
      support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
      support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. For more
      // info see bug #3333
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      marginDiv = document.createElement("div");
      marginDiv.style.cssText = div.style.cssText = divReset;
      marginDiv.style.marginRight = marginDiv.style.width = "0";
      div.style.width = "1px";
      div.appendChild( marginDiv );
      support.reliableMarginRight =
        !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
    }

    if ( typeof div.style.zoom !== "undefined" ) {
      // Check if natively block-level elements act like inline-block
      // elements when setting their display to 'inline' and giving
      // them layout
      // (IE < 8 does this)
      div.innerHTML = "";
      div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
      support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

      // Check if elements with layout shrink-wrap their children
      // (IE 6 does this)
      div.style.display = "block";
      div.style.overflow = "visible";
      div.innerHTML = "<div></div>";
      div.firstChild.style.width = "5px";
      support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

      container.style.zoom = 1;
    }

    // Null elements to avoid leaks in IE
    body.removeChild( container );
    container = div = tds = marginDiv = null;
  });

  // Null elements to avoid leaks in IE
  fragment.removeChild( div );
  all = a = select = opt = input = fragment = div = null;

  return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
  rmultiDash = /([A-Z])/g;

jQuery.extend({
  cache: {},

  deletedIds: [],

  // Remove at next major release (1.9/2.0)
  uuid: 0,

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, ret,
      internalKey = jQuery.expando,
      getByName = typeof name === "string",

      // We have to handle DOM nodes and JS objects differently because IE6-7
      // can't GC object references properly across the DOM-JS boundary
      isNode = elem.nodeType,

      // Only DOM nodes need the global jQuery cache; JS object data is
      // attached directly to the object so GC can occur automatically
      cache = isNode ? jQuery.cache : elem,

      // Only defining an ID for JS objects if its cache already exists allows
      // the code to shortcut on the same path as a DOM node with no cache
      id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
      return;
    }

    if ( !id ) {
      // Only DOM nodes need a new unique ID for each element since their data
      // ends up in the global cache
      if ( isNode ) {
        elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
      } else {
        id = internalKey;
      }
    }

    if ( !cache[ id ] ) {
      cache[ id ] = {};

      // Avoids exposing jQuery metadata on plain JS objects when the object
      // is serialized using JSON.stringify
      if ( !isNode ) {
        cache[ id ].toJSON = jQuery.noop;
      }
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if ( typeof name === "object" || typeof name === "function" ) {
      if ( pvt ) {
        cache[ id ] = jQuery.extend( cache[ id ], name );
      } else {
        cache[ id ].data = jQuery.extend( cache[ id ].data, name );
      }
    }

    thisCache = cache[ id ];

    // jQuery data() is stored in a separate object inside the object's internal data
    // cache in order to avoid key collisions between internal data and user-defined
    // data.
    if ( !pvt ) {
      if ( !thisCache.data ) {
        thisCache.data = {};
      }

      thisCache = thisCache.data;
    }

    if ( data !== undefined ) {
      thisCache[ jQuery.camelCase( name ) ] = data;
    }

    // Check for both converted-to-camel and non-converted data property names
    // If a data property was specified
    if ( getByName ) {

      // First Try to find as-is property data
      ret = thisCache[ name ];

      // Test for null|undefined property data
      if ( ret == null ) {

        // Try to find the camelCased property
        ret = thisCache[ jQuery.camelCase( name ) ];
      }
    } else {
      ret = thisCache;
    }

    return ret;
  },

  removeData: function( elem, name, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, i, l,

      isNode = elem.nodeType,

      // See jQuery.data for more information
      cache = isNode ? jQuery.cache : elem,
      id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if ( !cache[ id ] ) {
      return;
    }

    if ( name ) {

      thisCache = pvt ? cache[ id ] : cache[ id ].data;

      if ( thisCache ) {

        // Support array or space separated string names for data keys
        if ( !jQuery.isArray( name ) ) {

          // try the string as a key before any manipulation
          if ( name in thisCache ) {
            name = [ name ];
          } else {

            // split the camel cased version by spaces unless a key with the spaces exists
            name = jQuery.camelCase( name );
            if ( name in thisCache ) {
              name = [ name ];
            } else {
              name = name.split(" ");
            }
          }
        }

        for ( i = 0, l = name.length; i < l; i++ ) {
          delete thisCache[ name[i] ];
        }

        // If there is no data left in the cache, we want to continue
        // and let the cache object itself get destroyed
        if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
          return;
        }
      }
    }

    // See jQuery.data for more information
    if ( !pvt ) {
      delete cache[ id ].data;

      // Don't destroy the parent cache unless the internal data object
      // had been the only thing left in it
      if ( !isEmptyDataObject( cache[ id ] ) ) {
        return;
      }
    }

    // Destroy the cache
    if ( isNode ) {
      jQuery.cleanData( [ elem ], true );

    // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
    } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
      delete cache[ id ];

    // When all else fails, null
    } else {
      cache[ id ] = null;
    }
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return jQuery.data( elem, name, data, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

    // nodes accept data unless otherwise specified; rejection can be conditional
    return !noData || noData !== true && elem.getAttribute("classid") === noData;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var parts, part, attr, name, l,
      elem = this[0],
      i = 0,
      data = null;

    // Gets all values
    if ( key === undefined ) {
      if ( this.length ) {
        data = jQuery.data( elem );

        if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
          attr = elem.attributes;
          for ( l = attr.length; i < l; i++ ) {
            name = attr[i].name;

            if ( !name.indexOf( "data-" ) ) {
              name = jQuery.camelCase( name.substring(5) );

              dataAttr( elem, name, data[ name ] );
            }
          }
          jQuery._data( elem, "parsedAttrs", true );
        }
      }

      return data;
    }

    // Sets multiple values
    if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    parts = key.split( ".", 2 );
    parts[1] = parts[1] ? "." + parts[1] : "";
    part = parts[1] + "!";

    return jQuery.access( this, function( value ) {

      if ( value === undefined ) {
        data = this.triggerHandler( "getData" + part, [ parts[0] ] );

        // Try to fetch any internally stored data first
        if ( data === undefined && elem ) {
          data = jQuery.data( elem, key );
          data = dataAttr( elem, key, data );
        }

        return data === undefined && parts[1] ?
          this.data( parts[0] ) :
          data;
      }

      parts[1] = value;
      this.each(function() {
        var self = jQuery( this );

        self.triggerHandler( "setData" + part, parts );
        jQuery.data( this, key, value );
        self.triggerHandler( "changeData" + part, parts );
      });
    }, null, value, arguments.length > 1, null, false );
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {

    var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
        data === "false" ? false :
        data === "null" ? null :
        // Only convert to a number if it doesn't change the string
        +data + "" === data ? +data :
        rbrace.test( data ) ? jQuery.parseJSON( data ) :
          data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
  var name;
  for ( name in obj ) {

    // if the public data object is empty, the private is still empty
    if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
      continue;
    }
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}
jQuery.extend({
  queue: function( elem, type, data ) {
    var queue;

    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      queue = jQuery._data( elem, type );

      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !queue || jQuery.isArray(data) ) {
          queue = jQuery._data( elem, type, jQuery.makeArray(data) );
        } else {
          queue.push( data );
        }
      }
      return queue || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      startLength = queue.length,
      fn = queue.shift(),
      hooks = jQuery._queueHooks( elem, type ),
      next = function() {
        jQuery.dequeue( elem, type );
      };

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
      startLength--;
    }

    if ( fn ) {

      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift( "inprogress" );
      }

      // clear up the last queue stop function
      delete hooks.stop;
      fn.call( elem, next, hooks );
    }

    if ( !startLength && hooks ) {
      hooks.empty.fire();
    }
  },

  // not intended for public consumption - generates a queueHooks object, or returns the current one
  _queueHooks: function( elem, type ) {
    var key = type + "queueHooks";
    return jQuery._data( elem, key ) || jQuery._data( elem, key, {
      empty: jQuery.Callbacks("once memory").add(function() {
        jQuery.removeData( elem, type + "queue", true );
        jQuery.removeData( elem, key, true );
      })
    });
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    var setter = 2;

    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    if ( arguments.length < setter ) {
      return jQuery.queue( this[0], type );
    }

    return data === undefined ?
      this :
      this.each(function() {
        var queue = jQuery.queue( this, type, data );

        // ensure a hooks for this queue
        jQuery._queueHooks( this, type );

        if ( type === "fx" && queue[0] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
      var timeout = setTimeout( next, time );
      hooks.stop = function() {
        clearTimeout( timeout );
      };
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, obj ) {
    var tmp,
      count = 1,
      defer = jQuery.Deferred(),
      elements = this,
      i = this.length,
      resolve = function() {
        if ( !( --count ) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      };

    if ( typeof type !== "string" ) {
      obj = type;
      type = undefined;
    }
    type = type || "fx";

    while( i-- ) {
      tmp = jQuery._data( elements[ i ], type + "queueHooks" );
      if ( tmp && tmp.empty ) {
        count++;
        tmp.empty.add( resolve );
      }
    }
    resolve();
    return defer.promise( obj );
  }
});
var nodeHook, boolHook, fixSpecified,
  rclass = /[\t\r\n]/g,
  rreturn = /\r/g,
  rtype = /^(?:button|input)$/i,
  rfocusable = /^(?:button|input|object|select|textarea)$/i,
  rclickable = /^a(?:rea|)$/i,
  rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
  getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },

  prop: function( name, value ) {
    return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
  },

  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    var classNames, i, l, elem,
      setClass, c, cl;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).addClass( value.call(this, j, this.className) );
      });
    }

    if ( value && typeof value === "string" ) {
      classNames = value.split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 ) {
          if ( !elem.className && classNames.length === 1 ) {
            elem.className = value;

          } else {
            setClass = " " + elem.className + " ";

            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
                setClass += classNames[ c ] + " ";
              }
            }
            elem.className = jQuery.trim( setClass );
          }
        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    var removes, className, elem, c, cl, i, l;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call(this, j, this.className) );
      });
    }
    if ( (value && typeof value === "string") || value === undefined ) {
      removes = ( value || "" ).split( core_rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];
        if ( elem.nodeType === 1 && elem.className ) {

          className = (" " + elem.className + " ").replace( rclass, " " );

          // loop over each item in the removal list
          for ( c = 0, cl = removes.length; c < cl; c++ ) {
            // Remove until there is nothing to remove,
            while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
              className = className.replace( " " + removes[ c ] + " " , " " );
            }
          }
          elem.className = value ? jQuery.trim( className ) : "";
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.split( core_rspace );

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space separated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      } else if ( type === "undefined" || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // toggle whole className
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return;
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var val,
        self = jQuery(this);

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value, i, max, option,
          index = elem.selectedIndex,
          values = [],
          options = elem.options,
          one = elem.type === "select-one";

        // Nothing was selected
        if ( index < 0 ) {
          return null;
        }

        // Loop through all the selected options
        i = one ? index : 0;
        max = one ? index + 1 : options.length;
        for ( ; i < max; i++ ) {
          option = options[ i ];

          // Don't return options that are disabled or in a disabled optgroup
          if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
        if ( one && !values.length && options.length ) {
          return jQuery( options[ index ] ).val();
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  // Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
  attrFn: {},

  attr: function( elem, name, value, pass ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
      return jQuery( elem )[ name ]( value );
    }

    // Fallback to prop when attributes are not supported
    if ( typeof elem.getAttribute === "undefined" ) {
      return jQuery.prop( elem, name, value );
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // All attributes are lowercase
    // Grab necessary hook if one is defined
    if ( notxml ) {
      name = name.toLowerCase();
      hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );
        return;

      } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, value + "" );
        return value;
      }

    } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
      return ret;

    } else {

      ret = elem.getAttribute( name );

      // Non-existent attributes return null, we normalize to undefined
      return ret === null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, value ) {
    var propName, attrNames, name, isBool,
      i = 0;

    if ( value && elem.nodeType === 1 ) {

      attrNames = value.split( core_rspace );

      for ( ; i < attrNames.length; i++ ) {
        name = attrNames[ i ];

        if ( name ) {
          propName = jQuery.propFix[ name ] || name;
          isBool = rboolean.test( name );

          // See #9699 for explanation of this approach (setting first, then removal)
          // Do not do this for boolean attributes (see #10870)
          if ( !isBool ) {
            jQuery.attr( elem, name, "" );
          }
          elem.removeAttribute( getSetAttribute ? name : propName );

          // Set corresponding property to false for boolean attributes
          if ( isBool && propName in elem ) {
            elem[ propName ] = false;
          }
        }
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        // We can't allow the type property to be changed (since it causes problems in IE)
        if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
          jQuery.error( "type property can't be changed" );
        } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to it's default in case type is set after value
          // This is for element creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    },
    // Use the value property for back compat
    // Use the nodeHook for button elements in IE6/7 (#1954)
    value: {
      get: function( elem, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.get( elem, name );
        }
        return name in elem ?
          elem.value :
          null;
      },
      set: function( elem, value, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.set( elem, value, name );
        }
        // Does not return so that setAttribute is also used
        elem.value = value;
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },

  prop: function( elem, name, value ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    if ( notxml ) {
      // Fix name and attach hooks
      name = jQuery.propFix[ name ] || name;
      hooks = jQuery.propHooks[ name ];
    }

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return ( elem[ name ] = value );
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },

  propHooks: {
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  }
});

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    // Align boolean attributes with corresponding properties
    // Fall back to attribute presence where some booleans are not supported
    var attrNode,
      property = jQuery.prop( elem, name );
    return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    var propName;
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else {
      // value is true since we know at this point it's type boolean and not false
      // Set boolean attributes to the same name and set the DOM property
      propName = jQuery.propFix[ name ] || name;
      if ( propName in elem ) {
        // Only set the IDL specifically if it already exists on the element
        elem[ propName ] = true;
      }

      elem.setAttribute( name, name.toLowerCase() );
    }
    return name;
  }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

  fixSpecified = {
    name: true,
    id: true,
    coords: true
  };

  // Use this for any attribute in IE6/7
  // This fixes almost every IE6/7 issue
  nodeHook = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret;
      ret = elem.getAttributeNode( name );
      return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
        ret.value :
        undefined;
    },
    set: function( elem, value, name ) {
      // Set the existing or create a new attribute node
      var ret = elem.getAttributeNode( name );
      if ( !ret ) {
        ret = document.createAttribute( name );
        elem.setAttributeNode( ret );
      }
      return ( ret.value = value + "" );
    }
  };

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });

  // Set contenteditable to false on removals(#10429)
  // Setting to empty string throws an error as an invalid value
  jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function( elem, value, name ) {
      if ( value === "" ) {
        value = "false";
      }
      nodeHook.set( elem, value, name );
    }
  };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret === null ? undefined : ret;
      }
    });
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Normalize to lowercase since IE uppercases css property names
      return elem.style.cssText.toLowerCase() || undefined;
    },
    set: function( elem, value ) {
      return ( elem.style.cssText = value + "" );
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
      return null;
    }
  });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
  jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      }
    }
  });
});
var rformElems = /^(?:textarea|input|select)$/i,
  rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
  rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|contextmenu)|click/,
  rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
  hoverHack = function( events ) {
    return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
  };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

  add: function( elem, types, handler, data, selector ) {

    var elemData, eventHandle, events,
      t, tns, type, namespaces, handleObj,
      handleObjIn, handlers, special;

    // Don't attach events to noData or text/comment nodes (allow plain objects tho)
    if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    events = elemData.events;
    if ( !events ) {
      elemData.events = events = {};
    }
    eventHandle = elemData.handle;
    if ( !eventHandle ) {
      elemData.handle = eventHandle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
          undefined;
      };
      // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      eventHandle.elem = elem;
    }

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = jQuery.trim( hoverHack(types) ).split( " " );
    for ( t = 0; t < types.length; t++ ) {

      tns = rtypenamespace.exec( types[t] ) || [];
      type = tns[1];
      namespaces = ( tns[2] || "" ).split( "." ).sort();

      // If event changes its type, use the special event handlers for the changed type
      special = jQuery.event.special[ type ] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = ( selector ? special.delegateType : special.bindType ) || type;

      // Update special based on newly reset type
      special = jQuery.event.special[ type ] || {};

      // handleObj is passed to all event handlers
      handleObj = jQuery.extend({
        type: type,
        origType: tns[1],
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
        namespace: namespaces.join(".")
      }, handleObjIn );

      // Init the event handler queue if we're the first
      handlers = events[ type ];
      if ( !handlers ) {
        handlers = events[ type ] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
      } else {
        handlers.push( handleObj );
      }

      // Keep track of which events have ever been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  global: {},

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, selector, mappedTypes ) {

    var t, tns, type, origType, namespaces, origCount,
      j, events, special, eventType, handleObj,
      elemData = jQuery.hasData( elem ) && jQuery._data( elem );

    if ( !elemData || !(events = elemData.events) ) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
    for ( t = 0; t < types.length; t++ ) {
      tns = rtypenamespace.exec( types[t] ) || [];
      type = origType = tns[1];
      namespaces = tns[2];

      // Unbind all events (on this namespace, if provided) for the element
      if ( !type ) {
        for ( type in events ) {
          jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
        }
        continue;
      }

      special = jQuery.event.special[ type ] || {};
      type = ( selector? special.delegateType : special.bindType ) || type;
      eventType = events[ type ] || [];
      origCount = eventType.length;
      namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

      // Remove matching events
      for ( j = 0; j < eventType.length; j++ ) {
        handleObj = eventType[ j ];

        if ( ( mappedTypes || origType === handleObj.origType ) &&
           ( !handler || handler.guid === handleObj.guid ) &&
           ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
           ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
          eventType.splice( j--, 1 );

          if ( handleObj.selector ) {
            eventType.delegateCount--;
          }
          if ( special.remove ) {
            special.remove.call( elem, handleObj );
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if ( eventType.length === 0 && origCount !== eventType.length ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      delete elemData.handle;

      // removeData also checks for emptiness and clears the expando if empty
      // so use it instead of delete
      jQuery.removeData( elem, "events", true );
    }
  },

  // Events that are safe to short-circuit if no handlers are attached.
  // Native DOM events should not be added, they may have inline handlers.
  customEvent: {
    "getData": true,
    "setData": true,
    "changeData": true
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    // Don't do events on text and comment nodes
    if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
      return;
    }

    // Event object or event type
    var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
      type = event.type || event,
      namespaces = [];

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      return;
    }

    if ( type.indexOf( "!" ) >= 0 ) {
      // Exclusive events trigger only for the exact event (no namespaces)
      type = type.slice(0, -1);
      exclusive = true;
    }

    if ( type.indexOf( "." ) >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }

    if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
      // No jQuery handlers for this event type, and it can't have inline handlers
      return;
    }

    // Caller can pass in an Event, Object, or just an event type string
    event = typeof event === "object" ?
      // jQuery.Event object
      event[ jQuery.expando ] ? event :
      // Object literal
      new jQuery.Event( type, event ) :
      // Just the event type (string)
      new jQuery.Event( type );

    event.type = type;
    event.isTrigger = true;
    event.exclusive = exclusive;
    event.namespace = namespaces.join( "." );
    event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
    ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

    // Handle a global trigger
    if ( !elem ) {

      // TODO: Stop taunting the data cache; remove global events and always attach to document
      cache = jQuery.cache;
      for ( i in cache ) {
        if ( cache[ i ].events && cache[ i ].events[ type ] ) {
          jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
        }
      }
      return;
    }

    // Clean up the event in case it is being reused
    event.result = undefined;
    if ( !event.target ) {
      event.target = elem;
    }

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data != null ? jQuery.makeArray( data ) : [];
    data.unshift( event );

    // Allow special events to draw outside the lines
    special = jQuery.event.special[ type ] || {};
    if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
      return;
    }

    // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    eventPath = [[ elem, special.bindType || type ]];
    if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

      bubbleType = special.delegateType || type;
      cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
      for ( old = elem; cur; cur = cur.parentNode ) {
        eventPath.push([ cur, bubbleType ]);
        old = cur;
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      if ( old === (elem.ownerDocument || document) ) {
        eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
      }
    }

    // Fire handlers on the event path
    for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

      cur = eventPath[i][0];
      event.type = eventPath[i][1];

      handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
      if ( handle ) {
        handle.apply( cur, data );
      }
      // Note that this is a bare JS function and not a jQuery handler
      handle = ontype && cur[ ontype ];
      if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
        event.preventDefault();
      }
    }
    event.type = type;

    // If nobody prevented the default action, do it now
    if ( !onlyHandlers && !event.isDefaultPrevented() ) {

      if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction() check here because IE6/7 fails that test.
        // Don't do default actions on window, that's where global variables be (#6170)
        // IE<9 dies on focus/blur to hidden element (#1486)
        if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

          // Don't re-trigger an onFOO event when we call its FOO() method
          old = elem[ ontype ];

          if ( old ) {
            elem[ ontype ] = null;
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          jQuery.event.triggered = type;
          elem[ type ]();
          jQuery.event.triggered = undefined;

          if ( old ) {
            elem[ ontype ] = old;
          }
        }
      }
    }

    return event.result;
  },

  dispatch: function( event ) {

    // Make a writable jQuery.Event from the native event object
    event = jQuery.event.fix( event || window.event );

    var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
      handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
      delegateCount = handlers.delegateCount,
      args = core_slice.call( arguments ),
      run_all = !event.exclusive && !event.namespace,
      special = jQuery.event.special[ event.type ] || {},
      handlerQueue = [];

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      return;
    }

    // Determine handlers that should run if there are delegated events
    // Avoid non-left-click bubbling in Firefox (#3861)
    if ( delegateCount && !(event.button && event.type === "click") ) {

      for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

        // Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
        if ( cur.disabled !== true || event.type !== "click" ) {
          selMatch = {};
          matches = [];
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];
            sel = handleObj.selector;

            if ( selMatch[ sel ] === undefined ) {
              selMatch[ sel ] = handleObj.needsContext ?
                jQuery( sel, this ).index( cur ) >= 0 :
                jQuery.find( sel, this, null, [ cur ] ).length;
            }
            if ( selMatch[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, matches: matches });
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if ( handlers.length > delegateCount ) {
      handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
    }

    // Run delegates first; they may want to stop propagation beneath us
    for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
      matched = handlerQueue[ i ];
      event.currentTarget = matched.elem;

      for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
        handleObj = matched.matches[ j ];

        // Triggered event must either 1) be non-exclusive and have no namespace, or
        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
        if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

          event.data = handleObj.data;
          event.handleObj = handleObj;

          ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

          if ( ret !== undefined ) {
            event.result = ret;
            if ( ret === false ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if ( special.postDispatch ) {
      special.postDispatch.call( this, event );
    }

    return event.result;
  },

  // Includes some event props shared by KeyEvent and MouseEvent
  // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
  props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

  fixHooks: {},

  keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

      // Add which for key events
      if ( event.which == null ) {
        event.which = original.charCode != null ? original.charCode : original.keyCode;
      }

      return event;
    }
  },

  mouseHooks: {
    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
      var eventDoc, doc, body,
        button = original.button,
        fromElement = original.fromElement;

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && original.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && fromElement ) {
        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && button !== undefined ) {
        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      }

      return event;
    }
  },

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // Create a writable copy of the event object and normalize some properties
    var i, prop,
      originalEvent = event,
      fixHook = jQuery.event.fixHooks[ event.type ] || {},
      copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

    event = jQuery.Event( originalEvent );

    for ( i = copy.length; i; ) {
      prop = copy[ --i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
    if ( !event.target ) {
      event.target = originalEvent.srcElement || document;
    }

    // Target should not be a text node (#504, Safari)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
    event.metaKey = !!event.metaKey;

    return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
  },

  special: {
    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },

    focus: {
      delegateType: "focusin"
    },
    blur: {
      delegateType: "focusout"
    },

    beforeunload: {
      setup: function( data, namespaces, eventHandle ) {
        // We only want to do this special case on windows
        if ( jQuery.isWindow( this ) ) {
          this.onbeforeunload = eventHandle;
        }
      },

      teardown: function( namespaces, eventHandle ) {
        if ( this.onbeforeunload === eventHandle ) {
          this.onbeforeunload = null;
        }
      }
    }
  },

  simulate: function( type, elem, event, bubble ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    var e = jQuery.extend(
      new jQuery.Event(),
      event,
      { type: type,
        isSimulated: true,
        originalEvent: {}
      }
    );
    if ( bubble ) {
      jQuery.event.trigger( e, null, elem );
    } else {
      jQuery.event.dispatch.call( elem, e );
    }
    if ( e.isDefaultPrevented() ) {
      event.preventDefault();
    }
  }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    var name = "on" + type;

    if ( elem.detachEvent ) {

      // #8545, #7054, preventing memory leaks for custom events in IE6-8 –
      // detachEvent needed property on element, by name of that event, to properly expose it to GC
      if ( typeof elem[ name ] === "undefined" ) {
        elem[ name ] = null;
      }

      elem.detachEvent( name, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

function returnFalse() {
  return false;
}
function returnTrue() {
  return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  preventDefault: function() {
    this.isDefaultPrevented = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }

    // if preventDefault exists run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // otherwise set the returnValue property of the original event to false (IE)
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    this.isPropagationStopped = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }
    // if stopPropagation exists run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  },
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    delegateType: fix,
    bindType: fix,

    handle: function( event ) {
      var ret,
        target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj,
        selector = handleObj.selector;

      // For mousenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply( this, arguments );
        event.type = fix;
      }
      return ret;
    }
  };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Lazy-add a submit handler when a descendant form may potentially be submitted
      jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
        // Node name check avoids a VML-related crash in IE (#9807)
        var elem = e.target,
          form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
        if ( form && !jQuery._data( form, "_submit_attached" ) ) {
          jQuery.event.add( form, "submit._submit", function( event ) {
            event._submit_bubble = true;
          });
          jQuery._data( form, "_submit_attached", true );
        }
      });
      // return undefined since we don't need an event listener
    },

    postDispatch: function( event ) {
      // If form was submitted by the user, bubble the event up the tree
      if ( event._submit_bubble ) {
        delete event._submit_bubble;
        if ( this.parentNode && !event.isTrigger ) {
          jQuery.event.simulate( "submit", this.parentNode, event, true );
        }
      }
    },

    teardown: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
      jQuery.event.remove( this, "._submit" );
    }
  };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

  jQuery.event.special.change = {

    setup: function() {

      if ( rformElems.test( this.nodeName ) ) {
        // IE doesn't fire change on a check/radio until blur; trigger it on click
        // after a propertychange. Eat the blur-change in special.change.handle.
        // This still fires onchange a second time for check/radio after blur.
        if ( this.type === "checkbox" || this.type === "radio" ) {
          jQuery.event.add( this, "propertychange._change", function( event ) {
            if ( event.originalEvent.propertyName === "checked" ) {
              this._just_changed = true;
            }
          });
          jQuery.event.add( this, "click._change", function( event ) {
            if ( this._just_changed && !event.isTrigger ) {
              this._just_changed = false;
            }
            // Allow triggered, simulated change events (#11500)
            jQuery.event.simulate( "change", this, event, true );
          });
        }
        return false;
      }
      // Delegated event; lazy-add a change handler on descendant inputs
      jQuery.event.add( this, "beforeactivate._change", function( e ) {
        var elem = e.target;

        if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
          jQuery.event.add( elem, "change._change", function( event ) {
            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
              jQuery.event.simulate( "change", this.parentNode, event, true );
            }
          });
          jQuery._data( elem, "_change_attached", true );
        }
      });
    },

    handle: function( event ) {
      var elem = event.target;

      // Swallow native change events from checkbox/radio, we already triggered them above
      if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
        return event.handleObj.handler.apply( this, arguments );
      }
    },

    teardown: function() {
      jQuery.event.remove( this, "._change" );

      return !rformElems.test( this.nodeName );
    }
  };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0,
      handler = function( event ) {
        jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      };

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };
  });
}

jQuery.fn.extend({

  on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var origFn, type;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {
      // ( types-Object, selector, data )
      if ( typeof selector !== "string" ) { // && selector != null
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }
      for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
      }
      return this;
    }

    if ( data == null && fn == null ) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if ( fn == null ) {
      if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if ( fn === false ) {
      fn = returnFalse;
    } else if ( !fn ) {
      return this;
    }

    if ( one === 1 ) {
      origFn = fn;
      fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
      };
      // Use same guid so caller can remove using origFn
      fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return this.each( function() {
      jQuery.event.add( this, types, fn, data, selector );
    });
  },
  one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
  },
  off: function( types, selector, fn ) {
    var handleObj, type;
    if ( types && types.preventDefault && types.handleObj ) {
      // ( event )  dispatched jQuery.Event
      handleObj = types.handleObj;
      jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
      );
      return this;
    }
    if ( typeof types === "object" ) {
      // ( types-object [, selector] )
      for ( type in types ) {
        this.off( type, selector, types[ type ] );
      }
      return this;
    }
    if ( selector === false || typeof selector === "function" ) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }
    if ( fn === false ) {
      fn = returnFalse;
    }
    return this.each(function() {
      jQuery.event.remove( this, types, fn, selector );
    });
  },

  bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
  },
  unbind: function( types, fn ) {
    return this.off( types, null, fn );
  },

  live: function( types, data, fn ) {
    jQuery( this.context ).on( types, this.selector, data, fn );
    return this;
  },
  die: function( types, fn ) {
    jQuery( this.context ).off( types, this.selector || "**", fn );
    return this;
  },

  delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
  },
  undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },
  triggerHandler: function( type, data ) {
    if ( this[0] ) {
      return jQuery.event.trigger( type, data, this[0], true );
    }
  },

  toggle: function( fn ) {
    // Save reference to arguments for access in closure
    var args = arguments,
      guid = fn.guid || jQuery.guid++,
      i = 0,
      toggler = function( event ) {
        // Figure out which function to execute
        var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
        jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

        // Make sure that clicks stop
        event.preventDefault();

        // and execute the function
        return args[ lastToggle ].apply( this, arguments ) || false;
      };

    // link all the functions, so any of them can unbind this click handler
    toggler.guid = guid;
    while ( i < args.length ) {
      args[ i++ ].guid = guid;
    }

    return this.click( toggler );
  },

  hover: function( fnOver, fnOut ) {
    return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
  }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    if ( fn == null ) {
      fn = data;
      data = null;
    }

    return arguments.length > 0 ?
      this.on( name, null, data, fn ) :
      this.trigger( name );
  };

  if ( rkeyEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
  }

  if ( rmouseEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
  }
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
  assertGetIdNotName,
  Expr,
  getText,
  isXML,
  contains,
  compile,
  sortOrder,
  hasDuplicate,
  outermostContext,

  baseHasDuplicate = true,
  strundefined = "undefined",

  expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

  Token = String,
  document = window.document,
  docElem = document.documentElement,
  dirruns = 0,
  done = 0,
  pop = [].pop,
  push = [].push,
  slice = [].slice,
  // Use a stripped-down indexOf if a native one is unavailable
  indexOf = [].indexOf || function( elem ) {
    var i = 0,
      len = this.length;
    for ( ; i < len; i++ ) {
      if ( this[i] === elem ) {
        return i;
      }
    }
    return -1;
  },

  // Augment a function for special use by Sizzle
  markFunction = function( fn, value ) {
    fn[ expando ] = value == null || value;
    return fn;
  },

  createCache = function() {
    var cache = {},
      keys = [];

    return markFunction(function( key, value ) {
      // Only keep the most recent entries
      if ( keys.push( key ) > Expr.cacheLength ) {
        delete cache[ keys.shift() ];
      }

      return (cache[ key ] = value);
    }, cache );
  },

  classCache = createCache(),
  tokenCache = createCache(),
  compilerCache = createCache(),

  // Regex

  // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
  whitespace = "[\\x20\\t\\r\\n\\f]",
  // http://www.w3.org/TR/css3-syntax/#characters
  characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

  // Loosely modeled on CSS identifier characters
  // An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
  // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
  identifier = characterEncoding.replace( "w", "w#" ),

  // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
  operators = "([*^$|!~]?=)",
  attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
    "*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

  // Prefer arguments not in parens/brackets,
  //   then attribute selectors and non-pseudos (denoted by :),
  //   then anything else
  // These preferences are here to reduce the number of selectors
  //   needing tokenize in the PSEUDO preFilter
  pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

  // For matchExpr.POS and matchExpr.needsContext
  pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

  // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
  rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

  rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
  rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
  rpseudo = new RegExp( pseudos ),

  // Easily-parseable/retrievable ID or TAG or CLASS selectors
  rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

  rnot = /^:not/,
  rsibling = /[\x20\t\r\n\f]*[+~]/,
  rendsWithNot = /:not\($/,

  rheader = /h\d/i,
  rinputs = /input|select|textarea|button/i,

  rbackslash = /\\(?!\\)/g,

  matchExpr = {
    "ID": new RegExp( "^#(" + characterEncoding + ")" ),
    "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
    "NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
    "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
    "ATTR": new RegExp( "^" + attributes ),
    "PSEUDO": new RegExp( "^" + pseudos ),
    "POS": new RegExp( pos, "i" ),
    "CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
      "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
      "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    // For use in libraries implementing .is()
    "needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
  },

  // Support

  // Used for testing something on an element
  assert = function( fn ) {
    var div = document.createElement("div");

    try {
      return fn( div );
    } catch (e) {
      return false;
    } finally {
      // release memory in IE
      div = null;
    }
  },

  // Check if getElementsByTagName("*") returns only elements
  assertTagNameNoComments = assert(function( div ) {
    div.appendChild( document.createComment("") );
    return !div.getElementsByTagName("*").length;
  }),

  // Check if getAttribute returns normalized href attributes
  assertHrefNotNormalized = assert(function( div ) {
    div.innerHTML = "<a href='#'></a>";
    return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
      div.firstChild.getAttribute("href") === "#";
  }),

  // Check if attributes should be retrieved by attribute nodes
  assertAttributes = assert(function( div ) {
    div.innerHTML = "<select></select>";
    var type = typeof div.lastChild.getAttribute("multiple");
    // IE8 returns a string for some attributes even when not present
    return type !== "boolean" && type !== "string";
  }),

  // Check if getElementsByClassName can be trusted
  assertUsableClassName = assert(function( div ) {
    // Opera can't find a second classname (in 9.6)
    div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
    if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
      return false;
    }

    // Safari 3.2 caches class attributes and doesn't catch changes
    div.lastChild.className = "e";
    return div.getElementsByClassName("e").length === 2;
  }),

  // Check if getElementById returns elements by name
  // Check if getElementsByName privileges form controls or returns elements by ID
  assertUsableName = assert(function( div ) {
    // Inject content
    div.id = expando + 0;
    div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
    docElem.insertBefore( div, docElem.firstChild );

    // Test
    var pass = document.getElementsByName &&
      // buggy browsers will return fewer than the correct 2
      document.getElementsByName( expando ).length === 2 +
      // buggy browsers will return more than the correct 0
      document.getElementsByName( expando + 0 ).length;
    assertGetIdNotName = !document.getElementById( expando );

    // Cleanup
    docElem.removeChild( div );

    return pass;
  });

// If slice is not available, provide a backup
try {
  slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
  slice = function( i ) {
    var elem,
      results = [];
    for ( ; (elem = this[i]); i++ ) {
      results.push( elem );
    }
    return results;
  };
}

function Sizzle( selector, context, results, seed ) {
  results = results || [];
  context = context || document;
  var match, elem, xml, m,
    nodeType = context.nodeType;

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  if ( nodeType !== 1 && nodeType !== 9 ) {
    return [];
  }

  xml = isXML( context );

  if ( !xml && !seed ) {
    if ( (match = rquickExpr.exec( selector )) ) {
      // Speed-up: Sizzle("#ID")
      if ( (m = match[1]) ) {
        if ( nodeType === 9 ) {
          elem = context.getElementById( m );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE, Opera, and Webkit return items
            // by name instead of ID
            if ( elem.id === m ) {
              results.push( elem );
              return results;
            }
          } else {
            return results;
          }
        } else {
          // Context is not a document
          if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
            contains( context, elem ) && elem.id === m ) {
            results.push( elem );
            return results;
          }
        }

      // Speed-up: Sizzle("TAG")
      } else if ( match[2] ) {
        push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
        return results;

      // Speed-up: Sizzle(".CLASS")
      } else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
        push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
        return results;
      }
    }
  }

  // All others
  return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
  return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
  return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return name === "input" && elem.type === type;
  };
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
  return function( elem ) {
    var name = elem.nodeName.toLowerCase();
    return (name === "input" || name === "button") && elem.type === type;
  };
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
  return markFunction(function( argument ) {
    argument = +argument;
    return markFunction(function( seed, matches ) {
      var j,
        matchIndexes = fn( [], seed.length, argument ),
        i = matchIndexes.length;

      // Match elements found at the specified indexes
      while ( i-- ) {
        if ( seed[ (j = matchIndexes[i]) ] ) {
          seed[j] = !(matches[j] = seed[j]);
        }
      }
    });
  });
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
  var node,
    ret = "",
    i = 0,
    nodeType = elem.nodeType;

  if ( nodeType ) {
    if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent for elements
      // innerText usage removed for consistency of new lines (see #11153)
      if ( typeof elem.textContent === "string" ) {
        return elem.textContent;
      } else {
        // Traverse its children
        for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
          ret += getText( elem );
        }
      }
    } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
    }
    // Do not include comment or processing instruction nodes
  } else {

    // If no nodeType, this is expected to be an array
    for ( ; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      ret += getText( node );
    }
  }
  return ret;
};

isXML = Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = elem && (elem.ownerDocument || elem).documentElement;
  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
  function( a, b ) {
    var adown = a.nodeType === 9 ? a.documentElement : a,
      bup = b && b.parentNode;
    return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
  } :
  docElem.compareDocumentPosition ?
  function( a, b ) {
    return b && !!( a.compareDocumentPosition( b ) & 16 );
  } :
  function( a, b ) {
    while ( (b = b.parentNode) ) {
      if ( b === a ) {
        return true;
      }
    }
    return false;
  };

Sizzle.attr = function( elem, name ) {
  var val,
    xml = isXML( elem );

  if ( !xml ) {
    name = name.toLowerCase();
  }
  if ( (val = Expr.attrHandle[ name ]) ) {
    return val( elem );
  }
  if ( xml || assertAttributes ) {
    return elem.getAttribute( name );
  }
  val = elem.getAttributeNode( name );
  return val ?
    typeof elem[ name ] === "boolean" ?
      elem[ name ] ? name : null :
      val.specified ? val.value : null :
    null;
};

Expr = Sizzle.selectors = {

  // Can be adjusted by the user
  cacheLength: 50,

  createPseudo: markFunction,

  match: matchExpr,

  // IE6/7 return a modified href
  attrHandle: assertHrefNotNormalized ?
    {} :
    {
      "href": function( elem ) {
        return elem.getAttribute( "href", 2 );
      },
      "type": function( elem ) {
        return elem.getAttribute("type");
      }
    },

  find: {
    "ID": assertGetIdNotName ?
      function( id, context, xml ) {
        if ( typeof context.getElementById !== strundefined && !xml ) {
          var m = context.getElementById( id );
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          return m && m.parentNode ? [m] : [];
        }
      } :
      function( id, context, xml ) {
        if ( typeof context.getElementById !== strundefined && !xml ) {
          var m = context.getElementById( id );

          return m ?
            m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
              [m] :
              undefined :
            [];
        }
      },

    "TAG": assertTagNameNoComments ?
      function( tag, context ) {
        if ( typeof context.getElementsByTagName !== strundefined ) {
          return context.getElementsByTagName( tag );
        }
      } :
      function( tag, context ) {
        var results = context.getElementsByTagName( tag );

        // Filter out possible comments
        if ( tag === "*" ) {
          var elem,
            tmp = [],
            i = 0;

          for ( ; (elem = results[i]); i++ ) {
            if ( elem.nodeType === 1 ) {
              tmp.push( elem );
            }
          }

          return tmp;
        }
        return results;
      },

    "NAME": assertUsableName && function( tag, context ) {
      if ( typeof context.getElementsByName !== strundefined ) {
        return context.getElementsByName( name );
      }
    },

    "CLASS": assertUsableClassName && function( className, context, xml ) {
      if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
        return context.getElementsByClassName( className );
      }
    }
  },

  relative: {
    ">": { dir: "parentNode", first: true },
    " ": { dir: "parentNode" },
    "+": { dir: "previousSibling", first: true },
    "~": { dir: "previousSibling" }
  },

  preFilter: {
    "ATTR": function( match ) {
      match[1] = match[1].replace( rbackslash, "" );

      // Move the given value to match[3] whether quoted or unquoted
      match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

      if ( match[2] === "~=" ) {
        match[3] = " " + match[3] + " ";
      }

      return match.slice( 0, 4 );
    },

    "CHILD": function( match ) {
      /* matches from matchExpr["CHILD"]
        1 type (only|nth|...)
        2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
        3 xn-component of xn+y argument ([+-]?\d*n|)
        4 sign of xn-component
        5 x of xn-component
        6 sign of y-component
        7 y of y-component
      */
      match[1] = match[1].toLowerCase();

      if ( match[1] === "nth" ) {
        // nth-child requires argument
        if ( !match[2] ) {
          Sizzle.error( match[0] );
        }

        // numeric x and y parameters for Expr.filter.CHILD
        // remember that false/true cast respectively to 0/1
        match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
        match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

      // other types prohibit arguments
      } else if ( match[2] ) {
        Sizzle.error( match[0] );
      }

      return match;
    },

    "PSEUDO": function( match ) {
      var unquoted, excess;
      if ( matchExpr["CHILD"].test( match[0] ) ) {
        return null;
      }

      if ( match[3] ) {
        match[2] = match[3];
      } else if ( (unquoted = match[4]) ) {
        // Only check arguments that contain a pseudo
        if ( rpseudo.test(unquoted) &&
          // Get excess from tokenize (recursively)
          (excess = tokenize( unquoted, true )) &&
          // advance to the next closing parenthesis
          (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

          // excess is a negative index
          unquoted = unquoted.slice( 0, excess );
          match[0] = match[0].slice( 0, excess );
        }
        match[2] = unquoted;
      }

      // Return only captures needed by the pseudo filter method (type and argument)
      return match.slice( 0, 3 );
    }
  },

  filter: {
    "ID": assertGetIdNotName ?
      function( id ) {
        id = id.replace( rbackslash, "" );
        return function( elem ) {
          return elem.getAttribute("id") === id;
        };
      } :
      function( id ) {
        id = id.replace( rbackslash, "" );
        return function( elem ) {
          var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
          return node && node.value === id;
        };
      },

    "TAG": function( nodeName ) {
      if ( nodeName === "*" ) {
        return function() { return true; };
      }
      nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

      return function( elem ) {
        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
      };
    },

    "CLASS": function( className ) {
      var pattern = classCache[ expando ][ className ];
      if ( !pattern ) {
        pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
      }
      return function( elem ) {
        return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
      };
    },

    "ATTR": function( name, operator, check ) {
      return function( elem, context ) {
        var result = Sizzle.attr( elem, name );

        if ( result == null ) {
          return operator === "!=";
        }
        if ( !operator ) {
          return true;
        }

        result += "";

        return operator === "=" ? result === check :
          operator === "!=" ? result !== check :
          operator === "^=" ? check && result.indexOf( check ) === 0 :
          operator === "*=" ? check && result.indexOf( check ) > -1 :
          operator === "$=" ? check && result.substr( result.length - check.length ) === check :
          operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
          operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
          false;
      };
    },

    "CHILD": function( type, argument, first, last ) {

      if ( type === "nth" ) {
        return function( elem ) {
          var node, diff,
            parent = elem.parentNode;

          if ( first === 1 && last === 0 ) {
            return true;
          }

          if ( parent ) {
            diff = 0;
            for ( node = parent.firstChild; node; node = node.nextSibling ) {
              if ( node.nodeType === 1 ) {
                diff++;
                if ( elem === node ) {
                  break;
                }
              }
            }
          }

          // Incorporate the offset (or cast to NaN), then check against cycle size
          diff -= last;
          return diff === first || ( diff % first === 0 && diff / first >= 0 );
        };
      }

      return function( elem ) {
        var node = elem;

        switch ( type ) {
          case "only":
          case "first":
            while ( (node = node.previousSibling) ) {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            if ( type === "first" ) {
              return true;
            }

            node = elem;

            /* falls through */
          case "last":
            while ( (node = node.nextSibling) ) {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            return true;
        }
      };
    },

    "PSEUDO": function( pseudo, argument ) {
      // pseudo-class names are case-insensitive
      // http://www.w3.org/TR/selectors/#pseudo-classes
      // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
      // Remember that setFilters inherits from pseudos
      var args,
        fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
          Sizzle.error( "unsupported pseudo: " + pseudo );

      // The user may use createPseudo to indicate that
      // arguments are needed to create the filter function
      // just as Sizzle does
      if ( fn[ expando ] ) {
        return fn( argument );
      }

      // But maintain support for old signatures
      if ( fn.length > 1 ) {
        args = [ pseudo, pseudo, "", argument ];
        return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
          markFunction(function( seed, matches ) {
            var idx,
              matched = fn( seed, argument ),
              i = matched.length;
            while ( i-- ) {
              idx = indexOf.call( seed, matched[i] );
              seed[ idx ] = !( matches[ idx ] = matched[i] );
            }
          }) :
          function( elem ) {
            return fn( elem, 0, args );
          };
      }

      return fn;
    }
  },

  pseudos: {
    "not": markFunction(function( selector ) {
      // Trim the selector passed to compile
      // to avoid treating leading and trailing
      // spaces as combinators
      var input = [],
        results = [],
        matcher = compile( selector.replace( rtrim, "$1" ) );

      return matcher[ expando ] ?
        markFunction(function( seed, matches, context, xml ) {
          var elem,
            unmatched = matcher( seed, null, xml, [] ),
            i = seed.length;

          // Match elements unmatched by `matcher`
          while ( i-- ) {
            if ( (elem = unmatched[i]) ) {
              seed[i] = !(matches[i] = elem);
            }
          }
        }) :
        function( elem, context, xml ) {
          input[0] = elem;
          matcher( input, null, xml, results );
          return !results.pop();
        };
    }),

    "has": markFunction(function( selector ) {
      return function( elem ) {
        return Sizzle( selector, elem ).length > 0;
      };
    }),

    "contains": markFunction(function( text ) {
      return function( elem ) {
        return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
      };
    }),

    "enabled": function( elem ) {
      return elem.disabled === false;
    },

    "disabled": function( elem ) {
      return elem.disabled === true;
    },

    "checked": function( elem ) {
      // In CSS3, :checked should return both checked and selected elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      var nodeName = elem.nodeName.toLowerCase();
      return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
    },

    "selected": function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    "parent": function( elem ) {
      return !Expr.pseudos["empty"]( elem );
    },

    "empty": function( elem ) {
      // http://www.w3.org/TR/selectors/#empty-pseudo
      // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
      //   not comment, processing instructions, or others
      // Thanks to Diego Perini for the nodeName shortcut
      //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
      var nodeType;
      elem = elem.firstChild;
      while ( elem ) {
        if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
          return false;
        }
        elem = elem.nextSibling;
      }
      return true;
    },

    "header": function( elem ) {
      return rheader.test( elem.nodeName );
    },

    "text": function( elem ) {
      var type, attr;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" &&
        (type = elem.type) === "text" &&
        ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
    },

    // Input types
    "radio": createInputPseudo("radio"),
    "checkbox": createInputPseudo("checkbox"),
    "file": createInputPseudo("file"),
    "password": createInputPseudo("password"),
    "image": createInputPseudo("image"),

    "submit": createButtonPseudo("submit"),
    "reset": createButtonPseudo("reset"),

    "button": function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && elem.type === "button" || name === "button";
    },

    "input": function( elem ) {
      return rinputs.test( elem.nodeName );
    },

    "focus": function( elem ) {
      var doc = elem.ownerDocument;
      return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
    },

    "active": function( elem ) {
      return elem === elem.ownerDocument.activeElement;
    },

    // Positional types
    "first": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ 0 ];
    }),

    "last": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ length - 1 ];
    }),

    "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
      return [ argument < 0 ? argument + length : argument ];
    }),

    "even": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = 0; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = 1; i < length; i += 2 ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    }),

    "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
      for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
        matchIndexes.push( i );
      }
      return matchIndexes;
    })
  }
};

function siblingCheck( a, b, ret ) {
  if ( a === b ) {
    return ret;
  }

  var cur = a.nextSibling;

  while ( cur ) {
    if ( cur === b ) {
      return -1;
    }

    cur = cur.nextSibling;
  }

  return 1;
}

sortOrder = docElem.compareDocumentPosition ?
  function( a, b ) {
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
      a.compareDocumentPosition :
      a.compareDocumentPosition(b) & 4
    ) ? -1 : 1;
  } :
  function( a, b ) {
    // The nodes are identical, we can exit early
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Fallback to using sourceIndex (in IE) if it's available on both nodes
    } else if ( a.sourceIndex && b.sourceIndex ) {
      return a.sourceIndex - b.sourceIndex;
    }

    var al, bl,
      ap = [],
      bp = [],
      aup = a.parentNode,
      bup = b.parentNode,
      cur = aup;

    // If the nodes are siblings (or identical) we can do a quick check
    if ( aup === bup ) {
      return siblingCheck( a, b );

    // If no parents were found then the nodes are disconnected
    } else if ( !aup ) {
      return -1;

    } else if ( !bup ) {
      return 1;
    }

    // Otherwise they're somewhere else in the tree so we need
    // to build up a full list of the parentNodes for comparison
    while ( cur ) {
      ap.unshift( cur );
      cur = cur.parentNode;
    }

    cur = bup;

    while ( cur ) {
      bp.unshift( cur );
      cur = cur.parentNode;
    }

    al = ap.length;
    bl = bp.length;

    // Start walking down the tree looking for a discrepancy
    for ( var i = 0; i < al && i < bl; i++ ) {
      if ( ap[i] !== bp[i] ) {
        return siblingCheck( ap[i], bp[i] );
      }
    }

    // We ended someplace up the tree so do a sibling check
    return i === al ?
      siblingCheck( a, bp[i], -1 ) :
      siblingCheck( ap[i], b, 1 );
  };

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
  var elem,
    i = 1;

  hasDuplicate = baseHasDuplicate;
  results.sort( sortOrder );

  if ( hasDuplicate ) {
    for ( ; (elem = results[i]); i++ ) {
      if ( elem === results[ i - 1 ] ) {
        results.splice( i--, 1 );
      }
    }
  }

  return results;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
  var matched, match, tokens, type, soFar, groups, preFilters,
    cached = tokenCache[ expando ][ selector ];

  if ( cached ) {
    return parseOnly ? 0 : cached.slice( 0 );
  }

  soFar = selector;
  groups = [];
  preFilters = Expr.preFilter;

  while ( soFar ) {

    // Comma and first run
    if ( !matched || (match = rcomma.exec( soFar )) ) {
      if ( match ) {
        soFar = soFar.slice( match[0].length );
      }
      groups.push( tokens = [] );
    }

    matched = false;

    // Combinators
    if ( (match = rcombinators.exec( soFar )) ) {
      tokens.push( matched = new Token( match.shift() ) );
      soFar = soFar.slice( matched.length );

      // Cast descendant combinators to space
      matched.type = match[0].replace( rtrim, " " );
    }

    // Filters
    for ( type in Expr.filter ) {
      if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
        // The last two arguments here are (context, xml) for backCompat
        (match = preFilters[ type ]( match, document, true ))) ) {

        tokens.push( matched = new Token( match.shift() ) );
        soFar = soFar.slice( matched.length );
        matched.type = type;
        matched.matches = match;
      }
    }

    if ( !matched ) {
      break;
    }
  }

  // Return the length of the invalid excess
  // if we're just parsing
  // Otherwise, throw an error or return tokens
  return parseOnly ?
    soFar.length :
    soFar ?
      Sizzle.error( selector ) :
      // Cache the tokens
      tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
  var dir = combinator.dir,
    checkNonElements = base && combinator.dir === "parentNode",
    doneName = done++;

  return combinator.first ?
    // Check against closest ancestor/preceding element
    function( elem, context, xml ) {
      while ( (elem = elem[ dir ]) ) {
        if ( checkNonElements || elem.nodeType === 1  ) {
          return matcher( elem, context, xml );
        }
      }
    } :

    // Check against all ancestor/preceding elements
    function( elem, context, xml ) {
      // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
      if ( !xml ) {
        var cache,
          dirkey = dirruns + " " + doneName + " ",
          cachedkey = dirkey + cachedruns;
        while ( (elem = elem[ dir ]) ) {
          if ( checkNonElements || elem.nodeType === 1 ) {
            if ( (cache = elem[ expando ]) === cachedkey ) {
              return elem.sizset;
            } else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
              if ( elem.sizset ) {
                return elem;
              }
            } else {
              elem[ expando ] = cachedkey;
              if ( matcher( elem, context, xml ) ) {
                elem.sizset = true;
                return elem;
              }
              elem.sizset = false;
            }
          }
        }
      } else {
        while ( (elem = elem[ dir ]) ) {
          if ( checkNonElements || elem.nodeType === 1 ) {
            if ( matcher( elem, context, xml ) ) {
              return elem;
            }
          }
        }
      }
    };
}

function elementMatcher( matchers ) {
  return matchers.length > 1 ?
    function( elem, context, xml ) {
      var i = matchers.length;
      while ( i-- ) {
        if ( !matchers[i]( elem, context, xml ) ) {
          return false;
        }
      }
      return true;
    } :
    matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
  var elem,
    newUnmatched = [],
    i = 0,
    len = unmatched.length,
    mapped = map != null;

  for ( ; i < len; i++ ) {
    if ( (elem = unmatched[i]) ) {
      if ( !filter || filter( elem, context, xml ) ) {
        newUnmatched.push( elem );
        if ( mapped ) {
          map.push( i );
        }
      }
    }
  }

  return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
  if ( postFilter && !postFilter[ expando ] ) {
    postFilter = setMatcher( postFilter );
  }
  if ( postFinder && !postFinder[ expando ] ) {
    postFinder = setMatcher( postFinder, postSelector );
  }
  return markFunction(function( seed, results, context, xml ) {
    // Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
    if ( seed && postFinder ) {
      return;
    }

    var i, elem, postFilterIn,
      preMap = [],
      postMap = [],
      preexisting = results.length,

      // Get initial elements from seed or context
      elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

      // Prefilter to get matcher input, preserving a map for seed-results synchronization
      matcherIn = preFilter && ( seed || !selector ) ?
        condense( elems, preMap, preFilter, context, xml ) :
        elems,

      matcherOut = matcher ?
        // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
        postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
        matcherIn;

    // Find primary matches
    if ( matcher ) {
      matcher( matcherIn, matcherOut, context, xml );
    }

    // Apply postFilter
    if ( postFilter ) {
      postFilterIn = condense( matcherOut, postMap );
      postFilter( postFilterIn, [], context, xml );

      // Un-match failing elements by moving them back to matcherIn
      i = postFilterIn.length;
      while ( i-- ) {
        if ( (elem = postFilterIn[i]) ) {
          matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
        }
      }
    }

    // Keep seed and results synchronized
    if ( seed ) {
      // Ignore postFinder because it can't coexist with seed
      i = preFilter && matcherOut.length;
      while ( i-- ) {
        if ( (elem = matcherOut[i]) ) {
          seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
        }
      }
    } else {
      matcherOut = condense(
        matcherOut === results ?
          matcherOut.splice( preexisting, matcherOut.length ) :
          matcherOut
      );
      if ( postFinder ) {
        postFinder( null, results, matcherOut, xml );
      } else {
        push.apply( results, matcherOut );
      }
    }
  });
}

function matcherFromTokens( tokens ) {
  var checkContext, matcher, j,
    len = tokens.length,
    leadingRelative = Expr.relative[ tokens[0].type ],
    implicitRelative = leadingRelative || Expr.relative[" "],
    i = leadingRelative ? 1 : 0,

    // The foundational matcher ensures that elements are reachable from top-level context(s)
    matchContext = addCombinator( function( elem ) {
      return elem === checkContext;
    }, implicitRelative, true ),
    matchAnyContext = addCombinator( function( elem ) {
      return indexOf.call( checkContext, elem ) > -1;
    }, implicitRelative, true ),
    matchers = [ function( elem, context, xml ) {
      return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
        (checkContext = context).nodeType ?
          matchContext( elem, context, xml ) :
          matchAnyContext( elem, context, xml ) );
    } ];

  for ( ; i < len; i++ ) {
    if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
      matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    } else {
      // The concatenated values are (context, xml) for backCompat
      matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

      // Return special upon seeing a positional matcher
      if ( matcher[ expando ] ) {
        // Find the next relative operator (if any) for proper handling
        j = ++i;
        for ( ; j < len; j++ ) {
          if ( Expr.relative[ tokens[j].type ] ) {
            break;
          }
        }
        return setMatcher(
          i > 1 && elementMatcher( matchers ),
          i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
          matcher,
          i < j && matcherFromTokens( tokens.slice( i, j ) ),
          j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
          j < len && tokens.join("")
        );
      }
      matchers.push( matcher );
    }
  }

  return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
  var bySet = setMatchers.length > 0,
    byElement = elementMatchers.length > 0,
    superMatcher = function( seed, context, xml, results, expandContext ) {
      var elem, j, matcher,
        setMatched = [],
        matchedCount = 0,
        i = "0",
        unmatched = seed && [],
        outermost = expandContext != null,
        contextBackup = outermostContext,
        // We must always have either seed elements or context
        elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
        // Nested matchers should use non-integer dirruns
        dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

      if ( outermost ) {
        outermostContext = context !== document && context;
        cachedruns = superMatcher.el;
      }

      // Add elements passing elementMatchers directly to results
      for ( ; (elem = elems[i]) != null; i++ ) {
        if ( byElement && elem ) {
          for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
            if ( matcher( elem, context, xml ) ) {
              results.push( elem );
              break;
            }
          }
          if ( outermost ) {
            dirruns = dirrunsUnique;
            cachedruns = ++superMatcher.el;
          }
        }

        // Track unmatched elements for set filters
        if ( bySet ) {
          // They will have gone through all possible matchers
          if ( (elem = !matcher && elem) ) {
            matchedCount--;
          }

          // Lengthen the array for every element, matched or not
          if ( seed ) {
            unmatched.push( elem );
          }
        }
      }

      // Apply set filters to unmatched elements
      matchedCount += i;
      if ( bySet && i !== matchedCount ) {
        for ( j = 0; (matcher = setMatchers[j]); j++ ) {
          matcher( unmatched, setMatched, context, xml );
        }

        if ( seed ) {
          // Reintegrate element matches to eliminate the need for sorting
          if ( matchedCount > 0 ) {
            while ( i-- ) {
              if ( !(unmatched[i] || setMatched[i]) ) {
                setMatched[i] = pop.call( results );
              }
            }
          }

          // Discard index placeholder values to get only actual matches
          setMatched = condense( setMatched );
        }

        // Add matches to results
        push.apply( results, setMatched );

        // Seedless set matches succeeding multiple successful matchers stipulate sorting
        if ( outermost && !seed && setMatched.length > 0 &&
          ( matchedCount + setMatchers.length ) > 1 ) {

          Sizzle.uniqueSort( results );
        }
      }

      // Override manipulation of globals by nested matchers
      if ( outermost ) {
        dirruns = dirrunsUnique;
        outermostContext = contextBackup;
      }

      return unmatched;
    };

  superMatcher.el = 0;
  return bySet ?
    markFunction( superMatcher ) :
    superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
  var i,
    setMatchers = [],
    elementMatchers = [],
    cached = compilerCache[ expando ][ selector ];

  if ( !cached ) {
    // Generate a function of recursive functions that can be used to check each element
    if ( !group ) {
      group = tokenize( selector );
    }
    i = group.length;
    while ( i-- ) {
      cached = matcherFromTokens( group[i] );
      if ( cached[ expando ] ) {
        setMatchers.push( cached );
      } else {
        elementMatchers.push( cached );
      }
    }

    // Cache the compiled function
    cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
  }
  return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
  var i = 0,
    len = contexts.length;
  for ( ; i < len; i++ ) {
    Sizzle( selector, contexts[i], results, seed );
  }
  return results;
}

function select( selector, context, results, seed, xml ) {
  var i, tokens, token, type, find,
    match = tokenize( selector ),
    j = match.length;

  if ( !seed ) {
    // Try to minimize operations if there is only one group
    if ( match.length === 1 ) {

      // Take a shortcut and set the context if the root selector is an ID
      tokens = match[0] = match[0].slice( 0 );
      if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
          context.nodeType === 9 && !xml &&
          Expr.relative[ tokens[1].type ] ) {

        context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
        if ( !context ) {
          return results;
        }

        selector = selector.slice( tokens.shift().length );
      }

      // Fetch a seed set for right-to-left matching
      for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
        token = tokens[i];

        // Abort if we hit a combinator
        if ( Expr.relative[ (type = token.type) ] ) {
          break;
        }
        if ( (find = Expr.find[ type ]) ) {
          // Search, expanding context for leading sibling combinators
          if ( (seed = find(
            token.matches[0].replace( rbackslash, "" ),
            rsibling.test( tokens[0].type ) && context.parentNode || context,
            xml
          )) ) {

            // If seed is empty or no tokens remain, we can return early
            tokens.splice( i, 1 );
            selector = seed.length && tokens.join("");
            if ( !selector ) {
              push.apply( results, slice.call( seed, 0 ) );
              return results;
            }

            break;
          }
        }
      }
    }
  }

  // Compile and execute a filtering function
  // Provide `match` to avoid retokenization if we modified the selector above
  compile( selector, match )(
    seed,
    context,
    xml,
    results,
    rsibling.test( selector )
  );
  return results;
}

if ( document.querySelectorAll ) {
  (function() {
    var disconnectedMatch,
      oldSelect = select,
      rescape = /'|\\/g,
      rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

      // qSa(:focus) reports false when true (Chrome 21),
      // A support test would require too much code (would include document ready)
      rbuggyQSA = [":focus"],

      // matchesSelector(:focus) reports false when true (Chrome 21),
      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
      // A support test would require too much code (would include document ready)
      // just skip matchesSelector for :active
      rbuggyMatches = [ ":active", ":focus" ],
      matches = docElem.matchesSelector ||
        docElem.mozMatchesSelector ||
        docElem.webkitMatchesSelector ||
        docElem.oMatchesSelector ||
        docElem.msMatchesSelector;

    // Build QSA regex
    // Regex strategy adopted from Diego Perini
    assert(function( div ) {
      // Select is set to empty string on purpose
      // This is to test IE's treatment of not explictly
      // setting a boolean content attribute,
      // since its presence should be enough
      // http://bugs.jquery.com/ticket/12359
      div.innerHTML = "<select><option selected=''></option></select>";

      // IE8 - Some boolean attributes are not treated correctly
      if ( !div.querySelectorAll("[selected]").length ) {
        rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
      }

      // Webkit/Opera - :checked should return selected option elements
      // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
      // IE8 throws error here (do not put tests after this one)
      if ( !div.querySelectorAll(":checked").length ) {
        rbuggyQSA.push(":checked");
      }
    });

    assert(function( div ) {

      // Opera 10-12/IE9 - ^= $= *= and empty values
      // Should not select anything
      div.innerHTML = "<p test=''></p>";
      if ( div.querySelectorAll("[test^='']").length ) {
        rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
      }

      // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
      // IE8 throws error here (do not put tests after this one)
      div.innerHTML = "<input type='hidden'/>";
      if ( !div.querySelectorAll(":enabled").length ) {
        rbuggyQSA.push(":enabled", ":disabled");
      }
    });

    // rbuggyQSA always contains :focus, so no need for a length check
    rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

    select = function( selector, context, results, seed, xml ) {
      // Only use querySelectorAll when not filtering,
      // when this is not xml,
      // and when no QSA bugs apply
      if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
        var groups, i,
          old = true,
          nid = expando,
          newContext = context,
          newSelector = context.nodeType === 9 && selector;

        // qSA works strangely on Element-rooted queries
        // We can work around this by specifying an extra ID on the root
        // and working up from there (Thanks to Andrew Dupont for the technique)
        // IE 8 doesn't work on object elements
        if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
          groups = tokenize( selector );

          if ( (old = context.getAttribute("id")) ) {
            nid = old.replace( rescape, "\\$&" );
          } else {
            context.setAttribute( "id", nid );
          }
          nid = "[id='" + nid + "'] ";

          i = groups.length;
          while ( i-- ) {
            groups[i] = nid + groups[i].join("");
          }
          newContext = rsibling.test( selector ) && context.parentNode || context;
          newSelector = groups.join(",");
        }

        if ( newSelector ) {
          try {
            push.apply( results, slice.call( newContext.querySelectorAll(
              newSelector
            ), 0 ) );
            return results;
          } catch(qsaError) {
          } finally {
            if ( !old ) {
              context.removeAttribute("id");
            }
          }
        }
      }

      return oldSelect( selector, context, results, seed, xml );
    };

    if ( matches ) {
      assert(function( div ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9)
        disconnectedMatch = matches.call( div, "div" );

        // This should fail with an exception
        // Gecko does not error, returns false instead
        try {
          matches.call( div, "[test!='']:sizzle" );
          rbuggyMatches.push( "!=", pseudos );
        } catch ( e ) {}
      });

      // rbuggyMatches always contains :active and :focus, so no need for a length check
      rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

      Sizzle.matchesSelector = function( elem, expr ) {
        // Make sure that attribute selectors are quoted
        expr = expr.replace( rattributeQuotes, "='$1']" );

        // rbuggyMatches always contains :active, so no need for an existence check
        if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
          try {
            var ret = matches.call( elem, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || disconnectedMatch ||
                // As well, disconnected nodes are said to be in a document
                // fragment in IE 9
                elem.document && elem.document.nodeType !== 11 ) {
              return ret;
            }
          } catch(e) {}
        }

        return Sizzle( expr, null, null, [ elem ] ).length > 0;
      };
    }
  })();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
  rparentsprev = /^(?:parents|prev(?:Until|All))/,
  isSimple = /^.[^:#\[\.,]*$/,
  rneedsContext = jQuery.expr.match.needsContext,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var i, l, length, n, r, ret,
      self = this;

    if ( typeof selector !== "string" ) {
      return jQuery( selector ).filter(function() {
        for ( i = 0, l = self.length; i < l; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      });
    }

    ret = this.pushStack( "", "find", selector );

    for ( i = 0, l = this.length; i < l; i++ ) {
      length = ret.length;
      jQuery.find( selector, this[i], ret );

      if ( i > 0 ) {
        // Make sure that the results are unique
        for ( n = length; n < ret.length; n++ ) {
          for ( r = 0; r < length; r++ ) {
            if ( ret[r] === ret[n] ) {
              ret.splice(n--, 1);
              break;
            }
          }
        }
      }
    }

    return ret;
  },

  has: function( target ) {
    var i,
      targets = jQuery( target, this ),
      len = targets.length;

    return this.filter(function() {
      for ( i = 0; i < len; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false), "not", selector);
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true), "filter", selector );
  },

  is: function( selector ) {
    return !!selector && (
      typeof selector === "string" ?
        // If this is a positional/relative selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        rneedsContext.test( selector ) ?
          jQuery( selector, this.context ).index( this[0] ) >= 0 :
          jQuery.filter( selector, this ).length > 0 :
        this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var cur,
      i = 0,
      l = this.length,
      ret = [],
      pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( ; i < l; i++ ) {
      cur = this[i];

      while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;
        }
        cur = cur.parentNode;
      }
    }

    ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

    return this.pushStack( ret, "closest", selectors );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {

    // No argument, return index in parent
    if ( !elem ) {
      return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
    }

    // index in selector
    if ( typeof elem === "string" ) {
      return jQuery.inArray( this[0], jQuery( elem ) );
    }

    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
      all :
      jQuery.unique( all ) );
  },

  addBack: function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter(selector)
    );
  }
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
  return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
  do {
    cur = cur[ dir ];
  } while ( cur && cur.nodeType !== 1 );

  return cur;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return sibling( elem, "nextSibling" );
  },
  prev: function( elem ) {
    return sibling( elem, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.merge( [], elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until );

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( this.length > 1 && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem, i ) {
      return ( elem === qualifier ) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem, i ) {
    return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
  });
}
function createSafeFragment( document ) {
  var list = nodeNames.split( "|" ),
  safeFrag = document.createDocumentFragment();

  if ( safeFrag.createElement ) {
    while ( list.length ) {
      safeFrag.createElement(
        list.pop()
      );
    }
  }
  return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
  rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnoInnerhtml = /<(?:script|style|link)/i,
  rnocache = /<(?:script|object|embed|option|style)/i,
  rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
  rcheckableType = /^(?:checkbox|radio)$/,
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /\/(java|ecma)script/i,
  rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  },
  safeFragment = createSafeFragment( document ),
  fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
  wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
  text: function( value ) {
    return jQuery.access( this, function( value ) {
      return value === undefined ?
        jQuery.text( this ) :
        this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
    }, null, value, arguments.length );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    var isFunction = jQuery.isFunction( html );

    return this.each(function(i) {
      jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 || this.nodeType === 11 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    if ( !isDisconnected( this[0] ) ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this );
      });
    }

    if ( arguments.length ) {
      var set = jQuery.clean( arguments );
      return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
    }
  },

  after: function() {
    if ( !isDisconnected( this[0] ) ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      });
    }

    if ( arguments.length ) {
      var set = jQuery.clean( arguments );
      return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
    }
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( elem.getElementsByTagName("*") );
          jQuery.cleanData( [ elem ] );
        }

        if ( elem.parentNode ) {
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    var elem,
      i = 0;

    for ( ; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( elem.getElementsByTagName("*") );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    return jQuery.access( this, function( value ) {
      var elem = this[0] || {},
        i = 0,
        l = this.length;

      if ( value === undefined ) {
        return elem.nodeType === 1 ?
          elem.innerHTML.replace( rinlinejQuery, "" ) :
          undefined;
      }

      // See if we can take a shortcut and just use innerHTML
      if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
        ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
        ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

        value = value.replace( rxhtmlTag, "<$1></$2>" );

        try {
          for (; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            elem = this[i] || {};
            if ( elem.nodeType === 1 ) {
              jQuery.cleanData( elem.getElementsByTagName( "*" ) );
              elem.innerHTML = value;
            }
          }

          elem = 0;

        // If using innerHTML throws an exception, use the fallback method
        } catch(e) {}
      }

      if ( elem ) {
        this.empty().append( value );
      }
    }, null, value, arguments.length );
  },

  replaceWith: function( value ) {
    if ( !isDisconnected( this[0] ) ) {
      // Make sure that the elements are removed from the DOM before they are inserted
      // this can help fix replacing a parent with child elements
      if ( jQuery.isFunction( value ) ) {
        return this.each(function(i) {
          var self = jQuery(this), old = self.html();
          self.replaceWith( value.call( this, i, old ) );
        });
      }

      if ( typeof value !== "string" ) {
        value = jQuery( value ).detach();
      }

      return this.each(function() {
        var next = this.nextSibling,
          parent = this.parentNode;

        jQuery( this ).remove();

        if ( next ) {
          jQuery(next).before( value );
        } else {
          jQuery(parent).append( value );
        }
      });
    }

    return this.length ?
      this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
      this;
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {

    // Flatten any nested arrays
    args = [].concat.apply( [], args );

    var results, first, fragment, iNoClone,
      i = 0,
      value = args[0],
      scripts = [],
      l = this.length;

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
      return this.each(function() {
        jQuery(this).domManip( args, table, callback );
      });
    }

    if ( jQuery.isFunction(value) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        args[0] = value.call( this, i, table ? self.html() : undefined );
        self.domManip( args, table, callback );
      });
    }

    if ( this[0] ) {
      results = jQuery.buildFragment( args, this, scripts );
      fragment = results.fragment;
      first = fragment.firstChild;

      if ( fragment.childNodes.length === 1 ) {
        fragment = first;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );

        // Use the original fragment for the last item instead of the first because it can end up
        // being emptied incorrectly in certain situations (#8070).
        // Fragments from the fragment cache must always be cloned and never used in place.
        for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
          callback.call(
            table && jQuery.nodeName( this[i], "table" ) ?
              findOrAppend( this[i], "tbody" ) :
              this[i],
            i === iNoClone ?
              fragment :
              jQuery.clone( fragment, true, true )
          );
        }
      }

      // Fix #11809: Avoid leaking memory
      fragment = first = null;

      if ( scripts.length ) {
        jQuery.each( scripts, function( i, elem ) {
          if ( elem.src ) {
            if ( jQuery.ajax ) {
              jQuery.ajax({
                url: elem.src,
                type: "GET",
                dataType: "script",
                async: false,
                global: false,
                "throws": true
              });
            } else {
              jQuery.error("no ajax");
            }
          } else {
            jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
          }

          if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
          }
        });
      }
    }

    return this;
  }
});

function findOrAppend( elem, tag ) {
  return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var type, i, l,
    oldData = jQuery._data( src ),
    curData = jQuery._data( dest, oldData ),
    events = oldData.events;

  if ( events ) {
    delete curData.handle;
    curData.events = {};

    for ( type in events ) {
      for ( i = 0, l = events[ type ].length; i < l; i++ ) {
        jQuery.event.add( dest, type, events[ type ][ i ] );
      }
    }
  }

  // make the cloned public data object a copy from the original
  if ( curData.data ) {
    curData.data = jQuery.extend( {}, curData.data );
  }
}

function cloneFixAttributes( src, dest ) {
  var nodeName;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  // clearAttributes removes the attributes, which we don't want,
  // but also removes the attachEvent events, which we *do* want
  if ( dest.clearAttributes ) {
    dest.clearAttributes();
  }

  // mergeAttributes, in contrast, only merges back on the
  // original attributes, not the events
  if ( dest.mergeAttributes ) {
    dest.mergeAttributes( src );
  }

  nodeName = dest.nodeName.toLowerCase();

  if ( nodeName === "object" ) {
    // IE6-10 improperly clones children of object elements using classid.
    // IE10 throws NoModificationAllowedError if parent is null, #12132.
    if ( dest.parentNode ) {
      dest.outerHTML = src.outerHTML;
    }

    // This path appears unavoidable for IE9. When cloning an object
    // element in IE9, the outerHTML strategy above is not sufficient.
    // If the src has innerHTML and the destination does not,
    // copy the src.innerHTML into the dest.innerHTML. #10324
    if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
      dest.innerHTML = src.innerHTML;
    }

  } else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set

    dest.defaultChecked = dest.checked = src.checked;

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;

  // IE blanks contents when cloning scripts
  } else if ( nodeName === "script" && dest.text !== src.text ) {
    dest.text = src.text;
  }

  // Event data gets referenced instead of copied if the expando
  // gets copied too
  dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
  var fragment, cacheable, cachehit,
    first = args[ 0 ];

  // Set context from what may come in as undefined or a jQuery collection or a node
  // Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
  // also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
  context = context || document;
  context = !context.nodeType && context[0] || context;
  context = context.ownerDocument || context;

  // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
  // Cloning options loses the selected state, so don't cache them
  // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
  // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
  // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
  if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
    first.charAt(0) === "<" && !rnocache.test( first ) &&
    (jQuery.support.checkClone || !rchecked.test( first )) &&
    (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

    // Mark cacheable and look for a hit
    cacheable = true;
    fragment = jQuery.fragments[ first ];
    cachehit = fragment !== undefined;
  }

  if ( !fragment ) {
    fragment = context.createDocumentFragment();
    jQuery.clean( args, context, fragment, scripts );

    // Update the cache, but only store false
    // unless this is a second parsing of the same content
    if ( cacheable ) {
      jQuery.fragments[ first ] = cachehit && fragment;
    }
  }

  return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var elems,
      i = 0,
      ret = [],
      insert = jQuery( selector ),
      l = insert.length,
      parent = this.length === 1 && this[0].parentNode;

    if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
      insert[ original ]( this[0] );
      return this;
    } else {
      for ( ; i < l; i++ ) {
        elems = ( i > 0 ? this.clone(true) : this ).get();
        jQuery( insert[i] )[ original ]( elems );
        ret = ret.concat( elems );
      }

      return this.pushStack( ret, name, insert.selector );
    }
  };
});

function getAll( elem ) {
  if ( typeof elem.getElementsByTagName !== "undefined" ) {
    return elem.getElementsByTagName( "*" );

  } else if ( typeof elem.querySelectorAll !== "undefined" ) {
    return elem.querySelectorAll( "*" );

  } else {
    return [];
  }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( rcheckableType.test( elem.type ) ) {
    elem.defaultChecked = elem.checked;
  }
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var srcElements,
      destElements,
      i,
      clone;

    if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
      clone = elem.cloneNode( true );

    // IE<=8 does not properly clone detached, unknown element nodes
    } else {
      fragmentDiv.innerHTML = elem.outerHTML;
      fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
    }

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
      // IE copies events bound via attachEvent when using cloneNode.
      // Calling detachEvent on the clone will also remove the events
      // from the original. In order to get around this, we use some
      // proprietary methods to clear the events. Thanks to MooTools
      // guys for this hotness.

      cloneFixAttributes( elem, clone );

      // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
      srcElements = getAll( elem );
      destElements = getAll( clone );

      // Weird iteration because IE will replace the length property
      // with an element if you are cloning the body and one of the
      // elements on the page has a name or id of "length"
      for ( i = 0; srcElements[i]; ++i ) {
        // Ensure that the destination node is not null; Fixes #9587
        if ( destElements[i] ) {
          cloneFixAttributes( srcElements[i], destElements[i] );
        }
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      cloneCopyEvent( elem, clone );

      if ( deepDataAndEvents ) {
        srcElements = getAll( elem );
        destElements = getAll( clone );

        for ( i = 0; srcElements[i]; ++i ) {
          cloneCopyEvent( srcElements[i], destElements[i] );
        }
      }
    }

    srcElements = destElements = null;

    // Return the cloned set
    return clone;
  },

  clean: function( elems, context, fragment, scripts ) {
    var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
      safe = context === document && safeFragment,
      ret = [];

    // Ensure that context is a document
    if ( !context || typeof context.createDocumentFragment === "undefined" ) {
      context = document;
    }

    // Use the already-created safe fragment if context permits
    for ( i = 0; (elem = elems[i]) != null; i++ ) {
      if ( typeof elem === "number" ) {
        elem += "";
      }

      if ( !elem ) {
        continue;
      }

      // Convert html string into DOM nodes
      if ( typeof elem === "string" ) {
        if ( !rhtml.test( elem ) ) {
          elem = context.createTextNode( elem );
        } else {
          // Ensure a safe container in which to render the html
          safe = safe || createSafeFragment( context );
          div = context.createElement("div");
          safe.appendChild( div );

          // Fix "XHTML"-style tags in all browsers
          elem = elem.replace(rxhtmlTag, "<$1></$2>");

          // Go to html and back, then peel off extra wrappers
          tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
          wrap = wrapMap[ tag ] || wrapMap._default;
          depth = wrap[0];
          div.innerHTML = wrap[1] + elem + wrap[2];

          // Move to the right depth
          while ( depth-- ) {
            div = div.lastChild;
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            hasBody = rtbody.test(elem);
              tbody = tag === "table" && !hasBody ?
                div.firstChild && div.firstChild.childNodes :

                // String was a bare <thead> or <tfoot>
                wrap[1] === "<table>" && !hasBody ?
                  div.childNodes :
                  [];

            for ( j = tbody.length - 1; j >= 0 ; --j ) {
              if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                tbody[ j ].parentNode.removeChild( tbody[ j ] );
              }
            }
          }

          // IE completely kills leading whitespace when innerHTML is used
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
          }

          elem = div.childNodes;

          // Take out of fragment container (we need a fresh div each time)
          div.parentNode.removeChild( div );
        }
      }

      if ( elem.nodeType ) {
        ret.push( elem );
      } else {
        jQuery.merge( ret, elem );
      }
    }

    // Fix #11356: Clear elements from safeFragment
    if ( div ) {
      elem = div = safe = null;
    }

    // Reset defaultChecked for any radios and checkboxes
    // about to be appended to the DOM in IE 6/7 (#8060)
    if ( !jQuery.support.appendChecked ) {
      for ( i = 0; (elem = ret[i]) != null; i++ ) {
        if ( jQuery.nodeName( elem, "input" ) ) {
          fixDefaultChecked( elem );
        } else if ( typeof elem.getElementsByTagName !== "undefined" ) {
          jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
        }
      }
    }

    // Append elements to a provided document fragment
    if ( fragment ) {
      // Special handling of each script element
      handleScript = function( elem ) {
        // Check if we consider it executable
        if ( !elem.type || rscriptType.test( elem.type ) ) {
          // Detach the script and store it in the scripts array (if provided) or the fragment
          // Return truthy to indicate that it has been handled
          return scripts ?
            scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
            fragment.appendChild( elem );
        }
      };

      for ( i = 0; (elem = ret[i]) != null; i++ ) {
        // Check if we're done after handling an executable script
        if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
          // Append to fragment and handle embedded scripts
          fragment.appendChild( elem );
          if ( typeof elem.getElementsByTagName !== "undefined" ) {
            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
            jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

            // Splice the scripts into ret after their former ancestor and advance our index beyond them
            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
            i += jsTags.length;
          }
        }
      }
    }

    return ret;
  },

  cleanData: function( elems, /* internal */ acceptData ) {
    var data, id, elem, type,
      i = 0,
      internalKey = jQuery.expando,
      cache = jQuery.cache,
      deleteExpando = jQuery.support.deleteExpando,
      special = jQuery.event.special;

    for ( ; (elem = elems[i]) != null; i++ ) {

      if ( acceptData || jQuery.acceptData( elem ) ) {

        id = elem[ internalKey ];
        data = id && cache[ id ];

        if ( data ) {
          if ( data.events ) {
            for ( type in data.events ) {
              if ( special[ type ] ) {
                jQuery.event.remove( elem, type );

              // This is a shortcut to avoid jQuery.event.remove's overhead
              } else {
                jQuery.removeEvent( elem, type, data.handle );
              }
            }
          }

          // Remove cache only if it was not already removed by jQuery.event.remove
          if ( cache[ id ] ) {

            delete cache[ id ];

            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( deleteExpando ) {
              delete elem[ internalKey ];

            } else if ( elem.removeAttribute ) {
              elem.removeAttribute( internalKey );

            } else {
              elem[ internalKey ] = null;
            }

            jQuery.deletedIds.push( id );
          }
        }
      }
    }
  }
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
  ua = ua.toLowerCase();

  var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
    /(msie) ([\w.]+)/.exec( ua ) ||
    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
    [];

  return {
    browser: match[ 1 ] || "",
    version: match[ 2 ] || "0"
  };
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
  browser[ matched.browser ] = true;
  browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
  browser.webkit = true;
} else if ( browser.webkit ) {
  browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
  function jQuerySub( selector, context ) {
    return new jQuerySub.fn.init( selector, context );
  }
  jQuery.extend( true, jQuerySub, this );
  jQuerySub.superclass = this;
  jQuerySub.fn = jQuerySub.prototype = this();
  jQuerySub.fn.constructor = jQuerySub;
  jQuerySub.sub = this.sub;
  jQuerySub.fn.init = function init( selector, context ) {
    if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
      context = jQuerySub( context );
    }

    return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
  };
  jQuerySub.fn.init.prototype = jQuerySub.fn;
  var rootjQuerySub = jQuerySub(document);
  return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
  ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity=([^)]*)/,
  rposition = /^(top|right|bottom|left)$/,
  // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
  // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
  rdisplayswap = /^(none|table(?!-c[ea]).+)/,
  rmargin = /^margin/,
  rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
  rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
  rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
  elemdisplay = {},

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },
  cssNormalTransform = {
    letterSpacing: 0,
    fontWeight: 400
  },

  cssExpand = [ "Top", "Right", "Bottom", "Left" ],
  cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

  eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

  // shortcut for names that are not vendor prefixed
  if ( name in style ) {
    return name;
  }

  // check for vendor prefixed names
  var capName = name.charAt(0).toUpperCase() + name.slice(1),
    origName = name,
    i = cssPrefixes.length;

  while ( i-- ) {
    name = cssPrefixes[ i ] + capName;
    if ( name in style ) {
      return name;
    }
  }

  return origName;
}

function isHidden( elem, el ) {
  elem = el || elem;
  return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
  var elem, display,
    values = [],
    index = 0,
    length = elements.length;

  for ( ; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    values[ index ] = jQuery._data( elem, "olddisplay" );
    if ( show ) {
      // Reset the inline display of this element to learn if it is
      // being hidden by cascaded rules or not
      if ( !values[ index ] && elem.style.display === "none" ) {
        elem.style.display = "";
      }

      // Set elements which have been overridden with display: none
      // in a stylesheet to whatever the default browser style is
      // for such an element
      if ( elem.style.display === "" && isHidden( elem ) ) {
        values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
      }
    } else {
      display = curCSS( elem, "display" );

      if ( !values[ index ] && display !== "none" ) {
        jQuery._data( elem, "olddisplay", display );
      }
    }
  }

  // Set the display of most of the elements in a second loop
  // to avoid the constant reflow
  for ( index = 0; index < length; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
      elem.style.display = show ? values[ index ] || "" : "none";
    }
  }

  return elements;
}

jQuery.fn.extend({
  css: function( name, value ) {
    return jQuery.access( this, function( elem, name, value ) {
      return value !== undefined ?
        jQuery.style( elem, name, value ) :
        jQuery.css( elem, name );
    }, name, value, arguments.length > 1 );
  },
  show: function() {
    return showHide( this, true );
  },
  hide: function() {
    return showHide( this );
  },
  toggle: function( state, fn2 ) {
    var bool = typeof state === "boolean";

    if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
      return eventsToggle.apply( this, arguments );
    }

    return this.each(function() {
      if ( bool ? state : isHidden( this ) ) {
        jQuery( this ).show();
      } else {
        jQuery( this ).hide();
      }
    });
  }
});

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity" );
          return ret === "" ? "1" : ret;

        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, hooks,
      origName = jQuery.camelCase( name ),
      style = elem.style;

    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && (ret = rrelNum.exec( value )) ) {
        value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
        // Fixes bug #9237
        type = "number";
      }

      // Make sure that NaN and null values aren't set. See: #7116
      if ( value == null || type === "number" && isNaN( value ) ) {
        return;
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, numeric, extra ) {
    var val, num, hooks,
      origName = jQuery.camelCase( name );

    // Make sure that we're working with the right name
    name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

    // gets hook for the prefixed version
    // followed by the unprefixed version
    hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks ) {
      val = hooks.get( elem, true, extra );
    }

    // Otherwise, if a way to get the computed value exists, use that
    if ( val === undefined ) {
      val = curCSS( elem, name );
    }

    //convert "normal" to computed value
    if ( val === "normal" && name in cssNormalTransform ) {
      val = cssNormalTransform[ name ];
    }

    // Return, converting to number if forced or a qualifier was provided and val looks numeric
    if ( numeric || extra !== undefined ) {
      num = parseFloat( val );
      return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
    }
    return val;
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback ) {
    var ret, name,
      old = {};

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.call( elem );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
  curCSS = function( elem, name ) {
    var ret, width, minWidth, maxWidth,
      computed = window.getComputedStyle( elem, null ),
      style = elem.style;

    if ( computed ) {

      ret = computed[ name ];
      if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
        ret = jQuery.style( elem, name );
      }

      // A tribute to the "awesome hack by Dean Edwards"
      // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
      // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret;
  };
} else if ( document.documentElement.currentStyle ) {
  curCSS = function( elem, name ) {
    var left, rsLeft,
      ret = elem.currentStyle && elem.currentStyle[ name ],
      style = elem.style;

    // Avoid setting ret to empty string here
    // so we don't default to auto
    if ( ret == null && style && style[ name ] ) {
      ret = style[ name ];
    }

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    // but not position css attributes, as those are proportional to the parent element instead
    // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
    if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

      // Remember the original values
      left = style.left;
      rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        elem.runtimeStyle.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        elem.runtimeStyle.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

function setPositiveNumber( elem, value, subtract ) {
  var matches = rnumsplit.exec( value );
  return matches ?
      Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
      value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
  var i = extra === ( isBorderBox ? "border" : "content" ) ?
    // If we already have the right measurement, avoid augmentation
    4 :
    // Otherwise initialize for horizontal or vertical properties
    name === "width" ? 1 : 0,

    val = 0;

  for ( ; i < 4; i += 2 ) {
    // both box models exclude margin, so add it if we want it
    if ( extra === "margin" ) {
      // we use jQuery.css instead of curCSS here
      // because of the reliableMarginRight CSS hook!
      val += jQuery.css( elem, extra + cssExpand[ i ], true );
    }

    // From this point on we use curCSS for maximum performance (relevant in animations)
    if ( isBorderBox ) {
      // border-box includes padding, so remove it if we want content
      if ( extra === "content" ) {
        val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
      }

      // at this point, extra isn't border nor margin, so remove border
      if ( extra !== "margin" ) {
        val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
      }
    } else {
      // at this point, extra isn't content, so add padding
      val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

      // at this point, extra isn't content nor padding, so add border
      if ( extra !== "padding" ) {
        val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
      }
    }
  }

  return val;
}

function getWidthOrHeight( elem, name, extra ) {

  // Start with offset property, which is equivalent to the border-box value
  var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    valueIsBorderBox = true,
    isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

  // some non-html elements return undefined for offsetWidth, so check for null/undefined
  // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
  // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
  if ( val <= 0 || val == null ) {
    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name );
    if ( val < 0 || val == null ) {
      val = elem.style[ name ];
    }

    // Computed unit is not pixels. Stop here and return.
    if ( rnumnonpx.test(val) ) {
      return val;
    }

    // we need the check for style in case a browser which returns unreliable values
    // for getComputedStyle silently falls back to the reliable elem.style
    valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;
  }

  // use the active box-sizing model to add/subtract irrelevant styles
  return ( val +
    augmentWidthOrHeight(
      elem,
      name,
      extra || ( isBorderBox ? "border" : "content" ),
      valueIsBorderBox
    )
  ) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
  if ( elemdisplay[ nodeName ] ) {
    return elemdisplay[ nodeName ];
  }

  var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
    display = elem.css("display");
  elem.remove();

  // If the simple way fails,
  // get element's real default display by attaching it to a temp iframe
  if ( display === "none" || display === "" ) {
    // Use the already-created iframe if possible
    iframe = document.body.appendChild(
      iframe || jQuery.extend( document.createElement("iframe"), {
        frameBorder: 0,
        width: 0,
        height: 0
      })
    );

    // Create a cacheable copy of the iframe document on first call.
    // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
    // document to it; WebKit & Firefox won't allow reusing the iframe document.
    if ( !iframeDoc || !iframe.createElement ) {
      iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
      iframeDoc.write("<!doctype html><html><body>");
      iframeDoc.close();
    }

    elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

    display = curCSS( elem, "display" );
    document.body.removeChild( iframe );
  }

  // Store the correct default display
  elemdisplay[ nodeName ] = display;

  return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      if ( computed ) {
        // certain elements can have dimension info if we invisibly show them
        // however, it must have a current display style that would benefit from this
        if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
          return jQuery.swap( elem, cssShow, function() {
            return getWidthOrHeight( elem, name, extra );
          });
        } else {
          return getWidthOrHeight( elem, name, extra );
        }
      }
    },

    set: function( elem, value, extra ) {
      return setPositiveNumber( elem, value, extra ?
        augmentWidthOrHeight(
          elem,
          name,
          extra,
          jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
        ) : 0
      );
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle,
        opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
      if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
        style.removeAttribute ) {

        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
        // if "filter:" is present at all, clearType is disabled, we want to avoid this
        // style.removeAttribute is IE Only, but so apparently is this code path...
        style.removeAttribute( "filter" );

        // if there there is no filter style applied in a css rule, we are done
        if ( currentStyle && !currentStyle.filter ) {
          return;
        }
      }

      // otherwise, set new filter values
      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        // Work around by temporarily setting element display to inline-block
        return jQuery.swap( elem, { "display": "inline-block" }, function() {
          if ( computed ) {
            return curCSS( elem, "marginRight" );
          }
        });
      }
    };
  }

  // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
  // getComputedStyle returns percent when specified for top/left/bottom/right
  // rather than make the css module depend on the offset module, we just check for it here
  if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
    jQuery.each( [ "top", "left" ], function( i, prop ) {
      jQuery.cssHooks[ prop ] = {
        get: function( elem, computed ) {
          if ( computed ) {
            var ret = curCSS( elem, prop );
            // if curCSS returns percentage, fallback to offset
            return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
          }
        }
      };
    });
  }

});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}

// These hooks are used by animate to expand properties
jQuery.each({
  margin: "",
  padding: "",
  border: "Width"
}, function( prefix, suffix ) {
  jQuery.cssHooks[ prefix + suffix ] = {
    expand: function( value ) {
      var i,

        // assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [ value ],
        expanded = {};

      for ( i = 0; i < 4; i++ ) {
        expanded[ prefix + cssExpand[ i ] + suffix ] =
          parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      }

      return expanded;
    }
  };

  if ( !rmargin.test( prefix ) ) {
    jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
  }
});
var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
  rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },
  serializeArray: function() {
    return this.map(function(){
      return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
    .filter(function(){
      return this.name && !this.disabled &&
        ( this.checked || rselectTextarea.test( this.nodeName ) ||
          rinput.test( this.type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val, i ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
  var prefix,
    s = [],
    add = function( key, value ) {
      // If value is a function, invoke it and return its value
      value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
      s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
    };

  // Set traditional to true for jQuery <= 1.3.2 behavior.
  if ( traditional === undefined ) {
    traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
  }

  // If an array was passed in, assume that it is an array of form elements.
  if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
    // Serialize the form elements
    jQuery.each( a, function() {
      add( this.name, this.value );
    });

  } else {
    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for ( prefix in a ) {
      buildParams( prefix, a[ prefix ], traditional, add );
    }
  }

  // Return the resulting serialization
  return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
  var name;

  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // If array item is non-scalar (array or object), encode its
        // numeric index to resolve deserialization ambiguity issues.
        // Note that rack (as of 1.0.0) can't currently deserialize
        // nested arrays properly, and attempting to do so may cause
        // a server error. Possible fixes are to modify rack's
        // deserialization algorithm or to provide an option or flag
        // to force array serialization to be shallow.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}
var
  // Document location
  ajaxLocParts,
  ajaxLocation,

  rhash = /#.*$/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rquery = /\?/,
  rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  rts = /([?&])_=[^&]*/,
  rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    var dataType, list, placeBefore,
      dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
      i = 0,
      length = dataTypes.length;

    if ( jQuery.isFunction( func ) ) {
      // For each dataType in the dataTypeExpression
      for ( ; i < length; i++ ) {
        dataType = dataTypes[ i ];
        // We control if we're asked to add before
        // any existing element
        placeBefore = /^\+/.test( dataType );
        if ( placeBefore ) {
          dataType = dataType.substr( 1 ) || "*";
        }
        list = structure[ dataType ] = structure[ dataType ] || [];
        // then we add to the structure accordingly
        list[ placeBefore ? "unshift" : "push" ]( func );
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
    dataType /* internal */, inspected /* internal */ ) {

  dataType = dataType || options.dataTypes[ 0 ];
  inspected = inspected || {};

  inspected[ dataType ] = true;

  var selection,
    list = structure[ dataType ],
    i = 0,
    length = list ? list.length : 0,
    executeOnly = ( structure === prefilters );

  for ( ; i < length && ( executeOnly || !selection ); i++ ) {
    selection = list[ i ]( options, originalOptions, jqXHR );
    // If we got redirected to another dataType
    // we try there if executing only and not done already
    if ( typeof selection === "string" ) {
      if ( !executeOnly || inspected[ selection ] ) {
        selection = undefined;
      } else {
        options.dataTypes.unshift( selection );
        selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, selection, inspected );
      }
    }
  }
  // If we're only executing or nothing was selected
  // we try the catchall dataType if not done already
  if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
    selection = inspectPrefiltersOrTransports(
        structure, options, originalOptions, jqXHR, "*", inspected );
  }
  // unnecessary when only executing (prefilters)
  // but it'll be ignored by the caller in that case
  return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
  var key, deep,
    flatOptions = jQuery.ajaxSettings.flatOptions || {};
  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    jQuery.extend( true, target, deep );
  }
}

jQuery.fn.load = function( url, params, callback ) {
  if ( typeof url !== "string" && _load ) {
    return _load.apply( this, arguments );
  }

  // Don't do a request if no elements are being requested
  if ( !this.length ) {
    return this;
  }

  var selector, type, response,
    self = this,
    off = url.indexOf(" ");

  if ( off >= 0 ) {
    selector = url.slice( off, url.length );
    url = url.slice( 0, off );
  }

  // If it's a function
  if ( jQuery.isFunction( params ) ) {

    // We assume that it's the callback
    callback = params;
    params = undefined;

  // Otherwise, build a param string
  } else if ( params && typeof params === "object" ) {
    type = "POST";
  }

  // Request the remote document
  jQuery.ajax({
    url: url,

    // if "type" variable is undefined, then "GET" method will be used
    type: type,
    dataType: "html",
    data: params,
    complete: function( jqXHR, status ) {
      if ( callback ) {
        self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
      }
    }
  }).done(function( responseText ) {

    // Save response for use in complete callback
    response = arguments;

    // See if a selector was specified
    self.html( selector ?

      // Create a dummy div to hold the results
      jQuery("<div>")

        // inject the contents of the document in, removing the scripts
        // to avoid any 'Permission Denied' errors in IE
        .append( responseText.replace( rscript, "" ) )

        // Locate the specified elements
        .find( selector ) :

      // If not, just inject the full result
      responseText );

  });

  return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
  jQuery.fn[ o ] = function( f ){
    return this.on( o, f );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };
});

jQuery.extend({

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function( target, settings ) {
    if ( settings ) {
      // Building a settings object
      ajaxExtend( target, jQuery.ajaxSettings );
    } else {
      // Extending ajaxSettings
      settings = target;
      target = jQuery.ajaxSettings;
    }
    ajaxExtend( target, settings );
    return target;
  },

  ajaxSettings: {
    url: ajaxLocation,
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    type: "GET",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    processData: true,
    async: true,
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    throws: false,
    traditional: false,
    headers: {},
    */

    accepts: {
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain",
      json: "application/json, text/javascript",
      "*": allTypes
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // List of data converters
    // 1) key format is "source_type destination_type" (a single space in-between)
    // 2) the catchall symbol "*" can be used for source_type
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    },

    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      context: true,
      url: true
    }
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // ifModified key
      ifModifiedKey,
      // Response headers
      responseHeadersString,
      responseHeaders,
      // transport
      transport,
      // timeout handle
      timeoutTimer,
      // Cross-domain detection vars
      parts,
      // To know if global events are to be dispatched
      fireGlobals,
      // Loop variable
      i,
      // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events
      // It's the callbackContext if one was provided in the options
      // and if it's a DOM node or a jQuery collection
      globalEventContext = callbackContext !== s &&
        ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
            jQuery( callbackContext ) : jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery.Callbacks( "once memory" ),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // The jqXHR state
      state = 0,
      // Default abort message
      strAbort = "canceled",
      // Fake xhr
      jqXHR = {

        readyState: 0,

        // Caches the header
        setRequestHeader: function( name, value ) {
          if ( !state ) {
            var lname = name.toLowerCase();
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match === undefined ? null : match;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          statusText = statusText || strAbort;
          if ( transport ) {
            transport.abort( statusText );
          }
          done( 0, statusText );
          return this;
        }
      };

    // Callback for when everything is done
    // It is defined here because jslint complains if it is declared
    // at the end of the function (which would be more logical and readable)
    function done( status, nativeStatusText, responses, headers ) {
      var isSuccess, success, error, response, modified,
        statusText = nativeStatusText;

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status > 0 ? 4 : 0;

      // Get response data
      if ( responses ) {
        response = ajaxHandleResponses( s, jqXHR, responses );
      }

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {

          modified = jqXHR.getResponseHeader("Last-Modified");
          if ( modified ) {
            jQuery.lastModified[ ifModifiedKey ] = modified;
          }
          modified = jqXHR.getResponseHeader("Etag");
          if ( modified ) {
            jQuery.etag[ ifModifiedKey ] = modified;
          }
        }

        // If not modified
        if ( status === 304 ) {

          statusText = "notmodified";
          isSuccess = true;

        // If we have data
        } else {

          isSuccess = ajaxConvert( s, response );
          statusText = isSuccess.state;
          success = isSuccess.data;
          error = isSuccess.error;
          isSuccess = !error;
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if ( !statusText || status ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = ( nativeStatusText || statusText ) + "";

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
            [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger( "ajaxStop" );
        }
      }
    }

    // Attach deferreds
    deferred.promise( jqXHR );
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;
    jqXHR.complete = completeDeferred.add;

    // Status-dependent callbacks
    jqXHR.statusCode = function( map ) {
      if ( map ) {
        var tmp;
        if ( state < 2 ) {
          for ( tmp in map ) {
            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
          }
        } else {
          tmp = map[ jqXHR.status ];
          jqXHR.always( tmp );
        }
      }
      return this;
    };

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // We also use the url parameter if available
    s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

    // A cross-domain request is in order when we have a protocol:host:port mismatch
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() ) || false;
      s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
        ( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefilter, stop there
    if ( state === 2 ) {
      return jqXHR;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger( "ajaxStart" );
    }

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
        // #9682: remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Get ifModifiedKey before adding the anti-cache parameter
      ifModifiedKey = s.url;

      // Add anti-cache in url if needed
      if ( s.cache === false ) {

        var ts = jQuery.now(),
          // try replacing _= if it is there
          ret = s.url.replace( rts, "$1_=" + ts );

        // if nothing was replaced, add timestamp to the end
        s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      ifModifiedKey = ifModifiedKey || s.url;
      if ( jQuery.lastModified[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
      }
      if ( jQuery.etag[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
      }
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
        // Abort if not done already and return
        return jqXHR.abort();

    }

    // aborting is no longer a cancellation
    strAbort = "abort";

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;
      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout( function(){
          jqXHR.abort( "timeout" );
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch (e) {
        // Propagate exception as error if not done
        if ( state < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          throw e;
        }
      }
    }

    return jqXHR;
  },

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

  var ct, type, finalDataType, firstDataType,
    contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields;

  // Fill responseXXX fields
  for ( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

  var conv, conv2, current, tmp,
    // Work with a copy of dataTypes in case we need to modify it for conversion
    dataTypes = s.dataTypes.slice(),
    prev = dataTypes[ 0 ],
    converters = {},
    i = 0;

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  // Create converters map with lowercased keys
  if ( dataTypes[ 1 ] ) {
    for ( conv in s.converters ) {
      converters[ conv.toLowerCase() ] = s.converters[ conv ];
    }
  }

  // Convert to each sequential dataType, tolerating list modification
  for ( ; (current = dataTypes[++i]); ) {

    // There's only work to do if current dataType is non-auto
    if ( current !== "*" ) {

      // Convert response if prev dataType is non-auto and differs from current
      if ( prev !== "*" && prev !== current ) {

        // Seek a direct converter
        conv = converters[ prev + " " + current ] || converters[ "* " + current ];

        // If none found, seek a pair
        if ( !conv ) {
          for ( conv2 in converters ) {

            // If conv2 outputs current
            tmp = conv2.split(" ");
            if ( tmp[ 1 ] === current ) {

              // If prev can be converted to accepted input
              conv = converters[ prev + " " + tmp[ 0 ] ] ||
                converters[ "* " + tmp[ 0 ] ];
              if ( conv ) {
                // Condense equivalence converters
                if ( conv === true ) {
                  conv = converters[ conv2 ];

                // Otherwise, insert the intermediate dataType
                } else if ( converters[ conv2 ] !== true ) {
                  current = tmp[ 0 ];
                  dataTypes.splice( i--, 0, current );
                }

                break;
              }
            }
          }
        }

        // Apply converter (if not an equivalence)
        if ( conv !== true ) {

          // Unless errors are allowed to bubble, catch and return them
          if ( conv && s["throws"] ) {
            response = conv( response );
          } else {
            try {
              response = conv( response );
            } catch ( e ) {
              return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
            }
          }
        }
      }

      // Update prev for next iteration
      prev = current;
    }
  }

  return { state: "success", data: response };
}
var oldCallbacks = [],
  rquestion = /\?/,
  rjsonp = /(=)\?(?=&|$)|\?\?/,
  nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
    this[ callback ] = true;
    return callback;
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var callbackName, overwritten, responseContainer,
    data = s.data,
    url = s.url,
    hasCallback = s.jsonp !== false,
    replaceInUrl = hasCallback && rjsonp.test( url ),
    replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
      !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
      rjsonp.test( data );

  // Handle iff the expected data type is "jsonp" or we have a parameter to set
  if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

    // Get callback name, remembering preexisting value associated with it
    callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
      s.jsonpCallback() :
      s.jsonpCallback;
    overwritten = window[ callbackName ];

    // Insert callback into url or form data
    if ( replaceInUrl ) {
      s.url = url.replace( rjsonp, "$1" + callbackName );
    } else if ( replaceInData ) {
      s.data = data.replace( rjsonp, "$1" + callbackName );
    } else if ( hasCallback ) {
      s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    }

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( callbackName + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Install callback
    window[ callbackName ] = function() {
      responseContainer = arguments;
    };

    // Clean-up function (fires after converters)
    jqXHR.always(function() {
      // Restore preexisting value
      window[ callbackName ] = overwritten;

      // Save back as free
      if ( s[ callbackName ] ) {
        // make sure that re-using the options doesn't screw things around
        s.jsonpCallback = originalSettings.jsonpCallback;

        // save the callback name for future use
        oldCallbacks.push( callbackName );
      }

      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( overwritten ) ) {
        overwritten( responseContainer[ 0 ] );
      }

      responseContainer = overwritten = undefined;
    });

    // Delegate to script
    return "script";
  }
});
// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /javascript|ecmascript/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement( "script" );

        script.async = "async";

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( head && script.parentNode ) {
              head.removeChild( script );
            }

            // Dereference the script
            script = undefined;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( 0, 1 );
        }
      }
    };
  }
});
var xhrCallbacks,
  // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject ? function() {
    // Abort all pending requests
    for ( var key in xhrCallbacks ) {
      xhrCallbacks[ key ]( 0, 1 );
    }
  } : false,
  xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject( "Microsoft.XMLHTTP" );
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
(function( xhr ) {
  jQuery.extend( jQuery.support, {
    ajax: !!xhr,
    cors: !!xhr && ( "withCredentials" in xhr )
  });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var handle, i,
            xhr = s.xhr();

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers[ "X-Requested-With" ] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( _ ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {

            var status,
              statusText,
              responseHeaders,
              responses,
              xml;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occurred
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();
                  responses = {};
                  xml = xhr.responseXML;

                  // Construct response list
                  if ( xml && xml.documentElement /* #4958 */ ) {
                    responses.xml = xml;
                  }

                  // When requesting binary data, IE6-9 will throw an exception
                  // on any attempt to access responseText (#11426)
                  try {
                    responses.text = xhr.responseText;
                  } catch( _ ) {
                  }

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          if ( !s.async ) {
            // if we're in sync mode we fire the callback
            callback();
          } else if ( xhr.readyState === 4 ) {
            // (IE6 & IE7) if it's in cache and has been
            // retrieved directly we need to fire the callback
            setTimeout( callback, 0 );
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback(0,1);
          }
        }
      };
    }
  });
}
var fxNow, timerId,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
  rrun = /queueHooks$/,
  animationPrefilters = [ defaultPrefilter ],
  tweeners = {
    "*": [function( prop, value ) {
      var end, unit,
        tween = this.createTween( prop, value ),
        parts = rfxnum.exec( value ),
        target = tween.cur(),
        start = +target || 0,
        scale = 1,
        maxIterations = 20;

      if ( parts ) {
        end = +parts[2];
        unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

        // We need to compute starting value
        if ( unit !== "px" && start ) {
          // Iteratively approximate from a nonzero starting point
          // Prefer the current property, because this process will be trivial if it uses the same units
          // Fallback to end or a simple constant
          start = jQuery.css( tween.elem, prop, true ) || end || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style( tween.elem, prop, start + unit );

          // Update scale, tolerating zero or NaN from tween.cur()
          // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
        }

        tween.unit = unit;
        tween.start = start;
        // If a +=/-= token was provided, we're doing a relative animation
        tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
      }
      return tween;
    }]
  };

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout(function() {
    fxNow = undefined;
  }, 0 );
  return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
  jQuery.each( props, function( prop, value ) {
    var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
      index = 0,
      length = collection.length;
    for ( ; index < length; index++ ) {
      if ( collection[ index ].call( animation, prop, value ) ) {

        // we're done with this property
        return;
      }
    }
  });
}

function Animation( elem, properties, options ) {
  var result,
    index = 0,
    tweenerIndex = 0,
    length = animationPrefilters.length,
    deferred = jQuery.Deferred().always( function() {
      // don't match elem in the :animated selector
      delete tick.elem;
    }),
    tick = function() {
      var currentTime = fxNow || createFxNow(),
        remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
        percent = 1 - ( remaining / animation.duration || 0 ),
        index = 0,
        length = animation.tweens.length;

      for ( ; index < length ; index++ ) {
        animation.tweens[ index ].run( percent );
      }

      deferred.notifyWith( elem, [ animation, percent, remaining ]);

      if ( percent < 1 && length ) {
        return remaining;
      } else {
        deferred.resolveWith( elem, [ animation ] );
        return false;
      }
    },
    animation = deferred.promise({
      elem: elem,
      props: jQuery.extend( {}, properties ),
      opts: jQuery.extend( true, { specialEasing: {} }, options ),
      originalProperties: properties,
      originalOptions: options,
      startTime: fxNow || createFxNow(),
      duration: options.duration,
      tweens: [],
      createTween: function( prop, end, easing ) {
        var tween = jQuery.Tween( elem, animation.opts, prop, end,
            animation.opts.specialEasing[ prop ] || animation.opts.easing );
        animation.tweens.push( tween );
        return tween;
      },
      stop: function( gotoEnd ) {
        var index = 0,
          // if we are going to the end, we want to run all the tweens
          // otherwise we skip this part
          length = gotoEnd ? animation.tweens.length : 0;

        for ( ; index < length ; index++ ) {
          animation.tweens[ index ].run( 1 );
        }

        // resolve when we played the last frame
        // otherwise, reject
        if ( gotoEnd ) {
          deferred.resolveWith( elem, [ animation, gotoEnd ] );
        } else {
          deferred.rejectWith( elem, [ animation, gotoEnd ] );
        }
        return this;
      }
    }),
    props = animation.props;

  propFilter( props, animation.opts.specialEasing );

  for ( ; index < length ; index++ ) {
    result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
    if ( result ) {
      return result;
    }
  }

  createTweens( animation, props );

  if ( jQuery.isFunction( animation.opts.start ) ) {
    animation.opts.start.call( elem, animation );
  }

  jQuery.fx.timer(
    jQuery.extend( tick, {
      anim: animation,
      queue: animation.opts.queue,
      elem: elem
    })
  );

  // attach callbacks from options
  return animation.progress( animation.opts.progress )
    .done( animation.opts.done, animation.opts.complete )
    .fail( animation.opts.fail )
    .always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
  var index, name, easing, value, hooks;

  // camelCase, specialEasing and expand cssHook pass
  for ( index in props ) {
    name = jQuery.camelCase( index );
    easing = specialEasing[ name ];
    value = props[ index ];
    if ( jQuery.isArray( value ) ) {
      easing = value[ 1 ];
      value = props[ index ] = value[ 0 ];
    }

    if ( index !== name ) {
      props[ name ] = value;
      delete props[ index ];
    }

    hooks = jQuery.cssHooks[ name ];
    if ( hooks && "expand" in hooks ) {
      value = hooks.expand( value );
      delete props[ name ];

      // not quite $.extend, this wont overwrite keys already present.
      // also - reusing 'index' from above because we have the correct "name"
      for ( index in value ) {
        if ( !( index in props ) ) {
          props[ index ] = value[ index ];
          specialEasing[ index ] = easing;
        }
      }
    } else {
      specialEasing[ name ] = easing;
    }
  }
}

jQuery.Animation = jQuery.extend( Animation, {

  tweener: function( props, callback ) {
    if ( jQuery.isFunction( props ) ) {
      callback = props;
      props = [ "*" ];
    } else {
      props = props.split(" ");
    }

    var prop,
      index = 0,
      length = props.length;

    for ( ; index < length ; index++ ) {
      prop = props[ index ];
      tweeners[ prop ] = tweeners[ prop ] || [];
      tweeners[ prop ].unshift( callback );
    }
  },

  prefilter: function( callback, prepend ) {
    if ( prepend ) {
      animationPrefilters.unshift( callback );
    } else {
      animationPrefilters.push( callback );
    }
  }
});

function defaultPrefilter( elem, props, opts ) {
  var index, prop, value, length, dataShow, tween, hooks, oldfire,
    anim = this,
    style = elem.style,
    orig = {},
    handled = [],
    hidden = elem.nodeType && isHidden( elem );

  // handle queue: false promises
  if ( !opts.queue ) {
    hooks = jQuery._queueHooks( elem, "fx" );
    if ( hooks.unqueued == null ) {
      hooks.unqueued = 0;
      oldfire = hooks.empty.fire;
      hooks.empty.fire = function() {
        if ( !hooks.unqueued ) {
          oldfire();
        }
      };
    }
    hooks.unqueued++;

    anim.always(function() {
      // doing this makes sure that the complete handler will be called
      // before this completes
      anim.always(function() {
        hooks.unqueued--;
        if ( !jQuery.queue( elem, "fx" ).length ) {
          hooks.empty.fire();
        }
      });
    });
  }

  // height/width overflow pass
  if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
    // Make sure that nothing sneaks out
    // Record all 3 overflow attributes because IE does not
    // change the overflow attribute when overflowX and
    // overflowY are set to the same value
    opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    // Set display property to inline-block for height/width
    // animations on inline elements that are having width/height animated
    if ( jQuery.css( elem, "display" ) === "inline" &&
        jQuery.css( elem, "float" ) === "none" ) {

      // inline-level elements accept inline-block;
      // block-level elements need to be inline with layout
      if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
        style.display = "inline-block";

      } else {
        style.zoom = 1;
      }
    }
  }

  if ( opts.overflow ) {
    style.overflow = "hidden";
    if ( !jQuery.support.shrinkWrapBlocks ) {
      anim.done(function() {
        style.overflow = opts.overflow[ 0 ];
        style.overflowX = opts.overflow[ 1 ];
        style.overflowY = opts.overflow[ 2 ];
      });
    }
  }


  // show/hide pass
  for ( index in props ) {
    value = props[ index ];
    if ( rfxtypes.exec( value ) ) {
      delete props[ index ];
      if ( value === ( hidden ? "hide" : "show" ) ) {
        continue;
      }
      handled.push( index );
    }
  }

  length = handled.length;
  if ( length ) {
    dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
    if ( hidden ) {
      jQuery( elem ).show();
    } else {
      anim.done(function() {
        jQuery( elem ).hide();
      });
    }
    anim.done(function() {
      var prop;
      jQuery.removeData( elem, "fxshow", true );
      for ( prop in orig ) {
        jQuery.style( elem, prop, orig[ prop ] );
      }
    });
    for ( index = 0 ; index < length ; index++ ) {
      prop = handled[ index ];
      tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
      orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

      if ( !( prop in dataShow ) ) {
        dataShow[ prop ] = tween.start;
        if ( hidden ) {
          tween.end = tween.start;
          tween.start = prop === "width" || prop === "height" ? 1 : 0;
        }
      }
    }
  }
}

function Tween( elem, options, prop, end, easing ) {
  return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
  constructor: Tween,
  init: function( elem, options, prop, end, easing, unit ) {
    this.elem = elem;
    this.prop = prop;
    this.easing = easing || "swing";
    this.options = options;
    this.start = this.now = this.cur();
    this.end = end;
    this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
  },
  cur: function() {
    var hooks = Tween.propHooks[ this.prop ];

    return hooks && hooks.get ?
      hooks.get( this ) :
      Tween.propHooks._default.get( this );
  },
  run: function( percent ) {
    var eased,
      hooks = Tween.propHooks[ this.prop ];

    if ( this.options.duration ) {
      this.pos = eased = jQuery.easing[ this.easing ](
        percent, this.options.duration * percent, 0, 1, this.options.duration
      );
    } else {
      this.pos = eased = percent;
    }
    this.now = ( this.end - this.start ) * eased + this.start;

    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    if ( hooks && hooks.set ) {
      hooks.set( this );
    } else {
      Tween.propHooks._default.set( this );
    }
    return this;
  }
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
  _default: {
    get: function( tween ) {
      var result;

      if ( tween.elem[ tween.prop ] != null &&
        (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
        return tween.elem[ tween.prop ];
      }

      // passing any value as a 4th parameter to .css will automatically
      // attempt a parseFloat and fallback to a string if the parse fails
      // so, simple values such as "10px" are parsed to Float.
      // complex values such as "rotate(1rad)" are returned as is.
      result = jQuery.css( tween.elem, tween.prop, false, "" );
      // Empty strings, null, undefined and "auto" are converted to 0.
      return !result || result === "auto" ? 0 : result;
    },
    set: function( tween ) {
      // use step hook for back compat - use cssHook if its there - use .style if its
      // available and use plain properties where available
      if ( jQuery.fx.step[ tween.prop ] ) {
        jQuery.fx.step[ tween.prop ]( tween );
      } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
        jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
      } else {
        tween.elem[ tween.prop ] = tween.now;
      }
    }
  }
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
  set: function( tween ) {
    if ( tween.elem.nodeType && tween.elem.parentNode ) {
      tween.elem[ tween.prop ] = tween.now;
    }
  }
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
  var cssFn = jQuery.fn[ name ];
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return speed == null || typeof speed === "boolean" ||
      // special check for .toggle( handler, handler, ... )
      ( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
      cssFn.apply( this, arguments ) :
      this.animate( genFx( name, true ), speed, easing, callback );
  };
});

jQuery.fn.extend({
  fadeTo: function( speed, to, easing, callback ) {

    // show any hidden elements after setting opacity to 0
    return this.filter( isHidden ).css( "opacity", 0 ).show()

      // animate to the value specified
      .end().animate({ opacity: to }, speed, easing, callback );
  },
  animate: function( prop, speed, easing, callback ) {
    var empty = jQuery.isEmptyObject( prop ),
      optall = jQuery.speed( speed, easing, callback ),
      doAnimation = function() {
        // Operate on a copy of prop so per-property easing won't be lost
        var anim = Animation( this, jQuery.extend( {}, prop ), optall );

        // Empty animations resolve immediately
        if ( empty ) {
          anim.stop( true );
        }
      };

    return empty || optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },
  stop: function( type, clearQueue, gotoEnd ) {
    var stopQueue = function( hooks ) {
      var stop = hooks.stop;
      delete hooks.stop;
      stop( gotoEnd );
    };

    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var dequeue = true,
        index = type != null && type + "queueHooks",
        timers = jQuery.timers,
        data = jQuery._data( this );

      if ( index ) {
        if ( data[ index ] && data[ index ].stop ) {
          stopQueue( data[ index ] );
        }
      } else {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
            stopQueue( data[ index ] );
          }
        }
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          timers[ index ].anim.stop( gotoEnd );
          dequeue = false;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( dequeue || !gotoEnd ) {
        jQuery.dequeue( this, type );
      }
    });
  }
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
  var which,
    attrs = { height: type },
    i = 0;

  // if we include width, step value is 1 to do all cssExpand values,
  // if we don't include width, step value is 2 to skip over Left and Right
  includeWidth = includeWidth? 1 : 0;
  for( ; i < 4 ; i += 2 - includeWidth ) {
    which = cssExpand[ i ];
    attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
  }

  if ( includeWidth ) {
    attrs.opacity = attrs.width = type;
  }

  return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx("show"),
  slideUp: genFx("hide"),
  slideToggle: genFx("toggle"),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.speed = function( speed, easing, fn ) {
  var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    complete: fn || !fn && easing ||
      jQuery.isFunction( speed ) && speed,
    duration: speed,
    easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
  };

  opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
    opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

  // normalize opt.queue - true/undefined/null -> "fx"
  if ( opt.queue == null || opt.queue === true ) {
    opt.queue = "fx";
  }

  // Queueing
  opt.old = opt.complete;

  opt.complete = function() {
    if ( jQuery.isFunction( opt.old ) ) {
      opt.old.call( this );
    }

    if ( opt.queue ) {
      jQuery.dequeue( this, opt.queue );
    }
  };

  return opt;
};

jQuery.easing = {
  linear: function( p ) {
    return p;
  },
  swing: function( p ) {
    return 0.5 - Math.cos( p*Math.PI ) / 2;
  }
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
  var timer,
    timers = jQuery.timers,
    i = 0;

  for ( ; i < timers.length; i++ ) {
    timer = timers[ i ];
    // Checks the timer has not already been removed
    if ( !timer() && timers[ i ] === timer ) {
      timers.splice( i--, 1 );
    }
  }

  if ( !timers.length ) {
    jQuery.fx.stop();
  }
};

jQuery.fx.timer = function( timer ) {
  if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
    timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
  }
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
  clearInterval( timerId );
  timerId = null;
};

jQuery.fx.speeds = {
  slow: 600,
  fast: 200,
  // Default speed
  _default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
    box = { top: 0, left: 0 },
    elem = this[ 0 ],
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return;
  }

  if ( (body = doc.body) === elem ) {
    return jQuery.offset.bodyOffset( elem );
  }

  docElem = doc.documentElement;

  // Make sure it's not a disconnected DOM node
  if ( !jQuery.contains( docElem, elem ) ) {
    return box;
  }

  // If we don't have gBCR, just use 0,0 rather than error
  // BlackBerry 5, iOS 3 (original iPhone)
  if ( typeof elem.getBoundingClientRect !== "undefined" ) {
    box = elem.getBoundingClientRect();
  }
  win = getWindow( doc );
  clientTop  = docElem.clientTop  || body.clientTop  || 0;
  clientLeft = docElem.clientLeft || body.clientLeft || 0;
  scrollTop  = win.pageYOffset || docElem.scrollTop;
  scrollLeft = win.pageXOffset || docElem.scrollLeft;
  return {
    top: box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
};

jQuery.offset = {

  bodyOffset: function( body ) {
    var top = body.offsetTop,
      left = body.offsetLeft;

    if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
      top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
      left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
    }

    return { top: top, left: left };
  },

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[0] ) {
      return;
    }

    var elem = this[0],

    // Get *real* offsetParent
    offsetParent = this.offsetParent(),

    // Get correct offsets
    offset       = this.offset(),
    parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
    offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

    // Add offsetParent borders
    parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
    parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

    // Subtract the two offsets
    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.body;
      while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || document.body;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = /Y/.test( prop );

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? (prop in win) ? win[ prop ] :
          win.document.documentElement[ method ] :
          elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : jQuery( win ).scrollLeft(),
           top ? val : jQuery( win ).scrollTop()
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
    // margin is only for outerHeight, outerWidth
    jQuery.fn[ funcName ] = function( margin, value ) {
      var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
        extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

      return jQuery.access( this, function( elem, type, value ) {
        var doc;

        if ( jQuery.isWindow( elem ) ) {
          // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
          // isn't a whole lot we can do. See pull request at this URL for discussion:
          // https://github.com/jquery/jquery/pull/764
          return elem.document.documentElement[ "client" + name ];
        }

        // Get document width or height
        if ( elem.nodeType === 9 ) {
          doc = elem.documentElement;

          // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
          // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
          return Math.max(
            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
            elem.body[ "offset" + name ], doc[ "offset" + name ],
            doc[ "client" + name ]
          );
        }

        return value === undefined ?
          // Get width or height on the element, requesting but not forcing parseFloat
          jQuery.css( elem, type, value, extra ) :

          // Set width or height on the element
          jQuery.style( elem, type, value, extra );
      }, type, chainable ? margin : undefined, chainable, null );
    };
  });
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}

})( window );
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.2
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
function FastClick(layer, options) {
  'use strict';
  var oldOnClick;

  options = options || {};

  /**
   * Whether a click is currently being tracked.
   *
   * @type boolean
   */
  this.trackingClick = false;


  /**
   * Timestamp for when click tracking started.
   *
   * @type number
   */
  this.trackingClickStart = 0;


  /**
   * The element being tracked for a click.
   *
   * @type EventTarget
   */
  this.targetElement = null;


  /**
   * X-coordinate of touch start event.
   *
   * @type number
   */
  this.touchStartX = 0;


  /**
   * Y-coordinate of touch start event.
   *
   * @type number
   */
  this.touchStartY = 0;


  /**
   * ID of the last touch, retrieved from Touch.identifier.
   *
   * @type number
   */
  this.lastTouchIdentifier = 0;


  /**
   * Touchmove boundary, beyond which a click will be cancelled.
   *
   * @type number
   */
  this.touchBoundary = options.touchBoundary || 10;


  /**
   * The FastClick layer.
   *
   * @type Element
   */
  this.layer = layer;

  /**
   * The minimum time between tap(touchstart and touchend) events
   *
   * @type number
   */
  this.tapDelay = options.tapDelay || 200;

  if (FastClick.notNeeded(layer)) {
    return;
  }

  // Some old versions of Android don't have Function.prototype.bind
  function bind(method, context) {
    return function() { return method.apply(context, arguments); };
  }


  var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
  var context = this;
  for (var i = 0, l = methods.length; i < l; i++) {
    context[methods[i]] = bind(context[methods[i]], context);
  }

  // Set up event handlers as required
  if (deviceIsAndroid) {
    layer.addEventListener('mouseover', this.onMouse, true);
    layer.addEventListener('mousedown', this.onMouse, true);
    layer.addEventListener('mouseup', this.onMouse, true);
  }

  layer.addEventListener('click', this.onClick, true);
  layer.addEventListener('touchstart', this.onTouchStart, false);
  layer.addEventListener('touchmove', this.onTouchMove, false);
  layer.addEventListener('touchend', this.onTouchEnd, false);
  layer.addEventListener('touchcancel', this.onTouchCancel, false);

  // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
  // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
  // layer when they are cancelled.
  if (!Event.prototype.stopImmediatePropagation) {
    layer.removeEventListener = function(type, callback, capture) {
      var rmv = Node.prototype.removeEventListener;
      if (type === 'click') {
        rmv.call(layer, type, callback.hijacked || callback, capture);
      } else {
        rmv.call(layer, type, callback, capture);
      }
    };

    layer.addEventListener = function(type, callback, capture) {
      var adv = Node.prototype.addEventListener;
      if (type === 'click') {
        adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
          if (!event.propagationStopped) {
            callback(event);
          }
        }), capture);
      } else {
        adv.call(layer, type, callback, capture);
      }
    };
  }

  // If a handler is already declared in the element's onclick attribute, it will be fired before
  // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
  // adding it as listener.
  if (typeof layer.onclick === 'function') {

    // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
    // - the old one won't work if passed to addEventListener directly.
    oldOnClick = layer.onclick;
    layer.addEventListener('click', function(event) {
      oldOnClick(event);
    }, false);
    layer.onclick = null;
  }
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);

/**
 * BlackBerry requires exceptions.
 *
 * @type boolean
 */
var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {

  // Don't send a synthetic click to disabled inputs (issue #62)
  case 'button':
  case 'select':
  case 'textarea':
    if (target.disabled) {
      return true;
    }

    break;
  case 'input':

    // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
    if ((deviceIsIOS && target.type === 'file') || target.disabled) {
      return true;
    }

    break;
  case 'label':
  case 'video':
    return true;
  }

  return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
  'use strict';
  switch (target.nodeName.toLowerCase()) {
  case 'textarea':
    return true;
  case 'select':
    return !deviceIsAndroid;
  case 'input':
    switch (target.type) {
    case 'button':
    case 'checkbox':
    case 'file':
    case 'image':
    case 'radio':
    case 'submit':
      return false;
    }

    // No point in attempting to focus disabled inputs
    return !target.disabled && !target.readOnly;
  default:
    return (/\bneedsfocus\b/).test(target.className);
  }
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
  'use strict';
  var clickEvent, touch;

  // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
  if (document.activeElement && document.activeElement !== targetElement) {
    document.activeElement.blur();
  }

  touch = event.changedTouches[0];

  // Synthesise a click event, with an extra attribute so it can be tracked
  clickEvent = document.createEvent('MouseEvents');
  clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
  clickEvent.forwardedTouchEvent = true;
  targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
  'use strict';

  //Issue #159: Android Chrome Select Box does not open with a synthetic click event
  if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
    return 'mousedown';
  }

  return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
  'use strict';
  var length;

  // Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
  if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
    length = targetElement.value.length;
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
  'use strict';
  var scrollParent, parentElement;

  scrollParent = targetElement.fastClickScrollParent;

  // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
  // target element was moved to another parent.
  if (!scrollParent || !scrollParent.contains(targetElement)) {
    parentElement = targetElement;
    do {
      if (parentElement.scrollHeight > parentElement.offsetHeight) {
        scrollParent = parentElement;
        targetElement.fastClickScrollParent = parentElement;
        break;
      }

      parentElement = parentElement.parentElement;
    } while (parentElement);
  }

  // Always update the scroll top tracker if possible.
  if (scrollParent) {
    scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
  }
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
  'use strict';

  // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
  if (eventTarget.nodeType === Node.TEXT_NODE) {
    return eventTarget.parentNode;
  }

  return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
  'use strict';
  var targetElement, touch, selection;

  // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
  if (event.targetTouches.length > 1) {
    return true;
  }

  targetElement = this.getTargetElementFromEventTarget(event.target);
  touch = event.targetTouches[0];

  if (deviceIsIOS) {

    // Only trusted events will deselect text on iOS (issue #49)
    selection = window.getSelection();
    if (selection.rangeCount && !selection.isCollapsed) {
      return true;
    }

    if (!deviceIsIOS4) {

      // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
      // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
      // with the same identifier as the touch event that previously triggered the click that triggered the alert.
      // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
      // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
      if (touch.identifier === this.lastTouchIdentifier) {
        event.preventDefault();
        return false;
      }

      this.lastTouchIdentifier = touch.identifier;

      // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
      // 1) the user does a fling scroll on the scrollable layer
      // 2) the user stops the fling scroll with another tap
      // then the event.target of the last 'touchend' event will be the element that was under the user's finger
      // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
      // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
      this.updateScrollParent(targetElement);
    }
  }

  this.trackingClick = true;
  this.trackingClickStart = event.timeStamp;
  this.targetElement = targetElement;

  this.touchStartX = touch.pageX;
  this.touchStartY = touch.pageY;

  // Prevent phantom clicks on fast double-tap (issue #36)
  if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
    event.preventDefault();
  }

  return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
  'use strict';
  var touch = event.changedTouches[0], boundary = this.touchBoundary;

  if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
    return true;
  }

  return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
  'use strict';
  if (!this.trackingClick) {
    return true;
  }

  // If the touch has moved, cancel the click tracking
  if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
    this.trackingClick = false;
    this.targetElement = null;
  }

  return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
  'use strict';

  // Fast path for newer browsers supporting the HTML5 control attribute
  if (labelElement.control !== undefined) {
    return labelElement.control;
  }

  // All browsers under test that support touch events also support the HTML5 htmlFor attribute
  if (labelElement.htmlFor) {
    return document.getElementById(labelElement.htmlFor);
  }

  // If no for attribute exists, attempt to retrieve the first labellable descendant element
  // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
  return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
  'use strict';
  var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

  if (!this.trackingClick) {
    return true;
  }

  // Prevent phantom clicks on fast double-tap (issue #36)
  if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
    this.cancelNextClick = true;
    return true;
  }

  // Reset to prevent wrong click cancel on input (issue #156).
  this.cancelNextClick = false;

  this.lastClickTime = event.timeStamp;

  trackingClickStart = this.trackingClickStart;
  this.trackingClick = false;
  this.trackingClickStart = 0;

  // On some iOS devices, the targetElement supplied with the event is invalid if the layer
  // is performing a transition or scroll, and has to be re-detected manually. Note that
  // for this to function correctly, it must be called *after* the event target is checked!
  // See issue #57; also filed as rdar://13048589 .
  if (deviceIsIOSWithBadTarget) {
    touch = event.changedTouches[0];

    // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
    targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
    targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
  }

  targetTagName = targetElement.tagName.toLowerCase();
  if (targetTagName === 'label') {
    forElement = this.findControl(targetElement);
    if (forElement) {
      this.focus(targetElement);
      if (deviceIsAndroid) {
        return false;
      }

      targetElement = forElement;
    }
  } else if (this.needsFocus(targetElement)) {

    // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
    // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
    if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
      this.targetElement = null;
      return false;
    }

    this.focus(targetElement);
    this.sendClick(targetElement, event);

    // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
    // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
    if (!deviceIsIOS || targetTagName !== 'select') {
      this.targetElement = null;
      event.preventDefault();
    }

    return false;
  }

  if (deviceIsIOS && !deviceIsIOS4) {

    // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
    // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
    scrollParent = targetElement.fastClickScrollParent;
    if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
      return true;
    }
  }

  // Prevent the actual click from going though - unless the target node is marked as requiring
  // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
  if (!this.needsClick(targetElement)) {
    event.preventDefault();
    this.sendClick(targetElement, event);
  }

  return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
  'use strict';
  this.trackingClick = false;
  this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
  'use strict';

  // If a target element was never set (because a touch event was never fired) allow the event
  if (!this.targetElement) {
    return true;
  }

  if (event.forwardedTouchEvent) {
    return true;
  }

  // Programmatically generated events targeting a specific element should be permitted
  if (!event.cancelable) {
    return true;
  }

  // Derive and check the target element to see whether the mouse event needs to be permitted;
  // unless explicitly enabled, prevent non-touch click events from triggering actions,
  // to prevent ghost/doubleclicks.
  if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

    // Prevent any user-added listeners declared on FastClick element from being fired.
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else {

      // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
      event.propagationStopped = true;
    }

    // Cancel the event
    event.stopPropagation();
    event.preventDefault();

    return false;
  }

  // If the mouse event is permitted, return true for the action to go through.
  return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
  'use strict';
  var permitted;

  // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
  if (this.trackingClick) {
    this.targetElement = null;
    this.trackingClick = false;
    return true;
  }

  // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
  if (event.target.type === 'submit' && event.detail === 0) {
    return true;
  }

  permitted = this.onMouse(event);

  // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
  if (!permitted) {
    this.targetElement = null;
  }

  // If clicks are permitted, return true for the action to go through.
  return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
  'use strict';
  var layer = this.layer;

  if (deviceIsAndroid) {
    layer.removeEventListener('mouseover', this.onMouse, true);
    layer.removeEventListener('mousedown', this.onMouse, true);
    layer.removeEventListener('mouseup', this.onMouse, true);
  }

  layer.removeEventListener('click', this.onClick, true);
  layer.removeEventListener('touchstart', this.onTouchStart, false);
  layer.removeEventListener('touchmove', this.onTouchMove, false);
  layer.removeEventListener('touchend', this.onTouchEnd, false);
  layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
  'use strict';
  var metaViewport;
  var chromeVersion;
  var blackberryVersion;

  // Devices that don't support touch don't need FastClick
  if (typeof window.ontouchstart === 'undefined') {
    return true;
  }

  // Chrome version - zero for other browsers
  chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

  if (chromeVersion) {

    if (deviceIsAndroid) {
      metaViewport = document.querySelector('meta[name=viewport]');

      if (metaViewport) {
        // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
          return true;
        }
        // Chrome 32 and above with width=device-width or less don't need FastClick
        if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
          return true;
        }
      }

    // Chrome desktop doesn't need FastClick (issue #15)
    } else {
      return true;
    }
  }

  if (deviceIsBlackBerry10) {
    blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);
    
    // BlackBerry 10.3+ does not require Fastclick library.
    // https://github.com/ftlabs/fastclick/issues/251
    if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
      metaViewport = document.querySelector('meta[name=viewport]');

      if (metaViewport) {
        // user-scalable=no eliminates click delay.
        if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
          return true;
        }
        // width=device-width (or less than device-width) eliminates click delay.
        if (document.documentElement.scrollWidth <= window.outerWidth) {
          return true;
        }
      }
    }
  }
  
  // IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
  if (layer.style.msTouchAction === 'none') {
    return true;
  }

  return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} options The options to override the defaults
 */
FastClick.attach = function(layer, options) {
  'use strict';
  return new FastClick(layer, options);
};


if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {

  // AMD. Register as an anonymous module.
  define(function() {
    'use strict';
    return FastClick;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = FastClick.attach;
  module.exports.FastClick = FastClick;
} else {
  window.FastClick = FastClick;
}
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Internal function: creates a callback bound to its context if supplied
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iterator, context) {
    var i, length;
    if (obj == null) return obj;
    iterator = createCallback(iterator, context);
    if (obj.length === +obj.length) {
      for (i = 0, length = obj.length; i < length; i++) {
        if (iterator(obj[i], i, obj) === breaker) break;
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        if (iterator(obj[keys[i]], keys[i], obj) === breaker) break;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    iterator = lookupIterator(iterator, context);
    _.each(obj, function(value, index, list) {
      results.push(iterator(value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    iterator = createCallback(iterator, context, 4);
    _.each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator(memo, value, index, list);
      }
    });
    if (!initial) throw TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    var length = obj.length;
    iterator = createCallback(iterator, context, 4);
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    _.each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator(memo, obj[index], index, list);
      }
    });
    if (!initial) throw TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = lookupIterator(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = lookupIterator(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(lookupIterator(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    var result = true;
    if (obj == null) return result;
    predicate = lookupIterator(predicate, context);
    _.each(obj, function(value, index, list) {
      result = predicate(value, index, list);
      if (!result) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    var result = false;
    if (obj == null) return result;
    predicate = lookupIterator(predicate, context);
    _.each(obj, function(value, index, list) {
      result = predicate(value, index, list);
      if (result) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length === +obj.length) return _.indexOf(obj, target) >= 0;
    return _.some(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iterator, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (!iterator && _.isArray(obj)) {
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iterator = lookupIterator(iterator, context);
      _.each(obj, function(value, index, list) {
        computed = iterator(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (!iterator && _.isArray(obj)) {
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iterator = lookupIterator(iterator, context);
      _.each(obj, function(value, index, list) {
        computed = iterator(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    _.each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator, context);
      _.each(obj, function(value, index) {
        var key = iterator(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator, context, 1);
    var value = iterator(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      if (iterator(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = lookupIterator(predicate, context, 1);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (array == null) return [];
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    if (iterator) iterator = lookupIterator(iterator, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (iterator) value = iterator(value, i, array);
      if (isSorted ? !i || seen !== value : !_.contains(seen, value)) {
        if (isSorted) seen = value;
        else seen.push(value);
        result.push(array[i]);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var i = from == null ? array.length : from;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = Array(length);

    while (idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i = 1, length = arguments.length, key;
    if (length <= 1) throw Error('bindAll must be passed function names');
    for (; i < length; i++) {
      key = arguments[i];
      obj[key] = createCallback(obj[key], obj, Infinity);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    if (!hasher) hasher = _.identity;
    var memoize = function() {
      var cache = memoize.cache;
      var key = hasher.apply(this, arguments);
      if (!_.has(cache, key)) cache[key] = func.apply(this, arguments);
      return cache[key];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iterator, context) {
    var result = {}, key;
    if (_.isFunction(iterator)) {
      for (key in obj) {
        var value = obj[key];
        if (iterator.call(context, value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iterator, context) {
    var keys;
    if (_.isFunction(iterator)) {
      iterator = _.negate(iterator);
    } else {
      keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iterator = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iterator, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    _.each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (a != +a) return b != +b;
        // An `egal` comparison is performed for other numeric values.
        return a == 0 ? 1 / a == 1 / b : a == +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length == size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj == null) return _.isEmpty(attrs);
      if (obj === attrs) return true;
      for (var key in attrs) if (attrs[key] !== obj[key]) return false;
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    iterator = createCallback(iterator, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iterator(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
(function(t, e) {
    if (typeof define === "function" && define.amd) {
        define(["underscore", "jquery", "exports"], function(i, r, s) {
            t.Backbone = e(t, s, i, r)
        })
    } else if (typeof exports !== "undefined") {
        var i = require("underscore");
        e(t, exports, i)
    } else {
        t.Backbone = e(t, {}, t._, t.jQuery || t.Zepto || t.ender || t.$)
    }
})(this, function(t, e, i, r) {
    var s = t.Backbone;
    var n = [];
    var a = n.push;
    var o = n.slice;
    var h = n.splice;
    e.VERSION = "1.1.2";
    e.$ = r;
    e.noConflict = function() {
        t.Backbone = s;
        return this
    };
    e.emulateHTTP = false;
    e.emulateJSON = false;
    var u = e.Events = {
        on: function(t, e, i) {
            if (!c(this, "on", t, [e, i]) || !e) return this;
            this._events || (this._events = {});
            var r = this._events[t] || (this._events[t] = []);
            r.push({
                callback: e,
                context: i,
                ctx: i || this
            });
            return this
        },
        once: function(t, e, r) {
            if (!c(this, "once", t, [e, r]) || !e) return this;
            var s = this;
            var n = i.once(function() {
                s.off(t, n);
                e.apply(this, arguments)
            });
            n._callback = e;
            return this.on(t, n, r)
        },
        off: function(t, e, r) {
            var s, n, a, o, h, u, l, f;
            if (!this._events || !c(this, "off", t, [e, r])) return this;
            if (!t && !e && !r) {
                this._events = void 0;
                return this
            }
            o = t ? [t] : i.keys(this._events);
            for (h = 0, u = o.length; h < u; h++) {
                t = o[h];
                if (a = this._events[t]) {
                    this._events[t] = s = [];
                    if (e || r) {
                        for (l = 0, f = a.length; l < f; l++) {
                            n = a[l];
                            if (e && e !== n.callback && e !== n.callback._callback || r && r !== n.context) {
                                s.push(n)
                            }
                        }
                    }
                    if (!s.length) delete this._events[t]
                }
            }
            return this
        },
        trigger: function(t) {
            if (!this._events) return this;
            var e = o.call(arguments, 1);
            if (!c(this, "trigger", t, e)) return this;
            var i = this._events[t];
            var r = this._events.all;
            if (i) f(i, e);
            if (r) f(r, arguments);
            return this
        },
        stopListening: function(t, e, r) {
            var s = this._listeningTo;
            if (!s) return this;
            var n = !e && !r;
            if (!r && typeof e === "object") r = this;
            if (t)(s = {})[t._listenId] = t;
            for (var a in s) {
                t = s[a];
                t.off(e, r, this);
                if (n || i.isEmpty(t._events)) delete this._listeningTo[a]
            }
            return this
        }
    };
    var l = /\s+/;
    var c = function(t, e, i, r) {
        if (!i) return true;
        if (typeof i === "object") {
            for (var s in i) {
                t[e].apply(t, [s, i[s]].concat(r))
            }
            return false
        }
        if (l.test(i)) {
            var n = i.split(l);
            for (var a = 0, o = n.length; a < o; a++) {
                t[e].apply(t, [n[a]].concat(r))
            }
            return false
        }
        return true
    };
    var f = function(t, e) {
        var i, r = -1,
            s = t.length,
            n = e[0],
            a = e[1],
            o = e[2];
        switch (e.length) {
            case 0:
                while (++r < s)(i = t[r]).callback.call(i.ctx);
                return;
            case 1:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n);
                return;
            case 2:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n, a);
                return;
            case 3:
                while (++r < s)(i = t[r]).callback.call(i.ctx, n, a, o);
                return;
            default:
                while (++r < s)(i = t[r]).callback.apply(i.ctx, e);
                return
        }
    };
    var d = {
        listenTo: "on",
        listenToOnce: "once"
    };
    i.each(d, function(t, e) {
        u[e] = function(e, r, s) {
            var n = this._listeningTo || (this._listeningTo = {});
            var a = e._listenId || (e._listenId = i.uniqueId("l"));
            n[a] = e;
            if (!s && typeof r === "object") s = this;
            e[t](r, s, this);
            return this
        }
    });
    u.bind = u.on;
    u.unbind = u.off;
    i.extend(e, u);
    var p = e.Model = function(t, e) {
        var r = t || {};
        e || (e = {});
        this.cid = i.uniqueId("c");
        this.attributes = {};
        if (e.collection) this.collection = e.collection;
        if (e.parse) r = this.parse(r, e) || {};
        r = i.defaults({}, r, i.result(this, "defaults"));
        this.set(r, e);
        this.changed = {};
        this.initialize.apply(this, arguments)
    };
    i.extend(p.prototype, u, {
        changed: null,
        validationError: null,
        idAttribute: "id",
        initialize: function() {},
        toJSON: function(t) {
            return i.clone(this.attributes)
        },
        sync: function() {
            return e.sync.apply(this, arguments)
        },
        get: function(t) {
            return this.attributes[t]
        },
        escape: function(t) {
            return i.escape(this.get(t))
        },
        has: function(t) {
            return this.get(t) != null
        },
        set: function(t, e, r) {
            var s, n, a, o, h, u, l, c;
            if (t == null) return this;
            if (typeof t === "object") {
                n = t;
                r = e
            } else {
                (n = {})[t] = e
            }
            r || (r = {});
            if (!this._validate(n, r)) return false;
            a = r.unset;
            h = r.silent;
            o = [];
            u = this._changing;
            this._changing = true;
            if (!u) {
                this._previousAttributes = i.clone(this.attributes);
                this.changed = {}
            }
            c = this.attributes, l = this._previousAttributes;
            if (this.idAttribute in n) this.id = n[this.idAttribute];
            for (s in n) {
                e = n[s];
                if (!i.isEqual(c[s], e)) o.push(s);
                if (!i.isEqual(l[s], e)) {
                    this.changed[s] = e
                } else {
                    delete this.changed[s]
                }
                a ? delete c[s] : c[s] = e
            }
            if (!h) {
                if (o.length) this._pending = r;
                for (var f = 0, d = o.length; f < d; f++) {
                    this.trigger("change:" + o[f], this, c[o[f]], r)
                }
            }
            if (u) return this;
            if (!h) {
                while (this._pending) {
                    r = this._pending;
                    this._pending = false;
                    this.trigger("change", this, r)
                }
            }
            this._pending = false;
            this._changing = false;
            return this
        },
        unset: function(t, e) {
            return this.set(t, void 0, i.extend({}, e, {
                unset: true
            }))
        },
        clear: function(t) {
            var e = {};
            for (var r in this.attributes) e[r] = void 0;
            return this.set(e, i.extend({}, t, {
                unset: true
            }))
        },
        hasChanged: function(t) {
            if (t == null) return !i.isEmpty(this.changed);
            return i.has(this.changed, t)
        },
        changedAttributes: function(t) {
            if (!t) return this.hasChanged() ? i.clone(this.changed) : false;
            var e, r = false;
            var s = this._changing ? this._previousAttributes : this.attributes;
            for (var n in t) {
                if (i.isEqual(s[n], e = t[n])) continue;
                (r || (r = {}))[n] = e
            }
            return r
        },
        previous: function(t) {
            if (t == null || !this._previousAttributes) return null;
            return this._previousAttributes[t]
        },
        previousAttributes: function() {
            return i.clone(this._previousAttributes)
        },
        fetch: function(t) {
            t = t ? i.clone(t) : {};
            if (t.parse === void 0) t.parse = true;
            var e = this;
            var r = t.success;
            t.success = function(i) {
                if (!e.set(e.parse(i, t), t)) return false;
                if (r) r(e, i, t);
                e.trigger("sync", e, i, t)
            };
            q(this, t);
            return this.sync("read", this, t)
        },
        save: function(t, e, r) {
            var s, n, a, o = this.attributes;
            if (t == null || typeof t === "object") {
                s = t;
                r = e
            } else {
                (s = {})[t] = e
            }
            r = i.extend({
                validate: true
            }, r);
            if (s && !r.wait) {
                if (!this.set(s, r)) return false
            } else {
                if (!this._validate(s, r)) return false
            } if (s && r.wait) {
                this.attributes = i.extend({}, o, s)
            }
            if (r.parse === void 0) r.parse = true;
            var h = this;
            var u = r.success;
            r.success = function(t) {
                h.attributes = o;
                var e = h.parse(t, r);
                if (r.wait) e = i.extend(s || {}, e);
                if (i.isObject(e) && !h.set(e, r)) {
                    return false
                }
                if (u) u(h, t, r);
                h.trigger("sync", h, t, r)
            };
            q(this, r);
            n = this.isNew() ? "create" : r.patch ? "patch" : "update";
            if (n === "patch") r.attrs = s;
            a = this.sync(n, this, r);
            if (s && r.wait) this.attributes = o;
            return a
        },
        destroy: function(t) {
            t = t ? i.clone(t) : {};
            var e = this;
            var r = t.success;
            var s = function() {
                e.trigger("destroy", e, e.collection, t)
            };
            t.success = function(i) {
                if (t.wait || e.isNew()) s();
                if (r) r(e, i, t);
                if (!e.isNew()) e.trigger("sync", e, i, t)
            };
            if (this.isNew()) {
                t.success();
                return false
            }
            q(this, t);
            var n = this.sync("delete", this, t);
            if (!t.wait) s();
            return n
        },
        url: function() {
            var t = i.result(this, "urlRoot") || i.result(this.collection, "url") || M();
            if (this.isNew()) return t;
            return t.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
        },
        parse: function(t, e) {
            return t
        },
        clone: function() {
            return new this.constructor(this.attributes)
        },
        isNew: function() {
            return !this.has(this.idAttribute)
        },
        isValid: function(t) {
            return this._validate({}, i.extend(t || {}, {
                validate: true
            }))
        },
        _validate: function(t, e) {
            if (!e.validate || !this.validate) return true;
            t = i.extend({}, this.attributes, t);
            var r = this.validationError = this.validate(t, e) || null;
            if (!r) return true;
            this.trigger("invalid", this, r, i.extend(e, {
                validationError: r
            }));
            return false
        }
    });
    var v = ["keys", "values", "pairs", "invert", "pick", "omit"];
    i.each(v, function(t) {
        p.prototype[t] = function() {
            var e = o.call(arguments);
            e.unshift(this.attributes);
            return i[t].apply(i, e)
        }
    });
    var g = e.Collection = function(t, e) {
        e || (e = {});
        if (e.model) this.model = e.model;
        if (e.comparator !== void 0) this.comparator = e.comparator;
        this._reset();
        this.initialize.apply(this, arguments);
        if (t) this.reset(t, i.extend({
            silent: true
        }, e))
    };
    var m = {
        add: true,
        remove: true,
        merge: true
    };
    var y = {
        add: true,
        remove: false
    };
    i.extend(g.prototype, u, {
        model: p,
        initialize: function() {},
        toJSON: function(t) {
            return this.map(function(e) {
                return e.toJSON(t)
            })
        },
        sync: function() {
            return e.sync.apply(this, arguments)
        },
        add: function(t, e) {
            return this.set(t, i.extend({
                merge: false
            }, e, y))
        },
        remove: function(t, e) {
            var r = !i.isArray(t);
            t = r ? [t] : i.clone(t);
            e || (e = {});
            var s, n, a, o;
            for (s = 0, n = t.length; s < n; s++) {
                o = t[s] = this.get(t[s]);
                if (!o) continue;
                delete this._byId[o.id];
                delete this._byId[o.cid];
                a = this.indexOf(o);
                this.models.splice(a, 1);
                this.length--;
                if (!e.silent) {
                    e.index = a;
                    o.trigger("remove", o, this, e)
                }
                this._removeReference(o, e)
            }
            return r ? t[0] : t
        },
        set: function(t, e) {
            e = i.defaults({}, e, m);
            if (e.parse) t = this.parse(t, e);
            var r = !i.isArray(t);
            t = r ? t ? [t] : [] : i.clone(t);
            var s, n, a, o, h, u, l;
            var c = e.at;
            var f = this.model;
            var d = this.comparator && c == null && e.sort !== false;
            var v = i.isString(this.comparator) ? this.comparator : null;
            var g = [],
                y = [],
                _ = {};
            var b = e.add,
                w = e.merge,
                x = e.remove;
            var E = !d && b && x ? [] : false;
            for (s = 0, n = t.length; s < n; s++) {
                h = t[s] || {};
                if (h instanceof p) {
                    a = o = h
                } else {
                    a = h[f.prototype.idAttribute || "id"]
                } if (u = this.get(a)) {
                    if (x) _[u.cid] = true;
                    if (w) {
                        h = h === o ? o.attributes : h;
                        if (e.parse) h = u.parse(h, e);
                        u.set(h, e);
                        if (d && !l && u.hasChanged(v)) l = true
                    }
                    t[s] = u
                } else if (b) {
                    o = t[s] = this._prepareModel(h, e);
                    if (!o) continue;
                    g.push(o);
                    this._addReference(o, e)
                }
                o = u || o;
                if (E && (o.isNew() || !_[o.id])) E.push(o);
                _[o.id] = true
            }
            if (x) {
                for (s = 0, n = this.length; s < n; ++s) {
                    if (!_[(o = this.models[s]).cid]) y.push(o)
                }
                if (y.length) this.remove(y, e)
            }
            if (g.length || E && E.length) {
                if (d) l = true;
                this.length += g.length;
                if (c != null) {
                    for (s = 0, n = g.length; s < n; s++) {
                        this.models.splice(c + s, 0, g[s])
                    }
                } else {
                    if (E) this.models.length = 0;
                    var k = E || g;
                    for (s = 0, n = k.length; s < n; s++) {
                        this.models.push(k[s])
                    }
                }
            }
            if (l) this.sort({
                silent: true
            });
            if (!e.silent) {
                for (s = 0, n = g.length; s < n; s++) {
                    (o = g[s]).trigger("add", o, this, e)
                }
                if (l || E && E.length) this.trigger("sort", this, e)
            }
            return r ? t[0] : t
        },
        reset: function(t, e) {
            e || (e = {});
            for (var r = 0, s = this.models.length; r < s; r++) {
                this._removeReference(this.models[r], e)
            }
            e.previousModels = this.models;
            this._reset();
            t = this.add(t, i.extend({
                silent: true
            }, e));
            if (!e.silent) this.trigger("reset", this, e);
            return t
        },
        push: function(t, e) {
            return this.add(t, i.extend({
                at: this.length
            }, e))
        },
        pop: function(t) {
            var e = this.at(this.length - 1);
            this.remove(e, t);
            return e
        },
        unshift: function(t, e) {
            return this.add(t, i.extend({
                at: 0
            }, e))
        },
        shift: function(t) {
            var e = this.at(0);
            this.remove(e, t);
            return e
        },
        slice: function() {
            return o.apply(this.models, arguments)
        },
        get: function(t) {
            if (t == null) return void 0;
            return this._byId[t] || this._byId[t.id] || this._byId[t.cid]
        },
        at: function(t) {
            return this.models[t]
        },
        where: function(t, e) {
            if (i.isEmpty(t)) return e ? void 0 : [];
            return this[e ? "find" : "filter"](function(e) {
                for (var i in t) {
                    if (t[i] !== e.get(i)) return false
                }
                return true
            })
        },
        findWhere: function(t) {
            return this.where(t, true)
        },
        sort: function(t) {
            if (!this.comparator) throw new Error("Cannot sort a set without a comparator");
            t || (t = {});
            if (i.isString(this.comparator) || this.comparator.length === 1) {
                this.models = this.sortBy(this.comparator, this)
            } else {
                this.models.sort(i.bind(this.comparator, this))
            } if (!t.silent) this.trigger("sort", this, t);
            return this
        },
        pluck: function(t) {
            return i.invoke(this.models, "get", t)
        },
        fetch: function(t) {
            t = t ? i.clone(t) : {};
            if (t.parse === void 0) t.parse = true;
            var e = t.success;
            var r = this;
            t.success = function(i) {
                var s = t.reset ? "reset" : "set";
                r[s](i, t);
                if (e) e(r, i, t);
                r.trigger("sync", r, i, t)
            };
            q(this, t);
            return this.sync("read", this, t)
        },
        create: function(t, e) {
            e = e ? i.clone(e) : {};
            if (!(t = this._prepareModel(t, e))) return false;
            if (!e.wait) this.add(t, e);
            var r = this;
            var s = e.success;
            e.success = function(t, i) {
                if (e.wait) r.add(t, e);
                if (s) s(t, i, e)
            };
            t.save(null, e);
            return t
        },
        parse: function(t, e) {
            return t
        },
        clone: function() {
            return new this.constructor(this.models)
        },
        _reset: function() {
            this.length = 0;
            this.models = [];
            this._byId = {}
        },
        _prepareModel: function(t, e) {
            if (t instanceof p) return t;
            e = e ? i.clone(e) : {};
            e.collection = this;
            var r = new this.model(t, e);
            if (!r.validationError) return r;
            this.trigger("invalid", this, r.validationError, e);
            return false
        },
        _addReference: function(t, e) {
            this._byId[t.cid] = t;
            if (t.id != null) this._byId[t.id] = t;
            if (!t.collection) t.collection = this;
            t.on("all", this._onModelEvent, this)
        },
        _removeReference: function(t, e) {
            if (this === t.collection) delete t.collection;
            t.off("all", this._onModelEvent, this)
        },
        _onModelEvent: function(t, e, i, r) {
            if ((t === "add" || t === "remove") && i !== this) return;
            if (t === "destroy") this.remove(e, r);
            if (e && t === "change:" + e.idAttribute) {
                delete this._byId[e.previous(e.idAttribute)];
                if (e.id != null) this._byId[e.id] = e
            }
            this.trigger.apply(this, arguments)
        }
    });
    var _ = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
    i.each(_, function(t) {
        g.prototype[t] = function() {
            var e = o.call(arguments);
            e.unshift(this.models);
            return i[t].apply(i, e)
        }
    });
    var b = ["groupBy", "countBy", "sortBy", "indexBy"];
    i.each(b, function(t) {
        g.prototype[t] = function(e, r) {
            var s = i.isFunction(e) ? e : function(t) {
                    return t.get(e)
                };
            return i[t](this.models, s, r)
        }
    });
    var w = e.View = function(t) {
        this.cid = i.uniqueId("view");
        t || (t = {});
        i.extend(this, i.pick(t, E));
        this._ensureElement();
        this.initialize.apply(this, arguments);
        this.delegateEvents()
    };
    var x = /^(\S+)\s*(.*)$/;
    var E = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
    i.extend(w.prototype, u, {
        tagName: "div",
        $: function(t) {
            return this.$el.find(t)
        },
        initialize: function() {},
        render: function() {
            return this
        },
        remove: function() {
            this.$el.remove();
            this.stopListening();
            return this
        },
        setElement: function(t, i) {
            if (this.$el) this.undelegateEvents();
            this.$el = t instanceof e.$ ? t : e.$(t);
            this.el = this.$el[0];
            if (i !== false) this.delegateEvents();
            return this
        },
        delegateEvents: function(t) {
            if (!(t || (t = i.result(this, "events")))) return this;
            this.undelegateEvents();
            for (var e in t) {
                var r = t[e];
                if (!i.isFunction(r)) r = this[t[e]];
                if (!r) continue;
                var s = e.match(x);
                var n = s[1],
                    a = s[2];
                r = i.bind(r, this);
                n += ".delegateEvents" + this.cid;
                if (a === "") {
                    this.$el.on(n, r)
                } else {
                    this.$el.on(n, a, r)
                }
            }
            return this
        },
        undelegateEvents: function() {
            this.$el.off(".delegateEvents" + this.cid);
            return this
        },
        _ensureElement: function() {
            if (!this.el) {
                var t = i.extend({}, i.result(this, "attributes"));
                if (this.id) t.id = i.result(this, "id");
                if (this.className) t["class"] = i.result(this, "className");
                var r = e.$("<" + i.result(this, "tagName") + ">").attr(t);
                this.setElement(r, false)
            } else {
                this.setElement(i.result(this, "el"), false)
            }
        }
    });
    e.sync = function(t, r, s) {
        var n = T[t];
        i.defaults(s || (s = {}), {
            emulateHTTP: e.emulateHTTP,
            emulateJSON: e.emulateJSON
        });
        var a = {
            type: n,
            dataType: "json"
        };
        if (!s.url) {
            a.url = i.result(r, "url") || M()
        }
        if (s.data == null && r && (t === "create" || t === "update" || t === "patch")) {
            a.contentType = "application/json";
            a.data = JSON.stringify(s.attrs || r.toJSON(s))
        }
        if (s.emulateJSON) {
            a.contentType = "application/x-www-form-urlencoded";
            a.data = a.data ? {
                model: a.data
            } : {}
        }
        if (s.emulateHTTP && (n === "PUT" || n === "DELETE" || n === "PATCH")) {
            a.type = "POST";
            if (s.emulateJSON) a.data._method = n;
            var o = s.beforeSend;
            s.beforeSend = function(t) {
                t.setRequestHeader("X-HTTP-Method-Override", n);
                if (o) return o.apply(this, arguments)
            }
        }
        if (a.type !== "GET" && !s.emulateJSON) {
            a.processData = false
        }
        if (a.type === "PATCH" && k) {
            a.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        var h = s.xhr = e.ajax(i.extend(a, s));
        r.trigger("request", r, h, s);
        return h
    };
    var k = typeof window !== "undefined" && !! window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);
    var T = {
        create: "POST",
        update: "PUT",
        patch: "PATCH",
        "delete": "DELETE",
        read: "GET"
    };
    e.ajax = function() {
        return e.$.ajax.apply(e.$, arguments)
    };
    var $ = e.Router = function(t) {
        t || (t = {});
        if (t.routes) this.routes = t.routes;
        this._bindRoutes();
        this.initialize.apply(this, arguments)
    };
    var S = /\((.*?)\)/g;
    var H = /(\(\?)?:\w+/g;
    var A = /\*\w+/g;
    var I = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    i.extend($.prototype, u, {
        initialize: function() {},
        route: function(t, r, s) {
            if (!i.isRegExp(t)) t = this._routeToRegExp(t);
            if (i.isFunction(r)) {
                s = r;
                r = ""
            }
            if (!s) s = this[r];
            var n = this;
            e.history.route(t, function(i) {
                var a = n._extractParameters(t, i);
                n.execute(s, a);
                n.trigger.apply(n, ["route:" + r].concat(a));
                n.trigger("route", r, a);
                e.history.trigger("route", n, r, a)
            });
            return this
        },
        execute: function(t, e) {
            if (t) t.apply(this, e)
        },
        navigate: function(t, i) {
            e.history.navigate(t, i);
            return this
        },
        _bindRoutes: function() {
            if (!this.routes) return;
            this.routes = i.result(this, "routes");
            var t, e = i.keys(this.routes);
            while ((t = e.pop()) != null) {
                this.route(t, this.routes[t])
            }
        },
        _routeToRegExp: function(t) {
            t = t.replace(I, "\\$&").replace(S, "(?:$1)?").replace(H, function(t, e) {
                return e ? t : "([^/?]+)"
            }).replace(A, "([^?]*?)");
            return new RegExp("^" + t + "(?:\\?([\\s\\S]*))?$")
        },
        _extractParameters: function(t, e) {
            var r = t.exec(e).slice(1);
            return i.map(r, function(t, e) {
                if (e === r.length - 1) return t || null;
                return t ? decodeURIComponent(t) : null
            })
        }
    });
    var N = e.History = function() {
        this.handlers = [];
        i.bindAll(this, "checkUrl");
        if (typeof window !== "undefined") {
            this.location = window.location;
            this.history = window.history
        }
    };
    var R = /^[#\/]|\s+$/g;
    var O = /^\/+|\/+$/g;
    var P = /msie [\w.]+/;
    var C = /\/$/;
    var j = /#.*$/;
    N.started = false;
    i.extend(N.prototype, u, {
        interval: 50,
        atRoot: function() {
            return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
        },
        getHash: function(t) {
            var e = (t || this).location.href.match(/#(.*)$/);
            return e ? e[1] : ""
        },
        getFragment: function(t, e) {
            if (t == null) {
                if (this._hasPushState || !this._wantsHashChange || e) {
                    t = decodeURI(this.location.pathname + this.location.search);
                    var i = this.root.replace(C, "");
                    if (!t.indexOf(i)) t = t.slice(i.length)
                } else {
                    t = this.getHash()
                }
            }
            return t.replace(R, "")
        },
        start: function(t) {
            if (N.started) throw new Error("Backbone.history has already been started");
            N.started = true;
            this.options = i.extend({
                root: "/"
            }, this.options, t);
            this.root = this.options.root;
            this._wantsHashChange = this.options.hashChange !== false;
            this._wantsPushState = !! this.options.pushState;
            this._hasPushState = !! (this.options.pushState && this.history && this.history.pushState);
            var r = this.getFragment();
            var s = document.documentMode;
            var n = P.exec(navigator.userAgent.toLowerCase()) && (!s || s <= 7);
            this.root = ("/" + this.root + "/").replace(O, "/");
            if (n && this._wantsHashChange) {
                var a = e.$('<iframe src="javascript:0" tabindex="-1">');
                this.iframe = a.hide().appendTo("body")[0].contentWindow;
                this.navigate(r)
            }
            if (this._hasPushState) {
                e.$(window).on("popstate", this.checkUrl)
            } else if (this._wantsHashChange && "onhashchange" in window && !n) {
                e.$(window).on("hashchange", this.checkUrl)
            } else if (this._wantsHashChange) {
                this._checkUrlInterval = setInterval(this.checkUrl, this.interval)
            }
            this.fragment = r;
            var o = this.location;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !this.atRoot()) {
                    this.fragment = this.getFragment(null, true);
                    this.location.replace(this.root + "#" + this.fragment);
                    return true
                } else if (this._hasPushState && this.atRoot() && o.hash) {
                    this.fragment = this.getHash().replace(R, "");
                    this.history.replaceState({}, document.title, this.root + this.fragment)
                }
            }
            if (!this.options.silent) return this.loadUrl()
        },
        stop: function() {
            e.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl);
            if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
            N.started = false
        },
        route: function(t, e) {
            this.handlers.unshift({
                route: t,
                callback: e
            })
        },
        checkUrl: function(t) {
            var e = this.getFragment();
            if (e === this.fragment && this.iframe) {
                e = this.getFragment(this.getHash(this.iframe))
            }
            if (e === this.fragment) return false;
            if (this.iframe) this.navigate(e);
            this.loadUrl()
        },
        loadUrl: function(t) {
            t = this.fragment = this.getFragment(t);
            return i.any(this.handlers, function(e) {
                if (e.route.test(t)) {
                    e.callback(t);
                    return true
                }
            })
        },
        navigate: function(t, e) {
            if (!N.started) return false;
            if (!e || e === true) e = {
                trigger: !! e
            };
            var i = this.root + (t = this.getFragment(t || ""));
            t = t.replace(j, "");
            if (this.fragment === t) return;
            this.fragment = t;
            if (t === "" && i !== "/") i = i.slice(0, -1);
            if (this._hasPushState) {
                this.history[e.replace ? "replaceState" : "pushState"]({}, document.title, i)
            } else if (this._wantsHashChange) {
                this._updateHash(this.location, t, e.replace);
                if (this.iframe && t !== this.getFragment(this.getHash(this.iframe))) {
                    if (!e.replace) this.iframe.document.open().close();
                    this._updateHash(this.iframe.location, t, e.replace)
                }
            } else {
                return this.location.assign(i)
            } if (e.trigger) return this.loadUrl(t)
        },
        _updateHash: function(t, e, i) {
            if (i) {
                var r = t.href.replace(/(javascript:|#).*$/, "");
                t.replace(r + "#" + e)
            } else {
                t.hash = "#" + e
            }
        }
    });
    e.history = new N;
    var U = function(t, e) {
        var r = this;
        var s;
        if (t && i.has(t, "constructor")) {
            s = t.constructor
        } else {
            s = function() {
                return r.apply(this, arguments)
            }
        }
        i.extend(s, r, e);
        var n = function() {
            this.constructor = s
        };
        n.prototype = r.prototype;
        s.prototype = new n;
        if (t) i.extend(s.prototype, t);
        s.__super__ = r.prototype;
        return s
    };
    p.extend = g.extend = $.extend = w.extend = N.extend = U;
    var M = function() {
        throw new Error('A "url" property or function must be specified')
    };
    var q = function(t, e) {
        var i = e.error;
        e.error = function(r) {
            if (i) i(t, r, e);
            t.trigger("error", t, r, e)
        }
    };
    return e
});
//# sourceMappingURL=backbone-min.map
/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= q.concurrency; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
          return a.priority - b.priority;
        };

        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }

        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };

              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());
//! moment.js
//! version : 2.5.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function(a) {
    function b() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1
        }
    }

    function c(a, b) {
        return function(c) {
            return k(a.call(this, c), b)
        }
    }

    function d(a, b) {
        return function(c) {
            return this.lang().ordinal(a.call(this, c), b)
        }
    }

    function e() {}

    function f(a) {
        w(a), h(this, a)
    }

    function g(a) {
        var b = q(a),
            c = b.year || 0,
            d = b.month || 0,
            e = b.week || 0,
            f = b.day || 0,
            g = b.hour || 0,
            h = b.minute || 0,
            i = b.second || 0,
            j = b.millisecond || 0;
        this._milliseconds = +j + 1e3 * i + 6e4 * h + 36e5 * g, this._days = +f + 7 * e, this._months = +d + 12 * c, this._data = {}, this._bubble()
    }

    function h(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
        return b.hasOwnProperty("toString") && (a.toString = b.toString), b.hasOwnProperty("valueOf") && (a.valueOf = b.valueOf), a
    }

    function i(a) {
        var b, c = {};
        for (b in a) a.hasOwnProperty(b) && qb.hasOwnProperty(b) && (c[b] = a[b]);
        return c
    }

    function j(a) {
        return 0 > a ? Math.ceil(a) : Math.floor(a)
    }

    function k(a, b, c) {
        for (var d = "" + Math.abs(a), e = a >= 0; d.length < b;) d = "0" + d;
        return (e ? c ? "+" : "" : "-") + d
    }

    function l(a, b, c, d) {
        var e, f, g = b._milliseconds,
            h = b._days,
            i = b._months;
        g && a._d.setTime(+a._d + g * c), (h || i) && (e = a.minute(), f = a.hour()), h && a.date(a.date() + h * c), i && a.month(a.month() + i * c), g && !d && db.updateOffset(a), (h || i) && (a.minute(e), a.hour(f))
    }

    function m(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    }

    function n(a) {
        return "[object Date]" === Object.prototype.toString.call(a) || a instanceof Date
    }

    function o(a, b, c) {
        var d, e = Math.min(a.length, b.length),
            f = Math.abs(a.length - b.length),
            g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && s(a[d]) !== s(b[d])) && g++;
        return g + f
    }

    function p(a) {
        if (a) {
            var b = a.toLowerCase().replace(/(.)s$/, "$1");
            a = Tb[a] || Ub[b] || b
        }
        return a
    }

    function q(a) {
        var b, c, d = {};
        for (c in a) a.hasOwnProperty(c) && (b = p(c), b && (d[b] = a[c]));
        return d
    }

    function r(b) {
        var c, d;
        if (0 === b.indexOf("week")) c = 7, d = "day";
        else {
            if (0 !== b.indexOf("month")) return;
            c = 12, d = "month"
        }
        db[b] = function(e, f) {
            var g, h, i = db.fn._lang[b],
                j = [];
            if ("number" == typeof e && (f = e, e = a), h = function(a) {
                var b = db().utc().set(d, a);
                return i.call(db.fn._lang, b, e || "")
            }, null != f) return h(f);
            for (g = 0; c > g; g++) j.push(h(g));
            return j
        }
    }

    function s(a) {
        var b = +a,
            c = 0;
        return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c
    }

    function t(a, b) {
        return new Date(Date.UTC(a, b + 1, 0)).getUTCDate()
    }

    function u(a) {
        return v(a) ? 366 : 365
    }

    function v(a) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function w(a) {
        var b;
        a._a && -2 === a._pf.overflow && (b = a._a[jb] < 0 || a._a[jb] > 11 ? jb : a._a[kb] < 1 || a._a[kb] > t(a._a[ib], a._a[jb]) ? kb : a._a[lb] < 0 || a._a[lb] > 23 ? lb : a._a[mb] < 0 || a._a[mb] > 59 ? mb : a._a[nb] < 0 || a._a[nb] > 59 ? nb : a._a[ob] < 0 || a._a[ob] > 999 ? ob : -1, a._pf._overflowDayOfYear && (ib > b || b > kb) && (b = kb), a._pf.overflow = b)
    }

    function x(a) {
        return null == a._isValid && (a._isValid = !isNaN(a._d.getTime()) && a._pf.overflow < 0 && !a._pf.empty && !a._pf.invalidMonth && !a._pf.nullInput && !a._pf.invalidFormat && !a._pf.userInvalidated, a._strict && (a._isValid = a._isValid && 0 === a._pf.charsLeftOver && 0 === a._pf.unusedTokens.length)), a._isValid
    }

    function y(a) {
        return a ? a.toLowerCase().replace("_", "-") : a
    }

    function z(a, b) {
        return b._isUTC ? db(a).zone(b._offset || 0) : db(a).local()
    }

    function A(a, b) {
        return b.abbr = a, pb[a] || (pb[a] = new e), pb[a].set(b), pb[a]
    }

    function B(a) {
        delete pb[a]
    }

    function C(a) {
        var b, c, d, e, f = 0,
            g = function(a) {
                if (!pb[a] && rb) try {
                    require("./lang/" + a)
                } catch (b) {}
                return pb[a]
            };
        if (!a) return db.fn._lang;
        if (!m(a)) {
            if (c = g(a)) return c;
            a = [a]
        }
        for (; f < a.length;) {
            for (e = y(a[f]).split("-"), b = e.length, d = y(a[f + 1]), d = d ? d.split("-") : null; b > 0;) {
                if (c = g(e.slice(0, b).join("-"))) return c;
                if (d && d.length >= b && o(e, d, !0) >= b - 1) break;
                b--
            }
            f++
        }
        return db.fn._lang
    }

    function D(a) {
        return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "")
    }

    function E(a) {
        var b, c, d = a.match(vb);
        for (b = 0, c = d.length; c > b; b++) d[b] = Yb[d[b]] ? Yb[d[b]] : D(d[b]);
        return function(e) {
            var f = "";
            for (b = 0; c > b; b++) f += d[b] instanceof Function ? d[b].call(e, a) : d[b];
            return f
        }
    }

    function F(a, b) {
        return a.isValid() ? (b = G(b, a.lang()), Vb[b] || (Vb[b] = E(b)), Vb[b](a)) : a.lang().invalidDate()
    }

    function G(a, b) {
        function c(a) {
            return b.longDateFormat(a) || a
        }
        var d = 5;
        for (wb.lastIndex = 0; d >= 0 && wb.test(a);) a = a.replace(wb, c), wb.lastIndex = 0, d -= 1;
        return a
    }

    function H(a, b) {
        var c, d = b._strict;
        switch (a) {
            case "DDDD":
                return Ib;
            case "YYYY":
            case "GGGG":
            case "gggg":
                return d ? Jb : zb;
            case "Y":
            case "G":
            case "g":
                return Lb;
            case "YYYYYY":
            case "YYYYY":
            case "GGGGG":
            case "ggggg":
                return d ? Kb : Ab;
            case "S":
                if (d) return Gb;
            case "SS":
                if (d) return Hb;
            case "SSS":
                if (d) return Ib;
            case "DDD":
                return yb;
            case "MMM":
            case "MMMM":
            case "dd":
            case "ddd":
            case "dddd":
                return Cb;
            case "a":
            case "A":
                return C(b._l)._meridiemParse;
            case "X":
                return Fb;
            case "Z":
            case "ZZ":
                return Db;
            case "T":
                return Eb;
            case "SSSS":
                return Bb;
            case "MM":
            case "DD":
            case "YY":
            case "GG":
            case "gg":
            case "HH":
            case "hh":
            case "mm":
            case "ss":
            case "ww":
            case "WW":
                return d ? Hb : xb;
            case "M":
            case "D":
            case "d":
            case "H":
            case "h":
            case "m":
            case "s":
            case "w":
            case "W":
            case "e":
            case "E":
                return xb;
            default:
                return c = new RegExp(P(O(a.replace("\\", "")), "i"))
        }
    }

    function I(a) {
        a = a || "";
        var b = a.match(Db) || [],
            c = b[b.length - 1] || [],
            d = (c + "").match(Qb) || ["-", 0, 0],
            e = +(60 * d[1]) + s(d[2]);
        return "+" === d[0] ? -e : e
    }

    function J(a, b, c) {
        var d, e = c._a;
        switch (a) {
            case "M":
            case "MM":
                null != b && (e[jb] = s(b) - 1);
                break;
            case "MMM":
            case "MMMM":
                d = C(c._l).monthsParse(b), null != d ? e[jb] = d : c._pf.invalidMonth = b;
                break;
            case "D":
            case "DD":
                null != b && (e[kb] = s(b));
                break;
            case "DDD":
            case "DDDD":
                null != b && (c._dayOfYear = s(b));
                break;
            case "YY":
                e[ib] = s(b) + (s(b) > 68 ? 1900 : 2e3);
                break;
            case "YYYY":
            case "YYYYY":
            case "YYYYYY":
                e[ib] = s(b);
                break;
            case "a":
            case "A":
                c._isPm = C(c._l).isPM(b);
                break;
            case "H":
            case "HH":
            case "h":
            case "hh":
                e[lb] = s(b);
                break;
            case "m":
            case "mm":
                e[mb] = s(b);
                break;
            case "s":
            case "ss":
                e[nb] = s(b);
                break;
            case "S":
            case "SS":
            case "SSS":
            case "SSSS":
                e[ob] = s(1e3 * ("0." + b));
                break;
            case "X":
                c._d = new Date(1e3 * parseFloat(b));
                break;
            case "Z":
            case "ZZ":
                c._useUTC = !0, c._tzm = I(b);
                break;
            case "w":
            case "ww":
            case "W":
            case "WW":
            case "d":
            case "dd":
            case "ddd":
            case "dddd":
            case "e":
            case "E":
                a = a.substr(0, 1);
            case "gg":
            case "gggg":
            case "GG":
            case "GGGG":
            case "GGGGG":
                a = a.substr(0, 2), b && (c._w = c._w || {}, c._w[a] = b)
        }
    }

    function K(a) {
        var b, c, d, e, f, g, h, i, j, k, l = [];
        if (!a._d) {
            for (d = M(a), a._w && null == a._a[kb] && null == a._a[jb] && (f = function(b) {
                var c = parseInt(b, 10);
                return b ? b.length < 3 ? c > 68 ? 1900 + c : 2e3 + c : c : null == a._a[ib] ? db().weekYear() : a._a[ib]
            }, g = a._w, null != g.GG || null != g.W || null != g.E ? h = Z(f(g.GG), g.W || 1, g.E, 4, 1) : (i = C(a._l), j = null != g.d ? V(g.d, i) : null != g.e ? parseInt(g.e, 10) + i._week.dow : 0, k = parseInt(g.w, 10) || 1, null != g.d && j < i._week.dow && k++, h = Z(f(g.gg), k, j, i._week.doy, i._week.dow)), a._a[ib] = h.year, a._dayOfYear = h.dayOfYear), a._dayOfYear && (e = null == a._a[ib] ? d[ib] : a._a[ib], a._dayOfYear > u(e) && (a._pf._overflowDayOfYear = !0), c = U(e, 0, a._dayOfYear), a._a[jb] = c.getUTCMonth(), a._a[kb] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b) a._a[b] = l[b] = d[b];
            for (; 7 > b; b++) a._a[b] = l[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            l[lb] += s((a._tzm || 0) / 60), l[mb] += s((a._tzm || 0) % 60), a._d = (a._useUTC ? U : T).apply(null, l)
        }
    }

    function L(a) {
        var b;
        a._d || (b = q(a._i), a._a = [b.year, b.month, b.day, b.hour, b.minute, b.second, b.millisecond], K(a))
    }

    function M(a) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function N(a) {
        a._a = [], a._pf.empty = !0;
        var b, c, d, e, f, g = C(a._l),
            h = "" + a._i,
            i = h.length,
            j = 0;
        for (d = G(a._f, g).match(vb) || [], b = 0; b < d.length; b++) e = d[b], c = (h.match(H(e, a)) || [])[0], c && (f = h.substr(0, h.indexOf(c)), f.length > 0 && a._pf.unusedInput.push(f), h = h.slice(h.indexOf(c) + c.length), j += c.length), Yb[e] ? (c ? a._pf.empty = !1 : a._pf.unusedTokens.push(e), J(e, c, a)) : a._strict && !c && a._pf.unusedTokens.push(e);
        a._pf.charsLeftOver = i - j, h.length > 0 && a._pf.unusedInput.push(h), a._isPm && a._a[lb] < 12 && (a._a[lb] += 12), a._isPm === !1 && 12 === a._a[lb] && (a._a[lb] = 0), K(a), w(a)
    }

    function O(a) {
        return a.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(a, b, c, d, e) {
            return b || c || d || e
        })
    }

    function P(a) {
        return a.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function Q(a) {
        var c, d, e, f, g;
        if (0 === a._f.length) return a._pf.invalidFormat = !0, a._d = new Date(0 / 0), void 0;
        for (f = 0; f < a._f.length; f++) g = 0, c = h({}, a), c._pf = b(), c._f = a._f[f], N(c), x(c) && (g += c._pf.charsLeftOver, g += 10 * c._pf.unusedTokens.length, c._pf.score = g, (null == e || e > g) && (e = g, d = c));
        h(a, d || c)
    }

    function R(a) {
        var b, c, d = a._i,
            e = Mb.exec(d);
        if (e) {
            for (a._pf.iso = !0, b = 0, c = Ob.length; c > b; b++)
                if (Ob[b][1].exec(d)) {
                    a._f = Ob[b][0] + (e[6] || " ");
                    break
                }
            for (b = 0, c = Pb.length; c > b; b++)
                if (Pb[b][1].exec(d)) {
                    a._f += Pb[b][0];
                    break
                }
            d.match(Db) && (a._f += "Z"), N(a)
        } else a._d = new Date(d)
    }

    function S(b) {
        var c = b._i,
            d = sb.exec(c);
        c === a ? b._d = new Date : d ? b._d = new Date(+d[1]) : "string" == typeof c ? R(b) : m(c) ? (b._a = c.slice(0), K(b)) : n(c) ? b._d = new Date(+c) : "object" == typeof c ? L(b) : b._d = new Date(c)
    }

    function T(a, b, c, d, e, f, g) {
        var h = new Date(a, b, c, d, e, f, g);
        return 1970 > a && h.setFullYear(a), h
    }

    function U(a) {
        var b = new Date(Date.UTC.apply(null, arguments));
        return 1970 > a && b.setUTCFullYear(a), b
    }

    function V(a, b) {
        if ("string" == typeof a)
            if (isNaN(a)) {
                if (a = b.weekdaysParse(a), "number" != typeof a) return null
            } else a = parseInt(a, 10);
        return a
    }

    function W(a, b, c, d, e) {
        return e.relativeTime(b || 1, !! c, a, d)
    }

    function X(a, b, c) {
        var d = hb(Math.abs(a) / 1e3),
            e = hb(d / 60),
            f = hb(e / 60),
            g = hb(f / 24),
            h = hb(g / 365),
            i = 45 > d && ["s", d] || 1 === e && ["m"] || 45 > e && ["mm", e] || 1 === f && ["h"] || 22 > f && ["hh", f] || 1 === g && ["d"] || 25 >= g && ["dd", g] || 45 >= g && ["M"] || 345 > g && ["MM", hb(g / 30)] || 1 === h && ["y"] || ["yy", h];
        return i[2] = b, i[3] = a > 0, i[4] = c, W.apply({}, i)
    }

    function Y(a, b, c) {
        var d, e = c - b,
            f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = db(a).add("d", f), {
            week: Math.ceil(d.dayOfYear() / 7),
            year: d.year()
        }
    }

    function Z(a, b, c, d, e) {
        var f, g, h = U(a, 0, 1).getUTCDay();
        return c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {
            year: g > 0 ? a : a - 1,
            dayOfYear: g > 0 ? g : u(a - 1) + g
        }
    }

    function $(a) {
        var b = a._i,
            c = a._f;
        return null === b ? db.invalid({
            nullInput: !0
        }) : ("string" == typeof b && (a._i = b = C().preparse(b)), db.isMoment(b) ? (a = i(b), a._d = new Date(+b._d)) : c ? m(c) ? Q(a) : N(a) : S(a), new f(a))
    }

    function _(a, b) {
        db.fn[a] = db.fn[a + "s"] = function(a) {
            var c = this._isUTC ? "UTC" : "";
            return null != a ? (this._d["set" + c + b](a), db.updateOffset(this), this) : this._d["get" + c + b]()
        }
    }

    function ab(a) {
        db.duration.fn[a] = function() {
            return this._data[a]
        }
    }

    function bb(a, b) {
        db.duration.fn["as" + a] = function() {
            return +this / b
        }
    }

    function cb(a) {
        var b = !1,
            c = db;
        "undefined" == typeof ender && (a ? (gb.moment = function() {
            return !b && console && console.warn && (b = !0, console.warn("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.")), c.apply(null, arguments)
        }, h(gb.moment, c)) : gb.moment = db)
    }
    for (var db, eb, fb = "2.5.1", gb = this, hb = Math.round, ib = 0, jb = 1, kb = 2, lb = 3, mb = 4, nb = 5, ob = 6, pb = {}, qb = {
            _isAMomentObject: null,
            _i: null,
            _f: null,
            _l: null,
            _strict: null,
            _isUTC: null,
            _offset: null,
            _pf: null,
            _lang: null
        }, rb = "undefined" != typeof module && module.exports && "undefined" != typeof require, sb = /^\/?Date\((\-?\d+)/i, tb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, ub = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, vb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, wb = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, xb = /\d\d?/, yb = /\d{1,3}/, zb = /\d{1,4}/, Ab = /[+\-]?\d{1,6}/, Bb = /\d+/, Cb = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Db = /Z|[\+\-]\d\d:?\d\d/gi, Eb = /T/i, Fb = /[\+\-]?\d+(\.\d{1,3})?/, Gb = /\d/, Hb = /\d\d/, Ib = /\d{3}/, Jb = /\d{4}/, Kb = /[+-]?\d{6}/, Lb = /[+-]?\d+/, Mb = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Nb = "YYYY-MM-DDTHH:mm:ssZ", Ob = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
            ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
            ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d{2}/],
            ["YYYY-DDD", /\d{4}-\d{3}/]
        ], Pb = [
            ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
            ["HH:mm", /(T| )\d\d:\d\d/],
            ["HH", /(T| )\d\d/]
        ], Qb = /([\+\-]|\d\d)/gi, Rb = "Date|Hours|Minutes|Seconds|Milliseconds".split("|"), Sb = {
            Milliseconds: 1,
            Seconds: 1e3,
            Minutes: 6e4,
            Hours: 36e5,
            Days: 864e5,
            Months: 2592e6,
            Years: 31536e6
        }, Tb = {
            ms: "millisecond",
            s: "second",
            m: "minute",
            h: "hour",
            d: "day",
            D: "date",
            w: "week",
            W: "isoWeek",
            M: "month",
            y: "year",
            DDD: "dayOfYear",
            e: "weekday",
            E: "isoWeekday",
            gg: "weekYear",
            GG: "isoWeekYear"
        }, Ub = {
            dayofyear: "dayOfYear",
            isoweekday: "isoWeekday",
            isoweek: "isoWeek",
            weekyear: "weekYear",
            isoweekyear: "isoWeekYear"
        }, Vb = {}, Wb = "DDD w W M D d".split(" "), Xb = "M D H h m s w W".split(" "), Yb = {
            M: function() {
                return this.month() + 1
            },
            MMM: function(a) {
                return this.lang().monthsShort(this, a)
            },
            MMMM: function(a) {
                return this.lang().months(this, a)
            },
            D: function() {
                return this.date()
            },
            DDD: function() {
                return this.dayOfYear()
            },
            d: function() {
                return this.day()
            },
            dd: function(a) {
                return this.lang().weekdaysMin(this, a)
            },
            ddd: function(a) {
                return this.lang().weekdaysShort(this, a)
            },
            dddd: function(a) {
                return this.lang().weekdays(this, a)
            },
            w: function() {
                return this.week()
            },
            W: function() {
                return this.isoWeek()
            },
            YY: function() {
                return k(this.year() % 100, 2)
            },
            YYYY: function() {
                return k(this.year(), 4)
            },
            YYYYY: function() {
                return k(this.year(), 5)
            },
            YYYYYY: function() {
                var a = this.year(),
                    b = a >= 0 ? "+" : "-";
                return b + k(Math.abs(a), 6)
            },
            gg: function() {
                return k(this.weekYear() % 100, 2)
            },
            gggg: function() {
                return k(this.weekYear(), 4)
            },
            ggggg: function() {
                return k(this.weekYear(), 5)
            },
            GG: function() {
                return k(this.isoWeekYear() % 100, 2)
            },
            GGGG: function() {
                return k(this.isoWeekYear(), 4)
            },
            GGGGG: function() {
                return k(this.isoWeekYear(), 5)
            },
            e: function() {
                return this.weekday()
            },
            E: function() {
                return this.isoWeekday()
            },
            a: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !0)
            },
            A: function() {
                return this.lang().meridiem(this.hours(), this.minutes(), !1)
            },
            H: function() {
                return this.hours()
            },
            h: function() {
                return this.hours() % 12 || 12
            },
            m: function() {
                return this.minutes()
            },
            s: function() {
                return this.seconds()
            },
            S: function() {
                return s(this.milliseconds() / 100)
            },
            SS: function() {
                return k(s(this.milliseconds() / 10), 2)
            },
            SSS: function() {
                return k(this.milliseconds(), 3)
            },
            SSSS: function() {
                return k(this.milliseconds(), 3)
            },
            Z: function() {
                var a = -this.zone(),
                    b = "+";
                return 0 > a && (a = -a, b = "-"), b + k(s(a / 60), 2) + ":" + k(s(a) % 60, 2)
            },
            ZZ: function() {
                var a = -this.zone(),
                    b = "+";
                return 0 > a && (a = -a, b = "-"), b + k(s(a / 60), 2) + k(s(a) % 60, 2)
            },
            z: function() {
                return this.zoneAbbr()
            },
            zz: function() {
                return this.zoneName()
            },
            X: function() {
                return this.unix()
            },
            Q: function() {
                return this.quarter()
            }
        }, Zb = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; Wb.length;) eb = Wb.pop(), Yb[eb + "o"] = d(Yb[eb], eb);
    for (; Xb.length;) eb = Xb.pop(), Yb[eb + eb] = c(Yb[eb], 2);
    for (Yb.DDDD = c(Yb.DDD, 3), h(e.prototype, {
        set: function(a) {
            var b, c;
            for (c in a) b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(a) {
            return this._months[a.month()]
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(a) {
            return this._monthsShort[a.month()]
        },
        monthsParse: function(a) {
            var b, c, d;
            for (this._monthsParse || (this._monthsParse = []), b = 0; 12 > b; b++)
                if (this._monthsParse[b] || (c = db.utc([2e3, b]), d = "^" + this.months(c, "") + "|^" + this.monthsShort(c, ""), this._monthsParse[b] = new RegExp(d.replace(".", ""), "i")), this._monthsParse[b].test(a)) return b
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(a) {
            return this._weekdays[a.day()]
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(a) {
            return this._weekdaysShort[a.day()]
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(a) {
            return this._weekdaysMin[a.day()]
        },
        weekdaysParse: function(a) {
            var b, c, d;
            for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)
                if (this._weekdaysParse[b] || (c = db([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(a) {
            var b = this._longDateFormat[a];
            return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(a) {
                return a.slice(1)
            }), this._longDateFormat[a] = b), b
        },
        isPM: function(a) {
            return "p" === (a + "").toLowerCase().charAt(0)
        },
        _meridiemParse: /[ap]\.?m?\.?/i,
        meridiem: function(a, b, c) {
            return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[Last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(a, b) {
            var c = this._calendar[a];
            return "function" == typeof c ? c.apply(b) : c
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(a, b, c, d) {
            var e = this._relativeTime[c];
            return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a)
        },
        pastFuture: function(a, b) {
            var c = this._relativeTime[a > 0 ? "future" : "past"];
            return "function" == typeof c ? c(b) : c.replace(/%s/i, b)
        },
        ordinal: function(a) {
            return this._ordinal.replace("%d", a)
        },
        _ordinal: "%d",
        preparse: function(a) {
            return a
        },
        postformat: function(a) {
            return a
        },
        week: function(a) {
            return Y(a, this._week.dow, this._week.doy).week
        },
        _week: {
            dow: 0,
            doy: 6
        },
        _invalidDate: "Invalid date",
        invalidDate: function() {
            return this._invalidDate
        }
    }), db = function(c, d, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._i = c, g._f = d, g._l = e, g._strict = f, g._isUTC = !1, g._pf = b(), $(g)
    }, db.utc = function(c, d, e, f) {
        var g;
        return "boolean" == typeof e && (f = e, e = a), g = {}, g._isAMomentObject = !0, g._useUTC = !0, g._isUTC = !0, g._l = e, g._i = c, g._f = d, g._strict = f, g._pf = b(), $(g).utc()
    }, db.unix = function(a) {
        return db(1e3 * a)
    }, db.duration = function(a, b) {
        var c, d, e, f = a,
            h = null;
        return db.isDuration(a) ? f = {
            ms: a._milliseconds,
            d: a._days,
            M: a._months
        } : "number" == typeof a ? (f = {}, b ? f[b] = a : f.milliseconds = a) : (h = tb.exec(a)) ? (c = "-" === h[1] ? -1 : 1, f = {
            y: 0,
            d: s(h[kb]) * c,
            h: s(h[lb]) * c,
            m: s(h[mb]) * c,
            s: s(h[nb]) * c,
            ms: s(h[ob]) * c
        }) : (h = ub.exec(a)) && (c = "-" === h[1] ? -1 : 1, e = function(a) {
            var b = a && parseFloat(a.replace(",", "."));
            return (isNaN(b) ? 0 : b) * c
        }, f = {
            y: e(h[2]),
            M: e(h[3]),
            d: e(h[4]),
            h: e(h[5]),
            m: e(h[6]),
            s: e(h[7]),
            w: e(h[8])
        }), d = new g(f), db.isDuration(a) && a.hasOwnProperty("_lang") && (d._lang = a._lang), d
    }, db.version = fb, db.defaultFormat = Nb, db.updateOffset = function() {}, db.lang = function(a, b) {
        var c;
        return a ? (b ? A(y(a), b) : null === b ? (B(a), a = "en") : pb[a] || C(a), c = db.duration.fn._lang = db.fn._lang = C(a), c._abbr) : db.fn._lang._abbr
    }, db.langData = function(a) {
        return a && a._lang && a._lang._abbr && (a = a._lang._abbr), C(a)
    }, db.isMoment = function(a) {
        return a instanceof f || null != a && a.hasOwnProperty("_isAMomentObject")
    }, db.isDuration = function(a) {
        return a instanceof g
    }, eb = Zb.length - 1; eb >= 0; --eb) r(Zb[eb]);
    for (db.normalizeUnits = function(a) {
        return p(a)
    }, db.invalid = function(a) {
        var b = db.utc(0 / 0);
        return null != a ? h(b._pf, a) : b._pf.userInvalidated = !0, b
    }, db.parseZone = function(a) {
        return db(a).parseZone()
    }, h(db.fn = f.prototype, {
        clone: function() {
            return db(this)
        },
        valueOf: function() {
            return +this._d + 6e4 * (this._offset || 0)
        },
        unix: function() {
            return Math.floor(+this / 1e3)
        },
        toString: function() {
            return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
        },
        toDate: function() {
            return this._offset ? new Date(+this) : this._d
        },
        toISOString: function() {
            var a = db(this).utc();
            return 0 < a.year() && a.year() <= 9999 ? F(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : F(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
        },
        toArray: function() {
            var a = this;
            return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
        },
        isValid: function() {
            return x(this)
        },
        isDSTShifted: function() {
            return this._a ? this.isValid() && o(this._a, (this._isUTC ? db.utc(this._a) : db(this._a)).toArray()) > 0 : !1
        },
        parsingFlags: function() {
            return h({}, this._pf)
        },
        invalidAt: function() {
            return this._pf.overflow
        },
        utc: function() {
            return this.zone(0)
        },
        local: function() {
            return this.zone(0), this._isUTC = !1, this
        },
        format: function(a) {
            var b = F(this, a || db.defaultFormat);
            return this.lang().postformat(b)
        },
        add: function(a, b) {
            var c;
            return c = "string" == typeof a ? db.duration(+b, a) : db.duration(a, b), l(this, c, 1), this
        },
        subtract: function(a, b) {
            var c;
            return c = "string" == typeof a ? db.duration(+b, a) : db.duration(a, b), l(this, c, -1), this
        },
        diff: function(a, b, c) {
            var d, e, f = z(a, this),
                g = 6e4 * (this.zone() - f.zone());
            return b = p(b), "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + f.daysInMonth()), e = 12 * (this.year() - f.year()) + (this.month() - f.month()), e += (this - db(this).startOf("month") - (f - db(f).startOf("month"))) / d, e -= 6e4 * (this.zone() - db(this).startOf("month").zone() - (f.zone() - db(f).startOf("month").zone())) / d, "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : j(e)
        },
        from: function(a, b) {
            return db.duration(this.diff(a)).lang(this.lang()._abbr).humanize(!b)
        },
        fromNow: function(a) {
            return this.from(db(), a)
        },
        calendar: function() {
            var a = z(db(), this).startOf("day"),
                b = this.diff(a, "days", !0),
                c = -6 > b ? "sameElse" : -1 > b ? "lastWeek" : 0 > b ? "lastDay" : 1 > b ? "sameDay" : 2 > b ? "nextDay" : 7 > b ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(c, this))
        },
        isLeapYear: function() {
            return v(this.year())
        },
        isDST: function() {
            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
        },
        day: function(a) {
            var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return null != a ? (a = V(a, this.lang()), this.add({
                d: a - b
            })) : b
        },
        month: function(a) {
            var b, c = this._isUTC ? "UTC" : "";
            return null != a ? "string" == typeof a && (a = this.lang().monthsParse(a), "number" != typeof a) ? this : (b = this.date(), this.date(1), this._d["set" + c + "Month"](a), this.date(Math.min(b, this.daysInMonth())), db.updateOffset(this), this) : this._d["get" + c + "Month"]()
        },
        startOf: function(a) {
            switch (a = p(a)) {
                case "year":
                    this.month(0);
                case "month":
                    this.date(1);
                case "week":
                case "isoWeek":
                case "day":
                    this.hours(0);
                case "hour":
                    this.minutes(0);
                case "minute":
                    this.seconds(0);
                case "second":
                    this.milliseconds(0)
            }
            return "week" === a ? this.weekday(0) : "isoWeek" === a && this.isoWeekday(1), this
        },
        endOf: function(a) {
            return a = p(a), this.startOf(a).add("isoWeek" === a ? "week" : a, 1).subtract("ms", 1)
        },
        isAfter: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf(b) > +db(a).startOf(b)
        },
        isBefore: function(a, b) {
            return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf(b) < +db(a).startOf(b)
        },
        isSame: function(a, b) {
            return b = b || "ms", +this.clone().startOf(b) === +z(a, this).startOf(b)
        },
        min: function(a) {
            return a = db.apply(null, arguments), this > a ? this : a
        },
        max: function(a) {
            return a = db.apply(null, arguments), a > this ? this : a
        },
        zone: function(a) {
            var b = this._offset || 0;
            return null == a ? this._isUTC ? b : this._d.getTimezoneOffset() : ("string" == typeof a && (a = I(a)), Math.abs(a) < 16 && (a = 60 * a), this._offset = a, this._isUTC = !0, b !== a && l(this, db.duration(b - a, "m"), 1, !0), this)
        },
        zoneAbbr: function() {
            return this._isUTC ? "UTC" : ""
        },
        zoneName: function() {
            return this._isUTC ? "Coordinated Universal Time" : ""
        },
        parseZone: function() {
            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i), this
        },
        hasAlignedHourOffset: function(a) {
            return a = a ? db(a).zone() : 0, (this.zone() - a) % 60 === 0
        },
        daysInMonth: function() {
            return t(this.year(), this.month())
        },
        dayOfYear: function(a) {
            var b = hb((db(this).startOf("day") - db(this).startOf("year")) / 864e5) + 1;
            return null == a ? b : this.add("d", a - b)
        },
        quarter: function() {
            return Math.ceil((this.month() + 1) / 3)
        },
        weekYear: function(a) {
            var b = Y(this, this.lang()._week.dow, this.lang()._week.doy).year;
            return null == a ? b : this.add("y", a - b)
        },
        isoWeekYear: function(a) {
            var b = Y(this, 1, 4).year;
            return null == a ? b : this.add("y", a - b)
        },
        week: function(a) {
            var b = this.lang().week(this);
            return null == a ? b : this.add("d", 7 * (a - b))
        },
        isoWeek: function(a) {
            var b = Y(this, 1, 4).week;
            return null == a ? b : this.add("d", 7 * (a - b))
        },
        weekday: function(a) {
            var b = (this.day() + 7 - this.lang()._week.dow) % 7;
            return null == a ? b : this.add("d", a - b)
        },
        isoWeekday: function(a) {
            return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7)
        },
        get: function(a) {
            return a = p(a), this[a]()
        },
        set: function(a, b) {
            return a = p(a), "function" == typeof this[a] && this[a](b), this
        },
        lang: function(b) {
            return b === a ? this._lang : (this._lang = C(b), this)
        }
    }), eb = 0; eb < Rb.length; eb++) _(Rb[eb].toLowerCase().replace(/s$/, ""), Rb[eb]);
    _("year", "FullYear"), db.fn.days = db.fn.day, db.fn.months = db.fn.month, db.fn.weeks = db.fn.week, db.fn.isoWeeks = db.fn.isoWeek, db.fn.toJSON = db.fn.toISOString, h(db.duration.fn = g.prototype, {
        _bubble: function() {
            var a, b, c, d, e = this._milliseconds,
                f = this._days,
                g = this._months,
                h = this._data;
            h.milliseconds = e % 1e3, a = j(e / 1e3), h.seconds = a % 60, b = j(a / 60), h.minutes = b % 60, c = j(b / 60), h.hours = c % 24, f += j(c / 24), h.days = f % 30, g += j(f / 30), h.months = g % 12, d = j(g / 12), h.years = d
        },
        weeks: function() {
            return j(this.days() / 7)
        },
        valueOf: function() {
            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * s(this._months / 12)
        },
        humanize: function(a) {
            var b = +this,
                c = X(b, !a, this.lang());
            return a && (c = this.lang().pastFuture(b, c)), this.lang().postformat(c)
        },
        add: function(a, b) {
            var c = db.duration(a, b);
            return this._milliseconds += c._milliseconds, this._days += c._days, this._months += c._months, this._bubble(), this
        },
        subtract: function(a, b) {
            var c = db.duration(a, b);
            return this._milliseconds -= c._milliseconds, this._days -= c._days, this._months -= c._months, this._bubble(), this
        },
        get: function(a) {
            return a = p(a), this[a.toLowerCase() + "s"]()
        },
        as: function(a) {
            return a = p(a), this["as" + a.charAt(0).toUpperCase() + a.slice(1) + "s"]()
        },
        lang: db.fn.lang,
        toIsoString: function() {
            var a = Math.abs(this.years()),
                b = Math.abs(this.months()),
                c = Math.abs(this.days()),
                d = Math.abs(this.hours()),
                e = Math.abs(this.minutes()),
                f = Math.abs(this.seconds() + this.milliseconds() / 1e3);
            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
        }
    });
    for (eb in Sb) Sb.hasOwnProperty(eb) && (bb(eb, Sb[eb]), ab(eb.toLowerCase()));
    bb("Weeks", 6048e5), db.duration.fn.asMonths = function() {
        return (+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
    }, db.lang("en", {
        ordinal: function(a) {
            var b = a % 10,
                c = 1 === s(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }
    }), rb ? (module.exports = db, cb(!0)) : "function" == typeof define && define.amd ? define("moment", function(b, c, d) {
        return d.config && d.config() && d.config().noGlobal !== !0 && cb(d.config().noGlobal === a), db
    }) : cb()
}).call(this);
/* ===================================================
 * bootstrap-transition.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#transitions
 * ===================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
   * ======================================================= */

  $(function () {

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#modals
 * =========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element.show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
          that.removeBackdrop()
          that.$element.trigger('hidden')
        })
      }

    , removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          if (!callback) return

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);

/* ============================================================
 * bootstrap-dropdown.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#dropdowns
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement) {
          // if mobile we we use a backdrop because click events don't delegate
          $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
        }
        $parent.toggleClass('open')
      }

      $this.focus()

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) {
        if (e.which == 27) $parent.find(toggle).focus()
        return $this.click()
      }

      $items = $('[role=menu] li:not(.divider):visible a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    $('.dropdown-backdrop').remove()
    $(toggle).each(function () {
      getParent($(this)).removeClass('open')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = selector && $(selector)

    if (!$parent || !$parent.length) $parent = $this.parent()

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


 /* DROPDOWN NO CONFLICT
  * ==================== */

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(window.jQuery);

/* =============================================================
 * bootstrap-scrollspy.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#scrollspy
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tabs
 * ========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut
        , triggers
        , trigger
        , i

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      triggers = this.options.trigger.split(' ')

      for (i = triggers.length; i--;) {
        trigger = triggers[i]
        if (trigger == 'click') {
          this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
        } else if (trigger != 'manual') {
          eventIn = trigger == 'hover' ? 'mouseenter' : 'focus'
          eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'
          this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
          this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
        }
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var defaults = $.fn[this.type].defaults
        , options = {}
        , self

      this._options && $.each(this._options, function (key, value) {
        if (defaults[key] != value) options[key] = value
      }, this)

      self = $(e.currentTarget)[this.type](options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp
        , e = $.Event('show')

      if (this.hasContent() && this.enabled) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })

        this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

        pos = this.getPosition()

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        this.applyPlacement(tp, placement)
        this.$element.trigger('shown')
      }
    }

  , applyPlacement: function(offset, placement){
      var $tip = this.tip()
        , width = $tip[0].offsetWidth
        , height = $tip[0].offsetHeight
        , actualWidth
        , actualHeight
        , delta
        , replace

      $tip
        .offset(offset)
        .addClass(placement)
        .addClass('in')

      actualWidth = $tip[0].offsetWidth
      actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight
        replace = true
      }

      if (placement == 'bottom' || placement == 'top') {
        delta = 0

        if (offset.left < 0){
          delta = offset.left * -2
          offset.left = 0
          $tip.offset(offset)
          actualWidth = $tip[0].offsetWidth
          actualHeight = $tip[0].offsetHeight
        }

        this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
      } else {
        this.replaceArrow(actualHeight - height, actualHeight, 'top')
      }

      if (replace) $tip.offset(offset)
    }

  , replaceArrow: function(delta, dimension, position){
      this
        .arrow()
        .css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()
        , e = $.Event('hide')

      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).detach()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.detach()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.detach()

      this.$element.trigger('hidden')

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function () {
      var el = this.$element[0]
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
        width: el.offsetWidth
      , height: el.offsetHeight
      }, this.$element.offset())
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , arrow: function(){
      return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function (e) {
      var self = e ? $(e.currentTarget)[this.type](this._options).data(this.type) : this
      self.tip().hasClass('in') ? self.hide() : self.show()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  var old = $.fn.tooltip

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }


 /* TOOLTIP NO CONFLICT
  * =================== */

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(window.jQuery);

/* ===========================================================
 * bootstrap-popover.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#popovers
 * ===========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)
        || $e.attr('data-content')

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


 /* POPOVER NO CONFLICT
  * =================== */

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(window.jQuery);

/* ==========================================================
 * bootstrap-affix.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#affix
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window)
      .on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.affix.data-api',  $.proxy(function () { setTimeout($.proxy(this.checkPosition, this), 1) }, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX NO CONFLICT
  * ================= */

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#alerts
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT NO CONFLICT
  * ================= */

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


 /* ALERT DATA-API
  * ============== */

  $(document).on('click.alert.data-api', dismiss, Alert.prototype.close)

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#buttons
 * ============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON NO CONFLICT
  * ================== */

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


 /* BUTTON DATA-API
  * =============== */

  $(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#collapse
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning || this.$element.hasClass('in')) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning || !this.$element.hasClass('in')) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSE PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSE NO CONFLICT
  * ==================== */

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


 /* COLLAPSE DATA-API
  * ================= */

  $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this = $(this), href
      , target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
      , option = $(target).data('collapse') ? 'toggle' : $this.data()
    $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    $(target).collapse(option)
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#carousel
 * ==========================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options = options
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      if (this.interval) clearInterval(this.interval);
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , getActiveIndex: function () {
      this.$active = this.$element.find('.item.active')
      this.$items = this.$active.parent().children()
      return this.$items.index(this.$active)
    }

  , to: function (pos) {
      var activeIndex = this.getActiveIndex()
        , that = this

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activeIndex == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle(true)
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      e = $.Event('slide', {
        relatedTarget: $next[0]
      , direction: direction
      })

      if ($next.hasClass('active')) return

      if (this.$indicators.length) {
        this.$indicators.find('.active').removeClass('active')
        this.$element.one('slid', function () {
          var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
          $nextIndicator && $nextIndicator.addClass('active')
        })
      }

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL NO CONFLICT
  * ==================== */

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }

 /* CAROUSEL DATA-API
  * ================= */

  $(document).on('click.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this = $(this), href
      , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      , options = $.extend({}, $target.data(), $this.data())
      , slideIndex

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('carousel').pause().to(slideIndex).cycle()
    }

    e.preventDefault()
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.3.2
 * http://getbootstrap.com/2.3.2/javascript.html#typeahead
 * =============================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('focus',    $.proxy(this.focus, this))
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
        .on('mouseleave', 'li', $.proxy(this.mouseleave, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , focus: function (e) {
      this.focused = true
    }

  , blur: function (e) {
      this.focused = false
      if (!this.mousedover && this.shown) this.hide()
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
      this.$element.focus()
    }

  , mouseenter: function (e) {
      this.mousedover = true
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  , mouseleave: function (e) {
      this.mousedover = false
      if (!this.focused && this.shown) this.hide()
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    $this.typeahead($this.data())
  })

}(window.jQuery);
/*
 * bootstrap-tagsinput v0.3.9 by Tim Schlechter
 * 
 */
!function(a){"use strict";function b(b,c){this.itemsArray=[],this.$element=a(b),this.$element.hide(),this.isSelect="SELECT"===b.tagName,this.multiple=this.isSelect&&b.hasAttribute("multiple"),this.objectItems=c&&c.itemValue,this.placeholderText=b.hasAttribute("placeholder")?this.$element.attr("placeholder"):"",this.inputSize=Math.max(1,this.placeholderText.length),this.$container=a('<div class="bootstrap-tagsinput"></div>'),this.$input=a('<input size="'+this.inputSize+'" type="text" placeholder="'+this.placeholderText+'"/>').appendTo(this.$container),this.$element.after(this.$container),this.build(c)}function c(a,b){if("function"!=typeof a[b]){var c=a[b];a[b]=function(a){return a[c]}}}function d(a,b){if("function"!=typeof a[b]){var c=a[b];a[b]=function(){return c}}}function e(a){return a?h.text(a).html():""}function f(a){var b=0;if(document.selection){a.focus();var c=document.selection.createRange();c.moveStart("character",-a.value.length),b=c.text.length}else(a.selectionStart||"0"==a.selectionStart)&&(b=a.selectionStart);return b}var g={tagClass:function(){return"label label-info"},itemValue:function(a){return a?a.toString():a},itemText:function(a){return this.itemValue(a)},freeInput:!0,maxTags:void 0,confirmKeys:[13],onTagExists:function(a,b){b.hide().fadeIn()}};b.prototype={constructor:b,add:function(b,c){var d=this;if(!(d.options.maxTags&&d.itemsArray.length>=d.options.maxTags||b!==!1&&!b)){if("object"==typeof b&&!d.objectItems)throw"Can't add objects when itemValue option is not set";if(!b.toString().match(/^\s*$/)){if(d.isSelect&&!d.multiple&&d.itemsArray.length>0&&d.remove(d.itemsArray[0]),"string"==typeof b&&"INPUT"===this.$element[0].tagName){var f=b.split(",");if(f.length>1){for(var g=0;g<f.length;g++)this.add(f[g],!0);return c||d.pushVal(),void 0}}var h=d.options.itemValue(b),i=d.options.itemText(b),j=d.options.tagClass(b),k=a.grep(d.itemsArray,function(a){return d.options.itemValue(a)===h})[0];if(k){if(d.options.onTagExists){var l=a(".tag",d.$container).filter(function(){return a(this).data("item")===k});d.options.onTagExists(b,l)}}else{d.itemsArray.push(b);var m=a('<span class="tag '+e(j)+'">'+e(i)+'<span data-role="remove"></span></span>');if(m.data("item",b),d.findInputWrapper().before(m),m.after(" "),d.isSelect&&!a('option[value="'+escape(h)+'"]',d.$element)[0]){var n=a("<option selected>"+e(i)+"</option>");n.data("item",b),n.attr("value",h),d.$element.append(n)}c||d.pushVal(),d.options.maxTags===d.itemsArray.length&&d.$container.addClass("bootstrap-tagsinput-max"),d.$element.trigger(a.Event("itemAdded",{item:b}))}}}},remove:function(b,c){var d=this;d.objectItems&&(b="object"==typeof b?a.grep(d.itemsArray,function(a){return d.options.itemValue(a)==d.options.itemValue(b)})[0]:a.grep(d.itemsArray,function(a){return d.options.itemValue(a)==b})[0]),b&&(a(".tag",d.$container).filter(function(){return a(this).data("item")===b}).remove(),a("option",d.$element).filter(function(){return a(this).data("item")===b}).remove(),d.itemsArray.splice(a.inArray(b,d.itemsArray),1)),c||d.pushVal(),d.options.maxTags>d.itemsArray.length&&d.$container.removeClass("bootstrap-tagsinput-max"),d.$element.trigger(a.Event("itemRemoved",{item:b}))},removeAll:function(){var b=this;for(a(".tag",b.$container).remove(),a("option",b.$element).remove();b.itemsArray.length>0;)b.itemsArray.pop();b.pushVal(),b.options.maxTags&&!this.isEnabled()&&this.enable()},refresh:function(){var b=this;a(".tag",b.$container).each(function(){var c=a(this),d=c.data("item"),f=b.options.itemValue(d),g=b.options.itemText(d),h=b.options.tagClass(d);if(c.attr("class",null),c.addClass("tag "+e(h)),c.contents().filter(function(){return 3==this.nodeType})[0].nodeValue=e(g),b.isSelect){var i=a("option",b.$element).filter(function(){return a(this).data("item")===d});i.attr("value",f)}})},items:function(){return this.itemsArray},pushVal:function(){var b=this,c=a.map(b.items(),function(a){return b.options.itemValue(a).toString()});b.$element.val(c,!0).trigger("change")},build:function(b){var e=this;e.options=a.extend({},g,b);var h=e.options.typeahead||{};e.objectItems&&(e.options.freeInput=!1),c(e.options,"itemValue"),c(e.options,"itemText"),c(e.options,"tagClass"),e.options.source&&(h.source=e.options.source),h.source&&a.fn.typeahead&&(d(h,"source"),e.$input.typeahead({source:function(b,c){function d(a){for(var b=[],d=0;d<a.length;d++){var g=e.options.itemText(a[d]);f[g]=a[d],b.push(g)}c(b)}this.map={};var f=this.map,g=h.source(b);a.isFunction(g.success)?g.success(d):a.when(g).then(d)},updater:function(a){e.add(this.map[a])},matcher:function(a){return-1!==a.toLowerCase().indexOf(this.query.trim().toLowerCase())},sorter:function(a){return a.sort()},highlighter:function(a){var b=new RegExp("("+this.query+")","gi");return a.replace(b,"<strong>$1</strong>")}})),e.$container.on("click",a.proxy(function(){e.$input.focus()},e)),e.$container.on("keydown","input",a.proxy(function(b){var c=a(b.target),d=e.findInputWrapper();switch(b.which){case 8:if(0===f(c[0])){var g=d.prev();g&&e.remove(g.data("item"))}break;case 46:if(0===f(c[0])){var h=d.next();h&&e.remove(h.data("item"))}break;case 37:var i=d.prev();0===c.val().length&&i[0]&&(i.before(d),c.focus());break;case 39:var j=d.next();0===c.val().length&&j[0]&&(j.after(d),c.focus());break;default:e.options.freeInput&&a.inArray(b.which,e.options.confirmKeys)>=0&&(e.add(c.val()),c.val(""),b.preventDefault())}c.attr("size",Math.max(this.inputSize,c.val().length))},e)),e.$container.on("click","[data-role=remove]",a.proxy(function(b){e.remove(a(b.target).closest(".tag").data("item"))},e)),e.options.itemValue===g.itemValue&&("INPUT"===e.$element[0].tagName?e.add(e.$element.val()):a("option",e.$element).each(function(){e.add(a(this).attr("value"),!0)}))},destroy:function(){var a=this;a.$container.off("keypress","input"),a.$container.off("click","[role=remove]"),a.$container.remove(),a.$element.removeData("tagsinput"),a.$element.show()},focus:function(){this.$input.focus()},input:function(){return this.$input},findInputWrapper:function(){for(var b=this.$input[0],c=this.$container[0];b&&b.parentNode!==c;)b=b.parentNode;return a(b)}},a.fn.tagsinput=function(c,d){var e=[];return this.each(function(){var f=a(this).data("tagsinput");if(f){var g=f[c](d);void 0!==g&&e.push(g)}else f=new b(this,c),a(this).data("tagsinput",f),e.push(f),"SELECT"===this.tagName&&a("option",a(this)).attr("selected","selected"),a(this).val(a(this).val())}),"string"==typeof c?e.length>1?e:e[0]:e},a.fn.tagsinput.Constructor=b;var h=a("<div />");a(function(){a("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput()})}(window.jQuery);
/*
//@ sourceMappingURL=bootstrap-tagsinput.min.js.map
*/
(function(a){function u(e,j){function f(f){return a.isArray(g.readonly)?(f=a(".dwwl",t).index(f),g.readonly[f]):g.readonly}function x(a){var f="",e;for(e in T[a])f+='<li class="dw-v" data-val="'+e+'" style="height:'+H+"px;line-height:"+H+'px;"><div class="dw-i">'+T[a][e]+"</div></li>";return f}function p(){var f=document.body,a=document.documentElement;return Math.max(f.scrollHeight,f.offsetHeight,a.clientHeight,a.scrollHeight,a.offsetHeight)}function l(f){c=a("li.dw-v",f).eq(0).index();d=a("li.dw-v",
f).eq(-1).index();y=a("ul",t).index(f);m=H;o=k}function q(f){var a=g.headerText;return a?"function"==typeof a?a.call(L,f):a.replace(/\{value\}/i,f):""}function w(){k.temp=P&&(null!==k.val&&k.val!=v.val()||!v.val().length)||null===k.values?g.parseValue(v.val()||"",k):k.values.slice(0);k.setValue(!0)}function u(f,e,g,c){K("validate",[t,e]);a(".dww ul",t).each(function(g){var x=a(this),b=a('li[data-val="'+k.temp[g]+'"]',x),d=b.index(),j=g==e||void 0===e;if(!b.hasClass("dw-v")){for(var h=b,i=0,n=0;h.prev().length&&
!h.hasClass("dw-v");)h=h.prev(),i++;for(;b.next().length&&!b.hasClass("dw-v");)b=b.next(),n++;(n<i&&n&&2!==c||!i||!h.hasClass("dw-v")||1==c)&&b.hasClass("dw-v")?d+=n:(b=h,d-=i)}if(!b.hasClass("dw-sel")||j)k.temp[g]=b.attr("data-val"),a(".dw-sel",x).removeClass("dw-sel"),b.addClass("dw-sel"),k.scroll(x,g,d,f)});k.change(g)}function W(){function f(){a(".dwc",t).each(function(){k=a(this).outerWidth(!0);e+=k;b=k>b?k:b});k=e>x?b:e;k=a(".dwwr",t).width(k+1).outerWidth();n=j.outerHeight()}if("inline"!=g.display){var e=
0,b=0,x=a(window).width(),c=window.innerHeight,d=a(window).scrollTop(),j=a(".dw",t),k,h,i,n,m,o={},F,s=void 0===g.anchor?v:g.anchor,c=c||a(window).height();if("modal"==g.display)f(),i=(x-k)/2,h=d+(c-n)/2;else if("bubble"==g.display){f();var l=s.offset(),A=a(".dw-arr",t),q=a(".dw-arrw-i",t),r=j.outerWidth();m=s.outerWidth();i=l.left-(j.outerWidth(!0)-m)/2;i=i>x-r?x-(r+20):i;i=0<=i?i:20;h=l.top-(j.outerHeight()+3);h<d||l.top>d+c?(j.removeClass("dw-bubble-top").addClass("dw-bubble-bottom"),h=l.top+s.outerHeight()+
3,F=h+j.outerHeight(!0)>d+c||l.top>d+c):j.removeClass("dw-bubble-bottom").addClass("dw-bubble-top");h=h>=d?h:d;d=l.left+m/2-(i+(r-q.outerWidth())/2);d>q.outerWidth()&&(d=q.outerWidth());A.css({left:d})}else o.width="100%","top"==g.display?h=d:"bottom"==g.display&&(h=d+c-j.outerHeight(),h=0<=h?h:0);o.top=h;o.left=i;j.css(o);a(".dwo, .dw-persp",t).height(0).height(p());F&&a(window).scrollTop(h+j.outerHeight(!0)-c)}}function K(f,e){var b;e.push(k);a.each([U,j],function(a,d){d[f]&&(b=d[f].apply(L,e))});
return b}function aa(f){var a=+f.data("pos")+1;h(f,a>d?c:a,1)}function Y(f){var a=+f.data("pos")-1;h(f,a<c?d:a,2)}var k=this,X=a.mobiscroll,L=e,v=a(L),E,Z,g=B({},J),U={},$,H,F,t,T=[],Q={},P=v.is("input"),R=!1;k.enable=function(){g.disabled=!1;P&&v.prop("disabled",!1)};k.disable=function(){g.disabled=!0;P&&v.prop("disabled",!0)};k.scroll=function(f,a,e,b,d,g){function c(){clearInterval(Q[a]);Q[a]=void 0;f.data("pos",e).closest(".dwwl").removeClass("dwa")}var x=($-e)*H,j,g=g||C;f.attr("style",(b?N+
"-transition:all "+b.toFixed(1)+"s ease-out;":"")+(S?N+"-transform:translate3d(0,"+x+"px,0);":"top:"+x+"px;"));Q[a]&&c();b&&void 0!==d?(j=0,f.closest(".dwwl").addClass("dwa"),Q[a]=setInterval(function(){j+=0.1;f.data("pos",Math.round((e-d)*Math.sin(j/b*(Math.PI/2))+d));j>=b&&(c(),g())},100),K("onAnimStart",[a,b])):(f.data("pos",e),g())};k.setValue=function(f,a,e,b){b||(k.values=k.temp.slice(0));R&&f&&u(e);a&&(F=g.formatResult(k.temp),k.val=F,P&&v.val(F).trigger("change"))};k.validate=function(f,a){u(0.2,
f,!0,a)};k.change=function(f){F=g.formatResult(k.temp);"inline"==g.display?k.setValue(!1,f):a(".dwv",t).html(q(F));f&&K("onChange",[F])};k.hide=function(f){if(!1===K("onClose",[F]))return!1;a(".dwtd").prop("disabled",!1).removeClass("dwtd");v.blur();t&&("inline"!=g.display&&g.animate&&!f?(a(".dw",t).addClass("dw-"+g.animate+" dw-out"),setTimeout(function(){t.remove();t=null},350)):(t.remove(),t=null),R=!1,a(window).unbind(".dw"))};k.changeWheel=function(f,e){if(t){var b=0,d,c,j=f.length;for(d in g.wheels)for(c in g.wheels[d]){if(-1<
a.inArray(b,f)&&(T[b]=g.wheels[d][c],a("ul",t).eq(b).html(x(b)),j--,!j)){W();u(e);return}b++}}};k.show=function(e){if(g.disabled||R)return!1;"top"==g.display&&(g.animate="slidedown");"bottom"==g.display&&(g.animate="slideup");w();K("onBeforeShow",[t]);var d=0,c,j="",m="",o="";g.animate&&!e&&(m='<div class="dw-persp">',o="</div>",j="dw-"+g.animate+" dw-in");j='<div class="'+g.theme+" dw-"+g.display+'">'+("inline"==g.display?'<div class="dw dwbg dwi"><div class="dwwr">':m+'<div class="dwo"></div><div class="dw dwbg '+
j+'"><div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div><div class="dwwr">'+(g.headerText?'<div class="dwv"></div>':""));for(e=0;e<g.wheels.length;e++){j+='<div class="dwc'+("scroller"!=g.mode?" dwpm":" dwsc")+(g.showLabel?"":" dwhl")+'"><div class="dwwc dwrc"><table cellpadding="0" cellspacing="0"><tr>';for(c in g.wheels[e])T[d]=g.wheels[e][c],j+='<td><div class="dwwl dwrc dwwl'+d+'">'+("scroller"!=g.mode?'<div class="dwwb dwwbp" style="height:'+H+"px;line-height:"+
H+'px;"><span>+</span></div><div class="dwwb dwwbm" style="height:'+H+"px;line-height:"+H+'px;"><span>&ndash;</span></div>':"")+'<div class="dwl">'+c+'</div><div class="dww dwrc" style="height:'+g.rows*H+"px;min-width:"+g.width+'px;"><ul>',j+=x(d),j+='</ul><div class="dwwo"></div></div><div class="dwwol"></div></div></td>',d++;j+="</tr></table></div></div>"}j+=("inline"!=g.display?'<div class="dwbc'+(g.button3?" dwbc-p":"")+'"><span class="dwbw dwb-s"><span class="dwb">'+g.setText+"</span></span>"+
(g.button3?'<span class="dwbw dwb-n"><span class="dwb">'+g.button3Text+"</span></span>":"")+'<span class="dwbw dwb-c"><span class="dwb">'+g.cancelText+"</span></span></div>"+o:'<div class="dwcc"></div>')+"</div></div></div>";t=a(j);u();"inline"!=g.display?t.appendTo("body"):v.is("div")?v.html(t):t.insertAfter(v);R=!0;"inline"!=g.display&&(a(".dwb-s span",t).click(function(){if(k.hide()!==false){k.setValue(false,true);K("onSelect",[k.val])}return false}),a(".dwb-c span",t).click(function(){k.hide()!==
false&&K("onCancel",[k.val]);return false}),g.button3&&a(".dwb-n span",t).click(g.button3),g.scrollLock&&t.bind("touchmove",function(f){f.preventDefault()}),a("input,select").each(function(){a(this).prop("disabled")||a(this).addClass("dwtd")}),a("input,select").prop("disabled",!0),W(),a(window).bind("resize.dw",W));t.delegate(".dwwl","DOMMouseScroll mousewheel",function(e){if(!f(this)){e.preventDefault();var e=e.originalEvent,e=e.wheelDelta?e.wheelDelta/120:e.detail?-e.detail/3:0,b=a("ul",this),d=
+b.data("pos"),d=Math.round(d-e);l(b);h(b,d,e<0?1:2)}}).delegate(".dwb, .dwwb",M,function(){a(this).addClass("dwb-a")}).delegate(".dwwb",M,function(e){var d=a(this).closest(".dwwl");if(!f(d)&&!d.hasClass("dwa")){e.preventDefault();e.stopPropagation();var j=d.find("ul"),c=a(this).hasClass("dwwbp")?aa:Y;b=true;l(j);clearInterval(i);i=setInterval(function(){c(j)},g.delay);c(j)}}).delegate(".dwwl",M,function(e){e.preventDefault();if(!n&&!f(this)&&!b&&g.mode!="clickpick"){n=true;s=a("ul",this);s.closest(".dwwl").addClass("dwa");
A=+s.data("pos");l(s);I=Q[y]!==void 0;z=O(e);D=new Date;r=z;k.scroll(s,y,A)}});K("onShow",[t,F]);E.init(t,k)};k.init=function(f){E=B({defaults:{},init:C},X.themes[f.theme||g.theme]);Z=X.i18n[f.lang||g.lang];B(j,f);B(g,E.defaults,Z,j);k.settings=g;v.unbind(".dw");if(f=X.presets[g.preset])U=f.call(L,k),B(g,U,j),B(G,U.methods);$=Math.floor(g.rows/2);H=g.height;void 0!==v.data("dwro")&&(L.readOnly=V(v.data("dwro")));R&&k.hide();"inline"==g.display?k.show():(w(),P&&g.showOnFocus&&(v.data("dwro",L.readOnly),
L.readOnly=!0,v.bind("focus.dw",function(){k.show()})))};k.values=null;k.val=null;k.temp=null;k.init(j)}function E(e){for(var a in e)if(void 0!==Y[e[a]])return!0;return!1}function O(e){var a=e.originalEvent,f=e.changedTouches;return f||a&&a.changedTouches?a?a.changedTouches[0].pageY:f[0].pageY:e.pageY}function V(e){return!0===e||"true"==e}function q(e,a,f){e=e>f?f:e;return e<a?a:e}function h(e,b,f,x,h){var b=q(b,c,d),i=a("li",e).eq(b),n=y,x=x?b==h?0.1:Math.abs(0.1*(b-h)):0;o.scroll(e,n,b,x,h,function(){o.temp[n]=
i.attr("data-val");o.validate(n,f)})}function l(e,a,f){return G[a]?G[a].apply(e,Array.prototype.slice.call(f,1)):"object"===typeof a?G.init.call(e,a):e}var p={},i,C=function(){},m,c,d,o,w=(new Date).getTime(),n,b,s,y,z,r,D,A,I,Y=document.createElement("modernizr").style,S=E(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]),N=function(){var a=["Webkit","Moz","O","ms"],b;for(b in a)if(E([a[b]+"Transform"]))return"-"+a[b].toLowerCase();return""}(),B=a.extend,
M="touchstart mousedown",J={width:70,height:40,rows:3,delay:300,disabled:!1,readonly:!1,showOnFocus:!0,showLabel:!0,wheels:[],theme:"",headerText:"{value}",display:"modal",mode:"scroller",preset:"",lang:"en-US",setText:"Set",cancelText:"Cancel",scrollLock:!0,formatResult:function(a){return a.join(" ")},parseValue:function(a,b){var f=b.settings.wheels,d=a.split(" "),c=[],h=0,i,n,m;for(i=0;i<f.length;i++)for(n in f[i]){if(void 0!==f[i][n][d[h]])c.push(d[h]);else for(m in f[i][n]){c.push(m);break}h++}return c}},
G={init:function(a){void 0===a&&(a={});return this.each(function(){this.id||(w+=1,this.id="scoller"+w);p[this.id]=new u(this,a)})},enable:function(){return this.each(function(){var a=p[this.id];a&&a.enable()})},disable:function(){return this.each(function(){var a=p[this.id];a&&a.disable()})},isDisabled:function(){var a=p[this[0].id];if(a)return a.settings.disabled},option:function(a,b){return this.each(function(){var f=p[this.id];if(f){var d={};"object"===typeof a?d=a:d[a]=b;f.init(d)}})},setValue:function(a,
b,f,d){return this.each(function(){var c=p[this.id];c&&(c.temp=a,c.setValue(!0,b,f,d))})},getInst:function(){return p[this[0].id]},getValue:function(){var a=p[this[0].id];if(a)return a.values},show:function(){var a=p[this[0].id];if(a)return a.show()},hide:function(){return this.each(function(){var a=p[this.id];a&&a.hide()})},destroy:function(){return this.each(function(){var b=p[this.id];b&&(b.hide(),a(this).unbind(".dw"),delete p[this.id],a(this).is("input")&&(this.readOnly=V(a(this).data("dwro"))))})}};
a(document).bind("touchmove mousemove",function(a){n&&(a.preventDefault(),r=O(a),o.scroll(s,y,q(A+(z-r)/m,c-1,d+1)),I=!0)});a(document).bind("touchend mouseup",function(e){if(n){e.preventDefault();var j=new Date-D,e=q(A+(z-r)/m,c-1,d+1),f;f=s.offset().top;300>j?(j=(r-z)/j,j=j*j/0.0012,0>r-z&&(j=-j)):j=r-z;if(!j&&!I){f=Math.floor((r-f)/m);var x=a("li",s).eq(f);x.addClass("dw-hl");setTimeout(function(){x.removeClass("dw-hl")},200)}else f=Math.round(A-j/m);h(s,f,0,!0,Math.round(e));n=!1;s=null}b&&(clearInterval(i),
b=!1);a(".dwb-a").removeClass("dwb-a")});a.fn.mobiscroll=function(b){B(this,a.mobiscroll.shorts);return l(this,b,arguments)};a.mobiscroll=a.mobiscroll||{setDefaults:function(a){B(J,a)},presetShort:function(a){this.shorts[a]=function(b){return l(this,B(b,{preset:a}),arguments)}},shorts:{},presets:{},themes:{},i18n:{}};a.scroller=a.scroller||a.mobiscroll;a.fn.scroller=a.fn.scroller||a.fn.mobiscroll})(jQuery);(function(a){var u=a.mobiscroll,E=new Date,O={dateFormat:"mm/dd/yy",dateOrder:"mmddy",timeWheels:"hhiiA",timeFormat:"hh:ii A",startYear:E.getFullYear()-100,endYear:E.getFullYear()+1,monthNames:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),monthNamesShort:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),dayNames:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),dayNamesShort:"Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
shortYearCutoff:"+10",monthText:"Month",dayText:"Day",yearText:"Year",hourText:"Hours",minuteText:"Minutes",secText:"Seconds",ampmText:"&nbsp;",nowText:"Now",showNow:!1,stepHour:1,stepMinute:1,stepSecond:1,separator:" "},V=function(q){function h(a,b,d){return void 0!==n[b]?+a[n[b]]:void 0!==d?d:S[s[b]]?S[s[b]]():s[b](S)}function l(a,b){return Math.floor(a/b)*b}function p(a){var b=h(a,"h",0);return new Date(h(a,"y"),h(a,"m"),h(a,"d",1),h(a,"ap")?b+12:b,h(a,"i",0),h(a,"s",0))}var i=a(this),C={},m;if(i.is("input")){switch(i.attr("type")){case "date":m=
"yy-mm-dd";break;case "datetime":m="yy-mm-ddTHH:ii:ssZ";break;case "datetime-local":m="yy-mm-ddTHH:ii:ss";break;case "month":m="yy-mm";C.dateOrder="mmyy";break;case "time":m="HH:ii:ss"}var c=i.attr("min"),i=i.attr("max");c&&(C.minDate=u.parseDate(m,c));i&&(C.maxDate=u.parseDate(m,i))}var d=a.extend({},O,C,q.settings),o=0,C=[],w=[],n={},b,s={y:"getFullYear",m:"getMonth",d:"getDate",h:function(a){a=a.getHours();a=I&&12<=a?a-12:a;return l(a,N)},i:function(a){return l(a.getMinutes(),B)},s:function(a){return l(a.getSeconds(),
M)},ap:function(a){return A&&11<a.getHours()?1:0}},y=d.preset,z=d.dateOrder,r=d.timeWheels,D=z.match(/D/),A=r.match(/a/i),I=r.match(/h/),E="datetime"==y?d.dateFormat+d.separator+d.timeFormat:"time"==y?d.timeFormat:d.dateFormat,S=new Date,N=d.stepHour,B=d.stepMinute,M=d.stepSecond,J=d.minDate||new Date(d.startYear,0,1),G=d.maxDate||new Date(d.endYear,11,31,23,59,59);m=m||E;if(y.match(/date/i)){a.each(["y","m","d"],function(a,d){b=z.search(RegExp(d,"i"));-1<b&&w.push({o:b,v:d})});w.sort(function(a,
b){return a.o>b.o?1:-1});a.each(w,function(a,b){n[b.v]=a});c={};for(i=0;3>i;i++)if(i==n.y){o++;c[d.yearText]={};var e=J.getFullYear(),j=G.getFullYear();for(b=e;b<=j;b++)c[d.yearText][b]=z.match(/yy/i)?b:(b+"").substr(2,2)}else if(i==n.m){o++;c[d.monthText]={};for(b=0;12>b;b++)e=z.replace(/[dy]/gi,"").replace(/mm/,9>b?"0"+(b+1):b+1).replace(/m/,b),c[d.monthText][b]=e.match(/MM/)?e.replace(/MM/,'<span class="dw-mon">'+d.monthNames[b]+"</span>"):e.replace(/M/,'<span class="dw-mon">'+d.monthNamesShort[b]+
"</span>")}else if(i==n.d){o++;c[d.dayText]={};for(b=1;32>b;b++)c[d.dayText][b]=z.match(/dd/i)&&10>b?"0"+b:b}C.push(c)}if(y.match(/time/i)){w=[];a.each(["h","i","s"],function(a,b){a=r.search(RegExp(b,"i"));-1<a&&w.push({o:a,v:b})});w.sort(function(a,b){return a.o>b.o?1:-1});a.each(w,function(a,b){n[b.v]=o+a});c={};for(i=o;i<o+3;i++)if(i==n.h){o++;c[d.hourText]={};for(b=0;b<(I?12:24);b+=N)c[d.hourText][b]=I&&0==b?12:r.match(/hh/i)&&10>b?"0"+b:b}else if(i==n.i){o++;c[d.minuteText]={};for(b=0;60>b;b+=
B)c[d.minuteText][b]=r.match(/ii/)&&10>b?"0"+b:b}else if(i==n.s){o++;c[d.secText]={};for(b=0;60>b;b+=M)c[d.secText][b]=r.match(/ss/)&&10>b?"0"+b:b}A&&(n.ap=o++,i=r.match(/A/),c[d.ampmText]={"0":i?"AM":"am",1:i?"PM":"pm"});C.push(c)}q.setDate=function(a,b,d,c){for(var e in n)this.temp[n[e]]=a[s[e]]?a[s[e]]():s[e](a);this.setValue(!0,b,d,c)};q.getDate=function(a){return p(a)};return{button3Text:d.showNow?d.nowText:void 0,button3:d.showNow?function(){q.setDate(new Date,!1,0.3,!0)}:void 0,wheels:C,headerText:function(){return u.formatDate(E,
p(q.temp),d)},formatResult:function(a){return u.formatDate(m,p(a),d)},parseValue:function(a){var b=new Date,c,e=[];try{b=u.parseDate(m,a,d)}catch(h){}for(c in n)e[n[c]]=b[s[c]]?b[s[c]]():s[c](b);return e},validate:function(b){var c=q.temp,e={y:J.getFullYear(),m:0,d:1,h:0,i:0,s:0,ap:0},i={y:G.getFullYear(),m:11,d:31,h:l(I?11:23,N),i:l(59,B),s:l(59,M),ap:1},j=!0,m=!0;a.each("y,m,d,ap,h,i,s".split(","),function(o,l){if(n[l]!==void 0){var p=e[l],q=i[l],A=31,k=h(c,l),r=a("ul",b).eq(n[l]),w,v;if(l=="d"){w=
h(c,"y");v=h(c,"m");q=A=32-(new Date(w,v,32)).getDate();D&&a("li",r).each(function(){var b=a(this),c=b.data("val"),e=(new Date(w,v,c)).getDay(),c=z.replace(/[my]/gi,"").replace(/dd/,c<10?"0"+c:c).replace(/d/,c);a(".dw-i",b).html(c.match(/DD/)?c.replace(/DD/,'<span class="dw-day">'+d.dayNames[e]+"</span>"):c.replace(/D/,'<span class="dw-day">'+d.dayNamesShort[e]+"</span>"))})}j&&J&&(p=J[s[l]]?J[s[l]]():s[l](J));m&&G&&(q=G[s[l]]?G[s[l]]():s[l](G));if(l!="y"){var y=a('li[data-val="'+p+'"]',r).index(),
C=a('li[data-val="'+q+'"]',r).index();a("li",r).removeClass("dw-v").slice(y,C+1).addClass("dw-v");l=="d"&&a("li",r).removeClass("dw-h").slice(A).addClass("dw-h")}k<p&&(k=p);k>q&&(k=q);j&&(j=k==p);m&&(m=k==q);if(d.invalid&&l=="d"){var g=[];d.invalid.dates&&a.each(d.invalid.dates,function(a,b){b.getFullYear()==w&&b.getMonth()==v&&g.push(b.getDate()-1)});if(d.invalid.daysOfWeek){var I=(new Date(w,v,1)).getDay(),u;a.each(d.invalid.daysOfWeek,function(a,b){for(u=b-I;u<A;u=u+7)u>=0&&g.push(u)})}d.invalid.daysOfMonth&&
a.each(d.invalid.daysOfMonth,function(a,b){b=(b+"").split("/");b[1]?b[0]-1==v&&g.push(b[1]-1):g.push(b[0]-1)});a.each(g,function(b,c){a("li",r).eq(c).removeClass("dw-v")})}c[n[l]]=k}})},methods:{getDate:function(b){var c=a(this).mobiscroll("getInst");if(c)return c.getDate(b?c.temp:c.values)},setDate:function(b,c,d,e){void 0==c&&(c=!1);return this.each(function(){var h=a(this).mobiscroll("getInst");h&&h.setDate(b,c,d,e)})}}}};a.each(["date","time","datetime"],function(a,h){u.presets[h]=V;u.presetShort(h)});
u.formatDate=function(q,h,l){if(!h)return null;var l=a.extend({},O,l),p=function(a){for(var c=0;m+1<q.length&&q.charAt(m+1)==a;)c++,m++;return c},i=function(a,c,b){c=""+c;if(p(a))for(;c.length<b;)c="0"+c;return c},u=function(a,c,b,d){return p(a)?d[c]:b[c]},m,c="",d=!1;for(m=0;m<q.length;m++)if(d)"'"==q.charAt(m)&&!p("'")?d=!1:c+=q.charAt(m);else switch(q.charAt(m)){case "d":c+=i("d",h.getDate(),2);break;case "D":c+=u("D",h.getDay(),l.dayNamesShort,l.dayNames);break;case "o":c+=i("o",(h.getTime()-
(new Date(h.getFullYear(),0,0)).getTime())/864E5,3);break;case "m":c+=i("m",h.getMonth()+1,2);break;case "M":c+=u("M",h.getMonth(),l.monthNamesShort,l.monthNames);break;case "y":c+=p("y")?h.getFullYear():(10>h.getYear()%100?"0":"")+h.getYear()%100;break;case "h":var o=h.getHours(),c=c+i("h",12<o?o-12:0==o?12:o,2);break;case "H":c+=i("H",h.getHours(),2);break;case "i":c+=i("i",h.getMinutes(),2);break;case "s":c+=i("s",h.getSeconds(),2);break;case "a":c+=11<h.getHours()?"pm":"am";break;case "A":c+=
11<h.getHours()?"PM":"AM";break;case "'":p("'")?c+="'":d=!0;break;default:c+=q.charAt(m)}return c};u.parseDate=function(q,h,l){var p=new Date;if(!q||!h)return p;var h="object"==typeof h?h.toString():h+"",i=a.extend({},O,l),u=i.shortYearCutoff,l=p.getFullYear(),m=p.getMonth()+1,c=p.getDate(),d=-1,o=p.getHours(),p=p.getMinutes(),w=0,n=-1,b=!1,s=function(a){(a=D+1<q.length&&q.charAt(D+1)==a)&&D++;return a},y=function(a){s(a);a=h.substr(r).match(RegExp("^\\d{1,"+("@"==a?14:"!"==a?20:"y"==a?4:"o"==a?3:
2)+"}"));if(!a)return 0;r+=a[0].length;return parseInt(a[0],10)},z=function(a,b,c){a=s(a)?c:b;for(b=0;b<a.length;b++)if(h.substr(r,a[b].length).toLowerCase()==a[b].toLowerCase())return r+=a[b].length,b+1;return 0},r=0,D;for(D=0;D<q.length;D++)if(b)"'"==q.charAt(D)&&!s("'")?b=!1:r++;else switch(q.charAt(D)){case "d":c=y("d");break;case "D":z("D",i.dayNamesShort,i.dayNames);break;case "o":d=y("o");break;case "m":m=y("m");break;case "M":m=z("M",i.monthNamesShort,i.monthNames);break;case "y":l=y("y");
break;case "H":o=y("H");break;case "h":o=y("h");break;case "i":p=y("i");break;case "s":w=y("s");break;case "a":n=z("a",["am","pm"],["am","pm"])-1;break;case "A":n=z("A",["am","pm"],["am","pm"])-1;break;case "'":s("'")?r++:b=!0;break;default:r++}100>l&&(l+=(new Date).getFullYear()-(new Date).getFullYear()%100+(l<=("string"!=typeof u?u:(new Date).getFullYear()%100+parseInt(u,10))?0:-100));if(-1<d){m=1;c=d;do{i=32-(new Date(l,m-1,32)).getDate();if(c<=i)break;m++;c-=i}while(1)}o=new Date(l,m-1,c,-1==
n?o:n&&12>o?o+12:!n&&12==o?0:o,p,w);if(o.getFullYear()!=l||o.getMonth()+1!=m||o.getDate()!=c)throw"Invalid date";return o}})(jQuery);

/**
 * FeedHenry License
 */

//if (typeof window =="undefined"){
//    var window={};
//}
//this is a partial js file which defines the start of appform SDK closure
(function(_scope){
    
    //start module

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Geodesy representation conversion functions (c) Chris Veness 2002-2012                        */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var lat = Geo.parseDMS('51Â° 28â€² 40.12â€³ N');                                                 */
/*    var lon = Geo.parseDMS('000Â° 00â€² 05.31â€³ W');                                                */
/*    var p1 = new LatLon(lat, lon);                                                              */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
var Geo = {};
// Geo namespace, representing static class
/**
 * Parses string representing degrees/minutes/seconds into numeric degrees
 *
 * This is very flexible on formats, allowing signed decimal degrees, or deg-min-sec optionally
 * suffixed by compass direction (NSEW). A variety of separators are accepted (eg 3Âº 37' 09"W) 
 * or fixed-width format without separators (eg 0033709W). Seconds and minutes may be omitted. 
 * (Note minimal validation is done).
 *
 * @param   {String|Number} dmsStr: Degrees or deg/min/sec in variety of formats
 * @returns {Number} Degrees as decimal number
 * @throws  {TypeError} dmsStr is an object, perhaps DOM object without .value?
 */
Geo.parseDMS = function (dmsStr) {
  if (typeof deg == 'object')
    throw new TypeError('Geo.parseDMS - dmsStr is [DOM?] object');
  // check for signed decimal degrees without NSEW, if so return it directly
  if (typeof dmsStr === 'number' && isFinite(dmsStr))
    return Number(dmsStr);
  // strip off any sign or compass dir'n & split out separate d/m/s
  var dms = String(dmsStr).trim().replace(/^-/, '').replace(/[NSEW]$/i, '').split(/[^0-9.,]+/);
  if (dms[dms.length - 1] === '')
    dms.splice(dms.length - 1);
  // from trailing symbol
  if (dms === '')
    return NaN;
  // and convert to decimal degrees...
  var deg;
  switch (dms.length) {
  case 3:
    // interpret 3-part result as d/m/s
    deg = dms[0] / 1 + dms[1] / 60 + dms[2] / 3600;
    break;
  case 2:
    // interpret 2-part result as d/m
    deg = dms[0] / 1 + dms[1] / 60;
    break;
  case 1:
    // just d (possibly decimal) or non-separated dddmmss
    deg = dms[0];
    // check for fixed-width unseparated format eg 0033709W
    //if (/[NS]/i.test(dmsStr)) deg = '0' + deg;  // - normalise N/S to 3-digit degrees
    //if (/[0-9]{7}/.test(deg)) deg = deg.slice(0,3)/1 + deg.slice(3,5)/60 + deg.slice(5)/3600; 
    break;
  default:
    return NaN;
  }
  if (/^-|[WS]$/i.test(dmsStr.trim()))
    deg = -deg;
  // take '-', west and south as -ve
  return Number(deg);
};
/**
 * Convert decimal degrees to deg/min/sec format
 *  - degree, prime, double-prime symbols are added, but sign is discarded, though no compass
 *    direction is added
 *
 * @private
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} deg formatted as deg/min/secs according to specified format
 * @throws  {TypeError} deg is an object, perhaps DOM object without .value?
 */
Geo.toDMS = function (deg, format, dp) {
  if (typeof deg == 'object')
    throw new TypeError('Geo.toDMS - deg is [DOM?] object');
  if (isNaN(deg))
    return null;
  // give up here if we can't make a number from deg
  // default values
  if (typeof format == 'undefined')
    format = 'dms';
  if (typeof dp == 'undefined') {
    switch (format) {
    case 'd':
      dp = 4;
      break;
    case 'dm':
      dp = 2;
      break;
    case 'dms':
      dp = 0;
      break;
    default:
      format = 'dms';
      dp = 0;  // be forgiving on invalid format
    }
  }
  deg = Math.abs(deg);
  // (unsigned result ready for appending compass dir'n)
  var d;
  var m;
  var s;
  switch (format) {
  case 'd':
    d = deg.toFixed(dp);
    // round degrees
    if (d < 100)
      d = '0' + d;
    // pad with leading zeros
    if (d < 10)
      d = '0' + d;
    var dms = d + '\xb0';
    // add Âº symbol
    break;
  case 'dm':
    var min = (deg * 60).toFixed(dp);
    // convert degrees to minutes & round
     d = Math.floor(min / 60);
    // get component deg/min
     m = (min % 60).toFixed(dp);
    // pad with trailing zeros
    if (d < 100)
      d = '0' + d;
    // pad with leading zeros
    if (d < 10)
      d = '0' + d;
    if (m < 10)
      m = '0' + m;
    dms = d + '\xb0' + m + '\u2032';
    // add Âº, ' symbols
    break;
  case 'dms':
    var sec = (deg * 3600).toFixed(dp);
    // convert degrees to seconds & round
     d = Math.floor(sec / 3600);
    // get component deg/min/sec
     m = Math.floor(sec / 60) % 60;
     s = (sec % 60).toFixed(dp);
    // pad with trailing zeros
    if (d < 100)
      d = '0' + d;
    // pad with leading zeros
    if (d < 10)
      d = '0' + d;
    if (m < 10)
      m = '0' + m;
    if (s < 10)
      s = '0' + s;
    dms = d + '\xb0' + m + '\u2032' + s + '\u2033';
    // add Âº, ', " symbols
    break;
  }
  return dms;
};
/**
 * Convert numeric degrees to deg/min/sec latitude (suffixed with N/S)
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} Deg/min/seconds
 */
Geo.toLat = function (deg, format, dp) {
  var lat = Geo.toDMS(deg, format, dp);
  return lat == null ? '\xe2\u20ac\u201c' : lat.slice(1) + (deg < 0 ? 'S' : 'N');  // knock off initial '0' for lat!
};
/**
 * Convert numeric degrees to deg/min/sec longitude (suffixed with E/W)
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} Deg/min/seconds
 */
Geo.toLon = function (deg, format, dp) {
  var lon = Geo.toDMS(deg, format, dp);
  return lon == null ? '\xe2\u20ac\u201c' : lon + (deg < 0 ? 'W' : 'E');
};
/**
 * Convert numeric degrees to deg/min/sec as a bearing (0Âº..360Âº)
 *
 * @param   {Number} deg: Degrees
 * @param   {String} [format=dms]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to use - default 0 for dms, 2 for dm, 4 for d
 * @returns {String} Deg/min/seconds
 */
Geo.toBrng = function (deg, format, dp) {
  deg = (Number(deg) + 360) % 360;
  // normalise -ve values to 180Âº..360Âº
  var brng = Geo.toDMS(deg, format, dp);
  return brng == null ? '\xe2\u20ac\u201c' : brng.replace('360', '0');  // just in case rounding took us up to 360Âº!
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (!window.console)
  window.console = {
    log: function () {
    }
  };
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Latitude/longitude spherical geodesy formulae & scripts (c) Chris Veness 2002-2012            */
/*   - www.movable-type.co.uk/scripts/latlong.html                                                */
/*                                                                                                */
/*  Sample usage:                                                                                 */
/*    var p1 = new LatLon(51.5136, -0.0983);                                                      */
/*    var p2 = new LatLon(51.4778, -0.0015);                                                      */
/*    var dist = p1.distanceTo(p2);          // in km                                             */
/*    var brng = p1.bearingTo(p2);           // in degrees clockwise from north                   */
/*    ... etc                                                                                     */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Note that minimal error checking is performed in this example code!                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/**
 * @requires Geo
 */
/**
 * Creates a point on the earth's surface at the supplied latitude / longitude
 *
 * @constructor
 * @param {Number} lat: latitude in numeric degrees
 * @param {Number} lon: longitude in numeric degrees
 * @param {Number} [rad=6371]: radius of earth if different value is required from standard 6,371km
 */
function LatLon(lat, lon, rad) {
  if (typeof rad == 'undefined')
    rad = 6371;
  // earth's mean radius in km
  // only accept numbers or valid numeric strings
  this._lat = typeof lat === 'number' ? lat : typeof lat === 'string' && lat.trim() !== '' ? +lat : NaN;
  this._lon = typeof lon === 'number' ? lon : typeof lon === 'string' && lon.trim() !=='' ? +lon : NaN;
  this._radius = typeof rad === 'number' ? rad : typeof rad === 'string' && trim(lon) !== '' ? +rad : NaN;
}
/**
 * Returns the distance from this point to the supplied point, in km 
 * (using Haversine formula)
 *
 * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
 *       Sky and Telescope, vol 68, no 2, 1984
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @param   {Number} [precision=4]: no of significant digits to use for returned value
 * @returns {Number} Distance in km between this point and destination point
 */
LatLon.prototype.distanceTo = function (point, precision) {
  // default 4 sig figs reflects typical 0.3% accuracy of spherical model
  if (typeof precision == 'undefined')
    precision = 4;
  var R = this._radius;
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad(), lon2 = point._lon.toRad();
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d.toPrecisionFixed(precision);
};
/**
 * Returns the (initial) bearing from this point to the supplied point, in degrees
 *   see http://williams.best.vwh.net/avform.htm#Crs
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {Number} Initial bearing in degrees from North
 */
LatLon.prototype.bearingTo = function (point) {
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLon = (point._lon - this._lon).toRad();
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = Math.atan2(y, x);
  return (brng.toDeg() + 360) % 360;
};
/**
 * Returns final bearing arriving at supplied destination point from this point; the final bearing 
 * will differ from the initial bearing by varying degrees according to distance and latitude
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {Number} Final bearing in degrees from North
 */
LatLon.prototype.finalBearingTo = function (point) {
  // get initial bearing from supplied point back to this point...
  var lat1 = point._lat.toRad(), lat2 = this._lat.toRad();
  var dLon = (this._lon - point._lon).toRad();
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = Math.atan2(y, x);
  // ... & reverse it by adding 180Â°
  return (brng.toDeg() + 180) % 360;
};
/**
 * Returns the midpoint between this point and the supplied point.
 *   see http://mathforum.org/library/drmath/view/51822.html for derivation
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {LatLon} Midpoint between this point and the supplied point
 */
LatLon.prototype.midpointTo = function (point) {
  var lat1 = this._lat.toRad();
  var lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad();
  var dLon = (point._lon - this._lon).toRad();
  var Bx = Math.cos(lat2) * Math.cos(dLon);
  var By = Math.cos(lat2) * Math.sin(dLon);
  var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
  var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
  lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
  // normalise to -180..+180Âº
  return new LatLon(lat3.toDeg(), lon3.toDeg());
};
/**
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given initial bearing (bearing may vary before destination is reached)
 *
 *   see http://williams.best.vwh.net/avform.htm#LL
 *
 * @param   {Number} brng: Initial bearing in degrees
 * @param   {Number} dist: Distance in km
 * @returns {LatLon} Destination point
 */
LatLon.prototype.destinationPoint = function (brng, dist) {
  dist = typeof dist === 'number' ? dist : typeof dist === 'string' && dist.trim() !== '' ? +dist : NaN;
  dist = dist / this._radius;
  // convert dist to angular distance in radians
  brng = brng.toRad();
  // 
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) + Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
  var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) * Math.cos(lat1), Math.cos(dist) - Math.sin(lat1) * Math.sin(lat2));
  lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
  // normalise to -180..+180Âº
  return new LatLon(lat2.toDeg(), lon2.toDeg());
};
/**
 * Returns the point of intersection of two paths defined by point and bearing
 *
 *   see http://williams.best.vwh.net/avform.htm#Intersection
 *
 * @param   {LatLon} p1: First point
 * @param   {Number} brng1: Initial bearing from first point
 * @param   {LatLon} p2: Second point
 * @param   {Number} brng2: Initial bearing from second point
 * @returns {LatLon} Destination point (null if no unique intersection defined)
 */
LatLon.intersection = function (p1, brng1, p2, brng2) {
  brng1 = typeof brng1 === 'number' ? brng1 : typeof brng1 === 'string' && trim(brng1) !== '' ? +brng1 : NaN;
  brng2 = typeof brng2 === 'number' ? brng2 : typeof brng2 === 'string' && trim(brng2) !== '' ? +brng2 : NaN;
  var lat1 = p1._lat.toRad(), lon1 = p1._lon.toRad();
  var lat2 = p2._lat.toRad(), lon2 = p2._lon.toRad();
  var brng13 = brng1.toRad(), brng23 = brng2.toRad();
  var dLat = lat2 - lat1, dLon = lon2 - lon1;
  var dist12 = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)));
  var brng12;
  var brng21;
  var alpha1;
  var alpha2;
  if (dist12 === 0)
    return null;
  // initial/final bearings between points
  var brngA = Math.acos((Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat1)));
  if (isNaN(brngA))
    brngA = 0;
  // protect against rounding
  var brngB = Math.acos((Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) / (Math.sin(dist12) * Math.cos(lat2)));
  if (Math.sin(lon2 - lon1) > 0) {
    brng12 = brngA;
    brng21 = 2 * Math.PI - brngB;
  } else {
    brng12 = 2 * Math.PI - brngA;
    brng21 = brngB;
  }
  alpha1 = (brng13 - brng12 + Math.PI) % (2 * Math.PI) - Math.PI;
  // angle 2-1-3
  alpha2 = (brng21 - brng23 + Math.PI) % (2 * Math.PI) - Math.PI;
  // angle 1-2-3
  if (Math.sin(alpha1) === 0 && Math.sin(alpha2) === 0)
    return null;
  // infinite intersections
  if (Math.sin(alpha1) * Math.sin(alpha2) < 0)
    return null;
  // ambiguous intersection
  //alpha1 = Math.abs(alpha1);
  //alpha2 = Math.abs(alpha2);
  // ... Ed Williams takes abs of alpha1/alpha2, but seems to break calculation?
  var alpha3 = Math.acos(-Math.cos(alpha1) * Math.cos(alpha2) + Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12));
  var dist13 = Math.atan2(Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2), Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3));
  var lat3 = Math.asin(Math.sin(lat1) * Math.cos(dist13) + Math.cos(lat1) * Math.sin(dist13) * Math.cos(brng13));
  var dLon13 = Math.atan2(Math.sin(brng13) * Math.sin(dist13) * Math.cos(lat1), Math.cos(dist13) - Math.sin(lat1) * Math.sin(lat3));
  var lon3 = lon1 + dLon13;
  lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
  // normalise to -180..+180Âº
  return new LatLon(lat3.toDeg(), lon3.toDeg());
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/**
 * Returns the distance from this point to the supplied point, in km, travelling along a rhumb line
 *
 *   see http://williams.best.vwh.net/avform.htm#Rhumb
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {Number} Distance in km between this point and destination point
 */
LatLon.prototype.rhumbDistanceTo = function (point) {
  var R = this._radius;
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLat = (point._lat - this._lat).toRad();
  var dLon = Math.abs(point._lon - this._lon).toRad();
  var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
  var q = isFinite(dLat / dPhi) ? dLat / dPhi : Math.cos(lat1);
  // E-W line gives dPhi=0
  // if dLon over 180Â° take shorter rhumb across anti-meridian:
  if (Math.abs(dLon) > Math.PI) {
    dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
  }
  var dist = Math.sqrt(dLat * dLat + q * q * dLon * dLon) * R;
  return dist.toPrecisionFixed(4);  // 4 sig figs reflects typical 0.3% accuracy of spherical model
};
/**
 * Returns the bearing from this point to the supplied point along a rhumb line, in degrees
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {Number} Bearing in degrees from North
 */
LatLon.prototype.rhumbBearingTo = function (point) {
  var lat1 = this._lat.toRad(), lat2 = point._lat.toRad();
  var dLon = (point._lon - this._lon).toRad();
  var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
  if (Math.abs(dLon) > Math.PI)
    dLon = dLon > 0 ? -(2 * Math.PI - dLon) : 2 * Math.PI + dLon;
  var brng = Math.atan2(dLon, dPhi);
  return (brng.toDeg() + 360) % 360;
};
/**
 * Returns the destination point from this point having travelled the given distance (in km) on the 
 * given bearing along a rhumb line
 *
 * @param   {Number} brng: Bearing in degrees from North
 * @param   {Number} dist: Distance in km
 * @returns {LatLon} Destination point
 */
LatLon.prototype.rhumbDestinationPoint = function (brng, dist) {
  var R = this._radius;
  var d = parseFloat(dist) / R;
  // d = angular distance covered on earthâ€™s surface
  var lat1 = this._lat.toRad(), lon1 = this._lon.toRad();
  brng = brng.toRad();
  var dLat = d * Math.cos(brng);
  // nasty kludge to overcome ill-conditioned results around parallels of latitude:
  if (Math.abs(dLat) < 1e-10)
    dLat = 0;
  // dLat < 1 mm
  var lat2 = lat1 + dLat;
  var dPhi = Math.log(Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4));
  var q = isFinite(dLat / dPhi) ? dLat / dPhi : Math.cos(lat1);
  // E-W line gives dPhi=0
  var dLon = d * Math.sin(brng) / q;
  // check for some daft bugger going past the pole, normalise latitude if so
  if (Math.abs(lat2) > Math.PI / 2)
    lat2 = lat2 > 0 ? Math.PI - lat2 : -Math.PI - lat2;
  lon2 = (lon1 + dLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
  return new LatLon(lat2.toDeg(), lon2.toDeg());
};
/**
 * Returns the loxodromic midpoint (along a rhumb line) between this point and the supplied point.
 *   see http://mathforum.org/kb/message.jspa?messageID=148837
 *
 * @param   {LatLon} point: Latitude/longitude of destination point
 * @returns {LatLon} Midpoint between this point and the supplied point
 */
LatLon.prototype.rhumbMidpointTo = function (point) {
  var lat1 = this._lat.toRad();
  var lon1 = this._lon.toRad();
  var lat2 = point._lat.toRad();
  var lon2 = point._lon.toRad();
  if (Math.abs(lon2 - lon1) > Math.PI)
    lon1 += 2 * Math.PI;
  // crossing anti-meridian
  var lat3 = (lat1 + lat2) / 2;
  var f1 = Math.tan(Math.PI / 4 + lat1 / 2);
  var f2 = Math.tan(Math.PI / 4 + lat2 / 2);
  var f3 = Math.tan(Math.PI / 4 + lat3 / 2);
  var lon3 = ((lon2 - lon1) * Math.log(f3) + lon1 * Math.log(f2) - lon2 * Math.log(f1)) / Math.log(f2 / f1);
  if (!isFinite(lon3))
    lon3 = (lon1 + lon2) / 2;
  // parallel of latitude
  lon3 = (lon3 + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
  // normalise to -180..+180Âº
  return new LatLon(lat3.toDeg(), lon3.toDeg());
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/**
 * Returns the latitude of this point; signed numeric degrees if no format, otherwise format & dp 
 * as per Geo.toLat()
 *
 * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to display
 * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
 */
LatLon.prototype.lat = function (format, dp) {
  if (typeof format == 'undefined')
    return this._lat;
  return Geo.toLat(this._lat, format, dp);
};
/**
 * Returns the longitude of this point; signed numeric degrees if no format, otherwise format & dp 
 * as per Geo.toLon()
 *
 * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to display
 * @returns {Number|String} Numeric degrees if no format specified, otherwise deg/min/sec
 */
LatLon.prototype.lon = function (format, dp) {
  if (typeof format == 'undefined')
    return this._lon;
  return Geo.toLon(this._lon, format, dp);
};
/**
 * Returns a string representation of this point; format and dp as per lat()/lon()
 *
 * @param   {String} [format]: Return value as 'd', 'dm', 'dms'
 * @param   {Number} [dp=0|2|4]: No of decimal places to display
 * @returns {String} Comma-separated latitude/longitude
 */
LatLon.prototype.toString = function (format, dp) {
  if (typeof format == 'undefined')
    format = 'dms';
  return Geo.toLat(this._lat, format, dp) + ', ' + Geo.toLon(this._lon, format, dp);
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
// ---- extend Number object with methods for converting degrees/radians
/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRad == 'undefined') {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  };
}
/** Converts radians to numeric (signed) degrees */
if (typeof Number.prototype.toDeg == 'undefined') {
  Number.prototype.toDeg = function () {
    return this * 180 / Math.PI;
  };
}
/** 
 * Formats the significant digits of a number, using only fixed-point notation (no exponential)
 * 
 * @param   {Number} precision: Number of significant digits to appear in the returned string
 * @returns {String} A string representation of number which contains precision significant digits
 */
if (typeof Number.prototype.toPrecisionFixed == 'undefined') {
  Number.prototype.toPrecisionFixed = function (precision) {
    // use standard toPrecision method
    var n = this.toPrecision(precision);
    // ... but replace +ve exponential format with trailing zeros
    n = n.replace(/(.+)e\+(.+)/, function (n, sig, exp) {
      sig = sig.replace(/\./, '');
      // remove decimal from significand
      l = sig.length - 1;
      while (exp-- > l)
        sig = sig + '0';
      // append zeros from exponent
      return sig;
    });
    // ... and replace -ve exponential format with leading zeros
    n = n.replace(/(.+)e-(.+)/, function (n, sig, exp) {
      sig = sig.replace(/\./, '');
      // remove decimal from significand
      while (exp-- > 1)
        sig = '0' + sig;
      // prepend zeros from exponent
      return '0.' + sig;
    });
    return n;
  };
}
/** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
if (typeof String.prototype.trim == 'undefined') {
  String.prototype.trim = function () {
    return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (!window.console)
  window.console = {
    log: function () {
    }
  };
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Ordnance Survey Grid Reference functions  (c) Chris Veness 2005-2012                          */
/*   - www.movable-type.co.uk/scripts/gridref.js                                                  */
/*   - www.movable-type.co.uk/scripts/latlon-gridref.html                                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/**
 * @requires LatLon
 */
/**
 * Creates a OsGridRef object
 *
 * @constructor
 * @param {Number} easting:  Easting in metres from OS false origin
 * @param {Number} northing: Northing in metres from OS false origin
 */
function OsGridRef(easting, northing) {
  this.easting = parseInt(easting, 10);
  this.northing = parseInt(northing, 10);
}
/**
 * Convert (OSGB36) latitude/longitude to Ordnance Survey grid reference easting/northing coordinate
 *
 * @param {LatLon} point: OSGB36 latitude/longitude
 * @return {OsGridRef} OS Grid Reference easting/northing
 */
OsGridRef.latLongToOsGrid = function (point) {
  var lat = point.lat().toRad();
  var lon = point.lon().toRad();
  var a = 6377563.396, b = 6356256.91;
  // Airy 1830 major & minor semi-axes
  var F0 = 0.9996012717;
  // NatGrid scale factor on central meridian
  var lat0 = (49).toRad(),
    lon0 = (-2).toRad();
  // NatGrid true origin is 49ºN,2ºW
  var N0 = -100000, E0 = 400000;
  // northing & easting of true origin, metres
  var e2 = 1 - b * b / (a * a);
  // eccentricity squared
  var n = (a - b) / (a + b), n2 = n * n, n3 = n * n * n;
  var cosLat = Math.cos(lat), sinLat = Math.sin(lat);
  var nu = a * F0 / Math.sqrt(1 - e2 * sinLat * sinLat);
  // transverse radius of curvature
  var rho = a * F0 * (1 - e2) / Math.pow(1 - e2 * sinLat * sinLat, 1.5);
  // meridional radius of curvature
  var eta2 = nu / rho - 1;
  var Ma = (1 + n + 5 / 4 * n2 + 5 / 4 * n3) * (lat - lat0);
  var Mb = (3 * n + 3 * n * n + 21 / 8 * n3) * Math.sin(lat - lat0) * Math.cos(lat + lat0);
  var Mc = (15 / 8 * n2 + 15 / 8 * n3) * Math.sin(2 * (lat - lat0)) * Math.cos(2 * (lat + lat0));
  var Md = 35 / 24 * n3 * Math.sin(3 * (lat - lat0)) * Math.cos(3 * (lat + lat0));
  var M = b * F0 * (Ma - Mb + Mc - Md);
  // meridional arc
  var cos3lat = cosLat * cosLat * cosLat;
  var cos5lat = cos3lat * cosLat * cosLat;
  var tan2lat = Math.tan(lat) * Math.tan(lat);
  var tan4lat = tan2lat * tan2lat;
  var I = M + N0;
  var II = nu / 2 * sinLat * cosLat;
  var III = nu / 24 * sinLat * cos3lat * (5 - tan2lat + 9 * eta2);
  var IIIA = nu / 720 * sinLat * cos5lat * (61 - 58 * tan2lat + tan4lat);
  var IV = nu * cosLat;
  var V = nu / 6 * cos3lat * (nu / rho - tan2lat);
  var VI = nu / 120 * cos5lat * (5 - 18 * tan2lat + tan4lat + 14 * eta2 - 58 * tan2lat * eta2);
  var dLon = lon - lon0;
  var dLon2 = dLon * dLon, dLon3 = dLon2 * dLon, dLon4 = dLon3 * dLon, dLon5 = dLon4 * dLon, dLon6 = dLon5 * dLon;
  var N = I + II * dLon2 + III * dLon4 + IIIA * dLon6;
  var E = E0 + IV * dLon + V * dLon3 + VI * dLon5;
  return new OsGridRef(E, N);
};
/**
 * Convert Ordnance Survey grid reference easting/northing coordinate to (OSGB36) latitude/longitude
 *
 * @param {OsGridRef} easting/northing to be converted to latitude/longitude
 * @return {LatLon} latitude/longitude (in OSGB36) of supplied grid reference
 */
OsGridRef.osGridToLatLong = function (gridref) {
  var E = gridref.easting;
  var N = gridref.northing;
  var a = 6377563.396, b = 6356256.91;
  // Airy 1830 major & minor semi-axes
  var F0 = 0.9996012717;
  // NatGrid scale factor on central meridian
  var lat0 = 49 * Math.PI / 180, lon0 = -2 * Math.PI / 180;
  // NatGrid true origin
  var N0 = -100000, E0 = 400000;
  // northing & easting of true origin, metres
  var e2 = 1 - b * b / (a * a);
  // eccentricity squared
  var n = (a - b) / (a + b), n2 = n * n, n3 = n * n * n;
  var lat = lat0, M = 0;
  do {
    lat = (N - N0 - M) / (a * F0) + lat;
    var Ma = (1 + n + 5 / 4 * n2 + 5 / 4 * n3) * (lat - lat0);
    var Mb = (3 * n + 3 * n * n + 21 / 8 * n3) * Math.sin(lat - lat0) * Math.cos(lat + lat0);
    var Mc = (15 / 8 * n2 + 15 / 8 * n3) * Math.sin(2 * (lat - lat0)) * Math.cos(2 * (lat + lat0));
    var Md = 35 / 24 * n3 * Math.sin(3 * (lat - lat0)) * Math.cos(3 * (lat + lat0));
    M = b * F0 * (Ma - Mb + Mc - Md);  // meridional arc
  } while (N - N0 - M >= 0.00001);
  // ie until < 0.01mm
  var cosLat = Math.cos(lat), sinLat = Math.sin(lat);
  var nu = a * F0 / Math.sqrt(1 - e2 * sinLat * sinLat);
  // transverse radius of curvature
  var rho = a * F0 * (1 - e2) / Math.pow(1 - e2 * sinLat * sinLat, 1.5);
  // meridional radius of curvature
  var eta2 = nu / rho - 1;
  var tanLat = Math.tan(lat);
  var tan2lat = tanLat * tanLat, tan4lat = tan2lat * tan2lat, tan6lat = tan4lat * tan2lat;
  var secLat = 1 / cosLat;
  var nu3 = nu * nu * nu, nu5 = nu3 * nu * nu, nu7 = nu5 * nu * nu;
  var VII = tanLat / (2 * rho * nu);
  var VIII = tanLat / (24 * rho * nu3) * (5 + 3 * tan2lat + eta2 - 9 * tan2lat * eta2);
  var IX = tanLat / (720 * rho * nu5) * (61 + 90 * tan2lat + 45 * tan4lat);
  var X = secLat / nu;
  var XI = secLat / (6 * nu3) * (nu / rho + 2 * tan2lat);
  var XII = secLat / (120 * nu5) * (5 + 28 * tan2lat + 24 * tan4lat);
  var XIIA = secLat / (5040 * nu7) * (61 + 662 * tan2lat + 1320 * tan4lat + 720 * tan6lat);
  var dE = E - E0, dE2 = dE * dE, dE3 = dE2 * dE, dE4 = dE2 * dE2, dE5 = dE3 * dE2, dE6 = dE4 * dE2, dE7 = dE5 * dE2;
  lat = lat - VII * dE2 + VIII * dE4 - IX * dE6;
  var lon = lon0 + X * dE - XI * dE3 + XII * dE5 - XIIA * dE7;
  return new LatLon(lat.toDeg(), lon.toDeg());
};
/**
 * Converts standard grid reference ('SU387148') to fully numeric ref ([438700,114800]);
 *   returned co-ordinates are in metres, centred on supplied grid square;
 *
 * @param {String} gridref: Standard format OS grid reference
 * @returns {OsGridRef}     Numeric version of grid reference in metres from false origin
 */
OsGridRef.parse = function (gridref) {
  gridref = gridref.trim();
  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
  var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
  var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
  // shuffle down letters after 'I' since 'I' is not used in grid:
  if (l1 > 7)
    l1--;
  if (l2 > 7)
    l2--;
  // convert grid letters into 100km-square indexes from false origin (grid square SV):
  var e = (l1 - 2) % 5 * 5 + l2 % 5;
  var n = 19 - Math.floor(l1 / 5) * 5 - Math.floor(l2 / 5);
  if (e < 0 || e > 6 || n < 0 || n > 12)
    return new OsGridRef(NaN, NaN);
  // skip grid letters to get numeric part of ref, stripping any spaces:
  gridref = gridref.slice(2).replace(/ /g, '');
  // append numeric part of references to grid index:
  e += gridref.slice(0, gridref.length / 2);
  n += gridref.slice(gridref.length / 2);
  // normalise to 1m grid, rounding up to centre of grid square:
  switch (gridref.length) {
  case 0:
    e += '50000';
    n += '50000';
    break;
  case 2:
    e += '5000';
    n += '5000';
    break;
  case 4:
    e += '500';
    n += '500';
    break;
  case 6:
    e += '50';
    n += '50';
    break;
  case 8:
    e += '5';
    n += '5';
    break;
  case 10:
    break;
  // 10-digit refs are already 1m
  default:
    return new OsGridRef(NaN, NaN);
  }
  return new OsGridRef(e, n);
};
/**
 * Converts this numeric grid reference to standard OS grid reference
 *
 * @param {Number} [digits=6] Precision of returned grid reference (6 digits = metres)
 * @return {String) This grid reference in standard format
 */
OsGridRef.prototype.toString = function (digits) {
  digits = typeof digits == 'undefined' ? 10 : digits;
  var e = this.easting,
  n = this.northing;
  if (isNaN(e) || isNaN(n))
    return '??';
  // get the 100km-grid indices
  var e100k = Math.floor(e / 100000), n100k = Math.floor(n / 100000);
  if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12)
    return '';
  // translate those into numeric equivalents of the grid letters
  var l1 = 19 - n100k - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
  var l2 = (19 - n100k) * 5 % 25 + e100k % 5;
  // compensate for skipped 'I' and build grid letter-pairs
  if (l1 > 7)
    l1++;
  if (l2 > 7)
    l2++;
  var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0));
  // strip 100km-grid indices from easting & northing, and reduce precision
  e = Math.floor(e % 100000 / Math.pow(10, 5 - digits / 2));
  n = Math.floor(n % 100000 / Math.pow(10, 5 - digits / 2));
  var gridRef = letPair + ' ' + e.padLz(digits / 2) + ' ' + n.padLz(digits / 2);
  return gridRef;
};
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
if (typeof String.prototype.trim == 'undefined') {
  String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  };
}
/** Pads a number with sufficient leading zeros to make it w chars wide */
if (typeof String.prototype.padLz == 'undefined') {
  Number.prototype.padLz = function (w) {
    var n = this.toString();
    var l = n.length;
    for (var i = 0; i < w - l; i++)
      n = '0' + n;
    return n;
  };
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
if (!window.console)
  window.console = {
    log: function () {
    }
  };
/**
 * @preserve SignaturePad: A jQuery plugin for assisting in the creation of an HTML5 canvas
 * based signature pad. Records the drawn signature in JSON for later regeneration.
 *
 * Dependencies: FlashCanvas/1.5, json2.js, jQuery/1.3.2+
 *
 * @project ca.thomasjbradley.applications.signaturepad
 * @author Thomas J Bradley <hey@thomasjbradley.ca>
 * @link http://thomasjbradley.ca/lab/signature-pad
 * @link http://github.com/thomasjbradley/signature-pad
 * @copyright Copyright MMXI, Thomas J Bradley
 * @license New BSD License
 * @version {{version}}
 */
/**
 * Usage for accepting signatures:
 *  $('.sigPad').signaturePad()
 *
 * Usage for displaying previous signatures:
 *  $('.sigPad').signaturePad({displayOnly:true}).regenerate(sig)
 *  or
 *  var api = $('.sigPad').signaturePad({displayOnly:true})
 *  api.regenerate(sig)
 */
(function ($) {
  function SignaturePad(selector, options) {
    /**
   * Reference to the object for use in public methods
   *
   * @private
   *
   * @type {Object}
   */
    var self = this, settings = $.extend({}, $.fn.signaturePad.defaults, options), context = $(selector), canvas = $(settings.canvas, context), element = canvas.get(0), canvasContext = null, previous = {
        'x': null,
        'y': null
      }, output = [], mouseLeaveTimeout = false, touchable = false, eventsBound = false;
    /**
   * Draws a line on canvas using the mouse position
   * Checks previous position to not draw over top of previous drawing
   *  (makes the line really thick and poorly anti-aliased)
   *
   * @private
   *
   * @param {Object} e The event object
   * @param {Number} newYOffset A pixel value for drawing the newY, used for drawing a single dot on click
   */
    function drawLine(e, newYOffset) {
      var offset = $(e.target).offset(), newX, newY;
      clearTimeout(mouseLeaveTimeout);
      mouseLeaveTimeout = false;
      if (typeof e.changedTouches !== 'undefined') {
        newX = Math.floor(e.changedTouches[0].pageX - offset.left);
        newY = Math.floor(e.changedTouches[0].pageY - offset.top);
      } else {
        newX = Math.floor(e.pageX - offset.left);
        newY = Math.floor(e.pageY - offset.top);
      }
      if (previous.x === newX && previous.y === newY)
        return true;
      if (previous.x === null)
        previous.x = newX;
      if (previous.y === null)
        previous.y = newY;
      if (newYOffset)
        newY += newYOffset;
      canvasContext.beginPath();
      canvasContext.moveTo(previous.x, previous.y);
      canvasContext.lineTo(newX, newY);
      canvasContext.lineCap = settings.penCap;
      canvasContext.stroke();
      canvasContext.closePath();
      output.push({
        'lx': newX,
        'ly': newY,
        'mx': previous.x,
        'my': previous.y
      });
      previous.x = newX;
      previous.y = newY;
    }
    /**
   * Callback registered to mouse/touch events of the canvas
   * Stops the drawing abilities
   *
   * @private
   *
   * @param {Object} e The event object
   */
    function stopDrawing() {
      if (touchable) {
        canvas.each(function () {
          this.ontouchmove = null;
        });
      } else {
        canvas.unbind('mousemove.signaturepad');
      }
      previous.x = null;
      previous.y = null;
      if (output.length > 0)
        $(settings.output, context).val(JSON.stringify(output));
    }
    /**
   * Draws the signature line
   *
   * @private
   */
    function drawSigLine() {
      if (!settings.lineWidth)
        return false;
      canvasContext.beginPath();
      canvasContext.lineWidth = settings.lineWidth;
      canvasContext.strokeStyle = settings.lineColour;
      canvasContext.moveTo(settings.lineMargin, settings.lineTop);
      canvasContext.lineTo(element.width - settings.lineMargin, settings.lineTop);
      canvasContext.stroke();
      canvasContext.closePath();
    }
    /**
   * Clears all drawings off the canvas and redraws the signature line
   *
   * @private
   */
    function clearCanvas() {
      stopDrawing();
      canvasContext.clearRect(0, 0, element.width, element.height);
      canvasContext.fillStyle = settings.bgColour;
      canvasContext.fillRect(0, 0, element.width, element.height);
      if (!settings.displayOnly)
        drawSigLine();
      canvasContext.lineWidth = settings.penWidth;
      canvasContext.strokeStyle = settings.penColour;
      $(settings.output, context).val('');
      output = [];
    }
    /**
   * Callback registered to mouse/touch events of canvas
   * Triggers the drawLine function
   *
   * @private
   *
   * @param {Object} e The event object
   * @param {Object} o The object context registered to the event; canvas
   */
    function startDrawing(e, o) {
      if (touchable) {
        canvas.each(function () {
          this.addEventListener('touchmove', drawLine, false);
        });
      } else {
        canvas.bind('mousemove.signaturepad', drawLine);
      }
      // Draws a single point on initial mouse down, for people with periods in their name
      drawLine(e, 1);
    }
    /**
   * Removes all the mouse events from the canvas
   *
   * @private
   */
    function disableCanvas() {
      eventsBound = false;
      if (touchable) {
        canvas.each(function () {
          this.removeEventListener('touchstart', stopDrawing);
          this.removeEventListener('touchend', stopDrawing);
          this.removeEventListener('touchmove', drawLine);
        });
      } else {
        canvas.unbind('mousedown.signaturepad');
        canvas.unbind('mouseup.signaturepad');
        canvas.unbind('mousemove.signaturepad');
        canvas.unbind('mouseleave.signaturepad');
      }
      $(settings.clear, context).unbind('click.signaturepad');
    }
    /**
   * Lazy touch event detection
   * Uses the first press on the canvas to detect either touch or mouse reliably
   * Will then bind other events as needed
   *
   * @private
   *
   * @param {Object} e The event object
   */
    function initDrawEvents(e) {
      if (eventsBound)
        return false;
      eventsBound = true;
      if (typeof e.changedTouches !== 'undefined')
        touchable = true;
      if (touchable) {
        canvas.each(function () {
          this.addEventListener('touchend', stopDrawing, false);
          this.addEventListener('touchcancel', stopDrawing, false);
        });
        canvas.unbind('mousedown.signaturepad');
      } else {
        canvas.bind('mouseup.signaturepad', function (e) {
          stopDrawing();
        });
        canvas.bind('mouseleave.signaturepad', function (e) {
          if (!mouseLeaveTimeout) {
            mouseLeaveTimeout = setTimeout(function () {
              stopDrawing();
              clearTimeout(mouseLeaveTimeout);
              mouseLeaveTimeout = false;
            }, 500);
          }
        });
        canvas.each(function () {
          this.ontouchstart = null;
        });
      }
    }
    /**
   * Triggers the abilities to draw on the canvas
   * Sets up mouse/touch events, hides and shows descriptions and sets current classes
   *
   * @private
   */
    function drawIt() {
      $(settings.typed, context).hide();
      clearCanvas();
      canvas.each(function () {
        this.ontouchstart = function (e) {
          e.preventDefault();
          initDrawEvents(e);
          startDrawing(e, this);
        };
      });
      canvas.bind('mousedown.signaturepad', function (e) {
        initDrawEvents(e);
        startDrawing(e, this);
      });
      $(settings.clear, context).bind('click.signaturepad', function (e) {
        e.preventDefault();
        clearCanvas();
      });
      $(settings.typeIt, context).bind('click.signaturepad', function (e) {
        e.preventDefault();
        typeIt();
      });
      $(settings.drawIt, context).unbind('click.signaturepad');
      $(settings.drawIt, context).bind('click.signaturepad', function (e) {
        e.preventDefault();
      });
      $(settings.typeIt, context).removeClass(settings.currentClass);
      $(settings.drawIt, context).addClass(settings.currentClass);
      $(settings.sig, context).addClass(settings.currentClass);
      $(settings.typeItDesc, context).hide();
      $(settings.drawItDesc, context).show();
      $(settings.clear, context).show();
    }
    /**
   * Triggers the abilities to type in the input for generating a signature
   * Sets up mouse events, hides and shows descriptions and sets current classes
   *
   * @private
   */
    function typeIt() {
      clearCanvas();
      disableCanvas();
      $(settings.typed, context).show();
      $(settings.drawIt, context).bind('click.signaturepad', function (e) {
        e.preventDefault();
        drawIt();
      });
      $(settings.typeIt, context).unbind('click.signaturepad');
      $(settings.typeIt, context).bind('click.signaturepad', function (e) {
        e.preventDefault();
      });
      $(settings.output, context).val('');
      $(settings.drawIt, context).removeClass(settings.currentClass);
      $(settings.typeIt, context).addClass(settings.currentClass);
      $(settings.sig, context).removeClass(settings.currentClass);
      $(settings.drawItDesc, context).hide();
      $(settings.clear, context).hide();
      $(settings.typeItDesc, context).show();
    }
    /**
   * Callback registered on key up and blur events for input field
   * Writes the text fields value as Html into an element
   *
   * @private
   *
   * @param {String} val The value of the input field
   */
    function type(val) {
      $(settings.typed, context).html(val.replace(/>/g, '&gt;').replace(/</g, '&lt;'));
      while ($(settings.typed, context).width() > element.width) {
        var oldSize = $(settings.typed, context).css('font-size').replace(/px/, '');
        $(settings.typed, context).css('font-size', oldSize - 1 + 'px');
      }
    }
    /**
   * Default onBeforeValidate function to clear errors
   *
   * @private
   *
   * @param {Object} context current context object
   * @param {Object} settings provided settings
   */
    function onBeforeValidate(context, settings) {
      $('p.' + settings.errorClass, context).remove();
      context.removeClass(settings.errorClass);
      $('input, label', context).removeClass(settings.errorClass);
    }
    /**
   * Default onFormError function to show errors
   *
   * @private
   *
   * @param {Object} errors object contains validation errors (e.g. nameInvalid=true)
   * @param {Object} context current context object
   * @param {Object} settings provided settings
   */
    function onFormError(errors, context, settings) {
      if (errors.nameInvalid) {
        context.prepend([
          '<p class="',
          settings.errorClass,
          '">',
          settings.errorMessage,
          '</p>'
        ].join(''));
        $(settings.name, context).focus();
        $(settings.name, context).addClass(settings.errorClass);
        $('label[for=' + $(settings.name).attr('id') + ']', context).addClass(settings.errorClass);
      }
      if (errors.drawInvalid)
        context.prepend([
          '<p class="',
          settings.errorClass,
          '">',
          settings.errorMessageDraw,
          '</p>'
        ].join(''));
    }
    /**
   * Validates the form to confirm a name was typed in the field
   * If drawOnly also confirms that the user drew a signature
   *
   * @private
   *
   * @return {Boolean}
   */
    function validateForm() {
      var valid = true, errors = {
          drawInvalid: false,
          nameInvalid: false
        }, onBeforeArguments = [
          context,
          settings
        ], onErrorArguments = [
          errors,
          context,
          settings
        ];
      if (settings.onBeforeValidate && typeof settings.onBeforeValidate === 'function') {
        settings.onBeforeValidate.apply(self, onBeforeArguments);
      } else {
        onBeforeValidate.apply(self, onBeforeArguments);
      }
      if (settings.drawOnly && output.length < 1) {
        errors.drawInvalid = true;
        valid = false;
      }
      if ($(settings.name, context).val() === '') {
        errors.nameInvalid = true;
        valid = false;
      }
      if (settings.onFormError && typeof settings.onFormError === 'function') {
        settings.onFormError.apply(self, onErrorArguments);
      } else {
        onFormError.apply(self, onErrorArguments);
      }
      return valid;
    }
    /**
   * Redraws the signature on a specific canvas
   *
   * @private
   *
   * @param {Array} paths the signature JSON
   * @param {Object} context the canvas context to draw on
   * @param {Boolean} saveOutput whether to write the path to the output array or not
   */
    function drawSignature(paths, context, saveOutput) {
      for (var i in paths) {
        if (typeof paths[i] === 'object') {
          context.beginPath();
          context.moveTo(paths[i].mx, paths[i].my);
          context.lineTo(paths[i].lx, paths[i].ly);
          context.lineCap = settings.penCap;
          context.stroke();
          context.closePath();
          if (saveOutput) {
            output.push({
              'lx': paths[i].lx,
              'ly': paths[i].ly,
              'mx': paths[i].mx,
              'my': paths[i].my
            });
          }
        }
      }
    }
    /**
   * Initialisation function, called immediately after all declarations
   * Technically public, but only should be used internally
   *
   * @private
   */
    function init() {
      // Fixes the jQuery.fn.offset() function for Mobile Safari Browsers i.e. iPod Touch, iPad and iPhone
      // https://gist.github.com/661844
      // http://bugs.jquery.com/ticket/6446
      if (parseFloat((/CPU.+OS ([0-9_]{3}).*AppleWebkit.*Mobile/i.exec(navigator.userAgent) || [
          0,
          '4_2'
        ])[1].replace('_', '.')) < 4.1) {
        $.fn.Oldoffset = $.fn.offset;
        $.fn.offset = function () {
          var result = $(this).Oldoffset();
          result.top -= window.scrollY;
          result.left -= window.scrollX;
          return result;
        };
      }
      // Disable selection on the typed div and canvas
      $(settings.typed, context).bind('selectstart.signaturepad', function (e) {
        return $(e.target).is(':input');
      });
      canvas.bind('selectstart.signaturepad', function (e) {
        return $(e.target).is(':input');
      });
      if (!element.getContext && FlashCanvas)
        FlashCanvas.initElement(element);
      if (element.getContext) {
        canvasContext = element.getContext('2d');
        $(settings.sig, context).show();
        if (!settings.displayOnly) {
          if (!settings.drawOnly) {
            $(settings.name, context).bind('keyup.signaturepad', function () {
              type($(this).val());
            });
            $(settings.name, context).bind('blur.signaturepad', function () {
              type($(this).val());
            });
            $(settings.drawIt, context).bind('click.signaturepad', function (e) {
              e.preventDefault();
              drawIt();
            });
          }
          if (settings.drawOnly || settings.defaultAction === 'drawIt') {
            drawIt();
          } else {
            typeIt();
          }
          if (settings.validateFields) {
            if ($(selector).is('form')) {
              $(selector).bind('submit.signaturepad', function () {
                return validateForm();
              });
            } else {
              $(selector).parents('form').bind('submit.signaturepad', function () {
                return validateForm();
              });
            }
          }
          $(settings.sigNav, context).show();
        }
      }
    }
    $.extend(self, {
      init: function () {
        init();
      }  /**
     * Regenerates a signature on the canvas using an array of objects
     * Follows same format as object property
     * @see var object
     *
     * @param {Array} paths An array of the lines and points
     */,
      regenerate: function (paths) {
        self.clearCanvas();
        $(settings.typed, context).hide();
        if (typeof paths === 'string')
          paths = JSON.parse(paths);
        drawSignature(paths, canvasContext, true);
        if ($(settings.output, context).length > 0)
          $(settings.output, context).val(JSON.stringify(output));
      }  /**
     * Clears the canvas
     * Redraws the background colour and the signature line
     */,
      clearCanvas: function () {
        clearCanvas();
      }  /**
     * Returns the signature as a Js array
     *
     * @return {Array}
     */,
      getSignature: function () {
        return output;
      }  /**
     * Returns the signature as a Json string
     *
     * @return {String}
     */,
      getSignatureString: function () {
        return JSON.stringify(output);
      }  /**
     * Returns the signature as an image
     * Re-draws the signature in a shadow canvas to create a clean version
     *
     * @return {String}
     */,
      getSignatureImage: function () {
        var tmpCanvas = document.createElement('canvas'), tmpContext = null, data = null;
        tmpCanvas.style.position = 'absolute';
        tmpCanvas.style.top = '-999em';
        tmpCanvas.width = element.width;
        tmpCanvas.height = element.height;
        document.body.appendChild(tmpCanvas);
        if (!tmpCanvas.getContext && FlashCanvas)
          FlashCanvas.initElement(tmpCanvas);
        tmpContext = tmpCanvas.getContext('2d');
        tmpContext.fillStyle = settings.bgColour;
        tmpContext.fillRect(0, 0, element.width, element.height);
        tmpContext.lineWidth = settings.penWidth;
        tmpContext.strokeStyle = settings.penColour;
        drawSignature(output, tmpContext);
        data = tmpCanvas.toDataURL.apply(tmpCanvas, arguments);
        document.body.removeChild(tmpCanvas);
        tmpCanvas = null;
        return data;
      }
    });
  }
  /**
 * Create the plugin
 * Returns an Api which can be used to call specific methods
 *
 * @param {Object} options The options array
 *
 * @return {Object} The Api for controlling the instance
 */
  $.fn.signaturePad = function (options) {
    var api = null;
    this.each(function () {
      api = new SignaturePad(this, options);
      api.init();
    });
    return api;
  };
  /**
 * Expose the defaults so they can be overwritten for multiple instances
 *
 * @type {Object}
 */
  $.fn.signaturePad.defaults = {
    defaultAction: 'typeIt',
    displayOnly: false,
    drawOnly: false,
    canvas: 'canvas',
    sig: '.sig',
    sigNav: '.sigNav',
    bgColour: '#ffffff',
    penColour: '#145394',
    penWidth: 2,
    penCap: 'round',
    lineColour: '#ccc',
    lineWidth: 2,
    lineMargin: 5,
    lineTop: 35,
    name: '.name',
    typed: '.typed',
    clear: '.clearButton',
    typeIt: '.typeIt a',
    drawIt: '.drawIt a',
    typeItDesc: '.typeItDesc',
    drawItDesc: '.drawItDesc',
    output: '.output',
    currentClass: 'current',
    validateFields: true,
    errorClass: 'error',
    errorMessage: 'Please enter your name',
    errorMessageDraw: 'Please sign the document',
    onBeforeValidate: null,
    onFormError: null
  };
}(jQuery));
var toBitmapURL = function ($fromCharCode, FF, MAX_LENGTH) {
    /**
     * (C) WebReflection - Mit Style License
     *      given a canvas, returns BMP 32bit with alpha channel data uri representation
     *
     * Why ?
     *      because many canvas implementation may not support toDataURL
     *      ( HTMLCanvasElement.prototype.toDataURL || HTMLCanvasElement.prototype.toDataURL = function () {return toBitmapURL(this)}; )
     *
     * I mean ... Why BMP 32 rather than PNG ?!!!
     *      because JavaScript size matter as well as computation time.
     *      PNG requires DEFLATE compression and multiple pass over the data.
     *      BMP is straight forward
     *
     * Fine, but which browser supports BMP in 2011 ?
     *      pretty much all of them, except some version of Chrome. Safari and Webkit are fine as well as Firefox, Opera and of course IE
     *
     * Sure, but why on earth should I use BMP as data uri ?
     *      this method is about creation of canvas snapshots. If toDataURL is not presemt
     *      there is still a way to create a portable, NOT COMPRESSED, bitmap image
     *      that could be optionally sent to the server and at that point converted into proper PNG
     *      Bitmap format was fast enough to parse (on mobile as well) and it was RGBA compatible plus widely supported.
     *
     * I think this was a wasteof time
     *      well, if you still think so, I can say that was actually fun to create a proper
     *      32 bit image format via JavaScript on the fly.
     *      However, please share your own toDataURL version with full mime type support in JavaScript :P
     *      Moreover, have you ever tried to use native toDataURL("image/bmp") ?
     *      Most likely you gonna have max 24bit bitmap with all alpha channel info lost.
     */
    function fromCharCode(code) {
      for (var result = [], i = 0, length = code.length; i < length; i += MAX_LENGTH) {
        result.push($fromCharCode.apply(null, code.slice(i, i + MAX_LENGTH)));
      }
      return result.join('');
    }
    function numberToInvertedBytes(number) {
      return [
        number & FF,
        number >> 8 & FF,
        number >> 16 & FF,
        number >> 24 & FF
      ];
    }
    function swapAndInvertY(data, width, height) {
      /**
         * Bitmap pixels array is stored "pseudo inverted"
         * RGBA => BGRA (read as Alpha + RGB)
         * in few words this canvas pixels array
         * [
         *   0, 1,  2,  3,  4,  5,  6,  7,
         *   8, 9, 10, 11, 12, 13, 14, 15
         * ]
         * is stored as bitmap one like
         * [
         *   10, 9, 8, 11, 14, 13, 12, 15,
         *   2, 1, 0,  3,  6,  5,  4,  7
         * ]
         */
      for (var i, j, x0, x1, y0, y1, sizeX = 4 * width, sizeY = height - 1, result = []; height--;) {
        y0 = sizeX * (sizeY - height);
        y1 = sizeX * height;
        for (i = 0; i < width; i++) {
          j = i * 4;
          x0 = y0 + j;
          x1 = y1 + j;
          result[x0] = data[x1 + 2];
          result[x0 + 1] = data[x1 + 1];
          result[x0 + 2] = data[x1];
          result[x0 + 3] = data[x1 + 3];
        }
      }
      return result;
    }
    function toBitmapURL(canvas) {
      var width = canvas.width, height = canvas.height, header = [].concat(numberToInvertedBytes(width), numberToInvertedBytes(height), 1, 0, 32, 0, 3, 0, 0, 0, numberToInvertedBytes(width * height * 4), 19, 11, 0, 0, 19, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, FF, 0, 0, FF, 0, 0, FF, 0, 0, 0, 0, 0, 0, FF, 32, 110, 105, 87), data = swapAndInvertY(canvas.getContext('2d').getImageData(0, 0, width, height).data, width, height), offset;
      header = numberToInvertedBytes(header.length).concat(header);
      offset = 14 + header.length;
      return 'data:image/bmp;base64,' + btoa(fromCharCode([
        66,
        77
      ].concat(numberToInvertedBytes(offset + data.length), 0, 0, 0, 0, numberToInvertedBytes(offset), header, data)));
    }
    return toBitmapURL;
  }(String.fromCharCode, 255, 32767);
// Namespace
var App=(function(module){
    module.views={};
    module.models={};
    module.collections={};
    module.config={};

    return module;
})(App || {});
var BaseView=Backbone.View.extend({
    "onLoad":function(){},
    "onLoadEnd":function(){}
}); 
var FormTemplates = '<script type="text/template" id="temp_form_structure"><div id="fh_appform_container" class="fh_appform_form_area col-xs-12 fh_appform_container">  <div class="fh_appform_logo_container  col-xs-12">    <div class="fh_appform_logo">    </div>  </div>  <div class="fh_appform_form_title col-xs-12 text-center">    <%= title%>  </div></div></script><script type="text/template" id="temp_form_buttons"><div id="fh_appform_navigation_buttons" class="fh_appform_button_bar btn-group btn-group-justified col-xs-12">  <div class="btn-group">    <button class="fh_appform_button_saveDraft fh_appform_button_main fh_appform_button_action btn btn-primary">Save Draft</button>  </div>  <div class="btn-group">    <button class="fh_appform_button_previous fh_appform_button_default btn btn-default">Previous</button>  </div>  <div class="btn-group">    <button class="fh_appform_button_next fh_appform_button_default btn btn-default">Next</button>  </div>  <div class="btn-group">    <button class="fh_appform_button_submit fh_appform_button_action btn btn-primary">Submit</button>  </div>  </div></script><script type="text/template" id="temp_page_structure"><div id="fh_appform_<%= sectionId %>" class="fh_appform_section_area panel panel-default">  <div class="panel-heading text-center col-xs-12 fh_appform_section_title" data-field="fh_appform_<%= sectionId %>_body">    <i id="fh_appform_<%= sectionId %>_body_icon" class="pull-right <%= index === 0 ? \"icon-chevron-sign-down\" : \"icon-chevron-sign-up\"%> section_icon" ></i><%=title%>  </div>  <div id="fh_appform_<%= sectionId %>_body" class="panel-body col-xs-12" style="<%= index === 0 ? \"\" : \"display:none;\"%>">  </div></div></script><script type="text/template" id="temp_field_structure"><div class="fh_appform_input_wrapper col-xs-12">    <% if(repeating === true){ %>    <div class="fh_appform_field_title col-xs-12">      <i class="<%= field_icon %>"><%= icon_content %></i>      <%= title %>    </div>  <%} else {%>    <div class="fh_appform_field_title col-xs-12 <%= required %>">      <i class="<%= field_icon %>"><%= icon_content %></i>      <%= title %>    </div>  <% } %>    <% if(helpText){ %>    <p class="fh_appform_field_instructions col-xs-12">      <%= helpText %>    </p>  <% } %></div><div class="fh_appform_field_button_bar col-xs-12" >  <button class="fh_appform_removeInputBtn special_button fh_appform_button_action btn btn-primary col-xs-offset-1 col-xs-5">-</button>  <button class="special_button fh_appform_addInputBtn fh_appform_button_action btn btn-primary col-xs-offset-1 col-xs-5 pull-right">+</button></div></script><script type="text/template" id="temp_field_wrapper"><div id="wrapper_<%= fieldId %>_<%= index %>" class="col-xs-12 fh_appform_field_wrapper">  <% if(repeating === true){ %>    <div class="<%= required %> fh_appform_field_title fh_appform_field_numbering col-xs-2">      <%=d_index%>.    </div>  <% } %>    <div class="fh_appform_field_input_container repeating <%= repeating === true ? \"col-xs-10\" : \"col-xs-12\"%>" >    <div class="fh_appform_field_error_container col-xs-12 fh_appform_hidden">    </div>  </div></div></script><script type="text/template" id="temp_config_camera"><div class="panel panel-default fh_appform_section_area col-xs-12" id="camera-settings">  <div class="panel-heading" data-field="camera-settings-body">    <h3 class="panel-title fh_appform_section_title"><i id="camera-settings-body-icon" class="pull-right icon-chevron-sign-down" > </i>Camera Settings</h3>  </div>  <div class="panel-body" id="camera-settings-body">    <div class="col-xs-12 fh_appform_section_area">       <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="targetWidth">Width (px)</label>        <input type="number" class="form-control fh_appform_field_input text-center" id="targetWidth" value="<%= targetWidth %>" data-key="targetWidth">      </div>      <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="targetHeight">Height (px)</label>        <input type="number" class="form-control fh_appform_field_input text-center" id="targetHeight" value="<%= targetHeight %>" data-key="targetHeight">      </div>      <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="quality">Quality (%)</label>        <input type="number" class="form-control fh_appform_field_input text-center" id="quality" value="<%= quality %>" data-key="quality" min="0" max="100">      </div>    </div>  </div></div></script><script type="text/template" id="temp_config_submissions"><div class="panel panel-default fh_appform_section_area col-xs-12" id="submission-settings">  <div class="panel-heading" data-field="submission-settings-body">    <h3 class="panel-title fh_appform_section_title"><i id="submission-settings-body-icon" class="pull-right icon-chevron-sign-down" > </i>Submission Settings</h3>  </div>  <div class="panel-body" id="submission-settings-body">    <div class="col-xs-12 fh_appform_section_area">       <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="max_retries">Max Retries</label>        <input type="number" class="form-control fh_appform_field_input text-center" id="max_retries" value="<%= max_retries %>" data-key="max_retries">      </div>      <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="timeout">Timeout (s)</label>        <input type="number" class="form-control fh_appform_field_input text-center" id="timeout" value="<%= timeout %>" data-key="timeout">      </div>      <div class="form-group fh_appform_field_area">        <label class="fh_appform_field_title col-xs-12" for="sent_items_to_keep_list">Number of sent submissions to keep.</label>        <select id="sent_items_to_keep_list" multiple data-role="tagsinput" data-key="sent_items_to_keep_list">          <% for(var sent_item_index = 0; sent_item_index < sent_items_to_keep_list.length; sent_item_index++){ %>            <option value="<%= sent_items_to_keep_list[sent_item_index] %>"><%= sent_items_to_keep_list[sent_item_index] %></option>          <%}%>        </select>      </div>    </div>    </div></div><div class="modal fade" id="logsModal" tabindex="-1" role="dialog" aria-labelledby="logsModalLabel" aria-hidden="true">  <div class="modal-dialog">    <div class="modal-content fh_appform_section_area">      <div class="modal-header">        <h4 class="modal-title fh_appform_section_title text-center" id="logsModalLabel">Info</h4>      </div>      <div class="modal-body" id="logsModalLabelBody">      </div>      <div class="modal-footer">        <button type="button" class="btn btn-default fh_appform_button_cancel" data-dismiss="modal">Close</button>      </div>    </div>  </div></div></script><script type="text/template" id="temp_config_log"><ul class="list-group col-xs-12">  <%= listStr%>  </ul></script><script type="text/template" id="temp_config_log_item">  <li class="list-group-item <%= logClass %>" style="overflow:auto;"><%= message%></li></script><script type="text/template" id="temp_config_debugging"><div class="panel panel-default fh_appform_section_area col-xs-12" id="debugging-settings">  <div class="panel-heading" data-field="debugging-settings-body">    <h3 class="panel-title fh_appform_section_title"><i id="debugging-settings-body-icon" class="pull-right icon-chevron-sign-down" > </i>Debugging Options</h3>  </div>  <div class="panel-body" id="debugging-settings-body">      <div class="col-xs-12 fh_appform_section_area">          <div class="form-group fh_appform_field_area" id="log_level_div">              <label class="fh_appform_field_title col-xs-12" for="log_level">Log Level</label>              <select class="form-control fh_appform_field_input text-center" id="log_level" value="<%= log_level %>" data-key="log_level" >                <% for (var i=0;i<log_levels.length;i++){                  var val=log_levels[i];                  var selected=(i==log_level)?"selected":""; %>                  <option value="<%= i %>" <%= selected%>><%= val%></option>              <%}%>              </select>          </div>          <div class="form-group fh_appform_field_area" id="log_email_div">              <label class="fh_appform_field_title col-xs-12" for="log_email">Log Reporting Email</label>              <input type="email" class="form-control fh_appform_field_input text-center" id="log_email" value="<%= log_email %>" data-key="logger" value="<%= log_email%>">          </div>          <div class="form-group fh_appform_field_area" id="log_line_limit_div">              <label class="fh_appform_field_title col-xs-12" for="log_line_limit">Log Line Limit</label>              <input type="number" class="form-control fh_appform_field_input text-center" id="log_line_limit" value="<%= log_line_limit %>" data-key="log_line_limit" value="<%= log_line_limit%>" min="0">          </div>          <div class="btn-group-vertical col-xs-12">              <div class="btn-group" data-toggle="buttons" id="logger_wrapper_div">                <button class="btn btn-primary text-left fh_appform_button_action <%= logger?"active":"" %>" type="button" data-key="logger" id="logger"><i class="<%= logger?"icon-circle":"icon-circle-blank" %> choice_icon"></i><div id="logger_message"> <%= logger?"Logging Enabled":"Logging Disabled" %> </div>                </button>              </div>              <button class="btn btn-primary fh_appform_button_action" id="fh_appform_show_deviceId">Show Device Id</button>              <button type="button" class="btn btn-default fh_appform_button_action" id="_viewLogsBtn">View Logs</button>              <button type="button" class="btn btn-default fh_appform_button_action" id="_sendLogsBtn">Send Logs</button>              <button type="button" class="btn btn-default fh_appform_button_cancel" id="_clearLogsBtn">Clear Logs</button>          </div>      </div>  </div></div></script><script type="text/template" id="temp_config_misc">  <div class="panel panel-default fh_appform_section_area  col-xs-12 first" id="misc-settings">  <div class="panel-heading" data-field="misc-settings-body">    <h3 class="panel-title fh_appform_section_title"><i id="misc-settings-body-icon" class="pull-right icon-chevron-sign-down" > </i>Misc Settings</h3>  </div>  <div class="panel-body" id="misc-settings-body">      <div class="col-xs-12 fh_appform_section_area">          <div class="btn-group-vertical col-xs-12">              <button type="button" class="btn btn-default fh_appform_button_action" id="_refreshFormsButton">Refresh Forms</button>          </div>      </div>  </div></div></script><script type="text/template" id="forms-logo-sdk"><div class="fh_appform_logo_container  col-xs-12">  <div class="fh_appform_logo">  </div></div></script>';
var FormListView = BaseView.extend({
    events: {
        'click button#formlist_reload': 'reload'
    },

    templates: {
        list: '<ul class="form_list fh_appform_body"></ul>',
        header: '<h2>Your Forms</h2><h4>Choose a form from the list below</h4>',
        error: '<li><button id="formlist_reload" class="button-block <%= enabledClass %> <%= dataClass %> fh_appform_button_default"><%= name %><div class="loading"></div></button></li>'
    },

    initialize: function(options) {
        this.options = options;
        $fh.forms.log.l("Initialize Form List");
        _.bindAll(this, 'render', 'appendForm');
        this.views = [];

        App.collections.forms.bind('reset', function(collection, options) {
            if (options == null || !options.noFetch) {
                App.collections.forms.each(function(form) {
                    form.fetch();
                });
            }
        });

        App.collections.forms.bind('add remove reset error', this.render, this);
        this.model.on("updated", this.render);
    },

    reload: function() {
        $fh.forms.log.l("Reload Form List");
        var that = this;
        this.onLoad();
        this.model.refresh(true, function(err, formList) {
            this.onLoadEnd();
            that.model = formList;
            that.render();
        });
    },

    show: function() {
        $(this.$el).show();
    },

    hide: function() {
        $(this.$el).hide();
    },

    renderErrorHandler: function(msg) {
        try {
            if (msg == null || msg.match("error_ajaxfail")) {
                msg = "An unexpected error occurred.";
            }
        } catch (e) {
            msg = "An unexpected error occurred.";
        }
        var html = _.template(this.templates.error, {
            name: msg + "<br/>Please Retry Later",
            enabledClass: 'fh_appform_button_cancel', //TODO May not be this class. Double check
            dataClass: 'fetched'
        });
        $('ul', this.$el).append(html);

    },

    render: function() {

        // Empty our existing view
        // this.options.parentEl.empty();

        // Add list
        this.options.parentEl.append(this.templates.list);
        var formList = this.model.getFormsList();
        if (formList.length > 0) {
            // Add header
            this.options.parentEl.find('ul').append(this.templates.header);
            _(formList).forEach(function(form) {
                this.appendForm(form);
            }, this);
        } else {
            this.renderErrorHandler(arguments[1]);
        }
    },

    appendForm: function(form) {
        var view = new FormListItemView({
            model: form
        });
        this.views.push(view);
        $('ul', this.options.parentEl).append(view.render().$el);
    },
    initFormList: function(fromRemote, cb) {
        var that = this;
        $fh.forms.getForms({
            fromRemote: fromRemote
        }, function(err, formsModel) {
            if (err) {
                cb(err);
            } else {
                that.model = formsModel;
                cb(null, that);
            }
        });
    }
});
var FormListItemView = BaseView.extend({
    events: {
      'click button.show.fetched': 'show',
      'click button.show.fetch_error': 'fetch'
    },
    templates: { form_button: '<li><button class="show button-block <%= enabledClass %> <%= dataClass %>"><%= name %><div class="loading"></div></button></li>' },
    render: function () {
      var html;
      // var errorLoading = this.model.get('fh_error_loading');
      var enabled = true;
      html = _.template(this.templates.form_button, {
        name: this.model.name,
        enabledClass: enabled ? 'button-main' : '',
        dataClass: 'fetched'
      });
      this.$el.html(html);
      this.$el.find('button').not('.fh_full_data_loaded');
      return this;
    },
    unrender: function () {
      $(this.$el).remove();
    },
    show: function () {
      var formId = this.model._id;
      // this will init and render formView
      var formView = new FormView({ parentEl: $('#backbone #page') });
      formView.loadForm({ formId: formId }, function () {
        formView.render();
        Backbone.history.navigate('form', true);
      });
    },
    fetch: function () {
    }
  });
var FieldView = Backbone.View.extend({

    className: 'fh_appform_field_area col-xs-12',
    errMessageContainer: ".fh_appform_field_error_container",
    requiredClassName: "fh_appform_field_required",
    errorClassName: "fh_appform_field_error",
    repeatingClassName: "repeating",
    nonRepeatingClassName: "non_repeating",
    addInputButtonClass: ".fh_appform_addInputBtn",
    removeInputButtonClass: ".fh_appform_removeInputBtn",
    fieldWrapper: '<div class="fh_appform_input_wrapper"></div>',
    input: "<input class='fh_appform_field_input <%= repeatingClassName%> col-xs-12' data-field='<%= fieldId %>' data-index='<%= index %>' value='<%= value %>' type='<%= inputType %>' />",
    inputTemplate: "<div id='wrapper_<%= fieldId %>_<%= index %>' class='col-xs-12'> <div class='fh_appform_field_input_container non_repeating' >  <%= inputHtml %> <div class='fh_appform_field_error_container fh_appform_hidden col-xs-12 text-center' ></div></div><br class='clearfix'/>    </div>",
    inputTemplateRepeating: "<div id='wrapper_<%= fieldId %>_<%= index %>' class='col-xs-12'> <div class='<%= required %> fh_appform_field_title fh_appform_field_numbering col-xs-2'> <%=index + 1%>.  </div> <div class='fh_appform_field_input_container repeating col-xs-10' >  <%= inputHtml %> <div class='fh_appform_field_error_container fh_appform_hidden col-xs-12'></div></div></div>",


    fh_appform_fieldActionBar: "<div class='fh_appform_field_button_bar col-xs-12' ><button class='fh_appform_removeInputBtn special_button fh_appform_button_action btn btn-primary col-xs-offset-1 col-xs-5'>-</button><button class='special_button fh_appform_addInputBtn fh_appform_button_action btn btn-primary col-xs-offset-1 col-xs-5 pull-right'>+</button></div>",
    title: '<div class="fh_appform_field_title"><h3 class="text-left  <%= required%>"><%= title %></h3></div>',
    titleRepeating: '<div class="fh_appform_field_title"><h3 class="text-left"><%= title %></h3></div>',
    instructions: '',
    fieldIconNames: {
        text: "icon-font",
        textarea: "icon icon-align-justify",
        url: "icon-link",
        number: "icon-number",
        emailAddress: "icon-envelope-alt",
        dropdown: "icon-caret-down",
        checkboxes: "icon-check",
        location: "icon-location-arrow",
        locationMap: "icon-map-marker",
        photo: "icon-camera",
        signature: "icon-pencil",
        file: "icon-cloud-upload",
        dateTime: "icon-calendar",
        sectionBreak: "icon-minus",
        radio: "icon-circle-blank"
    },
    events: {
        "change": "contentChanged",
        "blur input,select,textarea": "validate",
        "click .fh_appform_addInputBtn": "onAddInput",
        "click .fh_appform_removeInputBtn": "onRemoveInput"
    },
    onAddInput: function() {
        this.addElement();
        this.checkActionBar();
    },
    onRemoveInput: function() {
        this.removeElement();
        this.checkActionBar();
    },
    checkActionBar: function() {
        var curNum = this.curRepeat;
        var maxRepeat = this.maxRepeat;
        var minRepeat = this.initialRepeat;
        if (curNum < maxRepeat) {
            this.$fh_appform_fieldActionBar.find(this.addInputButtonClass).show();
        } else {
            this.$fh_appform_fieldActionBar.find(this.addInputButtonClass).hide();
        }

        if (curNum > minRepeat) {
            this.$fh_appform_fieldActionBar.find(this.removeInputButtonClass).show();
        } else {
            this.$fh_appform_fieldActionBar.find(this.removeInputButtonClass).hide();
        }
    },
    removeElement: function() {
        var curRepeat = this.curRepeat;
        var lastIndex = curRepeat - 1;
        this.getWrapper(lastIndex).remove();
        this.curRepeat--;
    },
    renderInput: function(index) {
        var fieldId = this.model.getFieldId();
        var type = this.getHTMLInputType();
        var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;

        var inputEle = _.template(this.input, {
            "fieldId": fieldId,
            "index": index,
            "inputType": type,
            "repeatingClassName": repeatingClassName,
            "value":this.model.getDefaultValue()
        });

        return $(inputEle);
    },
    getHTMLInputType: function() {
        return this.type || "text";
    },
    /**
    * Repeating fields can have required and non-required repeating inputs depending on the minRepeat and maxRepeat values defined for the field
    **/
    getFieldRequired: function(index) {
        var required = "";
        if(this.model.isRequired()){
            if(index < this.initialRepeat){
                required = this.requiredClassName;
            } else {

            }
        } else {

        }
        return required;
    },
    renderHelpText: function() {
        var helpText = this.model.getHelpText();

        if (typeof helpText === "string" && helpText.length > 0) {
            return _.template(this.instructions, {
                "helpText": helpText
            });
        } else {
            return "";
        }
    },
    addElement: function() {
        var self = this;
        var index = this.curRepeat;
        var inputHtml = this.renderInput(index);

        var eleTemplate = _.template(self.options.formView.$el.find("#temp_field_wrapper").html(), {
            index: index,
            d_index: index + 1,
            required: this.model.isRequired() ? self.requiredClassName : "",
            fieldId: this.model.getFieldId(),
            repeating: this.model.isRepeating()  
        });

        eleTemplate = $(eleTemplate);
        eleTemplate.find('.fh_appform_field_input_container').prepend(inputHtml);

        this.$fieldWrapper.append(eleTemplate);
        this.curRepeat++;
        this.onElementShow(index);
    },
    onElementShow: function(index) {
        $fh.forms.log.d("Show done for field " + index);
    },
    render: function() {
        var self = this;
        this.initialRepeat = 1;
        this.maxRepeat = 1;
        this.curRepeat = 0;

        var fieldTemplate = $(_.template(self.options.formView.$el.find("#temp_field_structure").html(), {
            title: this.model.getName(),
            helpText: this.model.getHelpText(),
            required: this.model.isRequired() ? self.requiredClassName : "",
            repeating: this.model.isRepeating(),
            field_icon: this.fieldIconNames[this.model.getType()],
            icon_content: this.model.getType() === "number" ? 123 : ""
        }));

        this.$fieldWrapper = $(fieldTemplate[0]);
        this.$fh_appform_fieldActionBar = $(fieldTemplate[1]);

        if(this.readonly){
            this.$fh_appform_fieldActionBar.hide();   
        }

        if (this.model.isRepeating()) {
            this.initialRepeat = this.model.getMinRepeat();
            this.maxRepeat = this.model.getMaxRepeat();
        }

        for (var i = 0; i < this.initialRepeat; i++) {
            this.addElement();
        }

        this.$el.append(fieldTemplate);
        this.$el.attr("data-field", this.model.getFieldId());

        this.options.parentEl.append(this.$el);

        // force the element to be initially hidden
        if (this.$el.hasClass("hide")) {
            this.hide(true);
        }
        // populate field if Submission obj exists
        var submission = this.options.formView.getSubmission();
        if (submission) {
            this.submission = submission;
            this.submission.getInputValueByFieldId(this.model.get('_id'), function(err, res) {
                self.value(res);
            });
        }


        this.show();
        this.checkActionBar();
        this.onRender();
    },
    onRender: function() {

    },
    // TODO: cache the input element lookup?
    initialize: function(options) {
        this.options = options;
        this.readonly = options.formView.readonly;
        _.bindAll(this, 'dumpContent', 'clearError', 'onAddInput', 'onRemoveInput');

        
        this.render();
    },

    dumpContent: function() {
        $fh.forms.log.d("Value changed :: " + JSON.stringify(this.value()));
    },

    getTopView: function() {
        var view = this.options.parentView;
        var parent;
        do {
            parent = view.options.parentView;
            if (parent) {
                view = parent;
            }
        } while (parent);
        return view;
    },
    validateElement: function(index, element, cb) {
        var self = this;
        var fieldId = self.model.getFieldId();
        self.model.validate(element, index, function(err, res) {
            if (err) {
                self.setErrorText(index, "Error validating field: " + err);
                if (cb) {
                    cb(err);
                }
            } else {
                var result = res["validation"][fieldId];
                if (!result.valid) {
                    var errorMessages = result.errorMessages.join(", ");
                    self.setErrorText(index, errorMessages);
                    if (cb) {
                        cb(errorMessages);
                    }
                } else {
                    self.clearError(index);
                    if (cb) {
                        cb();
                    }
                }
            }
        });
    },
    validate: function(e) {
        var self = this;
        this.options.formView.markFormEdited();
        var target = $(e.currentTarget);
        var index = target.data().index;
        var val = self.valueFromElement(index);
        self.validateElement(index, val);
        self.trigger("checkrules");
    },
    setErrorText: function(index, text) {
        var wrapperObj = this.getWrapper(index);
        wrapperObj.find(this.errMessageContainer).text(text);
        wrapperObj.find(this.errMessageContainer).show();
        wrapperObj.find(this.errMessageContainer).addClass(this.errorClassName);

        if(wrapperObj.find("input[type='checkbox']").length === 0){
            wrapperObj.find("input,textarea,select").addClass(this.errorClassName);    
        }
        
    },
    contentChanged: function(e) {
        this.options.formView.markFormEdited();
        e.preventDefault();
        this.validate(e);
    },

    isRequired: function() {
        return this.model.isRequired();
    },

    // force a hide , defaults to false
    hide: function(force) {
        this.$el.hide();
    },
    renderButton: function(index, label, extension_type) {
        var button = $('<button>');
        button.addClass('special_button fh_appform_button_action col-xs-12');
        button.addClass(extension_type);
        button.attr("data-index", index);
        button.html(' ' + label);

        return this.htmlFromjQuery(button);
    },
    //deprecated
    addButton: function(input, extension_type, label) {
        var self = this;
        var button = $('<button>');
        button.addClass('special_button fh_appform_button_action col-xs-12');
        button.addClass(extension_type);
        button.html(' ' + label);


        button.click(function(e) {
            self.action(this);
            e.preventDefault();
            return false;
        });

        input.append(button);
        return button;
    },

    show: function() {
        this.$el.show();
    },

    defaultValue: function() {
        var defaultValue = {};
        defaultValue[this.model.get('_id')] = this.model.get('DefaultVal');
        return defaultValue;
    },
    htmlFromjQuery: function(jqObj) {
        return $('<div>').append(jqObj.clone()).html();
    },
    // Gets or Set the value for this field
    // set value should be an array which contains repeated value for this field.
    value: function(value) {
        var self = this;
        if (value && !_.isEmpty(value)) {
          self.valuePopulate(value);
        }
        return self.getValue();
    },
    getValue: function() {
        var value = [];
        var repeatNum = this.curRepeat;
        for (var i = 0; i < repeatNum; i++) {
            value[i] = this.valueFromElement(i);
        }
        return value;
    },
    valueFromElement: function(index) {
        var wrapperObj = this.getWrapper(index);
        return wrapperObj.find("input,select,textarea").val() || "";
    },
    valuePopulate: function(value) {
        var number = value.length;
        while (number > this.curRepeat) {
            this.addElement();
        }

        for (var i = 0; i < value.length; i++) {
            var v = value[i];
            this.valuePopulateToElement(i, v);
        }
    },
    valuePopulateToElement: function(index, value) {
        var wrapperObj = this.getWrapper(index);
        wrapperObj.find("input,select,textarea").val(value);
    },
    getWrapper: function(index) {
        var fieldId = this.model.getFieldId();
        return this.$fieldWrapper.find("#wrapper_" + fieldId + "_" + index);
    },
    fillArray: function(array, filler) {
        for (var i = 0; i < array.length; i++) {
            if (!array[i]) {
                array[i] = filler;
            }
        }
    },

    clearError: function(index) {
        var wrapperObj = this.getWrapper(index);
        wrapperObj.find(this.errMessageContainer).hide();
        wrapperObj.find("." + this.errorClassName).removeClass(this.errorClassName);
    }

});
FieldCameraView = FieldView.extend({
    input: "<img class='imageThumb' width='100%' data-field='<%= fieldId %>' data-index='<%= index %>'  type='<%= inputType %>'>",
    html5Cam: '<div class="html5Cam">' +
        '<div class="camActionBar"><button class="camCancel camBtn fh_appform_button_cancel">Cancel</button><button class="camOk camBtn fh_appform_button_action">Ok</button></div>' +
        '<div class="cam"></div>' +
        '</div>',
    onElementShow: function(index) {
      var captureBtn = $(this.renderButton(index, "<i class='icon-camera'></i>&nbsp;Capture Photo From Camera", "fhcam"));
      var libBtn = $(this.renderButton(index, "<i class='icon-folder-open'></i>&nbsp;Choose Photo from Library", "fhcam_lib"));
      var rmBtn = $(this.renderButton(index, "<i class='icon-remove-circle'></i>&nbsp;Remove Photo", "remove"));

      var params = this.model.getPhotoOptions();

      if(!this.readonly){
        this.getWrapper(index).append(captureBtn);
        this.getWrapper(index).append(libBtn);
        this.getWrapper(index).append(rmBtn);
        var self = this;
        captureBtn.on('click', function(e) {
            self.addFromCamera(e, index);
        });
        libBtn.on('click', function(e) {
            self.addFromLibrary(e, index);
        });
        rmBtn.on('click', function(e) {
            self.removeThumb(e, index);
        });
        rmBtn.hide();

        if(params.pictureSource === "library"){
          captureBtn.hide();
        } else if (params.pictureSource === "camera"){
          libBtn.hide();
        }
      }
    },
    setImage: function(index, base64Img) {
        var wrapper = this.getWrapper(index);
        var img = wrapper.find('img.imageThumb');
        img.attr('src', base64Img).show();
        wrapper.find('button').hide();
        wrapper.find('.remove').show();
    },
    getImageThumb: function(index) {
        var wrapper = this.getWrapper(index);
        var img = wrapper.find('img.imageThumb');
        return img;
    },
    getCameraBtn: function(index) {
        var wrapper = this.getWrapper(index);
        return wrapper.find('button.fhcam');
    },
    getLibBtn: function(index) {
        var wrapper = this.getWrapper(index);
        return wrapper.find('button.fhcam_lib');
    },
    getRemoveBtn: function(index) {
        var wrapper = this.getWrapper(index);
        return wrapper.find('button.remove');
    },
    removeThumb: function(e, index) {
        e.preventDefault();
        var img = this.getImageThumb(index);
        img.removeAttr('src').hide();
        this.getLibBtn(index).show();
        this.getCameraBtn(index).show();
        this.getRemoveBtn(index).hide(); // this.trigger('imageRemoved'); // trigger events used by grouped camera fields NOTE: don't move to setImageData fn, could result in infinite event callback triggering as group camera field may call into setImageData()
    },
    addFromCamera: function(e, index) {
        e.preventDefault();
        var self = this;
        var params = {};

        params = this.model.getPhotoOptions();

        if (this.model.utils.isPhoneGapCamAvailable()) {
            this.model.utils.takePhoto(params, function(err, imageURI) {
                if (err) {
                    $fh.forms.log.e("Error Taking Photo", err);
                } else {
                    self.setImage(index, imageURI);
                }
            });
        } else if (this.model.utils.isHtml5CamAvailable()) {
            var camObj = $(self.html5Cam);
            var actionBar = camObj.find('.camActionBar');
            camObj.css({
                'position': 'fixed',
                'top': 0,
                'bottom': 0,
                'left': 0,
                'right': 0,
                'background': '#000',
                'z-index': 9999
            });
            actionBar.css({
                'text-align': 'center',
                'padding': '10px',
                'background': '#999'
            });
            actionBar.find('button').css({
                'width': '80px',
                'height': '30px',
                'margin-right': '8px',
                'font-size': '1.3em'
            });
            self.$el.append(camObj);
            actionBar.find('.camCancel').on('click', function() {
                self.model.utils.cancelHtml5Camera();
                camObj.remove();
            });
            this.model.utils.initHtml5Camera(params, function(err, video) {
                if (err) {
                    $fh.forms.log.e(err);
                    camObj.remove();
                } else {
                    $(video).css('width', '100%');
                    camObj.find('.cam').append(video);
                    actionBar.find('.camOk').on('click', function() {
                        self.model.utils.takePhoto(params, function(err, base64Image) {//The image that comes from the html5 camera is base64
                            camObj.remove();
                            if (err) {
                                $fh.forms.log.e(err);
                            } else {
                                self.setImage(index, base64Image);
                            }
                        });
                    });
                }
            });
        }
    },
    addFromLibrary: function(e, index) {
        var self = this;
        var params = {};
        if (self.model.utils.isPhoneGapCamAvailable()) {
            e.preventDefault();
            params.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            self.model.utils.takePhoto(params, function(err, imageURI) {
                if (err) {
                    $fh.forms.log.e("error occured with take photo ", JSON.stringify(err));
                }
                if (imageURI) {
                    self.setImage(index, imageURI);
                }
            });
        } else {
            var file = document.createElement('input');
            file.type = 'file';
            var fileObj = $(file);
            fileObj.hide();

            if(self.$el.find('input[type="file"]').length > 0){
                fileObj = $(self.$el.find('input[type="file"]')[0]);
            } else {
                self.$el.append(fileObj);    
                fileObj = $(self.$el.find('input[type="file"]')[0]);
            }

            fileObj.off('click');
            fileObj.on('click', function(e){
                console.log("File CLicked ", e);
            });

            fileObj.off('change');
            fileObj.on('change', function() {
                var file = fileObj[0];
                if (file.files && file.files.length > 0) {
                    file = file.files[0];
                    fileObj.remove();
                    self.model.utils.fileSystem.fileToBase64(file, function(err, base64Img) {
                        if (err) {
                            $fh.forms.log.e(err);
                        } else {
                            self.setImage(index, base64Img, true);
                        }
                    });
                }
            });
            fileObj.trigger('click');
        }
    },
    valueFromElement: function(index) {
        var img = this.getImageThumb(index);
        return img.attr('src');
    },
    valuePopulateToElement: function(index, value) {
        if (value) {
            var imageData = null;
            if(value.imgHeader){
              imageData = value.data;
              var base64Img = value.imgHeader + imageData;
              this.setImage(index, base64Img);
            } else {
              this.setImage(index, value.data);
            }
        }
    }
});
FieldCheckboxView = FieldView.extend({
  checkboxes: '<div class="btn-group-vertical fh_appform_field_input col-xs-12 <%= repeatingClassName%>" data-toggle="buttons-checkbox"></div>',
  choice: '<button class="btn btn-primary text-left fh_appform_button_action col-xs-12" type="button" value="<%= value %>" name="<%= fieldId %>[]" data-field="<%= fieldId %>" data-index="<%= index %>"><i class="icon-check-empty choice_icon"></i><%= choice %></button>',


  renderInput: function(index) {
    var self=this;
    var subfields = this.model.getCheckBoxOptions();
    var fieldId=this.model.getFieldId();
    var choicesHtml = "";
    var checkboxesHtml = "";
    var html = "";
    var required = this.getFieldRequired(index);
    
    var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;
    checkboxesHtml = _.template(this.checkboxes, {"repeatingClassName": repeatingClassName});
    checkboxesHtml = $(checkboxesHtml);

    $.each(subfields, function(i, subfield) {
      var choice = _.template(self.choice, {
        "fieldId": fieldId,
        "index": index,
        "choice": subfield.label,
        "value": subfield.label,
        "checked": (subfield.checked) ? "checked='checked'" : ""
      });
      choice = $(choice);

      if(subfield.checked === true){
        choice.addClass("active");
        choice.find(".choice_icon").removeClass("icon-check-empty");
        choice.find(".choice_icon").addClass("icon-check");
      }

      choice.off('click');
      choice.on('click', function(e){
        $(this).find('.choice_icon').toggleClass('icon-check-empty');
        $(this).find('.choice_icon').toggleClass('icon-check');
      });

      checkboxesHtml.append(choice);
    });
    
    return checkboxesHtml;
  },
  valueFromElement: function(index) {
    var value = {
      selections: []
    };
    var wrapperObj=this.getWrapper(index);
    var checked=wrapperObj.find("button.active");
    checked.each(function(){
      value.selections.push($(this).val());
    });
    return value;
  },
  valuePopulateToElement: function(index,value) {
    var wrapperObj=this.getWrapper(index);
    if (!value || !(value instanceof Array)){
      return;
    }

    wrapperObj.find("button.active").removeClass("active");
    wrapperObj.find('button .choice_icon').addClass('icon-check-empty');
    wrapperObj.find('button .choice_icon').removeClass('icon-check');

    for (var i=0; i < value.length; i++){
      var v=value[i];
      wrapperObj.find("button[value='"+v+"']").addClass("active");
      wrapperObj.find("button[value='"+v+"'] .choice_icon").removeClass("icon-check-empty");
      wrapperObj.find("button[value='"+v+"'] .choice_icon").addClass("icon-check");
    }
  }
});

FieldEmailView = FieldView.extend({
   type:"email"
});
FieldFileView = FieldView.extend({
    input: "<button data-field='<%= fieldId %>' class='special_button fh_appform_button_action select col-xs-12' data-index='<%= index %>'  type='<%= inputType %>'><i class='icon-folder-openSelect'></i> A File</button>" +
        "<button data-field='<%= fieldId %>' class='special_button fh_appform_button_action remove col-xs-12' data-index='<%= index %>'  type='<%= inputType %>'><i class='icon-remove-circle'></i>&nbsp;Remove File Entry</button>" +
        "<input class='fh_appform_field_input' data-field='<%= fieldId %>' data-index='<%= index %>' type='<%= inputType %>' style=''/>",
    type: "file",
    initialize: function() {
        var self = this;

        self.fileObjs = [];
        FieldView.prototype.initialize.apply(self, arguments);
    },
    contentChanged: function(e) {
        var self = this;
        var fileEle = e.target;
        var filejQ = $(fileEle);
        var index = filejQ.data().index;
        var file = fileEle.files ? fileEle.files[0] : null;
        if (file) {
            self.validateElement(index, file, function(err) {
                //File Needs to be validated.
                if (!err) { //Validation of file is valid
                    var fileObj = {
                        "fileName": file.name,
                        "fileSize": file.size,
                        "fileType": file.type
                    };
                    self.showButton(index, fileObj);
                } else {
                    filejQ.val("");
                    self.showButton(index, null);
                }
            });
        } else { //user cancelled file selection
            self.showButton(index, null);
        }
    },
    valueFromElement: function(index) {
        var wrapperObj = this.getWrapper(index);
        var fileEle = wrapperObj.find(".fh_appform_field_input")[0];
        if (fileEle.files && fileEle.files.length > 0) { //new file
            return fileEle.files[0];
        } else { //sandboxed file
            return this.fileObjs[index];
        }
    },
    showButton: function(index, fileObj) {
        var self = this;
        var wrapperObj = this.getWrapper(index);
        var button = wrapperObj.find("button.select");
        var button_remove = wrapperObj.find("button.remove");
        var fileEle = wrapperObj.find(".fh_appform_field_input");

        button.show();

        if (fileObj == null) {
            button.text("Select A File");
            button_remove.hide();
        } else {
            button.text(fileObj.fileName + "(" + fileObj.fileSize + ")");
            button_remove.show();
        }

        if (this.readonly) {
            button_remove.hide();
        }

        //Some operating systems do not support opening a file select browser
        //http://viljamis.com/blog/2012/file-upload-support-on-mobile/
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            //If not supported, show a warning on-device. There is also a warning in the studio when creating the form.
           $(button).text("File upload not supported");
           $(button).attr("disabled", true);
           button.off("click");
         }

        button_remove.off("click");
        button_remove.on("click", function() {
            var index = $(this).data().index;
            if (self.fileObjs && self.fileObjs[index]) {
                self.fileObjs[index] = null;
            }
            self.resetFormElement(fileEle);
            self.showButton(index, null); // remove file entry
        });

    },
    resetFormElement: function(e) {
        e.wrap("<form>").closest("form").get(0).reset();
        e.unwrap();
    },
    valuePopulateToElement: function(index, value) {
        if (value) {
            this.fileObjs[index] = value;
            this.showButton(index, value);
        }
    },
    onElementShow: function(index) {
        this.showButton(index, null);
    }
});
FieldGeoView = FieldView.extend({
    input: "<input class='fh_appform_field_input col-xs-12 text-center <%= repeatingClassName%>' data-field='<%= fieldId %>' data-index='<%= index %>'  type='<%= inputType %>' disabled/>",
    buttonHtml: "<i class='icon-location-arrow'></i>&nbsp<%= buttonText %>",
    type: "text",
    initialize: function() {
        this.geoValues = [];
        this.locationUnit = this.model.getFieldDefinition().locationUnit;
        FieldView.prototype.initialize.apply(this, arguments);
    },
    renderInput: function(index) {
        var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;
        var html = _.template(this.input, {
            "fieldId": this.model.getFieldId(),
            "index": index,
            "inputType": "text",
            "repeatingClassName": repeatingClassName
        });

        return $(html);
    },
    onElementShow: function(index) {
        var self = this;
        var rmBtn = $(this.renderButton(index, "<i class='icon-remove-circle'></i>&nbsp;Remove Location", "remove"));
        var btnLabel = this.locationUnit === "latlong" ? 'Capture Location (Lat/Lon)' : 'Capture Location (East/North)';
        btnLabel = _.template(this.buttonHtml, {
            "buttonText": btnLabel
        });
        var geoButton = $(this.renderButton(index, btnLabel, "fhgeo"));

        if (!this.readonly) {
            this.getWrapper(index).append(geoButton);
            this.getWrapper(index).append(rmBtn);

            geoButton.on("click", function(e) {
                self.getLocation(e, index);
            });

            rmBtn.on("click", function(e) {
                self.clearLocation(e, index);
                rmBtn.hide();
            });

            rmBtn.hide();
        }


    },
    clearLocation: function(e, index) {
        var textInput = this.getWrapper(index).find(".fh_appform_field_input");
        textInput.val("");
        this.geoValues.splice(index, 1); // Remove the geo value from the field
    },
    convertLocation: function(location) {
        var lat = location.lat;
        var lon = location.lon;
        var params = {
            lat: function() {
                return lat;
            },
            lon: function() {
                return lon;
            }
        };
        return OsGridRef.latLongToOsGrid(params);
    },
    renderElement: function(index) {
        var location = this.geoValues[index];
        var locStr = "";
        var wrapper = this.getWrapper(index);
        var textInput = wrapper.find(".fh_appform_field_input");
        if (location) {
            if (this.locationUnit === "latlong") {
                locStr = '(' + location.lat + ', ' + location["long"] + ')';
                wrapper.find(".remove").show();
            } else if (this.locationUnit === "eastnorth") {
                locStr = '(' + location.zone + ' ' + location.eastings + ', ' + location.northings + ')';
                wrapper.find(".remove").show();
            } else {
                $fh.forms.log.e("FieldGeo: Invalid location unit: " + locStr);
            }
            textInput.val(locStr);
        } else {
            wrapper.find(".remove").hide();
        }
        textInput.blur();
    },
    valuePopulateToElement: function(index, value) {
        this.geoValues[index] = value;
        this.renderElement(index);
    },
    valueFromElement: function(index) {
        return this.geoValues[index];
    },
    getLocation: function(e, index) {
        var that = this;
        e.preventDefault();
        var wrapper = that.getWrapper(index);
        var textInput = wrapper.find(".fh_appform_field_input");


        //$fh.geo does not exist on the theme preview.
        if ($fh.geo) {
            $fh.geo(function(res) {
                var location;

                res.lat = Number(Number(res.lat).toFixed(4));
                res.lon = Number(Number(res.lon).toFixed(4));
                if (that.locationUnit === "latlong") {
                    that.geoValues[index] = {
                        "lat": res.lat,
                        "long": res.lon
                    };
                } else if (that.locationUnit === "eastnorth") {
                    var en_location = that.convertLocation(res);
                    var locArr = en_location.toString().split(" ");
                    that.geoValues[index] = {
                        "zone": locArr[0],
                        "eastings": locArr[1],
                        "northings": locArr[2]
                    };
                } else {
                    $fh.forms.log.e("FieldGeo: Invalid location unit: " + locStr);
                }
                that.renderElement(index);
            }, function(msg, err) {
                textInput.attr('placeholder', 'Location could not be determined');
            });
        }

        return false;
    }
});
FieldMapView = FieldView.extend({
  extension_type: 'fhmap',
  input: "<div data-index='<%= index %>' id='<%= id%>' class='fh_map_canvas' style='width:<%= width%>; height:<%= height%>;'></div>",
  initialize: function() {
    this.mapInited = 0;
    this.maps = [];
    this.mapData = [];
    this.markers = [];
    this.allMapInitFunc = [];
    this.mapSettings = {
      mapWidth: '100%',
      mapHeight: '300px',
      defaultZoom: 16,
      location: {
        lon: -5.80078125,
        lat: 53.12040528310657
      }
    };
    FieldView.prototype.initialize.apply(this, arguments);
  },
  renderInput: function(index) {
    var inputEle = _.template(this.input, {
      width: this.mapSettings.mapWidth,
      height: this.mapSettings.mapHeight,
      'index': index,
      'id':Math.random()
    });
    return $(inputEle);
  },
  show: function() {
    this.$el.show();
    this.mapResize();
  },
  onMapInit: function(index) {
    this.mapInited++;
    if (this.mapInited === this.curRepeat) {
      // all map initialised
      this.allMapInit();
    }
  },
  allMapInit: function() {
    var func = this.allMapInitFunc.shift();
    while (typeof(func) !== "undefined") {
      if(typeof(func) === "function"){
        func();
        func = this.allMapInitFunc.shift();
      } else {
        func = this.allMapInitFunc.shift();
      }
    }
    this.mapResize();
  },
  onAllMapInit: function(func) {
    if (this.mapInited === this.curRepeat) {
      func();
      this.mapResize();
    } else {
      if (this.allMapInitFunc.indexOf(func) === -1) {
        this.allMapInitFunc.push(func);
      }
    }
  },
  onElementShow: function(index) {
    var wrapperObj = this.getWrapper(index);
    var self = this;

    var mapCanvas = wrapperObj.find('.fh_map_canvas')[0];

    if($fh.geo){
      $fh.geo({
        interval: 0
      }, function(geoRes) {
        // Override with geo, otherwise use defaults
        var location = {
          lat: geoRes.lat,
          lon: geoRes.lon
        };
        $fh.map({
          target: mapCanvas,
          lon: location.lon,
          lat: location.lat,
          zoom: self.mapSettings.defaultZoom,
          draggable: !self.readonly
        }, function(res) {
          self.maps[index] = res.map;

          var marker = new google.maps.Marker({
            position: self.maps[index].getCenter(),
            map: self.maps[index],
            draggable: !self.readonly,
            animation: google.maps.Animation.DROP,
            title: 'Drag this to set position'
          });
          self.markers[index] = marker;
          self.mapData[index] = {
            'lat': marker.getPosition().lat(),
            'long': marker.getPosition().lng(),
            'zoom': self.mapSettings.defaultZoom
          };
          self.onMapInit(index);
        }, function(err) {
          $fh.forms.log.e("Error getting map: ", err);
          self.onMapInit(index);
        });
      });
    }
  },
  mapResize: function() {
    var self = this;
    if (self.maps.length > 0) {
      for (var i = 0; i < self.maps.length; i++) {
        var map = this.maps[i];
        if (map) {
          google.maps.event.trigger(map, 'resize');
          map.setCenter(new google.maps.LatLng(self.mapData[i].lat, self.mapData[i]["long"]));
        }
      }
    }
  },
  onRender: function(){
    this.mapResize();
  },
  valueFromElement: function(index) {
    var map = this.maps[index];
    var marker = this.markers[index];
    if (map && marker) {
      return {
        'lat': marker.getPosition().lat(),
        'long': marker.getPosition().lng(),
        'zoom': map.getZoom()
      };
    } else {
      return null;
    }
  },
  valuePopulateToElement: function(index, value) {
    var that = this;
    function _handler() {
      var map = that.maps[index];
      var pt = new google.maps.LatLng(value.lat, value["long"]);
      that.mapData[index].lat = value.lat;
      that.mapData[index]["long"] = value["long"];
      map.setCenter(pt);
      map.setZoom(value.zoom);
      that.markers[index].setPosition(pt);
    }
    if (value){
      this.onAllMapInit(_handler);
    }

  }
});
FieldNumberView = FieldView.extend({
    type:"number",
    getHTMLInputType: function() {
      return "number";
    }
});

// We only capture this as text
// NOTE: validate plugin has a 'phoneUS' type. Could use this if needed
FieldPhoneView = FieldView.extend({
  type:"tel"
});
FieldRadioView = FieldView.extend({
  choice: '<button class="btn btn-primary text-left fh_appform_button_action" type="button" data-field="<%= fieldId %>" data-index="<%= index %>" data-value="<%= choice %>"><i class="icon-circle-blank choice_icon"></i><%= choice %></button>',
  radio: '<div class="btn-group-vertical fh_appform_field_input col-xs-12 <%= repeatingClassName%>" data-toggle="buttons-radio"></div>',

  renderInput: function(index) {
    var choices = this.model.getRadioOption();
    var self = this;
    var radioChoicesHtml = "";
    var fullRadioHtml = "";
    var html = "";
    var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;
    var inputElement = _.template(self.radio, { "repeatingClassName": repeatingClassName});
    inputElement = $(inputElement);

    var fieldId = this.model.getFieldId();
    $.each(choices, function(i, choice) {
      var jQObj = _.template(self.choice, {
        "fieldId": fieldId,
        "choice": choice.label,
        "value": choice.label,
        "index": index
      });

      jQObj = $(jQObj);

      if (choice.checked === true) {
        jQObj.addClass("active");
        jQObj.find('.choice_icon').removeClass('icon-circle-blank');
        jQObj.find('.choice_icon').addClass('icon-circle');
      }

      jQObj.off('click');
      jQObj.on('click', function(e){
        $(this).parent().find('.choice_icon').removeClass('icon-circle');
        $(this).parent().find('.choice_icon').addClass('icon-circle-blank');

        $(this).find('.choice_icon').removeClass('icon-circle-blank');
        $(this).find('.choice_icon').addClass('icon-circle');  
      });

      inputElement.append(jQObj);
    });

    return inputElement;
  },
  valuePopulateToElement: function (index, value) {
    var wrapperObj = this.getWrapper(index);
    var opt = wrapperObj.find('button[data-value=\'' + value + '\']');

    $(wrapperObj).find('button.active').removeClass("active");
    $(opt).parent().find('.choice_icon').removeClass('icon-circle');
    $(opt).parent().find('.choice_icon').addClass('icon-circle-blank');

    if (opt.length === 0) {
      opt = wrapperObj.find('button:first-child');
    }
    opt.addClass("active");
    opt.find('.choice_icon').removeClass('icon-circle-blank');
    opt.find('.choice_icon').addClass('icon-circle');
  },
  valueFromElement: function (index) {
    var wrapperObj = this.getWrapper(index);

    var data = wrapperObj.find('button.active').data();
    if(data){
      return wrapperObj.find('button.active').data().value;  
    } else {
      return this.model.getRadioOption()[0].label;
    }
  },
  onElementShow: function(index){
    
  }
});
FieldSelectView = FieldView.extend({
  select: "<select class='fh_appform_field_input form-control <%= repeatingClassName%> col-xs-12' data-field='<%= fieldId %>' data-index='<%= index %>'><%= options %></select>",
  option: '<option value="<%= value %>" <%= selected %>><%= value %></option>',

  renderInput: function(index) {
    var fieldId=this.model.getFieldId();
    var choices = this.model.get('fieldOptions');
    choices = choices.definition.options;
    var options="";
    var selectHtml = "";
    var html = "";
    var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;

    var self=this;
    $.each(choices, function(i, choice) {
      options += _.template(self.option, {
        "value": choice.label,
        "selected": (choice.checked) ? "selected='selected'" : ""
      });
    });

    return $(_.template(this.select, {
      "fieldId":fieldId,
      "index":index,
      "options":options,
      "repeatingClassName": repeatingClassName
    }));
  }
});
FieldSignatureView = FieldView.extend({
    extension_type: 'fhsig',
    input: "<img class='sigImage img-responsive' data-field='<%= fieldId %>' data-index='<%= index %>'/>",
    templates: {
        signaturePad: ['<div class="sigPad">', '<div class="sigPad_header col-xs-12">', '<button class="clearButton fh_appform_button_cancel btn btn-danger col-xs-5 col-xs-offset-1">Clear</button><button class="cap_sig_done_btn fh_appform_button_action btn btn-primary col-xs-5 col-xs-offset-1 pull-right">Done</button>', '<br style="clear:both;" />', '</div>', '<div class="sig sigWrapper">', '<canvas class="pad" width="<%= canvasWidth %>" height="<%= canvasHeight %>"></canvas>', '</div>', '</div>']
    },

    initialize: function(options) {
        FieldView.prototype.initialize.call(this, options);
        this.on('visible', this.clearError);
    },
    onElementShow: function(index) {
        if (!this.readonly) {
            var html = $(this.renderButton(index, "<i class='icon-pencil'></i>&nbsp;Capture Signature", this.extension_type));
            this.getWrapper(index).append(html);
            var self = this;
            html.on("click", function() {
                self.showSignatureCapture(index);
            });
        }

    },
    validate: function(e) {
        this.trigger("checkrules");
    },
    showSignatureCapture: function(index) {
        var self = this;
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        var canvasHeight = winHeight - 70;
        var canvasWidth = winWidth - 2;
        var lineTop = canvasHeight - 20;

        this.$el.append(_.template(this.templates.signaturePad.join(''), {
            "canvasHeight": canvasHeight,
            "canvasWidth": canvasWidth
        }));
        var signaturePad = $('.sigPad', this.$el);

        var diff = 0;
        
        //Windows phone overlays the task bar on the top of the screen. 
        //Setting the position of the task bar to be absolute for windows phones.
        //http://stackoverflow.com/questions/19518145/windows-phone-8-html5-viewport-is-higher-than-the-screen-after-update-to-8-0-103
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            diff = $(window).height() - window.outerHeight;
        }

        var diffpx = "" + diff + "px";
        
        signaturePad.css({
            'position': 'fixed',
            'z-index': 9999,
            'bottom': '0px',
            'right': '0px',
            'top': diffpx,
            'left': '0px',
            'background-color': '#fff'
        });

        var navHeight = $('.sigNav', this.$el).outerHeight();
        $('.sigPad', this.$el).css({
            width: '100%',
            height: winHeight + 'px'
        });
        $('.sigWrapper', this.$el).css({
            height: (winHeight - navHeight - 20) + "px"
        });
        sigPad = $('.sigPad', this.$el).signaturePad({
            drawOnly: true,
            lineTop: lineTop
        });

        $(this.$el).data('sigpadInited', true);
        // Bind capture
        $('.cap_sig_done_btn', this.$el).unbind('click').bind('click', function(e) {
            // var loadingView = new LoadingView();
            // loadingView.show("generating signature");
            e.preventDefault();
            var sig = sigPad.getSignature(); // get the default image type
            if (sig && sig.length) {
                var sigData = sigPad.getSignatureImage();
                if (self.isEmptyImage(sigData)) { //toDataUrl not supported by current browser. fallback use bmp encoder
                    sigData = self.toBmp();
                }
                self.setSignature(index, sigData);
            }
            $('.sigPad', self.$el).hide();
        });
    },
    setSignature: function(index, base64Img) {
        var wrapper = this.getWrapper(index);
        wrapper.find("img.sigImage").attr("src", base64Img);
    },
    valueFromElement: function(index) {
        var wrapper = this.getWrapper(index);
        var img = wrapper.find("img.sigImage");
        return img.attr("src");
    },
    valuePopulateToElement: function(index, value) {
        if (value) {
            var base64Data = value.data;
            var base64Img = value.imgHeader + base64Data;
            var wrapper = this.getWrapper(index);
            var img = wrapper.find("img.sigImage");
            img.attr("src", base64Img);
        }

    },
    dbgImage: function(msg, image) {
        $fh.forms.log.d(msg + (image ? (image.substring(0, image.indexOf(",")) + "[len=" + image.length + "]") : " empty"));
    },

    toBmp: function(image) {
        image = _.extend({}, image || {}, {
            quality: 100,
            width: 248,
            height: 100
        });
        var sigData;
        var cnvs = $('.sigPad', self.$el).find('canvas')[0];

        var oScaledCanvas = this.scaleCanvas(cnvs, image.width, image.height);
        var oData = this.readCanvasData(oScaledCanvas);
        var strImgData = this.createBMP(oData);

        sigData = this.makeDataURI(strImgData, "image/bmp");
        return sigData;
    },

    // bitMap handling code
    readCanvasData: function(canvas) {
        var iWidth = parseInt(canvas.width, 10);
        var iHeight = parseInt(canvas.height, 10);
        return canvas.getContext("2d").getImageData(0, 0, iWidth, iHeight);
    },

    encodeData: function(data) {
        var strData = "";
        if (typeof data === "string") {
            strData = data;
        } else {
            var aData = data;
            for (var i = 0; i < aData.length; i++) {
                strData += String.fromCharCode(aData[i]);
            }
        }
        return btoa(strData);
    },

    createBMP: function(oData) {
        var aHeader = [];

        var iWidth = oData.width;
        var iHeight = oData.height;

        aHeader.push(0x42); // magic 1
        aHeader.push(0x4D);

        var iFileSize = iWidth * iHeight * 3 + 54; // total header size = 54
        // bytes
        aHeader.push(iFileSize % 256);
        iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256);
        iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256);
        iFileSize = Math.floor(iFileSize / 256);
        aHeader.push(iFileSize % 256);

        aHeader.push(0); // reserved
        aHeader.push(0);
        aHeader.push(0); // reserved
        aHeader.push(0);

        aHeader.push(54); // dataoffset
        aHeader.push(0);
        aHeader.push(0);
        aHeader.push(0);

        var aInfoHeader = [];
        aInfoHeader.push(40); // info header size
        aInfoHeader.push(0);
        aInfoHeader.push(0);
        aInfoHeader.push(0);

        var iImageWidth = iWidth;
        aInfoHeader.push(iImageWidth % 256);
        iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256);
        iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256);
        iImageWidth = Math.floor(iImageWidth / 256);
        aInfoHeader.push(iImageWidth % 256);

        var iImageHeight = iHeight;
        aInfoHeader.push(iImageHeight % 256);
        iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256);
        iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256);
        iImageHeight = Math.floor(iImageHeight / 256);
        aInfoHeader.push(iImageHeight % 256);

        aInfoHeader.push(1); // num of planes
        aInfoHeader.push(0);

        aInfoHeader.push(24); // num of bits per pixel
        aInfoHeader.push(0);

        aInfoHeader.push(0); // compression = none
        aInfoHeader.push(0);
        aInfoHeader.push(0);
        aInfoHeader.push(0);

        var iDataSize = iWidth * iHeight * 3;
        aInfoHeader.push(iDataSize % 256);
        iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256);
        iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256);
        iDataSize = Math.floor(iDataSize / 256);
        aInfoHeader.push(iDataSize % 256);

        for (var i = 0; i < 16; i++) {
            aInfoHeader.push(0); // these bytes not used
        }

        var iPadding = (4 - ((iWidth * 3) % 4)) % 4;

        var aImgData = oData.data;

        var strPixelData = "";
        var y = iHeight;
        do {
            var iOffsetY = iWidth * (y - 1) * 4;
            var strPixelRow = "";
            for (var x = 0; x < iWidth; x++) {
                var iOffsetX = 4 * x;

                strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX + 2]);
                strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX + 1]);
                strPixelRow += String.fromCharCode(aImgData[iOffsetY + iOffsetX]);
            }
            for (var c = 0; c < iPadding; c++) {
                strPixelRow += String.fromCharCode(0);
            }
            strPixelData += strPixelRow;
        } while (--y);

        var strEncoded = this.encodeData(aHeader.concat(aInfoHeader)) + this.encodeData(strPixelData);

        return strEncoded;
    },
    makeDataURI: function(strData, strMime) {
        return "data:" + strMime + ";base64," + strData;
    },
    scaleCanvas: function(canvas, iWidth, iHeight) {
        if (iWidth && iHeight) {
            var oSaveCanvas = document.createElement("canvas");
            oSaveCanvas.width = iWidth;
            oSaveCanvas.height = iHeight;
            oSaveCanvas.style.width = iWidth + "px";
            oSaveCanvas.style.height = iHeight + "px";

            var oSaveCtx = oSaveCanvas.getContext("2d");

            oSaveCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, iWidth, iHeight);
            return oSaveCanvas;
        }
        return canvas;
    },
    isEmptyImage: function(image) {
        return image === null || image === "" || image === "data:,";
    },
    splitImage: function(image) {
        var PREFIX = "data:";
        var ENCODING = ";base64,";
        var start = image.indexOf(PREFIX);
        var content_type = "image/bmp";
        var ext = "bmp";
        if (start >= 0) {
            var end = image.indexOf(ENCODING, start) + 1;
            content_type = image.substring(start, end - 1);
            ext = content_type.split("/")[1];
        }
        return [content_type, ext];
    }

});
FieldTextView = FieldView.extend({

});
FieldTextareaView = FieldView.extend({
    input: "<textarea class='fh_appform_field_input col-xs-12' data-field='<%= fieldId %>' data-index='<%= index %>'  ></textarea>"
});
FieldSectionBreak = FieldView.extend({
  className: "fh_appform_section_break panel panel-default",
  templates: {
      sectionBreak: '<div class="panel-heading"><%= sectionTitle %></div>'
  },
  renderEle:function(){
    return _.template(this.templates.sectionBreak, {sectionTitle: this.model.getName(), sectionDescription: this.model.getHelpText()});
  },
  renderTitle: function(){
    return "";
  },
  renderHelpText: function(){
    return "";
  }
});
FieldDateTimeView = FieldView.extend({
  extension_type: 'fhdate',
  inputTime: "<input class='fh_appform_field_input col-xs-12 text-center <%= repeatingClassName%>' data-field='<%= fieldId %>' data-index='<%= index %>' type='time'>",
  inputDate: "<input class='fh_appform_field_input col-xs-12 text-center   <%= repeatingClassName%>' data-field='<%= fieldId %>' data-index='<%= index %>' type='date'>",
  inputDateTime: "<input class='fh_appform_field_input col-xs-12 text-center   <%= repeatingClassName%>' data-field='<%= fieldId %>' data-index='<%= index %>' type='text'>",
  renderInput:function(index){
    var fieldId = this.model.getFieldId();
    var repeatingClassName = this.model.isRepeating() ? this.repeatingClassName : this.nonRepeatingClassName;

    var unit=this.getUnit();
    var template="";
    var buttonLabel="";
    if (unit==="datetime"){
      template=this.inputDateTime;
      buttonLabel="<i class='icon-calendar'></i> <i class='icon-time'></i>&nbspGet Current Date & Time";
    }else if (unit==="date"){
      template=this.inputDate;
      buttonLabel="<i class='icon-calendar'></i>&nbspGet Current Date";
    }else if (unit==="time"){
      template=this.inputTime;
      buttonLabel="<i class='icon-time'></i>&nbspGet Current Time";
    }
    var html=_.template(template,{
      "fieldId":fieldId,
      "index":index,
      "repeatingClassName": repeatingClassName
    });

    if(!this.readonly){
      html+=this.renderButton(index,buttonLabel,"fhdate");   
    }
    

    return $(html);
  },
  getUnit:function(){
    var def=this.model.getFieldDefinition();
    return def.datetimeUnit;
  },
  onRender:function(){
    var that=this;

    if(!this.readonly){
      this.$el.on("click","button",function(){
        that.action(this);
      });  
    }
  },
  action: function(el) {
    var index=$(el).data().index;
    var self = this;
    var now=new Date();
    if (self.getUnit() === "datetime") {
      $('input[data-index="'+index+'"]', this.$el).val(self.getDate(now)+" "+self.getTime(now)).blur();
    } else if (self.getUnit() === "date") {
      $('input[data-index="'+index+'"]', this.$el).val(self.getDate(now)).blur();
    } else if (self.getUnit() === "time") {
      $('input[data-index="'+index+'"]', this.$el).val(self.getTime(now)).blur();
    }
  },
  getDate:function(d){
    return "YYYY-MM-DD".replace("YYYY",d.getFullYear()).replace("MM",this.twoDigi(d.getMonth()+1)).replace("DD",this.twoDigi(d.getDate()));
  },
  getTime:function(d){
    return "HH:mm".replace("HH",this.twoDigi(d.getHours())).replace("mm",this.twoDigi(d.getMinutes()));
  },
  twoDigi:function(num){
    if (num<10){
      return "0"+num.toString();
    }else{
      return num.toString();
    }
  }
});
FieldUrlView = FieldView.extend({
  type: "url"
});
var PageView=BaseView.extend({

  viewMap: {
    "text": FieldTextView,
    "number": FieldNumberView,
    "textarea": FieldTextareaView,
    "radio": FieldRadioView,
    "checkboxes": FieldCheckboxView,
    "dropdown": FieldSelectView,
    "file": FieldFileView,
    "emailAddress": FieldEmailView,
    "phone": FieldPhoneView,
    "location": FieldGeoView,
    "photo": FieldCameraView,
    "signature": FieldSignatureView,
    "locationMap": FieldMapView,
    "dateTime":FieldDateTimeView,
    "sectionBreak":FieldSectionBreak,
    "url":FieldUrlView
  },
  templates : {
    pageTitle: '<div class="fh_appform_page_title text-center"><%= pageTitle %></div>',
    pageDescription: '<div class="fh_appform_page_description text-center"><h4><%= pageDescription%></h4></div>',
    section: ''
  },

  initialize: function(options) {
    this.options = options;
    var self = this;
    _.bindAll(this, 'render',"show","hide");
    // Page Model will emit events if user input meets page rule to hide / show the page.
    this.model.on("visible",self.show);
    this.model.on("hidden",self.hide);
    this.render();
  },

  render: function() {
    var self = this;
    this.fieldViews = {};
    this.sectionViews = {};
    // all pages hidden initially
    this.$el.empty().addClass('fh_appform_page fh_appform_hidden col-xs-12');

    // add to parent before init fields so validation can work
    this.options.parentEl.append(this.$el);

    var fieldModelList=this.model.getFieldModelList();

    var sections = this.model.getSections();

    function toggleSection(fieldTarget){
      if(fieldTarget){
        $('#' + fieldTarget).slideToggle(600);
        $('#' + fieldTarget + "_icon").toggleClass('icon-chevron-sign-up');
        $('#' + fieldTarget + "_icon").toggleClass('icon-chevron-sign-down');
      } 
    }

    if(sections != null){
      var sectionKey;
      var sectionIndex = 0;

      var sectionGroup = $('<div class="panel-group" id="accordion"></div>');
      

      //Add the section fields
      for(sectionKey in sections){
        var sectionEl = $(_.template(self.options.formView.$el.find('#temp_page_structure').html(), {"sectionId": sectionKey, title: sections[sectionKey].title, index: sectionIndex}));
        var sectionDivId = '#fh_appform_' + sectionKey + '_body_icon';
        sectionIndex++;
        sectionEl.find('.panel-heading').off('click');
        sectionEl.find(sectionDivId).off('click');

        sectionEl.find(sectionDivId).on('click', function(e){
          var fieldTarget = $(this).parent().data().field;
          toggleSection(fieldTarget);
        });

        sectionEl.find('.panel-heading').on('click', function(e){
          if($(e.target).data()){
            if($(e.target).data().field){
              toggleSection($(e.target).data().field);
            }  
          }
        });
        sectionGroup.append(sectionEl);
        sections[sectionKey].fields.forEach(function(field, index){
          var fieldType = field.getType();
          if (self.viewMap[fieldType]) {

            $fh.forms.log.l("*- "+fieldType);

            if(fieldType !== "sectionBreak"){
                self.fieldViews[field.get('_id')] = new self.viewMap[fieldType]({
                parentEl: sectionEl.find('.panel-body'),
                parentView: self,
                model: field,
                formView: self.options.formView,
                sectionName: sectionKey
              });  
            } 
          } else {
            $fh.forms.log.w('FIELD NOT SUPPORTED:' + fieldType);
          }
        });
      }

      this.$el.append(sectionGroup);
    } else {
      fieldModelList.forEach(function (field, index) {
        if(!field) {
          return;
        }
        var fieldType = field.getType();
        if (self.viewMap[fieldType]) {

          $fh.forms.log.l("*- "+fieldType);

          self.fieldViews[field.get('_id')] = new self.viewMap[fieldType]({
            parentEl: self.$el,
            parentView: self,
            model: field,
            formView: self.options.formView
          });
        } else {
          console.warn('FIELD NOT SUPPORTED:' + fieldType);
        }
      });
    }
  },

  expandSection: function(fieldId){
    var sections = this.model.getSections();
    var sectionFound = false;
    var sectionId = "";
    for(var sectionKey in sections){
      sections[sectionKey].fields.forEach(function(field, index){
        if(field.get("_id") === fieldId){
          sectionFound = true;
          sectionId = sectionKey;
        }
      });
    }

    if(sectionFound){
      $("#fh_appform_" + sectionId + "_body").slideDown(20);
      $("#fh_appform_" + sectionId + "_body_icon").removeClass('icon-minus');

      if(!$("#fh_appform_" + sectionId + "_body_icon").hasClass('icon-plus')){
         $("#fh_appform_" + sectionId + "_body_icon").addClass('icon-plus');
      }
    }
  },

  show: function () {
    var self = this;
    self.$el.show();

    for(var fieldViewId in self.fieldViews){
      if(self.fieldViews[fieldViewId].mapResize){
        self.fieldViews[fieldViewId].mapResize();
      }
    }
  },

  hide: function () {

    this.$el.hide();
  },

  showField: function (id) {
    // show field if it's on this page
    if (this.fieldViews[id]) {
      this.fieldViews[id].show();
    }
  },

  hideField: function (id) {
    // hide field if it's on this page
    if (this.fieldViews[id]) {
      this.fieldViews[id].hide();
    }
  },

  isValid: function () {
    // only validate form inputs on this page that are visible or type=hidden, or have validate_ignore class
    var validateEls = this.$el.find('.fh_appform_field_input').not('.validate_ignore]:hidden');
    return validateEls.length ? validateEls.valid() : true;
  }

});
var FormView = BaseView.extend({
  "pageNum": 0,
  "pageCount": 0,
  "pageViews": [],
  "submission": null,
  "fieldValue": [],
  templates: {
    formLogo: '<div class="fh_appform_logo_container col-xs-12"><div class="fh_appform_logo"></div></div>',
    formTitle: '<div class="fh_appform_form_title col-xs-12 text-center"><h1><%= title %></h1></div>'
  },
  events: {},
  elementNames: {
    formContainer: "#fh_appform_container"
  },

  initialize: function(options) {
    this.formEdited = false;
    this.options = this.options || options;
    this.readonly = this.options.readOnly;
    var self = this;
    _.bindAll(this, "checkRules", "onValidateError");
    this.$el = this.options.parentEl;
    this.fieldModels = [];
    this.pageViewStatus = {};
    this.$el.empty();
  },
  loadForm: function(params, cb) {
    var self = this;

    if (params.formId) {
      self.onLoad();
      $fh.forms.getForm(params, function(err, form) {
        if (err) {
          throw (err.body);
        }
        self.form = form;
        self.params = params;
        self.initWithForm(form, params);
        cb();
      });
    } else if (params.form) {
      self.form = params.form;
      self.params = params;
      self.initWithForm(params.form, params);
      cb();
    }
  },
  readOnly: function() {
    this.readonly = true;
    for (var i = 0; i < this.fieldViews.length; i++) {
      var fieldView = this.fieldViews[i];
      fieldView.$el.find("button,input,textarea,select").attr("disabled", "disabled");
    }
    this.$el.find("button.fh_appform_button_saveDraft").hide();
    this.$el.find(" button.fh_appform_button_submit").hide();
  },
  markFormEdited: function(){
    this.formEdited = true;
  },
  isFormEdited: function(){
    return this.formEdited;
  },
  onValidateError: function(res) {
    var self = this;
    var firstView = null;
    var invalidFieldId = null;
    var invalidPageNum = null;

    //Clear validate errors

    self.fieldViews.forEach(function(v) {
        var fieldId = v.model.getFieldId();
        if(res.hasOwnProperty(fieldId)){
          var result = res[fieldId];
          result.errorMessages = result.errorMessages || [];
          result.fieldErrorMessage = result.fieldErrorMessage || [];
          if (!result.valid) {
            if(invalidFieldId === null){
              invalidFieldId = fieldId;
              invalidPageNum = self.form.getPageNumberByFieldId(invalidFieldId);
            }
            for (var i = 0; i < result.errorMessages.length; i++) {
              if (result.errorMessages[i]) {
                v.setErrorText(i, result.errorMessages[i]);
              }
            }

            for (i = 0; i < result.fieldErrorMessage.length; i++) {
              if (result.fieldErrorMessage[i]) {
                v.setErrorText(i, result.fieldErrorMessage[i]);
              }
            }
          }
        }
    });

    if(invalidFieldId !== null && invalidPageNum !== null){
      var displayedIndex = this.getDisplayIndex(invalidPageNum) + 1;
      self.goToPage(invalidPageNum, false);

      self.pageViews[invalidPageNum].expandSection(invalidFieldId);

      $('html, body').animate({
          scrollTop: $("[data-field='" + invalidFieldId + "']").offset().top - 100
      }, 1000);



      this.$el.find("#fh_appform_page_error").html("Unable to submit form. Validation error on page " + displayedIndex);
      this.$el.find("#fh_appform_page_error").show();
    }
  },
  initWithForm: function(form, params) {
    var self = this;
    var pageView;
    self.formId = form.getFormId();

    self.$el.empty();
    self.$el.append("<div id='fh_appform_templates' style='display:none;'>" + FormTemplates + "</div>");
    self.model = form;

    //Page views are always added before anything else happens, need to render the form title first

    var formHtml = _.template(self.$el.find('#temp_form_structure').html(), {title: self.model.getName()});

    self.$el.append(formHtml);

    if (!params.submission) {
      params.submission = self.model.newSubmission();
    }
    self.submission = params.submission;
    self.submission.on("validationerror", self.onValidateError);

    // Init Pages --------------
    var pageModelList = form.getPageModelList();
    var pageViews = [];

    self.steps = new StepsView({
      parentEl: self.$el.find(this.elementNames.formContainer),
      parentView: self,
      model: self.model
    });

    for (var i = 0; i < pageModelList.length; i++) {
      var pageModel = pageModelList[i];
      var pageId = pageModel.getPageId();

      self.pageViewStatus[pageId] = {
        "targetId": pageId,
        "action": "show"
      };

      // get fieldModels
      var list = pageModel.getFieldModelList();
      self.fieldModels = self.fieldModels.concat(list);

      pageView = new PageView({
        model: pageModel,
        parentEl: self.$el.find(this.elementNames.formContainer),
        formView: self
      });
      pageViews.push(pageView);
    }
    var fieldViews = [];
    for (i = 0; i < pageViews.length; i++) {
      pageView = pageViews[i];
      var pageFieldViews = pageView.fieldViews;
      for (var key in pageFieldViews) {
        var fView = pageFieldViews[key];
        fieldViews.push(fView);
        fView.on("checkrules", self.checkRules);
        if (self.readonly) {
          fView.$el.find("input,button,textarea,select").attr("disabled", "disabled");
        }
      }
    }

    self.fieldViews = fieldViews;
    self.pageViews = pageViews;
    self.pageCount = pageViews.length;
    var buttonsHtml = _.template(self.$el.find('#temp_form_buttons').html());
    this.$el.find("#fh_appform_container.fh_appform_form_area").append(buttonsHtml);
  },
  checkRules: function(params) {
    var self = this;
    var submission = self.submission;
    params = params || {};

    function checkSubmissionRules() {
      submission.checkRules(function(err, res) {
        if (err) {
          console.error(err);
        } else {
          var actions = res.actions;
          var targetId;
          for (targetId in actions.pages) {
            self.pageViewStatus[targetId] = actions.pages[targetId];
          }

          var fields = actions.fields;

          for (targetId in fields) {
            self.performRuleAction("field", targetId, fields[targetId]["action"]);
          }
        }
        self.checkPages();
        self.steps.activePageChange(self);
      });
    }

    if (params.initialising) {
      checkSubmissionRules();
    } else {
      self.populateFieldViewsToSubmission(false, function() {
        checkSubmissionRules();
      });
    }
  },
  performRuleAction: function(type, targetId, action) {
    var target = null;
    if (type === "field") {
      target = this.getFieldViewById(targetId);
    }
    if (target === null) {
      console.error("cannot find target with id:" + targetId);
      return;
    }
    switch (action) {
      case "show":
        target.$el.show();
        break;
      case "hide":
        target.$el.hide();
        break;
      default:
        console.error("action not defined:" + action);
    }
  },
  rebindButtons: function() {
    var self = this;
    this.$el.find("button.fh_appform_button_next").unbind().bind("click", function() {
      self.nextPage();
    });

    this.$el.find("button.fh_appform_button_previous").unbind().bind("click", function() {
      self.prevPage();
    });

    this.$el.find("button.fh_appform_button_saveDraft").unbind().bind("click", function() {
      if($fh.forms.config.isStudioMode()){//Studio mode does not submit.
        alert("Please create a project and interact with the form there.");
      } else {
        self.saveToDraft();
      }
    });
    this.$el.find("button.fh_appform_button_submit").unbind().bind("click", function() {
      if($fh.forms.config.isStudioMode()){//Studio mode does not submit.
        alert("Please create a project and interact with the form there.");
      } else {
        self.submit();
      }
    });
  },
  setSubmission: function(sub) {
    this.submission = sub;
  },
  getSubmission: function() {
    return this.submission;
  },
  getPageIndexById: function(pageId){
    for (var i = 0; i < this.pageViews.length; i++) {
      var pageView = this.pageViews[i];
      var pId = pageView.model.getPageId();
      if (pId === pageId) {
        return i;
      }
    }
    return null;
  },
  getPageViewById: function(pageId) {
    for (var i = 0; i < this.pageViews.length; i++) {
      var pageView = this.pageViews[i];
      var pId = pageView.model.getPageId();
      if (pId === pageId) {
        return pageView;
      }
    }
    return null;
  },
  getFieldViewById: function(fieldId) {
    for (var i = 0; i < this.fieldViews.length; i++) {
      var fieldView = this.fieldViews[i];
      var pId = fieldView.model.getFieldId();
      if (pId === fieldId) {
        return fieldView;
      }
    }
    return null;
  },
  checkPages: function() {

    var displayedPages = this.getNumDisplayedPages();
    var displayedIndex = this.getDisplayIndex();

    var prevButton = this.$el.find("button.fh_appform_button_previous").parent();
    var nextButton = this.$el.find("button.fh_appform_button_next").parent();
    var submitButton = this.$el.find(" button.fh_appform_button_submit").parent();
    var saveDraftButton = this.$el.find("button.fh_appform_button_saveDraft").parent();
    

    if (displayedIndex === 0 && displayedIndex === displayedPages - 1) {
        prevButton.hide();
        nextButton.hide();
        saveDraftButton.show();
        submitButton.show();
        if(this.readonly){
          this.$el.find("#fh_appform_navigation_buttons").hide();  
        }
        
    } else if (displayedIndex === 0) {
        prevButton.hide();
        nextButton.show();
        saveDraftButton.show();
        submitButton.hide();
    } else if (displayedIndex === displayedPages - 1) {
        prevButton.show();
        nextButton.hide();
        saveDraftButton.show();
        submitButton.show();
    } else {
        prevButton.show();
        nextButton.show();
        saveDraftButton.show();
        submitButton.hide();
    }

    if (this.readonly) {
        saveDraftButton.hide();
        submitButton.hide();
    }
  },
  render: function() {
    this.rebindButtons();
    this.hideAllPages();
    this.pageViews[0].show();
    this.pageNum = 0;
    this.steps.activePageChange(this);
    this.checkRules({
      initialising: false
    });
    return this;
  },
  getNextPageIndex: function(currentPageIndex) {
    var self = this;

    if(pageIndex >= this.pageViews.length){
      return this.pageViews.length -1;
    }

    for (var pageIndex = currentPageIndex + 1; pageIndex < this.pageViews.length; pageIndex += 1) {
      var pageId = this.pageViews[pageIndex].model.getPageId();
      var pageAction = self.pageViewStatus[pageId].action;

      if (pageAction === "show") {
        return pageIndex;
      }
    }
  },
  getPrevPageIndex: function(currentPageIndex) {
    var self = this;
    if(currentPageIndex <= 0){//Can't display pages before 0.
      return 0;
    }

    for (var pageIndex = currentPageIndex - 1; pageIndex >= 0; pageIndex--) {
      var pageId = self.pageViews[pageIndex].model.getPageId();
      var pageAction = self.pageViewStatus[pageId].action;

      if (pageAction === "show") {
        return pageIndex;
      }
    }
  },
  getDisplayIndex: function(pageNum) {
    var self = this;
    var currentIndex = (pageNum === null || typeof(pageNum) === 'undefined') ? this.pageNum: pageNum;

    for (var pageIndex = this.pageNum; pageIndex > 0; pageIndex--) {
      var pageId = this.pageViews[pageIndex].model.getPageId();
      var pageAction = self.pageViewStatus[pageId].action;

      if (pageAction === "hide") {
        currentIndex -= 1;
      }
    }

    return currentIndex;
  },
  getNumDisplayedPages: function() {
    return this.getDisplayedPages().length;
  },
  getDisplayedPages: function() {
    var self = this;
    var displayedPages = [];
    for (var pageIndex = 0; pageIndex < self.pageViews.length; pageIndex++) {
      var pageId = this.pageViews[pageIndex].model.getPageId();
      var pageAction = self.pageViewStatus[pageId].action;

      if (pageAction === "show") {
        displayedPages.push(pageId);
      }
    }

    return displayedPages;
  },
  displayCurrentPage: function(scroll){
    this.hideAllPages();
    this.pageViews[this.pageNum].show();
    this.steps.activePageChange(this);
    this.checkPages();
    if(scroll){
      this.scrollToTop();  
    }
  },
  goToPage: function(pageNum, scroll){
    if(_.isFinite(pageNum)){
      this.pageNum = parseInt(pageNum);
      this.displayCurrentPage(scroll);
    } else {
      $fh.forms.log.e("Error switching page: Invalid argument ", pageNum);
    }     
  },
  nextPage: function() {
    this.pageNum = this.getNextPageIndex(this.pageNum);
    this.displayCurrentPage(true);
  },
  prevPage: function() {
    this.pageNum = this.getPrevPageIndex(this.pageNum);
    this.displayCurrentPage(true);
  },
  scrollToTop: function(){
    //Positioning the window to the top of the form container
    $('html, body').animate({
          scrollTop: 0
    }, 500, function() { 
        window.scrollTo(0, 0);
    });
  },
  backEvent: function(){
    var self = this;
    if(this.pageNum <= 0){ // Already at the first page, exiting the form. Up to the client what to do with this result.
      return false;
    } 
    self.prevPage();
    return true;
  },
  hideAllPages: function() {
    this.pageViews.forEach(function(view) {
      //make sure to use $el when calling jquery func
      view.hide();
    });
  },
  validateForm: function(cb){
    var self = this;
    this.populateFieldViewsToSubmission(function() {
      self.submission.validateSubmission(cb);
    });
  },
  submit: function(cb) {
    var self = this;
    this.populateFieldViewsToSubmission(function() {
      self.submission.submit(function(err, res) {
        if (err) {
          $fh.forms.log.e("Error Submitting Form:", err);
          if(typeof(cb) === "function"){
            cb(err);
          }
        } else {
          self.submission.upload(function(err, uploadTask) {
            if (err) {
              $fh.forms.log.e("Error Uploading Form:", err);
            }

            if(typeof(cb) === "function"){
              cb();
            }

            self.$el.empty();
          });
        }
      });
    });
  },
  saveToDraft: function(cb) {
    var self = this;
    this.populateFieldViewsToSubmission(function() {
      self.submission.saveDraft(function(err, res) {
        if (err) {
          $fh.forms.log.e(err);
        } else {
          self.formEdited = false;  
        }
        
        if(typeof(cb) === "function"){
          cb(err);
        }
      });
    });
  },
  populateFieldViewsToSubmission: function(isStore, cb) {
    if (typeof cb === "undefined") {
      cb = isStore;
      isStore = true;
    }
    var submission = this.submission;
    var fieldViews = this.fieldViews;
    var fieldId;
    var tmpObj = [];
    for (var i = 0; i < fieldViews.length; i++) {
      var fieldView = fieldViews[i];
      var val = fieldView.value();
      fieldId = fieldView.model.getFieldId();
      var fieldType = fieldView.model.getType();

      if (fieldType !== "sectionBreak") {
        for (var j = 0; j < val.length; j++) {
          var v = val[j];
          tmpObj.push({
            id: fieldId,
            value: v,
            index: j
          });
        }
      }
    }
    var count = tmpObj.length;
    for (i = 0; i < tmpObj.length; i++) {
      var item = tmpObj[i];
      fieldId = item.id;
      var value = item.value;
      var index = item.index;

      if (value !== null || typeof(value) !== 'undefined') {
        submission.addInputValue({
          fieldId: fieldId,
          value: value,
          index: index,
          isStore: isStore
        }, function(err, res) {
          if (err) {
            console.error(err);
          }
          count--;
          if (count === 0) {
            cb();
          }
        });
      } else {
        $fh.forms.log.e("Input value for fieldId " + fieldId + " was not defined");
        count--;
        if (count === 0) {
          cb();
        }
      }
    }
  },

  setInputValue: function(fieldId, value) {
    var self = this;
    for (var i = 0; i < this.fieldValue.length; i++) {
      var item = this.fieldValue[i];
      if (item.id === fieldId) {
        this.fieldValue.splice(i, 1);
      }
    }
    for (i = 0; i < value.length; i++) {
      var v = value[i];
      this.fieldValue.push({
        id: fieldId,
        value: v
      });
    }
  }
});
var FromJsonView = BaseView.extend({
    events: {
        'click button#convert': 'convert'
    },
    templates: {
        body: '<h1>Insert JSON</h1><textarea id="jsonBox" rows="30" cols="50"></textarea><button id="convert">Convert</button><div id="resultArea"></div>'
    },
    el: '#jsonPage',
    initialize: function(options) {
        this.options = options;
        _.bindAll(this, 'render');
    },
    show: function() {
        $(this.$el).show();
    },
    hide: function() {
        $(this.$el).hide();
    },
    render: function() {
        $(this.$el).html(this.templates.body);
        this.show();
    },
    convert: function() {
        var json = $('#jsonBox').val();
        var jsonData;
        try {
            jsonData = JSON.parse(json);
        } catch (e) {
            $fh.forms.log.d("Error parsing json: ", e);
            throw 'Invalid JSON object';
        }
        var params = {
            formId: new Date().getTime(),
            rawMode: true,
            rawData: jsonData
        };
        var formView = new FormView({
            parentEl: $('#backbone #resultArea')
        });
        formView.loadForm(params, function(err) {
            formView.render();
        });
    }
});
SectionView=BaseView.extend({

  initialize: function(options) {
    this.options = options;
    _.bindAll(this, 'render');
  },
  render: function(){
    this.options.parentEl.append(this.$el);
  }

});
StepsView = Backbone.View.extend({
  className: 'fh_appform_progress_steps col-xs-12',

  templates: {
      table: '<ul class="pagination pagination-lg col-xs-12"></ul>',
      step: '<li data-index="<%= index %>"><span class="number_container text-center" style="width: <%= width %>%;"><%= step_num %></span></li>',
      page_title: '<div class="col-xs-12 text-center"><h3 class="fh_appform_page_title"></h3></div>'
  },
  events: {
    'click li': 'switchPage'
  },

  initialize: function(options) {
    this.options = options;
    var self = this;

    _.bindAll(this, 'render');
    this.parentView = this.options.parentView;
    this.options.parentEl.append(this.$el);
  },

  render: function() {
    var self = this;
    this.$el.empty();
    var table = $(self.templates.table);

    var displayedPages = this.parentView.getDisplayedPages();
    var width = 100;

    if(displayedPages.length > 0){
      width = 100 / displayedPages.length;
    }

    displayedPages.forEach(function(pageId, index) {
      var pageModel = self.parentView.getPageViewById(pageId).model;
      var item = $(_.template(self.templates.step, {
          step_name: pageModel.getName(),
          step_num: index + 1,
          index: self.parentView.getPageIndexById(pageId),
          width: width
      }));
      $(table).append(item);
    });

    this.$el.append(table);
    this.$el.append(self.templates.page_title);
    return this;
  },
  switchPage: function(e){
    var index = 0;

    if(e && $(e.currentTarget).data()){
      index = $(e.currentTarget).data().index;
      if(typeof(index) !== "undefined"){
        this.parentView.goToPage(index, false);
      }
    }
  },

  activePageChange: function() {
    var self = this;
    self.render();
    self.$el.find('li').removeClass('active');

    var displayIndex = self.parentView.getDisplayIndex();
    var pageModel = self.parentView.pageViews[self.parentView.pageNum].model;
    var pageName = pageModel.getName();

    self.$el.find('li:eq(' + displayIndex + ')').addClass('active');

    if(pageName.length === 0){
      pageName = "Page " + (displayIndex + 1);
    }

    self.$el.find('.fh_appform_page_title').html(pageName);
  }

});
var ConfigView = Backbone.View.extend({
    templates: {

    },
    "_events": {
        "click #_viewLogsBtn": "viewLogs",
        "click #_clearLogsBtn": "clearLogs",
        "click #_sendLogsBtn": "sendLogs",
        "click #_closeViewBtn": "closeViewLogs",
        "click #fh_appform_show_deviceId": "showDeviceId",
        "click #logger": "toggleLogging"
    },
    toggleLogging: function() {
        var loggingEnabled = $fh.forms.config.getConfig().logger;
        loggingEnabled = !loggingEnabled;
        $fh.forms.config.set("logger", loggingEnabled);

        var loggingMessage = loggingEnabled ? "Logging Enabled" : "Logging Disabled";
        var checkedClass = loggingEnabled ? "active" : "";

        if (loggingEnabled) {
            this.$el.find('.choice_icon').addClass('icon-circle');
            this.$el.find('.choice_icon').removeClass('icon-circle-blank');
        } else {
            this.$el.find('.choice_icon').addClass('icon-circle-blank');
            this.$el.find('.choice_icon').removeClass('icon-circle');
        }

        this.$el.find('#logger_message').html(loggingMessage);
    },
    showDeviceId: function() {
        this.$el.find("#logsModalLabelBody").html("Device Id: " + $fh.forms.config.getDeviceId());
        this.$el.find("#logsModal").modal();
    },
    viewLogs: function() {
        var logs = this.getPolishedLogs();
        this.$el.find("#logsModalLabelBody").html(logs);
        this.$el.find("#logsModal").modal();
    },
    getPolishedLogs: function() {
        var arr = [];
        var logs = $fh.forms.log.getLogs();
        var patterns = [{
            reg: /^.+\sERROR\s.*/,
            classStyle: "list-group-item-danger"
        }, {
            reg: /^.+\sWARNING\s.*/,
            classStyle: "list-group-item-warning"
        }, {
            reg: /^.+\sLOG\s.*/,
            classStyle: "list-group-item-info"
        }, {
            reg: /^.+\sDEBUG\s.*/,
            classStyle: "list-group-item-success"
        }, {
            reg: /^.+\sUNKNOWN\s.*/,
            classStyle: "list-group-item-warning"
        }];


        var listStr = "";

        for (var i = 0; i < logs.length; i++) {
            var log = logs[i];
            for (var j = 0; j < patterns.length; j++) {
                var p = patterns[j];
                if (p.reg.test(log)) {
                    listStr += _.template($('#temp_config_log_item').html(), {
                        logClass: p.classStyle,
                        message: log
                    });
                    break;
                }
            }
        }
        var listGroup = _.template($('#temp_config_log').html(), {
            listStr: listStr
        });
        return listGroup;
    },

    clearLogs: function() {
        var self = this;
        $fh.forms.log.clearLogs(function() {
            self.$el.find("#_logViewDiv").html("");
            alert("Logs cleared.");
        });
    },
    sendLogs: function() {
        $fh.forms.log.sendLogs(function(err) {
            if (err) {
                alert(err);
            } else {
                alert("Log has been sent to:" + $fh.forms.config.get("log_email"));
            }
        });
    },
    closeViewLogs: function() {
        this.$el.find("#_logsViewPanel").hide();
    },
    initialize: function(options) {
        this.options = options;
        this.events = _.extend({}, this._events, this.events);
    },
    render: function() {
        this.$el.empty();

        this.$el.append("<div id='fh_appform_templates' style='display:none;'>" + FormTemplates + "</div>");
        //Append Logo
        this.$el.append(_.template(this.$el.find('#forms-logo-sdk').html()));
        var props = $fh.forms.config.getConfig();

        var cameraSettingsHtml = _.template(this.$el.find('#temp_config_camera').html(), props);
        var submissionSettingsHtml = _.template(this.$el.find('#temp_config_submissions').html(), props);
        var debuggingSettingsHtml = _.template(this.$el.find('#temp_config_debugging').html(), props);
        var miscSettingsHtml = _.template(this.$el.find('#temp_config_misc').html(), props);

        this.$el.append(miscSettingsHtml);
        this.$el.append(debuggingSettingsHtml);
        this.$el.append(cameraSettingsHtml);
        this.$el.append(submissionSettingsHtml);

        this.$el.find('#sent_items_to_keep_list').tagsinput('items');
        this.$el.find('.bootstrap-tagsinput').addClass('fh_appform_field_input');

        this.$el.find('.panel-heading').click(function(e) {
            console.log(e);

            var field = $(e.currentTarget).data().field;
            $('#' + field).slideToggle();
            $('#' + field + '-icon').toggleClass('icon-chevron-sign-up');
            $('#' + field + '-icon').toggleClass('icon-chevron-sign-down');
        });


        if (!$fh.forms.config.editAllowed()) {
            //Hide sections
            this.$el.find('#camera-settings').hide();
            this.$el.find('#submission-settings').hide();

            //Hide fields
            this.$el.find('#log_level_div').hide();
            this.$el.find('#log_email_div').hide();
            this.$el.find('#log_line_limit_div').hide();
            this.$el.find('#logger_wrapper_div').hide();
        }
        return this;
    },
    save: function(cb) {
        $fh.forms.log.l("Saving config");
        var inputs = this.$el.find("input,select,textarea,button[data-key='logger']");

        if ($fh.forms.config.editAllowed()) {
            inputs.each(function() {
                var key = $(this).data().key;
                var val = $(this).val();

                if (key === "logger") {
                    if ($(this).hasClass("active")) {
                        val = true;
                    } else {
                        val = false;
                    }
                }

                if (key === "sent_items_to_keep_list") {
                    //Parse the strings
                    if (val && val.filter) {
                        val = val.filter(function(selectValue) {
                            selectValue = parseInt(selectValue);
                            return !isNaN(selectValue);
                        });

                        val = _.map(val, function(value) {
                            return parseInt(value);
                        });

                        val.sort(function(a, b) {
                            return a - b;
                        });
                    } else {
                        return;
                    }

                }

                $fh.forms.config.set(key, val);
            });

            $fh.forms.config.saveConfig(cb);
        } else {
            alert("Editing config not permitted.");
        }
    }
});
if (typeof $fh === 'undefined') {
  $fh = {};
}
if (!$fh.forms) {
  $fh.forms = {};
}
$fh.forms.renderForm = function (params, cb) {
  var parentEl = params.container;
  var formId = params.formId;
  var fromRemote = params.fromRemote || false;
  var type = params.type || 'backbone';
  var form = new FormView({ parentEl: parentEl });
  form.loadForm(params, function () {
    if (type === 'backbone') {
      cb(null, form);
    } else if (type === 'html') {
      //TODO convert backbone view to html.
      cb(null, form);
    }
  });
};
/**
 *
 * @param params Object {"formId":String,"rawMode":Boolean,"rawMode":Boolean}
 * no io being done so no need for callback
 */
$fh.forms.renderFormFromJSON = function (params) {
  if (!params){
    throw new Error('params cannot be empty');
  }
  if (!params.rawData) {
    throw new Error('raw json data must be passed in the params.rawData');
  }
  if (!params.container) {
    throw new Error('a container element must be passed in the params.container');
  }

  params.formId = new Date().getTime();
  params.rawMode = true;
  var formView = new FormView({ parentEl: params.container });
  formView.loadForm(params, function (err) {
    if (err) {
      console.error('error loading form for renderFormFromJSON ', err);
    }
    formView.render();
  });
};
$fh.forms.renderFormList = function (params, cb) {
  var fromRemote = params.fromRemote || false;
  var parentEl = params.parentEl;
  $fh.forms.getForms({ fromRemote: fromRemote }, function (err, forms) {
    formListView = new FormListView({
      'model': forms,
      'parentEl': parentEl
    });
    formListView.render();
  });
};
$fh.forms.backbone = {};
$fh.forms.backbone.FormView = FormView;
$fh.forms.backbone.ConfigView=ConfigView;


//end  module;

//this is partial file which define the end of closure
})(window || module.exports);