'use strict';
import * as cp from 'child_process';
import { resolve } from 'path';
import * as vscode from 'vscode';


var which = require('which');

export class Ora2pg {
    private _ora2pg: string;
    private _version: string;
    private _outputChannel: vscode.OutputChannel;

    constructor() {
        this._ora2pg = 'NA';
        this._outputChannel = vscode.window.createOutputChannel('Ora2Pg Output');
        this._version = 'NA';
    }
    
    public async init():Promise<Ora2pg> {
        this._ora2pg = which.sync('ora2pg' , {nothrow: true});
        this._version = cp.execSync(this.ora2pg + ' -v').toString().trim();
        return this;
    }

    public runCommand(args: string[]): boolean 
    {
        this.debug('version:' + this.version);
        return true;
    }

    public get version() {
        return this._version;
    }
    public get ora2pg() {
        return this._ora2pg;
    }

    public debug(line: string) {
        this._outputChannel.appendLine(line);
    }

    public async runCommandWithOutput(args: string[])
    {
        this._outputChannel.show();
        this._outputChannel.appendLine('Starting Assesment');

        let output: string = "";
        const ora2pg = cp.spawn(this._ora2pg, args, {env: process.env});

        ora2pg.stdout.on('data', (chunk) => { output += chunk; });
        ora2pg.stderr.on('data', (chunk) => { 
            this.debug(chunk.toString());
            this._outputChannel.appendLine(chunk);
        });

        ora2pg.on('close', () => {
            vscode.window.createWebviewPanel("Ora2Pg Report", "Ora2Pg Report", vscode.ViewColumn.One).webview.html = output;
        });
    }
}