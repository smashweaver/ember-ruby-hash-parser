import Ember from 'ember';

const { Logger } = Ember;

export function isWS(ch) {
  return ' ' === ch || '\n' === ch || '\t' === ch;
}

export function isEOF(ch) {
  return undefined === ch;
}

export class Scanner {
  constructor(stream) {
    this._ptr = 0;
    this._stream = stream.slice('');
  }

  skip() {
    let ch = this.peek();
    while (!isEOF(ch) && isWS(ch)) {
      ++this._ptr;
      ch = this.peek();
    }
  }

  peek(n = 0) {
    return this._stream[this._ptr + n];
  }

  next() {
    let ch = this._stream[this._ptr];
    if (this._stream.length > this._ptr) {
      ++this._ptr;
    }
    Logger.log(ch, '\\' === ch);
    return ch;
  }

  // this returns the token encoded as an array like so:
  // [token_type, token_value]
  scan(forTokenType = '', peek = false) {
    Logger.log(`scan for ${forTokenType}`);
    let start = this._ptr;
    let token = null;
    let value = '';
    let ch = null;

    // skip whitespaces between non-terminals
    this.skip();

    // read next character
    ch = this.next();

    // process next token
    switch (forTokenType) {
    case 'DQUOTE':
      if ('"' === ch) {
        token = ['DQUOTE', ch];
      }
      break;
    case 'LBRACKET':
      if ('{' === ch) {
        token = ['LBRACKET', ch];
      }
      break;
    case 'RBRACKET':
      if ('}' === ch) {
        token = ['RBRACKET', ch];
      }
      break;
    case 'COMMA':
      if (',' === ch) {
        token = ['COMMA', ch];
      }
      break;
    case 'FATARROW':
      if ('=' === ch) {
        ch = this.next();

        if ('>' === ch) {
          token = ['FATARROW', '=>'];
        }
      }
      break;
    case 'SYMBOL':
      if (':' === ch) {
        ch = this.next();

        while (!isWS(ch) && !isEOF(ch) && /[a-zA-Z0-9_]/.test(ch)) {
          value += ch;
          ch = this.next();
        }

        --this._ptr; // unread last char

        if (value) {
          token = ['SYMBOL', value];
        }
      }
      break;
    case 'NIL':
      if ('n' === ch) {
        ch = this.next();
        if ('i' === ch) {
          ch = this.next();
          if ('l' === ch) {
            token = ['NIL', 'nil'];
          }
        }
      }
      break;
    case 'STRING':
      if ('<' === ch) {
        token = this._xmlString(ch);
      } else if ('{' === ch) {
        token = this._jsonString(ch);
      } else {
        token = this._basicString(ch);
      }
    }

    // restore starting if scan failed
    if (null === token) {
      this._ptr = start;
    }

    // restore starting if peeking
    if (token && peek) {
      this._ptr = start;
    }

    // Logger.log(forTokenType, token);

    return token;
  }

  // gather until brackets have matched
  _jsonString(ch = '{') {
    let value = '';
    let matched = false;
    let brackets = 0;

    do {
      value += ch;

      if ('{' === ch) {
        ++brackets;
      } else if ('}' === ch) {
        --brackets;
      }
      matched = brackets === 0;

      if (!matched) {
        ch = this.next();

        if (isEOF(ch)) {
          break; // end of stream
        }
      }
    } while (!matched);

    return matched ? ['JSON', value] : null;
  }

  // gather until matching dbl quote is encountered
  _basicString(ch) {
    let matched = false;
    let value = '';

    while (!matched) {
      if ('"' !== ch) {
        value += ch;

        ch = this.next();

        if (isEOF(ch)) {
          break;        // oops end of stream
        }
      } else {
        --this._ptr;    // unread the dbl quote
        matched = true; // we have a match
      }
    }

    return matched ? ['STRING', value] : null;
  }

  _xmlString() {
    let matched = false;
    let value = null;
    return matched ? ['XML', value] : null;
  }
}
