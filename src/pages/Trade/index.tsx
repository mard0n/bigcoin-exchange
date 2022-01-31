import React, {
  BaseSyntheticEvent,
  FC,
  Fragment,
  useEffect,
  useState,
} from 'react';
import { useQuery } from 'react-query';
import { Dialog, Transition } from '@headlessui/react';
import Input from '../../components/Input';
import { AvailableCrypto, AvailableFiat, ExchangeRate } from '../../types';
import CryptoSelector from './CryptoSelector';
import FiatSelector from './FiatSelector';

const fetchExchangeRate = async (
  selectedFiatCurrency: string,
  selectedCryptoCurrency: string,
): Promise<ExchangeRate> => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCryptoCurrency}&vs_currencies=${selectedFiatCurrency}`,
  );
  return res.json();
};

const CurrencySelector = ({ children, handleOnClick }: any) => {
  return (
    <button
      className="rounded-full bg-blue-700 text-white font-semibold hover:bg-blue-800 py-2 px-3 absolute right-4 top-5 truncate"
      style={{ maxWidth: '200px' }}
      onClick={handleOnClick}
      type="button"
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 inline-block ml-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};

interface TradeProps {}

const Trade: FC<TradeProps> = () => {
  const [allCryptoData, setAllCryptoData] = useState<AvailableCrypto[]>([]);
  const [allFiatData, setAllFiatData] = useState<AvailableFiat[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<AvailableCrypto>({
    id: '',
    symbol: '',
    name: '',
  });
  const [selectedFiat, setSelectedFiat] = useState<AvailableFiat>('');
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isFiatModalOpen, setIsFiatModalOpen] = useState(false);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [fiatAmount, setFiatAmount] = useState(0);

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

  const { data: cryptoToFiatRate } = useQuery(
    ['get-exchange-rate', selectedFiat, selectedCrypto.id],
    () => fetchExchangeRate(selectedFiat, selectedCrypto.id),
    {
      enabled: !!selectedFiat && !!selectedCrypto,
      select: (data) => {
        return data[selectedCrypto.id][selectedFiat];
      },
    },
  );
  const handleSelectedFiat = (fiat: AvailableFiat) => {
    setIsFiatModalOpen(false);
    setSelectedFiat(fiat);
  };
  const handleSelectedCrypto = (crypto: AvailableCrypto) => {
    setIsCryptoModalOpen(false);
    setSelectedCrypto(crypto);
  };

  const cryptoChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    setCryptoAmount(val);
    if (cryptoToFiatRate) {
      setFiatAmount(val * cryptoToFiatRate);
    }
  };
  const fiatChangeHandler = (e: BaseSyntheticEvent) => {
    const val = e.target.value;
    setFiatAmount(val);
    if (cryptoToFiatRate) {
      setCryptoAmount(val / cryptoToFiatRate);
    }
  };
  return (
    <div className="w-full max-w-md p-8 bg-white grid gap-4 mx-auto -m-1/2 shadow-md">
      <h3 className="text-2xl font-bold text-gray-700 mb-2">Exchange rates</h3>
      <div className="relative">
        <Input
          label="crypto amount"
          placeholder="0.0"
          id="crypto-amount"
          type="number"
          value={cryptoAmount || ''}
          customStyleClass="pr-48"
          handleChange={cryptoChangeHandler}
        />
        <CurrencySelector handleOnClick={() => setIsCryptoModalOpen(true)}>
          {selectedCrypto.name || 'Select a coin'}
        </CurrencySelector>

        <Transition appear show={isCryptoModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-30 overflow-y-auto"
            onClose={() => setIsCryptoModalOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-75" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                  style={{ marginTop: '-100px' }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 flex justify-between mb-4"
                  >
                    Select a token
                    <button
                      type="button"
                      onClick={() => setIsCryptoModalOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Dialog.Title>
                  <CryptoSelector
                    allCryptoData={allCryptoData}
                    selectedCrypto={handleSelectedCrypto}
                  />
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div className="relative">
        <Input
          label="fiat amount"
          placeholder="0.0"
          id="fiat-amount"
          type="number"
          value={fiatAmount || ''}
          customStyleClass="pr-48"
          handleChange={fiatChangeHandler}
        />
        <CurrencySelector handleOnClick={() => setIsFiatModalOpen(true)}>
          {selectedFiat || 'Select a currency'}
        </CurrencySelector>

        <Transition appear show={isFiatModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-30 overflow-y-auto"
            onClose={() => setIsFiatModalOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-900 opacity-75" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div
                  className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                  style={{ marginTop: '-100px' }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 flex justify-between mb-4"
                  >
                    Select a token
                    <button
                      type="button"
                      onClick={() => setIsFiatModalOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Dialog.Title>
                  <FiatSelector
                    allFiatData={allFiatData}
                    selectedFiat={handleSelectedFiat}
                  />
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default Trade;
