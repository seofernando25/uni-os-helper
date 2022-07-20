<script lang="ts">
  import { toSpaceCase } from "@lib/utils";
  import { layout } from "@roxi/routify";
</script>

<!-- Big text saying tools -->
<div class="prose prose-2xl max-w-4sxl">
  <h3>Hello 👋👀</h3>
  <p>
    I've been having a bad time solving boring and time taking questions in my
    Operating Systems class so I decided to put together a set of tools to help
    me save some time (and hopefully you too!)
  </p>
  <p>Tools:</p>
  <ul>
    {#each $layout.children[0].children as node}
      <li>
        <a href={node.path}>{toSpaceCase(node.title)}</a>
      </li>
    {/each}
  </ul>
</div>
