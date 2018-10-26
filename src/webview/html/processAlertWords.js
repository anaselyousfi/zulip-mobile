/* @flow */
import type { AlertWordsState, FlagsState } from '../../types';

type Params = {
  alertWords: AlertWordsState,
  content: string,
  flags: FlagsState,
  id: number,
};

/* eslint-disable */

/**
 *
 * This code is taken from webapp
 * https://github.com/zulip/zulip/blob/54d3d8e8b3cd0ee120bbf6b3b6c09721e5fdc42b/static/js/alert_words.js
 * Keep it as it is, do not format or apply this project eslint rules.
 * As by applying this rules some bugs might get introduced.
 */

// escape_user_regex taken from jquery-ui/autocomplete.js,
// licensed under MIT license.
// prettier-ignore
function escape_user_regex(value) {
    return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
}

/**
 * Wrap alert words in message content with span having css class `alert-word`.
 */
// prettier-ignore
export default ({ alertWords, content, id, flags }: Params): string => {
  let message = { content };

  if (!flags.has_alert_word[id]) {
    return message.content;
  }
  alertWords.forEach((word: string) => {
        var clean = escape_user_regex(word);
        var before_punctuation = '\\s|^|>|[\\(\\".,\';\\[]';
        var after_punctuation = '\\s|$|<|[\\)\\"\\?!:.,\';\\]!]';


        var regex = new RegExp('(' + before_punctuation + ')' +
                               '(' + clean + ')' +
                               '(' + after_punctuation + ')' , 'ig');
        message.content = message.content.replace(regex, function (match, before, word,
                                                                   after, offset, content) {
            // Logic for ensuring that we don't muck up rendered HTML.
            var pre_match = content.substring(0, offset);
            // We want to find the position of the `<` and `>` only in the
            // match and the string before it. So, don't include the last
            // character of match in `check_string`. This covers the corner
            // case when there is an alert word just before `<` or `>`.
            var check_string = pre_match + match.substring(0, match.length - 1);
            var in_tag = check_string.lastIndexOf('<') > check_string.lastIndexOf('>');
            // Matched word is inside a HTML tag so don't perform any highlighting.
            if (in_tag === true) {
                return before + word + after;
            }
            return before + "<span class='alert-word'>" + word + "</span>" + after;
        });
  });
  return message.content;
};