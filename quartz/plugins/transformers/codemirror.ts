import { JSResource } from "../../util/resources";
import { QuartzTransformerPlugin } from "../types";
import { Root, Html, BlockContent, DefinitionContent } from "mdast"
import { visit } from "unist-util-visit"
import { PluggableList } from "unified";

export const CodeMirror: QuartzTransformerPlugin = () => {
    return {
        name: "CodeMirror",
        markdownPlugins() {
            const plugins: PluggableList = []
            plugins.push(() => {
                return (tree: Root, _file) => {
                    visit(tree, "code", (node, index, parent) => {
                        if (node.lang === "python") {
                            const code = node.value;
                            const customHtml: Html = {
                                type: "html",
                                value: `<div class="split">
                                <div id="split-0">
                                  <textarea id="editor">${code}</textarea>
                                </div>
                                <div id="split-1">
                                  <button id="run">Run</button>
                                  <pre id="canvas"></pre>
                                </div>
                              </div>
                              <div class="console">
                                <textarea id="output"></textarea>
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
            const css: string[] = []
            const js: JSResource[] = []
            css.push(
                "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.css",
                "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/seti.css",
                "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/addon/scroll/simplescrollbars.min.css"
            ),

                js.push(
                    {
                        script: `
Split(["#split-0", "#split-1"]);

var myeditor = document.getElementById("editor");
var editor;
if (myeditor != null) {
  editor = CodeMirror.fromTextArea(myeditor, {
    mode: "text/x-python",
    theme: "seti",
    indentUnit: 4,
    lineWrapping: true,
    scrollbarStyle: "overlay",
    lineNumbers: true,
    fontSize: "10pt"
  });
}
editor.on("change", (cm) => {
  myeditor.value = cm.getValue();
});

var myoutput = document.getElementById("output");
var cm;
if (myoutput != null) {
  cm = CodeMirror.fromTextArea(myoutput, {
    mode: "application/x-powershell",
    readOnly: "nocursor",
    theme: "seti",
    indentUnit: 4,
    lineNumbers: true,
    lineWrapping: true,
    scrollbarStyle: "overlay",
    fontSize: "20pt",
    viewportMargin: Infinity
  });
  
  var externalLibs = {
    "./numpy/__init__.js":
        "https://cdn.jsdelivr.net/gh/ebertmi/skulpt_numpy@master/numpy/__init__.js",
    "./numpy/random/__init__.js":
        "https://cdn.jsdelivr.net/gh/ebertmi/skulpt_numpy@master/numpy/random/__init__.js"
  };

  function outf(text) {
    cm.setValue(cm.getValue() + text);
  }
  
  function builtinRead(file) {
    console.log("Attempting file: " + Sk.ffi.remapToJs(file));
  
    if (externalLibs[file] !== undefined) {
      return Sk.misceval.promiseToSuspension(
        fetch(externalLibs[file]).then(function (resp) {
          return resp.text();
        })
      );
    }
  
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles.files[file] === undefined
    ) {
      throw "File not found: '" + file + "'";
    }
  
    return Sk.builtinFiles.files[file];
  }
  
  function runit() {
    var prog = document.getElementById("editor").value;
    cm.setValue("");
    Sk.configure({ output: outf, read: builtinRead });
    (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "canvas";
    var myPromise = Sk.misceval.asyncToPromise(function () {
      return Sk.importMainWithBody("<stdin>", false, prog, true);
    });
    myPromise.then(
      function (mod) {
        console.log("success");
      },
      function (err) {
        console.log(err.toString());
      }
    );
  }
 document.addEventListener("nav", () => {
    const button = document.getElementById("run");
    if (button) {
        button.addEventListener("click", (_e) => {
            runit(); 
        })
    }
});
}
                    `,
                        loadTime: "afterDOMReady",
                        moduleType: "module",
                        contentType: "inline",
                    },
                    // codemirror
                    {
                        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.js",
                        loadTime: "afterDOMReady",
                        contentType: "external"
                    },
                    // language modes
                    {
                        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/mode/python/python.min.js",
                        loadTime: "afterDOMReady",
                        contentType: "external"
                    },
                    // scrollbar
                    {
                        src: "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/addon/scroll/simplescrollbars.min.js",
                        loadTime: "afterDOMReady",
                        contentType: "external"
                    },
                    // split
                    {
                        src: "https://cdnjs.cloudflare.com/ajax/libs/split.js/1.6.2/split.js",
                        loadTime: "afterDOMReady",
                        contentType: "external"
                    },
                    //skuplt
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
            return { js, css }
        }
    }
}