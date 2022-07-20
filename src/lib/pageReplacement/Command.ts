import type { PageReference } from "./PageReplacement";


export interface Command {
    execute(): void;
    undo(): void;
}


export class ComandGroup {
    public commands: Command[] = [];


    public execute() {
        this.commands.forEach(command => command.execute());
    }

    public undo() {
        let reversedCommands = this.commands.slice().reverse();
        reversedCommands.forEach(command => command.undo());
    }
}

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