import Ember from 'ember';
import { Scanner } from './scanner';

const { Logger } = Ember;

class NIL {
  constructor(scanner) {
    this._scanner = scanner;
    this._value = null;
    this._found = false;
  }

  content() {
    return this._value;
  }

  error() {
    return null;
  }

  match() {
    return this._found;
  }

  parse() {
    Logger.log('parsing nil!');
    let scanner = this._scanner;
    let token = scanner.scan('NIL');

    if (token) {
      this._value = token[1];
      this._found = true;
    }
    Logger.log('exiting nil!', this._value);
  }
}

class STRING {
  constructor(scanner) {
    this._scanner = scanner;
    this._value = '';
    this._error = null;
    this._found = false;
  }

  content() {
    return this._value;
  }

  error() {
    return this._error;
  }

  match() {
    return this._found;
  }

  parse() {
    Logger.log('parsing string!');
    let found = false;
    let error = null;
    let value = '';
    let scanner = this._scanner;
    let token = scanner.scan('DQUOTE');

    if (token) {
      token = scanner.scan('STRING');
      if (token) {
        value = token[1];
        found = true;
      }

      token = scanner.scan('DQUOTE');
      if (!token) {
        error = 'expecting double quote';
      }
    }

    if (error) {
      this._error = error;
    } else {
      this._found = found;
      this._value = value;
    }

    found = this.match();
    value = this.content();
    error = this.error();
    Logger.log('exiting string!', { found, value, error });
  }
}

class VALUE {
  constructor(scanner) {
    this._scanner = scanner;
    this._value = null;
    this._error = null;
    this._found = false;
  }

  content() {
    return this._value;
  }

  error() {
    return this._error;
  }

  match() {
    return this._found;
  }

  parse() {
    Logger.log('parsing value!');
    let scanner = this._scanner;
    let found = false;
    let error = null;
    let value = null;

    // scan for nil
    let nt = new NIL(scanner);
    nt.parse();
    if (nt.match()) {
      found = true;
      value = nt.content();
    }

    // scan for string
    if (!found) {
      nt = new STRING(scanner);
      nt.parse();
      found = nt.match();
      error = nt.error();
      value = nt.content();
    }

    // scan for rh
    if (!error && !found) {
      if (scanner.scan('LBRACKET', true)) {
        nt = new RH(scanner);
        nt.parse();
        found = nt.match();
        error = nt.error();
        value = nt.content();
      }
    }

    if (error) {
      this._error = error;
    } else {
      this._found = found;
      if (found) {
        this._value = value;
      }
    }

    found = this.match();
    value = this.content();
    error = this.error();
    Logger.log('exiting value!', { found, value, error });
  }
}

class KV {
  constructor(scanner) {
    this._scanner = scanner;
    this._key = null;
    this._value = null;
    this._error = null;
    this._found = false;
  }

  content() {
    return [this._key, this._value];
  }

  error() {
    return this._error;
  }

  match() {
    return this._found;
  }

  parse() {
    Logger.log('parsing kv!');
    let key = null;
    let value = null;
    let error = null;
    let found = false;
    let scanner = this._scanner;
    let token = scanner.scan('SYMBOL');

    if (token) {
      key = token[1];
      token = scanner.scan('FATARROW');
      if (token) {
        let nt = new VALUE(scanner);
        nt.parse();
        if (nt.match()) {
          value = nt.content();
          found = true;
        } else {
          error = nt.error() || 'expecting value';
        }
      } else {
        error = 'expecting fatarrow';
      }
    }

    if (error) {
      this._error = error;
    } else {
      this._found = found;
      this._key = key;
      this._value = value;
    }

    found = this.match();
    value = this.content();
    error = this.error();
    Logger.log('exiting kv!', { found, value, error });
  }
}

class EXP {
  constructor(scanner) {
    this._scanner = scanner;
    this._values = [];
    this._error = null;
    this._found = false;
  }

  content() {
    let json = {};
    this._values.forEach(v=>{
      json[v[0]] = v[1];
    });
    return json;
  }

  error() {
    return this._error;
  }

  match() {
    return this._found;
  }

  parse() {
    Logger.log('parsing exp!');
    let done = false;
    let found = false;
    let error = null;
    let value = [];
    let scanner = this._scanner;

    while (!done) {
      let kv = new KV(scanner);
      kv.parse();

      if (kv.match()) {
        found = true;
        let content = kv.content();
        value.push([...content]);

        let token = scanner.scan('COMMA');
        if (null == token) {
          done = true;
        }
      } else {
        error = kv.error();
        done = true;
      }
    }

    if (error) {
      this._error = error;
    } else {
      this._values = [...value];
      this._found = found;
    }

    value = this.content();
    found = this.match();
    error = this.error();
    Logger.log('exiting exp!', { found, value, error });
  }
}

class RH {
  constructor(scanner) {
    this._scanner = scanner;
    this._value = null;
    this._error = null;
    this._found = false;
  }

  content() {
    return this._value;
  }

  match() {
    return this._found;
  }

  error() {
    return this._error;
  }

  parse() {
    Logger.log('parsing rh!');
    let error = null;
    let value = null;
    let found = false;
    let scanner = this._scanner;

    let token = scanner.scan('LBRACKET');
    if (token) {
      let exp = new EXP(scanner);
      exp.parse();
      value = exp.content();
      error = exp.error();
      found = exp.match();

      if (!error) {
        token = scanner.scan('RBRACKET');
        if (null === token) {
          error = 'expecting right bracket';
        }
      }
    } else {
      error = 'expecting left bracket';
    }

    if (error) {
      this._error = error;
    } else {
      this._found = found;
      this._value = value;
    }

    found = this.match();
    value = this.content();
    error = this.error();
    Logger.log('exiting rh!', { found, value, error });
  }
}

class Parser {
  parse(stream) {
    Logger.log('*** stream ***', stream);
    let scanner = new Scanner(stream);
    let rh = new RH(scanner);
    rh.parse();

    if (rh.error()) {
      throw new Error(rh.error());
    }

    return rh.content();
  }
}

export default new Parser();
