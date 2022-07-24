import type { Command } from "$lib/common/Command";
import type { PageReference } from "./PageReplacement";


export class SetExtraCommand implements Command {
    previousExtra: any;

    constructor(public pageRef: PageReference, public extra: any = null) {
        this.previousExtra = this.pageRef.extra;
    }

    public execute() {
        this.pageRef.extra = this.extra;
    }

    public undo() {
        this.pageRef.extra = this.previousExtra;
    }
}
