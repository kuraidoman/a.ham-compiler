# The A.HAM Administration

---

## 1. Program Structure
The script must be formatted like a formal letter. 
* **Program Start:** `DEAR ALEXANDER`
* **Program End:** `YOUR OBEDIENT SERVANT A.HAM`

## 2. Memory & Data Types
A.HAM dynamically tracks variable scope and simulates byte-level memory offsets. Variables are strictly bound to the specific indentation level (scope) where they are declared.

| Keyword | Native Type | Description | Memory Offset |
| :--- | :--- | :--- | :--- | 
| **`SHOT`** | Integer | Used to declare whole numbers (supports basic math expressions). | 4 Bytes |
| **`LETTER`** | String | Used to declare text enclosed in double quotes. | 8 Bytes |
| **`VOTE`** | Boolean | Evaluates to `SATISFIED` (True) or `HELPLESS` (False). | 1 Byte |
| **`STROKE`** | Character | Used to declare a single character enclosed in single quotes. | 1 Byte |

## 3. Core Operators & Syntax
* **Assignment Operator (`WRITE`):** Binds a literal or mathematical expression to an identifier.
* **Statement Delimiter (`!`):** The gunshot. Mandatory at the end of all variable declarations and output statements.
* **Indentation (Scope Tracking):** `4 Spaces` = 1 Indent Level. Used exclusively to group code blocks inside Control Flow statements.

## 4. Mathematical & Logical Operators
* **Arithmetic:** A.HAM natively supports standard mathematical expressions for `SHOT` declarations (`+`, `-`, `*`, `/`).
* **Equality Check:** `YOURE LIKE ME` (==)
* **Greater Than:** `OUTGUNNED` (>)
* **Less Than:** `TALK LESS` (<)
* **Logical AND:** `AND` (&&)
* **Logical OR:** `OR` (||)

## 5. Keywords & Commands
* **Output Command (`DROP KNOWLEDGE`):** Prints a bound identifier's value or a raw string literal to the A.HAM Console. Enforces strict scope checking before printing.
* **Conditional Statement (`IF`):** Evaluates a logical operator. If true, executes the indented block below it.
* **Universal Loop (`NON STOP`):** A while-loop that continuously executes the indented block below it as long as the condition remains true.

---

## 6. Comprehensive Sample Code
This test case demonstrates the full power of the A.HAM compiler, including Global (Level 0) and Block (Level 1) scope tracking, arithmetic expression evaluation, strict typing, and complex logical operations.

```text
DEAR ALEXANDER

SHOT year WRITE 1776!
LETTER status WRITE "Revolution"!
VOTE isReady WRITE SATISFIED!
STROKE initial WRITE 'A'!

IF year YOURE LIKE ME 1776 AND isReady YOURE LIKE ME SATISFIED!
    DROP KNOWLEDGE status!
    SHOT troops WRITE 5000 + 5000!
    
    IF troops OUTGUNNED 5000 AND initial YOURE LIKE ME 'A'!
        DROP KNOWLEDGE "Hamilton is in command!"!
        DROP KNOWLEDGE troops!
        
    IF troops TALK LESS 20000 OR isReady YOURE LIKE ME HELPLESS!
        DROP KNOWLEDGE "Send a letter to Congress!"!

YOUR OBEDIENT SERVANT A.HAM