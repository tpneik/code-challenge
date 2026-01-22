# REFACTOR NOTES

ISSUE 1: Missing blockchain property in WalletBalance interface

Original Code (Lines 1-4):

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
}
```

Problem: The interface declares `currency` and `amount` but the code uses `balance.blockchain` (line 37, 46, 47) which is not defined in the interface. This causes a TypeScript error and runtime undefined behavior.

Fixed Code:

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added missing property
}
```

---

ISSUE 2: Undefined variable 'lhsPriority' and inverted filter logic

Original Code (Lines 37-44):

```typescript
const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {              // lhsPriority is undefined!
        if (balance.amount <= 0) {          // It should be greater than zero
          return true;                      // This keeps the balances that has amount < 0
        }
      }
      return false;
    })
```

Problems:

1. **Line 39 references 'lhsPriority'** which is never defined. Should be `balancePriority`
2. **Filter logic is completely inverted:**
   - Returns `true` when `amount <= 0` → KEEPS zero/negative balances 
   - Returns `false` when `amount > 0` → FILTERS OUT positive balances 
3. **Correct logic should:** Keep only balances with `priority > -99` AND `amount > 0`

Impact: This is a critical bug - it shows the wrong balances to users (zeros instead of positive amounts)!

Fixed Code:

```typescript
.filter((balance: WalletBalance) => {
  const priority = getPriority(balance.blockchain);
  return priority > -99 && balance.amount > 0;  // Keep valid priority AND positive amount
})
```

---

ISSUE 3: Incorrect useMemo dependencies

Original Code (Line 54):

```typescript
}, [balances, prices]);
```

Problem: The `prices` dependency is included in the useMemo, but it's **not used** in the filtering and sorting logic inside. This causes:

- **Unnecessary recalculations** whenever prices change
- **Performance degradation** - the filtered/sorted array is re-computed even though prices don't affect which balances are shown or their priority-based order
- Prices only affect the USD value calculation later (line 65)

Impact: When price data updates frequently (real-time markets), the component re-computes the entire filtered and sorted balance list unnecessarily, even though the order hasn't changed.

Fixed Code:

```typescript
}, [balances]);  // Only depends on balances
```

The `rows` memo should depend on both `sortedBalances` AND `prices` because USD value calculation uses prices.

---

ISSUE 4: Redundant formattedBalances variable

Original Code (Lines 56-61):

```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});
```

Problems:

1. **Created but never used** - the variable is declared but then the code maps over `sortedBalances` instead (line 63)
2. **Unnecessary intermediate array** - wastes memory by creating a duplicate array
3. **Redundant mapping** - performs an extra O(n) operation for no purpose
4. **Creates unnecessary interface** - `FormattedWalletBalance` is defined but never properly used

Fixed Code:
Remove this entirely. Calculate `formatted` inline when needed:

```typescript
const rows = sortedBalances.map((balance: WalletBalance) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow
      formattedAmount={balance.amount.toFixed()}  // Calculate inline
      ...
    />
  );
});
```

---

ISSUE 5: Type mismatch and misleading variable names

Original Code (Lines 63-76):

```typescript
const rows = sortedBalances.map(                     // Type says FormattedWalletBalance
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={index}
        ...
        formattedAmount={balance.formatted}           // balance property doesn't exist
      />
    );
  }
);
```

Problems:

1. **Type annotation mismatch** - Says `FormattedWalletBalance` but receives `WalletBalance` from `sortedBalances`
2. **Property access error** - Tries to access `balance.formatted` which doesn't exist on `WalletBalance` type
3. **Misleading variable name** - `sortedBalances` actually performs BOTH filtering and sorting

Fixed Code:

```typescript

const rows = sortedAndFilteredBalances.map((balance: WalletBalance) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow
      formattedAmount={balance.amount.toFixed()}  // Calculate on-the-fly
      ...
    />
  );
});
```

---

ISSUE 6: Anti-pattern - Using index as React key

Original Code (Line 68):

```typescript
key = { index };
```

Problem: This is a major React anti-pattern, especially dangerous when:

- The array is sorted (order can change)
- Items can be filtered
- List reordering occurs

Impact:

