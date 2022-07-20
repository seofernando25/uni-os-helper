import type { Container } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

export function singleton(identifier: any): ClassDecorator {
    return fluentProvide(identifier)
        .inSingletonScope()
        .done();
}


var container: Container;

export function setDI(c: Container): void {
    container = c;
}

export function DI(): Container {
    return container;
}
