(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$GuessWho$LobbyMain = {$: 'LobbyMain'};
var $author$project$GuessWho$blank_model = function (info) {
	return {
		game: $elm$core$Maybe$Nothing,
		global_state: $elm$core$Maybe$Nothing,
		lobby: {screen: $author$project$GuessWho$LobbyMain},
		my_id: info.id
	};
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$GuessWho$decode_flags = A2(
	$elm$json$Json$Decode$map,
	function (id) {
		return {id: id};
	},
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string));
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$GuessWho$init = function (flags) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$GuessWho$decode_flags, flags);
	if (_v0.$ === 'Ok') {
		var info = _v0.a;
		return _Utils_Tuple2(
			$author$project$GuessWho$blank_model(info),
			$elm$core$Platform$Cmd$none);
	} else {
		return _Utils_Tuple2(
			$author$project$GuessWho$blank_model(
				{id: ''}),
			$elm$core$Platform$Cmd$none);
	}
};
var $author$project$Multiplayer$WebsocketMessage = function (a) {
	return {$: 'WebsocketMessage', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$GuessWho$InCharge = {$: 'InCharge'};
var $author$project$Multiplayer$LeaveGame = {$: 'LeaveGame'};
var $author$project$GuessWho$SetRound = function (a) {
	return {$: 'SetRound', a: a};
};
var $author$project$GuessWho$ShowChosenCards = function (a) {
	return {$: 'ShowChosenCards', a: a};
};
var $author$project$GuessWho$StartShufflingCards = {$: 'StartShufflingCards'};
var $author$project$GuessWho$WaitingToStart = {$: 'WaitingToStart'};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Multiplayer$GameMsg = function (a) {
	return {$: 'GameMsg', a: a};
};
var $author$project$Multiplayer$OtherGameMsg = function (a) {
	return {$: 'OtherGameMsg', a: a};
};
var $author$project$Multiplayer$game_message = A2($elm$core$Basics$composeR, $author$project$Multiplayer$OtherGameMsg, $author$project$Multiplayer$GameMsg);
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$GuessWho$is_in_progress = function (game) {
	var _v0 = game.stage;
	if (_v0.$ === 'InProgress') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$GuessWho$Playing = {$: 'Playing'};
var $author$project$GuessWho$is_player = function (p) {
	return _Utils_eq(p.role, $author$project$GuessWho$Playing);
};
var $author$project$GuessWho$playing_players = function (game) {
	return A2($elm$core$List$filter, $author$project$GuessWho$is_player, game.players);
};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Mathematicians$round_definitions = A2(
	$elm$core$List$map,
	$elm$core$Array$fromList,
	_List_fromArray(
		[
			_List_fromArray(
			[
				{description: 'Maryna Viazovska (born 1984) is a Ukrainian mathematician and only the second woman in history to receive the Fields Medal, the highest award in mathematics.', full_name: 'Maryna Viazovska', image: 'viazovska.jpg', short_name: 'Viazovska', url: 'https://en.wikipedia.org/wiki/Maryna_Viazovska'},
				{description: 'Artur Avila (born 1979) is a Brazilian mathematician, and the first Latin-American to receive the Fields medal. He made numerous discoveries related to chaos theory and dynamical systems.', full_name: 'Artur Avila', image: 'avila.jpg', short_name: 'Avila', url: 'https://en.wikipedia.org/wiki/Artur_Avila'},
				{description: 'Maryam Mirzakhani (مریم میرزاخانی‎, 1977 – 2017) was an Iranian mathematician and professor at Stanford University. She was the first woman to receive the Fields Medal, the highest award in mathematics.', full_name: 'Maryam Mirzakhani', image: 'mirzakhani.jpg', short_name: 'Mirzakhani', url: 'https://en.wikipedia.org/wiki/Maryam_Mirzakhani'},
				{description: 'Born in Adelaide, Australia, Terence Tao (born 17 July) is sometimes called the “Mozart of mathematics”. When he was 13, he became the youngest ever winner of the International Mathematical Olympiad, and when he was 24, he became the youngest tenured professor at the University of California, Los Angeles.', full_name: 'Terence Tao', image: 'tao.jpg', short_name: 'Tao', url: 'https://en.wikipedia.org/wiki/Terence_Tao'},
				{description: 'In 2003, the Russian mathematician Grigori Perelman (Григо́рий Перельма́нborn, born 1966) proved the Poincaré Conjecture, which, until then, was one of the most famous unsolved problems in mathematics.', full_name: 'Grigori Perelman', image: 'perelman.jpg', short_name: 'Perelman', url: 'https://en.wikipedia.org/wiki/Grigori_Perelman'},
				{description: 'Yitang Zhang (张益唐, born 1955) was born in China and is now a professor of mathematics at the University of California.', full_name: 'Yitang Zhang', image: 'zhang.jpg', short_name: 'Zhang', url: 'https://en.wikipedia.org/wiki/Yitang_Zhang'},
				{description: 'Ingrid Daubechies (born 1954) is a Belgian physicist and mathematician. She was the first female president of the International Mathematical Union (IMU).', full_name: 'Ingrid Daubechies', image: 'daubechies.jpg', short_name: 'Daubechies', url: 'https://en.wikipedia.org/wiki/Ingrid_Daubechies'},
				{description: 'Jean Bourgain (1954 – 2018) was a Belgian mathematician who studied topics like Banach spaces, harmonic analysis, ergodic theory and non-linear partial differential equations. He received the Fields medal in 1994.', full_name: 'Jean Bourgain', image: 'bourgain.jpg', short_name: 'Bourgain', url: 'https://en.wikipedia.org/wiki/Jean_Bourgain'},
				{description: 'The British mathematician Sir Andrew Wiles (born 1953) is best known for proving Fermat’s Last Theorem, which, until then, was one of the most famous unsolved problems in mathematics.', full_name: 'Sir Andrew Wiles', image: 'wiles.jpg', short_name: 'Wiles', url: 'https://en.wikipedia.org/wiki/Andrew_Wiles'},
				{description: 'Adi Shamir (born 1952) is an Israeli mathematician and cryptographer. Together with Ron Rivest and Len Adleman, he invented the RSA algorithm, which uses the difficulty of factoring prime numbers to encode secret messages.', full_name: 'Adi Shamir', image: 'shamir.jpg', short_name: 'Shamir', url: 'https://en.wikipedia.org/wiki/Adi_Shamir'},
				{description: 'Shing-Tung Yau (丘成桐, born 1949) is an American mathematician, originally from Shantou in China. He studied partial differential equations and geometric analysis, and his work has many applications – including in general relativity and string theory.', full_name: 'Shing-Tung Yau', image: 'yau.jpg', short_name: 'Yau', url: 'https://en.wikipedia.org/wiki/Shing-Tung_Yau'},
				{description: 'Yuri Matiyasevich (Ю́рий Матиясе́вич, born 1947) is a Russian mathematician and computer scientist. In 1970, he proved that Hilbert’s tenth problem, one of the challenges posed by David Hilbert in 1900, has no solution (building upon the work of Martin Davis, Hilary Putnam and Julia Robinson).', full_name: 'Yuri Matiyasevich', image: 'matiyasevich.jpg', short_name: 'Matiyasevich', url: 'https://en.wikipedia.org/wiki/Yuri_Matiyasevich'},
				{description: 'William Paul Thurston (1946 – 2012) was an American mathematician and a pioneer in the fields of topology, manifolds and geometric group theory.', full_name: 'William Paul Thurston', image: 'thurston.jpg', short_name: 'Thurston', url: 'https://en.wikipedia.org/wiki/William_Thurston'},
				{description: 'Karen Uhlenbeck (born 1942) is an American mathematician, professor emeritus at the University of Texas, and distinguished visiting professor at Princeton University.', full_name: 'Karen Uhlenbeck', image: 'uhlenbeck.jpg', short_name: 'Uhlenbeck', url: 'https://en.wikipedia.org/wiki/Karen_Uhlenbeck'},
				{description: 'John Horton Conway (1937 – 2020) was a British mathematician who worked at Cambridge and Princeton University. He was a fellow of the Royal Society, and the first recipient of the Pólya Prize.', full_name: 'John Horton Conway', image: 'conway.jpg', short_name: 'Conway', url: 'https://en.wikipedia.org/wiki/John_Horton_Conway'},
				{description: 'Robert Langlands (born 1936) is an American-Canadian mathematician. He studied at Yale University, and later returned there as a professor. Now he occupies Albert Einstein’s old office as an emeritus professor at Princeton University.', full_name: 'Robert Langlands', image: 'langlands.jpg', short_name: 'Langlands', url: 'https://en.wikipedia.org/wiki/Robert_Langlands'},
				{description: 'Paul Joseph Cohen (1934 – 2007) was an American mathematician who proved the continuum hypothesis, and that the axiom of choice is independent from the other Zermelo–Fraenkel axioms of set theory. He received the Fields medal for his work.', full_name: 'Paul Joseph Cohen', image: 'cohen.jpg', short_name: 'Cohen', url: 'https://en.wikipedia.org/wiki/Paul_Cohen'},
				{description: 'Annie Easley (1933 – 2011) was an American mathematician and computer scientist. She was one of the first African-Americans to work at NASA as a “computer”.', full_name: 'Annie Easley', image: 'easley.jpg', short_name: 'Easley', url: 'https://en.wikipedia.org/wiki/Annie_Easley'},
				{description: 'Kenneth Appel (1932 – 2013) was an American mathematician, known for his proof of the Four Colour Theorem with Wolfgang Haken.', full_name: 'Kenneth Appel', image: 'appel.jpg', short_name: 'Appel', url: 'https://en.wikipedia.org/wiki/Kenneth_Appel'},
				{description: 'Sir Roger Penrose (born 1931) is a British mathematician and physicist who is known for his groundbreaking work in general relativity and cosmology. He also discovered Penrose Tilings: self-similar, non-periodic tessellations using only two different tiles.', full_name: 'Sir Roger Penrose', image: 'penrose.jpg', short_name: 'Penrose', url: 'https://en.wikipedia.org/wiki/Roger_Penrose'},
				{description: 'John Forbes Nash (1928 – 2015) was an American mathematician who worked on game theory, differential geometry and partial differential equations. He showed how mathematics can explain the decision-making in complex, real-life systems – including economics and the military.', full_name: 'John Forbes Nash', image: 'nash.jpg', short_name: 'Nash', url: 'https://en.wikipedia.org/wiki/John_Forbes_Nash_Jr.'},
				{description: 'The French mathematician Alexander Grothendieck (1928 – 2014) was one of the key figures in the development of algebraic geometry. He extended the scope of the field to apply to many new problems in mathematics, including, eventually, Fermat’s last theorem.', full_name: 'Alexander Grothendieck', image: 'grothendieck.jpg', short_name: 'Grothendieck', url: 'https://en.wikipedia.org/wiki/Alexander_Grothendieck'},
				{description: 'Jean-Pierre Serre (born 1926) is a French mathematician who helped shape the fields of topology, number theory and algebraic geometry. He is the first person to receive the Fields medal, the Abel Prize and the Wolf Prize – the three highest awards in mathematics.', full_name: 'Jean-Pierre Serre', image: 'serre.jpg', short_name: 'Serre', url: 'https://en.wikipedia.org/wiki/Jean-Pierre_Serre'},
				{description: 'The mathematician Benoit Mandelbrot was born in Poland, grew up in France, and eventually moved to the United States. He was one of the pioneers of fractal geometry, and particularly interested in how “roughness” and “chaos” appear in the real world (e.g. clouds or coastlines)', full_name: 'Benoit Mandelbrot', image: 'mandelbrot.jpg', short_name: 'Mandelbrot', url: 'https://en.wikipedia.org/wiki/Benoit_Mandelbrot'},
				{description: 'Ernest Wilkins (1923 – 2011) was an American engineer, nuclear scientist and mathematician. He attended the University of Chicago at the age of 13, becoming its youngest ever student.', full_name: 'Ernest Wilkins', image: 'wilkins.jpg', short_name: 'Wilkins', url: 'https://en.wikipedia.org/wiki/J._Ernest_Wilkins_Jr.'}
			]),
			_List_fromArray(
			[
				{description: 'Julia Robinson (1919 – 1985) was an American mathematician. She is the first female mathematician elected to the US National Academy of Sciences, and was the first female president of the American Mathematical Society.', full_name: 'Julia Robinson', image: 'robinson.jpg', short_name: 'Robinson', url: 'https://en.wikipedia.org/wiki/Julia_Robinson'},
				{description: 'David Blackwell (1919 – 2010) was an American statistician and mathematician. He worked on game theory, probability theory, information theory and dynamic programming, and wrote one of the first textbooks on Bayesian statistics.', full_name: 'David Blackwell', image: 'blackwell.jpg', short_name: 'Blackwell', url: 'https://en.wikipedia.org/wiki/David_Blackwell'},
				{description: 'Katherine Johnson (1918 – 2020) was an African-American mathematician. While working at NASA, Johnson calculated the orbits taken by American astronauts – including Alan Shepard, the first American in space, the Apollo Moon landing program, and even the Space Shuttle.', full_name: 'Katherine Johnson', image: 'johnson.jpg', short_name: 'Johnson', url: 'https://en.wikipedia.org/wiki/Katherine_Johnson'},
				{description: 'Edward Lorenz (1917 – 2008) was an American mathematician and meteorologist. He pioneered chaos theory, discovered strange attractors, and coined the term “butterfly effect”.', full_name: 'Edward Lorenz', image: 'lorenz.jpg', short_name: 'Lorenz', url: 'https://en.wikipedia.org/wiki/Edward_Norton_Lorenz'},
				{description: 'Claude Shannon (1916 – 2001) was an American mathematician and electrical engineer, remembered as the “father of information theory”. He worked on cryptography, including codebreaking for national defence during World War II, but he was also interested in juggling, unicycling and chess.', full_name: 'Claude Shannon', image: 'shannon.jpg', short_name: 'Shannon', url: 'https://en.wikipedia.org/wiki/Claude_Shannon'},
				{description: 'Martin Gardner (1914 – 2010) used stories, games, puzzles and magic tricks to popularise mathematics and make it accessible to a wider audience. The American science author wrote or edited more than 100 books, and is one of the most important magicians and puzzle creators of the twentieth century.', full_name: 'Martin Gardner', image: 'gardner.jpg', short_name: 'Gardner', url: 'https://en.wikipedia.org/wiki/Martin_Gardner'},
				{description: 'Paul Erdős (1913 – 1996) was one of the most productive mathematicians in history. Born in Hungary, he solved countless problems in graph theory, number theory, combinatorics, analysis, probability, and other parts of mathematics.', full_name: 'Paul Erdős', image: 'erdos.jpg', short_name: 'Erdős', url: 'https://en.wikipedia.org/wiki/Paul_Erd%C5%91s'},
				{description: 'Alan Turing (1912 – 1954) was an English mathematician and is often called the “father of computer science”.', full_name: 'Alan Turing', image: 'turing.jpg', short_name: 'Turing', url: 'https://en.wikipedia.org/wiki/Alan_Turing'},
				{description: 'Shiing-Shen Chern (1911 – 2004) was a Chinese-American mathematician and poet. He is the father of modern differential geometry. His work on geometry, topology, and knot theory even has applications in string theory and quantum mechanics.', full_name: 'Shiing-Shen Chern', image: 'chern.jpg', short_name: 'Chern', url: 'https://en.wikipedia.org/wiki/Shiing-Shen_Chern'},
				{description: 'Stanisław Ulam (1909 – 1984) was a Polish-American mathematician. He played an important part in the American Manhattan Project that developed the first nuclear weapons. He also worked on rocket propulsion using nuclear pulses, and developed the Monte Carlo method – an important concept in statistics.', full_name: 'Stanisław Ulam', image: 'ulam.jpg', short_name: 'Ulam', url: 'https://en.wikipedia.org/wiki/Stanislaw_Ulam'},
				{description: 'André Weil (1906 – 1998) was one of the most influential French mathematicians in the 20th century.', full_name: 'André Weil', image: 'weil.jpg', short_name: 'Weil', url: 'https://en.wikipedia.org/wiki/Andr%C3%A9_Weil'},
				{description: 'Kurt Gödel (1906 – 1978) was an Austrian mathematician who later immigrated to America, and is considered one of the greatest logicians in history.', full_name: 'Kurt Gödel', image: 'godel.jpg', short_name: 'Gödel', url: 'https://en.wikipedia.org/wiki/Kurt_G%C3%B6del'},
				{description: 'John von Neumann (1903 – 1957) was a Hungarian-American mathematician, physicist and computer scientist. He made important contributions to pure mathematics, was a pioneer of quantum mechanics, and developed concepts like game theory, cellular automata, self-replicating machines, and linear programming.', full_name: 'John von Neumann', image: 'neumann.jpg', short_name: 'von Neumann', url: 'https://en.wikipedia.org/wiki/John_von_Neumann'},
				{description: 'Andrey Kolmogorov (Андре́й Колмого́ров, 1903 – 1987) was a Soviet mathematician. He made significant contributions to probability theory, stochastic processes and Markov chains. He also studied topology, logic, mechanics, number theory, information theory and complexity theory.', full_name: 'Andrey Kolmogorov', image: 'kolmogorov.jpg', short_name: 'Kolmogorov', url: 'https://en.wikipedia.org/wiki/Andrey_Kolmogorov'},
				{description: 'Mary Lucy Cartwright (1900 – 1998) was a British mathematician and one of the pioneers of Chaos theory. Together with Littlewood, she discovered curious solutions to a problem: an example of what we now call the Butterfly effect.', full_name: 'Mary Lucy Cartwright', image: 'cartwright.jpg', short_name: 'Cartwright', url: 'https://en.wikipedia.org/wiki/Mary_Cartwright'},
				{description: 'Maurits Cornelis Escher (1898 – 1972) was a Dutch artist who created sketches, woodcuts and lithographs of mathematically inspired objects and shapes: including polyhedra, tessellations and impossible shapes.', full_name: 'Maurits Cornelis Escher', image: 'escher.jpg', short_name: 'Escher', url: 'https://en.wikipedia.org/wiki/M._C._Escher'},
				{description: 'Elbert Cox (1895 – 1969) was the first African-American mathematician to receive a PhD. Universities in England and Germany refused to accept his thesis at the time, but Japan’s Tohoku Imperial University did.', full_name: 'Elbert Cox', image: 'cox.jpg', short_name: 'Cox', url: 'https://en.wikipedia.org/wiki/Elbert_Frank_Cox'},
				{description: 'Srinivasa Ramanujan (1887 – 1920) grew up in India, where he received very little formal education in mathematics. Yet, he managed to develop new ideas in complete isolation, while working as a clerk in a small shop.', full_name: 'Srinivasa Ramanujan', image: 'ramanujan.jpg', short_name: 'Ramanujan', url: 'https://en.wikipedia.org/wiki/Srinivasa_Ramanujan'},
				{description: 'Amalie Emmy Noether (1882 – 1935) was a German mathematician who made important discoveries in abstract algebra and theoretical physics, including the connection between symmetry and conservation laws.', full_name: 'Amalie Emmy Noether', image: 'noether.jpg', short_name: 'Noether', url: 'https://en.wikipedia.org/wiki/Emmy_Noether'},
				{description: 'Albert Einstein (1879 – 1955) was a German physicist, and one of the most influential scientists in history. He received the Nobel Prize for physics and TIME magazine called him the person of the 20th century.', full_name: 'Albert Einstein', image: 'einstein.jpg', short_name: 'Einstein', url: 'https://en.wikipedia.org/wiki/Albert_Einstein'},
				{description: 'G.H. Hardy (1877 – 1947) was a leading English pure mathematician. Together with John Littlewood, he made important discoveries in analysis and number theory, including the distribution of prime numbers.', full_name: 'G.H. Hardy', image: 'hardy.jpg', short_name: 'Hardy', url: 'https://en.wikipedia.org/wiki/G._H._Hardy'},
				{description: 'Bertrand Russell (1872 – 1970) was a British philosopher, mathematician and author. He is widely considered to be one of the most important logicians of the 20th century.', full_name: 'Bertrand Russell', image: 'russell.jpg', short_name: 'Russell', url: 'https://en.wikipedia.org/wiki/Bertrand_Russell'},
				{description: 'David Hilbert (1862 – 1943) was one of the most influential mathematicians of the 20th century. He worked on almost every area of mathematics, and was particularly interested in building a formal, logical foundation for maths.', full_name: 'David Hilbert', image: 'hilbert.jpg', short_name: 'Hilbert', url: 'https://en.wikipedia.org/wiki/David_Hilbert'},
				{description: 'The Italian mathematician Giuseppe Peano (1858 – 1932) published over 200 books and papers about logic and mathematics. He formulated the Peano axioms, which became the basis for rigorous algebra and analysis, developed the notation for logic and set theory, constructed continuous, space-filling curves (Peano curves), and worked on the method of proof by induction.', full_name: 'Giuseppe Peano', image: 'peano.jpg', short_name: 'Peano', url: 'https://en.wikipedia.org/wiki/Giuseppe_Peano'},
				{description: 'The French mathematician Henri Poincaré (1854 – 1912) is often described as the last universalist, meaning that he worked in every field of mathematics known during his lifetime.', full_name: 'Henri Poincaré', image: 'poincare.jpg', short_name: 'Poincaré', url: 'https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9'}
			]),
			_List_fromArray(
			[
				{description: 'Sofia Kovalevskaya (Софья Васильевна Ковалевская 1850 – 1891) was a Russian mathematician, and the first woman to earn a modern doctorate in mathematics. She was also the first woman to hold full professorship in Northern Europe, and is among the first women to be an editor of a scientific journal.', full_name: 'Sofia Kovalevskaya', image: 'kovalevskaya.jpg', short_name: 'Kovalevskaya', url: 'https://en.wikipedia.org/wiki/Sofya_Kovalevskaya'},
				{description: 'The German mathematician Georg Cantor (1845 – 1918) was the inventor of set theory, and a pioneer in our understanding of infinity. For most of his life, Cantor\'s discoveries were fiercely opposed by his colleagues.', full_name: 'Georg Cantor', image: 'cantor.jpg', short_name: 'Cantor', url: 'https://en.wikipedia.org/wiki/Georg_Cantor'},
				{description: 'The Norwegian mathematician Marius Sophus Lie (1842 – 1899) made significant advances in the study of continuous transformation groups – now called Lie groups. He also worked on differential equations and non-Euclidean geometry.', full_name: 'Marius Sophus Lie', image: 'lie.jpg', short_name: 'Lie', url: 'https://en.wikipedia.org/wiki/Sophus_Lie'},
				{description: 'Charles Lutwidge Dodgson (1832 – 1898) is best know under his pen name Lewis Carroll, as the author of Alice’s Adventures in Wonderland and its sequel Through the Looking-Glass.', full_name: 'Charles Lutwidge Dodgson', image: 'carroll.jpg', short_name: 'Carroll', url: 'https://en.wikipedia.org/wiki/Lewis_Carroll'},
				{description: 'Richard Dedekind (1831 – 1916) was a German mathematician and one of the students of Gauss. He developed many concepts in set theory, and invented Dedekind cuts as the formal definition of real numbers.', full_name: 'Richard Dedekind', image: 'dedekind.jpg', short_name: 'Dedekind', url: 'https://en.wikipedia.org/wiki/Richard_Dedekind'},
				{description: 'Bernhard Riemann (1826 – 1866) was a German mathematician working in the fields of analysis and number theory. He came up with the first rigorous definition of integration, studied differential geometry which laid the foundation for general relativity, and made groundbreaking discoveries regarding the distribution of prime numbers.', full_name: 'Bernhard Riemann', image: 'riemann.jpg', short_name: 'Riemann', url: 'https://en.wikipedia.org/wiki/Bernhard_Riemann'},
				{description: 'Arthur Cayley (1821 – 1895) was a British mathematician and lawyer. He was one of the pioneers of group theory, first proposed the modern definition of a “group”, and generalised them to encompass many more applications in mathematics.', full_name: 'Arthur Cayley', image: 'cayley.jpg', short_name: 'Cayley', url: 'https://en.wikipedia.org/wiki/Arthur_Cayley'},
				{description: 'Florence Nightingale (1820 – 1910) was an English nurse and statistician. During the Crimean War, she nursed wounded British soldiers, and later founded the first training school for nurses. As the “The Lady with the Lamp”, she became a cultural icon, and new nurses in the US still take the Nightingale pledge.', full_name: 'Florence Nightingale', image: 'nightingale.jpg', short_name: 'Nightingale', url: 'https://en.wikipedia.org/wiki/Florence_Nightingale'},
				{description: 'Ada Lovelace (1815 – 1852) was an English writer and mathematician. Together with Charles Babbage, she worked on the Analytical Engine an early, mechanical computer. She also wrote the first algorithm to run on such a machine (to calculate Bernoulli numbers), making her the first computer programmer in history.', full_name: 'Ada Lovelace', image: 'lovelace.jpg', short_name: 'Lovelace', url: 'https://en.wikipedia.org/wiki/Ada_Lovelace'},
				{description: 'George Boole (1815 – 1864) was an English mathematician. As a child, he taught himself Latin, Greek and mathematics, hoping to escape his lower class life. He created Boolean algebra, which uses operators like AND, OR and NOT (rather than addition or multiplication) and can be used when working with sets.', full_name: 'George Boole', image: 'boole.jpg', short_name: 'Boole', url: 'https://en.wikipedia.org/wiki/George_Boole'},
				{description: 'James Joseph Sylvester (1814 – 1897) was an English mathematician. He contributed to matrix theory, number theory, partition theory, and combinatorics. Together with Arthur Cayley, he cofounded invariant theory.', full_name: 'James Joseph Sylvester', image: 'sylvester.jpg', short_name: 'Sylvester', url: 'https://en.wikipedia.org/wiki/James_Joseph_Sylvester'},
				{description: 'The French mathematician Évariste Galois (1811 – 1832) had a short and tragic life, yet he invented two entirely new fields of mathematics: Group theory and Galois theory.', full_name: 'Évariste Galois', image: 'galois.jpg', short_name: 'Galois', url: 'https://en.wikipedia.org/wiki/%C3%89variste_Galois'},
				{description: 'Carl Jacobi (1804 – 1851) was a German mathematician. He worked on analysis, differential equations and number theory, and was one of the pioneers in the study of elliptic functions.', full_name: 'Carl Jacobi', image: 'jacobi.jpg', short_name: 'Jacobi', url: 'https://en.wikipedia.org/wiki/Carl_Gustav_Jacob_Jacobi'},
				{description: 'Augustus De Morgan (1806 – 1871) was a British mathematician and logician. He studied the geometric properies of complex numbers, formalised mathematical induction, suggested quaternions, and came up with new mathematical notation.', full_name: 'Augustus De Morgan', image: 'de-morgan.jpg', short_name: 'De Morgan', url: 'https://en.wikipedia.org/wiki/Augustus_De_Morgan'},
				{description: 'William Rowan Hamilton (1805 – 1865) was an Irish mathematician and child prodigy. He invented quaternions, the first example of a “non-commutative algebra”, which has important applications in mathematics, physics and computer science.', full_name: 'William Rowan Hamilton', image: 'hamilton.jpg', short_name: 'Hamilton', url: 'https://en.wikipedia.org/wiki/William_Rowan_Hamilton'},
				{description: 'János Bolyai (1802 – 1860) was a Hungarian mathematician, and one of the founders of non-Euclidean geometry – a geometry in which Euclid’s fifth axiom about parallel lines does not hold. This was a significant breakthrough in mathematics.', full_name: 'János Bolyai', image: 'bolyai.jpg', short_name: 'Bolyai', url: 'https://en.wikipedia.org/wiki/J%C3%A1nos_Bolyai'},
				{description: 'Niels Henrik Abel (1802 – 1829) was an important Norwegian mathematician. Even though he died at the age of 26, he made groundbreaking contributions to a wide range of topics.', full_name: 'Niels Henrik Abel', image: 'abel.jpg', short_name: 'Abel', url: 'https://en.wikipedia.org/wiki/Niels_Henrik_Abel'},
				{description: 'Nikolai Lobachevsky (Никола́й Лобаче́вский, 1792 – 1856) was a Russian mathematician, and one of the founders of non-Euclidean geometry. He managed to show that you can build up a consistent type of geometry in which Euclid’s fifth axiom (about parallel lines) does not hold.', full_name: 'Nikolai Lobachevsky', image: 'lobachevsky.jpg', short_name: 'Lobachevsky', url: 'https://en.wikipedia.org/wiki/Nikolai_Lobachevsky'},
				{description: 'Charles Babbage (1791 – 1871) was a British mathematician, philosopher and engineer. He is often called the “father of the computer”, having invented the first mechanical computer (the Difference engine), and an improved, programmable version (the Analytical Engine).', full_name: 'Charles Babbage', image: 'babbage.jpg', short_name: 'Babbage', url: 'https://en.wikipedia.org/wiki/Charles_Babbage'},
				{description: 'August Ferdinand Möbius (1790 – 1868) was a German mathematician and astronomer. He studied under Carl Friedrich Gauss in Göttingen and is best known for his discovery of the Möbius strip: a non-orientable two-dimensional surface with only one side.', full_name: 'Möbius strip', image: 'mobius.jpg', short_name: 'Möbius', url: 'https://en.wikipedia.org/wiki/M%C3%B6bius_strip'},
				{description: 'Augustin-Louis Cauchy (1789 – 1857) was a French mathematician and physicist. He contributed to a wide range of areas in mathematics, and dozens of theorems are named after him.', full_name: 'Augustin-Louis Cauchy', image: 'cauchy.jpg', short_name: 'Cauchy', url: 'https://en.wikipedia.org/wiki/Augustin-Louis_Cauchy'},
				{description: 'Mary Somerville (1780 – 1872) was a Scottish scientist and writer. In her obituary, she was called the “Queen of Science”. Somerville first suggested the existence of Neptune and was also an excellent writer and communicator of science.', full_name: 'Mary Somerville', image: 'somerville.jpg', short_name: 'Somerville', url: 'https://en.wikipedia.org/wiki/Mary_Somerville'},
				{description: 'Carl Friedrich Gauss (1777 – 1855) was arguably the greatest mathematician in history. He made groundbreaking discoveries in just about every field of mathematics, from algebra and number theory to statistics, calculus, geometry, geology and astronomy.', full_name: 'Carl Friedrich Gauss', image: 'gauss.jpg', short_name: 'Gauss', url: 'https://en.wikipedia.org/wiki/Carl_Friedrich_Gauss'},
				{description: 'Marie-Sophie Germain (1776 – 1831) decided that she wanted to be a mathematician at the age of 13, after reading about Archimedes. Unfortunately, as a woman, she was faced with significant opposition. Her parents tried to prevent her from studying when she was young, and she never received a post at a university.', full_name: 'Marie-Sophie Germain', image: 'germain.jpg', short_name: 'Germain', url: 'https://en.wikipedia.org/wiki/Sophie_Germain'},
				{description: 'Wang Zhenyi (王贞仪, 1768 – 1797) was a Chinese scientist and mathematician living during the Qing dynasty. Despite laws and customs preventing women from receiving higher education, she studied subjects like astronomy, mathematics, geography and medicine.', full_name: 'Wang Zhenyi', image: 'zhenyi.jpg', short_name: 'Wang', url: 'https://en.wikipedia.org/wiki/Wang_Zhenyi'}
			]),
			_List_fromArray(
			[
				{description: 'Joseph Fourier (1768 – 1830) was a French mathematician, and a friend and advisor of Napoleon. In addition to his mathematical research, he is also credited with the discovery of the greenhouse effect.', full_name: 'Joseph Fourier', image: 'fourier.jpg', short_name: 'Fourier', url: 'https://en.wikipedia.org/wiki/Joseph_Fourier'},
				{description: 'Adrien-Marie Legendre (1752 – 1833) was an important French mathematician. He studied elliptic integrals and their usage in physics. He also found a simple proof that π is irrational, and the first proof that π2 is irrational.', full_name: 'Adrien-Marie Legendre', image: 'legendre.jpg', short_name: 'Legendre', url: 'https://en.wikipedia.org/wiki/Adrien-Marie_Legendre'},
				{description: 'Lorenzo Mascheroni (1750 – 1800) was an Italian mathematician and son of a wealthy landowner. He was ordained to priesthood at the age of 17, and taught rhetoric as well as physics and mathematics.', full_name: 'Lorenzo Mascheroni', image: 'mascheroni.jpg', short_name: 'Mascheroni', url: 'https://en.wikipedia.org/wiki/Lorenzo_Mascheroni'},
				{description: 'Pierre-Simon Laplace (1749 – 1827) was a French mathematician and scientist. He is sometimes called the “Newton of France”, because of his wide range of interests, and the enormous impact of his work.', full_name: 'Pierre-Simon Laplace', image: 'laplace.jpg', short_name: 'Laplace', url: 'https://en.wikipedia.org/wiki/Pierre-Simon_Laplace'},
				{description: 'Gaspard Monge (1746 – 1818) was a French mathematician. He is considered the father of differential geometry, having introduced the concept of lines of curvature on surfaces in three-dimensional space (e.g. on a sphere).', full_name: 'Gaspard Monge', image: 'monge.jpg', short_name: 'Monge', url: 'https://en.wikipedia.org/wiki/Gaspard_Monge'},
				{description: 'Joseph-Louis Lagrange (1736 – 1813) was an Italian mathematician who succeeded Leonard Euler as the director of the Academy of Sciences in Berlin.', full_name: 'Joseph-Louis Lagrange', image: 'lagrange.jpg', short_name: 'Lagrange', url: 'https://en.wikipedia.org/wiki/Joseph-Louis_Lagrange'},
				{description: 'Benjamin Banneker (1731 – 1806) was one of the first African-American mathematicians, and both his parents were former slaves. He was largely self-educated, worked as a surveyor, farmer, and scientist, and wrote several successful “almanacs” about astronomy.', full_name: 'Benjamin Banneker', image: 'banneker.jpg', short_name: 'Banneker', url: 'https://en.wikipedia.org/wiki/Benjamin_Banneker'},
				{description: 'Johann Lambert (1728 – 1777) was a Swiss mathematician, physicist, astronomer and philosopher. He was the first to prove that π is an irrational number, and he introduced hyperbolic trigonometric functions.', full_name: 'Johann Lambert', image: 'lambert.jpg', short_name: 'Lambert', url: 'https://en.wikipedia.org/wiki/Johann_Heinrich_Lambert'},
				{description: 'Maria Gaetana Agnesi (1718 – 1799) was an Italian mathematician, philosopher, theologian, and humanitarian. Agnesi was the first western woman to write a mathematics textbook. She was also the first woman to be appointed professor at a university.', full_name: 'Maria Gaetana Agnesi', image: 'agnesi.jpg', short_name: 'Agnesi', url: 'https://en.wikipedia.org/wiki/Maria_Gaetana_Agnesi'},
				{description: 'Leonhard Euler (1707 – 1783) was one the greatest mathematicians in history. His work spans all areas of mathematics, and he wrote 80 volumes of research.', full_name: 'Leonhard Euler', image: 'euler.jpg', short_name: 'Euler', url: 'https://en.wikipedia.org/wiki/Leonhard_Euler'},
				{description: 'Émilie du Châtelet (1706 – 1749) was a French scientist and mathematician. As a women, she was often excluded from the scientific community, but she built friendships with renown scholars, and had a long affair with the philosopher Voltaire.', full_name: 'Émilie du Châtelet', image: 'chatelet.jpg', short_name: 'Du Châtelet', url: 'https://en.wikipedia.org/wiki/%C3%89milie_du_Ch%C3%A2telet'},
				{description: 'Jacob Bernoulli (1655 – 1705) was a Swiss mathematician, and one of the many important scientists in the Bernoulli family. In fact, he had a deep academic rivalry with several of his brothers and sons.', full_name: 'Jacob Bernoulli', image: 'bernoulli-2.jpg', short_name: 'Bernoulli', url: 'https://en.wikipedia.org/wiki/Jacob_Bernoulli'},
				{description: 'Robert Simson (1687 – 1768) was a Scottish mathematician who studied ancient Greek geometers. He studied at the University of Glasgow, and later returned as a professor.', full_name: 'Robert Simson', image: 'simson.jpg', short_name: 'Simson', url: 'https://en.wikipedia.org/wiki/Robert_Simson'},
				{description: 'Abraham de Moivre (1667 – 1754) was a French mathematician who worked in probability and analytic geometry. He is most remembered for de Moivre’s formula, which links trigonometry and complex numbers.', full_name: 'Abraham de Moivre', image: 'de-moivre.jpg', short_name: 'De Moivre', url: 'https://en.wikipedia.org/wiki/Abraham_de_Moivre'},
				{description: 'Jacob Bernoulli (1655 – 1705) was a Swiss mathematician, and one of the many important scientists in the Bernoulli family. In fact, he had a deep academic rivalry with several of his brothers and sons.', full_name: 'Jacob Bernoulli', image: 'bernoulli-1.jpg', short_name: 'Bernoulli', url: 'https://en.wikipedia.org/wiki/Jacob_Bernoulli'},
				{description: 'Gottfried Wilhelm Leibniz (1646 – 1716) was a German mathematician and philosopher. Among many other achievements, he was one of the inventors of calculus, and created some of the first mechanical calculators.', full_name: 'Gottfried Wilhelm Leibniz', image: 'leibniz.jpg', short_name: 'Leibniz', url: 'https://en.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz'},
				{description: 'Seki Takakazu (関 孝和, 1642 – 1708) was an important Japanese mathematician and writer. He created a new algebraic notation system and studied Diophantine equations. He also developed on infinitesimal calculus – independently of Leibniz and Newton in Europe.', full_name: 'Seki Takakazu', image: 'seki.jpg', short_name: 'Seki', url: 'https://en.wikipedia.org/wiki/Seki_Takakazu'},
				{description: 'Sir Isaac Newton (1642 – 1726) was an English physicist, mathematician, and astronomer, and one of the most influential scientists of all time. He was a professor at Cambridge University, and president of the Royal Society in London.', full_name: 'Sir Isaac Newton', image: 'newton.jpg', short_name: 'Newton', url: 'https://en.wikipedia.org/wiki/Isaac_Newton'},
				{description: 'Blaise Pascal (1623 – 1662) was a French mathematician, physicist and philosopher. He invented some of the first mechanical calculators, as well as working on projective geometry, probability and the physics of the vacuum.', full_name: 'Blaise Pascal', image: 'pascal.jpg', short_name: 'Pascal', url: 'https://en.wikipedia.org/wiki/Blaise_Pascal'},
				{description: 'The English mathematician John Wallis (1616 – 1703) contributed to the development of calculus, invented the number line and the symbol ∞ for infinity, and served as chief cryptographer for Parliament and the royal court.', full_name: 'John Wallis', image: 'wallis.jpg', short_name: 'Wallis', url: 'https://en.wikipedia.org/wiki/John_Wallis'},
				{description: 'Pierre de Fermat (1607 – 1665) was a French mathematician and lawyer. He was an early pioneer of calculus, as well as working in number theory, probability, geometry and optics.', full_name: 'Pierre de Fermat', image: 'fermat.jpg', short_name: 'Fermat', url: 'https://en.wikipedia.org/wiki/Pierre_de_Fermat'},
				{description: 'Bonaventura Cavalieri (1598 – 1647) was an Italian mathematician and monk. He developed a precursor to infinitesimal calculus, and is remembered for Cavalieri’s principle to find the volume of solids in geometry.', full_name: 'Bonaventura Cavalieri', image: 'cavalieri.jpg', short_name: 'Cavalieri', url: 'https://en.wikipedia.org/wiki/Bonaventura_Cavalieri'},
				{description: 'René Descartes (1596 – 1650) was a French mathematician and philosopher, and one of the key figures in the Scientific Revolution. He refused to accept the authority of previous philosophers, and one of his best-known quotes is “I think, therefore I am”.', full_name: 'René Descartes', image: 'descartes.jpg', short_name: 'Descartes', url: 'https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes'},
				{description: 'Girard Desargues (1591 – 1661) was a French mathematician, engineer, and architect. He designed numerous buildings in Paris and Lyon, helped construct a dam, and invented a mechanism for raising water using epicycloids.', full_name: 'Girard Desargues', image: 'desargues.jpg', short_name: 'Desargues', url: 'https://en.wikipedia.org/wiki/Girard_Desargues'},
				{description: 'Marin Mersenne (1588 – 1648) was a French mathematician and priest. Because of the frequent exchanges with his contacts in the scientific world during the 17th century, he has been called the “the post-box of Europe”.', full_name: 'Marin Mersenne', image: 'mersenne.jpg', short_name: 'Mersenne', url: 'https://en.wikipedia.org/wiki/Marin_Mersenne'}
			]),
			_List_fromArray(
			[
				{description: 'Johannes Kepler (1571 – 1630) was a German astronomer and mathematician. He was the imperial mathematician in Prague, and he is best known for his three laws of planetary motion. Kepler also worked in optics, and invented an improved telescope for his observations.', full_name: 'Johannes Kepler', image: 'kepler.jpg', short_name: 'Kepler', url: 'https://en.wikipedia.org/wiki/Johannes_Kepler'},
				{description: 'Galileo Galilei (1564 – 1642) was an Italian astronomer, physicist and engineer. He used one of the first telescopes to make observations of the night sky, where he discovered the four largest moons of Jupiter, the phases of Venus, sunspots, and much more.', full_name: 'Galileo Galilei', image: 'galileo.jpg', short_name: 'Galileo', url: 'https://en.wikipedia.org/wiki/Galileo_Galilei'},
				{description: 'John Napier (1550 – 1617) was a Scottish mathematician, physicist, and astronomer. He invented logarithms, popularised the use of the decimal point, and created “Napier’s bones”, a manual calculating device that helped with multiplication and division.', full_name: 'John Napier', image: 'napier.jpg', short_name: 'Napier', url: 'https://en.wikipedia.org/wiki/John_Napier'},
				{description: 'Simon Stevin (1548 – 1620) was Flemish mathematician and engineer. He was one of the first people to use and write about decimal fractions, and made many other contributions to science and engineering.', full_name: 'Simon Stevin', image: 'stevin.jpg', short_name: 'Stevin', url: 'https://en.wikipedia.org/wiki/Simon_Stevin'},
				{description: 'François Viète (1540 – 1603) was a French mathematician, lawyer, and advisor to Kings Henry III and IV of France. He made significant advances in Algebra, and first introduced the use of letters to represent variables.', full_name: 'François Viète', image: 'viete.jpg', short_name: 'Viète', url: 'https://en.wikipedia.org/wiki/Fran%C3%A7ois_Vi%C3%A8te'},
				{description: 'Pedro Nunes (1502 – 1578) was a Portuguese mathematician and astronomer. As Royal Cosmographer of Portugal he taught navigational skills to many sailors and explorers.', full_name: 'Pedro Nunes', image: 'nunes.jpg', short_name: 'Pedro Nunes', url: 'https://en.wikipedia.org/wiki/Pedro_Nunes'},
				{description: 'The Italian Gerolamo Cardano (1501 – 1576) was one of the most influential mathematicians and scientists of the Renaissance. He investigated hypercycloids, published Tartaglia’s and Ferrari’s solution for cubic and quartic equations, was the first European to systematically use negative numbers, and even acknowledged the existence of imaginary numbers (based on −1).', full_name: 'Gerolamo Cardano', image: 'cardano.jpg', short_name: 'Cardano', url: 'https://en.wikipedia.org/wiki/Gerolamo_Cardano'},
				{description: 'Niccolò Fontana Tartaglia (1499 – 1557) was an Italian mathematician, engineer and bookkeeper. He published the first Italian translations of Archimedes and Euclid, found a formula for solving any cubic equation (including the first real application of complex numbers), and used mathematics to investigate the projectile motion of cannonballs.', full_name: 'Niccolò Fontana Tartaglia', image: 'tartaglia.jpg', short_name: 'Tartaglia', url: 'https://en.wikipedia.org/wiki/Niccol%C3%B2_Fontana_Tartaglia'},
				{description: 'Nicolaus Copernicus (1473 – 1543) was a Polish mathematician, astronomer and lawyer. During his life, most people believed in the Geocentric model of the universe, with Earth at the centre and everything else rotating around it.', full_name: 'Nicolaus Copernicus', image: 'copernicus.jpg', short_name: 'Copernicus', url: 'https://en.wikipedia.org/wiki/Nicolaus_Copernicus'},
				{description: 'Leonardo da Vinci (1452 – 1519) was an Italian artist and polymath. His interests ranged from painting, sculpting and architecture to engineering, mathematics, anatomy, astronomy, botany and cartography.', full_name: 'Leonardo da Vinci', image: 'leonardo.jpg', short_name: 'Da Vinci', url: 'https://en.wikipedia.org/wiki/Leonardo_da_Vinci'},
				{description: 'Luca Pacioli was an influential Italian friar and mathematician, who invented the standard symbols for plus and minus (+ and –). He was one of the first accountants in Europe, where he introduced double-entry book-keeping.', full_name: 'Luca Pacioli', image: 'pacioli.jpg', short_name: 'Pacioli', url: 'https://en.wikipedia.org/wiki/Luca_Pacioli'},
				{description: 'Johann Müller Regiomontanus (1436 – 1476) was a German mathematician and astronomer. He made great advances in both fields, including creating detailed astronomical tables and publishing multiple textbooks.', full_name: 'Johann Müller Regiomontanus', image: 'regiomontanus.jpg', short_name: 'Regiomontanus', url: 'https://en.wikipedia.org/wiki/Regiomontanus'},
				{description: 'Madhava of Sangamagramma (c. 1340 – 1425) was a mathematician and astronomer from southern India. All of his original work has been lost, but he had a great impact on the development of mathematics.', full_name: 'Madhava of Sangamagramma', image: 'madhava.jpg', short_name: 'Madhava', url: 'https://en.wikipedia.org/wiki/Madhava_of_Sangamagrama'},
				{description: 'Nicole Oresme (c. 1323 – 1382) was an important French mathematician, philosopher and bishop, living in the late Middle Ages. He invented coordinate geometry, long before Descartes, was the first to use fractional exponents, and worked on infinite series.', full_name: 'Nicole Oresme', image: 'oresme.jpg', short_name: 'Oresme', url: 'https://en.wikipedia.org/wiki/Nicole_Oresme'},
				{description: 'Zhu Shijie (朱世杰, 1249 – 1314) was one of the greatest Chinese mathematicians. In his book Jade Mirror of the Four Unknowns, he showed how to solve 288 different problem using systems of polynomial equations and four variables (called Heaven, Earth, Man and Matter).', full_name: 'Zhu Shijie', image: 'shijie.jpg', short_name: 'Zhu Shijie', url: 'https://en.wikipedia.org/wiki/Zhu_Shijie'},
				{description: 'Yang Hui (楊輝, c. 1238 – 1298) was a Chinese mathematician and writer during the Song dynasty. He studied magic squares and magic circles, the binomial theorem, quadratic equations, as well as Yang Hui’s triangle (known in Europe as Pascal’s triangle).', full_name: 'Yang Hui', image: 'yang.jpg', short_name: 'Yang', url: 'https://en.wikipedia.org/wiki/Yang_Hui'},
				{description: 'Qin Jiushao (秦九韶, c. 1202 – 1261) was a Chinese mathematician, inventor and politician. In his book Shùshū Jiǔzhāng, he published numerous mathematical discoveries, including the important Chinese remainder theorem, and wrote about surveying, meteorology and the military.', full_name: 'Qin Jiushao', image: 'jiushao.jpg', short_name: 'Qin', url: 'https://en.wikipedia.org/wiki/Qin_Jiushao'},
				{description: 'Nasir al-Din Tusi (1201 – 1274, نصیر الدین طوسی), also known as Muhammad ibn Muhammad ibn al-Hasan al-Tūsī, was an architect, philospher, physician, scientist, and theologian, as well as a prolific writer.', full_name: 'Nasir al-Din Tusi', image: 'tusi.jpg', short_name: 'Al-Din Tusi', url: 'https://en.wikipedia.org/wiki/Nasir_al-Din_al-Tusi'},
				{description: 'Li Ye (李冶, 1192 – 1279) was a Chinese mathematician. He improved methods for solving polynomial equations, and was one of the first Chinese scientists to propose that the Earth is spherical.', full_name: 'Li Ye', image: 'li.jpg', short_name: 'Li Ye', url: 'https://en.wikipedia.org/wiki/Li_Ye_(mathematician)'},
				{description: 'Leonardo Pisano, commonly known as Fibonacci (1175 – 1250) was an Italian mathematician. He is best known for the number sequence named after him: 1, 1, 2, 3, 5, 8, 13, …', full_name: 'Leonardo Pisano', image: 'fibonacci.jpg', short_name: 'Fibonacci', url: 'https://en.wikipedia.org/wiki/Fibonacci'},
				{description: 'Bhaskara II (1114 – 1185) was an Indian mathematician and astronomer. He discovered some of the basic concepts of calculus, more than 500 years before Leibnitz and Newton. Bhaskara also established that division by zero yields infinity, and solved various quadratic, cubic, quartic and Diophantine equations.', full_name: 'Bhaskara II', image: 'bhaskara-2.jpg', short_name: 'Bhaskara II', url: 'https://en.wikipedia.org/wiki/Bh%C4%81skara_II'},
				{description: 'Omar Khayyam (عمر خیّام‎, 1048 – 1131) was a Persian mathematician, astronomer and poet. He managed to classify and solve all cubic equations, and found new ways to understand Euclid’s parallel axiom. Khayyam also designed the Jalali calendar, a precise solar calendar that is still used in some countries.', full_name: 'Omar Khayyam', image: 'khayyam.jpg', short_name: 'Khayyam', url: 'https://en.wikipedia.org/wiki/Omar_Khayyam'},
				{description: 'Hasan Ibn al-Haytham (أبو علي، الحسن بن الحسن بن الهيثم, c. 965 – 1050) lived in Cairo during the Islamic Golden Age, and studied mathematics, physics, astronomy, philosophy, and medicine. He was a proponent of the scientific method: the belief that any scientific hypothesis must be verified using experiments or mathematical logic – centuries before European scientists during the Renaissance.', full_name: 'Hasan Ibn al-Haytham', image: 'al-haytham.jpg', short_name: 'Al-Haytham', url: ''},
				{description: 'Al-Ṣābiʾ Thābit ibn Qurrah al-Ḥarrānī (ثابت بن قره, c. 826 – 901 CE) was an Arabic mathematician, physician, astronomer, and translator. He lived in Baghdad and was one of the first reformers of the Ptolemaic system of our solar system.', full_name: 'Al-Ṣābiʾ Thābit ibn Qurrah al-Ḥarrānī', image: 'thabit.jpg', short_name: 'Thabit', url: 'https://en.wikipedia.org/wiki/Th%C4%81bit_ibn_Qurra'},
				{description: 'The Persian mathematician Muhammad Al-Khwarizmi (محمد بن موسى الخوارزمي, 780 – 850) lived during the golden age of the Muslim Abbasid regime in Baghdad. He worked at the “House of Wisdom”, which contained the first large collection of academic books since the destruction of the Library of Alexandria.', full_name: 'Muhammad Al-Khwarizmi', image: 'al-khwarizmi.jpg', short_name: 'Al-Khwarizmi', url: ''}
			])
		]));
var $author$project$GuessWho$control_buttons = F2(
	function (game, my_state) {
		var round_number = function () {
			var _v0 = game.stage;
			if (_v0.$ === 'InProgress') {
				var n = _v0.a;
				return n;
			} else {
				return -1;
			}
		}();
		var num_players = A2($elm$core$Basics$composeR, $author$project$GuessWho$playing_players, $elm$core$List$length)(game);
		return _List_fromArray(
			[
				{
				disabled: num_players < 2,
				key: 's',
				label: 'Start the game',
				msg: $author$project$Multiplayer$game_message($author$project$GuessWho$StartShufflingCards),
				show: _Utils_eq(game.stage, $author$project$GuessWho$WaitingToStart) && _Utils_eq(my_state.role, $author$project$GuessWho$InCharge)
			},
				{disabled: false, key: 'l', label: 'Leave the game', msg: $author$project$Multiplayer$LeaveGame, show: true},
				{
				disabled: round_number <= 0,
				key: 'p',
				label: 'Previous round',
				msg: $author$project$Multiplayer$game_message(
					$author$project$GuessWho$SetRound(round_number - 1)),
				show: $author$project$GuessWho$is_in_progress(game) && _Utils_eq(my_state.role, $author$project$GuessWho$InCharge)
			},
				{
				disabled: _Utils_cmp(
					round_number,
					$elm$core$List$length($author$project$Mathematicians$round_definitions) - 1) > -1,
				key: 'n',
				label: 'Next round',
				msg: $author$project$Multiplayer$game_message(
					$author$project$GuessWho$SetRound(round_number + 1)),
				show: $author$project$GuessWho$is_in_progress(game) && _Utils_eq(my_state.role, $author$project$GuessWho$InCharge)
			},
				{
				disabled: false,
				key: 't',
				label: game.show_chosen_cards ? 'Hide target cards' : 'Show target cards',
				msg: $author$project$Multiplayer$game_message(
					$author$project$GuessWho$ShowChosenCards(!game.show_chosen_cards)),
				show: $author$project$GuessWho$is_in_progress(game) && _Utils_eq(my_state.role, $author$project$GuessWho$InCharge)
			}
			]);
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $author$project$GuessWho$Observing = {$: 'Observing'};
var $author$project$GuessWho$blank_player = F2(
	function (i, id) {
		return {
			id: id,
			role: function () {
				switch (i) {
					case 0:
						return $author$project$GuessWho$InCharge;
					case 1:
						return $author$project$GuessWho$Playing;
					case 2:
						return $author$project$GuessWho$Playing;
					default:
						return $author$project$GuessWho$Observing;
				}
			}(),
			rounds: $elm$core$Array$empty
		};
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$GuessWho$get_my_state = F2(
	function (my_id, game) {
		return A2(
			$elm$core$Maybe$withDefault,
			A2($author$project$GuessWho$blank_player, -1, my_id),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (p) {
						return _Utils_eq(p.id, my_id);
					},
					game.players)));
	});
var $elm$core$Debug$log = _Debug_log;
var $author$project$GuessWho$handle_keypress = function (model) {
	var _v0 = model.game;
	if (_v0.$ === 'Just') {
		var game = _v0.a;
		var my_state = A2($author$project$GuessWho$get_my_state, model.my_id, game);
		var buttons = A2($author$project$GuessWho$control_buttons, game, my_state);
		var keymap = $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				function (b) {
					return _Utils_Tuple2(b.key, b);
				},
				buttons));
		return A2(
			$elm$json$Json$Decode$andThen,
			function (key) {
				var _v1 = A2($elm$core$Dict$get, key, keymap);
				if (_v1.$ === 'Just') {
					var b = _v1.a;
					return (b.show && (!b.disabled)) ? $elm$json$Json$Decode$succeed(b.msg) : $elm$json$Json$Decode$fail('This key is disabled');
				} else {
					return $elm$json$Json$Decode$fail('Unrecognised key ' + key);
				}
			},
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Debug$log('keypress'),
				A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string)));
	} else {
		return $elm$json$Json$Decode$fail('');
	}
};
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$GuessWho$receiveMessage = _Platform_incomingPort('receiveMessage', $elm$json$Json$Decode$value);
var $author$project$GuessWho$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$GuessWho$receiveMessage($author$project$Multiplayer$WebsocketMessage),
				$elm$browser$Browser$Events$onKeyUp(
				$author$project$GuessWho$handle_keypress(model))
			]));
};
var $author$project$GuessWho$blank_game = F3(
	function (game_id, players, my_index) {
		return _Utils_Tuple2(
			{
				id: game_id,
				info_card: $elm$core$Maybe$Nothing,
				my_index: my_index,
				players: A2($elm$core$List$indexedMap, $author$project$GuessWho$blank_player, players),
				replaying: false,
				show_chosen_cards: false,
				stage: $author$project$GuessWho$WaitingToStart
			},
			$elm$core$Platform$Cmd$none);
	});
