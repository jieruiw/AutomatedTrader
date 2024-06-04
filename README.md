# Automated Trader

Automated Trader is a Node.js project that implements a stock trading strategy using real-time and historical data. The project currently includes functionality for retrieving Zacks Rank data, managing a portfolio, and executing trades based on a trading algorithm.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Features](#features)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

 - 	Real-Time Data Retrieval: Fetches real-time stock prices and signals using web scraping and external APIs.
 - Trading Algorithm: Generates buy, hold, or sell signals based on a custom trading algorithm.
 - Portfolio Management: Tracks portfolio holdings, cash balance, and transaction history.
 - Automated Trading Execution: Executes trades automatically based on generated signals.
 - Historical Data Tracking: Maintains historical prices and signals for analysis and decision-making.
 - RESTful API: Exposes a comprehensive set of endpoints for managing stocks, portfolio, and executing trades.


## API Endpoints
**Portfolio Endpoints**

•  **GET /api/portfolio**: Retrieve current portfolio holdings.

•  **GET /api/portfolio/bookvalue/:ticker**: Retrieve the book value of a specific stock.

•  **GET /api/portfolio/value**: Retrieve the current total value of the portfolio.

•  **GET /api/portfolio/cash**: Retrieve the current cash balance of the portfolio.

•  **GET /api/portfolio/history?period=5days**: Retrieve historical portfolio values for a specified period.

•  **POST /api/portfolio/buy/:ticker**: Buy a stock.

•  **POST /api/portfolio/sell/:ticker**: Sell a stock.

•  **POST /api/portfolio/deposit**: Deposit funds into the portfolio.

•  **POST /api/portfolio/withdraw**: Withdraw funds from the portfolio.

  
  

> ## 

**Stock List Endpoints**

  
•  **GET /api/stocks**: Retrieve all monitored stocks.

•  **GET /api/stocks/price/:ticker**: Retrieve the current price of a specific stock.

•  **GET /api/stocks/score/:ticker**: Retrieve the current signal score for a specific stock.

•  **POST /api/stocks/add/:ticker**: Add a stock to the monitored list.

•  **DELETE /api/stocks/delete/:ticker**: Remove a stock from the monitored list.

•  **PUT /api/stocks/update**: Update information (price and signal) for all monitored stocks.

## Testing

  

1. **Unit Tests**: Run unit tests to ensure functionality:


```bash
npm test
```


**License**

  

This project is licensed under the MIT License.
