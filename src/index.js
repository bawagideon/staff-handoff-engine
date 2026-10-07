// Staff Handoff & Knowledge Continuity Engine
class StaffHandoffEngine {
  constructor() {}

  compileHandoffPackage(employee, accountHistory, tasks) {
    const { id, name, role, departureDate } = employee;

    const managedClients = accountHistory.map(a => ({
      clientName: a.name,
      contractValue: a.value,
      healthStatus: a.status || 'STABLE',
      lastSpokenNotes: a.lastNotes || 'No notes logged',
      openRisks: a.openRisks || 'None identified'
    }));

    const pendingTasks = tasks.map(t => ({
      taskName: t.title,
      dueDate: t.dueDate,
      priority: t.priority || 'NORMAL',
      status: t.status || 'PENDING'
    }));

    const totalProtectedValue = managedClients.reduce((sum, c) => sum + c.contractValue, 0);
    const criticalTaskCount = pendingTasks.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;

    const completenessScore = Math.min(100, Math.round(
      (managedClients.filter(c => c.lastSpokenNotes !== 'No notes logged').length / (managedClients.length || 1)) * 50 +
      (pendingTasks.filter(t => t.dueDate).length / (pendingTasks.length || 1)) * 50
    ));

    return {
      employeeId: id,
      employeeName: name,
      role,
      departureDate,
      completenessScore,
      totalProtectedValue,
      criticalTaskCount,
      dossier: {
        summary: `Handover dossier for ${name} (${role}), departing on ${departureDate}.`,
        managedClients,
        pendingTasks,
        recommendedSuccessorActions: [
          'Contact top 3 high-value accounts within 48h of departure',
          'Reassign open critical Jira tickets to senior team members',
          'Archive and transfer active communication channels'
        ]
      }
    };
  }
}

module.exports = { StaffHandoffEngine };
