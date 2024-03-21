import { PluggableList } from "unified";
import { JSResource } from "../../util/resources";
import { QuartzTransformerPlugin } from "../types";
import { Root, Html, BlockContent, DefinitionContent } from "mdast"
import { visit } from "unist-util-visit"

// @ts-ignore
import skulptScript from "../../components/scripts/skulpt.inline.ts"

export const Skulpt: QuartzTransformerPlugin = () => {
    return {
        name: "Skulpt",
        markdownPlugins() {
            const plugins: PluggableList = []
            plugins.push(() => {
                return (tree: Root, _file) => {
                    visit(tree, "code", (node, index, parent) => {
                        if (node.lang === "python") {
                            const code = node.value;
                            const customHtml: Html = {
                                type: "html",
                                value: `<div><textarea id="code">${code}</textarea>
                                <pre id="output"></pre>
                                <br /> 
                                <button class="run-button">Run</button>
                                </div>
                                `,
                              }
              
                              const editor: (BlockContent | DefinitionContent)[] = [customHtml]
              
                              parent!.children.splice(index!, 1, ...editor)
                        }
                    })
                }
            })

            return plugins
        },
        externalResources() {
            const js: JSResource[] = []
            const css: string[] = []

            css.push("https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css")
            css.push("https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/dracula.min.css")
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
                        var prog = document.getElementById("code").value; 
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
                     document.addEventListener("DOMContentLoaded", () => {
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
                    script: `
                    document.addEventListener('nav', async () => {
                        var myarea = document.getElementById('code')
                        var editor = CodeMirror.fromTextArea(myarea, {
                            mode: "text/x-python",
                            theme: "dracula",
                            lineNumbers: true,
                            indentUnit: 4,
                            matchBrackets: true,
                            lineWrapping: true,
                            textWrapping: false,
                            height: "160px",
                            fontSize: "9pt",
                            autofocus: true,
                        });
                        editor.on("change", (cm) => {
                            myarea.value = cm.getValue();
                        });
                    })
                    `,
                    loadTime: "afterDOMReady",
                    moduleType: "module",
                    contentType: "inline",
                },
                // Skuplt for running python
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
                // Codemirror for editor
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js",
                    loadTime: "afterDOMReady",
                    contentType: "external"
                },
                {
                    src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/python/python.min.js",
                    loadTime: "afterDOMReady",
                    contentType: "external"
                }
            )        
            return { css, js }
        }
    }
}