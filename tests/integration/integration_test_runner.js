#!/usr/bin/env node

/**
 * Integration Test Runner
 * Tests the complete spec system with real inputs
 */

const fs = require('fs');
const path = require('path');

// Import spec system components
const FeatureRouter = require('../.kiro/specs/whispers-main/router.js');
const { getSpecLoader } = require('../.kiro/specs/whispers-main/spec_loader.js');

// Test inputs
const TEST_INPUTS = [
    "No sé qué estudiar",
    "Me siento muy triste últimamente",
    "¿Qué debería estudiar, diseño o programación?",
    "Cuéntame una escena de la orilla",
    "Necesito orientacion profesional",
    "Estoy estresado y no puedo dormir",
    "Quiero dejar esto por ahora",
    "Ayúdame a decidir entre A y B",
    "No sé si esto tiene sentido",
    "Gracias, eso ayudó"
];

class IntegrationTestRunner {
    constructor() {
        this.router = null;
        this.loader = null;
        this.results = [];
        this.errors = [];
        this.startTime = Date.now();
    }

    /**
     * Initialize test environment
     */
    async initialize() {
        console.log('🔧 Initializing test environment...\n');
        
        try {
            this.router = new FeatureRouter();
            this.loader = getSpecLoader();
            
            console.log('✅ Router initialized');
            console.log('✅ Spec loader initialized');
            console.log(`✅ Loaded ${this.loader.getAllAdapters().size} adapters\n`);
            
            return true;
        } catch (error) {
            console.error('❌ Initialization failed:', error.message);
            this.errors.push({
                phase: 'initialization',
                error: error.message,
                stack: error.stack
            });
            return false;
        }
    }

