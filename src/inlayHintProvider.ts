/**
 * Inlay Hint Provider for requirements.txt
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5
 */

import * as vscode from 'vscode';
import { parseDocument } from './parser';
import { getLatestCompatible } from './versionService';
import { getConfig } from './configuration';

export class PyDepsInlayHintProvider implements vscode.InlayHintsProvider {
    async provideInlayHints(
        document: vscode.TextDocument,
        range: vscode.Range,
        token: vscode.CancellationToken
    ): Promise<vscode.InlayHint[]> {
        const config = getConfig();
        
        // Check if extension is enabled
        if (!config.enabled) {
            return [];
        }
        
        const hints: vscode.InlayHint[] = [];
        const dependencies = parseDocument(document.getText());
        
        // Process dependencies in parallel
        const promises = dependencies.map(async dep => {
            if (token.isCancellationRequested) {
                return null;
            }
            
            try {
                // 获取最新版本（无约束），让用户知道有没有更新
                const versionInfo = await getLatestCompatible(
                    dep.packageName,
                    '', // 不传约束，获取最新版本
                    config.showPrerelease,
                    config.cacheTTLMinutes
                );
                
                // Skip if not found or fetch error (Requirements 5.3, 5.4)
                if (versionInfo.error === 'not-found' || versionInfo.error === 'fetch-error') {
                    return null;
                }
                
                // Format hint text
                let hintText: string;
                if (versionInfo.error === 'no-compatible-version') {
                    hintText = '⟶ no versions available';
                } else {
                    hintText = `⟶ latest: ${versionInfo.latestCompatible}`;
                }
                
                // Position at end of line (Requirement 5.5)
                const position = new vscode.Position(dep.line, dep.endColumn);
                
                const hint = new vscode.InlayHint(position, hintText, vscode.InlayHintKind.Parameter);
                hint.paddingLeft = true;
                
                return hint;
            } catch {
                // Fail silently (Requirement 8.1)
                return null;
            }
        });
        
        const results = await Promise.all(promises);
        
        for (const hint of results) {
            if (hint) {
                hints.push(hint);
            }
        }
        
        return hints;
    }
}
