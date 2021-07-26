# angeldav-testpackage

nodejs app
```javascript
const express = require('express');
const app = express();
const package = require('angeldav_test-package');

package.templateDefault = `${__dirname}/template.html`

app.get('/', (req, res) => {
    new package.loader({
        "res":res,
        "req":req,
        "title":"title",
        "templatedir":`${__dirname}/view/index.html`,
        "other":{
            "foo":"hello"
        }
    }).load()
});

const listener = app.listen(3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
})
```

template.html
```html
<!DOCTYPE html>
<html lang="en">

    <head>
        <title>Website</title>
    </head>

    <body>
        <section class="<¿templatesectionclass>">
            <¿templatesectionmain>
        </section>
    </body>

</html>
```

index.html
```html
<h3><¡foo></h4>
<p>Hello!</p>
```

404 error tags
```html
<¡errortitle> <!-- Displays error title example: 404: Page not found -->
<¡errormessage> <!-- Displays error message ex: {page name} isn't a valid page -->
<¡errorcode> <!-- Displays error code ex: 404 -->
```