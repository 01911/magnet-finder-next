import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import { FaMagnet, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../services/api';
import Loading from '../components/Loading';
import origins from '../assets/newsOrigins.json';
import placeholder from '../assets/detail.json';
import delay from 'utils/delay';
import { GetServerSidePropsResult, GetStaticProps } from 'next';
import { useQuery } from 'react-query';

export interface NewsContentProps {
  data: Content[]
}

export interface NewsProps {
  data: {
    data: Content[]
    total: number
  }
}

export interface Content {
  id: string
  link: string
  title: string
  thumb: string
  created_at: string
  posted_at: string
}

const fetcher = (url: string) => fetch(`http://localhost:3000/api/news?url=${url}`).then((res) => res.json())

export default function News(props: NewsProps) {
  const location = useRouter();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Content>({} as Content);
  const [url, setUrl] = useState('');
  const { data: articles, error, isLoading } = useQuery<NewsContentProps>(
    [url],
    () => fetcher(url),
    {
      refetchOnWindowFocus: false,
      staleTime: 86400000,
      //placeholderData: {} as NewsProps[],
      placeholderData: props.data as NewsContentProps,
    },
  );

  //return ( <p>{JSON.stringify(props.data, null, 2)}</p> );
  if (isLoading) return <Loading />;
  if (!articles) return null;
  //console.log(articles);

  return (
    <>
      <Head><title>News {url ? `| ${url}` : `| Recentes`}</title></Head>

      {/*<pre>{JSON.stringify(props.data.data, null, 2)}</pre>*/}
      {/*<pre>{JSON.stringify(articles, null, 2)}</pre>*/}

      <section className="flex flex-row flex-wrap gap-2 mb-16">
        {origins.origins.length > 0 && origins.origins.map((origin) => (
          <button
            className="hover:bg-yellow-500 bg-yellow-400 text-black text-sm px-4 py-1 rounded-md cursor-pointer"
            onClick={() => setUrl(origin.url)}
          >{origin.title}</button>
        ))}
      </section>

      <section className="flex flex-col gap-8 mb-16">
        {articles.data.length > 0 && articles.data.map((detail) => (
          <article id={detail.id} key={`item-${detail.id}`}>
            <a href={detail.link}>
              <h2 className="text-md">{detail.title}</h2>
              <span className="flex flex-wrap text-sm text-gray-400">{detail.link}</span>
            </a>
          </article>
        ))}
      </section>

      <section className="grid lg:grid-cols-3 gap-2 max-w-sm lg:max-w-none">
        {articles.data.length > 0 && articles.data.map((detail) => (
          <article className="grid grid-rows-2 gap-2 overflow-hidden-" id={detail.id} key={`card-${detail.id}`}>
            <img src={detail.thumb} alt={'Thumb'}
              className="w-max-[320px] w-auto- max-h-44- static- opacity-20 aspect-video flex-1"
            />

            <footer className="flex flex-col flex-1 overflow-hidden">
              <h2 className="text-md">{detail.title}</h2>
              <a href={detail.link}>
                <span className="flex flex-wrap mb-8 text-sm text-gray-400">{detail.link}</span>
              </a>
            </footer>
          </article>
        ))}
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    //console.log('getStaticProps:start');
    const url = '';
    const { data } = await api.get(`http://localhost:3000/api/news?url=${url}`);

    return {
      props: { data },
      revalidate: 60 * 60 * 2 //2 hours
    }
  } catch (error) {
    //console.log('getStaticProps:error');
    return { props: { data: [] } }
  }
}