var $author$project$GuessWho$ClickPiece = F3(
	function (a, b, c) {
		return {$: 'ClickPiece', a: a, b: b, c: c};
	});
var $author$project$Multiplayer$EndReplay = {$: 'EndReplay'};
var $author$project$GuessWho$ShuffledCards = function (a) {
	return {$: 'ShuffledCards', a: a};
};
var $author$project$Multiplayer$StartReplay = {$: 'StartReplay'};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$array = _Json_decodeArray;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$GuessWho$decode_round_definition = function (card_definitions) {
	var decode_card = A2(
		$elm$json$Json$Decode$andThen,
		function (name) {
			var _v0 = $elm$core$List$head(
				A2(
					$elm$core$Basics$composeR,
					$elm$core$Array$toList,
					$elm$core$List$filter(
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.short_name;
							},
							$elm$core$Basics$eq(name))))(card_definitions));
			if (_v0.$ === 'Just') {
				var card = _v0.a;
				return $elm$json$Json$Decode$succeed(card);
			} else {
				return $elm$json$Json$Decode$fail('Unrecognised card ' + name);
			}
		},
		$elm$json$Json$Decode$string);
	return A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		A2(
			$elm$json$Json$Decode$field,
			'shown_cards',
			$elm$json$Json$Decode$array(decode_card)),
		A2(
			$elm$json$Json$Decode$field,
			'chosen_cards',
			$elm$json$Json$Decode$list(decode_card)));
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm_community$json_extra$Json$Decode$Extra$combine = A2(
	$elm$core$List$foldr,
	$elm$json$Json$Decode$map2($elm$core$List$cons),
	$elm$json$Json$Decode$succeed(_List_Nil));
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm_community$json_extra$Json$Decode$Extra$sequence = function (decoders) {
	return $elm_community$json_extra$Json$Decode$Extra$combine(
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (idx, dec) {
					return A2($elm$json$Json$Decode$index, idx, dec);
				}),
			decoders));
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$GuessWho$decode_move = A2(
	$elm$json$Json$Decode$map,
	$elm$core$Debug$log('done'),
	A2(
		$elm$json$Json$Decode$map,
		function (msgs) {
			return _Utils_ap(
				_List_fromArray(
					[$author$project$Multiplayer$StartReplay]),
				_Utils_ap(
					msgs,
					_List_fromArray(
						[$author$project$Multiplayer$EndReplay])));
		},
		A2(
			$elm$json$Json$Decode$andThen,
			function (action) {
				var q = A2($elm$core$Debug$log, 'move action', action);
				switch (action) {
					case 'shuffle cards':
						return A2(
							$elm$json$Json$Decode$map,
							function (rounds) {
								return _List_fromArray(
									[
										$author$project$Multiplayer$OtherGameMsg(
										$author$project$GuessWho$ShuffledCards(rounds))
									]);
							},
							A2(
								$elm$json$Json$Decode$field,
								'rounds',
								$elm_community$json_extra$Json$Decode$Extra$sequence(
									A2($elm$core$List$map, $author$project$GuessWho$decode_round_definition, $author$project$Mathematicians$round_definitions))));
					case 'set round':
						return A2(
							$elm$json$Json$Decode$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$GuessWho$SetRound,
								A2($elm$core$Basics$composeR, $author$project$Multiplayer$OtherGameMsg, $elm$core$List$singleton)),
							A2($elm$json$Json$Decode$field, 'round', $elm$json$Json$Decode$int));
					case 'show chosen cards':
						return A2(
							$elm$json$Json$Decode$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$GuessWho$ShowChosenCards,
								A2($elm$core$Basics$composeR, $author$project$Multiplayer$OtherGameMsg, $elm$core$List$singleton)),
							A2($elm$json$Json$Decode$field, 'show', $elm$json$Json$Decode$bool));
					case 'click piece':
						return A4(
							$elm$json$Json$Decode$map3,
							function (id) {
								return function (col) {
									return function (row) {
										return _List_fromArray(
											[
												$author$project$Multiplayer$OtherGameMsg(
												A3($author$project$GuessWho$ClickPiece, id, col, row))
											]);
									};
								};
							},
							A2($elm$json$Json$Decode$field, 'player', $elm$json$Json$Decode$string),
							A2($elm$json$Json$Decode$field, 'col', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'row', $elm$json$Json$Decode$int));
					default:
						return $elm$json$Json$Decode$succeed(_List_Nil);
				}
			},
			A2($elm$json$Json$Decode$field, 'action', $elm$json$Json$Decode$string))));
