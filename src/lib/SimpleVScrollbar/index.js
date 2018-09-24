import React, {Component} from 'react';
import styles from './styles';

/**
 * Simple Vertical Scrollbar
 */
export default class SimpleVScrollbar extends Component {
  /**
  * constructor
  * @param {object} props
  */
  constructor(props) {
    super(props);

    // refs
    this.refBase = React.createRef();
    this.refContentsFrame = React.createRef();
    this.refContentsWrapper = React.createRef();
    this.refScrollbar = React.createRef();
    this.refThumb = React.createRef();

    // bind
    this.updateThumbPosition = this.updateThumbPosition.bind(this);
    this.jump = this.jump.bind(this);
    this.showThumb = this.showThumb.bind(this);
    this.hideThumb = this.hideThumb.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragging = this.dragging.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.resizeWindow = this.resizeWindow.bind(this);

    // set eventlistener
    window.addEventListener('resize', this.resizeWindow);

    // state
    this.state = {
      isScroll: false,
      display: false,
      thumbHeight: 0,
      browserScrollbarWidth: 0,
      contentsHeight: 0,
      scrollbarHeight: 0,
    };

    // values
    this.hideTimer = null;
    this.isDragging = false;
    this.mousePointY = 0;

    // set options
    this.options = {
      autoHide: true,
      autoHideTimeout: 300,
      scrollEnd: null,
      className: null,
      height: null,
      width: null,
    };

    this.setOptions();
  }

  /**
   * component update
   * @param {object} nextProps
   * @param {object} nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    const {
      isScroll,
      display,
      thumbHeight,
      browserScrollbarWidth,
    } = this.state;
    const {
      isScroll: nextIsScroll,
      display: nextDisplay,
      thumbHeight: nextThumbHeight,
      browserScrollbarWidth: nextBrowserScrollbarWidth,
    } = nextState;

    let update = false;
    if (
      isScroll !== nextIsScroll ||
      display !== nextDisplay ||
      thumbHeight !== nextThumbHeight ||
      browserScrollbarWidth !== nextBrowserScrollbarWidth
    ) {
      update = true;
    }

    return update;
  }

  /**
   * did mount
   */
  componentDidMount() {
    this.init();
  }

