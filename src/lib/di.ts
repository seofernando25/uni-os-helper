import { Container } from "inversify";
import { buildProviderModule, fluentProvide } from "inversify-binding-decorators";

export function singleton(identifier: any): ClassDecorator {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
}




var container: Container = new Container();
container.load(buildProviderModule());

export function DI(): Container {
    return container;
}

