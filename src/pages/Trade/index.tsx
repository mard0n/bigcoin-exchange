import React, {
  BaseSyntheticEvent,
  FC,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInfiniteQuery } from 'react-query';
import debounce from 'lodash.debounce';
import { fetchCoinsData } from '../Home';

interface TradeProps {}

const Trade: FC<TradeProps> = () => {
  const { status, data, error } = useInfiniteQuery(
    ['coins-data'],
    fetchCoinsData,
    {
      staleTime: 60000,
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
    },
  );
  const [selectedCryptoPrice, setSelectedCryptoPrice] = useState(0);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(0);
  console.log('cryptoAmount', cryptoAmount);
  console.log('fiatAmount', fiatAmount);

  const handleCryptoSelect = (e: BaseSyntheticEvent) => {
    console.log(e.target.value);
    setSelectedCryptoPrice(e.target.value);
  };
  const cryptoChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;

    console.log(val);
    setCryptoAmount(val);
    setFiatAmount(val * selectedCryptoPrice);
  };
  const fiatChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    console.log(val);
    setFiatAmount(val);
    setCryptoAmount(val / selectedCryptoPrice);
  };
  const debouncedCryptoChangeHandler = useMemo(
    () => debounce(cryptoChangeHandler, 300),
    [],
  );
  const debouncedFiatChangeHandler = useMemo(
    () => debounce(fiatChangeHandler, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debouncedCryptoChangeHandler.cancel();
      debouncedFiatChangeHandler.cancel();
    };
  }, []);

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error}</span>;
  }
  console.log(
    'data?.pages.flat()[0].current_price',
    data?.pages.flat()[0].current_price,
  );

  return (
    <div>
      <div className="crypto">
        <input
          type="number"
          id="crypto-amount"
          value={cryptoAmount}
          onChange={cryptoChangeHandler}
        />
        <select
          name="crypto-list"
          id="crypto-list"
          onChange={handleCryptoSelect}
        >
          {data?.pages.flat().map((crypto: any) => {
            return (
              <option key={crypto.id} value={crypto.current_price}>
                {crypto.name}
              </option>
            );
          })}
        </select>
      </div>
      <input type="number" value={fiatAmount} onChange={fiatChangeHandler} />
    </div>
  );
};

export default Trade;
