"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

const topicContent: Record<string, {
  title: string;
  icon: string;
  sections: Array<{
    heading: string;
    content: string;
    code?: { language: string; snippet: string };
  }>;
}> = {
  variables: {
    title: "Variables & Data Types",
    icon: "📦",
    sections: [
      {
        heading: "What are Variables?",
        content: "Variables are like labeled containers that store data in your program. Think of them as boxes with name tags - you can put something inside, take it out, or replace it with something else. Every variable has a name (identifier) and a value.",
      },
      {
        heading: "Common Data Types",
        content: "Different types of data require different types of variables:\n\n• **Integers (int)**: Whole numbers like 42, -7, 0\n• **Floating-point (float/double)**: Decimal numbers like 3.14, -0.5\n• **Characters (char)**: Single letters or symbols like 'A', '$'\n• **Strings**: Text sequences like \"Hello, World!\"\n• **Booleans**: True or false values",
      },
      {
        heading: "Declaration vs Assignment",
        content: "Declaration tells the computer to reserve memory for a variable. Assignment gives that variable a value. In some languages, you do both at once.",
        code: {
          language: "c",
          snippet: `// Declaration (C)
int age;

// Assignment
age = 25;

// Declaration + Assignment
int score = 100;`,
        },
      },
      {
        heading: "Type Conversion",
        content: "Sometimes you need to convert data from one type to another. This is called casting or type conversion. Be careful - converting a float to an int loses the decimal part!",
        code: {
          language: "python",
          snippet: `# Python type conversion
x = 10.7
y = int(x)    # y = 10 (truncated)
z = str(x)    # z = "10.7" (string)`,
        },
      },
    ],
  },
  "control-flow": {
    title: "Control Flow",
    icon: "🔀",
    sections: [
      {
        heading: "Making Decisions",
        content: "Control flow determines which parts of your code run based on conditions. The most basic form is the if statement - it checks a condition and runs code only if that condition is true.",
      },
      {
        heading: "If-Else Statements",
        content: "Use if-else to handle two possible paths. The else block runs when the if condition is false.",
        code: {
          language: "c",
          snippet: `int score = 75;

if (score >= 60) {
    printf("You passed!\\n");
} else {
    printf("Try again.\\n");
}`,
        },
      },
      {
        heading: "Multiple Conditions",
        content: "Use else-if (or elif in Python) to check multiple conditions in sequence. Only the first matching condition's code block runs.",
        code: {
          language: "python",
          snippet: `grade = 85

if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")
elif grade >= 70:
    print("C")
else:
    print("F")`,
        },
      },
      {
        heading: "Comparison Operators",
        content: "• **==** Equal to\n• **!=** Not equal to\n• **>** Greater than\n• **<** Less than\n• **>=** Greater than or equal\n• **<=** Less than or equal\n• **&&** (and) Both conditions true\n• **||** (or) Either condition true",
      },
    ],
  },
  loops: {
    title: "Loops & Iteration",
    icon: "🔄",
    sections: [
      {
        heading: "Why Use Loops?",
        content: "Loops let you repeat code without writing it multiple times. Instead of writing 100 print statements, write one loop that runs 100 times.",
      },
      {
        heading: "For Loops",
        content: "Use for loops when you know how many times to repeat. They have three parts: initialization, condition, and increment.",
        code: {
          language: "c",
          snippet: `// Print numbers 1 to 5
for (int i = 1; i <= 5; i++) {
    printf("%d\\n", i);
}`,
        },
      },
      {
        heading: "While Loops",
        content: "Use while loops when you don't know exactly how many iterations you need. They keep running as long as the condition is true.",
        code: {
          language: "python",
          snippet: `# Keep asking until valid input
password = ""
while password != "secret":
    password = input("Enter password: ")
print("Access granted!")`,
        },
      },
      {
        heading: "Break and Continue",
        content: "**break** exits the loop entirely. **continue** skips to the next iteration.",
        code: {
          language: "c",
          snippet: `for (int i = 0; i < 10; i++) {
    if (i == 5) break;    // Exit at 5
    if (i % 2 == 0) continue; // Skip even
    printf("%d\\n", i);   // Prints 1, 3
}`,
        },
      },
    ],
  },
  functions: {
    title: "Functions & Methods",
    icon: "⚡",
    sections: [
      {
        heading: "What are Functions?",
        content: "Functions are reusable blocks of code that perform a specific task. They help organize your code, avoid repetition, and make programs easier to understand and maintain.",
      },
      {
        heading: "Anatomy of a Function",
        content: "A function has:\n• **Name**: What you call it\n• **Parameters**: Input values it accepts\n• **Body**: The code it executes\n• **Return value**: What it gives back",
        code: {
          language: "c",
          snippet: `// Function definition
int add(int a, int b) {
    return a + b;
}

// Function call
int result = add(5, 3);  // result = 8`,
        },
      },
      {
        heading: "Parameters vs Arguments",
        content: "Parameters are the variables in the function definition. Arguments are the actual values you pass when calling the function.",
        code: {
          language: "python",
          snippet: `def greet(name):    # 'name' is a parameter
    print(f"Hello, {name}!")

greet("Alice")      # "Alice" is an argument`,
        },
      },
      {
        heading: "Scope",
        content: "Variables defined inside a function are local - they only exist inside that function. Variables defined outside are global and can be accessed anywhere (but this is often discouraged).",
      },
    ],
  },
  arrays: {
    title: "Arrays & Collections",
    icon: "📚",
    sections: [
      {
        heading: "What are Arrays?",
        content: "Arrays store multiple values of the same type in a single variable. Each value has an index (position number) starting from 0.",
      },
      {
        heading: "Creating Arrays",
        content: "Different languages have different syntax for creating arrays.",
        code: {
          language: "c",
          snippet: `// C - fixed size array
int numbers[5] = {10, 20, 30, 40, 50};

// Access element at index 2
printf("%d", numbers[2]);  // 30`,
        },
      },
      {
        heading: "Iterating Over Arrays",
        content: "Use loops to process each element in an array.",
        code: {
          language: "python",
          snippet: `fruits = ["apple", "banana", "cherry"]

# Using index
for i in range(len(fruits)):
    print(fruits[i])

# Direct iteration
for fruit in fruits:
    print(fruit)`,
        },
      },
      {
        heading: "Common Operations",
        content: "• **Access**: arr[index]\n• **Length**: len(arr) or sizeof(arr)/sizeof(arr[0])\n• **Modify**: arr[index] = newValue\n• **Search**: Loop through to find a value\n• **Sort**: Use built-in sort functions",
      },
    ],
  },
  pointers: {
    title: "Pointers & Memory",
    icon: "🎯",
    sections: [
      {
        heading: "Memory Addresses",
        content: "Every variable is stored at a specific location in memory, identified by an address (like a house number). A pointer is a variable that stores this address instead of a regular value.",
      },
      {
        heading: "Declaring Pointers",
        content: "Use * to declare a pointer and & to get a variable's address.",
        code: {
          language: "c",
          snippet: `int x = 42;
int *ptr = &x;  // ptr holds address of x

printf("%d\\n", x);     // 42 (value)
printf("%p\\n", &x);    // 0x7fff... (address)
printf("%p\\n", ptr);   // same address
printf("%d\\n", *ptr);  // 42 (dereferenced)`,
        },
      },
      {
        heading: "Dereferencing",
        content: "Use * on a pointer to access the value at that address. This is called dereferencing.",
        code: {
          language: "c",
          snippet: `int x = 10;
int *ptr = &x;

*ptr = 20;  // Changes x through pointer
printf("%d", x);  // 20`,
        },
      },
      {
        heading: "Why Use Pointers?",
        content: "• Pass large data efficiently (by reference)\n• Modify variables in functions\n• Dynamic memory allocation\n• Build data structures (linked lists, trees)\n• Work with arrays more flexibly",
      },
    ],
  },
  oop: {
    title: "Object-Oriented Programming",
    icon: "🏗️",
    sections: [
      {
        heading: "Classes and Objects",
        content: "A class is a blueprint for creating objects. An object is an instance of a class with its own data (attributes) and behavior (methods).",
        code: {
          language: "python",
          snippet: `class Dog:
    def __init__(self, name):
        self.name = name  # attribute
    
    def bark(self):       # method
        print(f"{self.name} says woof!")

my_dog = Dog("Buddy")  # object
my_dog.bark()  # "Buddy says woof!"`,
        },
      },
      {
        heading: "Encapsulation",
        content: "Bundling data and methods together, hiding internal details. Use private attributes to protect data from direct access.",
      },
      {
        heading: "Inheritance",
        content: "Create new classes based on existing ones. The child class inherits attributes and methods from the parent.",
        code: {
          language: "java",
          snippet: `class Animal {
    void eat() { System.out.println("Eating"); }
}

class Cat extends Animal {
    void meow() { System.out.println("Meow!"); }
}

Cat cat = new Cat();
cat.eat();  // Inherited
cat.meow(); // Own method`,
        },
      },
      {
        heading: "Polymorphism",
        content: "Objects of different classes can be treated the same way if they share a common interface or parent class. The same method name can behave differently based on the object type.",
      },
    ],
  },
  io: {
    title: "Input & Output",
    icon: "💬",
    sections: [
      {
        heading: "Console Output",
        content: "Print information to the screen for the user to see.",
        code: {
          language: "c",
          snippet: `// C
printf("Hello, World!\\n");
printf("Number: %d\\n", 42);

// Python
print("Hello, World!")
print(f"Number: {42}")`,
        },
      },
      {
        heading: "Console Input",
        content: "Read data typed by the user.",
        code: {
          language: "python",
          snippet: `# Python - simple
name = input("Enter your name: ")
age = int(input("Enter your age: "))

# C - with scanf
int age;
printf("Enter age: ");
scanf("%d", &age);`,
        },
      },
      {
        heading: "File Handling",
        content: "Read from and write to files for persistent storage.",
        code: {
          language: "python",
          snippet: `# Writing to file
with open("data.txt", "w") as f:
    f.write("Hello, File!")

# Reading from file
with open("data.txt", "r") as f:
    content = f.read()
    print(content)`,
        },
      },
      {
        heading: "Format Specifiers (C)",
        content: "• **%d** - Integer\n• **%f** - Float\n• **%c** - Character\n• **%s** - String\n• **%p** - Pointer address\n• **%x** - Hexadecimal",
      },
    ],
  },
};

