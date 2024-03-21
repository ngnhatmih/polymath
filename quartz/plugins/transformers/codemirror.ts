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
                                value: `<div>
                                <textarea id="editor">${code}</textarea>
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
            const css: string[] = []
            const js: JSResource[] = []
            css.push(
                "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/codemirror.min.css",
                "https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/theme/dracula.min.css"
            );
            
            js.push(
                {
                    script: `
                    document.addEventListener('nav', async () => {
                        var myarea = document.getElementById('code')
                        var editor;
                        if (myarea != null) {
                            editor = CodeMirror.fromTextArea(myarea, {
                                mode: "text/x-python",
                                theme: "dracula",
                                lineNumbers: true,
                                indentUnit: 4,
                                matchBrackets: true,
                                textWrapping: false,
                                height: "160px",
                                fontSize: "9pt",
                                autofocus: true,
                            });
                            editor.on("change", (cm) => {
                                myarea.value = cm.getValue();
                            });
                        }
                    })
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
            )
            return { js, css }
        }
    }
}