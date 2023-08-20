import common_en from '../locales/en/common.json'
import common_uk from '../locales/uk/common.json'
import common_fr from '../locales/fr/common.json'

import eightball_en from '../locales/en/eightball.json'
import eightball_uk from '../locales/uk/eightball.json'
import eightball_fr from '../locales/fr/eightball.json'

import dice_en from '../locales/en/dice.json'
import dice_uk from '../locales/uk/dice.json'
import dice_fr from '../locales/fr/dice.json'

import mute_en from '../locales/en/mute.json'
import mute_uk from '../locales/uk/mute.json'

import warn_en from '../locales/en/warn.json'
import warn_uk from '../locales/uk/warn.json'

import logs_en from '../locales/en/logs.json'
import logs_uk from '../locales/uk/logs.json'

import config_en from '../locales/en/config.json'
import config_uk from '../locales/uk/config.json'

import private_en from '../locales/en/privates.json'
import private_uk from '../locales/uk/privates.json'

const resources = {
  en: {
    common: common_en,
    eightball: eightball_en,
    dice: dice_en,
    mute: mute_en,
    warn: warn_en,
    logs: logs_en,
    config: config_en,
    privates: private_en,
  },
  uk: {
    common: common_uk,
    eightball: eightball_uk,
    dice: dice_uk,
    mute: mute_uk,
    warn: warn_uk,
    logs: logs_uk,
    config: config_uk,
    privates: private_uk,
  },
  fr: {
    common: common_fr,
    eightball: eightball_fr,
    dice: dice_fr,
  },
}

export default resources
