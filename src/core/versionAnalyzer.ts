/**
 * Version Analysis utilities
 */

import type { VersionAnalysis } from '../types';

/**
 * Analyze version difference and risk level
 */
export function analyzeVersionUpdate(current: string, latest: string): VersionAnalysis {
    const currentParts = parseVersionParts(current);
    const latestParts = parseVersionParts(latest);
    
    let updateType: 'patch' | 'minor' | 'major' = 'patch';
    let isBreakingChange = false;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (currentParts.major !== latestParts.major) {
        updateType = 'major';
        isBreakingChange = true;
        riskLevel = 'high';
    } else if (currentParts.minor !== latestParts.minor) {
        updateType = 'minor';
        riskLevel = 'medium';
    } else {
        updateType = 'patch';
        riskLevel = 'low';
    }
    
    return {
        currentVersion: current,
        latestVersion: latest,
        updateType,
        isBreakingChange,
        riskLevel
    };
}

function parseVersionParts(version: string): { major: number; minor: number; patch: number } {
    const cleanVersion = version.replace(/[^\d\.]/g, '');
    const parts = cleanVersion.split('.').map(p => parseInt(p, 10) || 0);
    
    return {
        major: parts[0] || 0,
        minor: parts[1] || 0,
        patch: parts[2] || 0
    };
}