/******************************************************************************
* This file was generated by ZenStack CLI.
******************************************************************************/

/* eslint-disable */
// @ts-nocheck

const metadata = {
    models: {
        user: {
            name: 'User', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, display_name: {
                    name: "display_name",
                    type: "String",
                }, email: {
                    name: "email",
                    type: "String",
                }, image_href: {
                    name: "image_href",
                    type: "String",
                    isOptional: true,
                }, topics: {
                    name: "topics",
                    type: "Topic",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'created_by',
                }, resources: {
                    name: "resources",
                    type: "Resource",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'created_by',
                }, tasklists: {
                    name: "tasklists",
                    type: "Tasklist",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'created_by',
                }, tasks: {
                    name: "tasks",
                    type: "Task",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'created_by',
                }, topic_order: {
                    name: "topic_order",
                    type: "String",
                    isArray: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, email: {
                    name: "email",
                    fields: ["email"]
                },
            }
            ,
        }
        ,
        topic: {
            name: 'Topic', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Topic$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'topics',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                }, title: {
                    name: "title",
                    type: "String",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                }, tasklists: {
                    name: "tasklists",
                    type: "Tasklist",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'topic',
                }, tasks: {
                    name: "tasks",
                    type: "Task",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'topic',
                }, resources: {
                    name: "resources",
                    type: "Resource",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'topic',
                }, tasklist_order: {
                    name: "tasklist_order",
                    type: "String",
                    isArray: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        resource: {
            name: 'Resource', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Resource$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                }, title: {
                    name: "title",
                    type: "String",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                }, tasklist_id: {
                    name: "tasklist_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                }, tasklist_topic_id: {
                    name: "tasklist_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                }, tasklist: {
                    name: "tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tasklist_id", "topic_id": "tasklist_topic_id" },
                }, task_id: {
                    name: "task_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                }, task_topic_id: {
                    name: "task_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                }, task: {
                    name: "task",
                    type: "Task",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "task_id", "topic_id": "task_topic_id" },
                }, resource_type: {
                    name: "resource_type",
                    type: "String",
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            , discriminator: "resource_type",
        }
        ,
        note: {
            name: 'Note', baseTypes: ['Resource'], fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                    inheritedFrom: "Resource",
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                    inheritedFrom: "Resource",
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Note$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                    inheritedFrom: "Resource",
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                    inheritedFrom: "Resource",
                }, title: {
                    name: "title",
                    type: "String",
                    inheritedFrom: "Resource",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                    inheritedFrom: "Resource",
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                    inheritedFrom: "Resource",
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                    inheritedFrom: "Resource",
                }, tasklist_id: {
                    name: "tasklist_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist_topic_id: {
                    name: "tasklist_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist: {
                    name: "tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tasklist_id", "topic_id": "tasklist_topic_id" },
                    inheritedFrom: "Resource",
                }, task_id: {
                    name: "task_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task_topic_id: {
                    name: "task_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task: {
                    name: "task",
                    type: "Task",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "task_id", "topic_id": "task_topic_id" },
                    inheritedFrom: "Resource",
                }, resource_type: {
                    name: "resource_type",
                    type: "String",
                    inheritedFrom: "Resource",
                }, content: {
                    name: "content",
                    type: "String",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        link: {
            name: 'Link', baseTypes: ['Resource'], fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                    inheritedFrom: "Resource",
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                    inheritedFrom: "Resource",
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Link$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                    inheritedFrom: "Resource",
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                    inheritedFrom: "Resource",
                }, title: {
                    name: "title",
                    type: "String",
                    inheritedFrom: "Resource",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                    inheritedFrom: "Resource",
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                    inheritedFrom: "Resource",
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                    inheritedFrom: "Resource",
                }, tasklist_id: {
                    name: "tasklist_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist_topic_id: {
                    name: "tasklist_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist: {
                    name: "tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tasklist_id", "topic_id": "tasklist_topic_id" },
                    inheritedFrom: "Resource",
                }, task_id: {
                    name: "task_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task_topic_id: {
                    name: "task_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task: {
                    name: "task",
                    type: "Task",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "task_id", "topic_id": "task_topic_id" },
                    inheritedFrom: "Resource",
                }, resource_type: {
                    name: "resource_type",
                    type: "String",
                    inheritedFrom: "Resource",
                }, url: {
                    name: "url",
                    type: "String",
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        checklist: {
            name: 'Checklist', baseTypes: ['Resource'], fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                    inheritedFrom: "Resource",
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                    inheritedFrom: "Resource",
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Checklist$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                    inheritedFrom: "Resource",
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                    inheritedFrom: "Resource",
                }, title: {
                    name: "title",
                    type: "String",
                    inheritedFrom: "Resource",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                    inheritedFrom: "Resource",
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                    inheritedFrom: "Resource",
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                    inheritedFrom: "Resource",
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                    inheritedFrom: "Resource",
                }, tasklist_id: {
                    name: "tasklist_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist_topic_id: {
                    name: "tasklist_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'tasklist',
                    inheritedFrom: "Resource",
                }, tasklist: {
                    name: "tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tasklist_id", "topic_id": "tasklist_topic_id" },
                    inheritedFrom: "Resource",
                }, task_id: {
                    name: "task_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task_topic_id: {
                    name: "task_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'task',
                    inheritedFrom: "Resource",
                }, task: {
                    name: "task",
                    type: "Task",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'resources',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "task_id", "topic_id": "task_topic_id" },
                    inheritedFrom: "Resource",
                }, resource_type: {
                    name: "resource_type",
                    type: "String",
                    inheritedFrom: "Resource",
                }, items: {
                    name: "items",
                    type: "ChecklistItem",
                    isTypeDef: true,
                    isArray: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                },
            }
            ,
        }
        ,
        tasklist: {
            name: 'Tasklist', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Tasklist$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'tasklists',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                }, title: {
                    name: "title",
                    type: "String",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'tasklists',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                }, tasks: {
                    name: "tasks",
                    type: "Task",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'tasklist',
                }, resources: {
                    name: "resources",
                    type: "Resource",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'tasklist',
                }, parent_tasklist_id: {
                    name: "parent_tasklist_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'parent_tasklist',
                }, parent_tasklist_topic_id: {
                    name: "parent_tasklist_topic_id",
                    type: "String",
                    isOptional: true,
                    isForeignKey: true,
                    relationField: 'parent_tasklist',
                }, parent_tasklist: {
                    name: "parent_tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    isOptional: true,
                    backLink: 'sub_tasklists',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "parent_tasklist_id", "topic_id": "parent_tasklist_topic_id" },
                }, sub_tasklists: {
                    name: "sub_tasklists",
                    type: "Tasklist",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'parent_tasklist',
                }, now_task_order: {
                    name: "now_task_order",
                    type: "String",
                    isArray: true,
                }, later_task_order: {
                    name: "later_task_order",
                    type: "String",
                    isArray: true,
                }, sub_tasklist_order: {
                    name: "sub_tasklist_order",
                    type: "String",
                    isArray: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, id_topic_id: {
                    name: "id_topic_id",
                    fields: ["id", "topic_id"]
                },
            }
            ,
        }
        ,
        task: {
            name: 'Task', fields: {
                id: {
                    name: "id",
                    type: "String",
                    isId: true,
                    attributes: [{ "name": "@default", "args": [] }],
                }, created_at: {
                    name: "created_at",
                    type: "DateTime",
                    attributes: [{ "name": "@default", "args": [] }],
                }, updated_at: {
                    name: "updated_at",
                    type: "DateTime",
                    attributes: [{ "name": "@updatedAt", "args": [] }],
                }, created_by_id: {
                    name: "created_by_id",
                    type: "String",
                    attributes: [{ "name": "@default", "args": [] }],
                    defaultValueProvider: $default$Task$created_by_id,
                    isForeignKey: true,
                    relationField: 'created_by',
                }, created_by: {
                    name: "created_by",
                    type: "User",
                    isDataModel: true,
                    backLink: 'tasks',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "created_by_id" },
                }, title: {
                    name: "title",
                    type: "String",
                }, description: {
                    name: "description",
                    type: "String",
                    isOptional: true,
                }, is_public: {
                    name: "is_public",
                    type: "Boolean",
                    attributes: [{ "name": "@default", "args": [{ "value": false }] }],
                }, archived_at: {
                    name: "archived_at",
                    type: "DateTime",
                    isOptional: true,
                }, topic_id: {
                    name: "topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'topic',
                }, topic: {
                    name: "topic",
                    type: "Topic",
                    isDataModel: true,
                    backLink: 'tasks',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "topic_id" },
                }, tasklist_id: {
                    name: "tasklist_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'tasklist',
                }, tasklist_topic_id: {
                    name: "tasklist_topic_id",
                    type: "String",
                    isForeignKey: true,
                    relationField: 'tasklist',
                }, tasklist: {
                    name: "tasklist",
                    type: "Tasklist",
                    isDataModel: true,
                    backLink: 'tasks',
                    isRelationOwner: true,
                    foreignKeyMapping: { "id": "tasklist_id", "topic_id": "tasklist_topic_id" },
                }, resources: {
                    name: "resources",
                    type: "Resource",
                    isDataModel: true,
                    isArray: true,
                    backLink: 'task',
                }, status: {
                    name: "status",
                    type: "TaskStatus",
                    attributes: [{ "name": "@default", "args": [] }],
                }, size_minutes: {
                    name: "size_minutes",
                    type: "Int",
                    isOptional: true,
                }, done_at: {
                    name: "done_at",
                    type: "DateTime",
                    isOptional: true,
                },
            }
            , uniqueConstraints: {
                id: {
                    name: "id",
                    fields: ["id"]
                }, id_topic_id: {
                    name: "id_topic_id",
                    fields: ["id", "topic_id"]
                },
            }
            ,
        }
        ,
    }
    ,
    typeDefs: {
        checklistItem: {
            name: 'ChecklistItem', fields: {
                id: {
                    name: "id",
                    type: "String",
                }, text: {
                    name: "text",
                    type: "String",
                }, is_checked: {
                    name: "is_checked",
                    type: "Boolean",
                },
            }
            ,
        }
        ,
    }
    ,
    deleteCascade: {
        user: ['Topic', 'Resource', 'Note', 'Link', 'Checklist', 'Tasklist', 'Task'],
        topic: ['Resource', 'Note', 'Link', 'Checklist', 'Tasklist', 'Task'],
        tasklist: ['Task'],
    }
    ,
    authModel: 'User'
};
function $default$Topic$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Resource$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Note$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Link$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Checklist$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Tasklist$created_by_id(user: any): unknown {
    return user?.id;
}

function $default$Task$created_by_id(user: any): unknown {
    return user?.id;
}
export default metadata;
