# angeldav-testpackage

default page template
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

nodejs app
```javascript
let express = require('express');
let app = express();
const package = require('angeldav_test-package');

app.get('/', (req, res) => {
    new package.loader({
        "res":res,
        "req":req,
        "title":title,
        "templatedir":filepath
    }).load()
});
```