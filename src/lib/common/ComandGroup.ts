import type { Command } from "./Command";

export class ComandGroup {
    public commands: Command[] = [];

    public execute() {
        this.commands.forEach((command) => command.execute());
    }

    public undo() {
        let reversedCommands = this.commands.slice().reverse();
        reversedCommands.forEach((command) => command.undo());
    }
}
