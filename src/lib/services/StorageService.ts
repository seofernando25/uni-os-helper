import { fluentProvide, provide } from "inversify-binding-decorators";
import { get, writable, type Subscriber, type Unsubscriber, type Writable } from "svelte/store";
import { singleton } from "../di-utils";


@singleton(StorageService)
class StorageService {
    private stores: Map<string, Writable<any>> = new Map();

    constructor() {
        // Load all the items from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            this.stores.set(key, writable(localStorage.getItem(key)));
        }
    }

    getItem(key: string): any {
        // Check if the store exists
        if (!this.stores.has(key)) {
            let value = this.stores.get(key);
            return get(value as Writable<any>);
        }
        let value = localStorage.getItem(key);
        if (value) {
            return value;
        }
        return null;
    }

    setItem(key: string, value: string): void {
        // Check if the store exists
        if (!this.stores.has(key)) {
            this.stores.set(key, writable(value));
        } else {
            let store = this.stores.get(key);
            (store as Writable<any>).set(value);
        }
        localStorage.setItem(key, value);
    }

    subscribe(key: string, callback: Subscriber<any>): Unsubscriber {
        // Check if the store exists
        if (!this.stores.has(key)) {
            let value = this.stores.get(key);
            return get(value as Writable<any>).subscribe(callback);
        }
        // Key doesn't exist, so create it
        this.stores.set(key, writable(localStorage.getItem(key)));
        return this.subscribe(key, callback);
    }
}

export default StorageService;