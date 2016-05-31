# my-autolink v0.0.2

`my-autolink` is my autolinker for me.

# Install
```sh
npm install my-autolink
```

# TypeScript support
TypeScript declaration file (`.d.ts`) is provided. TypeScript >=1.6.0 will automatically find typing information for this module.

# Sample
```js
var autolink = require('my-autolink');

console.log(autolink("Go to http://example.net/ now!"))
// -> "Go to <a href='http://example.net/'>http://example.net/</a> now!"
```

The result is escaped by [escape-html](https://github.com/component/escape-html).

# API
## autolink(text[, transforms] [,options])

Returns `text` with `a` tags added.

* **transforms**: an array of a string or a Transform Object explained below. Defaults to `["url"]`, where `"url"` means the built-in transform that turns a url into a link
* **options**: options passed to built-in transforms.
    * **url**: passed to `"url"` transform.
        * **requireSchemes**: If set to false, urls that start with hostname is converted to link. (example: `example.net/foo/bar` to `<a href='http://example.net/foo/bar'>example.net/foo/bar</a>`) Defaults to true.
        * **schemes**: Array of schemes allowed. Default value is `["http","https"]`. Set to the string `"*"` to accept any scheme.
        * **attributes**: Object specifying the attributes of generated `a` elements.

# Transform Object
Custom autolinks can be defined by Transform Object, which consist of two methods:
* pattern: receives the object `options` and returns RegExp.
* transform: receives `options` and subsequent arguments provided by `RegExp#exec` and returns object that represents attributes of the `a` element. This object may have the extra field `text` to represent the text of link.

Note that RegExps returned by `pattern` must have its global flag set.

## Examples
The simplest example:

```js
{
  pattern: function(){ return /article\/(\d+)/g; },
  transform: function(_, text, num){
    return {
      href: "/path/to/article/"+num
    }
  }
}
```

This Transform Object converts the text `article/1234` into `<a href='/path/to/article/1234'>article/1234</a>`.

# Changelog

- **0.0.2**: Add `attributes` option to `url` transform.
- **0.0.1**
# License
MIT
