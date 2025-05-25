export interface User {
  id: number;
  username: string;
  email: string;
  profile_picture_url: string;
  is_admin: boolean;
}

export interface userDataProps {
  email: string;
  password: string;
  username: string;
}

export interface credentialsProps {
  email: string;
  password: string;
}

export interface GetCurrentUserResponse {
  user: User;
}

export interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  username: string;
}

export interface CloudinaryAudioResource {
  access_control: null;
  access_mode: string;
  asset_folder: string;
  asset_id: string;
  backup_bytes: number;
  bytes: number;
  created_at: string;
  created_by: {
    access_key: string;
  };
  display_name: string;
  duration: number;
  etag: string;
  filename: string;
  format: string;
  height: number;
  pages: number;
  public_id: string;
  resource_type: string;
  secure_url: string;
  status: string;
  type: string;
  uploaded_at: string;
  uploaded_by: {
    access_key: string;
  };
  url: string;
  version: number;
  width: number;
}

export interface GetVoicesResponse {
  success: boolean;
  audios: CloudinaryAudioResource[];
}
