/**
 * Sample Code Snippets for Learn2Code
 * These are pre-built snippets for the MVP
 */

export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: 'c' | 'python' | 'cpp' | 'java';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedMinutes: number;
}

export const SAMPLE_SNIPPETS: CodeSnippet[] = [
  // ============ C BEGINNER ============
  {
    id: 'c-hello-world',
    title: 'Hello World',
    description: 'Your first C program - printing text to the screen',
    language: 'c',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 3,
    code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  },
  {
    id: 'c-variables',
    title: 'Variables and Data Types',
    description: 'Learn how to store different types of data',
    language: 'c',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 5,
    code: `#include <stdio.h>

int main() {
    int age = 25;
    float height = 1.75;
    char grade = 'A';

    printf("Age: %d\\n", age);
    printf("Height: %.2f\\n", height);
    printf("Grade: %c\\n", grade);

    return 0;
}`
  },
  {
    id: 'c-arithmetic',
    title: 'Basic Arithmetic',
    description: 'Perform calculations with variables',
    language: 'c',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 4,
    code: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 3;
    
    int sum = a + b;
    int diff = a - b;
    int product = a * b;
    int quotient = a / b;
    int remainder = a % b;

    printf("Sum: %d\\n", sum);
    printf("Remainder: %d\\n", remainder);

    return 0;
}`
  },
  {
    id: 'c-if-else',
    title: 'If-Else Conditions',
    description: 'Make decisions in your code',
    language: 'c',
    difficulty: 'beginner',
    category: 'control-flow',
    estimatedMinutes: 4,
    code: `#include <stdio.h>

int main() {
    int score = 85;

    if (score >= 90) {
        printf("Grade: A\\n");
    } else if (score >= 80) {
        printf("Grade: B\\n");
    } else {
        printf("Grade: C\\n");
    }

    return 0;
}`
  },
  {
    id: 'c-for-loop',
    title: 'For Loop',
    description: 'Repeat code a specific number of times',
    language: 'c',
    difficulty: 'beginner',
    category: 'loops',
    estimatedMinutes: 5,
    code: `#include <stdio.h>

int main() {
    int sum = 0;

    for (int i = 1; i <= 5; i++) {
        sum = sum + i;
        printf("i = %d, sum = %d\\n", i, sum);
    }

    printf("Total: %d\\n", sum);

    return 0;
}`
  },
  {
    id: 'c-while-loop',
    title: 'While Loop',
    description: 'Repeat code while a condition is true',
    language: 'c',
    difficulty: 'beginner',
    category: 'loops',
    estimatedMinutes: 4,
    code: `#include <stdio.h>

int main() {
    int count = 5;

    while (count > 0) {
        printf("Countdown: %d\\n", count);
        count = count - 1;
    }

    printf("Liftoff!\\n");

    return 0;
}`
  },
  {
    id: 'c-function-basic',
    title: 'Simple Function',
    description: 'Create reusable blocks of code',
    language: 'c',
    difficulty: 'beginner',
    category: 'functions',
    estimatedMinutes: 5,
    code: `#include <stdio.h>

int add(int x, int y) {
    int result = x + y;
    return result;
}

int main() {
    int a = 5;
    int b = 3;
    int sum = add(a, b);

    printf("Sum: %d\\n", sum);

    return 0;
}`
  },

  // ============ PYTHON BEGINNER ============
  {
    id: 'py-hello-world',
    title: 'Hello World',
    description: 'Your first Python program',
    language: 'python',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 2,
    code: `message = "Hello, World!"
print(message)`
  },
  {
    id: 'py-variables',
    title: 'Variables',
    description: 'Store and use data in Python',
    language: 'python',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 3,
    code: `name = "Alice"
age = 25
height = 1.65
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}m")
print(f"Student: {is_student}")`
  },
  {
    id: 'py-list-loop',
    title: 'List and For Loop',
    description: 'Work with collections of data',
    language: 'python',
    difficulty: 'beginner',
    category: 'loops',
    estimatedMinutes: 4,
    code: `fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"I like {fruit}")

print(f"Total fruits: {len(fruits)}")`
  },
  {
    id: 'py-sum-numbers',
    title: 'Sum of Numbers',
    description: 'Calculate the sum of a list',
    language: 'python',
    difficulty: 'beginner',
    category: 'loops',
    estimatedMinutes: 4,
    code: `numbers = [1, 2, 3, 4, 5]
total = 0

for num in numbers:
    total = total + num

print(f"Sum: {total}")`
  },
  {
    id: 'py-if-else',
    title: 'Conditional Statements',
    description: 'Make decisions in Python',
    language: 'python',
    difficulty: 'beginner',
    category: 'control-flow',
    estimatedMinutes: 4,
    code: `temperature = 25

