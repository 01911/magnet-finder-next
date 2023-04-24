import React, { useEffect, useMemo, useState, FormEvent, useCallback } from 'react'
import Head from 'next/head';
import { FaMagnet, FaLink } from 'react-icons/fa';

import api from '../services/api';
import { useStyleSwitcher } from '../hooks/styleSwitcher';
import data from '../assets/results.json';
import alias from '../assets/engineMovie.json';

export interface ResultData {
  link: string;
  name: string;
  size: string;
  seeds: number;
  leech: number;
  engine_url: string;
  desc_link: string;
}

export interface DetailData {
  links: string[];
  name: string;
  thumb: string;
  engine_url: string;
  desc_link: string;
}

interface Result {
  [key: string]: ResultData[];
}

export default function Home() {
  //const enginesAlias = ['pirateproxy', 'torlock', 'limetor'];
  const enginesAlias = alias;
  const [enginesPending, setEnginesPending] = useState<string[]>([]);
  const { switchAlias, alias: styleAlias } = useStyleSwitcher();

  // request
  const [search_query, setSearchQuery] = useState('');
  const [result, setResult] = useState<Result>({} as Result);

  // local filtering
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('seeds');
  const [orderDirection, setOrderDirection] = useState('desc');

  useEffect(() => {
    //setDocs(data as ResultData[]);
    //setResult({ 'pirateproxy': data } as Result);
  }, [])

  const handleSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    setResult({} as Result);
    setEnginesPending(enginesAlias);

    enginesAlias.forEach(alias => {
      const encoded = process.env.REACT_APP_ENCODED;
      const aliasEncoded = encoded === 'true' ? btoa(alias) : alias;
      const searchQueryEncoded = encoded === 'true' ? btoa(search_query) : search_query;
      const requestConfig = { params: { url: aliasEncoded, search_query: searchQueryEncoded, encoded } };

      api.get('api/search', requestConfig)
        .then(({ data }) => {
          console.log({ [alias]: data });
          setResult(Object.assign(result, { [alias]: data }));
          setEnginesPending(enginesPending.filter(item => item !== alias));
        })
        .catch(error => console.log(`Erro ao buscar na engine: ${alias}`, error));
    })
  }, [enginesAlias, enginesPending, search_query, result]);

  const [docs] = useMemo(() => {
    const arr = [] as ResultData[];
    Object.keys(result).forEach(key => arr.push(...result[key]));
    return [arr, enginesPending.length > 0];
  }, [result, enginesPending])

  const filteredItens = useMemo(() => {
    return docs.filter(item => item.name.toLocaleLowerCase().includes(filter));
  }, [docs, filter]);

  const orderedItens = useMemo(() => {
    const itens = filteredItens.sort(function (a, b) {
      return a.seeds - b.seeds;
    });
    return orderDirection === 'desc' ? itens.reverse() : itens;
  }, [filteredItens, orderDirection]);

  const handleOrder = (prop: string) => {
    if (order === prop) {
      setOrderDirection(orderDirection === 'desc' ? 'asc' : 'desc');
      return;
    }
    setOrder(prop);
  }

  return (
    <>
      <Head><title>Search Movie</title></Head>

      <form onSubmit={handleSubmit} className="flex flex-wrap pt-4- mb-8 gap-4">
        <input
          type="text"
          value={search_query}
          onChange={e => setSearchQuery(e.target.value.toLocaleLowerCase())}
          placeholder="Digite a busca"
          className="pl-2 rounded-md text-black"
        />
        <input type="submit" value="Buscar filme/série" 
          className="hover:bg-yellow-500 bg-yellow-400 text-black px-8 py-1 rounded-md cursor-pointer" 
        />
      </form>

      <form id="filter-results" className="flex flex-wrap mb-8 gap-4">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value.toLocaleLowerCase())}
          placeholder="Filtrar resultados da busca"
          className="pl-2 py-1 rounded-md text-black"
        />
        <p className="text-lg">Resultados (exibindo {filteredItens.length} de {docs.length})</p>
      </form>

      {enginesPending.length > 0 && (
        <p className="mb-8">{enginesPending.join(', ')}</p>
      )}

      <table className="w-full">
        <thead className="">
          <tr className='hidden lg:table-row'>
            <td onClick={() => handleOrder('name')}>Nome</td>
            <td onClick={() => handleOrder('engine_url')}>Mecanismo de busca</td>
          </tr>
        </thead>
        <tbody>
          {orderedItens.map((item, key) => (
            <tr key={key} className="flex flex-wrap lg:table-row">
              <td className="flex w-full lg:w-auto">
                {item.link ? (
                  <span className="flex flex-wrap gap-2">
                    <a href={item.link} className="flex gap-2">
                      <span>{item.name}</span>
                      <FaMagnet />
                    </a>
                    <a href={`/post?url=${item.desc_link}`} target="_blank" rel="noopener noreferrer" className="flex">
                      <FaLink />
                    </a>
                  </span>
                ) : (
                  <a href={`/post?url=${item.desc_link}`} target="_blank" rel="noopener noreferrer" className="flex gap-2">
                    <span>{item.name}</span>
                    <FaLink />
                  </a>
                )}
              </td>
              <td className="w-full lg:w-auto">{item.engine_url || '---'}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}