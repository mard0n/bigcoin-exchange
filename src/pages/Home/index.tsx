import React, { FC, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

const fetchCoinsData = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=${pageParam}&sparkline=false`,
    {},
  );
  return res.json();
};

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const [tableSortType, setTableSortType] = useState<
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'order_asc'
    | 'order_desc'
    | ''
  >('');
  const { status, data, fetchNextPage, error } = useInfiniteQuery(
    ['coins-data'],
    fetchCoinsData,
    {
      staleTime: 60000,
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
      select: (oldData: any) => {
        const updated = oldData.pages.map((page: any, i: number) => {
          const pagesBefore = page.length * i;
          return page.map((coin: any, index: number) => ({
            ...coin,
            order: pagesBefore + index + 1,
          }));
        });

        return { pageParams: oldData.pageParams, pages: updated };
      },
    },
  );

  const handleOrderSort = () => {
    switch (tableSortType) {
      case 'order_asc':
        setTableSortType('order_desc');
        break;
      case 'order_desc':
        setTableSortType('order_asc');
        break;
      default:
        setTableSortType('order_asc');
        break;
    }
  };
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
    <div
      style={{ maxWidth: '1248px', marginLeft: 'auto', marginRight: 'auto' }}
    >
      <table>
        <thead>
          <tr>
            <th onClick={handleOrderSort}>#</th>
            <th onClick={handleNameSort}>Name</th>
            <th onClick={handlePriceSort}>Price (USD)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages
            .flat()
            .sort((a: any, b: any) => {
              switch (tableSortType) {
                case 'order_asc':
                  return b.order - a.order;
                case 'order_desc':
                  return a.order - b.order;
                case 'name_asc':
                  return a.name.localeCompare(b.name);
                case 'name_desc':
                  return b.name.localeCompare(a.name);
                case 'price_asc':
                  return b.current_price - a.current_price;
                case 'price_desc':
                  return a.current_price - b.current_price;
                default:
                  return 0;
              }
            })
            .map((coin: any) => {
              return (
                <tr key={coin.id}>
                  <td>{coin.order}</td>
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
      <button type="button" onClick={() => fetchNextPage()}>
        Load more
      </button>
    </div>
  );
};

export default Home;
