import React, { FC, Fragment, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Menu, Transition } from '@headlessui/react';
import { Coins, SortTypes } from '../../types';
import CustomTableHeaderCell from './CustomTableHeaderCell';

const fetchCoinsData = async ({ pageParam = 0 }) => {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=${pageParam}&sparkline=false`,
    {},
  );
  return res.json();
};

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const [tableSortType, setTableSortType] = useState<SortTypes>('');
  const { status, data, fetchNextPage, error, isFetching } =
    useInfiniteQuery<Coins>(['coins-data'], fetchCoinsData, {
      staleTime: 60000,
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
      select: (oldData) => {
        const orderAddedData = oldData.pages.map((page, i) => {
          const pagesBefore = page.length * i;
          return page.map((coin, index) => ({
            ...coin,
            order: pagesBefore + index + 1,
          }));
        });

        return { pageParams: oldData.pageParams, pages: orderAddedData };
      },
    });

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

  const applySort = (data?: Coins) => {
    return data?.sort((a, b) => {
      switch (tableSortType) {
        case 'order_asc':
          return a.order - b.order;
        case 'order_desc':
          return b.order - a.order;
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
    });
  };

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'error') {
    return <span>Error: {error}</span>;
  }
  return (
    <div className="container mx-auto mb-8 flex flex-col items-center">
      <table className="w-full bg-white shadow">
        <thead className="h-14 text-left">
          <tr className="border-b">
            <CustomTableHeaderCell
              handleSort={handleOrderSort}
              rowId="order"
              centered
              sortType={tableSortType}
            >
              #
            </CustomTableHeaderCell>
            <CustomTableHeaderCell
              handleSort={handleNameSort}
              rowId="name"
              sortType={tableSortType}
            >
              Name
            </CustomTableHeaderCell>
            <CustomTableHeaderCell
              handleSort={handlePriceSort}
              rowId="price"
              sortType={tableSortType}
            >
              Price (USD)
            </CustomTableHeaderCell>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {applySort(data?.pages?.flat())?.map((coin) => {
            return (
              <tr
                key={coin.id}
                className="border-b h-14 last-of-type:border-b-0"
              >
                <td className="text-center">{coin.order}</td>
                <td>
                  <img
                    className="inline-block w-6 h-6"
                    src={coin.image}
                    alt={coin.id}
                  />
                  <span className="align-middle ml-4 font-bold text-gray-800">
                    {coin.name}
                  </span>
                  <span className="align-middle ml-4 uppercase text-gray-400">
                    {coin.symbol}
                  </span>
                </td>
                <td className="font-bold text-gray-800">
                  ${coin.current_price}
                </td>
                <td className="text-center">
                  <Menu as="div" className="inline-block text-left relative">
                    <Menu.Button className=" bg-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-200">
                      Sell / Buy
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-10 -ml-28 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-4 py-2">
                          <h3 className="font-bold">
                            Do you want to sell or buy?
                          </h3>
                        </div>
                        <div className="px-4 py-2">
                          <Menu.Item>
                            {({ active }) => (
                              <div className="flex">
                                <button
                                  type="button"
                                  className={`
                                   flex-grow bg-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-200 mr-1
                                    ${active ? 'font-semibold' : 'font-norm'}
                                  `}
                                  onClick={() => {}}
                                >
                                  Buy
                                </button>
                                <button
                                  type="button"
                                  className={`
                                  flex-grow bg-gray-100 text-blue-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-200
                                    ${active ? 'font-semibold' : 'font-norm'}
                                  `}
                                  onClick={() => {}}
                                >
                                  Sell
                                </button>
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="mt-4 bg-blue-700 text-white px-5 py-2 font-bold rounded-2xl"
        type="button"
        onClick={() => fetchNextPage()}
      >
        {isFetching ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="pl-2">Loading...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 inline-block"
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
            <span className="pl-2">Load more</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Home;