var $author$project$GuessWho$decode_websocket_message = A2(
	$elm$json$Json$Decode$andThen,
	function (action) {
		return $elm$json$Json$Decode$fail('nope');
	},
	A2($elm$json$Json$Decode$field, 'action', $elm$json$Json$Decode$string));
var $author$project$GuessWho$Finished = {$: 'Finished'};
var $author$project$GuessWho$InProgress = function (a) {
	return {$: 'InProgress', a: a};
};
var $author$project$GuessWho$Round = F2(
	function (board, chosen) {
		return {board: board, chosen: chosen};
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Array$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2($elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Grid$update_cell = F3(
	function (_v0, fn, grid) {
		var x = _v0.a;
		var y = _v0.b;
		var i = (y * grid.width) + x;
		return _Utils_update(
			grid,
			{
				cells: A2(
					$elm$core$Array$indexedMap,
					function (j) {
						return function (c) {
							return _Utils_eq(j, i) ? fn(c) : c;
						};
					},
					grid.cells)
			});
	});
var $author$project$GuessWho$click_piece = F3(
	function (col, row, round) {
		return _Utils_update(
			round,
			{
				board: A3(
					$author$project$Grid$update_cell,
					_Utils_Tuple2(col, row),
					function (piece) {
						return _Utils_update(
							piece,
							{up: !piece.up});
					},
					round.board)
			});
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$GuessWho$encode_card = A2(
	$elm$core$Basics$composeR,
	function ($) {
		return $.short_name;
	},
	$elm$json$Json$Encode$string);
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$GuessWho$cols = 5;
var $author$project$GuessWho$make_piece = function (card) {
	return {card: card, up: true};
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$GuessWho$rows = 5;
var $author$project$GuessWho$make_board = function (cards) {
	var pieces = A2($elm$core$Array$map, $author$project$GuessWho$make_piece, cards);
	return {cells: pieces, height: $author$project$GuessWho$rows, width: $author$project$GuessWho$cols};
};
var $author$project$GuessWho$nocmd = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(_Utils_Tuple0),
				dictionary));
	});
var $author$project$Multiplayer$sendMessage = _Platform_outgoingPort('sendMessage', $elm$core$Basics$identity);
var $author$project$Multiplayer$send_message = function (action) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$cons(
			_Utils_Tuple2(
				'action',
				$elm$json$Json$Encode$string(action))),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Dict$fromList,
			A2(
				$elm$core$Basics$composeR,
				A2($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $elm$core$Basics$identity),
				$author$project$Multiplayer$sendMessage)));
};
var $author$project$Multiplayer$send_game_message = F2(
	function (action, data) {
		return A2(
			$author$project$Multiplayer$send_message,
			'game',
			_List_fromArray(
				[
					_Utils_Tuple2(
					'data',
					$elm$json$Json$Encode$object(
						_Utils_ap(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'action',
									$elm$json$Json$Encode$string(action))
								]),
							data)))
				]));
	});
