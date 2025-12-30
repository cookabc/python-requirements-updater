/**
 * Status Bar Manager
 */

import * as vscode from 'vscode';
import { t } from './i18n';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right,
            100
        );
        this.statusBarItem.command = 'pyDepsHint.updateAllVersions';
    }
    
    updateStatus(updatesAvailable: number, totalPackages: number) {
        if (updatesAvailable === 0) {
            this.statusBarItem.text = `$(check) ${totalPackages} packages up to date`;
            this.statusBarItem.tooltip = 'All packages are up to date';
            this.statusBarItem.backgroundColor = undefined;
        } else {
            this.statusBarItem.text = `$(warning) ${updatesAvailable} updates available`;
            this.statusBarItem.tooltip = `${updatesAvailable} of ${totalPackages} packages have updates available. Click to update all.`;
            this.statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        }
        
        this.statusBarItem.show();
    }
    
    hide() {
        this.statusBarItem.hide();
    }
    
    dispose() {
        this.statusBarItem.dispose();
    }
}