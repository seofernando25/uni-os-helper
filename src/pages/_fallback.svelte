<script>
  import { url } from "@roxi/routify";
</script>

<div class="">
  <button class="btn btn-sm btn-ghost btn-outline"> Test </button>
  <div class="big">
    Page not found.
    <!-- link to the parent folder of _fallback.svelte -->
    <a href={$url("../")}>Go back</a>
  </div>
</div>
