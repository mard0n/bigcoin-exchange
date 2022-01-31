import debounce from 'lodash.debounce';
import React, {
  BaseSyntheticEvent,
  CSSProperties,
  FC,
  memo,
  useMemo,
  useState,
} from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';
import { AvailableCrypto } from '../../../types';

type RowType = {
  data: {
    coins: AvailableCrypto[];
    handleSelect: (selectedCtypto: AvailableCrypto) => void;
  };
  index: number;
  style: CSSProperties;
};

const Row = memo(({ data, index, style }: RowType) => {
  const { handleSelect, coins } = data;

  const item = coins[index];

  return (
    <button
      className="text-left hover:bg-gray-100"
      type="button"
      style={style}
      onClick={() => handleSelect(item)}
    >
      {item.name}
    </button>
  );
}, areEqual);

interface CryptoSelectorProps {
  allCryptoData: AvailableCrypto[];
  selectedCrypto: (selectedCtypto: AvailableCrypto) => void;
}

const CryptoSelector: FC<CryptoSelectorProps> = ({
  allCryptoData,
  selectedCrypto,
}) => {
  const [cryptoSearchInput, setCryptoSearchInput] = useState('');
  const filteredCrypto = allCryptoData.filter((amount) => {
    return (
      amount.id.toLowerCase().includes(cryptoSearchInput) ||
      amount.symbol.toLowerCase().includes(cryptoSearchInput) ||
      amount.name.toLowerCase().includes(cryptoSearchInput)
    );
  });

  const cryptoSearchHandler = (e: BaseSyntheticEvent) => {
    setCryptoSearchInput(e.target.value);
  };

  const debouncedCryptoSearchHandler = useMemo(
    () => debounce(cryptoSearchHandler, 300),
    [],
  );

  const handleSelect = (selectedCtypto: AvailableCrypto) => {
    selectedCrypto(selectedCtypto);
  };

  const data = useMemo(
    () => ({ coins: filteredCrypto, handleSelect }),
    [filteredCrypto],
  );

  return (
    <div className="grid gap-4">
      <input
        type="search"
        name="crypto-search"
        id="crypto-search"
        className="w-full border rounded-3xl h-14 px-4"
        onChange={debouncedCryptoSearchHandler}
      />
      <div className="popular-coins">
        {[
          { name: 'Bitcoin', id: 'bitcoin', symbol: 'bitcoin' },
          { name: 'Ethereum', id: 'ethereum', symbol: 'ethereum' },
          { name: 'Binance Coin', id: 'binancecoin', symbol: 'binancecoin' },
          { name: 'Dogecoin', id: 'dogecoin', symbol: 'dogecoin' },
        ].map((coin) => (
          <button
            key={coin.id}
            type="button"
            className="border rounded-xl h-9 px-2 mr-2 mb-2 hover:bg-gray-200"
            onClick={() => handleSelect(coin)}
          >
            {coin.name}
          </button>
        ))}
      </div>
      <hr />
      <List
        height={500}
        itemCount={filteredCrypto?.length}
        itemData={data}
        itemSize={50}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default CryptoSelector;
