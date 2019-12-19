import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { ActivityIndicator, View } from 'react-native';

import api from '../../services/api';

export default class Repository extends Component {
  state = {
    visible: false,
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repository').name,
  });

  showLoading = () => {
    this.setState({ visible: true });
  };

  hideLoading = () => {
    this.setState({ visible: false });
  };

  render() {
    const { navigation } = this.props;

    const repository = navigation.getParam('repository');

    return (
      <>
        <WebView
          source={{ uri: repository.html_url }}
          style={{ flex: 1 }}
          onLoadStart={() => this.showLoading()}
          onLoad={() => this.hideLoading()}
        />
        {this.state.visible && (
          <ActivityIndicator
            size="large"
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
            }}
          />
        )}
      </>
    );
  }
}
