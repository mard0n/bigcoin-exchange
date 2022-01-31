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
import { AvailableFiat } from '../../../types';

type RowType = {
  data: {
    coins: AvailableFiat[];
    handleSelect: (selectedCtypto: AvailableFiat) => void;
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
      {item}
    </button>
  );
}, areEqual);

interface FiatSelectorProps {
  allFiatData: AvailableFiat[];
  selectedFiat: (fiat: string) => void;
}

const FiatSelector: FC<FiatSelectorProps> = ({ allFiatData, selectedFiat }) => {
  const [fiatSearchInput, setFiatSearchInput] = useState('');
  const filteredFiat = allFiatData.filter((amount) => {
    return amount.toLowerCase().includes(fiatSearchInput);
  });

  const fiatSearchHandler = (e: BaseSyntheticEvent) => {
    setFiatSearchInput(e.target.value);
  };

  const debouncedFiatSearchHandler = useMemo(
    () => debounce(fiatSearchHandler, 300),
    [],
  );

  const handleSelect = (name: string) => {
    selectedFiat(name);
  };

  const data = useMemo(
    () => ({ coins: filteredFiat, handleSelect }),
    [filteredFiat],
  );

  return (
    <div className="grid gap-4">
      <input
        type="search"
        name="fiat-search"
        id="fiat-search"
        className="w-full border rounded-3xl h-14 px-4"
        onChange={debouncedFiatSearchHandler}
      />
      <div className="popular-fiat">
        {['usd', 'aed', 'eur', 'jpy'].map((fiat) => (
          <button
            key={fiat}
            type="button"
            className="border rounded-xl h-9 px-2 mr-2 mb-2 hover:bg-gray-200"
            onClick={() => handleSelect(fiat)}
          >
            {fiat}
          </button>
        ))}
      </div>
      <List
        height={500}
        itemCount={filteredFiat?.length}
        itemData={data}
        itemSize={50}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
};

export default FiatSelector;
