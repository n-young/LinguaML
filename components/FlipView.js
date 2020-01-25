// source: https://github.com/kevinstumpf/react-native-flip-view/blob/5daebcc1010ac3cdc33c917c0c8e62f0980f589a/index.js

import React, { Component } from 'react';
import { Easing, Animated, View, StyleSheet } from 'react-native';

export default class FlipView extends Component {
  static defaultProps = {
    style: {},
    flipDuration: 500,
    flipEasing: Easing.out(Easing.ease),
    flipAxis: 'y',
    perspective: 1000,
    onFlip: () => {},
    onFlipped: () => {},
    isFlipped: false,
  };

  constructor(props) {
    super(props);

    var targetRenderState = this._getTargetRenderStateFromFlippedValue(
      props.isFlipped
    );

    var frontRotationAnimatedValue = new Animated.Value(
      targetRenderState.frontRotation
    );
    var backRotationAnimatedValue = new Animated.Value(
      targetRenderState.backRotation
    );

    var interpolationConfig = {
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    };
    var frontRotation = frontRotationAnimatedValue.interpolate(
      interpolationConfig
    );
    var backRotation = backRotationAnimatedValue.interpolate(
      interpolationConfig
    );

    this.state = {
      frontRotationAnimatedValue,
      backRotationAnimatedValue,
      frontRotation,
      backRotation,
      isFlipped: props.isFlipped,
    };
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (nextProps.isFlipped !== this.props.isFlipped) {
      this.flip();
    }
  };

  _getTargetRenderStateFromFlippedValue = isFlipped => {
    return {
      frontRotation: isFlipped ? 0.5 : 0,
      backRotation: isFlipped ? 1 : 0.5,
    };
  };

  render = () => {
    var rotateProperty = this.props.flipAxis === 'y' ? 'rotateY' : 'rotateX';

    return (
      <View {...this.props}>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'none' : 'auto'}
          style={[
            styles.flippableView,
            {
              transform: [
                { perspective: this.props.perspective },
                { [rotateProperty]: this.state.frontRotation },
              ],
            },
          ]}>
          {this.props.front}
        </Animated.View>
        <Animated.View
          pointerEvents={this.state.isFlipped ? 'auto' : 'none'}
          style={[
            styles.flippableView,
            {
              transform: [
                { perspective: this.props.perspective },
                { [rotateProperty]: this.state.backRotation },
              ],
            },
          ]}>
          {this.props.back}
        </Animated.View>
      </View>
    );
  };

  flip = () => {
    this.props.onFlip();

    var nextIsFlipped = !this.state.isFlipped;

    var {
      frontRotation,
      backRotation,
    } = this._getTargetRenderStateFromFlippedValue(nextIsFlipped);

    setImmediate(() => {
      requestAnimationFrame(() => {
        Animated.parallel([
          this._animateValue(
            this.state.frontRotationAnimatedValue,
            frontRotation,
            this.props.flipEasing
          ),
          this._animateValue(
            this.state.backRotationAnimatedValue,
            backRotation,
            this.props.flipEasing
          ),
        ]).start(k => {
          if (!k.finished) {
            return;
          }
          this.setState({ isFlipped: nextIsFlipped });
          this.props.onFlipped(nextIsFlipped);
        });
      });
    });
  };

  _animateValue = (animatedValue, toValue, easing) => {
    return Animated.timing(animatedValue, {
      toValue: toValue,
      duration: this.props.flipDuration,
      easing: easing,
    });
  };
}

var styles = StyleSheet.create({
  flippableView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: 'hidden',
  },
});
