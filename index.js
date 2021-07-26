const fs = require('fs');

class loader {
    constructor(configtable) { // loader constructor
        this.res = configtable.res
        this.req = configtable.req
        this.basetemplate = configtable.basetemplate || module.exports.templateDefault;
        this.custombasetemplate = configtable.custombasetemplate || "";
        this.templatedir = configtable.templatedir || "";
        this.template = configtable.template || "";
        this.other = configtable.other || [];
        this.title = configtable.title || "";
    }

    load() { // loads the html
        console.log(__dirname);
        if (this.res && this.req) {
            let dirtemplate = `${__dirname}/../view${this.templatedir}.html`
            let other = this.other

            if(!fs.existsSync(dirtemplate) && !fs.existsSync(this.templatedir) && this.template == "") { // checks if page exists
                this.res.status(404)
				dirtemplate = module.exports.not_found_page
                other = {
                    "errormessage": '404: Page not found',
                    "errorcode": + '404',
                    "errortitle": (this.req.path.substring(1) + " isn't a valid page")
                }
                console.log(this.templaterdir)
            }

            if (fs.existsSync(this.templatedir)) dirtemplate = this.templatedir

            var classmain = "main dark-mode"
            var htmltemplate = fs.readFileSync(this.basetemplate).toString();
            
            if (this.custombasetemplate != "") htmltemplate = this.custombasetemplate

            let section = null;
            if (fs.existsSync(dirtemplate) && !section) section = fs.readFileSync(dirtemplate).toString()
            if (this.template && !section && !fs.existsSync(dirtemplate)) section = this.template

            htmltemplate = htmltemplate.replace(/<¿templatesectionmain>/g, section);
            htmltemplate = htmltemplate.replace(/<¿templatesectionclass>/g, classmain);

            if (other != {}) for (value in other) {
                htmltemplate = htmltemplate.replace(new RegExp(`<¡${value}>`,"g"),other[value]);
            }

            htmltemplate = htmltemplate.replace(/__pagetitle/g, this.title)
            htmltemplate = htmltemplate.replace(/__rooturl/g, websiteurl);

            if(!this.res.headersSent) this.res.send(htmltemplate) // send html if headers are not already sent
        }
    }
}

class templater {
    constructor(configtable) {
        this.templatedir = `${__dirname}/../assets/server/templates/${configtable.templatedir || "-NO.DIR-."}.html`;
        this.template = configtable.template || "";
        this.other = configtable.other || [];
    }

    load() {
        var template;
        if (fs.existsSync(this.templatedir)) {
            template = fs.readFileSync(this.templatedir).toString();
        } else if (this.template != "") {
            template = this.template
        }

        if (this.other.length > 0) this.other.forEach( object => {
            let thing = object.replace(":","|/|objectSEPARATOR|/|").split("|/|objectSEPARATOR|/|");
            template = template.replace(new RegExp(`<¡${thing[0]}>`,"g"), thing[1]);
        });

        template = template.replace(/__rooturl/g, websiteurl);
        return template
    }
}

module.exports = {
    not_found_page:"",
    url: "",
    templateDefault: "",
    loader,
    templater
}