export const DEV_USERS = {
  student: { email: "student@code-trainer.dev", password: "student123", name: "Student Dev" },
  teacher: { email: "teacher@code-trainer.dev", password: "teacher123", name: "Teacher Dev" },
  admin: { email: "admin@code-trainer.dev", password: "admin123", name: "Admin Dev" },
} as const

export const SOLUTIONS = {
  task1Python: "print('Hello')\n",
  task4ForLoop: "for i in range(3):\n    print(i)\n",
  task7CppSnippet: "int main(){ for(int i=0;i<3;++i){} return 0; }",
  task8PascalSnippet: "program T; var i: integer; begin for i := 1 to 3 do writeln(i); end.",
  task9CppCompiled: [
    "#include <iostream>",
    "int main() {",
    "  for (int i = 0; i < 3; ++i) std::cout << i << '\\n';",
    "  return 0;",
    "}",
    "",
  ].join("\n"),
  task10PascalCompiled: [
    "program T;",
    "var i: integer;",
    "begin",
    "  for i := 1 to 3 do",
    "    writeln(i);",
    "end.",
    "",
  ].join("\n"),
} as const