var $author$project$GuessWho$send_move = F3(
	function (game, action, data) {
		return game.replaying ? $elm$core$Platform$Cmd$none : A2(
			$author$project$Multiplayer$send_game_message,
			'move',
			_List_fromArray(
				[
					_Utils_Tuple2(
					'move',
					$elm$json$Json$Encode$object(
						_Utils_ap(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'action',
									$elm$json$Json$Encode$string(action))
								]),
							data)))
				]));
	});
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				var _v1 = genA(seed);
				var result = _v1.a;
				var newSeed = _v1.b;
				var _v2 = callback(result);
				var genB = _v2.a;
				return genB(newSeed);
			});
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$maxInt = 2147483647;
var $elm$random$Random$minInt = -2147483648;
var $elm_community$random_extra$Random$Array$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0.a;
		var genB = _v1.a;
		var genC = _v2.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v3 = genA(seed0);
				var a = _v3.a;
				var seed1 = _v3.b;
				var _v4 = genB(seed1);
				var b = _v4.a;
				var seed2 = _v4.b;
				var _v5 = genC(seed2);
				var c = _v5.a;
				var seed3 = _v5.b;
				return _Utils_Tuple2(
					A3(func, a, b, c),
					seed3);
			});
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = $elm$random$Random$Generator(
	function (seed0) {
		var makeIndependentSeed = F3(
			function (state, b, c) {
				return $elm$random$Random$next(
					A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
			});
		var gen = A2($elm$random$Random$int, 0, 4294967295);
		return A2(
			$elm$random$Random$step,
			A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
			seed0);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm_community$random_extra$Random$Array$shuffle = function (arr) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A3(
				$elm$core$List$foldl,
				A2($elm$core$Basics$composeL, $elm$core$Array$push, $elm$core$Tuple$first),
				$elm$core$Array$empty,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$Array$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$Array$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						arr).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm_community$random_extra$Random$List$anyInt = A2($elm$random$Random$int, $elm$random$Random$minInt, $elm$random$Random$maxInt);
var $elm_community$random_extra$Random$List$shuffle = function (list) {
	return A2(
		$elm$random$Random$map,
		function (independentSeed) {
			return A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A3(
						$elm$core$List$foldl,
						F2(
							function (item, _v0) {
								var acc = _v0.a;
								var seed = _v0.b;
								var _v1 = A2($elm$random$Random$step, $elm_community$random_extra$Random$List$anyInt, seed);
								var tag = _v1.a;
								var nextSeed = _v1.b;
								return _Utils_Tuple2(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(item, tag),
										acc),
									nextSeed);
							}),
						_Utils_Tuple2(_List_Nil, independentSeed),
						list).a));
		},
		$elm$random$Random$independentSeed);
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $author$project$GuessWho$shuffle_round = function (card_definitions) {
	return A2(
		$elm$random$Random$andThen,
		function (shuffled) {
			return A2(
				$elm$random$Random$map,
				$elm$core$Tuple$pair(shuffled),
				$elm_community$random_extra$Random$List$shuffle(
					$elm$core$Array$toList(shuffled)));
		},
		A2(
			$elm$random$Random$map,
			A2($elm$core$Array$slice, 0, $author$project$GuessWho$rows * $author$project$GuessWho$cols),
			$elm_community$random_extra$Random$Array$shuffle(card_definitions)));
};
var $elm$random$Random$constant = function (value) {
	return $elm$random$Random$Generator(
		function (seed) {
			return _Utils_Tuple2(value, seed);
		});
};
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0.a;
		var genB = _v1.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v2 = genA(seed0);
				var a = _v2.a;
				var seed1 = _v2.b;
				var _v3 = genB(seed1);
				var b = _v3.a;
				var seed2 = _v3.b;
				return _Utils_Tuple2(
					A2(func, a, b),
					seed2);
			});
	});
