import React, { Component } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type Props = typeof PageSlider.defaultProps & {
  children?: React.ReactNode;
  contentPaddingVertical?: number;
  selectedPage?: number;
  style?: StyleProp<ViewStyle>;
  onCurrentPageChange: (currentPage: number) => void;
  onSelectedPageChange: (selectedPage: number) => void;
};

export class PageSlider extends Component<Props> {
  static defaultProps = {
    mode: 'page' as 'page' | 'card',
    pageMargin: 8,
    peek: 24,
  };

  private offsetX = 0;

  private initialSelectedPage: number | undefined;

  private hasDoneInitialScroll = false;

  private scrollView: ScrollView | null = null;

  constructor(props: Props) {
    super(props);

    // Android scrollView.scrollTo on component mount workaround
    this.initialSelectedPage = this.props.selectedPage;
  }

  componentDidMount() {
    if (Platform.OS === 'ios' && this.props.selectedPage) {
      // Doesn't work in Android
      this.scrollToPage(this.props.selectedPage, false);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const currentPage = this.getCurrentPage();

    if (
      prevProps.selectedPage !== this.props.selectedPage &&
      this.props.selectedPage !== currentPage &&
      this.props.selectedPage !== undefined
    ) {
      this.scrollToPage(this.props.selectedPage);
    }
  }

  private onContentSizeChange = (width: number, height: number): void => {
    if (
      Platform.OS === 'android' &&
      width &&
      height &&
      this.initialSelectedPage &&
      !this.hasDoneInitialScroll
    ) {
      this.scrollToPage(this.initialSelectedPage, false);

      this.hasDoneInitialScroll = true;
    }
  };

  private onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>): void => {
    this.offsetX = e.nativeEvent.contentOffset.x;

    const currentPage = this.getCurrentPage();
    this.props.onCurrentPageChange(currentPage);
  };

  private onMomentumScrollEnd = (): void => {
    const currentPage = this.getCurrentPage();
    if (this.props.selectedPage !== currentPage) {
      this.props.onSelectedPageChange(currentPage);
    }
  };

  // Calculates page's width according to selected mode
  private getPageWidth = (): number => {
    const { width } = Dimensions.get('screen');
    if (this.props.mode === 'page') {
      return width;
    }

    const { peek, pageMargin } = this.props;

    return width - 2 * peek + 2 * pageMargin;
  };

  // Get currently visible page
  private getCurrentPage = (): number => {
    const pageWidth = this.getPageWidth();

    return Math.floor(this.offsetX / pageWidth - 0.5) + 1;
  };

  // Scroll to page by index
  private scrollToPage = (index: number, animated = true): void => {
    const pageWidth = this.getPageWidth();

    this.scrollView?.scrollTo({ y: 0, x: index * pageWidth, animated });
  };

  render() {
    const { children, mode, style } = this.props;
    const { width } = Dimensions.get('screen');

    const pageStyle = {
      height: '100%',
    };
    let scrollViewProps: ScrollViewProps = {};

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
        snapToInterval: this.getPageWidth(),
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
    const pages = React.Children.map(children, (page) => {
      // Skip no valid react elements (null, boolean, undefined and etc.)
      if (!React.isValidElement(page)) {
        return null;
      }

      return (
        <View key={page.key} style={pageStyle}>
          {page}
        </View>
      );
    });

    return (
      <ScrollView
        style={style}
        ref={(scrollView) => {
          this.scrollView = scrollView;
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
