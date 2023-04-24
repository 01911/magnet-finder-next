import { JSDOM } from 'jsdom';
import ITrendDTO, { ISource, ISearchParams, IShowDetailMagnetDTO, Answer } from '.';

let jsdomDetail: JSDOM = {} as JSDOM;

class Mt implements ISource {
  getOriginUrl(): string {
    return 'https://megatorrentshd1.biz';
    //return 'https://megatorrentshd.net'
  }

  async detail({ url }: IShowDetailMagnetDTO): Promise<Answer> {
    const response = await JSDOM.fromURL(url);
    //const response = await JSDOM.fromFile('./src/assets/fakes/html/magnet-source/detail/mt-detail.html');

    const { document } = response.window;

    const name = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
    const desc_link = document.querySelector('meta[property="og:url"]')?.getAttribute('content')
    const thumb = document.querySelector('.caratula img')?.getAttribute('src')

    const getLinks = (link: Element) => {
      let text = String(link.textContent);
      //text = text.replace(String(link.textContent), "")
      return { url: String(link.getAttribute('href')), text, type: 'magnet' }
    }

    const links = [...document.querySelectorAll('a[href^="magnet"]')]
      .map(el => getLinks(el))

    return { name: String(name), thumb: String(thumb), links, engine_url: this.getOriginUrl(), desc_link: String(desc_link) };
  }

  async parseResults(document: Document, selector: string) {

    const getContent = async (art: Element) => {
      //const { links } = await this.detail(String(art.querySelector('h2 a')?.getAttribute('href')));

      return {
        name: String(art.querySelector('img')
          ?.getAttribute('alt')
          ?.replace(/\n|\r|\t/g, '')
          ?.replace(/\\n|\\r|\\t/g, '')
          ?.replace(/\s{2,}/g, '')),
        thumb: String(art.querySelector('img')?.getAttribute('src')),
        links: [],
        engine_url: this.getOriginUrl(),
        desc_link: String(art.querySelector('a.filme-link')?.getAttribute('href'))
      }
    };

    const elements = [...document.querySelectorAll(selector)];
    let contents = [];

    for (let i = 0; i < elements.length; i++) {
      contents.push(await getContent(elements[i]));
    }

    return contents;
  }

  async search({ search_query }: ISearchParams): Promise<Answer[]> {
    const url = `${this.getOriginUrl()}/?s=${search_query}`;
    const response = await JSDOM.fromURL(url);
    //const response = await JSDOM.fromFile('./src/modules/magnetSource/infra/crosscutting/repositories/mt.html');

    const { document } = response.window;

    const results = await this.parseResults(document, '.mblock-content .box-filme-item');

    return results;
  }

  async top(): Promise<ITrendDTO> {
    const url = this.getOriginUrl();
    const response = await JSDOM.fromURL(url);

    const { document } = response.window;
    const recents = await this.parseResults(document, '#categoria:nth-of-type(3) .ItemN');
    const top = await this.parseResults(document, '#categoria:nth-of-type(2) .ItemN');

    return { top, recents };
  }
}

export default new Mt();