if temperature > 30:
    print("It's hot outside!")
elif temperature > 20:
    print("Nice weather!")
else:
    print("It's cold outside!")`
  },
  {
    id: 'py-function',
    title: 'Functions',
    description: 'Create reusable code blocks',
    language: 'python',
    difficulty: 'beginner',
    category: 'functions',
    estimatedMinutes: 4,
    code: `def greet(name):
    message = f"Hello, {name}!"
    return message

result = greet("Alice")
print(result)

result = greet("Bob")
print(result)`
  },
  {
    id: 'py-dictionary',
    title: 'Dictionary Basics',
    description: 'Store key-value pairs',
    language: 'python',
    difficulty: 'beginner',
    category: 'data-structures',
    estimatedMinutes: 5,
    code: `person = {
    "name": "Alice",
    "age": 25,
    "city": "New York"
}

print(person["name"])
print(person["age"])

person["age"] = 26
print(f"Updated age: {person['age']}")`
  },

  // ============ C INTERMEDIATE ============
  {
    id: 'c-pointers-intro',
    title: 'Introduction to Pointers',
    description: 'Understand memory addresses and pointers',
    language: 'c',
    difficulty: 'intermediate',
    category: 'pointers',
    estimatedMinutes: 8,
    code: `#include <stdio.h>

int main() {
    int x = 10;
    int *ptr = &x;

    printf("Value of x: %d\\n", x);
    printf("Address of x: %p\\n", &x);
    printf("Value of ptr: %p\\n", ptr);
    printf("Value pointed by ptr: %d\\n", *ptr);

    *ptr = 20;
    printf("New value of x: %d\\n", x);

    return 0;
}`
  },
  {
    id: 'c-array-basics',
    title: 'Arrays',
    description: 'Store multiple values of the same type',
    language: 'c',
    difficulty: 'intermediate',
    category: 'arrays',
    estimatedMinutes: 6,
    code: `#include <stdio.h>

int main() {
    int numbers[5] = {10, 20, 30, 40, 50};
    int sum = 0;

    for (int i = 0; i < 5; i++) {
        sum = sum + numbers[i];
        printf("numbers[%d] = %d\\n", i, numbers[i]);
    }

    printf("Sum: %d\\n", sum);
    printf("Average: %d\\n", sum / 5);

    return 0;
}`
  },
  {
    id: 'c-string-basics',
    title: 'Strings in C',
    description: 'Work with text as character arrays',
    language: 'c',
    difficulty: 'intermediate',
    category: 'strings',
    estimatedMinutes: 7,
    code: `#include <stdio.h>
#include <string.h>

int main() {
    char greeting[20] = "Hello";
    char name[20] = "World";
    char message[50];

    strcpy(message, greeting);
    strcat(message, ", ");
    strcat(message, name);
    strcat(message, "!");

    printf("%s\\n", message);
    printf("Length: %lu\\n", strlen(message));

    return 0;
}`
  },

  // ============ PYTHON INTERMEDIATE ============
  {
    id: 'py-list-comprehension',
    title: 'List Comprehension',
    description: 'Create lists in a concise way',
    language: 'python',
    difficulty: 'intermediate',
    category: 'lists',
    estimatedMinutes: 5,
    code: `numbers = [1, 2, 3, 4, 5]

squares = [x ** 2 for x in numbers]
print(f"Squares: {squares}")

evens = [x for x in numbers if x % 2 == 0]
print(f"Even numbers: {evens}")

doubled_evens = [x * 2 for x in numbers if x % 2 == 0]
print(f"Doubled evens: {doubled_evens}")`
  },
  {
    id: 'py-file-io',
    title: 'File Input/Output',
    description: 'Read and write files',
    language: 'python',
    difficulty: 'intermediate',
    category: 'file-io',
    estimatedMinutes: 6,
    code: `with open("example.txt", "w") as file:
    file.write("Hello, File!\\n")
    file.write("This is line 2.\\n")

with open("example.txt", "r") as file:
    content = file.read()
    print(content)

