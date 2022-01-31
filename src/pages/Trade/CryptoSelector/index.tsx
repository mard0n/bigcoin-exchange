import debounce from 'lodash.debounce';
import React, { FC, memo, useMemo, useState } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';

const Row = memo(({ data, index, style }: any) => {
  const { handleSelect, coins } = data;

  const item = coins[index];

  return (
    <button type="button" style={style} onClick={() => handleSelect(item.id)}>
      {item.name}
    </button>
  );
}, areEqual);

interface CryptoSelectorProps {
  allCryptoData: any[];
  selectedCryptoCurrency: (cryptoCurrency: string) => void;
}

const CryptoSelector: FC<CryptoSelectorProps> = ({
  allCryptoData,
  selectedCryptoCurrency,
}) => {
  const [cryptoSearchInput, setCryptoSearchInput] = useState('');
  const filteredCrypto = allCryptoData.filter(
    (amount: { id: string; symbol: string; name: string }) => {
      return (
        amount.id.toLowerCase().includes(cryptoSearchInput) ||
        amount.symbol.toLowerCase().includes(cryptoSearchInput) ||
        amount.name.toLowerCase().includes(cryptoSearchInput)
      );
    },
  );

  const cryptoSearchHandler = (e: any) => {
    setCryptoSearchInput(e.target.value);
  };

  const debouncedCryptoSearchHandler = useMemo(
    () => debounce(cryptoSearchHandler, 300),
    [],
  );

  const handleSelect = (name: string) => {
    selectedCryptoCurrency(name);
  };

  const data = useMemo(
    () => ({ coins: filteredCrypto, handleSelect }),
    [filteredCrypto],
  );

  return (
    <>
      <input
        type="search"
        name="crypto-search"
        id="crypto-search"
        onChange={debouncedCryptoSearchHandler}
      />
      <div className="popular-coins">
        {[
          { name: 'Bitcoin', id: 'bitcoin' },
          { name: 'Ethereum', id: 'ethereum' },
          { name: 'Binance Coin', id: 'binancecoin' },
          { name: 'Dogecoin', id: 'dogecoin' },
        ].map((coin) => (
          <button
            key={coin.id}
            type="button"
            onClick={() => handleSelect(coin.id)}
          >
            {coin.name}
          </button>
        ))}
      </div>
      <List
        height={150}
        itemCount={filteredCrypto?.length}
        itemData={data}
        itemSize={35}
        width={300}
      >
        {Row}
      </List>
    </>
  );
};

export default CryptoSelector;