var $elm_community$random_extra$Random$Extra$sequence = A2(
	$elm$core$List$foldr,
	$elm$random$Random$map2($elm$core$List$cons),
	$elm$random$Random$constant(_List_Nil));
var $elm_community$random_extra$Random$Extra$traverse = function (f) {
	return A2(
		$elm$core$Basics$composeL,
		$elm_community$random_extra$Random$Extra$sequence,
		$elm$core$List$map(f));
};
var $author$project$GuessWho$shuffle_cards = A2(
	$elm$random$Random$generate,
	A2($elm$core$Basics$composeR, $author$project$GuessWho$ShuffledCards, $author$project$Multiplayer$OtherGameMsg),
	A2($elm_community$random_extra$Random$Extra$traverse, $author$project$GuessWho$shuffle_round, $author$project$Mathematicians$round_definitions));
var $author$project$GuessWho$update_for_player = F3(
	function (id, fn, game) {
		var _v0 = game.stage;
		if (_v0.$ === 'InProgress') {
			var n = _v0.a;
			var update_round = function (player) {
				return _Utils_update(
					player,
					{
						rounds: A2(
							$elm$core$Array$indexedMap,
							function (r) {
								return function (round) {
									return _Utils_eq(r, n) ? fn(round) : round;
								};
							},
							player.rounds)
					});
			};
			return _Utils_update(
				game,
				{
					players: A2(
						$elm$core$List$map,
						function (player) {
							return _Utils_eq(player.id, id) ? update_round(player) : player;
						},
						game.players)
				});
		} else {
			return game;
		}
	});
