// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as vscode from 'vscode';
import * as Constants from './constants';

/**
 * Simple extension logger class.
 */
class ExtensionLogger {
    /**
     * Initializes a new instance of the extension logger with provided output channel and
     * minimum logging level.
     * @param _outputChannel Output channel to log messages to.
     * @param _logLevel Minimum severity level to log.
     */
    constructor(
        private readonly _outputChannel: vscode.OutputChannel,
        private readonly _logLevel: MessageSeverity) { }

    /**
     * Gets the current output channel.
     */
    public get outputChannel(): vscode.OutputChannel {
        return this._outputChannel;
    }

    /**
     * Writes given message to the log stream.
     * @param severity Message severity.
     * @param message Message text.
     */
    public logMessage(severity: MessageSeverity, message: string): string {
        if (severity >= this._logLevel) {
            this.outputChannel.appendLine(`[${this.getSeverityLabel(severity)} - ${(new Date().toLocaleTimeString())}] ${message}`);
        }

        return message;
    }

    /**
     * Writes a debug message to the log stream.
     * @param message Message text.
     */
    public logDebug(message: string): string {
        return this.logMessage(MessageSeverity.Debug, message);
    }

    /**
     * Writes an informational message to the log stream.
     * @param message Message text.
     */
    public logInfo(message: string): string {
        return this.logMessage(MessageSeverity.Info, message);
    }

    /**
     * Writes a warning message to the log stream.
     * @param message Message text.
     */
    public logWarning(message: string): string {
        return this.logMessage(MessageSeverity.Warning, message);
    }

    /**
     * Writes an error message to the log stream.
     * @param message Message text.
     */
    public logError(message: string): string {
        return this.logMessage(MessageSeverity.Error, message);
    }

    /**
     * Writes an error message from the exception to the log stream.
     * @param error An exception that was caught.
     */
    public logException(error: any): string {
        return this.logMessage(MessageSeverity.Error, error.message ?? error);
    }

    /**
     * Gets the string label that represents the given severity level.
     * @param severity Message severity level.
     */
    private getSeverityLabel(severity: MessageSeverity): string {
        switch (severity) {
            case MessageSeverity.Error:
                return "Error";
            case MessageSeverity.Warning:
                return "Warn";
            case MessageSeverity.Info:
                return "Info";
            case MessageSeverity.Debug:
                return "Debug";
            default:
                return severity;
        }
    }
}

/**
 * Severity level of the log message.
 */
export enum MessageSeverity {
    /**
     * Debugging message.
     */
    Debug,

    /**
     * Informational message.
     */
    Info,

    /**
     * Warning message.
     */
    Warning,

    /**
     * Error message.
     */
    Error,
}

/**
 * Default logger instance.
 */
export const logger =
    new ExtensionLogger(
        vscode.window.createOutputChannel(Constants.extensionName),
        MessageSeverity.Info);