// constants.js
export function constant() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const constants = {
  // Frontend constants
  WEBSOCKET_PERIOD_IN_MS: 20,
  DEFAULT_IMAGE_BLOCK_SIZE: 100,
  DEFAULT_BLOCK_SIZE: 100,
  MIN_BLOCK_SIZE: 20,
  MAX_BLOCK_SIZE: 200,
  DEFAULT_AVATAR_SIZE: 100,
  DEFAULT_BUTTON_SIZE: 50,
  DEFAULT_SMALL_BUTTON_SIZE: 25,

  MIN_CLICK_DISTANCE_BLOCK_POINTER: 0.5,
  MIN_INTERACTION_DISTANCE: 2,
  MIN_INTERACTION_ANGLE: 60,
  MIN_MOVE_DISTANCE_POINTER_PLAYER: 0.2,
  MOVEMENT_STATE_IDLE: -1,
  MOVEMENT_STATE_MOVING: 0,
  MOVEMENT_STATE_AVATAR: 1,
  MOVEMENT_STATE_INFO: 2,
  MOVEMENT_STATE_BACKPACK: 3,
  MOVEMENT_STATE_MEMBERS: 9,
  MOVEMENT_STATE_SETTINGS: 4,
  MOVEMENT_STATE_USE: 6,
  MOVEMENT_STATE_DECOMPOSE: 7,
  MOVEMENT_STATE_SET: 8,
  MOVEMENT_STATE_EXCHANGE: 5,
  MOVEMENT_STATE_RECORDER: 10,

  // Backend constants
  WEB_STAGE_START: 0,
  WEB_STAGE_INITIALIZING: 1,
  WEB_STAGE_INITIALIZED: 2,
  PLAYER_STATUS_INIT: 0,
  PLAYER_STATUS_RUNNING: 1,
  FRAME_PER_SECOND: 25,
  MINI_MAP_DEFAULT_SIZE: 100,

  COMMAND_PREFIX: '/',
  MESSAGE_TYPE_PRINTED: 1,
  MESSAGE_TYPE_VOICE: 2,
  SCOPE_GLOBAL: 0,
  SCOPE_INDIVIDUAL: 1,
  SCOPE_SELF: 2,

  SCENE_DEFAULT_WIDTH: 10,
  SCENE_DEFAULT_HEIGHT: 10,
  BLOCK_TYPE_NORMAL: 0,
  BLOCK_TYPE_EVENT: 1,
  BLOCK_TYPE_PLAYER: 2,
  BLOCK_TYPE_DROP: 3,
  BLOCK_TYPE_TELEPORT: 4,
  BLOCK_TYPE_BED: 5,
  BLOCK_TYPE_TOILET: 6,
  BLOCK_TYPE_DRESSER: 7,
  BLOCK_TYPE_WORKSHOP: 8,
  BLOCK_TYPE_GAME: 9,
  BLOCK_TYPE_STORAGE: 10,
  BLOCK_TYPE_COOKER: 11,
  BLOCK_TYPE_SINK: 12,
  BLOCK_TYPE_CONTAINER: 13,

  STRUCTURE_MATERIAL_HOLLOW: 0,
  STRUCTURE_MATERIAL_SOLID: 1,
  STRUCTURE_MATERIAL_FLESH: 2,
  STRUCTURE_SHAPE_TYPE_ROUND: 1,
  STRUCTURE_SHAPE_TYPE_SQUARE: 2,
  STRUCTURE_SHAPE_TYPE_RECTANGLE: 3,
  PLAYER_RADIUS: 0.1,
  MIN_DROP_INTERACTION_DISTANCE: 0.2,
  HEAD_BODY_RATIO: 0.32,
  WAIST_BODY_RATIO: 0.6,
  STATUS_DISPLAY_DISTANCE: 0.15,
  MIN_DISPLAY_DISTANCE_BLOCK_PLAYER: 2,

  INTERACTION_USE: 0,
  INTERACTION_EXCHANGE: 1,
  INTERACTION_SLEEP: 2,
  INTERACTION_DRINK: 3,
  INTERACTION_DECOMPOSE: 4,
  INTERACTION_TALK: 5,
  INTERACTION_ATTACK: 6,
  INTERACTION_FLIRT: 7,
  INTERACTION_SET: 8,
  INTERACTION_SUCCUMB: 9,
  INTERACTION_EXPEL: 10,

  ITEM_CHARACTER_TOOL: 't',
  ITEM_CHARACTER_OUTFIT: 'a',
  ITEM_CHARACTER_CONSUMABLE: 'c',
  ITEM_CHARACTER_MATERIAL: 'm',
  ITEM_CHARACTER_JUNK: 'j',
  ITEM_CHARACTER_NOTE: 'n',
  ITEM_CHARACTER_RECORDING: 'r',
  RECIPE_CHARACTER_WORKSHOP: 'w',
  RECIPE_CHARACTER_COOKER: 'c',
  RECIPE_CHARACTER_SINK: 's',

  FLAG_LOGOFF: 'logoff',
  FLAG_UPDATE_ITEMS: 'updateItems',
  FLAG_UPDATE_INTERACTED_ITEMS: 'updateInteractedItems',
  FLAG_UPDATE_RECIPES: 'updateRecipes',

  TERMINAL_TYPE_GAME: 1,
  GAME_TYPE_LAS_VEGAS: 1,

  EVENT_CODE_HIT_FIRE: 102,
  EVENT_CODE_HIT_ICE: 103,
  EVENT_CODE_HIT_ELECTRICITY: 104,
  EVENT_CODE_UPGRADE: 105,
  EVENT_CODE_FIRE: 106,
  EVENT_CODE_EXPLODE: 108,
  EVENT_CODE_BLEED: 109,
  EVENT_CODE_BLOCK: 110,
  EVENT_CODE_HEAL: 111,
  EVENT_CODE_DISTURB: 112,
  EVENT_CODE_SACRIFICE: 113,
  EVENT_CODE_TAIL_SMOKE: 114,
  EVENT_CODE_CHEER: 115,
  EVENT_CODE_CURSE: 116,
  EVENT_CODE_MELEE_HIT: 101,
  EVENT_CODE_MELEE_SCRATCH: 117,
  EVENT_CODE_MELEE_CLEAVE: 118,
  EVENT_CODE_MELEE_STAB: 119,
  EVENT_CODE_MELEE_KICK: 120,
  EVENT_CODE_SHOOT_HIT: 122,
  EVENT_CODE_SHOOT_ARROW: 123,
  EVENT_CODE_SHOOT_SLUG: 107,
  EVENT_CODE_SHOOT_MAGNUM: 124,
  EVENT_CODE_SHOOT_ROCKET: 121,
  EVENT_CODE_SPARK: 125,
  EVENT_CODE_FOOTSTEP: 126,

  BUFF_CODE_DEAD: 1,
  BUFF_CODE_STUNNED: 2,
  BUFF_CODE_BLEEDING: 3,
  BUFF_CODE_SICK: 4,
  BUFF_CODE_FRACTURED: 5,
  BUFF_CODE_HUNGRY: 6,
  BUFF_CODE_THIRSTY: 7,
  BUFF_CODE_FATIGUED: 8,
  BUFF_CODE_BLIND: 9,
  BUFF_CODE_INVINCIBLE: 10,
  BUFF_CODE_REVIVED: 11,
  BUFF_CODE_REALISTIC: 12,
  BUFF_CODE_ANTI_TROPHY: 13,
  BUFF_CODE_BLOCKED: 14,
  BUFF_CODE_HAPPY: 15,
  BUFF_CODE_SAD: 16,
  BUFF_CODE_RECOVERING: 17,
  BUFF_CODE_LENGTH: 18,

  SKILL_LENGTH: 4,
  SKILL_CODE_BLOCK: 3,
  SKILL_CODE_HEAL: 4,
  SKILL_CODE_CURSE: 5,
  SKILL_CODE_CHEER: 6,
  SKILL_CODE_MELEE_HIT: 11,
  SKILL_CODE_MELEE_KICK: 12,
  SKILL_CODE_MELEE_SCRATCH: 13,
  SKILL_CODE_MELEE_CLEAVE: 14,
  SKILL_CODE_MELEE_STAB: 15,
  SKILL_CODE_SHOOT_HIT: 21,
  SKILL_CODE_SHOOT_ARROW: 22,
  SKILL_CODE_SHOOT_GUN: 23,
  SKILL_CODE_SHOOT_SHOTGUN: 24,
  SKILL_CODE_SHOOT_MAGNUM: 25,
  SKILL_CODE_SHOOT_ROCKET: 26,
  SKILL_MODE_SEMI_AUTO: 0,
  SKILL_MODE_AUTO: 1,

  CREATURE_TYPE_HUMAN: 1,
  CREATURE_TYPE_ANIMAL: 2,
  FACE_COEFS_LENGTH: 10
}