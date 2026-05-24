```typescript
/**
 * Aggregator class to compare swap rates across different DEXs.
 */
import { UniswapClient } from './clients/UniswapClient';
import { SushiSwapClient } from './clients/SushiSwapClient';
import { CurveClient } from './clients/CurveClient';

interface SwapRate {
  amount: number;
  dex: string;
}

/**
 * Aggregator class to compare swap rates across Uniswap, SushiSwap, and Curve.
 */
export class Aggregator {
  private uniswapClient: UniswapClient;
  private sushiSwapClient: SushiSwapClient;
  private curveClient: CurveClient;

  /**
   * Constructs a new instance of the Aggregator.
   */
  constructor() {
    this.uniswapClient = new UniswapClient();
    this.sushiSwapClient = new SushiSwapClient();
    this.curveClient = new CurveClient();
  }

  /**
   * Compares swap rates for a given token pair across all DEXs.
   * @param fromToken Token to swap from.
   * @param toToken Token to swap to.
   * @returns Promise resolving to the best swap rate and the corresponding DEX.
   */
  public async compareSwapRates(fromToken: string, toToken: string): Promise<SwapRate> {
    try {
      const uniswapRate = await this.uniswapClient.getSwapRate(fromToken, toToken);
      const sushiSwapRate = await this.sushiSwapClient.getSwapRate(fromToken, toToken);
      const curveRate = await this.curveClient.getSwapRate(fromToken, toToken);

      const rates: SwapRate[] = [
        { amount: uniswapRate, dex: 'Uniswap' },
        { amount: sushiSwapRate, dex: 'SushiSwap' },
        { amount: curveRate, dex: 'Curve' }
      ];

      rates.sort((a, b) => a.amount - b.amount);

      return rates[0];
    } catch (error) {
      throw new Error(`Failed to compare swap rates: ${error.message}`);
    }
  }
}
```