  /**
   * will unmount
   */
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragging);
    document.removeEventListener('mouseup', this.dragEnd);
    window.removeEventListener('resize', this.resizeWindow);
    clearTimeout(this.hideTimer);
  }

  /**
   * initialize
   */
  init() {
    const {
      autoHide,
    } = this.options;

    const state = this.computedScrollbarState();
    state.display = (autoHide ? false : true);
    this.setState(state);
  }

  /**
   * computed scrollbar state
   * @return {object}
   */
  computedScrollbarState() {
    const {
      refBase,
      refContentsFrame,
      refContentsWrapper,
    } = this;

    const contentsFrameWidth = refContentsFrame.current.offsetWidth;
    const contentsWidth = refContentsWrapper.current.offsetWidth;
    const contentsHeight = refContentsWrapper.current.offsetHeight;
    const scrollbarHeight = refBase.current.offsetHeight;
    const browserScrollbarWidth = contentsFrameWidth - contentsWidth;
    let isScroll = false;
    let thumbHeight = 0;

    if (scrollbarHeight < contentsHeight) {
      isScroll = true;
      thumbHeight =
        parseInt(
          Math.pow(scrollbarHeight, 2) / contentsHeight,
          10
        );
    }

    return {
      isScroll: isScroll,
      thumbHeight: thumbHeight,
      browserScrollbarWidth: browserScrollbarWidth,
      contentsHeight: contentsHeight,
      scrollbarHeight: scrollbarHeight,
    };
  }

  /**
   * set options
   */
  setOptions() {
    const props = this.props || {};
    const options = [
      {key: 'autoHide', type: 'boolean'},
      {key: 'autoHideTimeout', type: 'number'},
      {key: 'scrollEnd', type: 'function'},
      {key: 'className', type: 'string'},
      {key: 'height', type: 'number'},
      {key: 'width', type: 'number'},
    ];

    options.forEach((option) => {
      const {
        key,
        type,
      } = option;
      const value = props[key];

      if ('undefined' !== typeof value && type === typeof value) {
        this.options[key] = value;
      }
    });
  }

  /**
   * call to scroll end event
   */
  callToScrollEndEvent() {
    const {
      scrollEnd,
    } = this.options;

    if (!scrollEnd) {
      return;
    }

    scrollEnd();
  }

  /**
   * resize window
   */
  resizeWindow() {
    this.init();
  }

  /**
   * update thumb position from mouse wheel scroll
   * @param {event} e
   */
  updateThumbPosition(e) {
    const {
      thumbHeight,
      contentsHeight,
      scrollbarHeight,
    } = this.state;

    const hidecontentsHeight = contentsHeight - scrollbarHeight;
    const hideScrollbarHeight = scrollbarHeight - thumbHeight;
    const y = e.target.scrollTop * hideScrollbarHeight / hidecontentsHeight;

    this.setThumbPosition(y);

    // show scrollbar thumb
    this.showThumb();
  }


  /**
   * set thumb position
   * @param {number} y
   */
  setThumbPosition(y) {
    const {
      refThumb,
      state: {
        thumbHeight,
        scrollbarHeight,
      },
    } = this;

    // check scroll end
    // ※ To prevent continuous execution, check before adjustment of value.
    if (y + thumbHeight === scrollbarHeight) {
      this.callToScrollEndEvent();
    }

    // adjust so as not to protrude
    if (0 > y) {
      y = 0;
    } else if (y + thumbHeight > scrollbarHeight) {
      y = scrollbarHeight - thumbHeight;
    }

    refThumb.current.style.transform = `translateY(${y}px)`;
  }

  /**
   * jump
   * @param {event} e
   */
  jump(e) {
    const {
      thumbHeight,
    } = this.state;

    let thumbTop = e.pageY - this.getOffsetTop(e.target);

    // center the thumb position
    thumbTop -= (thumbHeight / 2);

    this.setThumbPosition(thumbTop);
    this.setContentsPosition();
  }

  /**
   * drag start
   * @param {event} e
   */
  dragStart(e) {
    e.stopPropagation();
    document.onselectstart = () => {
      return false;
    };
    document.addEventListener('mousemove', this.dragging);
    document.addEventListener('mouseup', this.dragEnd);
    this.isDragging = true;

    const thumbTop = this.getOffsetTop(e.target);
    this.mousePointY = e.pageY - thumbTop;

    // show scrollbar thumb
    this.showThumb();
  }

  /**
   * dragging thumb
   * @param {event} e
   */
  dragging(e) {
    if (!this.isDragging) {
      return;
    }

    const {
      refScrollbar,
      state: {
        contentsHeight,
        scrollbarHeight,
      },
    } = this;

    const scrollbarTop = this.getOffsetTop(refScrollbar.current);
    const hideContentsHeight = contentsHeight - scrollbarHeight;
    const thumbTop =
      (
        (e.pageY - scrollbarTop) /
        hideContentsHeight *
        hideContentsHeight
      ) -
      this.mousePointY;

    this.setThumbPosition(thumbTop);
    this.setContentsPosition();
  }

  /**
   * drag end
   * @param {event} e
   */
  dragEnd(e) {
    document.removeEventListener('mousemove', this.dragging);
    document.removeEventListener('mouseup', this.dragEnd);
    document.onselectstart = () => {
      return true;
    };

    this.isDragging = false;

    // show scrollbar thumb
    this.showThumb();
  }

  /**
   * get offset top
   * @param {dom} dom
   * @return {number}
   */
  getOffsetTop(dom) {
    const rect = dom.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  /**
   * set contents position
   */
  setContentsPosition() {
    const {
      refContentsFrame,
      refScrollbar,
      refThumb,
      state: {
        contentsHeight,
        scrollbarHeight,
      },
    } = this;

    const scrollbarTop = this.getOffsetTop(refScrollbar.current);
    const thumbTop = this.getOffsetTop(refThumb.current);
    let contentsTop =
      (thumbTop - scrollbarTop) *
      contentsHeight /
      scrollbarHeight;

    if (0 > contentsTop) {
      contentsTop = 0;
    }

    refContentsFrame.current.scrollTop = contentsTop;

    // show scrollbar thumb
    this.showThumb();
  }

  /**
   * show thumb
   */
  showThumb() {
    this.toggleThumbShowHide(true);

    // set timer to hide scrollbar thumb
    this.hideThumb();
  }

  /**
   * hide thumb
   */
  hideThumb() {
    clearTimeout(this.hideTimer);

    const {
      autoHide,
      autoHideTimeout,
    } = this.options;

    if (!autoHide) {
      return;
    }

    if (this.isDragging) {
      return;
    }

    this.hideTimer = setTimeout(() => {
      this.toggleThumbShowHide(false);
    }, autoHideTimeout);
  }

  /**
   * toggle thumb show/hide
   * @param {bollean} thumb true:show false:hide
   */
  toggleThumbShowHide(thumb) {
    const state = this.computedScrollbarState();
    state.display = thumb;

    this.setState(state);
  }

  /**
   * render
   * @return {jsx}
   */
  render() {
    const {
      state: {
        isScroll,
        display,
        thumbHeight,
        browserScrollbarWidth,
      },
      options: {
        className,
        height,
        width,
      },
    } = this;

    const classNames = {
      base: (className ? `${className}` : null),
      thumb: (className ? `${className}-thumb` : null),
    };

    const addBaseStyle = {
      height: (height ? `${height}px` : '100%'),
      width: (width ? `${width}px` : '100%'),
    };

    const addScrollbarStyle = {
      display: (isScroll ? 'block' : 'none'),
    };

    const addThumbStyle = {
      height: `${thumbHeight}px`,
      opacity: (display ? 1 : 0),
    };

    const addContentsFrameStyle = {
      width: `calc(100% + ${browserScrollbarWidth}px)`,
    };

    return (
      <div
        ref={this.refBase}
        style={{...styles.base, ...addBaseStyle}}
        className={classNames.base}
        onMouseMove={this.showThumb}
        onMouseOver={this.showThumb}
        onMouseLeave={this.hideThumb}
      >
        <div
          ref={this.refScrollbar}
          style={{...styles.scrollbar, ...addScrollbarStyle}}
          onMouseDown={this.jump}
        >
          <div
            ref={this.refThumb}
            style={{...styles.thumb, ...addThumbStyle}}
            className={classNames.thumb}
            onMouseDown={this.dragStart}
          />
        </div>
        <div
          ref={this.refContentsFrame}
          style={{...styles.contentsFrame, ...addContentsFrameStyle}}
          onScroll={this.updateThumbPosition}
        >
          <div style={styles.contentsWrapper} ref={this.refContentsWrapper}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
