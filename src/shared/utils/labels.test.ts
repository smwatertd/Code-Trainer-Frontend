import { describe, expect, it } from "vitest"

import {
  findNextIncompleteTaskId,
  findNextIncompleteTechnicalConcept,
  labelDifficulty,
  labelFlowBlockType,
  labelJobStatus,
  labelLanguage,
  labelProgressStatus,
  labelTaskDetailType,
  labelTaskType,
  labelTechnicalConcept,
  labelTopic,
  labelUserRole,
} from "./labels"

describe("labels", () => {
  it("localizes task metadata for students", () => {
    expect(labelTaskType("translation")).toBe("Перевод программы")
    expect(labelTaskType("task_build_from_blocks")).toBe("Сборка из блоков")
    expect(
      labelTaskDetailType({
        task_type: "translation",
        payload: { template: "var x: integer;" },
      }),
    ).toBe("Исправление программы")
    expect(
      labelTaskDetailType({
        task_type: "translation",
        payload: { source_language: "python", target_language: "pascal" },
      }),
    ).toBe("Перевод программы")
    expect(labelDifficulty("easy")).toBe("Лёгкая")
    expect(labelProgressStatus("passed")).toBe("Решено")
  })

  it("finds the next incomplete task id", () => {
    expect(
      findNextIncompleteTaskId({
        "3": { progress_status: "passed" },
        "4": { progress_status: "failed" },
        "7": { progress_status: "not_started" },
      }),
    ).toBe(4)
  })

  it("localizes languages, roles, flow blocks and job statuses", () => {
    expect(labelLanguage("csharp")).toBe("C#")
    expect(labelLanguage("cpp")).toBe("C++")
    expect(labelUserRole("teacher")).toBe("Преподаватель")
    expect(labelFlowBlockType("decision")).toBe("Условие")
    expect(labelJobStatus("RUNNING")).toBe("Выполняется")
    expect(labelJobStatus("failed")).toBe("Неудача")
    expect(labelTechnicalConcept("for_loop")).toBe("Цикл for")
    expect(labelTopic("basics")).toBe("Основы")
    expect(labelTopic("io")).toBe("Ввод-вывод")
    expect(labelTopic("loops")).toBe("Циклы")
    expect(labelTopic("custom")).toBe("Свои задачи")
    expect(labelTopic("algorithms")).toBe("Алгоритмы")
    expect(labelTopic("sort_order")).toBe("Сортировка")
    expect(labelTopic("nested_iteration")).toBe("Вложенные циклы")
    expect(labelTopic("inheritance_hierarchy")).toBe("Наследование")
    expect(labelTopic("data_structures")).toBe("Структуры данных")
    expect(labelTopic("stack_queue")).toBe("Стек / очередь")
    expect(labelTopic("for_loop")).toBe("Цикл for")
    expect(labelTopic("unknown_slug")).toBe("unknown_slug")
  })

  it("finds the next incomplete technical concept", () => {
    expect(
      findNextIncompleteTechnicalConcept({
        for_loop: { passed_tasks: 2, total_tasks: 2 },
        while_loop: { passed_tasks: 0, total_tasks: 3 },
      }),
    ).toBe("while_loop")
  })
})
