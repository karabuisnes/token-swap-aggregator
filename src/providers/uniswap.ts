```typescript
/**
 * @file uniswap.ts
 * @description This file contains the implementation for interacting with Uniswap.
 */

import { ethers } from 'ethers';
import UniswapV2Router02ABI from './abi/UniswapV2Router02.json';

/**
 * Represents a Uniswap instance.
 */
export class Uniswap {
  private provider: ethers.providers.Provider;
  private routerAddress: string;
  private routerContract: ethers.Contract;

  /**
   * Creates a new Uniswap instance.
   * @param {ethers.providers.Provider} provider - The Ethereum provider to use.
   * @param {string} routerAddress - The address of the Uniswap V2 Router contract.
   */
  constructor(provider: ethers.providers.Provider, routerAddress: string) {
    this.provider = provider;
    this.routerAddress = routerAddress;
    this.routerContract = new ethers.Contract(this.routerAddress, UniswapV2Router02ABI, provider);
  }

  /**
   * Gets the current swap rate for a given token pair.
   * @param {string} tokenIn - The address of the input token.
   * @param {string} tokenOut - The address of the output token.
   * @returns {Promise<number>} - A promise that resolves to the current swap rate.
   */
  public async getSwapRate(tokenIn: string, tokenOut: string): Promise<number> {
    try {
      const amountIn = ethers.utils.parseUnits('1', await this.getTokenDecimals(tokenIn));
      const route = [tokenIn, tokenOut];
      const amountsOut = await this.routerContract.getAmountsOut(amountIn, route);
      return Number(ethers.utils.formatUnits(amountsOut[1], await this.getTokenDecimals(tokenOut)));
    } catch (error) {
      throw new Error(`Failed to get swap rate: ${error.message}`);
    }
  }

  /**
   * Executes a swap on Uniswap.
   * @param {string} tokenIn - The address of the input token.
   * @param {string} tokenOut - The address of the output token.
   * @param {number} amount - The amount of tokens to swap.
   * @param {ethers.Signer} signer - The signer to use for executing the transaction.
   * @returns {Promise<string>} - A promise that resolves to the transaction hash.
   */
  public async swap(tokenIn: string, tokenOut: string, amount: number, signer: ethers.Signer): Promise<string> {
    try {
      const tokenInDecimals = await this.getTokenDecimals(tokenIn);
      const tokenOutDecimals = await this.getTokenDecimals(tokenOut);
      const amountIn = ethers.utils.parseUnits(amount.toFixed(6), tokenInDecimals);
      const route = [tokenIn, tokenOut];
      const amountsOut = await this.routerContract.getAmountsOut(amountIn, route);
      const minAmountOut = Math.floor(Number(ethers.utils.formatUnits(amountsOut[1], tokenOutDecimals)) * 0.995);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const tx = await this.routerContract.connect(signer).swapExactTokensForTokens(
        amountIn,
        minAmountOut,
        route,
        signer.getAddress(),
        deadline
      );

      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to execute swap: ${error.message}`);
    }
  }

  /**
   * Gets the number of decimals for a given token.
   * @param {string} tokenAddress - The address of the token.
   * @returns {Promise<number>} - A promise that resolves to the number of decimals.
   */
  private async getTokenDecimals(tokenAddress: string): Promise<number> {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, ['function decimals() view returns (uint8)'], this.provider);
      return Number(await tokenContract.decimals());
    } catch (error) {
      throw new Error(`Failed to get token decimals: ${error.message}`);
    }
  }
}
```