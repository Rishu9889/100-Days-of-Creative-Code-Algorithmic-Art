# Day 10 – L-System Plants

This sketch generates plant-like structures using an **L-System (Lindenmayer System)**,
a rule-based mathematical model commonly used to simulate natural growth.

The system works by repeatedly rewriting an initial string (axiom) using a set of
production rules. The resulting string is then interpreted using turtle graphics,
where each character represents a drawing instruction.

---

## How It Works

### 1. String Generation (L-System)
- The sketch starts with an initial axiom: `F`
- A production rule expands `F` into branching structures
- The rule is applied multiple times to simulate growth over generations

Example rule:
