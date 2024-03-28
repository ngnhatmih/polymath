import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "PolyMath",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "ngnhatmih.github.io/polymath/",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Raleway",
        body: "Raleway",
        code: "Raleway",
      }, 
      colors: {
        lightMode: {
          light: "rgb(213, 214, 219)",
          lightgray: "#CBCCD1",
          gray: "#9699a3",
          darkgray: "#343b58",
          dark: "#8C4351",
          secondary: "#8c4308",
          tertiary: "#0F7B6C",
          highlight: "#CBCCD1",
},
        darkMode: {
          light: "#1a1b26", // bg
          lightgray: "#414868", // fg
          gray: "#7aa2f7", // date
          darkgray: "#c0caf5", // text
          dark: "#ff9e64", // headers
          secondary: "#f7768e", // name, tittle
          tertiary: "#73daca", // hover and visited nodes
          highlight: "#414868",
},
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.FixBlockLatex(),
      Plugin.Latex({ renderEngine: "mathjax" }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "monokai",
          dark: "monokai",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.CodeMirror(),
      Plugin.Skulpt(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
