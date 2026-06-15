// Auto-generated from TC_reference_42.pdf — do not edit by hand.
// Regenerate: python3 scripts/generate_construction_catalog.py

import type { ConstructionDetail } from "@/features/task-solving/model/constructionCatalog.types"

const RAW_CATALOG = {
  "program_entry": {
    "title": "Точка входа программы",
    "description": "Конструкция, с которой начинается выполнение программы. Она задает основной исполняемый блок и отделяет служебную оболочку от действий, которые решают задачу.",
    "examples": {
      "pascal": [
        {
          "title": "Минимальная программа",
          "code": "program Hello;\nbegin\n  writeln('Hello');\nend."
        },
        {
          "title": "Основной блок с переменными",
          "code": "var x: integer;\nbegin\n  x := 10;\n  writeln(x);\nend."
        },
        {
          "title": "Основной блок вызывает процедуру",
          "code": "procedure Run;\nbegin\n  writeln('Run');\nend;\nbegin\n  Run;\nend."
        }
      ],
      "python": [
        {
          "title": "Скрипт сверху вниз",
          "code": "print('Hello')"
        },
        {
          "title": "Функция main",
          "code": "def main():\n    print('Hello')\nmain()"
        },
        {
          "title": "Явная проверка запуска",
          "code": "def main():\n    print('Hello')\n\nif __name__ == '__main__':\n    main()"
        }
      ],
      "cpp": [
        {
          "title": "Минимальная программа",
          "code": "#include <iostream>\nint main() {\n    std::cout << \"Hello\";\n    return 0;\n}"
        },
        {
          "title": "main вызывает функцию",
          "code": "#include <iostream>\nvoid run() { std::cout << \"Run\"; }\nint main() { run(); return 0; }"
        },
        {
          "title": "main с вводом",
          "code": "#include <iostream>\nint main() { int x; std::cin >> x; std::cout << x; }"
        }
      ],
      "csharp": [
        {
          "title": "Классическая точка входа",
          "code": "using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine(\"Hello\");\n    }\n}"
        },
        {
          "title": "Top-level statements",
          "code": "using System;\nConsole.WriteLine(\"Hello\");"
        },
        {
          "title": "Main с аргументами",
          "code": "class Program {\n    static void Main(string[] args) {\n        Console.WriteLine(args.Length);\n    }\n}"
        }
      ],
      "java": [
        {
          "title": "Минимальный класс Main",
          "code": "class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}"
        },
        {
          "title": "main вызывает метод",
          "code": "class Main {\n    static void run() { System.out.println(\"Run\"); }\n    public static void main(String[] args) { run(); }\n}"
        },
        {
          "title": "main с переменными",
          "code": "class Main {\n    public static void main(String[] args) {\n        int a = 2, b = 3;\n        System.out.println(a + b);\n    }\n}"
        }
      ]
    }
  },
  "typed_declaration": {
    "title": "Объявление переменной",
    "description": "Создание именованного места для хранения значения. Объявление задает тип данных и делает имя доступным для дальнейших операций.",
    "examples": {
      "pascal": [
        {
          "title": "Целое число",
          "code": "var age: integer;"
        },
        {
          "title": "Вещественное число",
          "code": "var price: real;"
        },
        {
          "title": "Строка",
          "code": "var name: string;"
        },
        {
          "title": "Несколько переменных",
          "code": "var a, b, sum: integer;"
        },
        {
          "title": "Разные типы var",
          "code": "count: integer;\n  total: real;\n  title: string;"
        }
      ],
      "python": [
        {
          "title": "Переменная без аннотации",
          "code": "age = 18"
        },
        {
          "title": "Аннотация типа",
          "code": "age: int = 18"
        },
        {
          "title": "Вещественное число",
          "code": "price: float = 12.5"
        },
        {
          "title": "Строка",
          "code": "name: str = 'Ann'"
        }
      ],
      "cpp": [
        {
          "title": "Целое число",
          "code": "int age = 18;"
        },
        {
          "title": "Вещественное число",
          "code": "double price = 12.5;"
        },
        {
          "title": "Строка",
          "code": "std::string name = \"Ann\";"
        },
        {
          "title": "Логический тип",
          "code": "bool isReady = true;"
        },
        {
          "title": "Константа",
          "code": "const double PI = 3.14;"
        }
      ],
      "csharp": [
        {
          "title": "Целое число",
          "code": "int age = 18;"
        },
        {
          "title": "Вещественное число",
          "code": "double price = 12.5;"
        },
        {
          "title": "Строка",
          "code": "string name = \"Ann\";"
        },
        {
          "title": "Вывод типа",
          "code": "var count = 10;"
        },
        {
          "title": "Несколько переменных",
          "code": "int a = 1, b = 2, sum = 0;"
        }
      ],
      "java": [
        {
          "title": "Целое число",
          "code": "int age = 18;"
        },
        {
          "title": "Вещественное число",
          "code": "double price = 12.5;"
        },
        {
          "title": "Строка",
          "code": "String name = \"Ann\";"
        },
        {
          "title": "Логический тип",
          "code": "boolean isReady = true;"
        },
        {
          "title": "Константа",
          "code": "final double PI = 3.14;"
        }
      ]
    }
  },
  "assignment": {
    "title": "Присваивание",
    "description": "Запись нового значения в переменную. Присваивание меняет состояние программы и используется для инициализации, обновления счетчиков, накопления результата и обмена значений.",
    "examples": {
      "pascal": [
        {
          "title": "Простое присваивание",
          "code": "x := 10;"
        },
        {
          "title": "Присваивание выражения",
          "code": "sum := a + b;"
        },
        {
          "title": "Обновление значения",
          "code": "x := x + 1;"
        },
        {
          "title": "Накопление суммы",
          "code": "total := total + price;"
        },
        {
          "title": "Обмен значений",
          "code": "temp := a;\na := b;\nb := temp;"
        }
      ],
      "python": [
        {
          "title": "Простое присваивание",
          "code": "x = 10"
        },
        {
          "title": "Присваивание выражения",
          "code": "total = price * count"
        },
        {
          "title": "Обновление значения",
          "code": "x += 1"
        },
        {
          "title": "Накопление суммы",
          "code": "total += price"
        }
      ],
      "cpp": [
        {
          "title": "Простое присваивание",
          "code": "x = 10;"
        },
        {
          "title": "Обновление значения",
          "code": "x++;"
        },
        {
          "title": "Накопление суммы",
          "code": "total += price;"
        },
        {
          "title": "Обмен значений",
          "code": "int temp = a;\na = b;\nb = temp;"
        },
        {
          "title": "boolean результат",
          "code": "isEven = (x % 2 == 0);"
        }
      ],
      "csharp": [
        {
          "title": "Простое присваивание",
          "code": "x = 10;"
        },
        {
          "title": "Обновление значения",
          "code": "x++;"
        },
        {
          "title": "Накопление суммы",
          "code": "total += price;"
        },
        {
          "title": "Обмен значений",
          "code": "int temp = a;\na = b;\nb = temp;"
        },
        {
          "title": "boolean результат",
          "code": "isEven = x % 2 == 0;"
        }
      ],
      "java": [
        {
          "title": "Простое присваивание",
          "code": "x = 10;"
        },
        {
          "title": "Обновление значения",
          "code": "x++;"
        },
        {
          "title": "Накопление суммы",
          "code": "total += price;"
        },
        {
          "title": "Обмен значений",
          "code": "int temp = a;\na = b;\nb = temp;"
        },
        {
          "title": "boolean результат",
          "code": "isEven = x % 2 == 0;"
        }
      ]
    }
  },
  "arithmetic_ops": {
    "title": "Арифметические операции",
    "description": "Вычисления над числовыми значениями: сложение, вычитание, умножение, вещественное деление, целочисленное деление и остаток.",
    "examples": {
      "pascal": [
        {
          "title": "Сумма и произведение",
          "code": "result := a + b * c;"
        },
        {
          "title": "Скобки",
          "code": "area := (width + margin) * height;"
        },
        {
          "title": "Целочисленное деление",
          "code": "q := a div b;"
        },
        {
          "title": "Остаток",
          "code": "r := a mod b;"
        },
        {
          "title": "Среднее",
          "code": "avg := (a + b) / 2;"
        }
      ],
      "python": [
        {
          "title": "Сумма и произведение",
          "code": "result = a + b * c"
        },
        {
          "title": "Скобки",
          "code": "area = (width + margin) * height"
        },
        {
          "title": "Целочисленное деление",
          "code": "q = a // b"
        },
        {
          "title": "Остаток",
          "code": "r = a % b"
        },
        {
          "title": "Среднее",
          "code": "avg = (a + b) / 2"
        }
      ],
      "cpp": [
        {
          "title": "Сумма и произведение",
          "code": "int result = a + b * c;"
        },
        {
          "title": "Скобки",
          "code": "int area = (width + margin) * height;"
        },
        {
          "title": "Целочисленное деление",
          "code": "int q = a / b;"
        },
        {
          "title": "Остаток",
          "code": "int r = a % b;"
        },
        {
          "title": "Среднее",
          "code": "double avg = (a + b) / 2.0;"
        }
      ],
      "csharp": [
        {
          "title": "Сумма и произведение",
          "code": "int result = a + b * c;"
        },
        {
          "title": "Скобки",
          "code": "int area = (width + margin) * height;"
        },
        {
          "title": "Целочисленное деление",
          "code": "int q = a / b;"
        },
        {
          "title": "Остаток",
          "code": "int r = a % b;"
        },
        {
          "title": "Среднее",
          "code": "double avg = (a + b) / 2.0;"
        }
      ],
      "java": [
        {
          "title": "Сумма и произведение",
          "code": "int result = a + b * c;"
        },
        {
          "title": "Скобки",
          "code": "int area = (width + margin) * height;"
        },
        {
          "title": "Целочисленное деление",
          "code": "int q = a / b;"
        },
        {
          "title": "Остаток",
          "code": "int r = a % b;"
        },
        {
          "title": "Среднее",
          "code": "double avg = (a + b) / 2.0;"
        }
      ]
    }
  },
  "stdin_read": {
    "title": "Ввод данных",
    "description": "Получение данных от пользователя или из стандартного потока ввода. Ввод превращает программу в решение, которое работает с разными тестами.",
    "examples": {
      "pascal": [
        {
          "title": "Одно число",
          "code": "readln(x);"
        },
        {
          "title": "Два числа",
          "code": "readln(a, b);"
        },
        {
          "title": "Строка",
          "code": "readln(name);"
        },
        {
          "title": "Ввод массива",
          "code": "for i := 1 to n do\n  readln(a[i]);"
        },
        {
          "title": "До нуля",
          "code": "readln(x);\nwhile x <> 0 do\nbegin\n  readln(x);\nend;"
        }
      ],
      "python": [
        {
          "title": "Строка",
          "code": "name = input()"
        },
        {
          "title": "Целое число",
          "code": "x = int(input())"
        },
        {
          "title": "Два числа",
          "code": "a, b = map(int, input().split())"
        },
        {
          "title": "Список",
          "code": "numbers = list(map(int, input().split()))"
        },
        {
          "title": "Ввод в цикле",
          "code": "for _ in range(n):\n    x = int(input())"
        }
      ],
      "cpp": [
        {
          "title": "Одно число",
          "code": "int x;\nstd::cin >> x;"
        },
        {
          "title": "Два числа",
          "code": "std::cin >> a >> b;"
        },
        {
          "title": "Строка без пробелов",
          "code": "std::cin >> name;"
        },
        {
          "title": "Строка целиком",
          "code": "std::getline(std::cin, line);"
        },
        {
          "title": "Массив",
          "code": "for (int i = 0; i < n; i++) std::cin >> a[i];"
        }
      ],
      "csharp": [
        {
          "title": "Строка",
          "code": "string name = Console.ReadLine();"
        },
        {
          "title": "Целое число",
          "code": "int x = int.Parse(Console.ReadLine());"
        },
        {
          "title": "Два числа",
          "code": "var p = Console.ReadLine().Split();\nint a = int.Parse(p[0]);\nint b = int.Parse(p[1]);"
        },
        {
          "title": "Массив",
          "code": "int[] a = Console.ReadLine().Split().Select(int.Parse).ToArray();"
        },
        {
          "title": "Ввод в цикле",
          "code": "for (int i = 0; i < n; i++)\n    a[i] = int.Parse(Console.ReadLine());"
        }
      ],
      "java": [
        {
          "title": "Одно число",
          "code": "Scanner sc = new Scanner(System.in);\nint x = sc.nextInt();"
        },
        {
          "title": "Два числа",
          "code": "int a = sc.nextInt();\nint b = sc.nextInt();"
        },
        {
          "title": "Строка",
          "code": "String name = sc.next();"
        },
        {
          "title": "Строка целиком",
          "code": "String line = sc.nextLine();"
        },
        {
          "title": "Массив",
          "code": "for (int i = 0; i < n; i++) a[i] = sc.nextInt();"
        }
      ]
    }
  },
  "stdout_write": {
    "title": "Вывод данных",
    "description": "Передача результата пользователю или проверяющей системе. Вывод может быть строкой, числом, несколькими значениями, форматированным числом или выражением.",
    "examples": {
      "pascal": [
        {
          "title": "Строка",
          "code": "writeln('Hello');"
        },
        {
          "title": "Значение",
          "code": "writeln(x);"
        },
        {
          "title": "Несколько значений",
          "code": "writeln(a, ' ', b);"
        },
        {
          "title": "Без перевода строки",
          "code": "write(x);"
        },
        {
          "title": "Формат числа",
          "code": "writeln(price:0:2);"
        }
      ],
      "python": [
        {
          "title": "Строка",
          "code": "print('Hello')"
        },
        {
          "title": "Значение",
          "code": "print(x)"
        },
        {
          "title": "Несколько значений",
          "code": "print(a, b)"
        },
        {
          "title": "Без перевода строки",
          "code": "print(x, end='')"
        },
        {
          "title": "Формат числа",
          "code": "print(f'{price:.2f}')"
        }
      ],
      "cpp": [
        {
          "title": "Строка",
          "code": "std::cout << \"Hello\\n\";"
        },
        {
          "title": "Значение",
          "code": "std::cout << x;"
        },
        {
          "title": "Несколько значений",
          "code": "std::cout << a << \" \" << b;"
        },
        {
          "title": "Перевод строки",
          "code": "std::cout << x << \"\\n\";"
        },
        {
          "title": "Формат числа",
          "code": "std::cout << std::fixed << std::setprecision(2) << price;"
        }
      ],
      "csharp": [
        {
          "title": "Строка",
          "code": "Console.WriteLine(\"Hello\");"
        },
        {
          "title": "Значение",
          "code": "Console.WriteLine(x);"
        },
        {
          "title": "Несколько значений",
          "code": "Console.WriteLine($\"{a} {b}\");"
        },
        {
          "title": "Без перевода строки",
          "code": "Console.Write(x);"
        },
        {
          "title": "Формат числа",
          "code": "Console.WriteLine($\"{price:F2}\");"
        }
      ],
      "java": [
        {
          "title": "Строка",
          "code": "System.out.println(\"Hello\");"
        },
        {
          "title": "Значение",
          "code": "System.out.println(x);"
        },
        {
          "title": "Несколько значений",
          "code": "System.out.println(a + \" \" + b);"
        },
        {
          "title": "Без перевода строки",
          "code": "System.out.print(x);"
        },
        {
          "title": "Формат числа",
          "code": "System.out.printf(\"%.2f\", price);"
        }
      ]
    }
  },
  "simple_branch": {
    "title": "Простое ветвление",
    "description": "Выбор действия в зависимости от условия. Если условие истинно, выполняется одна ветка; если ложно, может выполниться другая ветка или действие пропускается.",
    "examples": {
      "pascal": [
        {
          "title": "if без else",
          "code": "if x > 0 then\n  writeln('positive');"
        },
        {
          "title": "if/else",
          "code": "if x mod 2 = 0 then\n  writeln('even')"
        },
        {
          "title": "else",
          "code": "writeln('odd');"
        },
        {
          "title": "Составное условие",
          "code": "if (age >= 18) and hasTicket then\n  writeln('ok');"
        },
        {
          "title": "Блок begin/end",
          "code": "if x > 0 then\nbegin\n  y := x;\n  writeln(y);\nend;"
        },
        {
          "title": "Диапазон",
          "code": "if (x >= 10) and (x <= 20) then\n  writeln('inside');"
        }
      ],
      "python": [
        {
          "title": "if без else",
          "code": "if x > 0:\n    print('positive')"
        },
        {
          "title": "if/else",
          "code": "if x % 2 == 0:\n    print('even')\nelse:\n    print('odd')"
        },
        {
          "title": "Составное условие",
          "code": "if age >= 18 and has_ticket:\n    print('ok')"
        },
        {
          "title": "Блок отступами",
          "code": "if x > 0:\n    y = x\n    print(y)"
        },
        {
          "title": "Диапазон",
          "code": "if 10 <= x <= 20:\n    print('inside')"
        }
      ],
      "cpp": [
        {
          "title": "if без else",
          "code": "if (x > 0)\n    std::cout << \"positive\";"
        },
        {
          "title": "if/else",
          "code": "if (x % 2 == 0)\n    std::cout << \"even\";"
        },
        {
          "title": "else",
          "code": "std::cout << \"odd\";"
        },
        {
          "title": "Составное условие",
          "code": "if (age >= 18 && hasTicket)\n    std::cout << \"ok\";"
        },
        {
          "title": "Блок",
          "code": "if (x > 0) {\n    y = x;\n    std::cout << y;\n}"
        },
        {
          "title": "Диапазон",
          "code": "if (x >= 10 && x <= 20)\n    std::cout << \"inside\";"
        }
      ],
      "csharp": [
        {
          "title": "if без else",
          "code": "if (x > 0)\n    Console.WriteLine(\"positive\");"
        },
        {
          "title": "if/else",
          "code": "if (x % 2 == 0)\n    Console.WriteLine(\"even\");"
        },
        {
          "title": "else",
          "code": "Console.WriteLine(\"odd\");"
        },
        {
          "title": "Составное условие",
          "code": "if (age >= 18 && hasTicket)\n    Console.WriteLine(\"ok\");"
        },
        {
          "title": "Блок",
          "code": "if (x > 0) {\n    y = x;\n    Console.WriteLine(y);\n}"
        },
        {
          "title": "Диапазон",
          "code": "if (x >= 10 && x <= 20)\n    Console.WriteLine(\"inside\");"
        }
      ],
      "java": [
        {
          "title": "if без else",
          "code": "if (x > 0)\n    System.out.println(\"positive\");"
        },
        {
          "title": "if/else",
          "code": "if (x % 2 == 0)\n    System.out.println(\"even\");"
        },
        {
          "title": "else",
          "code": "System.out.println(\"odd\");"
        },
        {
          "title": "Составное условие",
          "code": "if (age >= 18 && hasTicket)\n    System.out.println(\"ok\");"
        },
        {
          "title": "Блок",
          "code": "if (x > 0) {\n    y = x;\n    System.out.println(y);\n}"
        },
        {
          "title": "Диапазон",
          "code": "if (x >= 10 && x <= 20)\n    System.out.println(\"inside\");"
        }
      ]
    }
  },
  "multi_branch": {
    "title": "Множественное ветвление",
    "description": "Выбор одного варианта из нескольких условий. Проверки идут последовательно, поэтому порядок веток влияет на результат.",
    "examples": {
      "pascal": [
        {
          "title": "Оценка",
          "code": "if score >= 90 then writeln(5)\nelse if score >= 70 then writeln(4)\nelse if score >= 50 then writeln(3)\nelse writeln(2);"
        },
        {
          "title": "Температура",
          "code": "if t < 0 then writeln('cold')\nelse if t <= 25 then writeln('normal')\nelse writeln('hot');"
        },
        {
          "title": "Максимум из трех",
          "code": "max := a;\nif b > max then max := b;\nif c > max then max := c;"
        },
        {
          "title": "Тип треугольника",
          "code": "if (a = b) and (b = c) then writeln('equilateral')\nelse if (a = b) or (a = c) or (b = c) then writeln('isosceles')\nelse writeln('scalene');"
        }
      ],
      "python": [
        {
          "title": "Оценка",
          "code": "if score >= 90:\n    print(5)\nelif score >= 70:\n    print(4)\nelif score >= 50:\n    print(3)\nelse:\n    print(2)"
        },
        {
          "title": "Температура",
          "code": "if t < 0:\n    print('cold')\nelif t <= 25:\n    print('normal')\nelse:\n    print('hot')"
        },
        {
          "title": "Максимум из трех",
          "code": "max_value = a\nif b > max_value:\n    max_value = b\nif c > max_value:\n    max_value = c"
        },
        {
          "title": "Категория возраста",
          "code": "if age < 7:\n    print('child')\nelif age < 18:\n    print('teen')\nelse:\n    print('adult')"
        }
      ],
      "cpp": [
        {
          "title": "Оценка",
          "code": "if (score >= 90) std::cout << 5;\nelse if (score >= 70) std::cout << 4;\nelse if (score >= 50) std::cout << 3;\nelse std::cout << 2;"
        },
        {
          "title": "Температура",
          "code": "if (t < 0) std::cout << \"cold\";\nelse if (t <= 25) std::cout << \"normal\";\nelse std::cout << \"hot\";"
        },
        {
          "title": "Максимум",
          "code": "int maxValue = a;\nif (b > maxValue) maxValue = b;\nif (c > maxValue) maxValue = c;"
        },
        {
          "title": "Тип треугольника",
          "code": "if (a == b && b == c) std::cout << \"equilateral\";\nelse if (a == b || a == c || b == c) std::cout << \"isosceles\";\nelse std::cout << \"scalene\";"
        }
      ],
      "csharp": [
        {
          "title": "Оценка",
          "code": "if (score >= 90) Console.WriteLine(5);\nelse if (score >= 70) Console.WriteLine(4);\nelse if (score >= 50) Console.WriteLine(3);\nelse Console.WriteLine(2);"
        },
        {
          "title": "Температура",
          "code": "if (t < 0) Console.WriteLine(\"cold\");\nelse if (t <= 25) Console.WriteLine(\"normal\");\nelse Console.WriteLine(\"hot\");"
        },
        {
          "title": "Максимум",
          "code": "int maxValue = a;\nif (b > maxValue) maxValue = b;\nif (c > maxValue) maxValue = c;"
        },
        {
          "title": "Тип треугольника",
          "code": "if (a == b && b == c) Console.WriteLine(\"equilateral\");\nelse if (a == b || a == c || b == c) Console.WriteLine(\"isosceles\");\nelse Console.WriteLine(\"scalene\");"
        }
      ],
      "java": [
        {
          "title": "Оценка",
          "code": "if (score >= 90) System.out.println(5);\nelse if (score >= 70) System.out.println(4);\nelse if (score >= 50) System.out.println(3);\nelse System.out.println(2);"
        },
        {
          "title": "Температура",
          "code": "if (t < 0) System.out.println(\"cold\");\nelse if (t <= 25) System.out.println(\"normal\");\nelse System.out.println(\"hot\");"
        },
        {
          "title": "Максимум",
          "code": "int maxValue = a;\nif (b > maxValue) maxValue = b;\nif (c > maxValue) maxValue = c;"
        },
        {
          "title": "Тип треугольника",
          "code": "if (a == b && b == c) System.out.println(\"equilateral\");\nelse if (a == b || a == c || b == c) System.out.println(\"isosceles\");\nelse System.out.println(\"scalene\");"
        }
      ]
    }
  },
  "switch_selection": {
    "title": "Выбор по значению",
    "description": "Выбор действия по конкретному значению одной переменной. Подходит для фиксированных вариантов: номер дня, код команды, символ операции, пункт меню.",
    "examples": {
      "pascal": [
        {
          "title": "День недели",
          "code": "case day of\n  1: writeln('Mon');\n  2: writeln('Tue');"
        },
        {
          "title": "else",
          "code": "writeln('Other');\nend;"
        },
        {
          "title": "Калькулятор",
          "code": "case op of\n  '+': writeln(a + b);\n  '-': writeln(a - b);\n  '*': writeln(a * b);\nend;"
        },
        {
          "title": "Несколько значений",
          "code": "case month of\n  12, 1, 2: writeln('winter');\n  3, 4, 5: writeln('spring');\nend;"
        },
        {
          "title": "Меню",
          "code": "case command of\n  1: AddItem;\n  2: DeleteItem;\nend;"
        }
      ],
      "python": [
        {
          "title": "if/elif как аналог",
          "code": "if day == 1:\n    print('Mon')\nelif day == 2:\n    print('Tue')\nelse:\n    print('Other')"
        },
        {
          "title": "match/case",
          "code": "match day:\n    case 1:\n        print('Mon')\n    case 2:\n        print('Tue')\n    case _:\n        print('Other')"
        },
        {
          "title": "Словарь значений",
          "code": "names = {1: 'Mon', 2: 'Tue'}\nprint(names.get(day, 'Other'))"
        },
        {
          "title": "Сезон",
          "code": "if month in (12, 1, 2):\n    print('winter')"
        }
      ],
      "cpp": [
        {
          "title": "День недели",
          "code": "switch (day) {\n  case 1: std::cout << \"Mon\"; break;\n  case 2: std::cout << \"Tue\"; break;\n  default: std::cout << \"Other\";\n}"
        },
        {
          "title": "Калькулятор",
          "code": "switch (op) {\n  case '+': std::cout << a + b; break;\n  case '-': std::cout << a - b; break;\n}"
        },
        {
          "title": "Несколько case",
          "code": "switch (month) {\n  case 12: case 1: case 2:\n    std::cout << \"winter\"; break;\n}"
        },
        {
          "title": "Меню",
          "code": "switch (command) {\n  case 1: addItem(); break;\n  case 2: deleteItem(); break;\n}"
        }
      ],
      "csharp": [
        {
          "title": "switch statement",
          "code": "switch (day) {\n  case 1: Console.WriteLine(\"Mon\"); break;\n  case 2: Console.WriteLine(\"Tue\"); break;\n  default: Console.WriteLine(\"Other\"); break;\n}\nswitch expression\nstring name = day switch {\n  1 => \"Mon\",\n  2 => \"Tue\",\n  _ => \"Other\"\n};"
        },
        {
          "title": "Несколько значений",
          "code": "string season = month switch {\n  12 or 1 or 2 => \"winter\",\n  _ => \"other\"\n};"
        },
        {
          "title": "Калькулятор",
          "code": "switch (op) {\n  case '+': Console.WriteLine(a + b); break;\n  case '-': Console.WriteLine(a - b); break;\n}"
        }
      ],
      "java": [
        {
          "title": "switch statement",
          "code": "switch (day) {\n  case 1: System.out.println(\"Mon\"); break;\n  case 2: System.out.println(\"Tue\"); break;\n  default: System.out.println(\"Other\");\n}"
        },
        {
          "title": "Калькулятор",
          "code": "switch (op) {\n  case '+': System.out.println(a + b); break;\n  case '-': System.out.println(a - b); break;\n}"
        },
        {
          "title": "Несколько case",
          "code": "switch (month) {\n  case 12: case 1: case 2:\n    System.out.println(\"winter\"); break;\n}\nSwitch expression\nString name = switch (day) {\n  case 1 -> \"Mon\";\n  case 2 -> \"Tue\";\n  default -> \"Other\";\n};"
        }
      ]
    }
  },
  "conditional_expression": {
    "title": "Условное получение значения",
    "description": "Выбор одного значения из двух вариантов на основе условия. Результат можно присвоить переменной, вывести или использовать внутри выражения.",
    "examples": {
      "pascal": [
        {
          "title": "Минимум из двух",
          "code": "if a < b then\n  m := a"
        },
        {
          "title": "else",
          "code": "m := b;"
        },
        {
          "title": "Модуль числа",
          "code": "if x < 0 then\n  absValue := -x"
        },
        {
          "title": "else",
          "code": "absValue := x;"
        },
        {
          "title": "Скидка",
          "code": "if total > 1000 then\n  price := total * 0.9"
        },
        {
          "title": "else",
          "code": "price := total;"
        },
        {
          "title": "Текст по условию",
          "code": "if passed then message := 'ok'\nelse message := 'fail';"
        }
      ],
      "python": [
        {
          "title": "Минимум",
          "code": "m = a if a < b else b"
        },
        {
          "title": "Модуль",
          "code": "abs_value = -x if x < 0 else x"
        },
        {
          "title": "Скидка",
          "code": "price = total * 0.9 if total > 1000 else total"
        },
        {
          "title": "Текст",
          "code": "message = 'ok' if passed else 'fail'"
        },
        {
          "title": "Внутри print",
          "code": "print('yes' if x > 0 else 'no')"
        }
      ],
      "cpp": [
        {
          "title": "Минимум",
          "code": "int m = (a < b) ? a : b;"
        },
        {
          "title": "Модуль",
          "code": "int absValue = (x < 0) ? -x : x;"
        },
        {
          "title": "Скидка",
          "code": "double price = (total > 1000) ? total * 0.9 : total;"
        },
        {
          "title": "Текст",
          "code": "std::string message = passed ? \"ok\" : \"fail\";"
        }
      ],
      "csharp": [
        {
          "title": "Минимум",
          "code": "int m = a < b ? a : b;"
        },
        {
          "title": "Модуль",
          "code": "int absValue = x < 0 ? -x : x;"
        },
        {
          "title": "Скидка",
          "code": "double price = total > 1000 ? total * 0.9 : total;"
        },
        {
          "title": "Текст",
          "code": "string message = passed ? \"ok\" : \"fail\";"
        },
        {
          "title": "Внутри вывода",
          "code": "Console.WriteLine(x > 0 ? \"yes\" : \"no\");"
        }
      ],
      "java": [
        {
          "title": "Минимум",
          "code": "int m = a < b ? a : b;"
        },
        {
          "title": "Модуль",
          "code": "int absValue = x < 0 ? -x : x;"
        },
        {
          "title": "Скидка",
          "code": "double price = total > 1000 ? total * 0.9 : total;"
        },
        {
          "title": "Текст",
          "code": "String message = passed ? \"ok\" : \"fail\";"
        },
        {
          "title": "Внутри вывода",
          "code": "System.out.println(x > 0 ? \"yes\" : \"no\");"
        }
      ]
    }
  },
  "counted_loop": {
    "title": "Цикл со счетчиком",
    "description": "Повторение действий заранее известное число раз. Концепт проверяет границы, направление счета, переменную-счетчик и тело цикла.",
    "examples": {
      "pascal": [
        {
          "title": "От 1 до n",
          "code": "for i := 1 to n do\n  writeln(i);"
        },
        {
          "title": "Сумма 1..n",
          "code": "sum := 0;\nfor i := 1 to n do\n  sum := sum + i;"
        },
        {
          "title": "Обратный порядок",
          "code": "for i := n downto 1 do\n  writeln(i);"
        },
        {
          "title": "С шагом через условие",
          "code": "for i := 1 to n do\n  if i mod 2 = 0 then writeln(i);"
        }
      ],
      "python": [
        {
          "title": "От 1 до n",
          "code": "for i in range(1, n + 1):\n    print(i)"
        },
        {
          "title": "Сумма",
          "code": "total = 0\nfor i in range(1, n + 1):\n    total += i"
        },
        {
          "title": "Обратный порядок",
          "code": "for i in range(n, 0, -1):\n    print(i)"
        },
        {
          "title": "Индексы",
          "code": "for i in range(len(a)):\n    print(a[i])"
        }
      ],
      "cpp": [
        {
          "title": "От 1 до n",
          "code": "for (int i = 1; i <= n; i++)\n    std::cout << i;"
        },
        {
          "title": "Сумма",
          "code": "int sum = 0;\nfor (int i = 1; i <= n; i++) sum += i;"
        },
        {
          "title": "Обратный порядок",
          "code": "for (int i = n; i >= 1; i--)\n    std::cout << i;"
        },
        {
          "title": "Индексы",
          "code": "for (int i = 0; i < n; i++)\n    std::cout << a[i];"
        }
      ],
      "csharp": [
        {
          "title": "От 1 до n",
          "code": "for (int i = 1; i <= n; i++)\n    Console.WriteLine(i);"
        },
        {
          "title": "Сумма",
          "code": "int sum = 0;\nfor (int i = 1; i <= n; i++) sum += i;"
        },
        {
          "title": "Обратный порядок",
          "code": "for (int i = n; i >= 1; i--)\n    Console.WriteLine(i);"
        },
        {
          "title": "Индексы",
          "code": "for (int i = 0; i < a.Length; i++)\n    Console.WriteLine(a[i]);"
        }
      ],
      "java": [
        {
          "title": "От 1 до n",
          "code": "for (int i = 1; i <= n; i++)\n    System.out.println(i);"
        },
        {
          "title": "Сумма",
          "code": "int sum = 0;\nfor (int i = 1; i <= n; i++) sum += i;"
        },
        {
          "title": "Обратный порядок",
          "code": "for (int i = n; i >= 1; i--)\n    System.out.println(i);"
        },
        {
          "title": "Индексы",
          "code": "for (int i = 0; i < a.length; i++)\n    System.out.println(a[i]);"
        }
      ]
    }
  },
  "pre_condition_loop": {
    "title": "Цикл с предусловием",
    "description": "Повторение действий, пока условие истинно. Условие проверяется до входа в тело, поэтому тело может не выполниться ни разу.",
    "examples": {
      "pascal": [
        {
          "title": "Пока x положительный",
          "code": "while x > 0 do\nbegin\n  writeln(x);\n  x := x - 1;\nend;"
        },
        {
          "title": "Сумма до нуля",
          "code": "sum := 0;\nreadln(x);\nwhile x <> 0 do\nbegin\n  sum := sum + x;\n  readln(x);\nend;"
        },
        {
          "title": "Поиск первого",
          "code": "i := 1;\nwhile (i <= n) and (a[i] <> target) do\n  i := i + 1;"
        },
        {
          "title": "Защита от бесконечного цикла",
          "code": "while i <= n do\nbegin\n  i := i + 1;\nend;"
        }
      ],
      "python": [
        {
          "title": "Обратный отсчет",
          "code": "while x > 0:\n    print(x)\n    x -= 1"
        },
        {
          "title": "Сумма до нуля",
          "code": "total = 0\nx = int(input())\nwhile x != 0:\n    total += x\n    x = int(input())"
        },
        {
          "title": "Поиск",
          "code": "i = 0\nwhile i < n and a[i] != target:\n    i += 1"
        },
        {
          "title": "Флаг",
          "code": "while not found:\n    found = check()"
        }
      ],
      "cpp": [
        {
          "title": "Обратный отсчет",
          "code": "while (x > 0) {\n    std::cout << x;\n    x--;\n}"
        },
        {
          "title": "Сумма до нуля",
          "code": "int sum = 0;\nwhile (std::cin >> x && x != 0) sum += x;"
        },
        {
          "title": "Поиск",
          "code": "int i = 0;\nwhile (i < n && a[i] != target) i++;"
        },
        {
          "title": "Флаг",
          "code": "while (!found) { found = check(); }"
        }
      ],
      "csharp": [
        {
          "title": "Обратный отсчет",
          "code": "while (x > 0) {\n    Console.WriteLine(x);\n    x--;\n}"
        },
        {
          "title": "Сумма до нуля",
          "code": "int sum = 0;\nwhile (x != 0) {\n    sum += x;\n    x = int.Parse(Console.ReadLine());\n}"
        },
        {
          "title": "Поиск",
          "code": "int i = 0;\nwhile (i < n && a[i] != target) i++;"
        },
        {
          "title": "Флаг",
          "code": "while (!found) { found = Check(); }"
        }
      ],
      "java": [
        {
          "title": "Обратный отсчет",
          "code": "while (x > 0) {\n    System.out.println(x);\n    x--;\n}"
        },
        {
          "title": "Сумма до нуля",
          "code": "int sum = 0;\nwhile (x != 0) {\n    sum += x;\n    x = sc.nextInt();\n}"
        },
        {
          "title": "Поиск",
          "code": "int i = 0;\nwhile (i < n && a[i] != target) i++;"
        },
        {
          "title": "Флаг",
          "code": "while (!found) { found = check(); }"
        }
      ]
    }
  },
  "post_condition_loop": {
    "title": "Цикл с постусловием",
    "description": "Повторение действий с проверкой условия после тела. Тело выполняется минимум один раз, поэтому конструкция удобна для меню и ввода с повтором.",
    "examples": {
      "pascal": [
        {
          "title": "Повтор до нуля repeat",
          "code": "readln(x);\nuntil x = 0;"
        },
        {
          "title": "Меню repeat",
          "code": "ShowMenu;\n  readln(cmd);\nuntil cmd = 0;"
        },
        {
          "title": "Ввод до корректного repeat",
          "code": "readln(age);\nuntil age >= 0;"
        },
        {
          "title": "Накопление",
          "code": "sum := 0;"
        },
        {
          "title": "repeat",
          "code": "readln(x);\n  sum := sum + x;\nuntil x = 0;"
        }
      ],
      "python": [
        {
          "title": "Имитация do while",
          "code": "while True:\n    x = int(input())\n    if x == 0:\n        break"
        },
        {
          "title": "Меню",
          "code": "while True:\n    cmd = input()\n    if cmd == '0':\n        break"
        },
        {
          "title": "Проверка ввода",
          "code": "while True:\n    age = int(input())\n    if age >= 0:\n        break"
        }
      ],
      "cpp": [
        {
          "title": "do while",
          "code": "do {\n    std::cin >> x;\n} while (x != 0);"
        },
        {
          "title": "Меню",
          "code": "do {\n    showMenu();\n    std::cin >> cmd;\n} while (cmd != 0);"
        },
        {
          "title": "Проверка ввода",
          "code": "do { std::cin >> age; } while (age < 0);"
        }
      ],
      "csharp": [
        {
          "title": "do while",
          "code": "do {\n    x = int.Parse(Console.ReadLine());\n} while (x != 0);"
        },
        {
          "title": "Меню",
          "code": "do {\n    ShowMenu();\n    cmd = int.Parse(Console.ReadLine());\n} while (cmd != 0);"
        },
        {
          "title": "Проверка ввода",
          "code": "do { age = int.Parse(Console.ReadLine()); } while (age < 0);"
        }
      ],
      "java": [
        {
          "title": "do while",
          "code": "do {\n    x = sc.nextInt();\n} while (x != 0);"
        },
        {
          "title": "Меню",
          "code": "do {\n    showMenu();\n    cmd = sc.nextInt();\n} while (cmd != 0);"
        },
        {
          "title": "Проверка ввода",
          "code": "do { age = sc.nextInt(); } while (age < 0);"
        }
      ]
    }
  },
  "loop_control": {
    "title": "Управление циклом",
    "description": "Досрочное прекращение или пропуск части итерации. В Pascal это может быть break/continue или явный флаг, если нужно показать переносимую логику.",
    "examples": {
      "pascal": [
        {
          "title": "break при найденном",
          "code": "for i := 1 to n do\n  if a[i] = target then\n  begin\n    found := true;\n    break;\n  end;\ncontinue для пропуска\nfor i := 1 to n do\n  if a[i] < 0 then\n    continue"
        },
        {
          "title": "else",
          "code": "sum := sum + a[i];"
        },
        {
          "title": "Флаг вместо break",
          "code": "found := false;\ni := 1;\nwhile (i <= n) and not found do\nbegin\n  found := a[i] = target;\n  i := i + 1;\nend;"
        }
      ],
      "python": [
        {
          "title": "break",
          "code": "for x in a:\n    if x == target:\n        found = True\n        break\ncontinue\nfor x in a:\n    if x < 0:\n        continue\n    total += x"
        },
        {
          "title": "Флаг",
          "code": "found = False\ni = 0\nwhile i < n and not found:\n    found = a[i] == target\n    i += 1"
        }
      ],
      "cpp": [
        {
          "title": "break",
          "code": "for (int x : a) {\n    if (x == target) { found = true; break; }\n}\ncontinue\nfor (int x : a) {\n    if (x < 0) continue;\n    sum += x;\n}"
        },
        {
          "title": "Флаг",
          "code": "while (i < n && !found) {\n    found = a[i] == target;\n    i++;\n}"
        }
      ],
      "csharp": [
        {
          "title": "break",
          "code": "foreach (int x in a) {\n    if (x == target) { found = true; break; }\n}\ncontinue\nforeach (int x in a) {\n    if (x < 0) continue;\n    sum += x;\n}"
        },
        {
          "title": "Флаг",
          "code": "while (i < n && !found) {\n    found = a[i] == target;\n    i++;\n}"
        }
      ],
      "java": [
        {
          "title": "break",
          "code": "for (int x : a) {\n    if (x == target) { found = true; break; }\n}\ncontinue\nfor (int x : a) {\n    if (x < 0) continue;\n    sum += x;\n}"
        },
        {
          "title": "Флаг",
          "code": "while (i < n && !found) {\n    found = a[i] == target;\n    i++;\n}"
        }
      ]
    }
  },
  "nested_iteration": {
    "title": "Вложенные циклы",
    "description": "Цикл внутри другого цикла. Концепт нужен для таблиц, матриц, перебора пар, двумерных структур и задач на координаты.",
    "examples": {
      "pascal": [
        {
          "title": "Таблица умножения",
          "code": "for i := 1 to n do\nbegin\n  for j := 1 to m do\n    write(i * j, ' ');\n  writeln;\nend;"
        },
        {
          "title": "Матрица",
          "code": "for i := 1 to n do\n  for j := 1 to m do\n    readln(a[i, j]);"
        },
        {
          "title": "Пары",
          "code": "for i := 1 to n do\n  for j := i + 1 to n do\n    writeln(i, ' ', j);"
        }
      ],
      "python": [
        {
          "title": "Таблица",
          "code": "for i in range(n):\n    for j in range(m):\n        print(i * j, end=' ')\n    print()"
        },
        {
          "title": "Матрица",
          "code": "for i in range(n):\n    for j in range(m):\n        a[i][j] = int(input())"
        },
        {
          "title": "Пары",
          "code": "for i in range(n):\n    for j in range(i + 1, n):\n        print(i, j)"
        }
      ],
      "cpp": [
        {
          "title": "Таблица",
          "code": "for (int i = 0; i < n; i++) {\n  for (int j = 0; j < m; j++)\n    std::cout << i * j << \" \";\n  std::cout << \"\\n\";\n}"
        },
        {
          "title": "Матрица",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = 0; j < m; j++)\n    std::cin >> a[i][j];"
        },
        {
          "title": "Пары",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = i + 1; j < n; j++)\n    std::cout << i << \" \" << j;"
        }
      ],
      "csharp": [
        {
          "title": "Таблица",
          "code": "for (int i = 0; i < n; i++) {\n  for (int j = 0; j < m; j++)\n    Console.Write(i * j + \" \");\n  Console.WriteLine();\n}"
        },
        {
          "title": "Матрица",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = 0; j < m; j++)\n    a[i, j] = int.Parse(Console.ReadLine());"
        },
        {
          "title": "Пары",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = i + 1; j < n; j++)\n    Console.WriteLine($\"{i} {j}\");"
        }
      ],
      "java": [
        {
          "title": "Таблица",
          "code": "for (int i = 0; i < n; i++) {\n  for (int j = 0; j < m; j++)\n    System.out.print(i * j + \" \");\n  System.out.println();\n}"
        },
        {
          "title": "Матрица",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = 0; j < m; j++)\n    a[i][j] = sc.nextInt();"
        },
        {
          "title": "Пары",
          "code": "for (int i = 0; i < n; i++)\n  for (int j = i + 1; j < n; j++)\n    System.out.println(i + \" \" + j);"
        }
      ]
    }
  },
  "collection_iteration": {
    "title": "Обход массива по индексам",
    "description": "Последовательный просмотр элементов коллекции. Для Pascal базовый вариант — индексный проход по массиву; в других языках возможны both индексный и foreach-подобный обход.",
    "examples": {
      "pascal": [
        {
          "title": "Сумма массива",
          "code": "sum := 0;\nfor i := 1 to n do\n  sum := sum + a[i];"
        },
        {
          "title": "Вывод элементов",
          "code": "for i := 1 to n do\n  writeln(a[i]);"
        },
        {
          "title": "Поиск отрицательных",
          "code": "for i := 1 to n do\n  if a[i] < 0 then count := count + 1;"
        }
      ],
      "python": [
        {
          "title": "Сумма",
          "code": "total = 0\nfor x in a:\n    total += x"
        },
        {
          "title": "Индексы",
          "code": "for i in range(len(a)):\n    print(a[i])"
        },
        {
          "title": "Отрицательные",
          "code": "count = sum(1 for x in a if x < 0)"
        }
      ],
      "cpp": [
        {
          "title": "Сумма",
          "code": "int sum = 0;\nfor (int i = 0; i < n; i++) sum += a[i];"
        },
        {
          "title": "range-for",
          "code": "for (int x : a) std::cout << x;"
        },
        {
          "title": "Отрицательные",
          "code": "for (int x : a) if (x < 0) count++;"
        }
      ],
      "csharp": [
        {
          "title": "Сумма",
          "code": "int sum = 0;\nforeach (int x in a) sum += x;"
        },
        {
          "title": "Индексы",
          "code": "for (int i = 0; i < a.Length; i++)\n    Console.WriteLine(a[i]);"
        },
        {
          "title": "Отрицательные",
          "code": "foreach (int x in a) if (x < 0) count++;"
        }
      ],
      "java": [
        {
          "title": "Сумма",
          "code": "int sum = 0;\nfor (int x : a) sum += x;"
        },
        {
          "title": "Индексы",
          "code": "for (int i = 0; i < a.length; i++)\n    System.out.println(a[i]);"
        },
        {
          "title": "Отрицательные",
          "code": "for (int x : a) if (x < 0) count++;"
        }
      ]
    }
  },
  "function_definition": {
    "title": "Объявление функции или процедуры",
    "description": "Оформление повторно используемого блока кода с именем, параметрами и, для функции, типом результата.",
    "examples": {
      "pascal": [
        {
          "title": "Процедура",
          "code": "procedure PrintHello;\nbegin\n  writeln('Hello');\nend;"
        },
        {
          "title": "Функция",
          "code": "function Square(x: integer): integer;\nbegin\n  Square := x * x;\nend;"
        },
        {
          "title": "Функция с двумя параметрами",
          "code": "function Add(a, b: integer): integer;\nbegin\n  Add := a + b;\nend;"
        }
      ],
      "python": [
        {
          "title": "Функция",
          "code": "def square(x):\n    return x * x"
        },
        {
          "title": "Процедурный стиль",
          "code": "def print_hello():\n    print('Hello')"
        },
        {
          "title": "С аннотациями",
          "code": "def add(a: int, b: int) -> int:\n    return a + b"
        }
      ],
      "cpp": [
        {
          "title": "Функция",
          "code": "int square(int x) {\n    return x * x;\n}\nvoid функция\nvoid printHello() {\n    std::cout << \"Hello\";\n}"
        },
        {
          "title": "Два параметра",
          "code": "int add(int a, int b) { return a + b; }"
        }
      ],
      "csharp": [
        {
          "title": "Метод",
          "code": "static int Square(int x) {\n    return x * x;\n}\nvoid метод\nstatic void PrintHello() {\n    Console.WriteLine(\"Hello\");\n}"
        },
        {
          "title": "Expression-bodied",
          "code": "static int Add(int a, int b) => a + b;"
        }
      ],
      "java": [
        {
          "title": "Метод",
          "code": "static int square(int x) {\n    return x * x;\n}\nvoid метод\nstatic void printHello() {\n    System.out.println(\"Hello\");\n}"
        },
        {
          "title": "Два параметра",
          "code": "static int add(int a, int b) { return a + b; }"
        }
      ]
    }
  },
  "function_invocation": {
    "title": "Вызов функции или процедуры",
    "description": "Передача управления именованному блоку кода. Вызов может использоваться как отдельная команда или как часть выражения.",
    "examples": {
      "pascal": [
        {
          "title": "Вызов процедуры",
          "code": "PrintHello;"
        },
        {
          "title": "Вызов функции",
          "code": "y := Square(x);"
        },
        {
          "title": "Внутри выражения",
          "code": "writeln(Add(a, b) * 2);"
        }
      ],
      "python": [
        {
          "title": "Вызов функции",
          "code": "y = square(x)"
        },
        {
          "title": "Вызов процедуры",
          "code": "print_hello()"
        },
        {
          "title": "Внутри выражения",
          "code": "print(add(a, b) * 2)"
        }
      ],
      "cpp": [
        {
          "title": "Вызов функции",
          "code": "int y = square(x);"
        },
        {
          "title": "Вызов void",
          "code": "printHello();"
        },
        {
          "title": "Внутри выражения",
          "code": "std::cout << add(a, b) * 2;"
        }
      ],
      "csharp": [
        {
          "title": "Вызов метода",
          "code": "int y = Square(x);"
        },
        {
          "title": "Вызов void",
          "code": "PrintHello();"
        },
        {
          "title": "Внутри выражения",
          "code": "Console.WriteLine(Add(a, b) * 2);"
        }
      ],
      "java": [
        {
          "title": "Вызов метода",
          "code": "int y = square(x);"
        },
        {
          "title": "Вызов void",
          "code": "printHello();"
        },
        {
          "title": "Внутри выражения",
          "code": "System.out.println(add(a, b) * 2);"
        }
      ]
    }
  },
  "return_flow": {
    "title": "Возврат результата",
    "description": "Передача вычисленного значения из функции наружу. В Pascal результат часто записывается в имя функции.",
    "examples": {
      "pascal": [
        {
          "title": "Через имя функции",
          "code": "function Max(a, b: integer): integer;\nbegin\n  if a > b then Max := a else Max := b;\nend;"
        },
        {
          "title": "Досрочный Exit",
          "code": "function SafeDiv(a, b: integer): integer;\nbegin\n  if b = 0 then Exit(0);\n  SafeDiv := a div b;\nend;"
        },
        {
          "title": "Булев результат",
          "code": "function IsEven(x: integer): boolean;\nbegin\n  IsEven := x mod 2 = 0;\nend;"
        }
      ],
      "python": [
        {
          "title": "return значение",
          "code": "def max_value(a, b):\n    return a if a > b else b"
        },
        {
          "title": "Досрочный return",
          "code": "def safe_div(a, b):\n    if b == 0:\n        return 0\n    return a // b\nbool результат\ndef is_even(x):\n    return x % 2 == 0"
        }
      ],
      "cpp": [
        {
          "title": "return значение",
          "code": "int maxValue(int a, int b) {\n    return a > b ? a : b;\n}"
        },
        {
          "title": "Досрочный return",
          "code": "int safeDiv(int a, int b) {\n    if (b == 0) return 0;\n    return a / b;\n}\nbool результат\nbool isEven(int x) { return x % 2 == 0; }"
        }
      ],
      "csharp": [
        {
          "title": "return значение",
          "code": "static int MaxValue(int a, int b) {\n    return a > b ? a : b;\n}"
        },
        {
          "title": "Досрочный return",
          "code": "static int SafeDiv(int a, int b) {\n    if (b == 0) return 0;\n    return a / b;\n}\nbool результат\nstatic bool IsEven(int x) => x % 2 == 0;"
        }
      ],
      "java": [
        {
          "title": "return значение",
          "code": "static int maxValue(int a, int b) {\n    return a > b ? a : b;\n}"
        },
        {
          "title": "Досрочный return",
          "code": "static int safeDiv(int a, int b) {\n    if (b == 0) return 0;\n    return a / b;\n}"
        },
        {
          "title": "boolean результат",
          "code": "static boolean isEven(int x) { return x % 2 == 0; }"
        }
      ]
    }
  },
  "parameter_passing": {
    "title": "Передача параметров",
    "description": "Передача данных в подпрограмму: по значению, по ссылке/var, через out/ref или изменяемые объекты.",
    "examples": {
      "pascal": [
        {
          "title": "По значению",
          "code": "procedure PrintValue(x: integer);\nbegin\n  writeln(x);\nend;"
        },
        {
          "title": "По ссылке var",
          "code": "procedure IncValue(var x: integer);\nbegin\n  x := x + 1;\nend;"
        },
        {
          "title": "Массив как параметр",
          "code": "procedure PrintArray(a: array of integer);\nbegin\n  writeln(Length(a));\nend;"
        }
      ],
      "python": [
        {
          "title": "По значению имени",
          "code": "def print_value(x):\n    print(x)"
        },
        {
          "title": "Возврат нового значения",
          "code": "def inc_value(x):\n    return x + 1"
        },
        {
          "title": "Изменяемый список",
          "code": "def append_item(a, x):\n    a.append(x)"
        }
      ],
      "cpp": [
        {
          "title": "По значению",
          "code": "void printValue(int x) { std::cout << x; }"
        },
        {
          "title": "По ссылке",
          "code": "void incValue(int& x) { x++; }"
        },
        {
          "title": "Вектор по ссылке",
          "code": "void addItem(std::vector<int>& a, int x) { a.push_back(x); }"
        }
      ],
      "csharp": [
        {
          "title": "По значению",
          "code": "static void PrintValue(int x) { Console.WriteLine(x); }"
        },
        {
          "title": "ref параметр",
          "code": "static void IncValue(ref int x) { x++; }"
        },
        {
          "title": "out параметр",
          "code": "static bool TryGet(out int x) { x = 10; return true; }"
        }
      ],
      "java": [
        {
          "title": "По значению",
          "code": "static void printValue(int x) { System.out.println(x); }"
        },
        {
          "title": "Возврат нового",
          "code": "static int incValue(int x) { return x + 1; }"
        },
        {
          "title": "Изменение массива",
          "code": "static void setFirst(int[] a) { a[0] = 1; }"
        }
      ]
    }
  },
  "recursion": {
    "title": "Рекурсия",
    "description": "Функция вызывает сама себя и обязательно имеет базовый случай, чтобы вычисление завершилось.",
    "examples": {
      "pascal": [
        {
          "title": "Факториал",
          "code": "function Fact(n: integer): integer;\nbegin\n  if n <= 1 then Fact := 1\n  else Fact := n * Fact(n - 1);\nend;"
        },
        {
          "title": "Сумма 1..n",
          "code": "function SumN(n: integer): integer;\nbegin\n  if n = 0 then SumN := 0 else SumN := n + SumN(n - 1);\nend;"
        },
        {
          "title": "НОД",
          "code": "function Gcd(a,b: integer): integer;\nbegin\n  if b = 0 then Gcd := a else Gcd := Gcd(b, a mod b);\nend;"
        }
      ],
      "python": [
        {
          "title": "Факториал",
          "code": "def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)"
        },
        {
          "title": "Сумма",
          "code": "def sum_n(n):\n    return 0 if n == 0 else n + sum_n(n - 1)"
        },
        {
          "title": "НОД",
          "code": "def gcd(a, b):\n    return a if b == 0 else gcd(b, a % b)"
        }
      ],
      "cpp": [
        {
          "title": "Факториал",
          "code": "int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}"
        },
        {
          "title": "Сумма",
          "code": "int sumN(int n) { return n == 0 ? 0 : n + sumN(n - 1); }"
        },
        {
          "title": "НОД",
          "code": "int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }"
        }
      ],
      "csharp": [
        {
          "title": "Факториал",
          "code": "static int Fact(int n) {\n    if (n <= 1) return 1;\n    return n * Fact(n - 1);\n}"
        },
        {
          "title": "Сумма",
          "code": "static int SumN(int n) => n == 0 ? 0 : n + SumN(n - 1);"
        },
        {
          "title": "НОД",
          "code": "static int Gcd(int a, int b) => b == 0 ? a : Gcd(b, a % b);"
        }
      ],
      "java": [
        {
          "title": "Факториал",
          "code": "static int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n - 1);\n}"
        },
        {
          "title": "Сумма",
          "code": "static int sumN(int n) { return n == 0 ? 0 : n + sumN(n - 1); }"
        },
        {
          "title": "НОД",
          "code": "static int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }"
        }
      ]
    }
  },
  "indexed_sequence": {
    "title": "Статический массив",
    "description": "Последовательность элементов с фиксированными границами. В Pascal часто задается как array[1..n] of T.",
    "examples": {
      "pascal": [
        {
          "title": "Объявление",
          "code": "var a: array[1..100] of integer;"
        },
        {
          "title": "Запись элемента",
          "code": "a[1] := 10;"
        },
        {
          "title": "Обход",
          "code": "for i := 1 to n do sum := sum + a[i];"
        }
      ],
      "python": [
        {
          "title": "Список",
          "code": "a = [0] * n"
        },
        {
          "title": "Запись a[0] = 10 Обход",
          "code": "for x in a:\n    total += x"
        }
      ],
      "cpp": [
        {
          "title": "Массив",
          "code": "int a[100];"
        },
        {
          "title": "Запись",
          "code": "a[0] = 10;"
        },
        {
          "title": "Обход",
          "code": "for (int i = 0; i < n; i++) sum += a[i];"
        }
      ],
      "csharp": [
        {
          "title": "Массив",
          "code": "int[] a = new int[100];"
        },
        {
          "title": "Запись",
          "code": "a[0] = 10;"
        },
        {
          "title": "Обход",
          "code": "for (int i = 0; i < a.Length; i++) sum += a[i];"
        }
      ],
      "java": [
        {
          "title": "Массив",
          "code": "int[] a = new int[100];"
        },
        {
          "title": "Запись",
          "code": "a[0] = 10;"
        },
        {
          "title": "Обход",
          "code": "for (int i = 0; i < a.length; i++) sum += a[i];"
        }
      ]
    }
  },
  "dynamic_array": {
    "title": "Динамический массив",
    "description": "Массив, размер которого задается во время выполнения. В Pascal используется array of T и SetLength.",
    "examples": {
      "pascal": [
        {
          "title": "Объявление",
          "code": "var a: array of integer;"
        },
        {
          "title": "Размер",
          "code": "SetLength(a, n);"
        },
        {
          "title": "Индексация с нуля",
          "code": "a[0] := 10;"
        },
        {
          "title": "Добавление через новый размер",
          "code": "SetLength(a, Length(a) + 1);\na[High(a)] := x;"
        }
      ],
      "python": [
        {
          "title": "Список",
          "code": "a = []"
        },
        {
          "title": "Размер",
          "code": "a = [0] * n"
        },
        {
          "title": "Добавление",
          "code": "a.append(x)"
        },
        {
          "title": "Длина",
          "code": "len(a)"
        }
      ],
      "cpp": [
        {
          "title": "vector",
          "code": "std::vector<int> a;"
        },
        {
          "title": "Размер",
          "code": "std::vector<int> a(n);"
        },
        {
          "title": "Добавление",
          "code": "a.push_back(x);"
        },
        {
          "title": "Длина",
          "code": "a.size();"
        }
      ],
      "csharp": [
        {
          "title": "List",
          "code": "List<int> a = new List<int>();"
        },
        {
          "title": "Массив",
          "code": "int[] a = new int[n];"
        },
        {
          "title": "Добавление",
          "code": "a.Add(x);"
        }
      ],
      "java": [
        {
          "title": "ArrayList",
          "code": "ArrayList<Integer> a = new ArrayList<>();"
        },
        {
          "title": "Массив",
          "code": "int[] a = new int[n];"
        },
        {
          "title": "Добавление",
          "code": "a.add(x);"
        },
        {
          "title": "Длина",
          "code": "a.size()"
        }
      ]
    }
  },
  "string_sequence": {
    "title": "Строка как последовательность",
    "description": "Работа со строкой: длина, индексация, посимвольный обход, конкатенация и подстроки.",
    "examples": {
      "pascal": [
        {
          "title": "Длина",
          "code": "len := Length(s);"
        },
        {
          "title": "Символ",
          "code": "ch := s[1];"
        },
        {
          "title": "Конкатенация",
          "code": "full := first + ' ' + last;"
        },
        {
          "title": "Обход",
          "code": "for i := 1 to Length(s) do writeln(s[i]);"
        }
      ],
      "python": [
        {
          "title": "Длина",
          "code": "len_s = len(s)"
        },
        {
          "title": "Символ",
          "code": "ch = s[0]"
        },
        {
          "title": "Конкатенация",
          "code": "full = first + ' ' + last"
        },
        {
          "title": "Обход",
          "code": "for ch in s:\n    print(ch)"
        }
      ],
      "cpp": [
        {
          "title": "Длина",
          "code": "int len = s.size();"
        },
        {
          "title": "Символ",
          "code": "char ch = s[0];"
        },
        {
          "title": "Конкатенация",
          "code": "std::string full = first + \" \" + last;"
        },
        {
          "title": "Обход",
          "code": "for (char ch : s) std::cout << ch;"
        }
      ],
      "csharp": [
        {
          "title": "Длина",
          "code": "int len = s.Length;"
        },
        {
          "title": "Символ",
          "code": "char ch = s[0];"
        },
        {
          "title": "Конкатенация",
          "code": "string full = first + \" \" + last;"
        },
        {
          "title": "Обход",
          "code": "foreach (char ch in s) Console.WriteLine(ch);"
        }
      ],
      "java": [
        {
          "title": "Длина",
          "code": "int len = s.length();"
        },
        {
          "title": "Символ",
          "code": "char ch = s.charAt(0);"
        },
        {
          "title": "Конкатенация",
          "code": "String full = first + \" \" + last;"
        },
        {
          "title": "Обход",
          "code": "for (int i = 0; i < s.length(); i++) System.out.println(s.charAt(i));"
        }
      ]
    }
  },
  "key_value_map": {
    "title": "Ключ-значение",
    "description": "Связь ключа и значения. В Pascal учебный вариант часто реализуется записью, массивом пар или TStringList; в других языках есть словари/карты.",
    "examples": {
      "pascal": [
        {
          "title": "Запись как пара",
          "code": "type TPair = record\n  key: string;\n  value: integer;\nend;"
        },
        {
          "title": "Массив пар",
          "code": "var items: array[1..100] of TPair;"
        },
        {
          "title": "Поиск ключа",
          "code": "for i := 1 to n do\n  if items[i].key = key then result := items[i].value;"
        }
      ],
      "python": [
        {
          "title": "Словарь",
          "code": "scores = {'Ann': 5}"
        },
        {
          "title": "Запись scores['Bob'] = 4 Получение",
          "code": "value = scores.get(name, 0)"
        }
      ],
      "cpp": [
        {
          "title": "map",
          "code": "std::map<std::string,int> scores;"
        },
        {
          "title": "Запись",
          "code": "scores[\"Ann\"] = 5;"
        },
        {
          "title": "Получение",
          "code": "int value = scores.count(name) ? scores[name] : 0;"
        }
      ],
      "csharp": [
        {
          "title": "Dictionary",
          "code": "var scores = new Dictionary<string,int>();"
        },
        {
          "title": "Запись",
          "code": "scores[\"Ann\"] = 5;"
        },
        {
          "title": "Получение",
          "code": "int value = scores.GetValueOrDefault(name, 0);"
        }
      ],
      "java": [
        {
          "title": "HashMap",
          "code": "Map<String,Integer> scores = new HashMap<>();"
        },
        {
          "title": "Запись",
          "code": "scores.put(\"Ann\", 5);"
        },
        {
          "title": "Получение",
          "code": "int value = scores.getOrDefault(name, 0);"
        }
      ]
    }
  },
  "file_read": {
    "title": "Чтение из файла",
    "description": "Получение данных из файла или файлового потока. В Pascal классический вариант — Assign/Reset/readln.",
    "examples": {
      "pascal": [
        {
          "title": "Открыть файл",
          "code": "Assign(f, 'input.txt');\nReset(f);"
        },
        {
          "title": "Читать строку",
          "code": "readln(f, line);"
        },
        {
          "title": "Читать до конца",
          "code": "while not eof(f) do\nbegin\n  readln(f, x);\nend;"
        },
        {
          "title": "Закрыть",
          "code": "Close(f);"
        }
      ],
      "python": [
        {
          "title": "Открыть",
          "code": "with open('input.txt') as f:\n    data = f.read()"
        },
        {
          "title": "Строки",
          "code": "for line in open('input.txt'):\n    print(line.strip())"
        },
        {
          "title": "Числа",
          "code": "nums = list(map(int, open('input.txt').read().split()))"
        }
      ],
      "cpp": [
        {
          "title": "ifstream",
          "code": "std::ifstream fin(\"input.txt\");"
        },
        {
          "title": "Читать число",
          "code": "fin >> x;"
        },
        {
          "title": "Строки",
          "code": "while (std::getline(fin, line)) { }"
        }
      ],
      "csharp": [
        {
          "title": "ReadAllText",
          "code": "string text = File.ReadAllText(\"input.txt\");"
        },
        {
          "title": "ReadAllLines",
          "code": "string[] lines = File.ReadAllLines(\"input.txt\");"
        },
        {
          "title": "StreamReader",
          "code": "using var sr = new StreamReader(\"input.txt\");\nstring line = sr.ReadLine();"
        }
      ],
      "java": [
        {
          "title": "Scanner file",
          "code": "Scanner sc = new Scanner(new File(\"input.txt\"));"
        },
        {
          "title": "Читать число",
          "code": "int x = sc.nextInt();"
        },
        {
          "title": "Files",
          "code": "List<String> lines = Files.readAllLines(Path.of(\"input.txt\"));"
        }
      ]
    }
  },
  "file_write": {
    "title": "Запись в файл",
    "description": "Сохранение результата в файл. В Pascal классический вариант — Assign/Rewrite/writeln/Close.",
    "examples": {
      "pascal": [
        {
          "title": "Открыть",
          "code": "Assign(f, 'output.txt');\nRewrite(f);"
        },
        {
          "title": "Записать строку",
          "code": "writeln(f, result);"
        },
        {
          "title": "Несколько значений",
          "code": "writeln(f, a, ' ', b);"
        },
        {
          "title": "Закрыть",
          "code": "Close(f);"
        }
      ],
      "python": [
        {
          "title": "write",
          "code": "with open('output.txt', 'w') as f:\n    f.write(str(result))\nprint в файл\nprint(a, b, file=f)"
        },
        {
          "title": "Строки",
          "code": "f.write(line + '\\n')"
        }
      ],
      "cpp": [
        {
          "title": "ofstream",
          "code": "std::ofstream fout(\"output.txt\");"
        },
        {
          "title": "Запись",
          "code": "fout << result;"
        },
        {
          "title": "Строка",
          "code": "fout << line << \"\\n\";"
        }
      ],
      "csharp": [
        {
          "title": "WriteAllText",
          "code": "File.WriteAllText(\"output.txt\", result.ToString());"
        },
        {
          "title": "WriteAllLines",
          "code": "File.WriteAllLines(\"output.txt\", lines);"
        },
        {
          "title": "StreamWriter",
          "code": "using var sw = new StreamWriter(\"output.txt\");\nsw.WriteLine(result);"
        }
      ],
      "java": [
        {
          "title": "PrintWriter",
          "code": "PrintWriter out = new PrintWriter(\"output.txt\");"
        },
        {
          "title": "Запись",
          "code": "out.println(result);"
        },
        {
          "title": "Закрытие",
          "code": "out.close();"
        }
      ]
    }
  },
  "import_dependency": {
    "title": "Подключение зависимости",
    "description": "Использование готового модуля, библиотеки или пространства имен через uses/import/include/using.",
    "examples": {
      "pascal": [
        {
          "title": "uses",
          "code": "uses SysUtils, Math;"
        },
        {
          "title": "Модуль CRT",
          "code": "uses Crt;"
        },
        {
          "title": "Свой unit",
          "code": "uses MyUnit;"
        }
      ],
      "python": [
        {
          "title": "import",
          "code": "import math\nfrom import\nfrom pathlib import Path"
        },
        {
          "title": "Псевдоним",
          "code": "import numpy as np"
        }
      ],
      "cpp": [
        {
          "title": "include",
          "code": "#include <iostream>"
        },
        {
          "title": "vector",
          "code": "#include <vector>"
        },
        {
          "title": "namespace",
          "code": "using std::cout;"
        }
      ],
      "csharp": [
        {
          "title": "using",
          "code": "using System;"
        },
        {
          "title": "Коллекции",
          "code": "using System.Collections.Generic;"
        },
        {
          "title": "Статический using",
          "code": "using static System.Math;"
        }
      ],
      "java": [
        {
          "title": "import",
          "code": "import java.util.Scanner;"
        },
        {
          "title": "Коллекции",
          "code": "import java.util.*;"
        },
        {
          "title": "Статический import",
          "code": "import static java.lang.Math.max;"
        }
      ]
    }
  },
  "module_namespace": {
    "title": "Модуль и пространство имен",
    "description": "Оформление собственного модуля/единицы компиляции с публичной частью и реализацией.",
    "examples": {
      "pascal": [
        {
          "title": "Unit",
          "code": "unit MyMath;"
        },
        {
          "title": "interface",
          "code": "function Square(x: integer): integer;"
        },
        {
          "title": "implementation",
          "code": "function Square(x: integer): integer;\nbegin Square := x * x; end;\nend.\nProgram uses\nprogram Demo;\nuses MyMath;\nbegin\n  writeln(Square(5));\nend."
        },
        {
          "title": "Разделы interface",
          "code": "// declarations"
        },
        {
          "title": "implementation",
          "code": "// code"
        }
      ],
      "python": [
        {
          "title": "Модуль-файл",
          "code": "def square(x):\n    return x * x"
        },
        {
          "title": "Использование",
          "code": "import my_math\nprint(my_math.square(5))"
        },
        {
          "title": "Пакет",
          "code": "from tools.my_math import square"
        }
      ],
      "cpp": [
        {
          "title": "Header",
          "code": "// my_math.h\nint square(int x);"
        },
        {
          "title": "Source",
          "code": "// my_math.cpp\nint square(int x) { return x * x; }"
        },
        {
          "title": "namespace",
          "code": "namespace tools { int square(int x); }"
        }
      ],
      "csharp": [
        {
          "title": "namespace",
          "code": "namespace Tools {\n  class MyMath { }\n}"
        },
        {
          "title": "Класс библиотеки",
          "code": "public static class MyMath {\n  public static int Square(int x) => x * x;\n}"
        },
        {
          "title": "Использование",
          "code": "using Tools;"
        }
      ],
      "java": [
        {
          "title": "package",
          "code": "package tools;"
        },
        {
          "title": "Класс",
          "code": "public class MyMath {\n  public static int square(int x) { return x*x; }\n}"
        },
        {
          "title": "Использование",
          "code": "import tools.MyMath;"
        }
      ]
    }
  },
  "symbol_visibility": {
    "title": "Видимость символов",
    "description": "Управление тем, какие функции, типы и поля доступны снаружи модуля или класса.",
    "examples": {
      "pascal": [
        {
          "title": "interface публично interface",
          "code": "procedure Run;"
        },
        {
          "title": "implementation скрыто implementation",
          "code": "procedure Helper; begin end;"
        },
        {
          "title": "Локальная процедура",
          "code": "procedure Run;\n  procedure Helper; begin end;\nbegin Helper; end;"
        }
      ],
      "python": [
        {
          "title": "Обычное имя",
          "code": "def run(): pass"
        },
        {
          "title": "Условно приватное",
          "code": "def _helper(): pass"
        },
        {
          "title": "__all__",
          "code": "__all__ = ['run']"
        }
      ],
      "cpp": [
        {
          "title": "public",
          "code": "public:\n  void run();"
        },
        {
          "title": "private",
          "code": "private:\n  int value;\nstatic в файле\nstatic void helper() { }"
        }
      ],
      "csharp": [
        {
          "title": "public",
          "code": "public void Run() { }"
        },
        {
          "title": "private",
          "code": "private int value;"
        },
        {
          "title": "internal",
          "code": "internal class Helper { }"
        }
      ],
      "java": [
        {
          "title": "public",
          "code": "public void run() { }"
        },
        {
          "title": "private",
          "code": "private int value;"
        },
        {
          "title": "package-private",
          "code": "class Helper { }"
        }
      ]
    }
  },
  "search_find": {
    "title": "Линейный поиск",
    "description": "Последовательная проверка элементов до нахождения нужного значения или завершения коллекции.",
    "examples": {
      "pascal": [
        {
          "title": "Поиск",
          "code": "found := false;\nfor i := 1 to n do\n  if a[i] = target then found := true;"
        },
        {
          "title": "Индекс",
          "code": "pos := 0;\nfor i := 1 to n do\n  if (a[i] = target) and (pos = 0) then pos := i;"
        },
        {
          "title": "С break",
          "code": "if a[i] = target then break;"
        }
      ],
      "python": [
        {
          "title": "in",
          "code": "found = target in a"
        },
        {
          "title": "Индекс циклом",
          "code": "pos = -1\nfor i, x in enumerate(a):\n    if x == target:\n        pos = i\n        break"
        },
        {
          "title": "any",
          "code": "found = any(x > 0 for x in a)"
        }
      ],
      "cpp": [
        {
          "title": "find",
          "code": "auto it = std::find(a.begin(), a.end(), target);"
        },
        {
          "title": "Цикл",
          "code": "for (int i = 0; i < n; i++) if (a[i] == target) pos = i;\nbreak\nif (a[i] == target) break;"
        }
      ],
      "csharp": [
        {
          "title": "Contains",
          "code": "bool found = a.Contains(target);"
        },
        {
          "title": "IndexOf",
          "code": "int pos = Array.IndexOf(a, target);"
        },
        {
          "title": "Цикл",
          "code": "for (int i = 0; i < a.Length; i++) if (a[i] == target) pos = i;"
        }
      ],
      "java": [
        {
          "title": "Цикл",
          "code": "for (int i = 0; i < a.length; i++) if (a[i] == target) pos = i;"
        },
        {
          "title": "List contains",
          "code": "boolean found = list.contains(target);"
        },
        {
          "title": "IndexOf",
          "code": "int pos = list.indexOf(target);"
        }
      ]
    }
  },
  "filter_select": {
    "title": "Фильтрация",
    "description": "Отбор элементов по условию и накопление их в новый список, массив или счетчик.",
    "examples": {
      "pascal": [
        {
          "title": "Положительные",
          "code": "k := 0;\nfor i := 1 to n do\n  if a[i] > 0 then\n  begin\n    k := k + 1;\n    b[k] := a[i];\n  end;"
        },
        {
          "title": "Счетчик",
          "code": "if a[i] mod 2 = 0 then count := count + 1;"
        },
        {
          "title": "Сумма выбранных",
          "code": "if a[i] > 10 then sum := sum + a[i];"
        }
      ],
      "python": [
        {
          "title": "Список",
          "code": "b = [x for x in a if x > 0]"
        },
        {
          "title": "Счетчик",
          "code": "count = sum(1 for x in a if x % 2 == 0)"
        },
        {
          "title": "Цикл",
          "code": "b = []\nfor x in a:\n    if x > 0:\n        b.append(x)"
        }
      ],
      "cpp": [
        {
          "title": "copy_if",
          "code": "std::copy_if(a.begin(), a.end(), back_inserter(b), [](int x){ return x > 0; });"
        },
        {
          "title": "Цикл",
          "code": "for (int x : a) if (x > 0) b.push_back(x);"
        },
        {
          "title": "Счетчик",
          "code": "if (x % 2 == 0) count++;"
        }
      ],
      "csharp": [
        {
          "title": "Where",
          "code": "var b = a.Where(x => x > 0).ToList();"
        },
        {
          "title": "Цикл",
          "code": "foreach (int x in a) if (x > 0) b.Add(x);"
        },
        {
          "title": "Счетчик",
          "code": "int count = a.Count(x => x % 2 == 0);"
        }
      ],
      "java": [
        {
          "title": "stream",
          "code": "List<Integer> b = a.stream().filter(x -> x > 0).toList();"
        },
        {
          "title": "Цикл",
          "code": "for (int x : a) if (x > 0) b.add(x);"
        },
        {
          "title": "Счетчик",
          "code": "if (x % 2 == 0) count++;"
        }
      ]
    }
  },
  "fold_aggregate": {
    "title": "Агрегация накоплением",
    "description": "Сворачивание коллекции в одно значение: сумма, произведение, минимум, максимум, счетчик.",
    "examples": {
      "pascal": [
        {
          "title": "Сумма",
          "code": "sum := 0;\nfor i := 1 to n do sum := sum + a[i];"
        },
        {
          "title": "Произведение",
          "code": "p := 1;\nfor i := 1 to n do p := p * a[i];"
        },
        {
          "title": "Минимум",
          "code": "mn := a[1];\nfor i := 2 to n do if a[i] < mn then mn := a[i];"
        }
      ],
      "python": [
        {
          "title": "Сумма",
          "code": "total = sum(a)"
        },
        {
          "title": "Произведение",
          "code": "p = 1\nfor x in a:\n    p *= x"
        },
        {
          "title": "Минимум",
          "code": "mn = min(a)"
        }
      ],
      "cpp": [
        {
          "title": "Сумма",
          "code": "int sum = std::accumulate(a.begin(), a.end(), 0);"
        },
        {
          "title": "Произведение",
          "code": "int p = 1; for (int x : a) p *= x;"
        },
        {
          "title": "Минимум",
          "code": "int mn = *std::min_element(a.begin(), a.end());"
        }
      ],
      "csharp": [
        {
          "title": "Сумма",
          "code": "int sum = a.Sum();"
        },
        {
          "title": "Произведение",
          "code": "int p = 1; foreach (int x in a) p *= x;"
        },
        {
          "title": "Минимум",
          "code": "int mn = a.Min();"
        }
      ],
      "java": [
        {
          "title": "Сумма",
          "code": "int sum = Arrays.stream(a).sum();"
        },
        {
          "title": "Произведение",
          "code": "int p = 1; for (int x : a) p *= x;"
        },
        {
          "title": "Минимум",
          "code": "int mn = Arrays.stream(a).min().getAsInt();"
        }
      ]
    }
  },
  "sort_order": {
    "title": "Сортировка",
    "description": "Упорядочивание элементов по возрастанию, убыванию или пользовательскому правилу.",
    "examples": {
      "pascal": [
        {
          "title": "Пузырек",
          "code": "for i := 1 to n - 1 do\n  for j := 1 to n - i do\n    if a[j] > a[j+1] then\n    begin\n      t := a[j]; a[j] := a[j+1]; a[j+1] := t;\n    end;"
        },
        {
          "title": "Вставка",
          "code": "for i := 2 to n do begin key := a[i]; end;"
        },
        {
          "title": "По убыванию",
          "code": "if a[j] < a[j+1] then begin end;"
        }
      ],
      "python": [
        {
          "title": "sort",
          "code": "a.sort()"
        },
        {
          "title": "sorted",
          "code": "b = sorted(a)"
        },
        {
          "title": "Ключ",
          "code": "items.sort(key=lambda x: x.score)"
        }
      ],
      "cpp": [
        {
          "title": "sort",
          "code": "std::sort(a.begin(), a.end());"
        },
        {
          "title": "Убывание",
          "code": "std::sort(a.begin(), a.end(), std::greater<int>());"
        },
        {
          "title": "Компаратор",
          "code": "std::sort(items.begin(), items.end(), cmp);"
        }
      ],
      "csharp": [
        {
          "title": "Array.Sort",
          "code": "Array.Sort(a);"
        },
        {
          "title": "OrderBy",
          "code": "var b = a.OrderBy(x => x).ToList();"
        },
        {
          "title": "Убывание",
          "code": "var b = a.OrderByDescending(x => x).ToList();"
        }
      ],
      "java": [
        {
          "title": "Arrays.sort",
          "code": "Arrays.sort(a);"
        },
        {
          "title": "Collections.sort",
          "code": "Collections.sort(list);"
        },
        {
          "title": "Компаратор",
          "code": "list.sort((x, y) -> x.score - y.score);"
        }
      ]
    }
  },
  "stack_queue": {
    "title": "Стек и очередь",
    "description": "Хранение элементов с дисциплиной LIFO для стека или FIFO для очереди. В учебном Pascal часто реализуется массивом и индексами.",
    "examples": {
      "pascal": [
        {
          "title": "Стек push",
          "code": "top := top + 1;\nstack[top] := x;"
        },
        {
          "title": "Стек pop",
          "code": "x := stack[top];\ntop := top - 1;"
        },
        {
          "title": "Очередь enqueue",
          "code": "tail := tail + 1;\nqueue[tail] := x;"
        },
        {
          "title": "Очередь dequeue",
          "code": "x := queue[head];\nhead := head + 1;"
        }
      ],
      "python": [
        {
          "title": "Стек list",
          "code": "stack.append(x)\nx = stack.pop()"
        },
        {
          "title": "Очередь deque",
          "code": "from collections import deque\nq = deque()\nq.append(x)\nx = q.popleft()"
        },
        {
          "title": "Проверка пустоты",
          "code": "if not stack:\n    print('empty')"
        }
      ],
      "cpp": [
        {
          "title": "stack",
          "code": "std::stack<int> st;\nst.push(x);\nx = st.top(); st.pop();"
        },
        {
          "title": "queue",
          "code": "std::queue<int> q;\nq.push(x);\nx = q.front(); q.pop();"
        },
        {
          "title": "Массивный стек",
          "code": "top++; stack[top] = x;"
        }
      ],
      "csharp": [
        {
          "title": "Stack",
          "code": "var st = new Stack<int>();\nst.Push(x);\nx = st.Pop();"
        },
        {
          "title": "Queue",
          "code": "var q = new Queue<int>();\nq.Enqueue(x);\nx = q.Dequeue();"
        },
        {
          "title": "Пустота",
          "code": "if (st.Count == 0) Console.WriteLine(\"empty\");"
        }
      ],
      "java": [
        {
          "title": "Stack",
          "code": "Stack<Integer> st = new Stack<>();\nst.push(x);\nx = st.pop();"
        },
        {
          "title": "Queue",
          "code": "Queue<Integer> q = new ArrayDeque<>();\nq.add(x);\nx = q.remove();"
        },
        {
          "title": "Пустота",
          "code": "if (st.empty()) System.out.println(\"empty\");"
        }
      ]
    }
  },
  "linked_node": {
    "title": "Связный список",
    "description": "Структура из узлов, где каждый узел хранит значение и ссылку/указатель на следующий узел.",
    "examples": {
      "pascal": [
        {
          "title": "Узел",
          "code": "type PNode = ^TNode;\nTNode = record\n  value: integer;\n  next: PNode;\nend;"
        },
        {
          "title": "Создать узел",
          "code": "New(p);\np^.value := x;\np^.next := nil;"
        },
        {
          "title": "Добавить в начало",
          "code": "p^.next := head;\nhead := p;"
        },
        {
          "title": "Обход",
          "code": "while p <> nil do begin writeln(p^.value); p := p^.next; end;"
        }
      ],
      "python": [
        {
          "title": "Узел",
          "code": "class Node:\n    def __init__(self, value):"
        },
        {
          "title": "self.value = value self.next = None Начало node.next = head",
          "code": "head = node"
        },
        {
          "title": "Обход",
          "code": "p = head\nwhile p:\n    print(p.value)\n    p = p.next"
        }
      ],
      "cpp": [
        {
          "title": "Узел",
          "code": "struct Node { int value; Node* next; };"
        },
        {
          "title": "Создать",
          "code": "Node* p = new Node{x, nullptr};"
        },
        {
          "title": "Начало",
          "code": "p->next = head;\nhead = p;"
        },
        {
          "title": "Обход",
          "code": "for (Node* p = head; p; p = p->next) std::cout << p->value;"
        }
      ],
      "csharp": [
        {
          "title": "Узел",
          "code": "class Node {\n    public int Value;\n    public Node? Next;\n}"
        },
        {
          "title": "Создать",
          "code": "var p = new Node { Value = x };"
        },
        {
          "title": "Начало",
          "code": "p.Next = head;\nhead = p;"
        },
        {
          "title": "Обход",
          "code": "for (var p = head; p != null; p = p.Next) Console.WriteLine(p.Value);"
        }
      ],
      "java": [
        {
          "title": "Узел",
          "code": "class Node {\n    int value;\n    Node next;\n}"
        },
        {
          "title": "Создать",
          "code": "Node p = new Node();\np.value = x;"
        },
        {
          "title": "Начало",
          "code": "p.next = head;\nhead = p;"
        },
        {
          "title": "Обход",
          "code": "for (Node p = head; p != null; p = p.next) System.out.println(p.value);"
        }
      ]
    }
  },
  "tree_hierarchy": {
    "title": "Дерево",
    "description": "Иерархическая структура узлов. Для бинарного дерева узел обычно имеет left и right.",
    "examples": {
      "pascal": [
        {
          "title": "Узел",
          "code": "type PNode = ^TNode;\nTNode = record\n  value: integer;\n  left, right: PNode;\nend;"
        },
        {
          "title": "Создать лист",
          "code": "New(p); p^.left := nil; p^.right := nil;"
        },
        {
          "title": "Обход inorder",
          "code": "procedure Print(t: PNode);\nbegin\n  if t <> nil then begin Print(t^.left); writeln(t^.value); Print(t^.right); end;\nend;"
        }
      ],
      "python": [
        {
          "title": "Узел",
          "code": "class Node:\n    def __init__(self, value):"
        },
        {
          "title": "self.value = value self.left = None self.right = None Создать",
          "code": "root = Node(10)"
        },
        {
          "title": "Обход",
          "code": "def walk(t):\n    if t:\n        walk(t.left); print(t.value); walk(t.right)"
        }
      ],
      "cpp": [
        {
          "title": "Узел",
          "code": "struct Node { int value; Node* left; Node* right; };"
        },
        {
          "title": "Создать",
          "code": "Node* root = new Node{10, nullptr, nullptr};"
        },
        {
          "title": "Обход",
          "code": "void walk(Node* t) { if (!t) return; walk(t->left); std::cout << t->value; walk(t->right); }"
        }
      ],
      "csharp": [
        {
          "title": "Узел",
          "code": "class Node { public int Value; public Node? Left, Right; }"
        },
        {
          "title": "Создать",
          "code": "var root = new Node { Value = 10 };"
        },
        {
          "title": "Обход",
          "code": "void Walk(Node? t) { if (t == null) return; Walk(t.Left); Console.WriteLine(t.Value); Walk(t.Right); }"
        }
      ],
      "java": [
        {
          "title": "Узел",
          "code": "class Node { int value; Node left, right; }"
        },
        {
          "title": "Создать",
          "code": "Node root = new Node(); root.value = 10;"
        },
        {
          "title": "Обход",
          "code": "static void walk(Node t) { if (t == null) return; walk(t.left); System.out.println(t.value);\nwalk(t.right); }"
        }
      ]
    }
  },
  "graph_edges": {
    "title": "Граф",
    "description": "Множество вершин и связей между ними. В учебных задачах часто используются матрица смежности или список ребер.",
    "examples": {
      "pascal": [
        {
          "title": "Матрица смежности",
          "code": "var g: array[1..100, 1..100] of integer;\ng[u, v] := 1;"
        },
        {
          "title": "Список ребер",
          "code": "type TEdge = record u, v: integer; end;\nedges[k].u := u;"
        },
        {
          "title": "Обход матрицы",
          "code": "for v := 1 to n do\n  if g[u, v] = 1 then writeln(v);"
        }
      ],
      "python": [
        {
          "title": "Матрица",
          "code": "g = [[0] * n for _ in range(n)]"
        },
        {
          "title": "g[u][v] = 1 Список ребер",
          "code": "edges.append((u, v))"
        },
        {
          "title": "Список смежности",
          "code": "adj[u].append(v)"
        }
      ],
      "cpp": [
        {
          "title": "Матрица",
          "code": "std::vector<std::vector<int>> g(n, std::vector<int>(n));\ng[u][v] = 1;"
        },
        {
          "title": "Список ребер",
          "code": "std::vector<std::pair<int,int>> edges;\nedges.push_back({u, v});"
        },
        {
          "title": "Список смежности",
          "code": "adj[u].push_back(v);"
        }
      ],
      "csharp": [
        {
          "title": "Матрица",
          "code": "int[,] g = new int[n, n];\ng[u, v] = 1;"
        },
        {
          "title": "Список ребер",
          "code": "var edges = new List<(int u, int v)>();\nedges.Add((u, v));"
        },
        {
          "title": "Список смежности",
          "code": "adj[u].Add(v);"
        }
      ],
      "java": [
        {
          "title": "Матрица",
          "code": "int[][] g = new int[n][n];\ng[u][v] = 1;"
        },
        {
          "title": "Список ребер",
          "code": "List<int[]> edges = new ArrayList<>();\nedges.add(new int[]{u, v});"
        },
        {
          "title": "Список смежности",
          "code": "adj.get(u).add(v);"
        }
      ]
    }
  },
  "class_type": {
    "title": "Объявление класса",
    "description": "Описание пользовательского типа с полями и методами.",
    "examples": {
      "pascal": [
        {
          "title": "Класс",
          "code": "type TCounter = class"
        },
        {
          "title": "private",
          "code": "value: integer;"
        },
        {
          "title": "public",
          "code": "procedure Inc;\nend;"
        },
        {
          "title": "Поле и метод",
          "code": "procedure TCounter.Inc;\nbegin\n  value := value + 1;\nend;"
        },
        {
          "title": "Конструктор",
          "code": "constructor TCounter.Create;\nbegin\n  value := 0;\nend;"
        }
      ],
      "python": [
        {
          "title": "Класс",
          "code": "class Counter:\n    def __init__(self):"
        },
        {
          "title": "self.value = 0 Метод",
          "code": "def inc(self):"
        }
      ],
      "cpp": [
        {
          "title": "Класс",
          "code": "class Counter {\n    int value;\npublic:\n    void inc();\n};"
        },
        {
          "title": "Метод",
          "code": "void Counter::inc() { value++; }"
        },
        {
          "title": "Конструктор",
          "code": "Counter() : value(0) {}"
        }
      ],
      "csharp": [
        {
          "title": "Класс",
          "code": "class Counter {\n    private int value;\n    public void Inc() { value++; }\n}"
        },
        {
          "title": "Свойство",
          "code": "public int Value { get; set; }"
        },
        {
          "title": "Конструктор",
          "code": "public Counter() { value = 0; }"
        }
      ],
      "java": [
        {
          "title": "Класс",
          "code": "class Counter {\n    private int value;\n    public void inc() { value++; }\n}"
        },
        {
          "title": "Поле",
          "code": "private int value;"
        },
        {
          "title": "Конструктор",
          "code": "Counter() { value = 0; }"
        }
      ]
    }
  },
  "object_instance": {
    "title": "Создание объекта",
    "description": "Получение экземпляра класса, вызов конструктора и освобождение ресурса при необходимости.",
    "examples": {
      "pascal": [
        {
          "title": "Создание",
          "code": "c := TCounter.Create;"
        },
        {
          "title": "Использование",
          "code": "c.Inc;"
        },
        {
          "title": "Освобождение",
          "code": "c.Free;"
        },
        {
          "title": "try/finally",
          "code": "c := TCounter.Create;"
        },
        {
          "title": "try",
          "code": "c.Inc;"
        },
        {
          "title": "finally",
          "code": "c.Free;\nend;"
        }
      ],
      "python": [
        {
          "title": "Создание",
          "code": "c = Counter()"
        },
        {
          "title": "Использование",
          "code": "c.inc()"
        },
        {
          "title": "Список объектов",
          "code": "items = [Counter(), Counter()]"
        }
      ],
      "cpp": [
        {
          "title": "Стековый объект",
          "code": "Counter c;\nc.inc();"
        },
        {
          "title": "Динамический",
          "code": "Counter* c = new Counter();\nc->inc();\ndelete c;"
        },
        {
          "title": "Умный указатель",
          "code": "auto c = std::make_unique<Counter>();"
        }
      ],
      "csharp": [
        {
          "title": "Создание",
          "code": "var c = new Counter();"
        },
        {
          "title": "Использование",
          "code": "c.Inc();"
        },
        {
          "title": "using",
          "code": "using var file = new StreamWriter(\"out.txt\");"
        }
      ],
      "java": [
        {
          "title": "Создание",
          "code": "Counter c = new Counter();"
        },
        {
          "title": "Использование",
          "code": "c.inc();"
        },
        {
          "title": "Список",
          "code": "List<Counter> items = new ArrayList<>();"
        }
      ]
    }
  },
  "method_dispatch": {
    "title": "Вызов метода",
    "description": "Обращение к поведению объекта через имя метода, включая доступ к состоянию объекта.",
    "examples": {
      "pascal": [
        {
          "title": "Вызов",
          "code": "counter.Inc;"
        },
        {
          "title": "Метод с параметром",
          "code": "counter.Add(5);"
        },
        {
          "title": "Виртуальный метод",
          "code": "animal.Speak;"
        }
      ],
      "python": [
        {
          "title": "Вызов",
          "code": "counter.inc()"
        },
        {
          "title": "Метод с параметром",
          "code": "counter.add(5)"
        },
        {
          "title": "Полиморфизм",
          "code": "animal.speak()"
        }
      ],
      "cpp": [
        {
          "title": "Вызов",
          "code": "counter.inc();"
        },
        {
          "title": "Через указатель",
          "code": "ptr->inc();"
        },
        {
          "title": "virtual",
          "code": "animal->speak();"
        }
      ],
      "csharp": [
        {
          "title": "Вызов",
          "code": "counter.Inc();"
        },
        {
          "title": "Метод с параметром",
          "code": "counter.Add(5);"
        },
        {
          "title": "Полиморфизм",
          "code": "animal.Speak();"
        }
      ],
      "java": [
        {
          "title": "Вызов",
          "code": "counter.inc();"
        },
        {
          "title": "Метод с параметром",
          "code": "counter.add(5);"
        },
        {
          "title": "Полиморфизм",
          "code": "animal.speak();"
        }
      ]
    }
  },
  "inheritance_hierarchy": {
    "title": "Наследование",
    "description": "Создание класса-потомка на основе родительского класса с расширением или переопределением поведения.",
    "examples": {
      "pascal": [
        {
          "title": "Наследование",
          "code": "type TDog = class(TAnimal)"
        },
        {
          "title": "public",
          "code": "procedure Speak; override;\nend;"
        },
        {
          "title": "Родительский метод",
          "code": "inherited Create;"
        },
        {
          "title": "Полиморфная переменная",
          "code": "var a: TAnimal;\na := TDog.Create;"
        }
      ],
      "python": [
        {
          "title": "Наследование",
          "code": "class Dog(Animal):\n    def speak(self):\n        print('woof')"
        },
        {
          "title": "super",
          "code": "super().__init__()"
        },
        {
          "title": "Полиморфизм",
          "code": "animals = [Dog(), Cat()]\nfor a in animals:\n    a.speak()"
        }
      ],
      "cpp": [
        {
          "title": "Наследование",
          "code": "class Dog : public Animal {\npublic:\n    void speak() override;\n};"
        },
        {
          "title": "virtual",
          "code": "virtual void speak();"
        },
        {
          "title": "base call",
          "code": "Animal::speak();"
        }
      ],
      "csharp": [
        {
          "title": "Наследование",
          "code": "class Dog : Animal {\n    public override void Speak() { }\n}"
        },
        {
          "title": "virtual/override",
          "code": "public virtual void Speak() { }"
        },
        {
          "title": "base",
          "code": "base.Speak();"
        }
      ],
      "java": [
        {
          "title": "Наследование",
          "code": "class Dog extends Animal {\n    @Override void speak() { }\n}"
        },
        {
          "title": "super",
          "code": "super.speak();"
        },
        {
          "title": "Полиморфизм",
          "code": "Animal a = new Dog();\na.speak();"
        }
      ]
    }
  }
} as const

export const GENERATED_CONSTRUCTION_CATALOG: Record<string, ConstructionDetail> = Object.fromEntries(
  Object.entries(RAW_CATALOG).map(([id, item]) => [
    id,
    {
      title: item.title,
      description: item.description,
      examples: item.examples,
    },
  ]),
)
