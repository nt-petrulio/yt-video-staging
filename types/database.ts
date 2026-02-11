export type WorkflowType = 'semi-auto' | 'full-auto' | 'empire';

export type VideoStatus = 
  | 'idea'
  | 'script'
  | 'voiceover'
  | 'video'
  | 'thumbnail'
  | 'ready'
  | 'uploaded'
  | 'rejected';

export interface Video {
  id: string;
  user_id: string;
  workflow_type: WorkflowType;
  status: VideoStatus;
  title: string | null;
  script: string | null;
  description: string | null;
  tags: string[];
  voiceover_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  youtube_video_id: string | null;
  channel_id: string | null;
  scheduled_at: string | null;
  uploaded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  id: string;
  user_id: string;
  name: string;
  youtube_channel_id: string | null;
  workflow_type: WorkflowType;
  auto_upload: boolean;
  upload_schedule: {
    time: string;
    timezone: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      videos: {
        Row: Video;
        Insert: Omit<Video, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Video, 'id' | 'created_at' | 'updated_at'>>;
      };
      channels: {
        Row: Channel;
        Insert: Omit<Channel, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Channel, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
