import api from '@/lib/api';
import type { ChordRow } from '@/types/chord';

interface ShareSongRequest {
  title: string;
  rows: ChordRow[];
  owner_name: string;
}

interface ShareSongResponse {
  success: boolean;
  share_id: string;
  url: string;
}

interface SharedSongResponse {
  success: boolean;
  song: {
    id: string;
    title: string;
    rows: ChordRow[];
    owner: string;
    created_at: string;
  };
}

export const shareService = {
  /**
   * Share a song to the backend
   */
  async shareSong(data: ShareSongRequest): Promise<ShareSongResponse> {
    const response = await api.post<ShareSongResponse>('/api/share', data);
    return response.data;
  },

  /**
   * Get a shared song by share ID
   */
  async getSharedSong(shareId: string): Promise<SharedSongResponse> {
    const response = await api.get<SharedSongResponse>(`/api/share/${shareId}`);
    return response.data;
  },
};
