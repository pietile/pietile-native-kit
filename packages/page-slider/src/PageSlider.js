import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Dimensions, Platform, ScrollView, View, ViewPropTypes } from 'react-native';

class PageSlider extends Component {
  constructor(props) {
    super(props);

    // ScrollView offset
    this._offsetX = 0;

    // Android scrollView.scrollTo on component mount workaround
    this._initialSelectedPage = this.props.selectedPage;
    this._hasDoneInitialScroll = false;
  }

  componentDidMount() {
    if (Platform.OS === 'ios' && this.props.selectedPage) {
      // Doesn't work in Android
      this._scrollToPage(this.props.selectedPage, false);
    }
  }

  componentDidUpdate(prevProps) {
    const currentPage = this._getCurrentPage();

    if (
      prevProps.selectedPage !== this.props.selectedPage &&
      this.props.selectedPage !== currentPage
    ) {
      this._scrollToPage(this.props.selectedPage);
    }
  }

  onContentSizeChange = (width, height) => {
    if (
      Platform.OS === 'android' &&
      width &&
      height &&
      this._initialSelectedPage &&
      !this._hasDoneInitialScroll
    ) {
      this._scrollToPage(this._initialSelectedPage, false);

      this._hasDoneInitialScroll = true;
    }
  };

  onScroll = e => {
    this._offsetX = e.nativeEvent.contentOffset.x;

    const currentPage = this._getCurrentPage();
    this.props.onCurrentPageChange(currentPage);
  };

  onMomentumScrollEnd = () => {
    const currentPage = this._getCurrentPage();
    if (this.props.selectedPage !== currentPage) {
      this.props.onSelectedPageChange(currentPage);
    }
  };

  // Calculates page's width according to selected mode
  _getPageWidth = () => {
    const { width } = Dimensions.get('screen');
    if (this.props.mode === 'page') {
      return width;
    }

    const { peek, pageMargin } = this.props;

    return width - 2 * peek + 2 * pageMargin;
  };

  // Get currently visible page
  _getCurrentPage = () => {
    const pageWidth = this._getPageWidth();

    return Math.floor(this._offsetX / pageWidth - 0.5) + 1;
  };

  // Scroll to page by index
  _scrollToPage = (index, animated = true) => {
    const pageWidth = this._getPageWidth();

    this._scrollView.scrollTo({ y: 0, x: index * pageWidth, animated });
  };

  render() {
    const { children, mode, style } = this.props;
    const { width } = Dimensions.get('screen');

    const pageStyle = {
      height: '100%',
    };
    let scrollViewProps = {};

    // Setup pages and ScrollView according to selected mode
    if (mode === 'page') {
      Object.assign(pageStyle, {
        width,
      });
    } else if (mode === 'card') {
      const { contentPaddingVertical, peek, pageMargin } = this.props;

      scrollViewProps = {
        contentContainerStyle: {
          paddingHorizontal: peek - pageMargin,
          paddingVertical: contentPaddingVertical,
        },
        decelerationRate: 'fast',
        snapToAlignment: 'start',
        snapToInterval: this._getPageWidth(),
      };

      if (Platform.OS === 'ios') {
        /**
         * pagingEnabled must be enabled on Android but cause warning on iOS
         * when snapToInterval is set
         */
        scrollViewProps.pagingEnabled = false;
      }

      Object.assign(pageStyle, {
        marginHorizontal: pageMargin,
        width: width - 2 * peek,
      });
    }

    // Wrap children
    const pages = React.Children.map(children, (page, i) => {
      // Skip no valid react elements (null, boolean, undefined and etc.)
      if (!React.isValidElement(page)) {
        return null;
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <View key={i} style={pageStyle}>
          {page}
        </View>
      );
    });

    return (
      <ScrollView
        style={style}
        ref={scrollView => {
          this._scrollView = scrollView;
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onContentSizeChange={this.onContentSizeChange}
        onScroll={this.onScroll}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        scrollEventThrottle={8}
        {...scrollViewProps}
      >
        {pages}
      </ScrollView>
    );
  }
}

PageSlider.propTypes = {
  children: PropTypes.node,
  mode: PropTypes.string,
  onCurrentPageChange: PropTypes.func.isRequired,
  onSelectedPageChange: PropTypes.func.isRequired,
  contentPaddingVertical: PropTypes.number,
  pageMargin: PropTypes.number,
  peek: PropTypes.number,
  selectedPage: PropTypes.number,
  style: ViewPropTypes.style,
};

PageSlider.defaultProps = {
  mode: 'page',
  pageMargin: 8,
  peek: 24,
};

export default PageSlider;
