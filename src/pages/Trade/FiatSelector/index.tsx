import debounce from 'lodash.debounce';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { FixedSizeList as List, areEqual } from 'react-window';

const Row = memo(({ data, index, style }: any) => {
  console.log('rerendered', index);

  const { handleSelect, coins } = data;

  const item = coins[index];
  console.log('item', item);

  return (
    <button type="button" style={style} onClick={() => handleSelect(item)}>
      {item}
    </button>
  );
}, areEqual);

interface FiatSelectorProps {
  allFiatData: any[];
  selectedFiatCurrency: (fiatCurrency: string) => void;
}

const FiatSelector: FC<FiatSelectorProps> = ({
  allFiatData,
  selectedFiatCurrency,
}) => {
  const [fiatSearchInput, setFiatSearchInput] = useState('');
  const filteredFiat = allFiatData.filter((amount: string) => {
    return amount.toLowerCase().includes(fiatSearchInput);
  });

  const fiatSearchHandler = (e: any) => {
    setFiatSearchInput(e.target.value);
  };

  const debouncedFiatSearchHandler = useMemo(
    () => debounce(fiatSearchHandler, 300),
    [],
  );

  const handleSelect = (name: string) => {
    console.log('selected', name);
    selectedFiatCurrency(name);
  };

  const data = useMemo(
    () => ({ coins: filteredFiat, handleSelect }),
    [filteredFiat],
  );

  return (
    <>
      <input
        type="search"
        name="fiat-search"
        id="fiat-search"
        onChange={debouncedFiatSearchHandler}
      />
      <div className="popular-fiat">
        {['usd', 'aed', 'eur', 'jpy'].map((fiat) => (
          <button key={fiat} type="button" onClick={() => handleSelect(fiat)}>
            {fiat}
          </button>
        ))}
      </div>
      <List
        height={150}
        itemCount={filteredFiat?.length}
        itemData={data}
        itemSize={35}
        width={300}
      >
        {Row}
      </List>
    </>
  );
};

export default FiatSelector;