- React treats each item as "new" when order changes → **unnecessary re-mounts**
- Local component state (if any) is lost on reorder
- Inefficient reconciliation
- Potential bugs with controlled inputs, animations, or focus

Fixed Code:

```typescript
key={balance.currency}  // Unique identifier

// Or with fallback:
key={balance.currency || `${balance.blockchain}-${balance.amount}`}
```

---

ISSUE 7: Incomplete sort comparator (missing return 0)

Original Code (Lines 45-53):

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  // Missing return 0
});
```

Problem: When priorities are equal, the function doesn't explicitly return a value, resulting in:

- `undefined` return value
- Potentially unstable sort order (implementation-dependent)
- Some JavaScript engines may not handle this consistently
- Makes the sort non-deterministic

Impact: With multiple chains having the same priority (Zilliqa and Neo both return 20), the order becomes unpredictable across renders or environments.

Fixed Code:

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);

  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
  return 0;  // Explicitly handle equal case
});
```

Or better yet, add a tie-breaker for stable ordering:

```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);

  if (leftPriority !== rightPriority) {
    return rightPriority - leftPriority; 
  }
  return lhs.currency.localeCompare(rhs.currency);
});
```

---

ISSUE 8: getPriority function recreated on every render

Original Code (Lines 14-34):

```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  ...
  const getPriority = (blockchain: any): number => {  // This component
```

Problems:

1. **Function recreated every render** - New function reference on each render
2. **Breaks memoization efficiency** - Even though it's pure, React can't optimize across renders
3. **Uses `any` type** - No type safety
4. **If used in dependencies** - Would cause useMemo/useCallback to recompute

Impact: While the function itself is pure, creating it repeatedly:

- Unnecessary memory allocation
- Makes optimization harder for bundlers/React
- If used as a dependency in other hooks, causes unnecessary re-computation

Fixed Code:

```typescript
// Define outside component
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  // Component body
};
```

---

ISSUE 9: Unused children destructuring

Original Code (Line 15):

```typescript
const { children, ...rest } = props;
```

Problem: The `children` variable is destructured from props but never used in the component.

Impact:

- Dead code that clutters the component
- Props spreading may include children unnecessarily
- Minor code cleanliness issue

Fixed Code:

```typescript
const { ...rest } = props;
```

---

ISSUE 10: Missing memoization for rows generation

Original Code (Lines 63-76):

```typescript
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return <WalletRow ... />
  }
);
```

Problem: The `rows` array is created on **every render**, even when `sortedBalances` and `prices` haven't changed.

Impact:

- **Unnecessary JSX creation** on every render
- Causes child components to re-render unnecessarily
- If `WalletRow` is expensive, this is a performance bottleneck
- Wastes CPU cycles on unchanged data

Fixed Code:

```typescript
const rows = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance) => {
    const price = prices[balance.currency] ?? 0; // Handle the undefined
    const usdValue = balance.amount * price;

    return (
      <WalletRow
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    );
  });
}, [sortedBalances, prices]); // Memoize with correct deps
```

Impact of Fix: Only re-creates rows when balances or prices actually change, not on every parent re-render (dropdown open, settings change, etc.).

---

ISSUE 11: Potential NaN in usdValue calculation

Original Code (Line 64):

```typescript
const usdValue = prices[balance.currency] * balance.amount;
```

Problem: If `prices[balance.currency]` is undefined, this results in `NaN`:

- `undefined * number = NaN`
- NaN propagates through calculations
- Can cause rendering issues or display "NaN" to users

Fixed Code:

```typescript
const price = prices[balance.currency] ?? 0; // Default to 0 if undefined
const usdValue = balance.amount * price;
```

Or with explicit check:

```typescript
const price = prices[balance.currency] || 0;
const usdValue = price > 0 ? balance.amount * price : 0;
```
---

PERFORMANCE IMPACT

Before:

- Filter and sort: O(n log n) on EVERY render
- getPriority called: 2n times (filter + sort comparisons)
- Rows recreated on every parent re-render
- Unnecessary recalculation when prices change

After:

- Filter and sort: O(n log n) only when balances change
- getPriority called: 1n times (compute once, reuse)
- Rows memoized - only recreate when balances or prices change
- Prices changes don't trigger unnecessary filtering/sorting

---