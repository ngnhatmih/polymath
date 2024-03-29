import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/PolyMathTogether",
      Discord: "https://discord.gg/mzXHEHfmmY",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      spacerSymbol: "/", // symbol between crumbs
      rootName: "Home", // name of first/root element
      resolveFrontmatterTitle: true, // whether to resolve folder names through frontmatter titles
      hideOnRoot: true, // whether to hide breadcrumbs on root `index.md` page
      showCurrentPage: true, // whether to display the current page in the breadcrumbs
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer()),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      title: "/",
      filterFn: (node) => !["Attachments", "Excalidraw", "tags"].includes(node.name),
      sortFn: (a: FileNode, b: FileNode) => {
        if (!a.file && !b.file) {
          return a.displayName.localeCompare(b.displayName);
        }
        if (a.file && b.file) {
          return a.file.dates.created < b.file.dates.created ? 1 : -1;
        }
        if (a.file && !b.file) {
          return 1
        }
        else {
          return -1
        }
      },
      folderDefaultState: "open",
      // mapFn: (node) => node.displayName = node.file ? `<strong>${node.file.dates.created.toISOString().split('T')[0]}</strong> - ${node.displayName}` : node.displayName,
    })),
  ],
  right: [],
}
