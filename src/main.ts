import 'reflect-metadata'
import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

import "./app.css";
import HMR from "@roxi/routify/hmr";
import App from "./App.svelte";
import { DI, setDI } from './lib/di-utils';

let container = new Container();
container.load(buildProviderModule());
setDI(container);

const app = HMR(App, { target: document.body }, "app");

export default app;