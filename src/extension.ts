/**
 * Extension Entry Point
 * Validates: Requirements 1.1, 1.2, 1.3, 8.1, 8.2, 8.3
 */

import * as vscode from 'vscode';
import { PyDepsCodeLensProvider } from './codeLensProvider';
import { onConfigChange, getConfig } from './configuration';
import { cacheManager } from './cache';
import { parseDocument } from './parser';
import { getLatestCompatible } from './versionService';
import { analyzeVersionUpdate } from './versionAnalyzer';
import { StatusBarManager } from './statusBar';
import { t } from './i18n';

// Debounce timer for file changes
let debounceTimer: NodeJS.Timeout | undefined;
const DEBOUNCE_DELAY = 300; // ms (Requirement 1.3)

export function activate(context: vscode.ExtensionContext): void {
    console.log('py-deps-hint is now active');
    
    // Initialize status bar
    const statusBar = new StatusBarManager();
    context.subscriptions.push(statusBar);
    
    // Register command for updating version
    const updateVersionCommand = vscode.commands.registerCommand(
        'pyDepsHint.updateVersion',
        async (document: vscode.TextDocument, line: number, packageName: string, newVersion: string) => {
            const lineText = document.lineAt(line).text;
            const currentVersionMatch = lineText.match(/==([^\s]+)/);
            const currentVersion = currentVersionMatch ? currentVersionMatch[1] : '';
            
            // Analyze update risk
            const analysis = analyzeVersionUpdate(currentVersion, newVersion);
            
            // Show confirmation for major updates
            if (analysis.riskLevel === 'high') {
                const choice = await vscode.window.showWarningMessage(
                    `⚠️ Major version update detected!\n\n${packageName}: ${currentVersion} → ${newVersion}\n\nThis may include breaking changes. Continue?`,
                    { modal: true },
                    'Update Anyway'
                );
                
                if (choice !== 'Update Anyway') {
                    return;
                }
            }
            
            const edit = new vscode.WorkspaceEdit();
            
            // Find the version part and replace it
            const versionRegex = /==[\d\w\.\-\+]+/;
            const match = lineText.match(versionRegex);
            
            if (match) {
                const range = new vscode.Range(
                    line,
                    match.index!,
                    line,
                    match.index! + match[0].length
                );
                edit.replace(document.uri, range, `==${newVersion}`);
                await vscode.workspace.applyEdit(edit);
                
                vscode.window.showInformationMessage(
                    `${t('updated')} ${packageName} ${t('updateTo')} ${newVersion}`
                );
            }
        }
    );
    
    // Register command for updating all versions
    const updateAllCommand = vscode.commands.registerCommand(
        'pyDepsHint.updateAllVersions',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor || editor.document.languageId !== 'pip-requirements') {
                vscode.window.showErrorMessage(t('openRequirements'));
                return;
            }
            
            const document = editor.document;
            const deps = parseDocument(document.getText());
            
            const edit = new vscode.WorkspaceEdit();
            let safeUpdates = 0;
            let riskyUpdates: Array<{dep: any, currentVersion: string, newVersion: string, analysis: any}> = [];
            
            // First pass: identify safe and risky updates
            for (const dep of deps) {
                try {
                    const versionInfo = await getLatestCompatible(dep.packageName, '', false, 60);
                    if (versionInfo.latestCompatible) {
                        const currentVersion = dep.versionSpecifier.replace(/^==/, '');
                        const newVersion = versionInfo.latestCompatible;
                        
                        if (currentVersion !== newVersion) {
                            const analysis = analyzeVersionUpdate(currentVersion, newVersion);
                            
                            if (analysis.riskLevel === 'high') {
                                // Risky update - collect for confirmation
                                riskyUpdates.push({ dep, currentVersion, newVersion, analysis });
                            } else {
                                // Safe update - add to edit
                                const lineText = document.lineAt(dep.line).text;
                                const versionRegex = /==[\d\w\.\-\+]+/;
                                const match = lineText.match(versionRegex);
                                
                                if (match) {
                                    const range = new vscode.Range(
                                        dep.line,
                                        match.index!,
                                        dep.line,
                                        match.index! + match[0].length
                                    );
                                    edit.replace(document.uri, range, `==${newVersion}`);
                                    safeUpdates++;
                                }
                            }
                        }
                    }
                } catch {
                    // Skip failed packages
                }
            }
            
            // Handle risky updates with confirmation
            let confirmedRiskyUpdates = 0;
            if (riskyUpdates.length > 0) {
                const riskyList = riskyUpdates.map(u => 
                    `• ${u.dep.packageName}: ${u.currentVersion} → ${u.newVersion} (Major)`
                ).join('\n');
                
                const choice = await vscode.window.showWarningMessage(
                    `⚠️ Found ${riskyUpdates.length} major version update(s) that may include breaking changes:\n\n${riskyList}\n\nHow would you like to proceed?`,
                    { modal: true },
                    'Update Safe Only',
                    'Update All (Including Risky)',
                    'Cancel'
                );
                
                if (choice === 'Cancel') {
                    return;
                } else if (choice === 'Update All (Including Risky)') {
                    // Add risky updates to edit
                    for (const update of riskyUpdates) {
                        const lineText = document.lineAt(update.dep.line).text;
                        const versionRegex = /==[\d\w\.\-\+]+/;
                        const match = lineText.match(versionRegex);
                        
                        if (match) {
                            const range = new vscode.Range(
                                update.dep.line,
                                match.index!,
                                update.dep.line,
                                match.index! + match[0].length
                            );
                            edit.replace(document.uri, range, `==${update.newVersion}`);
                            confirmedRiskyUpdates++;
                        }
                    }
                }
                // If 'Update Safe Only', we don't add risky updates to edit
            }
            
            const totalUpdates = safeUpdates + confirmedRiskyUpdates;
            
            if (totalUpdates > 0) {
                await vscode.workspace.applyEdit(edit);
                
                let message = `${t('updated')} ${totalUpdates} ${t('packages')}`;
                if (riskyUpdates.length > 0 && confirmedRiskyUpdates === 0) {
                    message += ` (${riskyUpdates.length} major updates skipped)`;
                }
                
                vscode.window.showInformationMessage(message);
            } else {
                vscode.window.showInformationMessage(t('noUpdates'));
            }
        }
    );
    
    // Register command for showing up-to-date status (no-op, just for styling)
    const showUpToDateCommand = vscode.commands.registerCommand(
        'pyDepsHint.showUpToDate',
        (packageName: string, version: string) => {
            // This is just for styling purposes, no action needed
        }
    );
    
    context.subscriptions.push(showUpToDateCommand);
    
    // Register CodeLens Provider for version information and updates
    const selector: vscode.DocumentSelector = {
        language: 'pip-requirements',
        scheme: 'file'
    };
    
    const codeLensProvider = new PyDepsCodeLensProvider();
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        selector,
        codeLensProvider
    );
    
    context.subscriptions.push(codeLensDisposable);
    
    // Handle document changes with debounce (Requirement 1.2, 1.3)
    const changeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'pip-requirements') {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            
            debounceTimer = setTimeout(async () => {
                // Refresh CodeLens
                codeLensProvider.refresh();
                
                // Update status bar
                await updateStatusBar(event.document, statusBar);
            }, DEBOUNCE_DELAY);
        }
    });
    
    context.subscriptions.push(changeDisposable);
    
    // Handle configuration changes
    const configDisposable = onConfigChange(() => {
        // Refresh CodeLens when config changes
        codeLensProvider.refresh();
    });
    
    context.subscriptions.push(configDisposable);
}

export function deactivate(): void {
    // Clear debounce timer
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    // Clear cache
    cacheManager.clear();
}

// Helper function to update status bar
async function updateStatusBar(document: vscode.TextDocument, statusBar: StatusBarManager) {
    const config = getConfig();
    if (!config.enabled) {
        statusBar.hide();
        return;
    }
    
    const deps = parseDocument(document.getText());
    let updatesAvailable = 0;
    
    for (const dep of deps) {
        try {
            const versionInfo = await getLatestCompatible(dep.packageName, '', false, config.cacheTTLMinutes);
            if (versionInfo.latestCompatible) {
                const currentVersion = dep.versionSpecifier.replace(/^==/, '');
                if (currentVersion !== versionInfo.latestCompatible) {
                    updatesAvailable++;
                }
            }
        } catch {
            // Skip failed packages
        }
    }
    
    statusBar.updateStatus(updatesAvailable, deps.length);
}
