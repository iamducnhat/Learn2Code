"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

const algorithmContent: Record<string, {
  name: string;
  icon: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
  explanation: string;
  useCases: string[];
  code: { language: string; snippet: string }[];
  visualization?: string;
}> = {
  "arrays": {
    name: "Arrays",
    icon: "📊",
    category: "Data Structure",
    complexity: { time: "O(1) access, O(n) search", space: "O(n)" },
    description: "A contiguous block of memory storing elements of the same type, accessed by index.",
    explanation: "Arrays are the most fundamental data structure. Elements are stored in adjacent memory locations, allowing instant access to any element using its index. However, inserting or deleting elements (except at the end) requires shifting other elements.",
    useCases: ["Storing collections of similar items", "Implementing other data structures", "Matrix operations", "Lookup tables"],
    code: [
      {
        language: "c",
        snippet: `// Declaration and initialization
int numbers[5] = {10, 20, 30, 40, 50};

// Access by index (0-based)
printf("%d\\n", numbers[2]);  // 30

// Modify element
numbers[0] = 15;

// Iterate through array
for (int i = 0; i < 5; i++) {
    printf("%d ", numbers[i]);
}`,
      },
      {
        language: "python",
        snippet: `# Python list (dynamic array)
numbers = [10, 20, 30, 40, 50]

# Access by index
print(numbers[2])  # 30

# Append element
numbers.append(60)

# List comprehension
squares = [x**2 for x in range(10)]`,
      },
    ],
  },
  "linked-lists": {
    name: "Linked Lists",
    icon: "🔗",
    category: "Data Structure",
    complexity: { time: "O(n) access, O(1) insert/delete", space: "O(n)" },
    description: "A sequence of nodes where each node contains data and a pointer to the next node.",
    explanation: "Unlike arrays, linked list elements are not stored contiguously. Each node points to the next, allowing efficient insertion and deletion anywhere in the list. However, accessing an element requires traversing from the head.",
    useCases: ["Dynamic memory allocation", "Implementing stacks/queues", "Undo functionality", "Music playlists"],
    code: [
      {
        language: "c",
        snippet: `// Node structure
struct Node {
    int data;
    struct Node* next;
};

// Create a new node
struct Node* createNode(int data) {
    struct Node* node = malloc(sizeof(struct Node));
    node->data = data;
    node->next = NULL;
    return node;
}

// Insert at head
void insertHead(struct Node** head, int data) {
    struct Node* node = createNode(data);
    node->next = *head;
    *head = node;
}`,
      },
      {
        language: "python",
        snippet: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node`,
      },
    ],
  },
  "stacks": {
    name: "Stacks",
    icon: "📚",
    category: "Data Structure",
    complexity: { time: "O(1) push/pop", space: "O(n)" },
    description: "A Last-In-First-Out (LIFO) data structure where elements are added and removed from the top.",
    explanation: "Think of a stack of plates - you can only add or remove from the top. This simple constraint makes stacks perfect for tracking nested operations, like function calls or matching parentheses.",
    useCases: ["Function call stack", "Undo/redo operations", "Expression evaluation", "Backtracking algorithms"],
    code: [
      {
        language: "c",
        snippet: `#define MAX 100
int stack[MAX];
int top = -1;

void push(int x) {
    if (top >= MAX - 1) return;  // Overflow
    stack[++top] = x;
}

int pop() {
    if (top < 0) return -1;  // Underflow
    return stack[top--];
}

int peek() {
    if (top < 0) return -1;
    return stack[top];
}`,
      },
      {
        language: "python",
        snippet: `# Using a list as stack
stack = []

# Push
stack.append(1)
stack.append(2)
stack.append(3)

# Pop
top = stack.pop()  # 3

# Peek
top = stack[-1]  # 2

# Check if empty
is_empty = len(stack) == 0`,
      },
    ],
  },
  "queues": {
    name: "Queues",
    icon: "🚶",
    category: "Data Structure",
    complexity: { time: "O(1) enqueue/dequeue", space: "O(n)" },
    description: "A First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front.",
    explanation: "Like a line at a store - first person in line is first to be served. Queues are essential for processing items in the order they arrive, like print jobs or web server requests.",
    useCases: ["Task scheduling", "Breadth-first search", "Print queue", "Message buffers"],
    code: [
      {
        language: "c",
        snippet: `#define MAX 100
int queue[MAX];
int front = 0, rear = -1, count = 0;

void enqueue(int x) {
    if (count >= MAX) return;
    rear = (rear + 1) % MAX;
    queue[rear] = x;
    count++;
}

int dequeue() {
    if (count <= 0) return -1;
    int item = queue[front];
    front = (front + 1) % MAX;
    count--;
    return item;
}`,
      },
      {
        language: "python",
        snippet: `from collections import deque

# Create queue
queue = deque()

# Enqueue
queue.append(1)
queue.append(2)
queue.append(3)

# Dequeue
front = queue.popleft()  # 1

# Peek
front = queue[0]  # 2`,
      },
    ],
  },
  "binary-search": {
    name: "Binary Search",
    icon: "🎯",
    category: "Search Algorithm",
    complexity: { time: "O(log n)", space: "O(1)" },
    description: "An efficient search algorithm that finds a target value by repeatedly dividing the search interval in half.",
    explanation: "Binary search only works on sorted arrays. It compares the target with the middle element - if they match, we're done. If the target is smaller, search the left half; if larger, search the right half. This halving makes it extremely fast.",
    useCases: ["Searching in sorted arrays", "Finding boundaries", "Dictionary lookup", "Database indexing"],
    code: [
      {
        language: "c",
        snippet: `int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target)
            return mid;  // Found
        
        if (arr[mid] < target)
            left = mid + 1;   // Search right
        else
            right = mid - 1;  // Search left
    }
    
    return -1;  // Not found
}`,
      },
      {
        language: "python",
        snippet: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Or use built-in
import bisect
index = bisect.bisect_left(arr, target)`,
      },
    ],
  },
  "bubble-sort": {
    name: "Bubble Sort",
    icon: "🫧",
    category: "Sorting Algorithm",
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "A simple sorting algorithm that repeatedly steps through the list, swapping adjacent elements if they're in the wrong order.",
    explanation: "Called 'bubble' because smaller elements 'bubble up' to the top. While easy to understand, it's inefficient for large datasets. Each pass moves the largest unsorted element to its correct position.",
    useCases: ["Educational purposes", "Small datasets", "Nearly sorted data", "Simple implementations"],
    code: [
      {
        language: "c",
        snippet: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        
        // Optimization: stop if no swaps
        if (!swapped) break;
    }
}`,
      },
      {
        language: "python",
        snippet: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        swapped = False
        
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return arr`,
      },
    ],
  },
  "quick-sort": {
    name: "Quick Sort",
    icon: "⚡",
    category: "Sorting Algorithm",
    complexity: { time: "O(n log n) average, O(n²) worst", space: "O(log n)" },
    description: "A divide-and-conquer algorithm that picks a pivot element and partitions the array around it.",
    explanation: "Quick sort selects a 'pivot' and rearranges the array so elements smaller than pivot go left, larger go right. Then it recursively sorts the sub-arrays. With good pivot selection, it's one of the fastest sorting algorithms.",
    useCases: ["General-purpose sorting", "Large datasets", "When average case matters", "In-place sorting needed"],
    code: [
      {
        language: "c",
        snippet: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    
    return i + 1;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
      },
      {
        language: "python",
        snippet: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)`,
      },
    ],
  },
  "recursion": {
    name: "Recursion",
    icon: "🔄",
    category: "Algorithm Technique",
    complexity: { time: "Varies by problem", space: "O(n) call stack" },
    description: "A technique where a function calls itself to solve smaller instances of the same problem.",
    explanation: "Recursion breaks problems into smaller, similar sub-problems. Every recursive function needs a base case (when to stop) and a recursive case (how to break down). The call stack stores each function call until the base case is reached.",
    useCases: ["Tree traversal", "Divide and conquer", "Mathematical computations", "Backtracking problems"],
    code: [
      {
        language: "c",
        snippet: `// Factorial: n! = n * (n-1)!
int factorial(int n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}

// Fibonacci
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      },
      {
        language: "python",
        snippet: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# With memoization for efficiency
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
      },
    ],
  },
};

export default function AlgorithmDetailPage({ params }: { params: { algorithm: string } }) {
  const algo = algorithmContent[params.algorithm];

  if (!algo) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/docs/algorithms" className="text-gray-600 text-sm hover:text-[#00ff87] mb-4 inline-block">
            ← Back to Algorithms
          </Link>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">{algo.icon}</span>
            <div>
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">{algo.category}</span>
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="border-b-2 border-[#00ff87] pb-1">{algo.name}</span>
              </h1>
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-[#111] border border-[#222]">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Time Complexity</span>
            <div className="text-[#00ff87] font-mono mt-1">{algo.complexity.time}</div>
          </div>
          <div className="p-4 bg-[#111] border border-[#222]">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Space Complexity</span>
            <div className="text-[#00ff87] font-mono mt-1">{algo.complexity.space}</div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-8">
          <p className="text-gray-300 leading-relaxed">{algo.description}</p>
        </section>

        {/* Explanation */}
        <section className="mb-8 p-6 bg-[#111] border-l-2 border-[#00ff87]">
          <h2 className="text-xs text-gray-500 uppercase tracking-wider mb-3">How It Works</h2>
          <p className="text-sm text-gray-400 leading-relaxed">{algo.explanation}</p>
        </section>

        {/* Use Cases */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-white mb-3">Use Cases</h2>
          <ul className="grid grid-cols-2 gap-2">
            {algo.useCases.map((use) => (
              <li key={use} className="text-sm text-gray-400 flex items-center gap-2">
                <span className="w-1 h-1 bg-[#00ff87]" />
                {use}
              </li>
            ))}
          </ul>
        </section>

        {/* Code Examples */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-white mb-4">Implementation</h2>
          <div className="space-y-4">
            {algo.code.map((example) => (
              <div key={example.language} className="bg-[#0a0a0a] border border-[#222] overflow-hidden">
                <div className="px-4 py-2 bg-[#111] border-b border-[#222] flex items-center justify-between">
                  <span className="text-[10px] text-gray-600 uppercase tracking-wider">{example.language}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(example.snippet)}
                    className="text-[10px] text-gray-600 hover:text-[#00ff87]"
                  >
                    Copy
                  </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">{example.snippet}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Practice CTA */}
        <div className="border border-[#222] p-6 text-center">
          <h3 className="text-lg font-medium text-white mb-2">Practice This Concept</h3>
          <p className="text-sm text-gray-500 mb-4">
            Solidify your understanding by explaining {algo.name.toLowerCase()} code in your own words.
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
