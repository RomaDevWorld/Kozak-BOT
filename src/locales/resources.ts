import common_en from '../locales/en/common.json'
import common_uk from '../locales/uk/common.json'

import eightball_en from '../locales/en/8ball.json'
import eightball_uk from '../locales/uk/8ball.json'

import dice_en from '../locales/en/dice.json'
import dice_uk from '../locales/uk/dice.json'

import mute_en from '../locales/en/mute.json'
import mute_uk from '../locales/uk/mute.json'

import warn_en from '../locales/en/warn.json'
import warn_uk from '../locales/uk/warn.json'

const resources = {
  en: {
    common: common_en,
    '8ball': eightball_en,
    dice: dice_en,
    mute: mute_en,
    warn: warn_en,
  },
  uk: {
    common: common_uk,
    '8ball': eightball_uk,
    dice: dice_uk,
    mute: mute_uk,
    warn: warn_uk,
  },
}

export default resources
