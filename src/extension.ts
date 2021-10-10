'use strict';
import * as vscode from 'vscode';
import * as azdata from 'azdata';
import { Ora2pg } from './ora2pg';

let isActivated = false;

export async function activate(context: vscode.ExtensionContext) {

    if (isActivated) {
        return;
    }

    const ora2pg = await createExtension(context);
    context.subscriptions.push(vscode.commands.registerCommand('adsora2pg.runOra2PgAssesment', async () => {
        vscode.window.showInformationMessage(ora2pg.ora2pg);
        const args: string[] = [];

        args.push('-u', 'system');
        args.push('-w', 'Yukon!900');
        args.push('-t', 'SHOW_REPORT');
        args.push('--dump_as_html');

        ora2pg.debug(args.toString());
        ora2pg.debug('starting command');

        await ora2pg.runCommandWithOutput(args);
    }));

    context.subscriptions.push(vscode.commands.registerCommand('adsora2pg.runOra2PgConversion', () => {
        vscode.window.showInformationMessage('In Conversion Command');
    }));

    isActivated = true;
}

async function createExtension(context: vscode.ExtensionContext) : Promise<Ora2pg> {
    const ora2pg = new Ora2pg();
    await ora2pg.init();
    return ora2pg;
}

// this method is called when your extension is deactivated
export function deactivate() {
}