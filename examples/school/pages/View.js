import { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Layout from '../components/Layout.js';
import Link from 'next/link';
import Table from '../components/Table';
import Actions from '../views/Actions';
import withData from '../lib/withData';
import { get } from 'lodash';
import pluralize from 'pluralize';

class View extends Component {

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
    }),
    items: PropTypes.array,
    model: PropTypes.string,
  }

  static defaultProps = {
    data: {
      loading: true,
    },
    items: [],
  }

  constructor() {
    super();
    this.state = {
      data: { loading: true },
    };
  }

  static async getInitialProps({ store, query, client }) {
    const model = query.model;
    const { adminGraphite } = store.getState();
    const queryModel = adminGraphite.graphql.reduce((acum, value) => {
      if (value[model]) {
        /* eslint-disable no-param-reassign */
        acum = value[model].query;
        /* eslint-enable no-param-reassign */
      }

      return acum;
    }, '');

    const data = await client.query({
      query: gql`${queryModel}`,
    });

    return { ...data, model, items: adminGraphite.items };
  }

  render() {
    const { data: { loading, error }, items, model } = this.props;
    const graphqlData = get(this.props.data, model, []);

    const actions = {
      name: 'Actions',
      elements: (<Actions {...this.props} />),
    };

    const studentTable = !loading && !error ? (
      <Table items= {graphqlData} actions={actions} omit={['__typename', 'active']} />
    ) : null;

    return (
      <Layout items={items} model={model} >
        <div>
          <div className="layout-header">
            <h2 className="main">{model}</h2>
          </div>
          {studentTable}
          <Link as={`/${pluralize(model, 1)}/create`} href= {{ pathname: '/Create', query: { model: pluralize(model, 2) } }}>
            <div className="btn-round">
              <span title="Create new">+</span>
            </div>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default withData(View);
