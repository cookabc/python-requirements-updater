/**
 * Extension Entry Point
 * Validates: Requirements 1.1, 1.2, 1.3, 8.1, 8.2, 8.3
 */

import * as vscode from 'vscode';
import { PyDepsInlayHintProvider } from './inlayHintProvider';
import { onConfigChange } from './configuration';
import { cacheManager } from './cache';

// Debounce timer for file changes
let debounceTimer: NodeJS.Timeout | undefined;
const DEBOUNCE_DELAY = 300; // ms (Requirement 1.3)

export function activate(context: vscode.ExtensionContext): void {
    console.log('py-deps-hint is now active');
    
    // Register Inlay Hint Provider for requirements.txt files
    const selector: vscode.DocumentSelector = {
        language: 'pip-requirements',
        scheme: 'file'
    };
    
    const provider = new PyDepsInlayHintProvider();
    
    const providerDisposable = vscode.languages.registerInlayHintsProvider(
        selector,
        provider
    );
    
    context.subscriptions.push(providerDisposable);
    
    // Handle document changes with debounce (Requirement 1.2, 1.3)
    const changeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'pip-requirements') {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            
            debounceTimer = setTimeout(() => {
                // Trigger inlay hints refresh
                vscode.commands.executeCommand('editor.action.inlayHints.refresh');
            }, DEBOUNCE_DELAY);
        }
    });
    
    context.subscriptions.push(changeDisposable);
    
    // Handle configuration changes
    const configDisposable = onConfigChange(() => {
        // Refresh hints when config changes
        vscode.commands.executeCommand('editor.action.inlayHints.refresh');
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
