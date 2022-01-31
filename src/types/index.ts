export type Coins = {
  current_price: 37370;
  id: 'bitcoin';
  image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579';
  market_cap_rank: 1;
  name: 'Bitcoin';
  symbol: 'btc';
  order: number;
}[];

export type SortTypes =
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'order_asc'
  | 'order_desc'
  | '';
