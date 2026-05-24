```markdown
# 📊 token-swap-aggregator

[![Build Status](https://github.com/kaisilva/token-swap-aggregator/workflows/Node.js%20CI/badge.svg)](https://github.com/kaisilva/token-swap-aggregator/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/@kaisilva%2Ftoken-swap-aggregator.svg)](https://www.npmjs.com/package/@kaisilva/token-swap-aggregator)

A TypeScript SDK for aggregating swap rates across Uniswap, SushiSwap, and Curve.

## Features
- Cross-DEX token swap rate aggregation.
- Real-time price updates.
- Easy-to-use TypeScript API.

## Quick Start / Installation

### Using npm:
```bash
npm install @kaisilva/token-swap-aggregator
```

### Using yarn:
```bash
yarn add @kaisilva/token-swap-aggregator
```

## Usage Example
```typescript
import { TokenSwapAggregator } from '@kaisilva/token-swap-aggregator';

const aggregator = new TokenSwapAggregator();

aggregator.fetchRates('ETH', 'DAI')
  .then(rates => {
    console.log(`Best rate: ${rates.bestRate}`);
    console.log(`Available rates:`, rates.rates);
  })
  .catch(error => {
    console.error('Failed to fetch swap rates:', error);
  });
```

## Tech Stack
- TypeScript
- JavaScript (for Node.js)
- Uniswap SDK
- SushiSwap SDK
- Curve SDK

## Project Structure
- `src/` - Source code directory.
  - `index.ts` - Main entry point.
  - `aggregator.ts` - Aggregator logic.
  - `dexes/` - DEX-specific implementations.
    - `uniswap.ts`
    - `sushiswap.ts`
    - `curve.ts`

- `tests/` - Test code directory.
  - `index.test.ts`
  - `aggregator.test.ts`
  - `dexes/` - DEX-specific tests.

- `package.json` - Project dependencies and scripts.
- `LICENSE` - MIT License.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
```