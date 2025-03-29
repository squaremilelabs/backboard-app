# Backboard ERD Summary

## Entity Relationship Overview

### Topic
- Belongs to a user
- Has many:
  - `Tasks` (Adhoc)
  - `Routines`
  - `Projects`
- Has:
  - `Title`
  - `ItemOrders (json)` — stores ordering of children (tasks, routines, projects)
  - `Clipboard` (1 per topic)

### Task (Abstract)
- Parent model for 3 task types:
  - `AdhocTask` (belongs to Topic)
  - `RoutineTask` (belongs to Routine)
  - `ProjectTask` (belongs to Project + Milestone)
- Has:
  - `Title`
  - `Status` (Ready, Pending, Done)
  - `StatusHistory (json)`
  - `Clipboard`

### Routine
- Belongs to a Topic
- Has many RoutineTask instances
- Has a Clipboard
- May include ArchivedAt

### RoutineTask
- Belongs to Routine
- Represents an individual instance of a recurring task
- Includes InstanceNumber for ordering

### Project
- Belongs to a Topic
- Has many ProjectMilestones and ProjectTasks
- Has a Clipboard
- May include ArchivedAt

### ProjectMilestone
- Belongs to a Project
- Has many ProjectTasks
- Has a Clipboard
- May include ArchivedAt

### ProjectTask
- Belongs to both a Project and a Milestone
- Inherits from Task

### Clipboard
- One per Topic, Task, Project, Routine, Milestone
- Contains:
  - NotepadContent
  - Checklist (json)
  - Resources (json)
