const styles = {
  base: {
    overflow: 'hidden',
    position: 'relative',
  },
  contentsFrame: {
    boxSizing: 'content-box',
    height: '100%',
    overflowY: 'scroll',
    overflowScrolling: 'touch',
    paddingRight: '50px',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
    zIndex: '1',
  },
  contentsWrapper: {
    paddingRight: '50px',
    width: '100%',
  },
  scrollbar: {
    borderTop: 'none',
    borderBottom: 'none',
    borderLeft: 'solid 2px transparent',
    borderRight: 'solid 2px transparent',
    boxSizing: 'content-box',
    display: 'inline-block',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: '2',
  },
  thumb: {
    backgroundColor: 'rgba(0, 0, 0, .4)',
    borderRadius: '3px',
    boxSizing: 'content-box',
    transition: 'opacity .2s ease-in-out',
    width: '6px',
  },
};

export default styles;