var $author$project$GuessWho$update_game = F3(
	function (my_id, msg, game) {
		var qq = A2($elm$core$Debug$log, 'update', msg);
		var my_state = A2($author$project$GuessWho$get_my_state, my_id, game);
		_v0$11:
		while (true) {
			switch (msg.$) {
				case 'StartReplay':
					return $author$project$GuessWho$nocmd(
						_Utils_update(
							game,
							{replaying: true}));
				case 'EndReplay':
					return $author$project$GuessWho$nocmd(
						_Utils_update(
							game,
							{replaying: false}));
				case 'OtherGameMsg':
					switch (msg.a.$) {
						case 'SetRound':
							var n = msg.a.a;
							return _Utils_Tuple2(
								_Utils_update(
									game,
									{
										info_card: $elm$core$Maybe$Nothing,
										stage: $author$project$GuessWho$InProgress(n)
									}),
								A3(
									$author$project$GuessWho$send_move,
									game,
									'set round',
									_List_fromArray(
										[
											_Utils_Tuple2(
											'round',
											$elm$json$Json$Encode$int(n))
										])));
						case 'ShuffledCards':
							var rounds = msg.a.a;
							var make_round = function (_v2) {
								var shown_cards = _v2.a;
								var chosen_cards = _v2.b;
								var board = $author$project$GuessWho$make_board(shown_cards);
								return A2(
									$elm$core$List$map,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Maybe$Just,
										$author$project$GuessWho$Round(board)),
									chosen_cards);
							};
							var handle_round = F2(
								function (round, players) {
									return A3(
										$elm$core$List$map2,
										function (r) {
											return function (p) {
												return _Utils_update(
													p,
													{
														rounds: A2($elm$core$Array$push, r, p.rounds)
													});
											};
										},
										round,
										players);
								});
							var each_players_rounds = A2($elm$core$List$map, make_round, rounds);
							var nplayers = A3($elm$core$List$foldl, handle_round, game.players, each_players_rounds);
							return _Utils_Tuple2(
								_Utils_update(
									game,
									{
										players: nplayers,
										stage: $author$project$GuessWho$InProgress(0)
									}),
								A3(
									$author$project$GuessWho$send_move,
									game,
									'shuffle cards',
									_List_fromArray(
										[
											_Utils_Tuple2(
											'rounds',
											A2(
												$elm$json$Json$Encode$list,
												function (_v1) {
													var shown_cards = _v1.a;
													var chosen_cards = _v1.b;
													return $elm$json$Json$Encode$object(
														_List_fromArray(
															[
																_Utils_Tuple2(
																'shown_cards',
																A2($elm$json$Json$Encode$array, $author$project$GuessWho$encode_card, shown_cards)),
																_Utils_Tuple2(
																'chosen_cards',
																A2($elm$json$Json$Encode$list, $author$project$GuessWho$encode_card, chosen_cards))
															]));
												},
												rounds))
										])));
						case 'ClickPiece':
							var _v3 = msg.a;
							var player_id = _v3.a;
							var col = _v3.b;
							var row = _v3.c;
							return _Utils_Tuple2(
								A3(
									$author$project$GuessWho$update_for_player,
									player_id,
									A2($author$project$GuessWho$click_piece, col, row),
									game),
								A3(
									$author$project$GuessWho$send_move,
									game,
									'click piece',
									_List_fromArray(
										[
											_Utils_Tuple2(
											'player',
											$elm$json$Json$Encode$string(player_id)),
											_Utils_Tuple2(
											'col',
											$elm$json$Json$Encode$int(col)),
											_Utils_Tuple2(
											'row',
											$elm$json$Json$Encode$int(row))
										])));
						case 'StartShufflingCards':
							var _v4 = msg.a;
							return _Utils_Tuple2(game, $author$project$GuessWho$shuffle_cards);
						case 'ShowChosenCards':
							var show = msg.a.a;
							return _Utils_Tuple2(
								_Utils_update(
									game,
									{show_chosen_cards: show}),
								A3(
									$author$project$GuessWho$send_move,
									game,
									'show chosen cards',
									_List_fromArray(
										[
											_Utils_Tuple2(
											'show',
											$elm$json$Json$Encode$bool(show))
										])));
						case 'HoverCard':
							var card = msg.a.a;
							return $author$project$GuessWho$nocmd(
								_Utils_update(
									game,
									{
										info_card: _Utils_eq(
											game.info_card,
											$elm$core$Maybe$Just(card)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(card)
									}));
						case 'ClickBackground':
							var _v5 = msg.a;
							return $author$project$GuessWho$nocmd(
								_Utils_update(
									game,
									{info_card: $elm$core$Maybe$Nothing}));
						default:
							break _v0$11;
					}
				case 'PlayerJoined':
					var id = msg.a;
					return $author$project$GuessWho$nocmd(
						_Utils_update(
							game,
							{
								players: _Utils_ap(
									game.players,
									_List_fromArray(
										[
											A2(
											$author$project$GuessWho$blank_player,
											$elm$core$List$length(game.players),
											id)
										]))
							}));
				case 'EndGame':
					return $author$project$GuessWho$nocmd(
						_Utils_update(
							game,
							{stage: $author$project$GuessWho$Finished}));
				default:
					break _v0$11;
			}
		}
		return _Utils_Tuple2(game, $elm$core$Platform$Cmd$none);
	});
