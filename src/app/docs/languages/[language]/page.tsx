"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

const languageContent: Record<string, {
  name: string;
  icon: string;
  description: string;
  history: string;
  sections: Array<{
    title: string;
    content: string;
    code?: string;
  }>;
}> = {
  c: {
    name: "C",
    icon: "🔧",
    description: "C is a general-purpose programming language created in the early 1970s. It remains one of the most widely used languages, especially for system programming.",
    history: "Created by Dennis Ritchie at Bell Labs between 1969-1973. It was developed to rewrite the Unix operating system. C influenced many later languages including C++, Java, and Python.",
    sections: [
      {
        title: "Hello World",
        content: "Every C program starts with the main() function. #include brings in external libraries.",
        code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
      },
      {
        title: "Variables and Data Types",
        content: "C is statically typed - you must declare the type of each variable.",
        code: `int age = 25;           // Integer
float price = 19.99;    // Floating point
char grade = 'A';       // Single character
char name[50] = "John"; // String (char array)`,
      },
      {
        title: "Control Flow",
        content: "C uses standard control flow structures: if/else, for, while, and switch.",
        code: `// If-else
if (age >= 18) {
    printf("Adult\\n");
} else {
    printf("Minor\\n");
}

// For loop
for (int i = 0; i < 5; i++) {
    printf("%d\\n", i);
}`,
      },
      {
        title: "Functions",
        content: "Functions must declare their return type and parameter types.",
        code: `int add(int a, int b) {
    return a + b;
}

void greet(char name[]) {
    printf("Hello, %s!\\n", name);
}`,
      },
      {
        title: "Pointers",
        content: "Pointers store memory addresses. They're essential for dynamic memory and efficient data passing.",
        code: `int x = 10;
int *ptr = &x;  // ptr holds address of x

printf("%d\\n", *ptr);  // Prints 10
*ptr = 20;             // x is now 20`,
      },
      {
        title: "Arrays",
        content: "Arrays are fixed-size collections of elements of the same type.",
        code: `int numbers[5] = {1, 2, 3, 4, 5};

for (int i = 0; i < 5; i++) {
    printf("%d\\n", numbers[i]);
}`,
      },
    ],
  },
  python: {
    name: "Python",
    icon: "🐍",
    description: "Python is a high-level, interpreted language known for its clear syntax and readability. It emphasizes code readability and simplicity.",
    history: "Created by Guido van Rossum and first released in 1991. Named after Monty Python. Python 3 was released in 2008 with significant improvements.",
    sections: [
      {
        title: "Hello World",
        content: "Python's simplicity shines - no boilerplate needed for basic programs.",
        code: `print("Hello, World!")`,
      },
      {
        title: "Variables and Data Types",
        content: "Python is dynamically typed - no need to declare types explicitly.",
        code: `age = 25              # Integer
price = 19.99         # Float
name = "Alice"        # String
is_student = True     # Boolean
items = [1, 2, 3]     # List`,
      },
      {
        title: "Control Flow",
        content: "Python uses indentation instead of braces to define code blocks.",
        code: `# If-else
if age >= 18:
    print("Adult")
else:
    print("Minor")

# For loop
for i in range(5):
    print(i)

# While loop
while count > 0:
    print(count)
    count -= 1`,
      },
      {
        title: "Functions",
        content: "Functions are defined with the def keyword.",
        code: `def greet(name):
    return f"Hello, {name}!"

def add(a, b=0):  # Default parameter
    return a + b

# Lambda function
square = lambda x: x ** 2`,
      },
      {
        title: "Lists and Dictionaries",
        content: "Python has powerful built-in data structures.",
        code: `# Lists
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
print(fruits[0])  # "apple"

# Dictionaries
person = {
    "name": "Alice",
    "age": 30
}
print(person["name"])  # "Alice"`,
      },
      {
        title: "Classes",
        content: "Python supports object-oriented programming with classes.",
        code: `class Dog:
    def __init__(self, name):
        self.name = name
    
    def bark(self):
        print(f"{self.name} says woof!")

my_dog = Dog("Buddy")
my_dog.bark()`,
      },
    ],
  },
  cpp: {
    name: "C++",
    icon: "⚡",
    description: "C++ is a powerful language that extends C with object-oriented features. It's widely used for performance-critical applications.",
    history: "Created by Bjarne Stroustrup at Bell Labs starting in 1979, originally called 'C with Classes'. It was renamed C++ in 1983.",
    sections: [
      {
        title: "Hello World",
        content: "C++ uses iostream for input/output operations.",
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
      },
      {
        title: "Variables and Data Types",
        content: "C++ extends C's type system with more options.",
        code: `int age = 25;
double price = 19.99;
char grade = 'A';
string name = "Alice";  // Requires <string>
bool isActive = true;`,
      },
      {
        title: "Classes and Objects",
        content: "C++ is built around object-oriented programming.",
        code: `class Rectangle {
private:
    int width, height;
    
public:
    Rectangle(int w, int h) : width(w), height(h) {}
    
    int area() {
        return width * height;
    }
};

Rectangle rect(10, 5);
cout << rect.area();  // 50`,
      },
      {
        title: "Inheritance",
        content: "Classes can inherit from other classes.",
        code: `class Animal {
public:
    virtual void speak() {
        cout << "..." << endl;
    }
};

class Dog : public Animal {
public:
    void speak() override {
        cout << "Woof!" << endl;
    }
};`,
      },
      {
        title: "STL Containers",
        content: "The Standard Template Library provides powerful data structures.",
        code: `#include <vector>
#include <map>

vector<int> numbers = {1, 2, 3, 4, 5};
numbers.push_back(6);

map<string, int> ages;
ages["Alice"] = 30;
ages["Bob"] = 25;`,
      },
      {
        title: "Smart Pointers",
        content: "Modern C++ uses smart pointers for safer memory management.",
        code: `#include <memory>

// Unique pointer - single ownership
unique_ptr<int> p1 = make_unique<int>(42);

// Shared pointer - shared ownership
shared_ptr<int> p2 = make_shared<int>(100);`,
      },
    ],
  },
  java: {
    name: "Java",
    icon: "☕",
    description: "Java is a class-based, object-oriented language designed to have few implementation dependencies. It runs on the Java Virtual Machine (JVM).",
    history: "Developed by James Gosling at Sun Microsystems, released in 1995. Its philosophy of 'write once, run anywhere' made it hugely popular for enterprise applications.",
    sections: [
      {
        title: "Hello World",
        content: "Java requires a class structure even for simple programs.",
        code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      },
      {
        title: "Variables and Data Types",
        content: "Java is statically typed with primitive and reference types.",
        code: `int age = 25;
double price = 19.99;
char grade = 'A';
String name = "Alice";
boolean isActive = true;

// Arrays
int[] numbers = {1, 2, 3, 4, 5};`,
      },
      {
        title: "Classes and Objects",
        content: "Everything in Java is part of a class.",
        code: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void greet() {
        System.out.println("Hi, I'm " + name);
    }
}`,
      },
      {
        title: "Inheritance and Interfaces",
        content: "Java uses single inheritance with interface support.",
        code: `interface Drawable {
    void draw();
}

class Shape {
    protected String color;
}

class Circle extends Shape implements Drawable {
    private double radius;
    
    public void draw() {
        System.out.println("Drawing circle");
    }
}`,
      },
      {
        title: "Collections",
        content: "Java Collections Framework provides data structures.",
        code: `import java.util.*;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");

Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 30);

Set<Integer> unique = new HashSet<>();`,
      },
      {
        title: "Exception Handling",
        content: "Java uses try-catch blocks for error handling.",
        code: `try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Cleanup code");
}`,
      },
    ],
  },
};

export default function LanguageGuidePage({ params }: { params: { language: string } }) {
  const lang = languageContent[params.language];

  if (!lang) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/docs/languages" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to Languages
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{lang.icon}</span>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="border-b-2 border-[#00ff87] pb-1">{lang.name}</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{lang.description}</p>
        </div>

        {/* History */}
        <div className="mb-12 p-6 bg-[#111] border border-[#222]">
          <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-2">History</h2>
          <p className="text-sm text-gray-400">{lang.history}</p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {lang.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                <span className="text-[#00ff87] text-sm font-mono">{String(index + 1).padStart(2, '0')}</span>
                {section.title}
              </h2>
              <p className="text-sm text-gray-400 mb-4">{section.content}</p>
              {section.code && (
                <div className="bg-[#0a0a0a] border border-[#222] overflow-hidden">
                  <div className="px-4 py-2 bg-[#111] border-b border-[#222] flex items-center justify-between">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider">{params.language}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(section.code!)}
                      className="text-[10px] text-gray-600 hover:text-[#00ff87]"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-4 text-sm overflow-x-auto">
                    <code className="text-gray-300">{section.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Practice CTA */}
        <div className="mt-16 border border-[#222] p-6 text-center">
          <h3 className="text-lg font-medium text-white mb-2">Practice {lang.name}</h3>
          <p className="text-sm text-gray-500 mb-4">
            Apply what you've learned by explaining {lang.name} code in your own words.
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
