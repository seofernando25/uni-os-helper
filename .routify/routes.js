
/**
 * @roxi/routify 2.18.8
 * File generated Wed Jul 20 2022 09:25:32 GMT-0400 (Eastern Daylight Time)
 */

export const __version = "2.18.8"
export const __timestamp = "2022-07-20T13:25:32.354Z"

//buildRoutes
import { buildClientTree } from "@roxi/routify/runtime/buildRoutes"

//imports


//options
export const options = {}

//tree
export const _tree = {
  "root": true,
  "children": [
    {
      "isFallback": true,
      "path": "/_fallback",
      "component": () => import('../src/pages/_fallback.svelte').then(m => m.default)
    },
    {
      "isIndex": true,
      "isPage": true,
      "path": "/index",
      "id": "_index",
      "component": () => import('../src/pages/index.svelte').then(m => m.default)
    },
    {
      "isDir": true,
      "ext": "",
      "children": [
        {
          "isIndex": true,
          "isPage": true,
          "path": "/tools/index",
          "id": "_tools_index",
          "component": () => import('../src/pages/tools/index.svelte').then(m => m.default)
        },
        {
          "isDir": true,
          "ext": "",
          "children": [
            {
              "isIndex": true,
              "isPage": true,
              "path": "/tools/page-replacement/index",
              "id": "_tools_pageReplacement_index",
              "component": () => import('../src/pages/tools/page-replacement/index.svelte').then(m => m.default)
            }
          ],
          "path": "/tools/page-replacement"
        }
      ],
      "path": "/tools"
    }
  ],
  "isLayout": true,
  "path": "/",
  "id": "__layout",
  "component": () => import('../src/pages/_layout.svelte').then(m => m.default)
}


export const {tree, routes} = buildClientTree(_tree)

