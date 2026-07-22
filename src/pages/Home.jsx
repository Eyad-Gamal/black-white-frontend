import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => <main>
  <Hero />
  <div className="page-container">
    <LatestCollection />
    <BestSeller />
    <OurPolicy />
    <NewsletterBox />
  </div>
</main>;

export default Home;
