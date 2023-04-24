import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import delay from 'utils/delay';

export default async function handler(request, response) {
  try {
    //console.log('api/news:start');
    const { url} = request.query;
    const { data } = await axios.get(`http://localhost:4000/v1/technews/post/origin?page=1&url=${url}`);
    //console.log(
      //'api/news:ok', 
      //data
    //);

    //await delay(1000 * 10);

    return response.json(data);
  } catch (error) {
    //console.log('api/news', error);

    return { posts: [] };
  }
}