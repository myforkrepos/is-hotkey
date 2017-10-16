
/**
 * Is Mac?
 *
 * @type {Boolean}
 */

const IS_MAC = (
  typeof window != 'undefined' &&
  window.navigator &&
  window.navigator.platform &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
)

/**
 * Convenience aliases.
 *
 * @type {Object}
 */

const CONVENIENCE = {
  cmd: 'meta',
  command: 'meta',
  ctl: 'control',
  ctrl: 'control',
  del: 'delete',
  down: 'arrowdown',
  esc: 'escape',
  ins: 'insert',
  left: 'arrowleft',
  opt: 'alt',
  option: 'alt',
  return: 'enter',
  right: 'arrowright',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  win: 'meta',
  windows: 'meta',
  // The icon equivalents, for people who get weird.
  '↩': 'enter',
  '⇧': 'shift',
  '⌃': 'control',
  '⌘': 'meta',
  '⌥': 'alt',
  // Since `+` is used as a separator, we need a special case for this.
  add: '+',
}

/**
 * Modifier keys.
 *
 * @type {Array}
 */

const MODIFIERS = {
  alt: 'altKey',
  control: 'ctrlKey',
  meta: 'metaKey',
  shift: 'shiftKey',
}

/**
 * Test whether an `event` matches a `hotkey` string.
 *
 * If you omit the `event`, the comparison function will be curried, to improve
 * performance by not having to parse the hotkey string on each invocation.
 *
 * @param {String} hotkey
 * @param {Event} [event]
 * @return {Boolean|Function}
 */

function isHotkey(hotkey, event) {
  const object = parseHotkey(hotkey)

  return event == null
    ? e => compareHotkey(object, e)
    : compareHotkey(object, event)
}

/**
 * Parse a `hotkey` string into an object.
 *
 * @param {String} hotkey
 * @return {Object}
 */

function parseHotkey(hotkey) {
  // Special case to replace `++` with `+add` to handle matching the plus key.
  hotkey = hotkey.replace('++', '+add')

  const values = hotkey.split('+')
  const ret = {}

  for (let value of values) {
    let key
    value = value.toLowerCase()

    if (value == 'mod') {
      value = IS_MAC ? 'cmd' : 'ctrl'
    }

    if (value in CONVENIENCE) {
      value = CONVENIENCE[value]
    }

    const isModifier = value in MODIFIERS

    if (isModifier) {
      const key = MODIFIERS[value]
      ret[key] = true
    }

    if (!isModifier || values.length == 1) {
      ret.key = value
    }
  }

  // Ensure that any modifier that isn't explicitly set is set to `false`.
  for (const k in MODIFIERS) {
    const key = MODIFIERS[k]
    if (!(key in ret)) ret[key] = false
  }

  return ret
}

/**
 * Compare a hotkey `object` to an `event` to see if they match.
 *
 * @param {Object} object
 * @param {Event} event
 * @return {Boolean}
 */

function compareHotkey(object, event) {
  for (const key in object) {
    const actual = key == 'key' ? event.key.toLowerCase() : event[key]
    const expected = object[key]
    if (actual != expected) return false
  }

  return true
}

/**
 * Export.
 *
 * @type {Function}
 */

export default isHotkey

export {
  isHotkey,
  parseHotkey,
  compareHotkey,
}
