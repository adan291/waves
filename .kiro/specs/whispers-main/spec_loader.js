/**
 * Spec Loader
 * 
 * Dynamically loads and manages spec adapters.
 * Provides a central registry for all available specs.
 */

const fs = require('fs');
const path = require('path');

class SpecLoader {
  constructor(options = {}) {
    this.specsBasePath = options.specsBasePath || path.join(__dirname, '..');
    this.registryPath = options.registryPath || path.join(__dirname, 'registry.json');
    
    this.adapters = new Map();
    this.registry = null;
    
    this._initialize();
  }

  /**
   * Initialize loader by reading registry and loading adapters
   * @private
   */
  _initialize() {
    try {
      // Load registry
      if (!fs.existsSync(this.registryPath)) {
        throw new Error(`Registry not found at ${this.registryPath}`);
      }
      
      this.registry = JSON.parse(fs.readFileSync(this.registryPath, 'utf8'));
      
      // Load adapters for active specs
      this._loadAdapters();
      
    } catch (error) {
      throw new Error(`Failed to initialize SpecLoader: ${error.message}`);
    }
  }

  /**
   * Load all adapters from registry
   * @private
   */
  _loadAdapters() {
    const activeSpecs = this.registry.filter(spec => spec.status === 'active');
    
    for (const spec of activeSpecs) {
      try {
        this._loadAdapter(spec);
      } catch (error) {
        console.warn(`Warning: Failed to load adapter for spec "${spec.id}": ${error.message}`);
      }
    }
  }

  /**
   * Load a single adapter
   * @private
   */
  _loadAdapter(spec) {
    const adapterPath = path.join(this.specsBasePath, spec.id, 'adapter.js');
    
    if (!fs.existsSync(adapterPath)) {
      throw new Error(`Adapter not found at ${adapterPath}`);
    }

    // Require the adapter
    const AdapterClass = require(adapterPath);
    
    // Instantiate the adapter
    const adapter = new AdapterClass();
    
    // Verify it has the correct ID
    if (adapter.getId() !== spec.id) {
      throw new Error(`Adapter ID mismatch: expected "${spec.id}", got "${adapter.getId()}"`);
    }

    // Store in map
    this.adapters.set(spec.id, adapter);
    
    console.log(`✅ Loaded adapter: ${spec.id}`);
  }

  /**
   * Get adapter for a specific spec
   * 
   * @param {string} specId - Spec ID
   * @returns {Object|null} Adapter instance or null if not found
   */
  getSpecAdapter(specId) {
    return this.adapters.get(specId) || null;
  }

  /**
   * Get all loaded adapters
   * 
   * @returns {Map} Map of spec ID to adapter instance
   */
  getAllAdapters() {
    return this.adapters;
  }

  /**
   * Check if adapter exists for spec
   * 
   * @param {string} specId - Spec ID
   * @returns {boolean} True if adapter exists
   */
  hasAdapter(specId) {
    return this.adapters.has(specId);
  }

  /**
   * Get capabilities for a spec
   * 
   * @param {string} specId - Spec ID
   * @returns {Object|null} Capabilities object or null
   */
  getCapabilities(specId) {
    const adapter = this.getSpecAdapter(specId);
    return adapter ? adapter.getCapabilities() : null;
  }

  /**
   * Get all capabilities
   * 
   * @returns {Object} Map of spec ID to capabilities
   */
  getAllCapabilities() {
    const capabilities = {};
    
    for (const [specId, adapter] of this.adapters) {
      capabilities[specId] = adapter.getCapabilities();
    }
    
    return capabilities;
  }

  /**
   * Process a request with the appropriate adapter
   * 
   * @param {Object} request - SpecRequest object
   * @returns {Promise<Object>} SpecResponse object
   */
  async processRequest(request) {
    const adapter = this.getSpecAdapter(request.spec);
    
    if (!adapter) {
      throw new Error(`No adapter found for spec: ${request.spec}`);
    }

    // Check if adapter can handle the request
    const canHandleResult = adapter.canHandle(request);
    
    if (!canHandleResult.canHandle) {
      throw new Error(`Adapter cannot handle request: ${canHandleResult.reason}`);
    }

    // Process the request
    return await adapter.process(request);
  }

  /**
   * Reload a specific adapter (useful for development)
   * 
   * @param {string} specId - Spec ID to reload
   */
  reloadAdapter(specId) {
    const spec = this.registry.find(s => s.id === specId);
    
    if (!spec) {
      throw new Error(`Spec not found in registry: ${specId}`);
    }

    // Clear from cache
    const adapterPath = path.join(this.specsBasePath, spec.id, 'adapter.js');
    delete require.cache[require.resolve(adapterPath)];
    
    // Remove from map
    this.adapters.delete(specId);
    
    // Reload
    this._loadAdapter(spec);
    
    console.log(`🔄 Reloaded adapter: ${specId}`);
  }

  /**
   * Reload all adapters
   */
  reloadAll() {
    // Clear all from cache
    for (const [specId] of this.adapters) {
      const spec = this.registry.find(s => s.id === specId);
      if (spec) {
        const adapterPath = path.join(this.specsBasePath, spec.id, 'adapter.js');
        delete require.cache[require.resolve(adapterPath)];
      }
    }
    
    // Clear map
    this.adapters.clear();
    
    // Reload all
    this._loadAdapters();
    
    console.log('🔄 Reloaded all adapters');
  }

  /**
   * Get registry
   * 
   * @returns {Array} Registry array
   */
  getRegistry() {
    return this.registry;
  }

  /**
   * Get active specs
   * 
   * @returns {Array} Array of active spec objects
   */
  getActiveSpecs() {
    return this.registry.filter(spec => spec.status === 'active');
  }
}

// Singleton instance
let loaderInstance = null;

/**
 * Get the singleton SpecLoader instance
 * 
 * @param {Object} options - Options for SpecLoader (only used on first call)
 * @returns {SpecLoader} SpecLoader instance
 */
function getSpecLoader(options = {}) {
  if (!loaderInstance) {
    loaderInstance = new SpecLoader(options);
  }
  return loaderInstance;
}

/**
 * Get adapter for a specific spec (convenience function)
 * 
 * @param {string} specId - Spec ID
 * @returns {Object|null} Adapter instance or null
 */
function getSpecAdapter(specId) {
  const loader = getSpecLoader();
  return loader.getSpecAdapter(specId);
}

/**
 * Process a request (convenience function)
 * 
 * @param {Object} request - SpecRequest object
 * @returns {Promise<Object>} SpecResponse object
 */
async function processRequest(request) {
  const loader = getSpecLoader();
  return await loader.processRequest(request);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SpecLoader,
    getSpecLoader,
    getSpecAdapter,
    processRequest
  };
}

// CLI usage
if (require.main === module) {
  const loader = getSpecLoader();
  
  console.log('\n📦 Spec Loader Status\n');
  console.log('Loaded Adapters:');
  
  for (const [specId, adapter] of loader.getAllAdapters()) {
    const capabilities = adapter.getCapabilities();
    console.log(`\n  ✅ ${specId}`);
    console.log(`     Name: ${capabilities.name}`);
    console.log(`     Contract: ${capabilities.contract_version}`);
    console.log(`     Intents: ${capabilities.supported_intents.length}`);
  }
  
  console.log('\n');
}
