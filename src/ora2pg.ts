'use strict';
import * as cp from 'child_process';
import { resolve } from 'path';
import * as vscode from 'vscode';
import { logger } from './logger';


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
        logger.logInfo('version:' + this.version);   
        return true;
    }

    public get version() {
        return this._version;
    }
    public get ora2pg() {
        return this._ora2pg;
    }

    public async runCommandWithOutput(args: string[])
    {
        logger.logInfo('Starting Assesment');

        let output: string = "";
        const ora2pg = cp.spawn(this._ora2pg, args, {env: process.env});

        ora2pg.stdout.on('data', (chunk) => { output += chunk; });
        ora2pg.stderr.on('data', (chunk) => { 
            logger.LogAlways(chunk.toString());
            this._outputChannel.appendLine(chunk);
        });

        ora2pg.on('close', () => {
            vscode.window.createWebviewPanel("Ora2Pg Report", "Ora2Pg Report", vscode.ViewColumn.One).webview.html = output;
        });
    }
}