---
id: US-001
title: Record a thought node
asA: Signed-in User
iWant: Capture what I'm thinking into a node in the opening state
soThat: I can track and share what I'm planning, stuck on, or progressing through
boundedContext: Journal
usesAggregates: [Node]
issuesCommands: [RecordNode]
expectsEvents: [NodeRecorded]
assertsInvariants: [OnlyOwnerCanCreate, NodeStateIsOpening]
acceptanceCriteria:
  - given: I am signed in and on the record page
    when: I try to create a node 
    then: I can choose among three node types: 'Question', 'Rule', or 'Action'

  - given: An existing node on the record page
    when: I try to link the parent and child nodes
    then: I can link Q -> R and R -> A; the links must follow that order
---
