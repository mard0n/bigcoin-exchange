import React, { BaseSyntheticEvent, FC, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import CryptoSelector from './CryptoSelector';
import FiatSelector from './FiatSelector';

const fetchExchangeRate = async (
  selectedFiatCurrency: string,
  selectedCryptoCurrency: string,
) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCryptoCurrency}&vs_currencies=${selectedFiatCurrency}`,
  );
  return res.json();
};

interface TradeProps {}

const Trade: FC<TradeProps> = () => {
  const [allCryptoData, setAllCryptoData] = useState([]);
  const [allFiatData, setAllFiatData] = useState([]);
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('');
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState('');

  const { data: cryptoToFiatRate } = useQuery(
    ['get-exchange-rate', selectedFiatCurrency, selectedCryptoCurrency],
    () => fetchExchangeRate(selectedFiatCurrency, selectedCryptoCurrency),
    {
      enabled: !!selectedFiatCurrency && !!selectedCryptoCurrency,
      select: (data: any) => {
        return data[selectedCryptoCurrency][selectedFiatCurrency];
      },
    },
  );
  const handleSelectedFiatCurrency = (fiatCurrency: string) => {
    setSelectedFiatCurrency(fiatCurrency);
  };
  const handleSelectedCryptoCurrency = (cryptoCurrency: string) => {
    setSelectedCryptoCurrency(cryptoCurrency);
  };
  console.log('cryptoToFiatRate', cryptoToFiatRate);

  useEffect(() => {
    Promise.all([
      fetch('https://api.coingecko.com/api/v3/coins/list'),
      fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies'),
    ])
      .then(async ([cryptoData, fiatData]) => {
        setAllCryptoData(await cryptoData.json());
        setAllFiatData(await fiatData.json());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(0);

  const cryptoChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    setCryptoAmount(val);
    setFiatAmount(val * cryptoToFiatRate);
  };
  const fiatChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    console.log(val);
    setFiatAmount(val);
    setCryptoAmount(val / cryptoToFiatRate);
  };
  return (
    <div>
      <div>
        {selectedFiatCurrency} {selectedCryptoCurrency}
        <input
          type="number"
          id="crypto-amount"
          value={cryptoAmount}
          onChange={cryptoChangeHandler}
        />
        <input type="number" value={fiatAmount} onChange={fiatChangeHandler} />
      </div>
      <div>
        <FiatSelector
          allFiatData={allFiatData}
          selectedFiatCurrency={handleSelectedFiatCurrency}
        />
        <CryptoSelector
          allCryptoData={allCryptoData}
          selectedCryptoCurrency={handleSelectedCryptoCurrency}
        />
        <hr />
      </div>
    </div>
  );
};

export default Trade;