var $author$project$GuessWho$update_lobby = F2(
	function (msg, lobby) {
		var screen = msg.a;
		return $author$project$GuessWho$nocmd(
			_Utils_update(
				lobby,
				{screen: screen}));
	});
var $author$project$GuessWho$options = function (model) {
	return {
		blank_game: $author$project$GuessWho$blank_game,
		decode_move: $author$project$GuessWho$decode_move,
		decode_websocket_message: $author$project$GuessWho$decode_websocket_message,
		update_game: $author$project$GuessWho$update_game(model.my_id),
		update_lobby: $author$project$GuessWho$update_lobby
	};
};
var $author$project$Multiplayer$EndGame = {$: 'EndGame'};
var $author$project$Multiplayer$JoinGame = F4(
	function (a, b, c, d) {
		return {$: 'JoinGame', a: a, b: b, c: c, d: d};
	});
var $author$project$Multiplayer$LobbyMsg = function (a) {
	return {$: 'LobbyMsg', a: a};
};
var $author$project$Multiplayer$PlayerJoined = function (a) {
	return {$: 'PlayerJoined', a: a};
};
var $author$project$Multiplayer$SetGlobalState = function (a) {
	return {$: 'SetGlobalState', a: a};
};
var $author$project$Multiplayer$apply_updates = F3(
	function (updater, model, msgs) {
		return A3(
			$elm$core$List$foldl,
			function (msg) {
				return function (_v0) {
					var m = _v0.a;
					var c = _v0.b;
					var _v1 = A2(updater, msg, m);
					var nm = _v1.a;
					var nc = _v1.b;
					return _Utils_Tuple2(
						nm,
						_Utils_eq(c, $elm$core$Platform$Cmd$none) ? nc : (_Utils_eq(nc, $elm$core$Platform$Cmd$none) ? c : $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[c, nc]))));
				};
			},
			_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
			msgs);
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Multiplayer$GlobalState = F3(
	function (games, clients, num_players) {
		return {clients: clients, games: games, num_players: num_players};
	});
var $author$project$Multiplayer$GameInfo = F3(
	function (id, players, state) {
		return {id: id, players: players, state: state};
	});
var $author$project$Multiplayer$decode_game_info = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Multiplayer$GameInfo,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'players',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'state', $elm$json$Json$Decode$string));
var $author$project$Multiplayer$decode_global_state = A2(
	$elm$json$Json$Decode$field,
	'data',
	A4(
		$elm$json$Json$Decode$map3,
		$author$project$Multiplayer$GlobalState,
		A2(
			$elm$json$Json$Decode$field,
			'games',
			$elm$json$Json$Decode$list($author$project$Multiplayer$decode_game_info)),
		A2(
			$elm$json$Json$Decode$field,
			'clients',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
		A2($elm$json$Json$Decode$field, 'num_clients', $elm$json$Json$Decode$int)));
var $author$project$Multiplayer$get_global_stats = A2($author$project$Multiplayer$send_message, 'global_stats', _List_Nil);
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Multiplayer$nocmd = function (model) {
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $author$project$Multiplayer$apply_websocket_message = F3(
	function (options, encoded_data, model) {
		var standard_actions = A2(
			$elm$json$Json$Decode$andThen,
			function (action) {
				switch (action) {
					case 'move':
						return A2(
							$elm$json$Json$Decode$map,
							$elm$core$List$map($author$project$Multiplayer$GameMsg),
							A2($elm$json$Json$Decode$field, 'move', options.decode_move));
					case 'join_game':
						return A2(
							$elm$json$Json$Decode$map,
							$elm$core$List$singleton,
							A5(
								$elm$json$Json$Decode$map4,
								$author$project$Multiplayer$JoinGame,
								A2(
									$elm$json$Json$Decode$at,
									_List_fromArray(
										['state', 'id']),
									$elm$json$Json$Decode$string),
								A2(
									$elm$json$Json$Decode$map,
									$elm$core$List$concat,
									A2(
										$elm$json$Json$Decode$at,
										_List_fromArray(
											['state', 'history']),
										$elm$json$Json$Decode$list(options.decode_move))),
								A2(
									$elm$json$Json$Decode$at,
									_List_fromArray(
										['state', 'players']),
									$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
								A2($elm$json$Json$Decode$field, 'my_index', $elm$json$Json$Decode$int)));
					case 'game_player_joined':
						return A2(
							$elm$json$Json$Decode$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$Multiplayer$PlayerJoined,
								A2($elm$core$Basics$composeR, $author$project$Multiplayer$GameMsg, $elm$core$List$singleton)),
							A2($elm$json$Json$Decode$field, 'player_id', $elm$json$Json$Decode$string));
					case 'end_game':
						return $elm$json$Json$Decode$succeed(
							_List_fromArray(
								[
									$author$project$Multiplayer$GameMsg($author$project$Multiplayer$EndGame)
								]));
					case 'global_stats':
						return A2(
							$elm$json$Json$Decode$map,
							A2($elm$core$Basics$composeR, $author$project$Multiplayer$SetGlobalState, $elm$core$List$singleton),
							$author$project$Multiplayer$decode_global_state);
					case 'hi':
						return $elm$json$Json$Decode$succeed(_List_Nil);
					default:
						return $elm$json$Json$Decode$fail('unrecognised action ' + action);
				}
			},
			A2($elm$json$Json$Decode$field, 'action', $elm$json$Json$Decode$string));
		var decode_websocket_message = A3(
			$elm$json$Json$Decode$map2,
			function (standard) {
				return function (specific) {
					return $elm$core$List$concat(
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							_List_fromArray(
								[standard, specific])));
				};
			},
			A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, standard_actions),
			A2(
				$elm$core$Basics$composeR,
				$elm$json$Json$Decode$map(
					$elm$core$List$map($author$project$Multiplayer$GameMsg)),
				$elm$json$Json$Decode$maybe)(options.decode_websocket_message));
		var _v8 = A2($elm$json$Json$Decode$decodeValue, decode_websocket_message, encoded_data);
		if (_v8.$ === 'Ok') {
			var msgs = _v8.a;
			return A3(
				$author$project$Multiplayer$apply_updates,
				$author$project$Multiplayer$update(
					function (_v9) {
						return options;
					}),
				model,
				msgs);
		} else {
			var x = _v8.a;
			var q = A2($elm$core$Debug$log, 'error', x);
			return $author$project$Multiplayer$nocmd(model);
		}
	});
var $author$project$Multiplayer$update = F3(
	function (options_fn, msg, model) {
		update:
		while (true) {
			var options = options_fn(model);
			switch (msg.$) {
				case 'RequestJoinGame':
					var game = msg.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Multiplayer$send_message,
							'join_game',
							_List_fromArray(
								[
									_Utils_Tuple2(
									'id',
									$elm$json$Json$Encode$string(game.id))
								])));
				case 'JoinGame':
					var id = msg.a;
					var history = msg.b;
					var players = msg.c;
					var my_index = msg.d;
					var _v1 = A3(options.blank_game, id, players, my_index);
					var blank_game = _v1.a;
					var init_cmd = _v1.b;
					var _v2 = A3(
						$author$project$Multiplayer$apply_updates,
						options.update_game,
						blank_game,
						_Utils_ap(
							_List_fromArray(
								[$author$project$Multiplayer$StartReplay]),
							_Utils_ap(
								history,
								_List_fromArray(
									[$author$project$Multiplayer$EndReplay]))));
					var game = _v2.a;
					var cmd = _v2.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								game: $elm$core$Maybe$Just(game)
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									init_cmd,
									A2($elm$core$Platform$Cmd$map, $author$project$Multiplayer$GameMsg, cmd)
								])));
				case 'LeaveGame':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{game: $elm$core$Maybe$Nothing}),
						A2($author$project$Multiplayer$send_message, 'leave_game', _List_Nil));
				case 'GameMsg':
					var gmsg = msg.a;
					if (gmsg.$ === 'Restart') {
						var $temp$options_fn = function (_v4) {
							return options;
						},
							$temp$msg = $author$project$Multiplayer$LeaveGame,
							$temp$model = model;
						options_fn = $temp$options_fn;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						var _v5 = model.game;
						if (_v5.$ === 'Nothing') {
							return $author$project$Multiplayer$nocmd(model);
						} else {
							var game = _v5.a;
							var _v6 = A2(options.update_game, gmsg, game);
							var ng = _v6.a;
							var gcmd = _v6.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										game: $elm$core$Maybe$Just(ng)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Multiplayer$GameMsg, gcmd));
						}
					}
				case 'LobbyMsg':
					var lmsg = msg.a;
					var _v7 = A2(options.update_lobby, lmsg, model.lobby);
					var nl = _v7.a;
					var lcmd = _v7.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{lobby: nl}),
						A2($elm$core$Platform$Cmd$map, $author$project$Multiplayer$LobbyMsg, lcmd));
				case 'WebsocketMessage':
					var encoded_data = msg.a;
					return A3($author$project$Multiplayer$apply_websocket_message, options, encoded_data, model);
				case 'NewGame':
					return _Utils_Tuple2(
						model,
						A2($author$project$Multiplayer$send_message, 'new_game', _List_Nil));
				case 'RequestGlobalState':
					return _Utils_Tuple2(model, $author$project$Multiplayer$get_global_stats);
				default:
					var state = msg.a;
					return $author$project$Multiplayer$nocmd(
						_Utils_update(
							model,
							{
								global_state: $elm$core$Maybe$Just(state)
							}));
			}
		}
	});
