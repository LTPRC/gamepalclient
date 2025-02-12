// constants.js
export function constant() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const constants = {
  // Frontend constants
  WEBSOCKET_PERIOD_IN_MS: 20,

  DEFAULT_AVATAR_SIZE: 100,
  DEFAULT_BUTTON_SIZE: 50,
  DEFAULT_SMALL_BUTTON_SIZE: 25,
  MENU_LEFT_EDGE: 150,
  MENU_RIGHT_EDGE: 150,
  MENU_TOP_EDGE: 100,
  MENU_BOTTOM_EDGE: 300,
  WHEEL_1_RADIUS: 100,
  WHEEL_2_RADIUS: 100,
  MAX_STATUS_LINE_SIZE: 100,
  STATUS_SIZE: 20,
  MAX_MSG_LINE_NUM: 10,
  MAX_MSG_LINE_HEIGHT: 400,
  MSG_LINE_HEIGHT: 20,

  KEY_INDEX_MOVEMENT_UP: 0,
  KEY_INDEX_MOVEMENT_LEFT: 1,
  KEY_INDEX_MOVEMENT_RIGHT: 2,
  KEY_INDEX_MOVEMENT_DOWN: 3,
  KEY_INDEX_SKILL_UP: 10,
  KEY_INDEX_SKILL_LEFT: 11,
  KEY_INDEX_SKILL_RIGHT: 12,
  KEY_INDEX_SKILL_DOWN: 13,

  DEFAULT_IMAGE_BLOCK_SIZE: 100,
  DEFAULT_BLOCK_SIZE: 100,
  MIN_BLOCK_SIZE: 20,
  MAX_BLOCK_SIZE: 300,
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
  MOVEMENT_STATE_MOVEMENT_MODE: 11,
  MOVEMENT_STATE_CHAT_DISPLAY: 12,
  HEAD_BODY_RATIO: 0.32,
  WAIST_BODY_RATIO: 0.6,
  STATUS_DISPLAY_DISTANCE: 1.15,
  MIN_DISPLAY_DISTANCE_BLOCK_PLAYER: 2,

  LAZY_SETTLE_SPEED: false,
  MOVEMENT_MODE_DEFAULT: 0,
  MOVEMENT_MODE_STAND_GROUND: 1,
  MOVEMENT_MODE_WALK: 2,
  OFFSET_X_LEFT: 0,
  OFFSET_X_MIDDLE: 1,
  OFFSET_X_RIGHT: 2,
  OFFSET_Y_DOWNWARD: 0,
  OFFSET_Y_LEFTWARD: 1,
  OFFSET_Y_RIGHTWARD: 2,
  OFFSET_Y_UPWARD: 3,

  // Backend constants
  WEB_STAGE_START: 0,
  WEB_STAGE_INITIALIZING: 1,
  WEB_STAGE_INITIALIZED: 2,
  PLAYER_STATUS_INIT: 0,
  PLAYER_STATUS_RUNNING: 1,
  FRAME_PER_SECOND: 25,
  MINI_MAP_DEFAULT_SIZE: 100,

  MESSAGE_TYPE_PRINTED: 1,
  MESSAGE_TYPE_VOICE: 2,
  SCOPE_GLOBAL: 0,
  SCOPE_TEAMMATE: 1,
  SCOPE_INDIVIDUAL: 2,
  SCOPE_SELF: 3,

  BLOCK_CODE_UPGRADE: 105,
  BLOCK_CODE_EXPLODE: 108,
  BLOCK_CODE_BLEED: 109,
  BLOCK_CODE_BLOCK: 110,
  BLOCK_CODE_HEAL: 111,
  BLOCK_CODE_DECAY: 112,
  BLOCK_CODE_SACRIFICE: 113,
  BLOCK_CODE_TAIL_SMOKE: 114,
  BLOCK_CODE_CHEER: 115,
  BLOCK_CODE_CURSE: 116,
  BLOCK_CODE_MELEE_HIT: 101,
  BLOCK_CODE_MELEE_KICK: 120,
  BLOCK_CODE_MELEE_SCRATCH: 117,
  BLOCK_CODE_MELEE_SMASH: 133,
  BLOCK_CODE_MELEE_CLEAVE: 118,
  BLOCK_CODE_MELEE_CHOP: 130,
  BLOCK_CODE_MELEE_PICK: 134,
  BLOCK_CODE_MELEE_STAB: 119,
  BLOCK_CODE_SHOOT_HIT: 122,
  BLOCK_CODE_SHOOT_ARROW: 123,
  BLOCK_CODE_SHOOT_SLUG: 107,
  BLOCK_CODE_SHOOT_MAGNUM: 124,
  BLOCK_CODE_SHOOT_ROCKET: 121,
  BLOCK_CODE_SHOOT_FIRE: 128,
  BLOCK_CODE_SHOOT_SPRAY: 129,
  BLOCK_CODE_SPARK: 125,
  BLOCK_CODE_NOISE: 126,
  BLOCK_CODE_MINE: 127,
  BLOCK_CODE_FIRE: 106,
  BLOCK_CODE_SPRAY: 131,
  BLOCK_CODE_SPARK_SHORT: 132,
  BLOCK_CODE_LIGHT_SMOKE: 135,
  BLOCK_CODE_BLEED_SEVERE: 136,
  BLOCK_CODE_DISINTEGRATE: 137,
  BLOCK_CODE_WAVE: 138,
  BLOCK_CODE_NO_RESOURCE: 1000,
  BLOCK_CODE_BLACK: 1001,
  BLOCK_CODE_WHITE: 1002,
  BLOCK_CODE_TRANSPARENT: 1003,
  BLOCK_CODE_DIRT: 1010,
  BLOCK_CODE_SAND: 1011,
  BLOCK_CODE_GRASS: 1012,
  BLOCK_CODE_SNOW: 1013,
  BLOCK_CODE_SWAMP: 1014,
  BLOCK_CODE_ROUGH: 1015,
  BLOCK_CODE_SUBTERRANEAN: 1016,
  BLOCK_CODE_LAVA: 1017,
  BLOCK_CODE_WATER_SHALLOW: 1018,
  BLOCK_CODE_WATER_MEDIUM: 1019,
  BLOCK_CODE_WATER_DEEP: 1020,
  BLOCK_CODE_EDGE_SAND_UP: 1024,
  BLOCK_CODE_EDGE_SAND_LEFT: 1025,
  BLOCK_CODE_EDGE_SAND_RIGHT: 1026,
  BLOCK_CODE_EDGE_SAND_DOWN: 1027,
  BLOCK_CODE_EDGE_DIRT_UP: 1028,
  BLOCK_CODE_EDGE_DIRT_LEFT: 1029,
  BLOCK_CODE_EDGE_DIRT_RIGHT: 1030,
  BLOCK_CODE_EDGE_DIRT_DOWN: 1031,
  BLOCK_CODE_EDGE_WATER_SHALLOW_UP: 1032,
  BLOCK_CODE_EDGE_WATER_SHALLOW_LEFT: 1033,
  BLOCK_CODE_EDGE_WATER_SHALLOW_RIGHT: 1034,
  BLOCK_CODE_EDGE_WATER_SHALLOW_DOWN: 1035,
  BLOCK_CODE_EDGE_WATER_MEDIUM_UP: 1036,
  BLOCK_CODE_EDGE_WATER_MEDIUM_LEFT: 1037,
  BLOCK_CODE_EDGE_WATER_MEDIUM_RIGHT: 1038,
  BLOCK_CODE_EDGE_WATER_MEDIUM_DOWN: 1039,
  BLOCK_CODE_STONE_FLOOR_1: 1040,
  BLOCK_CODE_STONE_FLOOR_2: 1041,
  BLOCK_CODE_BITUMEN: 1042,
  BLOCK_CODE_WOODEN_FLOOR_1: 1043,
  BLOCK_CODE_WOODEN_FLOOR_2: 1044,
  BLOCK_CODE_BRICK_1: 1100,
  BLOCK_CODE_BRICK_2: 1101,
  BLOCK_CODE_BRICK_3: 1104,
  BLOCK_CODE_BRICK_4: 1105,
  BLOCK_CODE_BRICK_5: 1112,
  BLOCK_CODE_BRICK_6: 1113,
  BLOCK_CODE_BRICK_7: 1114,
  BLOCK_CODE_BRICK_8: 1115,
  BLOCK_CODE_LIME_WALL: 1116,
  BLOCK_CODE_HALF_LIME_WALL: 1123,
  BLOCK_CODE_DOOR_1: 2100,
  BLOCK_CODE_DOOR_2: 2101,
  BLOCK_CODE_DOOR_3: 2102,
  BLOCK_CODE_DOOR_4: 2103,
  BLOCK_CODE_DOOR_5: 2104,
  BLOCK_CODE_DOOR_6: 2105,
  BLOCK_CODE_DOOR_7: 2106,
  BLOCK_CODE_DOOR_8: 2107,
  BLOCK_CODE_DOOR_9: 2108,
  BLOCK_CODE_DOOR_10: 2109,
  BLOCK_CODE_DOOR_11: 2110,
  BLOCK_CODE_DOOR_12: 2111,
  BLOCK_CODE_DOOR_13: 2112,
  BLOCK_CODE_DOOR_14: 2113,
  BLOCK_CODE_DOOR_15: 2114,
  BLOCK_CODE_DOOR_16: 2115,
  BLOCK_CODE_UPSTAIRS_UP: 2200,
  BLOCK_CODE_UPSTAIRS_DOWN: 2201,
  BLOCK_CODE_UPSTAIRS_LEFT: 2202,
  BLOCK_CODE_UPSTAIRS_RIGHT: 2203,
  BLOCK_CODE_DOWNSTAIRS_UP: 2204,
  BLOCK_CODE_DOWNSTAIRS_DOWN: 2205,
  BLOCK_CODE_DOWNSTAIRS_LEFT: 2206,
  BLOCK_CODE_DOWNSTAIRS_RIGHT: 2207,
  BLOCK_CODE_WINDOW_1: 2300,
  BLOCK_CODE_WINDOW_2: 2301,
  BLOCK_CODE_WINDOW_3: 2302,
  BLOCK_CODE_WINDOW_4: 2303,
  BLOCK_CODE_WINDOW_5: 2304,
  BLOCK_CODE_WINDOW_6: 2305,
  BLOCK_CODE_CRACK_1: 2400,
  BLOCK_CODE_CRACK_2: 2401,
  BLOCK_CODE_CRACK_3: 2402,
  BLOCK_CODE_CHEST_CLOSE: 3001,
  BLOCK_CODE_CHEST_OPEN: 3002,
  BLOCK_CODE_SIGN: 3003,
  BLOCK_CODE_COOKER: 3004,
  BLOCK_CODE_SINK: 3005,
  BLOCK_CODE_SINGLE_BED: 3006,
  BLOCK_CODE_DOUBLE_BED: 3007,
  BLOCK_CODE_TOILET: 3008,
  BLOCK_CODE_STOVE: 3009,
  BLOCK_CODE_DRESSER_1: 3010,
  BLOCK_CODE_DRESSER_2: 3011,
  BLOCK_CODE_BENCH: 3012,
  BLOCK_CODE_DESK_1: 3013,
  BLOCK_CODE_DESK_2: 3014,
  BLOCK_CODE_TABLE_1: 3015,
  BLOCK_CODE_TABLE_2: 3016,
  BLOCK_CODE_TABLE_3: 3017,
  BLOCK_CODE_DOCUMENT: 3021,
  BLOCK_CODE_BOX: 3100,
  BLOCK_CODE_ASH_PILE: 3102,
  BLOCK_CODE_WIRE_NETTING: 3103,
  BLOCK_CODE_PLAYER_DEFAULT: 3104,
  BLOCK_CODE_DROP_DEFAULT: 3105,
  BLOCK_CODE_TELEPORT_DEFAULT: 3106,
  BLOCK_CODE_WORKSHOP_EMPTY: 4000,
  BLOCK_CODE_WORKSHOP_CONSTRUCTION: 4001,
  BLOCK_CODE_WORKSHOP_TOOL: 4002,
  BLOCK_CODE_WORKSHOP_AMMO: 4003,
  BLOCK_CODE_WORKSHOP_OUTFIT: 4004,
  BLOCK_CODE_WORKSHOP_CHEM: 4005,
  BLOCK_CODE_WORKSHOP_RECYCLE: 4006,
  BLOCK_CODE_SPEAKER: 4010,
  BLOCK_CODE_FARM: 4100,
  BLOCK_CODE_CROP_1: 4101,
  BLOCK_CODE_CROP_2: 4102,
  BLOCK_CODE_CROP_3: 4103,
  BLOCK_CODE_CROP_0: 4104,
  BLOCK_CODE_ROCK_1: 5100,
  BLOCK_CODE_ROCK_2: 5101,
  BLOCK_CODE_RAFFLESIA: 5102,
  BLOCK_CODE_STUMP: 5103,
  BLOCK_CODE_MOSSY_STUMP: 5104,
  BLOCK_CODE_HOLLOW_TRUNK: 5105,
  BLOCK_CODE_FLOWER_BUSH: 5106,
  BLOCK_CODE_BUSH: 5107,
  BLOCK_CODE_SMALL_FLOWER_1: 5108,
  BLOCK_CODE_SMALL_FLOWER_2: 5109,
  BLOCK_CODE_SMALL_FLOWER_3: 5110,
  BLOCK_CODE_BIG_FLOWER_1: 5111,
  BLOCK_CODE_BIG_FLOWER_2: 5112,
  BLOCK_CODE_BIG_FLOWER_3: 5113,
  BLOCK_CODE_MUSHROOM_1: 5114,
  BLOCK_CODE_MUSHROOM_2: 5115,
  BLOCK_CODE_GRASS_1: 5116,
  BLOCK_CODE_GRASS_2: 5117,
  BLOCK_CODE_GRASS_3: 5118,
  BLOCK_CODE_GRASS_4: 5119,
  BLOCK_CODE_CACTUS_1: 5120,
  BLOCK_CODE_CACTUS_2: 5121,
  BLOCK_CODE_CACTUS_3: 5122,
  BLOCK_CODE_BIG_PINE: 6100,
  BLOCK_CODE_BIG_OAK: 6101,
  BLOCK_CODE_BIG_WITHERED_TREE: 6102,
  BLOCK_CODE_PINE: 6103,
  BLOCK_CODE_OAK: 6104,
  BLOCK_CODE_WITHERED_TREE: 6105,
  BLOCK_CODE_PALM: 6106,

  BLOCK_TYPE_NORMAL: 0,
  BLOCK_TYPE_EFFECT: 1,
  BLOCK_TYPE_PLAYER: 2,
  BLOCK_TYPE_DROP: 3,
  BLOCK_TYPE_TELEPORT: 4,
  BLOCK_TYPE_BED: 5,
  BLOCK_TYPE_TOILET: 6,
  BLOCK_TYPE_DRESSER: 7,
  BLOCK_TYPE_GAME: 9,
  BLOCK_TYPE_STORAGE: 10,
  BLOCK_TYPE_COOKER: 11,
  BLOCK_TYPE_SINK: 12,
  BLOCK_TYPE_CONTAINER: 13,
  BLOCK_TYPE_SPEAKER: 14,
  BLOCK_TYPE_BUILDING: 15,
  BLOCK_TYPE_TREE: 16,
  BLOCK_TYPE_ROCK: 17,
  BLOCK_TYPE_FARM: 18,
  BLOCK_TYPE_WORKSHOP: 20,
  BLOCK_TYPE_WORKSHOP_TOOL: 21,
  BLOCK_TYPE_WORKSHOP_AMMO: 22,
  BLOCK_TYPE_WORKSHOP_OUTFIT: 23,
  BLOCK_TYPE_WORKSHOP_CHEM: 24,
  BLOCK_TYPE_WORKSHOP_RECYCLE: 25,
  BLOCK_TYPE_TRAP: 30,
  BLOCK_TYPE_FLOOR: 31,
  BLOCK_TYPE_FLOOR_DECORATION: 32,
  BLOCK_TYPE_WALL: 33,
  BLOCK_TYPE_WALL_DECORATION: 34,
  BLOCK_TYPE_CEILING: 35,
  BLOCK_TYPE_CEILING_DECORATION: 36,
  BLOCK_TYPE_PLASMA: 37,

  CROP_PERIOD: 250,
  CROP_STATUS_NONE: 0,
  CROP_STATUS_PLANTED: 1,
  CROP_STATUS_MATURE: 2,
  CROP_STATUS_GATHERED: 3,

  STRUCTURE_MATERIAL_NONE: 0,
  STRUCTURE_MATERIAL_ALL: 1,
  STRUCTURE_MATERIAL_SOLID: 2,
  STRUCTURE_MATERIAL_SOLID_FLESH: 3,
  STRUCTURE_MATERIAL_SOLID_NO_FLESH: 4,
  STRUCTURE_MATERIAL_PARTICLE: 10,
  STRUCTURE_MATERIAL_PARTICLE_NO_FLESH: 11,
  STRUCTURE_MATERIAL_TARGET: 20,
  STRUCTURE_MATERIAL_TARGET_FLESH: 21,
  STRUCTURE_SHAPE_TYPE_ROUND: 1,
  STRUCTURE_SHAPE_TYPE_SQUARE: 2,
  STRUCTURE_SHAPE_TYPE_RECTANGLE: 3,
  PLAYER_RADIUS: 0.1,
  MIN_DROP_INTERACTION_DISTANCE: 0.2,

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
  INTERACTION_PACK: 11,
  INTERACTION_PLANT: 12,
  INTERACTION_GATHER: 13,

  ITEM_CHARACTER_TOOL: 't',
  ITEM_CHARACTER_OUTFIT: 'o',
  ITEM_CHARACTER_CONSUMABLE: 'c',
  ITEM_CHARACTER_MATERIAL: 'm',
  ITEM_CHARACTER_JUNK: 'j',
  ITEM_CHARACTER_AMMO: 'a',
  ITEM_CHARACTER_NOTE: 'n',
  ITEM_CHARACTER_RECORDING: 'r',
  RECIPE_CHARACTER_WORKSHOP: 'w',
  RECIPE_CHARACTER_COOKER: 'c',
  RECIPE_CHARACTER_SINK: 's',
  ITEM_NO_OUTFIT_UNDERWEAR: 'o001',
  ITEM_NO_OUTFIT_ZGC_1: 'o002',
  ITEM_NO_OUTFIT_ZGC_2: 'o003',
  ITEM_NO_OUTFIT_SOLDIER: 'o004',
  ITEM_NO_OUTFIT_SUIT_1: 'o005',
  ITEM_NO_OUTFIT_SUIT_2: 'o006',

  FLAG_UPDATE_ITEMS: 1,
  FLAG_UPDATE_INTERACTED_ITEMS: 2,
  FLAG_UPDATE_RECIPES: 3,
  FLAG_UPDATE_MOVEMENT: 4,
  FLAG_LENGTH: 5,

  TERMINAL_TYPE_GAME: 1,
  GAME_TYPE_LAS_VEGAS: 1,

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
  BUFF_CODE_ONE_HIT: 11,
  BUFF_CODE_REALISTIC: 12,
  BUFF_CODE_TROPHY: 13,
  BUFF_CODE_BLOCKED: 14,
  BUFF_CODE_HAPPY: 15,
  BUFF_CODE_SAD: 16,
  BUFF_CODE_RECOVERING: 17,
  BUFF_CODE_OVERWEIGHTED: 18,
  BUFF_CODE_KNOCKED: 19,
  BUFF_CODE_REVIVED: 20,
  BUFF_CODE_LENGTH: 21,

  SKILL_LENGTH: 4,
  SKILL_CODE_BLOCK: 3,
  SKILL_CODE_HEAL: 4,
  SKILL_CODE_CURSE: 5,
  SKILL_CODE_CHEER: 6,
  SKILL_CODE_MELEE_HIT: 10,
  SKILL_CODE_MELEE_KICK: 12,
  SKILL_CODE_MELEE_SCRATCH: 13,
  SKILL_CODE_MELEE_SMASH: 11,
  SKILL_CODE_MELEE_CLEAVE: 14,
  SKILL_CODE_MELEE_CHOP: 33,
  SKILL_CODE_MELEE_PICK: 36,
  SKILL_CODE_MELEE_STAB: 15,
  SKILL_CODE_SHOOT_HIT: 21,
  SKILL_CODE_SHOOT_ARROW: 22,
  SKILL_CODE_SHOOT_GUN: 23,
  SKILL_CODE_SHOOT_SHOTGUN: 24,
  SKILL_CODE_SHOOT_MAGNUM: 25,
  SKILL_CODE_SHOOT_ROCKET: 26,
  SKILL_CODE_SHOOT_FIRE: 27,
  SKILL_CODE_SHOOT_WATER: 28,
  SKILL_CODE_BUILD: 32,
  SKILL_CODE_FISH: 34,
  SKILL_CODE_SHOVEL: 35,
  SKILL_CODE_PLOW: 37,
  SKILL_CODE_LAY_MINE: 41,
  SKILL_CODE_LAY_BARRIER: 42,
  SKILL_CODE_LAY_WIRE_NETTING: 43,

  SKILL_MODE_SEMI_AUTO: 0,
  SKILL_MODE_AUTO: 1,

  PLAYER_TYPE_HUMAN: 0,
  PLAYER_TYPE_NPC: 1,
  CREATURE_TYPE_HUMAN: 1,
  CREATURE_TYPE_ANIMAL: 2,
  FACE_COEFS_LENGTH: 16,
  GENDER_MALE: 1,
  GENDER_FEMALE: 2
}
