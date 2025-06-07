// https://www.home-assistant.io/integrations/media_player/
export enum MediaPlayerDeviceClass {
  Tv = "tv",
  Speaker = "speaker",
  Receiver = "receiver",
}

export enum MediaPlayerDeviceFeature {
  PAUSE = 1,
  SEEK = 2,
  VOLUME_SET = 4,
  VOLUME_MUTE = 8,
  PREVIOUS_TRACK = 16,
  NEXT_TRACK = 32,
  TURN_ON = 128,
  TURN_OFF = 256,
  PLAY_MEDIA = 512,
  VOLUME_STEP = 1024,
  SELECT_SOURCE = 2048,
  STOP = 4096,
  CLEAR_PLAYLIST = 8192,
  PLAY = 16384,
  SHUFFLE_SET = 32768,
  SELECT_SOUND_MODE = 65536,
  BROWSE_MEDIA = 131072,
  REPEAT_SET = 262144,
  GROUPING = 524288,
  MEDIA_ANNOUNCE = 1048576,
  MEDIA_ENQUEUE = 2097152,
}

export interface MediaPlayerDeviceAttributes {
  device_class?: MediaPlayerDeviceClass;
  volume_level?: number;
  is_volume_muted?: boolean;
  source?: string;
  source_list?: string[];
  supported_features?: number;
}
