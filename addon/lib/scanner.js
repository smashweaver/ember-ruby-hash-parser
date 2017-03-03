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

  peek() {
    return this._stream[this._ptr];
  }

  next() {
    let ch = this._stream[this._ptr];
    if (this._stream.length > this._ptr) {
      ++this._ptr;
    }
    return ch;
  }

  // this returns the token encoded as an array like so:
  // [token_type, token_value]
  scan(forTokenType='', peek=false) {
    console.log(`scan for ${forTokenType}`);
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
        let matched = false;
        if ('{' === ch) {
          // stringified json so gather until brackets have matched
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
                break;        // oops end of stream
              }
            }
          } while (!matched);
        } else {
          // simple string so gather until matching dbl quote is encountered
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
        }

        if (matched) {
          token = ['STRING',  value];
        }

        break;
    }

    // restore starting if scan failed
    if (null === token) {
      this._ptr = start;
    }

    // restore starting if peeking
    if (token && peek) {
      this._ptr = start;
    }

    console.log(forTokenType, token);

    return token;
  }
}
