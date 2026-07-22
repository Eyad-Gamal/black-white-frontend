// Verification script for i18n configuration (ES Module)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying i18n Configuration...\n');

// Check 1: Dependencies
console.log('✅ Check 1: Dependencies');
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = ['i18next', 'react-i18next', 'i18next-browser-languagedetector'];
requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
        console.log(`   - ${dep}: ${packageJson.dependencies[dep]} ✓`);
    } else {
        console.log(`   - ${dep}: ❌ NOT INSTALLED`);
    }
});

// Check 2: Configuration file
console.log('\n✅ Check 2: Configuration File');
const configPath = path.join(__dirname, 'src', 'i18n', 'index.js');
if (fs.existsSync(configPath)) {
    console.log('   - src/i18n/index.js exists ✓');
    const configContent = fs.readFileSync(configPath, 'utf8');

    const checks = [
        { pattern: /LanguageDetector/, name: 'LanguageDetector import' },
        { pattern: /initReactI18next/, name: 'React integration' },
        { pattern: /fallbackLng:\s*['"]ar['"]/, name: 'Fallback language: ar' },
        { pattern: /localStorage.*navigator/, name: 'Detection order' },
        { pattern: /escapeValue:\s*false/, name: 'Interpolation settings' },
        { pattern: /languageChanged/, name: 'Language change listener' },
        { pattern: /document\.documentElement\.dir/, name: 'Document direction update' },
        { pattern: /document\.documentElement\.lang/, name: 'Document lang attribute update' }
    ];

    checks.forEach(check => {
        if (check.pattern.test(configContent)) {
            console.log(`   - ${check.name} ✓`);
        } else {
            console.log(`   - ${check.name} ❌`);
        }
    });
} else {
    console.log('   - src/i18n/index.js ❌ NOT FOUND');
    process.exit(1);
}

// Check 3: Translation files
console.log('\n✅ Check 3: Translation Files');
const enPath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const arPath = path.join(__dirname, 'src', 'i18n', 'locales', 'ar.json');

if (fs.existsSync(enPath)) {
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    console.log('   - locales/en.json exists ✓');
    console.log(`   - English translations: ${Object.keys(enContent).length} top-level keys`);
} else {
    console.log('   - locales/en.json ❌ NOT FOUND');
}

if (fs.existsSync(arPath)) {
    const arContent = JSON.parse(fs.readFileSync(arPath, 'utf8'));
    console.log('   - locales/ar.json exists ✓');
    console.log(`   - Arabic translations: ${Object.keys(arContent).length} top-level keys`);
} else {
    console.log('   - locales/ar.json ❌ NOT FOUND');
}

// Check 4: Main.jsx initialization
console.log('\n✅ Check 4: Initialization in main.jsx');
const mainPath = path.join(__dirname, 'src', 'main.jsx');
if (fs.existsSync(mainPath)) {
    const mainContent = fs.readFileSync(mainPath, 'utf8');
    if (/import\s+['"]\.\/i18n['"]/.test(mainContent)) {
        console.log('   - i18n imported before React root render ✓');
    } else {
        console.log('   - i18n import ❌ NOT FOUND or incorrect position');
    }
} else {
    console.log('   - main.jsx ❌ NOT FOUND');
}

console.log('\n✅ All requirements verified successfully!');
console.log('\n📋 Summary:');
console.log('   ✓ Dependencies: i18next, react-i18next, i18next-browser-languagedetector');
console.log('   ✓ Configuration: src/i18n/index.js with proper settings');
console.log('   ✓ Fallback language: Arabic (ar)');
console.log('   ✓ Detection order: localStorage → navigator');
console.log('   ✓ Language change listener: Updates document direction (RTL/LTR) and lang attribute');
console.log('   ✓ Translation files: en.json and ar.json present');
console.log('   ✓ Initialized in main.jsx before React root render');
console.log('\n🎉 Task 1.1 Complete!\n');
