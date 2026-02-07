---
id: US-001
title: market-report
asA: Signed-in User
iWant: To have a report to know the strategy applied into the market
soThat: I can seek the alpha info
boundedContext: Investment 
usesAggregates: [Strategy, Market]
issuesCommands: [Report]
expectsEvents: [PerformanceReport]
assertsInvariants: []
acceptanceCriteria:
  - given: A strategy and a period of market info
    when: I try to manually execute or config the time to auto start
    then: The system would generate a report for me
---