    /**
     * Run a single test
     */
    async runTest(input, index) {
        const testNumber = index + 1;
        console.log(`\n${'='.repeat(60)}`);
        console.log(`TEST ${testNumber}/${TEST_INPUTS.length}: "${input}"`);
        console.log('='.repeat(60));
        
        const testResult = {
            test_number: testNumber,
            input: input,
            timestamp: new Date().toISOString(),
            routing: null,
            request: null,
            response: null,
            error: null,
            duration_ms: 0
        };

        const testStart = Date.now();

        try {
            // Step 1: Routing
            console.log('\n📍 Step 1: Routing...');
            const routingResult = this.router.route(input);
            
            testResult.routing = {
                spec: routingResult.spec,
                confidence: routingResult.confidence,
                reason: routingResult.reason,
                alternatives: routingResult.alternatives
            };
            
            console.log(`   Spec: ${routingResult.spec}`);
            console.log(`   Confidence: ${routingResult.confidence}`);
            console.log(`   Reason: ${routingResult.reason}`);

            // Step 2: Create Request
            console.log('\n📦 Step 2: Creating request...');
            const request = this.router.createRequest(input, routingResult, {
                conversation: {
                    previous_spec: null,
                    message_count: testNumber - 1,
                    history: []
                },
                user: {
                    emotional_state: null,
                    engagement_level: 'medium',
                    preferences: { language: 'es' }
                },
                metadata: {
                    source: 'integration_test',
                    test_number: testNumber
                }
            });
            
            testResult.request = {
                id: request.id,
                spec: request.spec,
                routing_confidence: request.routing.confidence,
                context_intent: request.context.detected_intent
            };
            
            console.log(`   Request ID: ${request.id}`);
            console.log(`   Target Spec: ${request.spec}`);

            // Step 3: Process with Adapter
            console.log('\n⚙️  Step 3: Processing with adapter...');
            const response = await this.loader.processRequest(request);
            
            testResult.response = {
                success: response.success,
                spec: response.spec,
                pattern_used: response.metadata?.pattern_used,
                confidence: response.metadata?.confidence,
                processing_time_ms: response.metadata?.processing_time_ms,
                has_transition: !!response.transition,
                transition_spec: response.transition?.suggest_spec || null
            };

            if (response.success) {
                console.log(`   ✅ Success`);
                console.log(`   Pattern: ${response.metadata.pattern_used}`);
                console.log(`   Confidence: ${response.metadata.confidence}`);
                console.log(`   Processing: ${response.metadata.processing_time_ms}ms`);
                
                // Log response preview
                const text = response.response.text;
                const preview = text.substring(0, 100) + (text.length > 100 ? '...' : '');
                console.log(`   Response: ${preview}`);
                
                // Log transition if present
                if (response.transition) {
                    console.log(`   💡 Transition suggested: ${response.transition.suggest_spec}`);
                }
            } else {
                console.log(`   ❌ Failed: ${response.error.code}`);
                console.log(`   Message: ${response.error.message}`);
                testResult.error = response.error;
            }

        } catch (error) {
            console.error(`\n❌ Test failed with exception:`, error.message);
            testResult.error = {
                code: 'TEST_EXCEPTION',
                message: error.message,
                stack: error.stack
            };
            
            this.errors.push({
                test_number: testNumber,
                input: input,
                error: error.message,
                stack: error.stack
            });
        }

        testResult.duration_ms = Date.now() - testStart;
        console.log(`\n⏱️  Test duration: ${testResult.duration_ms}ms`);
        
        this.results.push(testResult);
        return testResult;
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('\n🧪 Starting Integration Tests\n');
        console.log(`Total tests: ${TEST_INPUTS.length}`);
        console.log(`Start time: ${new Date().toISOString()}\n`);

        for (let i = 0; i < TEST_INPUTS.length; i++) {
            await this.runTest(TEST_INPUTS[i], i);
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('\n' + '='.repeat(60));
        console.log('ALL TESTS COMPLETED');
        console.log('='.repeat(60));
    }

    /**
     * Generate summary statistics
     */
    generateSummary() {
        const totalTests = this.results.length;
        const successfulTests = this.results.filter(r => r.response?.success).length;
        const failedTests = totalTests - successfulTests;
        
        const specUsage = {};
        const patternUsage = {};
        
        for (const result of this.results) {
            if (result.routing) {
                const spec = result.routing.spec;
                specUsage[spec] = (specUsage[spec] || 0) + 1;
            }
            
            if (result.response?.pattern_used) {
                const pattern = result.response.pattern_used;
                patternUsage[pattern] = (patternUsage[pattern] || 0) + 1;
            }
        }

        const avgConfidence = this.results
            .filter(r => r.routing?.confidence)
            .reduce((sum, r) => sum + r.routing.confidence, 0) / totalTests;

        const avgProcessingTime = this.results
            .filter(r => r.response?.processing_time_ms)
            .reduce((sum, r) => sum + r.response.processing_time_ms, 0) / totalTests;

        const totalDuration = Date.now() - this.startTime;

        return {
            total_tests: totalTests,
            successful: successfulTests,
            failed: failedTests,
            success_rate: (successfulTests / totalTests * 100).toFixed(2) + '%',
            spec_usage: specUsage,
            pattern_usage: patternUsage,
            avg_routing_confidence: avgConfidence.toFixed(3),
            avg_processing_time_ms: avgProcessingTime.toFixed(2),
            total_duration_ms: totalDuration,
            errors_count: this.errors.length
        };
    }

    /**
     * Generate report
     */
    generateReport() {
        const summary = this.generateSummary();
        
        const report = {
            metadata: {
                test_suite: 'Integration Tests',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                duration_ms: Date.now() - this.startTime
            },
            summary: summary,
            test_results: this.results,
            errors: this.errors,
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    /**
     * Generate recommendations based on results
     */
    generateRecommendations() {
        const recommendations = [];
        
        // Check for low confidence routing
        const lowConfidenceTests = this.results.filter(r => 
            r.routing?.confidence < 0.5
        );
        
        if (lowConfidenceTests.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'routing',
                issue: `${lowConfidenceTests.length} tests had low routing confidence (<0.5)`,
                actions: [
                    'Review and expand keywords in rules.json',
                    'Add more pattern examples for intent detection',
                    'Consider adjusting scoring weights in router'
                ]
            });
        }

        // Check for failed tests
        const failedTests = this.results.filter(r => !r.response?.success);
        
        if (failedTests.length > 0) {
            recommendations.push({
                priority: 'high',
                category: 'processing',
                issue: `${failedTests.length} tests failed during processing`,
                actions: [
                    'Review error logs for common failure patterns',
                    'Add better error handling in adapters',
                    'Implement retry logic for recoverable errors'
                ]
            });
        }

        // Check for slow processing
        const slowTests = this.results.filter(r => 
            r.response?.processing_time_ms > 200
        );
        
        if (slowTests.length > 0) {
            recommendations.push({
                priority: 'medium',
                category: 'performance',
                issue: `${slowTests.length} tests took >200ms to process`,
                actions: [
                    'Profile adapter processing code',
                    'Cache compiled regex patterns',
                    'Optimize response generation logic'
                ]
            });
        }

        // Check for missing transitions
        const transitionOpportunities = this.results.filter(r => {
            const input = r.input.toLowerCase();
            const hasDecisionKeywords = ['decidir', 'elegir', 'opción'].some(kw => input.includes(kw));
            const isEmotionalSpec = r.routing?.spec === 'whispers-of-the-wave';
            return hasDecisionKeywords && isEmotionalSpec && !r.response?.has_transition;
        });
        
        if (transitionOpportunities.length > 0) {
            recommendations.push({
                priority: 'low',
                category: 'transitions',
                issue: `${transitionOpportunities.length} tests could benefit from spec transitions`,
                actions: [
                    'Improve transition detection logic in adapters',
                    'Lower transition confidence threshold',
                    'Add more transition patterns'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Save report to file
     */
    saveReport(report) {
        const reportsDir = path.join(__dirname, '../reports');
        
        // Create reports directory if it doesn't exist
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }

        const reportPath = path.join(reportsDir, 'integration_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n📄 Report saved to: ${reportPath}`);
        return reportPath;
    }

    /**
     * Save errors to log file
     */
    saveErrors() {
        if (this.errors.length === 0) {
            console.log('\n✅ No errors to log');
            return null;
        }

        const logsDir = path.join(__dirname, '../logs');
        
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const logPath = path.join(logsDir, 'errors.log');
        const logContent = this.errors.map(err => {
            return `[${new Date().toISOString()}] Test ${err.test_number || 'N/A'}\n` +
                   `Input: ${err.input || 'N/A'}\n` +
                   `Error: ${err.error}\n` +
                   `Stack: ${err.stack}\n` +
                   `${'='.repeat(60)}\n`;
        }).join('\n');

        fs.writeFileSync(logPath, logContent);
        
        console.log(`\n📄 Errors logged to: ${logPath}`);
        return logPath;
    }

    /**
     * Print summary to console
     */
    printSummary(summary) {
        console.log('\n' + '='.repeat(60));
        console.log('TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests:        ${summary.total_tests}`);
        console.log(`Successful:         ${summary.successful} ✅`);
        console.log(`Failed:             ${summary.failed} ${summary.failed > 0 ? '❌' : ''}`);
        console.log(`Success Rate:       ${summary.success_rate}`);
        console.log(`Avg Confidence:     ${summary.avg_routing_confidence}`);
        console.log(`Avg Processing:     ${summary.avg_processing_time_ms}ms`);
        console.log(`Total Duration:     ${summary.total_duration_ms}ms`);
        console.log(`Errors:             ${summary.errors_count}`);
        console.log('\nSpec Usage:');
        for (const [spec, count] of Object.entries(summary.spec_usage)) {
            console.log(`  ${spec}: ${count}`);
        }
        console.log('\nPattern Usage:');
        for (const [pattern, count] of Object.entries(summary.pattern_usage)) {
            console.log(`  ${pattern}: ${count}`);
        }
        console.log('='.repeat(60));
    }

    /**
     * Print recommendations
     */
    printRecommendations(recommendations) {
        if (recommendations.length === 0) {
            console.log('\n✅ No recommendations - all tests passed optimally!');
            return;
        }

        console.log('\n' + '='.repeat(60));
        console.log('RECOMMENDATIONS');
        console.log('='.repeat(60));

        for (const rec of recommendations) {
            const priorityIcon = rec.priority === 'high' ? '🔴' : 
                                rec.priority === 'medium' ? '🟡' : '🟢';
            
            console.log(`\n${priorityIcon} ${rec.priority.toUpperCase()} - ${rec.category}`);
            console.log(`Issue: ${rec.issue}`);
            console.log('Actions:');
            rec.actions.forEach((action, i) => {
                console.log(`  ${i + 1}. ${action}`);
            });
        }
        console.log('='.repeat(60));
    }
}

// Main execution
async function main() {
    const runner = new IntegrationTestRunner();
    
    // Initialize
    const initialized = await runner.initialize();
    if (!initialized) {
        console.error('Failed to initialize test runner');
        process.exit(1);
    }

    // Run all tests
    await runner.runAllTests();

    // Generate and save report
    const report = runner.generateReport();
    runner.saveReport(report);
    runner.saveErrors();

    // Print summary and recommendations
    runner.printSummary(report.summary);
    runner.printRecommendations(report.recommendations);

    // Exit with appropriate code
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);
}

// Run if called directly
if (require.main === module) {
    main().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = IntegrationTestRunner;
