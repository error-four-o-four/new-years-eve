// rocket objects
export const MAX_NUM = 50;

export const GRAVITY = -0.0004;
export const VELOCITYX = 0.005;
export const VELOCITYY = 0.025;

// rocket icons
export const MAX_AVAILABLE = 5;
export const TIMEOUT = 2000;


// environment
const supportsTouch = window && 'ontouchstart' in window;
export const clickEvent = (supportsTouch) ? 'touchend' : 'mouseup';
