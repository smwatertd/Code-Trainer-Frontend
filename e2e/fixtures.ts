export const DEV_USERS = {
  student: { email: "student@code-trainer.dev", password: "student123", name: "Student Dev" },
  teacher: { email: "teacher@code-trainer.dev", password: "teacher123", name: "Teacher Dev" },
  admin: { email: "admin@code-trainer.dev", password: "admin123", name: "Admin Dev" },
} as const

export const SOLUTIONS = {
  task2AgeFix: [
    "var age: integer;",
    "begin",
    "  readln(age);",
    "  writeln(age);",
    "end.",
  ].join("\n"),
  task3SumPascal: [
    "var a,b,s: integer;",
    "begin",
    "  readln(a,b);",
    "  s:=a+b;",
    "  writeln(s);",
    "end.",
  ].join("\n"),
  task5PerimeterFix: [
    "var w,h,p: integer;",
    "begin",
    "  readln(w,h);",
    "  p:=2*(w+h);",
    "  writeln(p);",
    "end.",
  ].join("\n"),
  task6SwapPascal: [
    "var a,b,t: integer;",
    "begin",
    "  readln(a,b);",
    "  t:=a; a:=b; b:=t;",
    "  writeln(a,' ',b);",
    "end.",
  ].join("\n"),
  task8LastDigitFix: [
    "var x,last: integer;",
    "begin",
    "  readln(x);",
    "  last:=x mod 10;",
    "  writeln(last);",
    "end.",
  ].join("\n"),
  task9DigitSumPascal: [
    "var x,s: integer;",
    "begin",
    "  readln(x);",
    "  s:=x div 10 + x mod 10;",
    "  writeln(s);",
    "end.",
  ].join("\n"),
} as const
