# angeldav-loaderhtml
This package is recommended to be used with express

Importing the packages
```javascript
const express = require('express');
const app = express();
const package = require('angeldav-loaderhtml');
```

Setup
```javascript
package.url = "localhost:1234" // set url of the website to replace __rooturl in the html files to the chosen url
package.default.notfound:`${__dirname}/notfound.html` // Page to show when a page is not found
package.default.template = `${__dirname}/template.html` // Base template for the pages

// OPTIONAL
// replaces tags like <¡foo> to the html content inside this value in all pages
package.default.other = { 
    "foo":"<input type='button' value='button'>" // raw html
    "navigator":`${__dirname}/public/components/nav.html` // html directory
}
```

How to load the loader
```javascript
// loader
new package.loader( /* config table */ ) // creates page
    .load() // loads page
```

Config table
```javascript
{
    "res":res, // http response
    "req":req, // http request
    
    "basetemplate":`${__dirname}/custom_template.html`, // Sets template if default template was not set or custom template is needed

    "content":`${__dirname}/index.html`, // Sets content directory
    "content": "<p>Hello</p>", // Or set html content directly
    
    "other": {
        "foo":"<input type='button' value='button'>" // replaces tags like <¡foo> to the content inside this value
    }

}
```

## examples

Example of ``index.js``
```javascript
const express = require('express');
const app = express();
const package = require('angeldav-loaderhtml');

package.templateDefault = `${__dirname}/template.html` // sets the base template for the pages

app.get('/', (req, res) => {
    new package.loader({
        "res":res,
        "req":req,
        "title":"title",
        "content":`${__dirname}/view/index.html`,
        "other":{
            "foo":"hello"
        }
    }).load()
});

const listener = app.listen(3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
})
```

Example of ``template.html``
```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Website</title>
    </head>

    <body>
        <section class="<¿templatesectionclass>">
            <¿templatesectionmain> <!-- required for loader content to show -->
        </section>
    </body>

</html>
```

Example of ``view/index.html``
```html
<h3><¡foo></h4>
<p>Hello!</p>
```

## default.preload
``package.default.preload`` sets javascript code to run before fully loading a page, it lets you modify the template page before any more changes with the ``base`` variable.

Useful when adding logged in username, custom themes and other stuff.

### example usage of preload
``index.js``
```javascript 
const package = require('angeldav-loaderhtml');
package.preload = `${__dirname}/default_preload.js`
```
``default_preload.js``
```javascript 
function getCookie(cookie, name) {
    if (cookie.includes(name+"=") == false || name == "") return ""
    var result = cookie.slice(cookie.indexOf(name))
    if (result.includes(";")) result = result.slice(0, result.indexOf(";"))
    result = result.split("=")
    return result[result.length-1]
}

let theme = getCookie(req.headers.cookie, "theme")
if (theme == "special") base = fs.readFileSync(`${__dirname}/../../templates/special.html`).toString()
```

## tags

404 error tags
```html
<¡errortitle> <!-- Displays error title example: 404: Page not found -->
<¡errormessage> <!-- Displays error message ex: {page name} isn't a valid page -->
<¡errorcode> <!-- Displays error code ex: 404 -->
```

Other tags
```html
__pagetitle  <!-- Displays the title chosen in the config table -->
__rooturl  <!-- Returns the website url stated in package.url -->
```

## page.templater example

```javascript
var numbers = ""

for (let i = 0; i < 10; i++) {
    numbers += new page.templater({
        "content": `<p><¡content></p>`,
        "other": {
            content: i
        }
    }).load()
}
```