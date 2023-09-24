# angeldav-testpackage
This package is recommended to be used with express

Importing the packages
```javascript
const express = require('express');
const app = express();
const package = require('angeldav_test-package');
```

Initalization variables
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
const package = require('angeldav_testpackage');

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