export default function TopicPage({ params }: { params: { topic: string } }) {
  const topic = topicContent[params.topic];

  if (!topic) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/theory" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to Theory
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-4xl">{topic.icon}</span>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="border-b-2 border-[#00ff87] pb-1">{topic.title}</span>
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12">
          {topic.sections.map((section, index) => (
            <section key={index} className="border-l-2 border-[#222] pl-6">
              <h2 className="text-xl font-medium text-white mb-4">{section.heading}</h2>
              <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-line mb-4">
                {section.content.split("**").map((part, i) =>
                  i % 2 === 0 ? part : <strong key={i} className="text-white">{part}</strong>
                )}
              </div>
              {section.code && (
                <div className="bg-[#111] border border-[#222] overflow-hidden">
                  <div className="px-4 py-2 bg-[#0a0a0a] border-b border-[#222]">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">
                      {section.code.language}
                    </span>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-gray-300">{section.code.snippet}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Practice CTA */}
        <div className="mt-16 border border-[#222] p-6 text-center">
          <h3 className="text-lg font-medium text-white mb-2">Ready to practice?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Apply what you've learned by explaining code in your own words.
          </p>
          <Link
            href="/learn"
            className="inline-block px-6 py-2 bg-[#00ff87] text-black text-sm font-medium hover:bg-[#00cc6a] transition-colors"
          >
            Start Practicing →
          </Link>
        </div>
      </div>
    </main>
  );
}
