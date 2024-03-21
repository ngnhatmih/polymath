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
        header: "Share Tech Mono",
        body: "Share Tech Mono",
        code: "Share Tech Mono",
      }, 
      colors: {
        lightMode: {
          light: "#ffffff", // background
          lightgray: "#5c4838", // search
          gray: "#aded80", // text (date, "Search", dark, icon)
          darkgray: "#150C2A", // main text?
          dark: "#150C0B", // text?
          secondary: "#5c4831", // folder title text
          tertiary: "#678e57", // i.e. the sub-node
          highlight: "#adbd93",
        },
        darkMode: {
          light: "#0b0907", // background
          lightgray: "#c7b3a3", // search background?
          gray: "#0b0907", // text (date, "Search", dark, icon)
          darkgray: "#f3efec", // text
          dark: "#f3efec", // text
          secondary: "#adbd93", // the bigger node
          tertiary: "#82a972", // i.e. the sub-node
          highlight: "#5c6c42",
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
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
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