with open("example.txt", "r") as file:
    for line in file:
        print(f"Line: {line.strip()}")`
  },

  // ============ C++ BEGINNER ============
  {
    id: 'cpp-hello-world',
    title: 'Hello World in C++',
    description: 'Your first C++ program',
    language: 'cpp',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 3,
    code: `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
  },
  {
    id: 'cpp-variables',
    title: 'Variables in C++',
    description: 'Declare and use variables',
    language: 'cpp',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 4,
    code: `#include <iostream>
#include <string>

int main() {
    std::string name = "Alice";
    int age = 25;
    double height = 1.65;

    std::cout << "Name: " << name << std::endl;
    std::cout << "Age: " << age << std::endl;
    std::cout << "Height: " << height << "m" << std::endl;

    return 0;
}`
  },

  // ============ JAVA BEGINNER ============
  {
    id: 'java-hello-world',
    title: 'Hello World in Java',
    description: 'Your first Java program',
    language: 'java',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 4,
    code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  {
    id: 'java-variables',
    title: 'Variables in Java',
    description: 'Declare and use different data types',
    language: 'java',
    difficulty: 'beginner',
    category: 'basics',
    estimatedMinutes: 5,
    code: `public class Variables {
    public static void main(String[] args) {
        String name = "Alice";
        int age = 25;
        double height = 1.65;
        boolean isStudent = true;

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height + "m");
        System.out.println("Student: " + isStudent);
    }
}`
  },

  // ============ C++ INTERMEDIATE ============
  {
    id: 'cpp-vectors',
    title: 'Vectors in C++',
    description: 'Working with dynamic arrays',
    language: 'cpp',
    difficulty: 'intermediate',
    category: 'data-structures',
    estimatedMinutes: 6,
    code: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers = {1, 2, 3, 4, 5};
    
    numbers.push_back(6);
    
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    std::cout << "Size: " << numbers.size() << std::endl;
    
    return 0;
}`
  },

  // ============ JAVA INTERMEDIATE ============
  {
    id: 'java-arraylist',
    title: 'ArrayList in Java',
    description: 'Working with dynamic lists',
    language: 'java',
    difficulty: 'intermediate',
    category: 'data-structures',
    estimatedMinutes: 6,
    code: `import java.util.ArrayList;

public class ArrayListExample {
    public static void main(String[] args) {
        ArrayList<String> fruits = new ArrayList<>();
        
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        
        for (String fruit : fruits) {
            System.out.println(fruit);
        }
        
        System.out.println("Size: " + fruits.size());
    }
}`
  },

  // ============ C ADVANCED ============
  {
    id: 'c-linked-list',
    title: 'Linked List',
    description: 'Implementing a simple linked list',
    language: 'c',
    difficulty: 'advanced',
    category: 'data-structures',
    estimatedMinutes: 10,
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* createNode(int data) {
    struct Node* newNode = malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

int main() {
    struct Node* head = createNode(1);
    head->next = createNode(2);
    head->next->next = createNode(3);
    
    struct Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\\n");
    
    return 0;
}`
  },

  // ============ PYTHON ADVANCED ============
  {
    id: 'py-decorator',
    title: 'Decorators',
    description: 'Creating and using decorators',
    language: 'python',
    difficulty: 'advanced',
    category: 'functions',
    estimatedMinutes: 8,
    code: `def timer(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f}s")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
    return "Done"

result = slow_function()
print(result)`
  },

  // ============ C++ ADVANCED ============
  {
    id: 'cpp-smart-pointers',
    title: 'Smart Pointers',
    description: 'Using unique_ptr for memory management',
    language: 'cpp',
    difficulty: 'advanced',
    category: 'memory',
    estimatedMinutes: 8,
    code: `#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Created\\n"; }
    ~Resource() { std::cout << "Destroyed\\n"; }
    void use() { std::cout << "Using resource\\n"; }
};

int main() {
    std::unique_ptr<Resource> ptr = std::make_unique<Resource>();
    ptr->use();
    
    return 0;
}`
  },

  // ============ JAVA ADVANCED ============
  {
    id: 'java-streams',
    title: 'Stream API',
    description: 'Functional programming with streams',
    language: 'java',
    difficulty: 'advanced',
    category: 'functional',
    estimatedMinutes: 8,
    code: `import java.util.Arrays;
import java.util.List;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        int sum = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .reduce(0, Integer::sum);
            
        System.out.println("Sum of squares of evens: " + sum);
    }
}`
  },
];

/**
 * Get snippets filtered by criteria
 */
export function getSnippets(filters?: {
  language?: string;
  difficulty?: string;
  category?: string;
}): CodeSnippet[] {
  let result = SAMPLE_SNIPPETS;

  if (filters?.language) {
    result = result.filter(s => s.language === filters.language);
  }

  if (filters?.difficulty) {
    result = result.filter(s => s.difficulty === filters.difficulty);
  }

  if (filters?.category) {
    result = result.filter(s => s.category === filters.category);
  }

  return result;
}

/**
 * Get a snippet by ID
 */
export function getSnippetById(id: string): CodeSnippet | undefined {
  return SAMPLE_SNIPPETS.find(s => s.id === id);
}

/**
 * Get available categories for a language
 */
export function getCategoriesForLanguage(language: string): string[] {
  const snippets = SAMPLE_SNIPPETS.filter(s => s.language === language);
  const categories = new Set(snippets.map(s => s.category));
  return Array.from(categories);
}
