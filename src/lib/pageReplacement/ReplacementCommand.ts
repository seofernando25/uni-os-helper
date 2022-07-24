import type { Command } from "$lib/common/Command";
import type { PageReference } from "./PageReplacement";


export class ReplacementCommand implements Command {
    oldFrameI: number;
    newPageI: number;

    constructor(
        public oldPage: PageReference,
        public newPage: PageReference,
        public frameI: number
    ) {
        this.oldFrameI = oldPage.frameI;
        this.newPageI = newPage.frameI;
    }

    execute() {
        this.oldPage.frameI = this.newPageI;
        this.newPage.frameI = this.frameI;
    }

    undo() {
        this.oldPage.frameI = this.oldFrameI;
        this.newPage.frameI = this.newPageI;
    }
}
