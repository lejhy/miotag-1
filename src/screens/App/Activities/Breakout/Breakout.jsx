// @flow

import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, View } from 'react-native';
import { GLView } from 'expo-gl';
import { PIXI } from 'expo-pixi';
import Svg, {
  Defs, LinearGradient, Rect, Stop,
} from 'react-native-svg';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

import Button from '@core/Button/Button';
import Text from '@core/Text/Text';
import ActivitiesService from '@services/api/ActivitiesService';

import Controller from './Controller';
import Model from './Model';

export default class Breakout extends PureComponent {
  state = {
    menu: [],
  };

  createdAt = new Date();

  model: Model;

  controller: Controller;

  app: PIXI.Application;

  fingersSqueezed = false;

  menu = null;

  scene = new PIXI.Container();

  componentDidMount() {
    activateKeepAwake();
  }

  componentWillUnmount() {
    deactivateKeepAwake();
    this.app.destroy();
    ActivitiesService.newLog({
      activity: {
        id: this.props.navigation.getParam('id'),
      },
      length: new Date() - this.createdAt,
      score: this.model.getHighScore(),
    });
  }

  onContextCreate = async (context) => {
    this.app = new PIXI.Application({ context, transparent: true });
    this.model = new Model(this.app);
    this.controller = new Controller(this.model, this);
    this.controller.init();
  };

  isPaused = () => this.props.isPaused()

  getTilt() {
    return this.props.getImu()[3];
  }

  getSqueeze() {
    const fingers = this.props.getFingers();
    if (this.fingersSqueezed) {
      const max = Math.max(...fingers);
      if (max < 100) {
        this.fingersSqueezed = false;
      }
    } else {
      const min = Math.min(...fingers);
      if (min > 100) {
        this.fingersSqueezed = true;
        return true;
      }
    }
    return false;
  }

  addHeader(text) {
    this.setState((prev) => ({
      menu: prev.menu.concat([
        <Text
          numberOfLines={1}
          style={styles.header}
        >
          {text}
        </Text>,
      ]),
    }));
  }

  addParagraph(text) {
    this.setState((prev) => ({
      menu: prev.menu.concat([
        <Text
          style={styles.paragraph}
        >
          {text}
        </Text>,
      ]),
    }));
  }

  addButton(text, callback, argument) {
    this.setState((prev) => ({
      menu: prev.menu.concat([
        <Button
          style={styles.button}
          onPress={() => { callback(argument); }}
        >
          {text}
        </Button>,
      ]),
    }));
  }

  eraseMenu() {
    this.setState({ menu: [] });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={
          this.state.menu.length > 0
            ? styles.menu
            : styles.hiddenMenu
        }
        >
          {
            this.state.menu
          }
        </View>
        <Svg viewBox="0 0 100 100" preserveAspectRatio="none" style={styles.background}>
          <Defs>
            <LinearGradient id="grad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#4087c5" />
              <Stop offset="100%" stopColor="#71abd6" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
        </Svg>
        <GLView
          style={styles.game}
          onContextCreate={this.onContextCreate}
          onStartShouldSetResponder={(event) => true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 300,
  },
  hiddenMenu: {
    display: 'none',
  },
  game: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 200,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 100,
  },
  button: {
    width: '75%',
    margin: '10%',
  },
  header: {
    fontSize: 40,
    fontWeight: '500',
    color: '#FFFFFF',
    margin: '10%',
  },
  paragraph: {
    color: '#FFFFFF',
  },
});

AppRegistry.registerComponent('Breakout', () => Breakout);
