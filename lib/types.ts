export interface Link {
  id: number;
  code: string;
  target_url: string;
  total_clicks: number;
  last_clicked_at: string | null;
  created_at: string;
}

export interface CreateLinkRequest {
  target_url: string;
  code?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  link?: Link;
  error?: string;
}
