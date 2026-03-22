# The A.HAM Administration

**A.HAM** is an imperative, scoped, and thematic esoteric programming language built on the architectural principles of data hiding, strict encapsulation, and Fail-Fast memory safety. 

Designed and architected by **Klyde Hedrick S. Mejia** for the CS0035 Programming Languages Final Project.

---

## 📜 1. Program Structure (The Wrappers)
Every A.HAM script must be formatted as a formal letter. 
* **Program Start:** `DEAR ALEXANDER`
* **Program End:** `YOUR OBEDIENT SERVANT A.HAM`

## 🧠 2. Memory & Data Types
A.HAM dynamically tracks variable scope and simulates byte-level memory offsets. Variables are strictly bound to the specific indentation level (scope) where they are declared.

| Keyword | Native Type | Description | Memory Offset |
| :--- | :--- | :--- | :--- |
| **`SHOT`** | Integer | Used to declare whole numbers. | 4 Bytes |
| **`LETTER`** | String | Used to declare text enclosed in double quotes. | 8 Bytes |
| **`VOTE`** | Boolean | Evaluates to `SATISFIED` (True) or `HELPLESS` (False). | 1 Byte |

## ⚙️ 3. Core Operators & Syntax
* **Assignment Operator (`WRITE`):** Binds a literal or mathematical expression to an identifier (Replaces `=`).
* **Statement Delimiter (`!`):** The gunshot. Mandatory at the end of all variable declarations and output statements (Replaces `;`).
* **Indentation (Scope Tracking):** `4 Spaces` = 1 Indent Level. Used exclusively to group code blocks inside Control Flow statements.

## 🧮 4. Mathematical & Logical Operators
* **Addition:** `RISE UP` *(e.g., essays RISE UP 51)*
* **Subtraction:** `FALL BACK` 
* **Equality Check:** `YOURE LIKE ME` *(e.g., troops YOURE LIKE ME 10000)*

## 🗣️ 5. Keywords & Commands
* **Output Command (`DROP KNOWLEDGE`):** Prints a bound identifier's value or a raw string literal to the A.HAM Console.
* **Conditional Statement (`IF`):** Evaluates a logical operator. If true, executes the indented block below it.
* **Universal Loop (`NON STOP`):** A while-loop that continuously executes the indented block below it as long as the condition remains true.

---

## 🏛️ The Architecture in Action
This test case demonstrates Level 0 (Global) and Level 1 (Block) scope tracking, arithmetic, and control flow.

```text
DEAR ALEXANDER

SHOT year WRITE 1776!

IF year YOURE LIKE ME 1776!
    LETTER status WRITE "Revolution"!
    SHOT troops WRITE 10000!
    NON STOP troops YOURE LIKE ME 10000!
        VOTE isWinning WRITE SATISFIED!
        DROP KNOWLEDGE isWinning!

YOUR OBEDIENT SERVANT A.HAM