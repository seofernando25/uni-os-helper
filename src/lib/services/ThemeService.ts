import { inject } from "inversify";
import { get, writable, type Subscriber, type Unsubscriber, type Writable } from "svelte/store";
import { singleton } from "../di-utils";
import StorageService from "./StorageService";
import { themes } from "../themesList.js";

@singleton(ThemeService)
export class ThemeService {

    private theme: Writable<string> = writable();

    constructor(@inject(StorageService) private storage: StorageService) {

        const theme = storage.getItem('theme') ?? "dark";
        this.theme.set(theme);
    }

    onThemeChange(callback: Subscriber<string>): Unsubscriber {
        return this.theme.subscribe(callback);
    }

    getTheme(): string {
        return get(this.theme);
    }

    setTheme(theme: string): void {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        this.theme.set(theme);
    }

    availableThemes(): string[] {
        return themes;
    }
}
