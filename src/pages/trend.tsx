import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { FaTh, FaAlignJustify } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import api from '../services/api';
import delay from 'utils/delay';
import blogs from '../assets/engineBlogs.json';
import { comandotorrent, megatorrentshd, ondebaixa } from '../assets/trend';
import Loading from 'components/Loading';


export interface ResultData {
  link?: string;
  name: string;
  size?: string;
  seeds?: number;
  leech?: number;
  engine_url: string;
  desc_link: string;

  thumb: string;
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

export default function Trend() {
  const enginesAlias = blogs;
  const [enginesPending, setEnginesPending] = useState<string[]>([]);
  const [result, setResult] = useState<Result>({} as Result);

  const [renderMode, setRenderMode] = useState<'grid' | 'horizontal'>('grid');

  useEffect(() => {
    const setPlaceholder = async () => {
      await delay(500);
      //setDocs(data as ResultData[]);
      //setResult({ 'pirateproxy': data } as Result);
      //setResult(prev => ({ ...prev, 'comando': placeholder.recents } as Result));
      setResult({
        'COMANDO tOp': comandotorrent.top,
        'COMANDO rEcEnTs': comandotorrent.recents,
        //'MEGA tOp': megatorrentshd.top,
        //'MEGA rEcEnTs': megatorrentshd.recents,
        //'ONDE tOp': ondebaixa.top,
        //'ONDE rEcEnTs': ondebaixa.recents,
      });
    }
    setPlaceholder();
  }, []);

  useEffect(() => {
    enginesAlias.forEach(alias => {

      const load = async (alias: string) => {
        if (result[alias]) {
          return;
        }

        const cache = localStorage.getItem(`@trend/${alias}`);
        const cacheDate = localStorage.getItem(`@trend_date/${alias}`);

        if (cache && cacheDate) {
          const diff = Number(new Date()) - Number(new Date(cacheDate));
          if (diff < 60 * 1000) {
            const data = JSON.parse(cache);

            console.log(`cache ${alias}`);
            setResult({ ...result, [alias]: data.top });
            setEnginesPending(enginesPending.filter(item => item !== alias));

            return;
          }
        }

        console.log(`fetch ${alias}`);
        return;
        const { data } = await api.get<Result>(`api/trend`, { params: { url: alias } });

        localStorage.setItem(`@trend/${alias}`, JSON.stringify(data));
        localStorage.setItem(`@trend_date/${alias}`, new Date().toJSON());

        setResult({ ...result, [alias]: data.top });
        setEnginesPending(enginesPending.filter(item => item !== alias));
      };

      try {
        console.log(`loading ${alias}`);
        load(alias);
      } catch (error) {
        toast.error(`Erro ao listar trend: ${alias}`)
        console.log(error);
      }
    })
  }, [result, enginesAlias, enginesPending])

  const hasResult = useMemo(() => {
    const engineWithResult = Object.keys(result).filter(key => result[key].length > 0);
    console.log(result, engineWithResult);
    return engineWithResult.length > 0;
  }, [result]);

  //<main id={renderMode === "horizontal" ? "horizontal" : "grid"} className="page-trend">
  return (
    <>
      <Head><title>Trend</title></Head>

      {!hasResult ? <Loading /> : ''}

      <div className="actions pt-4-">
        <FaTh onClick={() => setRenderMode('grid')} />
        <FaAlignJustify onClick={() => setRenderMode('horizontal')} />
      </div>

      {Object.keys(result).length && Object.keys(result).map((resultAlias, key) => (
        <div key={key} className="results-wrapper mb-12">
          <h2 className="text-xl font-semibold uppercase">{resultAlias}</h2>
          {renderMode === "horizontal"
            ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={10}
                slidesPerGroup={2}
                scrollbar={{ draggable: true }}
              >
                {result[resultAlias].map((item, key) => (
                  <SwiperSlide key={key}>
                    <a
                      href={`/post?url=${item.desc_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        /*src='https://img.ibxk.com.br/2015/07/23/23170425700729.jpg?w=704'*/
                        src={item.thumb}
                        alt={`Cover ${item.name}`}
                      />
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {result[resultAlias].map((item, key) => (
                  <li key={key} className="w-[150px]">
                    <a
                      href={`/post?url=${item.desc_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-30"
                    >
                      <img
                        //src='https://img.ibxk.com.br/2015/07/23/23170425700729.jpg?w=704'
                        src={item.thumb}
                        /*fallbackSrc="https://i.ebayimg.com/images/g/~zsAAOSwej1fxobX/s-l300.jpg"*/
                        /*fallbackSrc="https://th.bing.com/th/id/R.734ccc769a3de197fe8f8c322289a826?rik=ES5ZovP8S%2bKCwg&riu=http%3a%2f%2fwww.freeiconspng.com%2fuploads%2fblu-ray-icon-21.jpg&ehk=h%2baik6ZM4jRlTp9Z5KiN1YT34LSn6PrxQ5jSFKhRxGk%3d&risl=&pid=ImgRaw&r=0"*/
                        /*layout="fill"*/
                        alt={`Cover ${item.name}`}
                        //className="h-[200px] object-cover opacity-5-"
                        className="w-full"
                      />
                      <p className="text-sm">{item.name}</p>
                    </a>
                  </li>
                ))}
              </ul>
            )
          }

        </div>
      ))}

      {/*<pre>{JSON.stringify(result, null, 2)}</pre>*/}
    </>
  )

}