var $author$project$GuessWho$update = $author$project$Multiplayer$update($author$project$GuessWho$options);
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$GuessWho$fi = $elm$core$String$fromInt;
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Util$pluralise = F3(
	function (n, singular, plural) {
		return (n === 1) ? singular : plural;
	});
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$GuessWho$ClickBackground = {$: 'ClickBackground'};
var $author$project$GuessWho$Noop = {$: 'Noop'};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $author$project$GuessWho$stopPropagationOn = F2(
	function (name, msg) {
		return A2(
			$elm$html$Html$Events$stopPropagationOn,
			name,
			$elm$json$Json$Decode$succeed(
				_Utils_Tuple2(msg, true)));
	});
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$GuessWho$view_info_card = function (game) {
	var _v0 = game.info_card;
	if (_v0.$ === 'Just') {
		var card = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('info-card'),
					A2($author$project$GuessWho$stopPropagationOn, 'click', $author$project$GuessWho$Noop)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(card.url),
									$elm$html$Html$Attributes$target('_blank')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(card.full_name)
								]))
						])),
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('images/' + card.image)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('description')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(card.description)
								]))
						]))
				]));
	} else {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('info-card hidden')
				]),
			_List_Nil);
	}
};
var $author$project$GuessWho$blank_round = {
	board: $author$project$GuessWho$make_board($elm$core$Array$empty),
	chosen: $elm$core$Maybe$Nothing
};
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Grid$indexedMap = F3(
	function (cell_fn, row_fn, grid) {
		var do_row = function (row) {
			return A2(
				row_fn,
				row,
				A2(
					$elm$core$Array$indexedMap,
					function (col) {
						return function (cell) {
							return A3(cell_fn, col, row, cell);
						};
					},
					A3($elm$core$Array$slice, row * grid.width, (row + 1) * grid.width, grid.cells)));
		};
		return A2(
			$elm$core$Array$map,
			do_row,
			$elm$core$Array$fromList(
				A2($elm$core$List$range, 0, grid.height - 1)));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$GuessWho$HoverCard = function (a) {
	return {$: 'HoverCard', a: a};
};
var $author$project$GuessWho$view_card = F2(
	function (is_me, card) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card'),
					is_me ? $elm$html$Html$Events$onClick(
					$author$project$GuessWho$HoverCard(card)) : A2(
					$author$project$GuessWho$stopPropagationOn,
					'click',
					$author$project$GuessWho$HoverCard(card))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src('images/' + card.image)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('name')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(card.short_name)
						]))
				]));
	});
var $author$project$GuessWho$view_board = F3(
	function (round, my_state, player) {
		var is_me = _Utils_eq(my_state.id, player.id);
		var view_piece = F3(
			function (col, row, piece) {
				return A2(
					$elm$html$Html$div,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('piece', true),
										_Utils_Tuple2('up', piece.up)
									])),
								A2(
								$elm$html$Html$Attributes$style,
								'grid-area',
								$author$project$GuessWho$fi(row + 1) + ('/' + $author$project$GuessWho$fi(col + 1))),
								A2($elm$html$Html$Attributes$attribute, 'role', 'button')
							]),
						is_me ? _List_fromArray(
							[
								A2(
								$author$project$GuessWho$stopPropagationOn,
								'click',
								A3($author$project$GuessWho$ClickPiece, player.id, col, row))
							]) : _List_Nil),
					_List_fromArray(
						[
							A2($author$project$GuessWho$view_card, is_me, piece.card)
						]));
			});
		var board = round.board;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('board', true),
							_Utils_Tuple2('me', is_me)
						])),
					A2(
					$elm$html$Html$Attributes$attribute,
					'style',
					'--rows: ' + $author$project$GuessWho$fi(board.height))
				]),
			$elm$core$List$concat(
				$elm$core$Array$toList(
					A3(
						$author$project$Grid$indexedMap,
						view_piece,
						function (_v0) {
							return $elm$core$Array$toList;
						},
						board))));
	});
var $author$project$GuessWho$view_chosen_card = F3(
	function (round, my_state, player) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('chosen-card')
				]),
			_List_fromArray(
				[
					function () {
					var _v0 = round.chosen;
					if (_v0.$ === 'Nothing') {
						return A2($elm$html$Html$div, _List_Nil, _List_Nil);
					} else {
						var card = _v0.a;
						return A2($author$project$GuessWho$view_card, false, card);
					}
				}()
				]));
	});
var $author$project$GuessWho$view_player = F5(
	function (round_number, my_state, show_chosen_card, index, state) {
		var round = A2(
			$elm$core$Maybe$withDefault,
			$author$project$GuessWho$blank_round,
			A2($elm$core$Array$get, round_number, state.rounds));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('player', true),
							_Utils_Tuple2(
							'player-' + $author$project$GuessWho$fi(index),
							true),
							_Utils_Tuple2('show-chosen-card', show_chosen_card)
						]))
				]),
			_List_fromArray(
				[
					A3($author$project$GuessWho$view_chosen_card, round, my_state, state),
					A3($author$project$GuessWho$view_board, round, my_state, state)
				]));
	});
var $author$project$GuessWho$view_boards = F3(
	function (round_number, my_state, game) {
		var vp = A2($author$project$GuessWho$view_player, round_number, my_state);
		var _v0 = my_state.role;
		if (_v0.$ === 'Playing') {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container one')
					]),
				_List_fromArray(
					[
						A3(vp, true, game.my_index - 1, my_state)
					]));
		} else {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container both'),
						$elm$html$Html$Events$onClick($author$project$GuessWho$ClickBackground)
					]),
				_Utils_ap(
					A2(
						$elm$core$List$indexedMap,
						vp(game.show_chosen_cards),
						$author$project$GuessWho$playing_players(game)),
					_List_fromArray(
						[
							$author$project$GuessWho$view_info_card(game)
						])));
		}
	});
var $author$project$GuessWho$view_game = F2(
	function (my_id, game) {
		var num_players = A2($elm$core$Basics$composeR, $author$project$GuessWho$playing_players, $elm$core$List$length)(game);
		var my_state = A2($author$project$GuessWho$get_my_state, my_id, game);
		var main_view = function () {
			var _v0 = game.stage;
			switch (_v0.$) {
				case 'WaitingToStart':
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(game.id)
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Waiting for players')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$GuessWho$fi(num_players) + (' ' + A3($author$project$Util$pluralise, num_players, 'player', 'players')))
									])),
								A2(
								$elm$html$Html$ul,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (p) {
										return A2(
											$elm$html$Html$li,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													p.id + (' : ' + (_Utils_eq(p.role, $author$project$GuessWho$InCharge) ? 'in charge' : 'playing')))
												]));
									},
									game.players))
							]));
				case 'InProgress':
					var round = _v0.a;
					return A3($author$project$GuessWho$view_boards, round, my_state, game);
				default:
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('The game is finished')
									]))
							]));
			}
		}();
		var buttons = A2($author$project$GuessWho$control_buttons, game, my_state);
		var controls = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('controls', true),
							_Utils_Tuple2(
							'always-visible',
							!$author$project$GuessWho$is_in_progress(game))
						]))
				]),
			A2(
				$elm$core$List$map,
				function (b) {
					return A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(b.msg),
								$elm$html$Html$Attributes$disabled(b.disabled)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(b.label)
							]));
				},
				A2(
					$elm$core$List$filter,
					function ($) {
						return $.show;
					},
					buttons)));
		return A2(
			$elm$html$Html$main_,
			_List_Nil,
			_List_fromArray(
				[
					A2($elm$html$Html$map, $author$project$Multiplayer$game_message, main_view),
					controls
				]));
	});
var $author$project$GuessWho$ViewAllCards = {$: 'ViewAllCards'};
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$GuessWho$header = A2(
	$elm$html$Html$header,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Guess Who?')
				]))
		]));
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Multiplayer$NewGame = {$: 'NewGame'};
var $author$project$GuessWho$new_game_button = function (model) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('new-game'),
				$elm$html$Html$Events$onClick($author$project$Multiplayer$NewGame)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Start a new game')
			]));
};
var $author$project$GuessWho$SetLobbyScreen = function (a) {
	return {$: 'SetLobbyScreen', a: a};
};
var $author$project$GuessWho$set_lobby_screen_button = F2(
	function (screen, label) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					$author$project$Multiplayer$LobbyMsg(
						$author$project$GuessWho$SetLobbyScreen(screen)))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				]));
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$GuessWho$view_all_cards = A2(
	$elm$html$Html$map,
	A2($elm$core$Basics$composeL, $author$project$Multiplayer$GameMsg, $author$project$Multiplayer$OtherGameMsg),
	A2(
		$elm$html$Html$ul,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('all-cards')
			]),
		A2(
			$elm$core$List$map,
			function (x) {
				return $author$project$GuessWho$view_info_card(
					{
						info_card: $elm$core$Maybe$Just(x)
					});
			},
			A2($elm$core$List$concatMap, $elm$core$Array$toList, $author$project$Mathematicians$round_definitions))));
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Multiplayer$RequestJoinGame = function (a) {
	return {$: 'RequestJoinGame', a: a};
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$GuessWho$view_lobby_game = function (game) {
	var num_players = $elm$core$List$length(game.players);
	return A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('game')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(game.id)
					])),
				A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('num-players')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(num_players))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Multiplayer$RequestJoinGame(game))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('join')
							]))
					]))
			]));
};
var $author$project$GuessWho$view_games = function (games) {
	return $elm$core$List$isEmpty(games) ? A2(
		$elm$html$Html$p,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text('There are no games at the moment')
			])) : A2(
		$elm$html$Html$table,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('games')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$thead,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Game ID')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Players')
									]))
							]))
					])),
				A2(
				$elm$html$Html$tbody,
				_List_Nil,
				A2($elm$core$List$map, $author$project$GuessWho$view_lobby_game, games))
			]));
};
var $author$project$GuessWho$view_lobby = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('app')
			]),
		_List_fromArray(
			[
				$author$project$GuessWho$header,
				function () {
				var _v0 = model.lobby.screen;
				if (_v0.$ === 'LobbyMain') {
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						function () {
							var _v1 = model.global_state;
							if (_v1.$ === 'Nothing') {
								return _List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('not-connected')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Waiting for data from the server.')
											]))
									]);
							} else {
								var state = _v1.a;
								return _List_fromArray(
									[
										$author$project$GuessWho$view_games(state.games),
										$author$project$GuessWho$new_game_button(model),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('info')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$p,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(
														$elm$core$String$fromInt(state.num_players) + (' ' + (A3($author$project$Util$pluralise, state.num_players, 'player', 'players') + ' connected')))
													])),
												A2(
												$elm$html$Html$p,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('debug')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('You are: ' + model.my_id)
													])),
												A2(
												$elm$html$Html$ul,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('debug')
													]),
												A2(
													$elm$core$List$map,
													function (id) {
														return A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(id)
																]));
													},
													state.clients))
											])),
										A2($author$project$GuessWho$set_lobby_screen_button, $author$project$GuessWho$ViewAllCards, 'View all cards')
									]);
							}
						}());
				} else {
					return A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$GuessWho$view_all_cards,
								A2($author$project$GuessWho$set_lobby_screen_button, $author$project$GuessWho$LobbyMain, 'Back')
							]));
				}
			}()
			]));
};
var $author$project$GuessWho$view = function (model) {
	return {
		body: function () {
			var _v0 = model.game;
			if (_v0.$ === 'Just') {
				var game = _v0.a;
				return _List_fromArray(
					[
						A2($author$project$GuessWho$view_game, model.my_id, game)
					]);
			} else {
				return _List_fromArray(
					[
						$author$project$GuessWho$view_lobby(model)
					]);
			}
		}(),
		title: 'Guess Who?'
	};
};
var $author$project$GuessWho$main = $elm$browser$Browser$document(
	{init: $author$project$GuessWho$init, subscriptions: $author$project$GuessWho$subscriptions, update: $author$project$GuessWho$update, view: $author$project$GuessWho$view});
_Platform_export({'GuessWho':{'init':$author$project$GuessWho$main($elm$json$Json$Decode$value)(0)}});}(this));