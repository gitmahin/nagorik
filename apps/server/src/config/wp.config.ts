import "dotenv/config"

type WpConfigType = {
    FB_WP_VERIFY_TOKEN: string
}

export const wpConfig: WpConfigType = {
    FB_WP_VERIFY_TOKEN: process.env.FB_WP_VERIFY_TOKEN!
}