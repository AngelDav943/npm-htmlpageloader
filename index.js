const fs = require('fs');

class loader {
    constructor(configtable) { // loader constructor
        this.res = configtable.res
        this.req = configtable.req
        this.basetemplate = configtable.basetemplate || module.exports.default.template;
        this.custombasetemplate = configtable.custombasetemplate || "";
        this.templatedir = configtable.templatedir || configtable.content || "";
        this.template = configtable.template || configtable.content || "";
        this.other = configtable.other || {};
        this.title = configtable.title || module.exports.default.title;
    }

    load() { // loads the html
        //console.log(__dirname);
        if (this.res && this.req) {
            let dirtemplate = this.templatedir
            let other = this.other

            if(!fs.existsSync(dirtemplate) && !fs.existsSync(this.templatedir) && this.template == "") { // checks if page exists
                this.res.status(404)
				dirtemplate = module.exports.default.notfound
                other = {
                    "errortitle": 'Page not found',
                    "errorcode": + '404',
                    "errormessage": (this.req.path.substring(1) + " isn't a valid page")
                }
            }

            if (fs.existsSync(this.templatedir)) dirtemplate = this.templatedir

            var classmain = "main"
            let base = fs.readFileSync(this.basetemplate).toString();

            if (this.custombasetemplate != "") base = this.custombasetemplate

            let section = null;
            if (fs.existsSync(dirtemplate) && !section) section = fs.readFileSync(dirtemplate).toString()
            if (this.template && !section && !fs.existsSync(dirtemplate)) section = this.template

            let req = this.req;
            let res = this.res;

            module.exports.url = (module.exports.url || `https://${req.headers.host}`);
            new Promise(async function(resolve, reject) {
                let htmltemplate = undefined
                let autoresolve = true
                let code_directory = module.exports.default.codeDir || module.exports.default.preload
                try {
                    // if (fs.existsSync(code_directory)) eval(fs.readFileSync(code_directory).toString());

                    if (fs.existsSync(code_directory)) {

                        Object.keys(require.cache).forEach((key) => {
                            if (key.includes("node_modules")) return;
                            delete require.cache[key];
                        });

                        const data = {
                            htmltemplate: htmltemplate,
                            section: section,
                            classmain: classmain,
                            other: other
                        }

                        const preloadResponse = await require(code_directory)(req, res, data)

                        if (preloadResponse.htmltemplate) htmltemplate = preloadResponse.htmltemplate
                        if (preloadResponse.section) section = preloadResponse.section
                        if (preloadResponse.classmain) classmain = preloadResponse.classmain
                        if (preloadResponse.other) other = preloadResponse.other
                    }

                } catch (error) {
                    console.error("ERROR AT: ", code_directory)
                    console.error(error);
                }

                if (htmltemplate != undefined) {
                    base = htmltemplate
                }

                if (autoresolve == true) resolve("");
            }).then(() => {
                base = base.replace(/(\<html .*?\>)/g, `<html class="${classmain.replace(/main/g,"")}">`);
                base = base.replace(/<¿templatesectionmain>/g, section);
                base = base.replace(/<¿templatesectionclass>/g, classmain);

                if (module.exports.default.other != {}) for (let value in module.exports.default.other) {
                    let itemTag = module.exports.default.other[value];
                    if (fs.existsSync(itemTag)) itemTag = fs.readFileSync(module.exports.default.other[value]);

                    if (typeof(itemTag) == "object") for (let val in itemTag) {
                        base = base.replace(new RegExp(`<¡${value}.${val}>`,"g"),itemTag[val]);
                    }

                    base = base.replace(new RegExp(`<¡${value}>`,"g"),itemTag);
                }

                if (other != {}) for (let value in other) {
                    if (typeof(other[value]) == "object") for (let val in other[value]) {
                        base = base.replace(new RegExp(`<¡${value}.${val}>`,"g"),other[value][val]);
                    }
                    base = base.replace(new RegExp(`<¡${value}>`,"g"),other[value]);
                }

                base = base.replace(/__pagetitle/g, this.title)
                base = base.replace(/__rooturl/g, module.exports.url || `https://${req.headers.host}`);

                if(!this.res.headersSent) this.res.send(base) // send html if headers are not already sent
            })
        }
    }
}

class templater {
    constructor(configtable) {
        this.templatedir = configtable.templatedir || configtable.content;
        this.template = configtable.template || configtable.content || "";
        this.other = configtable.other || {};
    }

    load() {
        var template;
        if (fs.existsSync(this.templatedir)) {
            template = fs.readFileSync(this.templatedir).toString();
        } else if (this.template != "") {
            template = this.template
        }

        if (this.other != {}) for (let value in this.other) {
            if (typeof(this.other[value]) == "object") for (let val in this.other[value]) {
                template = template.replace(new RegExp(`<¡${value}.${val}>`,"g"),this.other[value][val]);
            }
            template = template.replace(new RegExp(`<¡${value}>`,"g"),this.other[value]);
        }

        template = template.replace(/__rooturl/g, module.exports.url);
        return template
    }
}

module.exports = {
    url: undefined,
    default:{
        title: "",
        preload: "",
        template: "",
        notfound:"",
        other:{

        }
    },
    loader,
    templater
}