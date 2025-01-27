var KeyCode = /** @class */ (function () {
    function KeyCode() {
    }
    KeyCode.BACKSPACE = 'Backspace';
    KeyCode.TAB = 'Tab';
    KeyCode.ENTER = 'Enter';
    KeyCode.ESCAPE = 'Escape';
    KeyCode.SPACE = ' ';
    KeyCode.LEFT = 'ArrowLeft';
    KeyCode.UP = 'ArrowUp';
    KeyCode.RIGHT = 'ArrowRight';
    KeyCode.DOWN = 'ArrowDown';
    KeyCode.DELETE = 'Delete';
    KeyCode.F2 = 'F2';
    KeyCode.PAGE_UP = 'PageUp';
    KeyCode.PAGE_DOWN = 'PageDown';
    KeyCode.PAGE_HOME = 'Home';
    KeyCode.PAGE_END = 'End';
    // these should be used with `event.code` instead of `event.key`
    // as `event.key` changes when non-latin keyboards are used
    KeyCode.A = 'KeyA';
    KeyCode.C = 'KeyC';
    KeyCode.D = 'KeyD';
    KeyCode.V = 'KeyV';
    KeyCode.X = 'KeyX';
    KeyCode.Y = 'KeyY';
    KeyCode.Z = 'KeyZ';
    return KeyCode;
}());
export { KeyCode };
