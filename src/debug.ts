/**
 * Debug script to test parsing and version resolution
 */

import { parseDocument } from './parser';
import { getLatestCompatible } from './versionService';

const testContent = `bcrypt==4.3.0
certifi==2025.8.3
fastapi==0.116.1
httpx==0.28.1
matplotlib==3.10.6
numpy==2.3.2
oss2==2.19.1
openai==1.104.2
pandas==2.3.2
psycopg2-binary==2.9.10
pydantic==2.11.7
PyJWT==2.8.0
python-multipart==0.0.20
requests==2.32.5
scikit-learn==1.7.1
scipy==1.16.1
sqlalchemy==2.0.43
tencentcloud-sdk-python==3.0.1468
tencentcloud-sdk-python-aiart==3.0.1426
uvicorn[standard]==0.35.0
zai-sdk==0.0.3.4`;

async function main() {
    console.log('=== Testing Parser ===\n');
    
    const deps = parseDocument(testContent);
    
    for (const dep of deps) {
        console.log(`Line ${dep.line}: ${dep.packageName} | specifier: "${dep.versionSpecifier}"`);
    }
    
    console.log(`\nTotal dependencies: ${deps.length}`);
    
    console.log('\n=== Testing Version Resolution (all packages) ===\n');
    
    for (const dep of deps) {
        console.log(`Fetching ${dep.packageName}...`);
        // 测试无约束时返回最新版本
        const resultNoConstraint = await getLatestCompatible(dep.packageName, '', false, 60);
        const resultWithConstraint = await getLatestCompatible(dep.packageName, dep.versionSpecifier, false, 60);
        
        if (resultNoConstraint.error) {
            console.log(`  Error: ${resultNoConstraint.error}`);
        } else {
            const current = dep.versionSpecifier.replace('==', '');
            const latest = resultNoConstraint.latestCompatible;
            const compatible = resultWithConstraint.latestCompatible;
            console.log(`  Current: ${current} | Latest: ${latest} | Compatible: ${compatible}`);
        }
    }
}

main().catch(console.error);
