export interface Post {
    in_reply_to_status_id?: string;
    auto_populate_reply_metadata?: boolean;
    status: string;
    exclude_reply_user_ids?: string[];
    attachment_url?: string;
    media_ids?: string[];
    possibly_sensitive?: boolean;
    lat?: number;
    long?: number;
    place_id?: string;
    display_coordinates?: boolean;
    trim_user?: boolean;
    card_uri?: string;
}
