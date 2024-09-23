import { Metadata } from 'next';
import Home from './home';
import { applicationName, description, keywords } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Home - GoRent',
  description,
  keywords,
  applicationName,
};

export default Home;
