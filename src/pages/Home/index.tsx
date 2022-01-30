import React, { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/Pagination';

const fetchCoinsData = async (
  currentPageNumber: number = 1,
  coinsPerPage: number = 10,
) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsPerPage}&page=${currentPageNumber}&sparkline=false`,
    {},
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
  const currentPageNumber = parseInt(pageParams.get('page') || '1', 10);
  const [tableSortType, setTableSortType] = useState<
    'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | ''
  >('');
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
  console.log('tableSortType', tableSortType);
  console.log('data', data);

  const handleNameSort = () => {
    switch (tableSortType) {
      case 'name_asc':
        setTableSortType('name_desc');
        break;
      case 'name_desc':
        setTableSortType('name_asc');
        break;
      default:
        setTableSortType('name_asc');
        break;
    }
  };
  const handlePriceSort = () => {
    switch (tableSortType) {
      case 'price_asc':
        setTableSortType('price_desc');
        break;
      case 'price_desc':
        setTableSortType('price_asc');
        break;
      default:
        setTableSortType('price_asc');
        break;
    }
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
            <th onClick={handleNameSort}>Name</th>
            <th onClick={handlePriceSort}>Price (USD)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .sort((a: any, b: any) => {
              switch (tableSortType) {
                case 'name_asc':
                  return a.name.localeCompare(b.name);
                case 'name_desc':
                  return b.name.localeCompare(a.name);
                case 'price_asc':
                  return a.current_price - b.current_price;
                case 'price_desc':
                  return b.current_price - a.current_price;
                default:
                  return 0;
              }
            })
            .map((coin: any) => {
              return (
                <tr key={coin.id}>
                  <td>
                    <img
                      src={coin.image}
                      alt={coin.id}
                      width={24}
                      height={24}
                    />
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
