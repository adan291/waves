#!/usr/bin/env node

/**
 * Specs Registry Validator
 * 
 * Validates that all specs registered in registry.json have their required files.
 * Usage: node validate_specs.js
 * Exit codes: 0 = all OK, 1 = missing files found
 */

const fs = require('fs');
const path = require('path');

// Paths
const REGISTRY_PATH = path.join(__dirname, '../registry.json');
const SPECS_BASE_DIR = path.join(__dirname, '../../');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSpecs() {
  // Read registry
  if (!fs.existsSync(REGISTRY_PATH)) {
    log('❌ registry.json not found!', 'red');
    return false;
  }

  let registry;
  try {
    const registryContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
    registry = JSON.parse(registryContent);
  } catch (error) {
    log(`❌ Error reading registry.json: ${error.message}`, 'red');
    return false;
  }

  if (!Array.isArray(registry)) {
    log('❌ registry.json must be an array', 'red');
    return false;
  }

  log('\n🔍 Validating specs registry...\n', 'cyan');

  let allValid = true;
  let totalSpecs = 0;
  let validSpecs = 0;

  // Validate each spec
  for (const spec of registry) {
    totalSpecs++;
    log(`📋 Spec: ${spec.title} (${spec.id})`, 'cyan');
    
    const specPath = path.join(SPECS_BASE_DIR, spec.id);
    
    // Check if spec directory exists
    if (!fs.existsSync(specPath)) {
      log(`  ❌ Directory not found: ${specPath}`, 'red');
      allValid = false;
      continue;
    }

    // Check each required file
    const files = spec.files || {};
    const fileKeys = Object.keys(files);
    
    if (fileKeys.length === 0) {
      log(`  ⚠️  No files defined in registry`, 'yellow');
    }

    let specValid = true;
    const missingFiles = [];

    for (const [fileType, fileName] of Object.entries(files)) {
      const filePath = path.join(specPath, fileName);
      
      if (fs.existsSync(filePath)) {
        log(`  ✅ ${fileType}: ${fileName}`, 'green');
      } else {
        log(`  ❌ ${fileType}: ${fileName} (MISSING)`, 'red');
        missingFiles.push(fileName);
        specValid = false;
        allValid = false;
      }
    }

    if (specValid) {
      log(`  ✅ All files present\n`, 'green');
      validSpecs++;
    } else {
      log(`  ❌ Missing: ${missingFiles.join(', ')}\n`, 'red');
    }
  }

  // Summary
  log('─'.repeat(50), 'cyan');
  log(`\n📊 Summary:`, 'cyan');
  log(`   Total specs: ${totalSpecs}`);
  log(`   Valid specs: ${validSpecs}`, validSpecs === totalSpecs ? 'green' : 'yellow');
  log(`   Invalid specs: ${totalSpecs - validSpecs}`, totalSpecs - validSpecs === 0 ? 'green' : 'red');

  if (allValid) {
    log('\n✅ All specs are valid!\n', 'green');
  } else {
    log('\n❌ Some specs have missing files. Please fix them.\n', 'red');
  }

  return allValid;
}

// Run validation
const isValid = validateSpecs();
process.exit(isValid ? 0 : 1);
