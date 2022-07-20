<script lang="ts">
  import Fa from "svelte-fa";
  import { faHouse } from "@fortawesome/free-solid-svg-icons";
</script>

<header>
  <nav class="navbar bg-base-100 ">
    <div class="navbar-start">
      <div class="navbar-item">
        <div class="tooltip tooltip-bottom" data-tip="Home">
          <a title="Home" href="/" class="btn btn-ghost normal-case text-xl">
            <Fa icon={faHouse} />
          </a>
        </div>
      </div>
      <div class="divider divider-horizontal" />
    </div>
    <div class="navbar-end" />
  </nav>
</header>
