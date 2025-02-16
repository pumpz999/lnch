// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract LiquidityPoolFactory {
    IUniswapV2Router02 public immutable uniswapRouter;
    address public owner;

    struct PoolDetails {
        address tokenAddress;
        uint256 tokenAmount;
        uint256 ethAmount;
        uint256 createdAt;
    }

    mapping(address => PoolDetails) public liquidityPools;
    event LiquidityPoolCreated(address indexed token, uint256 tokenAmount, uint256 ethAmount);

    constructor(address _uniswapRouter) {
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
        owner = msg.sender;
    }

    function createLiquidityPool(
        address tokenAddress, 
        uint256 tokenAmount, 
        uint256 minTokenAmount,
        uint256 minEthAmount
    ) external payable {
        require(msg.value > 0, "Must provide ETH liquidity");
        require(tokenAmount > 0, "Token amount must be positive");

        // Transfer tokens from sender to contract
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Token transfer failed");

        // Approve router to spend tokens
        require(token.approve(address(uniswapRouter), tokenAmount), "Token approval failed");

        // Add liquidity
        (uint256 amountToken, uint256 amountETH, uint256 liquidity) = uniswapRouter.addLiquidityETH{value: msg.value}(
            tokenAddress,
            tokenAmount,
            minTokenAmount,
            minEthAmount,
            msg.sender,
            block.timestamp + 15 minutes
        );

        // Store pool details
        liquidityPools[tokenAddress] = PoolDetails({
            tokenAddress: tokenAddress,
            tokenAmount: amountToken,
            ethAmount: amountETH,
            createdAt: block.timestamp
        });

        emit LiquidityPoolCreated(tokenAddress, amountToken, amountETH);
    }

    // Security: Allow owner to rescue tokens
    function rescueTokens(address tokenAddress) external {
        require(msg.sender == owner, "Only owner");
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(token.transfer(owner, balance), "Token transfer failed");
    }

    receive() external payable {}
}
