import React, { Component } from 'react';
import { Keyboard, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false, refreshing: false });
  }

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ page: this.state.page + 1 });

    const { stars, page } = this.state;

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : [...stars],
    });
  };

  refreshList = () => {
    this.setState({ page: 1, refreshing: true, stars: [] });

    this.componentDidMount();
  };

  handleNavigate = repository => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { repository });
  };

  render() {
    const { navigation } = this.props;

    const { stars, loading, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        <Stars
          data={stars}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => this.handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />

          {loading && !refreshing ? (
            <ActivityIndicator size="large"
            style={{
              flex: 1,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              color:"#0000ff",
            }}/>
          ) : (
            <Starred />
          )}

      </Container>
    );
  }
}
