import common_en from '../locales/en/common.json'
import common_uk from '../locales/uk/common.json'
import common_fr from '../locales/fr/common.json'

import eightball_en from '../locales/en/8ball.json'
import eightball_uk from '../locales/uk/8ball.json'
import eightball_fr from '../locales/fr/8ball.json'

import dice_en from '../locales/en/dice.json'
import dice_uk from '../locales/uk/dice.json'
import dice_fr from '../locales/fr/dice.json'

const resources = {
  en: {
    common: common_en,
    '8ball': eightball_en,
    dice: dice_en,
  },
  uk: {
    common: common_uk,
    '8ball': eightball_uk,
    dice: dice_uk,
  },
  fr: {
    common: common_fr,
    '8ball': eightball_fr,
    dice: dice_fr,
  },
}

export default resources
