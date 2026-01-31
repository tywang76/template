#!/usr/bin/env node
import fs from 'fs';
import writeGood from 'write-good';

const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8');

// Extract the subject line (first line) and body
const lines = commitMsg.split('\n');
const subject = lines[0];
const body = lines.slice(2).join('\n'); // Skip the blank line

// Check subject line (after the type prefix)
const subjectMatch = subject.match(/^[a-z]+(?:\(.+?\))?!?:\s*(.+)$/);
const subjectText = subjectMatch ? subjectMatch[1] : subject;

console.log('\n📝 Grammar Check Results:\n');

// Check subject
const subjectSuggestions = writeGood(subjectText);
if (subjectSuggestions.length > 0) {
  console.log('Subject line:');
  subjectSuggestions.forEach(s => {
    const snippet = subjectText.substring(s.index, s.index + s.offset);
    console.log(`  ⚠️  "${snippet}": ${s.reason}`);
  });
} else {
  console.log('Subject line: ✓ No issues found');
}

// Check body if it exists
if (body.trim().length > 0) {
  const bodySuggestions = writeGood(body);
  if (bodySuggestions.length > 0) {
    console.log('\nCommit body:');
    bodySuggestions.forEach(s => {
      const snippet = body.substring(s.index, s.index + s.offset);
      console.log(`  ⚠️  "${snippet}": ${s.reason}`);
    });
  } else {
    console.log('Commit body: ✓ No issues found');
  }
}

console.log('\n');

// Non-blocking - just warnings
process.exit(0);
