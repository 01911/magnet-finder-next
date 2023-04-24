//import BaixarFilmeTorrent from './Bf';
import ComandoTorrents from './Ct';
import Lapumia from './Lap';
import MegaTorrentsHD from './Mt';
import OndeBaixa from './Ob';
import TorrentFilmes from './Tf';
//import TorrentTool from './Tt';

import LimeTorrent from './Lime';
//import RarBg from './Rb';
import Tcsv from './Tcsv';
import TorLock from './Tl';
import ThePirateBay from './Tpb';
//import Zooqle from './Zq';

export interface ISearchParams {
  search_query: string;
};

export interface Result {

  // https://github.com/qbittorrent/search-plugins/wiki/How-to-write-a-search-plugin#understanding-the-code-1

  link: string, //A string corresponding the the download link(the.torrent file or magnet link)
  name: string, //unicode string corresponding to the torrent's name (i.e: "Ubuntu Linux v6.06")
  size: string, //A string corresponding to the torrent size(i.e: "6 MB" or "200 KB" or "1.2 GB"...)
  seeds: number, //The number of seeds for this torrent(as a string)
  leech: number, //The number of leechers for this torrent(a a string)
  engine_url: string, //The search engine url(i.e: http://www.mininova.org)
  desc_link: string, //A string corresponding to the the description page for the torrent
}

export interface ISource {
  getOriginUrl(): string;

  search(data: ISearchParams): Promise<any[]>;

  detail(data: IShowDetailMagnetDTO): Promise<Answer>;
}

/*
 * Blog
 */
interface ILinkData {
  url: string,
  text: string,
  type: string,
}

export interface Answer {

  links: ILinkData[],
  name: string,
  size?: string,
  seeds?: number,
  leech?: number,
  engine_url: string,
  desc_link: string,
  thumb: string,
}

export default interface ITrendDTO {
  top: Answer[];
  recents: Answer[];
}

export interface IShowDetailMagnetDTO {
  url: string;
};

let sources: Array<ISource>;
sources = [
  //RarBg,
  //Zooqle,
  //
  LimeTorrent,
  Tcsv,
  TorLock,
  ThePirateBay,



  //BaixarFilmeTorrent,
  //TorrentTool,
  //
  ComandoTorrents,
  Lapumia,
  //MegaTorrentsHD,
  //OndeBaixa,
  //TorrentFilmes,

];

export { sources };
