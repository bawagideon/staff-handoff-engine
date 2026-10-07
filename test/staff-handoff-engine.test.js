const { test } = require('node:test');
const assert = require('node:assert');
const { StaffHandoffEngine } = require('../src/index.js');

test('StaffHandoffEngine: compiles complete handover dossier with protected value', () => {
  const engine = new StaffHandoffEngine();
  const emp = { id: 'emp_01', name: 'Sarah Jenkins', role: 'Lead Account Exec', departureDate: '2026-10-31' };
  const accounts = [
    { name: 'Omega Tech', value: 35000, status: 'HEALTHY', lastNotes: 'Q4 expansion agreed' },
    { name: 'Apex Media', value: 20000, status: 'AT_RISK', lastNotes: 'Needs pricing review' }
  ];
  const tasks = [
    { title: 'Send Q4 Addendum', dueDate: '2026-10-25', priority: 'HIGH', status: 'IN_PROGRESS' },
    { title: 'Update CRM Contacts', dueDate: '2026-10-28', priority: 'NORMAL', status: 'PENDING' }
  ];

  const res = engine.compileHandoffPackage(emp, accounts, tasks);
  assert.strictEqual(res.employeeName, 'Sarah Jenkins');
  assert.strictEqual(res.totalProtectedValue, 55000);
  assert.strictEqual(res.criticalTaskCount, 1);
  assert.ok(res.completenessScore >= 80);
});

test('StaffHandoffEngine: flags unlogged notes with lower completeness score', () => {
  const engine = new StaffHandoffEngine();
  const emp = { id: 'emp_02', name: 'Tom R', role: 'Dev', departureDate: '2026-11-01' };
  const res = engine.compileHandoffPackage(emp, [{ name: 'A', value: 1000 }], [{ title: 'T' }]);
  assert.ok(res.completenessScore < 60);
});
