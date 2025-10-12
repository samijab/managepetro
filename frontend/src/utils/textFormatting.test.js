/**
 * Simple tests for textFormatting utilities
 * Run with: node frontend/src/utils/textFormatting.test.js
 */

import { cleanMarkdown, formatMarkdownForDisplay } from './textFormatting.js';

// Test cases
const testCases = [
  {
    name: 'Remove bold markdown (**text**)',
    input: 'This is **bold text** in a sentence.',
    expected: 'This is bold text in a sentence.',
  },
  {
    name: 'Remove bold markdown (__text__)',
    input: 'This is __bold text__ in a sentence.',
    expected: 'This is bold text in a sentence.',
  },
  {
    name: 'Remove italic markdown (*text*)',
    input: 'This is *italic text* in a sentence.',
    expected: 'This is italic text in a sentence.',
  },
  {
    name: 'Remove headers (###)',
    input: '### Header Text\nNormal text',
    expected: 'Header Text\nNormal text',
  },
  {
    name: 'Remove inline code (`text`)',
    input: 'Use the `function()` method.',
    expected: 'Use the function() method.',
  },
  {
    name: 'Complex markdown',
    input: '## Route Summary\n\n**Total Distance:** 500 km\n- Stop 1\n- Stop 2',
    expected: 'Route Summary\n\nTotal Distance: 500 km\nStop 1\nStop 2',
  },
  {
    name: 'Multiple bold in same line',
    input: '**Station A** and **Station B** need fuel',
    expected: 'Station A and Station B need fuel',
  },
  {
    name: 'Empty string',
    input: '',
    expected: '',
  },
  {
    name: 'No markdown',
    input: 'Plain text with no markdown',
    expected: 'Plain text with no markdown',
  },
];

// Run tests
let passed = 0;
let failed = 0;

console.log('Running textFormatting tests...\n');

testCases.forEach((test, index) => {
  const result = cleanMarkdown(test.input);
  const success = result.trim() === test.expected.trim();
  
  if (success) {
    passed++;
    console.log(`✅ Test ${index + 1}: ${test.name}`);
  } else {
    failed++;
    console.log(`❌ Test ${index + 1}: ${test.name}`);
    console.log(`   Expected: "${test.expected}"`);
    console.log(`   Got:      "${result}"`);
  }
});

console.log(`\n${passed}/${testCases.length} tests passed`);

if (failed === 0) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log(`❌ ${failed} test(s) failed`);
  process.exit(1);
}
