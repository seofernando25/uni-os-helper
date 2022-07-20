<script lang="ts">
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { DI } from "./lib/di-utils";
  import { ThemeService } from "./lib/services/ThemeService";

  let theme: ThemeService = DI().get(ThemeService);

  // let themes = theme.availableThemes();
  theme.setTheme("dark");
</script>

<Router {routes} />
