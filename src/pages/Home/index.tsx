import React, { FC } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';

const fetchCoinsData = async (
  currentPageNumber: number = 1,
  coinsPerPage: number = 10,
) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsPerPage}&page=${currentPageNumber}&sparkline=false`,
  );
  return res.json();
};

const fetchCoinsList = async () => {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/coins/list?include_platform=false',
  );
  return res.json();
};

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const coinsPerPage = 25;
  const [pageParams, setPageParams] = useSearchParams();
  const currentPageNumber = parseInt(pageParams.get('page') || '', 10);
  const { data: coinList = [] } = useQuery('coins-list', fetchCoinsList, {
    staleTime: 60000,
  }); // TODO: handle error
  const { status, data, error } = useQuery(
    ['coins-data', currentPageNumber, coinsPerPage],
    () => fetchCoinsData(currentPageNumber, coinsPerPage),
    {
      staleTime: 60000,
    },
  );

  const handlePageClick = (pageNumber: number) => {
    setPageParams({ page: pageNumber.toString() });
  };
  const handlePreviousClick = (pageNumber: number) => {
    setPageParams({ page: pageNumber.toString() });
  };
  const handleNextClick = (pageNumber: number) => {
    setPageParams({ page: pageNumber.toString() });
  };

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error}</span>;
  }
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin: any) => {
            return (
              <tr key={coin.id}>
                <td>
                  <img src={coin.image} alt={coin.id} width={24} height={24} />
                  {coin.name}
                </td>
                <td>{coin.current_price}</td>
                <td>
                  <button type="button">Sell</button>
                  <button type="button">Buy</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        numberOfPages={Math.floor(coinList.length / coinsPerPage)}
        currentPageNumber={currentPageNumber}
        handlePageClick={handlePageClick}
        handlePreviousClick={handlePreviousClick}
        handleNextClick={handleNextClick}
      />
    </>
  );
};

export default Home;
