// scripts from hosted global server

import axios from 'axios';

export const script = async (address: string): Promise<unknown> => {
  const url = `https://t-master-mstomar698.vercel.app/${address}script.sh`;
  const response = await axios.get(url);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.data;
};

export const scriptString = await script('t');
