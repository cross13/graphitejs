import Layout from '../components/Layout.js';
import SchoolList from '../views/SchoolList';
import SchoolCreate from '../views/SchoolCreate';
import withData from '../lib/withData';

const Index = withData(() => (
  <Layout>
    <SchoolList />
    <SchoolCreate />
  </Layout>
));

export default Index;