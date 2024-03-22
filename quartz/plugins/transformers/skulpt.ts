import { JSResource } from "../../util/resources";
import { QuartzTransformerPlugin } from "../types";



export const Skulpt: QuartzTransformerPlugin = () => {
    return {
        name: "Skulpt",
        externalResources() {
            const js: JSResource[] = []
            
            js.push(
                {
                    script: `
                    function outf(text) { 
                        var mypre = document.getElementById("output"); 
                        mypre.innerHTML = mypre.innerHTML + text; 
                    }
                    function builtinRead(x) {
                        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                                throw "File not found: '" + x + "'";
                        return Sk.builtinFiles["files"][x];
                    }
                    function runit() { 
                        var prog = document.getElementById("editor").value; 
                        var mypre = document.getElementById("output");
                        mypre.innerHTML = ''; 
                        Sk.pre = "output";
                        Sk.configure({output:outf, read:builtinRead}); 
                        var myPromise = Sk.misceval.asyncToPromise(function() {
                            return Sk.importMainWithBody("<stdin>", false, prog, true);
                        });
                        myPromise.then(function(mod) {
                            console.log('success');
                        },
                            function(err) {
                            console.log(err.toString());
                        });
                     }
                     document.addEventListener("nav", () => {
                        const button = document.querySelector(".run-button");
                        if (button) {
                            button.addEventListener("click", (_e) => {
                                runit(); 
                            })
                        }
                    });
                    `,
                    loadTime: "afterDOMReady",
                    moduleType: "module",
                    contentType: "inline"
                },
                {
                    src: "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js",
                    loadTime: "afterDOMReady",
                    contentType: "external"
                },
                {
                    src: "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.min.js",
                    loadTime: "afterDOMReady",
                    contentType: "external"
                },
            )        
            return { js }
        }
    }
}