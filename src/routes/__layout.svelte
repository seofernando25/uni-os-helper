<script lang="ts">
  import "reflect-metadata";
  import "../app.css";
  import "@fortawesome/fontawesome-free/css/all.css";

  import Header from "$lib/components/Header.svelte";

  import { DI, setDI } from "$lib/di";
  import { ThemeService } from "$lib/services/ThemeService";
  import { buildProviderModule } from "inversify-binding-decorators";

  setDI(buildProviderModule());
</script>

<div class="wrapper">
  <Header />
  <main class="bg-base-300 rounded p-4 ">
    <slot />
  </main>
</div>

<style>
  .wrapper {
    position: fixed;
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    min-height: 100%;
  }

  main {
    overflow: auto;
    position: relative;
    height: 100%;
    flex: 1 1 auto;
  }

  :root {
    background-image: radial-gradient(
      circle at center,
      hsla(var(--bc) / 0.2) 30%,
      transparent 35%
    );
    background-size: 1rem 1rem;
  }
</style>
