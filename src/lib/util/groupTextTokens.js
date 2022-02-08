import Token from './Token';

const cleanTokenTag = (result, token, matchers) => {
  const typeMatchers = Object.keys(matchers);
  for (let match of typeMatchers) {
    const reg = /[“”]/g;
    if (token.content.replace(reg, '"').includes(match)) {
      result.push(new Token(matchers[match].type, 1));
      const newToken = new Token('text');
      newToken.content = token.content.substring(
        match.length,
        token.content.length - matchers[match].closingTag.length,
      );
      result.push(newToken);
      result.push(new Token(matchers[match].type, -1));
      return;
    }
  }

  result.push(token);
};

const pushToken = (result, token, nesting, matchers) => {
  if (token.content && token.content !== '') {
    cleanTokenTag(result, token, nesting, matchers);
  } else {
    result.push(token);
  }
};

export default function groupTextTokens(tokens, matchers) {
  const result = [];

  let hasGroup = false;

  tokens.forEach((token, index) => {
    if (!token.block && !hasGroup) {
      hasGroup = true;
      result.push(new Token('textgroup', 1));
      pushToken(result, token, matchers);
    } else if (!token.block && hasGroup) {
      pushToken(result, token, matchers);
    } else if (token.block && hasGroup) {
      hasGroup = false;
      result.push(new Token('textgroup', -1));
      pushToken(result, token, matchers);
    } else {
      pushToken(result, token, matchers);
    }
  });

  return result;
}
