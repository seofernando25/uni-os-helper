import { Container, ContainerModule } from "inversify";
import {
    buildProviderModule,
    fluentProvide,
} from "inversify-binding-decorators";

export function singleton(identifier: any): ClassDecorator {
    return fluentProvide(identifier).inSingletonScope().done();
}

var container: Container = new Container();

export function setDI(modules: ContainerModule) {
    container.load(modules);
}

export function DI(): Container {
    return container;
}
