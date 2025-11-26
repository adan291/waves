/**
 * Performance Configuration
 * Configure logging, caching, and monitoring behavior
 * 
 * Copy this file to js/config.local.js and customize
 */

// Environment detection
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';

// Configure Logger
if (typeof Logger !== 'undefined') {
    // Development: Show all logs
    // Production: Only warnings and errors
    Logger.setLevel(isDevelopment ? 'DEBUG' : 'WARN');
    
    // Enable persistence in development
    Logger.enablePersistence(isDevelopment);
    
    console.log(`📝 Logger configured for ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
}

// Configure Cache
if (typeof CacheManager !== 'undefined') {
    CacheManager.configure({
        enableMemoryCache: true,
        enablePersistentCache: true,
        defaultTTL: isDevelopment ? 2 * 60 * 1000 : 5 * 60 * 1000, // 2min dev, 5min prod
        maxMemorySize: 50
    });
    
    console.log('💾 Cache configured');
}

// Configure Performance Monitor
if (typeof PerformanceMonitor !== 'undefined') {
    // Enable in development, disable in production for performance
    if (isDevelopment) {
        PerformanceMonitor.enable();
        console.log('📊 Performance monitoring enabled');
    } else {
        PerformanceMonitor.disable();
    }
}

// Configure Storage Optimizer
if (typeof StorageOptimizer !== 'undefined') {
    // Compression always enabled
    console.log('💿 Storage optimizer ready');
}

// Development helpers
if (isDevelopment) {
    // Add global shortcuts for debugging
    window.showStats = function() {
        console.group('📊 Application Statistics');
        
        if (typeof PerformanceMonitor !== 'undefined') {
            console.log('Performance:', PerformanceMonitor.getReport());
        }
        
        if (typeof CacheManager !== 'undefined') {
            console.log('Cache:', CacheManager.getStats());
        }
        
        if (typeof StorageOptimizer !== 'undefined') {
            console.log('Storage:', StorageOptimizer.getStats());
        }
        
        if (typeof Logger !== 'undefined') {
            console.log('Logs:', Logger.getLogs().length, 'entries');
        }
        
        console.groupEnd();
    };
    
    window.clearAll = function() {
        if (confirm('Clear all cache, logs, and metrics?')) {
            if (typeof CacheManager !== 'undefined') CacheManager.clear();
            if (typeof Logger !== 'undefined') Logger.clearLogs();
            if (typeof PerformanceMonitor !== 'undefined') PerformanceMonitor.clear();
            console.log('✅ All cleared');
        }
    };
    
    console.log('🛠️ Development helpers loaded:');
    console.log('  - showStats() - Show all statistics');
    console.log('  - clearAll() - Clear cache, logs, and metrics');
}
