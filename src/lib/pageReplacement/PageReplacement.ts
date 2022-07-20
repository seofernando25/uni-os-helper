import type { Command } from "./Command";

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
        this.newPage.frameI = this.frameI
    }

    undo() {
        this.oldPage.frameI = this.oldFrameI;
        this.newPage.frameI = this.newPageI;
    }
}

export class AddCommand implements Command {
    oldFrameI: number;

    constructor(public newPage: PageReference, public frameI: number) {
    }

    execute() {
        this.newPage.frameI = this.frameI;
    }

    undo() {
        this.newPage.frameI = this.oldFrameI;
    }
}


export type PageReference = {
    id: number,
    value: any;
    frameI: number;
    extra: any;
}


export type SolverConstructor<T> = new (nFrames: number, pagesArrivalOrder: any[]) => T;


export abstract class PageReplacement {
    public readonly pages: PageReference[];
    public history: Command[] = [];
    public faultHistory: boolean[] = [];

    constructor(public nFrames: number, pagesArrivalOrder: any[]) {
        this.pages = [];
        pagesArrivalOrder.forEach((page, i) => {
            this.pages.push({
                id: i,
                value: page,
                frameI: -1,
                extra: undefined
            });
        });
        this.init();
    }


    protected init() { };

    public abstract getSteps(): Command[];
}