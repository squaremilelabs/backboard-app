# Backboard Wireframes Summary

## App Structure

The app is split into three main UI zones:

### 1. TopicNav
- Located in the left sidebar
- Displays a list of all Topics for the user
- Each `TopicListItem` is draggable and navigates to a Topic page
- Includes a `CreateLine` to add new Topics

### 2. TopicPage
- Main workspace for a selected Topic
- Shows three vertically stacked sections:
  - **Adhoc Tasks**
  - **Routines**
  - **Projects**
- Each section uses `Collapsible` headers and lists with inner structure

#### Section: Adhoc Tasks
- Divided into three `TaskList` components: Ready, Pending, Done
- Each list shows tasks with inline editing and a checkbox
- Includes `CreateLine` for new tasks and pagination in "Done"

#### Section: Routines
- Displays a `TaskList` for upcoming Routine instances
- Below that is a list of `Routine` items, each collapsible
  - Each Routine includes a `TaskList` of completed RoutineTasks
- Routines have a button to create a new instance

#### Section: Projects
- Displays a list of `Project` items
- Each Project contains a list of `ProjectMilestone` items (collapsible)
  - Each Milestone includes `TaskListsByStatus` (Ready, Pending, Done)
- Includes `CreateLine` at every level

### 3. ClipboardDrawer
- A modal drawer triggered by clicking the `ClipboardTrigger` icon on any item
- Appears right-aligned and overlays the screen
- Displays contextual information for any `ModelType` (e.g., Task, Routine, Project)

#### ClipboardDrawer Sections:
- **Header**: Title of the record
- **Notepad**: Text area for general notes
- **Checklist** (for Tasks and Routines): Draggable checklist items
- **Resources**: A collapsible list of inline notes or links
